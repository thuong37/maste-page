# Hướng Dẫn Vận Hành Dành Cho AI Agent (AGENTS.md)

Dự án: **EasyCV — Nền tảng Tuyển dụng & Khám phá Việc làm Thông minh**  
Phương pháp luận quản trị: **BMAD (BMM Method)**

---

## 1. Nguyên Tắc Cốt Lõi (Core Principles)
- Mọi phân tích và triển khai đều đối soát trực tiếp với [`_bmad-output/planning-artifacts/prd.md`](_bmad-output/planning-artifacts/prd.md).
- Giữ vững chuẩn nhận diện thương hiệu EasyCV: Màu cam chủ đạo (`#FF6500`), nền sáng tinh tế (`#F8FAFC`), font chữ chuẩn Inter, UI cao cấp.
- Bảng màu chuẩn lấy theo Figma "Color system EasyBooks" (file `pyFKXDCPtBvDqwOYTdGXI3`, node `8-896`), đã khai báo thành token `--eb-primary-*`, `--eb-secondary-*`, `--eb-error-*`, `--eb-text-*` trong [`assets/design-tokens.css`](assets/design-tokens.css). Không dùng lại thang màu Tailwind cũ (`#F97316`, `#EA580C`, `#0F172A`, `#64748B`, `#16A34A`, `#EF4444`…).

---

## 2. Quy Định Bắt Buộc Về Tự Động Đồng Bộ Bộ Nhớ (Auto-Sync Memory Rule)

> [!IMPORTANT]
> **Người dùng KHÔNG CẦN phải nhắc nhở AI lưu bộ nhớ.**

Sau mỗi lần thực hiện phân tích, quyết định, sửa lỗi hoặc code tính năng, AI **BẮT BUỘC TỰ ĐỘNG THỰC HIỆN**:

1. **Cập nhật `.memlog.md`:**
   - File đích: [`_bmad-output/planning-artifacts/.memlog.md`](_bmad-output/planning-artifacts/.memlog.md)
   - Ghi lại các dòng:
     - `- (decision)`: Tóm tắt quyết định thống nhất.
     - `- (action)`: Các file và tính năng vừa sửa.
     - `- (verification)`: Trạng thái kiểm thử.

2. **Cập nhật tài liệu Artifacts khi có thay đổi quan trọng:**
   - Thư mục đích: `_bmad-output/implementation-artifacts/`
   - Ghi nhận đầy đủ bảng ma trận lỗi, giải pháp kỹ thuật và kết quả test.
