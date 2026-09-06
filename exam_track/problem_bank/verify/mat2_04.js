// mat2_04 집합 — 정답키 독립 재검산 (node exam_track/tools/verify_set.js mat2_04). 집합은 brute force.
module.exports = function ({ S, chk, subsets, has, lcm }) {
  { const A = ['∅', '0', '{0}']; chk(1, '{∅} ∈ A', '{∅}∈A:' + A.includes('{∅}') + ' ∅∈A:' + A.includes('∅') + ' {0}∈A:' + A.includes('{0}') + ' {0}⊂A(0∈A):' + A.includes('0')); }
  { const dv = [...Array(12).keys()].map(i => i + 1).filter(d => 12 % d === 0); chk(2, '64', '약수 ' + dv.length + '개 → 2^' + dv.length + '=' + 2 ** dv.length); }
  { let c = 0; subsets(6, m => { if (has(m, 0) && !has(m, 5)) c++; }); chk(3, '16', 'brute=' + c); }
  { const U = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10], A = [2, 4, 6, 8, 10], B = [1, 2, 3, 6]; chk(4, '{5, 7, 9}', 'brute=' + U.filter(x => !A.includes(x) && !B.includes(x))); }
  chk(5, '4', '40−(24+21−9)=' + (40 - (24 + 21 - 9)));
  { const M = Math.min(22, 18), m = Math.max(0, 22 + 18 - 35); chk(6, '23', 'M=' + M + ' m=' + m); }
  { const res = [2, -2].map(a => { const A = new Set([1, 2, a * a + 1]), B = new Set([2, 3, a + 3]); return 'a=' + a + ' ∩=' + [...A].filter(x => B.has(x)).sort() + ' ∪=' + [...new Set([...A, ...B])].sort(); }); chk(7, '{1, 2, 3, 5}', res.join(' | ')); }
  chk(8, '4', 'A∩B=' + (12 - 7) + ' B−A=' + (9 - (12 - 7)));
  { let same = [0, 0, 0, 0], tot = 0; const U = [1, 2, 3, 4];
    subsets(4, a => subsets(4, b => { const inA = (x) => has(a, x - 1), inB = (x) => has(b, x - 1); const key = (s) => s.join(',');
      const A = U.filter(inA);
      const o = [U.filter(x => (inA(x) && !inB(x)) || (inA(x) && inB(x))), U.filter(x => (inA(x) || inB(x)) && !inB(x)), U.filter(x => (inA(x) && inB(x)) || (inB(x) && !inA(x))), U.filter(x => inA(x) || (!inA(x) && inB(x)))];
      o.forEach((s, i) => { if (key(s) === key(A)) same[i]++; }); tot++; }));
    chk(9, '(A − B) ∪ (A ∩ B)', '항상 A와 같은 비율: ' + same.map(s => s + '/' + tot).join(' ')); }
  { let n = 0, bc = 0, ca = 0, ab = 0, eq = 0;
    subsets(3, a => subsets(3, b => subsets(3, c => { if ((a | b) !== a || (a & c) !== a) return; n++; if ((b & c) === b) bc++; if ((c & a) === c) ca++; if ((a & b) === a) ab++; if (b === c) eq++; })));
    chk(10, 'B ⊂ C', 'B⊂C ' + bc + '/' + n + ' · C⊂A ' + ca + '/' + n + ' · A⊂B ' + ab + '/' + n + ' · B=C ' + eq + '/' + n); }
  { let c = 0; subsets(8, m => { if (!has(m, 0) && !has(m, 1) && has(m, 2) && has(m, 3)) c++; }); chk(11, '16', 'brute=' + c); }
  chk(12, '12', 'lcm=' + lcm(4, 6));
};
