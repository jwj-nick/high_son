# todo — 한국사1 수행평가 (D-day 6/15)

## 진행 상태
- [x] 디렉토리 구조 생성 (01_capture/figs, 02_text, 10_app, cht_log)
- [x] 공지 정리 (`2026_한국사1_수행공지.md`)
- [x] 용어 정본 28개 작성 (`02_text/용어정본.md`)
- [x] PLAN.md 작성

## 캡쳐 / 검증
- [x] (Nick) 자습서 캡쳐 16장 → `01_capture/book_self_study/`
- [x] 자습서 텍스트화 4묶음 (`02_text/자습서_01~04`)
- [x] 자습서 대조로 용어 28→38 확정 (누락 용어 10개 보강)
- [ ] (Nick 판단) 교과서 캡쳐 — **자습서로 범위 충분, 선택사항** (아래 study.md 판단 참조)
- [ ] (교과서 받으면) 톈진/거중조정 등 일부 표기 최종 확인

## 앱 빌드
- [x] 앱 v1→v2: 6탭 + 용어 38개 + **다크/라이트 토글** `10_app/perf_korhist2.html`
- [x] 공개 배포 + git push → **라이브** https://jwj-nick.github.io/high1/korean/1sem_perf_modern_terms.html
- [x] 검증: live HTTP 200, node --check OK, 새 용어·테마 마커 확인
- [ ] (선택) 자료4 지도·자료 사진 figcrop → 플래시카드 시각 보강
- [ ] (선택) app-reviewer 검토

## 메모
- 정답은 **1개만** — 표기(맞춤법) 정확도가 점수 가른다. 26개↑ = 만점.
- example jsx = 데이터·UX 레퍼런스 (앱은 바닐라 단일 HTML로 재작성).
