/* cal1_03 검산 — 미분계수와 도함수. 미분 공식을 쓰지 않고 정의(극한)로 계산한다.
 *   · 도함수는 {f(x+h) − f(x)}/h 를 아주 작은 h 로 수치 계산해 얻는다(중앙차분).
 *   · 극한 식은 h 를 0 에 가깝게 놓고 실제 값을 읽어 f'(a) 의 몇 배인지 본다.
 *   · 조각함수의 미분가능 조건은 좌·우 미분계수를 각각 수치로 재 비교한다.
 *   · 계수를 되찾는 문항은 조건을 만족하는 값을 격자로 찾는다.
 */
module.exports = function ({ chk }) {
  const R6 = (v) => Math.round(v * 1e6) / 1e6, M = (v) => String(v).replace('-', '−');
  const D = (f, a, h) => { h = h || 1e-6; return (f(a + h) - f(a - h)) / (2 * h); };   // 정의에 의한 미분계수(중앙차분)
  const near = (x, y, e) => Math.abs(x - y) < (e || 1e-4);

  /* 1. 평균변화율은 두 점을 잇는 기울기 */
  const f1 = (x) => x * x - 3 * x;
  chk(1, String(Math.round((f1(4) - f1(1)) / (4 - 1))),
    'f(1)=' + f1(1) + ' f(4)=' + f1(4) + ' · 변화량 ' + (f1(4) - f1(1)) + '/' + (4 - 1) + '=' + R6((f1(4) - f1(1)) / 3) + ' · 그 점의 순간변화율은 ' + R6(D(f1, 4)));

  /* 2·8·9·12. 도함수를 정의로 계산한다 */
  const f2 = (x) => 3 * x * x - 2 * x + 5;
  chk(2, String(Math.round(D(f2, 2))), '정의로 잰 f′(2)=' + R6(D(f2, 2)) + ' · 함숫값 f(2)=' + f2(2));

  const f8 = (x) => x * x * x - 3 * x * x + 4;
  const ok8 = [-2, -0.5, 1, 2.5, 4].every((x) => near(D(f8, x), 3 * x * x - 6 * x, 1e-3));
  chk(8, ok8 ? '3x² − 6x' : '불일치', '여러 x 에서 정의로 잰 값과 3x²−6x 가 일치? ' + ok8 + ' · x=2 에서 ' + R6(D(f8, 2)) + ' vs ' + (3 * 4 - 12));

  let a9 = null;
  for (let a = -20; a <= 20; a += 0.5) if (near(D((x) => x * x * x + a * x, 1), 7, 1e-3)) a9 = a;
  chk(9, String(a9), 'a=' + a9 + ' 에서 f′(1)=' + R6(D((x) => x * x * x + a9 * x, 1)) + ' · f(1)=7 이 되는 a 는 ' + (7 - 1));

  const f12 = (x) => x * x * x - 2 * x * x + x;
  const roots12 = [];
  for (let x = -3; x <= 3; x = Math.round((x + 0.0001) * 1e4) / 1e4) {
    const d0 = D(f12, x, 1e-5), d1 = D(f12, Math.round((x + 0.0001) * 1e4) / 1e4, 1e-5);
    if (d0 * d1 < 0) roots12.push(R6(x));
  }
  chk(12, roots12.length + '개', '미분계수의 부호가 바뀌는 자리 ' + roots12.join(', ') + ' · f′ 은 이차식이라 상한이 2 개다');

  /* 3. h 를 작게 놓고 f′(a) 의 몇 배인지 읽는다 */
  const g3 = (x) => x * x + 5 * x;                 // 아무 매끈한 함수로 확인
  const A = 2, h3 = 1e-6;
  const ratio3 = ((g3(A + 3 * h3) - g3(A - h3)) / h3) / D(g3, A);
  chk(3, Math.round(ratio3) + "f'(a)", '표본 함수에서 (원식)/(f′(a)) = ' + R6(ratio3) + ' · f′(2)=' + R6(D(g3, A)) + ' · 3−1=2 로 계산하면 어긋난다');

  /* 4. 좌·우 미분계수를 각각 재 미분가능한 (a, b) 를 찾는다 */
  let a4 = null, b4 = null;
  for (let a = -10; a <= 10; a += 0.5) for (let b = -10; b <= 10; b += 0.5) {
    const f = (x) => (x < 2 ? x * x + 1 : a * x + b);
    const cont = near(f(2 - 1e-6), f(2 + 1e-6), 1e-4);
    const dl = (f(2 - 1e-6) - f(2 - 2e-6)) / 1e-6, dr = (f(2 + 2e-6) - f(2 + 1e-6)) / 1e-6;
    if (cont && near(dl, dr, 1e-3)) { a4 = a; b4 = b; }
  }
  chk(4, M(a4 * b4), 'a=' + a4 + ', b=' + b4 + ' · 연속 조건 2a+b=' + (2 * a4 + b4) + ' · 곱 ' + (a4 * b4) + ' 합 ' + (a4 + b4));

  /* 5. 정리와 그 역을 반례로 가른다 */
  const abs = (x) => Math.abs(x);
  const dl5 = (abs(0) - abs(-1e-6)) / 1e-6, dr5 = (abs(1e-6) - abs(0)) / 1e-6;
  chk(5, 'x = a 에서 미분가능하면 x = a 에서 연속이다',
    '반례 y=|x| — x=0 에서 연속이고 좌미분계수 ' + R6(dl5) + ' · 우미분계수 ' + R6(dr5) + ' 로 둘 다 존재하지만 값이 달라 미분 불가');

  /* 6·10·11. 곱의 미분을 정의로 확인한다 */
  const f6 = (x) => (2 * x - 1) * (x * x + 3);
  chk(6, String(Math.round(D(f6, 1))), '정의로 잰 f′(1)=' + R6(D(f6, 1)) + ' · f′g′ 로 보면 ' + (2 * 2 * 1) + ' · 앞 항만 더하면 ' + (2 * 4));

  const F = (x) => 3 * x - 1, G = (x) => 4 * x - 5;   // f(1)=2, f′(1)=3, g(1)=−1, g′(1)=4 를 만족
  const H = (x) => F(x) * G(x);
  chk(10, String(Math.round(D(H, 1))), 'f(1)=' + F(1) + ' f′(1)=' + R6(D(F, 1)) + ' g(1)=' + G(1) + ' g′(1)=' + R6(D(G, 1)) + ' → (fg)′(1)=' + R6(D(H, 1)) + ' · f′g′ 라면 ' + (3 * 4));

  let a11 = null, b11 = null;
  for (let a = -10; a <= 10; a += 0.5) for (let b = -10; b <= 10; b += 0.5) {
    const f = (x) => a * x * x + b * x;
    if (near(f(1), 5, 1e-9) && near(D(f, 1), 8, 1e-4)) { a11 = a; b11 = b; }
  }
  chk(11, String(a11 * b11), 'a=' + a11 + ', b=' + b11 + ' · f(1)=' + (a11 + b11) + ' f′(1)=' + R6(2 * a11 + b11) + ' · 곱 ' + (a11 * b11));

  /* 7. 조건을 만족하는 f 를 하나 잡아 극한을 수치로 읽는다 */
  const f7 = (x) => 2 * x + 1;                       // f(1)=3, f′(1)=2
  const v7 = (3 * Math.pow(1 + 1e-6, 2) - f7(1 + 1e-6)) / 1e-6;
  chk(7, String(Math.round(v7)), 'f(x)=2x+1 (f(1)=' + f7(1) + ', f′(1)=' + R6(D(f7, 1)) + ') 로 두면 극한 ' + R6(v7) + ' · 앞 조각만 세면 6');
};
