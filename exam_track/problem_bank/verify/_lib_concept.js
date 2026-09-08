/* _lib_concept.js — 계산이 없는 과목(사회·과학의 개념 문항·국어)의 검산 공용 헬퍼
 *
 * 왜 있는가
 *   수학은 정답을 다시 계산해 대조할 수 있지만, 개념 과목은 그럴 것이 없다.
 *   대신 이 두 가지를 코드로 못 박는다.
 *     ① 정답 근거가 학습앱 본문에 실제로 있는가 (appSource)
 *     ② 문항 구조가 규칙을 지키는가 (structCheck)
 *   세트마다 같은 코드를 베껴 쓰다 보면 규칙이 갈리므로 한 벌로 모았다.
 *
 * 쓰는 법 — verify/<set>.js 안에서
 *   const { appSource, structCheck } = require('./_lib_concept');
 *   const src = appSource('통합사회1', 'soc1_perspective.html');
 *   module.exports = function ({ S, chk }) {
 *     chk(1, '정답 보기 문구', 'lens 탭 · ' + src('앱에 있어야 할 근거 구절'));
 *     …
 *     structCheck(S, { set: 'soc1_01' });
 *   };
 *
 * 앱 대조는 태그와 공백을 모두 지우고 비교하므로 <b> 로 강조된 구절도 걸린다.
 */
const fs = require('fs'), path = require('path');
const ROOT = path.resolve(__dirname, '..', '..', '..');

const squeeze = s => s.replace(/<[^>]+>/g, '').replace(/\s+/g, '');

/** 학습앱을 한 번 읽어, 근거 구절이 그 안에 있는지 알려 주는 함수를 돌려준다. */
function appSource(subjectDir, appFile) {
  const p = path.join(ROOT, 'subject_hub', subjectDir, '10_app', appFile);
  const app = squeeze(fs.readFileSync(p, 'utf8'));
  return function src(frag) {
    return (app.includes(squeeze(frag)) ? '앱 근거 O 「' : '⚠ 앱에서 못 찾음 「') + frag + '」';
  };
}

/**
 * 문항 구조 검사. check_bank.py 가 보지 않는 층이다.
 *  opts.set    세트 id(오류 메시지용)
 *  opts.allowC5 / opts.allowC8   기본은 금지. 계산이나 연대가 실제로 있는 세트에서만 켠다.
 */
function structCheck(S, opts) {
  opts = opts || {};
  const bad = [];
  S.items.forEach(it => {
    const wrong = it.o.filter((_, i) => i !== it.a);
    const codes = wrong.map(o => o.cause);

    if (it.o[it.a].cause || it.o[it.a].why) bad.push(it.id + ' 정답 보기에 cause/why 가 붙었다');
    if (codes.some(c => !c)) bad.push(it.id + ' 오답에 cause 가 빠졌다');
    if (new Set(codes).size !== codes.length) bad.push(it.id + ' 오답 코드 중복 ' + codes.join('/'));
    if (codes.includes('C6')) bad.push(it.id + ' C6(시간전략)은 문항에 쓰지 않는다');
    if (!opts.allowC5 && codes.includes('C5')) bad.push(it.id + ' 계산이 없는데 C5 를 썼다 — 규칙을 모르는 것이면 C2 다');
    if (!opts.allowC8 && codes.includes('C8')) bad.push(it.id + ' 연대사가 아닌데 C8 을 썼다');
    if (codes.includes('C4') && !it.material) bad.push(it.id + ' material 없이 C4 를 썼다 — 꺼낼 대상이 화면에 있어야 한다');
    if (codes.includes('C7') && !it.material) bad.push(it.id + ' material 없이 C7 을 썼다 — 읽을 자료가 있어야 한다');

    wrong.forEach(o => {
      if (!o.why) bad.push(it.id + ' why 가 비었다');
      if (o.cause === 'C3' && !/↔/.test(o.why || '')) bad.push(it.id + ' C3 인데 why 에 혼동 쌍(↔)이 없다');
    });

    if (!/확인:/.test(it.solve.key)) bad.push(it.id + ' solve.key 에 "확인:" 줄이 없다');
    if (!it.solve.trap) bad.push(it.id + ' solve.trap 이 비었다');

    // 흥미 갈래 금지사항 1 — 앱 화면에 시험·점수를 연상시키는 문구를 넣지 않는다
    const m = JSON.stringify(it).match(/시험|점수|등수|내신|합격/);
    if (m) bad.push(it.id + ' 금지 문구 「' + m[0] + '」');

    // 보기 형태 단서 — 정답만 유독 길거나 짧으면 형태로 찍힌다
    const lens = it.o.map(o => o.t.length);
    const others = lens.filter((_, i) => i !== it.a);
    const mx = Math.max.apply(null, others), mn = Math.min.apply(null, others);
    if (lens[it.a] > mx * 1.8) bad.push(it.id + ' 정답 보기가 오답들보다 유독 길다(' + lens[it.a] + ' vs 최대 ' + mx + ')');
    if (lens[it.a] * 1.8 < mn) bad.push(it.id + ' 정답 보기가 오답들보다 유독 짧다(' + lens[it.a] + ' vs 최소 ' + mn + ')');
  });

  const code = {}, type = {}, lv = {};
  S.items.forEach(it => {
    it.o.forEach((o, i) => { if (i !== it.a && o.cause) code[o.cause] = (code[o.cause] || 0) + 1; });
    type[it.type] = (type[it.type] || 0) + 1; lv[it.level] = (lv[it.level] || 0) + 1;
  });
  console.log('   [구조] ' + (bad.length ? '✗ ' + bad.length + '건\n     · ' + bad.join('\n     · ') : '위반 없음'));
  console.log('   [분포] 원인 ' + JSON.stringify(code) + ' · 유형 ' + JSON.stringify(type) + ' · 난이도 ' + JSON.stringify(lv));
  if (bad.length) throw new Error((opts.set || S.id) + ' 구조 검사 실패 ' + bad.length + '건');
}

module.exports = { appSource, structCheck };
