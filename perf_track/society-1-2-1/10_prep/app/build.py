# -*- coding: utf-8 -*-
"""
build.py — 정본 md(01·02·03) → 학습 앱(perf_economy.html) + 프린트 팩(../../90_output/print_pack.html)

정본이 SSOT다. 앱·프린트에 직접 손대지 말고 md를 고친 뒤 이 스크립트를 다시 돌린다.
    python build.py
"""
import io, json, os, re, sys

HERE = os.path.dirname(os.path.abspath(__file__))
PREP = os.path.dirname(HERE)
ROOT = os.path.dirname(PREP)

def read(p):
    return io.open(p, encoding="utf-8").read()

# ---------------------------------------------------------------- inline md
def esc(s):
    return s.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")

def inline(s):
    s = esc(s)
    s = re.sub(r"\*\*(.+?)\*\*", r'<b class="k">\1</b>', s)
    s = re.sub(r"`([^`]+)`", r"<code>\1</code>", s)
    return s

# ---------------------------------------------------------------- block md → html
def md_to_html(text, hshift=0):
    """소규모 마크다운 변환기: 제목·표·목록·인용·문단·체크박스. 헤딩 레벨은 hshift만큼 내린다."""
    lines = text.split("\n")
    out, i, n = [], 0, len(lines)
    para = []

    def flush_para():
        if para:
            out.append("<p>" + inline(" ".join(para)) + "</p>")
            para.clear()

    while i < n:
        ln = lines[i].rstrip()
        if not ln.strip():
            flush_para(); i += 1; continue
        # table
        if ln.lstrip().startswith("|"):
            flush_para()
            rows = []
            while i < n and lines[i].lstrip().startswith("|"):
                rows.append(lines[i].strip()); i += 1
            out.append(table_html(rows)); continue
        m = re.match(r"^(#{1,6})\s+(.*)$", ln)
        if m:
            flush_para()
            lvl = min(6, len(m.group(1)) + hshift)
            out.append("<h%d>%s</h%d>" % (lvl, inline(m.group(2)), lvl)); i += 1; continue
        if ln.startswith(">"):
            flush_para()
            q = []
            while i < n and lines[i].startswith(">"):
                q.append(lines[i][1:].strip()); i += 1
            out.append("<blockquote>" + inline(" ".join(q)) + "</blockquote>"); continue
        if re.match(r"^\s*[-•]\s+", ln):
            flush_para()
            items = []
            while i < n and re.match(r"^\s*[-•]\s+", lines[i]):
                t = re.sub(r"^\s*[-•]\s+", "", lines[i].rstrip())
                if t.startswith("[ ] "):
                    items.append('<li class="chk">☐ ' + inline(t[4:]) + "</li>")
                else:
                    items.append("<li>" + inline(t) + "</li>")
                i += 1
            out.append("<ul>" + "".join(items) + "</ul>"); continue
        if re.match(r"^\s*\d+\.\s+", ln):
            flush_para()
            items = []
            while i < n and re.match(r"^\s*\d+\.\s+", lines[i]):
                t = re.sub(r"^\s*\d+\.\s+", "", lines[i].rstrip())
                items.append("<li>" + inline(t) + "</li>"); i += 1
            out.append("<ol>" + "".join(items) + "</ol>"); continue
        if ln.strip() == "---":
            flush_para(); out.append("<hr>"); i += 1; continue
        para.append(ln.strip()); i += 1
    flush_para()
    return "\n".join(out)

def split_row(row):
    row = row.strip()
    if row.startswith("|"): row = row[1:]
    if row.endswith("|"): row = row[:-1]
    # 셀 안의 '·'는 줄바꿈 후보 — 표 셀에서만 <br>로 바꾼다
    return [c.strip() for c in row.split("|")]

def cell_html(c):
    h = inline(c)
    # " · " 구분자를 줄바꿈으로 (첫 항목 앞의 '· '도 정리)
    h = re.sub(r"\s+·\s+", "<br>· ", h)
    if h.startswith("· "): h = h  # 그대로
    return h

def table_html(rows):
    rows = [r for r in rows if r.strip()]
    if len(rows) < 2: return ""
    head = split_row(rows[0])
    body = [split_row(r) for r in rows[2:]] if re.match(r"^\|?\s*:?-{2,}", rows[1]) else [split_row(r) for r in rows[1:]]
    h = ['<div class="tw"><table><thead><tr>' + "".join("<th>%s</th>" % inline(c) for c in head) + "</tr></thead><tbody>"]
    for r in body:
        cells = r + [""] * (len(head) - len(r))
        h.append("<tr>" + "".join("<td>%s</td>" % cell_html(c) for c in cells[:len(head)]) + "</tr>")
    h.append("</tbody></table></div>")
    return "".join(h)

# ---------------------------------------------------------------- 01 answer keys
def parse_answer_keys(md):
    qs = []
    parts = re.split(r"^## 질문 (\d) — (.+)$", md, flags=re.M)
    # parts: [pre, num, title, body, num, title, body, ...]
    for k in range(1, len(parts), 3):
        num, title, body = int(parts[k]), parts[k + 1].strip(), parts[k + 2]
        secs = re.split(r"^### (\d)\) (.+)$", body, flags=re.M)
        sec = {}
        for j in range(1, len(secs), 3):
            sec[int(secs[j])] = (secs[j + 1].strip(), secs[j + 2].strip().rstrip("-").strip())
        def body_of(i): return sec.get(i, ("", ""))[1]
        # 뼈대: 번호 목록 → 문자열 리스트
        bones = [re.sub(r"^\s*\d+\.\s+", "", l).strip() for l in body_of(2).split("\n") if re.match(r"^\s*\d+\.\s+", l)]
        keys = [l[len("- [ ] "):].strip() for l in body_of(5).split("\n") if l.startswith("- [ ] ")]
        qs.append({
            "n": num, "title": title,
            "decompose": md_to_html(body_of(1)),
            "bones": [inline(b) for b in bones],
            "A": md_to_html(body_of(3)),
            "B": md_to_html(body_of(4)),
            "keys": [inline(x) for x in keys],
            "deduct": md_to_html(body_of(6)),
            "variants": md_to_html(body_of(7)),
        })
    return qs

# ---------------------------------------------------------------- 02 question bank
TYPE_ORDER = ["통째 서술형", "부분 서술형", "비교형", "사례 판별형", "계산형", "용어 정의형"]

def parse_bank(md):
    items = []
    blocks = re.split(r"^### (Q(\d)-(\d\d)) \[(.+?) · (.+?)\] (.+)$", md, flags=re.M)
    # [pre, id, qn, seq, type, pts, stem, body, ...]
    for k in range(1, len(blocks), 7):
        qid, qn, seq, typ, pts, stem, body = blocks[k], int(blocks[k + 1]), blocks[k + 2], blocks[k + 3], blocks[k + 4], blocks[k + 5], blocks[k + 6]
        body = body.split("\n---")[0]
        def field(name):
            m = re.search(r"^- %s:\s*(.*?)(?=^- \S|\Z)" % re.escape(name), body, flags=re.M | re.S)
            return m.group(1).strip() if m else ""
        h1, h2, ans, keys, back = field("힌트 1"), field("힌트 2"), field("모범답안"), field("채점 키워드"), field("돌아갈 곳")
        full = re.match(r"① 질문 (\d) → A", ans)
        keylist = [inline(x.strip()) for x in re.split(r"\[ \]", keys) if x.strip()]
        items.append({
            "id": qid, "q": qn, "seq": seq, "type": typ, "pts": pts,
            "stem": inline(stem), "h1": inline(h1), "h2": inline(h2),
            "ans": "" if full else md_to_html(ans), "full": int(full.group(1)) if full else 0,
            "keys": keylist, "keysFull": bool(full), "back": inline(back),
        })
    return items

# ---------------------------------------------------------------- 03 digest
def parse_digest(md):
    topics = []
    parts = re.split(r"^## 주제 (\d+) — (.+)$", md, flags=re.M)
    for k in range(1, len(parts), 3):
        topics.append({"n": int(parts[k]), "title": parts[k + 1].strip(), "html": md_to_html(parts[k + 2].strip(), hshift=1)})
    return topics

# ---------------------------------------------------------------- questions (notice)
def parse_notice(md):
    return [re.sub(r"^\d+\.\s+", "", l).strip() for l in md.split("\n") if re.match(r"^\d+\.\s+", l)]

# ---------------------------------------------------------------- print pack pieces
LINES_BY_TYPE = {"통째 서술형": 14, "부분 서술형": 8, "비교형": 8, "사례 판별형": 8, "계산형": 8, "용어 정의형": 6}

def print_pack_html(data, tpl):
    q = data["questions"]; keys = data["keys"]; bank = data["bank"]; digest = data["digest"]
    out = []
    # 1. 4대 질문 카드
    out.append('<section class="page"><h2>Ⅰ. 4대 질문 모범답안 카드 (각 5점)</h2>')
    for k in keys:
        out.append('<div class="card"><div class="t">질문 %d. %s</div>' % (k["n"], esc(q[k["n"] - 1])))
        out.append('<div class="lab">질문 분해</div>%s' % k["decompose"])
        out.append('<div class="lab">암기용 뼈대</div><ol class="bones">%s</ol>' % "".join("<li>%s</li>" % b for b in k["bones"]))
        out.append('<div class="lab">모범답안 A (만점형)</div><div class="ans">%s</div>' % k["A"])
        out.append('<div class="lab">모범답안 B (압축형)</div><div class="ans">%s</div>' % k["B"])
        out.append('<div class="lab">채점 키워드</div><ul class="chk">%s</ul>' % "".join('<li>☐ %s</li>' % x for x in k["keys"]))
        out.append('<div class="lab">감점 포인트</div>%s</div>' % k["deduct"])
    out.append("</section>")
    # 2. 부교재 정리
    out.append('<section class="page"><h2>Ⅱ. 부교재 정리 (주제 11~16 완성본)</h2>')
    for t in digest:
        out.append('<div class="topic"><h3>주제 %d. %s</h3>%s</div>' % (t["n"], esc(t["title"]), t["html"]))
    out.append("</section>")
    # 3. 연습 문항 (문제 쪽)
    out.append('<section class="page"><h2>Ⅲ. 연습 문항 — 문제 (답은 Ⅳ에)</h2><p class="small">문항만 보고 볼펜으로 쓴다. 다 쓰고 나서 Ⅳ의 채점 키워드로 스스로 채점한다.</p>')
    cur = 0
    for it in bank:
        if it["q"] != cur:
            cur = it["q"]
            out.append('<h3 class="qh">질문 %d — %s</h3>' % (cur, esc(q[cur - 1])))
        nl = LINES_BY_TYPE.get(it["type"], 8)
        out.append('<div class="q"><div class="n">%s <span class="pt">[%s · %s]</span></div><div class="stem">%s</div>%s</div>'
                   % (it["id"], esc(it["type"]), esc(it["pts"]), it["stem"], '<div class="lines"></div>' * nl))
    out.append("</section>")
    # 4. 답안·채점표
    out.append('<section class="page"><h2>Ⅳ. 연습 문항 — 모범답안·채점표</h2>')
    cur = 0
    for it in bank:
        if it["q"] != cur:
            cur = it["q"]
            out.append('<h3 class="qh">질문 %d</h3>' % cur)
        if it["full"]:
            k = keys[it["full"] - 1]
            ans = '<div class="ans"><div class="lab">A (만점형)</div>%s<div class="lab">B (압축형)</div>%s</div>' % (k["A"], k["B"])
            kl = k["keys"]
        else:
            ans = '<div class="ans">%s</div>' % it["ans"]
            kl = it["keys"]
        out.append('<div class="q nobreak"><div class="n">%s <span class="pt">[%s · %s]</span></div><div class="stem">%s</div>'
                   '<div class="hint">힌트 1: %s<br>힌트 2: %s</div>%s<ul class="chk">%s</ul></div>'
                   % (it["id"], esc(it["type"]), esc(it["pts"]), it["stem"], it["h1"], it["h2"], ans,
                      "".join('<li>☐ %s</li>' % x for x in kl)))
    out.append("</section>")
    return tpl.replace("<!--__BODY__-->", "\n".join(out))

# ---------------------------------------------------------------- main
def main():
    keys = parse_answer_keys(read(os.path.join(PREP, "01_answer_keys.md")))
    bank = parse_bank(read(os.path.join(PREP, "02_question_bank.md")))
    digest = parse_digest(read(os.path.join(PREP, "03_workbook_digest.md")))
    questions = parse_notice(read(os.path.join(ROOT, "00_notice", "questions.md")))
    assert len(keys) == 4, "answer keys: %d" % len(keys)
    assert len(questions) == 4, "questions: %d" % len(questions)
    assert len(digest) == 6, "digest topics: %d" % len(digest)
    for k in keys:
        assert k["bones"] and k["keys"] and k["A"] and k["B"], "answer key %d incomplete" % k["n"]
    for it in bank:
        assert it["h1"] and it["h2"] and (it["ans"] or it["full"]) and (it["keys"] or it["keysFull"]), "bank item %s incomplete" % it["id"]
    data = {"questions": questions, "keys": keys, "bank": bank, "digest": digest,
            "types": TYPE_ORDER, "built": "2026-09-12"}
    js = json.dumps(data, ensure_ascii=False).replace("</", "<\\/")
    app_tpl = read(os.path.join(HERE, "template_app.html"))
    app = app_tpl.replace("/*__DATA__*/null", js)
    io.open(os.path.join(HERE, "perf_economy.html"), "w", encoding="utf-8").write(app)
    print_tpl = read(os.path.join(HERE, "template_print.html"))
    pp = print_pack_html(data, print_tpl)
    outdir = os.path.join(ROOT, "90_output"); os.makedirs(outdir, exist_ok=True)
    io.open(os.path.join(outdir, "print_pack.html"), "w", encoding="utf-8").write(pp)
    sys.stdout.write("keys=%d bank=%d digest=%d  app=%dB print=%dB\n" % (len(keys), len(bank), len(digest), len(app.encode("utf-8")), len(pp.encode("utf-8"))))

if __name__ == "__main__":
    main()
