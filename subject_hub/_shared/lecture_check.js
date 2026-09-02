/* lecture_check.js — 관문 특강 게이트 (Node)
 *   node _shared/lecture_check.js <특강.html> [반복수=500]
 *
 * 검사: ① 인라인 <script> 전부 파싱(new Function) ② <script id="gen"> 생성기를 Node에서 N회 실행해
 *       형식(q·steps·ans|choices)과 verify(p)==true 확인 + 답 다양성 + 생성 문자열 '<'+알파벳 잘림
 *       ③ $…$ 안 한글 ④ '<'+알파벳 잘림 ⑤ 수식 안 <,> 뒤 알파벳(브라우저가 태그로 오인 → \lt \gt 로)
 *       ⑥ 태그 균형 ⑦ 앵커(#id) 실존 ⑧ data-step 섹션 5개 이상
 */
const fs = require('fs'), path = require('path');
const file = process.argv[2]; const N = parseInt(process.argv[3] || '500', 10);
if (!file) { console.error('usage: node lecture_check.js <file.html> [N]'); process.exit(2); }
const html = fs.readFileSync(file, 'utf8');
let bad = 0; const log = (...a) => { console.log(...a); };
const fail = (...a) => { bad++; console.log('✗', ...a); };

// $…$ 안(홀수 구간)만 뽑기 — $$…$$ 는 먼저 제거. \text{…} 안의 한글은 허용
const mathSegs = t => t.replace(/\$\$[\s\S]*?\$\$/g, ' ').split('$').filter((_, i) => i % 2 === 1);
const korInMath = t => mathSegs(t).filter(seg => /[가-힣]/.test(seg.replace(/\\text\{[^}]*\}/g, '')));
// '<' 뒤에 알파벳이 오고 그 다음이 태그가 될 수 없는 문자(예: <r$, <x=)면 innerHTML에서 잘린다
const CUT = /<[a-zA-Z](?=[^a-zA-Z0-9>\s\/])/;
// 수식 안에서 < 또는 > 바로 뒤에 알파벳·백슬래시가 오면 HTML 태그로 오인된다 (x<b, <\alpha, a>b)
const MATHCUT = /[<>](?=[a-zA-Z\\])/;

// ① 인라인 스크립트 파싱
const scripts = [...html.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/g)].filter(m => !/src=/.test(m[0]));
scripts.forEach((m, i) => { try { new Function(m[1]); } catch (e) { fail('script#' + i + ' 파싱 오류:', e.message); } });

// ② 생성기 재검산
const genM = html.match(/<script id="gen">([\s\S]*?)<\/script>/);
if (!genM) fail('<script id="gen"> 없음');
else {
  const LEC = require(path.join(__dirname, 'lecture.js'));
  const win = { GEN: null, LEC };
  try { new Function('window', 'LEC', genM[1])(win, LEC); } catch (e) { fail('gen 실행 오류:', e.message); }
  const GEN = win.GEN;
  if (!GEN) fail('window.GEN 미정의');
  else Object.keys(GEN).forEach(id => {
    const spec = GEN[id]; const answers = new Set(); let vfail = 0, ffail = 0;
    for (let i = 0; i < N; i++) {
      let p; try { p = spec.gen(); } catch (e) { ffail++; if (ffail === 1) log('   gen 예외', id, e.message); continue; }
      const okShape = p && typeof p.q === 'string' && Array.isArray(p.steps) && p.steps.length > 0 &&
        ((typeof p.ans === 'number' && isFinite(p.ans) && !p.choices) || (Array.isArray(p.choices) && Number.isInteger(p.ans) && p.ans >= 0 && p.ans < p.choices.length));
      if (!okShape) { ffail++; if (ffail === 1) log('   형식 오류 샘플', id, JSON.stringify(p).slice(0, 200)); continue; }
      const txt = p.q + ' ' + p.steps.join(' ') + ' ' + (p.choices || []).join(' ');
      const kim = korInMath(txt);
      if (kim.length) { ffail++; if (ffail === 1) log('   $…$ 안 한글', id, kim[0].slice(0, 120)); continue; }
      const cutg = txt.match(CUT);
      if (cutg) { ffail++; if (ffail === 1) log("   생성 문자열 '<'+알파벳 잘림", id, txt.slice(Math.max(0, cutg.index - 30), cutg.index + 30)); continue; }
      const mcg = mathSegs(txt).filter(s => MATHCUT.test(s));
      if (mcg.length) { ffail++; if (ffail === 1) log('   생성 수식 안 <,> 뒤 알파벳(\\lt \\gt 로)', id, mcg[0].slice(0, 80)); continue; }
      if (p.choices && new Set(p.choices).size !== p.choices.length) { ffail++; if (ffail === 1) log('   보기 중복', id, p.choices.join(' | ')); continue; }
      if (spec.verify) { let v = false; try { v = spec.verify(p) === true; } catch (e) { } if (!v) { vfail++; if (vfail === 1) log('   verify 실패 샘플', id, JSON.stringify({ q: p.q.slice(0, 160), ans: p.ans, choices: p.choices })); } }
      answers.add(p.choices ? p.choices[p.ans] : p.ans);
    }
    const uniq = answers.size;
    if (ffail || vfail) fail(id, '형식 실패', ffail, '/ verify 실패', vfail, '/', N);
    else log('✓', id, 'N=' + N, 'verify=' + (spec.verify ? 'on' : 'off'), '답 다양성', uniq, spec.label ? '(' + spec.label + ')' : '');
    if (uniq < 3) fail(id, '답 다양성 부족(' + uniq + ')');
  });
}

// ③ KaTeX 한글 · ④ 잘림 · ⑤ 수식 안 <> · ⑥ 태그 균형 · ⑦ 앵커 · ⑧ 단계
const body = html.replace(/<script[\s\S]*?<\/script>/g, '');
const kor = korInMath(body);
if (kor.length) fail('$…$ 안 한글 ' + kor.length + '건:', kor.slice(0, 3).join(' | '));
const cut2 = body.match(new RegExp('[^<\\/]' + CUT.source, 'g'));
if (cut2 && cut2.length) fail("'<'+알파벳 잘림 의심:", cut2.slice(0, 3));
const mcut = mathSegs(body).filter(s => MATHCUT.test(s));
if (mcut.length) fail('$…$ 안 <,> 뒤 알파벳(태그 오인 → \\lt \\gt 로) ' + mcut.length + '건:', mcut.slice(0, 3).join(' | '));
['div', 'section', 'span', 'a', 'p', 'b', 'button', 'table', 'tr', 'td', 'th', 'ul', 'ol', 'li', 'svg', 'g', 'h1', 'h2', 'h3', 'h4', 'small', 'label', 'nav', 'i', 'sup', 'sub', 'code'].forEach(t => {
  const o = (body.match(new RegExp('<' + t + '[ >]', 'g')) || []).length, c = (body.match(new RegExp('</' + t + '>', 'g')) || []).length;
  if (o !== c) fail('태그 불균형', t, o, c);
});
const ids = new Set([...html.matchAll(/\sid="([^"]+)"/g)].map(m => m[1]));
[...html.matchAll(/href="#([^"]+)"/g)].map(m => m[1]).forEach(a => { if (!ids.has(a)) fail('앵커 없음 #' + a); });
[...html.matchAll(/anchor:\s*'#([^']+)'/g)].map(m => m[1]).forEach(a => { if (!ids.has(a)) fail('GEN anchor 없음 #' + a); });
const steps = (html.match(/data-step="/g) || []).length; if (steps < 5) fail('data-step 섹션 ' + steps + '개(5 이상 필요)');
log(bad ? ('FAIL ' + bad) : 'ALL OK', '·', path.basename(file), (html.length / 1024).toFixed(1) + 'KB');
process.exit(bad ? 1 : 0);
