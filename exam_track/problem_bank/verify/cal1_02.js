/* cal1_02 검산 — 함수의 연속. 연속의 세 조건을 코드로 하나씩 확인한다.
 *   · 극한은 좌우에서 따로 다가가 값을 읽고, 두 값이 같은지 본다(약분한 식이 아니라 원식으로).
 *   · 불연속점은 x 를 훑어 함숫값이 유한하지 않은 자리를 찾는다.
 *   · 사잇값 정리 문항은 구간을 잘게 나눠 부호가 바뀌는 곳과 실제 근의 개수를 함께 센다.
 *   · 최대·최소는 격자 탐색으로 찾는다.
 */
module.exports = function ({ chk }) {
  const R6 = (v) => Math.round(v * 1e6) / 1e6, M = (v) => String(v).replace('-', '−');
  const gcd = (a, b) => (b ? gcd(b, a % b) : a);
  const frac = (v) => {
    for (let d = 1; d <= 200; d++) { const n = v * d; if (Math.abs(n - Math.round(n)) < 1e-4 * d) { const g = gcd(Math.abs(Math.round(n)), d) || 1; const num = Math.round(n) / g, den = d / g; return den === 1 ? M(num) : M(num) + '/' + den; } }
    return String(R6(v));
  };
  const sides = (f, a, h) => { h = h || 1e-5; return [f(a - h), f(a + h)]; };
  const lim = (f, a, h) => { const [L, R] = sides(f, a, h); return Math.abs(L - R) < 1e-3 ? (L + R) / 2 : null; };

  /* 1·3. 구멍을 메우는 값 = 극한값 */
  chk(1, frac(lim((x) => (x * x + x - 6) / (x - 2), 2)),
    'x=1.99999 →' + R6((1.99999 ** 2 + 1.99999 - 6) / (1.99999 - 2)) + ' · x=2.00001 →' + R6((2.00001 ** 2 + 2.00001 - 6) / (2.00001 - 2)));
  chk(3, frac(lim((x) => (Math.sqrt(2 * x + 1) - 3) / (x - 4), 4, 1e-4)),
    '±1e−4 에서 ' + R6(lim((x) => (Math.sqrt(2 * x + 1) - 3) / (x - 4), 4, 1e-4)) + ' · 분자의 계수 2 를 빠뜨리면 ' + R6(1 / 6));

  /* 2·9. 값이 유한하지 않은 자리를 격자로 찾는다 */
  const bad = (f, lo, hi) => {
    const out = [];
    for (let x = lo; x <= hi; x = Math.round((x + 0.5) * 10) / 10) { const v = f(x); if (!isFinite(v) || Number.isNaN(v)) out.push(x); }
    return out;
  };
  const b2 = bad((x) => (x + 1) / (x * x - x - 6), -10, 10);
  chk(2, b2.slice().sort((p, q) => q - p).map((v) => 'x = ' + M(v)).join(', '),
    '정의되지 않는 자리 ' + b2.join(',') + ' · 분자가 0 인 곳은 x=−1 (그때 f=' + R6((-1 + 1) / (1 + 1 - 6)) + ' 로 잘 정의된다)');
  const b9 = bad((x) => (x * x - 4) / (x - 2), -10, 10);
  chk(9, b9.length + '개', '정의되지 않는 자리 ' + b9.join(',') + ' · x=−2 에서는 ' + R6((4 - 4) / (-2 - 2)) + ' 로 정의된다');

  /* 4·5·11. 정리의 조건과 결론을 반례·부호로 확인한다 */
  let mx4 = -Infinity, at4 = null;                       // 열린 구간에서 최댓값이 없는 반례: y = x
  for (let x = 0.0001; x < 1; x += 0.0001) if (x > mx4) { mx4 = x; at4 = x; }
  chk(4, '이 구간의 모든 점에서 극한값과 함숫값이 같다',
    '연속의 정의가 그대로다 · 반례 — y=x 는 (0,1) 에서 값이 ' + R6(mx4) + ' 까지 올라가지만 1 에 닿지 않아 최댓값이 없고 · f(x)=1 은 근이 없고 · f(x)=x²−3x 는 오르내린다');

  const f5 = (x) => x * x * x - 2 * x * x - 2;
  const SEG5 = [[0, 1], [1, 2], [2, 3]];
  const seg5 = SEG5.map((r) => '(' + r[0] + ',' + r[1] + ')f=' + R6(f5(r[0])) + '/' + R6(f5(r[1])) + (f5(r[0]) * f5(r[1]) < 0 ? ' 부호바뀜' : ''));
  const hit5 = SEG5.filter((r) => f5(r[0]) * f5(r[1]) < 0);
  chk(5, '(' + hit5[0][0] + ', ' + hit5[0][1] + ')', seg5.join(' · ') + ' · 부호가 바뀌는 구간 ' + hit5.length + '개 · f(2.3)=' + R6(f5(2.3)) + ' f(2.4)=' + R6(f5(2.4)));

  const v11 = [-2, 1, -3, 5];
  let cnt11 = 0; for (let i = 0; i < 3; i++) if (v11[i] * v11[i + 1] < 0) cnt11++;
  chk(11, '적어도 ' + cnt11 + '개의 실근을 갖는다', '값 ' + v11.join(',') + ' · 이웃한 곱 ' + [0,1,2].map((i) => v11[i] * v11[i+1]).join(', ') + ' 이 모두 음수 → 부호가 바뀌는 구간 ' + cnt11 + '개');

  /* 6. 연속이 되게 하는 상수를 격자로 찾는다 */
  let a6 = null;
  for (let a = -12; a <= 12; a += 0.5) {
    const f = (x) => (x < 2 ? x * x + a * x : x + 6);
    const [L, R] = sides(f, 2);
    if (Math.abs(L - R) < 1e-3 && Math.abs(R - f(2)) < 1e-3) a6 = a;   // 우극한은 h 만큼 떨어져 있으므로 허용치를 그에 맞춘다
  }
  chk(6, String(a6), 'a=' + a6 + ' 에서 좌극한 ' + R6(4 + 2 * a6) + ' = 함숫값 ' + (2 + 6) + ' · a=−2 이면 좌극한 ' + R6(4 - 4));

  /* 7·10. 좌극한·우극한·함숫값 셋을 따로 읽는다 */
  const f7 = (x) => (x < 1 ? x + 1 : (x > 1 ? 4 - x : 3));
  const [L7, R7] = sides(f7, 1);
  chk(7, Math.abs(L7 - R7) > 1e-3 ? '좌극한과 우극한이 달라 극한값이 없다' : '연속이다',
    '좌극한 ' + R6(L7) + ' · 우극한 ' + R6(R7) + ' · 함숫값 ' + f7(1) + ' → 극한 자체가 없다');

  const f10 = (x) => Math.abs(2 * x - 6) / (x - 3);
  const [L10, R10] = sides(f10, 3);
  chk(10, Math.abs(L10 - R10) > 1e-3 ? '그런 a 는 없다' : String((L10 + R10) / 2),
    '좌극한 ' + R6(L10) + ' · 우극한 ' + R6(R10) + ' → 두 값이 달라 어떤 a 로도 메울 수 없다 · 평균을 취하면 ' + R6((L10 + R10) / 2));

  /* 8. 세 조건 가운데 어느 것이 깨졌는지 코드로 가른다 */
  const f8 = (x) => (x * x - 25) / (x - 5);
  const defined8 = isFinite(f8(5)) && !Number.isNaN(f8(5));
  const [L8, R8] = sides(f8, 5);
  chk(8, !defined8 ? 'f(5) 가 정의되지 않기 때문' : (Math.abs(L8 - R8) > 1e-3 ? '좌극한과 우극한이 다르기 때문' : '극한값과 함숫값이 다르기 때문'),
    'f(5) 정의됨? ' + defined8 + ' · 좌극한 ' + R6(L8) + ' 우극한 ' + R6(R8) + ' (둘이 같으므로 극한은 존재한다)');

  /* 12. 격자 탐색으로 최대·최소 */
  let mx = -Infinity, mn = Infinity;
  for (let x = 0; x <= 3; x = Math.round((x + 0.0001) * 1e4) / 1e4) { const y = x * x - 2 * x; if (y > mx) mx = y; if (y < mn) mn = y; }
  chk(12, String(Math.round(mx + mn)), '최댓값 ' + R6(mx) + ' 최솟값 ' + R6(mn) + ' 합 ' + R6(mx + mn) + ' · 끝점만 보면 ' + (0 + 3));
};
