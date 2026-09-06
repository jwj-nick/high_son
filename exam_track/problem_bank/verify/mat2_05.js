/* mat2_05 검산 — 명제. 정답키를 문항 텍스트와 다른 경로로 다시 만든다.
 *   · 논리 문항(1·2·8)은 명제를 구조(가정·결론·양화사)로 두고 부정·자리바꿈을 코드로 실행해 문장을 다시 만든다.
 *   · 조건·범위 문항(3·4·7·9·10)은 수직선·비트마스크 전수 대입으로 참인 보기를 찾는다.
 *   · 최대·최소 문항(5·6·11·12)은 공식을 쓰지 않고 격자 탐색으로 값을 구한다.
 */
module.exports = function ({ chk }) {
  const R6 = (v) => Math.round(v * 1e6) / 1e6;
  const grid = (lo, hi, step, fn) => { for (let v = lo; v <= hi + 1e-12; v += step) fn(R6(v)); };
  const all = (lo, hi, step, fn) => { let ok = true; grid(lo, hi, step, (v) => { if (!fn(v)) ok = false; }); return ok; };
  const minOf = (lo, hi, step, f) => { let m = Infinity; grid(lo, hi, step, (v) => { const y = f(v); if (y < m) m = y; }); return m; };

  /* 1. 대우 = 가정과 결론의 자리를 바꾸고 둘 다 부정. 부정은 드모르간까지 코드로 실행한다. */
  const NEG = { 'a &gt; 1': 'a ≤ 1', 'b &gt; 1': 'b ≤ 1', 'a + b &gt; 2': 'a + b ≤ 2' };
  const neg = (c) => (c.s ? { s: NEG[c.s] } : { op: c.op === '또는' ? '이고' : '또는', parts: c.parts.map(neg) });
  const show = (c) => (c.s ? c.s : c.parts.map(show).join(c.op === '이고' ? ' 이고 ' : ' 또는 '));
  const P1 = { s: 'a + b &gt; 2' }, Q1 = { op: '또는', parts: [{ s: 'a &gt; 1' }, { s: 'b &gt; 1' }] };
  chk(1, show(neg(Q1)) + ' 이면 ' + show(neg(P1)) + ' 이다', '~q → ~p 를 구조에서 재조립');

  /* 2. 부정 = 양화사를 뒤집고 조건을 부정. 원명제가 참(x=0)임도 확인. */
  const FLIP = { 어떤: '모든', 모든: '어떤' }, NEG2 = { 'x² ≤ 0': 'x² &gt; 0' };
  const orig = { q: '어떤', c: 'x² ≤ 0' };
  let 원명제참 = false; grid(-3, 3, 0.001, (x) => { if (x * x <= 0) 원명제참 = true; });
  chk(2, FLIP[orig.q] + ' 실수 x에 대하여 ' + NEG2[orig.c] + ' 이다', '원명제 참(x=0 존재)=' + 원명제참 + ' → 부정은 거짓');

  /* 3. 세 조건을 수직선에서 전수 비교해 참인 보기를 고른다. */
  const p3 = (x) => Math.abs(x) < 2, q3 = (x) => x > -2 && x < 3, r3 = (x) => x * x < 4;
  const sub = (A, B) => all(-5, 5, 0.0005, (x) => !A(x) || B(x));
  const T3 = ['p는 q이기 위한 충분조건이다', 'q는 p이기 위한 충분조건이다', 'r는 p이기 위한 필요조건이 아니다', 'q는 r이기 위한 필요충분조건이다'];
  const V3 = [sub(p3, q3), sub(q3, p3), !sub(p3, r3), sub(q3, r3) && sub(r3, q3)];
  const i3 = V3.indexOf(true);
  chk(3, V3.filter(Boolean).length === 1 ? T3[i3] : '참인 보기가 하나가 아님', '참·거짓 = ' + V3.join(','));

  /* 4. 정수 a마다 구간 [a, a+2]의 모든 점이 [-1, 4]에 들어가는지 전수 확인. */
  let n4 = 0; for (let a = -50; a <= 50; a++) if (all(a, a + 2, 0.001, (x) => x >= -1 && x <= 4)) n4++;
  chk(4, String(n4), 'P ⊂ Q 인 정수 a 개수(전수)');

  /* 5·6·11·12. 공식 없이 격자 탐색으로 최소·최대를 찾는다. */
  const m5 = minOf(0.001, 60, 0.0005, (x) => 2 * x + 18 / x);
  chk(5, String(Math.round(m5)), '격자 최소 ' + R6(m5));
  const m6 = minOf(0.001, 40, 0.0002, (a) => (a + 2) * (1 / a + 2)); // b=1로 고정(식이 0차 동차)
  chk(6, String(Math.round(m6)), '격자 최소 ' + R6(m6) + ' (b=1 고정, 동차식)');
  const m11 = minOf(1.0005, 60, 0.0005, (x) => x + 4 / (x - 1));
  chk(11, String(Math.round(m11)), '격자 최소 ' + R6(m11));
  let m12 = 0; grid(0.001, 9.999, 0.0005, (x) => { const s = x * (10 - x); if (s > m12) m12 = s; });
  chk(12, Math.round(m12) + ' m²', '둘레 20 → x+y=10, 곱의 최대 ' + R6(m12));

  /* 7. 모든 x에서 양수인 a를 격자로 찾아 경계를 읽는다. */
  const ok7 = (a) => all(-40, 40, 0.002, (x) => x * x + 2 * a * x + 3 * a - 2 > 0);
  let lo7 = null, hi7 = null; grid(-5, 5, 0.001, (a) => { if (ok7(a)) { if (lo7 === null) lo7 = a; hi7 = a; } });
  chk(7, Math.round(lo7) + ' &lt; a &lt; ' + Math.round(hi7), '성립 구간 ' + R6(lo7) + '~' + R6(hi7) + ' · a=1 성립?' + ok7(1) + ' a=2 성립?' + ok7(2));

  /* 9. 원소 4개짜리 전체집합에서 P ⊂ Qᶜ 인 모든 (P, Q) 쌍을 전수 확인. */
  const FULL = 15;
  const T9 = ['P ∩ Q = ∅', 'P ∪ Q = U', 'P ⊂ Q', 'P = Qᶜ'];
  const V9 = [true, true, true, true];
  for (let Pm = 0; Pm <= FULL; Pm++) for (let Qm = 0; Qm <= FULL; Qm++) {
    if ((Pm & (FULL ^ Qm)) !== Pm) continue; // P ⊂ Qᶜ 인 경우만
    if ((Pm & Qm) !== 0) V9[0] = false;
    if ((Pm | Qm) !== FULL) V9[1] = false;
    if ((Pm & Qm) !== Pm) V9[2] = false;
    if (Pm !== (FULL ^ Qm)) V9[3] = false;
  }
  const i9 = V9.indexOf(true);
  chk(9, V9.filter(Boolean).length === 1 ? T9[i9] : '항상 옳은 보기가 하나가 아님', '항상 성립 = ' + V9.join(','));

  /* 8. 대우의 가정 = 결론의 부정. n=1~999에서 대우가 실제로 참인지도 확인. */
  const NEG8 = { 'n은 짝수이다': 'n은 홀수이다' };
  let 대우참 = true; for (let n = 1; n < 1000; n++) if (n % 2 === 1 && (n * n) % 2 === 0) 대우참 = false;
  chk(8, NEG8['n은 짝수이다'], '대우(n 홀수 → n² 홀수) n=1~999 확인=' + 대우참);

  /* 10. P의 모든 점이 Q에 들어가는 a를 격자로 찾고, 끝점 포함 여부를 직접 확인한다. */
  const ok10 = (a) => all(1.0005, 3.9995, 0.0005, (x) => Math.abs(x - a) < 2);
  let lo10 = null, hi10 = null; grid(-10, 10, 0.001, (a) => { if (ok10(a)) { if (lo10 === null) lo10 = a; hi10 = a; } });
  const L = Math.round(lo10), H = Math.round(hi10);
  chk(10, (ok10(L) ? L + ' ≤ a' : L + ' &lt; a') + ' ' + (ok10(H) ? '≤ ' + H : '&lt; ' + H), '성립 구간 ' + R6(lo10) + '~' + R6(hi10) + ' · a=2 성립?' + ok10(2) + ' a=3 성립?' + ok10(3));
};
