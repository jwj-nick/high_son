# 0527 Session — 영어 수행평가 1-1 초기 구축

> 일자: 2026-05-27 (월) | D-5

## 시작점

- (Nick) "수행평가-영어" 준비 앱 생성 요청. 다각도 접근, 충실한 가이드. chatlog/, app/ 최소 두 디렉토리 필요.
- 초기 자료: `01_Source/영어수행1-1_{1,2,3}.heic` 3장만 존재.

## 완료한 작업

### 자료 변환
- Python `pillow-heif` 1.3.0 설치 → heic 3장 → jpg 변환 (2252×4000 each).
- 3페이지 캡쳐 분석:
  - p1: 과제 안내 + Essay structure + 6주제 + 3종 문법 요구
  - p2: STEP1~3 가이드 + 표현 표 (50+ 카테고리별)
  - p3: BRAINSTORMING FOR WRITING 제출 양식 (점수 X)

### 디렉토리 구조
```
수행평가-영어/
├── 00_README.md (마스터 플랜)
├── 01_Source/ (heic + jpg)
├── 02_과제분석.md (3페이지 정본 OCR)
├── 03_표현뱅크.md (50+ 표현 카테고리별)
├── 04_grammar_3종.md (관대/가주어/분사)
├── 05_topics_research.md (6주제 자료조사)
├── 06_모범_essays/ (6편)
├── 07_체크리스트.md (TBD)
├── app/ (00_index + A~F 7개)
├── chatlog/ (세션 로그)
├── figs/ (예비)
├── todo.md / study.md / issue.md
```

### 정본 .md 4종
- **02_과제분석.md**: 시험 30분 운영 전략 포함. "It is + 형용사 + that ~" 등 3종 문법 슬롯 명시.
- **03_표현뱅크.md**: 50+ 표현 + AI 주제 예문. 압축판 13개 핵심.
- **04_grammar_3종.md**: 관계대명사 / 가주어-진주어 / 분사 — 패턴·예문·자주 틀리는 포인트 + 200자 모범 예시.
- **05_topics_research.md**: 6주제(W1·W2·L1·L2·E1·E2) 각각 양면 논점 / 객관적 자료(WEF·McKinsey·OECD·EU AI Act·Pew·UNESCO·교육부) / hook / ending.

### 모범 Essay 6편 (06_모범_essays/)
모두 200~220 words, 3종 문법 ❶❷❸ 포함, 출처 1회 이상:
- W1_jobs.md (AI 일자리)
- W2_human_jobs.md (인간 직업)
- L1_regulation.md (정부 규제)
- L2_personal_info.md (온라인 정보 공유)
- E1_human_skills.md (5C 모델)
- E2_schools.md (학교 교육 변화)

### 앱 6개 (A~F)

| 앱 | 핵심 기능 | localStorage |
|---|---|---|
| **A · Essay Builder** | 6주제 선택 → Brainstorm → Outline → Draft → Revise → Final 5단계. 표현 클릭 삽입. 실시간 단어 수. | 진행상황 자동 저장 |
| **B · Grammar 3종 Drill** | 관계대명사 10 + 가주어/진주어 10 + 분사 10 = 30문항. MC + Fill-in. 정답률 누적. | 점수·답변 저장 |
| **C · Expression Bank** | 50+ 표현 7카테고리. 리스트 / 플래시카드 / 매칭 퀴즈 3 모드. | 진행 위치 저장 |
| **D · Topic Prep Pack** | 6주제 탭. 양면 논점 / 자료 4개씩 / hook 2개 / ending 2개. 모바일 드롭다운. | 선택 주제 저장 |
| **E · 30분 Mock Timer** | 랜덤/선택 주제. 30분 카운트다운. 단어 카운터. 종료 시 자동 채점 (단어 수 + 3종 문법 정규식 검출 + 구조 + 출처). | 답안 + 누적 기록 |
| **F · Self-Review Rubric** | 5축 자가 채점 (구조 3 + 문법 3 + 표현 3 + 출처 2 + 단어수 3 = 만점 14). 자동 분석 → 추천 점수 → Radar Chart + 개선 제안. | 점수 저장 |

모든 앱: viewport meta / `@media (max-width:640px)` 모바일 분기 / breadcrumb nav `고1 › English_1_1`.

### 호스팅 배포
- `C:/Nick/30_Apps/jwj-nick.github.io/high1/english/` 디렉토리 생성.
- A~F 앱 → `1sem_perf_*.html` 영문 파일명으로 복사.
- 00_index.html → `index.html`로 rename.
- 호스팅 버전에서 `../../index.html` → `../index.html` 일괄 수정 (high1 index 가리키도록).
- 카드 cross-link도 호스팅 파일명으로 자동 치환 (Python 스크립트).
- `high1/index.html`에 English_1_1 카드 추가 (🇬🇧 아이콘).
- 로컬 8788 서버로 7페이지 모두 HTTP 200 확인.
- Git commit + push → GitHub Pages 자동 배포.

### 라이브 URL
- 허브: https://jwj-nick.github.io/high1/
- 영어: https://jwj-nick.github.io/high1/english/
- 6 앱: `/high1/english/1sem_perf_{essay_builder,grammar_drill,expression_bank,topic_prep,mock_timer,self_review}.html`

## 결정·교훈

- **만점 수준 목표** 확인 → 표현·문법·자료·모범 essay 모두 풀 세트 작성.
- **자율 진행** 지시 → 사용자 확인 없이 P1~P6 모두 자율 완수.
- **3종 문법 슬롯 패턴화**가 핵심 — 학생이 외워야 할 것을 3개 문장 패턴으로 압축.
- 자료 조사는 위키 단독 X, **WEF/OECD/McKinsey/Stanford/Pew/EU/UNESCO** 등 신뢰 출처만 사용.

## 다음 액션 (P7)

- [ ] (Nick) 아들이 앱들 실제 사용해보고 피드백
- [ ] (Nick) 모의시험 1~2회 결과 → 약점 패턴 식별
- [ ] 약점 패턴 → 04_grammar_3종.md / 05_topics_research.md 보강
- [ ] 07_체크리스트.md (시험 전날·당일용) 작성
- [ ] 6/1 시험 후 피드백 회수 → 다음 수행평가에 재사용 가능 패턴 정리
