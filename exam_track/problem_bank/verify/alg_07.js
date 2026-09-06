/* alg_07 검산 — 등차수열과 등비수열. 공식을 쓰지 않고 수열을 실제로 만들어 확인한다.
 *   · 조건을 만족하는 (첫째항, 공차·공비)를 격자로 찾은 뒤, 항을 하나씩 생성해 대조한다.
 *   · 합은 공식 대신 for 문으로 항을 더한다.
 *   · 최대가 되는 n 은 n = 1..30 의 합을 전부 계산해 가장 큰 자리를 읽는다.
 */
module.exports = function ({ chk }) {
  const R6 = (v) => Math.round(v * 1e6) / 1e6, M = (v) => String(v).replace('-', '−');
  const AP = (a, d, n) => a + (n - 1) * d;                       // 등차수열의 제n항
  const GP = (a, r, n) => a * Math.pow(r, n - 1);                // 등비수열의 제n항
  const sumAP = (a, d, n) => { let s = 0; for (let i = 1; i <= n; i++) s += AP(a, d, i); return s; };
  const sumGP = (a, r, n) => { let s = 0; for (let i = 1; i <= n; i++) s += GP(a, r, i); return s; };
  const near = (x, y) => Math.abs(x - y) < 1e-6;

  /* 1·4. 조건을 만족하는 (a, d) 를 격자로 찾는다 */
  const findAP = (cond) => {
    for (let a = -60; a <= 60; a += 0.5) for (let d = -20; d <= 20; d += 0.5) if (cond(a, d)) return [a, d];
    return null;
  };
  const [a1, d1] = findAP((a, d) => near(AP(a, d, 4), 11) && near(AP(a, d, 9), 31));
  chk(1, M(a1), '조건을 만족하는 등차수열 a=' + a1 + ', d=' + d1 + ' · 항 ' + [1, 2, 3, 4, 9].map((n) => 'a' + n + '=' + AP(a1, d1, n)).join(' '));

  const [a4, d4] = findAP((a, d) => near(AP(a, d, 3) + AP(a, d, 7), 30) && near(AP(a, d, 4), 12));
  chk(4, String(AP(a4, d4, 10)), 'a=' + a4 + ', d=' + d4 + ' · a₅=' + AP(a4, d4, 5) + ' a₁₀=' + AP(a4, d4, 10));

  /* 2·9. 조건을 만족하는 공비를 격자로 찾는다 */
  const findGP = (cond) => {
    const out = [];
    for (let a = -400; a <= 400; a += 0.5) for (let r = -12; r <= 12; r += 0.25) if (r !== 0 && cond(a, r)) out.push([a, r]);
    return out;
  };
  const g2 = findGP((a, r) => near(GP(a, r, 1), 12) && near(GP(a, r, 4), 324));
  chk(2, String(g2[0][1]), '조건을 만족하는 (a, r) = ' + g2.map((p) => '(' + p[0] + ',' + p[1] + ')').join(' ') + ' · r 후보가 하나뿐이다');

  const g9 = findGP((a, r) => r > 0 && near(GP(a, r, 1) + GP(a, r, 2), 6) && near(GP(a, r, 3) + GP(a, r, 4), 54));
  chk(9, String(g9[0][1]), 'r &gt; 0 조건에서 (a, r) = ' + g9.map((p) => '(' + p[0] + ',' + p[1] + ')').join(' ') +
    ' · r=−3 이면 a₁+a₂=' + R6(GP(-3, -3, 1) + GP(-3, -3, 2)) + ' 이라 조건에 맞는 a 가 따로 있다');

  /* 3. 세 수의 차가 같아지는 x 를 격자로 찾는다 */
  let x3 = null;
  for (let x = -20; x <= 20; x += 0.001) { const t = [x, x + 4, 3 * x - 2]; if (near(t[1] - t[0], t[2] - t[1])) { x3 = Math.round(x * 1000) / 1000; break; } }
  chk(3, String(x3), 'x=' + x3 + ' 일 때 세 수는 ' + [x3, x3 + 4, 3 * x3 - 2].join(', ') + ' 로 차가 같다');

  /* 5·8·11·12. 합은 항을 하나씩 더한다 */
  chk(5, M(sumGP(3, -2, 6)), '항 ' + [1, 2, 3, 4, 5, 6].map((n) => GP(3, -2, n)).join(' + ') + ' = ' + sumGP(3, -2, 6));

  let s8 = 0, c8 = 0; for (let v = 1; v <= 97; v += 3) { s8 += v; c8++; }
  chk(8, String(s8), '1부터 3씩 더해 97 까지 ' + c8 + '개 항, 합 ' + s8 + ' (32개로 세면 ' + (s8 - 97) + ')');

  const g11 = findGP((a, r) => near(GP(a, r, 1), 2) && near(GP(a, r, 4), 54));
  chk(11, String(sumGP(2, g11[0][1], 6)), 'r=' + g11[0][1] + ' · 항 ' + [1, 2, 3, 4, 5, 6].map((n) => GP(2, 3, n)).join('+') + ' = ' + sumGP(2, 3, 6));

  const d12 = (2 - 40) / 19;
  chk(12, String(sumAP(40, d12, 20)), 'd=' + d12 + ' · a₂₀=' + AP(40, d12, 20) + ' · 20항의 합 ' + sumAP(40, d12, 20) + ' (19항까지면 ' + sumAP(40, d12, 19) + ')');

  /* 6. n = 1..30 의 합을 전부 계산해 최대인 자리를 읽는다 */
  let best = -Infinity, at6 = null; const tbl = [];
  for (let n = 1; n <= 30; n++) { const S = sumAP(30, -4, n); tbl.push(n + ':' + S); if (S > best) { best = S; at6 = n; } }
  chk(6, String(at6), '합이 최대인 n=' + at6 + ' (S=' + best + ') · 주변 ' + tbl.slice(5, 10).join(' ') + ' · S=0 이 되는 자리 ' + tbl.find((t) => t.endsWith(':0')));

  /* 7. 등비를 이루면서 합 조건을 만족하는 두 수를 격자로 찾는다 */
  let p7 = null;
  for (let a = 0.5; a <= 19.5 && !p7; a += 0.5) { const c = 20 - a; if (a < c && near(a * c, 64)) p7 = [a, c]; }
  chk(7, p7[0] + ' 와 ' + p7[1], 'b²=64 이고 합이 20 인 두 수 ' + p7.join(', ') + ' · 실제 수열 ' + [p7[0], 8, p7[1]].join(', ') + ' 의 비 ' + (8 / p7[0]) + ', ' + (p7[1] / 8));

  /* 10. S₁₀·S₂₀ 조건을 만족하는 (a, d) 를 찾아 S₃₀ 을 직접 더한다 */
  let p10 = null;
  for (let a = -20; a <= 20 && !p10; a += 0.5) for (let d = -10; d <= 10; d += 0.5) if (near(sumAP(a, d, 10), 100) && near(sumAP(a, d, 20), 300)) { p10 = [a, d]; break; }
  chk(10, String(sumAP(p10[0], p10[1], 30)), 'a=' + p10[0] + ', d=' + p10[1] + ' · S₁₀=' + sumAP(p10[0], p10[1], 10) + ' S₂₀=' + sumAP(p10[0], p10[1], 20) + ' S₃₀=' + sumAP(p10[0], p10[1], 30) +
    ' · 열 항씩 덩어리 ' + [100, sumAP(p10[0], p10[1], 20) - 100, sumAP(p10[0], p10[1], 30) - sumAP(p10[0], p10[1], 20)].join(', '));
};
