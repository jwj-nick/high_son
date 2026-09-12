# CLAUDE.md — society-1-2-1 (통합사회2, 경제생활의 주요 주제 탐구하기)

> 상위 계약은 [`../CLAUDE.md`](../CLAUDE.md). 세부 준비 내용은 이 폴더에서 따로 논의.
> **재진입 순서:** ① [`inbox/README.md`](inbox/README.md) ② [`SESSION_LOG.md`](SESSION_LOG.md)(Nick 발화 원문 + Claude 답변 전문, 라운드 누적) ③ [`PLAN.md`](PLAN.md)(확정된 산출물·일정·열린 질문). 스킬 `/soc-start`가 이 순서를 실행하고, 제작은 `/soc-prep` 절차를 따른다.
> **로그 규칙:** 매 라운드 Nick의 메시지를 원문 그대로 `SESSION_LOG.md`에 먼저 적고 나서 답한다(`/soc-log`).
> **재진입 seed:** [`inbox/README.md`](inbox/README.md) — 부교재 주제 11~16(p50~75, 16장)의 표 전문·심화 자료·활동 문항·**아들 기입 상태 진단**·빈칸 복원안·핵심 질문 4개 ↔ 주제 대응표. 사진 원본은 `inbox/*.jpg`(수정 금지), 세부 확인이 필요할 때만 연다. 빠진 쪽은 객관식 문제 쪽이라 Nick이 일부러 뺐다 — 부교재 정본은 이 16장으로 충분하다.

## 과제 정의

- 과목: 통합사회2
- 관련 단원: 3단원 전체 (부교재 주제 11~16, 50쪽~78쪽) — 자본주의 전개·경제 체제 / 합리적 선택·시장 실패·경제 주체의 역할 / 자산 관리·금융 의사 결정 / 국제 분업·무역
- 마감: **미정 — 2026-09-17~23 사이로 추정** (`PLAN.md` Q3). 같은 주에 과학·수학(9/17)·한국사(9/18) 수행이 겹친다.
- 학교가 요구하는 최종 제출 형태: **서술형 답안 4개, 각 5점, 총 20점.** 시험 시간에 **자료 제시 없이** 외워 간 내용을 **볼펜으로 서술**한다(Nick 추정). 핵심 질문은 `00_notice/questions.md`(2022 개정 통합사회2 3단원 성취기준 4문장과 같음).
- 채점기준(rubric) 요약: 핵심 질문 4개 자체가 곧 채점 범위. "네 주제를 그대로 던지고 서술하라"는 형태도 가능하므로 통째 답안(A 만점형·B 압축형)을 준비한다.

## 준비 전략 (라운드 1 확정, `PLAN.md` §3)

- 정본(md): ⓪ `10_prep/00_fill_blanks.md` 빈칸 복원표 → ① `01_answer_keys.md` 4대 질문 답안(질문 분해·암기용 뼈대·A/B·채점 키워드·감점·변형) → ② `02_question_bank.md` 연습 문항 32개(힌트 2단계·모범답안·채점 키워드) → ③ `03_workbook_digest.md` 부교재 완성본 정리.
- 산출물(HTML): ⑤ 학습 앱 `10_prep/app/2sem_perf_economy.html`(📖 부교재 정리 · ⭐ 4대 질문 · ✍️ 연습(답 가림→생각→힌트→모범답안→자가 채점) · ✅ 전날 점검) → 배포 `high1/society/2sem_perf_economy.html` / ⑥ 프린트 팩 `90_output/print_pack.html`(손글씨 줄 포함).
- 진단 요지: 아들은 표 빈칸·계산은 정확하고, **주제 12 경제 체제 표가 통째로 비어 있으며**, 서술 활동은 대부분 미기입 → 약점은 지식이 아니라 **문장화·암기 순서**.
- 콘텐츠 규칙: `inbox/README.md` 밖의 개념·용어를 쓰지 않는다. 채점 키워드는 부교재 용어만. 아이 취미·진로와 억지로 엮지 않는다. 전송 UI 없음(아웃루프 차단).

## 이 과제에서 쓰는 스킬

- 공통: 없음. 승격은 아이디어로만 남김(Nick 라운드 2) — 필요한 것은 이 폴더에서 자체 제작·사용
- 전용: `soc-start`(재진입) · `soc-log`(라운드 기록) · `soc-prep`(제작 절차)

## 기존 자산과의 관계

| 자산 | 위치 | 이 과제에서의 용도 |
|---|---|---|
| 흥미 학습 앱 `soc2_market.html` (Ⅶ 시장경제와 지속가능발전, 수요·공급 SVG·시장 실패·무역·금융) | `subject_hub/통합사회2/10_app/` → 배포 `high1/society/` | 같은 단원. **복습 보조**로만 안내. 서술 답안 준비 도구 아님 |
| 고난도 객관식 문제은행 `drill_soc2_03.js` (2026-08-11, 도표형 포함) | 같은 폴더 | 자료 제시형 문항의 형식 참고 |
| 1학기 사회 수행 `social_step1~6.html` (메가시티 다단계 보고서) | `exam_track/26_High_1-1/수행평가-사회/` | 형태가 달라 재사용 안 함 |
| 과학 과제 `perf-essay-prep` 스킬 | `../science-1-2-1/.claude/skills/` | 앱 규약(Canvas·KaTeX 없음, 점진 공개, 게이트)의 원형. 이 폴더에서는 로드되지 않으므로 `soc-prep`에 옮겨 적었다 |

## 구조

```
society-1-2-1/
├── CLAUDE.md
├── SESSION_LOG.md    ← 라운드별 Nick 원문 + Claude 답변 전문
├── PLAN.md           ← 산출물·일정·열린 질문 (라운드 1 확정)
├── .claude/skills/   ← soc-start · soc-log · soc-prep (이 과제 전용)
├── inbox/            ← ⭐ 대화 seed. 부교재 사진 16장(p50~75) + README.md 색인 (2026-09-12)
├── 00_notice/
│   └── questions.md  ← 핵심 질문 4개 원문 (수정 금지)
├── 10_prep/          ← 00_fill_blanks · 01_answer_keys · 02_question_bank · 03_workbook_digest · 04_review · app/(build.py → 2sem_perf_economy.html · 2sem_perf_economy_print.html)
└── 90_output/        ← print_pack.html (최종 준비 형태)
```
