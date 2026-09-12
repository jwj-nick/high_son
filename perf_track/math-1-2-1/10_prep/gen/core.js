/* core.js — math-1-2-1 변형 생성기 (정본)
 * 유형 1: 원 밖의 점에서 그은 접선(기울기·접선 방정식·접점·실제 길이)
 * 유형 2: 두 직선을 차례로 거쳐 두 원을 잇는 최단 경로(대칭이동)
 * 이 파일은 classic script(export 없음). Node에서는 variants.mjs가 new Function으로 읽고,
 * 앱(perf_circle_path.html)과 프린트 팩에는 build.mjs가 마커 사이에 인라인한다.
 * 모든 숫자는 정확한 분수(F)로 계산하고, 문장은 solve*() 가 만든다.
 */
var VG = (function () {
  'use strict';

  /* ---------- 분수 ---------- */
  function gcd(a, b) { a = Math.abs(a); b = Math.abs(b); while (b) { var t = a % b; a = b; b = t; } return a || 1; }
  function F(n, d) {
    if (n instanceof Fr) return n;
    if (d === undefined) d = 1;
    return new Fr(n, d);
  }
  function Fr(n, d) {
    if (d === 0) throw new Error('div0');
    if (d < 0) { n = -n; d = -d; }
    var g = gcd(n, d); this.n = n / g; this.d = d / g;
  }
  Fr.prototype.add = function (o) { o = F(o); return F(this.n * o.d + o.n * this.d, this.d * o.d); };
  Fr.prototype.sub = function (o) { o = F(o); return F(this.n * o.d - o.n * this.d, this.d * o.d); };
  Fr.prototype.mul = function (o) { o = F(o); return F(this.n * o.n, this.d * o.d); };
  Fr.prototype.div = function (o) { o = F(o); return F(this.n * o.d, this.d * o.n); };
  Fr.prototype.neg = function () { return F(-this.n, this.d); };
  Fr.prototype.sq = function () { return F(this.n * this.n, this.d * this.d); };
  Fr.prototype.eq = function (o) { o = F(o); return this.n === o.n && this.d === o.d; };
  Fr.prototype.isInt = function () { return this.d === 1; };
  Fr.prototype.val = function () { return this.n / this.d; };
  Fr.prototype.sign = function () { return this.n > 0 ? 1 : this.n < 0 ? -1 : 0; };
  Fr.prototype.abs = function () { return F(Math.abs(this.n), this.d); };
  /* 표시: 유니코드 마이너스 */
  Fr.prototype.s = function () { return (this.n < 0 ? '−' : '') + Math.abs(this.n) + (this.d === 1 ? '' : '/' + this.d); };
  /* 입력용(ASCII) */
  Fr.prototype.a = function () { return this.n + (this.d === 1 ? '' : '/' + this.d); };
  function realStr(f) { f = F(f); if (f.isInt()) return f.s(); var v = f.val(); return neg(String(Math.round(v * 1000) / 1000)); }
  function isqrt(n) { var r = Math.round(Math.sqrt(n)); return r * r === n ? r : null; }
  /* 완전제곱 분수의 제곱근 */
  function fsqrt(f) { var a = isqrt(f.n), b = isqrt(f.d); if (a === null || b === null) return null; return F(a, b); }

  /* ---------- 문자열 도우미 ---------- */
  function neg(s) { return String(s).replace(/-/g, '−'); }
  /* (x − a)² 꼴. a가 0이면 x², a<0이면 (x + |a|)² */
  function sqTerm(v, a) { a = F(a); if (a.n === 0) return v + '²'; return '(' + v + (a.n > 0 ? ' − ' : ' + ') + a.abs().s() + ')²'; }
  function circleEq(cx, cy, r) { return sqTerm('x', cx) + ' + ' + sqTerm('y', cy) + ' = ' + (r * r); }
  function pt(x, y) { return '(' + F(x).s() + ', ' + F(y).s() + ')'; }
  /* 계수 × 변수: 1x→x, −1x→−x, 3/4 x → (3/4)x */
  function coefVar(c, v) {
    c = F(c); if (c.n === 0) return '0';
    var sgn = c.n < 0 ? '−' : ''; var ab = c.abs();
    if (ab.eq(1)) return sgn + v;
    return sgn + (ab.isInt() ? ab.s() : '(' + ab.s() + ')') + v;
  }
  /* 뒤에 붙는 항: + 13/4, − 5/4, (0이면 빈 문자열) */
  function tail(c) { c = F(c); if (c.n === 0) return ''; return (c.n < 0 ? ' − ' : ' + ') + c.abs().s(); }
  function tailVar(c, v) { c = F(c); if (c.n === 0) return ''; var ab = c.abs(); var body = ab.eq(1) ? v : (ab.isInt() ? ab.s() : '(' + ab.s() + ')') + v; return (c.n < 0 ? ' − ' : ' + ') + body; }
  /* y = mx + b */
  function lineSlope(m, b) { m = F(m); b = F(b); if (m.n === 0) return 'y = ' + b.s(); return 'y = ' + coefVar(m, 'x') + tail(b); }
  /* 일반형 ax + by + c = 0 (정수, 최대공약수로 나누고 x계수 양수) */
  function lineGeneral(a, b, c) {
    var g = gcd(gcd(a, b), c); a /= g; b /= g; c /= g;
    if (a < 0 || (a === 0 && b < 0)) { a = -a; b = -b; c = -c; }
    var s = a !== 0 ? coefVar(a, 'x') : '';
    s += a !== 0 ? tailVar(b, 'y') : coefVar(b, 'y');
    s += tail(c);
    return s + ' = 0';
  }
  /* 기울기 m=p/q, 점(ax,ay) 지나는 직선의 일반형 계수 */
  function generalFromSlope(m, ax, ay) { m = F(m); var p = m.n, q = m.d; // q y = p x + (q ay − p ax)
    return { a: p, b: -q, c: q * ay - p * ax }; }
  /* 조사: 마지막 한글/숫자 글자의 받침으로 결정. josa('호수','과')→'호수와', josa('길','를')→'길을', josa(16,'을')→'16을' */
  var JOSA = { '과': ['과', '와'], '와': ['과', '와'], '을': ['을', '를'], '를': ['을', '를'], '이': ['이', '가'], '가': ['이', '가'], '은': ['은', '는'], '는': ['은', '는'] };
  var DIGIT_BATCHIM = { '0': 1, '1': 1, '2': 0, '3': 1, '4': 0, '5': 0, '6': 1, '7': 1, '8': 1, '9': 0 };
  /* 0 = 받침 없음, 1 = 받침 있음, 2 = ㄹ 받침. 라틴 문자는 읽는 소리(엑스·와이·비…)로 판단 */
  function batchim(str) {
    str = String(str);
    for (var i = str.length - 1; i >= 0; i--) {
      var ch = str[i], c = ch.charCodeAt(0);
      if (c >= 0xAC00 && c <= 0xD7A3) { var j = (c - 0xAC00) % 28; return j === 0 ? 0 : (j === 8 ? 2 : 1); }
      if (ch >= '0' && ch <= '9') return DIGIT_BATCHIM[ch];
      if (/[A-Za-z]/.test(ch)) return 'lmnrLMNR'.indexOf(ch) >= 0 ? 1 : 0;
      if (ch === '₁') return 1; if (ch === '₂') return 0; // 일(받침 있음)·이(없음)
    }
    return 0;
  }
  function hasBatchim(str) { return batchim(str) !== 0; }
  function josa(word, j) {
    if (j === '로' || j === '으로') { var b = batchim(word); return String(word) + (b === 1 ? '으로' : '로'); }
    var pr = JOSA[j]; return String(word) + (hasBatchim(word) ? pr[0] : pr[1]);
  }
  /* 항들의 합: [[계수, 변수], ...] 0은 건너뜀 */
  function sumTerms(terms) { var s = ''; terms.forEach(function (t) { var c = F(t[0]); if (c.n === 0) return; if (!s) s = t[1] ? coefVar(c, t[1]) : c.s(); else s += t[1] ? tailVar(c, t[1]) : tail(c); }); return s || '0'; }
  function diffAbs(a, b) { return '|' + F(a).s() + ' − ' + (b < 0 ? '(' + F(b).s() + ')' : F(b).s()) + '|'; }
  /* m에 대한 일차식 k1 m + k0 */
  function linM(k1, k0) { var s = ''; if (k1 !== 0) s += coefVar(k1, 'm'); if (k0 !== 0) s += s ? tail(k0) : F(k0).s(); return s || '0'; }

  /* ---------- 유형 1: 접선 ---------- */
  var T1_STORIES = [
    { place: '원형 생태공원', road: '산책로', who: '과천시는 주민들이 이용할 수 있는', extra: '생태공원 밖에 있는 점 A에서 출발하여 공원에 닿는 직선 모양의 산책로를 만들려고 한다. 이때 산책로는 생태공원의 내부를 지나지 않고 공원의 경계와 한 점에서만 만나도록 설계한다. (단, 산책로의 폭은 생각하지 않는다.)', tail: '산책로의 폭은 생각하지 않는다' },
    { place: '원형 분수대', road: '조명 케이블', who: '한 공원에서는 광장 한가운데의', extra: '분수대 밖에 있는 전원함 A에서 출발하여 분수대 가장자리에 닿는 직선 모양의 조명 케이블을 설치하려고 한다. 케이블은 분수대의 내부를 지나지 않고 분수대의 경계와 한 점에서만 만나도록 설계한다. (단, 케이블의 굵기는 생각하지 않는다.)' },
    { place: '원형 호수', road: '나무 데크 길', who: '한 도시는 시민 휴식 공간으로', extra: '호수 밖에 있는 정자 A에서 출발하여 호수에 닿는 직선 모양의 나무 데크 길을 만들려고 한다. 데크 길은 호수의 내부를 지나지 않고 호수의 경계와 한 점에서만 만나도록 설계한다. (단, 데크 길의 폭은 생각하지 않는다.)' },
    { place: '원형 잔디 광장', road: '자전거 도로', who: '한 대학은 캠퍼스 중앙에', extra: '광장 밖에 있는 정문 A에서 출발하여 광장에 닿는 직선 모양의 자전거 도로를 만들려고 한다. 도로는 광장의 내부를 지나지 않고 광장의 경계와 한 점에서만 만나도록 설계한다. (단, 도로의 폭은 생각하지 않는다.)' }
  ];
  var TRIPLES = [[3, 4, 5], [4, 3, 5], [6, 8, 10], [8, 6, 10], [5, 12, 13], [12, 5, 13], [9, 12, 15], [12, 9, 15], [8, 15, 17]]; // [r, ℓ, d]
  var UNITS = [{ v: 10, n: 'm' }, { v: 5, n: 'm' }, { v: 20, n: 'm' }, { v: 25, n: 'm' }, { v: 50, n: 'm' }];

  /* 파라미터 → 문제·정답·풀이 */
  function solveT1(p) {
    var cx = p.cx, cy = p.cy, r = p.r, ax = p.ax, ay = p.ay;
    var dx = cx - ax, dy = cy - ay;
    var d = isqrt(dx * dx + dy * dy); if (d === null) throw new Error('AC not integer');
    var l = isqrt(d * d - r * r); if (l === null) throw new Error('tangent length not integer');
    var horiz = dy === 0, vert = dx === 0;
    if (!horiz && !vert) throw new Error('aligned only');
    var st = T1_STORIES[p.story || 0];
    var unit = p.unit || UNITS[0];
    var pickPos = (p.pick || 'pos') === 'pos';

    /* 문제문 */
    var problem = {
      title: josa(st.place, '과') + ' ' + st.road + ' 설계하기',
      intro: st.who + ' ' + josa(st.place, '과') + ' 직선 모양의 ' + josa(st.road, '를') + ' 만들려고 한다. 이를 좌표평면에 나타냈을 때 ' + st.place + '의 중심은 C' + pt(cx, cy) + '이고, 반지름의 길이는 ' + r + '이다. 또한 좌표평면에서 한 눈금의 실제 길이는 ' + unit.v + ' ' + unit.n + '이다. ' + st.extra.replace(' A에서', ' A' + pt(ax, ay) + '에서'),
      q: [
        '문제 1. ' + st.place + '의 방정식 — 중심이 C' + pt(cx, cy) + '이고 반지름의 길이가 ' + r + '인 ' + st.place + '의 경계를 나타내는 원의 방정식을 구하시오.',
        '문제 2. ' + st.road + '의 방정식 — 점 ' + josa('A' + pt(ax, ay), '을') + ' 지나고 기울기가 m인 직선의 방정식을 y' + tail(-ay) + ' = m(x' + tail(-ax) + ')이라고 하자. 이 직선이 ' + st.place + '의 경계와 한 점에서만 만나도록, 즉 ' + st.place + '에 접하도록 ' + josa(st.road, '를') + ' 만들려고 한다.\n  1. 가능한 기울기 m의 값을 모두 구하시오.\n  2. 두 ' + st.road + '의 방정식을 각각 구하시오.',
        '문제 3. ' + josa(st.road, '와') + ' ' + josa(st.place, '이') + ' 만나는 점 — 문제 2에서 구한 두 ' + st.road + ' 중 기울기가 ' + (pickPos ? '양수' : '음수') + '인 ' + josa(st.road, '를') + ' 선택하자. 이 ' + josa(st.road, '와') + ' ' + josa(st.place, '이') + ' 만나는 점을 P라고 할 때, 점 P의 좌표를 구하시오.',
        '문제 4. 실제 ' + st.road + '의 길이 — 점 A에서 문제 3에서 구한 접점 P까지 ' + josa(st.road, '를') + ' 설치하려고 한다. 좌표평면에서 한 눈금의 실제 길이가 ' + unit.v + ' ' + unit.n + '일 때, 설치해야 하는 ' + st.road + ' AP의 실제 길이를 구하시오. 풀이 과정과 단위를 함께 나타내시오.'
      ]
    };

    /* 1-1 */
    var steps = [];
    steps.push({ title: '문제 1. 원의 방정식', lines: [
      '중심이 (a, b)이고 반지름의 길이가 r인 원의 방정식은 (x − a)² + (y − b)² = r² 이다.',
      '중심이 C' + pt(cx, cy) + ', 반지름이 ' + r + '이므로',
      '▶ ' + circleEq(cx, cy, r)
    ] });

    /* 1-2-1 */
    var k1 = -ax, k0 = ay; // 상수항 k1 m + k0
    var mAbs; // |m|
    var L = [];
    L.push('직선 ' + josa('y' + tail(-ay) + ' = m(x' + tail(-ax) + ')', '을') + ' 정리하면  mx − y' + (linM(k1, k0) === '0' ? '' : ' + (' + linM(k1, k0) + ')') + ' = 0');
    L.push('직선이 원에 접하려면 **원의 중심 C' + pt(cx, cy) + '에서 이 직선까지의 거리가 반지름 ' + josa(r, '과') + ' 같아야** 하므로');
    var inner = sumTerms([[cx, 'm'], [-cy, ''], [k1, 'm'], [k0, '']]);
    L.push('|' + inner + '| / √(m² + 1) = ' + r);
    var sq;
    if (horiz) {
      L.push('→ |' + coefVar(dx, 'm') + '| / √(m² + 1) = ' + r);
      L.push('양변을 제곱하면  ' + (dx * dx) + 'm² = ' + (r * r) + '(m² + 1)');
      L.push('→ ' + (dx * dx - r * r) + 'm² = ' + (r * r) + '  →  m² = ' + F(r * r, l * l).s());
      mAbs = F(r, l);
    } else {
      L.push('→ |' + F(-dy).s() + '| / √(m² + 1) = ' + r + '   (m이 사라지고 상수만 남는다)');
      L.push('양변을 제곱하면  ' + (dy * dy) + ' = ' + (r * r) + '(m² + 1)');
      L.push('→ ' + (r * r) + 'm² = ' + (dy * dy - r * r) + '  →  m² = ' + F(l * l, r * r).s());
      mAbs = F(l, r);
    }
    L.push('▶ m = ' + mAbs.s() + ' 또는 m = −' + mAbs.s());
    steps.push({ title: '문제 2-1. 기울기 m', lines: L });

    /* 1-2-2 */
    var m1 = mAbs, m2 = mAbs.neg();
    function lineOf(m) { var b = F(ay).sub(m.mul(ax)); var g = generalFromSlope(m, ax, ay); return { m: m, b: b, slope: lineSlope(m, b), gen: lineGeneral(g.a, g.b, g.c), g: g }; }
    var l1 = lineOf(m1), l2 = lineOf(m2);
    steps.push({ title: '문제 2-2. 두 ' + st.road + '의 방정식', lines: [
      'm = ' + m1.s() + ' :  y' + tail(-ay) + ' = ' + coefVar(m1, '(x' + tail(-ax) + ')') + '  →  ▶ ' + l1.slope + '   (일반형 ' + l1.gen + ')',
      'm = ' + m2.s() + ' :  y' + tail(-ay) + ' = ' + coefVar(m2, '(x' + tail(-ax) + ')') + '  →  ▶ ' + l2.slope + '   (일반형 ' + l2.gen + ')'
    ] });

    /* 1-3 */
    var sel = pickPos ? l1 : l2, m = sel.m, b = sel.b;
    var pnum = m.n, q = m.d;                 // m = p/q
    var s = q * ay - pnum * ax;              // b = s/q
    var sp = s - q * cy;                     // b − cy = sp/q
    // 방법 A: q²(x − cx)² + (p x + sp)² = r² q²
    var A2 = q * q + pnum * pnum, B2 = -2 * cx * q * q + 2 * pnum * sp, C2 = q * q * cx * cx + sp * sp - r * r * q * q;
    var g2 = gcd(gcd(A2, B2), C2); var A3 = A2 / g2, B3 = B2 / g2, C3 = C2 / g2;
    var sA = isqrt(A3); var t = B3 / (2 * sA); // (sA x + t)² = 0
    if (sA === null || t !== Math.round(t) || t * t !== C3) throw new Error('not perfect square: ' + [A3, B3, C3]);
    var px = F(-t, sA), py = m.mul(px).add(b);
    var LA = [];
    LA.push('기울기가 ' + (pickPos ? '양수' : '음수') + '인 ' + st.road + ' ' + josa(sel.slope, '를') + ' 원의 방정식에 대입한다.');
    LA.push(sqTerm('x', cx) + ' + (' + coefVar(m, 'x') + tail(b) + (cy !== 0 ? tail(-cy) : '') + ')² = ' + (r * r));
    if (q !== 1) {
      LA.push('→ ' + sqTerm('x', cx) + ' + (' + '(' + coefVar(pnum, 'x') + tail(sp) + ')/' + q + ')² = ' + (r * r));
      LA.push('양변에 ' + josa(q * q, '을') + ' 곱하면  ' + (q * q) + sqTerm('x', cx) + ' + (' + coefVar(pnum, 'x') + tail(sp) + ')² = ' + (r * r * q * q));
    } else {
      LA.push('→ ' + sqTerm('x', cx) + ' + (' + coefVar(pnum, 'x') + tail(sp) + ')² = ' + (r * r));
    }
    LA.push('전개하여 정리하면  ' + coefVar(A2, 'x²') + tailVar(B2, 'x') + tail(C2) + ' = 0' + (g2 !== 1 ? '  →  ' + coefVar(A3, 'x²') + tailVar(B3, 'x') + tail(C3) + ' = 0' : ''));
    LA.push('→ (' + coefVar(sA, 'x') + tail(t) + ')² = 0   (접하므로 **중근**)');
    LA.push('→ x = ' + px.s() + ',  y = ' + coefVar(m, '(' + px.s() + ')') + tail(b) + ' = ' + py.s());
    LA.push('▶ P' + pt(px, py));
    steps.push({ title: '문제 3. 접점 P — 방법 A (대입 → 중근, 교과서 표준)', lines: LA });
    // 방법 B: 수선의 발
    var mp = F(-q, pnum); // 수직 기울기 −q/p
    var bp = F(cy).sub(mp.mul(cx));
    var Lc = (pnum < 0 ? -pnum : pnum); var Lm = (q * Lc) / gcd(q, Lc);
    var A1 = (Lm / q) * pnum, B1 = (Lm / q) * s;                 // LHS: (Lm/q)(p x + s)
    var A2b = (Lm / pnum) * (-q), B2b = (Lm / pnum) * (pnum * cy + q * cx); // RHS: (Lm/p)(−q x + p cy + q cx)
    var cA = A1 - A2b, cB = B2b - B1; if (cA < 0) { cA = -cA; cB = -cB; }
    var xB = F(cB, cA);
    var LB = [];
    LB.push('접점 P는 **원의 중심 C에서 접선에 내린 수선의 발**이다. (접선 ⊥ 반지름 CP)');
    LB.push('접선에 수직인 직선의 기울기는 ' + mp.s() + ' 이고 ' + josa('C' + pt(cx, cy), '을') + ' 지나므로  y' + tail(-cy) + ' = ' + coefVar(mp, '(x' + tail(-cx) + ')') + '  →  ' + lineSlope(mp, bp));
    LB.push('두 직선을 연립:  ' + coefVar(m, 'x') + tail(b) + ' = ' + coefVar(mp, 'x') + tail(bp));
    if (Lm !== 1) LB.push('양변에 ' + josa(Lm, '을') + ' 곱하면  ' + coefVar(A1, 'x') + tail(B1) + ' = ' + coefVar(A2b, 'x') + tail(B2b));
    LB.push('→ ' + coefVar(cA, 'x') + ' = ' + F(cB).s() + '  →  x = ' + xB.s() + ',  y = ' + py.s());
    LB.push('▶ P' + pt(px, py) + '  (방법 A와 일치)');
    steps.push({ title: '문제 3. 접점 P — 방법 B (수선의 발, 계산이 짧다)', lines: LB });
    // 검산
    var ex = px.sub(cx), ey = py.sub(cy);
    steps.push({ title: '검산 — P가 원 위에 있는가', lines: [
      '(' + px.s() + tail(-cx) + ')² + (' + py.s() + tail(-cy) + ')² = (' + ex.s() + ')² + (' + ey.s() + ')² = ' + ex.sq().s() + ' + ' + ey.sq().s() + ' = ' + ex.sq().add(ey.sq()).s() + ' = ' + (r * r) + '  ✓'
    ] });

    /* 1-4 */
    var ux = px.sub(ax), uy = py.sub(ay);
    var sum = ux.sq().add(uy.sq()); var root = fsqrt(sum);
    var real = F(l).mul(F(Math.round(unit.v * 100), 100));
    var L4 = [];
    L4.push('두 점 A' + pt(ax, ay) + ', P' + pt(px, py) + ' 사이의 거리는');
    L4.push('AP = √((' + px.s() + tail(-ax) + ')² + (' + py.s() + tail(-ay) + ')²) = √((' + ux.s() + ')² + (' + uy.s() + ')²) = √(' + ux.sq().s() + ' + ' + uy.sq().s() + ') = √' + sum.s() + ' = ' + root.s());
    L4.push('한 눈금의 실제 길이가 ' + unit.v + ' ' + unit.n + '이므로  실제 길이 = ' + root.s() + ' × ' + unit.v + ' = ' + realStr(real) + ' ' + unit.n);
    L4.push('▶ ' + st.road + ' AP의 실제 길이는 **' + realStr(real) + ' ' + unit.n + '**');
    steps.push({ title: '문제 4. 실제 길이 — 방법 A (두 점 사이 거리)', lines: L4 });
    var acTxt = horiz ? ('A와 C의 y좌표가 같으므로 AC = ' + diffAbs(cx, ax) + ' = ' + d) : ('A와 C의 x좌표가 같으므로 AC = ' + diffAbs(cy, ay) + ' = ' + d);
    steps.push({ title: '문제 4. 검산 — 방법 B (접선의 길이, 직각삼각형)', lines: [
      '접점 P에서 반지름 CP ⊥ 접선 AP 이므로 △APC는 ∠P = 90°인 직각삼각형.',
      acTxt + ',  CP = ' + r,
      'AP = √(AC² − CP²) = √(' + (d * d) + ' − ' + (r * r) + ') = √' + (l * l) + ' = ' + l + '  ✓  (문제 3의 P가 틀려도 이 값은 살아남는다)'
    ] });

    return {
      type: 1, params: p, problem: problem, steps: steps,
      answers: { circle: circleEq(cx, cy, r), m1: m1, m2: m2, line1: l1, line2: l2, P: [px, py], len: l, real: real, unit: unit, d: d, l: l },
      brief: [circleEq(cx, cy, r), 'm = ±' + mAbs.s(), l1.slope + ' , ' + l2.slope, 'P' + pt(px, py), 'AP = ' + l + ' → ' + realStr(real) + ' ' + unit.n]
    };
  }

  /* 유형 1 무작위 생성 */
  function genT1(rng, opt) {
    opt = opt || {};
    var tr = TRIPLES[Math.floor(rng() * TRIPLES.length)];
    var r = tr[0], l = tr[1], d = tr[2];
    var horiz = opt.horiz !== undefined ? opt.horiz : rng() < 0.5;
    var side = opt.side !== undefined ? opt.side : (rng() < 0.5 ? -1 : 1);
    var lim = 12 - d; if (lim < 1) lim = 1;
    var cx = Math.floor(rng() * (2 * Math.min(lim, 5) + 1)) - Math.min(lim, 5);
    var cy = Math.floor(rng() * (2 * Math.min(lim, 5) + 1)) - Math.min(lim, 5);
    var ax = horiz ? cx - side * d : cx, ay = horiz ? cy : cy - side * d;
    return { cx: cx, cy: cy, r: r, ax: ax, ay: ay, unit: opt.unit || UNITS[Math.floor(rng() * UNITS.length)], pick: opt.pick || (rng() < 0.5 ? 'pos' : 'neg'), story: opt.story !== undefined ? opt.story : Math.floor(rng() * T1_STORIES.length) };
  }

  /* ---------- 유형 2: 대칭이동 최단 경로 ---------- */
  var LINES = {
    xaxis: { name: 'x축', rule: '(x, y) → (x, −y)', f: function (P) { return F(P[1]); }, refl: function (P) { return [F(P[0]), F(P[1]).neg()]; }, eqText: 'y = 0' },
    yaxis: { name: 'y축', rule: '(x, y) → (−x, y)', f: function (P) { return F(P[0]); }, refl: function (P) { return [F(P[0]).neg(), F(P[1])]; }, eqText: 'x = 0' },
    yx: { name: '직선 y = x', rule: '(x, y) → (y, x)', f: function (P) { return F(P[0]).sub(P[1]); }, refl: function (P) { return [F(P[1]), F(P[0])]; }, eqText: 'y = x' },
    ynx: { name: '직선 y = −x', rule: '(x, y) → (−y, −x)', f: function (P) { return F(P[0]).add(P[1]); }, refl: function (P) { return [F(P[1]).neg(), F(P[0]).neg()]; }, eqText: 'y = −x' }
  };
  var LINE_IDS = ['xaxis', 'yaxis', 'yx'];        // 생성에 쓰는 직선. y = −x 대칭은 2022 개정 범위 밖(MATH_DRILL_PLAN §2)이라 뺀다
  var LINE_IDS_ALL = ['xaxis', 'yaxis', 'yx', 'ynx'];
  var T2_STORIES = [
    { intro: '한 미술관에서는 칸딘스키풍 작품을 대형 미디어아트로 제작하려고 한다. 작품 속 두 원형 무늬 C₁, C₂와 두 직선 무늬를 따라 빛이 이어지도록 일부 구간에 LED라인을 설치할 계획이다.', obj: 'LED 라인', two: '두 직선 무늬' },
    { intro: '한 놀이공원에서는 두 원형 회전 놀이기구 C₁, C₂와 두 직선 도로를 따라 야간 조명 케이블을 설치하려고 한다.', obj: '조명 케이블', two: '두 직선 도로' },
    { intro: '한 로봇 경진대회에서는 두 원형 충전 구역 C₁, C₂와 두 직선 벽을 따라 로봇이 이동하는 경로를 설계하려고 한다.', obj: '로봇의 이동 경로', two: '두 직선 벽' },
    { intro: '한 드론 쇼에서는 두 원형 무대 C₁, C₂와 두 직선 레이저 라인을 따라 드론이 빛을 그리며 이동하도록 경로를 설계하려고 한다.', obj: '드론의 비행 경로', two: '두 직선 레이저 라인' }
  ];
  var PVEC = [[3, 4, 5], [4, 3, 5], [5, 12, 13], [12, 5, 13], [6, 8, 10], [8, 6, 10], [8, 15, 17], [15, 8, 17], [9, 12, 15], [12, 9, 15]];

  function dist2(P, Q) { return F(P[0]).sub(Q[0]).sq().add(F(P[1]).sub(Q[1]).sq()); }
  /* 선분 P1→P2 가 직선 L을 지나는 매개변수 t (분수) 또는 null */
  function crossT(L, P1, P2) { var f1 = L.f(P1), f2 = L.f(P2); var den = f2.sub(f1); if (den.n === 0) return null; return f1.neg().div(den); }
  function lerp(P1, P2, t) { return [F(P1[0]).add(F(P2[0]).sub(P1[0]).mul(t)), F(P1[1]).add(F(P2[1]).sub(P1[1]).mul(t))]; }
  /* 점에서 직선까지 거리의 제곱 (분수) */
  function distLine2(L, P) { var f = L.f(P); var k = (L === LINES.xaxis || L === LINES.yaxis) ? 1 : 2; return f.sq().div(k); }

  function solveT2(p) {
    var L1 = LINES[p.L1], L2 = LINES[p.L2];
    var c1 = p.c1, r1 = p.r1, c2 = p.c2, r2 = p.r2;
    var fixedA = r1 === 0;
    var st = T2_STORIES[p.story || 0];
    var c1p = L1.refl(c1), c2p = L2.refl(c2);
    var D2 = dist2(c1p, c2p); var D = isqrt(D2.n); if (D === null || D2.d !== 1) throw new Error('center distance not integer');
    if (!(D > r1 + r2)) throw new Error('circles not external');
    var ans = D - r1 - r2;
    // 순서 확인: A′(t = r1/D) ≤ P(tP) < Q(tQ) ≤ B′(t = 1 − r2/D)
    var tP = crossT(L1, c1p, c2p), tQ = crossT(L2, c1p, c2p);
    var tA = F(r1, D), tB = F(D - r2, D);
    var orderOK = tP !== null && tQ !== null && tP.sub(tA).sign() >= 0 && tQ.sub(tP).sign() > 0 && tB.sub(tQ).sign() >= 0;
    var Ppt = tP ? lerp(c1p, c2p, tP) : null, Qpt = tQ ? lerp(c1p, c2p, tQ) : null;
    var Ap = lerp(c1p, c2p, tA), Bp = lerp(c1p, c2p, tB);
    var A = L1.refl(Ap), B = L2.refl(Bp);
    var unit = p.unit || null;

    var introStory = fixedA ? st.intro.replace('두 원형', '원형').replace('C₁, C₂', 'C₂') : st.intro;
    var problem = {
      title: st.obj + '의 최소 길이',
      intro: introStory + ' 설계도에서 ' + (fixedA ? '원은 C₂: ' + circleEq(c2[0], c2[1], r2) : '두 원은 C₁: ' + circleEq(c1[0], c1[1], r1) + ', C₂: ' + circleEq(c2[0], c2[1], r2)) + '로 나타내고, ' + josa(st.two, '는') + ' 각각 ' + josa(L1.name, '과') + ' ' + josa(L2.name, '로') + ' 나타낸다. ' + josa(st.obj, '은') + ' ' + (fixedA ? '점 A' + pt(c1[0], c1[1]) : '원 C₁ 위의 점 A') + '에서 시작하여 ' + L1.name + ' 위의 점 P, ' + L2.name + ' 위의 점 Q를 차례로 지나 원 C₂ 위의 점 B까지 연결하려고 한다.' + (unit ? ' 설계도에서 한 눈금의 실제 길이는 ' + unit.v + ' ' + unit.n + '이다.' : ''),
      q: [josa(st.obj, '을') + ' 최소한으로 사용하여 설계하려고 할 때, 필요한 ' + st.obj + '의 최소 길이' + (unit ? '(실제 길이)' : '') + '를 구하는 풀이 과정과 답을 논술하시오. (단, 그림은 문제의 이해를 돕기 위한 예시도이다.)']
    };

    var S = [];
    S.push({ title: '① P가 놓인 ' + L1.name + '에 대하여 A를 대칭이동', lines: [
      josa(fixedA ? '점 A' + pt(c1[0], c1[1]) : '원 C₁ 위의 점 A', '를') + ' ' + L1.name + '에 대하여 대칭이동한 점을 A′이라 하자.  [' + L1.name + ' 대칭: ' + L1.rule + ']',
      '점 P는 ' + L1.name + ' 위의 점이고, ' + josa(L1.name, '은') + ' 선분 AA′의 수직이등분선이므로  **AP = A′P**'
    ] });
    S.push({ title: '② Q가 놓인 ' + L2.name + '에 대하여 B를 대칭이동', lines: [
      '원 C₂ 위의 점 B를 ' + L2.name + '에 대하여 대칭이동한 점을 B′이라 하자.  [' + L2.name + ' 대칭: ' + L2.rule + ']',
      '점 Q는 ' + L2.name + ' 위의 점이므로 같은 이유로  **QB = QB′**'
    ] });
    S.push({ title: '③ 꺾인 길을 곧은 길로', lines: [
      'AP + PQ + QB = A′P + PQ + QB′ ≥ **A′B′**',
      '(두 점을 잇는 가장 짧은 길은 선분. 등호는 P, Q가 선분 A′B′ 위에 이 순서로 놓일 때)'
    ] });
    var L4 = [];
    if (fixedA) L4.push('A′ = ' + pt(c1p[0], c1p[1]));
    else L4.push('A가 원 C₁ 위를 움직이므로 A′은 원 C₁을 ' + L1.name + '에 대하여 대칭이동한 원  C₁′: ' + circleEq(c1p[0], c1p[1], r1) + '  (중심 C₁′' + pt(c1p[0], c1p[1]) + ', 반지름 ' + r1 + ') 위를 움직인다.');
    L4.push('B가 원 C₂ 위를 움직이므로 B′은 원 C₂를 ' + L2.name + '에 대하여 대칭이동한 원  C₂′: ' + circleEq(c2p[0], c2p[1], r2) + '  (중심 C₂′' + pt(c2p[0], c2p[1]) + ', 반지름 ' + r2 + ') 위를 움직인다.');
    L4.push('(원의 대칭이동 = 중심만 대칭이동, 반지름은 그대로)');
    S.push({ title: '④ 대칭이동한 원(점)의 방정식', lines: L4 });
    var ddx = F(c1p[0]).sub(c2p[0]), ddy = F(c1p[1]).sub(c2p[1]);
    var L5 = [];
    L5.push((fixedA ? 'A′' : 'C₁′') + 'C₂′ = √((' + c1p[0].s() + tail(F(c2p[0]).neg()) + ')² + (' + c1p[1].s() + tail(F(c2p[1]).neg()) + ')²) = √(' + ddx.sq().s() + ' + ' + ddy.sq().s() + ') = √' + D2.s() + ' = ' + D);
    if (fixedA) {
      L5.push(D + ' > ' + r2 + ' 이므로 A′은 원 C₂′ 밖에 있고, **점에서 원 위의 점까지 거리의 최솟값 = (중심까지의 거리) − (반지름)** 이므로');
      L5.push('▶ A′B′의 최솟값 = ' + D + ' − ' + r2 + ' = **' + ans + '**   (등호: B′이 선분 A′C₂′ 위에 있을 때)');
    } else {
      L5.push(D + ' > ' + r1 + ' + ' + r2 + ' 이므로 두 원은 서로 밖에 있다. **점에서 원 위의 점까지 거리의 최솟값 = (중심까지의 거리) − (반지름)** 을 두 번 쓴다.');
      L5.push('A′을 고정하면 B′이 원 C₂′ 위를 움직이므로  A′B′ ≥ A′C₂′ − ' + r2);
      L5.push('A′이 원 C₁′ 위를 움직이므로  A′C₂′ ≥ C₁′C₂′ − ' + r1 + ' = ' + D + ' − ' + r1 + ' = ' + (D - r1));
      L5.push('▶ A′B′의 최솟값 = ' + D + ' − ' + r1 + ' − ' + r2 + ' = **' + ans + '**   (등호: A′, B′이 선분 C₁′C₂′ 위에 있을 때)');
    }
    S.push({ title: fixedA ? '⑤ 점 A′과 원 C₂′ 위의 점 사이의 최소 거리' : '⑤ 두 원 위의 점 사이의 최소 거리', lines: L5 });
    var L6 = ['따라서 ' + st.obj + '의 최소 길이는 **' + ans + '**' + (unit ? '' : ' (좌표 단위)')];
    if (unit) { var realv = F(ans).mul(F(Math.round(unit.v * 100), 100)); L6.push('한 눈금 = ' + unit.v + ' ' + unit.n + ' 이므로 실제 길이 = ' + ans + ' × ' + unit.v + ' = **' + realStr(realv) + ' ' + unit.n + '**'); }
    S.push({ title: '⑥ 답', lines: L6 });
    var L7 = [];
    if (orderOK) {
      L7.push('(선택 보강 — 시간이 남으면) 최솟값을 주는 A′' + pt(Ap[0], Ap[1]) + ', B′' + pt(Bp[0], Bp[1]) + '에 대하여 선분 A′B′은 ' + josa(L1.name, '을') + ' P' + pt(Ppt[0], Ppt[1]) + '에서, ' + josa(L2.name, '을') + ' Q' + pt(Qpt[0], Qpt[1]) + '에서 **차례로** 지나므로 A → P → Q → B 순서의 경로가 실제로 존재한다.');
      L7.push('이때 A' + pt(A[0], A[1]) + ', B' + pt(B[0], B[1]) + '.');
    } else {
      L7.push('⚠️ 이 배치에서는 A′B′ 선분이 두 직선을 차례로 지나지 않아 등호가 성립하지 않는다(생성기 오류 — 이 세트는 쓰지 않는다).');
    }
    S.push({ title: '순서 확인', lines: L7, optional: true });

    return {
      type: 2, params: p, problem: problem, steps: S,
      answers: { c1p: c1p, c2p: c2p, D: D, ans: ans, real: unit ? F(ans).mul(F(Math.round(unit.v * 100), 100)) : null, unit: unit, P: Ppt, Q: Qpt, A: A, B: B, orderOK: orderOK },
      brief: [(fixedA ? 'A′' : 'C₁′') + pt(c1p[0], c1p[1]) + ' , C₂′' + pt(c2p[0], c2p[1]), '중심 거리 ' + D, '최소 길이 ' + ans + (unit ? ' → ' + realStr(F(ans).mul(F(Math.round(unit.v * 100), 100))) + ' ' + unit.n : '')]
    };
  }

  /* 유형 2 유효성 (생성용) */
  function validT2(p) {
    try {
      var L1 = LINES[p.L1], L2 = LINES[p.L2];
      if (p.L1 === p.L2) return false;
      var rr = [[p.c1, p.r1], [p.c2, p.r2]];
      for (var i = 0; i < 2; i++) {
        var c = rr[i][0], r = rr[i][1];
        if (Math.abs(c[0]) > 9 || Math.abs(c[1]) > 9) return false;
        var need = r === 0 ? 0 : r * r; // 중심에서 두 직선까지 거리² ≥ r² (점이면 직선 위만 아니면 됨)
        if (distLine2(L1, c).val() < (r === 0 ? 0.25 : need)) return false;
        if (distLine2(L2, c).val() < (r === 0 ? 0.25 : need)) return false;
      }
      var s = solveT2(p);
      return s.answers.orderOK && s.answers.ans >= 2;
    } catch (e) { return false; }
  }
  function genT2(rng, opt) {
    opt = opt || {};
    for (var tries = 0; tries < 4000; tries++) {
      var pool = opt.allowYnx ? LINE_IDS_ALL : LINE_IDS;
      var L1 = opt.L1 || pool[Math.floor(rng() * pool.length)];
      var L2 = opt.L2 || pool[Math.floor(rng() * pool.length)];
      if (L1 === L2) continue;
      var v = PVEC[Math.floor(rng() * PVEC.length)];
      var a = v[0] * (rng() < 0.5 ? 1 : -1), b = v[1] * (rng() < 0.5 ? 1 : -1);
      var x1 = Math.floor(rng() * 17) - 8, y1 = Math.floor(rng() * 17) - 8;
      var c1p = [x1, y1], c2p = [x1 + a, y1 + b];
      var r1 = opt.fixedA ? 0 : (opt.r1 !== undefined ? opt.r1 : 1 + Math.floor(rng() * 3));
      var r2 = opt.r2 !== undefined ? opt.r2 : 1 + Math.floor(rng() * 3);
      var c1 = LINES[L1].refl(c1p).map(function (f) { return f.n; }), c2 = LINES[L2].refl(c2p).map(function (f) { return f.n; });
      var p = { c1: c1, r1: r1, c2: c2, r2: r2, L1: L1, L2: L2, story: opt.story !== undefined ? opt.story : Math.floor(rng() * T2_STORIES.length), unit: opt.unit || null };
      if (validT2(p)) return p;
    }
    throw new Error('genT2 failed');
  }

  /* ---------- 수치 검산 (게이트 1) ---------- */
  function verifyT1(sol) {
    var p = sol.params, a = sol.answers, errs = [];
    function distLineNum(m, ax, ay, cx, cy) { return Math.abs(m * cx - cy + (ay - m * ax)) / Math.sqrt(m * m + 1); }
    [a.m1, a.m2].forEach(function (m) { var dd = distLineNum(m.val(), p.ax, p.ay, p.cx, p.cy); if (Math.abs(dd - p.r) > 1e-9) errs.push('접선 거리 ≠ r: m=' + m.s()); });
    var px = a.P[0].val(), py = a.P[1].val();
    if (Math.abs((px - p.cx) * (px - p.cx) + (py - p.cy) * (py - p.cy) - p.r * p.r) > 1e-9) errs.push('P가 원 위에 없음');
    var sel = (p.pick || 'pos') === 'pos' ? a.m1 : a.m2;
    if (Math.abs(py - (sel.val() * (px - p.ax) + p.ay)) > 1e-9) errs.push('P가 접선 위에 없음');
    if (Math.abs(Math.hypot(px - p.ax, py - p.ay) - a.l) > 1e-9) errs.push('AP ≠ ℓ');
    // 접점 = 수선의 발 확인
    var mv = sel.val(); var k = p.ay - mv * p.ax; var t = (mv * p.cx - p.cy + k) / (mv * mv + 1); var fx = p.cx - mv * t, fy = p.cy + t;
    if (Math.abs(fx - px) > 1e-9 || Math.abs(fy - py) > 1e-9) errs.push('수선의 발 불일치');
    return errs;
  }
  function verifyT2(sol) {
    var p = sol.params, a = sol.answers, errs = [];
    var L1 = LINES[p.L1], L2 = LINES[p.L2];
    function rf(L, P) { return L.refl(P).map(function (f) { return f.val(); }); }
    var best = Infinity;
    var na = p.r1 === 0 ? 1 : 180, nb = 180;
    for (var i = 0; i < na; i++) for (var j = 0; j < nb; j++) {
      var A = p.r1 === 0 ? [p.c1[0], p.c1[1]] : [p.c1[0] + p.r1 * Math.cos(i * 2 * Math.PI / na), p.c1[1] + p.r1 * Math.sin(i * 2 * Math.PI / na)];
      var B = [p.c2[0] + p.r2 * Math.cos(j * 2 * Math.PI / nb), p.c2[1] + p.r2 * Math.sin(j * 2 * Math.PI / nb)];
      var Ap = rf(L1, A), Bp = rf(L2, B);
      var d = Math.hypot(Ap[0] - Bp[0], Ap[1] - Bp[1]); if (d < best) best = d;
    }
    if (Math.abs(best - a.ans) > 0.02) errs.push('brute-force 최소 ' + best.toFixed(4) + ' ≠ ' + a.ans);
    if (!a.orderOK) errs.push('순서 불성립');
    else {
      var A = a.A.map(function (f) { return f.val(); }), B = a.B.map(function (f) { return f.val(); }), P = a.P.map(function (f) { return f.val(); }), Q = a.Q.map(function (f) { return f.val(); });
      var path = Math.hypot(A[0] - P[0], A[1] - P[1]) + Math.hypot(P[0] - Q[0], P[1] - Q[1]) + Math.hypot(Q[0] - B[0], Q[1] - B[1]);
      if (Math.abs(path - a.ans) > 1e-9) errs.push('실제 경로 길이 ' + path + ' ≠ ' + a.ans);
      if (Math.abs(L1.f(P).val()) > 1e-9) errs.push('P가 ' + L1.name + ' 위에 없음');
      if (Math.abs(L2.f(Q).val()) > 1e-9) errs.push('Q가 ' + L2.name + ' 위에 없음');
      if (p.r1 > 0 && Math.abs(Math.hypot(A[0] - p.c1[0], A[1] - p.c1[1]) - p.r1) > 1e-9) errs.push('A가 C₁ 위에 없음');
      if (Math.abs(Math.hypot(B[0] - p.c2[0], B[1] - p.c2[1]) - p.r2) > 1e-9) errs.push('B가 C₂ 위에 없음');
    }
    return errs;
  }

  /* ---------- 답 파서 (앱 입력 채점) ---------- */
  function parseNum(s) {
    if (s === null || s === undefined) return null;
    s = String(s).trim().replace(/−/g, '-').replace(/\s+/g, '');
    if (!s) return null;
    var m = s.match(/^([+-]?\d+)\/(\d+)$/); if (m) return Number(m[1]) / Number(m[2]);
    m = s.match(/^([+-]?)(\d+)\/(\d+)$/); if (m) return (m[1] === '-' ? -1 : 1) * Number(m[2]) / Number(m[3]);
    if (/^[+-]?\d+(\.\d+)?$/.test(s)) return Number(s);
    return null;
  }
  function near(a, b) { return a !== null && b !== null && Math.abs(a - b) < 1e-6; }

  /* ---------- 난수 ---------- */
  function mulberry32(seed) { return function () { seed |= 0; seed = seed + 0x6D2B79F5 | 0; var t = Math.imul(seed ^ seed >>> 15, 1 | seed); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }

  /* ---------- 예시문항 + 고정 변형 10세트 (프린트 팩) ---------- */
  var SAMPLE_T1 = { cx: 2, cy: 1, r: 3, ax: -3, ay: 1, unit: { v: 10, n: 'm' }, pick: 'pos', story: 0 };
  var SAMPLE_T2 = { c1: [8, 2], r1: 2, c2: [3, -4], r2: 2, L1: 'xaxis', L2: 'yx', story: 0, unit: null };
  var FIXED_SETS = [
    { id: 'V1', type: 1, tag: '1번형 · 수평 배치(예시와 같은 꼴), 삼조 5-12-13', p: { cx: 1, cy: 2, r: 5, ax: -12, ay: 2, unit: { v: 10, n: 'm' }, pick: 'pos', story: 1 } },
    { id: 'V2', type: 1, tag: '1번형 · 수직 배치(A가 C 아래), 삼조 3-4-5', p: { cx: 3, cy: 4, r: 3, ax: 3, ay: -1, unit: { v: 20, n: 'm' }, pick: 'neg', story: 2 } },
    { id: 'V3', type: 1, tag: '1번형 · 수평 배치(A가 C 오른쪽), 음수 기울기 선택, 삼조 6-8-10', p: { cx: -2, cy: 3, r: 6, ax: 8, ay: 3, unit: { v: 5, n: 'm' }, pick: 'neg', story: 3 } },
    { id: 'V4', type: 1, tag: '1번형 · 수직 배치(A가 C 위), 삼조 4-3-5, 눈금 25 m', p: { cx: -1, cy: -2, r: 4, ax: -1, ay: 3, unit: { v: 25, n: 'm' }, pick: 'pos', story: 0 } },
    { id: 'V5', type: 2, tag: '2번형 · x축 → y = x (예시와 같은 직선), 다른 숫자, 삼조 5-12-13', p: { c1: [-7, -1], r1: 1, c2: [-4, 5], r2: 2, L1: 'xaxis', L2: 'yx', story: 1, unit: null } },
    { id: 'V6', type: 2, tag: '2번형 · y축 → y = x, 삼조 3-4-5', p: { c1: [1, 3], r1: 1, c2: [-1, 2], r2: 1, L1: 'yaxis', L2: 'yx', story: 2, unit: null } },
    { id: 'V7', type: 2, tag: '2번형 · y축 → x축, 삼조 8-15-17', p: { c1: [-2, 8], r1: 2, c2: [-6, 7], r2: 1, L1: 'yaxis', L2: 'xaxis', story: 3, unit: null } },
    { id: 'V8', type: 2, tag: '2번형 · y = x → y축, 반지름이 서로 다름(3·1), 눈금 환산 0.5 m', p: { c1: [5, -3], r1: 3, c2: [-2, -7], r2: 1, L1: 'yx', L2: 'yaxis', story: 0, unit: { v: 0.5, n: 'm' } } },
    { id: 'V9', type: 2, tag: '함정 ① · 경유 순서가 바뀜(y = x 먼저, x축 나중) — P가 놓인 직선에 A를 대칭', p: { c1: [4, -3], r1: 1, c2: [5, 2], r2: 2, L1: 'yx', L2: 'xaxis', story: 1, unit: null } },
    { id: 'V10', type: 2, tag: '함정 ② · 출발점 A가 원이 아니라 고정점 — 반지름을 한쪽만 뺀다', p: { c1: [3, 1], r1: 0, c2: [2, -1], r2: 1, L1: 'xaxis', L2: 'yx', story: 2, unit: null } }
  ];

  function solveAny(type, p) { return type === 1 ? solveT1(p) : solveT2(p); }
  function verifyAny(sol) { return sol.type === 1 ? verifyT1(sol) : verifyT2(sol); }

  /* ---------- 답안 틀(P2) 텍스트 ---------- */
  var TEMPLATES = {
    t1: [
      { h: '문제 1 — 원의 방정식', t: ['중심이 (▢, ▢)이고 반지름의 길이가 ▢인 원의 방정식은', '(x − ▢)² + (y − ▢)² = ▢²  →  ▢'] },
      { h: '문제 2-1 — 기울기 m', t: ['직선 y − ▢ = m(x − ▢)를 정리하면  mx − y + (▢m + ▢) = 0', '직선이 원에 접하려면 **원의 중심 C(▢, ▢)에서 이 직선까지의 거리가 반지름 ▢과 같아야** 하므로', '|▢m + ▢| / √(m² + 1) = ▢  →  양변 제곱  →  ▢m² = ▢(m² + 1)  →  m² = ▢', '(A와 C가 수직 배치면 m이 사라지고 상수만 남는다: |▢| / √(m² + 1) = ▢ → ▢ = ▢(m² + 1))', '따라서 m = ▢ 또는 m = −▢  (둘 다 쓴다)'] },
      { h: '문제 2-2 — 두 직선', t: ['m = ▢ :  y − ▢ = ▢(x − ▢)  →  y = ▢x + ▢', 'm = −▢ :  y − ▢ = −▢(x − ▢)  →  y = −▢x + ▢'] },
      { h: '문제 3 — 접점 P (방법 A: 대입 → 중근)', t: ['기울기가 ▢수인 직선 y = ▢x + ▢ 를 원에 대입하면', '(x − ▢)² + (▢x + ▢)² = ▢  →  양변에 ▢를 곱하고 전개·정리  →  ▢x² + ▢x + ▢ = 0', '접하므로 **중근**:  (▢x + ▢)² = 0  →  x = ▢,  y = ▢', '따라서 P(▢, ▢)   [검산: (▢ − ▢)² + (▢ − ▢)² = ▢ ✓]'] },
      { h: '문제 3 — 접점 P (방법 B: 수선의 발)', t: ['접점은 **중심 C에서 접선에 내린 수선의 발**이다. 접선에 수직이고 C(▢, ▢)를 지나는 직선:  y − ▢ = ▢(x − ▢)', '두 직선을 연립:  ▢x + ▢ = ▢x + ▢  →  양변에 ▢를 곱하면  ▢x + ▢ = ▢x + ▢  →  x = ▢,  y = ▢  →  P(▢, ▢)'] },
      { h: '문제 4 — 실제 길이', t: ['AP = √((▢ − ▢)² + (▢ − ▢)²) = √(▢ + ▢) = √▢ = ▢', '한 눈금의 실제 길이가 ▢ m이므로  실제 길이 = ▢ × ▢ = **▢ m**  (단위!)', '[검산: CP ⊥ AP, AC = ▢, CP = ▢  →  AP = √(AC² − CP²) = √(▢ − ▢) = ▢ ✓]'] }
    ],
    t2: [
      { h: '① 대칭이동 (P가 놓인 직선에 A를)', t: ['원 C₁ 위의 점 A를 **▢**에 대하여 대칭이동한 점을 A′이라 하자.  [▢ 대칭: (x, y) → (▢, ▢)]', '점 P는 ▢ 위의 점이고 ▢은 선분 AA′의 수직이등분선이므로  **AP = A′P**'] },
      { h: '② 대칭이동 (Q가 놓인 직선에 B를)', t: ['원 C₂ 위의 점 B를 **▢**에 대하여 대칭이동한 점을 B′이라 하자.  [▢ 대칭: (x, y) → (▢, ▢)]', '점 Q는 ▢ 위의 점이므로  **QB = QB′**'] },
      { h: '③ 부등식', t: ['AP + PQ + QB = A′P + PQ + QB′ ≥ **A′B′**   (등호: P, Q가 선분 A′B′ 위에 이 순서로 놓일 때)'] },
      { h: '④ 대칭이동한 원', t: ['A′은 원 C₁을 ▢에 대칭이동한 원 C₁′: (x − ▢)² + (y − ▢)² = ▢  (중심 (▢, ▢), 반지름 ▢) 위를 움직인다.', 'B′은 원 C₂를 ▢에 대칭이동한 원 C₂′: (x − ▢)² + (y − ▢)² = ▢  (중심 (▢, ▢), 반지름 ▢) 위를 움직인다.'] },
      { h: '⑤ 두 원 위의 점 사이 최소 거리 (점–원 최소 거리를 두 번)', t: ['C₁′C₂′ = √((▢ − ▢)² + (▢ − ▢)²) = √(▢ + ▢) = √▢ = ▢   (▢ > ▢ + ▢ 이므로 두 원은 서로 밖)', '**점에서 원 위의 점까지 거리의 최솟값 = (중심까지의 거리) − (반지름)** 이므로  A′B′ ≥ A′C₂′ − ▢,  A′C₂′ ≥ C₁′C₂′ − ▢', '따라서 A′B′의 최솟값 = ▢ − ▢ − ▢ = ▢   (등호: A′, B′이 선분 C₁′C₂′ 위에 있을 때)'] },
      { h: '⑥ 답 (+ 선택 보강)', t: ['따라서 최소 길이는 **▢**', '(선택) 중심 C₁′(▢, ▢)과 C₂′(▢, ▢)을 잇는 선분은 ▢을 P(▢, ▢)에서, ▢을 Q(▢, ▢)에서 차례로 지나므로 A → P → Q → B 순서의 경로가 실제로 존재한다.'] }
    ]
  };

  var PITFALLS = [
    { k: '2번 대칭 순서', t: '"차례로 P(직선 ①) → Q(직선 ②)"이면 **A는 직선 ①에, B는 직선 ②에** 대칭. 순서가 바뀐 문제(V9)에서 확인.' },
    { k: '2번 반지름', t: '두 원이면 **r₁ + r₂ 둘 다** 뺀다("점–원 최소 거리 = 중심까지 거리 − 반지름"을 두 번). 한쪽이 점이면(V10) 그쪽은 빼지 않는다. 중심 거리를 그대로 답으로 쓰면 오답.' },
    { k: '2번 근거 문장', t: '"P가 직선 위의 점이므로 AP = A′P"처럼 **왜 같은지**를 한 문장으로. 좌표만 나열하면 감점.' },
    { k: '1번 단위', t: '문제 4는 **눈금 환산 문장 + 단위(m)**까지가 답. 4가 아니라 40 m.' },
    { k: '1번 기울기 둘 다', t: '|5m| = 3√(m²+1)에서 제곱하면 **m = ±3/4 둘 다** 나온다. 하나만 쓰면 감점.' },
    { k: '1번 접선 조건 문장', t: '"중심에서 직선까지의 거리가 반지름과 같다"를 **문장으로** 쓴다. 공식만 던지지 않는다.' },
    { k: '1번 중근', t: '방법 A에서 이차식이 (5x − 1)² 꼴로 묶여야 정상. 안 묶이면 계산 실수 → 방법 B로 교차 확인.' },
    { k: '분수 계산', t: '25x² − 10x + 1, √(400/25) = 4 같은 자리에서 실수 잦음. 검산 루틴(아래) 3개로 1분 안에 확인.' }
  ];
  var CHECKS = [
    '1-2 검산: A와 C가 수평이면 m = ±r/ℓ, 수직이면 m = ±ℓ/r (ℓ = 접선 길이 = √(AC² − r²)). 3-4-5면 ±3/4.',
    '1-3 검산: 구한 P를 원의 방정식에 대입해 r²이 나오는지.',
    '1-4 검산: AP = √(AC² − r²) (직각삼각형). 문제 3이 틀려도 이 값은 맞아야 한다.',
    '2번 검산: 대칭이동한 중심 좌표를 규칙표로 다시 확인 → 중심 거리는 피타고라스 삼조(5-12-13 등)로 떨어지는지 → 반지름 둘 다 뺐는지.'
  ];
  var TIMEPLAN = [
    ['1번', '20분', '1-1 (2분) → 1-2 (8분) → 1-3 (6분) → 1-4 (4분)'],
    ['2번', '18분', '대칭 좌표 (4분) → 근거 문장 (4분) → 중심 거리·답 (6분) → 정리 (4분)'],
    ['검산', '7분', '위 검산 루틴 4개'],
    ['여유', '5분', '답안 깨끗이, 단위·둘 다·반지름 확인']
  ];
  /* 시험 조건 확인 항목 — 아이에게 묻지 않고 Nick이 채팅에서 답한다(소통 규약 2026-09-12). 앱·프린트에는 넣지 않는다. */
  var QUESTIONS_FOR_NICK = [
    '시험 시간이 수업시간 50분 전부인지(기본 가정 50분)',
    '계산기·자 사용 가능 여부(기본 가정: 둘 다 불가)',
    '답안을 문제지 여백에 쓰는지, 별도 답안지인지(기본 가정: 문제지 여백)',
    '선생님이 준 힌트가 있으면 그 문장 그대로'
  ];

  /* ---------- 프린트 팩 렌더러 (앱 🖨️ 탭 + 정적 파일 공용) ---------- */
  function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }
  function md(s) { return esc(s).replace(/\*\*(.+?)\*\*/g, '<b>$1</b>'); }
  function stepsHtml(steps, opts) {
    opts = opts || {};
    return steps.map(function (st) {
      if (st.optional && opts.skipOptional) return '';
      return '<div class="pp-step' + (st.optional ? ' pp-opt' : '') + '"><div class="pp-st">' + md(st.title) + '</div>' +
        st.lines.map(function (ln) { var hl = ln.indexOf('▶') === 0; return '<div class="pp-ln' + (hl ? ' pp-hl' : '') + '">' + md(ln.replace(/^▶\s*/, '')) + '</div>'; }).join('') + '</div>';
    }).join('');
  }
  function problemHtml(sol, label) {
    var pr = sol.problem;
    return '<div class="pp-prob"><div class="pp-pt">' + esc(label) + ' ' + esc(pr.title) + '</div><div class="pp-box">' + esc(pr.intro) + '</div>' +
      pr.q.map(function (q) { return '<div class="pp-q">' + esc(q).replace(/\n/g, '<br>') + '</div>'; }).join('') + '</div>';
  }
  function svgTangent(p) {
    // 정적 SVG: 원 + 외부점 + 두 접선 + 직각 표시 (예시문항 1번)
    var sol = solveT1(p); var a = sol.answers;
    var W = 360, H = 260, sc = 26, ox = 150, oy = 150;
    function X(x) { return ox + x * sc; } function Y(y) { return oy - y * sc; }
    var px = a.P[0].val(), py = a.P[1].val();
    var m2 = a.m2.val(); var b2 = p.ay - m2 * p.ax; var fx = p.cx - m2 * ((m2 * p.cx - p.cy + b2) / (m2 * m2 + 1)), fy = p.cy + (m2 * p.cx - p.cy + b2) / (m2 * m2 + 1);
    var s = '<svg viewBox="0 0 ' + W + ' ' + H + '" class="pp-svg" xmlns="http://www.w3.org/2000/svg">';
    s += '<line x1="0" y1="' + Y(0) + '" x2="' + W + '" y2="' + Y(0) + '" stroke="#94a3b8"/><line x1="' + X(0) + '" y1="0" x2="' + X(0) + '" y2="' + H + '" stroke="#94a3b8"/>';
    s += '<circle cx="' + X(p.cx) + '" cy="' + Y(p.cy) + '" r="' + p.r * sc + '" fill="#dbeafe" fill-opacity=".5" stroke="#2563eb" stroke-width="2"/>';
    s += '<line x1="' + X(p.ax) + '" y1="' + Y(p.ay) + '" x2="' + X(px + (px - p.ax) * 0.35) + '" y2="' + Y(py + (py - p.ay) * 0.35) + '" stroke="#16a34a" stroke-width="2.5"/>';
    s += '<line x1="' + X(p.ax) + '" y1="' + Y(p.ay) + '" x2="' + X(fx + (fx - p.ax) * 0.35) + '" y2="' + Y(fy + (fy - p.ay) * 0.35) + '" stroke="#16a34a" stroke-width="1.5" stroke-dasharray="5 4"/>';
    s += '<line x1="' + X(p.cx) + '" y1="' + Y(p.cy) + '" x2="' + X(px) + '" y2="' + Y(py) + '" stroke="#dc2626" stroke-width="1.5" stroke-dasharray="3 3"/>';
    s += '<line x1="' + X(p.ax) + '" y1="' + Y(p.ay) + '" x2="' + X(p.cx) + '" y2="' + Y(p.cy) + '" stroke="#64748b" stroke-width="1" stroke-dasharray="3 3"/>';
    s += '<circle cx="' + X(p.ax) + '" cy="' + Y(p.ay) + '" r="4" fill="#111"/><text x="' + (X(p.ax) - 14) + '" y="' + (Y(p.ay) + 16) + '" font-size="12">A</text>';
    s += '<circle cx="' + X(p.cx) + '" cy="' + Y(p.cy) + '" r="3" fill="#2563eb"/><text x="' + (X(p.cx) + 6) + '" y="' + (Y(p.cy) + 14) + '" font-size="12">C</text>';
    s += '<circle cx="' + X(px) + '" cy="' + Y(py) + '" r="4" fill="#16a34a"/><text x="' + (X(px) + 6) + '" y="' + (Y(py) - 6) + '" font-size="12">P</text>';
    s += '<text x="' + (X((p.ax + px) / 2) - 10) + '" y="' + (Y((p.ay + py) / 2) - 8) + '" font-size="11" fill="#16a34a">ℓ = ' + a.l + '</text>';
    s += '<text x="' + (X((p.cx + px) / 2) + 4) + '" y="' + (Y((p.cy + py) / 2) + 4) + '" font-size="11" fill="#dc2626">r = ' + p.r + '</text>';
    s += '<text x="' + (X((p.ax + p.cx) / 2) - 8) + '" y="' + (Y((p.ay + p.cy) / 2) + 14) + '" font-size="11" fill="#64748b">d = ' + a.d + '</text>';
    s += '</svg>';
    return s;
  }
  function svgUnfold(p) {
    // 정적 SVG: 원 2개 + 두 직선 + 대칭이동한 원(점선) + 펴진 직선 (예시문항 2번)
    var sol = solveT2(p); var a = sol.answers;
    var W = 380, H = 300, sc = 16, ox = 190, oy = 150;
    function X(x) { return ox + x * sc; } function Y(y) { return oy - y * sc; }
    var L1 = LINES[p.L1], L2 = LINES[p.L2];
    function lineSeg(L) { if (L === LINES.xaxis) return [[-11, 0], [11, 0]]; if (L === LINES.yaxis) return [[0, -9], [0, 9]]; if (L === LINES.yx) return [[-9, -9], [9, 9]]; return [[-9, 9], [9, -9]]; }
    var s = '<svg viewBox="0 0 ' + W + ' ' + H + '" class="pp-svg" xmlns="http://www.w3.org/2000/svg">';
    s += '<line x1="0" y1="' + Y(0) + '" x2="' + W + '" y2="' + Y(0) + '" stroke="#cbd5e1"/><line x1="' + X(0) + '" y1="0" x2="' + X(0) + '" y2="' + H + '" stroke="#cbd5e1"/>';
    [L1, L2].forEach(function (L, i) { var sg = lineSeg(L); s += '<line x1="' + X(sg[0][0]) + '" y1="' + Y(sg[0][1]) + '" x2="' + X(sg[1][0]) + '" y2="' + Y(sg[1][1]) + '" stroke="' + (i ? '#7c3aed' : '#0891b2') + '" stroke-width="2"/>'; });
    if (p.r1 > 0) s += '<circle cx="' + X(p.c1[0]) + '" cy="' + Y(p.c1[1]) + '" r="' + p.r1 * sc + '" fill="#fde68a" fill-opacity=".5" stroke="#d97706" stroke-width="2"/>';
    s += '<circle cx="' + X(p.c2[0]) + '" cy="' + Y(p.c2[1]) + '" r="' + p.r2 * sc + '" fill="#fecaca" fill-opacity=".5" stroke="#dc2626" stroke-width="2"/>';
    var c1p = a.c1p.map(function (f) { return f.val(); }), c2p = a.c2p.map(function (f) { return f.val(); });
    if (p.r1 > 0) s += '<circle cx="' + X(c1p[0]) + '" cy="' + Y(c1p[1]) + '" r="' + p.r1 * sc + '" fill="none" stroke="#d97706" stroke-width="1.5" stroke-dasharray="4 3"/>';
    s += '<circle cx="' + X(c2p[0]) + '" cy="' + Y(c2p[1]) + '" r="' + p.r2 * sc + '" fill="none" stroke="#dc2626" stroke-width="1.5" stroke-dasharray="4 3"/>';
    s += '<line x1="' + X(c1p[0]) + '" y1="' + Y(c1p[1]) + '" x2="' + X(c2p[0]) + '" y2="' + Y(c2p[1]) + '" stroke="#16a34a" stroke-width="2" stroke-dasharray="6 3"/>';
    if (a.orderOK) {
      var A = a.A.map(function (f) { return f.val(); }), B = a.B.map(function (f) { return f.val(); }), P = a.P.map(function (f) { return f.val(); }), Q = a.Q.map(function (f) { return f.val(); });
      s += '<polyline points="' + [A, P, Q, B].map(function (q) { return X(q[0]) + ',' + Y(q[1]); }).join(' ') + '" fill="none" stroke="#16a34a" stroke-width="2.5"/>';
      [['A', A], ['P', P], ['Q', Q], ['B', B]].forEach(function (e) { s += '<circle cx="' + X(e[1][0]) + '" cy="' + Y(e[1][1]) + '" r="3.5" fill="#111"/><text x="' + (X(e[1][0]) + 5) + '" y="' + (Y(e[1][1]) - 5) + '" font-size="12">' + e[0] + '</text>'; });
    }
    s += '<text x="' + (X(c1p[0]) + 4) + '" y="' + (Y(c1p[1]) + 4) + '" font-size="11" fill="#d97706">' + (p.r1 > 0 ? "C₁′" : "A′") + '</text>';
    s += '<text x="' + (X(c2p[0]) + 4) + '" y="' + (Y(c2p[1]) + 4) + '" font-size="11" fill="#dc2626">C₂′</text>';
    s += '<rect x="6" y="6" width="150" height="20" fill="#fff" fill-opacity=".85" stroke="#16a34a"/><text x="12" y="20" font-size="12" fill="#16a34a">최소 = ' + a.D + ' − ' + p.r1 + ' − ' + p.r2 + ' = ' + a.ans + '</text>';
    s += '</svg>';
    return s;
  }

  var PRINT_CSS = '.pp{font-family:"Malgun Gothic","Apple SD Gothic Neo",sans-serif;color:#111;font-size:12.5px;line-height:1.55}' +
    '.pp h1{font-size:20px;margin:0 0 6px}.pp h2{font-size:16px;margin:18px 0 8px;padding-bottom:4px;border-bottom:2px solid #111}.pp h3{font-size:13.5px;margin:12px 0 6px}' +
    '.pp .pp-page{page-break-after:always;padding:6px 0}.pp .pp-page:last-child{page-break-after:auto}' +
    '.pp table{border-collapse:collapse;width:100%;font-size:12px}.pp td,.pp th{border:1px solid #999;padding:4px 6px;vertical-align:top;text-align:left}' +
    '.pp .pp-box{border:1px solid #333;padding:7px 9px;margin:6px 0;background:#fafafa}.pp .pp-q{margin:5px 0 5px 4px;white-space:pre-wrap}.pp .pp-pt{font-weight:700;margin-top:8px}' +
    '.pp .pp-step{margin:8px 0}.pp .pp-st{font-weight:700;background:#eef2ff;padding:3px 6px;border-left:3px solid #4f46e5}.pp .pp-ln{padding:2px 0 2px 12px}.pp .pp-hl{font-weight:700;color:#1d4ed8}' +
    '.pp .pp-opt .pp-st{background:#f1f5f9;border-left-color:#94a3b8}' +
    '.pp .pp-ans{border:1px dashed #666;min-height:150px;margin:6px 0 12px;padding:4px;background:repeating-linear-gradient(#fff 0 27px,#e5e7eb 27px 28px)}' +
    '.pp .pp-ans.sm{min-height:100px}.pp .pp-ans.md{min-height:200px}.pp .pp-ans.lg{min-height:440px}' +
    '.pp .pp-svg{width:100%;max-width:380px;display:block;margin:6px auto;background:#fff;border:1px solid #ddd}' +
    '.pp .pp-tpl{margin:6px 0 10px}.pp .pp-tpl .h{font-weight:700;margin:6px 0 2px}.pp .pp-tpl .t{padding-left:10px}' +
    '.pp .pp-two{display:flex;gap:14px}.pp .pp-two>*{flex:1;min-width:0}.pp .pp-small{font-size:11.5px;color:#444}' +
    '.pp .pp-tag{display:inline-block;font-size:11px;background:#111;color:#fff;padding:1px 7px;border-radius:10px;margin-left:6px}' +
    '.pp .pp-chk td:first-child{width:24px;text-align:center}.pp .pp-note{font-size:11.5px;color:#555;margin:4px 0}' +
    '@media screen and (max-width:640px){.pp .pp-two{display:block}}';

  function renderPrintPack(opts) {
    opts = opts || {};
    var sets = opts.sets || FIXED_SETS;
    var s1 = solveT1(SAMPLE_T1), s2 = solveT2(SAMPLE_T2);
    var h = '<div class="pp">';
    /* 0. 표지 */
    h += '<div class="pp-page"><h1>공통수학2 논술형 수행평가 — 생활 속 수학 탐구하기 (15점) 준비 팩</h1>';
    h += '<div class="pp-small">시험 2026-09-17(목) 수업시간 · 예시문항 2문제 공개, 실전은 <b>유형 그대로 숫자만 변경</b> · 손글씨 서술(풀이 과정·단위) · 이 팩은 math-1-2-1 정본(10_prep)에서 생성·검산됨(' + (opts.date || '') + ')</div>';
    h += '<h2>이 팩의 구성과 4일 사용법</h2><table><tr><th>쪽</th><th>내용</th><th>언제</th></tr>' +
      '<tr><td>1</td><td>예시문항 원문 + 만점 답안 예시(1번·2번)</td><td>9/13 — 먼저 읽고, 예시문항을 <b>그대로 한 번 손으로</b> 푼 뒤 대조</td></tr>' +
      '<tr><td>2</td><td>답안 틀 카드 2장 (▢에 숫자만 갈아끼움) + 원리 그림</td><td>9/13 — 순서와 근거 문장을 외운다</td></tr>' +
      '<tr><td>3</td><td>변형 문제 10세트 (문제 쪽)</td><td>9/14·15·16 — 하루 2~3세트, 반드시 종이에 손으로</td></tr>' +
      '<tr><td>4</td><td>변형 정답·풀이 (답 쪽)</td><td>풀고 나서만 본다. 틀린 자리 → 답안 틀로 돌아가기</td></tr>' +
      '<tr><td>5</td><td>함정 체크리스트 · 검산 루틴 · 시험 당일 시간 배분</td><td>9/16 저녁 + 9/17 등교 전</td></tr></table>';
    h += '<h2>정답 한눈에 (예시문항)</h2><table><tr><th>문항</th><th>정답</th></tr>' +
      '<tr><td>1-1</td><td>' + esc(s1.answers.circle) + '</td></tr><tr><td>1-2-1</td><td>m = ' + esc(s1.answers.m1.s()) + ' 또는 ' + esc(s1.answers.m2.s()) + '</td></tr>' +
      '<tr><td>1-2-2</td><td>' + esc(s1.answers.line1.slope) + ' , ' + esc(s1.answers.line2.slope) + '</td></tr><tr><td>1-3</td><td>P' + esc(pt(s1.answers.P[0], s1.answers.P[1])) + '</td></tr>' +
      '<tr><td>1-4</td><td>AP = ' + s1.answers.l + ' → ' + esc(realStr(s1.answers.real)) + ' ' + s1.answers.unit.n + '</td></tr><tr><td>2</td><td>' + s2.answers.ans + '</td></tr></table></div>';
    /* 1. 예시문항 + 모범답안 */
    h += '<div class="pp-page"><h2>1. 예시문항(생성기로 재구성 — 원문은 inbox 사진)과 만점 답안 예시</h2>' + problemHtml(s1, '1.') + '<h3>만점 답안 예시 — 1번</h3>' + stepsHtml(s1.steps) + '</div>';
    h += '<div class="pp-page">' + problemHtml(s2, '2.') + '<h3>만점 답안 예시 — 2번</h3>' + stepsHtml(s2.steps) + '<div class="pp-note">같은 답이 나오는 다른 방법: A를 x축에 대칭 → A′, 다시 A′을 y = x에 대칭 → A″(중심 (−2, 8)) 으로 잡고 A″C₂ 거리 13에서 4를 빼도 9. 둘 다 정답. 기본은 위 방법(양 끝점을 각각 한 번씩).</div></div>';
    /* 2. 답안 틀 + 원리 */
    h += '<div class="pp-page"><h2>2. 답안 틀 카드 — ▢에 숫자만 갈아끼운다</h2><div class="pp-two"><div><h3>카드 ① 1번형</h3>' +
      TEMPLATES.t1.map(function (b) { return '<div class="pp-tpl"><div class="h">' + md(b.h) + '</div>' + b.t.map(function (t) { return '<div class="t">' + md(t) + '</div>'; }).join('') + '</div>'; }).join('') +
      '</div><div><h3>카드 ② 2번형</h3>' +
      TEMPLATES.t2.map(function (b) { return '<div class="pp-tpl"><div class="h">' + md(b.h) + '</div>' + b.t.map(function (t) { return '<div class="t">' + md(t) + '</div>'; }).join('') + '</div>'; }).join('') +
      '<div class="pp-note">대칭 규칙표: x축 (x, y)→(x, −y) · y축 (x, y)→(−x, y) · y = x (x, y)→(y, x) · (참고, 범위 밖) y = −x (x, y)→(−y, −x)</div></div></div></div>';
    h += '<div class="pp-page"><h2>원리 그림 — 왜 이 방법이 되는가</h2><div class="pp-two"><div><h3>접선 = 중심에서 거리가 r인 직선</h3>' + svgTangent(SAMPLE_T1) +
      '<div class="pp-small">A에서 원에 그을 수 있는 접선은 두 개(실선·점선). 접점 P에서 반지름 CP ⊥ 접선이라 △APC는 직각삼각형: AC = d, CP = r, AP = ℓ = √(d² − r²). 그래서 "중심에서 직선까지의 거리 = r"이 접선 조건이고, A가 C와 수평이면 기울기는 ±r/ℓ.</div></div>' +
      '<div><h3>대칭이동 = 꺾인 길 펴기</h3>' + svgUnfold(SAMPLE_T2) +
      '<div class="pp-small">실선 A→P→Q→B가 실제 경로. A를 x축에, B를 y = x에 대칭이동하면(점선 원) 경로 길이는 그대로인데 모양이 직선 C₁′→C₂′(초록 점선)으로 펴진다. "점에서 원 위의 점까지 최소 거리 = 중심까지 거리 − 반지름"을 두 번 쓰면 최솟값 = 중심 거리 − r₁ − r₂ = 13 − 2 − 2 = 9.</div></div></div></div>';
    /* 3. 변형 문제 쪽 */
    var sols = sets.map(function (st) { var sol = solveAny(st.type, st.p); sol.id = st.id; sol.tag = st.tag; return sol; });
    h += '<div class="pp-page"><h2>3. 변형 문제 10세트 — 문제 쪽 (반드시 종이에 손으로)</h2><div class="pp-note">V1~V4 = 1번형, V5~V8 = 2번형, V9·V10 = 함정. 한 세트 목표 시간: 1번형 20분, 2번형 18분.</div>';
    var pend = 0; // 2번형은 두 세트를 한 쪽에, 1번형은 한 세트가 한 쪽
    sols.forEach(function (sol, i) {
      h += '<h3>' + esc(sol.id) + '<span class="pp-tag">' + esc(sol.tag) + '</span></h3>' + problemHtml(sol, sol.type === 1 ? '1.' : '2.') + '<div class="pp-ans ' + (sol.type === 1 ? 'lg' : 'md') + '"></div>';
      pend += sol.type === 1 ? 2 : 1;
      if (pend >= 2 && i < sols.length - 1) { h += '</div><div class="pp-page">'; pend = 0; }
    });
    h += '</div>';
    /* 4. 답 쪽 */
    h += '<div class="pp-page"><h2>4. 변형 정답·풀이 — 답 쪽 (풀고 나서만 본다)</h2>';
    var pend2 = 0;
    sols.forEach(function (sol, i) {
      h += '<h3>' + esc(sol.id) + ' 정답: ' + esc(sol.brief.join('  |  ')) + '</h3>' + stepsHtml(sol.steps);
      pend2 += sol.type === 1 ? 2 : 1;
      if (pend2 >= 2 && i < sols.length - 1) { h += '</div><div class="pp-page">'; pend2 = 0; }
    });
    h += '</div>';
    /* 5. 함정·검산·시간 */
    h += '<div class="pp-page"><h2>5. 함정 체크리스트 (전날 저녁·등교 전)</h2><table class="pp-chk">' + PITFALLS.map(function (q) { return '<tr><td>☐</td><td><b>' + esc(q.k) + '</b></td><td>' + md(q.t) + '</td></tr>'; }).join('') + '</table>' +
      '<h2>검산 루틴 (1분)</h2><ol>' + CHECKS.map(function (c) { return '<li>' + esc(c) + '</li>'; }).join('') + '</ol>' +
      '<h2>시험 당일 시간 배분 (50분 기준, 시간 확인 후 조정)</h2><table><tr><th>구간</th><th>시간</th><th>내용</th></tr>' + TIMEPLAN.map(function (r) { return '<tr><td>' + esc(r[0]) + '</td><td>' + esc(r[1]) + '</td><td>' + esc(r[2]) + '</td></tr>'; }).join('') + '</table>';
    h += '</div>';
    h += '</div>';
    return h;
  }

  return {
    F: F, isqrt: isqrt, esc: esc, josa: josa, realStr: realStr, md: md, pt: pt, circleEq: circleEq, lineSlope: lineSlope,
    T1_STORIES: T1_STORIES, T2_STORIES: T2_STORIES, TRIPLES: TRIPLES, UNITS: UNITS, LINES: LINES, LINE_IDS: LINE_IDS,
    solveT1: solveT1, solveT2: solveT2, solveAny: solveAny, genT1: genT1, genT2: genT2, validT2: validT2,
    verifyT1: verifyT1, verifyT2: verifyT2, verifyAny: verifyAny, parseNum: parseNum, near: near, mulberry32: mulberry32,
    SAMPLE_T1: SAMPLE_T1, SAMPLE_T2: SAMPLE_T2, FIXED_SETS: FIXED_SETS, TEMPLATES: TEMPLATES, PITFALLS: PITFALLS, CHECKS: CHECKS, TIMEPLAN: TIMEPLAN, QUESTIONS_FOR_NICK: QUESTIONS_FOR_NICK,
    stepsHtml: stepsHtml, problemHtml: problemHtml, svgTangent: svgTangent, svgUnfold: svgUnfold, PRINT_CSS: PRINT_CSS, renderPrintPack: renderPrintPack
  };
})();
