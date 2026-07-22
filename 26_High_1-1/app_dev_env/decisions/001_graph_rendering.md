# ADR-001: 수학 그래프 렌더링 라이브러리 선택

> 날짜: 2026-05-01  
> 상태: 결정됨

## 맥락

오답노트 앱(Qnn_app.html)에서 수학 그래프를 원본 `<img>` 캡쳐 대신 native HTML로 표현하려 함.  
요구 사항: 고1 수학 수준 (포물선, 직선, 삼각형, 슬라이더 파라미터 탐구).

## 검토한 옵션

| 라이브러리 | 크기 | 오프라인 | 슬라이더 | API 복잡도 | 결론 |
|---|---|---|---|---|---|
| Pure SVG | 0 | ✅ | ✗ | 낮음 | 문제 페이지용 |
| JSXGraph | ~250KB | CDN캐시후✅ | ✅ | 중간 | 풀이 페이지용 |
| Desmos API | ~500KB | ✗ | ✅ | 낮음 | 탈락 (인터넷 필수) |
| GeoGebra | ~2MB | ✗ | ✅ | 높음 | 탈락 (무거움) |
| D3+function-plot | ~400KB | CDN캐시후✅ | △ | 높음 | 탈락 |

## 결정

**문제 페이지(page-0): Inline SVG**
- 원본 시험지 그림과 동일한 정적 구도
- 좌표 수치 없음, 레이블만 표시
- 의존성 0

**풀이 페이지(page-1~N): JSXGraph**
- 슬라이더로 파라미터 m 변화 탐구
- lazy init (div가 hidden일 때 초기화하면 렌더링 실패)
- CDN: `https://cdnjs.cloudflare.com/ajax/libs/jsxgraph/1.11.1/jsxgraphcore.min.js`

## 첫 구현: Q16_app.html

- page-0: Inline SVG (포물선, O/A/B/C/D/E 레이블, S₁/S₂ 삼각형)
- page-1: JSXGraph 슬라이더 (m ∈ [0.5, 1.5]), B/C 동적 이동, 실시간 S₁/S₂ 표시

## 향후 계획

- `/math-figure` 스킬이 이 결정을 자동으로 적용
- MCP 서버 검토: `math_graph(fn, points, slider)` → JSXGraph 코드 생성
  → [mcp/math-graph-mcp.md](../mcp/math-graph-mcp.md) 참조
