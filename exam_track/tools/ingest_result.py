#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""
ingest_result.py — 아이가 앱에서 복사해 온 결과 텍스트를 약점 DB에 반영한다.

여기가 자동화되지 않으면 루프가 사람 손에서 끊긴다. 실제로 이전 설계에서는
'채점 결과 입력'이 3개월간 방치돼 파이프라인 전체가 멈춰 있었다.

사용:
    python exam_track/tools/ingest_result.py result.txt
    cat result.txt | python exam_track/tools/ingest_result.py
    python exam_track/tools/ingest_result.py result.txt --date 2026-08-09 --dry-run

받는 텍스트 두 가지 — 앱이 만들어 주는 그대로 붙여 넣으면 된다.

① 문제은행/재시험 (problem_bank/bank.html)
    문제은행 결과 kh2_02 / 한국사 Ⅱ. 일제의 식민 지배와 민족 운동
    맞음 9 / 12 (찍맞 1)
    틀림:
    - kh2_02_003 보기④ 원인 C8 확신도 sure
    찍어서 맞음:
    - kh2_02_011
    맞음:
    - kh2_02_001 확신도 sure

② 오늘의 재시험 수동 기록 (app/retest.html — 학교 시험지 오답 등)
    재시험 결과 2026-08-09
    수학 Q19 맞음(확신)
    수학 Q15 틀림(반신반의)

무엇이 일어나는가
    틀림      → 신규면 등록, 이미 있으면 사다리를 0으로 되돌리고 이력을 남긴다
    찍어서 맞음 → 지식 부재로 보고 learning(학습 전에는 재출제하지 않는다)
    맞음      → **이미 DB에 있는 것만** 사다리를 한 칸 올린다. 조건을 채우면 mastered
                (처음부터 맞힌 것은 약점이 아니므로 등록하지 않는다)

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
BANK = os.path.join(ROOT, "exam_track", "problem_bank", "data")
DB_PATH = os.path.join(CORE, "weakness_db", "entries.json")

CIRCLED = "①②③④⑤"
CONF_KO = {"확신": "sure", "반신반의": "half", "찍음": "guess",
           "시간부족": "timeout", "미기록": "unknown"}


# ---------- 읽기 ----------

def load_json(path):
    with open(path, encoding="utf-8") as f:
        return json.load(f)


def js_object(path, opener="{", closer="}"):
    src = open(path, encoding="utf-8").read()
    return json.loads(src[src.index(opener):src.rindex(closer) + 1])


def load_all_sets():
    """문항 id -> (문항, 세트메타). 재시험 텍스트는 여러 세트가 섞여 오므로 전부 읽는다."""
    items, owner = {}, {}
    sets_js = os.path.join(BANK, "sets.js")
    if not os.path.exists(sets_js):
        return items, owner
    for e in js_object(sets_js, "[", "]"):
        p = os.path.join(BANK, e["id"] + ".js")
        if not os.path.exists(p):
            continue
        s = js_object(p)
        for it in s["items"]:
            items[it["id"]] = it
            owner[it["id"]] = s
    return items, owner


# ---------- 파싱 ----------

BANK_HEAD = re.compile(r"(?:문제은행|재시험)\s*결과\s+(\S+)\s*/")
MANUAL_HEAD = re.compile(r"재시험\s*결과\s+(\d{4}-\d{2}-\d{2})")
BANK_LINE = re.compile(
    r"^-\s*(?P<q>[\w-]+)"
    r"(?:\s*보기\s*(?P<opt>[%s]))?"
    r"(?:\s*원인\s*(?P<cause>C\d))?"
    r"(?:\s*확신도\s*(?P<conf>\w+))?" % CIRCLED
)
MANUAL_LINE = re.compile(
    r"^(?P<subject>[^\s]+)\s+(?P<q>[\w-]+)\s+(?P<res>맞음|틀림)\s*(?:\((?P<conf>[^)]+)\))?\s*$"
)

SECTIONS = [("틀림:", "wrong"), ("찍어서 맞음:", "guess_correct"),
            ("찍맞:", "guess_correct"), ("맞음:", "correct")]


def parse(text):
    """결과 텍스트 → rows. 두 가지 형식을 모두 받는다."""
    rows, section, saw_bank_head = [], None, False
    for raw in text.splitlines():
        line = raw.strip()
        if not line:
            continue

        if BANK_HEAD.search(line):
            saw_bank_head = True
            continue
        if MANUAL_HEAD.search(line) and not saw_bank_head:
            continue

        hit = None
        for prefix, kind in SECTIONS:
            if line.startswith(prefix):
                hit = kind
                break
        if hit:
            section = hit
            continue

        if line.startswith("-"):
            m = BANK_LINE.match(line)
            if m and section:
                g = m.groupdict()
                rows.append({
                    "q": g["q"],
                    "oi": CIRCLED.index(g["opt"]) if g["opt"] else None,
                    "cause": g["cause"],
                    "conf": g["conf"],
                    "kind": section,
                })
            continue

        m = MANUAL_LINE.match(line)
        if m:
            g = m.groupdict()
            rows.append({
                "q": g["q"], "oi": None, "cause": None,
                "conf": CONF_KO.get((g["conf"] or "").strip()),
                "kind": "wrong" if g["res"] == "틀림" else "correct",
            })
    return rows


# ---------- 일정 ----------

def conf_of(conf_id, causes_doc):
    for c in causes_doc["confidence"]:
        if c["id"] == conf_id:
            return c
    return next(c for c in causes_doc["confidence"] if c["id"] == "unknown")


def cause_of(cause_id, causes_doc):
    for c in causes_doc["causes"]:
        if c["id"] == cause_id:
            return c
    return None


def first_due(today, conf_id, cause_id, causes_doc, policy):
    """확신도의 first_interval_days + 원인의 retest_bias_days, clamp 적용."""
    days = conf_of(conf_id, causes_doc)["policy"]["first_interval_days"]
    c = cause_of(cause_id, causes_doc)
    if c:
        days += c.get("retest_bias_days", 0)
    clamp = policy["first_due_clamp_days"]
    days = max(clamp["min"], min(clamp["max"], days))
    return today + timedelta(days=days), days


def needs_learning(conf_id, cause_id, causes_doc):
    """찍음(=지식 부재) 또는 C2 → 먼저 배우고 나서 재출제한다."""
    if conf_of(conf_id, causes_doc)["policy"].get("requires_learning_first"):
        return True
    c = cause_of(cause_id, causes_doc)
    return bool(c and c.get("requires_learning_first"))


# ---------- 반영 ----------

def build_entry(row, item, meta, today, causes_doc, policy):
    cause_id = row["cause"]
    detail, chose = "", None
    if item:
        oi = row["oi"]
        if oi is None and cause_id:                       # 보기 표기 없는 구형 텍스트: 원인으로 역추적
            cands = [k for k, o in enumerate(item["o"])
                     if o.get("cause") == cause_id and k != item["a"]]
            oi = cands[0] if len(cands) == 1 else None
        if oi is not None and 0 <= oi < len(item["o"]):
            opt = item["o"][oi]
            chose, detail = opt["t"], opt.get("why", "")
            cause_id = cause_id or opt.get("cause")

    # '찍어서 맞음' 줄에는 확신도가 붙지 않는다 — 그 자체가 guess다.
    conf_id = row["conf"] or ("guess" if row["kind"] == "guess_correct" else "unknown")
    if not cause_id:
        cause_id = "C2"                                   # 원인을 못 잡으면 지식 부재로 둔다

    learning = needs_learning(conf_id, cause_id, causes_doc)
    due, gap = (None, None) if learning else first_due(today, conf_id, cause_id, causes_doc, policy)

    e = {
        "id": "%s_%s_%s" % (today.isoformat(), meta["subject"], row["q"]),
        "exam": {
            "id": "bank-" + meta["id"],
            "date": today.isoformat(),
            "subject": meta["subject"],
            "scope": "고난도 문제은행 · " + meta["title"],
        },
        "source_type": "bank",
        "q": row["q"],
        "format": item["type"] if item else "선다",
        "level": item.get("level") if item else None,
        "result": "wrong" if row["kind"] == "wrong" else "guess_correct",
        "points": None,
        "topic": [meta["unit"]],
        "cause": {"primary": cause_id, "secondary": [], "detail": detail},
        "confidence": conf_id,
        "chose": chose,
        "confused_with": None,
        "links": {
            "app": "exam_track/problem_bank/bank.html?set=" + meta["id"],
            "concept": meta.get("source_app", ""),
        },
        "gaps": [],
        "retest": {
            "state": "learning" if learning else "scheduled",
            "rung": 0, "streak": 0,
            "due": None if learning else due.isoformat(),
            "history": [],
        },
        "created": today.isoformat(),
        "updated": today.isoformat(),
    }
    if learning:
        e["retest"]["learning_note"] = (
            "찍어서 맞음 — 모르는 상태다. 개념 확인 후 출제"
            if row["kind"] == "guess_correct" else "지식 부재 — 학습 후 출제")
    return e, gap


def apply_wrong(entry, row, item, today, causes_doc, policy):
    """또 틀렸다 → 사다리를 0으로 되돌리고 이력을 남긴다."""
    r = entry["retest"]
    r.setdefault("history", []).append({
        "date": today.isoformat(),
        "result": "wrong" if row["kind"] == "wrong" else "guess_correct",
        "confidence": row["conf"] or "unknown",
        "cause": row["cause"],
    })
    r["rung"], r["streak"] = 0, 0
    conf_id = row["conf"] or ("guess" if row["kind"] == "guess_correct" else "unknown")
    cause_id = row["cause"] or entry["cause"]["primary"]
    if needs_learning(conf_id, cause_id, causes_doc):
        r["state"], r["due"] = "learning", None
    else:
        r["state"] = "scheduled"
        r["due"] = (today + timedelta(days=1)).isoformat()   # policy.on_result.wrong
    entry["confidence"] = conf_id
    entry["cause"]["primary"] = cause_id
    if item and row["oi"] is not None and 0 <= row["oi"] < len(item["o"]):
        opt = item["o"][row["oi"]]
        entry["chose"] = opt["t"]
        entry["cause"]["detail"] = opt.get("why", entry["cause"].get("detail", ""))
    entry["updated"] = today.isoformat()
    return sum(1 for h in r["history"] if h.get("result") == "wrong") + 1


def apply_correct(entry, row, today, causes_doc, policy):
    """맞혔다 → 사다리를 한 칸 올린다. 이게 있어야 간격 반복이 앞으로 나간다."""
    r = entry["retest"]
    ladder = policy["ladder_days"]
    r.setdefault("history", []).append({
        "date": today.isoformat(), "result": "correct",
        "confidence": row["conf"] or "unknown",
    })
    r["rung"] = min(r.get("rung", 0) + 1, len(ladder) - 1)
    r["streak"] = r.get("streak", 0) + 1
    need = conf_of(entry.get("confidence", "unknown"), causes_doc)["policy"]["require_correct_streak"]
    if r["streak"] >= need and r["rung"] >= policy["mastered_rung"]:
        r["state"], r["due"] = "mastered", None
        note = "mastered"
    else:
        r["state"] = "scheduled"
        r["due"] = (today + timedelta(days=ladder[r["rung"]])).isoformat()
        note = "%s (+%d일)" % (r["due"], ladder[r["rung"]])
    if row["conf"]:
        entry["confidence"] = row["conf"]
    entry["updated"] = today.isoformat()
    return note, r


def recount(db):
    by = {}
    for e in db["entries"]:
        s = e["retest"]["state"]
        by[s] = by.get(s, 0) + 1
    db["counts"] = {"total": len(db["entries"]),
                    "scheduled": by.get("scheduled", 0),
                    "learning": by.get("learning", 0),
                    "mastered": by.get("mastered", 0)}
    if by.get("paused"):
        db["counts"]["paused"] = by["paused"]


# ---------- main ----------

def main():
    ap = argparse.ArgumentParser(description="앱 결과 텍스트를 약점 DB에 반영한다.")
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

    rows = parse(text)
    if not rows:
        print("반영할 항목이 없다. 형식을 확인하자 (앱의 '결과 복사' 텍스트를 그대로 붙여 넣는다).")
        return 0

    items, owner = load_all_sets()
    causes_doc = load_json(os.path.join(CORE, "taxonomy", "causes.json"))
    policy = load_json(os.path.join(CORE, "retest", "policy.json"))
    db = load_json(DB_PATH)
    by_q = {e["q"]: e for e in db["entries"]}

    added = updated = advanced = skipped = 0
    report = []
    for row in rows:
        q = row["q"]
        item, meta = items.get(q), owner.get(q)
        exist = by_q.get(q)

        if row["kind"] == "correct":
            if not exist:
                skipped += 1
                report.append((q, "-", "처음부터 맞음 — 약점이 아니므로 기록 안 함", ""))
                continue
            note, r = apply_correct(exist, row, today, causes_doc, policy)
            advanced += 1
            report.append((q, exist["cause"]["primary"],
                           "%d연속 정답 · %d칸" % (r["streak"], r["rung"]), note))
            continue

        if exist:
            meets = apply_wrong(exist, row, item, today, causes_doc, policy)
            updated += 1
            report.append((q, exist["cause"]["primary"], "%d번째 오답" % meets,
                           exist["retest"]["due"] or "학습 대기"))
            continue

        if not meta:
            skipped += 1
            report.append((q, "-", "문제은행에 없는 문항 — 건너뜀", ""))
            continue
        e, gap = build_entry(row, item, meta, today, causes_doc, policy)
        db["entries"].append(e)
        by_q[q] = e
        added += 1
        report.append((q, e["cause"]["primary"], e["retest"]["state"],
                       ("%s (+%d일)" % (e["retest"]["due"], gap)) if gap else "학습 대기"))

    recount(db)
    db["updated"] = today.isoformat()

    w = max([len(r[0]) for r in report] + [10])
    print("날짜 :", today.isoformat())
    print("신규 %d · 재오답 %d · 사다리 전진 %d · 건너뜀 %d" % (added, updated, advanced, skipped))
    print("-" * (w + 46))
    for q, cause, state, when in report:
        print("%s  %-3s  %-24s %s" % (q.ljust(w), cause, state, when))
    print("-" * (w + 46))
    print("DB   :", db["counts"])

    if args.dry_run:
        print("\n[dry-run] 쓰지 않았다.")
        return 0

    with open(DB_PATH, "w", encoding="utf-8") as f:
        json.dump(db, f, ensure_ascii=False, indent=2)
        f.write("\n")
    print("wrote:", os.path.relpath(DB_PATH, ROOT))
    print("\n다음 : python exam_track/tools/build_retest.py")
    return 0


if __name__ == "__main__":
    sys.exit(main())
