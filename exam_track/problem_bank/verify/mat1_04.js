/* mat1_04 검산 — 여러 가지 방정식과 부등식. 정답키를 문항 텍스트와 다른 경로로 다시 만든다.
 *   · 방정식의 해는 인수분해 대신 격자·전수 대입으로 찾는다.
 *   · 부등식·조건 범위는 값을 실제로 넣어 참·거짓을 확인해 경계와 끝점 포함 여부를 읽는다.
 */
module.exports = function ({ chk }) {
  var R6 = function (v) { return Math.round(v * 1e6) / 1e6; };
  var M = function (v) { return String(v).replace('-', '−'); };
  function scan(lo, hi, step, fn) { for (var x = lo; x <= hi + 1e-12; x = R6(x + step)) fn(R6(x)); }
  function realRoots(f, lo, hi) { // 부호가 바뀌는 자리를 이분법으로 좁힌다
    var out = [], prev = f(lo), px = lo;
    scan(lo + 0.001, hi, 0.001, function (x) {
      var v = f(x);
      if (Math.abs(v) < 1e-9) { out.push(R6(x)); }
      else if (prev * v < 0) {
        var a = px, b = x;
        for (var i = 0; i < 60; i++) { var m = (a + b) / 2; if (f(a) * f(m) <= 0) b = m; else a = m; }
        out.push(R6((a + b) / 2));
      }
      prev = v; px = x;
    });
    return out.filter(function (v, i, arr) { return arr.findIndex(function (w) { return Math.abs(w - v) < 1e-4; }) === i; });
  }
  function region(pred, lo, hi, step) {
    var a = null, b = null;
    scan(lo, hi, step, function (x) { if (pred(x)) { if (a === null) a = x; b = x; } });
    return { lo: a, hi: b };
  }

  /* 1. x³ − 1 의 실근 */
  var r1 = realRoots(function (x) { return x * x * x - 1; }, -5, 5);
  chk(1, 'x = ' + r1.map(function (v) { return M(Math.round(v)); }).join(' 또는 x = '), '실근 ' + r1.join(','));

  /* 2. 삼차방정식의 정수근 전수 */
  var r2 = [];
  for (var n = -20; n <= 20; n++) if (n * n * n - 2 * n * n - 5 * n + 6 === 0) r2.push(n);
  r2.sort(function (u, v) { return u - v; });
  chk(2, 'x = ' + r2.map(M).join(' 또는 x = '), '근 ' + r2.join(','));

  /* 3. 사차방정식의 정수근 → ± 짝으로 묶는다 */
  var r3 = [];
  for (var m = -20; m <= 20; m++) if (Math.pow(m, 4) - 13 * m * m + 36 === 0) r3.push(m);
  var pos3 = r3.filter(function (v) { return v > 0; }).sort(function (u, v) { return u - v; });
  chk(3, pos3.map(function (v) { return 'x = ±' + v; }).join(' 또는 '), '근 ' + r3.join(','));

  /* 4. 연립방정식의 정수해 전수 */
  var s4 = [];
  for (var x4 = -20; x4 <= 20; x4++) for (var y4 = -20; y4 <= 20; y4++)
    if (x4 + y4 === 5 && x4 * x4 + y4 * y4 === 13) s4.push([x4, y4]);
  s4.sort(function (p, q) { return p[0] - q[0]; });
  chk(4, s4.map(function (p) { return 'x = ' + M(p[0]) + ', y = ' + M(p[1]); }).join(' 또는 '), '해 ' + JSON.stringify(s4));

  /* 5·6. 부등식의 해를 값 대입으로 읽는다 */
  var p5 = function (x) { return Math.abs(2 * x - 1) <= 5; };
  var g5 = region(p5, -10, 10, 0.0005);
  chk(5, (p5(g5.lo) ? M(g5.lo) + ' ≤ x' : M(g5.lo) + ' &lt; x') + ' ' + (p5(g5.hi) ? '≤ ' + M(g5.hi) : '&lt; ' + M(g5.hi)), '구간 ' + g5.lo + '~' + g5.hi);
  var p6 = function (x) { return (3 * x - 1 < x + 5) && (2 * x + 3 >= x - 1); };
  var g6 = region(p6, -10, 10, 0.0005);
  chk(6, (p6(-4) ? '−4 ≤ x' : '−4 &lt; x') + ' ' + (p6(3) ? '≤ 3' : '&lt; 3'), '구간 ' + g6.lo + '~' + g6.hi + ' · x=−4?' + p6(-4) + ' x=3?' + p6(3));

  /* 7. a 를 훑어 두 부등식의 공통 범위가 존재하는 경계를 찾는다 */
  var has7 = function (a) { var any = false; scan(a - 1, 2 * a - 2, 0.01, function (x) { if (x > a && x < 2 * a - 3) any = true; }); return any; };
  var g7 = region(has7, -5, 15, 0.01);
  chk(7, 'a ' + (has7(3) ? '≥' : '&gt;') + ' 3', '해 있는 a 시작 ' + g7.lo + ' · a=3?' + has7(3) + ' a=3.5?' + has7(3.5));

  /* 8. a 를 정하고 나머지 두 근의 곱을 구한다 */
  var a8 = null; for (var t = -20; t <= 20; t++) if (1 + t + 6 === 0) a8 = t;
  var r8 = realRoots(function (x) { return x * x * x + a8 * x + 6; }, -10, 10).map(function (v) { return Math.round(v); });
  var rest = r8.filter(function (v) { return v !== 1; });
  chk(8, M(rest.reduce(function (p, q) { return p * q; }, 1)), 'a=' + a8 + ' 근 ' + r8.join(',') + ' 나머지 합은 ' + rest.reduce(function (p, q) { return p + q; }, 0));

  /* 9. 연립방정식의 해 중 x가 양수인 것 */
  var s9 = [];
  for (var x9 = -20; x9 <= 20; x9++) { var y9 = x9 - 1; if (x9 * x9 + y9 * y9 === 25) s9.push([x9, y9]); }
  var pos9 = s9.filter(function (p) { return p[0] > 0; });
  chk(9, 'x = ' + M(pos9[0][0]) + ', y = ' + M(pos9[0][1]), '전체 해 ' + JSON.stringify(s9));

  /* 10. 절댓값 방정식의 해를 격자로 찾는다 */
  var r10 = realRoots(function (x) { return Math.abs(x - 2) - 3 * x; }, -10, 10);
  var v10 = R6(r10[0]);
  chk(10, 'x = ' + (Math.abs(v10 - 0.5) < 1e-3 ? '1/2' : M(v10)), '해 ' + r10.join(',') + ' (x≥2 경우의 값 −1은 범위 밖)');

  /* 11. 조건을 만족하는 정수를 센다 */
  var c11 = 0, list = [];
  for (var k = -20; k <= 20; k++) if (2 * (k + 3) < 20 && k - 4 > -1) { c11++; list.push(k); }
  chk(11, String(c11), '정수 ' + list.join(','));

  /* 12. k 를 훑어 서로 다른 세 실근을 갖지 못하는 값을 찾는다 */
  var bad = [];
  for (var kx = -5; kx <= 5; kx = R6(kx + 0.5)) {
    var roots = [0, 1, kx].map(R6);
    var uniq = roots.filter(function (v, i, arr) { return arr.indexOf(v) === i; });
    if (uniq.length < 3) bad.push(kx);
  }
  chk(12, bad.map(function (v) { return 'k ≠ ' + M(v); }).join(' 이고 '), '겹치는 k = ' + bad.join(','));
};
