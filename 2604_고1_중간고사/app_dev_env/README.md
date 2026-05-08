# app_dev_env — 앱 개발 환경 관리

> 이 디렉토리는 오답노트 앱 생태계의 **기술·아키텍처·MCP·스킬 설계**를 전문적으로 다룹니다.  
> 특정 과목/문제와 무관한, 개발 환경 자체에 대한 논의와 문서를 누적합니다.

---

## 목적

- 앱 개발 방법론, 라이브러리 선택, 기술 트레이드오프 기록
- 스킬/에이전트 설계 결정사항 아카이빙
- MCP 서버 구성 및 외부 연결 계획
- 향후 개선 로드맵 관리

---

## 디렉토리 구조

```
app_dev_env/
├── README.md              ← 이 파일
├── decisions/             ← 기술 결정 기록 (ADR 스타일)
│   └── 001_graph_rendering.md   ← 그래프 렌더링 라이브러리 선택
├── mcp/                   ← MCP 서버 계획 및 구성
│   └── math-graph-mcp.md        ← 수학 그래프 MCP 서버 계획
├── skills/                ← 스킬 설계 문서 (실제 스킬은 .claude/skills/)
│   └── skill_design_log.md
└── roadmap.md             ← 개선 로드맵
```

---

## 현재 앱 스택 (2026-05-01 기준)

| 역할 | 선택 | 이유 |
|---|---|---|
| 수식 렌더링 | KaTeX CDN | 빠름, 오프라인 캐시 후 동작 |
| 인터랙티브 그래프 | JSXGraph CDN | 경량(250KB), MIT, 오프라인 가능 |
| 정적 그래프 | Inline SVG | 의존성 0, 문제 페이지에 적합 |
| 스타일 | Vanilla CSS | 빌드 불필요, 앱별 독립 |
| MCP | 미구성 | 계획 중 (math-graph-mcp) |

---

## 핵심 설계 원칙 링크

- [APP_PRINCIPLES.md](../APP_PRINCIPLES.md) — 앱 UX 설계 원칙 (문제 페이지 vs 풀이 페이지)
- [CLAUDE.md](../CLAUDE.md) — 전체 프로젝트 워크플로우
