/* cal1_04 검산 — 접선과 평균값 정리. 공식 대신 수치 미분과 교점 탐색으로 다시 계산한다.
 *   · 미분계수는 정의(중앙차분)로 재고, 접선은 그 값으로 만든 뒤 곡선과의 차를 훑어 접·교차를 확인한다.
 *   · 곡선 밖의 점에서 그은 접선은 접점 후보 t 를 격자로 훑어 그 점을 지나는 것을 찾는다.
 *   · 롤·평균값 정리의 c 는 f'(x) = (목표 기울기) 가 되는 x 를 구간 안에서 훑어 찾는다.
 */
module.exports = function ({ chk }) {
  const R6 = (v) => Math.round(v * 1e6) / 1e6, M = (v) => String(v).replace('-', '−');
  const gcd = (a, b) => (b ? gcd(b, a % b) : a);
  const frac = (v) => {
    for (let d = 1; d <= 200; d++) { const n = v * d; if (Math.abs(n - Math.round(n)) < 1e-6 * d) { const g = gcd(Math.abs(Math.round(n)), d) || 1; const num = Math.round(n) / g, den = d / g; return den === 1 ? M(num) : M(num) + '/' + den; } }
    return String(R6(v));
  };
  /* 중앙차분. h 가 너무 작으면 f′ 이 0 에 가까운 자리에서 자릿수 소실로 값이 노이즈가 된다 —
     그런 자리를 찾을 때는 h 를 키워 쓴다. */
  const Dh = (f, a, h) => (f(a + h) - f(a - h)) / (2 * h);
  const D = (f, a) => Dh(f, a, 1e-6);
  /* 구간에서 f'(x) = m 이 되는 x 를 모두 찾는다 — 부호 변화 구간을 이분법으로 좁힌다 */
  const solveD = (f, m, lo, hi) => {
    const g = (x) => Dh(f, x, 1e-4) - m, out = [], N = 4000, step = (hi - lo) / N;
    for (let i = 0; i < N; i++) {
      let a = lo + i * step, b = a + step;
      if (g(a) * g(b) >= 0) continue;
      for (let k = 0; k < 60; k++) { const c = (a + b) / 2; if (g(a) * g(c) <= 0) b = c; else a = c; }
      out.push(Math.round(((a + b) / 2) * 1e6) / 1e6);
    }
    return out;
  };

  /* 1·4. 접점의 좌표와 미분계수로 접선을 만든다 */
  const f1 = (x) => x * x - 4 * x, m1 = D(f1, 3), c1 = f1(3) - m1 * 3;
  chk(1, 'y = ' + Math.round(m1) + 'x ' + (c1 < 0 ? '− ' : '+ ') + Math.abs(Math.round(c1)),
    '접점 (3, ' + f1(3) + ') · 기울기 ' + R6(m1) + ' · y절편 ' + R6(c1));

  const f4 = (x) => x * x + 1, m4 = D(f4, 2), c4 = f4(2) - m4 * 2;
  chk(4, frac(-c4 / m4), '접선 y = ' + R6(m4) + 'x + ' + R6(c4) + ' · y=0 인 x=' + R6(-c4 / m4) + ' · y절편은 ' + R6(c4));

  /* 2·6. 기울기가 같아지는 접점을 훑는다 */
  const f2 = (x) => x * x * x - 2 * x;
  const t2 = solveD(f2, 10, -5, 5).sort((p, q) => q - p);
  chk(2, t2.map((t) => '(' + M(Math.round(t)) + ', ' + M(Math.round(f2(Math.round(t)))) + ')').join(' 와 '),
    '기울기 10 이 되는 x = ' + t2.join(', ') + ' · 그때 y = ' + t2.map((t) => R6(f2(t))).join(', '));

  const f6 = (x) => x * x * x - 3 * x * x + 2;
  const t6 = solveD(f6, D(f6, 3), -5, 6).filter((t) => Math.abs(t - 3) > 0.01);
  chk(6, M(Math.round(t6[0])), '점 (3,' + f6(3) + ') 의 접선 기울기 ' + R6(D(f6, 3)) + ' · 같은 기울기의 다른 접점 x = ' + t6.join(',') +
    ' · 함숫값이 같은 점을 찾으면 x = 0 (f(0)=' + f6(0) + ')');

  /* 3. 접점 후보를 훑어 (0,−9) 를 지나는 접선을 찾는다 */
  const f3 = (x) => x * x, hit3 = [];
  for (let t = -6; t <= 6; t = Math.round((t + 0.0001) * 1e4) / 1e4) {
    const m = D(f3, t), y0 = f3(t) + m * (0 - t);          // 접선이 x=0 에서 갖는 값
    if (Math.abs(y0 + 9) < 1e-4) hit3.push(R6(t));
  }
  const ms3 = hit3.map((t) => Math.round(D(f3, t)));
  chk(3, M(ms3[0] * ms3[1]), '접점 t = ' + hit3.join(', ') + ' · 기울기 ' + ms3.join(', ') + ' · 곱 ' + (ms3[0] * ms3[1]) + ' · t 의 곱은 ' + R6(hit3[0] * hit3[1]));

  /* 5·8·11. 롤·평균값 정리의 c */
  const f5 = (x) => x * x - 4 * x, avg5 = (f5(5) - f5(1)) / 4;
  chk(5, String(Math.round(solveD(f5, avg5, 1, 5)[0])), 'f(1)=' + f5(1) + ' f(5)=' + f5(5) + ' 평균변화율 ' + R6(avg5) + ' · f′(c)=평균변화율 인 c=' + solveD(f5, avg5, 1, 5).join(',') + ' · f′(c)=0 이면 c=' + solveD(f5, 0, 1, 5).join(','));

  const f8 = (x) => x * x - 6 * x;
  chk(8, String(Math.round(solveD(f8, 0, 1, 5)[0])), 'f(1)=' + f8(1) + ' f(5)=' + f8(5) + ' 로 같다 · f′(c)=0 인 c=' + solveD(f8, 0, 1, 5).join(','));

  const f11 = (x) => x * x * x, avg11 = (f11(3) - f11(0)) / 3;
  const c11 = solveD(f11, avg11, 0, 3);
  chk(11, Math.abs(c11[0] * c11[0] - 3) < 1e-3 ? '√3' : R6(c11[0]) + '', '평균변화율 ' + R6(avg11) + ' · 구간 안의 c=' + c11.join(',') + ' · c²=' + R6(c11[0] * c11[0]) + ' → √3 ≈ ' + R6(Math.sqrt(3)));

  /* 7. 접하게 하는 k 를 격자로 찾는다 — 두 곡선의 차가 꼭 한 번만 0 이 되는 자리 */
  let k7 = null;
  for (let k = -12; k <= 12; k += 0.5) {
    const g = (x) => x * x - 3 * x - (x + k);               // 곡선 − 직선
    let mn = Infinity;
    for (let x = -10; x <= 10; x = Math.round((x + 0.0005) * 1e4) / 1e4) { const v = g(x); if (v < mn) mn = v; }
    if (Math.abs(mn) < 1e-6) k7 = k;                        // 최솟값이 0 이면 닿기만 하고 가로지르지 않는다
  }
  chk(7, M(k7), 'k=' + k7 + ' 일 때 두 그래프가 만나되 가로지르지 않는다 · 접점 x=' + R6(solveD((x) => x * x - 3 * x, 1, -5, 5)[0]) + ' 그때 y=' + R6((2) * (2) - 3 * 2));

  /* 9. 접선과 곡선의 차가 0 이 되는 다른 자리 */
  const f9 = (x) => x * x * x, m9 = D(f9, 1), L9 = (x) => f9(1) + m9 * (x - 1);
  const hit9 = [];
  for (let x = -5; x <= 5; x = Math.round((x + 0.0001) * 1e4) / 1e4) if (Math.abs(f9(x) - L9(x)) < 1e-6 && Math.abs(x - 1) > 0.01) hit9.push(R6(x));
  chk(9, M(Math.round(hit9[0])), '접선 y=' + R6(m9) + 'x' + R6(f9(1) - m9) + ' · 접점 말고 다시 만나는 x = ' + hit9.join(',') + ' (그때 곡선 ' + R6(f9(hit9[0])) + ' = 접선 ' + R6(L9(hit9[0])) + ')');

  /* 10. 두 점을 잇는 기울기와 같은 미분계수 */
  const f10 = (x) => x * x, m10 = (f10(4) - f10(1)) / 3;
  chk(10, frac(Math.round(solveD(f10, m10, 1, 4)[0] * 1e4) / 1e4), 'AB 기울기 ' + R6(m10) + ' · f′(x)=그 값이 되는 x=' + solveD(f10, m10, 1, 4).join(','));

  /* 12. 뾰족점에서 좌·우 미분계수가 다른 것을 확인한다 */
  const f12 = (x) => Math.abs(x - 2);
  const dl = (f12(2) - f12(2 - 1e-6)) / 1e-6, dr = (f12(2 + 1e-6) - f12(2)) / 1e-6;
  /* 뾰족점에서 중앙차분은 (h − h)/2h = 0 을 돌려준다. 그것은 수치 미분의 인공물이지 f′(2) 가 아니다 —
     실제로 f′ 은 존재하는 곳에서 −1 또는 1 뿐이라 0 이 되는 자리가 없다. */
  let zero12 = 0;
  for (let x = 0.01; x <= 3.99; x += 0.001) { const d = (f12(x + 1e-4) - f12(x - 1e-4)) / 2e-4; if (Math.abs(d) < 0.9 && Math.abs(x - 2) > 0.01) zero12++; }
  chk(12, Math.abs(dl - dr) > 1e-3 ? 'x = 2 에서 미분가능하지 않아 평균값 정리를 적용할 수 없다' : '적용할 수 있다',
    '좌미분계수 ' + R6(dl) + ' 우미분계수 ' + R6(dr) + ' · f(0)=' + f12(0) + ' f(4)=' + f12(4) + ' 로 같다 · 뾰족점을 뺀 곳에서 |f′| 이 1 이 아닌 자리 ' + zero12 + '개 → f′(c)=0 인 c 가 없다');
};
