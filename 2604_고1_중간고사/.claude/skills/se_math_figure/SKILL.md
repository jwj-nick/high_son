# /se_math_figure — 수학 그래프 Native 렌더링 스킬

## 언제 사용하나

`/se_math_figure Q16` 처럼 호출. 오답노트 app.html의 `<img>` 캡쳐를 **Native HTML 인터랙티브 그래프**로 교체.

- **정적 그림** (좌표, 점, 선만 필요): Pure SVG 생성
- **탐구형** (슬라이더로 파라미터 변화 관찰): JSXGraph 인터랙티브 보드 생성

## APP_PRINCIPLES 적용 규칙 ⭐

> 전체 원칙: [APP_PRINCIPLES.md](../../../APP_PRINCIPLES.md)

| 페이지 | 그림 형식 | 금지 사항 |
|---|---|---|
| **page-0 (문제)** | **정적 SVG** | JSXGraph 보드, 슬라이더, 좌표 수치 눈금 |
| **page-1~N (풀이)** | **JSXGraph (lazy init)** | 해당 단계 이전에 도출되지 않은 정보 표시 |

**page-0 SVG 원칙**:
- 좌표 수치 레이블 없음 (O, A, B... 라벨만)
- m=1 등 대표값의 정적 위치로 고정
- 원본 시험지 구도와 레이블 일치

**JSXGraph lazy init 패턴** (page-0 금지, page-1 이후):
```javascript
let _boardInit = false;
function goTo(n) {
  // ...기존 코드...
  if (n === 1 && !_boardInit) { initBoard(); _boardInit = true; }
}
```

---

## 사용 라이브러리

**JSXGraph** (인터랙티브 기본)
```html
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/jsxgraph/1.11.1/jsxgraph.min.css">
<script src="https://cdnjs.cloudflare.com/ajax/libs/jsxgraph/1.11.1/jsxgraphcore.min.js"></script>
```
- CDN 캐시 후 오프라인 가능 · MIT 라이선스 · 250KB · 슬라이더/애니메이션 지원

## 호출 시 수행 절차

1. `10_오답노트/Q{N}*.md` 와 `02_text/` 해당 문제 읽기
2. 판단:
   - 파라미터(m, a 등)가 변화하며 도형/넓이가 변하는 문제 → **JSXGraph + 슬라이더**
   - 좌표에 고정 점/선만 필요 → **Pure SVG**
3. `Q{N}_app.html` 수정:
   - `<head>`에 JSXGraph CDN 추가 (KaTeX 뒤)
   - Page-0 문제 섹션의 `<img>` 또는 텍스트 설명 앞에 보드 `<div>` 삽입
   - `<script>` 내 `init{Q}Board()` 함수 추가
   - `DOMContentLoaded` 핸들러에 호출 추가
4. `Q{N}_practice_app.html` 확인:
   - "Q{N}의 설정에서" 참조 문제는 소형 정적 SVG로 처리 (인터랙티브 불필요)

## JSXGraph 코드 템플릿 (슬라이더형)

```javascript
function initQNBoard(){
  var brd = JXG.JSXGraph.initBoard('qN-board',{
    boundingbox:[xmin, ymax, xmax, ymin],   // [xmin, ymax, xmax, ymin]
    axis:true, grid:false,
    showNavigation:false, showCopyright:false,
    keepaspectratio:false
  });

  // 함수 그래프
  brd.create('functiongraph',[function(x){return /* f(x) */;],
    {strokeColor:'#4361EE',strokeWidth:2.5});

  // 고정 점
  brd.create('point',[x0,y0],{name:'라벨',fixed:true,size:4,
    strokeColor:'#1e1b4b',fillColor:'#1e1b4b'});

  // 슬라이더: [[x1,y1],[x2,y2],[min,init,max]]
  var sl = brd.create('slider',[[xs1,ys],[xs2,ys],[min,init,max]],{
    name:'m', snapWidth:0.05,
    baseline:{strokeColor:'#c7d2fe',strokeWidth:4},
    highline:{strokeColor:'#4361EE',strokeWidth:4}
  });

  // 동적 점 (슬라이더 의존)
  var ptB = brd.create('point',[
    function(){var m=sl.Value(); return /* x(m) */;},
    function(){var m=sl.Value(); return /* y(m) */;}
  ],{name:'B',color:'#ef4444',size:5});

  // 삼각형 (polygon)
  brd.create('polygon',[ptB, pt0, ptD],{
    fillColor:'#ef4444',fillOpacity:0.15,
    borders:{strokeColor:'#ef4444',strokeWidth:1.5}
  });

  // 동적 텍스트
  brd.create('text',[xt,yt,function(){
    var m=sl.Value();
    return '값: '+( /* f(m) */ ).toFixed(2);
  }],{fontSize:12,color:'#374151',anchorX:'left'});
}
```

## HTML 삽입 위치

```html
<!-- Page-0 문제 섹션 내 -->
<div id="qN-board" style="width:100%;max-width:480px;height:300px;
     margin:0 auto 16px;border-radius:12px;overflow:hidden;"></div>
```

## 문제 유형별 파라미터 설계 가이드

| 문제 패턴 | 슬라이더 변수 | 동적 요소 |
|---|---|---|
| 직선 기울기 m → 교점 B, C 이동 | m ∈ [min,max] | B, C 좌표, 삼각형 넓이 텍스트 |
| 이차함수 계수 a → 판별식 변화 | a ∈ [min,max] | 판별식 D=b²-4ac, 교점 존재 여부 |
| 인수 c → 분해 형태 변화 | c ∈ {정수 후보} | 각 항의 계수 |

## 완성된 구현 사례

- `Q16_app.html` — JSXGraph 슬라이더(m), B/C/D/E 점, S₁/S₂ 삼각형, 실시간 값 표시
