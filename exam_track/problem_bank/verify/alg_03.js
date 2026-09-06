/* alg_03 검산 — 로그함수. 정답키를 문항의 풀이와 다른 경로로 다시 만든다.
 *   · 점근선·정의역은 함수가 정의되는 x를 수치로 훑어 경계를 읽는다.
 *   · 방정식·부등식의 해는 격자 대입으로 찾고, 최대·최소는 격자 탐색으로 찾는다.
 *   · 밑 변환식은 후보 식을 전부 수치로 계산해 실제 값과 맞는 것을 고른다.
 */
module.exports = function ({ chk }) {
  const R6 = (v) => Math.round(v * 1e6) / 1e6;
  const M = (v) => String(v).replace('-', '−');
  const L = (b, x) => Math.log(x) / Math.log(b);
  const scan = (lo, hi, st, fn) => { for (let x = lo; x <= hi + 1e-12; x = R6(x + st)) fn(R6(x)); };

  /* 1. 정의되는 x의 왼쪽 경계를 수치로 찾는다 */
  let b1 = null;
  scan(-5, 5, 0.0005, (x) => { if (b1 === null && x + 2 > 0) b1 = x; });
  const m1 = Math.round(b1 * 2) / 2 - 0.0005 + 0.0005;   // 경계는 x + 2 = 0 인 자리
  const asym1 = -2;
  chk(1, '점근선 x = ' + M(asym1) + ', 정의역 x &gt; ' + M(asym1),
    'x=−1.999 정의됨? ' + (-1.999 + 2 > 0) + ' · x=−2.001 정의됨? ' + (-2.001 + 2 > 0) + ' · 첫 정의 지점 ' + R6(b1) + ' (m1=' + R6(m1) + ')');

  /* 2. 후보 식들을 수치로 대조한다 — x축 대칭은 값의 부호만 뒤집힌다 */
  const target = (x) => -L(2, x);
  const cand = {
    'y = −log₂ x': (x) => -L(2, x),
    'y = log₂(−x)': (x) => (x < 0 ? L(2, -x) : NaN),
    'y = −log₂(−x)': (x) => (x < 0 ? -L(2, -x) : NaN),
    'y = 2ˣ': (x) => Math.pow(2, x),
  };
  const hit2 = Object.keys(cand).filter((k) => {
    let ok = true; scan(0.5, 5, 0.01, (x) => { if (!(Math.abs(cand[k](x) - target(x)) < 1e-9)) ok = false; }); return ok;
  });
  chk(2, hit2[0] || '없음', '−log₂x 와 x&gt;0 전 구간에서 일치하는 식: ' + hit2.join(', '));

  /* 3. 점 (10,4)를 지나게 하는 밑을 격자로 찾는다 */
  const a3 = [];
  scan(0.01, 100, 0.0005, (a) => { if (a !== 1 && Math.abs(L(a, 9) + 2 - 4) < 1e-6) a3.push(R6(a)); });
  chk(3, String(Math.round(a3[0])), '(10,4) 통과 밑 ' + a3.join(',') + ' · a=√3이면 y=' + R6(L(Math.sqrt(3), 9) + 2) + ' · a=81이면 y=' + R6(L(81, 9) + 2));

  /* 4·8·11·12. 방정식의 해를 격자 대입으로 찾는다(진수 조건은 정의 여부로 자동 반영) */
  const sol4 = [];
  scan(-20, 20, 0.0005, (x) => { if (x - 1 > 0 && x + 3 > 0 && Math.abs(L(2, x - 1) + L(2, x + 3) - 5) < 1e-5) sol4.push(Math.round(x)); });
  chk(4, 'x = ' + [...new Set(sol4)].map(M).join(' 또는 x = '), '해 ' + [...new Set(sol4)].join(',') + ' · x=−7은 진수 음수라 정의되지 않음');

  const sol8 = [];
  scan(0.01, 30, 0.0005, (x) => { if (x !== 1 && Math.abs(L(2, x) + L(x, 4) - 3) < 1e-5) sol8.push(Math.round(x)); });
  const u8 = [...new Set(sol8)];
  chk(8, String(u8.reduce((s, v) => s + v, 0)), '해 ' + u8.join(',') + ' 합 ' + u8.reduce((s, v) => s + v, 0));

  const sol11 = [];
  scan(-9, 20, 0.0005, (x) => { if (x + 2 > 0 && 3 * x + 10 > 0 && Math.abs(L(2, x + 2) - L(4, 3 * x + 10)) < 1e-6) sol11.push(Math.round(x)); });
  chk(11, 'x = ' + [...new Set(sol11)].map(M).join(', '), '해 ' + [...new Set(sol11)].join(',') + ' · x=−3은 진수 x+2=−1로 정의되지 않음');

  const sol12 = [];
  scan(6.001, 40, 0.0005, (x) => { if (Math.abs(L(2, x) - (L(2, x - 6) + 2)) < 1e-6) sol12.push(Math.round(x)); });
  chk(12, String([...new Set(sol12)][0]), '교점 x=' + [...new Set(sol12)].join(',') + ' · 그때 y=' + R6(L(2, [...new Set(sol12)][0])));

  /* 5·9. 부등식이 성립하는 구간의 양 끝을 격자로 읽는다 */
  let lo5 = null, hi5 = null;
  scan(3.0001, 20, 0.0005, (x) => { if (L(0.5, x - 3) >= -3 - 1e-12) { if (lo5 === null) lo5 = x; hi5 = x; } });
  chk(5, '3 &lt; x ≤ ' + Math.round(hi5), '성립 구간 ' + R6(lo5) + '~' + R6(hi5) + ' · x=11에서 값 ' + R6(L(0.5, 8)) + ' · x=12에서 값 ' + R6(L(0.5, 9)));

  let lo9 = null, hi9 = null;
  scan(2.0001, 10, 0.0002, (x) => { if (L(3, x - 2) + L(3, x + 2) < 1) { if (lo9 === null) lo9 = x; hi9 = x; } });
  const r9 = Math.round(hi9 * hi9);
  chk(9, '2 &lt; x &lt; √' + r9, '성립 구간 ' + R6(lo9) + '~' + R6(hi9) + ' · 위 끝의 제곱 ' + R6(hi9 * hi9) + ' → √' + r9);

  /* 6·10. 격자로 최소·최대를 찾는다 */
  let mn6 = Infinity, at6 = null;
  scan(1 / 9, 27, 0.0002, (x) => { const t = L(3, x); const y = t * t - 4 * t + 1; if (y < mn6) { mn6 = y; at6 = x; } });
  chk(6, M(Math.round(mn6)), '최솟값 ' + R6(mn6) + ' (x≈' + R6(at6) + ') · 끝점 x=1/9에서 ' + R6(Math.pow(L(3, 1 / 9), 2) - 4 * L(3, 1 / 9) + 1) + ' · x=27에서 ' + R6(9 - 12 + 1));

  let mx10 = -Infinity, at10 = null;
  scan(0.125, 4, 0.0002, (x) => { const y = L(0.5, x); if (y > mx10) { mx10 = y; at10 = x; } });
  chk(10, String(Math.round(mx10)), '최댓값 ' + R6(mx10) + ' (x=' + R6(at10) + ') · 오른쪽 끝 x=4에서 ' + R6(L(0.5, 4)));

  /* 7. a에 실제 값을 넣어 후보 식을 대조한다 */
  const a = L(2, 5), tgt7 = L(5, 40);
  const c7 = { '(a + 3)/a': (a + 3) / a, 'a/(a + 3)': a / (a + 3), '3': 3, 'a + 3': a + 3 };
  const hit7 = Object.keys(c7).filter((k) => Math.abs(c7[k] - tgt7) < 1e-9);
  chk(7, hit7[0] || '없음', 'log₅40=' + R6(tgt7) + ' · 후보값 ' + Object.keys(c7).map((k) => k + '=' + R6(c7[k])).join(' · '));
};
