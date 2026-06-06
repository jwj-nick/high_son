---
name: se_perf_eval_step
description: 수행평가 다단계 Step형 도우미 앱 생성기. 과목·과제명·step번호를 받아 탭 기반 HTML 가이드 앱(개요+양식+모범답안) 골격을 자동 생성한다. P03 패턴(사회 메가시티 step3~6) 일반화.
---

# se_perf_eval_step — 수행평가 다단계 Step 도우미

## 호출 형식

```
/se_perf_eval_step <과목> <과제명> <step번호>

예시:
/se_perf_eval_step 사회 메가시티 step3
/se_perf_eval_step 도덕 미디어윤리 step2
/se_perf_eval_step 사회 기후변화 step4
```

## 입력 → 출력

| 입력 | 출력 |
|---|---|
| 과목 | 색 테마 선택 (step별 매핑 참조) |
| 과제명 | 앱 제목, 파일명 |
| step번호 | 탭 구성 결정 |
| 양식 .md (자동 탐색) | 양식 미러 섹션 채우기 |

**출력 파일**: `수행평가-<과목>/<과제명>_step<N>.html`

---

## 실행 절차

### 1단계: 자료 탐색

```
해당 과목 수행평가 폴더 탐색:
  수행평가-<과목>/
  ├── 안내문.md (또는 과제안내.md)
  ├── 채점기준.md
  └── step<N>_양식.md (있으면)
```

없으면 Nick에게 알림: "채점기준이 없습니다. 제공해 주시면 시작하겠습니다."

### 2단계: 색 테마 결정

Step 번호에 따른 기본 색 (사회 메가시티 패턴 기반):

| Step | ACCENT | 배경 톤 | 의미 |
|---|---|---|---|
| 1 | `#2980b9` (파랑) | `#eaf4fc` | 주제 도입 |
| 2 | `#8e44ad` (보라) | `#f5eefb` | 문제 인식 |
| 3 | `#e67e22` (주황) | `#fff9f0` | 장면 묘사 |
| 4 | `#c0392b` (빨강) | `#fdf5f4` | 원인 분석 |
| 5 | `#16a085` (초록) | `#f0fbf8` | 해결 방안 |
| 6 | `#2c3e50` (네이비) | `#f4f6f7` | 성찰·정리 |

과목이 다르면 같은 색상 체계 적용 (Step 번호 우선). 과목별 오버라이드 가능.

### 3단계: 탭 구성

기본 탭 구조 (step 유형에 따라 조정):

#### 사실 묘사형 (step 1~3)
```
[개요] [장면/대상] [특징1] [특징2] [근거자료] [양식전체]
```

#### 분석형 (step 4)
```
[개요] [장면+문제] [문제점1] [문제점2] [구조적원인] [근거자료] [양식전체]
```

#### 해결·성찰형 (step 5~6)
```
[개요] [핵심내용] [세부항목1] [세부항목2] [연결확인/성찰] [양식전체]
```

### 4단계: HTML 골격 생성

#### 필수 컴포넌트 (30_COMPONENTS.md 참조)

1. **form-mirror** (PE1) — 양식 항목 시각 미러
   - `<div class="form-item">` × N개
   - `.form-lines` + `.form-line` × 글자수 / 30 행
   - 색 테두리 = ACCENT

2. **hint-toggle** — 힌트 접기/펼치기
   - 기본 닫힘 상태
   - 좋은 예 (`ex-good`) / 나쁜 예 (`ex-bad`) 세트

3. **file-guide** — 참고 자료 위치 안내
   - 교과서 쪽수, 학습지 파일명 등

4. **think-box** (PE3) — step 5·6 필수, step 3·4 선택
   - 자문 질문 3~5개

5. **양식전체 탭** — 모든 양식 항목 모아 전체 흐름 확인

#### 필수 미포함 (사람이 채워야 하는 부분)

- 모범답안 내용 (`TODO: 모범답안`)
- 좋은 예 / 나쁜 예 텍스트 (`TODO: 예시`)
- 근거자료 구체 수치 (`TODO: 자료`)

→ TODO 표시 후 Nick에게 "다음 항목 채워주시면 완성됩니다" 안내

### 5단계: 품질 검토

생성 후 se_agent_app_reviewer 호출:
- `40_PRINCIPLES/perf_eval.md` 기준 검토
- PE1~PE8 항목 체크

---

## 색 테마 CSS 변수 패턴

```css
:root {
  --accent: <ACCENT>;
  --accent-tint: <ACCENT_TINT>;
  --header-bg: #1a3a4a;
  --tab-bg: #243b4e;
}

/* form-item */
.form-item { border: 2px solid var(--accent); }
.form-item .form-label { color: var(--accent); }
.form-item .form-lines { background: var(--accent-tint); }

/* tab 활성 */
.tab-btn.active { border-bottom-color: var(--accent); }

/* think-box */
.think-box { border: 2px dashed var(--accent); background: linear-gradient(135deg, #f8fffe, var(--accent-tint)); }
```

---

## 한계 (사람 개입 필수)

- 양식 문항 텍스트 (교사 안내문 없으면 생성 불가)
- 모범답안 (교과 내용 판단 필요)
- 채점 기준 배점 (안내문 기반만 가능)
- 좋은 예/나쁜 예 (사례 판단 필요)
- 그림·지도가 필요한 경우 (se_figcrop 별도 실행)

---

## 기존 구현 사례 (참조)

| 앱 | 경로 | 특이사항 |
|---|---|---|
| step1 | `수행평가-사회/social_step1.html` | 파랑 테마 |
| step2 | `수행평가-사회/social_step2.html` | 보라 테마 |
| step3 | `수행평가-사회/social_step3.html` | 주황 테마 |
| step4 | `수행평가-사회/social_step4.html` | 빨강 테마 |
| step5 | `수행평가-사회/social_step5.html` | 초록 + think-box |
| step6 | `수행평가-사회/social_step6.html` | 네이비 + think-box 강화 |

→ 새 과목 적용 시 이 파일들을 패턴 레퍼런스로 사용.
