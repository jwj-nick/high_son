/* lecture_fixmath.js — 특강 HTML 본문(스크립트 제외)의 $…$ 안에서
 *   '<' 또는 '>' 바로 뒤에 알파벳/백슬래시가 오면 \lt / \gt 로 바꾼다.
 *   (브라우저가 <b 같은 것을 태그로 읽어 수식이 사라지는 문제 예방)
 *   node _shared/lecture_fixmath.js <file.html> [...]
 */
const fs = require('fs');
for (const f of process.argv.slice(2)) {
  let h = fs.readFileSync(f, 'utf8'); let n = 0;
  const parts = h.split(/(<script[\s\S]*?<\/script>)/);
  for (let i = 0; i < parts.length; i++) {
    if (/^<script/.test(parts[i])) continue;
    const segs = parts[i].split('$');
    for (let k = 1; k < segs.length; k += 2) {
      const before = segs[k];
      segs[k] = segs[k].replace(/<(?=[a-zA-Z\\])/g, '\\lt ').replace(/>(?=[a-zA-Z\\])/g, '\\gt ');
      if (segs[k] !== before) n++;
    }
    parts[i] = segs.join('$');
  }
  fs.writeFileSync(f, parts.join(''));
  console.log(f, '수식 치환', n, '곳');
}
