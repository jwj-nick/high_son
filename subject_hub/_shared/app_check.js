/* app_check.js — 단원 앱·허브 공용 게이트 (Node)
 *   node _shared/app_check.js <app.html> [--links <dir1,dir2,...>]
 *
 * 검사: ① 인라인 <script> 파싱 ② $…$ 안 한글 · $ 짝 ③ '<'+알파벳 잘림 · 수식 안 <> 뒤 알파벳
 *       ④ 태그 균형 ⑤ #앵커 실존 ⑥ 상대 링크 대상 실존(--links 디렉토리들에서 찾음, 없으면 경고)
 *       ⑦ var QUIZ=[…] 가 있으면 보기 4개·중복 없음·a 유효·(t가 있으면) TABNAME 키 존재
 */
const fs = require('fs'), path = require('path');
const args = process.argv.slice(2); const file = args[0];
if (!file) { console.error('usage: node app_check.js <file.html> [--links dir1,dir2]'); process.exit(2); }
const li = args.indexOf('--links'); const linkDirs = li >= 0 ? args[li + 1].split(',') : [path.dirname(file)];
const html = fs.readFileSync(file, 'utf8');
let bad = 0, warn = 0; const log = (...a) => console.log(...a);
const fail = (...a) => { bad++; console.log('✗', ...a); };
const warnf = (...a) => { warn++; console.log('△', ...a); };
const mathSegs = t => t.replace(/\$\$[\s\S]*?\$\$/g, ' ').split('$').filter((_, i) => i % 2 === 1);
const korInMath = t => mathSegs(t).filter(s => /[가-힣]/.test(s.replace(/\\text\{[^}]*\}/g, '')));
const CUT = /<[a-zA-Z](?=[^a-zA-Z0-9>\s\/])/;
const MATHCUT = /[<>](?=[a-zA-Z\\])/;

// ① 인라인 스크립트
const scripts = [...html.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/g)].filter(m => !/src=/.test(m[0]));
scripts.forEach((m, i) => { try { new Function(m[1]); } catch (e) { fail('script#' + i + ' 파싱 오류:', e.message); } });
const jsAll = scripts.map(m => m[1]).join('\n');

// ②③ 본문
const body = html.replace(/<script[\s\S]*?<\/script>/g, '').replace(/<style[\s\S]*?<\/style>/g, '');
const kor = korInMath(body); if (kor.length) fail('$…$ 안 한글 ' + kor.length + '건:', kor.slice(0, 3).join(' | '));
const dollars = (body.replace(/\$\$/g, '').match(/\$/g) || []).length; if (dollars % 2) fail('$ 짝이 안 맞음 (' + dollars + '개)');
const cut2 = body.match(new RegExp('[^<\\/]' + CUT.source, 'g')); if (cut2) fail("'<'+알파벳 잘림 의심:", cut2.slice(0, 3));
const mcut = mathSegs(body).filter(s => MATHCUT.test(s)); if (mcut.length) fail('수식 안 <,> 뒤 알파벳(\\lt \\gt 로) ' + mcut.length + '건:', mcut.slice(0, 3).join(' | '));
// JS 문자열 안의 $…$ 도 검사(innerHTML로 들어가는 해설·라벨)
const jsKor = korInMath(jsAll.replace(/\/\*[\s\S]*?\*\//g, '')); if (jsKor.length) warnf('JS 문자열 수식 안 한글 ' + jsKor.length + '건:', jsKor.slice(0, 2).join(' | '));
// JS 문자열 리터럴이 innerHTML로 들어갈 때 '<'+알파벳(태그 오인)으로 잘리는 것 — 실제 태그(<b>, <br>, <span …>)는 제외
const strip = t => t.replace(/<\/?[a-zA-Z][a-zA-Z0-9]*(\s[^<>]*)?\/?>/g, '');
const litHits = [...jsAll.replace(/\/\*[\s\S]*?\*\//g, '').matchAll(/'(?:[^'\\\n]|\\.)*'|"(?:[^"\\\n]|\\.)*"/g)].map(m => m[0].slice(1, -1)).filter(l => CUT.test(strip(l)) || /<[a-zA-Z](?=\s*[$)\]}])/.test(strip(l)));
if (litHits.length) fail("JS 문자열 innerHTML '<'+알파벳 잘림 " + litHits.length + '건:', litHits.slice(0, 3).map(s => s.slice(0, 70)));

// ④ 태그 균형
['div', 'section', 'span', 'a', 'p', 'b', 'button', 'table', 'tr', 'td', 'th', 'ul', 'ol', 'li', 'svg', 'g', 'h1', 'h2', 'h3', 'h4', 'small', 'label', 'nav', 'i', 'sup', 'sub', 'code', 'canvas'].forEach(t => {
  const o = (body.match(new RegExp('<' + t + '[ >]', 'g')) || []).length, c = (body.match(new RegExp('</' + t + '>', 'g')) || []).length;
  if (o !== c) fail('태그 불균형', t, o, c);
});

// ⑤⑥ 앵커·링크
const ids = new Set([...html.matchAll(/\sid="([^"]+)"/g)].map(m => m[1]));
[...html.matchAll(/href="#([^"]+)"/g)].map(m => m[1]).forEach(a => { if (!ids.has(a)) fail('앵커 없음 #' + a); });
const hrefs = [...body.matchAll(/href="([^"#]+)"/g)].map(m => m[1]).filter(h => !/^(https?:|mailto:)/.test(h));
const missing = hrefs.filter(h => !linkDirs.some(d => fs.existsSync(path.join(d, h))));
if (missing.length) warnf('링크 대상 미존재(아직 안 만든 파일이면 정상):', [...new Set(missing)].join(', '));

// ⑦ QUIZ
const qm = jsAll.match(/var QUIZ\s*=\s*(\[[\s\S]*?\]);\s*\n/);
if (qm) {
  let Q = null; try { Q = new Function('return ' + qm[1])(); } catch (e) { fail('QUIZ 파싱 오류:', e.message); }
  if (Q) {
    const tn = jsAll.match(/var TABNAME\s*=\s*(\{[\s\S]*?\});/); let TN = null; if (tn) { try { TN = new Function('return ' + tn[1])(); } catch (e) { } }
    Q.forEach((q, i) => {
      if (!q.q || !Array.isArray(q.o) || q.o.length !== 4) fail('QUIZ#' + (i + 1) + ' 보기 4개 아님');
      else if (new Set(q.o).size !== 4) fail('QUIZ#' + (i + 1) + ' 보기 중복:', q.o.join(' | '));
      if (!Number.isInteger(q.a) || q.a < 0 || q.a > 3) fail('QUIZ#' + (i + 1) + ' 정답 인덱스 이상');
      if (!q.e) warnf('QUIZ#' + (i + 1) + ' 해설 없음');
      [q.q, q.e].concat(q.o || []).forEach(t => { if (typeof t === 'string' && CUT.test(strip(t))) fail('QUIZ#' + (i + 1) + " 문자열 '<'+알파벳 잘림:", t.slice(0, 60)); });
      if (q.t && TN && !(q.t in TN)) fail('QUIZ#' + (i + 1) + ' 고치는 곳 탭 없음:', q.t);
      if (q.t && !new RegExp('data-t="' + q.t + '"').test(html)) fail('QUIZ#' + (i + 1) + ' data-t 탭 없음:', q.t);
    });
    log('✓ QUIZ', Q.length + '문항', TN ? '(고치는 곳 매핑 있음)' : '');
  }
}
log(bad ? ('FAIL ' + bad) : 'ALL OK', warn ? ('· 경고 ' + warn) : '', '·', path.basename(file), (html.length / 1024).toFixed(1) + 'KB');
process.exit(bad ? 1 : 0);
