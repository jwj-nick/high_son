# HANDOFF — 작업 재개용 인수인계

> **이 문서 하나만 읽으면 이어서 일할 수 있어야 한다.** compact·세션 종료·시간 공백 뒤 여기서 시작한다.
> 설계 근거와 논의 원문은 [`LEARNING_DESIGN.md`](LEARNING_DESIGN.md)에 있다. 이 문서는 **지금 무엇을 할 차례인가**만 다룬다.
> 최종 갱신: 2026-08-10 (라운드 4 개편 반영) · 작업트리 클린 · 원격 동기

---

## 0. 한 줄 요약

**2026-08-10 라운드 4에서 계획이 바뀌었다.** 내신을 별도 앱·별도 배포로 두던 것을 접고, **심화·시험 준비를 기존 단원앱의 `⚡실전` 탭으로 통합**한다. Vercel/AI 튜터는 보류하고 **Claude Code 세션 키트**로 대체한다. 근거·원문 = [`LEARNING_DESIGN.md` 라운드 4](LEARNING_DESIGN.md).

지금은 **파일럿(한국사2 Ⅱ단원 실전 탭)이 나온 시점**이고, 다음 차례는 **Nick의 톤 확인 → 공개 배포 → 세션 키트 1개**다.

## 1. 재개하면 먼저 할 것

```
1) git pull --rebase            (원격 동기 확인)
2) 아래 §5 "남은 작업" 1번부터
3) Nick이 아이 반응/결과를 줬으면 그게 최우선 — §6 참조
```

**Nick에게 물어보기 전에 이 문서와 `LEARNING_DESIGN.md`를 먼저 읽는다.** 이미 결정된 것을 다시 묻지 않는다(§4).

---

## 2. 지금 서 있는 위치

```
S1~S4 ✅ → L1~L4 ✅ → 출제·검증 ✅ → 재시험 인출 ✅ → **R4 개편** → [지금] 실전탭 파일럿 → 배포 → 세션키트 → 사회2·과학2
```

| 단계 | 내용 | 상태 | 커밋 |
|---|---|---|---|
| S1 | NCC 2개 + 목적함수 계약 | ✅ | `fb75435` |
| S2 | 오답 taxonomy·약점DB·재출제 정책 + 스킬 2종 | ✅ | `4e204cf` `121d87a` |
| S4 | 리허설 — 수학 9건 투입, 결함 9개 발견·반영 | ✅ | `d5cb9fb` |
| L1·L3 | 재시험 앱 + 생성 스크립트 | ✅ | `a9b4e02` |
| L2·L4 | 채점 입력기(현재 미사용) + 고난도 문제은행 이관 | ✅ | `f733bd5` |
| — | **파이프라인 입력단 전환 + 한국사2 Ⅰ 12문항 + 풀이앱** | ✅ | `2476442` |
| — | 인수인계 문서 | ✅ | `04cdc61` |
| — | **한국사2 Ⅱ 12문항 + 세트 레지스트리·선택 화면** | ✅ | |
| — | 재시험 인출 경로(`bank.html?only=`) + 사다리 전진 | ✅ | `d8b18c3` |
| **R4** | **계획 개편** — 실전 탭 통합 · Vercel 보류 · 세션 키트 | ✅ 기록 | |
| **지금** | **실전 탭 파일럿(kh2_colonial) → Nick 톤 확인** | 🟨 | |
| ~~V~~ | ~~Vercel · AI 튜터~~ | **R4 보류** | |

## 3. 시스템이 어떻게 도는가

```
① 출제              ② 풀이·자동채점         ③ 오답 기록            ④ 재출제
Claude가 단원별  →  아이가 bank.html에서  →  ingest_result.py   →  retest.html
+ 보기별 원인코드     확신도까지 즉시 수집      → 약점 DB(3축)         1·3·7·16·35일
                     결과 텍스트 복사          원인·일정 자동 산정         │
                            ▲                                          │
                            └──────  같은 앱에서 그 문항을 다시 푼다  ◀──┘
                                     bank.html?set=a,b&only=q1,q2,…
```

**④가 ②로 돌아온다.** 재시험은 링크만 주지 않고 **그 문항을 실제로 다시 낸다** — 인출이 간격 반복의 전부이고, 링크만 주면 다시 '읽기'가 된다. 맞히면 사다리가 한 칸 올라가고(1→3→7→16→35일), 2연속 정답 + 3칸 이상이면 `mastered`. 또 틀리면 0칸으로 돌아간다.

**핵심 장치 = 보기별 원인 매핑.** 오답 보기마다 `cause` 코드를 심어둔다. 아이가 ③을 고르면 "틀렸다"가 아니라 **"C3 — 갑오개혁과 혼동"** 이 진단된다. 3축 태깅(내용×원인×확신도)의 원인 축이 이걸로 자동화된다.

**쓰기 경로는 아직 "복사 → 채팅"이다.** 앱이 결과 텍스트를 만들고, Nick이 채팅에 붙여넣으면 Claude가 DB에 기록한다. Vercel이 붙으면 자동화되지만 **UX는 그대로**다.

## 4. 확정된 결정 — 다시 묻지 않는다

| 결정 | 내용 | |
|---|---|---|
| **통합** | 심화·시험 준비 = 기존 단원앱의 **`⚡실전` 탭**. 별도 앱·별도 배포 없음 | R4 |
| **분리되는 것은 하나뿐** | **아이의 약점 데이터**. 문항·정답·해설은 공개해도 된다(풀이기록은 localStorage) | R4 |
| **AI 튜터** | Vercel 보류 → **Claude Code 세션 키트**(과목별 폴더를 아이 PC로) | R4 |
| **재시험** | **브라우저 자율**(localStorage JS 스케줄러). 아빠 경유는 주 1회 백업 | R4 |
| **수학·국어·영어** | 문항 대량생산 ❌ → 핵심지식 + 대표문제 + 세션 컨텍스트. 국어·영어는 단원앱 없음 | R4 |
| **시험 범위** | 확보 불가 → **각 과목 앞부분부터 순차** | R4 |
| 입력단 | 학교 시험지 채점 ❌ → **Claude 출제 문항** ✅ | 07-28 |
| 확신도 | 앱에서 푸는 즉시 4버튼 | R3 |
| 제작 방법 | **Claude 직접 순차 제작.** 서브에이전트 대량쓰기 = 스트림 스톨(6/6). 서브에이전트는 **검증 전용** | — |
| 검증 | 새 세트는 **반드시 검증 게이트**. 기계 검사는 복수정답을 못 잡는다(실측) | 08-04 |

## 5. 남은 작업 (R4 개편 반영)

| # | 작업 | 선행 | 규모 |
|---|---|---|---|
| **1** | **실전 탭 파일럿 톤 확인** → 한국사2 나머지 2단원 이식 | **Nick 확인** | 소 |
| **2** | **공개 배포** — 아이가 폰에서 사용 시작 | 1 | 소 |
| **3** | **세션 키트 1개**(한국사2) → 형태 확인 후 템플릿 확정 | **Nick 확인** | 중 |
| **4** | **통합사회2** 5단원 — 앞부분부터 순차 출제·검증·이식 | — | 대 |
| **5** | **통합과학2** 9단원 — 앞부분부터 순차 | — | 대 |
| **6** | 수학2·국어2·영어2 **세션 키트**(핵심지식+대표문제, 문항 대량생산 안 함) | 3 | 중 |
| **7** | **재시험 브라우저 자율화** — localStorage 기반 JS 스케줄러(확정 18) | 2 | 중 |
| **8** | 부모 주간 요약 | 데이터 축적 | 중 |
| ~~V~~ | ~~Vercel · AI 튜터~~ | **R4에서 보류** — 세션 키트로 대체 | — |

## 6. Nick 대기 항목

| 항목 | 왜 필요한가 |
|---|---|
| **실전 탭 파일럿 톤 확인** | 맞으면 나머지 31개 단원앱에 같은 형태로 반복한다. 뒤집으면 비싸다 |
| **세션 키트 첫 형태 확인** | 아이 눈높이(`00_START.md`)가 여기서 정해진다 |
| 공개 배포 승인 | 공개 repo에 올리는 일 |
| 아이가 풀어본 반응·결과 텍스트 | 난이도 기준 + 약점 DB 첫 실데이터 |
| (나오면) 2학기 중간 범위 | 우선순위 조정용. 없어도 앞부분부터 진행 |

## 7. 열어보는 법

| 무엇 | 경로 |
|---|---|
| ⭐ **실전 탭 파일럿** | `C:\Kids\70_HighSchool\subject_hub\한국사2\10_app\kh2_colonial.html` → **⚡ 실전** 탭 |
| 내신 시작 화면(구 경로) | `C:\Kids\70_HighSchool\exam_track\app\index.html` |
| 문제은행 — 세트 고르기 | `C:\Kids\70_HighSchool\exam_track\problem_bank\index.html` |
| 문제은행 — 바로 풀기 | `…\problem_bank\bank.html?set=kh2_01` (또는 `kh2_02`) |
| 오늘의 재시험 | `C:\Kids\70_HighSchool\exam_track\app\retest.html` |
| 채점 입력기(미사용) | `C:\Kids\70_HighSchool\exam_track\app\grade.html` |

브라우저로 **파일 직접 열기**가 된다(데이터가 `<script src>`라 `file://`에서도 동작).
폰으로 볼 때만 로컬 서버: `python -m http.server 8000` (repo 루트에서) → `http://<PC-IP>:8000/exam_track/app/`

## 8. 명령어

```bash
# ① 아이가 보낸 결과 텍스트 → 약점 DB 반영
#    두 형식 다 받는다: 문제은행/재시험(bank.html) · 수동 재시험(retest.html)
#    틀림→등록·사다리 0 / 찍맞→learning / 맞음→사다리 +1 (조건 채우면 mastered)
python exam_track/tools/ingest_result.py result.txt --dry-run   # 먼저 확인
python exam_track/tools/ingest_result.py result.txt             # 반영

# ② 오늘의 재시험 생성 (약점 DB → app/data.js + _core/retest/daily/<날짜>.md)
python exam_track/tools/build_retest.py            # 또는 ... 2026-08-12

# 학교 시험지 문항 목록 추출 (학기 바뀔 때만, 현재 미사용 경로)
python exam_track/tools/build_grade.py

# 문제은행 세트 기계 검사 (커밋 전 필수)
python exam_track/tools/check_bank.py          # 또는 ... kh2_03

# 심화 문항·드릴 엔진을 단원앱 폴더로 동기화 (정본 = problem_bank/data/)
python exam_track/tools/sync_drill.py            # 검사만
python exam_track/tools/sync_drill.py --write    # 복사

# 앱(HTML) 검증
node --check <추출한 인라인 JS>     # 또는 아래 스캐너
```

⚠️ **기계 검사는 정답키·복수정답을 못 잡는다.** 실측으로 확인됐다 — kh2_03의 치명 2건(복수정답)은 스키마·문법을 전부 통과했다. 새 세트는 **반드시 검증 게이트(에이전트)를 통과시킨다.** 절차·프롬프트는 [`problem_bank/REVIEW.md`](../exam_track/problem_bank/REVIEW.md).

검증 스캐너 (인라인 JS 문법 + `<한글` 잘림 + 태그 균형):
```python
import re,subprocess,tempfile,os
h=open(PATH,encoding='utf-8').read()
js='\n'.join(re.findall(r'<script>(.*?)</script>',h,re.S))
tmp=os.path.join(tempfile.gettempdir(),'c.js');open(tmp,'w',encoding='utf-8').write(js)
r=subprocess.run(['node','--check',tmp],capture_output=True,text=True)
bad=[h[i:i+16] for i,c in enumerate(h) if c=='<' and i+1<len(h) and ('가'<=h[i+1]<='힣')]
print('NODE','OK' if r.returncode==0 else r.stderr,'| 잘림',len(bad),'| div',h.count('<div'),h.count('</div>'))
```

## 9. 파일 지도

```
70_HighSchool/                     [git: jwj-nick/high_son, private]
├─ 00_META/
│   ├─ LEARNING_DESIGN.md   ⭐ 설계 SSOT (논의 원문 전문 보존)
│   └─ HANDOFF.md           ⭐ 이 문서
├─ .claude/skills/          공통 스킬 (se-error-note, se-retest-daily, se-math-*, …)
├─ exam_track/              ★ 내신 NCC
│   ├─ CLAUDE.md            목적함수·성공지표·파이프라인·금지사항
│   ├─ _core/               학기 중립 자산 (3년 누적)
│   │   ├─ taxonomy/        causes.json(C1~C8·확신도) · topics.json(통제 어휘)
│   │   ├─ weakness_db/     entries.json ← 약점 누적 (현재 9건, 수학 리허설)
│   │   ├─ retest/          policy.json · daily/
│   │   └─ REHEARSAL_S4.md  리허설 결함 9건 기록
│   ├─ app/                 index · bank진입 · retest · grade · data.js(생성물)
│   ├─ problem_bank/        PLAN.md(작성규칙) · REVIEW.md(검증이력) · index.html · bank.html?set=
│   │   └─ data/            sets.js(레지스트리) · kh2_01 · kh2_02 · kh2_03
│   ├─ tools/               check_bank.py · ingest_result.py · sync_drill.py
│   │                       build_retest.py · build_grade.py
│   ├─ 26_High_1-1/         1학기 (02_text 5과목 109문항, 수학 오답노트 9) — 출제 참고자료
│   └─ 2607_High1_Final/    비어 있음
└─ subject_hub/             ★ 단원 학습앱 32개 (개념 + ⚡실전 통합)
    ├─ _shared/drill.js     ⭐ 실전 탭 공용 엔진 (정본)
    ├─ 한국사2/10_app/       kh2_*.html + drill.js·drill_kh2_*.js (sync_drill 복사본)
    └─ 통합사회2 5 · 통합과학2 9 · 공통수학2 7 · 한국사1 4 · 통합사회1 4 · 통합과학1 14 · 공통수학1 6
```

**공개 배포 repo는 별도:** `C:\Nick\30_Apps\jwj-nick.github.io` → `jwj-nick.github.io/high1/` (Tier1, URL 불변)

## 10. 함정 — 반복하지 말 것

| 함정 | 실측 |
|---|---|
| 서브에이전트로 대용량 단일파일 쓰기 | API 스트림 스톨, **6/6 전부 실패**. 직접 순차 제작할 것 |
| 채점 결과를 사람이 입력하게 설계 | 5과목 `todo.md`에 **3개월간 방치**. 그래서 입력단을 자작 문항으로 바꿨다 |
| 태그 자유 생성 | 9건에 28태그, 집계 불가. `topics.json` canonical만 쓸 것 |
| 교차 배열을 그리디로 | 막판 topic 충돌을 못 품. **되추적 탐색** 사용(`build_retest.py`) |
| 재시험 화면에 원인·정답 노출 | 인출이 재인이 된다. 답하기 전엔 절대 표시 금지 |
| 정답 보기에 `cause` 붙이기 | 정답 역추적 누출. 검증 스크립트가 잡는다 |
| 브라우저 스크린샷 시도 | 확장프로그램이 `file://`·localhost 차단. 육안 확인은 Nick에게 위임 |
| 발문에 시기 한정을 넣고 보기를 다시 안 봄 | **복수정답**이 된다. kh2_03에서 2건. 기계 검사는 통과시킨다 |
| 편한 대비쌍을 여러 문항에 복사 | "간선↔직선(1987)"이 1952 발췌 개헌을 지우고 세트 내부 모순을 만들었다 |
| 진단 품질을 기계로 검사하려 함 | C3 혼동쌍 키워드 검사 = **28건 전부 오탐.** 뜻이 아니라 키워드에 맞춰 쓰게 된다 |
| bash `cd` 후 경로 | 셸 cwd가 유지된다. 스크립트는 `cd /c/Kids/70_HighSchool &&` 로 시작할 것 |

## 변경 이력
| 날짜 | 내용 |
|---|---|
| 2026-08-10 | **라운드 4 개편 반영.** 실전 탭 통합·Vercel 보류·세션 키트·범위 순차. `_shared/drill.js` 공용 엔진 + `sync_drill.py` 신설, **kh2_colonial 파일럿** |
| 2026-08-09 | **재시험 인출 경로 완성(§5-6).** `bank.html?set=a,b&only=…` 재시험 모드 — 여러 세트에서 정한 순서 그대로 다시 낸다. `ingest_result.py`가 **맞음도 받아 사다리를 전진**시키고 mastered까지 간다(수동 재시험 텍스트도 파싱). 실측 결함 1건 수정 — 문제은행은 한 세트=한 단원이라 topic 교차가 원리적으로 불가능해, **교차 축을 출처별로 분리**(시험=topic / 문제은행=문항유형, `policy.json`) |
| 2026-08-04 | **kh2_03 2차 게이트 — 치명 2건(복수정답) 포함 15건 반영.** 기계 검사를 `tools/check_bank.py`로 고정. 교훈 5건 승격. 36문항 전량 검증 완료 |
| 2026-08-04 | **한국사2 Ⅲ `kh2_03` 12문항 → 한국사2 3/3 완료(36문항).** 검증 게이트에서 나온 교훈 8건을 `PLAN.md` 작성 규칙으로 승격해 적용 — 원인 코드가 C1~C8 여섯 종으로 퍼졌다 |
| 2026-08-04 | **`tools/ingest_result.py` 신설** — 결과 텍스트를 파싱해 약점 DB에 반영(신규/재오답/학습대기 판정, 확신도×원인으로 첫 due 산정). bank.html 결과 텍스트에 **고른 보기 번호** 추가 — 같은 원인 코드를 쓰는 보기가 여럿일 때 되짚기 위해. 문제은행 두 세트 **사실 검증 게이트 실행** |
| 2026-07-29 | 한국사2 Ⅱ단원 `kh2_02` 12문항 출제. 세트 레지스트리(`data/sets.js`)·선택 화면 도입 → **§5-5 완료**. `topics.json` 한국사1/2 분리 + `한국사:일제강점기` 추가 |
| 2026-07-28 | 생성. S1~L4 + 입력단 전환·파일럿 완료 시점 기준. 남은 작업 8건·Nick 대기 4건 정리 |
