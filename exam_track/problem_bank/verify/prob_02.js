// prob_02 정답키 재검산 — 공식을 쓰지 않고 완전 열거와 실제 다항식 곱셈으로.
// 중복조합은 "방정식의 음이 아닌 정수해"를 전부 만들어 세고, 이항정리는 계수 배열을 곱해 확인한다.
module.exports = function ({ chk }) {
  // 합이 s 인 길이 k 의 음이 아닌 정수 조합을 전부 만든다
  const sols = (k, s) => { const out = []; const go = (cur, left, d) => { if (d === k - 1) { out.push(cur.concat(left)); return; } for (let v = 0; v <= left; v++) go(cur.concat(v), left - v, d + 1); }; go([], s, 0); return out; };
  // 계수 배열의 곱 (index = x 의 지수)
  const mul = (a, b) => { const c = new Array(a.length + b.length - 1).fill(0); for (let i = 0; i < a.length; i++) for (let j = 0; j < b.length; j++) c[i + j] += a[i] * b[j]; return c; };
  const pow = (a, n) => { let r = [1]; for (let i = 0; i < n; i++) r = mul(r, a); return r; };
  const C = (n, r) => { if (r < 0 || r > n) return 0; let v = 1; for (let i = 0; i < r; i++) v = v * (n - i) / (i + 1); return Math.round(v); };
  // 지수가 음수일 수 있는 항: {지수: 계수} 맵으로 곱한다
  const mmul = (A, B) => { const c = {}; for (const i in A) for (const j in B) { const k = +i + +j; c[k] = (c[k] || 0) + A[i] * B[j]; } return c; };
  const mpow = (A, n) => { let r = { 0: 1 }; for (let i = 0; i < n; i++) r = mmul(r, A); return r; };

  // 1 — 5종류에서 7개: x1+…+x5 = 7 의 해를 전부 만든다
  const s1 = sols(5, 7);
  chk(1, '330', 'x₁+…+x₅ = 7 의 음이 아닌 정수해를 전부 만들면 ' + s1.length + ' 가지 · 종류와 개수를 뒤바꾼 ₇H₅(= x₁+…+x₇=5) 는 ' + sols(7, 5).length + ' (보기 462) · ₁₂C₇ = ' + C(12, 7) + ' (보기 792)');

  // 2 — (x+3)^6 을 실제로 곱한다
  const c2 = pow([3, 1], 6); // 계수 배열: index = x 의 지수
  chk(2, '135', '(x+3)⁶ 을 여섯 번 곱해 얻은 계수 = ' + c2.join(',') + ' → x⁴ 의 계수 ' + c2[4] + ' · ₆C₂ 만 = ' + C(6, 2) + ' (보기 15) · ₆C₄×3⁴ = ' + C(6, 4) * 81 + ' (보기 1215) · 계수의 합 ' + c2.reduce((a, b) => a + b, 0) + ' = 4⁶');

  // 3 — (2x−1)^5
  const c3 = pow([-1, 2], 5);
  chk(3, '−40', '(2x−1)⁵ 의 계수 = ' + c3.join(',') + ' → x² 의 계수 ' + c3[2] + ' · x=1 을 넣으면 ' + c3.reduce((a, b) => a + b, 0) + ' = (2−1)⁵ · ₅C₂×2³ = ' + C(5, 2) * 8 + ' (보기 80) · ₅C₃×(−1)³ = ' + (-C(5, 3)) + ' (보기 −10)');

  // 4 — 해를 전부 만든다
  const s4 = sols(4, 8);
  const pos4 = s4.filter((t) => t.every((v) => v > 0));
  chk(4, '165', 'x+y+z+w = 8 의 음이 아닌 정수해 ' + s4.length + ' 가지 · 그중 양의 정수해 ' + pos4.length + ' (보기 35) · ₁₂C₈ = ' + C(12, 8) + ' (보기 495)');

  // 5 — 각 종류 1권 이상인 해만
  const all5 = sols(6, 11);
  const s5 = all5.filter((t) => t.every((v) => v >= 1));
  const byFirst = [1, 2, 3, 4, 5, 6].map((k) => s5.filter((t) => t[0] === k).length);
  chk(5, '252', '여섯 칸에 11 을 나누는 해 중 여섯 다 1 이상인 것 ' + s5.length + ' 가지 · 첫 종류를 k 권 사는 경우로 갈라 세면 ' + byFirst.join('+') + ' = ' + byFirst.reduce((a, b) => a + b, 0) + ' · 조건 없이 전부면 ' + all5.length + ' (보기 4368) · 종류와 개수를 뒤바꾸면 ' + sols(5, 6).length + ' (보기 210) · ₁₁C₅ = ' + C(11, 5) + ' (보기 462)');

  // 6 — 이항계수를 직접 더한다
  const even = [0, 2, 4, 6, 8, 10, 12].map((r) => C(12, r));
  const all12 = [...Array(13).keys()].map((r) => C(12, r));
  chk(6, '2048', '₁₂C 짝수 번째 = ' + even.join('+') + ' = ' + even.reduce((a, b) => a + b, 0) + ' · 전체 합 ' + all12.reduce((a, b) => a + b, 0) + ' (보기 4096) · 전체−1 = ' + (4096 - 1) + ' (보기 4095) · 4 로 나누면 ' + 4096 / 4 + ' (보기 1024) · 홀수 번째 합 ' + [1, 3, 5, 7, 9, 11].map((r) => C(12, r)).reduce((a, b) => a + b, 0));

  // 7 — 음의 지수를 포함한 곱셈
  const m7 = mpow({ 3: 1, '-1': 2 }, 8);
  chk(7, '1792', '(x³+2/x)⁸ 을 여덟 번 곱해 얻은 지수→계수 = ' + Object.keys(m7).sort((a, b) => a - b).map((k) => 'x^' + k + ':' + m7[k]).join(' ') + ' → 상수항 ' + m7[0] + ' · ₈C₆ 만 = ' + C(8, 6) + ' (보기 28) · ₈C₂×2² = ' + C(8, 2) * 4 + ' (보기 112)');

  // 8 — 두 표현의 개수를 열거로 맞춘다
  const s8 = sols(6, 3);
  chk(8, '₈C₃', '6종류에서 3개(= x₁+…+x₆=3 의 해) ' + s8.length + ' 가지 · ₈C₃ = ' + C(8, 3) + ' 로 일치 · ₉C₃ = ' + C(9, 3) + ' · ₈C₆ = ' + C(8, 6) + ' · ₆C₃ = ' + C(6, 3) + ' 로 모두 다르다');

  // 9 — 두 다항식을 실제로 곱한다
  const c9 = mul(pow([1, 1], 4), pow([1, 2], 3));
  chk(9, '42', '(1+x)⁴(1+2x)³ 의 계수 = ' + c9.join(',') + ' → x² 의 계수 ' + c9[2] + ' · 두 x² 계수만 더하면 ' + (6 + 12) + ' (보기 18) · 곱하면 ' + 6 * 12 + ' (보기 72) · (1+2x)⁷ 로 보면 ' + C(7, 2) * 4 + ' (보기 84)');

  // 10 — 값으로 확인
  chk(10, '₁₀C₄', '₉C₃+₉C₄ = ' + C(9, 3) + '+' + C(9, 4) + ' = ' + (C(9, 3) + C(9, 4)) + ' · ₁₀C₄ = ' + C(10, 4) + ' 로 일치 · ₁₀C₃ = ' + C(10, 3) + ' · ₉C₇ = ' + C(9, 7) + ' · ₁₈C₇ = ' + C(18, 7));

  // 11 — 조건을 필터로
  const all11 = sols(4, 7);
  const ok11 = all11.filter((t) => t[0] <= 2);
  const split = [0, 1, 2].map((k) => all11.filter((t) => t[0] === k).length);
  chk(11, '85', '전체 ' + all11.length + ' 가지 중 첫 종류가 2 이하인 것 ' + ok11.length + ' · 0·1·2 자루로 갈라 세면 ' + split.join('+') + ' = ' + split.reduce((a, b) => a + b, 0) + ' · 3 이상인 것 ' + (all11.length - ok11.length) + ' (보기 35) · 정확히 2 자루만 ' + split[2] + ' (보기 21)');

  // 12 — n 을 1~10 까지 실제로 전개해 상수항이 있는지 본다
  const hit = [];
  for (let n = 1; n <= 10; n++) { const m = mpow({ 1: 1, '-2': 1 }, n); if (m[0]) hit.push(n + '(계수 ' + m[0] + ')'); }
  chk(12, '3개', 'n=1~10 을 전부 전개해 상수항이 실제로 나오는 n = ' + hit.join(', ') + ' → ' + hit.length + ' 개 · n−2r 로 잘못 보면 짝수 n 이 ' + [2, 4, 6, 8, 10].length + ' 개 (보기 5개)');
};
