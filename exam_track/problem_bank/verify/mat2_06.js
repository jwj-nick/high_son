/* mat2_06 검산 — 함수·합성함수·역함수. 정답키를 문항 텍스트와 다른 경로로 다시 만든다.
 *   · 합성·역함수 값은 식 변형 없이 수치 탐색(f(x) = a가 되는 x를 찾는다)으로 구한다.
 *   · 식을 답으로 하는 문항은 표본값에서 계수를 되찾아 문자열을 다시 조립한다.
 *   · 판별 문항(3·8)과 개수 문항(12)은 정의역 원소·대응을 전수 나열한다.
 */
module.exports = function ({ chk }) {
  const R6 = (v) => Math.round(v * 1e6) / 1e6;
  const M = (v) => String(v).replace('-', '−'); // 유니코드 마이너스로 표기 통일
  const solve = (fn, y) => { // fn(x) = y 인 x를 격자로 찾는다
    let best = null, gap = Infinity;
    for (let x = -200; x <= 200; x = R6(x + 0.0005)) { const d = Math.abs(fn(x) - y); if (d < gap) { gap = d; best = x; } }
    return R6(best);
  };

  /* 1. 두 함수를 따로 정의하고 순서대로 적용한다. */
  const f1 = (x) => 2 * x - 1, g1 = (x) => x * x + 1;
  chk(1, String(g1(f1(2))), 'f(2)=' + f1(2) + ' → g(3)=' + g1(f1(2)) + ' (f∘g 였다면 ' + f1(g1(2)) + ')');

  /* 2. 표본값에서 이차식 계수를 되찾아 식을 다시 쓴다. */
  const f2 = (x) => 2 * x + 1, g2 = (x) => x * x, h2 = (x) => f2(g2(x));
  const c2 = h2(0), a2 = (h2(1) + h2(-1) - 2 * c2) / 2, b2 = (h2(1) - h2(-1)) / 2;
  const poly = (a, b, c) => [a ? (a === 1 ? 'x²' : a + 'x²') : '', b ? (b === 1 ? 'x' : b + 'x') : '', c ? String(c) : ''].filter(Boolean).join(' + ');
  chk(2, poly(a2, b2, c2), '계수 복원 a=' + a2 + ' b=' + b2 + ' c=' + c2);

  /* 3. 정의역 원소마다 대응하는 실수 값을 전부 모아 개수를 센다. */
  const DOM = [-1, 0, 1];
  const cands3 = [
    ['ㄱ', (x) => [x * x]],
    ['ㄴ', (x) => (x < 0 ? [] : x === 0 ? [0] : [Math.sqrt(x), -Math.sqrt(x)])],
    ['ㄷ', (x) => (x === 0 ? [] : [1 / x])],
    ['ㄹ', (x) => [Math.abs(x) + 1]],
  ];
  const fn3 = cands3.filter(([, g]) => DOM.every((x) => g(x).length === 1)).map(([n]) => n);
  chk(3, fn3.join(', '), '원소별 대응 개수 ㄴ:' + DOM.map((x) => cands3[1][1](x).length).join('/') + ' ㄷ:' + DOM.map((x) => cands3[2][1](x).length).join('/'));

  /* 4·5·11. 역함수 값은 f(x) = a 를 만족하는 x를 격자로 찾는다. */
  chk(4, M(solve((x) => 3 * x + 2, 8)), 'f(x)=8 인 x (f(8)=' + (3 * 8 + 2) + ')');
  const fg5 = (x) => 2 * (x + 1) - 3;
  chk(5, M(solve(fg5, 5)), '(f∘g)(x)=5 인 x ((f∘g)(5)=' + fg5(5) + ')');
  const f11 = (x) => 2 * x + 1, target11 = 4 * 2 - 1;
  chk(11, M(solve(f11, target11)), 'f(g(2))=' + target11 + ' 이 되는 g(2)');

  /* 6. 상수항은 x = 0 에서의 값이다. */
  const f6 = (x) => 3 * x + 2;
  chk(6, String(f6(f6(f6(0)))), '(f∘f∘f)(0)=' + f6(f6(f6(0))) + ' · 2회 합성은 ' + f6(f6(0)));

  /* 7. a를 훑어 일대일(입력이 다르면 값도 다름)이 깨지는 a를 찾는다. */
  const bad7 = [];
  for (let a = -6; a <= 6; a = R6(a + 0.25)) {
    const f = (x) => (a - 2) * x + 5;
    if (Math.abs(f(1) - f(-1)) < 1e-12) bad7.push(a);
  }
  chk(7, 'a ≠ ' + M(bad7.join(', ')), '일대일이 깨지는 a = ' + bad7.join(', '));

  /* 8. 일대일(격자에서 값 충돌 없음) + 치역이 실수 전체인지 확인한다. */
  const cands8 = [['ㄱ', (x) => x * x], ['ㄴ', (x) => 3 * x - 2], ['ㄷ', (x) => Math.abs(x)], ['ㄹ', (x) => x * x * x]];
  const inv8 = cands8.filter(([, f]) => {
    const seen = new Map(); let one = true;
    for (let x = -5; x <= 5; x = R6(x + 0.01)) { const y = R6(f(x)); if (seen.has(y) && Math.abs(seen.get(y) - x) > 1e-9) one = false; seen.set(y, x); }
    const onto = f(-1000) < -100 && f(1000) > 100;
    return one && onto;
  }).map(([n]) => n);
  chk(8, inv8.join(', '), '일대일+치역 전체를 만족하는 것');

  /* 9. 정의역 격자에서 함숫값의 최대·최소를 직접 찾는다. */
  const f9 = (x) => -2 * x + 5;
  let lo9 = Infinity, hi9 = -Infinity;
  for (let x = 1; x <= 4 + 1e-12; x = R6(x + 0.0005)) { const y = f9(x); if (y < lo9) lo9 = y; if (y > hi9) hi9 = y; }
  chk(9, M(R6(lo9)) + ' ≤ y ≤ ' + M(R6(hi9)), 'f(1)=' + f9(1) + ' f(4)=' + f9(4));

  /* 10. t = 2x − 1 로 치환해 f의 식을 복원한 뒤 3을 넣는다(x를 찾는 경로와 다르다). */
  const f10 = (t) => 6 * ((t + 1) / 2) + 1;
  chk(10, String(f10(3)), 'f(t)=6(t+1)/2+1 → f(3)=' + f10(3) + ' · 3을 x에 넣으면 ' + (6 * 3 + 1));

  /* 12. X의 원소 3개가 Y의 원소 2개로 가는 대응을 전부 나열한다. */
  const maps = []; const Y = [4, 5];
  for (const a of Y) for (const b of Y) for (const c of Y) maps.push([a, b, c]);
  chk(12, String(maps.length), '전수 나열 ' + maps.length + '가지');
};
