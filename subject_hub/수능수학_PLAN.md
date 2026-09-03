# 수능수학_PLAN — 대수 · 미적분Ⅰ · 확률과 통계 (고2, 2028 수능 공통 3과목)

> **이 문서가 고2 수학 3과목 확장의 정본(SSOT)이다.** 원 기획은 `C:/Kids/math-story-telling/00_project_hub/20_plan/260902_high_math_master_plan.md`(v2)이며, 2026-09-02 P0에서 subject_hub 관행으로 이식해 **이후 세션은 이 문서와 과목별 PLAN.md만 읽으면 된다.**
> 과목별 단원 지도 = [`대수/PLAN.md`](대수/PLAN.md) · [`미적분1/PLAN.md`](미적분1/PLAN.md) · [`확률과통계/PLAN.md`](확률과통계/PLAN.md). 이 문서는 세 과목이 공유하는 결정만 담는다.
> 상위 규율 = [`CLAUDE.md`](CLAUDE.md)(흥미 갈래 계약) · [`CONTENT_PRINCIPLES.md`](CONTENT_PRINCIPLES.md)(8원칙) · [`../00_META/FLOW_V2_INAPP_LOOP.md`](../00_META/FLOW_V2_INAPP_LOOP.md)(자기완결 루프).

---

## 0. 확정 사실 (재확인 불필요)

- **2028 수능 수학 = 공통 출제**: 대수 11문항 · 미적분Ⅰ 11문항 · 확률과 통계 8문항. 선택과목 폐지, 미적분Ⅱ·기하는 수능 범위 밖.
- 아들(2026 고1) = 2028 개편 수능 첫 세대. 공통수학1·2는 **토대**(이미 `mat1_`·`mat2_` 13단원 앱 완성·배포).
- 2022 개정 교과서 검정 합격 6종: 미래엔·비상교육·천재교과서·동아출판·지학사·YBM. **아들 학교 채택 교과서 미확인 → 표준 커리큘럼(성취기준 + 통용 목차) 기준으로 제작하고 "표준 제작" 명시**, 교과서를 받으면 용어·순서 보정.
- 출처: [나무위키 2022 개정 대수](https://namu.wiki/w/2022%20%EA%B0%9C%EC%A0%95%20%EA%B5%90%EC%9C%A1%EA%B3%BC%EC%A0%95/%EC%88%98%ED%95%99%EA%B3%BC/%EA%B3%A0%EB%93%B1%ED%95%99%EA%B5%90/%EB%8C%80%EC%88%98) · [미적분Ⅰ](https://namu.wiki/w/2022%20%EA%B0%9C%EC%A0%95%20%EA%B5%90%EC%9C%A1%EA%B3%BC%EC%A0%95/%EC%88%98%ED%95%99%EA%B3%BC/%EA%B3%A0%EB%93%B1%ED%95%99%EA%B5%90/%EB%AF%B8%EC%A0%81%EB%B6%84%E2%85%A0) · [확률과 통계](https://namu.wiki/w/2022%20%EA%B0%9C%EC%A0%95%20%EA%B5%90%EC%9C%A1%EA%B3%BC%EC%A0%95/%EC%88%98%ED%95%99%EA%B3%BC/%EA%B3%A0%EB%93%B1%ED%95%99%EA%B5%90/%ED%99%95%EB%A5%A0%EA%B3%BC%20%ED%86%B5%EA%B3%84) · [대수 통용 목차(mathbang)](https://mathbang.net/724) · [미래엔 대수 교과서](https://22txbook.m-teacher.co.kr/book/view.mrn?id=65) (2026-09-02 확인).

## 1. 결정 사항 (Nick 회신 2026-09-02 — 다시 묻지 않는다)

| 결정 | 내용 |
|---|---|
| **Q1 착수 순서** | 세 과목 순서 무관(Nick) → **기본안: P1 대수 → P2 미적분Ⅰ → P3 확통.** 대수는 고2 1학기 진도 예상·겨울방학 선행 타이밍, 미적분Ⅰ은 대수(지수·로그·수열 없이도 가능하지만 함수 감각) 다음이 자연스럽고, 확통은 독립적이라 마지막 |
| **Q2 특강 배치** | **과목 허브 안 "🚪 관문 특강" 섹션**(최상단). 별도 특강 허브 페이지는 만들지 않는다. 파일은 과목 폴더 안 `<prefix>sp_<topic>.html` |
| **Q3 G1~G5 부활** | ~~보류~~ → **진행 (Nick 2026-09-02 재지시: "고1 특강도 진행해야 함").** 파일 = `공통수학1/10_app/mat1_sp_{quad,abs,matrix}.html`, `공통수학2/10_app/mat2_sp_{coord,logic}.html`. 각 과목 허브 최상단 관문 특강 섹션에 배치 |
| 갈래 경계 | 내신·프린트·모의고사·오답노트는 **exam_track 소관**. 이 3과목은 흥미 갈래(subject_hub)로만 만든다 |
| 앱 문구 | CLAUDE.md 금지 1(시험 냄새 금지)에 따라 **앱 화면에 "수능 N문항"류 문구를 쓰지 않는다.** 기존 관행대로 허브 footer 한 줄("2022 개정 · 표준 커리큘럼 제작")만. 수능 범위 논의는 PLAN 문서 안에서만 |

## 2. 파일·폴더 규약 (P0 확정)

| 과목 | 소스 폴더 | prefix | 허브 | 관문 특강 파일 |
|---|---|---|---|---|
| 대수 | `subject_hub/대수/{02_text,10_app,PLAN.md}` | `alg_` | `alg_hub.html` | `alg_sp_log` · `alg_sp_circle` · `alg_sp_sigma` |
| 미적분Ⅰ | `subject_hub/미적분1/…` | `cal1_` | `cal1_hub.html` | `cal1_sp_limit` · `cal1_sp_slope` · `cal1_sp_area` |
| 확률과 통계 | `subject_hub/확률과통계/…` | `prob_` | `prob_hub.html` | `prob_sp_choose` · `prob_sp_bayes` · `prob_sp_normal` |

- 단원 앱 = `<prefix><topic>.html`, 특강 = `<prefix>sp_<topic>.html`. 허브·단원·특강이 한 폴더 `10_app/`에 평평하게 놓인다(공통수학 관행).
- 배포 = `C:/Nick/30_Apps/jwj-nick.github.io/high1/math/`(`mat1_`·`mat2_`와 형제). **파일 단위 `git add`**(배포 리포에 다른 앱 작업이 공존). 폴더명이 `high1`이지만 고2 과목도 여기에 둔다(플랜 v2 결정, URL 연속성).
- `02_text/`는 아들 교과서·시험지 캡쳐를 받으면 넣는 자리(지금은 빔).

## 3. 단원 앱 규격 (공통수학 관행 그대로)

- 단일 HTML · 바닐라 JS · 빌드 없음. **KaTeX CDN**(`$…$` 안 한글 금지) + **자작 Canvas/SVG**(DPR 보정·탭 노출 후 lazy init). 템플릿 = `공통수학1/10_app/mat1_polynomial.html` 스캐폴드(탭: 📋개요 → 개념탭×N → 🌐세상 속으로 → 🔥퀴즈 → ✅정리).
- 8원칙 시그니처 블록 최소 기준: 💥훅 · 개념 상호작용 · 📌평생기억 · 🏠실생활 · 🏭산업 · 🔥퀴즈 10 · ✅정리(+🔬수학자·💡인사이트 권장).
- **학습 루프**: 문제 먼저 → 예측 → [풀이 보기] 점진 공개. 퀴즈 해설은 "틀리면 고치는 곳" 앵커(해당 개념 탭)를 붙인다 — FLOW V2 원칙 B·C의 경량 적용. `drill.js` 복습함 이식은 후속(FLOW V2 로드맵 6단계 "공통수학2·국어"와 같은 줄에 등재).
- 개인화 금지: 아이 취미·진로를 억지로 엮지 않는다(2026-08-17 피드백). 실생활·산업 소재는 범용(금융·공학·데이터·자연현상).
- ⚠️ 잘림 버그: 퀴즈 해설 innerHTML에서 `<`+알파벳은 `&lt;`로 이스케이프. 부등호는 공백 규칙.

## 4. 관문 특강 규격 (math-story-telling 7단계 → subject_hub 이식판)

참조 구현 = `C:/Kids/math-story-telling/40_grades/middle/math1/app1/speed-mastery.html`(중1 속력 특강). 그쪽은 `concept.css/js`에 의존하므로 **여기서는 인라인 CSS·JS로 자기완결**시킨다(외부 라이브러리 금지 규약, KaTeX만 예외).

| 단계 | 섹션 | 내용 | subject_hub 결합 |
|---|---|---|---|
| ⓪ | 도입 공감 (hero) | "이 단원에서 왜 막히는가" 한 문단 + 목표 칩(유형 ①~④) | 💥훅 |
| ① | 감 잡기 — 공식 없이 | **핵심 위젯**(단위원 회전·리만합 슬라이더 등)으로 먼저 몸으로 | 개념 상호작용 |
| ② | 공식은 읽는 것 | 유도 과정을 단계 공개로. "왜 이 모양인가"를 스스로 말하기 | 깊이·생성 |
| ③ | 핵심 도구 | 표·그림·변환기 위젯(Σ 펼치기, 2×2 표 등). **불변 앵커 한 문장**을 매 유형에서 반복 | 📌평생기억 |
| ④ | 유형별 완전정복 | 유형 4개. 그림→표→식→풀이 순, 각 유형 "다른 문제로" **무한 재생성**(랜덤 생성기, Node 재검산 필수) | 인출·페이딩 |
| ⑤ | 실전 총정리 | 유형 미공개 5문제 섞어서. **틀리면 해당 단계 앵커로 복귀**(원칙 B "원인마다 고치는 곳") | 교차·전이 |
| ⑥ | 치트시트 | 한 화면 요약 + 인쇄 버튼 + 💡인사이트(3부작·다음 단원 연결) | 정리 |

- **3부작 앵커 링크**(이 시스템만의 자산): 변화율 3부작 = [중1 속력](https://jwj-nick.github.io/mid1/math1/app1/speed-mastery.html)(완성) → 중2 기울기(math-story-telling 예정) → **G10 `cal1_sp_slope`**. 세기 3부작 = 중2 경우의 수(예정) → 고1 `mat1_counting`(완성) → **G12 `prob_sp_choose`** → `prob_probability`. 예정인 쪽은 "준비 중" 표시로 두고 링크는 나중에 채운다.
- **배치 3중 경로**: 과목 허브 관문 특강 섹션 + 관련 단원 앱 📋개요 탭 인라인 링크("먼저 특강부터") + `math/index.html` 카드 부제.
- 특강은 과목의 **관문**이다: 각 Phase에서 특강 3개 먼저 → 단원 앱 → 허브 연결.
- **공용 엔진 `_shared/lecture.js`(2026-09-02)**: 스타일 주입·단계 내비·reveal·`LEC.check`(함께 생각하기)·`LEC.types`(유형 무한 재생성, 숫자/객관식 답·풀이 단계·다른 문제로)·`LEC.quiz`(실전 5문, 틀리면 유형 앵커, localStorage `lec:<key>` 점수만)·`LEC.plane`(좌표평면 Canvas: 격자·축·plot·seg·circle·dot·drag)·치트시트 인쇄. 특강 HTML은 `<script id="gen">`에 **순수 생성기**(`window.GEN={id:{label,anchor,gen,verify}}`)를 두고, `_shared/lecture_check.js`가 Node에서 N회 재검산한다(형식·verify·답 다양성·보기 중복·`$…$` 안 한글·`<`+알파벳 잘림·수식 안 `<`/`>` 뒤 알파벳). 배포 시 `lecture.js`를 `high1/math/`에 함께 복사(drill.js 관행).
- **수식 안 부등호 규칙**: `$…$` 안에서 `<`·`>` 뒤에 알파벳이 오면 브라우저가 태그로 읽어 수식이 사라진다 → 반드시 `\lt`·`\gt`(또는 `<` 뒤 공백). 게이트가 잡는다.

## 5. 허브 구조 · 확장 시안

**과목 허브(`alg_hub`·`cal1_hub`·`prob_hub`)** = `mat1_hub.html` 골격 + 아래 확장. P0에서 세 파일을 **소스에 시안으로 작성**했고(모든 카드 `예정`, 죽은 링크 없이 `div`), P1~P3에서 콘텐츠와 함께 배포한다.

```
crumb: 고1 › Math_1_1 › 대수
hero  (과목 색: 대수 보라 · 미적분Ⅰ 로즈 · 확통 오렌지)
진행 바
🧱 토대 링크: 공통수학1·2 허브 (+ 미적분Ⅰ은 대수, 확통은 mat1_counting 직링크)
🚪 관문 특강 — 먼저 여기부터  ← 카드 3 (금색 점선 테두리, "특강" 배지)
Ⅰ · Ⅱ · Ⅲ 대단원 섹션 — 단원 카드
🔗 3부작 링크 박스 (해당 과목만: 미적분Ⅰ=변화율, 확통=세기)
note · footer ("2022 개정 · 표준 커리큘럼 제작")
```

**`high1/math/index.html`** — 기존 "📐 공통수학 전과정" 섹션 아래에 새 섹션 추가 (P1 배포 시 적용):
```html
<div class="section-title">📐 고2 수학 (대수 · 미적분Ⅰ · 확률과 통계)</div>
<a class="card" href="alg_hub.html" style="border:0;background:linear-gradient(135deg,#4c1d95,#7c3aed);color:#fff;">
  <span class="tag" style="background:rgba(255,255,255,.2);color:#fff;">대수 · 고2</span>
  <div class="name" style="font-size:17px;">📈 대수 학습 허브</div>
  <div class="sub" style="color:rgba(255,255,255,.88);">지수·로그 · 삼각함수 · 수열 (9단원 + 관문 특강 3)</div>
</a>
<a class="card" href="cal1_hub.html" style="border:0;background:linear-gradient(135deg,#831843,#db2777);color:#fff;">
  <span class="tag" style="background:rgba(255,255,255,.2);color:#fff;">미적분Ⅰ · 고2</span>
  <div class="name" style="font-size:17px;">📉 미적분Ⅰ 학습 허브</div>
  <div class="sub" style="color:rgba(255,255,255,.88);">극한과 연속 · 미분 · 적분 (8단원 + 관문 특강 3)</div>
</a>
<a class="card" href="prob_hub.html" style="border:0;background:linear-gradient(135deg,#7c2d12,#ea580c);color:#fff;">
  <span class="tag" style="background:rgba(255,255,255,.2);color:#fff;">확률과 통계 · 고2</span>
  <div class="name" style="font-size:17px;">🎲 확률과 통계 학습 허브</div>
  <div class="sub" style="color:rgba(255,255,255,.88);">경우의 수 · 확률 · 통계 (7단원 + 관문 특강 3)</div>
</a>
```

**`high1/index.html`** — CSS 3줄 + "📚 전 단원 학습 허브" 섹션에 카드 3 (mat2 카드 뒤):
```css
.hub.alg  { background: linear-gradient(135deg,#4c1d95,#7c3aed); }
.hub.cal1 { background: linear-gradient(135deg,#831843,#db2777); }
.hub.prob { background: linear-gradient(135deg,#7c2d12,#ea580c); }
```
```html
<a class="card hub alg" href="math/alg_hub.html"><span class="badge">9단원+특강3</span><div class="icon">📈</div><div class="label">대수</div><div class="sub">지수·로그 · 삼각함수 · 수열</div></a>
<a class="card hub cal1" href="math/cal1_hub.html"><span class="badge">8단원+특강3</span><div class="icon">📉</div><div class="label">미적분Ⅰ</div><div class="sub">극한과 연속 · 미분 · 적분</div></a>
<a class="card hub prob" href="math/prob_hub.html"><span class="badge">7단원+특강3</span><div class="icon">🎲</div><div class="label">확률과 통계</div><div class="sub">경우의 수 · 확률 · 통계</div></a>
```
- 카드 등록 시점 = 해당 과목 **관문 특강 3개가 게이트를 통과한 뒤**(빈 허브를 아이에게 노출하지 않는다). 그 전까지는 허브 파일도 배포하지 않는다.

## 6. Phase 로드맵

| Phase | 내용 | 산출물 | 상태 |
|---|---|---|---|
| **P0 정본** | 플랜 이식 · 3과목 PLAN.md · prefix·특강 배치 확정 · 허브 시안 3 | 이 문서 + PLAN 3 + `*_hub.html` 시안 3 | ✅ 2026-09-02 |
| **P0.5 고1 관문 특강** | 공용 엔진 `_shared/lecture.js` + 게이트 `_shared/lecture_check.js` · G5·G3·G1·G2·G4 5개 · `mat1_hub`/`mat2_hub` 섹션 · 배포 | 특강 5 + 엔진 | ✅ 2026-09-03 리뷰 반영·**배포 완료** (`high1/math/mat1_sp_*`, `mat2_sp_*`, `lecture.js`) |
| **P1 대수** | G6·G7·G8 특강 → 9단원 앱 → 허브 연결·math index·high1 index 카드 → 배포 | `alg_*` 13파일 | ⬜ |
| **P2 미적분Ⅰ** | G9·G10·G11 특강 → 8단원 앱 → 허브·배포 | `cal1_*` 12파일 | ⬜ |
| **P3 확통** | G12·G13·G14 특강 → 7단원 앱 → 허브·배포 | `prob_*` 11파일 | ⬜ |
| 후속 | `drill.js` 복습함 이식(FLOW V2 로드맵 6단계) · 교과서 확보 시 보정 · G1~G5 조건부 | | |

Phase 단위로 세션을 끊고 착수 전 rate limit 잔량을 확인한다. 한 Phase 안에서는 **특강 3 → 단원 앱(교육과정 순) → 허브·인덱스 → 배포** 순서를 지킨다.

## 7. 모델 · 검증 게이트

| 작업 | 모델 | 이유 |
|---|---|---|
| 관문 특강 9(G6~G14) | **Fable** | 교수 설계·시각화 원샷 품질. G7(단위원 애니)·G10(할선→접선)·G14(표본분포 시뮬)는 난도 최상 |
| 단원 앱 양산 | **Opus** | 검증된 템플릿 위 콘텐츠 양산. 수학 정확성 게이트 필수 |
| 검증 게이트(`se-agent-app-reviewer`) | **Opus** | 복수정답·수식 오류의 유일한 방어선(HANDOFF §4) |
| 배포 복사·재검증 | Sonnet | 기계적 |

**게이트 순서(파일마다):** ① `node --check`(인라인 JS) ② KaTeX `$…$` 안 한글 스캔 ③ `<`+알파벳 잘림 스캔 ④ 태그 균형 ⑤ 랜덤 생성기는 **Node 독립 재검산**(생성 문제의 답이 식을 만족하는지 1,000회) ⑥ `se-agent-app-reviewer`(8원칙 + 수학 정확성) 🔴 0 → 배포. 브라우저 렌더 확인은 이 머신에서 불가 → Nick 확인 항목으로 남긴다.

**제작 방법:** Claude 직접 순차 제작. 서브에이전트 대량 단일파일 쓰기는 스트림 스톨(6/6 실패) → 서브에이전트는 **리뷰 전용**.

## 8. 범위 경계 (세 과목 공통 — 틀린 단순화 방지)

- 미적분Ⅰ은 **다항함수만**. 초월함수 미분·적분, 수열의 극한·급수, 삼각함수 덧셈정리는 미적분Ⅱ → 앱에서 다루지 않는다(🎓 더 깊이 배지로도 최소화).
- 확통: **원순열 제외**(2022), **모비율 추정 재도입**. 정적분은 그래프(넓이) 기반 정의(2022 변경, 구분구적법 정의 아님).
- 대수: 삼각함수 각의 변환은 **그래프의 대칭·평행이동**으로(2022 변경). 상용로그 지표·가수 용어는 범위 밖. 수열의 귀납적 정의는 다루되 **점화식에서 일반항 도출 특수 유형은 범위 밖**.
- 세부는 과목별 PLAN.md §범위 경계.

## 변경 이력
| 날짜 | 내용 |
|---|---|
| 2026-09-02 | **P0 정본 완료.** math-story-telling 마스터 플랜 v2를 subject_hub 관행으로 이식. Q1(대수→미적Ⅰ→확통)·Q2(허브 내 관문 특강 섹션)·Q3(G1~G5 보류) 확정. prefix `alg_/cal1_/prob_`·특강 `*_sp_*` 확정. 성취기준(대수 18·미적Ⅰ 20·확통 16) 웹 확인 후 단원 9·8·7로 분해. 허브 시안 3 + math/high1 인덱스 카드 스니펫. 앱 문구 "수능 N문항" 금지 규율 추가 |
| 2026-09-02 (2차) | **Q3 뒤집음 → 고1 관문 특강 G1~G5 제작.** 공용 엔진 lecture.js·게이트 lecture_check.js 신설, 특강 5개 게이트 통과(생성기 24종 × 800회 재검산). 헤드리스 Chrome(창폭 500 클램프)으로 렌더 확인 가능해짐. 허브 2개에 관문 특강 섹션. |
