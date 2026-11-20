#!/usr/bin/env python3
"""Trích dữ liệu từ file Excel Build_sung_Play_Together.xlsx sang js/data.js.

Cách dùng (khi thêm súng / dòng chỉ số / build mới vào Excel):
    python tools/build_data.py "D:/Downloads/Build_sung_Play_Together.xlsx"

Cần: pip install openpyxl
"""
import json
import re
import sys
import unicodedata
import warnings
from datetime import date
from pathlib import Path

import openpyxl

warnings.filterwarnings("ignore")

DEFAULT_SRC = r"D:/Downloads/Build_sung_Play_Together.xlsx"
OUT = Path(__file__).resolve().parent.parent / "js" / "data.js"


def clean(v):
    """Chuẩn hoá ô Excel: số nguyên giữ int, số thực làm tròn 6 chữ số, chuỗi bỏ khoảng trắng."""
    if v is None:
        return None
    if isinstance(v, bool):
        return v
    if isinstance(v, (int, float)):
        f = round(float(v), 6)
        return int(f) if f == int(f) else f
    s = str(v).strip()
    return s or None


def slug(text):
    text = text.replace("đ", "d").replace("Đ", "D")
    text = unicodedata.normalize("NFD", text)
    text = "".join(c for c in text if unicodedata.category(c) != "Mn")
    return re.sub(r"[^a-z0-9]+", "-", text.lower()).strip("-")


def rows(ws, first, last, ncols):
    for r in range(first, last + 1):
        yield r, [clean(ws.cell(r, c).value) for c in range(1, ncols + 1)]


def find_row(ws, prefix):
    for r in range(1, ws.max_row + 1):
        v = ws.cell(r, 1).value
        if isinstance(v, str) and v.strip().startswith(prefix):
            return r
    raise SystemExit(f"Không tìm thấy hàng bắt đầu bằng: {prefix!r} (sheet {ws.title})")


def read_table(ws, title_prefix):
    """Đọc bảng nhỏ: hàng tiêu đề = hàng sau tiêu đề mục, dữ liệu chạy đến hàng trống."""
    t = find_row(ws, title_prefix)
    ncols = ws.max_column
    header = [clean(ws.cell(t + 1, c).value) for c in range(1, ncols + 1)]
    while header and header[-1] is None:
        header.pop()
    data = []
    r = t + 2
    while r <= ws.max_row:
        row = [clean(ws.cell(r, c).value) for c in range(1, len(header) + 1)]
        if row[0] is None or all(v is None for v in row[1:]):
            break
        data.append(row)
        r += 1
    return {"title": clean(ws.cell(t, 1).value), "header": header, "rows": data, "end": r}


def main():
    src = Path(sys.argv[1] if len(sys.argv) > 1 else DEFAULT_SRC)
    if not src.exists():
        raise SystemExit(f"Không thấy file Excel: {src}")
    wb = openpyxl.load_workbook(src, data_only=True)

    # ---- Súng
    ws = wb["Súng"]
    guns = []
    for _, r in rows(ws, 5, 34, 6):
        if not r[0]:
            continue
        guns.append({
            "id": slug(r[0]), "name": r[0],
            "min": r[1], "max": r[2], "speed": r[3], "mag": r[4], "note": r[5],
        })

    # ---- Dòng chỉ số
    ws = wb["Dòng chỉ số"]
    lines = []
    for _, r in rows(ws, 5, 60, 8):
        if not r[0]:
            continue
        lines.append({
            "name": r[0], "tier": r[1],
            "atkPct": r[2], "spdPct": r[3], "spdFlat": r[4],
            "atkFlatMin": r[5], "atkFlatMax": r[6], "note": r[7],
        })

    # ---- Tham số
    ws = wb["Tham số"]
    pet_label = clean(ws["A4"].value) or ""
    m = re.search(r"\(([^)]+)\)", pet_label)
    params = {
        "petBonus": clean(ws["B4"].value),
        "petName": m.group(1) if m else "Pet",
        "petNote": clean(ws["C4"].value),
        "maxSpdFlat": clean(ws["B5"].value),
        "maxSpdFlatNote": clean(ws["C5"].value),
        "maxAtkFlat": clean(ws["B6"].value),
        "maxAtkFlatNote": clean(ws["C6"].value),
        "rows": clean(ws["B7"].value),
    }

    # ---- Build mẫu (sheet Tính build: cột A..G)
    ws = wb["Tính build"]
    builds = []
    for _, r in rows(ws, 5, 36, 7):
        if not r[0]:
            continue
        builds.append({"gun": r[0], "name": r[1], "lines": [x or "(không có dòng)" for x in r[2:7]]})

    # ---- Tổng hợp (văn bản kết luận)
    ws = wb["Tổng hợp"]
    summary = {
        "title": clean(ws["A1"].value),
        "intro": clean(ws["A2"].value),
        "conclusionsTitle": clean(ws["A4"].value),
        "conclusions": [re.sub(r"^\d+\.\s*", "", clean(ws.cell(r, 1).value))
                        for r in range(5, 9) if ws.cell(r, 1).value],
        "legend": clean(ws["A18"].value),
    }

    # ---- Giả thuyết
    ws = wb["Giả thuyết"]
    hypotheses = []
    for _, r in rows(ws, 4, ws.max_row, 2):
        if r[0] and r[1]:
            hypotheses.append({"title": r[0], "body": r[1]})
    hyp_intro = [clean(ws["A1"].value), clean(ws["A2"].value)]

    # ---- Số đo
    ws = wb["Số đo"]
    speed = read_table(ws, "A. ")
    dame = read_table(ws, "B. ")
    dame["note"] = clean(ws.cell(dame["end"], 1).value)
    cases = read_table(ws, "C. ")
    theo_speed = read_table(ws, "Tốc lý thuyết")
    theo_frames = read_table(ws, "Số khung lý thuyết")
    deviation = read_table(ws, "Số khung đo trừ")
    rule = read_table(ws, "Kiểm tra quy tắc")
    d_row = find_row(ws, "D. ")
    verdicts = []
    r = d_row + 1
    while r <= ws.max_row and ws.cell(r, 1).value and ws.cell(r, 2).value:
        verdicts.append({"name": clean(ws.cell(r, 1).value), "text": clean(ws.cell(r, 2).value)})
        r += 1
    for t in (speed, dame, cases, theo_speed, theo_frames, deviation, rule):
        t.pop("end", None)

    # súng nào đã được đo tốc bắn / dame
    speed_guns = {row[1] for row in speed["rows"]}
    dame_text = (dame["title"] or "").lower()  # tiêu đề mục B nêu súng nào đã đo dame
    for g in guns:
        g["measured"] = {"speed": g["name"] in speed_guns, "dame": g["name"].lower() in dame_text}

    data = {
        "meta": {"source": src.name, "generated": date.today().isoformat()},
        "params": params,
        "guns": guns,
        "lines": lines,
        "builds": builds,
        "summary": summary,
        "hypotheses": {"intro": hyp_intro, "items": hypotheses},
        "measurements": {
            "speed": speed, "dame": dame, "cases": cases,
            "theoSpeed": theo_speed, "theoFrames": theo_frames,
            "deviation": deviation, "rule": rule, "verdicts": verdicts,
            "footnote": clean(ws.cell(find_row(ws, "Chữ xanh"), 1).value),
        },
    }

    OUT.parent.mkdir(parents=True, exist_ok=True)
    OUT.write_text(
        "/* File sinh tự động bởi tools/build_data.py từ Excel. Đừng sửa tay. */\n"
        "window.PT_DATA = " + json.dumps(data, ensure_ascii=False, indent=1) + ";\n",
        encoding="utf-8",
    )
    print(f"OK: {len(guns)} súng, {len(lines)} loại dòng, {len(builds)} build mẫu -> {OUT}")


if __name__ == "__main__":
    main()
