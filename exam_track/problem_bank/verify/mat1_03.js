/* mat1_03 검산 — 이차함수와 이차부등식. 정답키를 문항 텍스트와 다른 경로로 다시 만든다.
 *   · 꼭짓점·최대·최소는 공식 대신 격자 대입으로 찾는다.
 *   · 부등식의 해와 미지수 범위는 실제로 값을 넣어 참·거짓을 확인해 경계를 읽는다.
 *   · 식이 답인 문항은 조건을 만족하는 계수를 탐색해 문자열을 조립한다.
 */
module.exports = function ({ chk }) {
  var R6 = function (v) { return Math.round(v * 1e6) / 1e6; };
  var M = function (v) { return String(v).replace('-', '−'); };
  function scan(lo, hi, step, fn) { for (var x = lo; x <= hi + 1e-12; x = R6(x + step)) fn(R6(x)); }
  function extremum(f, lo, hi, step) {
    var mn = Infinity, mx = -Infinity, at = null;
    scan(lo, hi, step, function (x) { var y = f(x); if (y < mn) { mn = y; at = x; } if (y > mx) mx = y; });
    return { min: R6(mn), max: R6(mx), argmin: at };
  }
  // 참인 x 구간의 경계와 끝점 포함 여부
  function region(pred, lo, hi, step) {
    var a = null, b = null;
    scan(lo, hi, step, function (x) { if (pred(x)) { if (a === null) a = x; b = x; } });
    return { lo: a, hi: b };
  }

  /* 1. 꼭짓점 = 격자에서 최솟값이 나오는 자리 */
  var f1 = function (x) { return 2 * x * x - 8 * x + 5; };
  var e1 = extremum(f1, -10, 10, 0.0005);
  chk(1, '(' + M(e1.argmin) + ', ' + M(e1.min) + ')', '최솟값 위치에서 y=' + e1.min);

  /* 2. 정의역 [0,3]에서 최대·최소를 직접 찾는다 */
  var e2 = extremum(function (x) { return x * x - 4 * x + 1; }, 0, 3, 0.0005);
  chk(2, M(R6(e2.max + e2.min)), '최대 ' + e2.max + ' 최소 ' + e2.min);

  /* 3. k를 훑어 두 그래프가 서로 다른 두 점에서 만나는 경계를 찾는다 */
  var two3 = function (k) { var D = 16 - 4 * (2 - k); return D > 0; };
  var r3 = region(two3, -10, 10, 0.0001);
  chk(3, 'k &gt; ' + M(R6(r3.lo - 0.0001)), '성립 시작 ' + R6(r3.lo) + ' · k=−2 성립?' + two3(-2));

  /* 4·8·12. 부등식의 해는 값을 넣어 참인 구간을 읽는다 */
  var p4 = function (x) { return x * x - 5 * x + 6 <= 0; };
  var r4 = region(p4, -10, 10, 0.0005);
  chk(4, (p4(r4.lo) ? M(r4.lo) + ' ≤ x' : M(r4.lo) + ' &lt; x') + ' ' + (p4(r4.hi) ? '≤ ' + M(r4.hi) : '&lt; ' + M(r4.hi)), '구간 ' + r4.lo + '~' + r4.hi);
  var p8 = function (x) { return (x * x - x - 6 < 0) && (x * x - 4 * x + 3 > 0); };
  var r8 = region(p8, -10, 10, 0.0005);
  chk(8, M(R6(r8.lo - 0.0005)) + ' &lt; x &lt; ' + M(R6(r8.hi + 0.0005)), '참인 구간 ' + r8.lo + '~' + r8.hi);
  var noSol = function (k) { var any = false; scan(-50, 50, 0.001, function (x) { if (x * x - 2 * x + k < 0) any = true; }); return !any; };
  var kk = null; for (var k12 = -3; k12 <= 5; k12 = R6(k12 + 0.05)) { if (noSol(k12)) { kk = k12; break; } }
  chk(12, 'k ' + (noSol(1) ? '≥' : '&gt;') + ' ' + Math.round(kk), '해 없음 시작 ' + kk + ' · k=1 해없음?' + noSol(1) + ' k=0.95 해없음?' + noSol(0.95));

  /* 5. 해가 −1 &lt; x &lt; 3 이 되는 (a, b) 를 전수 탐색 */
  var sol5 = null;
  for (var a5 = -10; a5 <= 10 && !sol5; a5++) for (var b5 = -10; b5 <= 10; b5++) {
    var ok = true;
    scan(-6, 8, 0.01, function (x) {
      var lhs = x * x + a5 * x + b5 < 0, want = x > -1 && x < 3;
      if (Math.abs(x + 1) > 0.02 && Math.abs(x - 3) > 0.02 && lhs !== want) ok = false;
    });
    if (ok) { sol5 = [a5, b5]; break; }
  }
  chk(5, M(sol5[0] + sol5[1]), 'a=' + sol5[0] + ' b=' + sol5[1]);

  /* 6. 넓이를 격자로 최대화 */
  var e6 = extremum(function (x) { return -(x * (20 - x) / 2); }, 0.01, 19.99, 0.001);
  chk(6, R6(-e6.min) + ' m²', '최대 넓이 ' + R6(-e6.min) + ' (x=' + e6.argmin + ')');

  /* 7. 꼭짓점 꼴에서 a 를 탐색해 전개 계수를 조립 */
  var a7 = null; for (var t = -5; t <= 5; t = R6(t + 0.5)) { if (Math.abs(t * 4 - 4 - 4) < 1e-9) a7 = t; }
  var A = a7, B = -2 * a7, C = a7 - 4;
  chk(7, 'y = ' + A + 'x² ' + (B < 0 ? '− ' + Math.abs(B) : '+ ' + B) + 'x ' + (C < 0 ? '− ' + Math.abs(C) : '+ ' + C), 'a=' + a7 + ' → ' + A + ',' + B + ',' + C);

  /* 9. a·D의 부호 조합을 전수로 좁힌다 */
  var seen = {};
  for (var a9 = -3; a9 <= 3; a9++) { if (!a9) continue;
    for (var b9 = -4; b9 <= 4; b9++) for (var c9 = -4; c9 <= 4; c9++) {
      var D = b9 * b9 - 4 * a9 * c9;
      if (a9 > 0 && D > 0) seen[(a9 > 0 ? 'a+' : 'a−') + (D > 0 ? 'D+' : D === 0 ? 'D0' : 'D−')] = 1;
    }
  }
  var keys = Object.keys(seen);
  chk(9, keys.length === 1 && keys[0] === 'a+D+' ? 'a &gt; 0, D &gt; 0' : '조합이 하나가 아님', '가능한 조합 ' + keys.join(','));

  /* 10. 꼭짓점을 찾아 이동량을 더한다 */
  var e10 = extremum(function (x) { return x * x - 4 * x + 7; }, -10, 10, 0.0005);
  chk(10, '(' + M(R6(e10.argmin - 1)) + ', ' + M(R6(e10.min + 2)) + ')', '원래 꼭짓점 (' + e10.argmin + ', ' + e10.min + ')');

  /* 11. 접하는 k 를 찾고 그때의 중근을 격자로 확인 */
  var k11 = null;
  for (var kx = -10; kx <= 10; kx = R6(kx + 0.01)) { if (Math.abs(16 + 4 * kx) < 1e-9) k11 = kx; }
  var e11 = extremum(function (x) { return Math.abs((x * x - 3 * x) - (x + k11)); }, -10, 10, 0.0005);
  chk(11, M(e11.argmin), 'k=' + k11 + ' · 두 그래프의 차가 0이 되는 x=' + e11.argmin);
};
