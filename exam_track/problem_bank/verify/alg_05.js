/* alg_05 검산 — 삼각함수의 그래프. 정답키를 문항의 풀이와 다른 경로로 다시 만든다.
 *   · 주기는 공식을 쓰지 않고 f(x + T) = f(x) 가 되는 가장 작은 T 를 후보 중에서 찾는다.
 *   · 평행이동량도 3sin(2(x − m)) 과 원식이 모든 x 에서 같아지는 m 을 찾아 확인한다.
 *   · 방정식의 해와 부등식의 구간은 격자 대입으로 읽고, 최대·최소는 격자 탐색으로 찾는다.
 */
module.exports = function ({ chk }) {
  const PI = Math.PI, R6 = (v) => Math.round(v * 1e6) / 1e6, M = (v) => String(v).replace('-', '−');
  const gcd = (a, b) => (b ? gcd(b, a % b) : a);
  /* π의 유리수 배를 문구로: 4π · π/6 · 7π/6 */
  const pfrac = (v) => {
    const r = v / PI;
    for (let d = 1; d <= 24; d++) {
      const n = r * d;
      if (Math.abs(n - Math.round(n)) < 1e-7 * d) {
        const g = gcd(Math.abs(Math.round(n)), d) || 1, num = Math.round(n) / g, den = d / g;
        const head = Math.abs(num) === 1 ? (num < 0 ? '−π' : 'π') : M(num) + 'π';
        return den === 1 ? head : head + '/' + den;
      }
    }
    return R6(v) + '';
  };
  const SAMP = [0.3, 1.1, 2.2, 4.4, 5.7];
  /* 후보 nπ/12 중 f(x+T)=f(x) 를 만족하는 가장 작은 T */
  const period = (f) => {
    for (let n = 1; n <= 60; n++) {
      const T = n * PI / 12;
      if (SAMP.every((x) => { const a = f(x), b = f(x + T); return isFinite(a) && isFinite(b) && Math.abs(a - b) < 1e-9; })) return T;
    }
    return NaN;
  };
  /* 0 이상 2π 미만에서 g(x)=0 인 해 — 후보 kπ/24 를 전수 대입 */
  const roots = (g) => {
    const out = [];
    for (let k = 0; k < 48; k++) { const x = k * PI / 24; if (Math.abs(g(x)) < 1e-12) out.push(x); }
    return out;
  };
  const scan = (lo, hi, st, fn) => { for (let x = lo; x <= hi + 1e-12; x = Math.round((x + st) * 1e7) / 1e7) fn(x); };

  /* 1. 주기는 반복으로, 최댓값은 격자 탐색으로 */
  const f1 = (x) => 4 * Math.sin(x / 2);
  let mx1 = -Infinity; scan(0, 30, 0.0002, (x) => { if (f1(x) > mx1) mx1 = f1(x); });
  chk(1, '주기 ' + pfrac(period(f1)) + ', 최댓값 ' + Math.round(mx1),
    'f(x+T)=f(x) 인 최소 T=' + R6(period(f1)) + ' · 격자 최댓값 ' + R6(mx1));

  /* 2. tan 의 주기와, 값이 발산하는 자리(점근선) */
  const f2 = (x) => Math.tan(x / 2);
  let as2 = null, pv2 = Math.cos(0.0005);
  scan(0.001, 12, 0.0005, (x) => { const cv = Math.cos(x / 2); if (as2 === null && pv2 * cv < 0) as2 = Math.round(x / (PI / 24)) * (PI / 24); pv2 = cv; });
  chk(2, '주기 ' + pfrac(period(f2)) + ', 점근선 x = ' + pfrac(as2) + ' + 2nπ',
    '최소 T=' + R6(period(f2)) + ' · 처음 발산하는 자리 ' + R6(as2) + ' (그 직전 값 ' + R6(f2(as2 - 0.001)) + ')');

  /* 3·8·11. 방정식의 해를 전수 대입으로 */
  const r3 = roots((x) => 2 * Math.cos(x) + Math.sqrt(3));
  chk(3, pfrac(Math.max(...r3)), '해 ' + r3.map(pfrac).join(', ') + ' · 가장 큰 것 ' + R6(Math.max(...r3)));

  const r8 = roots((x) => (Math.abs(Math.cos(x)) < 1e-12 ? 1 : Math.tan(x) + 1));
  const s8 = r8.reduce((s, v) => s + v, 0);
  chk(8, pfrac(s8), '해 ' + r8.map(pfrac).join(', ') + ' · 합 ' + R6(s8) + ' · 두 해의 차 ' + pfrac(r8[1] - r8[0]));

  const r11 = roots((x) => 2 * Math.cos(x) * Math.cos(x) + 3 * Math.sin(x) - 3);
  const s11 = r11.reduce((s, v) => s + v, 0);
  chk(11, pfrac(s11), '해 ' + r11.map(pfrac).join(', ') + ' · 합 ' + R6(s11) + ' = ' + pfrac(s11));

  /* 4·12. 조건을 만족하는 계수를 격자로 찾는다 */
  let A4 = null, B4 = null, C4 = null;
  for (let a = 0.5; a <= 10; a += 0.5) for (let c = -6; c <= 6; c += 0.5) for (let b = 0.5; b <= 8; b += 0.5) {
    let mx = -Infinity, mn = Infinity;
    scan(0, 20, 0.002, (x) => { const y = a * Math.cos(b * x) + c; if (y > mx) mx = y; if (y < mn) mn = y; });
    if (Math.abs(mx - 5) < 1e-6 && Math.abs(mn + 3) < 1e-6 && Math.abs(period((x) => a * Math.cos(b * x) + c) - PI) < 1e-9) { A4 = a; B4 = b; C4 = c; }
  }
  chk(4, String(A4 + B4 + C4), 'a=' + A4 + ' b=' + B4 + ' c=' + C4 + ' → 합 ' + (A4 + B4 + C4));

  const hit12 = [];
  for (let a = 0.5; a <= 6; a += 0.5) for (let b = 0.5; b <= 10; b += 0.5) {
    let mx = -Infinity;
    scan(0, 2 * PI, 0.0001, (x) => { const y = a * Math.sin(b * x); if (y > mx) mx = y; });
    let at = null;
    scan(0, 2 * PI, 0.0001, (x) => { if (at === null && a * Math.sin(b * x) > mx - 1e-6) at = x; });
    if (Math.abs(mx - 2) < 1e-6 && Math.abs(at - PI / 4) < 1e-3) hit12.push([a, b]);
  }
  const A12 = hit12[0][0], B12 = hit12[0][1];
  chk(12, String(A12 + B12), '조건을 만족하는 (a,b) ' + hit12.map((p) => p.join(',')).join(' / ') + ' · a=' + A12 + ' b=' + B12 + ' → 처음 최댓값 자리 ' + pfrac(PI / 4) + ' · 합 ' + (A12 + B12));

  /* 5. 3sin(2(x−m)) 이 원식과 모든 x 에서 같아지는 m */
  const g5 = (x) => 3 * Math.sin(2 * x - PI / 3);
  let m5 = null;
  for (let n = -24; n <= 24; n++) { const m = n * PI / 24; if (SAMP.every((x) => Math.abs(3 * Math.sin(2 * (x - m)) - g5(x)) < 1e-9)) { if (m5 === null || Math.abs(m) < Math.abs(m5)) m5 = m; } }
  chk(5, (m5 > 0 ? '오른쪽으로 ' : '왼쪽으로 ') + pfrac(Math.abs(m5)), 'm=' + R6(m5) + ' 일 때 3sin(2(x−m)) 이 원식과 일치');

  /* 6·10. 부등식이 성립하는 구간의 끝을 격자로 읽고 끝점 포함 여부를 직접 확인 */
  let lo6 = null, hi6 = null;
  scan(0, 2 * PI, 0.000005, (x) => { if (2 * Math.sin(x) > Math.sqrt(2)) { if (lo6 === null) lo6 = x; hi6 = x; } });
  const L6 = Math.round(lo6 / (PI / 24)) * (PI / 24), H6 = Math.round(hi6 / (PI / 24)) * (PI / 24);
  chk(6, pfrac(L6) + ' &lt; x &lt; ' + pfrac(H6),
    '성립 구간 ' + R6(lo6) + '~' + R6(hi6) + ' · 끝점 포함? ' + (2 * Math.sin(L6) > Math.sqrt(2)) + '/' + (2 * Math.sin(H6) > Math.sqrt(2)));

  const ok10 = (x) => Math.abs(Math.cos(x)) > 1e-9 && Math.tan(x) >= Math.sqrt(3);
  const inc10 = (x) => Math.abs(Math.cos(x)) > 1e-9 && Math.tan(x) >= Math.sqrt(3) - 1e-9;   // 끝점 포함 여부
  const runs = []; let cur = null;
  scan(0, 2 * PI, 0.000005, (x) => { if (ok10(x)) { if (!cur) { cur = [x, x]; runs.push(cur); } else cur[1] = x; } else cur = null; });
  const seg = runs.filter((r) => r[1] - r[0] > 0.01).map((r) => {
    const a = Math.round(r[0] / (PI / 24)) * (PI / 24), b = Math.round(r[1] / (PI / 24)) * (PI / 24);
    return pfrac(a) + (inc10(a) ? ' ≤ ' : ' &lt; ') + 'x' + (inc10(b) ? ' ≤ ' : ' &lt; ') + pfrac(b);
  });
  chk(10, seg.join(' 또는 '), '성립 구간 ' + runs.filter((r) => r[1] - r[0] > 0.01).map((r) => R6(r[0]) + '~' + R6(r[1])).join(' / '));

  /* 7·9. 격자 탐색으로 최대·최소 */
  const f7 = (x) => 2 * Math.cos(3 * x) + 1;
  let M7 = -Infinity, m7 = Infinity; scan(0, 10, 0.0001, (x) => { const y = f7(x); if (y > M7) M7 = y; if (y < m7) m7 = y; });
  chk(7, String(Math.round(M7 - m7)), 'M=' + R6(M7) + ' m=' + R6(m7) + ' · 차 ' + R6(M7 - m7) + ' 합 ' + R6(M7 + m7));

  const f9 = (x) => Math.pow(Math.cos(x), 2) + 2 * Math.sin(x) - 2;
  let M9 = -Infinity, m9 = Infinity, at9 = null;
  scan(0, 2 * PI, 0.00002, (x) => { const y = f9(x); if (y > M9) { M9 = y; at9 = x; } if (y < m9) m9 = y; });
  chk(9, M(Math.round(M9)), '최댓값 ' + R6(M9) + ' (x≈' + R6(at9) + ') · 최솟값 ' + R6(m9));
};
