# APP_HOSTING.md — 앱 배포 & 인덱싱 원칙

> 이 파일은 Kids 프로젝트의 앱 개발·배포 원칙을 누적한다.
> 새 배포/디자인 결정이 생기면 이 파일을 업데이트한다.
> 향후 `C:\Kids\` 루트로 이동 예정 (과목·학년 공통 적용).

---

## 1. 배포 구조

```
jwj-nick.github.io/          ← 공개 repo (Nick's Apps 포털)
├── index.html               ← 동적 앱 목록 (EXTRA_APPS 수동 등록)
└── high1/                   ← 고1 앱 허브
    ├── index.html           ← 아이콘 2개만 (Subject_학년_학기)
    ├── science/
    │   ├── index.html
    │   └── {prefix}_{topic}.html
    └── math/
        ├── index.html
        └── {prefix}_{topic}.html

github.com/jwj-nick/high_son  ← private repo
  → C:\Kids\70_HighSchool\    ← 로컬 매핑 루트
```

**원칙**: 원본 시험지·오답노트는 private repo 보관. **앱 HTML 파일만** public `jwj-nick.github.io`에 복사·배포.

---

## 2. 파일 & 디렉토리 명명 규칙

- **영어만 사용** (한글 파일명 → URL 인코딩 문제)
- **디렉토리**: `high1`, `science`, `math` 등 짧고 명료하게
- **파일 prefix 패턴**: `{N}sem_{type}_{topic}.html`

| 타입 | prefix | 예시 |
|---|---|---|
| 수행평가 | `1sem_perf_` | `1sem_perf_atom_model.html` |
| 중간고사 오답노트 | `1sem_mid_` | `1sem_mid_Q12_poly_div.html` |
| 기말고사 오답노트 | `1sem_fin_` | `1sem_fin_Q05_trig.html` |
| 연습문제 | `_practice` suffix | `1sem_mid_Q12_poly_div_practice.html` |

---

## 3. Index 계층 구조

```
Nick's Apps (/)
  └── high1 (고1 허브)           ← EXTRA_APPS에 수동 등록
        ├── Science_1_1          ← subject index
        │     └── [leaf apps]
        └── Math_1_1
              └── [leaf apps]
```

**규칙**:
- `Nick's Apps`는 GitHub API 자동 + `EXTRA_APPS` 수동 병행
- `high1/index.html`은 과목 아이콘(🔬📐)만 표시 — leaf 목록 없음
- Subject index는 카드 그리드
- **모든 leaf page**: 상단 breadcrumb nav 필수 (`고1 › Science_1_1`)

### breadcrumb 삽입 스크립트 (일괄 처리)
```python
import os, re
NAV = '<nav style="background:#f8fafc;border-bottom:1px solid #e2e8f0;padding:7px 16px;font-size:12px;display:flex;align-items:center;gap:5px"><a href="../index.html" style="color:#6b7280;text-decoration:none">고1</a><span style="color:#d1d5db">&rsaquo;</span><a href="index.html" style="color:#2563eb;text-decoration:none;font-weight:600">{LABEL}</a></nav>\n'
# re.sub(r'(<body[^>]*>)', r'\g<1>\n' + NAV, html, count=1)
```

---

## 4. Mobile / Desktop 대응 원칙

### 4-1. 신규 앱 작성 시 체크리스트
- [ ] `<meta name="viewport" content="width=device-width, initial-scale=1.0">` 필수
- [ ] 고정 width(px) 레이아웃 금지 → `max-width` + `%` 또는 `grid auto-fill` 사용
- [ ] 버튼·탭 최소 44px 터치 타겟
- [ ] `@media (max-width: 640px)` 모바일 분기 작성
- [ ] **배포 전 로컬에서 반드시 모바일 실기기 테스트**

### 4-2. Sidebar 레이아웃 앱 (과학 앱 패턴)
기존 sidebar(고정 width) 앱을 모바일에 대응할 때:

**❌ CSS만으로 horizontal tabs — 신뢰도 낮음**  
**✅ 모바일에서 `<select>` 드롭다운으로 교체 — 권장**

```html
<!-- HTML: header 바로 아래 -->
<select id="mob-sel" onchange="sel(this.value)"></select>

<!-- CSS -->
#mob-sel { display: none }
@media screen and (max-width: 640px) {
  #sidebar  { display: none !important }
  #mob-sel  { display: block !important; width:100%; padding:10px 14px;
              font-size:15px; border:none; border-bottom:2px solid #e2e8f0;
              background:#fff; outline:none }
}
```

```js
// JS: buildSidebar() 직전에 정의
function buildMobSel() {
  const el = document.getElementById('mob-sel'); if (!el) return;
  // 각 앱의 데이터 배열(S/E 등)로 <optgroup>+<option> 생성
  el.innerHTML = groups.map(g => `<optgroup label="${g.label}">
    ${items.map(x => `<option value="${x.id}"${x.id===curId?' selected':''}>${x.name}</option>`).join('')}
  </optgroup>`).join('');
}
// renderStudy() 안에서: buildSidebar(); buildMobSel();
```

### 4-3. 로컬 미리보기
```bash
cd C:/Nick/30_Apps/jwj-nick.github.io
python -m http.server 8787
# 데스크탑: http://localhost:8787/high1/
# 모바일:   http://192.168.123.105:8787/high1/   (같은 WiFi)
```

---

## 5. Nick's Apps 포털에 새 앱 등록

`C:\Nick\30_Apps\jwj-nick.github.io\index.html` → `EXTRA_APPS` 배열에 추가:

```js
{
  name: 'high1',
  description: '고1 학습 앱 — 수행평가(과학) + 중간고사 오답노트(수학)',
  url: 'https://jwj-nick.github.io/high1/',
  repoUrl: 'https://github.com/jwj-nick/high_son',
  updated: 'YYYY-MM-DDT00:00:00Z',
},
```

---

## 6. 배포 워크플로우 (신규 앱 추가)

```
1. 앱 HTML 작성 (private repo 내)
2. Mobile 테스트 → select dropdown 패턴 적용
3. jwj-nick.github.io/high1/{subject}/ 에 복사 (영문 파일명)
4. subject index.html 카드 추가
5. leaf 파일에 breadcrumb nav 삽입 (Python 일괄 스크립트)
6. 로컬 서버에서 desktop + mobile 확인
7. git add → commit → push
8. (필요시) Nick's Apps EXTRA_APPS 업데이트 → push
```

---

## 변경 이력

| 날짜 | 내용 |
|---|---|
| 2026-05-09 | 초안 작성 — high1 배포 경험 기반 (과학 수행평가 2개 + 수학 오답노트 18개) |
