# CLAUDE.md — math-1-2-1 (공통수학2 논술형 수행평가 · 생활 속 수학 탐구하기 · 원의 접선 + 대칭이동 최단 경로)

> 상위 계약은 [`../CLAUDE.md`](../CLAUDE.md)(perf_track). 이 파일은 이 과제 전용 규약이다.
> **재진입 순서:** ① [`inbox/README.md`](inbox/README.md) ② [`SESSION_LOG.md`](SESSION_LOG.md) ③ [`PLAN.md`](PLAN.md) ④ [`10_prep/01_analysis.md`](10_prep/01_analysis.md) → 그 다음 `/mat-start`.
> **로그 규칙:** 매 라운드 Nick의 메시지를 **원문 그대로** `SESSION_LOG.md`에 먼저 적고 나서 답한다(`/mat-log`). Claude 답변도 전문을 남긴다.

## 1. 과제 정의

- 과목: 공통수학2 (Ⅰ. 도형의 방정식 — 원의 방정식·접선·점과 직선의 거리·대칭이동·최단 경로).
- 시험: **2026-09-17(목)** 수업시간, 논술형, 15점. 손글씨 서술(풀이 과정·단위 요구).
- 형식: **예시문항 2문제가 공개됨. 실전 = 유형 그대로, 숫자만 조정**(Nick 전언). 1번 = 원형 공원과 접선 산책로(4소문항, 계단식), 2번 = 칸딘스키풍 LED 라인(대칭이동 최단 경로, 논술 1문항).
- 목적함수 = **숫자가 바뀐 같은 유형 2문제를 시간 안에, 감점 없는 서술로, 손으로 쓸 수 있게 한다.**
- 아이 접점: **프린트 팩**(`90_output/print_pack.html`, 손 연습이 본질) + **경량 앱**(폰, `high1/math/2sem_perf_circle_path.html`). 아이에게 묻는 질문은 앱·프린트 안에 적고, 답은 Nick이 이 세션에 넣는다.

## 2. 운영 방식

- 라운드 1(2026-09-12) = 인테이크·분석·제안. **라운드 2에서 Nick이 `PLAN.md` §7을 답하면 확정**, 그 뒤는 Claude 주도 자율 진행. Nick 확인 지점은 `PLAN.md` §5의 두 곳(답안 틀 검토, 아들 전달)뿐이다.
- 라운드 경계는 Claude가 판단한다. 한 라운드 = 산출물 묶음 하나 + 게이트 + 커밋.
- 이 리포(`C:\Kids\70_HighSchool`)는 **다른 과제 세션(society·science)이 동시에 돌 수 있다.** 커밋은 반드시 경로를 지정해서(`git add <이 폴더 파일>` + `git commit -- perf_track/math-1-2-1`) 다른 세션이 스테이징한 파일을 끌어가지 않게 한다. 상위 `../CLAUDE.md`도 다른 세션이 고치고 있을 수 있으니 수정 전에 `git status`·`git diff`로 확인한다.

## 3. 데이터 흐름 (단방향)

```
inbox/*.jpg + inbox/README.md          예시문항 2쪽 원본 + 색인(문제 전문 옮김)      ← 수정 금지
        ▼
10_prep/01_analysis.md                 풀이(복수 방법)·검산·개념 지도·변형 축·감점 포인트  ← 정본
10_prep/02_answer_templates.md         만점 답안 골격(빈칸 틀) + 근거 문장 뱅크
10_prep/gen/variants.mjs               변형 생성기(파라미터 → 문제·정답·풀이, 수치 검산)
10_prep/03_variant_bank.md             변형 문제 은행 10세트 (생성기 출력을 정리)
10_prep/04_questions_for_son.md        아들에게 묻는 질문
        ▼
90_output/print_pack.html              프린트 팩 (정본을 옮김)
10_prep/app/perf_circle_path.html      경량 앱 (정본을 옮김; ⚡드릴은 생성기 함수를 그대로 내장)
        ▼
C:\Nick\30_Apps\jwj-nick.github.io\high1\math\2sem_perf_circle_path.html   배포본 + index 카드
```

**규칙:** 콘텐츠는 정본 `.md`에 먼저 적고 앱·프린트는 그것을 옮긴다. 변형 문제의 숫자는 **생성기로 산출하고 검산된 것만** 쓴다(손으로 지어낸 숫자 금지). 범위 밖 기법(벡터·삼각함수 접선 공식)은 검산 코멘트로만 둔다.

## 4. 게이트 (배포 전 필수)

1. 생성기: 각 변형 세트를 무차별 탐색(원 위 점 격자)으로 재검산 → 이론값과 오차 < 1e-2.
2. 인라인 `<script>` 추출 → `node --check`.
3. innerHTML 문자열의 `<`+알파벳 스캔(태그로 파싱돼 잘림 → `&lt;`). 부등호는 공백 규칙(`a < b`).
4. viewport meta · 고정 px 없음 · 터치 44px · `@media (max-width:640px)` · breadcrumb nav.
5. `se-agent-app-reviewer`로 수학 정확성 검토 → 🔴 0.

## 5. 배포

1. `cp 10_prep/app/perf_circle_path.html → C:\Nick\30_Apps\jwj-nick.github.io\high1\math\2sem_perf_circle_path.html`
2. `high1/math/index.html`(또는 `_shared/math_index.html` — 배포 시 실측)에 카드 추가(파일명 영어, `2sem_perf_` prefix).
3. 두 리포 커밋·푸시: public `jwj-nick.github.io` + private `high_son`(= `C:\Kids\70_HighSchool`, 경로 지정 커밋).
4. 네트워크 명령(git push·curl)은 **단독 명령**으로.

## 6. 이 과제에서 쓰는 스킬

| 스킬 | 위치 | 용도 |
|---|---|---|
| `mat-start` | `.claude/skills/mat-start/` | 재진입: 정본 읽기 → 현재 라운드 파악 → 자율 진행 |
| `mat-log` | `.claude/skills/mat-log/` | 라운드 기록: Nick 원문 → SESSION_LOG, PLAN 이력, 경로 지정 커밋 |
| `perf-math-variant` | `.claude/skills/perf-math-variant/` | (라운드 2 확정 후 생성 예정) 유형 고정·숫자 변형 논술형 수학 수행평가 대비 파이프라인. 승격 후보 |

공통 스킬(`../.claude/skills/`)은 아직 없음. 루트 스킬 `se-perf-study-app`·`se-math-drill-set`은 이번에 호출하지 않는다(전자는 Canvas·KaTeX 중심이라 과함, 후자는 단원 앱용 12문항 세트 절차라 형식이 다름). 개념 복습이 필요하면 앱에서 `subject_hub/공통수학2` 단원 앱으로 딥링크만 건다.

## 7. 구조

```
math-1-2-1/
├── CLAUDE.md
├── SESSION_LOG.md    ← 라운드별 Nick 원문 + Claude 답변 전문
├── PLAN.md           ← 산출물·앱 설계·라운드 계획·열린 질문
├── .claude/skills/   ← mat-start · mat-log · (perf-math-variant)
├── inbox/            ← 예시문항 사진 2장 + README.md 색인 (수정 금지)
├── 00_notice/        ← (비어 있음; 예시문항 원본은 inbox/)
├── 10_prep/          ← 01_analysis.md ✅ · 02~04 정본 · gen/variants.mjs · app/perf_circle_path.html
└── 90_output/        ← print_pack.html
```

## 8. 변경 이력

| 날짜 | 내용 |
|---|---|
| 2026-09-12 | 골격 생성(perf-intake, 상위 커밋 5bc870a). |
| 2026-09-12 | 라운드 1: inbox 2장 + README, `10_prep/01_analysis.md`(수치 검산), `PLAN.md` 제안, 이 파일 전면 개정, `mat-start`·`mat-log` 생성. |
