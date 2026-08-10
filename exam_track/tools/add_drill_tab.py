#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""
add_drill_tab.py — 단원 학습앱에 "⚡ 실전" 탭을 붙인다.

단원앱 32개에 같은 작업을 반복하므로 손으로 하지 않는다. 멱등이다 — 이미 붙어 있으면 건너뛴다.

사용:
    python exam_track/tools/add_drill_tab.py <html경로> <세트id>
    python exam_track/tools/add_drill_tab.py --all          # sync_drill.MAP 기준 일괄
    python exam_track/tools/add_drill_tab.py --check        # 붙었는지 검사만

무엇을 넣는가 (4곳)
    ① 탭 버튼      🔥 퀴즈 옆
    ② 페이지 섹션  <div class="page" data-p="drill"><div id="drill"></div></div>
    ③ 개요 목차 카드
    ④ <script src="drill.js"> + <script src="drill_<세트>.js">

전제: 단원앱이 공통 템플릿(탭 시스템 data-t/data-p, .qopt 계열 클래스)을 쓴다.
      32개 전수 확인됨. 앵커가 없으면 고치지 않고 실패를 보고한다.
"""
import argparse
import json
import os
import re
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
BANK = os.path.join(ROOT, "exam_track", "problem_bank", "data")

TAB_ANCHOR = '<button class="tab" data-t="sum">'
PAGE_ANCHOR = '<div class="page" data-p="sum">'
TOC_RE = re.compile(r"( *<button onclick=\"go\('quiz'\)\">.*?</button>\n)")
END_ANCHOR = "</body>\n</html>"


def item_count(set_id):
    p = os.path.join(BANK, set_id + ".js")
    if not os.path.exists(p):
        return None
    s = open(p, encoding="utf-8").read()
    return len(json.loads(s[s.index("{"):s.rindex("}") + 1])["items"])


def apply(path, set_id, write=True):
    s = open(path, encoding="utf-8").read()
    name = os.path.basename(path)
    if 'data-t="drill"' in s:
        return ("skip", "이미 붙어 있음")

    n = item_count(set_id)
    if n is None:
        return ("fail", "문항 정본 없음: %s.js" % set_id)

    for anchor in (TAB_ANCHOR, PAGE_ANCHOR, END_ANCHOR):
        if s.count(anchor) != 1:
            return ("fail", "앵커 %d회: %s" % (s.count(anchor), anchor[:40]))
    if not TOC_RE.search(s):
        return ("fail", "개요 목차의 퀴즈 카드를 찾지 못함")

    # ① 탭 버튼
    s = s.replace(TAB_ANCHOR,
                  '<button class="tab" data-t="drill">⚡ 실전</button>\n  ' + TAB_ANCHOR, 1)
    # ② 페이지 섹션
    s = s.replace(PAGE_ANCHOR,
                  '<div class="page" data-p="drill">\n    <div id="drill"></div>\n  </div>\n\n  '
                  + PAGE_ANCHOR, 1)
    # ③ 개요 목차 카드
    m = TOC_RE.search(s)
    indent = re.match(r" *", m.group(1)).group(0)
    card = ('%s<button onclick="go(\'drill\')"><div class="ti">⚡</div>'
            '<div class="tn">실전</div><div class="td">심화 %d문제</div></button>\n' % (indent, n))
    s = s[:m.end(1)] + card + s[m.end(1):]
    # ④ 스크립트
    s = s.replace(END_ANCHOR,
                  '<!-- ⚡ 실전 — 심화 문항 드릴.\n'
                  '     drill.js = 공용 엔진(subject_hub/_shared/drill.js)\n'
                  '     drill_%s.js = 문항 데이터. 정본은 exam_track/problem_bank/data/%s.js\n'
                  '     둘 다 `python exam_track/tools/sync_drill.py --write`가 만든 복사본 — 직접 고치지 말 것. -->\n'
                  '<script src="drill.js"></script>\n'
                  '<script src="drill_%s.js"></script>\n' % (set_id, set_id, set_id)
                  + END_ANCHOR, 1)

    if write:
        open(path, "w", encoding="utf-8").write(s)
    return ("ok", "%d문항" % n)


def verify(path):
    s = open(path, encoding="utf-8").read()
    tabs = set(re.findall(r'data-t="(\w+)"', s))
    pages = set(re.findall(r'data-p="(\w+)"', s))
    bad = []
    if "drill" not in tabs:
        bad.append("탭 없음")
    if "drill" not in pages:
        bad.append("페이지 없음")
    if tabs ^ pages:
        bad.append("탭↔페이지 불일치 %s" % (tabs ^ pages))
    if 'id="drill"' not in s:
        bad.append("#drill 컨테이너 없음")
    if s.count('src="drill.js"') != 1:
        bad.append("엔진 스크립트 %d개" % s.count('src="drill.js"'))
    if len(re.findall(r'src="drill_\w+\.js"', s)) != 1:
        bad.append("데이터 스크립트 개수 이상")
    for tag in ("div",):
        if s.count("<%s" % tag) != s.count("</%s>" % tag):
            bad.append("%s 태그 불균형" % tag)
    if sum(1 for i, c in enumerate(s) if c == "<" and i + 1 < len(s) and "가" <= s[i + 1] <= "힣"):
        bad.append("'<한글' 잘림")
    return bad


def targets():
    """sync_drill.MAP을 읽어 (html, set_id) 쌍을 만든다. 세트 id의 접두어로 앱을 찾는다."""
    sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
    import sync_drill
    out = []
    for sid, folder in sync_drill.MAP.items():
        d = os.path.join(ROOT, folder.replace("/", os.sep))
        meta = os.path.join(BANK, sid + ".js")
        app = None
        if os.path.exists(meta):
            s = open(meta, encoding="utf-8").read()
            src = json.loads(s[s.index("{"):s.rindex("}") + 1]).get("source_app", "")
            cand = os.path.join(ROOT, src.replace("/", os.sep))
            if os.path.exists(cand):
                app = cand
        if app:
            out.append((app, sid))
        else:
            out.append((None, sid))
    return out


def main():
    ap = argparse.ArgumentParser(description='단원앱에 "⚡ 실전" 탭을 붙인다.')
    ap.add_argument("html", nargs="?")
    ap.add_argument("set_id", nargs="?")
    ap.add_argument("--all", action="store_true", help="sync_drill.MAP 기준 일괄")
    ap.add_argument("--check", action="store_true", help="검사만")
    a = ap.parse_args()

    jobs = targets() if a.all or a.check else [(a.html, a.set_id)]
    if not jobs or jobs[0][0] is None and not (a.all or a.check):
        ap.error("html 경로와 세트 id를 주거나 --all")

    fail = 0
    for path, sid in jobs:
        if path is None:
            print("  ❌ %-28s source_app을 찾지 못함" % sid)
            fail += 1
            continue
        rel = os.path.relpath(path, ROOT)
        if a.check:
            bad = verify(path)
            print(("  ✅ " if not bad else "  ❌ ") + "%-46s %s" % (rel, ", ".join(bad) or "정상"))
            fail += bool(bad)
            continue
        state, msg = apply(path, sid)
        mark = {"ok": "📄", "skip": "  ", "fail": "❌"}[state]
        print("  %s %-46s %s" % (mark, rel, msg))
        if state == "fail":
            fail += 1
        elif state == "ok":
            bad = verify(path)
            if bad:
                print("     ⚠️ 검증 실패: %s" % ", ".join(bad))
                fail += 1

    print("\n대상 %d · 실패 %d" % (len(jobs), fail))
    return 1 if fail else 0


if __name__ == "__main__":
    sys.exit(main())
