/* cal1_06 검산 — 도함수의 활용. 그래프를 훑어 실근·최솟값·운동을 직접 읽는다.
 *   · 실근의 개수는 f(x) − k 의 부호가 바뀌는 자리를 세어 확인한다(무리수 간격으로 훑어 근에 걸리지 않게).
 *   · 부등식 조건의 상수는 격자로 훑어 성립하는 가장 작은 값을 찾는다.
 *   · 속도·가속도는 위치를 수치로 미분해 얻고, 속력의 증감은 |v| 를 직접 비교한다.
 */
module.exports = function ({ chk }) {
  const R6 = (v) => Math.round(v * 1e6) / 1e6, M = (v) => String(v).replace('-', '−');
  const D = (f, a) => (f(a + 1e-5) - f(a - 1e-5)) / 2e-5;
  /* g 의 부호가 바뀌는 횟수 = 서로 다른 실근의 개수(접하는 자리는 세지 않는다) */
  const roots = (g, lo, hi) => {
    const st = 0.0009137, N = Math.round((hi - lo) / st);
    let c = 0, prev = g(lo);
    for (let i = 1; i <= N; i++) { const cur = g(lo + i * st); if (prev * cur < 0) c++; prev = cur; }
    return c;
  };
  /* 접하는 자리까지 포함한 근의 개수 — 값이 0 에 아주 가까워지는 골짜기를 함께 센다 */
  const touchCount = (g, lo, hi) => {
    const st = 0.0009137, N = Math.round((hi - lo) / st);
    let c = roots(g, lo, hi), prev = g(lo), pd = null;
    for (let i = 1; i <= N; i++) {
      const x = lo + i * st, cur = g(x), d = cur - prev;
      if (pd !== null && pd * d < 0 && Math.abs(cur) < 1e-3) c++;      // 극값이 0 에 닿는 자리
      pd = d; prev = cur;
    }
    return c;
  };

  /* 1·9. 실근의 개수가 바뀌는 k 의 경계를 격자로 찾는다 */
  const f1 = (x) => x * x * x - 12 * x;
  const ok1 = []; for (let k = -30; k <= 30; k += 0.5) if (roots((x) => f1(x) - k, -10, 10) === 3) ok1.push(k);
  chk(1, M(ok1[0] - 0.5) + ' &lt; k &lt; ' + M(ok1[ok1.length - 1] + 0.5),
    '세 실근인 k 의 범위 ' + ok1[0] + '~' + ok1[ok1.length - 1] + ' · 극댓값 f(−2)=' + f1(-2) + ' 극솟값 f(2)=' + f1(2) + ' · f′=0 인 x 는 ±2');

  const f9 = (x) => 3 * Math.pow(x, 4) - 4 * Math.pow(x, 3) - 12 * x * x;
  const ok9 = []; for (let k = -40; k <= 10; k += 0.5) if (roots((x) => f9(x) - k, -6, 6) === 4) ok9.push(k);
  chk(9, M(ok9[0] - 0.5) + ' &lt; k &lt; ' + M(ok9[ok9.length - 1] + 0.5),
    '네 실근인 k 의 범위 ' + ok9[0] + '~' + ok9[ok9.length - 1] + ' · f(−1)=' + f9(-1) + ' f(0)=' + f9(0) + ' f(2)=' + f9(2));

  /* 2. 접하는 근까지 세되 서로 다른 실근으로 묶는다 */
  const g2 = (x) => 2 * x * x * x - 9 * x * x + 12 * x - 3;
  chk(2, touchCount(g2, -6, 6) + '개', '부호가 바뀌는 자리 ' + roots(g2, -6, 6) + '개 + 0 에 닿는 극값 ' + (touchCount(g2, -6, 6) - roots(g2, -6, 6)) + '개 · f(0)=' + g2(0) + ' f(2)=' + g2(2));

  /* 3. 정수 k 를 하나씩 넣어 세 실근인지 확인한다 */
  const ks3 = []; for (let k = -20; k <= 10; k++) if (roots((x) => x * x * x + 6 * x * x + 9 * x - k, -10, 5) === 3) ks3.push(k);
  chk(3, ks3.length + '개', '세 실근인 정수 k = ' + ks3.join(', ') + ' · k=0 이면 ' + roots((x) => x * x * x + 6 * x * x + 9 * x, -10, 5) + '개, k=−4 이면 ' + roots((x) => x * x * x + 6 * x * x + 9 * x + 4, -10, 5) + '개');

  /* 4·5·11. 조건이 성립하는 상수의 경계를 격자로 찾는다 */
  const pos4 = (a) => { for (let x = -6; x <= 8; x += 0.001) if (Math.pow(x, 4) - 4 * Math.pow(x, 3) + a <= 0) return false; return true; };
  let a4 = null; for (let a = 0; a <= 60; a += 0.5) if (pos4(a) && a4 === null) a4 = a;
  chk(4, 'a &gt; ' + Math.round(a4 - 0.5), '성립하는 가장 작은 격자값 a=' + a4 + ' · a=27 이면 x=3 에서 값 ' + R6(81 - 108 + 27) + ' 로 0 이라 성립하지 않는다');

  const ok5 = (k) => { for (let x = 0; x <= 10; x += 0.001) if (x * x * x - 3 * x * x + k < -1e-9) return false; return true; };
  let k5 = null; for (let k = -10; k <= 20; k += 0.5) if (ok5(k) && k5 === null) k5 = k;
  chk(5, String(k5), 'x≥0 에서 성립하는 가장 작은 k = ' + k5 + ' · x=2 에서 값 ' + R6(8 - 12 + k5) + ' · x=0 에서 값 ' + k5);

  const ok11 = (a) => { for (let x = 5; x <= 15; x += 0.001) if (x * x * x - 9 * x * x + 15 * x + a < -1e-9) return false; return true; };
  let a11 = null; for (let a = 0; a <= 40; a += 0.5) if (ok11(a) && a11 === null) a11 = a;
  chk(11, String(a11), 'x≥5 에서 성립하는 가장 작은 a = ' + a11 + ' · x=5 에서 값 ' + R6(125 - 225 + 75 + a11) + ' (구간의 왼쪽 끝이 최소) · x=6 에서 ' + R6(216 - 324 + 90 + a11));

  /* 6·12. 속도의 부호가 바뀌는 자리 */
  const x6 = (t) => t * t * t - 9 * t * t + 24 * t;
  /* 격자가 근에 정확히 걸리면 곱이 0 이 되어 부호 변화를 놓치므로 무리수 간격으로 훑는다 */
  const sw6 = []; { let pv = D(x6, 0); for (let i = 1; i <= 9000; i++) { const t = i * 0.0009137; const cv = D(x6, t); if (pv * cv < 0) sw6.push(R6(t)); pv = cv; } }
  chk(6, sw6.map((t) => 't = ' + Math.round(t)).join(' 와 '), '속도의 부호가 바뀌는 시각 ' + sw6.join(', ') + ' · v(1)=' + R6(D(x6, 1)) + ' v(3)=' + R6(D(x6, 3)) + ' v(5)=' + R6(D(x6, 5)) + ' · 위치가 0 인 시각은 t=0');

  const v12 = (t) => t * t - 4 * t + 3;
  let lo12 = null, hi12 = null;
  for (let t = 0.0001; t <= 8; t = Math.round((t + 0.0001) * 1e7) / 1e7) if (v12(t) < 0) { if (lo12 === null) lo12 = t; hi12 = t; }
  chk(12, Math.round(lo12) + ' &lt; t &lt; ' + Math.round(hi12), '속도가 음수인 구간 ' + R6(lo12) + '~' + R6(hi12) + ' · v(1)=' + v12(1) + ' v(2)=' + v12(2) + ' v(3)=' + v12(3));

  /* 7. 속도와 가속도의 부호, 그리고 속력이 실제로 커지는지 */
  const x7 = (t) => t * t * t - 6 * t * t + 5;
  const v7 = D(x7, 3), a7 = (D(x7, 3 + 1e-3) - D(x7, 3 - 1e-3)) / 2e-3;
  const grow = Math.abs(D(x7, 3.5)) > Math.abs(D(x7, 3));
  chk(7, (v7 < 0 ? '음' : '양') + '의 방향으로 움직이며 속력이 ' + (grow ? '커지고' : '줄고') + ' 있다',
    'v(3)=' + R6(v7) + ' a(3)=' + R6(a7) + ' (부호 다름) · |v(3)|=' + R6(Math.abs(v7)) + ' → |v(3.5)|=' + R6(Math.abs(D(x7, 3.5))));

  /* 8. 최고점은 속도가 0 이 되는 자리 */
  const h8 = (t) => 40 * t - 5 * t * t;
  let mx8 = -Infinity, at8 = null;
  for (let t = 0; t <= 10; t = Math.round((t + 1e-4) * 1e7) / 1e7) { const y = h8(t); if (y > mx8) { mx8 = y; at8 = t; } }
  chk(8, Math.round(mx8) + ' m', '최고 높이 ' + R6(mx8) + ' m (t≈' + R6(at8) + ') · v(4)=' + R6(D(h8, 4)) + ' · 5t² 를 5t 로 보면 ' + (160 - 20));

  /* 10. 두 속도가 같아지는 시각 */
  let t10 = null;
  for (let t = 0; t <= 10; t = Math.round((t + 1e-4) * 1e7) / 1e7) if (Math.abs(D((u) => u * u - 2 * u, t) - D((u) => 4 * u, t)) < 1e-4) { t10 = R6(t); break; }
  chk(10, 't = ' + Math.round(t10), '속도가 같아지는 시각 ' + t10 + ' · 그때 v₁=' + R6(D((u) => u * u - 2 * u, t10)) + ' · 위치가 같아지는 시각은 t=0 과 6');
};
