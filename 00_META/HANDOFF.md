# HANDOFF — 작업 재개용 인수인계

> **이 문서 하나만 읽으면 이어서 일할 수 있어야 한다.** compact·세션 종료·시간 공백 뒤 여기서 시작한다.
> 설계 근거와 논의 원문은 [`LEARNING_DESIGN.md`](LEARNING_DESIGN.md)에 있다. 이 문서는 **지금 무엇을 할 차례인가**만 다룬다.
> 최종 갱신: 2026-07-28 · 커밋 `2476442` · 작업트리 클린 · 원격 동기

---

## 0. 한 줄 요약

아이 학습 시스템을 **흥미 / 내신** 두 갈래로 분리했고, 내신 갈래의 **파이프라인이 방금 완성되어 첫 문항 세트(한국사2 Ⅰ단원 12문항)가 나왔다.** 다음 차례는 **아이 피드백 확인 → 다음 단원 출제**다.

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
S1 구조 ✅ → S2 내신코어 ✅ → S4 리허설 ✅ → L1~L4 로컬 ✅ → [지금] 출제 사이클 → V Vercel(마지막)
```

| 단계 | 내용 | 상태 | 커밋 |
|---|---|---|---|
| S1 | NCC 2개 + 목적함수 계약 | ✅ | `fb75435` |
| S2 | 오답 taxonomy·약점DB·재출제 정책 + 스킬 2종 | ✅ | `4e204cf` `121d87a` |
| S4 | 리허설 — 수학 9건 투입, 결함 9개 발견·반영 | ✅ | `d5cb9fb` |
| L1·L3 | 재시험 앱 + 생성 스크립트 | ✅ | `a9b4e02` |
| L2·L4 | 채점 입력기(현재 미사용) + 고난도 문제은행 이관 | ✅ | `f733bd5` |
| — | **파이프라인 입력단 전환 + 한국사2 Ⅰ 12문항 + 풀이앱** | ✅ | `2476442` |
| **다음** | **아이 피드백 → 다음 단원 출제 반복** | 🟨 | |
| V | Vercel (쓰기 경로 + AI 튜터 + Tier2 배포) | ⬜ **마지막** | |

## 3. 시스템이 어떻게 도는가

```
① 출제              ② 풀이·자동채점         ③ 오답 기록            ④ 재출제
Claude가 단원별  →  아이가 bank.html에서  →  약점 DB(3축 태그)  →  retest.html
+ 보기별 원인코드     확신도까지 즉시 수집      원인 자동 진단          1·3·7·16·35일
```

**핵심 장치 = 보기별 원인 매핑.** 오답 보기마다 `cause` 코드를 심어둔다. 아이가 ③을 고르면 "틀렸다"가 아니라 **"C3 — 갑오개혁과 혼동"** 이 진단된다. 3축 태깅(내용×원인×확신도)의 원인 축이 이걸로 자동화된다.

**쓰기 경로는 아직 "복사 → 채팅"이다.** 앱이 결과 텍스트를 만들고, Nick이 채팅에 붙여넣으면 Claude가 DB에 기록한다. Vercel이 붙으면 자동화되지만 **UX는 그대로**다.

## 4. 확정된 결정 — 다시 묻지 않는다

| 결정 | 내용 |
|---|---|
| 두 갈래 분리 | 내신 `exam_track/` · 흥미 `subject_hub/`. 연결은 **단방향**(약점태그→개념앱). 공유는 인프라뿐 |
| 흥미 갈래 금지 | **시험·점수 이야기 금지** |
| 입력단 | 학교 시험지 채점 ❌ → **Claude 출제 문항** ✅ (2026-07-28 전환) |
| 시험 범위 | **기다리지 않는다.** 전 단원 순차 출제 (중간 다음엔 기말이 있다) |
| AI 인프라 | Vercel 서버리스 프록시 (BYO-key 탈락). 모델 **Claude Opus 5** |
| 배포 | Tier1 공개 Pages(URL 불변) / **Tier2 Vercel 비공개**(개인 데이터·정답 포함) |
| 확신도 | 앱에서 푸는 즉시 수집 |
| 제작 방법 | **Claude 직접 순차 제작.** 서브에이전트 대량쓰기 = 스트림 스톨(6/6 실패). 서브에이전트는 검증 전용 |
| Vercel 시점 | **마지막.** 로컬로 최대한 진행 후 |

## 5. 남은 작업 (우선순위 순)

| # | 작업 | 선행 조건 | 규모 |
|---|---|---|---|
| **1** | **아이 반응 확인 → 난이도·해설 톤 조정** | Nick 피드백 | 소 |
| **2** | 문제은행 **팩트 검증 게이트** (정답키 + 오답 근거) | Nick의 서브에이전트 호출 승인 | 소 |
| **3** | 결과 텍스트 → **약점 DB 기록** (첫 실사용) | 아이가 풀어야 함 | 소 |
| **4** | **다음 단원 출제** — 한국사2 Ⅱ·Ⅲ → 한국사1 → 통합사회 → 과학·수학 | 1·2 반영 후 | 대 (단원당 10~12문항) |
| **5** | 문제은행 **세트 선택 화면** (지금은 `kh2_01` 하드코딩) | 세트 2개 이상 | 소 |
| **6** | `se-retest-daily` 채점 반영 자동화 (지금은 Claude가 손으로 DB 수정) | — | 중 |
| **7** | 부모 주간 요약 (원인 분포·반복 오답·오개념) | 데이터 축적 | 중 |
| **8** | **V — Vercel**: 쓰기 경로(KV vs GitHub API) + AI 튜터(힌트 사다리·설명해보기) + Tier2 배포 | Nick의 Vercel 셋업 | 대 |

## 6. Nick 대기 항목

| 항목 | 왜 필요한가 |
|---|---|
| **아이가 12문항 풀어본 반응** | 다음 단원 출제의 난이도·톤 기준 |
| 결과 복사 텍스트 | 약점 DB 첫 실데이터 |
| 팩트 검증 게이트 실행 승인 | 서브에이전트 호출은 지시가 있을 때만 |
| (마지막) Vercel 계정·프로젝트 + API 키 | V 단계 착수 |

## 7. 열어보는 법

| 무엇 | 경로 |
|---|---|
| 시작 화면 | `C:\Kids\70_HighSchool\exam_track\app\index.html` |
| 문제은행 | `C:\Kids\70_HighSchool\exam_track\problem_bank\bank.html` |
| 오늘의 재시험 | `C:\Kids\70_HighSchool\exam_track\app\retest.html` |
| 채점 입력기(미사용) | `C:\Kids\70_HighSchool\exam_track\app\grade.html` |

브라우저로 **파일 직접 열기**가 된다(데이터가 `<script src>`라 `file://`에서도 동작).
폰으로 볼 때만 로컬 서버: `python -m http.server 8000` (repo 루트에서) → `http://<PC-IP>:8000/exam_track/app/`

## 8. 명령어

```bash
# 오늘의 재시험 생성 (약점 DB → app/data.js + _core/retest/daily/<날짜>.md)
python exam_track/tools/build_retest.py            # 또는 ... 2026-08-12

# 학교 시험지 문항 목록 추출 (학기 바뀔 때만, 현재 미사용 경로)
python exam_track/tools/build_grade.py

# 앱 검증 (커밋 전 필수)
node --check <추출한 인라인 JS>     # 또는 아래 스캐너
```

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
│   ├─ problem_bank/        PLAN.md · bank.html · data/kh2_01.js
│   ├─ tools/               build_retest.py · build_grade.py
│   ├─ 26_High_1-1/         1학기 (02_text 5과목 109문항, 수학 오답노트 9) — 출제 참고자료
│   └─ 2607_High1_Final/    비어 있음
└─ subject_hub/             ★ 흥미 NCC — 단원 학습앱 (전 과목 배포 완료)
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
| bash `cd` 후 경로 | 셸 cwd가 유지된다. 스크립트는 `cd /c/Kids/70_HighSchool &&` 로 시작할 것 |

## 변경 이력
| 날짜 | 내용 |
|---|---|
| 2026-07-28 | 생성. S1~L4 + 입력단 전환·파일럿 완료 시점 기준. 남은 작업 8건·Nick 대기 4건 정리 |
