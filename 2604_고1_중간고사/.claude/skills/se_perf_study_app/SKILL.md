---
name: se_perf_study_app
description: 계산·분석형 수행평가용 "통합 학습 앱" 생성기. 과목·주제·공지를 받아 개념(애니메이션)·공식카드(단위)·이론깊이(유도)·몸풀기·도전문제(점진공개)·실전점검을 갖춘 단일 HTML 학습 앱을 만든다. 과학_2 물체의 운동(perf3_motion) 패턴 일반화. step형(보고서)·person형(인물)과 구분 — 이건 "데이터로 계산·분석하는 시험" 대비용.
---

# se_perf_study_app — 계산·분석형 수행평가 통합 학습 앱

## 언제 쓰나 (다른 perf 스킬과 구분)
| 스킬 | 수행평가 성격 | 산출물 |
|---|---|---|
| **se_perf_study_app** (이것) | **데이터로 계산·분석** (과학 운동/화학량, 수학 활용) | 단일 통합 학습 앱 (개념+연습+점진풀이) |
| se_perf_eval_step | 보고서/논술 다단계 작성 | step별 양식 가이드 앱 |
| se_perf_eval_person | 역사·사회 인물 | 가이드·모범·심화 3앱 |

→ "교실에서 주어진 수치로 풀고 과정을 서술"하는 시험이면 **이 스킬**.

## 호출 형식
```
/se_perf_study_app <과목> "<주제>"
예: /se_perf_study_app 과학 "물체의 운동"
    /se_perf_study_app 수학 "함수의 활용"
```

## 입력 → 출력
| 입력 | 사용처 |
|---|---|
| 과목 | 배포 폴더(`high1/<subject>/`), 색 테마 |
| 주제 | 앱 제목, 파일명(`1sem_perf_<topic>.html`) |
| 공지 .md (자동 탐색) | 평가요소·일정·배점 |
| `02_text/`·`0606_` 정본 (있으면) | 콘텐츠 원천 |

**출력**: `수행평가-<과목>_<n>/10_app/perf<n>_<topic>.html` → 배포본 `high1/<subject>/1sem_perf_<topic>.html`

---

## 실행 절차

### 1단계: 데이터 소스 확보 (★단방향)
```
공지.md  → 평가요소·일정 파악
   ▼
02_text/개념정리.md   (단위·의미·유도·오개념)   ← 없으면 먼저 생성/요청
02_text/문제뱅크.md   (몸풀기 + 도전, 단계별 풀이)
0606_*.md            (이론 심화·계획, 선택)
   ▼
앱은 위 정본을 "옮긴다". 앱에서 즉흥 창작·추측 금지.
```
- 콘텐츠 정확성이 생명 → 정본 .md를 먼저 만들고 거기서 합성.
- 교과서/시험지 캡쳐가 있으면 실전 수치로 도전문제 보정. 없으면 표준 커리큘럼 기준 + "표준 제작" 명시.

### 2단계: 탭 골격 (주제에 맞게 가감)
```
📋 개요        — 일정·배점·평가요소 + "왜 배우나" 의미부여 hook
🌍 개념탭 ×N    — 핵심 개념별 1탭. Canvas 애니/시뮬 + 단위 배지 + 💬비유 + 과학자/깜짝사실
📐 공식카드     — 모든 공식에 [단위 배지] + 의미 + 단위 검산
📖 이론깊이     — 공식별 [왜 이 식?] 토글(직관→적분 다리) + 보조 그래프
🔥 몸풀기       — 쉬운 개념확인 (즉시 정답 토글)
⏱️ 도전문제     — 문제 먼저 + 타이머 + 계산 코칭 → [풀이 보기] 단계별 점진 공개
✅ 실전점검     — 시험장 전략 + 자가 체크리스트 + 약점 태그
```

### 3단계: HTML 생성 — 기술 체크리스트 ⚠️ (실전에서 깨진 것들)
아래는 **반드시** 지킨다. (과학_2에서 실제 버그로 겪음)

1. **Canvas DPR**: 너비·높이 **둘 다** `devicePixelRatio`로 스케일. logical height는 `dataset.h`에 1회 캐시. → §스니펫 `setupCanvas`.
2. **Canvas lazy init**: 캔버스 초기화는 **탭이 보여진 뒤** 호출 (숨은 탭은 `clientWidth=0`). → §스니펫 탭 핸들러.
3. **resize 핸들러**: 화면 회전 시 활성 탭 sim 재init.
4. **KaTeX**:
   - `$...$` 안에 **한글 금지**(깨짐) → 한글은 밖으로, 불가피하면 `\text{}`.
   - 곱셈·점은 `\times`·`\cdot` (유니코드 `×`·`·` 지양).
   - 로더 `throwOnError:false`.
5. **점진적 공개** (APP_PRINCIPLES): 문제 먼저, 풀이는 토글+아코디언.
6. **단위 배지 + 의미**: 모든 공식에. 유도는 직관→`[나중: 적분]` 다리, 단순화해도 틀린 말 금지.
7. **흔한 실수**: 말로만 X → **예시문제 → ❌오답 → ✅정답 → SVG 그림** 풀세트.
8. **모바일/터치**: 버튼 `min-height:44px`, 가로 스크롤 탭, 반응형 표.

### 4단계: 검증 → 배포
1. 인라인 `<script>` 추출 → `node --check`.
2. KaTeX 한글-수식 스캔 (정규식 `\$([^$\n]+)\$` 중 한글 포함, `\text{` 제외).
3. `cp` → `high1/<subject>/1sem_perf_<topic>.html`, `index.html` 카드 추가(영어 파일명).
4. **두 리포 push**: public(`jwj-nick.github.io`) + private(`high_son`).
5. `se_agent_app_reviewer`로 개념 정확성 + APP_PRINCIPLES 검토.

### 5단계: todo/study 갱신
- `todo.md` 체크, `study.md §약점 태그` 추가. 보류 항목(교과서 사진 등) 명시.

---

## §스니펫 — 검증된 정식 코드 (그대로 재사용)

### Canvas 헬퍼 (DPR 버그 수정본)
```js
function setupCanvas(cv){
  const dpr=window.devicePixelRatio||1;
  if(!cv.dataset.h) cv.dataset.h = cv.getAttribute('height') || '300'; // logical height 1회 캐시
  const h=parseInt(cv.dataset.h,10);
  const w=cv.clientWidth||cv.parentElement.clientWidth||320;
  cv.style.width='100%'; cv.style.height=h+'px';
  cv.width=Math.round(w*dpr);
  cv.height=Math.round(h*dpr);          // ← 높이도 dpr! (이걸 빼면 모바일에서 잘림)
  const ctx=cv.getContext('2d'); ctx.setTransform(dpr,0,0,dpr,0,0);
  return {ctx,w,h};                     // draw()는 logical w,h 사용
}
```

### 탭 전환 + lazy init + resize
```js
document.getElementById('tabs').addEventListener('click',e=>{
  const b=e.target.closest('.tab'); if(!b)return;
  document.querySelectorAll('.tab').forEach(t=>t.classList.remove('active'));
  document.querySelectorAll('.page').forEach(p=>p.classList.remove('active'));
  b.classList.add('active');
  document.querySelector(`.page[data-p="${b.dataset.t}"]`).classList.add('active');
  window.scrollTo({top:0,behavior:'smooth'});
  initSimsFor(b.dataset.t);             // 탭이 보여진 뒤 캔버스 init
});
let _rt; window.addEventListener('resize',()=>{clearTimeout(_rt);_rt=setTimeout(()=>{
  const a=document.querySelector('.tab.active'); if(a) initSimsFor(a.dataset.t);
},250);});
```

### KaTeX 로더
```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.css">
<script defer src="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.js"></script>
<script defer src="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/contrib/auto-render.min.js"
  onload="renderMathInElement(document.body,{delimiters:[{left:'$$',right:'$$',display:true},{left:'$',right:'$',display:false}],throwOnError:false})"></script>
```

### 검증 명령
```bash
# JS 문법
python -c "import re;h=open('app.html',encoding='utf-8').read();open('_c.js','w',encoding='utf-8').write(re.findall(r'<script>(.*?)</script>',h,re.S)[-1])" && node --check _c.js && rm _c.js
```

---

## 레퍼런스 구현
- `수행평가-과학_2/10_app/perf3_motion.html` (9탭 완성본)
- `수행평가-과학_2/CLAUDE.md` (폴더 규약·주의사항)
- 콘텐츠 정본: `수행평가-과학_2/02_text/`, `0606_*.md`
