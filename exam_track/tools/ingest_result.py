#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""
ingest_result.py — 문제은행 결과 텍스트를 약점 DB에 반영한다.

아이가 bank.html에서 "결과 복사"를 누르면 나오는 텍스트를 그대로 넣으면
_core/weakness_db/entries.json 에 오답·찍맞 항목이 들어가고 재출제 일정이 잡힌다.
지금까지 사람이 손으로 하던 단계 — 여기가 자동화되어야 루프가 끊기지 않는다.

사용:
    python exam_track/tools/ingest_result.py result.txt
    type result.txt | python exam_track/tools/ingest_result.py       (Windows)
    cat  result.txt | python exam_track/tools/ingest_result.py       (bash)
    python exam_track/tools/ingest_result.py result.txt --date 2026-08-04 --dry-run

입력 형식 (bank.html이 만들어 주는 그대로):
    문제은행 결과 kh2_02 / 한국사 Ⅱ. 일제의 식민 지배와 민족 운동
    맞음 9 / 12 (찍맞 1)
    틀림:
    - kh2_02_003 보기④ 원인 C8 확신도 sure
    찍어서 맞음:
    - kh2_02_011

정책 정본 = _core/retest/policy.json, 원인·확신도 = _core/taxonomy/causes.json.
이 스크립트는 정책을 재정의하지 않는다. 규칙을 바꾸려면 그 JSON을 고친다.
"""
import argparse
import json
import os
import re
import sys
from datetime import date, timedelta

ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
CORE = os.path.join(ROOT, "exam_track", "_core")
BANK = os.path.join(ROOT, "exam_track", "problem_bank")
DB_PATH = os.path.join(CORE, "weakness_db", "entries.json")

CIRCLED = "①②③④⑤"


# ---------- 읽기 ----------

def load_json(path):
    with open(path, encoding="utf-8") as f:
        return json.load(f)


def load_set(set_id):
    """data/<set_id>.js 의 window.BANK_SET = {...}; 에서 JSON만 꺼낸다."""
    path = os.path.join(BANK, "data", set_id + ".js")
    if not os.path.exists(path):
        raise SystemExit("세트 파일이 없다: %s" % os.path.relpath(path, ROOT))
    src = open(path, encoding="utf-8").read()
    return json.loads(src[src.index("{"):src.rindex("}") + 1])


# ---------- 파싱 ----------

HEAD = re.compile(r"문제은행\s*결과\s*(\S+)")
LINE = re.compile(
    r"^-\s*(?P<q>[\w-]+)"
    r"(?:\s*보기\s*(?P<opt>[%s]))?"
    r"(?:\s*원인\s*(?P<cause>C\d))?"
    r"(?:\s*확신도\s*(?P<conf>\w+))?" % CIRCLED
)


def parse(text):
    """결과 텍스트 → (set_id, [{q, opt, cause, conf, kind}])"""
    set_id, rows, section = None, [], None
    for raw in text.splitlines():
        line = raw.strip()
        if not line:
            continue
        m = HEAD.search(line)
        if m and set_id is None:
            set_id = m.group(1)
            continue
        if line.startswith("틀림"):
            section = "wrong"
            continue
        if line.startswith("찍어서 맞음") or line.startswith("찍맞:"):
            section = "guess_correct"
            continue
        m = LINE.match(line)
        if m and section:
            g = m.groupdict()
            rows.append({
                "q": g["q"],
                "oi": CIRCLED.index(g["opt"]) if g["opt"] else None,
                "cause": g["cause"],
                "conf": g["conf"],
                "kind": section,
            })
    if not set_id:
        raise SystemExit("세트 id를 찾지 못했다. 첫 줄이 '문제은행 결과 <set_id> / ...' 인지 확인.")
    return set_id, rows


# ---------- 일정 ----------

def first_due(today, conf_id, cause_id, causes_doc, policy):
    """확신도의 first_interval_days + 원인의 retest_bias_days, clamp 적용."""
    conf = next((c for c in causes_doc["confidence"] if c["id"] == conf_id), None)
    if conf is None:
        conf = next(c for c in causes_doc["confidence"] if c["id"] == "unknown")
    days = conf["policy"]["first_interval_days"]
    cause = next((c for c in causes_doc["causes"] if c["id"] == cause_id), None)
    if cause:
        days += cause.get("retest_bias_days", 0)
    clamp = policy["first_due_clamp_days"]
    days = max(clamp["min"], min(clamp["max"], days))
    return today + timedelta(days=days), days


def needs_learning(conf_id, cause_id, causes_doc):
    """찍음(=지식 부재) 또는 C2 → 먼저 배우고 나서 재출제한다."""
    conf = next((c for c in causes_doc["confidence"] if c["id"] == conf_id), None)
    if conf and conf["policy"].get("requires_learning_first"):
        return True
    cause = next((c for c in causes_doc["causes"] if c["id"] == cause_id), None)
    return bool(cause and cause.get("requires_learning_first"))


# ---------- 반영 ----------

def build_entry(row, item, bank, today, causes_doc, policy):
    cause_id = row["cause"]
    detail = ""
    chose = None
    if item:
        oi = row["oi"]
        if oi is None and cause_id:                       # 구형 텍스트 호환: 원인으로 역추적
            cands = [k for k, o in enumerate(item["o"])
                     if o.get("cause") == cause_id and k != item["a"]]
            oi = cands[0] if len(cands) == 1 else None
        if oi is not None and 0 <= oi < len(item["o"]):
            opt = item["o"][oi]
            chose = opt["t"]
            detail = opt.get("why", "")
            cause_id = cause_id or opt.get("cause")
    # '찍어서 맞음' 줄에는 확신도가 붙지 않는다 — 그 자체가 guess다.
    # 이걸 unknown으로 두면 '지식 부재'가 아니라 일반 오답으로 잡혀 학습 대기를 건너뛴다.
    conf_id = row["conf"] or ("guess" if row["kind"] == "guess_correct" else "unknown")

    learning = needs_learning(conf_id, cause_id, causes_doc)
    due, gap = (None, None) if learning else first_due(today, conf_id, cause_id, causes_doc, policy)

    e = {
        "id": "%s_%s_%s" % (today.isoformat(), bank["subject"], row["q"]),
        "exam": {
            "id": "bank-" + bank["id"],
            "date": today.isoformat(),
            "subject": bank["subject"],
            "scope": "고난도 문제은행 · " + bank["title"],
        },
        "source_type": "bank",
        "q": row["q"],
        "format": item["type"] if item else "선다",
        "level": item.get("level") if item else None,
        "result": "wrong" if row["kind"] == "wrong" else "guess_correct",
        "points": None,
        "topic": [bank["unit"]],
        "cause": {
            "primary": cause_id or ("C2" if row["kind"] == "guess_correct" else "C2"),
            "secondary": [],
            "detail": detail,
        },
        "confidence": conf_id,
        "chose": chose,
        "confused_with": None,
        "links": {
            "app": "exam_track/problem_bank/bank.html?set=" + bank["id"],
            "concept": bank.get("source_app", ""),
        },
        "gaps": [],
        "retest": {
            "state": "learning" if learning else "scheduled",
            "rung": 0,
            "streak": 0,
            "due": None if learning else due.isoformat(),
            "history": [],
        },
        "created": today.isoformat(),
        "updated": today.isoformat(),
    }
    if learning:
        e["retest"]["learning_note"] = (
            "찍어서 맞음 — 모르는 상태다. 개념 확인 후 출제"
            if row["kind"] == "guess_correct" else "지식 부재 — 학습 후 출제"
        )
    return e, gap


def apply_result(existing, row, item, today, causes_doc, policy):
    """이미 있는 항목을 다시 틀렸다 → 사다리를 0으로 되돌리고 이력을 남긴다."""
    r = existing["retest"]
    r.setdefault("history", []).append({
        "date": today.isoformat(),
        "result": "wrong" if row["kind"] == "wrong" else "guess_correct",
        "confidence": row["conf"] or "unknown",
        "cause": row["cause"],
    })
    r["rung"] = 0
    r["streak"] = 0
    conf_id = row["conf"] or ("guess" if row["kind"] == "guess_correct" else "unknown")
    cause_id = row["cause"] or existing["cause"]["primary"]
    if needs_learning(conf_id, cause_id, causes_doc):
        r["state"] = "learning"
        r["due"] = None
    else:
        r["state"] = "scheduled"
        r["due"] = (today + timedelta(days=1)).isoformat()   # policy.on_result.wrong
    existing["confidence"] = conf_id
    existing["cause"]["primary"] = cause_id
    if item and row["oi"] is not None and 0 <= row["oi"] < len(item["o"]):
        opt = item["o"][row["oi"]]
        existing["chose"] = opt["t"]
        existing["cause"]["detail"] = opt.get("why", existing["cause"].get("detail", ""))
    existing["updated"] = today.isoformat()
    return sum(1 for h in r["history"] if h.get("result") == "wrong") + 1


def recount(db):
    by = {}
    for e in db["entries"]:
        s = e["retest"]["state"]
        by[s] = by.get(s, 0) + 1
    db["counts"] = {
        "total": len(db["entries"]),
        "scheduled": by.get("scheduled", 0),
        "learning": by.get("learning", 0),
        "mastered": by.get("mastered", 0),
    }
    if by.get("paused"):
        db["counts"]["paused"] = by["paused"]


# ---------- main ----------

def main():
    ap = argparse.ArgumentParser(description="문제은행 결과 텍스트를 약점 DB에 반영한다.")
    ap.add_argument("file", nargs="?", help="결과 텍스트 파일 (없으면 표준입력)")
    ap.add_argument("--date", help="푼 날짜 YYYY-MM-DD (기본: 오늘)")
    ap.add_argument("--dry-run", action="store_true", help="쓰지 않고 결과만 보여준다")
    args = ap.parse_args()

    text = open(args.file, encoding="utf-8").read() if args.file else sys.stdin.read()
    if args.date:
        y, m, dd = (int(x) for x in args.date.split("-"))
        today = date(y, m, dd)
    else:
        today = date.today()

    set_id, rows = parse(text)
    if not rows:
        print("반영할 오답·찍맞이 없다. 전부 맞았거나 형식이 다르다.")
        return

    bank = load_set(set_id)
    items = {it["id"]: it for it in bank["items"]}
    causes_doc = load_json(os.path.join(CORE, "taxonomy", "causes.json"))
    policy = load_json(os.path.join(CORE, "retest", "policy.json"))
    db = load_json(DB_PATH)
    by_q = {e["q"]: e for e in db["entries"]}

    added, updated, report = 0, 0, []
    for row in rows:
        item = items.get(row["q"])
        if item is None:
            report.append((row["q"], "?", "세트에 없는 문항 — 건너뜀", ""))
            continue
        if row["q"] in by_q:
            meets = apply_result(by_q[row["q"]], row, item, today, causes_doc, policy)
            e = by_q[row["q"]]
            updated += 1
            when = e["retest"]["due"] or "학습 대기"
            report.append((row["q"], e["cause"]["primary"], "%d번째 오답 → %s" % (meets, when), e["retest"]["state"]))
        else:
            e, gap = build_entry(row, item, bank, today, causes_doc, policy)
            db["entries"].append(e)
            by_q[row["q"]] = e
            added += 1
            when = ("%s (+%d일)" % (e["retest"]["due"], gap)) if gap else "학습 대기"
            report.append((row["q"], e["cause"]["primary"], when, e["retest"]["state"]))

    recount(db)
    db["updated"] = today.isoformat()

    w = max([len(r[0]) for r in report] + [8])
    print("세트      :", set_id, "/", bank["subject"], bank["title"])
    print("날짜      :", today.isoformat())
    print("신규 %d건 · 갱신 %d건" % (added, updated))
    print("-" * (w + 40))
    for q, cause, when, state in report:
        print("%s  %-3s  %-11s  %s" % (q.ljust(w), cause, state, when))
    print("-" * (w + 40))
    print("DB        :", db["counts"])

    if args.dry_run:
        print("\n[dry-run] 쓰지 않았다.")
        return

    with open(DB_PATH, "w", encoding="utf-8") as f:
        json.dump(db, f, ensure_ascii=False, indent=2)
        f.write("\n")
    print("wrote     :", os.path.relpath(DB_PATH, ROOT))
    print("\n다음 :  python exam_track/tools/build_retest.py")


if __name__ == "__main__":
    main()
