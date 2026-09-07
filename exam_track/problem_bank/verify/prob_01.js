// prob_01 정답키 재검산 — 공식을 일절 쓰지 않고 전부 완전 열거(brute force)로 센다.
// 경우의 수는 열거가 가장 확실한 독립 경로다. 오답 보기의 값도 같이 찍어 둔다.
module.exports = function ({ chk }) {
  // 서로 다른 문자열의 집합으로 세면 "같은 것이 있는 순열"이 저절로 처리된다
  const perms = (arr) => { const out = new Set(); const go = (cur, rest) => { if (!rest.length) { out.add(cur.join('')); return; } for (let i = 0; i < rest.length; i++) go(cur.concat(rest[i]), rest.slice(0, i).concat(rest.slice(i + 1))); }; go([], arr); return [...out]; };
  // n 가지에서 r 자리를 채우는 모든 배열
  const tuples = (n, r) => { let out = [[]]; for (let i = 0; i < r; i++) { const nx = []; for (const t of out) for (let v = 0; v < n; v++) nx.push(t.concat(v)); out = nx; } return out; };

  // 1 — 공마다 상자를 정하는 모든 경우를 실제로 만든다
  const t1 = tuples(3, 5);
  chk(1, '243', '공 5개 각각에 상자 3개를 배정한 경우를 전부 만들면 ' + t1.length + ' 가지 · 자리와 후보를 뒤바꾸면 ' + tuples(5, 3).length + ' (보기 125) · ₅P₃ = ' + (5 * 4 * 3) + ' (보기 60)');

  // 2 — 문자열 집합의 크기
  const p2 = perms('SUCCESS'.split(''));
  chk(2, '420', 'SUCCESS 의 서로 다른 문자열 ' + p2.length + ' 개 · 전부 다르다고 보면 7! = ' + 5040 + ' · S 만 나누면 ' + 5040 / 6 + ' (보기 840) · 2! 를 한 번 더 나누면 ' + 5040 / 24 + ' (보기 210)');

  // 3 — 조건을 필터로
  const p3 = perms('AAABCD'.split(''));
  const c3 = p3.filter((s) => s[0] === 'A' && s[5] === 'A');
  chk(3, '24', '전체 ' + p3.length + ' 중 양 끝이 모두 A 인 것 ' + c3.length + ' · 예: ' + c3.slice(0, 3).join(' ') + ' · 가운데를 2! 로 잘못 나누면 ' + 24 / 2 + ' (보기 12)');

  // 4 — 짝수 필터
  const p4 = perms('112333'.split(''));
  const c4 = p4.filter((s) => Number(s[5]) % 2 === 0);
  chk(4, '10개', '전체 ' + p4.length + ' 중 짝수 ' + c4.length + ' 개 · 전부: ' + c4.join(' ') + ' · 3! 로만 나누면 ' + 120 / 6 + ' (보기 20)');

  // 5 — 네 자리 수를 전부 만들어 맨 앞이 0 인 것을 뺀다
  const t5 = tuples(5, 4).filter((t) => t[0] !== 0);
  chk(5, '500', '0~4 로 만든 네 자리 배열 중 맨 앞이 0 이 아닌 것 ' + t5.length + ' · 전체(0 허용) ' + tuples(5, 4).length + ' (보기 625) · ₅P₄ = ' + (5 * 4 * 3 * 2) + ' (보기 120)');

  // 6 — 네 상자가 모두 차는 경우가 정말 하나도 없는지 전수 확인
  const t6 = tuples(4, 3);
  const full = t6.filter((t) => new Set(t).size === 4);
  chk(6, '0가지', '공 3개를 상자 4개에 넣는 모든 경우 ' + t6.length + ' 가지를 전수로 확인해 네 상자가 모두 찬 것 = ' + full.length + ' 가지 · 서로 다른 상자에 든 경우(₄P₃) = ' + t6.filter((t) => new Set(t).size === 3).length + ' (보기 24) · 자리와 후보를 뒤바꾸면 ' + tuples(3, 4).length + ' (보기 81)');

  // 7 — 이웃 여부를 문자열에서 직접 확인
  const p7 = perms('aabbcd'.split(''));
  const c7 = p7.filter((s) => !s.includes('aa'));
  chk(7, '120', '전체 ' + p7.length + ' 중 aa 가 들어 있지 않은 것 ' + c7.length + ' · 이웃하는 것 ' + (p7.length - c7.length) + ' (보기 60) · 예: ' + c7.slice(0, 3).join(' '));

  // 8 — 여덟 자리 이진 문자열 전수
  const t8 = tuples(2, 8).filter((t) => t.reduce((a, b) => a + b, 0) === 3);
  chk(8, '56', '2⁸ = ' + tuples(2, 8).length + ' 개 중 1 이 정확히 세 개인 것 ' + t8.length + ' · 5! 로만 나누면 ' + 40320 / 120 + ' (보기 336) · 3!+5! 로 나누면 ' + Math.round(40320 / 126) + ' (보기 320)');

  // 9 — 경로를 문자열로 만들어 막힌 변을 실제로 밟는지 좌표로 추적
  const p9 = perms('RRRRUUU'.split(''));
  const blocked = (s) => { let x = 0, y = 0; for (const ch of s) { if (ch === 'R') { if (y === 1 && x === 1) return true; x++; } else y++; } return false; };
  const c9 = p9.filter((s) => !blocked(s));
  chk(9, '23', '전체 경로 ' + p9.length + ' 중 (1,1)→(2,1) 가로 변을 밟지 않는 것 ' + c9.length + ' · 밟는 것 ' + (p9.length - c9.length) + ' (보기 12) · 앞뒤를 더해서 빼면 ' + (35 - 8) + ' (보기 27)');

  // 10 — 처음 두 걸음 필터
  const p10 = perms('RRRUUU'.split(''));
  const c10 = p10.filter((s) => s.startsWith('RR'));
  chk(10, '4', '전체 ' + p10.length + ' 중 RR 로 시작하는 것 ' + c10.length + ' · 전부: ' + c10.join(' ') + ' · ₄C₂ = ' + 6 + ' (보기 6)');

  // 11 — 과일마다 사람을 배정해 A(=0) 가 든 경우만
  const t11 = tuples(3, 4);
  const c11 = t11.filter((t) => t.includes(0));
  chk(11, '65', '전체 ' + t11.length + ' 중 A 가 적어도 하나 받는 것 ' + c11.length + ' · A 가 하나도 못 받는 것 ' + (t11.length - c11.length) + ' (보기 16) · 2³ 으로 잘못 빼면 ' + (81 - 8) + ' (보기 73)');

  // 12 — 333 이 이어져 나오는지 문자열에서 확인
  const p12 = perms('122333'.split(''));
  const c12 = p12.filter((s) => s.includes('333'));
  chk(12, '12', '전체 ' + p12.length + ' 중 333 이 이어진 것 ' + c12.length + ' · 전부: ' + c12.join(' ') + ' · 덩어리 안을 3! 배 하면 ' + 12 * 6 + ' (보기 72)');
};
