# 앱 개발 로드맵

## 완료 — 영어 앱

- [x] 영어 앱 설계 다이어그램 — [DESIGN.md](english_app/DESIGN.md) (Nick ↔ Claude 대화 형식)
- [x] vocab_app.html v0.1 — 95단어, 단어장/퀴즈/통계 탭, 6 클러스터, localStorage

## 완료 — 수학 앱

- [x] 오답노트 앱 포맷 v1 정의 (CLAUDE.md)
- [x] Q13~Q20 오답노트 .md + _app.html + _practice_app.html 생성
- [x] APP_PRINCIPLES.md — 문제 페이지 vs 풀이 페이지 원칙 정의
- [x] ADR-001 — 그래프 렌더링 라이브러리 선택 (SVG + JSXGraph)
- [x] Q16_app.html — JSXGraph 슬라이더(m), page-0 정적 SVG, lazy init
- [x] app-reviewer 에이전트 — 앱 품질 검토 자동화
- [x] `/math-figure` 스킬 — 그래프 Native 렌더링 스킬 정의
- [x] Q15_app.html — 3-panel 정적 SVG (page-0) + JSXGraph 이산 슬라이더 a,b (page-1)
- [x] Q19_app.html — page-0 정적 SVG + 두 JSXGraph 보드 (page-1: n 슬라이더, page-2: m 슬라이더)
- [x] Q20_app.html — page-0 이중근 개념 SVG + page-3 JSXGraph c 케이스 선택기 (c=−2/2/4)
- [x] Q18_app.html — page-1 아르강 평면 SVG (z₁=1+2i, 2+i 두 점)
- [x] math-error-note SKILL.md — math-figure 적극 사용 기준표 추가
- [x] math-practice SKILL.md — 시각화 규칙 (inline SVG) 추가

## 진행 중

- [ ] `/review-app` 스킬 등록 (app-reviewer 에이전트 트리거)

## 다음 단계 (우선순위 순)

1. **채점 결과 입력** — 아들 채점 후 틀린 문제 오답노트 활성화
2. **study.md 약점 태그 집계** — 누적 오답노트 분석
3. **app-reviewer 전체 실행** — Q15/Q18/Q19/Q20 APP_PRINCIPLES 검증
4. **영어 vocab_app v0.2** — 핵심 질문 답변 후 기능 확장 (외부 단어장, TTS 등)
5. **MCP 평가** — math-graph-mcp 필요성 재검토 (문제 10+ 이후)

## 기술 개선 검토 목록

- [ ] `/review-app Q{N}` 스킬 — app-reviewer 에이전트 자동 실행
- [ ] SVG 생성 자동화 — `/math-figure` 스킬에서 원문 읽고 SVG 생성
- [ ] JSXGraph lazy init 패턴 표준화 — 모든 app.html에 동일하게 적용
- [ ] practice_app.html JSXGraph 금지 lint — app-reviewer가 감지
