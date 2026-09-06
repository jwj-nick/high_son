/* alg_01 검산 — 지수와 로그. 정답키를 문항 텍스트와 다른 경로로 다시 만든다.
 *   · 거듭제곱근·지수는 실제 수치 계산으로, 로그는 Math.log 비율로 확인한다.
 *   · 조건 범위 문항은 정수를 전수 대입해 센다.
 */
module.exports = function ({ chk, near }) {
  const R6 = (v) => Math.round(v * 1e6) / 1e6;
  const M = (v) => String(v).replace('-', '−');
  const lg = (x, b) => Math.log(x) / Math.log(b);

  /* 1. x³ = −8 인 실수를 격자로 찾는다 */
  let r1 = null;
  for (let x = -5; x <= 5; x = R6(x + 0.0001)) if (Math.abs(x * x * x + 8) < 1e-6) r1 = Math.round(x);
  chk(1, M(r1), 'x³ = −8 인 실수 ' + r1 + ' (2³ = 8)');

  /* 2·10. 지수 계산을 그대로 수행 */
  chk(2, String(R6(Math.pow(27, 2 / 3) * Math.pow(9, -0.5))), '27^(2/3)=' + R6(Math.pow(27, 2 / 3)) + ' 9^(−1/2)=' + R6(Math.pow(9, -0.5)));
  chk(10, String(R6(Math.pow(1 / 8, -2 / 3))), '(1/8)^(−2/3) = ' + R6(Math.pow(1 / 8, -2 / 3)));

  /* 3. 로그 값을 직접 더한다 */
  const v3 = lg(18, 3) - lg(2, 3) + lg(1 / 3, 3);
  chk(3, String(Math.round(v3)), '값 ' + R6(v3) + ' (앞 두 항만 = ' + R6(lg(18, 3) - lg(2, 3)) + ')');

  /* 4. 정수 x를 전수 대입해 로그가 정의되는 것을 센다 */
  const ok4 = [];
  for (let x = -20; x <= 20; x++) { const b = x - 1, n = 5 - x; if (b > 0 && b !== 1 && n > 0) ok4.push(x); }
  chk(4, String(ok4.length), '정의되는 정수 ' + ok4.join(','));

  /* 5. 자릿수 = 상용로그의 정수 부분 + 1 (실제 자릿수와 대조) */
  const digits = BigInt(2) ** BigInt(30);
  chk(5, String(digits.toString().length) + '자리', '2³⁰ = ' + digits.toString() + ' · log 정수부 ' + Math.floor(30 * 0.3010));

  /* 6. a를 수치로 두고 4/a 와 비교 */
  const a6 = lg(3, 2), want6 = lg(16, 3);
  chk(6, near(want6, 4 / a6, 1e-9) ? '4/a' : '불일치', 'log₃16 = ' + R6(want6) + ' · 4/a = ' + R6(4 / a6) + ' · 4a = ' + R6(4 * a6));

  /* 7·12. 방정식의 해를 격자로 찾고 조건으로 거른다 */
  const sol7 = [];
  for (let x = -10; x <= 10; x = R6(x + 0.0005)) {
    if (x - 1 > 0 && x + 2 > 0 && Math.abs(lg(x - 1, 2) + lg(x + 2, 2) - 2) < 1e-6) sol7.push(Math.round(x));
  }
  chk(7, 'x = ' + [...new Set(sol7)].map(M).join(' 또는 x = '), '진수 조건 x &gt; 1 아래 해 ' + [...new Set(sol7)].join(','));
  let x12 = null;
  for (let x = 0.001; x <= 100; x = R6(x + 0.0005)) if (x > 1 && Math.abs(lg(lg(x, 2), 3) - 1) < 1e-6) x12 = Math.round(x);
  chk(12, String(x12), 'log₂x = 3 → x = ' + x12);

  /* 8. log₈32 를 비율로 계산해 기약분수로 적는다 */
  const v8 = lg(32, 8);
  const gcd = (a, b) => (b ? gcd(b, a % b) : a);
  const num = Math.round(v8 * 3), den = 3, g = gcd(num, den);
  chk(8, (num / g) + '/' + (den / g), '값 ' + R6(v8) + ' (8^(5/3) = ' + R6(Math.pow(8, 5 / 3)) + ')');

  /* 9. 진수를 코드가 스스로 소인수분해해 주어진 값으로 조합한다 */
  const fac = (n) => { let a = 0, b = 0; while (n % 2 === 0) { n /= 2; a++; } while (n % 3 === 0) { n /= 3; b++; } return [a, b, n]; };
  const [e2, e3, rest] = fac(18);
  const v9 = e2 * 0.3010 + e3 * 0.4771;
  chk(9, rest === 1 ? v9.toFixed(4) : '2·3으로 분해되지 않음',
    '18 = 2^' + e2 + ' × 3^' + e3 + ' → ' + v9.toFixed(4) + ' · 실제 log10(12)=' + R6(Math.log10(18)) + ' · 2×6으로 보면 ' + R6(0.3010 + 0.4771));

  /* 11. 조건을 만족하는 x를 격자로 찾아 곱한다 */
  const sol11 = [];
  for (let x = 1.001; x <= 40; x = R6(x + 0.0005)) {
    const v = lg(x, 2) + lg(8, x);
    if (Math.abs(v - 4) < 1e-5) sol11.push(Math.round(x));
  }
  const u11 = [...new Set(sol11)];
  chk(11, String(u11.reduce((p, q) => p * q, 1)), '해 ' + u11.join(',') + ' · 합은 ' + u11.reduce((p, q) => p + q, 0));
};
