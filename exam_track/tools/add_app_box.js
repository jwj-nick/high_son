#!/usr/bin/env node
/* add_app_box.js — 단원 학습앱의 특정 탭(페이지) 끝에 개념 박스를 덧붙인다. "문항을 깎지 말고 앱을 채운다"(PLAN §3)의 도구.
 *
 * 사용
 *   node exam_track/tools/add_app_box.js <html경로> <탭id> <색:g|b|a> "<제목>" "<본문 HTML(KaTeX $…$ 가능)>"
 *   node exam_track/tools/add_app_box.js <html경로> --json <boxes.json>
 *     boxes.json = [ { "page":"rel", "cls":"b", "title":"📏 현의 길이", "body":"…" }, … ]
 *
 * 규칙
 *   - 같은 제목이 이미 있으면 건너뛴다(멱등).
 *   - 본문에 '<'+알파벳 원시 문자열을 쓰지 않는다(수식은 \lt \gt). '<'+한글은 잘림이라 거부한다.
 *   - 삽입 위치 = 해당 <div class="page" data-p="탭"> 안 마지막 "    </div>\n  </div>" 직전(카드 끝).
 *   - 파일이 CRLF면 유지한다.
 */
const fs = require('fs');
const [file, a1, a2, a3, a4] = process.argv.slice(2);
if (!file || !a1) { console.log('사용: node add_app_box.js <html> <탭> <g|b|a> "<제목>" "<본문>"  |  node add_app_box.js <html> --json <boxes.json>'); process.exit(2); }
const boxes = a1 === '--json' ? JSON.parse(fs.readFileSync(a2, 'utf8')) : [{ page: a1, cls: a2 || 'b', title: a3, body: a4 }];
let s = fs.readFileSync(file, 'utf8'); const crlf = s.includes('\r\n'); if (crlf) s = s.replace(/\r\n/g, '\n');
let n = 0;
for (const b of boxes) {
  if (!b.page || !b.title || !b.body) { console.log('✗ page/title/body 필요'); process.exit(1); }
  if (/<[가-힣]/.test(b.body) || /<[가-힣]/.test(b.title)) { console.log("✗ '<'+한글은 innerHTML 잘림 — 본문을 고쳐라: " + b.title); process.exit(1); }
  if (s.includes('<div class="t">' + b.title + '</div>')) { console.log('= 이미 있음: ' + b.title); continue; }
  const start = s.indexOf('<div class="page" data-p="' + b.page + '">');
  if (start < 0) { console.log('✗ 탭 없음: ' + b.page); process.exit(1); }
  let end = s.indexOf('\n  <div class="page"', start + 10); if (end < 0) end = s.indexOf('<!-- ⚡', start); if (end < 0) end = s.length;
  const seg = s.slice(start, end); const close = seg.lastIndexOf('    </div>\n  </div>');
  if (close < 0) { console.log('✗ 카드 닫힘 앵커 없음: ' + b.page); process.exit(1); }
  const html = '      <div class="box ' + (b.cls || 'b') + '">\n        <div class="t">' + b.title + '</div>\n        ' + b.body + '\n      </div>\n';
  s = s.slice(0, start + close) + html + s.slice(start + close); n++;
  console.log('• ' + b.page + ' ← ' + b.title);
}
if (crlf) s = s.replace(/\n/g, '\r\n');
fs.writeFileSync(file, s);
console.log(n + '개 추가 · 이어서: node subject_hub/_shared/app_check.js ' + file + ' 로 태그 균형 확인, 스크린샷으로 KaTeX 렌더 확인');
