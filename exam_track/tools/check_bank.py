#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""
check_bank.py — 문제은행 세트의 기계 검사. 커밋 전에 돌린다.

사용:
    python exam_track/tools/check_bank.py            # 레지스트리의 전 세트
    python exam_track/tools/check_bank.py kh2_03     # 한 세트만

무엇을 잡는가 (전부 '기계가 확실히 판정할 수 있는 것'만):
    · 인라인 JS 문법 (node --check)
    · '<한글' 잘림 (innerHTML로 들어가는 material에서 자주 났다)
    · 정답 보기에 cause·why 누출 → 앱이 정답을 역추적할 수 있다
    · 오답 보기의 cause·why 누락 → 진단이 '미분류'로 샌다
    · causes.json에 없는 cause 코드
    · 순서배열 외 단일 원인 → 어느 보기를 골라도 같은 진단이 나온다
    · a 범위 · 보기 수 · id 중복 · solve 완전성
    · sets.js의 n·unit이 데이터와 일치하는가
    · unit이 topics.json canonical에 있는가

무엇을 잡지 못하는가 (사람·검증 에이전트의 몫 — PLAN.md §3):
    · 정답키가 실제로 맞는가, 유일한가
    · why에 적힌 사실이 참인가
    · C3에 혼동 쌍이 명시됐는가
      ↑ 키워드로 검사해 봤다가 전부 오탐이었다. 표현이 무한하고, 기계 검사로 두면
        '키워드에 맞춰 쓰게' 되어 오히려 해롭다. 검증 게이트에서 본다.
    · 발문의 시기 한정과 보기의 시기가 어긋나 복수정답이 되는가
      ↑ kh2_03에서 두 번 났다. 기계로는 못 잡는다. 게이트가 유일한 방어선이다.
"""
import json
import os
import subprocess
import sys
from collections import Counter

ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
BANK = os.path.join(ROOT, "exam_track", "problem_bank")
CORE = os.path.join(ROOT, "exam_track", "_core")


def load_js_object(path, opener="{", closer="}"):
    src = open(path, encoding="utf-8").read()
    return src, json.loads(src[src.index(opener):src.rindex(closer) + 1])


def main():
    only = sys.argv[1] if len(sys.argv) > 1 else None

    causes_doc = json.load(open(os.path.join(CORE, "taxonomy", "causes.json"), encoding="utf-8"))
    valid_causes = {c["id"] for c in causes_doc["causes"]}
    topics = json.load(open(os.path.join(CORE, "taxonomy", "topics.json"), encoding="utf-8"))
    canon = set()
    for subj, groups in topics["canonical"].items():
        for k, v in groups.items():
            if isinstance(v, list):
                canon |= set(v)

    _, reg = load_js_object(os.path.join(BANK, "data", "sets.js"), "[", "]")
    if only:
        reg = [e for e in reg if e["id"] == only]
        if not reg:
            raise SystemExit("레지스트리에 없는 세트: " + only)

    total_v, total_items = 0, 0
    for e in reg:
        sid = e["id"]
        path = os.path.join(BANK, "data", sid + ".js")
        v = []
        if not os.path.exists(path):
            print("%-8s 파일 없음" % sid)
            total_v += 1
            continue

        r = subprocess.run(["node", "--check", path], capture_output=True, text=True)
        if r.returncode:
            v.append((sid, "JS 문법: " + r.stderr.strip().splitlines()[0]))
        src, d = load_js_object(path)

        trunc = [src[i:i + 18] for i, c in enumerate(src)
                 if c == "<" and i + 1 < len(src) and "가" <= src[i + 1] <= "힣"]
        for t in trunc:
            v.append((sid, "'<한글' 잘림 의심: " + t))

        if d["unit"] not in canon:
            v.append((sid, "unit이 topics.json canonical에 없다: " + d["unit"]))
        if d["unit"] != e.get("unit"):
            v.append((sid, "sets.js unit 불일치"))
        items = d["items"]
        if len(items) != e.get("n"):
            v.append((sid, "sets.js n 불일치: %d vs %s" % (len(items), e.get("n"))))

        causes, types, levels = Counter(), Counter(), Counter()
        for it in items:
            qid = it["id"]
            types[it["type"]] += 1
            levels[it["level"]] += 1
            o, a = it["o"], it["a"]
            if len(o) < 4:
                v.append((qid, "보기 %d개" % len(o)))
            if not (0 <= a < len(o)):
                v.append((qid, "a 범위 벗어남"))
                continue
            if "cause" in o[a] or "why" in o[a]:
                v.append((qid, "정답 보기에 cause/why 누출"))
            for k, opt in enumerate(o):
                if k == a:
                    continue
                c = opt.get("cause")
                if not c:
                    v.append((qid, "오답 보기%d cause 없음" % (k + 1)))
                elif c not in valid_causes:
                    v.append((qid, "미정의 cause %s (보기%d)" % (c, k + 1)))
                else:
                    causes[c] += 1
                if not opt.get("why"):
                    v.append((qid, "오답 보기%d why 없음" % (k + 1)))
            s = it.get("solve") or {}
            if not s.get("key"):
                v.append((qid, "solve.key 없음"))
            if not s.get("trap"):
                v.append((qid, "solve.trap 없음"))
            if it["type"] != "순서배열":
                cs = {opt.get("cause") for k, opt in enumerate(o) if k != a}
                if len(cs) == 1:
                    v.append((qid, "단일 원인 %s — 어느 보기를 골라도 같은 진단" % cs.pop()))

        ids = [i["id"] for i in items]
        dup = [x for x, n in Counter(ids).items() if n > 1]
        for x in dup:
            v.append((sid, "id 중복 " + x))

        total_items += len(items)
        total_v += len(v)
        vmark = ("게이트 %s" % e["verified"]) if e.get("verified") else "⚠️ 미검증 — 배포 차단"
        print("%-8s %2d문항 · 정답위치 %s · %s" % (
            sid, len(items), dict(sorted(Counter(i["a"] for i in items).items())), vmark))
        print("         유형 %s" % dict(types))
        print("         난이도 %s" % dict(levels))
        print("         오답원인 %s" % dict(sorted(causes.items())))
        if v:
            print("         ❌ 위반 %d" % len(v))
            for qid, msg in v:
                print("            %-14s %s" % (qid, msg))
        else:
            print("         ✅ 위반 없음")

    pend = [e["id"] for e in reg if not e.get("verified")]
    print("\n세트 %d · 문항 %d · 위반 %d" % (len(reg), total_items, total_v))
    if pend:
        print("⚠️ 검증 게이트 대기: %s — 배포가 차단된다" % ", ".join(pend))
    print("※ 정답키 정확성·why의 사실성·C3 혼동쌍·복수정답 위험은 기계가 못 본다 — 검증 게이트에서 본다.")
    return 1 if total_v else 0


if __name__ == "__main__":
    sys.exit(main())
