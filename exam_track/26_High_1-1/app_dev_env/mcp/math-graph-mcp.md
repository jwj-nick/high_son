# MCP 계획: math-graph-mcp

> 상태: 검토 중 (미구현)  
> 관련 결정: [ADR-001](../decisions/001_graph_rendering.md)

## 목적

수학 함수/점/슬라이더 명세를 받아 JSXGraph 임베드 코드 또는 SVG를 반환하는 MCP 도구.  
현재는 Claude가 직접 코드 생성. 규모가 커지거나 자동화 파이프라인이 필요할 때 MCP로 전환.

## 도구 명세 (가안)

### `math_graph_jsxgraph`
- **입력**: 
  ```json
  {
    "functions": [{"expr": "0.5*x^2 - 2*x", "color": "#4361EE"}],
    "fixed_points": [{"x": 0, "y": 0, "label": "O"}, {"x": 4, "y": 0, "label": "A"}],
    "slider": {"name": "m", "min": 0.5, "init": 1, "max": 1.5},
    "dynamic_points": [
      {"name": "B", "x": "2*m+4", "y": "2*m*m+4*m", "color": "#ef4444"},
      {"name": "C", "x": "2*m", "y": "2*m*m-4*m", "color": "#22c55e"}
    ],
    "polygons": [
      {"points": ["B","O","D"], "fill": "#ef4444", "label": "S₂"},
      {"points": ["A","E","C"], "fill": "#22c55e", "label": "S₁"}
    ],
    "boundingbox": [-1.5, 12.5, 8.5, -4]
  }
  ```
- **출력**: 완성된 JSXGraph `<script>` 블록

### `math_graph_svg`
- **입력**: 함수, 점, 선 명세 + 뷰박스 크기
- **출력**: Inline SVG 문자열 (문제 페이지용 정적)

## 구현 옵션

**Option A: Node.js MCP 서버 (로컬)**
- `@modelcontextprotocol/sdk` 사용
- JSXGraph 코드 템플릿 기반 생성
- 약 200줄

**Option B: Claude 직접 생성 (현재 방식)**
- 별도 서버 불필요
- `/math-figure` 스킬 + Claude의 코드 생성 능력
- 충분히 작동 중

## 전환 기준

Claude 직접 생성이 오류율 높아지거나, 동일 유형 문제가 10+ 쌓이면 MCP 서버 구현 검토.
