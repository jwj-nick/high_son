// mat2_01 평면좌표·직선 — 정답키 독립 재검산 (node exam_track/tools/verify_set.js mat2_01)
module.exports = function ({ S, chk, dist, near, solveLinear2 }) {
  chk(1, '10', 'dist=' + dist([-2, 3], [4, -5]));
  const inn = (A, B, m, n) => [(m * B[0] + n * A[0]) / (m + n), (m * B[1] + n * A[1]) / (m + n)];
  const e = inn([-2, 5], [4, -1], 2, 1); chk(2, '(2, 1)', '내분=' + e + ' AP:PB=' + dist([-2, 5], e) / dist([4, -1], e));
  { const a = 2; chk(3, '2', 'PA=' + dist([a, 0], [1, 3]) + ' PB=' + dist([a, 0], [5, 1])); }
  { const f = (p) => (p[0] - 2) ** 2 + (p[1] - 1) ** 2 - ((p[0] - 6) ** 2 + (p[1] - 5) ** 2);
    chk(4, '7', 'x+y=7 위 점에서 PA²−PB²: ' + [f([0, 7]), f([7, 0]), f([10, -3])].join(',')); }
  { const k = 3; chk(5, '3', 'a1a2+b1b2=' + (3 * 1 + 1 * (-k)) + ' 기울기곱=' + (-3) * (1 / k)); }
  { const d = Math.abs(3 * 1 - 4 * (-2) + 5) / Math.hypot(3, 4); chk(6, '16/5', 'd=' + d); }
  { const meets = (m) => { const g = (p) => p[1] - m * p[0] - 2; return g([3, 5]) * g([-1, 3]) <= 1e-12; };
    chk(7, 'm ≤ −1 또는 m ≥ 1', [-3, -1.5, -1, -0.5, 0, 0.5, 1, 1.5, 3].map(m => m + ':' + (meets(m) ? 'O' : 'X')).join(' ')); }
  { const [x, y] = solveLinear2(1, 2, 4, 2, -1, 3); const L = (p) => 2 * p[0] + p[1] - 5; chk(8, '2x + y − 5 = 0', '교점=(' + x + ',' + y + ') 직선값 ' + L([x, y]) + ',' + L([0, 5])); }
  { const a = 1, b = 1, c = -1; const quads = new Set(); for (let x = -10; x <= 10; x += 0.5) { const y = (-a * x - c) / b; if (x > 0 && y > 0) quads.add(1); if (x < 0 && y > 0) quads.add(2); if (x < 0 && y < 0) quads.add(3); if (x > 0 && y < 0) quads.add(4); }
    chk(9, 'ab &gt; 0, bc &lt; 0', 'ab=' + a * b + ' bc=' + b * c + ' 사분면=' + [...quads].sort()); }
  { const P = [1, 1]; chk(10, '(1, 1)', 'k별 대입값=' + [0, 1, 2, -1].map(k => (k + 1) * P[0] + (2 * k - 1) * P[1] - 3 * k)); }
  { const d = 4 / Math.SQRT2; const h = 2 * (0.5 * 4 * 3) / dist([4, 0], [1, 3]); chk(11, '2√2', 'd=' + d + ' 넓이검산 h=' + h + ' near=' + near(d, h)); }
  { const x = 2, y = x + 1; chk(12, '9', '교점=(' + x + ',' + y + ') 넓이=' + 0.5 * (5 - (-1)) * y); }
};
