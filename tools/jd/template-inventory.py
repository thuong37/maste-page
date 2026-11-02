"""Giai đoạn 3: kiểm kê mục nội dung của từng template CV (bản tiếng Việt).
Chạy: python -X utf8 tools/jd/template-inventory.py
Đầu ra: assets/data/cv-template-sections.json
Đọc danh sách từ assets/data/cv-style-mapping/style_cv.csv (cột duong_dan_tieng_viet).
"""
import csv, json, re, sys, unicodedata
from pathlib import Path
import fitz  # PyMuPDF

ROOT = Path(__file__).resolve().parents[2]
CSV = ROOT / "assets/data/cv-style-mapping/style_cv.csv"
OUT = ROOT / "assets/data/cv-template-sections.json"


def fold(s):
    s = unicodedata.normalize("NFD", s.replace("đ", "d").replace("Đ", "D"))
    return "".join(c for c in s if unicodedata.category(c) != "Mn").lower()


# Khóa mục (khớp README giai đoạn 2) -> regex trên tiêu đề mục đã bỏ dấu
SECTION_RE = {
    "muc-tieu-nghe-nghiep": r"muc tieu|gioi thieu ban than|tom tat|about me|profile|objective|thong tin ca nhan va muc tieu",
    "kinh-nghiem-lam-viec": r"kinh nghiem|qua trinh lam viec|lich su lam viec|work experience|experience",
    "hoc-van": r"hoc van|giao duc|dao tao|education",
    "ky-nang-chuyen-mon": r"^ky nang$|ky nang chuyen mon|ky nang chinh|skills|chuyen mon",
    "ky-nang-mem": r"ky nang mem|soft skill",
    "cong-cu-phan-mem": r"cong cu|phan mem|tools|cong nghe",
    "chung-chi": r"chung chi|chung nhan|certificat",
    "du-an": r"du an|project",
    "thanh-tich-kpi": r"thanh tich|thanh tuu|achievement|ket qua noi bat",
    "ngoai-ngu": r"ngoai ngu|ngon ngu|language",
    "portfolio-link": r"portfolio|lien ket|link|website|mang xa hoi",
    "giai-thuong": r"giai thuong|danh hieu|vinh danh|award|honor",
    "hoat-dong-ngoai-khoa": r"hoat dong|tinh nguyen|ngoai khoa|volunteer|activit",
    "giay-phep": r"giay phep|bang lai|chung chi hanh nghe|license",
    "so-thich": r"so thich|interest|hobbies",
    "nguoi-gioi-thieu": r"nguoi gioi thieu|nguoi tham chieu|reference",
}
PERSONAL_RE = re.compile(r"(ngay sinh|gioi tinh|dia chi|\bdob\b|quoc tich|tinh trang hon nhan)", re.I)


def analyse(pdf):
    doc = fitz.open(pdf)
    pages = len(doc)
    heads, imgs, rects, wide = [], [], 0, 0
    sizes = []
    for pg in doc:
        W, H = pg.rect.width, pg.rect.height
        d = pg.get_text("dict")
        for b in d["blocks"]:
            if b["type"] == 1:  # ảnh
                x0, y0, x1, y1 = b["bbox"]
                imgs.append({"w": round(x1 - x0), "h": round(y1 - y0), "x": round((x0 + x1) / 2 / W, 2), "y": round((y0 + y1) / 2 / H, 2)})
            elif b["type"] == 0:
                for ln in b["lines"]:
                    t = "".join(s["text"] for s in ln["spans"]).strip()
                    if not t:
                        continue
                    sz = max(s["size"] for s in ln["spans"])
                    bold = any(s["flags"] & 16 or "bold" in s["font"].lower() for s in ln["spans"])
                    sizes.append(sz)
                    heads.append((t, sz, bold, ln["bbox"][0] / W))
        for dr in pg.get_drawings():
            r = dr["rect"]
            if r.width > 8 and 2 <= r.height <= 10:  # thanh kỹ năng mảnh
                rects += 1
    body = sorted(sizes)[len(sizes) // 2] if sizes else 10
    sections = {}
    titles = []
    for t, sz, bold, x in heads:
        ft = fold(t).strip(" :")
        if len(ft) > 40 or len(ft) < 3:
            continue
        isHead = (sz >= body * 1.15) or (bold and t.upper() == t) or t.upper() == t
        if not isHead:
            continue
        for k, rx in SECTION_RE.items():
            if re.search(rx, ft):
                sections.setdefault(k, t)
                break
        titles.append(t)
    full = fold(" ".join(h[0] for h in heads))
    photo = [i for i in imgs if 40 <= i["w"] <= 260 and 0.6 <= i["w"] / max(i["h"], 1) <= 1.4]
    return {
        "soTrang": pages,
        "coOAnh": bool(photo),
        "anh": photo[:2],
        "soAnhKhac": len(imgs) - len(photo),
        "thanhKyNang": rects >= 4,
        "muc": sections,
        "tieuDeMuc": titles[:40],
        "thongTinCaNhanMoRong": bool(PERSONAL_RE.search(full)),
        "kichThuocChuThan": round(body, 1),
        "doDaiChu": len(full),
    }


def main():
    rows = list(csv.DictReader(open(CSV, encoding="utf-8-sig")))
    out = {}
    for r in rows:
        p = ROOT / r["duong_dan_tieng_viet"]
        key = f'{r["style"]}/{r["ten_mau_cv"]}'
        if not p.exists():
            out[key] = {"loi": "khong thay file"}
            continue
        try:
            out[key] = {"style": r["style"], "tenMau": r["ten_mau_cv"], "satRanhGioi": r["sat_ranh_gioi"], **analyse(p)}
        except Exception as e:  # noqa: BLE001
            out[key] = {"loi": str(e)}
    OUT.write_text(json.dumps(out, ensure_ascii=False, indent=1), encoding="utf-8")
    print("ghi", OUT, len(out), "mau")


if __name__ == "__main__":
    sys.exit(main())
