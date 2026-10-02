# Quy Tắc Tự Động Đồng Bộ Bộ Nhớ BMAD (BMAD Auto-Sync Rule)

## Bắt buộc đối với AI trong mọi phiên làm việc tại dự án này:

1. **Tự Động Cập Nhật `.memlog.md` (Auto-Log Memory):**
   - Bất cứ khi nào thực hiện phân tích, đưa ra quyết định, sửa lỗi (bugfix) hoặc thêm tính năng mới, AI **PHẢI TỰ ĐỘNG** ghi nhận vào tệp:
     `_bmad-output/planning-artifacts/.memlog.md`.
   - Cấu trúc nhật ký bắt buộc:
     - `- (decision)`: Quyết định thiết kế, kiến trúc hoặc phạm vi sửa đổi.
     - `- (action)`: Các file code và tính năng cụ thể vừa được cập nhật.
     - `- (verification)`: Kết quả kiểm tra, test case hoặc trạng thái hoạt động.

2. **Tự Động Lưu Trữ Biên Bản Nghiệm Thu (Implementation Artifacts):**
   - Khi có các đợt sửa lỗi quan trọng hoặc cập nhật kiến trúc, AI phải tự động lập/cập nhật tài liệu markdown tương ứng trong:
     `_bmad-output/implementation-artifacts/`.

3. **Chủ Động Thực Hiện - Không Chờ Người Dùng Nhắc:**
   - Người dùng **KHÔNG CẦN** phải nhắc nhở câu lệnh lưu bộ nhớ hay cập nhật `_bmad-output`.
   - AI phải coi đây là một phần không thể thiếu trong Definition of Done (DoD) của mỗi lượt phản hồi.
