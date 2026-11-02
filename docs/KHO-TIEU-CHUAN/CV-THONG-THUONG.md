# CV thông thường gồm những gì (mức nền) và cách kết hợp với JD

JD chỉ cho biết **nhà tuyển dụng đòi gì**, không cho biết **CV thông thường gồm gì**. Nếu coi mục nào JD không nhắc là "không cần" thì sai: 153/163 nghề không nhắc "Giải thưởng" và 144/163 không nhắc "Sở thích", nhưng 59/65 và 55/65 mẫu TopCV vẫn có các mục này. Vì vậy kết luận cuối cùng của mỗi nghề gộp hai lớp.

## Lớp 1 — mức nền (không phụ thuộc JD)
Dữ liệu: [`assets/data/cv-content-baseline.json`](../../assets/data/cv-content-baseline.json). Căn cứ: tần suất trong 65 mẫu TopCV và quy ước CV Việt Nam.

| Mức nền | Mục |
|---|---|
| **can** — cốt lõi, CV nào cũng có | mục tiêu nghề nghiệp, kinh nghiệm làm việc, học vấn, kỹ năng chuyên môn |
| **nen** — phổ biến, nên có | ảnh chân dung, ngoại ngữ, chứng chỉ, thông tin cá nhân mở rộng, kỹ năng mềm, hoạt động ngoại khóa |
| **tuy-chon** — có thì tốt | giải thưởng, sở thích, dự án, thành tích/KPI, công cụ phần mềm |
| **khong-can** — chỉ nghề đặc thù | portfolio, giấy phép/bằng lái |

## Lớp 2 — điều chỉnh theo nghề bằng JD (chỉ nâng, không hạ)
- Mức cuối = max(mức nền, mức JD). JD nhắc rõ thì nâng lên `can`/`nen`.
- JD im lặng thì **giữ mức nền**, không bị hạ xuống `khong`.
- Mỗi mục ghi nguồn: `nen` (chỉ do nền), `JD` (JD nâng lên), `nen+JD` (cả hai cùng mức).
- Kết quả: [`assets/data/cv-content-final.json`](../../assets/data/cv-content-final.json). Sinh lại bằng `npm run jd:match`.

## Không làm
Lớp cấp bậc (fresher/senior) chưa làm theo chốt của người dùng. File `cv-content-standard/<id>.json` (kết quả thô từ JD) giữ nguyên làm dữ liệu gốc, không bị sửa.
