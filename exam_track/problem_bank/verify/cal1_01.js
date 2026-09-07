/* cal1_01 검산 — 함수의 극한. 인수분해·유리화를 쓰지 않고 값을 수치로 다가가 읽는다.
 *   · x 를 목표에 아주 가깝게 놓고 원래 식을 그대로 계산한다(약분·유리화한 식이 아니라 원식).
 *   · 좌우가 갈리는 문항은 양쪽에서 따로 다가가 값이 같은지 본다.
 *   · 미정계수는 조건을 만족하는 (a, b) 를 격자로 찾은 뒤 그 식으로 극한을 다시 수치로 확인한다.
 */
module.exports = function ({ chk }) {
  const R6 = (v) => Math.round(v * 1e6) / 1e6, M = (v) => String(v).replace('-', '−');
  const gcd = (a, b) => (b ? gcd(b, a % b) : a);
  const frac = (v) => {
    for (let d = 1; d <= 200; d++) { const n = v * d; if (Math.abs(n - Math.round(n)) < 1e-4 * d) { const g = gcd(Math.abs(Math.round(n)), d) || 1; const num = Math.round(n) / g, den = d / g; return den === 1 ? M(num) : M(num) + '/' + den; } }
    return String(R6(v));
  };
  /* a 에 양쪽에서 다가가 값을 읽는다. 두 값이 다르면 null */
  const lim = (f, a, h) => {
    h = h || 1e-5;
    const L = f(a - h), R = f(a + h);
    return Math.abs(L - R) < 1e-3 ? (L + R) / 2 : null;
  };
  const limInf = (f) => { const v = [1e5, 1e6, 1e7].map(f); return v[2]; };

  chk(1, frac(lim((x) => (x * x - 9) / (x * x - 2 * x - 3), 3)),
    'x=2.99999 →' + R6((2.99999 ** 2 - 9) / (2.99999 ** 2 - 2 * 2.99999 - 3)) + ' · x=3.00001 →' + R6((3.00001 ** 2 - 9) / (3.00001 ** 2 - 2 * 3.00001 - 3)));

  chk(2, frac(limInf((x) => (5 * x * x - x) / (2 * x * x + 3))),
    'x=1e5 →' + R6((5e10 - 1e5) / (2e10 + 3)) + ' · x=1e7 →' + R6(limInf((x) => (5 * x * x - x) / (2 * x * x + 3))) + ' · 뒤집으면 ' + R6(2 / 5));

  chk(3, frac(lim((x) => (Math.sqrt(x + 9) - 3) / x, 0, 1e-4)),
    'x=±1e−4 에서 ' + R6(lim((x) => (Math.sqrt(x + 9) - 3) / x, 0, 1e-4)) + ' · 1/6=' + R6(1 / 6) + ' · 분모를 3 으로만 보면 ' + R6(1 / 3));

  chk(4, frac(lim((x) => (x * x + 3 * x - 4) / (x * x - 1), 1)),
    'x=0.99999 →' + R6((0.99999 ** 2 + 3 * 0.99999 - 4) / (0.99999 ** 2 - 1)) + ' · x=1.00001 →' + R6((1.00001 ** 2 + 3 * 1.00001 - 4) / (1.00001 ** 2 - 1)));

  /* 5·7. 조건을 만족하는 상수를 격자로 찾고, 그 식으로 극한을 수치로 다시 읽는다 */
  let a5 = null, b5 = null;
  for (let a = -20; a <= 20; a += 0.5) {
    const L = lim((x) => (x * x + a * x - 6) / (x - 1), 1, 1e-6);
    if (L !== null && isFinite(L)) { a5 = a; b5 = Math.round(L * 1e3) / 1e3; }
  }
  chk(5, String(Math.round(a5 + b5)), 'a=' + a5 + ' 일 때만 극한이 수렴하고 그 값 b=' + b5 + ' · 합 ' + R6(a5 + b5) + ' · 차 ' + R6(b5 - a5));

  let a7 = null, b7 = null;
  for (let a = -12; a <= 12; a += 0.5) for (let b = -12; b <= 12; b += 0.5) {
    const L = lim((x) => (x * x + a * x + b) / (x * x - 4), 2, 1e-6);
    if (L !== null && isFinite(L) && Math.abs(L - 1.25) < 1e-3) { a7 = a; b7 = b; }
  }
  chk(7, M(a7 + b7), 'a=' + a7 + ', b=' + b7 + ' 에서 극한이 ' + R6(lim((x) => (x * x + a7 * x + b7) / (x * x - 4), 2, 1e-6)) + ' · 합 ' + (a7 + b7) + ' 곱 ' + (a7 * b7));

  chk(6, frac(limInf((x) => Math.sqrt(4 * x * x + x) - 2 * x)),
    'x=1e5 →' + R6(Math.sqrt(4e10 + 1e5) - 2e5) + ' · x=1e7 →' + R6(limInf((x) => Math.sqrt(4 * x * x + x) - 2 * x)));

  chk(8, frac(lim((x) => (x - 2) / (Math.sqrt(x + 2) - 2), 2, 1e-4)),
    'x=±1e−4 에서 ' + R6(lim((x) => (x - 2) / (Math.sqrt(x + 2) - 2), 2, 1e-4)));

  /* 9. 두 경계의 극한이 같은지 확인한 뒤 그 값을 답으로. 부등식이 실제로 성립하는지도 함께 본다 */
  const lo9 = lim((x) => 4 * x - 4, 2), hi9 = lim((x) => x * x, 2);
  let ok9 = true; for (let x = -20; x <= 20; x += 0.01) if (4 * x - 4 > x * x + 1e-12) ok9 = false;
  chk(9, Math.abs(lo9 - hi9) < 1e-6 ? frac(lo9) : '조여지지 않는다',
    '아래 경계의 극한 ' + R6(lo9) + ' · 위 경계의 극한 ' + R6(hi9) + ' · 부등식이 모든 실수에서 성립? ' + ok9 + ' · 계수를 안 곱하면 ' + (2 - 4));

  /* 10. 좌우에서 따로 다가가 값이 같은지 본다 */
  const f10 = (x) => (x * x - 4) / Math.abs(x - 2);
  const L10 = f10(2 - 1e-5), R10 = f10(2 + 1e-5);
  chk(10, Math.abs(L10 - R10) > 1e-3 ? '좌극한과 우극한이 달라 극한값이 존재하지 않는다' : '좌극한과 우극한이 모두 ' + frac(R10) + ' 로 같아 극한값은 ' + frac(R10) + ' 다',
    '좌극한 ' + R6(L10) + ' · 우극한 ' + R6(R10) + ' · 차 ' + R6(R10 - L10));

  chk(11, frac(limInf((x) => (2 * x + 1) / (Math.sqrt(x * x + 3) + x))),
    'x=1e5 →' + R6((2e5 + 1) / (Math.sqrt(1e10 + 3) + 1e5)) + ' · x=1e7 →' + R6(limInf((x) => (2 * x + 1) / (Math.sqrt(x * x + 3) + x))));

  /* 12. 두 조건을 만족하는 이차식을 격자로 찾는다 */
  let p12 = null, q12 = null;
  for (let p = -6; p <= 6; p += 0.5) for (let q = -6; q <= 6; q += 0.5) {
    const f = (x) => 2 * x * x + p * x + q;
    const A = limInf((x) => f(x) / (x * x));
    const B = lim((x) => f(x) / x, 0, 1e-4);
    if (Math.abs(A - 2) < 1e-3 && B !== null && isFinite(B) && Math.abs(B - 3) < 1e-2) { p12 = p; q12 = q; }
  }
  const f12 = (x) => 2 * x * x + p12 * x + q12;
  chk(12, String(f12(2)), '조건을 만족하는 이차식 2x² + ' + p12 + 'x + ' + q12 + ' · f(2)=' + f12(2) + ' · 일차항을 빼면 ' + (2 * 4));
};
