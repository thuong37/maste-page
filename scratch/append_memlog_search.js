const fs = require('fs');
const path = require('path');

const memlogPath = path.join(__dirname, '..', '_bmad-output', 'planning-artifacts', '.memlog.md');
let content = fs.readFileSync(memlogPath, 'utf8');

const newEntry = `- (decision) Đồng bộ toàn diện logic thanh tìm kiếm thông minh từ Trang chủ (index.html) sang Trang danh sách việc làm (viec-lam.html), đồng thời khắc phục triệt để các lỗi hiển thị theo ảnh phản ánh của người dùng:
  1. Khắc phục lỗi hộp thoại "Danh mục Nghề" (.category-modal-dialog) bị trôi xuống đáy màn hình (top: 815px) làm tràn và che khuất footer (các nút Bỏ chọn tất cả, Hủy, Chọn). Chuyển .category-modal-overlay sang position: fixed !important căn chính giữa viewport với backdrop blur mờ ảo.
  2. Khắc phục lỗi widget chuyển đổi chế độ xem (#floatingViewModeBox, z-index: 2000000) đè lên hộp thoại Danh mục Nghề: nâng z-index của modal lên 2500000 !important, đưa widget chìm hoàn toàn xuống dưới backdrop.
  3. Kế thừa trọn vẹn bảng gợi ý tìm kiếm 2 cột (.search-format-panel): Cột trái gồm Lịch sử tìm kiếm gần đây, Chế độ gõ phím gợi ý từ khóa thông minh (như "Kiến trúc sư" 94 việc làm với highlight cam nổi bật), Từ khóa phổ biến; Cột phải gồm Việc làm có thể bạn quan tâm (5 jobs chất lượng cao).
  4. Căn chỉnh động mép trái dropdown (--search-suggest-left) vừa khít theo ô nhập tìm kiếm để lộ nút "Danh mục Nghề" bên trái và mép phải kéo dài đến hết thanh tìm kiếm. Phối hợp đóng mở giữa modal và dropdown; hỗ trợ phím Enter, Esc, nút xóa ✕ và lọc trực tiếp danh sách việc làm không cần reload trang.
- (action) Cập nhật và đồng bộ hóa 100% qua 6 tệp mã nguồn: css/category-filter-modal.css, public/css/category-filter-modal.css, css/viec-lam.css, public/css/viec-lam.css, js/viec-lam.js, public/js/viec-lam.js:
  1. css/category-filter-modal.css & public/css/category-filter-modal.css: Thiết lập .category-modal-overlay { position: fixed !important; inset: 0 !important; z-index: 2500000 !important; display: flex !important; align-items: center !important; justify-content: center !important; padding: 24px !important; }; .category-modal-backdrop { backdrop-filter: blur(4px) !important; background: rgba(15, 23, 42, 0.45) !important; }; .category-modal-dialog { position: relative !important; max-height: min(680px, calc(100vh - 48px)) !important; max-width: 1250px !important; }.
  2. css/viec-lam.css & public/css/viec-lam.css: Bổ sung toàn bộ style CSS cho .search-suggest-dropdown căn chỉnh theo --search-suggest-left và --search-suggest-right, layout 2 cột .search-format-panel, .recent-search-row, .popular-keywords, .is-typing, .keyword-suggestions-section, .recommended-jobs, hỗ trợ Dark theme và responsive mobile.
  3. js/viec-lam.js & public/js/viec-lam.js: Khởi tạo động .search-format-panel; bổ sung tập từ khóa phong phú ALL_SUGGESTIONS (bao gồm Kiến trúc sư, Kỹ sư xây dựng, Thiết kế nội thất, IT, Marketing...); hàm updateDropdownPosition() căn chỉnh động theo tọa độ thực; hàm handleSearchInputMode() chuyển đổi chế độ gõ phím; hàm executeSearch() lưu lịch sử, đóng dropdown, kích hoạt applyJobFilters(true, true), hiển thị toast và cuộn mượt; xử lý nút xóa ✕ và đóng mở tương hỗ với Category Modal.
- (verification) Chạy kịch bản kiểm thử tự động toàn diện qua Chrome Headless CDP (scratch/verify_cdp_search_sync.js):
  1. Kiểm thử Modal Danh mục Nghề: overlayHidden = false, position: fixed, z-index: 2500000 > floatingZIndex 2000000, dialogRect.top = 65px (căn giữa viewport 805px, hoàn toàn không bị trôi xuống 815px), footerVisible = true, submitBtnVisible = true (scratch/verify_modal_centered.png).
  2. Kiểm thử Gõ từ khóa "Kiến trúc sư": isOpen = true, isTyping = true, hiển thị gợi ý "Kiến trúc sư (94 việc làm)" tô đậm cam, recommendedJobsCount = 5, dropdownLeft = 310px >= triggerRight = 293px (nút Danh mục Nghề lộ rõ bên trái) (scratch/verify_search_typing.png).
  3. Kiểm thử Chọn gợi ý & Lọc job: dropdown đóng, input nhận giá trị, danh sách việc làm được lọc live kèm Toast thông báo (scratch/verify_search_filtered.png).
  4. Kiểm thử Nút xóa ✕: input xóa rỗng, nút ✕ ẩn, từ khóa "Kiến trúc sư" đã lưu vào localStorage (easycv_recent_searches_v2).
  5. Đồng bộ mã băm MD5 giữa root và public/ đạt 100% khớp (SYNC OK).
- (artifact) Báo cáo kỹ thuật chi tiết lưu tại _bmad-output/implementation-artifacts/job-search-bar-and-modal-sync.md.
`;

fs.appendFileSync(memlogPath, '\n' + newEntry, 'utf8');
console.log('Successfully appended new entry to .memlog.md');
