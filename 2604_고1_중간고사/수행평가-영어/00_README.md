# 수행평가-영어 1-1 (2026.6.1 월, 30분, 20점)

> 1학기 공통영어1 논술 수행평가. AI 관련 6주제 중 1개 선택 → 150~250 words 영어 에세이.

## 1. 과제 본질 한눈에

| 항목 | 내용 |
|---|---|
| 일시 | **2026.6.1 (월) 30분, 20점** |
| D-day | **D-5** (오늘 2026-05-27 기준) |
| 형식 | 영어 에세이 (150~250 words) |
| Essay Structure | Intro(hook+opinion) → Body(이유1+근거1, 이유2+근거2) → Conclusion(요약+impact) |
| 필수 문법 3종 | ① 관계대명사 (Relative Clause) ② 가주어-진주어 (It ~ to/that ~) ③ 분사 (Ving / Past Participle) |
| 자료 인용 | "객관적인" 자료 + SOURCE 출처 필수 (별지 Brainstorming 제출, 점수 X but 안내됨) |
| 주제 영역 | WORK / LIBERTY & AI / EDUCATION — 각 영역 질문 2개씩, 총 6개 중 1개 선택 |

→ **합격선 시나리오**: 시험장에서 6주제 중 어떤 게 나와도 30분 안에, 외운 자료 1-2개를 자연스럽게 박고, 3종 문법을 의식적으로 끼워 넣어, 150~250자 안에 들어오는 글을 쓰는 것.

## 2. 6개 주제 (시험에서 1개 선택)

**WORK (일자리)**
- W1. Do you think AI will take away many more jobs or create new opportunities for people?
- W2. What kinds of jobs do you think will still need humans in the future? Why?

**LIBERTY & AI (자유·프라이버시)**
- L1. Do you think governments should regulate AI development? Why or why not?
- L2. How much personal information do you think people should share online?

**EDUCATION (교육)**
- E1. Since AI can provide information easily, what abilities should humans develop that AI cannot replace?
- E2. Do you think schools should change what they teach to prepare students for the future?

## 3. 다각도 접근 — 6개 앱 후보

기존 다른 과목 패턴 (사회 step형, 한국사 3앱 세트, 국어 견해문 가이드, study-quiz SR)을 영어 글쓰기 특성에 맞게 재구성.

| # | 앱 | 목적 | 학습 방식 | 우선순위 |
|---|---|---|---|---|
| **A** | **Essay Builder** (Step 1~5) | 6주제 중 1개 선택 → Brainstorm → Outline → Draft → Revise → Final 까지 단계별 가이드 | 사회 step 패턴 차용. 각 step에 모범 예시·표현 추천·체크리스트 | 🔴 **필수** |
| **B** | **Grammar 3종 Drill** | 관계대명사 / 가주어-진주어 / 분사 — 빈칸·변환 드릴 30+ 문항 | study-quiz SR 패턴. AI 주제 맥락 문장으로 구성 → 실전 연결 | 🔴 **필수** |
| **C** | **Expression Bank** | STEP2 표현 50+개 (긍정/부정/이유나열/예시/Cause-Effect/Compare-Contrast/강조/결론) | Flashcard + 예문 + 매칭 퀴즈 | 🟡 권장 |
| **D** | **Topic Prep Pack** | 6주제 각각 — 찬/반 논점, 객관적 자료 2-3개+출처, hook 예시, ending 예시 | 탭형 자료집 (한국사 가이드 패턴) | 🔴 **필수** |
| **E** | **30분 Mock Timer** | 6주제 중 랜덤 1개 출제 → 30분 타이머 + 단어 수 카운터 + 3종 문법 체크박스 → 셀프 채점 루브릭 | 실전 시뮬레이션. 누적 기록 (localStorage) | 🟡 권장 |
| **F** | **Self-Review Rubric** | 학교 채점 기준 가상 루브릭 — Structure/3 grammars/표현 다양성/출처/단어수 5개 축 점검, Radar chart | 자기 첨삭 도구 | 🟢 여유 시 |

**추천 진행 순서**: A → D → B → C → E → F  (작성 능력 → 자료 → 문법 → 표현 → 실전 → 첨삭)

## 4. 디렉토리 구조

```
수행평가-영어/
├── 00_README.md              ← 이 파일 (마스터 플랜)
├── 01_Source/                ← 원본 시험지 캡쳐
│   ├── 영어수행1-1_1.heic ~ _3.heic   (원본, 수정 금지)
│   └── 영어수행1-1_1.jpg ~ _3.jpg     (Pillow-heif 변환본)
├── 02_과제분석.md             ← 3페이지 캡쳐 OCR 정본 (Essay structure / 6주제 / STEP guide / 제출 양식)
├── 03_표현뱅크.md             ← STEP2 표현 50+개 카테고리별 + 예문
├── 04_grammar_3종.md          ← 관계대명사·가주어/진주어·분사 핵심 문법 노트
├── 05_topics_research.md      ← 6주제 자료조사 (찬반·근거·출처·hook·ending)
├── 06_모범_essays/            ← 6주제별 모범 essay 1-2편씩 (150~250자, 3종 문법 포함)
│   ├── W1_jobs.md
│   └── ... (주제별)
├── 07_체크리스트.md           ← 시험 전날·당일 체크리스트
├── chatlog/                  ← 세션별 작업 로그
│   └── MMDD_session.md
├── app/                      ← HTML 앱 (모두 단일 파일 self-contained)
│   ├── 00_index.html         ← 앱 런처
│   ├── A_essay_builder.html
│   ├── B_grammar_drill.html
│   ├── C_expression_bank.html
│   ├── D_topic_prep.html
│   ├── E_mock_timer.html
│   └── F_self_review.html
├── figs/                     ← (선택) 자료 차트·이미지
├── todo.md                   ← 작업 체크리스트 + 미처리 (Nick) 항목
├── issue.md                  ← OCR/표현/문법 미해결 이슈
└── study.md                  ← 학습 계획·약점 태그·진도
```

## 5. Phase별 작업 계획 (D-5 기준)

| Phase | 작업 | 산출물 | 목표일 |
|---|---|---|---|
| **P0** | 자료 변환 + 디렉토리 골격 | 01_Source/*.jpg, 00_README, todo/study/issue | 5/27 ✅ |
| **P1** | 정본 .md 3종 | 02_과제분석, 03_표현뱅크, 04_grammar_3종 | 5/27~5/28 |
| **P2** | 6주제 자료 조사 | 05_topics_research, 06_모범_essays (최소 2주제) | 5/28~5/29 |
| **P3** | 필수 앱 3종 | A_essay_builder, B_grammar_drill, D_topic_prep | 5/29~5/30 |
| **P4** | 보조 앱 + 모의시험 | C_expression_bank, E_mock_timer, F_self_review | 5/30~5/31 |
| **P5** | 실전 연습 + 약점 보강 | 모의시험 3회+, 07_체크리스트 | 5/31~6/1 |

## 6. (Nick) ↔ (Claude) 소통 규약

상위 폴더 [CLAUDE.md](../CLAUDE.md) §"사용자(Nick) ↔ Claude 소통 규약" 따른다. 핵심:
- (Nick) prefix로 어떤 .md든 자유롭게 코멘트
- (Claude) prefix로 처리 + 처리 완료 마킹
- 세션 시작 시 todo/issue/study에서 미처리 (Nick) 먼저 스캔

## 7. 우선 사용자 확인 사항

- [ ] (Nick) **앱 우선순위 (A/B/D 필수 + C/E/F 선택)** — 추천대로 OK? 다른 우선순위?
- [ ] (Nick) **목표 점수대** — 만점 노리는 수준? 안정적 16~18점? (자료 깊이·문법 난이도 조정)
- [ ] (Nick) **아들의 영어 수준** — 현재 어휘력·문법 약점이 있는지 (study.md에 반영)
- [ ] (Nick) **자료 인용 방식** — 실제 객관적 자료(통계·연구) 외우는 게 부담스러우면 "교과서·뉴스 일반 사례" 수준으로 톤다운 가능
