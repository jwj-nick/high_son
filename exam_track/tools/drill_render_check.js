#!/usr/bin/env node
/* drill_render_check.js — ⚡ 실전 탭(drill.js)이 세트를 실제로 그려 보고 회귀를 잡는다.
 *
 * 왜 필요한가
 *   2026-09-06: 보기 텍스트가 esc()를 한 번 더 거쳐 화면에 "k &lt; 13" 처럼 엔티티가 그대로 보였다.
 *   발문·자료는 원문 그대로 넣는데 보기만 이스케이프해서 생긴 불일치로, 라이브 세트 4개가 이미 그 상태였다.
 *   기계 검사(check_bank)와 정답키 재검산(verify_set)은 데이터만 보므로 이 층을 못 본다.
 *
 * 사용
 *   node exam_track/tools/drill_render_check.js mat2_05 mat2_06        # 세트 지정
 *   node exam_track/tools/drill_render_check.js --all                  # 앱 폴더에 복사된 drill_*.js 전부
 *
 * 무엇을 보는가
 *   1) 엔진 소스에 이중 이스케이프 패턴(esc(o.t) · esc(chosen.why))이 되살아나지 않았는가
 *   2) 첫 문항이 실제로 렌더되는가 — 발문·보기 4개
 *   3) 렌더 결과에 정답 위치·원인 코드가 새지 않는가
 *   4) 렌더 결과에 이중 이스케이프(&amp;lt; 등)가 없는가
 */
const fs = require('fs'), path = require('path');
const ROOT = path.resolve(__dirname, '..', '..');
const ENGINE = path.join(ROOT, 'subject_hub', '_shared', 'drill.js');
const DATA = path.join(ROOT, 'exam_track', 'problem_bank', 'data');

const src = fs.readFileSync(ENGINE, 'utf8');
let bad = 0;
for (const pat of ['esc(o.t)', 'esc(chosen.why)']) {
  if (src.includes(pat)) { console.log('❌ 엔진에 이중 이스케이프 패턴이 있다: ' + pat + ' — 보기·why는 원문 그대로 넣는다'); bad++; }
}

let ids = process.argv.slice(2);
if (ids[0] === '--all' || !ids.length) {
  ids = fs.readdirSync(DATA).filter((f) => /^[a-z0-9_]+\.js$/.test(f) && f !== 'sets.js').map((f) => f.replace(/\.js$/, ''));
}

function mk(t) {
  return { tagName: t, _h: '', style: {}, set innerHTML(v) { this._h = v; }, get innerHTML() { return this._h; },
    appendChild() {}, addEventListener() {}, setAttribute() {}, querySelector() { return null; } };
}

for (const id of ids) {
  const df = path.join(DATA, id + '.js');
  if (!fs.existsSync(df)) { console.log('✗ 데이터 없음: ' + id); bad++; continue; }
  const el = mk('div');
  global.document = { readyState: 'complete', getElementById: (i) => (i === 'drill' ? el : null), createElement: mk, addEventListener() {}, head: { appendChild() {} } };
  global.localStorage = { getItem() { return null; }, setItem() {}, removeItem() {} };
  global.navigator = {}; global.window = global;
  delete require.cache[require.resolve(df)]; delete require.cache[require.resolve(ENGINE)];
  require(df); require(ENGINE);
  const S = window.BANK_SET, h = el.innerHTML, it = S.items[0];
  const opts = (h.match(/class="qopt"/g) || []).length;
  const problems = [];
  if (h.length < 400) problems.push('렌더 결과가 너무 짧다(' + h.length + 'B)');
  if (!h.includes(it.stem.slice(0, 12))) problems.push('발문이 안 보인다');
  if (opts !== 4) problems.push('보기가 4개가 아니다(' + opts + ')');
  if (/\bC[1-8]\b/.test(h)) problems.push('원인 코드가 노출됐다');
  const dbl = h.match(/&amp;(lt|gt|nbsp|amp);/g);
  if (dbl) problems.push('이중 이스케이프 ' + dbl.length + '건(' + [...new Set(dbl)].join(' ') + ')');
  console.log((problems.length ? '❌ ' : '✅ ') + id + ' · ' + h.length + 'B' + (problems.length ? ' — ' + problems.join(' · ') : ''));
  bad += problems.length;
}
console.log(bad ? '\n❌ ' + bad + '건 — 고치기 전에는 배포하지 않는다' : '\n✅ 전 세트 렌더 통과');
process.exitCode = bad ? 1 : 0;
