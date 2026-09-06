// mat2_02 원의 방정식 — 정답키 독립 재검산 (node exam_track/tools/verify_set.js mat2_02)
module.exports = function ({ S, chk, dist, near }) {
  chk(1, '(x − 2)² + (y + 1)² = 25', 'r²=' + ((5 - 2) ** 2 + (3 + 1) ** 2));
  chk(2, 'k &lt; 13', '13−k>0 · A²+B²−4C=52−4k>0 ⇔ k<13');
  chk(3, '(2, −1), 3', 'r²=' + (4 + 1 + 4));
  { const d = (k) => Math.abs(k) / Math.SQRT2, r = Math.sqrt(8); chk(4, '−4 &lt; k &lt; 4', 'd(3.9)<r:' + (d(3.9) < r) + ' d(4.1)<r:' + (d(4.1) < r) + ' d(4)=r:' + near(d(4), r)); }
  { const dO = 25 / Math.hypot(3, 4); chk(5, '3x + 4y = 25', 'O~접선 거리=' + dO + '(r=5) 접점대입=' + (3 * 3 + 4 * 4)); }
  { const n = 2 * Math.sqrt(5); chk(6, 'y = 2x ± 2√5', 'O~직선 거리=' + Math.abs(n) / Math.hypot(2, -1) + '(r=2)'); }
  { const r = Math.sqrt(5); const d1 = 5 / Math.hypot(2, -1), d2 = 5 / Math.hypot(1, 2), dBad = 3 / Math.hypot(1, 2);
    chk(7, '2x − y − 5 = 0, x + 2y − 5 = 0', 'd1=' + d1 + ' d2=' + d2 + ' r=' + r + ' (3,1)대입 ' + (2 * 3 - 1 - 5) + ',' + (3 + 2 - 5) + ' 오답 x+2y−3 거리=' + dBad.toFixed(3)); }
  { const d = 10 / Math.hypot(3, 4); const chord = 2 * Math.sqrt(25 - d * d);
    const a = 25 / 9, b = -80 / 9, c = 100 / 9 - 25; const disc = b * b - 4 * a * c; const y1 = (-b + Math.sqrt(disc)) / (2 * a), y2 = (-b - Math.sqrt(disc)) / (2 * a);
    const P = [(10 - 4 * y1) / 3, y1], Q = [(10 - 4 * y2) / 3, y2];
    chk(8, '2√21', 'chord=' + chord + ' 교점직접=' + dist(P, Q) + ' 2√21=' + 2 * Math.sqrt(21)); }
  chk(9, '10', 'd=' + Math.hypot(3, 4) + ' max=7 min=3');
  { const ratio = (p) => dist(p, [-1, 0]) / dist(p, [2, 0]); chk(10, '4π', 'r=2 · 비 (1,0)=' + ratio([1, 0]) + ' (5,0)=' + ratio([5, 0]) + ' (3,2)=' + ratio([3, 2])); }
  chk(11, '2', 'y=0: x²−2x=0 → x=0,2');
  { const roots = [1, 5].filter(a => near((2 - a) ** 2 + (1 - a) ** 2, a * a)); chk(12, '2', '조건 만족 a=' + roots); }
};
