# Hướng Dẫn Vận Hành Dành Cho AI Agent (AGENTS.md)

Dự án: **EasyCV — Nền tảng Tuyển dụng & Khám phá Việc làm Thông minh**  
Phương pháp luận quản trị: **BMAD (BMM Method)** — chỉ áp dụng đầy đủ cho tác vụ lớn (xem mục 2).

---

## 1. Nguyên Tắc Cốt Lõi (Core Principles)
- Phân tích và triển khai tính năng đối soát với [`_bmad-output/planning-artifacts/prd.md`](_bmad-output/planning-artifacts/prd.md).
- Giữ vững chuẩn nhận diện thương hiệu EasyCV: Màu cam chủ đạo (`#FF6500`), nền sáng tinh tế (`#F8FAFC`), font chữ chuẩn Inter, UI cao cấp.
- Bảng màu chuẩn lấy theo Figma "Color system EasyBooks" (file `pyFKXDCPtBvDqwOYTdGXI3`, node `8-896`), đã khai báo thành token `--eb-primary-*`, `--eb-secondary-*`, `--eb-error-*`, `--eb-text-*` trong [`assets/design-tokens.css`](assets/design-tokens.css). Không dùng lại thang màu Tailwind cũ (`#F97316`, `#EA580C`, `#0F172A`, `#64748B`, `#16A34A`, `#EF4444`…).

---

## 2. Phân Tầng Tác Vụ (Task Tiers) — chọn tầng nhỏ nhất đủ dùng

| Tầng | Ví dụ | Quy trình |
|---|---|---|
| **S — nhỏ** | Đổi chữ/màu/khoảng cách, sửa menu, sửa bố cục một component, sửa lỗi CSS/JS cục bộ | Sửa trực tiếp. **Không** gọi skill `bmad-build`/`bmad-review`/`bmad-code-review`. Kiểm tra bằng `npm run build`, `git diff`, `node --check` (nếu có JS). Ghi **1 dòng** vào memlog. |
| **M — vừa** | Component/section mới, đổi hành vi một trang, thay đổi dữ liệu dùng chung | Sửa trực tiếp, tự kiểm tra bằng `npm run verify -- <trang> 1440 375` (ảnh chụp ở `scratch/`). Ghi 1–3 dòng memlog. Chỉ review khi người dùng yêu cầu. |
| **L — lớn** | Tính năng/trang mới, thay đổi kiến trúc, thay đổi PRD | Dùng BMAD đầy đủ (build/review). Ghi memlog và tạo 1 file trong `_bmad-output/implementation-artifacts/`. |

Nếu không chắc tầng nào: chọn tầng thấp hơn và hỏi lại khi phát sinh rủi ro. Người dùng có thể nâng tầng bằng cách nói rõ ("review kỹ", "dùng BMAD").

---

## 3. Cấu Trúc Mã Nguồn & Build (Single Source of Truth)

- **Nguồn duy nhất là thư mục gốc**: `*.html`, `css/`, `js/`, `assets/`. **KHÔNG sửa tay trong `public/`** — nó là bản sao sinh tự động.
- **Header & mobile drawer dùng chung** nằm ở [`tools/partials/header.html`](tools/partials/header.html) và [`tools/partials/drawer.html`](tools/partials/drawer.html). Trong các trang, phần này nằm giữa các marker `<!-- @include:header -->…<!-- @end:header -->` (và `drawer`). **Không sửa tay giữa marker** — sửa partial rồi chạy build.
- Lệnh:
  - `npm run build` — chèn partial vào 4 trang rồi đồng bộ sang `public/`.
  - `npm run check` — báo lỗi nếu trang/`public/` chưa được build (dùng thay cho so sánh SHA-256 thủ công).
  - `npm run verify -- <trang> [rộng...]` — chụp ảnh headless Chrome vào `scratch/shot-<trang>-<rộng>.png`.
- Mọi thay đổi cho 4 trang phải kết thúc bằng `npm run build`. Không viết script `apply_*.js` / `verify_*.js` dùng một lần; `scratch/` đã được git-ignore và chỉ dành cho file tạm.

---

## 4. Ghi Nhớ Gọn (Lightweight Memory Rule)

Người dùng KHÔNG cần nhắc lưu bộ nhớ, nhưng giữ **ngắn**:

1. **`.memlog.md`** ([`_bmad-output/planning-artifacts/.memlog.md`](_bmad-output/planning-artifacts/.memlog.md)): mỗi tác vụ **một dòng** dạng `- (action|decision) <việc đã làm + file> — <kiểm thử>`. Chỉ thêm dòng `- (decision)` riêng khi có quyết định cần nhớ lâu dài. Giữ file ≤ ~50 dòng; khi dài hơn, chuyển phần cũ sang `.memlog.archive.md`. Không đọc lại archive trừ khi cần tra cứu.
2. **`_bmad-output/implementation-artifacts/`**: chỉ tạo tài liệu cho tác vụ tầng **L** (ma trận lỗi, giải pháp kỹ thuật, kết quả test). Không tạo cho tầng S/M.
