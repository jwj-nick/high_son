/* alg_02 검산 — 지수함수. 정답키를 문항 텍스트와 다른 경로로 다시 만든다.
 *   · 그래프의 성질(점근선·정의역·치역)은 큰 x·작은 x에서의 값으로 확인한다.
 *   · 방정식·부등식의 해는 격자 대입으로 경계를 읽고, 최대·최소는 격자 탐색으로 찾는다.
 */
module.exports = function ({ chk }) {
  const R6 = (v) => Math.round(v * 1e6) / 1e6;
  const M = (v) => String(v).replace('-', '−');
  const scan = (lo, hi, st, fn) => { for (let x = lo; x <= hi + 1e-12; x = R6(x + st)) fn(R6(x)); };

  /* 1. 이동한 함수의 값이 어디에 가까워지는지 본다 */
  const f1 = (x) => Math.pow(2, x - 1) - 3;
  chk(1, 'y = ' + M(Math.round(f1(-60))), 'x가 아주 작을 때 값 ' + R6(f1(-60)) + ' → 점근선');

  /* 2. 정의역 끝값을 직접 계산 */
  let mx2 = -Infinity, mn2 = Infinity;
  scan(-1, 2, 0.0005, (x) => { const y = Math.pow(3, x); if (y > mx2) mx2 = y; if (y < mn2) mn2 = y; });
  const s2 = mx2 + mn2;
  chk(2, Math.round(s2 * 3) + '/3', '최대 ' + R6(mx2) + ' 최소 ' + R6(mn2) + ' 합 ' + R6(s2));

  /* 3·11·12. 방정식의 해를 격자로 찾는다 */
  const sol3 = [];
  scan(-10, 10, 0.0005, (x) => { if (Math.abs(Math.pow(9, x) - 4 * Math.pow(3, x) + 3) < 1e-4) sol3.push(Math.round(x)); });
  chk(3, 'x = ' + [...new Set(sol3)].map(M).join(' 또는 x = '), '해 ' + [...new Set(sol3)].join(','));
  const sol11 = [];
  scan(0.01, 20, 0.0005, (a) => { if (Math.abs(Math.pow(a, 2) - 9) < 1e-5) sol11.push(Math.round(a)); });
  chk(11, [...new Set(sol11)].map(M).join(', '), '밑 조건 a &gt; 0 아래 a² = 9 인 a = ' + [...new Set(sol11)].join(','));
  let a12 = null;
  scan(-10, 10, 0.0005, (a) => { if (Math.abs(Math.pow(2, 3 - a) + 3 - 7) < 1e-6) a12 = Math.round(a); });
  chk(12, M(a12), 'a=' + a12 + ' 일 때 (3,7)을 지난다');

  /* 4·5. 부등식의 해를 값 대입으로 읽는다 */
  let lo4 = null; scan(-10, 10, 0.0005, (x) => { if (Math.pow(2, x + 1) > 8 && lo4 === null) lo4 = x; });
  chk(4, 'x &gt; ' + M(Math.round(lo4)), '성립 시작 ' + R6(lo4) + ' · x=2 성립?' + (Math.pow(2, 3) > 8));
  let lo5 = null; scan(-10, 10, 0.0005, (x) => { if (Math.pow(0.5, x) <= 0.125 && lo5 === null) lo5 = x; });
  chk(5, 'x ≥ ' + M(Math.round(lo5)), '성립 시작 ' + R6(lo5) + ' · x=3 성립?' + (Math.pow(0.5, 3) <= 0.125));

  /* 6. 격자로 최솟값을 찾는다 */
  let mn6 = Infinity, at6 = null;
  scan(-1, 2, 0.0002, (x) => { const y = Math.pow(4, x) - Math.pow(2, x + 2) + 5; if (y < mn6) { mn6 = y; at6 = x; } });
  chk(6, String(Math.round(mn6)), '최솟값 ' + R6(mn6) + ' (x=' + at6 + ') · t=1/2에서 ' + R6(Math.pow(4, -1) - Math.pow(2, 1) + 5));

  /* 7·9. 두 함수가 모든 x에서 같은지 대조 */
  const same = (f, g) => { let ok = true; scan(-3, 3, 0.01, (x) => { if (Math.abs(f(x) - g(x)) > 1e-9) ok = false; }); return ok; };
  chk(7, same((x) => Math.pow(2, -x), (x) => Math.pow(0.5, x)) ? 'y = (1/2)ˣ' : '불일치',
    'y축 대칭 = 2^(−x) 이고 (1/2)^x 와 같은가 ' + same((x) => Math.pow(2, -x), (x) => Math.pow(0.5, x)));
  const F = { 'ㄱ': (x) => Math.pow(2, x), 'ㄴ': (x) => Math.pow(0.5, x), 'ㄷ': (x) => Math.pow(2, -x), 'ㄹ': (x) => -Math.pow(2, x) };
  const keys = Object.keys(F), pair = [];
  for (let i = 0; i < keys.length; i++) for (let j = i + 1; j < keys.length; j++) if (same(F[keys[i]], F[keys[j]])) pair.push(keys[i] + '과 ' + keys[j]);
  chk(9, pair.join(' · '), '같은 짝 ' + pair.join(','));

  /* 8. 여섯제곱해 대소를 비교한다 */
  const A = Math.pow(2, 1 / 2), B = Math.pow(3, 1 / 3), C = Math.pow(6, 1 / 6);
  const ord = [['A', A], ['B', B], ['C', C]].sort((p, q) => p[1] - q[1]).map((p) => p[0]);
  chk(8, ord.join(' &lt; '), 'A⁶=' + R6(Math.pow(A, 6)) + ' B⁶=' + R6(Math.pow(B, 6)) + ' C⁶=' + R6(Math.pow(C, 6)));

  /* 10. 아주 작은 x와 큰 x에서의 값으로 치역을 읽는다 */
  const small = Math.pow(3, -200), big = Math.pow(3, 200);
  chk(10, '정의역은 실수 전체, 치역은 y &gt; 0', '3^(−200)=' + small + ' (0보다 크다) · 3^200=' + big);
};
