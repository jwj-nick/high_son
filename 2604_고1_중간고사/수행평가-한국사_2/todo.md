# todo — 한국사1 수행평가 (D-day 6/15)

## 진행 상태
- [x] 디렉토리 구조 생성 (01_capture/figs, 02_text, 10_app, cht_log)
- [x] 공지 정리 (`2026_한국사1_수행공지.md`)
- [x] 용어 정본 28개 작성 (`02_text/용어정본.md`)
- [x] PLAN.md 작성

## 캡쳐 대기 (Nick)
- [ ] (Nick) **오늘** 자습서 캡쳐 → `01_capture/`에 넣기
- [ ] (Nick) **내일** 교과서 캡쳐 → `01_capture/`에 넣기
- [ ] 캡쳐 수령 후: 용어정본 표기·연도 검증 (§검증 메모 채우기)
- [ ] 누락 용어 점검 (30문항 ↔ 28용어)

## 앱 빌드
- [x] 앱 v1: 6탭 (개요·흐름·카드·빈칸·오답·실전) `10_app/perf_korhist2.html`
- [x] 공개 배포 (로컬 복사): `high1/korean/1sem_perf_modern_terms.html` + 카드 추가 + breadcrumb
- [x] 검증: HTTP 200, node --check JS 구문 OK, 콘솔 에러 없음 (브라우저 스샷은 익스텐션 이슈로 스킵)
- [ ] (Nick) **git push** 승인 → 실서비스 반영 (https://jwj-nick.github.io/high1/korean/)
- [ ] 캡쳐 검증 후 용어 데이터 보정 → 앱 동기화
- [ ] 사료/지도/인물 figcrop → 플래시카드 보강
- [ ] app-reviewer 검토

## 메모
- 정답은 **1개만** — 표기(맞춤법) 정확도가 점수 가른다. 26개↑ = 만점.
- example jsx = 데이터·UX 레퍼런스 (앱은 바닐라 단일 HTML로 재작성).
