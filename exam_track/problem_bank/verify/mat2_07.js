/* mat2_07 검산 — 유리함수·무리함수. 정답키를 문항 텍스트와 다른 경로로 다시 만든다.
 *   · 점근선은 식을 변형하지 않고 큰 x에서의 값(가로)과 발산하는 x(세로)를 수치로 찾는다.
 *   · 정의역·치역·최대·최소는 격자 대입으로 직접 구한다.
 *   · 식을 답으로 하는 문항은 매개변수를 탐색해 조건을 만족하는 값을 찾은 뒤 문자열을 조립한다.
 */
module.exports = function ({ chk }) {
  const R6 = (v) => Math.round(v * 1e6) / 1e6;
  const M = (v) => String(v).replace('-', '−');
  const sg = (v) => (v < 0 ? ' − ' + Math.abs(v) : ' + ' + v); // "y = k/(x − p) + q" 의 부호 표기
  const vAsym = (f) => { // 발산하는 x를 찾는다
    let at = null; for (let x = -20; x <= 20; x = R6(x + 0.0001)) if (Math.abs(f(x)) > 1e5) { at = Math.round(x); break; }
    return at;
  };
  const hAsym = (f) => Math.round(f(1e7));

  /* 1. 점근선 = 발산하는 x, 그리고 x가 아주 클 때의 값. */
  const f1 = (x) => (2 * x + 5) / (x + 1);
  chk(1, 'x = ' + M(vAsym(f1)) + ', y = ' + M(hAsym(f1)), 'f(1e7)=' + R6(f1(1e7)));

  /* 2. 이동한 함수를 직접 만들어 점근선을 다시 찾는다(식 변형 없이). */
  const base2 = (x) => 3 / (x - 1) + 2;
  const f2 = (x) => base2(x - (-2)) + 1; // x축 −2, y축 +1
  chk(2, 'x = ' + M(vAsym(f2)) + ', y = ' + M(hAsym(f2)), '이동 전 점근선 x=' + vAsym(base2) + ' y=' + hAsym(base2));

  /* 3. 점근선으로 꼴을 세우고 지나는 점으로 k를 정한다. */
  const p3 = 2, q3 = -1, k3 = (1 - q3) * (3 - p3);
  chk(3, 'y = ' + k3 + '/(x' + sg(-p3) + ')' + sg(q3), 'k=' + k3 + ' · 검산 f(3)=' + R6(k3 / (3 - p3) + q3));

  /* 4·5·7. 격자 대입으로 정의역·치역·최대·최소를 직접 구한다. */
  let hi4 = -Infinity, loY4 = Infinity;
  for (let x = -20; x <= 20; x = R6(x + 0.0005)) { const s = 6 - 2 * x; if (s >= 0) { if (x > hi4) hi4 = x; const y = Math.sqrt(s) + 1; if (y < loY4) loY4 = y; } }
  chk(4, '정의역 x ≤ ' + M(R6(hi4)) + ', 치역 y ≥ ' + M(R6(loY4)), '근호 안 0 이상인 최대 x=' + R6(hi4));

  let max5 = -Infinity;
  for (let x = 2; x <= 6 + 1e-12; x = R6(x + 0.0005)) { const y = Math.sqrt(x - 2) + 3; if (y > max5) max5 = y; }
  chk(5, String(R6(max5)), 'x=6에서 √4+3');

  let max7 = -Infinity, min7 = Infinity;
  for (let x = 2; x <= 4 + 1e-12; x = R6(x + 0.0005)) { const y = 6 / (x - 1) + 2; if (y > max7) max7 = y; if (y < min7) min7 = y; }
  chk(7, String(R6(max7 + min7)), '최대 ' + R6(max7) + ' 최소 ' + R6(min7));

  /* 6. 근을 격자에서 직접 찾는다(제곱해서 얻은 근을 원래 식에 넣어 확인). */
  const roots6 = [];
  for (let x = -10; x <= 20; x = R6(x + 0.0001)) { if (x + 6 >= 0 && Math.abs(Math.sqrt(x + 6) - x) < 1e-6) roots6.push(Math.round(x)); }
  const uniq6 = [...new Set(roots6)];
  chk(6, 'x = ' + uniq6.map(M).join(' 또는 x = '), '제곱한 방정식의 근 3, −2 중 원식을 만족하는 것 = ' + uniq6.join(','));

  /* 8. 네 함수의 정의역을 근호 안 부호로 직접 판정한다. */
  const cands8 = [['ㄱ', (x) => x - 1], ['ㄴ', (x) => 1 - x], ['ㄷ', (x) => x - 1], ['ㄹ', (x) => 1 - x]];
  const left8 = cands8.filter(([, inner]) => inner(0) >= 0 && inner(2) < 0).map(([n]) => n);
  chk(8, left8.join(', '), 'x=0 가능·x=2 불가능인 것');

  /* 9. 시작점 (0,0)이 어디로 갔는지 찾는다. */
  const f9 = (x) => Math.sqrt(x + 3) - 2;
  let p9 = null; for (let x = -10; x <= 10; x = R6(x + 0.0005)) if (x + 3 >= 0) { p9 = R6(x); break; }
  chk(9, 'x축의 방향으로 ' + M(p9) + '만큼, y축의 방향으로 ' + M(R6(f9(p9))) + '만큼', '시작점 (' + p9 + ', ' + R6(f9(p9)) + ')');

  /* 10. 역함수를 매개변수 탐색으로 찾는다: f(g(x)) = x 가 되는 (k, p, q). */
  const f10 = (x) => 2 / (x - 1) + 3;
  let found10 = null;
  for (let k = -5; k <= 5 && !found10; k++) for (let p = -5; p <= 5 && !found10; p++) for (let q = -5; q <= 5 && !found10; q++) {
    if (k === 0) continue;
    const g = (x) => k / (x - p) + q;
    let ok = true;
    for (const x of [4, 5, 6, 7]) if (Math.abs(f10(g(x)) - x) > 1e-9) ok = false;
    if (ok) found10 = [k, p, q];
  }
  const [k10, p10, q10] = found10;
  chk(10, 'y = ' + k10 + '/(x' + sg(-p10) + ')' + sg(q10), '탐색 결과 k=' + k10 + ' p=' + p10 + ' q=' + q10);

  /* 11. 점을 지나게 하는 a를 탐색한 뒤 가로 점근선을 수치로 읽는다. */
  let a11 = null;
  for (let a = -20; a <= 20; a = R6(a + 0.5)) if (Math.abs((3 * 1 + a) / (1 - 2) - 2) < 1e-9) a11 = a;
  const f11 = (x) => (3 * x + a11) / (x - 2);
  chk(11, String(hAsym(f11)), 'a=' + a11 + ' · f(1e7)=' + R6(f11(1e7)));

  /* 12. 정수 x를 전수 대입해 y도 정수인 경우를 센다. */
  let n12 = 0; const pts = [];
  for (let x = -200; x <= 200; x++) { if (x + 1 === 0) continue; const y = (2 * x + 3) / (x + 1); if (Number.isInteger(y)) { n12++; pts.push('(' + x + ',' + y + ')'); } }
  chk(12, String(n12), '정수점 ' + pts.join(' '));
};
