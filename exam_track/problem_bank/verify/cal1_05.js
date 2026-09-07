/* cal1_05 검산 — 증가·감소와 극대·극소. 도함수 공식을 쓰지 않고 값을 훑어 판정한다.
 *   · 증가·감소는 x 를 잘게 훑으며 f 의 값이 오르는지 내리는지 직접 본다.
 *   · 극값은 f 의 값이 오르내림을 바꾸는 자리를 찾아 센다(f' 을 풀지 않는다).
 *   · 최대·최소는 구간을 격자로 훑어 찾는다.
 *   · 조건을 만족하는 상수는 격자로 찾고, 교점 개수는 부호 변화를 세어 확인한다.
 */
module.exports = function ({ chk }) {
  const R6 = (v) => Math.round(v * 1e6) / 1e6, M = (v) => String(v).replace('-', '−');
  /* f 의 값이 오르내림을 바꾸는 자리를 찾는다. 반환: [{x, kind}] */
  const turns = (f, lo, hi, step) => {
    step = step || 1e-4; const out = [];
    let prev = f(lo + step) - f(lo);
    for (let x = lo + step; x <= hi - step; x = Math.round((x + step) * 1e7) / 1e7) {
      const cur = f(x + step) - f(x);
      if (prev < 0 && cur > 0) out.push({ x: R6(x), kind: '극소' });
      if (prev > 0 && cur < 0) out.push({ x: R6(x), kind: '극대' });
      prev = cur;
    }
    return out;
  };
  /* 구간에서 f 가 줄어드는 구간의 양 끝 */
  const decRange = (f, lo, hi) => {
    let a = null, b = null;
    for (let x = lo; x <= hi; x = Math.round((x + 1e-4) * 1e7) / 1e7) {
      if (f(x + 1e-4) < f(x)) { if (a === null) a = x; b = x; }
    }
    return [R6(a), R6(b)];
  };
  const minmax = (f, lo, hi) => {
    let mx = -Infinity, mn = Infinity, ax = null, an = null;
    for (let x = lo; x <= hi; x = Math.round((x + 1e-4) * 1e7) / 1e7) { const y = f(x); if (y > mx) { mx = y; ax = x; } if (y < mn) { mn = y; an = x; } }
    return { mx: R6(mx), mn: R6(mn), ax: R6(ax), an: R6(an) };
  };

  /* 1. 줄어드는 구간을 값으로 직접 읽는다 */
  const r1 = decRange((x) => x * x * x - 12 * x, -6, 6);
  chk(1, M(Math.round(r1[0])) + ' ≤ x ≤ ' + M(Math.round(r1[1])),
    '값이 줄어드는 구간 ' + r1.join('~') + ' · f(−2)=' + ((-2) ** 3 - 12 * (-2)) + ' f(0)=0 f(2)=' + (8 - 24) + ' · x²=12 로 보면 ±' + R6(Math.sqrt(12)));

  /* 2·11. 오르내림이 바뀌는 자리와 그때의 값 */
  const f2 = (x) => x * x * x - 3 * x * x - 9 * x;
  const t2 = turns(f2, -6, 8);
  const mx2 = t2.find((t) => t.kind === '극대');
  chk(2, String(Math.round(f2(Math.round(mx2.x)))), '오르내림이 바뀌는 자리 ' + t2.map((t) => t.kind + ' x≈' + t.x).join(', ') + ' · 극댓값 ' + R6(f2(-1)) + ' 극솟값 ' + R6(f2(3)));

  const f11 = (x) => 2 * x * x * x - 9 * x * x + 12 * x;
  const t11 = turns(f11, -3, 6);
  chk(11, String(Math.round(t11.find((t) => t.kind === '극대').x)),
    t11.map((t) => t.kind + ' x≈' + t.x).join(', ') + ' · 극댓값 ' + R6(f11(1)) + ' · f′ 의 두 근의 한가운데는 1.5');

  /* 3·9. 극댓값·극솟값을 직접 읽는다 */
  const f3 = (x) => 2 * x * x * x - 3 * x * x - 12 * x + 5;
  const t3 = turns(f3, -5, 6);
  const M3 = f3(Math.round(t3.find((t) => t.kind === '극대').x)), m3 = f3(Math.round(t3.find((t) => t.kind === '극소').x));
  chk(3, String(Math.round(M3 - m3)), '극댓값 ' + R6(M3) + ' 극솟값 ' + R6(m3) + ' · 차 ' + R6(M3 - m3) + ' 합 ' + R6(M3 + m3));

  const f9 = (x) => Math.pow(x, 4) - 4 * Math.pow(x, 3);
  const t9 = turns(f9, -3, 6);
  chk(9, M(Math.round(f9(Math.round(t9.find((t) => t.kind === '극소').x)))),
    '오르내림이 바뀌는 자리 ' + t9.map((t) => t.kind + ' x≈' + t.x).join(', ') + ' · x=0 에서는 바뀌지 않는다(f(−0.1)=' + R6(f9(-0.1)) + ' f(0)=0 f(0.1)=' + R6(f9(0.1)) + ')');

  /* 4·8. 극값의 개수와 자리 */
  /* f′ 이 주어졌으므로 f′ 의 부호가 바뀌는 자리를 직접 훑는다 */
  const d4 = (x) => (x + 1) * (x - 2) * (x - 2);
  /* 격자가 근에 정확히 걸리면 곱이 0 이 되어 부호 변화를 놓치므로 무리수 간격으로 훑는다 */
  const sw4 = []; let pv4 = d4(-3);
  for (let i = 1; i <= 100000; i++) { const x = -3 + i * 0.00007123; if (x > 4) break; const cv = d4(x); if (pv4 * cv < 0) sw4.push(R6(x)); pv4 = cv; }
  chk(4, sw4.length === 1 ? 'x = ' + M(Math.round(sw4[0])) + ' 뿐이다' : sw4.map((v) => 'x = ' + M(Math.round(v))).join(' 과 ') + ' 다',
    "f′ 의 부호가 바뀌는 자리 " + sw4.join(', ') + ' · f′(−1.1)=' + R6(d4(-1.1)) + ' f′(−0.9)=' + R6(d4(-0.9)) + ' (바뀜) · f′(1.9)=' + R6(d4(1.9)) + ' f′(2.1)=' + R6(d4(2.1)) + ' (안 바뀜)');

  const f8 = (x) => x * x * x + 3 * x * x + 3 * x + 1;
  const t8 = turns(f8, -6, 6);
  chk(8, t8.length + '개', '오르내림이 바뀌는 자리 ' + (t8.length ? t8.map((t) => t.kind + ' x≈' + t.x).join(', ') : '없다') + ' · f(x)=(x+1)³ 이라 계속 증가한다');

  /* 5. 닫힌 구간의 최대·최소 */
  const s5 = minmax((x) => x * x * x - 3 * x * x + 2, -1, 3);
  chk(5, String(Math.round(s5.mx)), '최댓값 ' + s5.mx + ' (x≈' + s5.ax + ') · 최솟값 ' + s5.mn + ' (x≈' + s5.an + ') · f(3)=' + (27 - 27 + 2));

  /* 6·7·12. 조건을 만족하는 상수를 격자로 찾는다 */
  let k6 = null;
  for (let k = -20; k <= 20; k += 0.5) {
    const f = (x) => x * x * x - 3 * x * x + k;
    const t = turns(f, -3, 5);
    const mn = t.find((v) => v.kind === '극소');
    if (mn && Math.abs(f(Math.round(mn.x)) - 5) < 1e-6) k6 = k;
  }
  chk(6, String(k6), 'k=' + k6 + ' 에서 극솟값 ' + R6(8 - 12 + k6) + ' · 극댓값은 f(0)=' + k6);

  let a7 = null, b7 = null;
  for (let a = -12; a <= 12; a += 0.5) for (let b = -12; b <= 12; b += 0.5) {
    const f = (x) => x * x * x + a * x * x + b * x;
    if (Math.abs(f(1) - 4) > 1e-9) continue;
    const t = turns(f, -4, 6);
    const mx = t.find((v) => v.kind === '극대');
    if (mx && Math.abs(mx.x - 1) < 5e-3) { a7 = a; b7 = b; }
  }
  chk(7, M(a7 * b7), 'a=' + a7 + ', b=' + b7 + ' · f(1)=' + (1 + a7 + b7) + ' 이고 x=1 이 극대 · 곱 ' + (a7 * b7) + ' 합 ' + (a7 + b7));

  let a12 = null;
  for (let a = -12; a <= 12; a += 0.5) {
    const f = (x) => x * x * x + 3 * x * x + a * x + 1;
    let inc = true;
    for (let x = -8; x <= 8; x += 1e-3) if (f(x + 1e-3) < f(x) - 1e-12) inc = false;
    if (inc && a12 === null) a12 = a;
  }
  chk(12, String(a12), '실수 전체에서 증가하는 가장 작은 a = ' + a12 + ' · a=2.5 이면 줄어드는 구간이 생긴다 · a=3 일 때 f′=3(x+1)² ≥ 0');

  /* 10. 교점 개수를 부호 변화로 센다 */
  const cross = (k) => {
    const f = (x) => x * x * x - 3 * x * x - 9 * x + k;
    /* 격자가 근에 정확히 걸리면 부호 변화를 놓치므로 무리수 간격으로 훑는다 */
    const st = 0.0007123, N = Math.round(40 / st);
    let c = 0, prev = f(-20);
    for (let i = 1; i <= N; i++) { const cur = f(-20 + i * st); if (prev * cur < 0) c++; prev = cur; }
    return c;
  };
  const ks = []; for (let k = -60; k <= 60; k++) if (cross(k) === 3) ks.push(k);
  chk(10, ks.length + '개', '세 점에서 만나는 정수 k = ' + ks[0] + ' … ' + ks[ks.length - 1] + ' 로 ' + ks.length + '개 · k=−5 는 ' + cross(-5) + '점, k=27 은 ' + cross(27) + '점');
};
