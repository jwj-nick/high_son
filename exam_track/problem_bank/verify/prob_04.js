// prob_04 정답키 재검산 — 조건부확률 공식을 쓰지 않고 "사람 수·경우 수를 직접 세는" 경로로.
// 비복원추출은 공에 이름을 붙여 순서쌍을 전부 만들고, 베이즈형 문제는 큰 모집단을 실제로 만들어 센다.
module.exports = function ({ chk }) {
  const g = (a, b) => (b ? g(b, a % b) : a);
  const Q = (n, d) => { const q = g(n, d) || 1; return (n / q) + '/' + (d / q); };
  const C = (n, r) => { if (r < 0 || r > n) return 0; let v = 1; for (let i = 0; i < r; i++) v = v * (n - i) / (i + 1); return Math.round(v); };
  const tuples = (vals, r) => { let out = [[]]; for (let i = 0; i < r; i++) { const nx = []; for (const t of out) for (const v of vals) nx.push(t.concat(v)); out = nx; } return out; };
  // 이름 붙인 공들에서 순서 있게 두 개를 뽑는 모든 경우(비복원)
  const draw2 = (items) => { const out = []; for (let i = 0; i < items.length; i++) for (let j = 0; j < items.length; j++) if (i !== j) out.push([items[i], items[j]]); return out; };

  // 1 — 40 명을 실제로 만들어 센다(자전거 24 · 수영 18 · 둘 다 10)
  const club = [];
  for (let i = 0; i < 40; i++) club.push({ bike: i < 24, swim: i >= 14 && i < 32 });
  const bike = club.filter((p) => p.bike), swim = club.filter((p) => p.swim), both = club.filter((p) => p.bike && p.swim);
  chk(1, '5/12', '자전거 ' + bike.length + ' · 수영 ' + swim.length + ' · 둘 다 ' + both.length + ' 인 40 명을 지어 세면 자전거 타는 사람 중 수영도 하는 비율 ' + Q(both.length, bike.length) + ' · 반대로 물으면 ' + Q(both.length, swim.length) + ' (보기 5/9) · 전체 대비 ' + Q(both.length, 40) + ' (보기 1/4) · 자전거 비율 ' + Q(bike.length, 40) + ' (보기 3/5)');

  // 2 — 전체를 20 칸으로 두고 A 12 칸·B 10 칸·겹침 5 칸인 그림을 지어 센다
  const N2 = 12, nA = 9, nB = 6, nAB = 4;
  chk(2, '4/9', '전체 ' + N2 + ' 칸에 A ' + nA + ' · B ' + nB + ' · 겹침 ' + nAB + ' 을 지으면 P(A)=' + Q(nA, N2) + ' P(B)=' + Q(nB, N2) + ' P(A∩B)=' + Q(nAB, N2) + ' 로 조건과 맞고, A 안에서 B 의 비율 = ' + Q(nAB, nA) + ' · B 안에서 A 는 ' + Q(nAB, nB) + ' (보기 2/3) · 교집합 그 자체는 ' + Q(nAB, N2) + ' (보기 1/3) · 곱하면 ' + Q(1 * 3, 3 * 4) + ' (보기 1/4)');

  // 3 — 공 9 개에 이름을 붙여 순서 있게 두 개
  const b3 = [...Array(9).keys()].map((i) => (i < 4 ? 'R' : 'B') + i);
  const d3 = draw2(b3);
  const rr = d3.filter((p) => p[0][0] === 'R' && p[1][0] === 'R');
  chk(3, '1/6', '₉P₂ = ' + d3.length + ' 중 둘 다 빨강인 것 ' + rr.length + ' → ' + Q(rr.length, d3.length) + ' · 복원이라면 ' + Q(16, 81) + ' (보기 16/81) · 두 번째 분모를 9 로 두면 ' + Q(4 * 3, 81) + ' (보기 4/27) · 분모만 줄이면 ' + Q(4 * 4, 9 * 8) + ' (보기 2/9)');

  // 4 — 제품 10000 개를 실제로 만들어 센다
  const totA = 7000, totB = 3000, badA = Math.round(totA * 0.04), badB = Math.round(totB * 0.08);
  chk(4, '6/13', '10000 개로 세면 A ' + totA + ' 중 불량 ' + badA + ' · B ' + totB + ' 중 불량 ' + badB + ' → 불량 전체 ' + (badA + badB) + ' 중 B 쪽 ' + badB + ' = ' + Q(badB, badA + badB) + ' · B 일 때 불량은 ' + (badB / totB) + ' (보기 2/25) · 분자만 보면 ' + Q(240, 10000) + ' (보기 3/125)');

  // 5 — 독립 여부를 정의대로 판정한다(교집합을 덧셈정리 없이 그림으로 확인)
  // 전체를 2000 칸으로 두고 A 900 · B 1200 · 합집합 1600 인 그림을 실제로 지어 센다
  const N5 = 2000, A5 = 900, B5 = 1200, U5 = 1600, I5 = A5 + B5 - U5;
  chk(5, '서로 독립이 아니다', '전체 ' + N5 + ' 칸에 A ' + A5 + ' · B ' + B5 + ' · 합집합 ' + U5 + ' 을 지으면 겹침이 ' + I5 + ' 칸 = ' + (I5 / N5) + ' · P(A)P(B) = ' + (A5 / N5) * (B5 / N5) + ' 로 <b>다르다</b> → 독립이 아니다 · 겹침을 0.27 로 잘못 보면 독립이라 판정하게 된다(보기 "독립이다") · 배반이라면 겹침이 0 이어야 한다(보기 "배반") · P(A|B) = ' + Math.round(I5 / B5 * 1e4) / 1e4 + ' 로 0.25 가 아니다(보기 0.25)');

  // 6 — 주사위 5 번을 6⁵ = 7776 가지 전부 만들어 센다
  // 네 번의 결과를 4⁴ = 256 가지로 전부 만든다(1 이면 성공, 2~4 면 실패 → p = 1/4)
  const t6 = tuples([1, 2, 3, 4], 4);
  const hit6 = t6.filter((t) => t.filter((x) => x === 1).length === 2);
  chk(6, '27/128', '4⁴ = ' + t6.length + ' 가지를 전부 만들어 성공이 정확히 두 번인 것 ' + hit6.length + ' → ' + Q(hit6.length, t6.length) + ' · 조합을 안 곱하면 ' + Q(9, 256) + ' (보기 9/256) · ₄C₂ 를 4 로 보면 ' + Q(36, 256) + ' (보기 9/64) · 횟수별 ' + [0, 1, 2, 3, 4].map((k) => t6.filter((t) => t.filter((x) => x === 1).length === k).length).join('+') + ' = ' + t6.length);

  // 7 — 공 5 개에 이름을 붙여 순서 있게 두 개, 두 번째만 본다
  // 공 8 개에 이름을 붙여 순서 있게 두 개를 뽑는 56 가지를 전부 만든다
  const b7 = ['W1', 'W2', 'W3', 'W4', 'W5', 'K1', 'K2', 'K3'];
  const d7 = draw2(b7);
  const snd = d7.filter((p) => p[1][0] === 'W');
  const both7 = snd.filter((p) => p[0][0] === 'W');
  chk(7, '4/7', '₈P₂ = ' + d7.length + ' 중 두 번째가 흰 공인 것 ' + snd.length + ' 가지, 그중 첫 번째도 흰 공인 것 ' + both7.length + ' 가지 → ' + Q(both7.length, snd.length) + ' · 두 번째가 흰 공일 확률 자체는 ' + Q(snd.length, d7.length) + ' (보기 5/8) · 둘 다 흰 공일 확률은 ' + Q(both7.length, d7.length) + ' (보기 5/14)');

  // 8 — 전체를 10 칸으로 두고 독립인 그림을 실제로 지어 센다(A 4 칸·B 5 칸·겹침 2 칸)
  const N8 = 10, a8 = 4, b8 = 5, ab8 = 2;
  chk(8, '7/10', '전체 ' + N8 + ' 칸에 A ' + a8 + ' · B ' + b8 + ' · 겹침 ' + ab8 + ' 을 지으면 ' + Q(ab8, N8) + ' = ' + Q(a8, N8) + '×' + Q(b8, N8) + ' 로 실제로 독립이고, 합집합 칸은 ' + (a8 + b8 - ab8) + ' → ' + Q(a8 + b8 - ab8, N8) + ' · 겹침을 안 빼면 ' + Q(9, 10) + ' (보기 9/10) · 교집합만 ' + Q(ab8, N8) + ' (보기 1/5)');

  // 9 — 배반인 실제 예(주사위 한 번)로 독립인지 판정한다
  // 독립인 실제 예(주사위 두 개)를 만들어 배반인지, 합집합이 그냥 합이 되는지 직접 센다
  const pairs = []; for (let a = 1; a <= 6; a++) for (let b = 1; b <= 6; b++) pairs.push([a, b]);
  const A9 = pairs.filter((t) => t[0] % 2 === 0), B9 = pairs.filter((t) => t[1] === 6);
  const I9 = pairs.filter((t) => t[0] % 2 === 0 && t[1] === 6);
  const U9 = pairs.filter((t) => t[0] % 2 === 0 || t[1] === 6);
  chk(9, 'A 와 B 는 배반이 아니다', '주사위 두 개에서 A="첫 번째가 짝수"(' + A9.length + '/36) B="두 번째가 6"(' + B9.length + '/36) 은 교집합 ' + I9.length + '/36 = ' + Q(I9.length, 36) + ' 이고 P(A)P(B) = ' + Q(A9.length * B9.length, 36 * 36) + ' 로 같아 <b>독립</b>이다 · 그런데 교집합이 ' + I9.length + ' 칸(' + I9.map((t) => '(' + t + ')').join('') + ')이라 0 이 아니므로 배반이 아니다(보기 "배반이다"·"P(A∩B)=0" 둘 다 틀림) · 합집합은 ' + U9.length + ' 칸이고 그냥 더하면 ' + (A9.length + B9.length) + ' 이라 다르다(보기 P(A∪B)=P(A)+P(B) 도 틀림)');

  // 10 — 15 칸 격자를 지어 두 사람의 합격 여부를 전부 만든다
  const cases10 = [];
  for (let i = 0; i < 3; i++) for (let j = 0; j < 5; j++) cases10.push([i < 2, j < 3]);
  const atLeast = cases10.filter((c) => c[0] || c[1]);
  chk(10, '13/15', 'A 는 3 칸 중 2 칸, B 는 5 칸 중 3 칸으로 15 칸을 지으면 적어도 한 사람 합격이 ' + atLeast.length + ' → ' + Q(atLeast.length, 15) + ' · 둘 다 불합격 ' + (15 - atLeast.length) + ' (보기 2/15) · 둘 다 합격 ' + cases10.filter((c) => c[0] && c[1]).length + ' → ' + Q(6, 15) + ' (보기 2/5) · 그냥 더하면 ' + Q(10 + 9, 15) + ' (보기 19/15)');

  // 11 — 10000 명을 실제로 만들어 센다
  const sick = 40, well = 9960, posS = Math.round(sick * 0.9), posW = Math.round(well * 0.05);
  chk(11, '6/89', '10000 명으로 세면 환자 ' + sick + ' 중 양성 ' + posS + ' · 건강 ' + well + ' 중 양성 ' + posW + ' → 양성 전체 ' + (posS + posW) + ' 중 환자 ' + posS + ' = ' + Q(posS, posS + posW) + ' (≈' + (posS / (posS + posW)).toFixed(3) + ') · 병일 때 양성은 0.9 (보기 0.9) · 분자만 보면 ' + (posS / 10000) + ' (보기 0.018)');

  // 12 — 64 가지를 전부 만든다
  const t12 = tuples(['H', 'T'], 10);
  const nH = (t) => t.filter((x) => x === 'H').length;
  const ge8 = t12.filter((t) => nH(t) >= 8);
  chk(12, '7/128', '2¹⁰ = ' + t12.length + ' 중 앞면이 8 번 이상인 것 ' + ge8.length + ' → ' + Q(ge8.length, t12.length) + ' · 정확히 8 번은 ' + t12.filter((t) => nH(t) === 8).length + ' → ' + Q(45, 1024) + ' (보기 45/1024) · ₁₀C₁₀ 을 0 으로 보면 ' + Q(55, 1024) + ' (보기 55/1024) · 개수별 ' + [0,1,2,3,4,5,6,7,8,9,10].map((k) => t12.filter((t) => nH(t) === k).length).join('+') + ' = 1024 · 2 번 이하도 ' + t12.filter((t) => nH(t) <= 2).length + ' 로 대칭');
};
