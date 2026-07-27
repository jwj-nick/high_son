#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""
build_grade.py — 학기 폴더의 02_text에서 과목별 문항 목록을 뽑아 채점 입력기 데이터를 만든다.

사용:
    python exam_track/tools/build_grade.py                    # 기본 학기(26_High_1-1)
    python exam_track/tools/build_grade.py 2607_High1_Final   # 다른 학기

산출:
    exam_track/app/subjects.js   ← 채점 입력기(grade.html)가 읽는 데이터

왜 필요한가: 시험지 캡쳐→텍스트화는 5과목 다 끝났는데 **채점 결과**가 3개월째 비어 있다.
문항 목록을 미리 뽑아두면 채점 입력이 '번호 타이핑'이 아니라 '버튼 탭'이 된다.
"""
import json
import os
import re
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
APP = os.path.join(ROOT, "exam_track", "app")

SUBJECTS = [
    ("수학", "공통수학1-중간"),
    ("과학", "공통과학1-중간"),
    ("국어", "공통국어1-중간"),
    ("영어", "공통영어1-중간"),
    ("한국사", "한국사1-중간"),
]

QPAT = re.compile(r"^#{1,4}\s*Q\s*(\d{1,2})\b", re.M)
PTPAT = re.compile(r"\|\s*배점\s*\|\s*([0-9.]+)")


def scan(term_dir, folder):
    base = os.path.join(ROOT, "exam_track", term_dir, folder)
    tdir = os.path.join(base, "02_text")
    nums, points = set(), {}
    if os.path.isdir(tdir):
        for fn in sorted(os.listdir(tdir)):
            if not fn.endswith(".md"):
                continue
            txt = open(os.path.join(tdir, fn), encoding="utf-8", errors="replace").read()
            for m in QPAT.finditer(txt):
                nums.add(int(m.group(1)))
            # 배점이 문항 블록에 적혀 있으면 같이 수집 (표 형식이 과목마다 달라 best-effort)
            for blk in re.split(r"^#{1,4}\s*Q\s*", txt, flags=re.M)[1:]:
                mn = re.match(r"(\d{1,2})", blk)
                mp = re.search(r"\[?\s*([0-9]\.[0-9])\s*점", blk[:400])
                if mn and mp:
                    points[int(mn.group(1))] = float(mp.group(1))
    # 이미 만들어진 오답노트(=확정 오답) 표시
    ndir = os.path.join(base, "10_오답노트")
    noted = set()
    if os.path.isdir(ndir):
        for fn in os.listdir(ndir):
            m = re.match(r"Q(\d{1,2})_(?!app|practice)", fn)
            if m and fn.endswith(".md") and "_practice" not in fn:
                noted.add(int(m.group(1)))
    # 논술형은 02_text 헤더 형식이 달라 누락될 수 있다(수학 Q19·Q20 실측).
    # 오답노트가 존재하는 번호는 무조건 문항 목록에 포함시킨다.
    return sorted(nums | noted), points, sorted(noted)


def main():
    term = sys.argv[1] if len(sys.argv) > 1 else "26_High_1-1"
    out = {"term": term, "subjects": []}
    for name, folder in SUBJECTS:
        nums, points, noted = scan(term, folder)
        if not nums:
            continue
        out["subjects"].append({
            "name": name, "folder": folder,
            "questions": nums, "points": {str(k): v for k, v in points.items()},
            "already_noted": noted,
        })
    os.makedirs(APP, exist_ok=True)
    path = os.path.join(APP, "subjects.js")
    with open(path, "w", encoding="utf-8") as f:
        f.write("// 자동 생성 — exam_track/tools/build_grade.py. 직접 수정하지 말 것.\n")
        f.write("window.GRADE_DATA = ")
        f.write(json.dumps(out, ensure_ascii=False, indent=2))
        f.write(";\n")
    print("term  :", term)
    for s in out["subjects"]:
        print("  %-4s %2d문항 (%s~%s) · 오답노트 %d건" % (
            s["name"], len(s["questions"]), s["questions"][0], s["questions"][-1], len(s["already_noted"])))
    print("wrote :", os.path.relpath(path, ROOT))


if __name__ == "__main__":
    main()
