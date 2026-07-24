/* ============================================================
 * 사회과 공유 위젯 — 🕰️ 연표(타임라인)   [정본 SSOT]
 * ------------------------------------------------------------
 * ordinal(균등 간격) 방식: 사건을 "연대순으로 균등 배치 + 연도 라벨".
 *   → 학교 교과서 연표 관례. 고조선(BCE 2333)~고려(936)처럼 범위가
 *     극단적으로 넓어도 dense 구간이 안 뭉개짐. (실척 필요 시 별도 옵션)
 *
 * 사용:
 *   Timeline.init(containerEl, {
 *     events: [
 *       { year:Number,        // 음수 = 기원전(BCE). 예: -2333, 676
 *         label:String,       // 마커에 보일 짧은 제목
 *         icon:String,        // (선택) 이모지
 *         cat:String,         // (선택) 'go'|'baekje'|'silla'|'balhae'|'era' 등 색 키
 *         key:Boolean,        // (선택) 📌 평생기억 표시(테두리 강조)
 *         detail:String,      // 클릭 시 상세 패널 본문(innerHTML 허용)
 *         note:String }       // (선택) 연도 주석. 예: "삼국유사 전승"
 *     ],
 *     eras: [                 // (선택) 배경 시대 띠
 *       { from:Number, to:Number, label:String, color:String } ]
 *   })
 *
 * 의존: 없음(바닐라). CSS = 스니펫의 .tl-* 블록 필요(README 참조).
 * 규약: 텍스트는 textContent(안전), 상세는 detail을 innerHTML로 주입 →
 *       detail 안에서 '<'+문자는 반드시 &lt; 로. (퀴즈 해설 잘림 버그와 동일 주의)
 * ============================================================ */
var Timeline = (function () {
  var GAP = 132;   // 사건 간 간격(px)
  var PAD = 70;    // 좌우 여백(px)
  var CATCOLOR = {
    go: '#b45309', baekje: '#7c3aed', silla: '#2563eb',
    gaya: '#0891b2', balhae: '#15803d', era: '#475569', def: '#334155'
  };

  function fmtShort(y) { return y < 0 ? 'BC ' + (-y) : '' + y; }
  function fmtLong(y) { return y < 0 ? '기원전 ' + (-y) + '년' : y + '년'; }

  function init(root, data) {
    if (!root) return;
    var events = (data.events || []).slice().sort(function (a, b) { return a.year - b.year; });
    var eras = data.eras || [];
    var n = events.length;
    var trackW = PAD * 2 + Math.max(0, n - 1) * GAP;

    // x(index)
    function xi(i) { return PAD + i * GAP; }

    var html = '';
    html += '<div class="tl-scroll"><div class="tl-track" style="width:' + trackW + 'px">';

    // 시대 띠(배경) — era 범위에 드는 사건 index로 span
    eras.forEach(function (er, k) {
      var idxs = [];
      events.forEach(function (e, i) { if (e.year >= er.from && e.year <= er.to) idxs.push(i); });
      if (!idxs.length) return;
      var a = xi(idxs[0]) - GAP * 0.45, b = xi(idxs[idxs.length - 1]) + GAP * 0.45;
      var left = Math.max(6, a), w = Math.min(trackW - 12, b) - left;
      html += '<div class="tl-era" style="left:' + left + 'px;width:' + w + 'px;'
        + 'background:' + er.color + '1a;border-color:' + er.color + '55">'
        + '<span class="tl-era-lb" style="color:' + er.color + '"></span></div>';
    });

    // 축
    html += '<div class="tl-axis"></div>';

    // 사건 마커(버튼) — 위/아래 교대
    events.forEach(function (e, i) {
      var up = (i % 2 === 0);
      var color = CATCOLOR[e.cat] || CATCOLOR.def;
      html += '<button type="button" class="tl-ev ' + (up ? 'up' : 'down') + (e.key ? ' key' : '')
        + '" data-i="' + i + '" style="left:' + xi(i) + 'px;--c:' + color + '">'
        + '<span class="tl-card">'
        + '<span class="tl-yr"></span>'
        + '<span class="tl-lb"></span>'
        + '</span>'
        + '<span class="tl-dot">' + (e.icon || '') + '</span>'
        + '</button>';
    });

    html += '</div></div>'; // track, scroll
    // 상세 패널
    html += '<div class="tl-detail" id="' + root.id + '-d">'
      + '<div class="tl-d-hint">👆 위 연표에서 사건을 눌러 자세히 보세요.</div></div>';

    root.innerHTML = html;

    // textContent 안전 주입(라벨/연도) + era 라벨
    var track = root.querySelector('.tl-track');
    root.querySelectorAll('.tl-ev').forEach(function (btn) {
      var e = events[+btn.dataset.i];
      btn.querySelector('.tl-yr').textContent = fmtShort(e.year);
      btn.querySelector('.tl-lb').textContent = e.label;
      btn.setAttribute('aria-label', fmtLong(e.year) + ' ' + e.label);
      btn.addEventListener('click', function () { select(root, events, +btn.dataset.i); });
    });
    var eraLbs = root.querySelectorAll('.tl-era-lb');
    var vis = eras.filter(function (er) {
      return events.some(function (e) { return e.year >= er.from && e.year <= er.to; });
    });
    eraLbs.forEach(function (el, k) { if (vis[k]) el.textContent = vis[k].label; });

    // 첫 사건 자동 선택(패널 비지 않게) — 선택 사항
    if (n) select(root, events, 0, true);
  }

  function select(root, events, i, silent) {
    root.querySelectorAll('.tl-ev').forEach(function (b) { b.classList.remove('sel'); });
    var btn = root.querySelector('.tl-ev[data-i="' + i + '"]');
    if (btn) {
      btn.classList.add('sel');
      if (!silent) btn.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    }
    var e = events[i];
    var d = document.getElementById(root.id + '-d');
    var head = (e.icon ? e.icon + ' ' : '') + e.label;
    var yr = fmtLong(e.year) + (e.note ? ' <span class="tl-note">· ' + e.note + '</span>' : '');
    d.innerHTML = '<div class="tl-d-head"></div><div class="tl-d-yr">' + yr + '</div>'
      + '<div class="tl-d-body">' + (e.detail || '') + '</div>';
    d.querySelector('.tl-d-head').textContent = head; // 안전
  }

  return { init: init };
})();
