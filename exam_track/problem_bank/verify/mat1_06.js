/* mat1_06 검산 — 행렬. 정답키를 문항 텍스트와 다른 경로로 다시 만든다.
 *   · 행렬 연산을 실제로 수행하는 작은 구현을 두고, 성분을 그 결과에서 읽는다.
 *   · 꼴 문항은 곱셈 조건을 코드로 판정한다(사람의 규칙 암기와 다른 경로).
 */
module.exports = function ({ chk }) {
  const M = (v) => String(v).replace('-', '−');
  const shape = (A) => [A.length, A[0].length];
  const add = (A, B, k = 1, l = 1) => A.map((r, i) => r.map((v, j) => k * v + l * B[i][j]));
  const scal = (k, A) => A.map((r) => r.map((v) => k * v));
  function mul(A, B) {
    if (A[0].length !== B.length) return null;
    return A.map((r) => B[0].map((_, j) => r.reduce((s, v, k) => s + v * B[k][j], 0)));
  }
  const sum = (A) => A.reduce((s, r) => s + r.reduce((t, v) => t + v, 0), 0);

  /* 1. 성분 읽기 */
  const A1 = [[2, -1], [3, 4]];
  chk(1, M(A1[1][0]), '(1,2)성분은 ' + A1[0][1] + ' · (2,2)성분은 ' + A1[1][1]);

  /* 2·7. 실수배와 덧셈·뺄셈 */
  const A2 = [[1, 2], [0, 3]], B2 = [[2, -1], [4, 1]];
  const R2 = add(A2, B2, 2, -1);
  chk(2, M(R2[0][1]), '2A−B = ' + JSON.stringify(R2));
  const A7 = [[1, 0], [2, 1]], B7 = [[0, 1], [1, 0]];
  const R7 = add(A7, B7, 2, 3);
  chk(7, M(R7[1][0]), '2A+3B = ' + JSON.stringify(R7));

  /* 3. 곱셈이 정의되는 조합을 코드로 판정 */
  const A3 = [[0, 0, 0], [0, 0, 0]], B3 = [[0, 0], [0, 0], [0, 0]], C3 = [[0, 0], [0, 0]];
  const pairs = [['ㄱ', A3, B3], ['ㄴ', B3, A3], ['ㄷ', A3, C3], ['ㄹ', C3, A3]];
  chk(3, pairs.filter(([, X, Y]) => mul(X, Y) !== null).map(([n]) => n).join(', '),
    pairs.map(([n, X, Y]) => n + ':' + shape(X).join('×') + '·' + shape(Y).join('×')).join(' '));

  /* 4·5. 곱셈의 성분 */
  const A4 = [[1, 2], [3, 0]], B4 = [[2, -1], [1, 4]];
  chk(4, M(mul(A4, B4)[1][0]), 'AB = ' + JSON.stringify(mul(A4, B4)) + ' · BA = ' + JSON.stringify(mul(B4, A4)));
  const A5 = [[1, 1], [0, 1]], B5 = [[1, 0], [1, 1]];
  const D5 = add(mul(A5, B5), mul(B5, A5), 1, -1);
  chk(5, M(D5[0][0]), 'AB−BA = ' + JSON.stringify(D5));

  /* 6. AX = 주어진 행렬이 되는 X 를 전수 탐색 */
  const A6 = [[1, 2], [0, 1]], T6 = [[3, 4], [1, 2]];
  let X6 = null;
  for (let a = -9; a <= 9 && !X6; a++) for (let b = -9; b <= 9 && !X6; b++)
    for (let c = -9; c <= 9 && !X6; c++) for (let d = -9; d <= 9; d++) {
      const P = mul(A6, [[a, b], [c, d]]);
      if (P[0][0] === T6[0][0] && P[0][1] === T6[0][1] && P[1][0] === T6[1][0] && P[1][1] === T6[1][1]) { X6 = [a, b, c, d]; break; }
    }
  chk(6, M(X6.reduce((s, v) => s + v, 0)), 'X = ' + JSON.stringify(X6) + ' · a+d = ' + (X6[0] + X6[3]));

  /* 8. 거듭제곱을 실제로 곱해 간다 */
  const A8 = [[1, 1], [0, 1]];
  const A8_3 = mul(mul(A8, A8), A8);
  chk(8, M(A8_3[0][1]), 'A² = ' + JSON.stringify(mul(A8, A8)) + ' A³ = ' + JSON.stringify(A8_3));

  /* 9. 세 행렬의 곱 조합을 전부 계산해 3 × 3 이 되는 것을 찾는다 */
  const mk = (r, c) => Array.from({ length: r }, () => Array.from({ length: c }, () => 0));
  const A9 = mk(3, 2), B9 = mk(2, 4), C9 = mk(4, 3);
  const cand = { ABC: [A9, B9, C9], AB: [A9, B9], BC: [B9, C9], CA: [C9, A9] };
  const hit = Object.keys(cand).filter((k) => {
    const P = cand[k].reduce((acc, m) => (acc === null ? null : mul(acc, m)));
    return P && P.length === 3 && P[0].length === 3;
  });
  chk(9, hit.join(', '), Object.keys(cand).map((k) => {
    const P = cand[k].reduce((acc, m) => (acc === null ? null : mul(acc, m)));
    return k + ':' + (P ? shape(P).join('×') : '정의안됨');
  }).join(' '));

  /* 10. X = (A+X) − A */
  const A10 = [[2, 1], [0, 1]], S10 = [[5, 3], [2, 4]];
  const X10 = add(S10, A10, 1, -1);
  chk(10, M(X10[1][1]), 'X = ' + JSON.stringify(X10));

  /* 11. 성분의 개수를 실제로 세어 문장을 고른다 */
  const cnt = 2 * 3;
  chk(11, '2 × 3 행렬의 성분은 모두 ' + cnt + '개다', '2행 3열 → ' + cnt + '개 (2+3=5가 아니다)');

  /* 12. 성분 합과 제곱행렬의 성분 합 */
  const A12 = [[1, 2], [3, 4]];
  const s12 = sum(A12), t12 = sum(mul(A12, A12));
  chk(12, M(t12 - s12), 's=' + s12 + ' t=' + t12 + ' (A²=' + JSON.stringify(mul(A12, A12)) + ')');
};
