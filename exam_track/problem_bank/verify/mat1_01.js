/* mat1_01 검산 — 다항식. 정답키를 문항 텍스트와 다른 경로로 다시 만든다.
 *   · 전개·계수는 표본값에서 계수를 되찾아(연립) 확인한다 — 공식으로 풀지 않는다.
 *   · 나머지는 실제 다항식을 만들어 조립제법으로 나눈다.
 *   · 인수분해는 근을 찾아 인수를 조립하고, 항등식은 여러 값에서 양변이 같은지 본다.
 */
module.exports = function ({ chk }) {
  var R6 = function (v) { return Math.round(v * 1e6) / 1e6; };
  var M = function (v) { return String(v).replace('-', '−'); };
  // 다항식은 계수 배열(높은 차수부터)로 다룬다
  function evalP(c, x) { return c.reduce(function (s, k) { return s * x + k; }, 0); }
  function synth(c, a) { // (x − a) 로 나눈 몫과 나머지
    var q = [], r = 0;
    for (var i = 0; i < c.length; i++) { r = c[i] + r * a; if (i < c.length - 1) q.push(r); }
    return { q: q, r: r };
  }
  // f(x) 표본에서 3차 계수 [c3,c2,c1,c0] 복원
  function fitCubic(f) {
    var y = [f(0), f(1), f(-1), f(2)];
    var c0 = y[0];
    // y1 = c3+c2+c1+c0, y2 = -c3+c2-c1+c0, y3 = 8c3+4c2+2c1+c0
    var A = y[1] - c0, B = y[2] - c0, C = y[3] - c0;
    var c2 = (A + B) / 2;
    var s = A - c2;            // c3 + c1
    var t = (C - 4 * c2) / 2;  // 4c3 + c1
    var c3 = (t - s) / 3, c1 = s - c3;
    return [R6(c3), R6(c2), R6(c1), R6(c0)];
  }

  /* 1. (2x − 3y)³ 을 y = 1 로 두고 x의 3차식으로 보면 xy² 계수 = x의 1차 계수 */
  var f1 = function (x) { return Math.pow(2 * x - 3, 3); };
  var c1 = fitCubic(f1);
  chk(1, String(c1[2]), '계수 복원 [x³,x²y,xy²,y³] = ' + c1.join(','));

  /* 2·11. 실제 다항식을 만들어 (x − a) 로 나눈 나머지를 조립제법으로 구한다 */
  chk(2, String(synth([1, -2, 3, -5], 2).r), 'P(−2)였다면 ' + synth([1, -2, 3, -5], -2).r);
  var big = new Array(11).fill(0); big[0] = 1; big[5] = 1; big[10] = 1; // x¹⁰ + x⁵ + 1
  chk(11, String(synth(big, -1).r), 'x=1 이었다면 ' + synth(big, 1).r);

  /* 3. P(x) = (x−1)(x−2)Q(x) + 2x + 1 을 실제로 만들어 x−1 로 나눈 나머지를 본다 */
  var Q = [1, 5]; // Q(x) = x + 5 (아무 몫이나)
  var P3 = (function () {
    var base = [1, -3, 2]; // (x−1)(x−2)
    var prod = [];
    for (var i = 0; i < base.length + Q.length - 1; i++) prod[i] = 0;
    for (var a = 0; a < base.length; a++) for (var b = 0; b < Q.length; b++) prod[a + b] += base[a] * Q[b];
    prod[prod.length - 2] += 2; prod[prod.length - 1] += 1; // + 2x + 1
    return prod;
  })();
  chk(3, String(synth(P3, 1).r), 'x−2로 나눈 나머지는 ' + synth(P3, 2).r);

  /* 4. (x−1)(x−2)(x+3) 을 표본값에서 계수 복원 → a+b+c */
  var f4 = function (x) { return (x - 1) * (x - 2) * (x + 3); };
  var c4 = fitCubic(f4);
  chk(4, M(R6(c4[1] + c4[2] + c4[3])), '복원 계수 a,b,c = ' + c4.slice(1).join(','));

  /* 5. P(2)=3 인 아무 다항식으로 (P + 2x)(2) 를 구한다 */
  var P5 = [1, 0, 0, -5]; // x³ − 5 → P(2) = 3
  chk(5, String(evalP(P5, 2) + 2 * 2), 'P(2)=' + evalP(P5, 2));

  /* 6. a, b 를 전수 탐색해 두 조건을 동시에 만족하는 값을 찾는다 */
  var sol6 = null;
  for (var a6 = -20; a6 <= 20 && !sol6; a6++) for (var b6 = -20; b6 <= 20; b6++) {
    var c = [1, a6, b6, 6];
    if (synth(c, 1).r === 0 && synth(c, -2).r === 0) { sol6 = [a6, b6]; break; }
  }
  chk(6, M(sol6[0] * sol6[1]), 'a=' + sol6[0] + ' b=' + sol6[1] + ' 합은 ' + (sol6[0] + sol6[1]));

  /* 7. 나머지를 ax + b 로 놓고 두 조건을 전수 탐색 */
  var sol7 = null;
  for (var a7 = -10; a7 <= 10 && !sol7; a7++) for (var b7 = -10; b7 <= 10; b7++) {
    if (a7 * 1 + b7 === 3 && a7 * -2 + b7 === -6) { sol7 = [a7, b7]; break; }
  }
  var txt7 = (sol7[0] === 1 ? 'x' : sol7[0] === -1 ? '−x' : M(sol7[0]) + 'x') + (sol7[1] === 0 ? '' : (sol7[1] > 0 ? ' + ' + sol7[1] : ' − ' + Math.abs(sol7[1])));
  chk(7, txt7, 'a=' + sol7[0] + ' b=' + sol7[1]);

  /* 8. x⁴ + 4 = (x² + 2)² − (px)² 가 되는 p 를 찾아 두 인수를 조립 */
  var p8 = null;
  for (var p = 1; p <= 6 && !p8; p++) {
    var ok = true;
    for (var x = -3; x <= 3; x += 0.25) {
      var l = Math.pow(x, 4) + 4, r = (x * x - p * x + 2) * (x * x + p * x + 2);
      if (Math.abs(l - r) > 1e-9) ok = false;
    }
    if (ok) p8 = p;
  }
  chk(8, '(x² − ' + p8 + 'x + 2)(x² + ' + p8 + 'x + 2)', 'p=' + p8 + ' 로 항등 성립');

  /* 9. 정수근을 찾아 |근| 오름차순으로 인수를 조립 */
  var c9 = [1, 2, -5, -6], roots = [];
  for (var r9 = -10; r9 <= 10; r9++) if (evalP(c9, r9) === 0) roots.push(r9);
  roots.sort(function (u, v) { return Math.abs(u) - Math.abs(v); });
  var txt9 = roots.map(function (r) { return r < 0 ? '(x + ' + (-r) + ')' : '(x − ' + r + ')'; }).join('');
  chk(9, txt9, '근 ' + roots.join(','));

  /* 10. x + 1/x = 3 을 수치로 풀어 대입 */
  var x10 = null;
  for (var v = 0.001; v < 10; v = R6(v + 0.000001)) { if (Math.abs(v + 1 / v - 3) < 1e-6) { x10 = v; break; } }
  chk(10, String(Math.round(x10 * x10 + 1 / (x10 * x10))), 'x=' + R6(x10) + ' → ' + R6(x10 * x10 + 1 / (x10 * x10)));

  /* 12. 항등식을 여러 (a,b,c) 에서 확인한 뒤 인수를 적는다 */
  var ok12 = true;
  for (var i = 0; i < 40; i++) {
    var A = (i % 7) - 3, B = ((i * 3) % 9) - 4, C = ((i * 5) % 11) - 5;
    var L = A * A * A + B * B * B + C * C * C - 3 * A * B * C;
    var Rr = (A + B + C) * (A * A + B * B + C * C - A * B - B * C - C * A);
    if (L !== Rr) ok12 = false;
  }
  chk(12, ok12 ? '(a + b + c)(a² + b² + c² − ab − bc − ca)' : '항등식 불성립', '무작위 40쌍 항등 확인=' + ok12);
};
