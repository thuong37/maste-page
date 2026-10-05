# Hồ Sơ Kỹ Thuật: Loại Bỏ Thanh Hiển Thị Tiêu Chí Đang Lọc Trên Màn Danh Sách Việc Làm

> **Trạng thái:** Hoàn thành & Đã nghiệm thu tự động  
> **Dự án:** EasyCV — Nền tảng Tuyển dụng & Khám phá Việc làm Thông minh  
> **Màn hình:** Danh sách việc làm (`viec-lam.html` & `public/viec-lam.html`)

---

## 1. Yêu Cầu & Bối Cảnh Người Dùng (User Requirement)

- **Phản ánh từ người dùng:**  
  *"trong màn list job, khi tôi chọn các giá trị trong bộ lọc, thì bên dưới hiển thị thanh các giá trị tôi đang lọc , bỏ thanh đó đi"*
- **Hiện trạng trước khi sửa:**  
  Khi người dùng chọn bất kỳ tiêu chí nào từ các nút dropdown bộ lọc (Lĩnh vực công ty, Kinh nghiệm, Cấp bậc, Mức lương, Hình thức, Nghỉ thứ 7), bên dưới xuất hiện thêm 1 hàng ngăn cách bởi đường viền mờ với nhãn `Đang lọc: [Kinh nghiệm: Dưới 1 năm ✕] [Cấp bậc: Trưởng phòng/Manager ✕] Xóa tất cả` (`#activeFilterChipsRow`).
- **Nguyên nhân trùng lặp & giải pháp:**  
  Bản thân từng nút bấm lọc dạng pill (`.filter-pill-btn`) đã tự động cập nhật text nhãn sang giá trị được chọn (ví dụ: chuyển từ `"Kinh nghiệm"` sang `"Dưới 1 năm"`, `"Cấp bậc"` sang `"Trưởng phòng/Manager"`) và đổi sang trạng thái active viền cam (`.is-active`). Vì vậy, hàng chip lọc bên dưới bị dư thừa thông tin, làm choán không gian chiều dọc của màn hình.  
  -> **Giải pháp:** Gỡ bỏ hoàn toàn thanh hiển thị chip lọc này, duy trì nút `[✕ Xóa lọc]` gọn gàng ở cuối hàng nút lọc chính để ứng viên có thể reset bộ lọc bất cứ lúc nào.

---

## 2. Bảng Ma Trận Thay Đổi (Changeset Matrix)

| STT | Tệp tin | Mục đích thay đổi |
| :---: | :--- | :--- |
| 1 | [`viec-lam.html`](file:///d:/master%20page/viec-lam.html) & [`public/viec-lam.html`](file:///d:/master%20page/public/viec-lam.html) | Gỡ bỏ hoàn toàn khối markup `#activeFilterChipsRow` khỏi cấu trúc DOM. |
| 2 | [`css/viec-lam.css`](file:///d:/master%20page/css/viec-lam.css) & [`public/css/viec-lam.css`](file:///d:/master%20page/public/css/viec-lam.css) | Đặt `.active-filter-chips-row { display: none !important; }` để triệt tiêu mọi nguy cơ hiển thị kể cả với cache cũ. |
| 3 | [`js/viec-lam.js`](file:///d:/master%20page/js/viec-lam.js) & [`public/js/viec-lam.js`](file:///d:/master%20page/public/js/viec-lam.js) | Tinh gọn `renderActiveFilterChips()`, chỉ điều phối trạng thái hiển thị của nút `[✕ Xóa lọc]` (`#btnClearTopFilters`) và triệt tiêu render chip. |

---

## 3. Chi Tiết Kỹ Thuật

### 3.1. Cập nhật DOM (HTML)
Đã xóa bỏ đoạn mã sau trong `viec-lam.html` và `public/viec-lam.html`:
```html
<!-- ĐÃ GỠ BỎ: -->
<div class="active-filter-chips-row" id="activeFilterChipsRow" style="display: none;">
  <div class="active-chips-inner">
    <span class="active-chips-label">Đang lọc:</span>
    <div class="active-chips-list" id="activeChipsList"></div>
    <button type="button" class="btn-clear-chips-inline" id="btnClearChipsInline">Xóa tất cả</button>
  </div>
</div>
```

### 3.2. Cập nhật Logic Điều Khiển (JavaScript)
Trong `js/viec-lam.js` và `public/js/viec-lam.js`:
```javascript
function renderActiveFilterChips() {
  const chipsRow = document.getElementById('activeFilterChipsRow');
  const chipsList = document.getElementById('activeChipsList');
  const clearBtn = document.getElementById('btnClearTopFilters');

  // Đã bỏ hàng hiển thị giá trị đang lọc ("Đang lọc: ...") bên dưới theo yêu cầu người dùng
  if (chipsRow) chipsRow.style.display = 'none';
  if (chipsList) chipsList.innerHTML = '';

  const activeFilters = [
    { type: 'exp', value: selectedExp },
    { type: 'salary', value: selectedSalary },
    { type: 'level', value: selectedLevel },
    { type: 'type', value: selectedType },
    { type: 'saturday', value: selectedSaturday }
  ];

  const activeCount = activeFilters.filter(f => Boolean(f.value)).length;

  if (clearBtn) {
    clearBtn.style.display = activeCount > 0 ? 'inline-flex' : 'none';
  }
}
```

---

## 4. Kết Quả Kiểm Thử (Verification Results)

1. **Kiểm tra DOM sau khi áp dụng bộ lọc:**
   - Chọn `Kinh nghiệm = "Dưới 1 năm"`, `Cấp bậc = "Trưởng phòng/Manager"`.
   - Kết quả: `hasChipsRowInDOM: false`, `hasChipsListInDOM: false`.
   - Nút `[✕ Xóa lọc]` hiển thị `display: inline-flex` gọn gàng ở cuối hàng pill.
2. **Kiểm tra hoàn nguyên (Clear Filters):**
   - Click `[✕ Xóa lọc]`: tất cả nút lọc trở lại trạng thái mặc định (`"Kinh nghiệm"`, `"Cấp bậc"`), nút `[✕ Xóa lọc]` tự động ẩn.
3. **Nghiệm thu trực quan:**
   - Ảnh chụp kiểm thử headless Chrome: `scratch/filter_no_chips_verified.png`.
   - Toàn bộ khoảng cách giữa dải bộ lọc và kết quả tìm kiếm việc làm liền mạch, thanh thoát và chuẩn thiết kế.
