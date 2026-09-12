---
name: perf-math-variant
description: "유형 고정·숫자 변형" 논술형 수학 수행평가(예시문항 공개형) 대비 파이프라인. 예시문항 분석 → 분수 정확 생성기(core.js) → 답안 틀·변형 은행·질문지 정본(md) → 프린트 팩 → 경량 앱(원리 SVG 실험 + 변형 드릴 + 앱 내 프린트) → 게이트(수치 검산·문법·CDP 스모크·리뷰어) → 배포. 호출 예 — "/perf-math-variant", "변형 세트 다시 뽑아", "생성기 고치고 재빌드". math-1-2-1(원의 접선 + 대칭이동 최단 경로)이 1호. 다른 유형의 수학 수행이 오면 core.js의 solve/gen 함수만 새로 쓰고 나머지는 그대로 쓴다.
---

# perf-math-variant — 유형 고정·숫자 변형 수학 수행평가 파이프라인

## 언제 쓰나
학교가 예시문항을 공개하고 "실전은 숫자만 바뀐다"고 한 **논술형 수학 수행평가**. 채점은 과정 서술이므로 산출물은 ① 만점 답안 틀 ② 검산된 변형 문제 ③ 손 연습용 프린트 ④ 원리 시각화·랜덤 드릴 앱이다.

## 단일 정본 원칙
- 숫자·문장의 정본은 **`10_prep/gen/core.js`** 하나다(분수 정확 연산 `F`, `solveT*`/`genT*`, `FIXED_SETS`, `TEMPLATES`, `PITFALLS`, `renderPrintPack`).
- `10_prep/02_answer_templates.md`·`03_variant_bank.md`·`04_questions_for_son.md`·`90_output/print_pack.html`·앱의 `/* @core */` 블록은 **전부 생성물**이다. 손으로 고치지 않는다. 고칠 것은 core.js를 고치고 아래 명령을 다시 돌린다.
- 변형 숫자는 반드시 생성기가 만들고 `verify`가 무차별 탐색으로 재검산한 것만 쓴다. 손으로 지어낸 숫자 금지.

## 명령 (전부 `10_prep/gen`에서)
```
node variants.mjs verify      # 게이트 1: 예시·고정 10세트·무작위 330세트 수치 검산 → "실패 0건"이어야 함
node variants.mjs search      # 고정 세트 후보 탐색(스펙별 목표 삼조·직선 조합) → 결과를 core.js FIXED_SETS에 붙여 넣는다
node variants.mjs docs        # 02·04 md 생성
node variants.mjs bank        # 03 md 생성
node variants.mjs print       # 90_output/print_pack.html 생성
node variants.mjs build       # 앱 HTML의 /* @core */ … /* /@core */ 사이에 core.js 인라인
node cdp_smoke.mjs [폴더]     # 게이트 3: 헤드리스 Chrome을 CDP로 조작해 탭·애니메이션·드릴 채점·복습함·프린트 렌더링·콘솔 에러 검사
sh gate.sh                    # 위 verify → docs → bank → print → build → 인라인 스크립트 node --check → cdp_smoke 를 한 번에
```

## 절차
1. **분석 정본** `10_prep/01_analysis.md`: 예시문항 풀이(복수 방법)·수치 검산·개념 지도·**변형 축**(무엇이 바뀔 수 있나)·감점 포인트. 이 §4 변형 축이 생성기의 파라미터 목록이 된다.
2. **생성기**: 유형마다 `solveTn(params)`(문제문·풀이 단계·정답)와 `genTn(rng, opt)`(유효 파라미터 샘플링)와 `verifyTn(sol)`(수치 검산). 숫자가 "예쁘게" 나오도록 피타고라스 삼조 등 정수 구조를 파라미터화한다. 문장은 조사 도우미 `josa()`를 써서 받침을 맞춘다.
3. **고정 세트** `FIXED_SETS`(프린트용 10세트): `search`로 후보를 뽑아 하드코딩. 함정 변형(순서 바꿈·고정점 등)을 반드시 2세트 이상 넣는다.
4. **정본 md → 프린트 팩 → 앱** 순으로 생성. 앱은 바닐라·SVG·DOM(KaTeX·Canvas 없음), 탭 = 시작 / 원리 실험(드래그·단계 애니메이션) / 답안 틀(+빈칸 퀴즈) / 변형 드릴(종이에 풀고 답 입력 → 채점 → 풀이 점진 공개 → 복습함) / 전날 점검 / 🖨️ 프린트(앱 안에서 `renderPrintPack` 렌더링 + `window.print()` + 정적 파일 다운로드 링크).
5. **게이트** `sh gate.sh` 전부 통과 → `se-agent-app-reviewer`로 수학 정확성 검토(🔴 0) → 배포.
6. **배포**: 앱 → `high1/math/2sem_perf_<slug>.html`, 프린트 → `…_print.html`, `high1/math/index.html`의 `PERF` 배열에 카드 한 줄. 두 리포 커밋(private은 경로 지정 커밋).

## 다른 유형에 재사용할 때
- `core.js`에서 유형별 블록(`solveT1/genT1/verifyT1`, `T1_STORIES`, `TEMPLATES.t1` …)만 새 유형으로 교체한다. 분수 `F`·조사·`renderPrintPack`·앱 뼈대·`variants.mjs`·`cdp_smoke.mjs`는 그대로 쓴다.
- 앱의 원리 실험 탭은 유형에 맞는 SVG 인터랙션으로 다시 쓴다(드릴·답안 틀·프린트 탭은 데이터만 바뀐다).
