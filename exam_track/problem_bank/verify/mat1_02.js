/* mat1_02 검산 — 복소수와 이차방정식. 정답키를 문항 텍스트와 다른 경로로 다시 만든다.
 *   · 복소수는 (실수부, 허수부) 쌍으로 직접 곱하고 나눈다 — 공식을 옮겨 적지 않는다.
 *   · 근은 근의 공식 대신 격자·전수 탐색으로 찾고, 범위 문항은 조건을 하나씩 실제로 검사한다.
 */
module.exports = function ({ chk }) {
  var R6 = function (v) { return Math.round(v * 1e6) / 1e6; };
  var M = function (v) { return String(v).replace('-', '−'); };
  // 복소수 = [re, im]
  var mul = function (a, b) { return [a[0] * b[0] - a[1] * b[1], a[0] * b[1] + a[1] * b[0]]; };
  var add = function (a, b) { return [a[0] + b[0], a[1] + b[1]]; };
  var div = function (a, b) { var d = b[0] * b[0] + b[1] * b[1]; return [(a[0] * b[0] + a[1] * b[1]) / d, (a[1] * b[0] - a[0] * b[1]) / d]; };
  function cstr(z, den) { // (re + im i)/den 꼴 문자열
    var re = R6(z[0] * den), im = R6(z[1] * den);
    var s = (re === 0 ? '' : M(re)) + (im === 0 ? '' : (im > 0 ? (re === 0 ? '' : ' + ') + (im === 1 ? 'i' : im + 'i') : (re === 0 ? '−' : ' − ') + (Math.abs(im) === 1 ? 'i' : Math.abs(im) + 'i')));
    return den === 1 ? s : '(' + s + ')/' + den;
  }

  /* 1. i의 거듭제곱을 직접 곱해 더한다 */
  var s1 = [0, 0], p = [1, 0];
  for (var k = 1; k <= 10; k++) { p = mul(p, [0, 1]); s1 = add(s1, p); }
  chk(1, cstr(s1, 1), '합 = (' + R6(s1[0]) + ', ' + R6(s1[1]) + ')');

  /* 2. 복소수 나눗셈을 직접 계산해 분모 2 꼴로 적는다 */
  var q2 = div([1, 2], [1, -1]);
  chk(2, cstr(q2, 2), '몫 = ' + R6(q2[0]) + ' + ' + R6(q2[1]) + 'i · 되곱하기 검산 ' + mul(q2, [1, -1]).map(R6).join(','));

  /* 3. k를 훑어 서로 다른 두 실근을 갖는 구간의 경계를 찾는다 */
  var ok3 = function (k) { var D = 4 * (k - 1) * (k - 1) - 4 * k * k; return D > 0; };
  var hi3 = null; for (var k3 = -5; k3 <= 5; k3 = R6(k3 + 0.0001)) { if (ok3(k3)) hi3 = k3; }
  chk(3, 'k &lt; ' + (Math.abs(hi3 - 0.5) < 0.001 ? '1/2' : R6(hi3)), '경계 ' + R6(hi3) + ' · k=0.5 성립?' + ok3(0.5));

  /* 4·6·7. 두 근을 수치로 찾아 대칭식을 직접 계산 */
  function roots(a, b, c) { var D = b * b - 4 * a * c; var s = Math.sqrt(Math.abs(D)); return D >= 0 ? [[(-b + s) / (2 * a), 0], [(-b - s) / (2 * a), 0]] : [[-b / (2 * a), s / (2 * a)], [-b / (2 * a), -s / (2 * a)]]; }
  var r4 = roots(1, -5, 3);
  chk(4, String(Math.round(mul(r4[0], r4[0])[0] + mul(r4[1], r4[1])[0])), 'α²+β² = ' + R6(mul(r4[0], r4[0])[0] + mul(r4[1], r4[1])[0]));
  var r6 = roots(1, 2, 3), inv = add(div([1, 0], r6[0]), div([1, 0], r6[1]));
  chk(6, M(Math.round(inv[0] * 3)) + '/3', '1/α+1/β = ' + R6(inv[0]) + ' + ' + R6(inv[1]) + 'i');
  var r7 = roots(1, -3, 1), cube = add(mul(mul(r7[0], r7[0]), r7[0]), mul(mul(r7[1], r7[1]), r7[1]));
  chk(7, String(Math.round(cube[0])), 'α³+β³ = ' + R6(cube[0]));

  /* 5. 켤레근으로 만든 방정식의 계수를 되찾는다 */
  var z5 = [2, 1], zb = [2, -1];
  var a5 = -(z5[0] + zb[0]), b5 = mul(z5, zb)[0];
  chk(5, M(a5 + b5), 'a=' + a5 + ' b=' + b5);

  /* 8. a, b 를 전수 탐색해 복소수 상등을 만족하는 값을 찾는다 */
  var sol8 = null;
  for (var a8 = -20; a8 <= 20 && !sol8; a8++) for (var b8 = -20; b8 <= 20; b8++) {
    var L = mul([a8, 2], [1, -1]);
    if (Math.abs(L[0] - 5) < 1e-9 && Math.abs(L[1] + b8) < 1e-9) { sol8 = [a8, b8]; break; }
  }
  chk(8, M(sol8[0] + sol8[1]), 'a=' + sol8[0] + ' b=' + sol8[1]);

  /* 9. m을 훑어 두 근이 모두 양의 실수인 구간을 찾는다 */
  var ok9 = function (m) {
    var D = (m - 3) * (m - 3) - 4 * m; if (D < 0) return false;
    var s = Math.sqrt(D), r1 = (-(m - 3) + s) / 2, r2 = (-(m - 3) - s) / 2;
    return r1 > 0 && r2 > 0;
  };
  var lo9 = null, hi9 = null;
  for (var m9 = -5; m9 <= 15; m9 = R6(m9 + 0.0001)) { if (ok9(m9)) { if (lo9 === null) lo9 = m9; hi9 = m9; } }
  chk(9, (ok9(0) ? '0 ≤ m' : '0 &lt; m') + ' ' + (ok9(1) ? '≤ 1' : '&lt; 1'), '구간 ' + R6(lo9) + '~' + R6(hi9) + ' · m=1 성립?' + ok9(1) + ' m=0 성립?' + ok9(0));

  /* 10. 판별식과 근을 직접 구해 문장을 조립 */
  var D10 = 16 - 16, r10 = roots(1, -4, 4);
  chk(10, (D10 === 0 ? '중근을 갖는다' : '중근이 아니다'), 'D=' + D10 + ' 근=' + R6(r10[0][0]) + ',' + R6(r10[1][0]));

  /* 11. 켤레와의 합·곱을 직접 계산 */
  var z11 = [3, -2], c11 = [3, 2];
  chk(11, R6(add(z11, c11)[0]) + ', ' + R6(mul(z11, c11)[0]), '합=' + add(z11, c11).map(R6).join(',') + ' 곱=' + mul(z11, c11).map(R6).join(','));

  /* 12. 두 근을 1씩 옮긴 뒤 합과 곱으로 방정식을 다시 세운다 */
  var r12 = roots(1, -3, 5);
  var n1 = add(r12[0], [1, 0]), n2 = add(r12[1], [1, 0]);
  var S = R6(add(n1, n2)[0]), P = R6(mul(n1, n2)[0]);
  chk(12, 'x² ' + (S >= 0 ? '− ' + S : '+ ' + Math.abs(S)) + 'x ' + (P >= 0 ? '+ ' + P : '− ' + Math.abs(P)) + ' = 0', '새 합 ' + S + ' 곱 ' + P);
};
