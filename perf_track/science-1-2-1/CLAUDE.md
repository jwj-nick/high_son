# CLAUDE.md — science-1-2-1 (통합과학2 1차 수행평가 · 논술형 · 산·염기/중화 반응)

> 상위 계약은 [`../CLAUDE.md`](../CLAUDE.md)(perf_track). 이 파일은 이 과제 전용 규약이다.
> **재진입 순서:** ① [`inbox/README.md`](inbox/README.md) ② [`SESSION_LOG.md`](SESSION_LOG.md) ③ [`PLAN.md`](PLAN.md) → 그 다음 `/sci-start`.
> **로그 규칙:** 매 라운드 Nick의 메시지를 **원문 그대로** `SESSION_LOG.md`에 먼저 적고 나서 답한다(`/sci-log`). Claude 답변도 전문을 남긴다.

## 1. 과제 정의

- 과목: 통합과학2 (화학 — 산과 염기의 성질, 중화 반응). 교과서 42~49쪽 & 해당 범위 학습지.
- 시험: **2026-09-17(목)** 수업 시간, 교실, 논술형, 20점 만점(최하 7점), 흑색 펜·샤프 손글씨.
- 채점: **9항목 체크리스트**(`inbox/README.md` §1). 목적함수 = 9항목 전부에서 요구 키워드가 들어간 완전한 문장을 손으로 쓸 수 있게 한다.
- 아이 접점: **전용 앱**(폰, `high1/science/2sem_perf_neutral.html`) + **프린트 팩**(`90_output/print_pack.html`). 아이에게 묻는 질문은 앱·프린트 안에 적고, 답은 Nick이 이 세션에 넣는다.

## 2. 운영 방식 (라운드 2 확정)

- 라운드 3부터 **Claude 주도 자율 진행**. Nick 확인 지점은 `PLAN.md` §5의 두 곳(모범답안 검토, 아들 전달)뿐이다. 그 외는 묻지 않고 진행하고, 결과를 로그에 남긴다.
- 라운드 경계는 Claude가 판단한다. 한 라운드 = 산출물 묶음 하나 + 게이트 + 커밋.
- 공개 리포 배포·저작권은 신경 쓰지 않는다(Nick 라운드 2). 시험 후 공개 내림 여부는 라운드 6에서 결정.

## 3. 데이터 흐름 (단방향)

```
inbox/*.jpg + inbox/README.md        원본 사진 17장 + 색인(안내문·교과서·학습지·문제집 옮김)  ← 수정 금지
        ▼
10_prep/01_answer_keys.md            모범답안 정본 (9항목 × 문장 틀·키워드·감점 포인트)
10_prep/02_mock_bank.md              모의 은행 (시나리오 3종 × 9소문항 + 채점표)
10_prep/03_ion_drill.md              이온 드릴·지시약 표·생활 속 사례 표
10_prep/04_questions_for_son.md      아들에게 묻는 질문
        ▼
90_output/print_pack.html            프린트 팩 (정본을 옮김)
10_prep/app/perf_neutral.html        전용 앱 (정본을 옮김)
        ▼
C:\Nick\30_Apps\jwj-nick.github.io\high1\science\2sem_perf_neutral.html   배포본 + index.html 카드
```

**규칙:** 콘텐츠는 정본 `.md`에 먼저 적고 앱·프린트는 그것을 옮긴다. 정본은 `inbox/README.md` 범위 안에서만 쓴다(즉흥 창작·범위 밖 개념 금지).

## 4. 게이트 (배포 전 필수)

1. 인라인 `<script>` 추출 → `node --check`.
2. innerHTML 문자열의 `<`+알파벳 스캔(태그로 파싱돼 잘림 → `&lt;`).
3. viewport meta · 고정 px 없음 · 터치 44px · `@media (max-width:640px)` · breadcrumb nav.
4. `se-agent-app-reviewer`로 화학 정확성 검토 → 🔴 0.

## 5. 배포

1. `cp 10_prep/app/perf_neutral.html → C:\Nick\30_Apps\jwj-nick.github.io\high1\science\2sem_perf_neutral.html`
2. `high1/science/index.html`에 카드 추가(파일명 영어, `2sem_perf_` prefix).
3. 두 리포 커밋·푸시: public `jwj-nick.github.io` + private `high_son`(= `C:\Kids\70_HighSchool`).
4. 네트워크 명령(git push·curl)은 **단독 명령**으로(승인 대기에 다른 작업이 묶이지 않게).

## 6. 이 과제에서 쓰는 스킬

| 스킬 | 위치 | 용도 |
|---|---|---|
| `sci-start` | `.claude/skills/sci-start/` | 재진입: 정본 읽기 → 현재 라운드 파악 → 자율 진행 |
| `sci-log` | `.claude/skills/sci-log/` | 라운드 기록: Nick 원문 → SESSION_LOG, PLAN 이력, 커밋 |
| `perf-essay-prep` | `.claude/skills/perf-essay-prep/` | 논술형(체크리스트 공개형) 대비 파이프라인. 승격 후보 |

공통 스킬(`../.claude/skills/`)은 아직 없음. 루트 스킬 `se-perf-study-app`은 이번에 호출하지 않는다(Canvas·KaTeX 중심이라 과함).

## 7. 구조

```
science-1-2-1/
├── CLAUDE.md
├── SESSION_LOG.md    ← 라운드별 Nick 원문 + Claude 답변 전문
├── PLAN.md           ← 확정 산출물·앱 설계·라운드 계획·열린 질문
├── .claude/skills/   ← sci-start · sci-log · perf-essay-prep
├── inbox/            ← 사진 원본 17장 + README.md 색인 (수정 금지)
├── 00_notice/        ← (비어 있음; 안내문 원본은 inbox/00_notice_*.jpg)
├── 10_prep/          ← 정본 md 4개 + app/perf_neutral.html
└── 90_output/        ← print_pack.html
```

## 8. 변경 이력

| 날짜 | 내용 |
|---|---|
| 2026-09-12 | 골격 생성(perf-intake). inbox 17장 + README 색인. 라운드 1 제안 → 라운드 2 확정. 이 파일 전면 개정, 스킬 3개 생성. |
