#!/usr/bin/env node
/* add_drill_fix.js — 단원 학습앱에 window.DRILL_FIX(원인 코드 → "🩹 지금 바로 고치기" 탭) 를 넣는다. 멱등.
 *
 * 사용
 *   node exam_track/tools/add_drill_fix.js <html경로>                       # 탭 id로 기본 매핑 자동 생성
 *   node exam_track/tools/add_drill_fix.js <html경로> '{"C2":["eq","⭕ …"],…}'  # 매핑을 직접 지정(JSON)
 *   node exam_track/tools/add_drill_fix.js --check <html경로>               # 있는지만 검사
 *
 * 기본 매핑 규칙(수학 단원앱 관행: 개념 탭들 → world → quiz → sum):
 *   C1(문제해석) → sum   "✅ 정리 표에서 조건·구할 것 다시 확인"
 *   C2(지식부재) → 첫 개념 탭 "📖 개념 다시 보기"
 *   C3(지식혼동) → 둘째 개념 탭(없으면 첫) "🪞 헷갈리는 짝 가르기"
 *   C4(적용실패) → 마지막 개념 탭 "🧭 어떤 도구를 쓰는지 다시 판별하기"
 *   C5(실행오류) → quiz  "🔥 퀴즈로 계산 감각 다시"
 *   (C6~C8은 사회·과학·한국사 프로파일 — 앱마다 훈련 탭이 따로 있으므로 JSON으로 지정한다)
 *
 * 전제: 앱이 <script src="drill.js"> 를 이미 갖고 있고(add_drill_tab.py), 전역 go(tab)이 있다(alg_app.js 또는 인라인).
 */
const fs = require('fs');
const args = process.argv.slice(2); const check = args[0] === '--check'; if (check) args.shift();
const file = args[0]; if (!file) { console.log('사용: node add_drill_fix.js [--check] <html> [json]'); process.exit(2); }
let s = fs.readFileSync(file, 'utf8');
if (check) { console.log((s.includes('window.DRILL_FIX') ? '✅ ' : '❌ ') + file); process.exit(s.includes('window.DRILL_FIX') ? 0 : 1); }
if (s.includes('window.DRILL_FIX')) { console.log('= 이미 있음 ' + file); process.exit(0); }
const anchor = '<script src="drill.js"></script>';
if (!s.includes(anchor)) { console.log('✗ drill.js 스크립트가 없다 — 먼저 add_drill_tab.py 를 돌려라: ' + file); process.exit(1); }
let map;
if (args[1]) map = JSON.parse(args[1]);
else {
  const tabs = [...s.matchAll(/data-t="([a-z0-9_]+)"/g)].map(m => m[1]).filter((v, i, a) => a.indexOf(v) === i);
  const concept = tabs.filter(t => !['intro', 'world', 'quiz', 'sum', 'drill'].includes(t));
  if (!concept.length) { console.log('✗ 개념 탭을 찾지 못했다(intro/world/quiz/sum 외 탭 없음) — JSON으로 지정하라'); process.exit(1); }
  const has = (t) => tabs.includes(t);
  map = {
    C1: [has('sum') ? 'sum' : concept[0], '✅ 정리 표에서 조건·구할 것 다시 확인'],
    C2: [concept[0], '📖 개념 다시 보기'],
    C3: [concept[1] || concept[0], '🪞 헷갈리는 짝 가르기'],
    C4: [concept[concept.length - 1], '🧭 어떤 도구를 쓰는지 다시 판별하기'],
    C5: [has('quiz') ? 'quiz' : concept[0], '🔥 퀴즈로 계산 감각 다시'],
  };
}
const js = '<script>\n  // 원인 코드 → 고치기 탭 (drill.js v2의 🩹 지금 바로 고치기 칩). 전역 go(tab) 필요.\n  window.DRILL_FIX = '
  + JSON.stringify(map).replace(/","/g, '", "').replace(/\],"/g, '], "') + ';\n</script>\n';
s = s.replace(anchor, () => js + anchor);
fs.writeFileSync(file, s);
console.log('• ' + file + '  ' + Object.keys(map).map(k => k + '→' + map[k][0]).join(' '));
