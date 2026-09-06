#!/bin/bash
# 공용 퀴즈 엔진(대수/10_app/alg_app.js) 루프 시나리오 시험 — 엔진을 고치면 반드시 돌린다.
# 헤드리스 Chrome으로 quiz_loop_test.html 을 열어 페이지 안 시험 스크립트의 PASS/FAIL 을 읽는다(localStorage·클릭 모두 실제 동작).
# 사용: bash subject_hub/_shared/tests/run_quiz_test.sh   (Git Bash. 다른 크롬 경로면 CHROME=… 로)
HERE="$(cd "$(dirname "$0")" && pwd -W 2>/dev/null || pwd)"
CHROME="${CHROME:-C:/Program Files/Google/Chrome/Application/chrome.exe}"
OUT=$("$CHROME" --headless=new --disable-gpu --allow-file-access-from-files --virtual-time-budget=4000 --dump-dom "file:///$HERE/quiz_loop_test.html" 2>/dev/null | sed -n '/<pre id="log">/,/<\/pre>/p' | sed 's/<[^>]*>//g')
echo "$OUT" | grep "^FAIL\|^ERROR"
P=$(echo "$OUT" | grep -c "^PASS"); F=$(echo "$OUT" | grep -c "^FAIL\|^ERROR")
echo "quiz loop test: PASS $P · FAIL $F  (기대: PASS 36 · FAIL 0)"
[ "$F" = "0" ] && [ "$P" -ge 36 ]
