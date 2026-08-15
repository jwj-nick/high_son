#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""
sync_drill.py — 심화 문항·드릴 엔진을 단원앱 폴더로 복사하고, 어긋나면 잡는다.

왜 필요한가
    문항의 정본은 `exam_track/problem_bank/data/<set>.js` 하나다 (검증 도구·작성 규칙·
    리뷰 이력이 전부 거기 붙어 있다). 그런데 실제로 아이가 여는 것은 공개 배포된
    단원앱이므로, 앱 폴더에 **복사본**이 있어야 한다.
    복사본은 반드시 어긋난다 — 그래서 복사와 검사를 한 도구로 묶는다.

사용
    python exam_track/tools/sync_drill.py            # 검사만 (어긋나면 exit 1)
    python exam_track/tools/sync_drill.py --write    # 정본 → 앱 폴더로 복사

무엇이 복사되는가
    subject_hub/_shared/drill.js                → <앱폴더>/drill.js
    exam_track/problem_bank/data/<set>.js       → <앱폴더>/drill_<set>.js

매핑은 아래 MAP에 적는다. 새 단원에 실전 탭을 붙이면 여기 한 줄 추가.
"""
import argparse
import hashlib
import os
import shutil
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
ENGINE = os.path.join(ROOT, "subject_hub", "_shared", "drill.js")
BANK = os.path.join(ROOT, "exam_track", "problem_bank", "data")

# 세트 id -> 그 문항이 붙는 단원앱 폴더 (repo 상대경로)
MAP = {
    "kh2_01": "subject_hub/한국사2/10_app",
    "kh2_02": "subject_hub/한국사2/10_app",
    "kh2_03": "subject_hub/한국사2/10_app",
    "soc2_01": "subject_hub/통합사회2/10_app",
    "soc2_02": "subject_hub/통합사회2/10_app",
    "soc2_03": "subject_hub/통합사회2/10_app",
    "soc2_04": "subject_hub/통합사회2/10_app",
    "soc2_05": "subject_hub/통합사회2/10_app",
    "sci2_01": "subject_hub/통합과학2/10_app",
    "sci2_02": "subject_hub/통합과학2/10_app",
    "sci2_03": "subject_hub/통합과학2/10_app",
    "sci2_04": "subject_hub/통합과학2/10_app",
    "sci2_05": "subject_hub/통합과학2/10_app",
    "sci2_06": "subject_hub/통합과학2/10_app",
    "sci2_07": "subject_hub/통합과학2/10_app",
    "sci2_08": "subject_hub/통합과학2/10_app",
    "sci2_09": "subject_hub/통합과학2/10_app",
}


def digest(path):
    if not os.path.exists(path):
        return None
    with open(path, "rb") as f:
        return hashlib.sha256(f.read()).hexdigest()[:12]


def main():
    ap = argparse.ArgumentParser(description="심화 문항·엔진을 단원앱 폴더로 동기화한다.")
    ap.add_argument("--write", action="store_true", help="복사한다 (기본은 검사만)")
    args = ap.parse_args()

    jobs = []
    for sid, folder in MAP.items():
        dst_dir = os.path.join(ROOT, folder.replace("/", os.sep))
        jobs.append((os.path.join(BANK, sid + ".js"),
                     os.path.join(dst_dir, "drill_%s.js" % sid), sid))
    for folder in sorted(set(MAP.values())):
        dst_dir = os.path.join(ROOT, folder.replace("/", os.sep))
        jobs.append((ENGINE, os.path.join(dst_dir, "drill.js"), "engine"))

    drift = missing = copied = 0
    for src, dst, label in jobs:
        if not os.path.exists(src):
            print("  ❌ 정본 없음 : %s" % os.path.relpath(src, ROOT))
            missing += 1
            continue
        a, b = digest(src), digest(dst)
        rel = os.path.relpath(dst, ROOT)
        if a == b:
            print("  ✅ 동일     : %-52s %s" % (rel, label))
            continue
        state = "없음" if b is None else "어긋남"
        if args.write:
            os.makedirs(os.path.dirname(dst), exist_ok=True)
            shutil.copyfile(src, dst)
            print("  📄 복사(%s): %-50s %s" % (state, rel, label))
            copied += 1
        else:
            print("  ⚠️  %s   : %-52s %s" % (state, rel, label))
            drift += 1

    print()
    if args.write:
        print("복사 %d건 · 정본 누락 %d건" % (copied, missing))
        return 1 if missing else 0
    if drift or missing:
        print("동기화 필요 %d건 · 정본 누락 %d건 → `--write`로 반영" % (drift, missing))
        return 1
    print("전부 동일. 앱 폴더의 복사본이 정본과 일치한다.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
