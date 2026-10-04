# Báo Cáo Kỹ Thuật: Nâng Cấp Bộ Lọc Danh Mục Nghề (Category Filter Modal)

**Dự án**: EasyCV — Nền tảng Tuyển dụng & Khám phá Việc làm Thông minh  
**Ngày thực hiện**: 04/10/2026  
**Trạng thái**: ✅ Đã hoàn thành & Kiểm thử tự động thành công 100%

---

## 1. Yêu Cầu Cải Tiến (User Requirements)
1. **Chọn Toàn Bộ Nghề Thuộc Nhóm Nghề**:
   - Khi nhấp chọn một "Nhóm nghề" (ở cột trái), tất cả các Nghề (subgroups) và Vị trí chuyên môn (roles) thuộc nhóm đó ở cột phải phải được tự động tích chọn đồng loạt.
   - Ngược lại, khi bỏ chọn nhóm nghề thì tự động bỏ chọn toàn bộ nghề và chuyên môn trong nhóm đó.
2. **Highlight Tập Trung Vào Từng Thẻ Vị Trí Chuyên Môn**:
   - Khối "Được tìm kiếm nhiều" không được highlight phủ màu cam loãng cả khối container (`.category-popular-wrap`), mà phải đưa nền khối về trong suốt/hòa vào layout chung của modal.
   - Trọng tâm HIGHLIGHT phải tập trung sắc nét trực tiếp vào chính từng thẻ vị trí chuyên môn (`.category-popular-chip`) để tạo điểm nhấn thị giác cuốn hút, tự nhiên và chuyên nghiệp.

---

## 2. Giải Pháp Kỹ Thuật (Technical Solution)

### A. Tự động chọn tất cả nghề thuộc nhóm (`js/category-filter-modal.js`)
- **Nâng cấp `toggleCategory(catKey)`**:
  - Khi người dùng click chọn nhóm nghề, hệ thống tự động duyệt qua tất cả `cat.subgroups` và thêm `sub.title` vào `tempSelection.subgroups` cùng toàn bộ `sub.roles` vào `tempSelection.roles`.
  - Cột bên phải lập tức kích hoạt class `is-checked` trên toàn bộ checkbox nghề con và class `is-selected` trên toàn bộ các thẻ vị trí chuyên môn.
  - Đồng thời đặt `activeCategoryKey = catKey` để người dùng nhìn thấy ngay tức thì tất cả các nghề đã được đánh dấu chọn.
- **Đồng bộ hóa 2 chiều linh hoạt**:
  - `toggleSubgroup(title, roles)`: Khi bỏ chọn 1 nghề con, nhóm cha tự động bỏ dấu tick; khi tất cả nghề con đều được chọn, nhóm cha tự động đánh dấu tick.
  - `toggleRole(role, subTitle)`: Tương tự đối với từng vị trí chuyên môn.
- **Tối ưu hiển thị nhãn Trigger**:
  - Khi 1 nhóm nghề được chọn trọn vẹn, nút trigger trên thanh tìm kiếm hiển thị ưu tiên tên nhóm nghề (ví dụ: `Kinh doanh/Bán hàng`).

### B. Highlight tập trung vào từng thẻ chuyên môn (`css/category-filter-modal.css`)
- **Khối container `.category-popular-wrap`**:
  - `background: transparent;`
  - `box-shadow: none;` (loại bỏ dải màu cam `inset 3px 0 0 #F97316`)
  - `border-bottom: 1px solid #F1F5F9;` (đường kẻ phân cách xám nhạt tinh tế)
  - Nhãn `.category-popular-label`: màu chữ `#64748B`, font-weight `700`.
- **Thẻ vị trí chuyên môn `.category-popular-chip`**:
  - `background: #FFF7ED;` (cam phấn mềm mại cao cấp)
  - `color: #C2410C;` (cam đậm EasyCV, tương phản đạt chuẩn WCAG)
  - `border: 1.5px solid #FDBA74;`
  - `box-shadow: 0 1px 3px rgba(249, 115, 22, 0.12);`
  - `font-weight: 650;`
  - Hover: `background: #F97316; color: #FFFFFF; border-color: #EA580C; box-shadow: 0 4px 12px rgba(249, 115, 22, 0.3); transform: translateY(-1.5px);`
  - Trạng thái click lọc `is-active`: `background: #EA580C; color: #FFFFFF;`
  - Hỗ trợ Dark Mode chuẩn xác với nền tối kính mờ và viền cam neon dịu mắt.

---

## 3. Kết Quả Kiểm Thử (Verification & Testing)

| Kịch Bản Kiểm Thử | Kỳ Vọng | Kết Quả Thực Tế | Trạng Thái |
| :--- | :--- | :--- | :---: |
| **Khối wrap Được tìm kiếm nhiều** | Nền trong suốt, không còn dải cam loãng | `wrapBg: "rgba(0,0,0,0)"`, `wrapShadow: "none"` | ✅ PASS |
| **Thẻ Chip chuyên môn** | Nổi bật với viền và nền cam phấn cao cấp | `chipBg: "#FFF7ED"`, `chipColor: "#C2410C"`, `chipBorder: "#FDBA74"` | ✅ PASS |
| **Click chọn Nhóm nghề (Kinh doanh/Bán hàng)** | Tất cả 6 nghề con và 20 vị trí chuyên môn được chọn | `allSubsChecked: true` (6/6), `allRolesSelected: true` (20/20) | ✅ PASS |
| **Click bỏ chọn Nhóm nghề** | Toàn bộ nghề con và vị trí chuyên môn được bỏ chọn | Tất cả subgroups và roles về trạng thái bỏ chọn | ✅ PASS |
| **Áp dụng bộ lọc (Submit)** | Nhãn trigger hiển thị đúng tên nhóm nghề đã chọn | Label: `"Kinh doanh/Bán hàng"` | ✅ PASS |
| **Kiểm thử trên trang `viec-lam.html`** | Hoạt động đồng bộ 100% | `allSubsChecked: true`, `allRolesSelected: true` | ✅ PASS |
