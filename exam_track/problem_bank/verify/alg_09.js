/* alg_09 검산 — 수학적 귀납법. 점화식은 항을 실제로 만들고, 증명 문항은 식에 수를 넣어 대조한다.
 *   · 점화식 문항은 규칙을 코드로 그대로 옮겨 항을 생성한다(일반항 공식을 쓰지 않는다).
 *   · 어떤 수열인지 묻는 문항은 후보 점화식으로 항을 만들어 비가 일정한지 직접 확인한다.
 *   · 증명 문항은 k 에 여러 값을 넣어 후보 식 중 옳은 것 하나만 남는지 본다.
 */
module.exports = function ({ chk }) {
  const R6 = (v) => Math.round(v * 1e6) / 1e6, M = (v) => String(v).replace('-', '−');
  const gcd = (a, b) => (b ? gcd(b, a % b) : a);
  const frac = (v) => {
    for (let d = 1; d <= 2000; d++) { const n = v * d; if (Math.abs(n - Math.round(n)) < 1e-9 * d) { const g = gcd(Math.abs(Math.round(n)), d) || 1; const num = Math.round(n) / g, den = d / g; return den === 1 ? M(num) : M(num) + '/' + den; } }
    return String(R6(v));
  };
  /* 첫째항과 규칙으로 항을 n 개 만든다 */
  const seq = (a1, rule, n) => { const t = [a1]; for (let i = 1; i < n; i++) t.push(rule(t[i - 1], i)); return t; };
  /* 두 항이 필요한 점화식 */
  const seq2 = (a1, a2, rule, n) => { const t = [a1, a2]; for (let i = 2; i < n; i++) t.push(rule(t[i - 1], t[i - 2], i)); return t; };
  const KS = [1, 2, 3, 5, 8];   // 증명 문항에서 대조에 쓰는 k 값

  const s1 = seq(5, (a) => 2 * a - 3, 6);
  chk(1, String(s1[3]), '항 ' + s1.slice(0, 5).join(', ') + ' → a₄=' + s1[3] + ' (2배만 하면 ' + seq(5, (a) => 2 * a, 4)[3] + ')');

  const s2 = seq(2, (a, i) => a + 2 * i - 1, 7);
  chk(2, String(s2[4]), '항 ' + s2.slice(0, 6).join(', ') + ' → a₅=' + s2[4] + ' · a₆=' + s2[5] + ' · 2n 을 더하면 ' + seq(2, (a, i) => a + 2 * i, 5)[4]);

  const s3 = seq(1, (a) => a / (a + 1), 5);
  chk(3, frac(s3[3]), '항 ' + s3.slice(0, 4).map(frac).join(', ') + ' → a₄=' + frac(s3[3]) + ' · 뒤집어 읽으면 ' + frac(seq(1, (a) => (a + 1) / a, 4)[3]));

  const s4 = seq(4, (a) => a + 3, 11);
  chk(4, String(s4[9]), '항 ' + s4.slice(0, 4).join(',') + ',… → a₁₀=' + s4[9] + ' (a₁+10d 로 보면 ' + (4 + 10 * 3) + ')');

  /* 5. 후보 점화식으로 항을 만들어 비가 일정한지 확인한다 */
  const isGP = (t) => { const r = t[1] / t[0]; return t.every((v, i) => i === 0 || Math.abs(t[i] / t[i - 1] - r) < 1e-9); };
  const TARGET5 = [2, -6, 18, -54];
  const cand5 = {
    'aₙ₊₁ = −3aₙ': seq(2, (a) => -3 * a, 4),
    'aₙ₊₁ = aₙ − 8': seq(2, (a) => a - 8, 4),
    'aₙ₊₁ = 3aₙ': seq(2, (a) => 3 * a, 4),
    'aₙ₊₂ = aₙ₊₁ + aₙ': seq2(2, -6, (p, q) => p + q, 4),
  };
  const hit5 = Object.keys(cand5).filter((k) => cand5[k].every((v, i) => v === TARGET5[i]));
  chk(5, hit5[0] || '없음', Object.keys(cand5).map((k) => k + '→[' + cand5[k].join(',') + ']').join(' · ') +
    ' · 목표 [' + TARGET5.join(',') + '] · 비 ' + TARGET5.slice(1).map((v, i) => v / TARGET5[i]).join(','));

  /* 6·9. 증명 문항 — k 에 여러 값을 넣어 옳은 식 하나만 남는지 본다 */
  const L6 = (n) => { let s = 0; for (let i = 1; i <= n; i++) s += i * (i + 1); return s; };   // 좌변을 실제로 더한다
  const add6 = { '(k+1)(k+2)': (k) => (k + 1) * (k + 2), 'k(k+1)': (k) => k * (k + 1), '(k+1)(k+3)': (k) => (k + 1) * (k + 3), '(k+1)(k+2)(k+3)/3': (k) => (k + 1) * (k + 2) * (k + 3) / 3 };
  const hit6 = Object.keys(add6).filter((key) => KS.every((k) => Math.abs(L6(k) + add6[key](k) - L6(k + 1)) < 1e-9));
  chk(6, hit6[0] || '없음', 'k=' + KS.join(',') + ' 에서 좌변에 더해 다음 좌변이 되는 식: ' + hit6.join(', ') + ' · k=3 이면 ' + L6(3) + '+?=' + L6(4));

  const R9 = (n) => Math.pow(n * (n + 1) / 2, 2);                                             // 우변 공식
  const cand9 = { '{(k+1)(k+2)/2}²': (k) => Math.pow((k + 1) * (k + 2) / 2, 2), '{(k+1)(k+2)/2}³': (k) => Math.pow((k + 1) * (k + 2) / 2, 3), '(k+1)(k+2)/2': (k) => (k + 1) * (k + 2) / 2, '{(k+2)(k+3)/2}²': (k) => Math.pow((k + 2) * (k + 3) / 2, 2) };
  const hit9 = Object.keys(cand9).filter((key) => KS.every((k) => Math.abs(cand9[key](k) - R9(k + 1)) < 1e-9));
  chk(9, hit9[0] || '없음', 'k=' + KS.join(',') + ' 에서 공식의 n 에 k+1 을 넣은 값과 일치하는 식: ' + hit9.join(', ') + ' · k=3 이면 우변 ' + R9(4));

  /* 7. m 을 실제로 계산해 후보 식과 대조한다 */
  const cand7 = { '4(5m + 1)': (m) => 4 * (5 * m + 1), '4(5m + 4)': (m) => 4 * (5 * m + 4), '4m + 5': (m) => 4 * m + 5 };
  const hit7 = Object.keys(cand7).filter((key) => KS.every((k) => { const m = (Math.pow(5, k) - 1) / 4; return Math.abs(cand7[key](m) - (Math.pow(5, k + 1) - 1)) < 1e-6; }));
  chk(7, hit7[0] || '없음', 'k=1 이면 m=' + ((5 - 1) / 4) + ' 이고 5²−1=' + (25 - 1) + ' · 일치하는 식 ' + hit7.join(', '));

  const s8 = seq2(1, 3, (p, q) => p + q, 9);
  chk(8, String(s8[6]), '항 ' + s8.slice(0, 8).join(', ') + ' → a₇=' + s8[6] + ' · 번호를 더하면 ' + seq2(1, 3, (p, q, i) => p + i - 1, 8).slice(0, 7).join(','));

  const s10 = seq(1, (a, i) => a + Math.pow(3, i), 6);
  chk(10, String(s10[3]), '항 ' + s10.slice(0, 5).join(', ') + ' → a₄=' + s10[3] + ' · 3n 을 더하면 ' + seq(1, (a, i) => a + 3 * i, 4)[3]);

  /* 11. 논리 문항 — 나머지 세 보기가 실제로 거짓임을 수치로 확인한다 */
  const L11 = (n) => { let s = 0; for (let i = 1; i <= n; i++) s += 2 * i - 1; return s; };
  const ok1 = L11(1) === 1;                                                                    // (ⅰ) 의 n=1 확인은 참
  const okCalc = KS.every((k) => Math.abs((L11(k + 1) - (2 * k + 1)) - L11(k)) < 1e-9);        // (ⅱ) 의 계산도 참
  chk(11, ok1 && okCalc ? '(ⅱ) 에서 증명해야 할 것을 가정했다' : '판정 불가',
    '(ⅰ) n=1 좌변=우변? ' + ok1 + ' · (ⅱ) 양변에서 2k+1 을 뺀 계산이 참? ' + okCalc + ' → 남는 결함은 가정의 대상뿐이다');

  const s12 = seq(2, (a, i) => a + i + 1, 7);
  const at12 = s12.findIndex((v) => v > 10) + 1;
  chk(12, 'a' + '₁₂₃₄₅₆₇₈₉'[at12 - 1], '항 ' + s12.slice(0, 6).join(', ') + ' → 10 을 처음 넘는 것은 a' + at12 + '=' + s12[at12 - 1] +
    ' · n 만 더하면 ' + seq(2, (a, i) => a + i, 6).join(','));
};
