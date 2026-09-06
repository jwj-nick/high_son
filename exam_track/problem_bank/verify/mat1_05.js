/* mat1_05 검산 — 경우의 수. 정답키를 문항 텍스트와 다른 경로로 다시 만든다.
 *   · 공식(nPr·nCr) 대신 **실제 경우를 전부 나열해** 센다. 공식을 옮겨 적는 실수를 원천적으로 피한다.
 */
module.exports = function ({ chk }) {
  // 서로 다른 n개에서 r개를 뽑는 조합·순열을 나열로 만든다
  function combos(arr, r) {
    if (r === 0) return [[]];
    if (arr.length < r) return [];
    const [h, ...t] = arr;
    return combos(t, r - 1).map((c) => [h, ...c]).concat(combos(t, r));
  }
  function perms(arr, r) {
    if (r === 0) return [[]];
    const out = [];
    arr.forEach((v, i) => perms(arr.filter((_, j) => j !== i), r - 1).forEach((p) => out.push([v, ...p])));
    return out;
  }
  const N = (n) => Array.from({ length: n }, (_, i) => i + 1);

  /* 1. 두 묶음을 각각 나열해 더한다 */
  const outfit = [];
  N(4).forEach((t) => N(3).forEach((b) => outfit.push('t' + t + 'b' + b)));
  const capOnly = N(2).map((c) => 'c' + c);
  chk(1, String(outfit.length + capOnly.length), '옷 조합 ' + outfit.length + ' + 모자만 ' + capOnly.length);

  /* 2. 5명에서 3명을 뽑아 나열하는 경우를 전부 만든다 */
  chk(2, String(perms(N(5), 3).length), '조합이었다면 ' + combos(N(5), 3).length);

  /* 3. 자리 구분이 없는 것(조합)을 판정한다 */
  const cands3 = [['ㄱ', true], ['ㄴ', false], ['ㄷ', true], ['ㄹ', false]]; // 두 번째 값 = 자리 구분이 있는가
  chk(3, cands3.filter(([, ordered]) => !ordered).map(([n]) => n).join(', '), '자리 구분 없는 것');

  /* 4·10. 조합의 개수를 나열로 센다 */
  chk(4, String(combos(N(8), 3).length - combos(N(8), 2).length), '₈C₃=' + combos(N(8), 3).length + ' ₈C₂=' + combos(N(8), 2).length);
  let r10 = null;
  for (let r = 0; r <= 7; r++) if (r !== 3 && combos(N(7), r).length === combos(N(7), 3).length) r10 = r;
  chk(10, String(r10), '₇C₃=' + combos(N(7), 3).length + ' 와 같은 것은 ₇C' + r10);

  /* 5. 네 명을 세우는 24가지를 만들어 A와 B가 이웃한 것만 센다 */
  const line = perms(['A', 'B', 'C', 'D'], 4).filter((p) => Math.abs(p.indexOf('A') - p.indexOf('B')) === 1);
  chk(5, String(line.length), '전체 24 중 이웃 ' + line.length);

  /* 6. 뽑기와 세우기를 실제로 이어 붙인다 */
  const boys = ['b1', 'b2', 'b3', 'b4'], girls = ['g1', 'g2', 'g3'];
  let n6 = 0;
  combos(boys, 2).forEach((bs) => combos(girls, 1).forEach((gs) => { n6 += perms([...bs, ...gs], 3).length; }));
  chk(6, String(n6), '뽑기 ' + (combos(boys, 2).length * 3) + ' × 세우기 6');

  /* 7. 세 자리 수를 전부 만들어 센다 */
  const digits = [0, 1, 2, 3, 4];
  const nums = perms(digits, 3).filter((p) => p[0] !== 0);
  chk(7, String(nums.length), '전체 배열 ' + perms(digits, 3).length + ' 중 앞자리 0 제외');

  /* 8. 두 팀을 고르는 경우를 나열한다 */
  chk(8, String(combos(N(8), 2).length), '팀별로 세면 ' + (8 * 7) + ' (두 번 셈)');

  /* 9. 3명 조합을 전부 만들어 여학생이 든 것만 센다 */
  const all9 = combos(['b1', 'b2', 'b3', 'b4', 'b5', 'g1', 'g2', 'g3', 'g4'], 3);
  const with9 = all9.filter((c) => c.some((v) => v[0] === 'g'));
  chk(9, String(with9.length), '전체 ' + all9.length + ' 중 여학생 없는 것 ' + (all9.length - with9.length));

  /* 11. A가 받을 3권을 고르면 B는 자동으로 정해진다 */
  chk(11, String(combos(N(6), 3).length), '두 묶음으로만 나눈다면 ' + (combos(N(6), 3).length / 2));

  /* 12. A를 포함하는 4명 조합만 센다 */
  const with12 = combos(['A', 'b', 'c', 'd', 'e', 'f'], 4).filter((c) => c.includes('A'));
  chk(12, String(with12.length), '전체 ' + combos(['A', 'b', 'c', 'd', 'e', 'f'], 4).length + ' 중 A 포함');
};
