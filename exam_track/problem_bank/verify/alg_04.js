/* alg_04 검산 — 일반각·호도법·삼각함수의 정의. 정답키를 문항의 풀이와 다른 경로로 다시 만든다.
 *   · 부채꼴은 공식을 쓰지 않고 θ·r 을 격자로 훑어 조건을 만족하는 값을 찾는다.
 *   · 사분면 조건이 붙은 값은 각 θ 를 0~2π 로 훑어 조건을 만족하는 각에서 직접 계산한다.
 *   · 각의 변환식은 후보 식을 여러 θ 에 넣어 전부 일치하는 것을 고른다.
 */
module.exports = function ({ chk }) {
  const R6 = (v) => Math.round(v * 1e6) / 1e6;
  const M = (v) => String(v).replace('-', '−');
  const gcd = (a, b) => (b ? gcd(b, a % b) : a);
  /* 소수를 기약분수 문구로 — 분모 1이면 정수, 아니면 a/b */
  const frac = (v) => {
    for (let d = 1; d <= 400; d++) {
      const n = v * d;
      if (Math.abs(n - Math.round(n)) < 1e-7 * d) {   // 분모가 커질수록 허용 오차도 비례해 늘린다
        const g = gcd(Math.abs(Math.round(n)), d) || 1;
        const num = Math.round(n) / g, den = d / g;
        return den === 1 ? M(num) : M(num) + '/' + den;
      }
    }
    return String(v);
  };
  const scan = (lo, hi, st, fn) => { for (let x = lo; x <= hi + 1e-12; x = R6(x + st)) fn(R6(x)); };

  /* 1. 넓이 조건을 만족하는 중심각을 격자로 찾는다 */
  let th1 = null;
  scan(0.001, 6.283, 0.000005, (t) => { if (th1 === null && Math.abs(0.5 * 9 * t - 6 * Math.PI) < 1e-5) th1 = t; });
  const r1 = th1 / Math.PI;                       // π의 몇 배인가
  chk(1, frac(Math.round(r1 * 12) / 12).replace('/', 'π/'), 'θ=' + R6(th1) + ' = ' + R6(r1) + 'π · 그때 l=rθ=' + R6(3 * th1) + ' · S=½rl=' + R6(0.5 * 3 * 3 * th1));

  /* 2. 360°씩 더해 조건 구간에 들어오는 각 */
  let a2 = -480; while (a2 < 0) a2 += 360; while (a2 >= 360) a2 -= 360;
  chk(2, a2 + '°', '−480 + 360n 중 0 이상 360 미만 = ' + a2 + ' · 240 − 720 = ' + (240 - 720));

  /* 3·4·6·12. 동경 위의 점 또는 사분면 조건에서 각을 직접 찾아 계산한다 */
  const S3 = 6 / 10, C3 = -8 / 10;
  chk(3, frac(S3 - C3), 'r=' + Math.hypot(-8, 6) + ' · sin=' + S3 + ' cos=' + C3 + ' · 차 ' + R6(S3 - C3) + ' 합 ' + R6(S3 + C3));

  const t4 = 2 * Math.PI + Math.atan(-3 / 4);              // 제4사분면의 각
  const s4 = Math.sin(t4);
  chk(4, frac(Math.round(s4 * 1e9) / 1e9), '각 ' + R6(t4) + ' rad(제4사분면) · tan=' + R6(Math.tan(t4)) + ' · sin=' + R6(s4) + ' cos=' + R6(Math.cos(t4)));

  const t6 = Math.PI + Math.atan(2);                       // 제3사분면의 각
  const p6 = Math.sin(t6) * Math.cos(t6);
  chk(6, frac(Math.round(p6 * 1e9) / 1e9), '각 ' + R6(t6) + ' rad(제3사분면) · tan=' + R6(Math.tan(t6)) + ' · sin·cos=' + R6(p6));

  const t12 = Math.PI - Math.asin(8 / 17);                 // 제2사분면의 각
  const v12 = (Math.sin(t12) - Math.cos(t12)) / (Math.sin(t12) + Math.cos(t12));
  chk(12, frac(Math.round(v12 * 1e7) / 1e7), '각 ' + R6(t12) + ' rad(제2사분면) · sin=' + R6(Math.sin(t12)) + ' cos=' + R6(Math.cos(t12)) + ' · 식의 값 ' + R6(v12));

  /* 5·8·11. 후보 식을 여러 θ 에 넣어 전부 일치하는 것을 고른다 */
  const pick = (target, cand) => {
    const keys = Object.keys(cand);
    return keys.filter((k) => {
      let ok = true;
      [0.3, 0.7, 1.1, 2.2, 3.5, 4.4, 5.5].forEach((t) => { if (!(Math.abs(cand[k](t) - target(t)) < 1e-9)) ok = false; });
      return ok;
    });
  };
  const t5 = (t) => Math.sin(Math.PI - t) + Math.cos(Math.PI / 2 - t);
  const h5 = pick(t5, {
    '2 sin θ': (t) => 2 * Math.sin(t), '0': () => 0,
    'sin θ + cos θ': (t) => Math.sin(t) + Math.cos(t), 'sin 2θ': (t) => Math.sin(2 * t),
  });
  chk(5, h5[0] || '없음', 'θ=1.1 에서 원식 ' + R6(t5(1.1)) + ' · 일치 후보 ' + h5.join(', '));

  const t8 = (t) => Math.tan(-t);
  const h8 = pick(t8, {
    '−tan θ': (t) => -Math.tan(t), 'tan θ': (t) => Math.tan(t),
    '1/tan θ': (t) => 1 / Math.tan(t), '−1/tan θ': (t) => -1 / Math.tan(t),
  });
  chk(8, h8[0] || '없음', 'θ=0.7 에서 tan(−θ)=' + R6(t8(0.7)) + ' · 일치 후보 ' + h8.join(', '));

  const t11 = (t) => Math.sin(Math.PI + t) * Math.cos(Math.PI / 2 - t) + Math.cos(Math.PI - t) * Math.sin(Math.PI / 2 + t);
  const vals11 = [0.3, 1.1, 2.2, 4.4].map((t) => R6(t11(t)));
  chk(11, M(Math.round(vals11[0])), 'θ=0.3·1.1·2.2·4.4 에서 값 ' + vals11.join(', ') + ' (θ에 무관하게 일정)');

  /* 7. 두 값을 수치로 더하고 √ 문구로 되돌린다 */
  const surd = (v) => {
    for (const m of [1, 2, 3, 5, 6]) {
      for (let d = 1; d <= 4; d++) {
        const n = v * d / Math.sqrt(m);
        if (Math.abs(n - Math.round(n)) < 1e-9) {
          const k = Math.round(n); if (k === 0) continue;
          const head = m === 1 ? M(k) : (Math.abs(k) === 1 ? (k < 0 ? '−' : '') : M(k)) + '√' + m;
          return d === 1 ? head : head + '/' + d;
        }
      }
    }
    return String(R6(v));
  };
  const v7 = Math.sin(4 * Math.PI / 3) + Math.cos(7 * Math.PI / 6);
  chk(7, surd(Math.round(v7 * 1e9) / 1e9), 'sin(4π/3)=' + R6(Math.sin(4 * Math.PI / 3)) + ' cos(7π/6)=' + R6(Math.cos(7 * Math.PI / 6)) + ' 합 ' + R6(v7));

  /* 9. 반지름을 격자로 훑어 넓이의 최댓값을 찾는다 */
  let mx9 = -Infinity, at9 = null;
  scan(0.001, 9.999, 0.0002, (r) => { const l = 20 - 2 * r; const S = 0.5 * r * l; if (S > mx9) { mx9 = S; at9 = r; } });
  chk(9, String(Math.round(mx9)), '최댓값 ' + R6(mx9) + ' (r=' + R6(at9) + ', l=' + R6(20 - 2 * at9) + ', θ=' + R6((20 - 2 * at9) / at9) + ' rad)');

  /* 10. sinθ − cosθ = 1/2 인 각을 찾아 곱을 직접 계산한다 */
  let p10 = null;
  scan(0, 6.2831, 0.000005, (t) => { if (p10 === null && Math.abs(Math.sin(t) - Math.cos(t) - 0.5) < 1e-6) p10 = Math.sin(t) * Math.cos(t); });
  chk(10, frac(Math.round(p10 * 1e5) / 1e5), 'sinθ−cosθ=1/2 인 각에서 sinθcosθ=' + R6(p10));
};
