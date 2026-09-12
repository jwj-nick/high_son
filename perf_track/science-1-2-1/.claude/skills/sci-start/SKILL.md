---
name: sci-start
description: science-1-2-1(통합과학2 중화 반응 수행평가) 세션 재진입. inbox/README → SESSION_LOG → PLAN 순으로 읽어 현재 라운드와 다음 산출물을 파악하고, Nick 확인 지점이 아니면 바로 자율 진행한다. 호출 예 — "/sci-start", "세션 시작", "이어서 진행".
---

# sci-start — 재진입

## 절차
1. `inbox/README.md`를 읽는다 (자료 정본. 사진은 세부 확인이 필요할 때만 연다).
2. `SESSION_LOG.md` 마지막 라운드를 읽는다 (Nick의 마지막 지시와 Claude의 마지막 약속).
3. `PLAN.md` §3 산출물 표의 ⬜ 항목과 §5 라운드 계획을 대조해 **현재 라운드**를 정한다.
4. `git status`·`ls 10_prep 90_output`으로 디스크 실측 (로그와 어긋나면 디스크가 진실).
5. 브리핑 3줄: 현재 라운드 / 이번에 만들 산출물 / Nick 확인 지점 여부.
6. Nick 확인 지점(`PLAN.md` §5)이 아니면 **묻지 않고** `perf-essay-prep` 절차대로 진행한다. 확인 지점이면 질문만 간결히.

## 금지
- 정본(`10_prep/*.md`) 없이 앱·프린트에 콘텐츠를 즉흥 작성하는 것.
- `inbox/` 파일 수정.
- 라운드 3 이후 Nick에게 "진행할까요?"를 묻는 것 (확인 지점 2곳 제외).
