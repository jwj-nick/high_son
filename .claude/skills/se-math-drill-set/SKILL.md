---
name: se-math-drill-set
description: 수학 단원 학습앱 하나에 "⚡ 실전" 점검 세트(12문항, 보기별 원인 코드)를 만들어 검산·게이트·배포까지 끝낸다. 호출 예 — "/se-math-drill-set mat2_logic", "명제 단원 점검 세트 만들어" (2026-09-05 mat2_01~04 절차를 고정한 것)
---

# se-math-drill-set — 수학 점검 세트 한 단원 끝내기

> **한 단원 = 세트 하나(12문항) = 이 스킬 한 번.** 절차를 다시 만들지 않는다.
> 계획·범위·모델 정책 = [`exam_track/problem_bank/MATH_DRILL_PLAN.md`](../../../exam_track/problem_bank/MATH_DRILL_PLAN.md) · 문항 규칙 = `exam_track/problem_bank/PLAN.md` §2·§3 · 공통 절차 = `RUNBOOK.md` · 첫 실측 = `REVIEW.md` 20차.
> 세트 id는 `mat1_NN`(공통수학1) / `mat2_NN`(공통수학2). 앱과 세트의 대응은 MATH_DRILL_PLAN §1 표를 따른다.

## 인자

```
/se-math-drill-set mat2_logic            # 앱 파일명(확장자 없이). 세트 id는 PLAN §1 표에서 찾는다
/se-math-drill-set mat2_logic mat2_05    # 세트 id 명시
"명제 단원 점검 세트 만들어"               # 자연어도 동일
```

## 0. 시작 전에 읽는 것 (5분)

1. `MATH_DRILL_PLAN.md` §1(대상 표에서 이 단원의 행)·§2(2022 개정 범위 — **범위 밖 항목을 문항에 넣지 않는다**)·§4(원인 코드 규칙).
2. 학습앱 `subject_hub/<과목>/10_app/<앱>.html`의 개념 탭·정리 탭 본문. **정답 근거는 이 앱 안에 있어야 한다.** 없으면 문항을 깎지 말고 앱에 박스를 채운다(§5).
3. `exam_track/problem_bank/data/mat2_02.js`를 형식 견본으로 한 번 훑는다(헤더 주석·material·why 문체).

## 1. 출제 — `exam_track/problem_bank/data/<set>.js`

- 12문항. **점검 티어**: 중상 3~4 · 상 6~8 · 최상 2. 유형은 `유형판별`(material 필수) · `조건함정` · `계산` · `복합` (`그래프해석`은 실제 그래프·표 material이 있을 때만).
- 4지선다. 정답 보기에는 `cause`·`why`를 붙이지 않는다. 오답 3개는 **서로 다른 원인**으로, 각각 why에 적힌 실수 경로로 **실제로 그 값이 나오는지** 숫자를 먼저 낸다(REVIEW 20차 치명 2건이 여기서 났다).
- 원인 코드: C4(도구 판별 실패, material 있는 문항만) · C1(조건·구할 것 놓침, 끝점 포함, 순서) · C5(산술·부호 **실행** 실수 — 정의 오해면 C2) · C3(혼동 쌍 `(A ↔ B)` 명시 — 내분↔중점, 평행↔수직, x축↔y축, ∈↔⊂ 등) · C2(공식·규칙 부재). **C5를 문항마다 1개씩 채우지 않는다.** 같은 오류는 세트 안·세트 간에 같은 코드로.
- 문구: 수식은 유니코드(x², √, −, ≤, ∈, ⊂, ᶜ), 부등호는 `&lt;` `&gt;`(innerHTML 삽입). `<`+알파벳·한글 금지. 보기 넷의 길이·형식을 나란히(정답만 두 식이면 형태 단서).
- `solve.key`에 풀이 전 과정 + 검산 한 줄, `solve.trap`에 실점 지점과 습관 한 줄. 시험·점수·등수 문구는 쓰지 않는다.
- 헤더 주석에 취지·범위 판단(무엇을 빼고 왜)을 남긴다.
- ⚠️ **단원 번호는 앱의 배지를 먼저 읽고 그대로 쓴다.** `grep -o 'Ⅰ\.[^<"]*\|Ⅱ\.[^<"]*' <앱>.html | head -1`. drill.js가 세트 제목을 헤딩으로 찍으므로 어긋나면 한 화면에 두 번호가 같이 보인다(24차까지 4회 재발).
- ⚠️ **오답 값은 하나씩 숫자를 내 본다.** 21~24차의 치명 11건이 전부 "why에 적힌 경로로 그 값이 나오지 않음"이었다. `verify_set.js`는 정답키만 보므로 이 층은 출제자만 막을 수 있다.

## 2. 검산 파일 — `exam_track/problem_bank/verify/<set>.js` (필수)

```js
module.exports = function ({ S, chk, dist, near, solveLinear2, subsets, has, gcd, lcm }) {
  chk(1, '10', 'dist=' + dist([-2, 3], [4, -5]));   // 문항 번호(1-based), 정답 보기 문구, 근거
  …                                                  // 12문항 전부. 안 하면 "미검산"으로 실패
};
```
- 정답을 **문항 텍스트와 다른 경로**로 계산한다(공식 ↔ 대입, 해석 ↔ 수치 탐색, 집합은 brute force). 오답 보기의 경로도 근거에 찍어 두면 게이트가 빨라진다.
- 실행: `node exam_track/tools/verify_set.js <set>` → 12/12 PASS 전에는 다음으로 안 간다.

## 3. 등록·기계 검사·이식

```bash
# 등록 3곳: data/sets.js(한 줄, "verified": null) · tools/sync_drill.py MAP · topics.json canonical(공통수학1·2 목록은 이미 있음 — 기존 이름 사용)
python exam_track/tools/check_bank.py <set>                       # 위반 0
python exam_track/tools/sync_drill.py --write                     # 정본 → 앱 폴더 drill_<set>.js (+ drill.js)
python exam_track/tools/add_drill_tab.py subject_hub/<과목>/10_app/<앱>.html <set>   # ⚡ 실전 탭·페이지·목차 카드·스크립트
node   exam_track/tools/add_drill_fix.js subject_hub/<과목>/10_app/<앱>.html          # DRILL_FIX 기본 매핑(개념 탭 자동), 필요하면 JSON 지정
sed -i 's#<div class="td">심화 12문제</div>#<div class="td">점검 12문제</div>#' <앱>.html   # 목차 카드 문구
node   subject_hub/_shared/app_check.js <앱>.html --links subject_hub/<과목>/10_app   # 태그 균형·잘림
```
렌더 스모크(RUNBOOK §5의 node 한 줄) + 헤드리스 스크린샷 `<앱>.html#drill`(창폭 500)로 첫 문항·보기 4개 확인.

## 4. 검증 게이트 — Opus, 세트 2개당 에이전트 1개, 보고만

`Agent(subagent_type: "general-purpose", model: "opus")`. RUNBOOK §6 템플릿에 **수학 항목**을 넣는다:
- 전 문항 손계산으로 정답 유일성 / 오답 보기가 why의 경로로 실제 그 값에 닿는가 / solve.key 계산 오류
- cause: C3 쌍 실재 · C4는 material + "도구 선택 실패"인가 · C5는 실행 실수인가 · 세트 간 같은 오류 같은 코드
- **2022 개정 공통수학1·2 범위**(MATH_DRILL_PLAN §2) 밖 근거가 있는가 · 학습앱에 없는 개념이 정답 근거인가
- innerHTML 안전(`<`+알파벳) · 보기 형태 단서
보고 형식은 RUNBOOK §6 그대로(치명/보통/경미/확인한 것). 실측(20차): 세트 2개에 ~11분, 17만 토큰.

## 5. 반영

- 치명·보통은 반영, 경미는 판단해 REVIEW에 이유를 남긴다. **"앱에 근거 없음"은 문항이 아니라 앱을 고친다**:
  `node exam_track/tools/add_app_box.js <앱>.html <탭> <g|b|a> "<제목>" "<본문>"` (KaTeX `$…$`, 부등호 `\lt`). 스크린샷으로 렌더 확인.
- 데이터를 고쳤으면 `verify_set` → `check_bank` → `sync_drill --write` 를 다시 돈다.

## 6. 배포 → 기록

```bash
# sets.js "verified": "YYYY-MM-DD"  → 배포 차단 해제
python exam_track/tools/deploy.py --only <과목> --write            # high1/math/ 로 복사(dry-run 먼저)
cd /c/Nick/30_Apps/jwj-nick.github.io && git add high1/math/<바뀐 파일들만> && git commit && git push   # ⚠️ 파일 단위 add (다른 작업 공존)
curl -s -o /dev/null -w '%{http_code}' https://jwj-nick.github.io/high1/math/drill_<set>.js
```
기록 4곳: `REVIEW.md`(N차 섹션 + 이력 행) · `MATH_DRILL_PLAN.md` §1 상태 · `00_META/HANDOFF.md` 초점 문단 · `subject_hub/<과목>/PLAN.md` 이력. 커밋 트레일러는 세션 규약대로.

## 모델

| 단계 | 모델 | 이유 |
|---|---|---|
| 출제 + 검산 파일 | **Opus**(또는 현 세션의 Fable) | 오답 경로의 산술·코드 배정이 품질의 전부다. Sonnet은 게이트 사이클이 한 번 더 든다 |
| 등록·이식·배포·기록 | Sonnet 가능 | 도구가 전부 있어 기계적이다 |
| 검증 게이트 | **Opus 필수** | 20차에서 34건 전부 유효 지적. 앱 리뷰용 Sonnet은 딥링크 경합을 놓친 전례 |
| 앱 박스·UI 렌더 확인 | Sonnet | 스크린샷 판독 수준 |

## 하지 않는 것
- 범위 밖 개념(외분점·두 원의 위치 관계·y=−x 대칭·`MATH_DRILL_PLAN` §2의 제외 항목)을 정답 근거로 쓰지 않는다.
- 결과 전송·아빠 보고 UI를 만들지 않는다(FLOW V2). 앱 화면에 시험·점수 문구를 넣지 않는다.
- 게이트 보고를 그대로 받아쓰지 않는다 — 근거가 약하면 반려하고 이유를 REVIEW에 남긴다.
