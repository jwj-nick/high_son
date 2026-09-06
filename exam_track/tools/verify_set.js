#!/usr/bin/env node
/* verify_set.js — 문제은행 세트의 정답키를 **문항 텍스트와 무관하게** 다시 계산해 정답 보기 문구와 대조한다.
 *
 * 왜 필요한가
 *   기계 검사(check_bank.py)는 구조만 보고, 검증 게이트(Opus)는 사람처럼 읽는다. 그 사이에
 *   "정답키가 계산으로 맞는가"를 코드로 못 박는 층이 없었다. 수학·과학 계산 문항은 이 층이 가장 싸고 확실하다.
 *   (2026-09-05 mat2_01~04: 출제 직후 48/48 일치 확인 → 게이트는 why·cause 층에 집중할 수 있었다.)
 *
 * 사용
 *   node exam_track/tools/verify_set.js mat2_01 mat2_02        # 세트별 검산 파일 실행
 *   검산 파일 = exam_track/problem_bank/verify/<set>.js  (module.exports = function ({S, chk, ...helpers}) { ... })
 *   - chk(n, expectText, note): n번 문항(1-based)의 정답 보기 문구가 expectText와 같은지. expectText는 계산 결과에서 만든다.
 *   - 12문항 전부를 chk하지 않으면 "미검산"으로 실패 처리한다(전수 검산 강제).
 *   - 집합·경우의 수는 brute force로, 좌표·거리·접선은 공식과 다른 경로(대입·수치 탐색)로 교차 검산한다.
 *
 * 헬퍼: near(a,b,eps) · dist(p,q) · gcd · lcm · subsets(n, fn(mask)) · has(mask,i) · solveLinear2(a,b,c,d,e,f) → [x,y] (ax+by=c, dx+ey=f)
 */
const fs = require('fs'), path = require('path');
const ROOT = path.resolve(__dirname, '..', '..');
const DATA = path.join(ROOT, 'exam_track', 'problem_bank', 'data');
const VER = path.join(ROOT, 'exam_track', 'problem_bank', 'verify');

function load(id) { const s = fs.readFileSync(path.join(DATA, id + '.js'), 'utf8'); return JSON.parse(s.slice(s.indexOf('{'), s.lastIndexOf('}') + 1)); }
const H = {
  near: (a, b, eps) => Math.abs(a - b) < (eps || 1e-9),
  dist: (p, q) => Math.hypot(p[0] - q[0], p[1] - q[1]),
  gcd: (a, b) => (b ? H.gcd(b, a % b) : a),
  lcm: (a, b) => a * b / H.gcd(a, b),
  subsets: (n, fn) => { for (let m = 0; m < (1 << n); m++) fn(m); },
  has: (m, i) => !!(m & (1 << i)),
  solveLinear2: (a, b, c, d, e, f) => { const D = a * e - b * d; return [(c * e - b * f) / D, (a * f - c * d) / D]; },
};

const ids = process.argv.slice(2);
if (!ids.length) { console.log('사용: node exam_track/tools/verify_set.js <set> [<set>...]'); process.exit(2); }
let bad = 0;
for (const id of ids) {
  const S = load(id); const vf = path.join(VER, id + '.js');
  if (!fs.existsSync(vf)) { console.log('✗ 검산 파일 없음: ' + path.relative(ROOT, vf) + ' — 세트마다 만들어야 한다'); bad++; continue; }
  let p = 0, f = 0; const seen = new Set();
  const chk = (n, expect, note) => {
    const it = S.items[n - 1]; if (!it) { console.log('FAIL ' + id + ' 문항 ' + n + ' 없음'); f++; return; }
    seen.add(n); const ans = it.o[it.a].t; const ok = ans === expect; ok ? p++ : f++;
    console.log((ok ? 'PASS ' : 'FAIL ') + it.id + '  정답보기="' + ans + '"' + (ok ? '' : '  기대="' + expect + '"') + (note ? '  · ' + note : ''));
  };
  require(vf)(Object.assign({ S, chk }, H));
  const missing = S.items.map((_, i) => i + 1).filter(n => !seen.has(n));
  if (missing.length) console.log('⚠ 미검산 문항: ' + missing.map(n => S.items[n - 1].id).join(', '));
  console.log('== ' + id + '  PASS ' + p + ' · FAIL ' + f + (missing.length ? ' · 미검산 ' + missing.length : '') + '\n');
  bad += f + missing.length;
}
console.log(bad ? '❌ 검산 실패 ' + bad + '건 — 정답키나 검산 코드를 고치기 전엔 게이트로 넘기지 않는다' : '✅ 전 세트 정답키 재검산 통과');
process.exitCode = bad ? 1 : 0;
