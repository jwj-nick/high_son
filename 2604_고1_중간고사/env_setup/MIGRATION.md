# MIGRATION.md — 새 컴퓨터에서 Claude Code 환경 복원

> 이 파일은 `high_son` private repo에 포함된다.  
> 새 기기에서 동일한 작업 환경을 복원하기 위한 단계별 가이드.

---

## 1. 필수 설치

```powershell
# 1) Claude Code CLI
npm install -g @anthropic/claude-code
# 또는 최신 설치 방법: https://docs.anthropic.com/en/claude-code

# 2) Git + gh CLI  (scoop 권장)
scoop install git
scoop install gh
gh auth login   # GitHub 인증

# 3) Python + Pillow  (시험지 그림 crop 용)
# Python 3.x 설치 후:
pip install pillow

# 4) Node.js  (필요시 — anthropic_skilljar_study 빌드용)
scoop install nodejs
```

---

## 2. 디렉토리 구조 & Git Clone

```
C:\
├── Kids\
│   └── 70_HighSchool\          ← high_son repo (private) 클론 위치
└── Nick\
    └── 30_Apps\
        └── jwj-nick.github.io\ ← public 포털 repo 클론 위치
```

```powershell
# high_son (아들 학교 자료 — private)
mkdir C:\Kids\70_HighSchool
cd C:\Kids\70_HighSchool
git clone https://github.com/jwj-nick/high_son .

# Nick's Apps 포털 (public — 앱 배포 대상)
mkdir C:\Nick\30_Apps
cd C:\Nick\30_Apps
git clone https://github.com/jwj-nick/jwj-nick.github.io

# study-quiz (Nick 스터디용 퀴즈 앱)
git clone https://github.com/jwj-nick/study-quiz
```

> **경로 불일치 시**: `settings.local.json`의 `additionalDirectories` 경로 수정 필요 (§4 참조)

---

## 3. 글로벌 Claude 설정 복원  (`~/.claude/`)

새 기기에는 `~/.claude/` 이하 파일이 없다. 아래 내용을 직접 생성.

### 3-1. `~/.claude/CLAUDE.md`

```markdown
@MEMORY.md
```

### 3-2. `~/.claude/MEMORY.md`

아래 내용 전체를 붙여넣기:

```markdown
# Memory

## About Nick
- **배경:** RTL Engineer, 20년+ Video Codec IP HW 설계, team/project lead, customer facing
- **거주:** 서울
- **현재 회사:** AI 활용 HW/Document 워크플로우 프로젝트 진행 중
- **목표:** AI HW(NPU) 분야 — 회사 내 새 역할 또는 이직 모두 고려

## AI 스타일 선호
- 짧고 명료한 답변
- 적절한 질문과 개선 방향 제안 **적극 환영**
- 높은 수준 기술 토론 선호 (나는 20년 RTL 엔지니어)

## 스터디 우선순위 (2026-03 기준)
| Priority | Study | Topic | 목표 | 일정 |
|---|---|---|---|---|
| 🔴 HIGH | 30_HW_Study | NVDLA + DL 통합 8주 | NPU Architect 수준 | 2026-05-02 |
| 🟡 MEDIUM | 10_AL_Study | microGPT (Karpathy) | CS AI M.S. 수준 | 2026-03-15 |
| 🟡 MEDIUM | 05_CS_Study | MIT Missing Semester 2026 | CLI/Shell/Git 숙련 | 진행 중 |
| 🔴 HIGH | 20_UVM_Study | UVM A-to-Z 10주 | 면접+현업 검증 역량 | 진행 중 |
| 🟢 ACTIVE | 50_APP_Study | SW 생태계 + 앱 개발 | 배포/서비스 체득 | 진행 중 |

## 현재 활성 작업
- **30_HW_Study/NVDLA Phase 1B:** 8주 통합 커리큘럼 (3/10~5/2)
  - **교재:** 밑바닥부터 시작하는 딥러닝 (O'Reilly 한국어판)
  - Nick DL 수준: 오버뷰만 있고 세부/수학 약함
- **05_CS_Study:** MIT Missing Semester — 병렬 진행 중
- **20_UVM_Study:** 10주 커리큘럼 진행 중

## Public 프로젝트 (30_Apps)
- **study-quiz**: https://jwj-nick.github.io/study-quiz/
- **uvm-drill**: https://jwj-nick.github.io/uvm-drill/
- **high1 (아들)**: https://jwj-nick.github.io/high1/  ← private source: high_son

## 환경
- OS: Windows (MINGW64 bash / PowerShell)
- Apps dir: `C:/Nick/30_Apps/` (각 앱별 별도 git repo)
- gh CLI: scoop 설치 (`gh`)
- jq 미설치 → JSON 파싱은 Python 사용

## Claude 환경 — 등록된 Global Skills
| 명령 | 용도 |
|---|---|
| `/quiz-publish [topic]` | 스터디 → 퀴즈 JSON 생성 → study-quiz에 push |
| `/study-log` | 오늘 공부한 내용 00_META에 저장 |
| `/memory-sync` | MEMORY.md 업데이트 |
| `/figcrop` | 시험지 jpg에서 그림 crop → .md 삽입 |
```

### 3-3. 글로벌 commands (skills) 파일

경로: `~/.claude/commands/`

| 파일 | 내용 위치 |
|---|---|
| `memory-sync.md` | 아래 §3-3-A |
| `quiz-publish.md` | 아래 §3-3-B |
| `study-log.md` | 아래 §3-3-C |
| `figcrop.md` | 아래 §3-3-D |

#### §3-3-A `memory-sync.md`
```
MEMORY.md를 최신 상태로 업데이트합니다.

1. `C:/Users/<USERNAME>/.claude/MEMORY.md`를 읽습니다.
2. 현재 대화 컨텍스트에서 기억할 만한 업데이트를 찾습니다:
   - 새로운 결정사항, 스터디 진행 상태 변화
   - 추가/변경된 skills/tools, 우선순위 변경
3. 변경이 필요한 항목을 구체적으로 제안합니다.
4. 확인 후 파일을 업데이트합니다.

$ARGUMENTS
```

#### §3-3-B `quiz-publish.md`
원본 파일: `C:\Users\admin\.claude\commands\quiz-publish.md`  
→ 새 기기 경로로 복사 후, 내부 경로(`C:/Nick/30_Apps/study-quiz/` 등) 확인.

#### §3-3-C `study-log.md`
원본 파일: `C:\Users\admin\.claude\commands\study-log.md`  
→ 새 기기 경로로 복사.

#### §3-3-D `figcrop.md`
원본 파일: `C:\Users\admin\.claude\commands\figcrop.md`  
→ 새 기기 경로로 복사.

> **팁**: 기존 기기에서 `~/.claude/commands/` 폴더 전체를 압축해 옮기는 게 가장 빠름.

---

## 4. 프로젝트 settings.local.json 확인

`C:\Kids\70_HighSchool\2604_고1_중간고사\.claude\settings.local.json` 은 이미 repo에 포함.  
단, `additionalDirectories` 경로가 현재 기기와 다르면 수정:

```json
"additionalDirectories": [
  "C:\\Kids\\70_HighSchool",
  "C:\\Nick\\30_Apps\\jwj-nick.github.io\\high1",
  "C:\\Nick\\30_Apps\\jwj-nick.github.io"
]
```

`C:\Nick\` 구조가 없으면 실제 경로로 변경.

---

## 5. 현재 프로젝트 상태 (2026-05-09 기준)

### Kids 프로젝트 (`high_son` repo)

| 과목 | 텍스트 변환 | 오답노트 | 앱 배포 |
|---|---|---|---|
| 공통수학1 | ✅ 완료 | ✅ Q13~Q20 완료 | ✅ high1/math |
| 공통영어1 | ✅ 완료 | ⏳ 미착수 | — |
| 공통국어1 | 🟡 1차 (OCR 보정 필요) | ⏳ 미착수 | — |
| 공통과학1 | 🟡 1차 (그림 보정 필요) | ⏳ 미착수 | ✅ high1/science |
| 한국사1 | 🟡 1차 (사료 보정 필요) | ⏳ 미착수 | — |

### 배포된 앱
- https://jwj-nick.github.io/high1/ — 고1 허브
  - `/science/` — 원자모형 + 화학결합 수행평가 앱
  - `/math/` — 수학 오답노트 Q13~Q20 앱

### 수행평가 현황
- **과학**: ✅ 앱 완성·배포
- **사회**: 연습 Step1 진행 중 (메가시티 다큐 활용)
- **수학/국어/한국사**: 세준이와 방향 논의 필요

### 다음 pending 작업
1. 세준이 GitHub 계정 연동 + 앱 접근 확인
2. app-reviewer 에이전트로 기존 앱 검토
3. 영어 오답노트 앱 아이디어 구체화
4. 수행평가 — 수학(학자 선택), 국어(책 선정), 한국사 준비

---

## 6. 로컬 미리보기 서버

```bash
cd C:/Nick/30_Apps/jwj-nick.github.io
python -m http.server 8787
# 데스크탑: http://localhost:8787/high1/
# 모바일:   http://192.168.XXX.XXX:8787/high1/  (같은 WiFi, ipconfig로 IP 확인)
```

---

## 7. 변경 이력

| 날짜 | 내용 |
|---|---|
| 2026-05-09 | 초안 — high1 앱 배포 완료 시점, 기기 이전 대비 |
