# 사회과 인터랙션 스니펫 (공유 위젯 SSOT)

> 통합사회1·2 + 한국사1·2 **4과목이 공유**하는 인터랙션 위젯의 정본(SSOT).
> 앱은 **단일 HTML(빌드 없음)** 원칙 → 각 앱은 여기 CSS/JS를 **인라인 복사**해 쓴다.
> 이 폴더 자체는 **배포하지 않는다**(데모/정본 보관용). 앱에 인라인된 사본이 실제 배포본.

## 왜 인라인인가
기존 과학·수학 앱과 동일하게 각 단원 앱은 자기완결 단일 파일이다(`APP_HOSTING.md`: "앱 HTML 파일만 배포"). 그래서 위젯은 `<script src>`로 로드하지 않고, 이 폴더의 정본을 앱 `<style>`/`<script>`에 붙여 넣는다. **버그·개선은 여기 정본을 먼저 고치고 각 앱에 전파**한다.

---

## 🕰️ 연표(타임라인) — `timeline.js` + `timeline.css`  ✅ v1 (한국사1 파일럿에서 확정)

연대순 **균등 배치(ordinal)** 방식. 고조선(BC2333)~고려(936)처럼 범위가 극단적으로 넓어도 조밀 구간이 뭉개지지 않는다(학교 교과서 연표 관례). 위/아래 교대 카드 + 배경 시대 띠 + 클릭 상세 패널.

### 사용
```html
<!-- 1) timeline.css의 .tl-* 블록을 앱 <style>에 인라인 -->
<!-- 2) timeline.js의 Timeline IIFE를 앱 <script>에 인라인 -->
<div class="tl-wrap"><div id="tl"></div></div>
<script>
Timeline.init(document.getElementById('tl'), {
  events: [
    { year:-2333, icon:'🏛️', cat:'era', key:true,
      label:'고조선 건국', note:'삼국유사 전승',
      detail:'단군왕검이 세운 …(innerHTML 허용)' },
    { year:676, icon:'🎉', cat:'silla', key:true, label:'신라 삼국통일', detail:'…' }
  ],
  eras: [ { from:-2333, to:-108, label:'선사·고조선', color:'#b45309' } ]
});
</script>
```
> **탭 안에 넣을 땐 탭 첫 노출 시 init**(레이아웃 폭 확정). 예: `tab.addEventListener('click', initTL)` + 1회 가드.

### 데이터 스펙
| 필드 | 필수 | 뜻 |
|---|---|---|
| `year` | ✅ | 연도. **음수 = 기원전(BCE)**. 예 `-2333`, `676` |
| `label` | ✅ | 마커 짧은 제목(textContent, 안전) |
| `detail` | ✅ | 클릭 시 상세 본문 — **innerHTML** 주입 |
| `icon` | | 이모지(점 안) |
| `cat` | | 색 키: `go`(고구려)·`baekje`(백제)·`silla`(신라)·`gaya`·`balhae`(발해)·`era`(중립) |
| `key` | | `true`면 📌 금색 테두리(평생기억) |
| `note` | | 연도 옆 주석. 예 `'삼국유사 전승'` |
| eras[].`from/to/label/color` | | 배경 시대 띠(범위에 드는 사건 span). `color`는 hex(투명도 자동) |

### ⚠️ 규약
- `detail`은 innerHTML → **`<`+문자 조합 금지**(태그로 파싱돼 잘림). 부등호는 `&lt;`. (과학·수학 반복 버그와 동일)
- `label`/`year`/상세 제목은 textContent라 안전.
- 연대는 **사실 정확성 최우선** — `se-agent-app-reviewer` 팩트 게이트 필수.

### 데모
`timeline_demo.html` — 로컬 http 서버로 열어 확인(한국사1 고대 데이터셋). `file://`는 확장프로그램이 막으므로 `python -m http.server` 후 `http://localhost:PORT/timeline_demo.html`.

---

## 🗺️ 지도 + 핫스팟 — `mapspots.*`  ⬜ 예정 (다음: 삼국 영토 변화)
SVG 지도(직접 제작/공개도메인) + 클릭 핫스팟 → 지역 상세. 저작권: 교과서 지도 스캔 금지.

## 🔀 인과 다이어그램 — `causechain.*`  ⬜ 예정 (다음: 무신정변/사화)
DOM 박스+화살표, 배경→전개→결과 **단계 공개**.

## ⚖️ 비교표 인터랙션 — 인라인 패턴  ✅ (kh1_ancient 삼국 비교)
버튼 선택 → 상세 패널 교체(`.kpick`/`.kpanel`). 위젯화는 재사용 2회↑ 시 검토.

---

## 변경 이력
| 날짜 | 내용 |
|---|---|
| 2026-07-23 | 🕰️ 연표 위젯 v1 정본(js/css/demo) — 한국사1 파일럿(`kh1_ancient`)에서 확정. ordinal 균등배치·시대띠·클릭상세·위아래교대. node --check ✓, 콘솔에러 0 |
