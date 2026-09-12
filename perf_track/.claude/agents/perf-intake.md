# Agent — perf-intake

새 수행평가 공지가 들어왔을 때 쓰는 절차. (`se_agent_*` 명명은 exam_track·subject_hub의 학생 대상 에이전트용이라, 이건 Nick이 공지를 넣을 때 부르는 관리용 절차라 짧게 `perf-intake`로 둔다.)

## 절차

1. **원본 보존.** 공지 캡처·rubric을 `<task-slug>/00_notice/`에 원문 그대로 저장. 추측·요약으로 대체하지 않는다.
2. **형태 진단.** 상위 `../CLAUDE.md` §6 매핑표로 최종 제출 형태를 분류한다. 애매하면 Nick에게 확인.
3. **slug 결정.** `<subject>-<grade>-<semester>-<seq>` (영어). 같은 과목 같은 학기의 몇 번째 수행평가인지 seq로 구분.
4. **골격 생성.** `_template/LEAF_CLAUDE_TEMPLATE.md`를 복사해 `<task-slug>/CLAUDE.md`로, `00_notice/ 10_prep/ 90_output/` 디렉토리를 만든다.
5. **스킬 매칭.** §8 기존 자산 표와 진단된 형태를 대조한다.
   - 맞는 게 있으면: 그 자산을 `<task-slug>/.claude/skills/`로 복사해 이 과제에 맞게 조정 — Nick에게 알리고 진행.
   - 맞는 게 없으면: 이 과제 전용으로 새로 만들지, 아니면 앱 없이 문서로 갈지 Nick과 상의.
   - `perf_track/.claude/skills/`(공통)에 이미 있는 걸 우선 확인 — 있으면 그대로 재사용, 새로 안 만든다.
6. **투기적 제작 금지 재확인.** 이번 과제에 안 쓰는 스킬은 만들지 않는다.
