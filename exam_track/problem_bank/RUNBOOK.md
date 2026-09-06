# RUNBOOK — 단원 하나를 문항 세트로 만드는 절차

> **이 문서만 따라 하면 새 단원 세트가 나온다.** 매번 절차를 다시 만들지 않기 위해 고정했다.
> 규칙 정본 = [`PLAN.md` §2·§3](PLAN.md) · 게이트 이력 = [`REVIEW.md`](REVIEW.md)

---

## 0. 모델 선택 (2026-08-12 결정)

| 역할 | 권장 | 왜 |
|---|---|---|
| **출제**(main loop) | Sonnet xhigh 가능 | 품질이 아니라 **게이트 지적 건수**가 늘 뿐이다. 구조는 `check_bank`, 사실은 게이트, 배포는 `deploy.py`가 막는다 |
| **검증 게이트** | **Opus 권장** | 게이트는 **복수정답에 대한 유일한 방어선**이다. 기계 검사가 통과시킨 치명 2건(kh2_03)을 게이트만 잡았다 |

게이트만 따로 올리려면 Agent 호출에 `model: "opus"`를 준다. main loop가 Sonnet이어도 게이트는 Opus로 돈다.

> 실패의 성질이 이 결정의 근거다 — 게이트가 잡은 결함은 **사실 지식이 아니라 cross-checking**이었다(발문 창 ↔ 보기, why ↔ material, 12문항 사이 일관성, 보기 4개의 형태 비교). 주의의 폭이 필요한 자리다.

## 1. 근거 확보

```bash
# 단원앱의 탭 구성·정리표·인터랙션 데이터를 읽는다
python - <<'PY'
import re
s=open('subject_hub/<과목>/10_app/<앱>.html',encoding='utf-8').read()
print('탭:',[t[1] for t in re.findall(r'data-t="(\w+)">([^<]+)<',s)])
i=s.index('data-p="sum"'); print(re.sub(r'\|{2,}','|',re.sub(r'<[^>]+>','|',s[i:i+1800]))[:1200])
j=s.find('var THREE')
if j>0: print(s[j:s.index('function pickThree')])
PY
```

**출제 근거는 이 앱 하나다.** 앱에 없는 개념이 정답이 되면 문항을 깎지 말고 **앱을 채운다**(PLAN §3).

## 2. 유형·난이도 배분

과목별 유형은 `PLAN.md` §2 표를 따른다. **한국사 6유형을 복사하지 않는다.**

| 항목 | 기준 |
|---|---|
| 문항 수 | 12 |
| 난이도 | 중상 1 · 상 8 · 최상 3 |
| 유형 | 과목 행을 따르되 지배 원인이 실제로 나오게 |
| 정답 위치 | 셔플되므로 편중돼도 무방(게이트 확인 완료). 다만 몰지 않는 편이 낫다 |

## 3. 작성 — 반복해서 틀린 것부터 본다

`PLAN.md` §3의 규칙 표가 정본이다. **만들면서** 아래를 자문한다:

- 발문에 시기·범위 한정을 넣었나? → **모든 보기를 그 창에 대고 다시 읽는다**(치명 2건이 여기서 났다)
- C3를 붙였나? → why에 **혼동 쌍(A↔B)** 이 있나
- C4를 붙였나? → 그 낱말이 **사례에 실제로 있나**. `material`이 없으면 C4를 쓰지 않는다
- C5를 붙였나? → **산술이 틀린 것**인가. 정의 오해면 C2, 주어진 규칙을 못 쓴 것이면 C4
- 오답이 **자료를 부정하는 전제**를 깔고 있지 않나
- 보기 넷의 **길이·어투·문형**이 나란한가 (형태로 풀리면 안 된다)
- why가 **"그 보기를 고른 이유"** 인가 (해설이 아니라)
- 12문항이 서로 **모순되지 않나** (같은 개념을 다르게 설명하지 않았나)
- 가상 도표라면 **숫자가 실제와 떨어져 있나**

## 4. 등록 (3곳)

```
data/sets.js                → 세트 한 줄 ("verified": null 로 시작)
tools/sync_drill.py MAP     → 세트 id → 앱 폴더
topics.json canonical       → unit이 없으면 추가
```

## 5. 기계 검사 → 이식 → 렌더 확인

```bash
python exam_track/tools/check_bank.py <세트id>     # 위반 0이 될 때까지
python exam_track/tools/sync_drill.py --write      # 정본 → 앱 폴더 복사
python exam_track/tools/add_drill_tab.py --all     # 실전 탭 이식(멱등)
```

렌더 스모크 (화면을 볼 수 없으므로 최소 DOM으로 실제 실행한다):

```bash
node -e "
function mk(t){return{tagName:t,_h:'',style:{},set innerHTML(v){this._h=v},get innerHTML(){return this._h},appendChild(){},addEventListener(){},setAttribute(){},querySelector(){return null}}}
const el=mk('div');
global.document={readyState:'complete',getElementById:i=>i==='drill'?el:null,createElement:mk,addEventListener(){},head:{appendChild(){}}};
global.localStorage={_d:{},getItem(){return null},setItem(){},removeItem(){}};global.navigator={};global.window=global;
require(process.argv[1]);require(process.argv[2]);
const S=window.BANK_SET,h=el.innerHTML,it=S.items[0];
const ok=h.length>400&&h.includes(it.stem.slice(0,12))&&(h.match(/class=\"qopt\"/g)||[]).length===4&&!/\bC[1-8]\b/.test(h);
console.log((ok?'✅ ':'❌ ')+S.title+' · '+h.length+'B');process.exit(ok?0:1);
" \"\$PWD/subject_hub/<과목>/10_app/drill_<세트id>.js\" \"\$PWD/subject_hub/_shared/drill.js\"
```

확인 항목: 발문·보기 4개·번호가 렌더되고 **정답·원인코드·확신도가 노출되지 않을 것.**

## 6. 검증 게이트 — 프롬프트 템플릿

`Agent(subagent_type: "general-purpose", model: "opus")` 로 호출한다. **파일 수정 권한을 주지 않는다** — 리뷰어가 고치면 무엇이 왜 바뀌었는지 남지 않는다.

```
고1 <과목> 고난도 문제 세트의 **사실 검증**을 수행한다. 파일을 절대 수정하지 말고
**발견 사항만 보고**한다 (Read/Grep/WebSearch/WebFetch만, Write/Edit 금지).

## 검증 대상
<데이터 파일 절대경로> — <단원명> 12문항

## 먼저 읽을 것
- 출제 근거 학습앱: <앱 절대경로>
- 원인 코드: exam_track/_core/taxonomy/causes.json (<과목> 프로파일)
- **작성 규칙: exam_track/problem_bank/PLAN.md §2·§3** — 승격된 규칙 전부. 특히:
  · C3/C4 판별을 **양방향으로** 본다 (앵커 없는 C4 / 앵커가 있는데 C3로 낮춘 것)
  · C5는 산술이 틀린 것에만 / material 없는 개념 명제에 C4 금지
  · 오답이 자료를 부정하는 전제를 깔지 않는다
  · 가상 도표가 실제 통계와 겹치지 않는가 (연도까지 확인)
  · 정답 근거가 앱에 없으면 문항을 깎지 말고 앱을 채운다
  · **형태만으로 풀리는 문항 금지** — 보기 넷의 길이·어투·문형을 나란히
  · **세트 안에서 같은 개념을 다르게 설명하지 않는가**
  · ⚠️ **SVG 그래프가 있으면 좌표를 실제로 계산해 서술을 검증한다** — "그럴듯해 보임"으로 넘기지 않는다(11·13차: 점선 위치·곡선 합이 좌표 계산상 서술과 어긋나 복수정답 위험이 났다)
- 이력: exam_track/problem_bank/REVIEW.md

## 검증 항목
1. 정답키가 옳고 **유일**한가
2. 오답의 오류성 + **진단 가치** (자료·발문만 읽고 배제되는 보기가 있는가)
3. why·solve의 사실성, why가 "그 보기를 고른 이유"인가
4. <과목별 집중 항목 — 계산이면 전 과정 검산, 이론이면 원전 대조>
5. 도표가 있으면: 가상 표기·내부 정합·정답 뒷받침·현실과의 이격. **SVG 그래프면 좌표를 픽셀→값으로 환산해 직접 계산**(점선 위치, 곡선의 합·교차·단조성이 서술과 맞는지)
6. 교육과정 적합성 (앱에 없는 개념은 "앱을 채울 것"으로 권고)
7. cause 타당성 (C3의 혼동 쌍, C4 앵커의 실재성)
8. 발문 정합 — 부정형 뒤집힘, "가장 적절한"의 유일성, **복수정답 위험**
9. 절이 둘인 보기가 "앞 절 참 / 뒤 절 거짓" 구조이고 C1인가

## 보고 형식 (그대로)
## 판정: PASS / 수정필요 N건
### 치명 (정답키 오류·복수정답·명백한 사실오류)
- [문항id] 무엇이 틀렸나 → 근거 → 제안 수정문
### 보통 (why/solve 부정확·cause 부적절·진단 가치 없는 보기)
### 경미 (표현·서술 갈림 주의)
### 확인한 것 (문제 없음)

발견이 없으면 없다고 명확히 쓴다. 없는 문제를 만들어내지 말 것. 인사말 없이 위 형식만.
```

## 7. 반영 → 통과 표시 → 배포

게이트 보고를 **그대로 받아들이지 않는다.** 근거가 약하면 이유를 적고 남긴다(실제로 몇 건 반려했다).

```bash
# 반영 후 재검사
python exam_track/tools/check_bank.py <세트id>

# sets.js에 "verified": "YYYY-MM-DD" → 배포 차단 해제
python exam_track/tools/deploy.py --only <과목>          # dry-run
python exam_track/tools/deploy.py --only <과목> --write
cd /c/Nick/30_Apps/jwj-nick.github.io && git add high1/<폴더>/ && git commit && git push
```

**공개 저장소는 다른 프로젝트(중1)와 공유한다 — `high1/<폴더>/`만 스테이징한다.**

## 8. 기록

| 무엇 | 어디 |
|---|---|
| 게이트 결과·반영 내역 | `REVIEW.md` (회차별) |
| 반복된 실수 → 규칙 | `PLAN.md` §3 (승격) |
| 기계로 판정 가능해진 규칙 | `tools/check_bank.py` (세 번 재발하면 내린다) |
| 진행 상황 | `PLAN.md` §6 표 · `00_META/HANDOFF.md` |

## 8. 수학 세트 — 추가 절차 (2026-09-06)

수학은 위 절차에 **정답키 독립 재검산**이 한 단계 더 붙고, 범위(2022 개정)·원인 코드 규칙이 다르다. 정본은 스킬 `/se-math-drill-set`(`.claude/skills/se-math-drill-set/SKILL.md`)과 계획 `MATH_DRILL_PLAN.md`(대상 표·범위 표·원인 코드 규칙·모델 정책)이다.

```bash
node   exam_track/tools/verify_set.js <set>              # problem_bank/verify/<set>.js 로 12/12 재계산 — 게이트 전 필수
node   exam_track/tools/add_drill_fix.js <앱>.html        # DRILL_FIX 기본 매핑(개념 탭 자동) — add_drill_tab 뒤에
node   exam_track/tools/add_app_box.js <앱>.html <탭> b "<제목>" "<본문>"   # "앱에 근거 없음" 지적을 앱 쪽에서 해소
```
게이트는 Opus, 세트 2개당 1에이전트. 실측(20차, 4세트): 정답키 오류 0 — 결함은 why 경로·cause 배정·앱 근거 부재에 몰린다.

## 변경 이력
| 날짜 | 내용 |
|---|---|
| 2026-09-06 | §8 수학 세트 추가 절차 — 정답키 독립 재검산(`verify_set.js`)·DRILL_FIX·앱 박스 도구, 스킬 `/se-math-drill-set`, 계획 `MATH_DRILL_PLAN.md`. 20차(mat2_01~04) 실측 반영 |
| 2026-08-19 | §6 게이트 템플릿에 **보기 길이 대조**(정답=단독최장 비율·평균 갭)와 **순서배열 순열 집합 대조**(은행 전체와) 항목 추가(17차: 길이 휴리스틱 하나로 전 세트가 풀렸고, 순서배열 10/11문항이 동일 순열 집합이었다) |
| 2026-08-15 | §6 게이트 템플릿에 **SVG 그래프 좌표 검증** 항목 추가(11·13차: 좌표가 서술과 어긋나 복수정답 위험이 두 번 났다) |
| 2026-08-12 | 생성. 10세트 120문항을 만들며 굳어진 절차를 고정. 모델 선택 결정(출제 Sonnet 가능 / 게이트 Opus 권장) 포함 |
