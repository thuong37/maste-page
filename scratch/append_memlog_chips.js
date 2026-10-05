const fs = require('fs');
const file = '_bmad-output/planning-artifacts/.memlog.md';
let content = fs.readFileSync(file, 'utf8').trimEnd();
const newEntry = `
- (decision) Người dùng yêu cầu gỡ bỏ thanh hiển thị tiêu chí đang lọc bên dưới dải bộ lọc trên trang Danh sách việc làm (viec-lam.html): "trong màn list job, khi tôi chọn các giá trị trong bộ lọc, thì bên dưới hiển thị thanh các giá trị tôi đang lọc , bỏ thanh đó đi". Vì các nút lọc dạng pill (.filter-pill-btn) đã tự động cập nhật nhãn hiển thị trực tiếp giá trị đang chọn kèm trạng thái viền cam (.is-active), thanh chip phụ "Đang lọc: ... Xóa tất cả" (#activeFilterChipsRow) bị trùng lặp và làm rối bố cục. Tiến hành loại bỏ hoàn toàn thanh này và giữ lại nút [✕ Xóa lọc] (#btnClearTopFilters) ở cuối dải pill để phục vụ thao tác đặt lại bộ lọc.
- (action) Cập nhật và đồng bộ 100% qua 6 tệp mã nguồn:
  1. viec-lam.html & public/viec-lam.html: Xóa bỏ hoàn toàn khối markup #activeFilterChipsRow và các phần tử con.
  2. css/viec-lam.css & public/css/viec-lam.css: Thiết lập .active-filter-chips-row { display: none !important; } triệt tiêu mọi khả năng hiển thị.
  3. js/viec-lam.js & public/js/viec-lam.js: Tinh gọn hàm renderActiveFilterChips(), triệt tiêu việc sinh DOM thẻ chip, đảm bảo ẩn #activeFilterChipsRow và tự động điều phối hiển thị nút [✕ Xóa lọc] (#btnClearTopFilters) khi có ít nhất 1 tiêu chí được chọn.
- (verification) Chạy kịch bản kiểm thử tự động toàn diện qua Chrome Headless CDP (scratch/test_filter_chips_removal.js, scratch/test_clear_filters.js):
  1. Chọn tiêu chí Kinh nghiệm = "Dưới 1 năm", Cấp bậc = "Trưởng phòng/Manager": hasChipsRowInDOM = false, hasChipsListInDOM = false, nút #btnClearTopFilters hiển thị inline-flex.
  2. Không còn bất kỳ thanh chip phụ "Đang lọc: ..." hay đường kẻ ngang phân tách nào bên dưới bộ lọc.
  3. Bấm nút [✕ Xóa lọc]: tất cả bộ lọc trở về mặc định, nút Xóa lọc tự động ẩn.
  4. Ảnh chụp nghiệm thu: scratch/filter_no_chips_verified.png.
  5. Đồng bộ 100% giữa root và public/.
`;
fs.writeFileSync(file, content + '\n' + newEntry, 'utf8');
console.log('Successfully updated .memlog.md');
