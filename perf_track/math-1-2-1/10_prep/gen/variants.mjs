// variants.mjs — core.js를 Node에서 실행하는 러너
//   node variants.mjs verify          예시문항 + 고정 10세트 + 무작위 300세트 수치 검산 (게이트 1)
//   node variants.mjs search          고정 세트 후보 탐색(스펙별 첫 유효 파라미터 출력)
//   node variants.mjs docs            10_prep/02_answer_templates.md 생성
//   node variants.mjs bank            10_prep/03_variant_bank.md 생성
//   node variants.mjs print           90_output/print_pack.html 생성
//   node variants.mjs build           앱 HTML의 마커 사이에 core.js 인라인
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, '..', '..');
const coreSrc = fs.readFileSync(path.join(here, 'core.js'), 'utf8');
const VG = new Function(coreSrc + '\nreturn VG;')();
const today = new Date().toISOString().slice(0, 10);
const mode = process.argv[2] || 'verify';

function fail(msg) { console.error('✗ ' + msg); process.exitCode = 1; }

if (mode === 'verify') {
  let n = 0, bad = 0;
  const check = (label, sol) => { n++; const e = VG.verifyAny(sol); if (e.length) { bad++; fail(label + ': ' + e.join(' / ')); } };
  check('예시 1번', VG.solveT1(VG.SAMPLE_T1));
  check('예시 2번', VG.solveT2(VG.SAMPLE_T2));
  const s1 = VG.solveT1(VG.SAMPLE_T1), s2 = VG.solveT2(VG.SAMPLE_T2);
  const exp1 = ['(x − 2)² + (y − 1)² = 9', '3/4', '−3/4', '1/5', '17/5', '40'];
  const got1 = [s1.answers.circle, s1.answers.m1.s(), s1.answers.m2.s(), s1.answers.P[0].s(), s1.answers.P[1].s(), s1.answers.real.s()];
  exp1.forEach((v, i) => { if (got1[i] !== v) fail('예시 1번 기대값 불일치 ' + v + ' vs ' + got1[i]); });
  if (s2.answers.ans !== 9) fail('예시 2번 기대값 9 vs ' + s2.answers.ans);
  for (const st of VG.FIXED_SETS) check('고정 ' + st.id, VG.solveAny(st.type, st.p));
  const rng = VG.mulberry32(20260917);
  for (let i = 0; i < 150; i++) check('random T1 #' + i, VG.solveT1(VG.genT1(rng)));
  for (let i = 0; i < 150; i++) check('random T2 #' + i, VG.solveT2(VG.genT2(rng)));
  for (let i = 0; i < 30; i++) check('random T2 fixedA #' + i, VG.solveT2(VG.genT2(rng, { fixedA: true })));
  console.log(`검산 ${n}건, 실패 ${bad}건`);
}

if (mode === 'search') {
  const specs = [
    { id: 'V5', L1: 'xaxis', L2: 'yx', seed: 5, D: 13 },
    { id: 'V6', L1: 'yaxis', L2: 'yx', seed: 6, D: 5 },
    { id: 'V7', L1: 'yaxis', L2: 'xaxis', seed: 7, D: 17 },
    { id: 'V8', L1: 'yx', L2: 'yaxis', seed: 8, r1: 3, r2: 1, D: 13 },
    { id: 'V9', L1: 'yx', L2: 'xaxis', seed: 9, D: 10 },
    { id: 'V10', L1: 'xaxis', L2: 'yx', seed: 10, fixedA: true, D: 5 }
  ];
  for (const sp of specs) {
    const rng = VG.mulberry32(sp.seed * 7919);
    // 후보 여러 개 뽑아 가장 "보기 좋은" 것(좌표 절댓값 합이 작은 것) 선택
    const cands = [];
    for (let k = 0; k < 400 && cands.length < 60; k++) { try { const p = VG.genT2(rng, sp); if (!sp.D || VG.solveT2(p).answers.D === sp.D) cands.push(p); } catch (e) { } }
    if (!cands.length) { console.log(sp.id, '후보 없음'); continue; }
    cands.sort((a, b) => (Math.abs(a.c1[0]) + Math.abs(a.c1[1]) + Math.abs(a.c2[0]) + Math.abs(a.c2[1])) - (Math.abs(b.c1[0]) + Math.abs(b.c1[1]) + Math.abs(b.c2[0]) + Math.abs(b.c2[1])));
    const p = cands[0]; const sol = VG.solveT2(p);
    console.log(sp.id, JSON.stringify({ c1: p.c1, r1: p.r1, c2: p.c2, r2: p.r2, L1: p.L1, L2: p.L2 }), '→', sol.brief.join(' | '), 'order', sol.answers.orderOK, 'verify', VG.verifyT2(sol).join(';') || 'ok');
  }
}

function bankMd() {
  const lines = [];
  lines.push('# 03_variant_bank — 변형 문제 은행 (생성기 출력, 검산 완료)');
  lines.push('');
  lines.push(`> \`gen/core.js\`의 FIXED_SETS 10세트를 \`node variants.mjs bank\`로 뽑은 것(${today}). 손으로 고치지 않는다 — 숫자를 바꾸려면 core.js의 FIXED_SETS를 고치고 다시 생성한다. 각 세트는 \`node variants.mjs verify\`에서 무차별 탐색으로 재검산된다.`);
  lines.push('> V1~V4 = 1번형, V5~V8 = 2번형, V9·V10 = 함정 변형. 프린트 팩·앱 🖨️ 탭의 3·4절과 같은 내용.');
  lines.push('');
  lines.push('| ID | 유형 | 태그 | 정답 요약 |');
  lines.push('|---|---|---|---|');
  const sols = VG.FIXED_SETS.map(st => { const s = VG.solveAny(st.type, st.p); s.id = st.id; s.tag = st.tag; return s; });
  for (const s of sols) lines.push(`| ${s.id} | ${s.type}번형 | ${s.tag} | ${s.brief.join(' · ')} |`);
  lines.push('');
  for (const s of sols) {
    lines.push(`---\n\n## ${s.id} — ${s.tag}\n`);
    lines.push(`**${s.problem.title}**\n`);
    lines.push('> ' + s.problem.intro + '\n');
    for (const q of s.problem.q) lines.push(q.split('\n').map(l => '- ' + l).join('\n'));
    lines.push('\n### 풀이\n');
    for (const st of s.steps) {
      lines.push(`**${st.title}**${st.optional ? ' _(선택)_' : ''}`);
      for (const ln of st.lines) lines.push('- ' + ln);
      lines.push('');
    }
  }
  return lines.join('\n') + '\n';
}

function docsMd() {
  const t = [];
  t.push('# 02_answer_templates — 만점 답안 골격 (▢에 숫자만 갈아끼운다)');
  t.push('');
  t.push(`> \`gen/core.js\`의 TEMPLATES를 \`node variants.mjs docs\`로 뽑은 것(${today}). 프린트 팩 2절·앱 ✍️ 탭과 같은 내용. 손으로 고치지 않는다 — core.js를 고치고 다시 생성한다.`);
  t.push('> 쓰는 순서가 곧 점수다. 각 줄은 **완전한 문장**으로 쓰고, 굵은 글씨는 채점자가 찾는 근거 문장이다.');
  t.push('');
  t.push('## 카드 ① 1번형 — 원 밖의 점에서 그은 접선');
  t.push('');
  for (const b of VG.TEMPLATES.t1) { t.push(`### ${b.h}`); for (const l of b.t) t.push('- ' + l); t.push(''); }
  t.push('## 카드 ② 2번형 — 두 직선을 차례로 거치는 최단 경로 (대칭이동)');
  t.push('');
  for (const b of VG.TEMPLATES.t2) { t.push(`### ${b.h}`); for (const l of b.t) t.push('- ' + l); t.push(''); }
  t.push('대칭 규칙표: x축 (x, y)→(x, −y) · y축 (x, y)→(−x, y) · y = x (x, y)→(y, x) · y = −x (x, y)→(−y, −x)');
  t.push('');
  t.push('## 근거 문장 뱅크 (감점을 막는 문장들)');
  t.push('');
  const bank = [
    '직선이 원에 접하려면 원의 중심에서 직선까지의 거리가 반지름의 길이와 같아야 한다.',
    '접점에서 반지름과 접선은 서로 수직이다. 따라서 접점은 중심에서 접선에 내린 수선의 발이다.',
    '접하므로 이차방정식은 중근을 갖는다.',
    '점 P가 직선 l 위의 점이고 l은 선분 AA′의 수직이등분선이므로 AP = A′P 이다.',
    '두 점을 잇는 가장 짧은 길은 선분이므로 A′P + PQ + QB′ ≥ A′B′ 이고, 등호는 네 점이 한 직선 위에 있을 때 성립한다.',
    '원을 대칭이동하면 중심은 대칭이동하고 반지름의 길이는 변하지 않는다.',
    '두 원이 서로 밖에 있을 때 두 원 위의 점 사이 거리의 최솟값은 (중심 사이 거리) − (두 반지름의 합) 이다.',
    '한 눈금의 실제 길이가 k m이므로 실제 길이는 (좌표평면에서의 길이) × k m 이다.'
  ];
  for (const b of bank) t.push('- ' + b);
  t.push('');
  t.push('## 함정 체크리스트');
  t.push('');
  for (const p of VG.PITFALLS) t.push(`- **${p.k}** — ${p.t}`);
  t.push('');
  t.push('## 검산 루틴 (1분)');
  t.push('');
  VG.CHECKS.forEach((c, i) => t.push(`${i + 1}. ${c}`));
  t.push('');
  t.push('## 시험 당일 시간 배분 (50분 가정)');
  t.push('');
  t.push('| 구간 | 시간 | 내용 |'); t.push('|---|---|---|');
  for (const r of VG.TIMEPLAN) t.push(`| ${r[0]} | ${r[1]} | ${r[2]} |`);
  return { t: t.join('\n') + '\n' };
}

if (mode === 'docs') {
  const d = docsMd();
  fs.writeFileSync(path.join(root, '10_prep', '02_answer_templates.md'), d.t, 'utf8');
  console.log('wrote 02_answer_templates.md');
}

if (mode === 'bank') {
  const out = path.join(root, '10_prep', '03_variant_bank.md');
  fs.writeFileSync(out, bankMd(), 'utf8');
  console.log('wrote', out);
}

function printPackHtml() {
  const body = VG.renderPrintPack({ date: today });
  return `<!DOCTYPE html>
<html lang="ko">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>공통수학2 수행평가 준비 팩 — 원의 접선 · 대칭이동 최단 경로</title>
<style>
body{margin:0;padding:16px;background:#fff}
${VG.PRINT_CSS}
.pp-toolbar{position:sticky;top:0;background:#fff;border-bottom:1px solid #ddd;padding:8px 0;margin-bottom:10px;display:flex;gap:8px;align-items:center;flex-wrap:wrap}
.pp-toolbar button,.pp-toolbar a{min-height:44px;padding:8px 16px;border:1px solid #333;background:#111;color:#fff;border-radius:8px;font-size:14px;cursor:pointer;text-decoration:none;display:inline-flex;align-items:center}
.pp-toolbar a{background:#fff;color:#111}
@media print{.pp-toolbar{display:none}body{padding:0}}
@page{margin:14mm}
</style>
</head>
<body>
<div class="pp-toolbar"><button onclick="window.print()">🖨️ 인쇄 / PDF로 저장</button><a href="2sem_perf_circle_path.html">← 앱으로</a><span style="font-size:12px;color:#666">브라우저 인쇄 창에서 "PDF로 저장"을 고르면 파일로 내려받을 수 있다.</span></div>
${body}
</body>
</html>
`;
}

if (mode === 'print') {
  const out = path.join(root, '90_output', 'print_pack.html');
  fs.mkdirSync(path.dirname(out), { recursive: true });
  fs.writeFileSync(out, printPackHtml(), 'utf8');
  console.log('wrote', out, fs.statSync(out).size, 'bytes');
}

if (mode === 'build') {
  const app = path.join(root, '10_prep', 'app', 'perf_circle_path.html');
  let html = fs.readFileSync(app, 'utf8');
  const a = html.indexOf('/* @core */'), b = html.indexOf('/* /@core */');
  if (a < 0 || b < 0) { fail('마커 없음'); } else {
    html = html.slice(0, a) + '/* @core */\n' + coreSrc + '\n' + html.slice(b);
    fs.writeFileSync(app, html, 'utf8');
    console.log('inlined core.js →', app, fs.statSync(app).size, 'bytes');
  }
}
