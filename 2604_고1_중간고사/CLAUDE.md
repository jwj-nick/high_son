# CLAUDE.md — 2604 고1 중간고사

## 목적
고1 아들의 2026년 4월 중간고사 시험지(JPG 캡쳐)를 텍스트·다이어그램으로 정리하고, 틀린 문제를 오답노트화하여 약점을 체계적으로 보완한다. 본 디렉토리는 `C:/Kids/70_HighSchool/` 하위로, 앞으로 고등학교 3년간 시험·학습 자료가 누적될 예정. 폴더 규약·소통 규약·오답노트 포맷은 다른 시험에도 재사용한다.

## 대상 과목 (이번 시험)
| 우선순위 | 과목 | 페이지 | 문항 | 변환 상태 |
|---|---|---|---|---|
| 🔴 1순위 | 공통수학1 | 6 | 18 + 논술 2 | 🟢 완료 |
| 🔴 1순위 | 공통영어1 | 9 | 20 + 논술 4 | 🟢 완료 |
| 🟡 2순위 | 공통국어1 | 10 | 22 | 🟡 1차 (OCR 보정 필요) |
| 🟡 2순위 | 공통과학1 | 6 | 25 | 🟡 1차 (그림 보정 필요) |
| 🟢 3순위 | 한국사1 | 5 | 22 | 🟡 1차 (사료 보정 필요) |

---

## 폴더 규약

```
<과목>-중간/
├── 01_capture/             ← 원본 시험지 캡쳐 jpg (수정 금지)
│   ├── 20260426_*.jpg
│   └── figs/               ← (선택) crop된 그림 부분 jpg
├── 02_text/                ← 변환된 마크다운 (그룹 단위 정본)
│   ├── Q01-06_*.md
│   ├── ...
│   └── _all.md             ← 인덱스 (그룹 파일 링크 + 검색용)
├── 10_오답노트/             ← 틀린 문제 정리
│   └── Q<번호>_<주제>.md
├── todo.md                 ← 작업 체크리스트, 상태
├── issue.md                ← OCR/도식/마이그레이션/환경 미해결 이슈
└── study.md                ← 그 과목 공부 계획·약점 태그·핵심 개념·자료
```

## 사용자 (Nick) ↔ Claude 소통 규약 ⭐

이 프로젝트는 **파일 기반 비동기 소통**으로 운영한다. 채팅으로 매번 묻고 답하는 대신, .md 파일에 의견·질문·요청을 누적해서 흐름을 관리.

### 규칙
1. **사용자 발화는 `(Nick)` prefix.** 어떤 .md든 자유롭게 한 줄/한 단락 추가:
   ```markdown
   ## 다음 액션
   1. 채점 결과 받기
   2. (Nick) Q14 배점 확인했음 — [5.3점] 맞음. issue.md 해당 항목 닫아줘.
   3. (Nick) Q7 ⓐ 단어 다시 보니 "lead" 맞음.
   ```
2. **Claude 응답은 `(Claude)` prefix.** 같은 위치에 인라인으로 답하거나, "변경 사항" 섹션에 모아 처리.
   ```markdown
   3. (Nick) Q7 ⓐ 단어 "lead" 맞음.
      → (Claude 2026-04-27) 02_text 본문 "ⓐ lead bring" 으로 보정. issue.md 해당 항목 closed.
   ```
3. **처리 완료 마킹.** Claude는 처리한 (Nick) 항목 끝에 `→ (Claude YYYY-MM-DD) <조치 내용>` 추가.
4. **세션 시작 시 점검.** Claude는 작업 시작 전 해당 과목 폴더의 todo/issue/study .md를 읽고 미처리 (Nick) 항목을 먼저 처리한다.
5. **루트 단위 점검.** 채팅에서 "확인해줘", "정리해줘" 같은 모호한 요청이 오면 우선 모든 .md의 미처리 (Nick) 부터 스캔.

### Claude의 응답 위치 우선순위
- 의견/질문이 **특정 문제**에 관한 것: 해당 그룹 .md 안에 그 문제 바로 아래
- **OCR 정확도** 관련: `issue.md`
- **학습 방향/계획**: `study.md`
- **작업 진행/체크리스트**: `todo.md`

## 작업 방식

### 1단계: JPG → Text/Diagram (Markdown)
- Read 도구로 이미지 직접 읽기 (Claude 멀티모달).
- **그룹 단위로 한 .md 파일** (페이지 단위 또는 문제 묶음 단위). 파일명에 문제 번호 범위 표시: `Q01-06_선택형_p1.md`.
- 페이지 단위 .md 옆에 `_all.md` 인덱스 파일 두기 (검색·통합용).
- **수학:** 수식은 KaTeX/LaTeX (`$...$`, `$$...$$`). 도형은 Mermaid 또는 ASCII art. 그림 의도가 모호하면 `[FIG: 설명]` 플레이스홀더.
- **영어:** 지문 원문 그대로. 보기/선택지 번호 유지. 빈칸 `___` 표기.
- **국어:** 시 본문은 코드블록 그대로. 한자·고어 OCR은 신뢰도 낮으면 `⚠️OCR?` 표시.
- **과학:** 표/그래프는 마크다운 표. 원자 구조·결정구조 등은 `[FIG: 설명]` 또는 crop 이미지 첨부 (아래 §그림 처리 참조).
- **한국사:** 사료 인용은 `> ` blockquote, 출처 명시. 지도는 `[FIG: 설명]` + 필요시 crop.
- 문제 번호는 원본 그대로 (`### Q3` 형식).
- OCR 신뢰도 낮은 부분은 `⚠️OCR?` 표시 + `issue.md`에도 기록.

### 2단계: 그림 처리 (Crop & Embed)

텍스트로 표현 어려운 그림/도식은 원본에서 **crop한 이미지**로 .md에 첨부.

**환경:** Python 3.14 + Pillow 12.1 사용 가능 (확인됨).

**워크플로우:**
1. `01_capture/figs/` 디렉토리에 crop된 jpg 저장. 명명: `Q<번호>_<짧은설명>.jpg`
2. .md에서 표준 마크다운 이미지 문법으로 참조:
   ```markdown
   ### Q16
   ...
   ![Q16 좌표평면 도형](../01_capture/figs/Q16_좌표평면.jpg)
   ```
3. crop 명령은 Bash로 Pillow 호출:
   ```bash
   python -c "from PIL import Image; Image.open('src.jpg').crop((x1,y1,x2,y2)).save('out.jpg')"
   ```
4. **Claude의 좌표 추정 한계.** 시각으로 픽셀 좌표를 100% 정밀하게 추정 불가. 다음 두 가지로 운영:
   - **(A) 자동:** Claude가 대략 영역(예: 상하 1/3, 좌우 1/2)을 추정 → crop → 결과 확인 → 미세조정
   - **(B) 수동:** 사용자가 캡쳐 도구로 직접 잘라 `01_capture/figs/`에 저장 → Claude가 .md에 annotation

**향후 개선:** `/se_figcrop` 스킬 작성 검토. 입력 = 원본 jpg + 페이지 + 영역 명세 / 출력 = crop된 jpg + .md 자동 삽입.

### 3단계: 오답노트 ⭐ (핵심 단계)

> **이 단계가 이 프로젝트의 핵심이다.** `/se_math_error_note` 스킬과 `/se_math_practice` 스킬, 그리고 `se_agent_math_error_workflow` 에이전트를 사용한다.

#### 스킬 사용법
| 명령 | 동작 |
|---|---|
| `/se_math_error_note Q12` | Q12 오답노트 .md + 단계별 풀이 HTML 앱 생성 |
| `/se_math_practice Q12` | Q12 연습문제 9개 (🟢×3, 🟡×3, 🔴×3) 생성 |
| `/se_math_figure Q16` | 그림 있는 문제 → 문제 페이지: 정적 SVG / 풀이 페이지: JSXGraph 슬라이더 |
| 에이전트: "수학 오답 Q12, Q13 처리해줘" | 두 스킬을 순서대로 실행 + todo/study.md 업데이트 |
| 에이전트: "Q16 앱 검토해줘" | APP_PRINCIPLES 기준 앱 품질 검토, 위반 항목 보고 |

#### 오답노트 7섹션 포맷 (v1) — 스킬이 이 포맷을 따름

```markdown
# Q<번호> — [약점태그1] / [약점태그2]

## 문제 (원문)      ← 원문 그대로, KaTeX 수식
## 채점             ← 내 답 / 정답 / 배점 / 오답 유형 한 줄
## § 개념 체크      ← Q&A 테이블 5~7개 (앱 인터랙티브 요소)
## § 풀이           ← 3~6단계, 단계마다 "왜 이 단계인가" 설명
## § 왜 틀렸나      ← 유형/상황/교정 테이블
## § 핵심 개념      ← 원리 2~3개
## § 약점 태그      ← `수학:단원명` 형식 3~5개 + 보강 방향
```

#### 오답노트 앱 포맷 (v1) — HTML 단일 파일
- 페이지: 문제 → 단계별 풀이 → 한페이지 요약
- 버튼: [단계별 풀이 시작] [한페이지 요약 바로보기]
- 비표준 기호(deg 등): 첫 등장 시 초록 박스 설명 + 이후 한글 병행 표기
- **⭐ 설계 원칙**: [APP_PRINCIPLES.md](APP_PRINCIPLES.md) 필수 준수
  - **문제 페이지(page-0)**: 원문 그대로 + 정적 SVG (좌표 수치 없음, 슬라이더 금지)
  - **풀이 페이지(page-1~)**: JSXGraph 슬라이더 허용 (lazy init), 점진적 정보 공개

#### 연습문제 포맷 (v1) — 3카테고리 × 3문제
- 🟢 쉬운 (L1~L3): 핵심 구조 분리, 개념별 연습
- 🟡 중간 (M1~M3): 같은 사고 흐름, 다른 형태
- 🔴 응용 (H1~H3): 확장·융합·역방향

약점 태그: `수학:인수분해`, `영어:관계대명사`, `국어:음운변동`, `과학:화학결합`, `한국사:고려후기`.

### 4단계: 약점 분석 → 보강 학습 플랜
- 오답노트 누적 → `study.md §약점 태그` 갱신 (에이전트가 자동 처리).
- 단원별 추천 자료/연습 문제 묶음을 `study.md`에 추가.

---

## Claude 가이드라인
- 한국어로 응답. 짧고 명료하게.
- 원본 JPG는 절대 수정·삭제하지 않는다.
- 텍스트 변환 시 **추측/창작 금지** — 안 보이면 `⚠️` 표시 + `issue.md` 기록.
- 수식·도식은 가능한 한 정확히. 단순화는 명시.
- 오답노트는 "왜 틀렸나"를 항상 포함 — 단순 정답 나열 금지.
- 한 번에 많은 파일을 처리할 때는 그룹별로 분리 저장 (한 파일에 몰빵 X).
- 작업 시작 전 해당 과목의 todo/issue/study .md에서 **(Nick) 미처리 항목**을 먼저 확인.

---

## 환경 / 도구

| 도구 | 용도 | 상태 |
|---|---|---|
| Python 3.14 + Pillow 12.1 | 이미지 crop, 그림 처리 | ✅ 사용 가능 |
| Claude Code 멀티모달 Read | jpg → 텍스트 변환 | ✅ |
| 글로벌 settings.json allow | mkdir, ls, mv, cp, Read, Write/Edit on `C:/Kids/**` | ✅ 적용 (다음 세션부터) |
| `cly` alias | `claude --dangerously-skip-permissions` (YOLO) | ✅ `~/.bashrc` |

## 스킬 & 에이전트

### ✅ 구현 완료

| 명령 | 파일 | 동작 |
|---|---|---|
| `/se_figcrop Q16 수학` | `.claude/skills/se_figcrop/SKILL.md` | 시험지 jpg에서 그림 crop → .md 삽입 |
| `/se_math_error_note Q12` | `.claude/skills/se_math_error_note/SKILL.md` | 수학 오답노트 .md + HTML 앱 생성 |
| `/se_math_practice Q12` | `.claude/skills/se_math_practice/SKILL.md` | 연습문제 3×3=9개 생성 |
| `/se_math_figure Q16` | `.claude/skills/se_math_figure/SKILL.md` | 그림 있는 문제 → SVG(문제) + JSXGraph(풀이) |
| `/se_science_chem_card` | `.claude/skills/se_science_chem_card/SKILL.md` | 과학 개념 카드 생성 |
| "수학 오답 Q12, Q13 처리해줘" | `.claude/agents/se_agent_math_error_workflow.md` | error-note→figure→practice→검증 순 실행 |
| "Q16 앱 검토해줘" | `.claude/agents/se_agent_app_reviewer.md` | APP_PRINCIPLES 기준 앱 품질 검토 |
| "사회 step3 도와줘" | `.claude/agents/se_agent_subject_helper.md` | 자연어 → skill 분기 라우터 |

### 🔶 SKILL.md 뼈대 완성 (콘텐츠 의뢰 시 즉시 실행 가능)

| 명령 | 파일 | 동작 |
|---|---|---|
| `/se_perf_eval_step 사회 과제 step3` | `.claude/skills/se_perf_eval_step/SKILL.md` | Step형 수행평가 앱 골격 생성 |
| `/se_perf_eval_person 정도전 한국사` | `.claude/skills/se_perf_eval_person/SKILL.md` | 인물 수행평가 3앱 (가이드·모범·심화) |
| `/se_person_research 정도전` | `.claude/skills/se_person_research/SKILL.md` | 인물 데이터 .md 생성 (sub-skill) |

---

## 파일 인덱스 (이 프로젝트)

| 파일 | 용도 |
|---|---|
| [MASTER_PLAN.md](MASTER_PLAN.md) | 6단계 워크플로우, 트래커, 변경 이력 |
| [APP_PRINCIPLES.md](APP_PRINCIPLES.md) | ⭐ 앱 설계 원칙 — 문제/풀이 페이지 구분, 리뷰어 체크리스트 |
| [APP_HOSTING.md](APP_HOSTING.md) | ⭐ 앱 배포·인덱싱 원칙 — 파일명 규칙, mobile/desktop 대응, 배포 워크플로우 |
| [app_dev_env/](app_dev_env/) | 앱 개발 환경 — 기술 결정(ADR), MCP 계획, 로드맵 |
| [cht_log/](cht_log/) | 세션별 작업 로그 (MMDD_session.md) |
| [공통수학1-중간/](공통수학1-중간/) | 수학 — 02_text 정본 6개, 10_오답노트 Q13~Q20 |
| [공통영어1-중간/](공통영어1-중간/) | 영어 — 02_text 정본 9개 |
| [공통국어1-중간/](공통국어1-중간/) | 국어 — 02_text 1차 (OCR 보정 대기) |
| [공통과학1-중간/](공통과학1-중간/) | 과학 — 02_text 1차 (그림 보정 대기) |
| [한국사1-중간/](한국사1-중간/) | 한국사 — 02_text 1차 (사료 보정 대기) |
