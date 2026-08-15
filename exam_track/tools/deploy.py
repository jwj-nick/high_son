#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""
deploy.py — 단원앱을 공개 저장소로 복사한다.

    private  C:\\Kids\\70_HighSchool\\subject_hub\\<과목>\\10_app\\
       →     C:\\Nick\\30_Apps\\jwj-nick.github.io\\high1\\<폴더>\\
       →     https://jwj-nick.github.io/high1/<폴더>/

사용:
    python exam_track/tools/deploy.py            # 무엇이 나갈지 보여주기만 (기본)
    python exam_track/tools/deploy.py --write    # 실제 복사
    python exam_track/tools/deploy.py --only 한국사2

⚠️ 공개로 나가는 행위다. 그래서 두 가지를 강제한다.
  1) **기본이 dry-run.** 실수로 나가지 않는다.
  2) **개인정보 스캔.** 아이의 약점 데이터·로컬 절대경로·비공개 문서 참조가 섞여 있으면
     복사하지 않고 멈춘다. 공개해도 되는 것은 "문항·정답·해설과 개념 앱"뿐이다.
     (아이의 풀이 기록은 브라우저 localStorage에만 남으므로 파일로 나가지 않는다.)

복사 대상은 SUBJECTS에 적는다. 새 과목에 실전 탭을 붙이면 여기 한 줄 추가.
"""
import argparse
import hashlib
import json
import os
import re
import shutil
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
PUBLIC = os.path.join("C:" + os.sep, "Nick", "30_Apps", "jwj-nick.github.io", "high1")

# 과목 폴더 -> 공개 폴더
SUBJECTS = {
    "한국사1": "history",
    "한국사2": "history",
    "통합사회1": "society",
    "통합사회2": "society",
    "통합과학1": "science",
    "통합과학2": "science",
    "공통수학1": "math",
    "공통수학2": "math",
}

def unverified_sets():
    """검증 게이트를 통과하지 않은 세트 id. 이 문항 데이터는 공개하지 않는다.

    기계 검사(check_bank.py)는 정답키 오류·복수정답을 못 잡는다 — 실측으로 확인됐다
    (kh2_03의 치명 2건이 스키마·문법을 전부 통과했다). 게이트가 유일한 방어선이므로,
    통과하지 않은 세트가 아이 손에 가지 않도록 배포 단계에서 막는다.
    """
    p = os.path.join(ROOT, "exam_track", "problem_bank", "data", "sets.js")
    if not os.path.exists(p):
        return set()
    src = open(p, encoding="utf-8").read()
    reg = json.loads(src[src.index("["):src.rindex("]") + 1])
    return {e["id"] for e in reg if not e.get("verified")}


# 나가면 안 되는 것 — 하나라도 걸리면 그 파일은 복사하지 않는다
FORBIDDEN = [
    (re.compile(r"weakness_db|entries\.json"), "약점 DB 참조"),
    (re.compile(r"C:\\\\?Kids|C:/Kids"), "로컬 절대경로"),
    (re.compile(r"exam_track/_core"), "비공개 코어 참조"),
    (re.compile(r"LEARNING_DESIGN|HANDOFF\.md"), "설계 문서 참조"),
    (re.compile(r'"chose"\s*:|"confused_with"'), "약점 항목 스키마"),
]


DRILL_REF = re.compile(r"drill_([a-zA-Z0-9_]+)\.js")


def referenced_pending(path, pending):
    """이 파일(주로 단원앱 HTML)이 <script src="drill_<id>.js">로 참조하는 세트 중
    미검증인 것이 있으면 그 id를 돌려준다.

    실측: sci2_01만 검증됐는데 deploy.py가 drill_sci2_01.js는 막으면서도
    sci2_acidbase.html(⚡실전 탭이 drill_sci2_02.js를 참조)은 "갱신"으로 통과시켰다.
    그대로 나갔으면 공개 페이지에서 스크립트가 404 나 탭이 빈 채로 깨졌을 것이다.
    HTML 자체도 자신이 참조하는 데이터의 검증 상태를 물려받아야 한다.
    """
    try:
        s = open(path, encoding="utf-8").read()
    except UnicodeDecodeError:
        return None
    for m in DRILL_REF.finditer(s):
        if m.group(1) in pending:
            return m.group(1)
    return None


def digest(p):
    if not os.path.exists(p):
        return None
    with open(p, "rb") as f:
        return hashlib.sha256(f.read()).hexdigest()[:12]


def scan(path):
    """공개해도 되는 내용인지 본다. 문제 목록을 돌려준다(비어 있으면 통과)."""
    try:
        s = open(path, encoding="utf-8").read()
    except UnicodeDecodeError:
        return []                      # 이미지 등 바이너리
    return [why for rx, why in FORBIDDEN if rx.search(s)]


def collect(only=None):
    jobs = []
    for subj, folder in SUBJECTS.items():
        if only and subj != only:
            continue
        src_dir = os.path.join(ROOT, "subject_hub", subj, "10_app")
        if not os.path.isdir(src_dir):
            continue
        dst_dir = os.path.join(PUBLIC, folder)
        for f in sorted(os.listdir(src_dir)):
            if not (f.endswith(".html") or f.endswith(".js") or f.endswith(".png")):
                continue
            jobs.append((subj, os.path.join(src_dir, f), os.path.join(dst_dir, f)))
    return jobs


def main():
    ap = argparse.ArgumentParser(description="단원앱을 공개 저장소로 복사한다.")
    ap.add_argument("--write", action="store_true", help="실제 복사 (기본은 dry-run)")
    ap.add_argument("--only", help="한 과목만 (예: 한국사2)")
    a = ap.parse_args()

    if not os.path.isdir(PUBLIC):
        raise SystemExit("공개 저장소를 찾지 못했다: " + PUBLIC)

    jobs = collect(a.only)
    if not jobs:
        raise SystemExit("복사할 것이 없다.")

    pending = unverified_sets()
    same = new = upd = blocked = 0
    for subj, src, dst in jobs:
        rel = os.path.relpath(dst, PUBLIC)
        base = os.path.basename(src)
        sid = base[len("drill_"):-3] if base.startswith("drill_") and base.endswith(".js") else None
        if sid and sid in pending:
            print("  🔒 미검증  %-44s %s — 검증 게이트 통과 전" % (rel, sid))
            blocked += 1
            continue
        ref = referenced_pending(src, pending)
        if ref:
            print("  🔒 미검증  %-44s %s 참조 — 검증 게이트 통과 전" % (rel, ref))
            blocked += 1
            continue
        bad = scan(src)
        if bad:
            print("  🚫 차단  %-44s %s" % (rel, ", ".join(bad)))
            blocked += 1
            continue
        ds, dd = digest(src), digest(dst)
        if ds == dd:
            same += 1
            continue
        state = "신규" if dd is None else "갱신"
        if a.write:
            os.makedirs(os.path.dirname(dst), exist_ok=True)
            shutil.copyfile(src, dst)
        print("  %s %s  %-44s %s" % ("📤" if a.write else "  ", state, rel, subj))
        if dd is None:
            new += 1
        else:
            upd += 1

    print("\n동일 %d · 신규 %d · 갱신 %d · 차단 %d" % (same, new, upd, blocked))
    if blocked:
        print("⚠️ 차단된 파일이 있다 — 공개하면 안 되는 내용이거나, 검증 게이트를 통과하지 않은 세트다.")
        print("   검증 후 data/sets.js의 해당 세트에 \"verified\": \"YYYY-MM-DD\" 를 채운다.")
        return 1
    if not a.write:
        print("dry-run이다. 실제로 내보내려면 --write")
    else:
        print("복사 완료. 공개 저장소에서 커밋·푸시해야 실제로 반영된다:")
        print("  cd /c/Nick/30_Apps/jwj-nick.github.io && git add -A && git commit && git push")
    return 0


if __name__ == "__main__":
    sys.exit(main())
