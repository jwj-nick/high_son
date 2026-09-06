/* alg_06 검산 — 사인법칙·코사인법칙. 법칙을 쓰지 않고 좌표기하로 다시 계산한다.
 *   · 삼각형을 좌표평면에 직접 놓고 거리 공식으로 변을, 내적으로 각의 코사인을, 신발끈 공식으로 넓이를 구한다.
 *   · 외접원의 반지름은 수직이등분선의 교점(외심)까지의 거리로 잰다.
 *   · 조건식을 만족하는 삼각형은 꼭짓점을 격자로 훑어 찾는다.
 */
module.exports = function ({ chk, solveLinear2 }) {
  const PI = Math.PI, R6 = (v) => Math.round(v * 1e6) / 1e6, M = (v) => String(v).replace('-', '−');
  const gcd = (a, b) => (b ? gcd(b, a % b) : a);
  const D = (p, q) => Math.hypot(p[0] - q[0], p[1] - q[1]);
  const rad = (d) => d * PI / 180;
  /* 꼭짓점 P 에서의 각의 코사인 — 내적으로 */
  const cosAt = (P, Q, R) => {
    const u = [Q[0] - P[0], Q[1] - P[1]], v = [R[0] - P[0], R[1] - P[1]];
    return (u[0] * v[0] + u[1] * v[1]) / (Math.hypot(...u) * Math.hypot(...v));
  };
  const shoelace = (pts) => {
    let s = 0; for (let i = 0; i < pts.length; i++) { const j = (i + 1) % pts.length; s += pts[i][0] * pts[j][1] - pts[j][0] * pts[i][1]; }
    return Math.abs(s) / 2;
  };
  const frac = (v) => {
    for (let d = 1; d <= 400; d++) { const n = v * d; if (Math.abs(n - Math.round(n)) < 1e-5 * d) { const g = gcd(Math.abs(Math.round(n)), d) || 1; const num = Math.round(n) / g, den = d / g; return den === 1 ? M(num) : M(num) + '/' + den; } }
    return String(R6(v));
  };
  /* n√m 문구 — 근호 안의 수를 작은 것부터 맞춰 본다 */
  const surd = (v) => {
    for (const m of [1, 2, 3, 5, 6, 7, 10]) {
      const n = v / Math.sqrt(m);
      if (Math.abs(n - Math.round(n)) < 1e-9) { const k = Math.round(n); return m === 1 ? String(k) : (k === 1 ? '' : k) + '√' + m; }
    }
    return String(R6(v));
  };

  /* 1. 두 각과 한 변 — 두 반직선의 교점으로 삼각형을 만들고 거리 공식으로 잰다 */
  const B1 = [0, 0], C1 = [1, 0];
  const [t1, s1] = solveLinear2(Math.cos(rad(45)), -Math.cos(rad(60)), 1, Math.sin(rad(45)), -Math.sin(rad(60)), 0);
  const A1 = [t1 * Math.cos(rad(45)), t1 * Math.sin(rad(45))];
  const b0 = D(A1, C1), c0 = D(A1, B1);
  chk(1, surd(6 * c0 / b0), 'b:c = ' + R6(b0) + ':' + R6(c0) + ' → b=6 이면 c=' + R6(6 * c0 / b0) + ' (s=' + R6(s1) + ')');

  /* 2·10. 두 변과 끼인각 — 좌표로 놓고 거리 공식 */
  const C2 = [0, 0], A2 = [10, 0], B2 = [6 * Math.cos(rad(120)), 6 * Math.sin(rad(120))];
  chk(2, String(Math.round(Math.pow(D(A2, B2), 2))), 'B=(' + R6(B2[0]) + ',' + R6(B2[1]) + ') · c=' + R6(D(A2, B2)) + ' · c²=' + R6(Math.pow(D(A2, B2), 2)));

  const A10 = [0, 0], B10 = [15, 0], C10 = [8 * Math.cos(rad(60)), 8 * Math.sin(rad(60))];
  chk(10, surd(D(B10, C10)), 'C=(' + R6(C10[0]) + ',' + R6(C10[1]) + ') · a=' + R6(D(B10, C10)) + ' · √(b²+c²)=' + R6(Math.hypot(8, 15)));

  /* 3·6·11. 세 변에서 각 — 꼭짓점을 수치로 찾아 내적으로 잰다 */
  const build = (a, b, c) => {                       // A=(0,0), B=(c,0), |CA|=b, |CB|=a
    let best = null, err = Infinity;
    for (let th = 0; th < PI; th += 1e-6) { const C = [b * Math.cos(th), b * Math.sin(th)]; const e = Math.abs(D(C, [c, 0]) - a); if (e < err) { err = e; best = C; } }
    return best;
  };
  const C3 = build(4, 9, 11);
  chk(3, frac(Math.round(cosAt(C3, [0, 0], [11, 0]) * 1e6) / 1e6), 'C=(' + R6(C3[0]) + ',' + R6(C3[1]) + ') · cos C=' + R6(cosAt(C3, [0, 0], [11, 0])) + ' · 4+9=13 &gt; 11 이라 삼각형이 만들어진다');

  const C6 = build(5, 7, 9);                          // 가장 긴 변 9 와 마주 보는 각은 원점 반대쪽 꼭짓점 C
  const cc6 = cosAt(C6, [0, 0], [9, 0]);
  chk(6, cc6 < -1e-9 ? '가장 큰 각이 둔각인 둔각삼각형이다' : (Math.abs(cc6) < 1e-9 ? '가장 큰 각이 직각인 직각삼각형이다' : '세 각이 모두 예각인 예각삼각형이다'),
    '가장 큰 각의 cos=' + R6(cc6) + ' · 5²+7²=' + (25 + 49) + ' vs 9²=' + 81);

  const C11 = build(4, 5, 6);                         // a=4, b=5, c=6 → 각 B 는 꼭짓점 B=(6,0)
  const sA = Math.sin(Math.acos(cosAt([0, 0], [6, 0], C11))), sB = Math.sin(Math.acos(cosAt([6, 0], [0, 0], C11))), sC = Math.sin(Math.acos(cosAt(C11, [0, 0], [6, 0])));
  chk(11, frac(Math.round(cosAt([6, 0], [0, 0], C11) * 1e6) / 1e6),
    'sinA:sinB:sinC = ' + [sA, sB, sC].map((v) => R6(v / sA * 4)).join(':') + ' (4:5:6 확인) · cos B=' + R6(cosAt([6, 0], [0, 0], C11)));

  /* 4·8·12. 넓이는 신발끈 공식으로 */
  const B4 = [6 * Math.cos(rad(150)), 6 * Math.sin(rad(150))];
  chk(4, String(Math.round(shoelace([[0, 0], [10, 0], B4]))), '세 점 (0,0),(10,0),(' + R6(B4[0]) + ',' + R6(B4[1]) + ') · 넓이 ' + R6(shoelace([[0, 0], [10, 0], B4])));

  const quad = (p1, q1) => {                          // 대각선 8·10 이 60°로 만나는 사각형 — 나누는 위치를 바꿔도 넓이는 같다
    const p2 = 8 - p1, q2 = 10 - q1, u = [Math.cos(rad(60)), Math.sin(rad(60))];
    return shoelace([[p1, 0], [q1 * u[0], q1 * u[1]], [-p2, 0], [-q2 * u[0], -q2 * u[1]]]);
  };
  chk(8, surd(quad(3, 4)), '분할 (3,4) 넓이 ' + R6(quad(3, 4)) + ' · 분할 (5,7) 넓이 ' + R6(quad(5, 7)) + ' · 수직일 때 40');

  let Cang = null;
  for (let th = 1e-5; th < PI; th += 1e-6) { const B = [6 * Math.cos(th), 6 * Math.sin(th)]; if (Math.abs(shoelace([[0, 0], [16, 0], B]) - 24) < 1e-4) { Cang = th; break; } }
  /* 격자 탐색이라 소수 넷째 자리에서 반올림한다 */
  chk(12, frac(Math.round(Math.sin(Cang) * 1e4) / 1e4), '넓이 24 가 되는 각 C=' + R6(Cang) + ' rad (' + R6(Cang * 180 / PI) + '°) · sin C=' + R6(Math.sin(Cang)));

  /* 5. 외심까지의 거리로 외접원의 반지름 */
  const B5 = [0, 0], C5 = [1, 0];
  const [t5] = solveLinear2(Math.cos(rad(45)), -Math.cos(rad(180 - 105)), 1, Math.sin(rad(45)), -Math.sin(rad(180 - 105)), 0);
  const A5raw = [t5 * Math.cos(rad(45)), t5 * Math.sin(rad(45))];   // B=45°, C=105° → A=30°
  const k5 = 4 / D(B5, C5);                                         // a = BC 를 4 로 맞춘다
  const P = [A5raw[0] * k5, A5raw[1] * k5], Q = [0, 0], Rr = [k5, 0];
  const [ox, oy] = solveLinear2(2 * (P[0] - Q[0]), 2 * (P[1] - Q[1]), P[0] ** 2 + P[1] ** 2 - Q[0] ** 2 - Q[1] ** 2,
    2 * (Rr[0] - Q[0]), 2 * (Rr[1] - Q[1]), Rr[0] ** 2 + Rr[1] ** 2 - Q[0] ** 2 - Q[1] ** 2);
  const R5 = D([ox, oy], Q);
  chk(5, Math.round(R5 * R5) + 'π', '외심(' + R6(ox) + ',' + R6(oy) + ') · R=' + R6(R5) + ' (세 꼭짓점까지 ' + [P, Q, Rr].map((v) => R6(D([ox, oy], v))).join(',') + ') · 넓이 ' + R6(R5 * R5) + 'π');

  /* 9. a cos B = b cos A 를 만족하는 삼각형을 꼭짓점 격자로 훑는다 */
  const hits = [];
  for (let x = -1.5; x <= 2.5; x += 0.002) for (let y = 0.05; y <= 2.5; y += 0.002) {
    const A = [0, 0], B = [1, 0], C = [x, y];
    const a = D(B, C), b = D(C, A);
    if (Math.abs(a * cosAt(B, A, C) - b * cosAt(A, B, C)) < 1e-5) hits.push([R6(a), R6(b)]);
  }
  const allEq = hits.every((h) => Math.abs(h[0] - h[1]) < 5e-3);
  chk(9, allEq ? 'a = b 인 이등변삼각형' : '조건이 a=b 를 강제하지 않는다',
    '조건을 만족한 삼각형 ' + hits.length + '개 · 전부 a≈b? ' + allEq + ' · 예: ' + hits.slice(0, 3).map((h) => 'a=' + h[0] + ',b=' + h[1]).join(' / '));

  /* 7. 세 식을 연립해 변의 비를 구하고, 그 삼각형에서 sin 의 비를 잰다 */
  const S = 24 / 2;                                   // (a+b)+(b+c)+(c+a) = 2(a+b+c) = 24 → a+b+c = 12
  const a7 = S - 8, b7 = S - 9, c7 = S - 7;
  const C7 = build(a7, b7, c7);
  const s7 = [Math.sin(Math.acos(cosAt([0, 0], [c7, 0], C7))), Math.sin(Math.acos(cosAt([c7, 0], [0, 0], C7))), Math.sin(Math.acos(cosAt(C7, [0, 0], [c7, 0])))];
  const g7 = s7.map((v) => Math.round(v / s7[0] * a7));
  chk(7, g7.join(' : '), 'a,b,c = ' + [a7, b7, c7].join(',') + ' · sin 비 ' + s7.map((v) => R6(v)).join(':') + ' → 정수비 ' + g7.join(':'));
};
