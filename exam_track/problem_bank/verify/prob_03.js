// prob_03 정답키 재검산 — 공식을 쓰지 않고 표본공간을 통째로 만들어 세는 완전 열거로.
// 확률은 "센 칸 / 전체 칸"이므로, 조건을 코드로 옮겨 필터하면 문항의 풀이와 완전히 다른 경로가 된다.
module.exports = function ({ chk }) {
  const g = (a, b) => (b ? g(b, a % b) : a);
  const Q = (n, d) => { const q = g(n, d) || 1; return (n / q) + '/' + (d / q); };
  // 서로 다른 것들에서 r 개를 고르는 모든 조합
  const combs = (arr, r) => { const out = []; const go = (st, cur) => { if (cur.length === r) { out.push(cur.slice()); return; } for (let i = st; i < arr.length; i++) { cur.push(arr[i]); go(i + 1, cur); cur.pop(); } }; go(0, []); return out; };
  const tuples = (vals, r) => { let out = [[]]; for (let i = 0; i < r; i++) { const nx = []; for (const t of out) for (const v of vals) nx.push(t.concat(v)); out = nx; } return out; };
  const perms = (arr) => { const out = []; const go = (cur, rest) => { if (!rest.length) { out.push(cur.join('')); return; } for (let i = 0; i < rest.length; i++) go(cur.concat(rest[i]), rest.slice(0, i).concat(rest.slice(i + 1))); }; go([], arr); return out; };

  // 1 — 12 장을 전부 훑는다
  const all1 = [...Array(12).keys()].map((i) => i + 1);
  const hit1 = all1.filter((n) => n % 2 === 0 || n % 3 === 0);
  chk(1, '2/3', '해당하는 수 ' + hit1.join(',') + ' → ' + Q(hit1.length, 12) + ' · 겹침(6의 배수) ' + all1.filter((n) => n % 6 === 0).join(',') + ' · 빼지 않으면 ' + Q(10, 12) + ' (보기 5/6) · 겹침만 ' + Q(2, 12) + ' (보기 1/6) · 4 를 빼면 ' + Q(6, 12) + ' (보기 1/2)');

  // 2 — 공 7 개에 이름을 붙여 세 개를 고르는 모든 조합을 만든다
  const balls = ['W1', 'W2', 'W3', 'W4', 'B1', 'B2', 'B3'];
  const c2 = combs(balls, 3);
  const w = (s, k) => s.filter((x) => x[0] === 'W').length === k;
  const hit2 = c2.filter((s) => w(s, 2));
  chk(2, '18/35', '₇C₃ = ' + c2.length + ' 중 흰 2·검 1 인 것 ' + hit2.length + ' → ' + Q(hit2.length, c2.length) + ' · 흰 1·검 2 는 ' + c2.filter((s) => w(s, 1)).length + ' (보기 12/35) · 흰 개수별 ' + [0, 1, 2, 3].map((k) => c2.filter((s) => w(s, k)).length).join('+') + ' = ' + c2.length);

  // 3 — 제비 10 개를 이름 붙여 두 개씩
  const tick = [...Array(10).keys()].map((i) => (i < 3 ? 'H' : 'M') + i);
  const c3 = combs(tick, 2);
  const hit3 = c3.filter((s) => s.some((x) => x[0] === 'H'));
  chk(3, '8/15', '₁₀C₂ = ' + c3.length + ' 중 당첨이 하나 이상인 것 ' + hit3.length + ' → ' + Q(hit3.length, c3.length) + ' · 하나도 없는 것 ' + (c3.length - hit3.length) + ' (보기 7/15) · 둘 다 당첨 ' + c3.filter((s) => s.every((x) => x[0] === 'H')).length + ' (보기 1/15)');

  // 4 — 덧셈정리를 쓰지 않고, 조건을 만족하는 확률공간을 실제로 지어 확인한다
  //     전체를 12 등분해 A 에 6 칸, B 에 4 칸, 합집합이 9 칸이 되게 겹침을 조절한다
  let ov4 = null;
  for (let k = 0; k <= 4; k++) { if (6 + 4 - k === 9) ov4 = k; }
  chk(4, '1/12', '전체를 12 칸으로 두고 A 를 6 칸, B 를 4 칸, 합집합을 9 칸이 되게 지으면 겹침이 ' + ov4 + ' 칸 → ' + Q(ov4, 12) + ' · 독립이라면 6×4/12 = ' + Q(2, 12) + ' (보기 1/6) 이라 이 경우는 독립이 아니다 · 부호를 바꾸지 않으면 ' + (6 + 4 + 9) + '/12 (보기 19/12)');

  // 5 — 8 명에 이름을 붙여 세 명씩
  const st = [...Array(8).keys()].map((i) => (i < 5 ? 'M' : 'F') + i);
  const c5 = combs(st, 3);
  const hit5 = c5.filter((s) => s.some((x) => x[0] === 'M') && s.some((x) => x[0] === 'F'));
  chk(5, '45/56', '₈C₃ = ' + c5.length + ' 중 남녀가 모두 든 것 ' + hit5.length + ' → ' + Q(hit5.length, c5.length) + ' · 한쪽 성만 ' + (c5.length - hit5.length) + ' (보기 11/56) · 모두 남 ' + c5.filter((s) => s.every((x) => x[0] === 'M')).length + ' 모두 여 ' + c5.filter((s) => s.every((x) => x[0] === 'F')).length + ' · 모두 여를 빠뜨리면 ' + Q(46, 56) + ' (보기 23/28) · 중복 세기로 90/56 = ' + Q(90, 56) + ' (보기 45/28)');

  // 6 — 겹침을 0 부터 훑어 P(A∪B) ≤ 1 을 지키는 가장 작은 값을 찾는다
  let min6 = null;
  for (let x = 0; x <= 0.5001; x += 0.001) { const uni = 0.7 + 0.5 - x; if (uni <= 1 + 1e-9 && min6 === null) min6 = Math.round(x * 1000) / 1000; }
  chk(6, '0.2', '겹침을 0 부터 0.001 씩 올리며 P(A∪B) = 1.2 − 겹침 ≤ 1 을 처음 만족하는 값 = ' + min6 + ' · 겹침 0.1 이면 합집합 ' + (1.2 - 0.1).toFixed(1) + ' 로 1 을 넘는다 · 독립이면 ' + (0.7 * 0.5) + ' (보기 0.35) · 최댓값은 작은 쪽 0.5 (보기 0.5)');

  // 7 — 카드 9 장에서 세 장을 고르는 84 가지를 전부 만들어 합의 홀짝을 본다
  const c7 = combs([1, 2, 3, 4, 5, 6, 7, 8, 9], 3);
  const odd7 = c7.filter((s) => s.reduce((a, b) => a + b, 0) % 2 === 1);
  chk(7, '10/21', '₉C₃ = ' + c7.length + ' 중 합이 홀수인 것 ' + odd7.length + ' → ' + Q(odd7.length, c7.length) + ' · 짝수인 것 ' + (c7.length - odd7.length) + ' (보기 11/21) · 홀수 3 개만 ' + c7.filter((s) => s.every((x) => x % 2 === 1)).length + ' (보기 5/42) · 홀수 개수별 ' + [0, 1, 2, 3].map((k) => c7.filter((s) => s.filter((x) => x % 2 === 1).length === k).length).join('/'));

  // 8 — 세 사람의 손을 전부 만들어 승부를 실제로 판정한다
  const hands = ['R', 'S', 'P'];
  const beats = { R: 'S', S: 'P', P: 'R' };
  const t8 = tuples(hands, 3);
  const draw8 = t8.filter((t) => { const k = [...new Set(t)]; if (k.length === 1 || k.length === 3) return true; return !(beats[k[0]] === k[1] || beats[k[1]] === k[0]); });
  chk(8, '1/3', '3³ = ' + t8.length + ' 중 승부가 나지 않는 것 ' + draw8.length + ' → ' + Q(draw8.length, t8.length) + ' · 셋이 같은 것 ' + t8.filter((t) => new Set(t).size === 1).length + ' (보기 1/9) · 세 종류가 다 나온 것 ' + t8.filter((t) => new Set(t).size === 3).length + ' (보기 2/9) · 승부가 나는 것 ' + (t8.length - draw8.length) + ' (보기 2/3)');

  // 9 — 120 개 배열을 전부 만들어 ab 나 ba 가 들어 있는지 본다
  const p9 = perms('abcde'.split(''));
  const ok9 = p9.filter((s) => !s.includes('ab') && !s.includes('ba'));
  chk(9, '3/5', '5! = ' + p9.length + ' 중 a·b 가 이웃하지 않는 것 ' + ok9.length + ' → ' + Q(ok9.length, p9.length) + ' · 이웃하는 것 ' + (p9.length - ok9.length) + ' (보기 2/5) · 2! 를 곱하지 않으면 ' + Q(96, 120) + ' (보기 4/5) · 자리 쌍 4 만 세면 ' + Q(116, 120) + ' (보기 29/30)');

  // 10 — 앞뒤 32 가지를 전부 만든다
  const t10 = tuples(['H', 'T'], 5);
  const nH = (t) => t.filter((x) => x === 'H').length;
  const ex10 = t10.filter((t) => nH(t) === 3);
  chk(10, '5/16', '2⁵ = ' + t10.length + ' 중 앞면이 정확히 세 개인 것 ' + ex10.length + ' → ' + Q(ex10.length, t10.length) + ' · 3 개 이상이면 ' + t10.filter((t) => nH(t) >= 3).length + ' → ' + Q(16, 32) + ' (보기 1/2) · 개수별 ' + [0, 1, 2, 3, 4, 5].map((k) => t10.filter((t) => nH(t) === k).length).join('+') + ' = 32');

  // 11 — 나눗셈을 직접
  chk(11, '0.87', '174 ÷ 200 = ' + (174 / 200) + ' · 되돌리면 200 × 0.87 = ' + (200 * 0.87) + ' · 싹트지 않은 것 ' + (200 - 174) + '/200 = ' + ((200 - 174) / 200) + ' (보기 0.13) · 자릿수를 밀면 ' + (174 / 1000) + ' (보기 0.174)');

  // 12 — 36 칸을 전부 만들어 실제로 판별식을 계산한다
  const t12 = [];
  for (let a = 1; a <= 6; a++) for (let b = 1; b <= 6; b++) t12.push([a, b]);
  const real = t12.filter((p) => p[0] * p[0] - 4 * p[1] >= 0);
  const strict = t12.filter((p) => p[0] * p[0] - 4 * p[1] > 0);
  const byA = [1, 2, 3, 4, 5, 6].map((a) => real.filter((p) => p[0] === a).length);
  const dbl = real.filter((p) => p[0] * p[0] - 4 * p[1] === 0).map((p) => '(' + p[0] + ',' + p[1] + ')').join(' ');
  // a=6 에서 b 의 상한을 9 로 잘못 두면 6 개가 아니라 9 개로 세게 된다
  const over = real.length + 3;
  chk(12, '19/36', '36 칸을 전부 훑어 D = a²−4b ≥ 0 인 것 ' + real.length + ' → ' + Q(real.length, 36) + ' · a 별로 ' + byA.join('+') + ' · 실근이 없는 것 ' + (36 - real.length) + ' (보기 17/36) · a=6 의 b 상한을 9 로 두면 ' + over + '/36 = ' + Q(over, 36) + ' (보기 11/18) · 중근이 되는 (a,b) = ' + dbl + ' 라 등호를 빼면 ' + strict.length + ' 로 여사건과 같은 값이 되어 보기로 쓸 수 없다');
};
