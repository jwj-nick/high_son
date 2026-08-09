#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""
build_retest.py — 약점 DB에서 "오늘의 재시험"을 계산해 앱 데이터와 마크다운을 생성한다.

사용:
    python exam_track/tools/build_retest.py                # 오늘 날짜로
    python exam_track/tools/build_retest.py 2026-07-29     # 특정 날짜로

산출:
    exam_track/app/data.js                    ← 재시험 앱이 읽는 데이터 (window.RETEST_DATA)
    exam_track/_core/retest/daily/<날짜>.md    ← 사람이 읽는 회차 기록

정책 정본 = _core/retest/policy.json, 원인/확신도 = _core/taxonomy/causes.json.
이 스크립트는 정책을 재정의하지 않는다. 규칙을 바꾸려면 policy.json을 고친다.
"""
import json
import os
import sys
from datetime import date, timedelta

ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
CORE = os.path.join(ROOT, "exam_track", "_core")
APP = os.path.join(ROOT, "exam_track", "app")


def load(*parts):
    with open(os.path.join(CORE, *parts), encoding="utf-8") as f:
        return json.load(f)


def d(s):
    y, m, dd = (int(x) for x in s.split("-"))
    return date(y, m, dd)


def load_bank_index():
    """문항 id -> 세트 id. 문제은행에서 온 약점을 앱에서 다시 풀리려면 이게 필요하다."""
    bank = os.path.join(ROOT, "exam_track", "problem_bank", "data")
    sets_js = os.path.join(bank, "sets.js")
    index = {}
    if not os.path.exists(sets_js):
        return index
    src = open(sets_js, encoding="utf-8").read()
    for e in json.loads(src[src.index("["):src.rindex("]") + 1]):
        p = os.path.join(bank, e["id"] + ".js")
        if not os.path.exists(p):
            continue
        s = open(p, encoding="utf-8").read()
        for it in json.loads(s[s.index("{"):s.rindex("}") + 1])["items"]:
            index[it["id"]] = e["id"]
    return index


def build(today):
    db = load("weakness_db", "entries.json")
    policy = load("retest", "policy.json")
    causes_doc = load("taxonomy", "causes.json")
    bank_item_index = load_bank_index()

    conf_policy = {c["id"]: c for c in causes_doc["confidence"]}
    cause_meta = {c["id"]: c for c in causes_doc["causes"]}
    ladder = policy["ladder_days"]
    cap = policy["daily"]["max_items"]
    max_run = policy["daily"]["max_same_subject_in_a_row"]
    max_dist = policy["interleaving"]["max_reorder_distance"]["value"]
    pri_cap = policy["priority"]["cap"]

    entries = db["entries"]
    scheduled, learning = [], []

    for e in entries:
        r = e["retest"]
        if r["state"] == "learning":
            learning.append(e)
            continue
        if r["state"] != "scheduled" or not r.get("due"):
            continue
        due = d(r["due"])
        if due > today:
            continue

        conf = conf_policy.get(e.get("confidence", "unknown"), conf_policy["unknown"])
        pri = conf["policy"]["priority"]
        why = []

        if e.get("confidence") == "sure":
            pri -= 1
            why.append("확신 오답(오개념)")
        wrong_count = sum(1 for h in r.get("history", []) if h.get("result") == "wrong")
        if wrong_count >= 2:
            pri -= 1
            why.append("%d회 반복 오답" % wrong_count)
        if (e.get("points") or 0) >= 5.5:
            pri -= 1
            why.append("고배점 %.1f" % e["points"])
        if e["cause"]["primary"] == "C6":
            pri += 1
            why.append("시간전략(개별 재출제 효과 낮음)")
        pri = max(pri_cap["min"], min(pri_cap["max"], pri))

        scheduled.append({
            "id": e["id"], "q": e["q"], "subject": e["exam"]["subject"],
            "scope": e["exam"]["scope"], "exam_date": e["exam"]["date"],
            "points": e.get("points"), "format": e.get("format", "선다"),
            "topic": e["topic"], "cause": e["cause"]["primary"],
            "cause_label": cause_meta.get(e["cause"]["primary"], {}).get("label", ""),
            "cause_detail": e["cause"].get("detail", ""),
            "confidence": e.get("confidence", "unknown"),
            "links": e.get("links", {}), "gaps": e.get("gaps", []),
            "bank_set": bank_item_index.get(e["q"]),
            "meets": len(r.get("history", [])) + 1,
            "rung": r.get("rung", 0),
            "due": r["due"], "overdue": (today - due).days,
            "priority": pri, "priority_why": why,
        })

    rank = {"sure": 0, "half": 1, "guess": 2, "unknown": 3, "timeout": 4}
    scheduled.sort(key=lambda x: (x["priority"], -x["overdue"], rank.get(x["confidence"], 3), -(x["points"] or 0)))

    picked, deferred = scheduled[:cap], scheduled[cap:]
    multi_subject = len({x["subject"] for x in picked}) > 1

    # 교차의 축은 출처마다 다르다(policy.interleaving.axis_by_source).
    # 문제은행은 한 세트가 한 단원이라 topic이 전부 같아 축으로 쓸 수 없다 — 유형을 쓴다.
    axis_by = policy["interleaving"].get("axis_by_source", {})

    def axis(x):
        key = axis_by.get("bank" if x.get("bank_set") else "exam", "topic")
        if key == "format":
            return {"format:" + str(x.get("format"))}
        return {"topic:" + t for t in x["topic"]}

    def ok(out, cand):
        if not out:
            return True
        if axis(out[-1]) & axis(cand):
            return False
        if multi_subject and len(out) >= max_run:
            if all(o["subject"] == cand["subject"] for o in out[-max_run:]):
                return False
        return True

    # 교차 재배열. 그리디는 되돌아가지 못해 막판에 충돌이 남는다(실측). 이동 폭을
    # ±max_dist로 묶은 채 되추적 탐색을 돌린다. n<=cap(8)이라 즉시 끝난다.
    def search(order, remaining):
        if not remaining:
            return order
        for i, cand in enumerate(remaining):
            if i > max_dist:               # 우선순위에서 너무 멀리 끌어오지 않는다
                break
            if not ok(order, cand):
                continue
            got = search(order + [cand], remaining[:i] + remaining[i + 1:])
            if got is not None:
                return got
        return None

    ordered = search([], picked)
    interleave_ok = ordered is not None
    if not interleave_ok:                  # 충돌을 못 푸는 조합이면 우선순위 순서를 지킨다
        ordered = list(picked)
    conflicts = [ordered[i]["q"] + "↔" + ordered[i + 1]["q"]
                 for i in range(len(ordered) - 1)
                 if axis(ordered[i]) & axis(ordered[i + 1])]

    # ----- 누적 통계 (부모용 신호) -----
    def tally(key):
        out = {}
        for e in entries:
            for v in (key(e) if isinstance(key(e), list) else [key(e)]):
                out[v] = out.get(v, 0) + 1
        return dict(sorted(out.items(), key=lambda kv: -kv[1]))

    cause_by_subject = {}
    for e in entries:
        c = e["cause"]["primary"]
        cause_by_subject.setdefault(c, set()).add(e["exam"]["subject"])
    cross = sorted([c for c, s in cause_by_subject.items() if len(s) >= 3])

    stats = {
        "total": len(entries),
        "by_state": tally(lambda e: e["retest"]["state"]),
        "by_cause": tally(lambda e: e["cause"]["primary"]),
        "by_subject": tally(lambda e: e["exam"]["subject"]),
        "by_topic": tally(lambda e: e["topic"]),
        "by_confidence": tally(lambda e: e.get("confidence", "unknown")),
        "cross_subject_causes": cross,
        "misconceptions": [e["id"] for e in entries if e.get("confidence") == "sure"],
        "repeat_wrong": [e["id"] for e in entries
                         if sum(1 for h in e["retest"].get("history", []) if h.get("result") == "wrong") >= 2],
        "gaps_pending": sum(1 for e in entries if e.get("gaps")),
    }

    # 문제은행에서 온 항목은 링크만 주지 말고 **그 문항을 실제로 다시 풀게** 한다.
    # 인출(retrieval)이 간격 반복의 전부인데, 링크만 주면 다시 '읽기'가 된다.
    # bank.html이 여러 세트를 읽고 only= 순서 그대로 내주므로 URL 하나면 된다.
    bank_ids = [x["q"] for x in ordered if x["q"] in bank_item_index]
    bank_sets = []
    for q in bank_ids:
        sid = bank_item_index[q]
        if sid not in bank_sets:
            bank_sets.append(sid)
    retest_url = ""
    if bank_ids:
        retest_url = ("../problem_bank/bank.html?set=" + ",".join(bank_sets) +
                      "&only=" + ",".join(bank_ids))

    data = {
        "generated": today.isoformat(),
        "cap": cap,
        "ladder": ladder,
        "bank": {
            "url": retest_url,
            "count": len(bank_ids),
            "sets": bank_sets,
            "note": "문제은행 문항은 앱에서 그대로 다시 푼다. 나머지는 오답노트를 연다.",
        },
        "interleave": {
            "resolved": interleave_ok,
            "multi_subject": multi_subject,
            "conflicts": conflicts,
            "note": ("과목 교차 적용" if multi_subject else "후보가 한 과목뿐 — topic 교차로 대체"),
        },
        "daily": ordered,
        "deferred": [{"id": x["id"], "q": x["q"], "subject": x["subject"]} for x in deferred],
        "learning": [{
            "id": e["id"], "q": e["q"], "subject": e["exam"]["subject"],
            "topic": e["topic"], "cause": e["cause"]["primary"],
            "reason": e["retest"].get("learning_note", "학습 후 출제"),
            "links": e.get("links", {}),
        } for e in learning],
        "stats": stats,
        "cause_labels": {c["id"]: c["label"] for c in causes_doc["causes"]},
        "cause_remedy": {c["id"]: c["remedy"] for c in causes_doc["causes"]},
        "confidence_labels": {c["id"]: c["label"] for c in causes_doc["confidence"]},
    }
    return data


def write_js(data):
    os.makedirs(APP, exist_ok=True)
    path = os.path.join(APP, "data.js")
    body = json.dumps(data, ensure_ascii=False, indent=2)
    with open(path, "w", encoding="utf-8") as f:
        f.write("// 자동 생성 — exam_track/tools/build_retest.py. 직접 수정하지 말 것.\n")
        f.write("window.RETEST_DATA = ")
        f.write(body)
        f.write(";\n")
    return path


def write_md(data, today):
    outdir = os.path.join(CORE, "retest", "daily")
    os.makedirs(outdir, exist_ok=True)
    path = os.path.join(outdir, today.isoformat() + ".md")
    L = []
    n = len(data["daily"])
    L.append("# 오늘의 재시험 — %s (%d문항)\n" % (today.isoformat(), n))
    L.append("> 자동 생성(`build_retest.py`). 정답·원인은 접혀 있거나 표시하지 않는다 — 힌트를 보고 풀면 인출이 아니라 재인이 된다.\n")
    if n:
        L.append("| # | 문항 | 배점 | 몇 번째 | 문제 |")
        L.append("|---|---|---|---|---|")
        for i, x in enumerate(data["daily"], 1):
            app = x["links"].get("app", "")
            rel = ("../../../../" + app) if app else ""
            link = "[열기](%s)" % rel if app else "—"
            L.append("| %d | %s %s | %s | %d | %s |" % (
                i, x["subject"], x["q"], ("%.1f" % x["points"]) if x["points"] else "—", x["meets"], link))
    else:
        L.append("_오늘 예정된 재시험 없음._")
    if data["learning"]:
        L.append("\n## 학습 대기 %d건 (오늘 출제 안 함)\n" % len(data["learning"]))
        for x in data["learning"]:
            L.append("- **%s %s** — %s" % (x["subject"], x["q"], x["reason"]))
    if data["deferred"]:
        L.append("\n## 이월 %d건\n" % len(data["deferred"]))
        L.append(", ".join("%s %s" % (x["subject"], x["q"]) for x in data["deferred"]))
    L.append("\n## 결과 기록\n")
    L.append("`재시험 결과 Q12 맞음 Q15 틀림 …` 형식으로 알려주면 DB에 반영하고 다음 일정을 잡는다.\n")

    if n:
        iv = data["interleave"]
        L.append("\n---\n")
        L.append("## 선정 근거 (검산용 — 아이에게는 보여주지 않는다)\n")
        L.append("| 문항 | 배점 | 확신도 | 밀림 | 우선순위 | 보정 근거 |")
        L.append("|---|---|---|---|---|---|")
        for x in sorted(data["daily"], key=lambda z: (z["priority"], -z["overdue"])):
            L.append("| %s %s | %s | %s | %d일 | %d | %s |" % (
                x["subject"], x["q"], ("%.1f" % x["points"]) if x["points"] else "—",
                data["confidence_labels"].get(x["confidence"], x["confidence"]),
                x["overdue"], x["priority"], " · ".join(x["priority_why"]) or "—"))
        L.append("\n**교차**: %s / %s" % (
            iv["note"], "충돌 없음" if not iv["conflicts"] else "⚠️ 미해소 " + ", ".join(iv["conflicts"])))
        if not iv["resolved"]:
            L.append("\n⚠️ 이동 폭 ±%d 안에서는 topic 충돌을 풀 수 없어 우선순위 순서를 유지했다." % data.get("max_dist", 2))
    with open(path, "w", encoding="utf-8") as f:
        f.write("\n".join(L))
    return path


def main():
    today = d(sys.argv[1]) if len(sys.argv) > 1 else date.today()
    data = build(today)
    js, md = write_js(data), write_md(data, today)
    print("date      :", today.isoformat())
    print("daily     :", len(data["daily"]), "문항 ->", ", ".join(
        "%s %s" % (x["subject"], x["q"]) for x in data["daily"]) or "없음")
    print("learning  :", len(data["learning"]), "건")
    print("deferred  :", len(data["deferred"]), "건")
    print("wrote     :", os.path.relpath(js, ROOT))
    print("wrote     :", os.path.relpath(md, ROOT))


if __name__ == "__main__":
    main()
