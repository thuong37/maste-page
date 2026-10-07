    // Kho dữ liệu chuẩn 120 việc làm phong phú cho 5 ngành nghề hàng đầu (24 việc làm / ngành)
    const FEATURED_JOBS_DATA = [
      {
            "id": 101,
            "title": "Giám Đốc Khách Hàng Doanh Nghiệp (B2B Account Manager)",
            "company": "Tổng Công ty Dịch vụ Số Viettel",
            "logo": "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=120&h=120&q=80",
            "category": "sales",
            "salaryBadge": "30 - 55 triệu",
            "salaryIsOrange": true,
            "location": "Hà Nội & TP.HCM",
            "city": "Hà Nội",
            "exp": "3-5 năm",
            "level": "Trưởng nhóm / Quản lý",
            "type": "Toàn thời gian",
            "isLightningBadge": true,
            "lightningStats": {
                  "applied30d": 14,
                  "evaluated14d": 13,
                  "responseRate": 93,
                  "lastReviewed": "12:00"
            },
            "updated": "15 phút trước",
            "verified": true,
            "skills": [
                  "B2B Sales",
                  "Key Account",
                  "Giải pháp số",
                  "Đàm phán cấp cao"
            ],
            "jdSummary": [
                  "Chịu trách nhiệm phát triển doanh số khách hàng doanh nghiệp khối Tài chính - Ngân hàng.",
                  "Tư vấn các gói giải pháp Chuyển đổi số, Viettel Cloud và Payment Gateway.",
                  "Xây dựng mối quan hệ chiến lược với C-levels của các tập đoàn đối tác."
            ],
            "perks": [
                  "Thưởng hoa hồng không giới hạn theo doanh số",
                  "Gói bảo hiểm sức khỏe Viettel Care toàn diện"
            ],
            "aiMatch": 96
      },
      {
            "id": 102,
            "title": "Trưởng Phòng Kinh Doanh Bất Động Sản Nghỉ Dưỡng",
            "company": "Tập đoàn Vingroup (Vinhomes)",
            "logo": "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=120&h=120&q=80",
            "category": "sales",
            "salaryBadge": "35 - 70 triệu",
            "salaryIsOrange": true,
            "location": "Hà Nội",
            "city": "Hà Nội",
            "exp": "3-5 năm",
            "level": "Trưởng phòng",
            "type": "Toàn thời gian",
            "isLightningBadge": true,
            "lightningStats": {
                  "applied30d": 18,
                  "evaluated14d": 16,
                  "responseRate": 89,
                  "lastReviewed": "12:00"
            },
            "updated": "30 phút trước",
            "verified": true,
            "skills": [
                  "Bất động sản",
                  "Quản lý đội ngũ",
                  "Tư vấn đầu tư",
                  "Chiến lược bán hàng"
            ],
            "jdSummary": [
                  "Điều hành và dẫn dắt đội ngũ 15 chuyên viên kinh doanh dự án cao cấp.",
                  "Lập kế hoạch phân bổ chỉ tiêu doanh số và tổ chức sự kiện mở bán.",
                  "Chăm sóc tệp khách hàng VIP và các nhà đầu tư lớn."
            ],
            "perks": [
                  "Hoa hồng cao nhất thị trường BĐS",
                  "Phúc lợi nghỉ dưỡng hệ thống Vinpearl định kỳ"
            ],
            "aiMatch": 92
      },
      {
            "id": 103,
            "title": "Chuyên Viên Quan Hệ Khách Hàng Doanh Nghiệp (RM)",
            "company": "Ngân hàng Techcombank",
            "logo": "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=120&h=120&q=80",
            "category": "sales",
            "salaryBadge": "22 - 38 triệu",
            "salaryIsOrange": false,
            "location": "TP.HCM (Quận 1)",
            "city": "TP.HCM",
            "exp": "1-3 năm",
            "level": "Chuyên viên",
            "type": "Toàn thời gian",
            "isLightningBadge": true,
            "lightningStats": {
                  "applied30d": 22,
                  "evaluated14d": 21,
                  "responseRate": 95,
                  "lastReviewed": "12:00"
            },
            "updated": "1 giờ trước",
            "verified": true,
            "skills": [
                  "Tín dụng doanh nghiệp",
                  "Tài trợ thương mại",
                  "Thẩm định tài chính",
                  "Quan hệ khách hàng"
            ],
            "jdSummary": [
                  "Tìm kiếm và tiếp cận các doanh nghiệp SME/Commercial để cung cấp dịch vụ tín dụng.",
                  "Phân tích báo cáo tài chính và lập tờ trình cấp hạn mức tín dụng.",
                  "Quản lý danh mục và phòng ngừa rủi ro tín dụng định kỳ."
            ],
            "perks": [
                  "Thưởng hiệu quả kinh doanh hàng quý",
                  "Lộ trình thăng tiến rõ ràng lên Senior RM sau 1 năm"
            ],
            "aiMatch": 94
      },
      {
            "id": 104,
            "title": "Kỹ Sư Giải Pháp Bán Hàng Kỹ Thuật (Pre-Sales Engineer)",
            "company": "CMC Telecom Enterprise",
            "logo": "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=120&h=120&q=80",
            "category": "sales",
            "salaryBadge": "25 - 45 triệu",
            "salaryIsOrange": false,
            "location": "Hà Nội",
            "city": "Hà Nội",
            "exp": "2-4 năm",
            "level": "Chuyên viên cao cấp",
            "type": "Toàn thời gian",
            "isLightningBadge": true,
            "lightningStats": {
                  "applied30d": 10,
                  "evaluated14d": 9,
                  "responseRate": 90,
                  "lastReviewed": "12:00"
            },
            "updated": "2 giờ trước",
            "verified": true,
            "skills": [
                  "Pre-Sales",
                  "Cloud Architecture",
                  "Mạng viễn thông",
                  "Thuyết trình kỹ thuật"
            ],
            "jdSummary": [
                  "Phối hợp với bộ phận Sales để tư vấn giải pháp mạng & Cloud cho khách hàng lớn.",
                  "Soạn thảo hồ sơ đề xuất kỹ thuật (RFP, POC) và giải đáp kiến trúc hệ thống.",
                  "Chuyển giao yêu cầu kỹ thuật chi tiết cho đội ngũ triển khai dự án."
            ],
            "perks": [
                  "Được tài trợ 100% chi phí thi chứng chỉ quốc tế AWS/Azure",
                  "Thưởng dự án theo quý"
            ],
            "aiMatch": 90
      },
      {
            "id": 105,
            "title": "Business Development Manager (Khu vực Đông Nam Á)",
            "company": "Shopee Vietnam",
            "logo": "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=120&h=120&q=80",
            "category": "sales",
            "salaryBadge": "30 - 50 triệu",
            "salaryIsOrange": true,
            "location": "TP.HCM (Quận 7)",
            "city": "TP.HCM",
            "exp": "3-5 năm",
            "level": "Trưởng nhóm",
            "type": "Toàn thời gian",
            "isLightningBadge": false,
            "lightningStats": {
                  "applied30d": 16,
                  "evaluated14d": 11,
                  "responseRate": 68,
                  "lastReviewed": "12:00"
            },
            "updated": "3 giờ trước",
            "verified": true,
            "skills": [
                  "E-commerce",
                  "Thương thảo nhãn hàng",
                  "Phân tích dữ liệu bán lẻ",
                  "Tiếng Anh lưu loát"
            ],
            "jdSummary": [
                  "Phát triển danh mục nhà bán hàng chiến lược trên sàn thương mại điện tử Shopee.",
                  "Đàm phán các chương trình khuyến mãi độc quyền và tối ưu giá bán lẻ.",
                  "Phân tích chỉ số tăng trưởng GMV để đề xuất chiến lược phát triển ngành hàng."
            ],
            "perks": [
                  "Môi trường Tech năng động quốc tế",
                  "MacBook Pro mới nhất phục vụ công việc"
            ],
            "aiMatch": 88
      },
      {
            "id": 106,
            "title": "Chuyên Viên Tư Vấn Giải Pháp Cloud & AI SaaS",
            "company": "FPT Smart Cloud",
            "logo": "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=120&h=120&q=80",
            "category": "sales",
            "salaryBadge": "20 - 35 triệu",
            "salaryIsOrange": false,
            "location": "Hà Nội",
            "city": "Hà Nội",
            "exp": "1-3 năm",
            "level": "Chuyên viên",
            "type": "Hybrid",
            "isLightningBadge": true,
            "lightningStats": {
                  "applied30d": 12,
                  "evaluated14d": 11,
                  "responseRate": 91,
                  "lastReviewed": "12:00"
            },
            "updated": "4 giờ trước",
            "verified": true,
            "skills": [
                  "SaaS Sales",
                  "AI Chatbot",
                  "Cloud Solutions",
                  "Tư vấn giải pháp"
            ],
            "jdSummary": [
                  "Tiếp nhận lead khách hàng tiềm năng và demo giải pháp FPT.AI, FPT Cloud.",
                  "Đàm phán hợp đồng cung cấp dịch vụ phần mềm cho khối doanh nghiệp tài chính, bán lẻ.",
                  "Chăm sóc tài khoản khách hàng duy trì gia hạn định kỳ (Retention)."
            ],
            "perks": [
                  "Chế độ làm việc linh hoạt Hybrid 2 ngày Remote/tuần",
                  "Bảo hiểm FPT Care"
            ],
            "aiMatch": 93
      },
      {
            "id": 107,
            "title": "Trưởng Nhóm Phát Triển Khách Hàng Ưu Tiên (Priority Banking Lead)",
            "company": "Ngân hàng TMCP Việt Nam Thịnh Vượng (VPBank)",
            "logo": "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=120&h=120&q=80",
            "category": "sales",
            "salaryBadge": "28 - 45 triệu",
            "salaryIsOrange": true,
            "location": "Hà Nội & TP.HCM",
            "city": "Hà Nội",
            "exp": "2-4 năm",
            "level": "Trưởng nhóm",
            "type": "Toàn thời gian",
            "isLightningBadge": true,
            "lightningStats": {
                  "applied30d": 19,
                  "evaluated14d": 18,
                  "responseRate": 95,
                  "lastReviewed": "12:00"
            },
            "updated": "25 phút trước",
            "verified": true,
            "skills": [
                  "Priority Banking",
                  "Wealth Management",
                  "Tư vấn đầu tư",
                  "Quản lý quan hệ"
            ],
            "jdSummary": [
                  "Phát triển mạng lưới khách hàng cá nhân cao cấp (Diamond / Priority Club).",
                  "Tư vấn các gói giải pháp tài chính đặc quyền, tiền gửi sinh lời và chứng chỉ quỹ.",
                  "Dẫn dắt đội ngũ 6 chuyên viên quản lý tài sản đạt chỉ tiêu AUM."
            ],
            "perks": [
                  "Hoa hồng theo doanh số không giới hạn",
                  "Ưu đãi thẻ tín dụng và vay mua nhà"
            ],
            "aiMatch": 95
      },
      {
            "id": 108,
            "title": "Quản Lý Bán Hàng Kênh MT Toàn Quốc (National Key Account)",
            "company": "Masan Consumer Holdings",
            "logo": "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=120&h=120&q=80",
            "category": "sales",
            "salaryBadge": "35 - 55 triệu",
            "salaryIsOrange": true,
            "location": "TP.HCM",
            "city": "TP.HCM",
            "exp": "3-5 năm",
            "level": "Trưởng phòng / Quản lý",
            "type": "Toàn thời gian",
            "isLightningBadge": true,
            "lightningStats": {
                  "applied30d": 15,
                  "evaluated14d": 14,
                  "responseRate": 93,
                  "lastReviewed": "12:00"
            },
            "updated": "40 phút trước",
            "verified": true,
            "skills": [
                  "Key Account MT",
                  "FMCG Sales",
                  "Thương thảo hợp đồng",
                  "Quản lý chuỗi"
            ],
            "jdSummary": [
                  "Quản lý hệ thống chuỗi siêu thị toàn quốc (WinMart, Co.opmart, BigC/Go).",
                  "Đàm phán hợp đồng thương mại năm, chương trình chiết khấu và diện tích trưng bày kệ hàng.",
                  "Tối ưu hóa chỉ số tăng trưởng doanh số và vòng quay hàng tồn kho (Sell-out/Sell-in)."
            ],
            "perks": [
                  "Thưởng doanh số năm cạnh tranh",
                  "Chính sách mua sản phẩm Masan ưu đãi cao"
            ],
            "aiMatch": 94
      },
      {
            "id": 109,
            "title": "Trưởng Bộ Phận Mở Rộng Điểm Bán & Quan Hệ Đối Tác",
            "company": "Công ty Cổ phần Đầu tư Thế Giới Di Động (MWG)",
            "logo": "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=120&h=120&q=80",
            "category": "sales",
            "salaryBadge": "25 - 40 triệu",
            "salaryIsOrange": false,
            "location": "TP.HCM & Miền Tây",
            "city": "TP.HCM",
            "exp": "2-4 năm",
            "level": "Trưởng bộ phận",
            "type": "Toàn thời gian",
            "isLightningBadge": true,
            "lightningStats": {
                  "applied30d": 11,
                  "evaluated14d": 10,
                  "responseRate": 91,
                  "lastReviewed": "12:00"
            },
            "updated": "1 giờ trước",
            "verified": true,
            "skills": [
                  "Site Selection",
                  "Bán lẻ chuỗi",
                  "Đàm phán mặt bằng",
                  "Phân tích lưu lượng"
            ],
            "jdSummary": [
                  "Khảo sát và thẩm định mặt bằng kinh doanh mở mới chuỗi Bách Hóa Xanh và Điện Máy Xanh.",
                  "Thương thảo hợp đồng thuê dài hạn với các chủ bất động sản thương mại.",
                  "Đảm bảo tiến độ bàn giao mặt bằng cho đội ngũ thi công đúng hạn."
            ],
            "perks": [
                  "Gói cổ phiếu thưởng ESOP thường niên",
                  "Phụ cấp công tác phí đầy đủ"
            ],
            "aiMatch": 91
      },
      {
            "id": 110,
            "title": "Chuyên Viên Kinh Doanh Bất Động Sản Đảo Ngọc Phú Quốc",
            "company": "Tập đoàn Sun Group",
            "logo": "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=120&h=120&q=80",
            "category": "sales",
            "salaryBadge": "30 - 65 triệu",
            "salaryIsOrange": true,
            "location": "Kiên Giang & TP.HCM",
            "city": "TP.HCM",
            "exp": "2-4 năm",
            "level": "Chuyên viên cao cấp",
            "type": "Toàn thời gian",
            "isLightningBadge": false,
            "lightningStats": {
                  "applied30d": 13,
                  "evaluated14d": 10,
                  "responseRate": 77,
                  "lastReviewed": "12:00"
            },
            "updated": "2 giờ trước",
            "verified": true,
            "skills": [
                  "BĐS Nghỉ dưỡng",
                  "Tư vấn Shophouse/Villa",
                  "Quan hệ VIP",
                  "Chăm sóc khách hàng"
            ],
            "jdSummary": [
                  "Tư vấn các sản phẩm biệt thự nghỉ dưỡng, shophouse thương mại tại Nam Phú Quốc.",
                  "Tổ chức site tour đón tiếp nhà đầu tư tham quan thực địa dự án.",
                  "Đồng hành hỗ trợ khách hàng từ thủ tục đặt cọc đến bàn giao sổ hồng."
            ],
            "perks": [
                  "Hoa hồng cao bậc nhất thị trường BĐS nghỉ dưỡng",
                  "Vé máy bay và nghỉ dưỡng Sun World"
            ],
            "aiMatch": 89
      },
      {
            "id": 111,
            "title": "Trưởng Nhóm Tư Vấn Bất Động Sản Công Nghệ (PropTech)",
            "company": "One Mount Real Estate (OneHousing)",
            "logo": "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=120&h=120&q=80",
            "category": "sales",
            "salaryBadge": "25 - 45 triệu",
            "salaryIsOrange": false,
            "location": "Hà Nội",
            "city": "Hà Nội",
            "exp": "2-4 năm",
            "level": "Trưởng nhóm",
            "type": "Toàn thời gian",
            "isLightningBadge": true,
            "lightningStats": {
                  "applied30d": 17,
                  "evaluated14d": 16,
                  "responseRate": 94,
                  "lastReviewed": "12:00"
            },
            "updated": "2 giờ trước",
            "verified": true,
            "skills": [
                  "PropTech",
                  "Dữ liệu định giá nhà",
                  "Tư vấn gói vay Techcombank",
                  "Chốt deal"
            ],
            "jdSummary": [
                  "Sử dụng công cụ định giá AI tự động OneHousing để tư vấn nguồn căn hộ cho khách mua.",
                  "Hỗ trợ khách hàng kết nối giải pháp tài chính vay vốn mua nhà nhanh chóng.",
                  "Dẫn dắt đội ngũ 8 chuyên viên tư vấn chuyển đổi nguồn khách hàng tiềm năng."
            ],
            "perks": [
                  "Nguồn lead khách hàng chuẩn xác từ hệ sinh thái One Mount",
                  "Thưởng hoa hồng nhanh"
            ],
            "aiMatch": 93
      },
      {
            "id": 112,
            "title": "Key Account Manager (Kênh Điện Tử & Công Nghệ Tiêu Dùng)",
            "company": "Tiki Corporation",
            "logo": "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=120&h=120&q=80",
            "category": "sales",
            "salaryBadge": "22 - 38 triệu",
            "salaryIsOrange": false,
            "location": "TP.HCM",
            "city": "TP.HCM",
            "exp": "2-4 năm",
            "level": "Chuyên viên cao cấp",
            "type": "Toàn thời gian",
            "isLightningBadge": true,
            "lightningStats": {
                  "applied30d": 12,
                  "evaluated14d": 11,
                  "responseRate": 92,
                  "lastReviewed": "12:00"
            },
            "updated": "3 giờ trước",
            "verified": true,
            "skills": [
                  "Key Account",
                  "E-commerce",
                  "Thương thảo nhãn hàng công nghệ",
                  "Phân tích doanh số"
            ],
            "jdSummary": [
                  "Xây dựng quan hệ hợp tác với các nhãn hàng thiết bị điện tử, gia dụng thông minh chính hãng.",
                  "Lập kế hoạch bán hàng cho các đợt Mega Sale và ngày hội thương hiệu (Super Brand Day).",
                  "Đảm bảo cam kết giao hàng nhanh TikiNOW 2H đạt chuẩn hài lòng khách hàng."
            ],
            "perks": [
                  "Môi trường thương mại điện tử chuyên nghiệp",
                  "Mua hàng Tiki ưu đãi nội bộ"
            ],
            "aiMatch": 90
      },
      {
            "id": 113,
            "title": "Trưởng Phòng Phát Triển Thị Trường BeCorporate",
            "company": "Công ty Cổ phần Be Group",
            "logo": "https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=120&h=120&q=80",
            "category": "sales",
            "salaryBadge": "30 - 48 triệu",
            "salaryIsOrange": true,
            "location": "Hà Nội & TP.HCM",
            "city": "Hà Nội",
            "exp": "3-5 năm",
            "level": "Trưởng phòng",
            "type": "Toàn thời gian",
            "isLightningBadge": true,
            "lightningStats": {
                  "applied30d": 14,
                  "evaluated14d": 13,
                  "responseRate": 93,
                  "lastReviewed": "12:00"
            },
            "updated": "3 giờ trước",
            "verified": true,
            "skills": [
                  "B2B Solutions",
                  "Giải pháp di chuyển doanh nghiệp",
                  "Đàm phán C-level",
                  "Team Leadership"
            ],
            "jdSummary": [
                  "Mở rộng gói giải pháp di chuyển và giao vận cho các tập đoàn và ngân hàng lớn tại Việt Nam.",
                  "Xây dựng bảng giá dịch vụ ưu đãi và cơ chế thanh toán hóa đơn doanh nghiệp tập trung.",
                  "Quản lý đội ngũ chuyên viên bán hàng B2B đạt chỉ tiêu doanh số năm."
            ],
            "perks": [
                  "Gói di chuyển Be miễn phí không giới hạn",
                  "Thưởng KPI theo kết quả kinh doanh"
            ],
            "aiMatch": 92
      },
      {
            "id": 114,
            "title": "Giám Đốc Kinh Doanh Trung Tâm Chi Nhánh Vùng",
            "company": "Công ty Cổ phần Viễn thông FPT (FPT Telecom)",
            "logo": "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=120&h=120&q=80",
            "category": "sales",
            "salaryBadge": "28 - 45 triệu",
            "salaryIsOrange": false,
            "location": "Đà Nẵng & Miền Trung",
            "city": "Đà Nẵng",
            "exp": "3-5 năm",
            "level": "Giám đốc chi nhánh",
            "type": "Toàn thời gian",
            "isLightningBadge": true,
            "lightningStats": {
                  "applied30d": 16,
                  "evaluated14d": 15,
                  "responseRate": 94,
                  "lastReviewed": "12:00"
            },
            "updated": "4 giờ trước",
            "verified": true,
            "skills": [
                  "Quản trị kinh doanh",
                  "Viễn thông FPT",
                  "Phát triển thuê bao",
                  "Vận hành chi nhánh"
            ],
            "jdSummary": [
                  "Chịu trách nhiệm toàn diện về chỉ tiêu doanh thu và phát triển thuê bao Internet/FPT Play.",
                  "Quản trị đội ngũ hơn 40 nhân sự kinh doanh và kỹ thuật hỗ trợ tại chi nhánh.",
                  "Thiết lập mạng lưới đại lý ủy quyền và chăm sóc khách hàng doanh nghiệp địa phương."
            ],
            "perks": [
                  "Thưởng quý và thưởng cuối năm hấp dẫn",
                  "Bảo hiểm FPT Care cho bản thân và người thân"
            ],
            "aiMatch": 91
      },
      {
            "id": 115,
            "title": "Enterprise Sales Specialist (Giải Pháp Doanh Nghiệp GrabForBusiness)",
            "company": "Grab Vietnam",
            "logo": "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=120&h=120&q=80",
            "category": "sales",
            "salaryBadge": "24 - 40 triệu",
            "salaryIsOrange": false,
            "location": "TP.HCM",
            "city": "TP.HCM",
            "exp": "2-4 năm",
            "level": "Chuyên viên cao cấp",
            "type": "Toàn thời gian",
            "isLightningBadge": true,
            "lightningStats": {
                  "applied30d": 13,
                  "evaluated14d": 12,
                  "responseRate": 92,
                  "lastReviewed": "12:00"
            },
            "updated": "4 giờ trước",
            "verified": true,
            "skills": [
                  "B2B Sales",
                  "GrabForBusiness",
                  "Corporate Client",
                  "Thuyết trình hợp đồng"
            ],
            "jdSummary": [
                  "Tìm kiếm và ký kết hợp đồng cung cấp dịch vụ Grab di chuyển và GrabFood cho doanh nghiệp.",
                  "Thiết lập cổng thanh toán tập trung và quản lý tài khoản người dùng của đối tác.",
                  "Duy trì tỷ lệ tái ký hợp đồng dịch vụ trên 90% hàng năm."
            ],
            "perks": [
                  "Gói phụ cấp GrabCredits hàng tháng",
                  "Môi trường làm việc đa văn hóa"
            ],
            "aiMatch": 89
      },
      {
            "id": 116,
            "title": "Chuyên Viên Khách Hàng Doanh Nghiệp Lớn (CIB RM)",
            "company": "Ngân hàng TMCP Quân Đội (MB Bank)",
            "logo": "https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=120&h=120&q=80",
            "category": "sales",
            "salaryBadge": "25 - 42 triệu",
            "salaryIsOrange": false,
            "location": "Hà Nội",
            "city": "Hà Nội",
            "exp": "2-4 năm",
            "level": "Chuyên viên",
            "type": "Toàn thời gian",
            "isLightningBadge": true,
            "lightningStats": {
                  "applied30d": 15,
                  "evaluated14d": 14,
                  "responseRate": 93,
                  "lastReviewed": "12:00"
            },
            "updated": "5 giờ trước",
            "verified": true,
            "skills": [
                  "Khách hàng doanh nghiệp lớn",
                  "Tín dụng CIB",
                  "Thẩm định hồ sơ",
                  "Bảo lãnh phát hành"
            ],
            "jdSummary": [
                  "Tiếp cận các tập đoàn kinh tế và tổng công ty nhà nước để tài trợ vốn lưu động và dự án.",
                  "Cung cấp các sản phẩm phái sinh tỷ giá, quản lý dòng tiền và tài trợ chuỗi cung ứng.",
                  "Phối hợp với khối Quản trị rủi ro thẩm định phương án vay vốn an toàn."
            ],
            "perks": [
                  "Gói lương thưởng cạnh tranh top ngành ngân hàng",
                  "Lãi suất vay ưu đãi cho CBNV"
            ],
            "aiMatch": 93
      },
      {
            "id": 117,
            "title": "Trưởng Nhóm Tư Vấn Phần Mềm Quản Trị Doanh Nghiệp MISA AMIS",
            "company": "Công ty Cổ phần MISA",
            "logo": "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=120&h=120&q=80",
            "category": "sales",
            "salaryBadge": "20 - 36 triệu",
            "salaryIsOrange": false,
            "location": "Hà Nội & TP.HCM",
            "city": "Hà Nội",
            "exp": "2-4 năm",
            "level": "Trưởng nhóm",
            "type": "Toàn thời gian",
            "isLightningBadge": true,
            "lightningStats": {
                  "applied30d": 18,
                  "evaluated14d": 17,
                  "responseRate": 94,
                  "lastReviewed": "12:00"
            },
            "updated": "5 giờ trước",
            "verified": true,
            "skills": [
                  "SaaS Enterprise",
                  "ERP Consultant",
                  "Demo phần mềm",
                  "Chốt sale SME"
            ],
            "jdSummary": [
                  "Tư vấn nền tảng quản trị tài chính, nhân sự và kế toán hợp nhất MISA AMIS cho lãnh đạo SME.",
                  "Xây dựng kịch bản demo giải pháp chuyên sâu theo đặc thù từng lĩnh vực ngành nghề.",
                  "Dẫn dắt nhóm tư vấn giải pháp đạt định mức doanh thu hàng tháng."
            ],
            "perks": [
                  "Thưởng hoa hồng theo hợp đồng minh bạch",
                  "Chế độ đào tạo kỹ năng bán hàng bài bản"
            ],
            "aiMatch": 90
      },
      {
            "id": 118,
            "title": "Chuyên Viên Phát Triển Kênh Bán Hàng Số & Dịch Vụ IoT",
            "company": "Tổng Công ty Dịch vụ Viễn thông VNPT (VNPT VinaPhone)",
            "logo": "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=120&h=120&q=80",
            "category": "sales",
            "salaryBadge": "22 - 35 triệu",
            "salaryIsOrange": false,
            "location": "Hà Nội",
            "city": "Hà Nội",
            "exp": "1-3 năm",
            "level": "Chuyên viên",
            "type": "Toàn thời gian",
            "isLightningBadge": true,
            "lightningStats": {
                  "applied30d": 12,
                  "evaluated14d": 11,
                  "responseRate": 92,
                  "lastReviewed": "12:00"
            },
            "updated": "6 giờ trước",
            "verified": true,
            "skills": [
                  "Kênh bán hàng số",
                  "Giải pháp IoT",
                  "Dịch vụ số VNPT",
                  "Bán hàng đa kênh"
            ],
            "jdSummary": [
                  "Phát triển mạng lưới bán hàng trên các nền tảng ứng dụng di động và website VinaPhone.",
                  "Cung cấp các gói giải pháp chữ ký số, hóa đơn điện tử và giám sát thông minh cho doanh nghiệp.",
                  "Theo dõi và tối ưu hóa tỷ lệ chuyển đổi đơn hàng trực tuyến."
            ],
            "perks": [
                  "Môi trường làm việc ổn định, phúc lợi toàn diện",
                  "Thưởng thành tích quý"
            ],
            "aiMatch": 88
      },
      {
            "id": 119,
            "title": "Chuyên Viên Khách Hàng Doanh Nghiệp FDI (FDI Account Manager)",
            "company": "Ngân hàng TMCP Ngoại Thương Việt Nam (Vietcombank)",
            "logo": "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=120&h=120&q=80",
            "category": "sales",
            "salaryBadge": "25 - 45 triệu",
            "salaryIsOrange": false,
            "location": "Bình Dương & Đồng Nai",
            "city": "TP.HCM",
            "exp": "2-4 năm",
            "level": "Chuyên viên cao cấp",
            "type": "Toàn thời gian",
            "isLightningBadge": true,
            "lightningStats": {
                  "applied30d": 16,
                  "evaluated14d": 15,
                  "responseRate": 94,
                  "lastReviewed": "12:00"
            },
            "updated": "6 giờ trước",
            "verified": true,
            "skills": [
                  "FDI Banking",
                  "Tiếng Anh/Hàn/Hoa lưu loát",
                  "Tín dụng doanh nghiệp",
                  "Thanh toán quốc tế"
            ],
            "jdSummary": [
                  "Khai thác và chăm sóc các doanh nghiệp có vốn đầu tư nước ngoài tại các khu công nghiệp trọng điểm.",
                  "Tư vấn các gói tài trợ thương mại xuất nhập khẩu, thanh toán L/C và tín dụng dài hạn.",
                  "Giao dịch chuyên nghiệp bằng tiếng Anh hoặc ngoại ngữ chuyên biệt."
            ],
            "perks": [
                  "Chế độ đãi ngộ hàng đầu trong ngành tài chính",
                  "Môi trường làm việc quốc tế"
            ],
            "aiMatch": 95
      },
      {
            "id": 120,
            "title": "Trưởng Nhóm Bán Hàng Trực Tiếp (Direct Sales Team Leader)",
            "company": "Ngân hàng TMCP Tiên Phong (TPBank)",
            "logo": "https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=120&h=120&q=80",
            "category": "sales",
            "salaryBadge": "20 - 35 triệu",
            "salaryIsOrange": false,
            "location": "TP.HCM",
            "city": "TP.HCM",
            "exp": "2-4 năm",
            "level": "Trưởng nhóm",
            "type": "Toàn thời gian",
            "isLightningBadge": true,
            "lightningStats": {
                  "applied30d": 14,
                  "evaluated14d": 13,
                  "responseRate": 93,
                  "lastReviewed": "12:00"
            },
            "updated": "7 giờ trước",
            "verified": true,
            "skills": [
                  "Direct Sales",
                  "Thẻ tín dụng TPBank",
                  "Gói vay tiêu dùng",
                  "Đào tạo nhân viên"
            ],
            "jdSummary": [
                  "Điều hành nhóm 10 chuyên viên tư vấn mở thẻ tín dụng và vay tín chấp tiêu dùng.",
                  "Tổ chức các sự kiện tiếp cận khách hàng tại các tòa nhà văn phòng và trung tâm thương mại.",
                  "Đảm bảo tuân thủ quy trình thẩm định sơ bộ và phòng chống gian lận hồ sơ."
            ],
            "perks": [
                  "Hoa hồng không áp trần theo doanh số",
                  "Thưởng thăng tiến nội bộ nhanh"
            ],
            "aiMatch": 87
      },
      {
            "id": 121,
            "title": "Business Development Lead (Khối Bán Lẻ & Chuỗi F&B)",
            "company": "Công ty Cổ phần Dịch vụ Di động Trực tuyến (MoMo)",
            "logo": "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=120&h=120&q=80",
            "category": "sales",
            "salaryBadge": "28 - 48 triệu",
            "salaryIsOrange": true,
            "location": "TP.HCM",
            "city": "TP.HCM",
            "exp": "3-5 năm",
            "level": "Trưởng nhóm / Quản lý",
            "type": "Toàn thời gian",
            "isLightningBadge": true,
            "lightningStats": {
                  "applied30d": 15,
                  "evaluated14d": 14,
                  "responseRate": 93,
                  "lastReviewed": "12:00"
            },
            "updated": "7 giờ trước",
            "verified": true,
            "skills": [
                  "FinTech BD",
                  "Payment QR",
                  "Thương thảo chuỗi F&B",
                  "Phát triển đối tác"
            ],
            "jdSummary": [
                  "Mở rộng mạng lưới chấp nhận thanh toán MoMo QR tại các chuỗi bán lẻ và nhà hàng lớn.",
                  "Đàm phán các chương trình khuyến mãi đồng tài trợ (Co-marketing) gia tăng lượng giao dịch.",
                  "Theo dõi hiệu quả sử dụng dịch vụ và giải quyết các bài toán vận hành của đối tác."
            ],
            "perks": [
                  "Thưởng cổ phiếu ESOP định kỳ",
                  "Văn phòng sáng tạo, nhiều tiện ích giải trí"
            ],
            "aiMatch": 94
      },
      {
            "id": 122,
            "title": "Quản Lý Kinh Doanh Dự Án Hạng Sang (Luxury Project Sales)",
            "company": "Tập đoàn Masterise Homes",
            "logo": "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=120&h=120&q=80",
            "category": "sales",
            "salaryBadge": "35 - 75 triệu",
            "salaryIsOrange": true,
            "location": "Hà Nội & TP.HCM",
            "city": "TP.HCM",
            "exp": "3-5 năm",
            "level": "Quản lý",
            "type": "Toàn thời gian",
            "isLightningBadge": false,
            "lightningStats": {
                  "applied30d": 11,
                  "evaluated14d": 8,
                  "responseRate": 72,
                  "lastReviewed": "12:00"
            },
            "updated": "8 giờ trước",
            "verified": true,
            "skills": [
                  "BĐS Hàng hiệu",
                  "Branded Residences",
                  "Tư vấn giới thượng lưu",
                  "Đàm phán quốc tế"
            ],
            "jdSummary": [
                  "Phụ trách kinh doanh các căn hộ bất động sản hàng hiệu tiêu chuẩn quốc tế (Marriott/Ritz-Carlton).",
                  "Xây dựng mối quan hệ tin cậy với các khách hàng có giá trị tài sản ròng siêu cao (UHNWI).",
                  "Chủ trì các buổi tiệc riêng tư và sự kiện triển lãm bất động sản cao cấp."
            ],
            "perks": [
                  "Chế độ hoa hồng dự án hạng sang vượt trội",
                  "Môi trường làm việc chuẩn quốc tế"
            ],
            "aiMatch": 92
      },
      {
            "id": 123,
            "title": "Key Account Manager (Kênh Chuỗi Bán Lẻ Điện Máy Toàn Quốc)",
            "company": "Samsung Vina Electronics",
            "logo": "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&w=120&h=120&q=80",
            "category": "sales",
            "salaryBadge": "30 - 52 triệu",
            "salaryIsOrange": true,
            "location": "TP.HCM",
            "city": "TP.HCM",
            "exp": "3-5 năm",
            "level": "Senior / Quản lý",
            "type": "Toàn thời gian",
            "isLightningBadge": true,
            "lightningStats": {
                  "applied30d": 13,
                  "evaluated14d": 12,
                  "responseRate": 92,
                  "lastReviewed": "12:00"
            },
            "updated": "8 giờ trước",
            "verified": true,
            "skills": [
                  "Consumer Electronics",
                  "Key Account Samsung",
                  "Trade Marketing",
                  "Dự báo doanh số"
            ],
            "jdSummary": [
                  "Quản lý doanh số bán hàng sản phẩm TV, tủ lạnh, máy giặt Samsung qua các chuỗi bán lẻ lớn.",
                  "Lập kế hoạch phân bổ tồn kho và tối ưu chính sách giá cạnh tranh theo mùa vụ.",
                  "Phối hợp với Trade Marketing triển khai khu vực trải nghiệm công nghệ tại điểm bán."
            ],
            "perks": [
                  "Chế độ lương thưởng tập đoàn công nghệ số 1",
                  "Ưu đãi mua thiết bị Samsung nội bộ"
            ],
            "aiMatch": 93
      },
      {
            "id": 124,
            "title": "Giám Đốc Bán Hàng Miền Bắc (Regional Sales Manager FMCG)",
            "company": "Tập đoàn KIDO (KIDO Group)",
            "logo": "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=120&h=120&q=80",
            "category": "sales",
            "salaryBadge": "40 - 65 triệu",
            "salaryIsOrange": true,
            "location": "Hà Nội & Các tỉnh phía Bắc",
            "city": "Hà Nội",
            "exp": "Trên 5 năm",
            "level": "Giám đốc vùng",
            "type": "Toàn thời gian",
            "isLightningBadge": true,
            "lightningStats": {
                  "applied30d": 10,
                  "evaluated14d": 9,
                  "responseRate": 90,
                  "lastReviewed": "12:00"
            },
            "updated": "9 giờ trước",
            "verified": true,
            "skills": [
                  "FMCG Sales",
                  "Quản trị hệ thống phân phối",
                  "Kênh GT & MT",
                  "Chiến lược thị phần"
            ],
            "jdSummary": [
                  "Hoạch định chiến lược kinh doanh và mở rộng độ phủ hệ thống phân phối dầu ăn, kem và bánh kẹo KIDO.",
                  "Quản lý hệ thống nhà phân phối và dẫn dắt đội ngũ hơn 100 nhân viên giám sát bán hàng.",
                  "Chịu trách nhiệm trực tiếp về doanh số và chỉ tiêu lợi nhuận gộp toàn miền Bắc."
            ],
            "perks": [
                  "Gói thưởng hiệu quả kinh doanh cuối năm lớn",
                  "Xe ô tô đưa đón công tác"
            ],
            "aiMatch": 91
      },
      {
            "id": 201,
            "title": "Senior Fullstack Engineer (ReactJS, Node.js & AWS)",
            "company": "FPT Software Global",
            "logo": "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=120&h=120&q=80",
            "category": "it",
            "salaryBadge": "30 - 48 triệu",
            "salaryIsOrange": false,
            "location": "Hà Nội (Cầu Giấy)",
            "city": "Hà Nội",
            "exp": "3-5 năm",
            "level": "Senior",
            "type": "Hybrid",
            "isLightningBadge": true,
            "lightningStats": {
                  "applied30d": 25,
                  "evaluated14d": 24,
                  "responseRate": 96,
                  "lastReviewed": "12:00"
            },
            "updated": "10 phút trước",
            "verified": true,
            "skills": [
                  "ReactJS",
                  "Node.js",
                  "TypeScript",
                  "AWS Microservices"
            ],
            "jdSummary": [
                  "Thiết kế kiến trúc hệ thống và phát triển nền tảng FinTech quy mô hàng triệu users.",
                  "Tối ưu hóa hiệu năng render phía client và API throughput phía backend.",
                  "Review code và hướng dẫn chuyên môn cho các kỹ sư cấp dưới."
            ],
            "perks": [
                  "Chế độ làm việc linh hoạt Hybrid",
                  "Cơ hội onsite ngắn hạn tại Nhật Bản và Singapore"
            ],
            "aiMatch": 98
      },
      {
            "id": 202,
            "title": "Principal Software Architect (AI Camera & Mobile OS)",
            "company": "Samsung R&D Institute Vietnam (SRV)",
            "logo": "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&w=120&h=120&q=80",
            "category": "it",
            "salaryBadge": "55 - 85 triệu",
            "salaryIsOrange": true,
            "location": "Hà Nội (Tây Hồ)",
            "city": "Hà Nội",
            "exp": "Trên 5 năm",
            "level": "Architect / Quản lý",
            "type": "Toàn thời gian",
            "isLightningBadge": true,
            "lightningStats": {
                  "applied30d": 11,
                  "evaluated14d": 10,
                  "responseRate": 91,
                  "lastReviewed": "12:00"
            },
            "updated": "25 phút trước",
            "verified": true,
            "skills": [
                  "System Architecture",
                  "C/C++",
                  "AI Algorithms",
                  "Mobile OS Platform"
            ],
            "jdSummary": [
                  "Chủ trì thiết kế kiến trúc phần mềm lõi cho camera thông minh trên các dòng flagship.",
                  "Nghiên cứu áp dụng các mô hình học sâu (Deep Learning) tối ưu trên chip bán dẫn NPU.",
                  "Phối hợp với trung tâm R&D tại Hàn Quốc để đồng bộ tiêu chuẩn kỹ thuật."
            ],
            "perks": [
                  "Gói lương thưởng cạnh tranh bậc nhất ngành công nghệ",
                  "Xe đưa đón CBNV khắp Hà Nội"
            ],
            "aiMatch": 95
      },
      {
            "id": 203,
            "title": "Senior Backend Engineer (Golang, Microservices)",
            "company": "VNG Corporation",
            "logo": "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&w=120&h=120&q=80",
            "category": "it",
            "salaryBadge": "35 - 55 triệu",
            "salaryIsOrange": false,
            "location": "TP.HCM (Quận 7)",
            "city": "TP.HCM",
            "exp": "3-5 năm",
            "level": "Senior",
            "type": "Toàn thời gian",
            "isLightningBadge": true,
            "lightningStats": {
                  "applied30d": 19,
                  "evaluated14d": 17,
                  "responseRate": 89,
                  "lastReviewed": "12:00"
            },
            "updated": "1 giờ trước",
            "verified": true,
            "skills": [
                  "Golang",
                  "Distributed Systems",
                  "Kafka",
                  "Redis Cluster",
                  "K8s"
            ],
            "jdSummary": [
                  "Xây dựng các dịch vụ microservices chịu tải cao (High Concurrency) phục vụ ZaloPay & Games.",
                  "Thiết kế cơ chế cache đa tầng và tối ưu hóa truy vấn dữ liệu phân tán.",
                  "Đảm bảo hệ thống đạt độ sẵn sàng cao 99.99% (High Availability)."
            ],
            "perks": [
                  "Ăn trưa miễn phí tại VNG Campus",
                  "Khu phức hợp thể thao, gym và hồ bơi nội bộ"
            ],
            "aiMatch": 94
      },
      {
            "id": 204,
            "title": "AI Research Scientist / Computer Vision Specialist",
            "company": "VinAI Research",
            "logo": "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=120&h=120&q=80",
            "category": "it",
            "salaryBadge": "40 - 75 triệu",
            "salaryIsOrange": true,
            "location": "Hà Nội",
            "city": "Hà Nội",
            "exp": "3-5 năm",
            "level": "Chuyên gia nghiên cứu",
            "type": "Toàn thời gian",
            "isLightningBadge": true,
            "lightningStats": {
                  "applied30d": 12,
                  "evaluated14d": 10,
                  "responseRate": 83,
                  "lastReviewed": "12:00"
            },
            "updated": "2 giờ trước",
            "verified": true,
            "skills": [
                  "Computer Vision",
                  "PyTorch",
                  "Autonomous Driving",
                  "Deep Learning"
            ],
            "jdSummary": [
                  "Nghiên cứu các thuật toán thị giác máy tính cho hệ thống lái xe tự hành Smart Mobility.",
                  "Công bố các bài báo khoa học tại các hội nghị hàng đầu thế giới (CVPR, ICCV, NeurIPS).",
                  "Triển khai mô hình AI chạy thực tế trên hệ thống xe điện thông minh."
            ],
            "perks": [
                  "Tài nguyên siêu máy tính GPU NVIDIA A100 không giới hạn",
                  "Tài trợ tham dự hội thảo quốc tế"
            ],
            "aiMatch": 91
      },
      {
            "id": 205,
            "title": "Senior DevOps / Cloud Platform Engineer (AWS, K8s)",
            "company": "One Mount Group",
            "logo": "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=120&h=120&q=80",
            "category": "it",
            "salaryBadge": "32 - 50 triệu",
            "salaryIsOrange": false,
            "location": "Hà Nội",
            "city": "Hà Nội",
            "exp": "3-5 năm",
            "level": "Senior",
            "type": "Hybrid",
            "isLightningBadge": false,
            "lightningStats": {
                  "applied30d": 14,
                  "evaluated14d": 10,
                  "responseRate": 71,
                  "lastReviewed": "12:00"
            },
            "updated": "3 giờ trước",
            "verified": true,
            "skills": [
                  "Kubernetes",
                  "Terraform",
                  "CI/CD Pipeline",
                  "AWS Security"
            ],
            "jdSummary": [
                  "Quản lý hạ tầng đám mây đa dịch vụ phục vụ hệ sinh thái VinID và VinShop.",
                  "Tự động hóa hoàn toàn quy trình CI/CD từ dev sang production.",
                  "Giám sát hệ thống với Prometheus, Grafana và phản ứng sự cố 24/7."
            ],
            "perks": [
                  "Gói khám sức khỏe cao cấp tại Vinmec",
                  "Làm việc linh hoạt 2 ngày WFH"
            ],
            "aiMatch": 87
      },
      {
            "id": 206,
            "title": "Tech Lead Mobile Engineer (Flutter & Native)",
            "company": "MoMo Fintech (M-Service)",
            "logo": "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=120&h=120&q=80",
            "category": "it",
            "salaryBadge": "40 - 60 triệu",
            "salaryIsOrange": true,
            "location": "TP.HCM",
            "city": "TP.HCM",
            "exp": "Trên 5 năm",
            "level": "Tech Lead",
            "type": "Toàn thời gian",
            "isLightningBadge": true,
            "lightningStats": {
                  "applied30d": 15,
                  "evaluated14d": 14,
                  "responseRate": 93,
                  "lastReviewed": "12:00"
            },
            "updated": "5 giờ trước",
            "verified": true,
            "skills": [
                  "Flutter",
                  "iOS (Swift)",
                  "Android (Kotlin)",
                  "Clean Architecture"
            ],
            "jdSummary": [
                  "Dẫn dắt đội ngũ kỹ sư mobile phát triển các mini-apps trên siêu ứng dụng MoMo.",
                  "Định hình chuẩn kiến trúc Mobile Clean Architecture và tối ưu hóa thời gian mở app.",
                  "Phối hợp với Product Team để mang lại trải nghiệm UX mượt mà 60fps."
            ],
            "perks": [
                  "Thưởng cổ phiếu ESOP theo hiệu quả công việc",
                  "Bảo hiểm PVI gia đình"
            ],
            "aiMatch": 95
      },
      {
            "id": 207,
            "title": "Kỹ Sư Giải Pháp Mạng 5G & Cloud Core (Senior Network Engineer)",
            "company": "Tổng Công ty Mạng lưới Viettel (Viettel Networks)",
            "logo": "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=120&h=120&q=80",
            "category": "it",
            "salaryBadge": "30 - 52 triệu",
            "salaryIsOrange": false,
            "location": "Hà Nội",
            "city": "Hà Nội",
            "exp": "3-5 năm",
            "level": "Senior",
            "type": "Toàn thời gian",
            "isLightningBadge": true,
            "lightningStats": {
                  "applied30d": 16,
                  "evaluated14d": 15,
                  "responseRate": 94,
                  "lastReviewed": "12:00"
            },
            "updated": "20 phút trước",
            "verified": true,
            "skills": [
                  "5G Core Network",
                  "NFV/SDN",
                  "OpenRAN",
                  "Cisco/Juniper CCNP"
            ],
            "jdSummary": [
                  "Thiết kế và tối ưu mạng lõi 5G SA (Standalone) phục vụ hạ tầng viễn thông quốc gia.",
                  "Triển khai ảo hóa mạng (Network Functions Virtualization) trên nền tảng OpenStack.",
                  "Khắc phục sự cố mạng mức L3 và đảm bảo an toàn an ninh mạng viễn thông."
            ],
            "perks": [
                  "Môi trường nghiên cứu công nghệ hàng đầu",
                  "Chính sách đãi ngộ vượt trội của Viettel"
            ],
            "aiMatch": 93
      },
      {
            "id": 208,
            "title": "Principal Java Engineer (Core Banking Microservices)",
            "company": "Ngân hàng Techcombank",
            "logo": "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=120&h=120&q=80",
            "category": "it",
            "salaryBadge": "45 - 70 triệu",
            "salaryIsOrange": true,
            "location": "Hà Nội & TP.HCM",
            "city": "Hà Nội",
            "exp": "Trên 5 năm",
            "level": "Principal / Lead",
            "type": "Toàn thời gian",
            "isLightningBadge": true,
            "lightningStats": {
                  "applied30d": 18,
                  "evaluated14d": 17,
                  "responseRate": 94,
                  "lastReviewed": "12:00"
            },
            "updated": "35 phút trước",
            "verified": true,
            "skills": [
                  "Java 21",
                  "Spring Boot 3",
                  "Kafka Event-Driven",
                  "PostgreSQL Distributed"
            ],
            "jdSummary": [
                  "Thiết kế kiến trúc hệ thống Core Banking thế hệ mới phục vụ chuyển đổi số Techcombank.",
                  "Đảm bảo chuẩn tuân thủ bảo mật tài chính ngân hàng (PCI-DSS, ISO 27001).",
                  "Cố vấn kỹ thuật và xây dựng chuẩn mã nguồn cho 50+ kỹ sư phần mềm."
            ],
            "perks": [
                  "Thưởng hiệu quả hàng năm hấp dẫn",
                  "Bảo hiểm sức khỏe cao cấp toàn diện"
            ],
            "aiMatch": 97
      },
      {
            "id": 209,
            "title": "Senior Frontend Developer (Vue.js / Nuxt.js & Micro-Frontend)",
            "company": "Công ty Công nghệ Thông tin VNPT (VNPT-IT)",
            "logo": "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=120&h=120&q=80",
            "category": "it",
            "salaryBadge": "25 - 42 triệu",
            "salaryIsOrange": false,
            "location": "Hà Nội",
            "city": "Hà Nội",
            "exp": "3-5 năm",
            "level": "Senior",
            "type": "Toàn thời gian",
            "isLightningBadge": true,
            "lightningStats": {
                  "applied30d": 14,
                  "evaluated14d": 13,
                  "responseRate": 93,
                  "lastReviewed": "12:00"
            },
            "updated": "50 phút trước",
            "verified": true,
            "skills": [
                  "Vue.js 3",
                  "Nuxt.js",
                  "TypeScript",
                  "Module Federation",
                  "TailwindCSS"
            ],
            "jdSummary": [
                  "Phát triển cổng dịch vụ công quốc gia và hệ thống phần mềm quản lý y tế VNPT-eGov.",
                  "Xây dựng kiến trúc Micro-Frontend giúp các module phát triển và triển khai độc lập.",
                  "Tối ưu hóa khả năng truy cập Accessibility (a11y) và tốc độ tải trang Core Web Vitals."
            ],
            "perks": [
                  "Phúc lợi ổn định, thưởng dự án chính phủ",
                  "Hỗ trợ đào tạo chứng chỉ quốc tế"
            ],
            "aiMatch": 91
      },
      {
            "id": 210,
            "title": "Data Infrastructure Engineer (Kafka, Spark & ClickHouse)",
            "company": "Shopee Vietnam",
            "logo": "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=120&h=120&q=80",
            "category": "it",
            "salaryBadge": "35 - 58 triệu",
            "salaryIsOrange": true,
            "location": "TP.HCM (Quận 7)",
            "city": "TP.HCM",
            "exp": "3-5 năm",
            "level": "Senior",
            "type": "Toàn thời gian",
            "isLightningBadge": true,
            "lightningStats": {
                  "applied30d": 12,
                  "evaluated14d": 11,
                  "responseRate": 92,
                  "lastReviewed": "12:00"
            },
            "updated": "1 giờ trước",
            "verified": true,
            "skills": [
                  "Big Data",
                  "Apache Spark",
                  "Kafka Streaming",
                  "ClickHouse",
                  "Hadoop HDFS"
            ],
            "jdSummary": [
                  "Vận hành cụm dữ liệu phân tán quy mô Petabytes xử lý hàng tỷ đơn hàng mỗi ngày.",
                  "Tối ưu hóa pipeline streaming thời gian thực phục vụ báo cáo doanh thu Mega Campaign.",
                  "Phối hợp với Data Science Team để tối ưu hóa truy vấn dữ liệu lớn."
            ],
            "perks": [
                  "Môi trường chuẩn Silicon Valley",
                  "MacBook Pro M3 Max và trợ cấp công việc"
            ],
            "aiMatch": 94
      },
      {
            "id": 211,
            "title": "Senior C++ Engineer (Real-time Audio/Video Streaming)",
            "company": "VNG Corporation (Zalo Platform)",
            "logo": "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&w=120&h=120&q=80",
            "category": "it",
            "salaryBadge": "38 - 60 triệu",
            "salaryIsOrange": true,
            "location": "TP.HCM",
            "city": "TP.HCM",
            "exp": "3-5 năm",
            "level": "Senior",
            "type": "Toàn thời gian",
            "isLightningBadge": true,
            "lightningStats": {
                  "applied30d": 10,
                  "evaluated14d": 9,
                  "responseRate": 90,
                  "lastReviewed": "12:00"
            },
            "updated": "1 giờ trước",
            "verified": true,
            "skills": [
                  "Modern C++",
                  "WebRTC",
                  "Media Codec (H.264/AV1)",
                  "Network Socket",
                  "Multithreading"
            ],
            "jdSummary": [
                  "Tối ưu giao thức truyền tải âm thanh và hình ảnh cho tính năng gọi điện thoại Zalo Call.",
                  "Xử lý độ trễ thấp (Ultra Low Latency) và khả năng thích ứng mạng yếu (Jitter Buffer).",
                  "Viết mã nguồn tối ưu hóa hiệu năng CPU và tiết kiệm pin trên thiết bị di động."
            ],
            "perks": [
                  "Làm việc trên sản phẩm phục vụ 75 triệu người dùng",
                  "Thưởng performance theo quý"
            ],
            "aiMatch": 96
      },
      {
            "id": 212,
            "title": "Embedded Linux Software Engineer (ADAS / Autonomous Car)",
            "company": "Tập đoàn VinFast Toàn Cầu",
            "logo": "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=120&h=120&q=80",
            "category": "it",
            "salaryBadge": "35 - 55 triệu",
            "salaryIsOrange": false,
            "location": "Hải Phòng & Hà Nội",
            "city": "Hà Nội",
            "exp": "2-4 năm",
            "level": "Chuyên viên cao cấp",
            "type": "Toàn thời gian",
            "isLightningBadge": true,
            "lightningStats": {
                  "applied30d": 13,
                  "evaluated14d": 12,
                  "responseRate": 92,
                  "lastReviewed": "12:00"
            },
            "updated": "2 giờ trước",
            "verified": true,
            "skills": [
                  "Embedded C/C++",
                  "Yocto Linux",
                  "QNX RTOS",
                  "CAN Bus",
                  "AUTOSAR"
            ],
            "jdSummary": [
                  "Phát triển phần mềm nhúng điều khiển hệ thống hỗ trợ lái xe nâng cao ADAS trên xe điện VinFast.",
                  "Tích hợp cảm biến radar, lidar và camera nhận diện làn đường thời gian thực.",
                  "Đảm bảo tiêu chuẩn an toàn chức năng ô tô quốc tế ISO 26262 (ASIL D)."
            ],
            "perks": [
                  "Ưu đãi mua ô tô điện VinFast đặc quyền",
                  "Xe đưa đón CBNV Hà Nội - Hải Phòng"
            ],
            "aiMatch": 92
      },
      {
            "id": 213,
            "title": "Senior Mobile Developer (iOS Swift & Android Kotlin)",
            "company": "Ngân hàng TMCP Quân Đội (MB Bank)",
            "logo": "https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=120&h=120&q=80",
            "category": "it",
            "salaryBadge": "30 - 48 triệu",
            "salaryIsOrange": false,
            "location": "Hà Nội",
            "city": "Hà Nội",
            "exp": "3-5 năm",
            "level": "Senior",
            "type": "Toàn thời gian",
            "isLightningBadge": true,
            "lightningStats": {
                  "applied30d": 20,
                  "evaluated14d": 19,
                  "responseRate": 95,
                  "lastReviewed": "12:00"
            },
            "updated": "2 giờ trước",
            "verified": true,
            "skills": [
                  "Swift/SwiftUI",
                  "Kotlin/Jetpack Compose",
                  "Mobile Security",
                  "Biometrics eKYC"
            ],
            "jdSummary": [
                  "Phát triển các tính năng chuyển khoản, đầu tư và tích điểm loyalty trên App MBBank.",
                  "Tích hợp giải pháp xác thực sinh trắc học khuôn mặt eKYC bảo mật cao theo chuẩn NHNN.",
                  "Tối ưu hóa trải nghiệm giao diện người dùng mượt mà và tương thích đa kích thước màn hình."
            ],
            "perks": [
                  "Thưởng cuối năm 4-6 tháng lương",
                  "Chế độ phụ cấp công nghệ hàng tháng"
            ],
            "aiMatch": 95
      },
      {
            "id": 214,
            "title": "Senior Security Engineer (SOC & Red Team Penetration Testing)",
            "company": "Công ty An ninh mạng CMC (CMC Cyber Security)",
            "logo": "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=120&h=120&q=80",
            "category": "it",
            "salaryBadge": "28 - 45 triệu",
            "salaryIsOrange": false,
            "location": "Hà Nội",
            "city": "Hà Nội",
            "exp": "3-5 năm",
            "level": "Senior",
            "type": "Toàn thời gian",
            "isLightningBadge": true,
            "lightningStats": {
                  "applied30d": 11,
                  "evaluated14d": 10,
                  "responseRate": 91,
                  "lastReviewed": "12:00"
            },
            "updated": "3 giờ trước",
            "verified": true,
            "skills": [
                  "Penetration Testing",
                  "SIEM / SOC",
                  "CEH / OSCP",
                  "Reverse Engineering",
                  "Malware Analysis"
            ],
            "jdSummary": [
                  "Thực hiện kiểm thử xâm nhập (Pentest) định kỳ cho các hệ thống ngân hàng và cơ quan chính phủ.",
                  "Giám sát và phân tích các cuộc tấn công mạng DDoS, Ransomware trên trung tâm SOC.",
                  "Xây dựng quy trình ứng cứu sự cố bảo mật thông tin chuẩn quốc tế."
            ],
            "perks": [
                  "Được tài trợ 100% lệ phí thi chứng chỉ quốc tế OSCP/CISSP",
                  "Môi trường an ninh mạng top 1"
            ],
            "aiMatch": 90
      },
      {
            "id": 215,
            "title": "Lead Data Engineer (Real-time Recommendation Engine)",
            "company": "Tiki Corporation",
            "logo": "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=120&h=120&q=80",
            "category": "it",
            "salaryBadge": "40 - 62 triệu",
            "salaryIsOrange": true,
            "location": "TP.HCM",
            "city": "TP.HCM",
            "exp": "Trên 5 năm",
            "level": "Lead / Principal",
            "type": "Toàn thời gian",
            "isLightningBadge": true,
            "lightningStats": {
                  "applied30d": 14,
                  "evaluated14d": 13,
                  "responseRate": 93,
                  "lastReviewed": "12:00"
            },
            "updated": "3 giờ trước",
            "verified": true,
            "skills": [
                  "Data Architecture",
                  "Flink Streaming",
                  "Vector DB (Milvus)",
                  "Python",
                  "Airflow"
            ],
            "jdSummary": [
                  "Chủ trì kiến trúc nền tảng dữ liệu gợi ý sản phẩm cá nhân hóa theo hành vi người dùng.",
                  "Xây dựng luồng xử lý dữ liệu thời gian thực với Apache Flink và lưu trữ trên Vector Database.",
                  "Dẫn dắt đội ngũ 6 kỹ sư dữ liệu tối ưu hóa thời gian tính toán model từ vài giờ xuống mili-giây."
            ],
            "perks": [
                  "Chế độ cổ phiếu ESOP hấp dẫn",
                  "Bảo hiểm sức khỏe quốc tế"
            ],
            "aiMatch": 93
      },
      {
            "id": 216,
            "title": "Senior Backend Engineer (Go & High Concurrency Dispatch)",
            "company": "Công ty Cổ phần Be Group",
            "logo": "https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=120&h=120&q=80",
            "category": "it",
            "salaryBadge": "32 - 50 triệu",
            "salaryIsOrange": false,
            "location": "Hà Nội & TP.HCM",
            "city": "TP.HCM",
            "exp": "3-5 năm",
            "level": "Senior",
            "type": "Toàn thời gian",
            "isLightningBadge": true,
            "lightningStats": {
                  "applied30d": 15,
                  "evaluated14d": 14,
                  "responseRate": 93,
                  "lastReviewed": "12:00"
            },
            "updated": "4 giờ trước",
            "verified": true,
            "skills": [
                  "Golang",
                  "Geo-spatial Indexing",
                  "Redis Cluster",
                  "High Concurrency",
                  "Docker/K8s"
            ],
            "jdSummary": [
                  "Thiết kế thuật toán điều phối xe (Ride Matching) tối ưu khoảng cách và thời gian đón khách.",
                  "Xử lý hàng trăm nghìn truy vấn tìm xe đồng thời vào các khung giờ cao điểm và mưa bão.",
                  "Tối ưu hóa kiến trúc hạ tầng giảm thiểu chi phí máy chủ đám mây AWS."
            ],
            "perks": [
                  "Gói di chuyển Be miễn phí",
                  "Thưởng nóng dự án phát triển công nghệ mới"
            ],
            "aiMatch": 92
      },
      {
            "id": 217,
            "title": "Chuyên Gia Giải Pháp ERP SAP S/4HANA (Lead SAP Consultant)",
            "company": "Công ty Hệ thống Thông tin FPT (FPT IS)",
            "logo": "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=120&h=120&q=80",
            "category": "it",
            "salaryBadge": "35 - 55 triệu",
            "salaryIsOrange": false,
            "location": "Hà Nội & TP.HCM",
            "city": "Hà Nội",
            "exp": "3-5 năm",
            "level": "Chuyên gia cao cấp",
            "type": "Toàn thời gian",
            "isLightningBadge": true,
            "lightningStats": {
                  "applied30d": 12,
                  "evaluated14d": 11,
                  "responseRate": 92,
                  "lastReviewed": "12:00"
            },
            "updated": "4 giờ trước",
            "verified": true,
            "skills": [
                  "SAP S/4HANA",
                  "FI/CO Module",
                  "Tư vấn triển khai ERP",
                  "Thiết kế quy trình doanh nghiệp"
            ],
            "jdSummary": [
                  "Chủ trì tư vấn và triển khai giải pháp ERP SAP S/4HANA cho các tập đoàn sản xuất lớn.",
                  "Khảo sát yêu cầu nghiệp vụ tài chính, chuỗi cung ứng và thiết kế cấu hình phân hệ FI/CO.",
                  "Đào tạo chuyển giao công nghệ và hỗ trợ người dùng go-live thành công."
            ],
            "perks": [
                  "Thưởng dự án theo từng giai đoạn nghiệm thu",
                  "Bảo hiểm FPT Care"
            ],
            "aiMatch": 91
      },
      {
            "id": 218,
            "title": "Kỹ Sư An Toàn Thông Tin & Phòng Chống Gian Lận (CyberSec Fraud Detection)",
            "company": "Ngân hàng TMCP Ngoại Thương Việt Nam (Vietcombank)",
            "logo": "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=120&h=120&q=80",
            "category": "it",
            "salaryBadge": "30 - 48 triệu",
            "salaryIsOrange": false,
            "location": "Hà Nội",
            "city": "Hà Nội",
            "exp": "3-5 năm",
            "level": "Senior",
            "type": "Toàn thời gian",
            "isLightningBadge": true,
            "lightningStats": {
                  "applied30d": 17,
                  "evaluated14d": 16,
                  "responseRate": 94,
                  "lastReviewed": "12:00"
            },
            "updated": "5 giờ trước",
            "verified": true,
            "skills": [
                  "Fraud Detection",
                  "AI Pattern Recognition",
                  "An toàn giao dịch thẻ",
                  "PCI-DSS"
            ],
            "jdSummary": [
                  "Xây dựng hệ thống cảnh báo sớm giao dịch đáng ngờ và ngăn chặn gian lận thẻ tín dụng trực tuyến.",
                  "Ứng dụng học máy (Machine Learning) để phát hiện tài khoản bất thường theo thời gian thực.",
                  "Đảm bảo tuyệt đối an toàn bảo mật tài sản cho hàng chục triệu khách hàng Vietcombank."
            ],
            "perks": [
                  "Môi trường chuẩn ngân hàng nhà nước số 1",
                  "Chế độ đãi ngộ vượt trội dài hạn"
            ],
            "aiMatch": 95
      },
      {
            "id": 219,
            "title": "Senior Python / AI Engineer (LLM & CV Matching Model)",
            "company": "TopCV Vietnam",
            "logo": "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=120&h=120&q=80",
            "category": "it",
            "salaryBadge": "30 - 50 triệu",
            "salaryIsOrange": false,
            "location": "Hà Nội",
            "city": "Hà Nội",
            "exp": "2-4 năm",
            "level": "Senior",
            "type": "Toàn thời gian",
            "isLightningBadge": true,
            "lightningStats": {
                  "applied30d": 22,
                  "evaluated14d": 21,
                  "responseRate": 95,
                  "lastReviewed": "12:00"
            },
            "updated": "5 giờ trước",
            "verified": true,
            "skills": [
                  "Python FastApi",
                  "LangChain",
                  "OpenAI/Anthropic API",
                  "Semantic Search",
                  "Vector DB"
            ],
            "jdSummary": [
                  "Phát triển mô hình AI phân tích hồ sơ ứng viên và khớp nối tự động với yêu cầu tuyển dụng.",
                  "Tối ưu hóa thuật toán tìm kiếm ngữ nghĩa (Semantic Search) giúp gợi ý việc làm chính xác.",
                  "Xây dựng hệ thống prompt engineering và fine-tune mô hình ngôn ngữ lớn (LLM)."
            ],
            "perks": [
                  "Được làm việc với dữ liệu tuyển dụng lớn nhất Việt Nam",
                  "Môi trường làm việc trẻ trung sáng tạo"
            ],
            "aiMatch": 94
      },
      {
            "id": 220,
            "title": "Senior Cloud Architect (AWS & Google Cloud Platform)",
            "company": "Ngân hàng TMCP Việt Nam Thịnh Vượng (VPBank)",
            "logo": "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=120&h=120&q=80",
            "category": "it",
            "salaryBadge": "40 - 65 triệu",
            "salaryIsOrange": true,
            "location": "Hà Nội",
            "city": "Hà Nội",
            "exp": "Trên 5 năm",
            "level": "Architect / Quản lý",
            "type": "Toàn thời gian",
            "isLightningBadge": true,
            "lightningStats": {
                  "applied30d": 13,
                  "evaluated14d": 12,
                  "responseRate": 92,
                  "lastReviewed": "12:00"
            },
            "updated": "6 giờ trước",
            "verified": true,
            "skills": [
                  "AWS Solutions Architect",
                  "GCP Multi-cloud",
                  "Landing Zone",
                  "FinOps",
                  "IaC Terraform"
            ],
            "jdSummary": [
                  "Hoạch định chiến lược chuyển đổi toàn bộ ứng dụng ngân hàng lên hạ tầng đám mây đa nền tảng.",
                  "Thiết kế kiến trúc mạng ảo (VPC/Direct Connect) và hệ thống phân quyền IAM an toàn tuyệt đối.",
                  "Áp dụng thực hành FinOps tối ưu hóa chi phí vận hành hạ tầng đám mây định kỳ."
            ],
            "perks": [
                  "Gói thu nhập hấp dẫn thuộc top đầu thị trường",
                  "Cơ hội thăng tiến lên Head of Cloud"
            ],
            "aiMatch": 96
      },
      {
            "id": 221,
            "title": "Lead Automation QA Engineer (Playwright, Selenium & CI/CD)",
            "company": "TMA Solutions",
            "logo": "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=120&h=120&q=80",
            "category": "it",
            "salaryBadge": "26 - 40 triệu",
            "salaryIsOrange": false,
            "location": "TP.HCM & Bình Định",
            "city": "TP.HCM",
            "exp": "3-5 năm",
            "level": "Lead QA",
            "type": "Hybrid",
            "isLightningBadge": true,
            "lightningStats": {
                  "applied30d": 15,
                  "evaluated14d": 14,
                  "responseRate": 93,
                  "lastReviewed": "12:00"
            },
            "updated": "6 giờ trước",
            "verified": true,
            "skills": [
                  "Playwright",
                  "Selenium WebDriver",
                  "Java/TypeScript",
                  "Jenkins Pipeline",
                  "Performance Testing"
            ],
            "jdSummary": [
                  "Xây dựng framework kiểm thử tự động hóa toàn diện từ API đến End-to-End UI.",
                  "Tích hợp bộ kiểm thử tự động vào quy trình CI/CD đảm bảo chất lượng release hàng tuần.",
                  "Đào tạo và nâng cao năng lực viết test automation cho đội ngũ kiểm thử phần mềm."
            ],
            "perks": [
                  "Chế độ onsite Bắc Mỹ và châu Âu",
                  "Môi trường làm việc năng động bền vững"
            ],
            "aiMatch": 89
      },
      {
            "id": 222,
            "title": "Senior Fullstack Developer (.NET Core & Angular)",
            "company": "KMS Technology",
            "logo": "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=120&h=120&q=80",
            "category": "it",
            "salaryBadge": "28 - 45 triệu",
            "salaryIsOrange": false,
            "location": "TP.HCM & Đà Nẵng",
            "city": "TP.HCM",
            "exp": "3-5 năm",
            "level": "Senior",
            "type": "Toàn thời gian",
            "isLightningBadge": true,
            "lightningStats": {
                  "applied30d": 16,
                  "evaluated14d": 15,
                  "responseRate": 94,
                  "lastReviewed": "12:00"
            },
            "updated": "7 giờ trước",
            "verified": true,
            "skills": [
                  ".NET 8 C#",
                  "Angular 17",
                  "SQL Server Enterprise",
                  "Azure DevOps",
                  "Clean Code"
            ],
            "jdSummary": [
                  "Phát triển các sản phẩm phần mềm SaaS phục vụ khách hàng doanh nghiệp tại thị trường Mỹ.",
                  "Xây dựng kiến trúc RESTful API chuẩn mực và tối ưu hóa xử lý cơ sở dữ liệu lớn.",
                  "Thực hiện code review và đảm bảo độ bao phủ unit test đạt tối thiểu 80%."
            ],
            "perks": [
                  "Gói bảo hiểm sức khỏe quốc tế cao cấp",
                  "Phụ cấp học tiếng Anh và chứng chỉ Microsoft"
            ],
            "aiMatch": 92
      },
      {
            "id": 223,
            "title": "Senior Solutions Architect (Enterprise FinTech)",
            "company": "NashTech Vietnam",
            "logo": "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=120&h=120&q=80",
            "category": "it",
            "salaryBadge": "45 - 68 triệu",
            "salaryIsOrange": true,
            "location": "Hà Nội & TP.HCM",
            "city": "Hà Nội",
            "exp": "Trên 5 năm",
            "level": "Solutions Architect",
            "type": "Toàn thời gian",
            "isLightningBadge": true,
            "lightningStats": {
                  "applied30d": 11,
                  "evaluated14d": 10,
                  "responseRate": 91,
                  "lastReviewed": "12:00"
            },
            "updated": "7 giờ trước",
            "verified": true,
            "skills": [
                  "Solutions Architecture",
                  "FinTech Platforms",
                  "Domain-Driven Design",
                  "Cloud Native"
            ],
            "jdSummary": [
                  "Tư vấn kiến trúc công nghệ toàn diện cho các định chế tài chính và ngân hàng tại Anh Quốc và Úc.",
                  "Thiết kế hệ thống thanh toán xuyên biên giới với khả năng mở rộng quy mô lớn.",
                  "Lãnh đạo kỹ thuật cho các đội ngũ phát triển đa quốc gia."
            ],
            "perks": [
                  "Cơ hội công tác tại văn phòng Luân Đôn định kỳ",
                  "Gói lương thưởng cạnh tranh quốc tế"
            ],
            "aiMatch": 95
      },
      {
            "id": 224,
            "title": "Senior Java Backend Engineer (Payment Gateway & Core QR)",
            "company": "Công ty Cổ phần Giải pháp Thanh toán Việt Nam (VNPAY)",
            "logo": "https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=120&h=120&q=80",
            "category": "it",
            "salaryBadge": "30 - 50 triệu",
            "salaryIsOrange": false,
            "location": "Hà Nội",
            "city": "Hà Nội",
            "exp": "3-5 năm",
            "level": "Senior",
            "type": "Toàn thời gian",
            "isLightningBadge": true,
            "lightningStats": {
                  "applied30d": 19,
                  "evaluated14d": 18,
                  "responseRate": 95,
                  "lastReviewed": "12:00"
            },
            "updated": "8 giờ trước",
            "verified": true,
            "skills": [
                  "Java Core",
                  "High Throughput Gateway",
                  "ISO 8583 Message",
                  "PostgreSQL",
                  "Redis"
            ],
            "jdSummary": [
                  "Phát triển hệ thống xử lý giao dịch cổng thanh toán VNPAY-QR kết nối hơn 40 ngân hàng.",
                  "Tối ưu hóa thời gian xử lý giao dịch dưới 200ms với độ tin cậy tuyệt đối 99.999%.",
                  "Đảm bảo các tiêu chuẩn mã hóa dữ liệu nhạy cảm của khách hàng."
            ],
            "perks": [
                  "Thưởng Tết và thưởng dự án hàng đầu ngành FinTech",
                  "Gói khám sức khỏe toàn diện"
            ],
            "aiMatch": 94
      },
      {
            "id": 301,
            "title": "Trưởng Nhóm Digital Marketing & Performance Ads",
            "company": "VNG Corporation (Zalo)",
            "logo": "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&w=120&h=120&q=80",
            "category": "marketing",
            "salaryBadge": "28 - 42 triệu",
            "salaryIsOrange": false,
            "location": "TP.HCM",
            "city": "TP.HCM",
            "exp": "3-5 năm",
            "level": "Trưởng nhóm",
            "type": "Toàn thời gian",
            "isLightningBadge": true,
            "lightningStats": {
                  "applied30d": 16,
                  "evaluated14d": 14,
                  "responseRate": 87,
                  "lastReviewed": "12:00"
            },
            "updated": "20 phút trước",
            "verified": true,
            "skills": [
                  "Performance Marketing",
                  "Meta Ads",
                  "Google Ads",
                  "Data Analytics",
                  "CRO"
            ],
            "jdSummary": [
                  "Quản lý ngân sách Digital Ads hàng tháng cho các sản phẩm công nghệ trọng điểm.",
                  "Tối ưu hóa phễu chuyển đổi (Funnel Optimization) và chỉ số CAC / LTV.",
                  "Phối hợp với Creative Team để A/B testing thông điệp truyền thông."
            ],
            "perks": [
                  "Môi trường năng động số 1 ngành Tech",
                  "Ngân sách thử nghiệm chiến dịch lớn"
            ],
            "aiMatch": 93
      },
      {
            "id": 302,
            "title": "Senior Brand Manager (Ngành Tiêu Dùng FMCG)",
            "company": "Masan Consumer Holdings",
            "logo": "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=120&h=120&q=80",
            "category": "marketing",
            "salaryBadge": "35 - 55 triệu",
            "salaryIsOrange": true,
            "location": "TP.HCM",
            "city": "TP.HCM",
            "exp": "Trên 5 năm",
            "level": "Trưởng phòng / Quản lý",
            "type": "Toàn thời gian",
            "isLightningBadge": true,
            "lightningStats": {
                  "applied30d": 17,
                  "evaluated14d": 16,
                  "responseRate": 94,
                  "lastReviewed": "12:00"
            },
            "updated": "45 phút trước",
            "verified": true,
            "skills": [
                  "Brand Strategy",
                  "Product Launch",
                  "Trade Marketing",
                  "Quản trị ngân sách"
            ],
            "jdSummary": [
                  "Xây dựng chiến lược định vị và phát triển thị phần thương hiệu quốc gia.",
                  "Lập kế hoạch ra mắt sản phẩm mới (NPD) trên mạng lưới phân phối toàn quốc.",
                  "Đo lường sức khỏe thương hiệu (Brand Health Tracking) định kỳ hàng quý."
            ],
            "perks": [
                  "Thưởng doanh số năm cạnh tranh",
                  "Chính sách mua sản phẩm Masan ưu đãi cao"
            ],
            "aiMatch": 95
      },
      {
            "id": 303,
            "title": "Chuyên Viên SEO & Growth Marketing",
            "company": "Shopee Vietnam",
            "logo": "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=120&h=120&q=80",
            "category": "marketing",
            "salaryBadge": "20 - 32 triệu",
            "salaryIsOrange": false,
            "location": "TP.HCM",
            "city": "TP.HCM",
            "exp": "2-4 năm",
            "level": "Chuyên viên",
            "type": "Toàn thời gian",
            "isLightningBadge": true,
            "lightningStats": {
                  "applied30d": 11,
                  "evaluated14d": 9,
                  "responseRate": 82,
                  "lastReviewed": "12:00"
            },
            "updated": "2 giờ trước",
            "verified": true,
            "skills": [
                  "Technical SEO",
                  "Keyword Research",
                  "Google Analytics 4",
                  "Content Strategy"
            ],
            "jdSummary": [
                  "Tối ưu hóa thứ hạng tìm kiếm tự nhiên của hàng triệu trang sản phẩm ngành hàng.",
                  "Nghiên cứu xu hướng từ khóa mùa vụ và chỉ đạo nội dung bài viết chất lượng.",
                  "Phân tích lưu lượng organic traffic và tỷ lệ thoát trang."
            ],
            "perks": [
                  "Làm việc cùng các chuyên gia SEO đầu ngành khu vực Đông Nam Á",
                  "Thưởng dự án Mega Sale"
            ],
            "aiMatch": 89
      },
      {
            "id": 304,
            "title": "Public Relations (PR) & Communications Manager",
            "company": "Tập đoàn VinFast Toàn Cầu",
            "logo": "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=120&h=120&q=80",
            "category": "marketing",
            "salaryBadge": "30 - 50 triệu",
            "salaryIsOrange": true,
            "location": "Hà Nội",
            "city": "Hà Nội",
            "exp": "3-5 năm",
            "level": "Quản lý",
            "type": "Toàn thời gian",
            "isLightningBadge": true,
            "lightningStats": {
                  "applied30d": 10,
                  "evaluated14d": 9,
                  "responseRate": 90,
                  "lastReviewed": "12:00"
            },
            "updated": "3 giờ trước",
            "verified": true,
            "skills": [
                  "Quan hệ báo chí",
                  "Quản trị khủng hoảng truyền thông",
                  "Thông cáo báo chí",
                  "Event PR"
            ],
            "jdSummary": [
                  "Xây dựng mối quan hệ bền vững với các cơ quan thông tấn báo chí trong và ngoài nước.",
                  "Soạn thảo các thông cáo báo chí, bài phát biểu cho lãnh đạo cấp cao của tập đoàn.",
                  "Chủ động phát hiện và xử lý khủng hoảng truyền thông mạng xã hội 24/7."
            ],
            "perks": [
                  "Ưu đãi mua ô tô điện VinFast đặc quyền",
                  "Môi trường toàn cầu chuyên nghiệp"
            ],
            "aiMatch": 92
      },
      {
            "id": 305,
            "title": "Content Marketing Lead & Social Creative",
            "company": "Sun Group Corporation",
            "logo": "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=120&h=120&q=80",
            "category": "marketing",
            "salaryBadge": "22 - 35 triệu",
            "salaryIsOrange": false,
            "location": "Đà Nẵng & Hà Nội",
            "city": "Hà Nội",
            "exp": "2-4 năm",
            "level": "Trưởng nhóm",
            "type": "Toàn thời gian",
            "isLightningBadge": false,
            "lightningStats": {
                  "applied30d": 13,
                  "evaluated14d": 9,
                  "responseRate": 69,
                  "lastReviewed": "12:00"
            },
            "updated": "4 giờ trước",
            "verified": true,
            "skills": [
                  "Content Direction",
                  "Viral Video",
                  "TikTok Marketing",
                  "Storytelling Du lịch"
            ],
            "jdSummary": [
                  "Chịu trách nhiệm định hướng nội dung sáng tạo cho các điểm đến Sun World.",
                  "Sản xuất video ngắn triệu view trên TikTok, YouTube Shorts và Facebook Reels.",
                  "Quản lý chất lượng bài viết của đội ngũ copywriter và agency bên ngoài."
            ],
            "perks": [
                  "Vé tham quan miễn phí các công viên Sun World",
                  "Nghỉ dưỡng Sun Hospitality hàng năm"
            ],
            "aiMatch": 86
      },
      {
            "id": 306,
            "title": "Senior Media Planner & Account Manager",
            "company": "Dentsu Redder Vietnam",
            "logo": "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=120&h=120&q=80",
            "category": "marketing",
            "salaryBadge": "25 - 38 triệu",
            "salaryIsOrange": false,
            "location": "TP.HCM",
            "city": "TP.HCM",
            "exp": "2-4 năm",
            "level": "Senior",
            "type": "Hybrid",
            "isLightningBadge": true,
            "lightningStats": {
                  "applied30d": 12,
                  "evaluated14d": 10,
                  "responseRate": 83,
                  "lastReviewed": "12:00"
            },
            "updated": "6 giờ trước",
            "verified": true,
            "skills": [
                  "Media Planning",
                  "Agency Account",
                  "Đàm phán Booking",
                  "Chiến dịch 360"
            ],
            "jdSummary": [
                  "Tư vấn kế hoạch truyền thông tích hợp (Integrated Media Plan) cho các thương hiệu Fortune 500.",
                  "Phân bổ ngân sách truyền thông trên các kênh truyền hình, OOH và digital platforms.",
                  "Điều phối tiến độ chiến dịch và nghiệm thu KPI truyền thông với khách hàng."
            ],
            "perks": [
                  "Được vinh danh tại các giải thưởng ngành truyền thông",
                  "Môi trường Agency trẻ trung"
            ],
            "aiMatch": 90
      },
      {
            "id": 307,
            "title": "Trưởng Phòng Truyền Thông & Tiếp Thị Kỹ Thuật Số",
            "company": "Công ty Cổ phần Viễn thông FPT (FPT Telecom)",
            "logo": "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=120&h=120&q=80",
            "category": "marketing",
            "salaryBadge": "30 - 48 triệu",
            "salaryIsOrange": true,
            "location": "Hà Nội",
            "city": "Hà Nội",
            "exp": "3-5 năm",
            "level": "Trưởng phòng",
            "type": "Toàn thời gian",
            "isLightningBadge": true,
            "lightningStats": {
                  "applied30d": 15,
                  "evaluated14d": 14,
                  "responseRate": 93,
                  "lastReviewed": "12:00"
            },
            "updated": "25 phút trước",
            "verified": true,
            "skills": [
                  "Digital Strategy",
                  "Omnichannel Marketing",
                  "Quản lý ngân sách",
                  "Brand Awareness"
            ],
            "jdSummary": [
                  "Hoạch định chiến lược tiếp thị đa kênh cho các dòng sản phẩm Internet, FPT Camera và Smart Home.",
                  "Quản lý ngân sách Digital Marketing hàng chục tỷ đồng mỗi năm.",
                  "Lãnh đạo đội ngũ 12 chuyên viên tiếp thị số và truyền thông thương hiệu."
            ],
            "perks": [
                  "Chế độ phúc lợi tập đoàn FPT toàn diện",
                  "Thưởng hoàn thành kế hoạch năm"
            ],
            "aiMatch": 94
      },
      {
            "id": 308,
            "title": "Quản Lý Chiến Dịch Marketing Chuỗi Bách Hóa Xanh",
            "company": "Công ty Cổ phần Đầu tư Thế Giới Di Động (MWG)",
            "logo": "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=120&h=120&q=80",
            "category": "marketing",
            "salaryBadge": "28 - 45 triệu",
            "salaryIsOrange": false,
            "location": "TP.HCM",
            "city": "TP.HCM",
            "exp": "3-5 năm",
            "level": "Quản lý chiến dịch",
            "type": "Toàn thời gian",
            "isLightningBadge": true,
            "lightningStats": {
                  "applied30d": 14,
                  "evaluated14d": 13,
                  "responseRate": 93,
                  "lastReviewed": "12:00"
            },
            "updated": "40 phút trước",
            "verified": true,
            "skills": [
                  "Retail Marketing",
                  "Khuyến mãi chuỗi",
                  "Trade Marketing",
                  "Phân tích hành vi mua sắm"
            ],
            "jdSummary": [
                  "Lên kế hoạch và triển khai các chiến dịch khuyến mãi lớn tại hơn 1.700 điểm bán Bách Hóa Xanh.",
                  "Phối hợp với bộ phận thu mua (Buying) đàm phán quyền lợi tài trợ từ các nhà cung cấp lớn.",
                  "Đo lường hiệu quả tăng trưởng lượt khách ghé cửa hàng (Footfall Traffic) và giá trị giỏ hàng."
            ],
            "perks": [
                  "Gói cổ phiếu thưởng ESOP thường niên",
                  "Môi trường làm việc năng động thực chiến"
            ],
            "aiMatch": 93
      },
      {
            "id": 309,
            "title": "Brand Experience & Employer Branding Specialist",
            "company": "Ngân hàng Techcombank",
            "logo": "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=120&h=120&q=80",
            "category": "marketing",
            "salaryBadge": "22 - 36 triệu",
            "salaryIsOrange": false,
            "location": "Hà Nội & TP.HCM",
            "city": "Hà Nội",
            "exp": "2-4 năm",
            "level": "Chuyên viên cao cấp",
            "type": "Toàn thời gian",
            "isLightningBadge": true,
            "lightningStats": {
                  "applied30d": 16,
                  "evaluated14d": 15,
                  "responseRate": 94,
                  "lastReviewed": "12:00"
            },
            "updated": "1 giờ trước",
            "verified": true,
            "skills": [
                  "Employer Branding",
                  "Trải nghiệm thương hiệu",
                  "Tổ chức sự kiện",
                  "Sáng tạo nội dung"
            ],
            "jdSummary": [
                  "Xây dựng hình ảnh Thương hiệu Nhà tuyển dụng số 1 ngành ngân hàng qua các chiến dịch truyền thông.",
                  "Tổ chức các sự kiện trải nghiệm thương hiệu (Techcombank Marathon, Tech Day).",
                  "Đo lường mức độ tương tác và nhận diện thương hiệu trên các kênh mạng xã hội chuyên nghiệp."
            ],
            "perks": [
                  "Môi trường ngân hàng chuyển đổi số xuất sắc",
                  "Bảo hiểm chăm sóc sức khỏe gia đình"
            ],
            "aiMatch": 91
      },
      {
            "id": 310,
            "title": "Senior Growth Marketing Manager (Acquisition & Retention)",
            "company": "Grab Vietnam",
            "logo": "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=120&h=120&q=80",
            "category": "marketing",
            "salaryBadge": "35 - 55 triệu",
            "salaryIsOrange": true,
            "location": "TP.HCM",
            "city": "TP.HCM",
            "exp": "3-5 năm",
            "level": "Senior Manager",
            "type": "Toàn thời gian",
            "isLightningBadge": true,
            "lightningStats": {
                  "applied30d": 13,
                  "evaluated14d": 12,
                  "responseRate": 92,
                  "lastReviewed": "12:00"
            },
            "updated": "1 giờ trước",
            "verified": true,
            "skills": [
                  "Growth Marketing",
                  "User Acquisition",
                  "Retention Funnel",
                  "A/B Testing",
                  "SQL"
            ],
            "jdSummary": [
                  "Phát triển các chiến lược tăng trưởng người dùng mới cho dịch vụ GrabFood và GrabMart.",
                  "Thiết kế các chương trình khách hàng thân thiết và thử nghiệm mã ưu đãi cá nhân hóa.",
                  "Tối ưu hóa chi phí thu hút khách hàng (CAC) và giá trị vòng đời (LTV)."
            ],
            "perks": [
                  "Gói phụ cấp GrabCredits hàng tháng",
                  "Cơ hội thăng tiến khu vực Đông Nam Á"
            ],
            "aiMatch": 95
      },
      {
            "id": 311,
            "title": "Trưởng Nhóm Marketing Kỹ Thuật Số & B2B Branding",
            "company": "Tổng Công ty Cổ phần Bưu chính Viettel (Viettel Post)",
            "logo": "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=120&h=120&q=80",
            "category": "marketing",
            "salaryBadge": "25 - 40 triệu",
            "salaryIsOrange": false,
            "location": "Hà Nội",
            "city": "Hà Nội",
            "exp": "2-4 năm",
            "level": "Trưởng nhóm",
            "type": "Toàn thời gian",
            "isLightningBadge": true,
            "lightningStats": {
                  "applied30d": 15,
                  "evaluated14d": 14,
                  "responseRate": 93,
                  "lastReviewed": "12:00"
            },
            "updated": "2 giờ trước",
            "verified": true,
            "skills": [
                  "B2B Marketing",
                  "Logistics Branding",
                  "Lead Generation",
                  "Chiến dịch số"
            ],
            "jdSummary": [
                  "Định vị thương hiệu Viettel Post là đối tác chuyển phát logistics công nghệ tin cậy hàng đầu.",
                  "Triển khai các chiến dịch tìm kiếm khách hàng doanh nghiệp thương mại điện tử lớn.",
                  "Sản xuất các tài liệu giới thiệu giải pháp logistics thông minh (Case Study, Whitepaper)."
            ],
            "perks": [
                  "Chế độ đãi ngộ quân đội kỷ luật và chuyên nghiệp",
                  "Thưởng thành tích quý"
            ],
            "aiMatch": 90
      },
      {
            "id": 312,
            "title": "Creative Lead & Copywriter (Chiến Dịch Siêu Ứng Dụng MoMo)",
            "company": "Công ty Cổ phần Dịch vụ Di động Trực tuyến (MoMo)",
            "logo": "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=120&h=120&q=80",
            "category": "marketing",
            "salaryBadge": "28 - 45 triệu",
            "salaryIsOrange": false,
            "location": "TP.HCM",
            "city": "TP.HCM",
            "exp": "3-5 năm",
            "level": "Creative Lead",
            "type": "Toàn thời gian",
            "isLightningBadge": true,
            "lightningStats": {
                  "applied30d": 18,
                  "evaluated14d": 17,
                  "responseRate": 94,
                  "lastReviewed": "12:00"
            },
            "updated": "2 giờ trước",
            "verified": true,
            "skills": [
                  "Creative Concept",
                  "Copywriting viral",
                  "Gamification Marketing",
                  "Chiến dịch Tết"
            ],
            "jdSummary": [
                  "Chủ trì ý tưởng sáng tạo cho chiến dịch Lắc Xì Tết và các ngày hội siêu deal hàng tháng.",
                  "Sáng tạo slogan, kịch bản video viral và thông điệp truyền thông gây bão mạng xã hội.",
                  "Định hình phong cách ngôn ngữ trẻ trung, hóm hỉnh và gần gũi của thương hiệu MoMo."
            ],
            "perks": [
                  "Môi trường sáng tạo không giới hạn",
                  "Thưởng cổ phiếu ESOP định kỳ"
            ],
            "aiMatch": 94
      },
      {
            "id": 313,
            "title": "Senior Account Executive (Integrated Communications Agency)",
            "company": "Ogilvy Vietnam",
            "logo": "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=120&h=120&q=80",
            "category": "marketing",
            "salaryBadge": "22 - 35 triệu",
            "salaryIsOrange": false,
            "location": "TP.HCM",
            "city": "TP.HCM",
            "exp": "2-4 năm",
            "level": "Senior Account",
            "type": "Toàn thời gian",
            "isLightningBadge": false,
            "lightningStats": {
                  "applied30d": 12,
                  "evaluated14d": 9,
                  "responseRate": 75,
                  "lastReviewed": "12:00"
            },
            "updated": "3 giờ trước",
            "verified": true,
            "skills": [
                  "Client Management",
                  "Agency Pitching",
                  "Chiến dịch truyền thông 360",
                  "Creative Brief"
            ],
            "jdSummary": [
                  "Quản lý mối quan hệ và tiếp nhận yêu cầu chiến dịch từ các nhãn hàng quốc tế đa quốc gia.",
                  "Viết Creative Brief truyền cảm hứng cho đội ngũ thiết kế và sáng tạo nội dung.",
                  "Điều phối tiến độ sản xuất TVC, digital assets và giám sát nghiệm thu hợp đồng."
            ],
            "perks": [
                  "Môi trường Agency truyền thông số 1 thế giới",
                  "Cơ hội giải thưởng quốc tế Cannes Lions"
            ],
            "aiMatch": 88
      },
      {
            "id": 314,
            "title": "Social Media & Community Manager (Kênh Be Xe Ô Tô / Xe Máy)",
            "company": "Công ty Cổ phần Be Group",
            "logo": "https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=120&h=120&q=80",
            "category": "marketing",
            "salaryBadge": "20 - 32 triệu",
            "salaryIsOrange": false,
            "location": "TP.HCM & Hà Nội",
            "city": "TP.HCM",
            "exp": "2-4 năm",
            "level": "Trưởng nhóm",
            "type": "Toàn thời gian",
            "isLightningBadge": true,
            "lightningStats": {
                  "applied30d": 16,
                  "evaluated14d": 15,
                  "responseRate": 94,
                  "lastReviewed": "12:00"
            },
            "updated": "3 giờ trước",
            "verified": true,
            "skills": [
                  "Community Building",
                  "Social Fanpage",
                  "Content Bắt Trend",
                  "Xử lý khủng hoảng"
            ],
            "jdSummary": [
                  "Xây dựng và phát triển cộng đồng người dùng và tài xế Be trên Facebook và TikTok.",
                  "Sáng tạo nội dung bắt trend hài hước thu hút hàng triệu lượt tương tác tự nhiên mỗi tuần.",
                  "Lắng nghe phản hồi của người dùng và hỗ trợ giải đáp thắc mắc dịch vụ kịp thời."
            ],
            "perks": [
                  "Gói di chuyển Be miễn phí",
                  "Môi trường làm việc cởi mở, thoải mái"
            ],
            "aiMatch": 89
      },
      {
            "id": 315,
            "title": "Chuyên Viên Tiếp Thị Khách Hàng Cá Nhân (Retail Marketing)",
            "company": "Ngân hàng TMCP Việt Nam Thịnh Vượng (VPBank)",
            "logo": "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=120&h=120&q=80",
            "category": "marketing",
            "salaryBadge": "22 - 35 triệu",
            "salaryIsOrange": false,
            "location": "Hà Nội",
            "city": "Hà Nội",
            "exp": "2-4 năm",
            "level": "Chuyên viên",
            "type": "Toàn thời gian",
            "isLightningBadge": true,
            "lightningStats": {
                  "applied30d": 14,
                  "evaluated14d": 13,
                  "responseRate": 93,
                  "lastReviewed": "12:00"
            },
            "updated": "4 giờ trước",
            "verified": true,
            "skills": [
                  "Retail Banking Marketing",
                  "Thẻ tín dụng Cashback",
                  "POSM tại quầy",
                  "Direct Marketing"
            ],
            "jdSummary": [
                  "Lên kế hoạch truyền thông cho các sản phẩm mở thẻ tín dụng, tài khoản số đẹp VPBank NEO.",
                  "Sản xuất các ấn phẩm truyền thông tại hệ thống hơn 250 chi nhánh toàn quốc.",
                  "Theo dõi và đánh giá chi phí tiếp thị trên mỗi khách hàng mới đăng ký sử dụng dịch vụ."
            ],
            "perks": [
                  "Lương thưởng cạnh tranh trong ngành ngân hàng",
                  "Cơ hội thăng tiến lên Trưởng nhóm"
            ],
            "aiMatch": 91
      },
      {
            "id": 316,
            "title": "Quản Trị Thương Hiệu Ngành Hàng Sữa Tươi (Brand Manager)",
            "company": "Vinamilk - Công ty Cổ phần Sữa Việt Nam",
            "logo": "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=120&h=120&q=80",
            "category": "marketing",
            "salaryBadge": "32 - 50 triệu",
            "salaryIsOrange": true,
            "location": "TP.HCM",
            "city": "TP.HCM",
            "exp": "3-5 năm",
            "level": "Quản lý thương hiệu",
            "type": "Toàn thời gian",
            "isLightningBadge": true,
            "lightningStats": {
                  "applied30d": 17,
                  "evaluated14d": 16,
                  "responseRate": 94,
                  "lastReviewed": "12:00"
            },
            "updated": "4 giờ trước",
            "verified": true,
            "skills": [
                  "Brand Equity",
                  "FMCG Marketing",
                  "Phân tích thị trường",
                  "Chiến dịch TVC"
            ],
            "jdSummary": [
                  "Chịu trách nhiệm về định vị thương hiệu và thị phần dòng sản phẩm Sữa tươi 100% Vinamilk.",
                  "Sản xuất các chiến dịch quảng cáo truyền hình TVC và chiến dịch số truyền tải thông điệp dinh dưỡng.",
                  "Hợp tác chặt chẽ với Trade Marketing và Sales thúc đẩy sản lượng tiêu thụ toàn quốc."
            ],
            "perks": [
                  "Làm việc tại doanh nghiệp sữa số 1 Việt Nam",
                  "Thưởng hoàn thành mục tiêu năm lớn"
            ],
            "aiMatch": 95
      },
      {
            "id": 317,
            "title": "Creative Marketing Lead (Chiến Dịch Thương Hiệu Giày Quốc Dân)",
            "company": "Công ty TNHH SX HTD Bình Tiên (Biti's Vietnam)",
            "logo": "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=120&h=120&q=80",
            "category": "marketing",
            "salaryBadge": "25 - 40 triệu",
            "salaryIsOrange": false,
            "location": "TP.HCM",
            "city": "TP.HCM",
            "exp": "3-5 năm",
            "level": "Trưởng nhóm",
            "type": "Toàn thời gian",
            "isLightningBadge": true,
            "lightningStats": {
                  "applied30d": 13,
                  "evaluated14d": 12,
                  "responseRate": 92,
                  "lastReviewed": "12:00"
            },
            "updated": "5 giờ trước",
            "verified": true,
            "skills": [
                  "Creative Strategy",
                  "Chiến dịch Đi Để Trở Về",
                  "Văn hóa giới trẻ",
                  "Music Marketing"
            ],
            "jdSummary": [
                  "Chủ trì định hướng ý tưởng sáng tạo cho thương hiệu Biti's Hunter và các bộ sưu tập thời trang mới.",
                  "Hợp tác với các nghệ sĩ âm nhạc hàng đầu sản xuất MV và dự án văn hóa truyền cảm hứng.",
                  "Giữ vững vị thế thương hiệu giày thể thao hàng đầu trong lòng giới trẻ Gen Z."
            ],
            "perks": [
                  "Môi trường tôn vinh bản sắc sáng tạo Việt Nam",
                  "Sản phẩm Biti's ưu đãi nội bộ"
            ],
            "aiMatch": 92
      },
      {
            "id": 318,
            "title": "Senior CRM & Lifecycle Marketing Specialist",
            "company": "Tiki Corporation",
            "logo": "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=120&h=120&q=80",
            "category": "marketing",
            "salaryBadge": "24 - 38 triệu",
            "salaryIsOrange": false,
            "location": "TP.HCM",
            "city": "TP.HCM",
            "exp": "2-4 năm",
            "level": "Senior Specialist",
            "type": "Toàn thời gian",
            "isLightningBadge": true,
            "lightningStats": {
                  "applied30d": 11,
                  "evaluated14d": 10,
                  "responseRate": 91,
                  "lastReviewed": "12:00"
            },
            "updated": "5 giờ trước",
            "verified": true,
            "skills": [
                  "CRM Automation",
                  "Email/App Push",
                  "RFM Segmentation",
                  "Tối ưu phễu mua lại"
            ],
            "jdSummary": [
                  "Thiết lập kịch bản thông báo tự động (App Push, SMS, Email) theo vòng đời mua hàng.",
                  "Phân tích dữ liệu phân khúc RFM để kích hoạt lại tệp khách hàng không hoạt động (Re-activation).",
                  "Đo lường chỉ số mở thông báo (Open Rate), click (CTR) và doanh thu phát sinh trực tiếp."
            ],
            "perks": [
                  "Môi trường Data-driven hiện đại",
                  "Cơ hội tiếp cận công cụ tự động hóa hàng đầu"
            ],
            "aiMatch": 90
      },
      {
            "id": 319,
            "title": "Trưởng Bộ Phận Tổ Chức Sự Kiện & Tài Trợ Thương Hiệu",
            "company": "Ngân hàng TMCP Quân Đội (MB Bank)",
            "logo": "https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=120&h=120&q=80",
            "category": "marketing",
            "salaryBadge": "28 - 42 triệu",
            "salaryIsOrange": false,
            "location": "Hà Nội",
            "city": "Hà Nội",
            "exp": "3-5 năm",
            "level": "Trưởng bộ phận",
            "type": "Toàn thời gian",
            "isLightningBadge": true,
            "lightningStats": {
                  "applied30d": 14,
                  "evaluated14d": 13,
                  "responseRate": 93,
                  "lastReviewed": "12:00"
            },
            "updated": "6 giờ trước",
            "verified": true,
            "skills": [
                  "Event Production",
                  "Tài trợ thể thao/văn hóa",
                  "Quản lý ngân sách sự kiện",
                  "VIP Hospitality"
            ],
            "jdSummary": [
                  "Chủ trì tổ chức các sự kiện quy mô lớn của ngân hàng (Hội nghị khách hàng, Giải chạy MB, Đại nhạc hội).",
                  "Đàm phán quyền lợi tài trợ cho các giải đấu thể thao và chương trình truyền hình uy tín.",
                  "Quản lý chất lượng nhà thầu sản xuất sân khấu và hậu cần sự kiện chuyên nghiệp."
            ],
            "perks": [
                  "Chế độ đãi ngộ hàng đầu trong ngành tài chính",
                  "Thưởng các sự kiện đặc biệt"
            ],
            "aiMatch": 93
      },
      {
            "id": 320,
            "title": "Digital Performance Specialist (Kênh Bán Vé Hàng Không Toàn Cầu)",
            "company": "Công ty Cổ phần Hàng không Vietjet (Vietjet Air)",
            "logo": "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=120&h=120&q=80",
            "category": "marketing",
            "salaryBadge": "25 - 38 triệu",
            "salaryIsOrange": false,
            "location": "TP.HCM",
            "city": "TP.HCM",
            "exp": "2-4 năm",
            "level": "Chuyên viên cao cấp",
            "type": "Toàn thời gian",
            "isLightningBadge": true,
            "lightningStats": {
                  "applied30d": 12,
                  "evaluated14d": 11,
                  "responseRate": 92,
                  "lastReviewed": "12:00"
            },
            "updated": "6 giờ trước",
            "verified": true,
            "skills": [
                  "Global Digital Ads",
                  "Vé máy bay trực tuyến",
                  "Chuyển đổi ROAS",
                  "Google Search Flight"
            ],
            "jdSummary": [
                  "Tối ưu hóa chiến dịch quảng cáo tìm kiếm và mạng xã hội tại các thị trường quốc tế (Úc, Ấn Độ, Nhật, Hàn).",
                  "Gia tăng lượng đặt vé trực tiếp trên website và ứng dụng di động Vietjet Air.",
                  "Phân tích dữ liệu theo mùa vụ du lịch và phản ứng nhanh với động thái giá vé đối thủ."
            ],
            "perks": [
                  "Vé máy bay miễn phí thường niên cho nhân viên và gia đình",
                  "Môi trường làm việc đa quốc gia"
            ],
            "aiMatch": 89
      },
      {
            "id": 321,
            "title": "Marketing Manager (Dự Án Bất Động Sản Hàng Hiệu Masterise)",
            "company": "Tập đoàn Masterise Homes",
            "logo": "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=120&h=120&q=80",
            "category": "marketing",
            "salaryBadge": "40 - 65 triệu",
            "salaryIsOrange": true,
            "location": "Hà Nội & TP.HCM",
            "city": "TP.HCM",
            "exp": "Trên 5 năm",
            "level": "Marketing Manager",
            "type": "Toàn thời gian",
            "isLightningBadge": true,
            "lightningStats": {
                  "applied30d": 10,
                  "evaluated14d": 9,
                  "responseRate": 90,
                  "lastReviewed": "12:00"
            },
            "updated": "7 giờ trước",
            "verified": true,
            "skills": [
                  "Luxury Real Estate Marketing",
                  "Triển lãm quốc tế",
                  "Định vị bất động sản hàng hiệu",
                  "PR cao cấp"
            ],
            "jdSummary": [
                  "Chịu trách nhiệm chiến lược tiếp thị tổng thể cho các siêu dự án bất động sản hàng hiệu.",
                  "Hợp tác với các đối tác khách sạn quốc tế Marriott International và Ritz-Carlton.",
                  "Tổ chức các sự kiện ra mắt độc quyền tại Hong Kong, Singapore và Dubai."
            ],
            "perks": [
                  "Thu nhập và hoa hồng dự án dẫn đầu thị trường",
                  "Môi trường làm việc đẳng cấp quốc tế"
            ],
            "aiMatch": 94
      },
      {
            "id": 322,
            "title": "Assistant Brand Manager (Ngành Chăm Sóc Cá Nhân)",
            "company": "Unilever Vietnam",
            "logo": "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=120&h=120&q=80",
            "category": "marketing",
            "salaryBadge": "26 - 40 triệu",
            "salaryIsOrange": false,
            "location": "TP.HCM",
            "city": "TP.HCM",
            "exp": "2-4 năm",
            "level": "Assistant Brand Manager",
            "type": "Toàn thời gian",
            "isLightningBadge": true,
            "lightningStats": {
                  "applied30d": 15,
                  "evaluated14d": 14,
                  "responseRate": 93,
                  "lastReviewed": "12:00"
            },
            "updated": "7 giờ trước",
            "verified": true,
            "skills": [
                  "Brand Development",
                  "FMCG Market Research",
                  "Kế hoạch truyền thông năm",
                  "Nielsen/Kantar Data"
            ],
            "jdSummary": [
                  "Đồng hành cùng Brand Manager phát triển thị phần các nhãn hàng chăm sóc cá nhân (Dove, Lifebuoy, Sunsilk).",
                  "Phân tích báo cáo dữ liệu thị trường Nielsen và hành vi mua sắm người tiêu dùng.",
                  "Triển khai các chiến dịch ra mắt bao bì mới và công thức cải tiến."
            ],
            "perks": [
                  "Trường đào tạo Marketing chuẩn mực quốc tế",
                  "Phúc lợi và gói bảo hiểm toàn diện"
            ],
            "aiMatch": 93
      },
      {
            "id": 323,
            "title": "Senior Growth Marketing Specialist (Ví Điện Tử VNPAY & Dịch Vụ Taxi)",
            "company": "Công ty Cổ phần Giải pháp Thanh toán Việt Nam (VNPAY)",
            "logo": "https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=120&h=120&q=80",
            "category": "marketing",
            "salaryBadge": "25 - 40 triệu",
            "salaryIsOrange": false,
            "location": "Hà Nội",
            "city": "Hà Nội",
            "exp": "2-4 năm",
            "level": "Chuyên viên cao cấp",
            "type": "Toàn thời gian",
            "isLightningBadge": true,
            "lightningStats": {
                  "applied30d": 17,
                  "evaluated14d": 16,
                  "responseRate": 94,
                  "lastReviewed": "12:00"
            },
            "updated": "8 giờ trước",
            "verified": true,
            "skills": [
                  "FinTech Growth",
                  "Khuyến mại VNPAY-Taxi",
                  "Co-marketing Ngân hàng",
                  "Tối ưu chuyển đổi"
            ],
            "jdSummary": [
                  "Lập kế hoạch thúc đẩy số lượng giao dịch thanh toán VNPAY Taxi và đặt vé máy bay trên App ngân hàng.",
                  "Phối hợp với các ngân hàng đối tác triển khai chương trình đồng tài trợ khuyến mại.",
                  "Phân tích hành vi thanh toán không tiền mặt để tối ưu hóa ngân sách chiết khấu."
            ],
            "perks": [
                  "Chế độ đãi ngộ hàng đầu trong ngành FinTech",
                  "Thưởng tháng lương thứ 13 và thưởng KPI"
            ],
            "aiMatch": 91
      },
      {
            "id": 324,
            "title": "Trade Marketing Manager (Chuỗi Nhà Hàng Ẩm Thực Toàn Quốc)",
            "company": "Tập đoàn Golden Gate (Golden Gate Group)",
            "logo": "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=120&h=120&q=80",
            "category": "marketing",
            "salaryBadge": "30 - 48 triệu",
            "salaryIsOrange": false,
            "location": "Hà Nội & TP.HCM",
            "city": "Hà Nội",
            "exp": "3-5 năm",
            "level": "Trưởng phòng Trade MKT",
            "type": "Toàn thời gian",
            "isLightningBadge": true,
            "lightningStats": {
                  "applied30d": 11,
                  "evaluated14d": 10,
                  "responseRate": 91,
                  "lastReviewed": "12:00"
            },
            "updated": "8 giờ trước",
            "verified": true,
            "skills": [
                  "F&B Trade Marketing",
                  "POSM chuỗi nhà hàng",
                  "Khuyến mại ẩm thực",
                  "Tối ưu doanh thu bàn"
            ],
            "jdSummary": [
                  "Chịu trách nhiệm các hoạt động tiếp thị tại điểm bán cho hơn 400 nhà hàng (Gogi House, Kichi-Kichi, Manwah).",
                  "Thiết kế và triển khai các combo ưu đãi giờ vàng nhằm tối ưu tỷ lệ lấp đầy bàn ăn.",
                  "Hợp tác với các đối tác thanh toán và ngân hàng triển khai ưu đãi hoàn tiền cho thực khách."
            ],
            "perks": [
                  "Ưu đãi giảm giá 30% tại toàn bộ hệ thống nhà hàng Golden Gate",
                  "Môi trường làm việc trẻ trung năng động"
            ],
            "aiMatch": 92
      },
      {
            "id": 401,
            "title": "Chuyên Viên Phân Tích Dữ Liệu Tài Chính (Data Analyst)",
            "company": "Ngân hàng TMCP Quân Đội (MB Bank)",
            "logo": "https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=120&h=120&q=80",
            "category": "finance",
            "salaryBadge": "25 - 40 triệu",
            "salaryIsOrange": false,
            "location": "Hà Nội",
            "city": "Hà Nội",
            "exp": "2-4 năm",
            "level": "Chuyên viên cao cấp",
            "type": "Toàn thời gian",
            "isLightningBadge": true,
            "lightningStats": {
                  "applied30d": 22,
                  "evaluated14d": 20,
                  "responseRate": 91,
                  "lastReviewed": "12:00"
            },
            "updated": "15 phút trước",
            "verified": true,
            "skills": [
                  "SQL",
                  "Power BI",
                  "Phân tích tín dụng",
                  "Mô hình tài chính",
                  "Python"
            ],
            "jdSummary": [
                  "Xây dựng các dashboard tự động theo dõi danh mục tín dụng và tăng trưởng tài sản.",
                  "Phân tích hành vi chi tiêu thẻ tín dụng để đề xuất chính sách phân khúc khách hàng.",
                  "Phối hợp với khối Quản trị rủi ro phát triển mô hình chấm điểm tín dụng nội bộ."
            ],
            "perks": [
                  "Gói vay ưu đãi lãi suất ngân hàng MB cho nhân viên",
                  "Thưởng cuối năm 4-6 tháng lương"
            ],
            "aiMatch": 94
      },
      {
            "id": 402,
            "title": "Quản Lý Rủi Ro Tín Dụng Khách Hàng Doanh Nghiệp",
            "company": "Ngân hàng VPBank",
            "logo": "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=120&h=120&q=80",
            "category": "finance",
            "salaryBadge": "30 - 45 triệu",
            "salaryIsOrange": true,
            "location": "Hà Nội",
            "city": "Hà Nội",
            "exp": "3-5 năm",
            "level": "Trưởng nhóm",
            "type": "Toàn thời gian",
            "isLightningBadge": true,
            "lightningStats": {
                  "applied30d": 14,
                  "evaluated14d": 12,
                  "responseRate": 86,
                  "lastReviewed": "12:00"
            },
            "updated": "50 phút trước",
            "verified": true,
            "skills": [
                  "Quản trị rủi ro",
                  "Thẩm định hồ sơ tín dụng",
                  "Basel II/III",
                  "Phân tích dòng tiền"
            ],
            "jdSummary": [
                  "Thẩm định độc lập các khoản vay vốn trung và dài hạn của doanh nghiệp quy mô lớn.",
                  "Đánh giá tính khả thi phương án kinh doanh và phương án tài sản đảm bảo nợ vay.",
                  "Giám sát chặt chẽ các chỉ tiêu cảnh báo rủi ro sớm (Early Warning Signals)."
            ],
            "perks": [
                  "Chế độ đãi ngộ hàng đầu trong khối Ngân hàng TMCP",
                  "Bảo hiểm sức khỏe đặc quyền"
            ],
            "aiMatch": 92
      },
      {
            "id": 403,
            "title": "Trưởng Phòng Thẩm Định Dự Án & Đầu Tư Trực Tiếp",
            "company": "Ngân hàng Techcombank",
            "logo": "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=120&h=120&q=80",
            "category": "finance",
            "salaryBadge": "45 - 65 triệu",
            "salaryIsOrange": true,
            "location": "Hà Nội",
            "city": "Hà Nội",
            "exp": "Trên 5 năm",
            "level": "Trưởng phòng",
            "type": "Toàn thời gian",
            "isLightningBadge": true,
            "lightningStats": {
                  "applied30d": 15,
                  "evaluated14d": 14,
                  "responseRate": 93,
                  "lastReviewed": "12:00"
            },
            "updated": "2 giờ trước",
            "verified": true,
            "skills": [
                  "Thẩm định đầu tư",
                  "Project Finance",
                  "M&A",
                  "Đàm phán hợp đồng tài trợ vốn"
            ],
            "jdSummary": [
                  "Chủ trì thẩm định các dự án năng lượng tái tạo, hạ tầng và bất động sản công nghiệp.",
                  "Xây dựng cấu trúc tài trợ vốn hợp vốn (Syndicated Loan) với các định chế tài chính quốc tế.",
                  "Báo cáo và giải trình trước Hội đồng tín dụng và Quản lý rủi ro cấp cao."
            ],
            "perks": [
                  "Thưởng hiệu quả dự án hàng năm hấp dẫn",
                  "Môi trường Agile chuyển đổi số số 1"
            ],
            "aiMatch": 96
      },
      {
            "id": 404,
            "title": "Chuyên Viên Quản Lý Danh Mục Đầu Tư (Portfolio Manager)",
            "company": "Chứng khoán SSI (SSI Securities)",
            "logo": "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=120&h=120&q=80",
            "category": "finance",
            "salaryBadge": "28 - 45 triệu",
            "salaryIsOrange": false,
            "location": "TP.HCM",
            "city": "TP.HCM",
            "exp": "2-4 năm",
            "level": "Chuyên viên cao cấp",
            "type": "Toàn thời gian",
            "isLightningBadge": true,
            "lightningStats": {
                  "applied30d": 10,
                  "evaluated14d": 8,
                  "responseRate": 80,
                  "lastReviewed": "12:00"
            },
            "updated": "3 giờ trước",
            "verified": true,
            "skills": [
                  "Chứng khoán",
                  "CFA level 2+",
                  "Định giá cổ phiếu",
                  "Phân tích vĩ mô"
            ],
            "jdSummary": [
                  "Quản lý danh mục tài sản ủy thác của khách hàng tổ chức và cá nhân có tài sản ròng cao.",
                  "Phân tích định giá doanh nghiệp niêm yết bằng phương pháp DCF và P/E so sánh.",
                  "Thiết lập chiến lược tái cơ cấu danh mục cổ phiếu phòng ngừa biến động thị trường."
            ],
            "perks": [
                  "Hoa hồng quản lý quỹ tính theo Alpha vượt trội",
                  "Môi trường làm việc top đầu TTCK"
            ],
            "aiMatch": 91
      },
      {
            "id": 405,
            "title": "Senior Internal Auditor (Kiểm Toán Nội Bộ Tài Chính)",
            "company": "Vinamilk - Công ty Cổ phần Sữa Việt Nam",
            "logo": "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=120&h=120&q=80",
            "category": "finance",
            "salaryBadge": "26 - 38 triệu",
            "salaryIsOrange": false,
            "location": "TP.HCM",
            "city": "TP.HCM",
            "exp": "3-5 năm",
            "level": "Senior",
            "type": "Toàn thời gian",
            "isLightningBadge": false,
            "lightningStats": {
                  "applied30d": 12,
                  "evaluated14d": 8,
                  "responseRate": 67,
                  "lastReviewed": "12:00"
            },
            "updated": "4 giờ trước",
            "verified": true,
            "skills": [
                  "Kiểm toán nội bộ",
                  "IFRS / VAS",
                  "Kiểm soát tuân thủ",
                  "ACCA / CPA"
            ],
            "jdSummary": [
                  "Thực hiện các cuộc kiểm toán định kỳ đối với các chi nhánh, nhà máy và trang trại Vinamilk.",
                  "Đánh giá hiệu lực của hệ thống kiểm soát nội bộ và đề xuất cải tiến quy trình kế toán.",
                  "Lập báo cáo kiểm toán độc lập trình Ủy ban Kiểm toán trực thuộc HĐQT."
            ],
            "perks": [
                  "Môi trường làm việc bền vững hàng đầu Việt Nam",
                  "Thưởng tháng 13 + thưởng hoàn thành KPI"
            ],
            "aiMatch": 88
      },
      {
            "id": 406,
            "title": "Financial Planning & Analysis (FP&A) Specialist",
            "company": "Công ty Cổ phần Đầu tư Thế Giới Di Động (MWG)",
            "logo": "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=120&h=120&q=80",
            "category": "finance",
            "salaryBadge": "22 - 35 triệu",
            "salaryIsOrange": false,
            "location": "TP.HCM",
            "city": "TP.HCM",
            "exp": "2-4 năm",
            "level": "Chuyên viên",
            "type": "Toàn thời gian",
            "isLightningBadge": true,
            "lightningStats": {
                  "applied30d": 11,
                  "evaluated14d": 10,
                  "responseRate": 91,
                  "lastReviewed": "12:00"
            },
            "updated": "5 giờ trước",
            "verified": true,
            "skills": [
                  "FP&A",
                  "Lập ngân sách",
                  "Phân tích P&L chuỗi bán lẻ",
                  "Excel nâng cao"
            ],
            "jdSummary": [
                  "Xây dựng kế hoạch tài chính và ngân sách hoạt động hàng năm cho chuỗi bán lẻ.",
                  "Theo dõi và phân tích biến động chi phí thực tế so với ngân sách đã phê duyệt.",
                  "Đưa ra các phân tích cảnh báo biên lợi nhuận ròng cho Ban Điều Hành."
            ],
            "perks": [
                  "Gói cổ phiếu thưởng ESOP thường niên",
                  "Cơ hội phát triển lên vị trí Finance Manager"
            ],
            "aiMatch": 89
      },
      {
            "id": 407,
            "title": "Chuyên Viên Kinh Doanh Ngoại Hối & Phái Sinh (FX & Derivatives Trader)",
            "company": "Ngân hàng TMCP Ngoại Thương Việt Nam (Vietcombank)",
            "logo": "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=120&h=120&q=80",
            "category": "finance",
            "salaryBadge": "30 - 55 triệu",
            "salaryIsOrange": true,
            "location": "Hà Nội & TP.HCM",
            "city": "Hà Nội",
            "exp": "2-4 năm",
            "level": "Trader / Chuyên viên cao cấp",
            "type": "Toàn thời gian",
            "isLightningBadge": true,
            "lightningStats": {
                  "applied30d": 16,
                  "evaluated14d": 15,
                  "responseRate": 94,
                  "lastReviewed": "12:00"
            },
            "updated": "30 phút trước",
            "verified": true,
            "skills": [
                  "FX Trading",
                  "Phái sinh tỷ giá",
                  "Thị trường liên ngân hàng",
                  "Quản trị trạng thái ngoại hối"
            ],
            "jdSummary": [
                  "Thực hiện các giao dịch mua bán ngoại tệ giao ngay (Spot), kỳ hạn (Forward) và hoán đổi (Swap).",
                  "Cung cấp giải pháp phòng ngừa rủi ro biến động tỷ giá cho khách hàng doanh nghiệp xuất nhập khẩu.",
                  "Duy trì hạn mức trạng thái ngoại tệ và tuân thủ chặt chẽ quy định của Ngân hàng Nhà nước."
            ],
            "perks": [
                  "Thưởng hiệu quả giao dịch (P&L bonus) cạnh tranh",
                  "Môi trường kinh doanh tiền tệ số 1"
            ],
            "aiMatch": 95
      },
      {
            "id": 408,
            "title": "Trưởng Phòng Quản Lý Tài Sản & Khách Hàng Ưu Tiên (Priority Wealth)",
            "company": "Ngân hàng TMCP Á Châu (ACB)",
            "logo": "https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=120&h=120&q=80",
            "category": "finance",
            "salaryBadge": "35 - 55 triệu",
            "salaryIsOrange": true,
            "location": "TP.HCM",
            "city": "TP.HCM",
            "exp": "3-5 năm",
            "level": "Trưởng phòng",
            "type": "Toàn thời gian",
            "isLightningBadge": true,
            "lightningStats": {
                  "applied30d": 18,
                  "evaluated14d": 17,
                  "responseRate": 94,
                  "lastReviewed": "12:00"
            },
            "updated": "45 phút trước",
            "verified": true,
            "skills": [
                  "Wealth Management",
                  "Tư vấn đầu tư trái phiếu",
                  "Chứng chỉ quỹ",
                  "Chăm sóc khách hàng VIP"
            ],
            "jdSummary": [
                  "Điều hành phòng dịch vụ khách hàng ưu tiên ACB Privilege Banking.",
                  "Thiết kế danh mục phân bổ tài sản an toàn và sinh lời bền vững cho khách hàng có số dư lớn.",
                  "Quản lý tổng tài sản quản lý (AUM) tăng trưởng theo mục tiêu chiến lược của ngân hàng."
            ],
            "perks": [
                  "Thưởng doanh số và hiệu quả quản lý hấp dẫn",
                  "Bảo hiểm sức khỏe đặc quyền ACB Care"
            ],
            "aiMatch": 93
      },
      {
            "id": 409,
            "title": "Chuyên Viên Môi Giới & Tư Vấn Đầu Tư Khách Hàng VIP",
            "company": "Công ty Cổ phần Chứng khoán VPS",
            "logo": "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=120&h=120&q=80",
            "category": "finance",
            "salaryBadge": "25 - 50 triệu",
            "salaryIsOrange": true,
            "location": "Hà Nội & TP.HCM",
            "city": "Hà Nội",
            "exp": "2-4 năm",
            "level": "Chuyên viên cao cấp",
            "type": "Toàn thời gian",
            "isLightningBadge": true,
            "lightningStats": {
                  "applied30d": 20,
                  "evaluated14d": 19,
                  "responseRate": 95,
                  "lastReviewed": "12:00"
            },
            "updated": "1 giờ trước",
            "verified": true,
            "skills": [
                  "Môi giới chứng khoán",
                  "Phân tích kỹ thuật TA",
                  "Tư vấn Margin",
                  "Quản trị rủi ro danh mục"
            ],
            "jdSummary": [
                  "Cung cấp các bản tin khuyến nghị đầu tư cổ phiếu hàng ngày cho nhóm khách hàng giá trị cao.",
                  "Hỗ trợ quản trị rủi ro danh mục và cơ cấu tỷ trọng margin hợp lý theo diễn biến thị trường.",
                  "Mở rộng tệp nhà đầu tư cá nhân năng động trên nền tảng SmartOne."
            ],
            "perks": [
                  "Tỷ lệ chia sẻ hoa hồng phí giao dịch cao nhất thị trường",
                  "Đào tạo phân tích độc quyền"
            ],
            "aiMatch": 92
      },
      {
            "id": 410,
            "title": "Chuyên Viên Quản Trị Rủi Ro Thanh Khoản & Thị Trường",
            "company": "Ngân hàng TMCP Đầu tư và Phát triển Việt Nam (BIDV)",
            "logo": "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=120&h=120&q=80",
            "category": "finance",
            "salaryBadge": "26 - 42 triệu",
            "salaryIsOrange": false,
            "location": "Hà Nội",
            "city": "Hà Nội",
            "exp": "2-4 năm",
            "level": "Chuyên viên",
            "type": "Toàn thời gian",
            "isLightningBadge": true,
            "lightningStats": {
                  "applied30d": 13,
                  "evaluated14d": 12,
                  "responseRate": 92,
                  "lastReviewed": "12:00"
            },
            "updated": "1 giờ trước",
            "verified": true,
            "skills": [
                  "Market Risk",
                  "Rủi ro thanh khoản",
                  "LCR / NSFR",
                  "Stress Testing",
                  "Mô hình VaR"
            ],
            "jdSummary": [
                  "Đo lường và giám sát các chỉ số an toàn vốn và thanh khoản theo tiêu chuẩn Basel II & III.",
                  "Thực hiện kiểm tra sức chịu đựng (Stress Testing) danh mục trái phiếu và lãi suất liên ngân hàng.",
                  "Đề xuất các biện pháp phòng ngừa rủi ro biến động thị trường tài chính vĩ mô."
            ],
            "perks": [
                  "Phúc lợi toàn diện và tính ổn định cao",
                  "Lộ trình phát triển chuyên gia phân tích rủi ro"
            ],
            "aiMatch": 90
      },
      {
            "id": 411,
            "title": "Trưởng Nhóm Thẩm Định Tín Dụng Dự Án Năng Lượng Xanh",
            "company": "Ngân hàng TMCP Sài Gòn - Hà Nội (SHB)",
            "logo": "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=120&h=120&q=80",
            "category": "finance",
            "salaryBadge": "30 - 48 triệu",
            "salaryIsOrange": true,
            "location": "Hà Nội",
            "city": "Hà Nội",
            "exp": "3-5 năm",
            "level": "Trưởng nhóm",
            "type": "Toàn thời gian",
            "isLightningBadge": true,
            "lightningStats": {
                  "applied30d": 14,
                  "evaluated14d": 13,
                  "responseRate": 93,
                  "lastReviewed": "12:00"
            },
            "updated": "2 giờ trước",
            "verified": true,
            "skills": [
                  "Thẩm định dự án điện gió/mặt trời",
                  "Tín dụng xanh ESG",
                  "Mô hình dòng tiền dự án",
                  "Bảo lãnh EPC"
            ],
            "jdSummary": [
                  "Chủ trì thẩm định các dự án điện gió, điện mặt trời và hạ tầng khu công nghiệp xanh.",
                  "Đánh giá các điều kiện hợp đồng mua bán điện (PPA) và khả năng trả nợ vay dài hạn.",
                  "Kết nối nguồn vốn ưu đãi từ các định chế tài chính quốc tế như IFC, ADB."
            ],
            "perks": [
                  "Chế độ đãi ngộ vượt trội",
                  "Môi trường làm việc thúc đẩy tài chính bền vững ESG"
            ],
            "aiMatch": 93
      },
      {
            "id": 412,
            "title": "Senior Equity Research Analyst (Ngành Bất Động Sản & Bán Lẻ)",
            "company": "Quỹ Đầu tư Dragon Capital Vietnam",
            "logo": "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=120&h=120&q=80",
            "category": "finance",
            "salaryBadge": "35 - 58 triệu",
            "salaryIsOrange": true,
            "location": "TP.HCM",
            "city": "TP.HCM",
            "exp": "3-5 năm",
            "level": "Senior Analyst",
            "type": "Toàn thời gian",
            "isLightningBadge": true,
            "lightningStats": {
                  "applied30d": 15,
                  "evaluated14d": 14,
                  "responseRate": 93,
                  "lastReviewed": "12:00"
            },
            "updated": "2 giờ trước",
            "verified": true,
            "skills": [
                  "Equity Research",
                  "Mô hình định giá tài chính",
                  "Thăm dò thực địa dự án",
                  "Báo cáo đầu tư song ngữ"
            ],
            "jdSummary": [
                  "Nghiên cứu chuyên sâu ngành bất động sản và bán lẻ tiêu dùng phục vụ quyết định giải ngân quỹ.",
                  "Gặp gỡ ban lãnh đạo các doanh nghiệp niêm yết và khảo sát tiến độ thực địa dự án.",
                  "Xây dựng mô hình dự báo doanh thu, lợi nhuận và định giá cổ phiếu độc lập."
            ],
            "perks": [
                  "Làm việc tại quỹ quản lý tài sản lớn nhất Việt Nam",
                  "Thưởng hiệu quả đầu tư năm hấp dẫn"
            ],
            "aiMatch": 95
      },
      {
            "id": 413,
            "title": "Chuyên Viên Cao Cấp Tái Cấu Trúc Tài Chính & M&A",
            "company": "Ngân hàng TMCP Tiên Phong (TPBank)",
            "logo": "https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=120&h=120&q=80",
            "category": "finance",
            "salaryBadge": "32 - 50 triệu",
            "salaryIsOrange": false,
            "location": "Hà Nội & TP.HCM",
            "city": "Hà Nội",
            "exp": "3-5 năm",
            "level": "Chuyên viên cao cấp",
            "type": "Toàn thời gian",
            "isLightningBadge": true,
            "lightningStats": {
                  "applied30d": 12,
                  "evaluated14d": 11,
                  "responseRate": 92,
                  "lastReviewed": "12:00"
            },
            "updated": "3 giờ trước",
            "verified": true,
            "skills": [
                  "Tái cấu trúc nợ",
                  "Tư vấn M&A",
                  "Định giá tài sản bảo đảm",
                  "Pháp lý tài chính"
            ],
            "jdSummary": [
                  "Tư vấn các giải pháp tái cấu trúc nguồn vốn và sáp nhập doanh nghiệp cho khách hàng lớn.",
                  "Định giá và lập phương án xử lý nợ có tài sản đảm bảo quy mô hàng nghìn tỷ đồng.",
                  "Phối hợp với các tổ chức tư vấn luật hoàn thiện cấu trúc giao dịch an toàn."
            ],
            "perks": [
                  "Gói lương thưởng cạnh tranh top ngân hàng số",
                  "Lộ trình thăng tiến chuyên gia rõ ràng"
            ],
            "aiMatch": 91
      },
      {
            "id": 414,
            "title": "Investment Associate (Khối Quỹ Đầu Tư Tư Nhân Private Equity)",
            "company": "Tập đoàn Quản lý Quỹ VinaCapital",
            "logo": "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=120&h=120&q=80",
            "category": "finance",
            "salaryBadge": "40 - 65 triệu",
            "salaryIsOrange": true,
            "location": "TP.HCM",
            "city": "TP.HCM",
            "exp": "3-5 năm",
            "level": "Investment Associate",
            "type": "Toàn thời gian",
            "isLightningBadge": true,
            "lightningStats": {
                  "applied30d": 11,
                  "evaluated14d": 10,
                  "responseRate": 91,
                  "lastReviewed": "12:00"
            },
            "updated": "3 giờ trước",
            "verified": true,
            "skills": [
                  "Private Equity",
                  "Financial Due Diligence",
                  "LBO Modeling",
                  "Thương thảo cổ đông"
            ],
            "jdSummary": [
                  "Thực hiện thẩm định tài chính chi tiết (Financial Due Diligence) các thương vụ đầu tư cổ phần tư nhân.",
                  "Xây dựng kịch bản tài chính phức tạp và đánh giá tỷ suất hoàn vốn nội bộ (IRR).",
                  "Đồng hành hỗ trợ tái cơ cấu quản trị tại các công ty trong danh mục đầu tư."
            ],
            "perks": [
                  "Thưởng thành công thương vụ (Carried Interest)",
                  "Môi trường làm việc chuẩn Wall Street"
            ],
            "aiMatch": 96
      },
      {
            "id": 415,
            "title": "Trưởng Phòng Kế Hoạch & Quản Lý Chi Phí Hoạt Động (Cost Control)",
            "company": "Ngân hàng TMCP Phát triển TP.HCM (HDBank)",
            "logo": "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=120&h=120&q=80",
            "category": "finance",
            "salaryBadge": "28 - 45 triệu",
            "salaryIsOrange": false,
            "location": "TP.HCM",
            "city": "TP.HCM",
            "exp": "3-5 năm",
            "level": "Trưởng phòng",
            "type": "Toàn thời gian",
            "isLightningBadge": true,
            "lightningStats": {
                  "applied30d": 14,
                  "evaluated14d": 13,
                  "responseRate": 93,
                  "lastReviewed": "12:00"
            },
            "updated": "4 giờ trước",
            "verified": true,
            "skills": [
                  "Cost Control",
                  "Tối ưu hóa CIR",
                  "Quản trị ngân sách OPEX/CAPEX",
                  "Kiểm soát mua sắm"
            ],
            "jdSummary": [
                  "Kiểm soát toàn bộ chi phí hoạt động OPEX và chi phí đầu tư CAPEX của toàn hệ thống ngân hàng.",
                  "Tối ưu hóa tỷ lệ chi phí trên thu nhập (CIR) theo chỉ tiêu Hội đồng Quản trị giao.",
                  "Thẩm định hiệu quả kinh tế các đề xuất mua sắm trang thiết bị và phần mềm chuyển đổi số."
            ],
            "perks": [
                  "Chế độ phúc lợi ngân hàng hấp dẫn",
                  "Môi trường năng động nhiều cơ hội phát triển"
            ],
            "aiMatch": 90
      },
      {
            "id": 416,
            "title": "Chuyên Viên Kiểm Soát Tuân Thủ & Phòng Chống Rửa Tiền (AML/CTF)",
            "company": "Ngân hàng TMCP Hàng Hải Việt Nam (MSB)",
            "logo": "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=120&h=120&q=80",
            "category": "finance",
            "salaryBadge": "22 - 35 triệu",
            "salaryIsOrange": false,
            "location": "Hà Nội",
            "city": "Hà Nội",
            "exp": "2-4 năm",
            "level": "Chuyên viên",
            "type": "Toàn thời gian",
            "isLightningBadge": true,
            "lightningStats": {
                  "applied30d": 15,
                  "evaluated14d": 14,
                  "responseRate": 93,
                  "lastReviewed": "12:00"
            },
            "updated": "4 giờ trước",
            "verified": true,
            "skills": [
                  "AML/CTF",
                  "Kiểm soát tuân thủ",
                  "Rà soát giao dịch đáng ngờ",
                  "Cảnh báo rủi ro gian lận"
            ],
            "jdSummary": [
                  "Giám sát và phân tích các giao dịch có dấu hiệu đáng ngờ theo Luật Phòng chống rửa tiền.",
                  "Phối hợp với Cục Phòng chống rửa tiền thuộc NHNN cung cấp thông tin điều tra.",
                  "Cập nhật chính sách tuân thủ nội bộ và tổ chức đào tạo cho cán bộ nghiệp vụ."
            ],
            "perks": [
                  "Công việc ổn định, phúc lợi đầy đủ",
                  "Được tài trợ học chứng chỉ quốc tế CAMS"
            ],
            "aiMatch": 88
      },
      {
            "id": 417,
            "title": "Chuyên Viên Định Phí Bảo Hiểm (Actuary Specialist)",
            "company": "Tổng Công ty Bảo hiểm Bảo Việt (Bảo Việt Nhân Thọ)",
            "logo": "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=120&h=120&q=80",
            "category": "finance",
            "salaryBadge": "30 - 52 triệu",
            "salaryIsOrange": true,
            "location": "Hà Nội",
            "city": "Hà Nội",
            "exp": "2-4 năm",
            "level": "Actuary Specialist",
            "type": "Toàn thời gian",
            "isLightningBadge": true,
            "lightningStats": {
                  "applied30d": 10,
                  "evaluated14d": 9,
                  "responseRate": 90,
                  "lastReviewed": "12:00"
            },
            "updated": "5 giờ trước",
            "verified": true,
            "skills": [
                  "Actuarial Science",
                  "Định phí sản phẩm bảo hiểm",
                  "Dự phòng rủi ro IFRS 17",
                  "Mô hình Prophet"
            ],
            "jdSummary": [
                  "Thiết kế và tính toán phí bảo hiểm cho các sản phẩm bảo hiểm nhân thọ và liên kết đầu tư.",
                  "Xây dựng mô hình trích lập dự phòng kỹ thuật đáp ứng chuẩn mực báo cáo tài chính quốc tế IFRS 17.",
                  "Đánh giá khả năng thanh toán và rủi ro tài chính định kỳ hàng quý."
            ],
            "perks": [
                  "Hỗ trợ lệ phí thi và ngày nghỉ học thi các chứng chỉ SOA/IFoA",
                  "Lương thưởng hấp dẫn"
            ],
            "aiMatch": 94
      },
      {
            "id": 418,
            "title": "Quản Lý Khách Hàng Doanh Nghiệp Lớn (Corporate Banking Lead)",
            "company": "Ngân hàng TMCP Lộc Phát Việt Nam (LPBank)",
            "logo": "https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=120&h=120&q=80",
            "category": "finance",
            "salaryBadge": "28 - 45 triệu",
            "salaryIsOrange": false,
            "location": "Hà Nội & TP.HCM",
            "city": "Hà Nội",
            "exp": "3-5 năm",
            "level": "Trưởng nhóm",
            "type": "Toàn thời gian",
            "isLightningBadge": true,
            "lightningStats": {
                  "applied30d": 16,
                  "evaluated14d": 15,
                  "responseRate": 94,
                  "lastReviewed": "12:00"
            },
            "updated": "5 giờ trước",
            "verified": true,
            "skills": [
                  "Corporate Banking",
                  "Tín dụng doanh nghiệp lớn",
                  "Huy động vốn",
                  "Quan hệ khách hàng"
            ],
            "jdSummary": [
                  "Khai thác và chăm sóc các tập đoàn xây dựng, năng lượng và sản xuất kinh doanh quy mô lớn.",
                  "Tư vấn các gói tài trợ vốn lưu động, phát hành bảo lãnh dự thầu và quản lý dòng tiền.",
                  "Dẫn dắt nhóm quan hệ khách hàng doanh nghiệp hoàn thành chỉ tiêu tăng trưởng tín dụng."
            ],
            "perks": [
                  "Gói thu nhập hấp dẫn theo kết quả kinh doanh",
                  "Chính sách thăng tiến minh bạch"
            ],
            "aiMatch": 92
      },
      {
            "id": 419,
            "title": "Senior Financial Analyst (Khối Khách Hàng Doanh Nghiệp Hàn Quốc)",
            "company": "Công ty Chứng khoán Mirae Asset Việt Nam",
            "logo": "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=120&h=120&q=80",
            "category": "finance",
            "salaryBadge": "28 - 45 triệu",
            "salaryIsOrange": false,
            "location": "TP.HCM",
            "city": "TP.HCM",
            "exp": "3-5 năm",
            "level": "Senior Analyst",
            "type": "Toàn thời gian",
            "isLightningBadge": true,
            "lightningStats": {
                  "applied30d": 12,
                  "evaluated14d": 11,
                  "responseRate": 92,
                  "lastReviewed": "12:00"
            },
            "updated": "6 giờ trước",
            "verified": true,
            "skills": [
                  "Financial Analysis",
                  "Tiếng Hàn/Anh lưu loát",
                  "Tư vấn niêm yết IB",
                  "Thương vụ M&A"
            ],
            "jdSummary": [
                  "Hỗ trợ các doanh nghiệp Hàn Quốc tại Việt Nam tiếp cận nguồn vốn qua kênh phát hành trái phiếu và cổ phiếu.",
                  "Phân tích năng lực tài chính và lập hồ sơ chào bán chứng khoán riêng lẻ.",
                  "Soạn thảo các tài liệu thuyết trình thương vụ chuyên nghiệp bằng tiếng Hàn hoặc tiếng Anh."
            ],
            "perks": [
                  "Môi trường làm việc tập đoàn tài chính số 1 Hàn Quốc",
                  "Cơ hội onsite tại Seoul"
            ],
            "aiMatch": 91
      },
      {
            "id": 420,
            "title": "Quản Lý Đối Soát Tài Chính & Thanh Toán Trung Gian",
            "company": "Công ty Cổ phần Dịch vụ Di động Trực tuyến (MoMo)",
            "logo": "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=120&h=120&q=80",
            "category": "finance",
            "salaryBadge": "25 - 40 triệu",
            "salaryIsOrange": false,
            "location": "TP.HCM",
            "city": "TP.HCM",
            "exp": "3-5 năm",
            "level": "Trưởng nhóm",
            "type": "Toàn thời gian",
            "isLightningBadge": true,
            "lightningStats": {
                  "applied30d": 17,
                  "evaluated14d": 16,
                  "responseRate": 94,
                  "lastReviewed": "12:00"
            },
            "updated": "6 giờ trước",
            "verified": true,
            "skills": [
                  "Reconciliation",
                  "FinTech Settlement",
                  "Quy trình đối soát ngân hàng",
                  "SQL nâng cao"
            ],
            "jdSummary": [
                  "Quản lý hệ thống đối soát dữ liệu giao dịch tự động giữa ví điện tử MoMo và hơn 40 ngân hàng.",
                  "Xử lý nhanh chóng các giao dịch chênh lệch, khiếu nại hoàn tiền và phòng ngừa thất thoát.",
                  "Tự động hóa báo cáo dòng tiền và thời gian thanh toán công nợ cho các đối tác bán hàng."
            ],
            "perks": [
                  "Thưởng cổ phiếu ESOP thường niên",
                  "Môi trường làm việc năng động và nhiều thử thách công nghệ"
            ],
            "aiMatch": 93
      },
      {
            "id": 421,
            "title": "Trưởng Nhóm Phát Triển Sản Phẩm Tài Chính Số (WealthTech Product Owner)",
            "company": "Công ty Cổ phần Chứng khoán VNDIRECT",
            "logo": "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=120&h=120&q=80",
            "category": "finance",
            "salaryBadge": "30 - 50 triệu",
            "salaryIsOrange": false,
            "location": "Hà Nội",
            "city": "Hà Nội",
            "exp": "3-5 năm",
            "level": "Product Owner",
            "type": "Toàn thời gian",
            "isLightningBadge": true,
            "lightningStats": {
                  "applied30d": 15,
                  "evaluated14d": 14,
                  "responseRate": 93,
                  "lastReviewed": "12:00"
            },
            "updated": "7 giờ trước",
            "verified": true,
            "skills": [
                  "Product Owner",
                  "Chứng chỉ quỹ Dwealth",
                  "Thiết kế hành trình đầu tư",
                  "Agile/Scrum"
            ],
            "jdSummary": [
                  "Chịu trách nhiệm thiết kế các sản phẩm tiết kiệm sinh lời, chứng chỉ quỹ và tích lũy mục tiêu trên App DGo.",
                  "Phối hợp với IT và UI/UX Designer xây dựng giao diện đầu tư đơn giản, trực quan cho nhà đầu tư F0.",
                  "Theo dõi các chỉ số đo lường hiệu quả sản phẩm (MAU, Volume giao dịch, Retention)."
            ],
            "perks": [
                  "Chế độ đãi ngộ cạnh tranh bậc nhất ngành chứng khoán",
                  "Văn hóa tôn trọng sáng tạo cá nhân"
            ],
            "aiMatch": 92
      },
      {
            "id": 422,
            "title": "Chuyên Viên Xử Lý Nợ & Tái Thiết Danh Mục Khách Hàng",
            "company": "Ngân hàng TMCP Sài Gòn Thương Tín (Sacombank)",
            "logo": "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=120&h=120&q=80",
            "category": "finance",
            "salaryBadge": "20 - 35 triệu",
            "salaryIsOrange": false,
            "location": "TP.HCM & Cần Thơ",
            "city": "TP.HCM",
            "exp": "2-4 năm",
            "level": "Chuyên viên",
            "type": "Toàn thời gian",
            "isLightningBadge": true,
            "lightningStats": {
                  "applied30d": 13,
                  "evaluated14d": 12,
                  "responseRate": 92,
                  "lastReviewed": "12:00"
            },
            "updated": "7 giờ trước",
            "verified": true,
            "skills": [
                  "Xử lý nợ xấu NPL",
                  "Thẩm định phát mãi tài sản",
                  "Đàm phán cơ cấu nợ",
                  "Pháp lý tố tụng"
            ],
            "jdSummary": [
                  "Trực tiếp đàm phán với khách hàng có nợ quá hạn để thống nhất phương án cơ cấu lại lịch trả nợ.",
                  "Thực hiện thủ tục bán đấu giá tài sản bảo đảm thu hồi vốn theo đúng quy định pháp luật.",
                  "Quản lý hồ sơ pháp lý và phối hợp với cơ quan thi hành án dân sự."
            ],
            "perks": [
                  "Thưởng nóng theo tỷ lệ thu hồi nợ thành công",
                  "Chế độ phúc lợi Sacombank đầy đủ"
            ],
            "aiMatch": 87
      },
      {
            "id": 423,
            "title": "Senior Audit Associate (Khối Kiểm Toán Ngân Hàng & FinTech)",
            "company": "PwC Vietnam (PricewaterhouseCoopers)",
            "logo": "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=120&h=120&q=80",
            "category": "finance",
            "salaryBadge": "26 - 40 triệu",
            "salaryIsOrange": false,
            "location": "TP.HCM & Hà Nội",
            "city": "TP.HCM",
            "exp": "2-4 năm",
            "level": "Senior Associate",
            "type": "Toàn thời gian",
            "isLightningBadge": true,
            "lightningStats": {
                  "applied30d": 16,
                  "evaluated14d": 15,
                  "responseRate": 94,
                  "lastReviewed": "12:00"
            },
            "updated": "8 giờ trước",
            "verified": true,
            "skills": [
                  "External Audit",
                  "Big 4 Experience",
                  "Kiểm toán ngân hàng",
                  "IFRS Standards",
                  "ACCA/CPA"
            ],
            "jdSummary": [
                  "Trưởng nhóm phụ trách kiểm toán báo cáo tài chính cho các ngân hàng thương mại và ví điện tử lớn.",
                  "Đánh giá tính tuân thủ các chuẩn mực kế toán IFRS 9 về trích lập dự phòng rủi ro tín dụng.",
                  "Soạn thảo thư quản lý (Management Letter) chỉ ra các điểm yếu kiểm soát nội bộ."
            ],
            "perks": [
                  "Môi trường làm việc Big 4 chuẩn mực quốc tế",
                  "Chính sách tài trợ học bổng ACCA/CPA"
            ],
            "aiMatch": 95
      },
      {
            "id": 424,
            "title": "M&A Due Diligence Consultant (Tư Vấn Tài Chính Doanh Nghiệp)",
            "company": "KPMG Vietnam",
            "logo": "https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=120&h=120&q=80",
            "category": "finance",
            "salaryBadge": "30 - 48 triệu",
            "salaryIsOrange": true,
            "location": "Hà Nội & TP.HCM",
            "city": "Hà Nội",
            "exp": "3-5 năm",
            "level": "Consultant / Senior",
            "type": "Toàn thời gian",
            "isLightningBadge": true,
            "lightningStats": {
                  "applied30d": 11,
                  "evaluated14d": 10,
                  "responseRate": 91,
                  "lastReviewed": "12:00"
            },
            "updated": "8 giờ trước",
            "verified": true,
            "skills": [
                  "Financial Due Diligence",
                  "Tư vấn M&A",
                  "Chất lượng lợi nhuận (QoE)",
                  "Vốn lưu động ròng (NWC)"
            ],
            "jdSummary": [
                  "Thực hiện thẩm định chất lượng lợi nhuận (Quality of Earnings) và nợ ròng cho các thương vụ M&A.",
                  "Xác định các yếu tố rủi ro tài chính tiềm ẩn có thể ảnh hưởng đến mức định giá mua bán doanh nghiệp.",
                  "Hỗ trợ khách hàng trong quá trình đàm phán hợp đồng mua bán cổ phần (SPA)."
            ],
            "perks": [
                  "Làm việc cùng các chuyên gia hàng đầu khu vực châu Á - Thái Bình Dương",
                  "Gói bảo hiểm toàn diện"
            ],
            "aiMatch": 94
      },
      {
            "id": 501,
            "title": "Trưởng Phòng Tuyển Dụng Nhân Tài (Talent Acquisition Lead)",
            "company": "FPT Software Global",
            "logo": "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=120&h=120&q=80",
            "category": "hr",
            "salaryBadge": "28 - 45 triệu",
            "salaryIsOrange": false,
            "location": "Hà Nội",
            "city": "Hà Nội",
            "exp": "3-5 năm",
            "level": "Trưởng phòng / Quản lý",
            "type": "Hybrid",
            "isLightningBadge": true,
            "lightningStats": {
                  "applied30d": 20,
                  "evaluated14d": 19,
                  "responseRate": 95,
                  "lastReviewed": "12:00"
            },
            "updated": "10 phút trước",
            "verified": true,
            "skills": [
                  "Tech Recruitment",
                  "Talent Sourcing",
                  "Headhunting",
                  "Employer Branding"
            ],
            "jdSummary": [
                  "Chịu trách nhiệm hoàn thành chỉ tiêu tuyển dụng 500+ kỹ sư phần mềm cao cấp hàng năm.",
                  "Xây dựng quan hệ hợp tác với các trường đại học công nghệ hàng đầu và cộng đồng developer.",
                  "Ứng dụng công nghệ AI ATS để tối ưu thời gian tuyển dụng (Time-to-Hire)."
            ],
            "perks": [
                  "Thưởng tuyển dụng theo năng suất hàng tháng",
                  "Gói bảo hiểm FPT Care cho cả gia đình"
            ],
            "aiMatch": 95
      },
      {
            "id": 502,
            "title": "HR Business Partner (HRBP) - Khối Công Nghệ",
            "company": "VNG Corporation",
            "logo": "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&w=120&h=120&q=80",
            "category": "hr",
            "salaryBadge": "30 - 48 triệu",
            "salaryIsOrange": true,
            "location": "TP.HCM",
            "city": "TP.HCM",
            "exp": "3-5 năm",
            "level": "Senior / Quản lý",
            "type": "Toàn thời gian",
            "isLightningBadge": true,
            "lightningStats": {
                  "applied30d": 16,
                  "evaluated14d": 15,
                  "responseRate": 94,
                  "lastReviewed": "12:00"
            },
            "updated": "35 phút trước",
            "verified": true,
            "skills": [
                  "HRBP",
                  "Quản trị nhân tài",
                  "Đánh giá KPI / OKRs",
                  "Văn hóa doanh nghiệp"
            ],
            "jdSummary": [
                  "Đồng hành chiến lược với Giám đốc khối sản phẩm Game & Zalo về quy hoạch nguồn nhân lực.",
                  "Triển khai các chương trình đánh giá hiệu suất, thăng tiến và giữ chân nhân tài công nghệ.",
                  "Giải quyết các vấn đề quan hệ lao động và tư vấn phát triển tổ chức (OD)."
            ],
            "perks": [
                  "Làm việc tại không gian sáng tạo VNG Campus",
                  "Thưởng performance theo quý"
            ],
            "aiMatch": 93
      },
      {
            "id": 503,
            "title": "Chuyên Viên C&B & Chính Sách Nhân Sự Cao Cấp",
            "company": "Tập đoàn Công nghiệp - Viễn thông Quân đội (Viettel)",
            "logo": "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=120&h=120&q=80",
            "category": "hr",
            "salaryBadge": "22 - 35 triệu",
            "salaryIsOrange": false,
            "location": "Hà Nội",
            "city": "Hà Nội",
            "exp": "2-4 năm",
            "level": "Chuyên viên cao cấp",
            "type": "Toàn thời gian",
            "isLightningBadge": true,
            "lightningStats": {
                  "applied30d": 18,
                  "evaluated14d": 16,
                  "responseRate": 89,
                  "lastReviewed": "12:00"
            },
            "updated": "1 giờ trước",
            "verified": true,
            "skills": [
                  "C&B",
                  "Luật lao động",
                  "Xây dựng thang bảng lương 3P",
                  "Thuế TNCN & BHXH"
            ],
            "jdSummary": [
                  "Quản lý bảng lương và chế độ đãi ngộ hàng tháng cho hơn 1.000 cán bộ nhân viên.",
                  "Khảo sát lương thưởng thị trường (Salary Benchmarking) để đề xuất điều chỉnh bảng lương 3P.",
                  "Tối ưu hóa các chính sách phúc lợi và đảm bảo tuân thủ 100% Luật lao động hiện hành."
            ],
            "perks": [
                  "Môi trường quân đội kỷ luật và chuyên nghiệp",
                  "Phúc lợi toàn diện và ổn định lâu dài"
            ],
            "aiMatch": 90
      },
      {
            "id": 504,
            "title": "Trưởng Phòng Hành Chính & Quản Trị Vận Hành Văn Phòng",
            "company": "Bitexco Group",
            "logo": "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=120&h=120&q=80",
            "category": "hr",
            "salaryBadge": "25 - 38 triệu",
            "salaryIsOrange": false,
            "location": "TP.HCM",
            "city": "TP.HCM",
            "exp": "3-5 năm",
            "level": "Trưởng phòng",
            "type": "Toàn thời gian",
            "isLightningBadge": false,
            "lightningStats": {
                  "applied30d": 14,
                  "evaluated14d": 10,
                  "responseRate": 71,
                  "lastReviewed": "12:00"
            },
            "updated": "3 giờ trước",
            "verified": true,
            "skills": [
                  "Quản trị hành chính",
                  "Facility Management",
                  "Quản lý chi phí",
                  "Đấu thầu nhà cung cấp"
            ],
            "jdSummary": [
                  "Quản trị toàn bộ công tác vận hành, an ninh và lễ tân tại trụ sở tập đoàn.",
                  "Đàm phán hợp đồng mua sắm trang thiết bị văn phòng và quản lý chi phí hành chính định kỳ.",
                  "Tổ chức các sự kiện nội bộ, lễ kỷ niệm và hậu cần cho Ban Lãnh Đạo tập đoàn."
            ],
            "perks": [
                  "Làm việc tại tòa tháp Bitexco Financial Tower",
                  "Chế độ nghỉ phép 15 ngày/năm"
            ],
            "aiMatch": 85
      },
      {
            "id": 505,
            "title": "Learning & Development (L&D) Specialist",
            "company": "Sun Group Corporation",
            "logo": "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=120&h=120&q=80",
            "category": "hr",
            "salaryBadge": "20 - 32 triệu",
            "salaryIsOrange": false,
            "location": "Hà Nội & Đà Nẵng",
            "city": "Hà Nội",
            "exp": "2-4 năm",
            "level": "Chuyên viên",
            "type": "Toàn thời gian",
            "isLightningBadge": true,
            "lightningStats": {
                  "applied30d": 12,
                  "evaluated14d": 10,
                  "responseRate": 83,
                  "lastReviewed": "12:00"
            },
            "updated": "4 giờ trước",
            "verified": true,
            "skills": [
                  "Đào tạo nội bộ",
                  "Khung năng lực",
                  "E-Learning",
                  "Phát triển lãnh đạo"
            ],
            "jdSummary": [
                  "Khảo sát nhu cầu đào tạo (TNA) của các khối vận hành du lịch và quản lý dự án.",
                  "Thiết kế giáo trình và tổ chức các khóa đào tạo nâng cao kỹ năng mềm và kỹ năng chuyên môn.",
                  "Vận hành hệ thống học tập trực tuyến LMS cho toàn bộ cán bộ nhân viên tập đoàn."
            ],
            "perks": [
                  "Được tham gia các chương trình đào tạo quốc tế",
                  "Phúc lợi du lịch nghỉ dưỡng"
            ],
            "aiMatch": 88
      },
      {
            "id": 506,
            "title": "Chuyên Viên Phát Triển Văn Hóa Doanh Nghiệp & EB",
            "company": "Ngân hàng Techcombank",
            "logo": "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=120&h=120&q=80",
            "category": "hr",
            "salaryBadge": "22 - 35 triệu",
            "salaryIsOrange": false,
            "location": "Hà Nội",
            "city": "Hà Nội",
            "exp": "2-4 năm",
            "level": "Chuyên viên",
            "type": "Toàn thời gian",
            "isLightningBadge": true,
            "lightningStats": {
                  "applied30d": 15,
                  "evaluated14d": 13,
                  "responseRate": 87,
                  "lastReviewed": "12:00"
            },
            "updated": "5 giờ trước",
            "verified": true,
            "skills": [
                  "Employer Branding",
                  "Truyền thông nội bộ",
                  "Tổ chức sự kiện",
                  "Sáng tạo nội dung"
            ],
            "jdSummary": [
                  "Lên kế hoạch và triển khai các chiến dịch xây dựng Thương hiệu Nhà tuyển dụng (Employer Branding).",
                  "Sản xuất các ấn phẩm truyền thông nội bộ, radio và bản tin định kỳ gắn kết nhân viên.",
                  "Chủ trì các hoạt động teambuilding, phong trào thể thao và trách nhiệm xã hội CSR."
            ],
            "perks": [
                  "Môi trường ngân hàng chuyển đổi số xuất sắc nhất",
                  "Chế độ đãi ngộ và lộ trình nghề nghiệp rõ ràng"
            ],
            "aiMatch": 91
      },
      {
            "id": 507,
            "title": "HR Operations Specialist (Quản Trị Nhân Sự Khối Vận Hành Kho Vận)",
            "company": "Shopee Vietnam (SPX Express)",
            "logo": "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=120&h=120&q=80",
            "category": "hr",
            "salaryBadge": "20 - 32 triệu",
            "salaryIsOrange": false,
            "location": "TP.HCM & Bắc Ninh",
            "city": "TP.HCM",
            "exp": "2-4 năm",
            "level": "Chuyên viên cao cấp",
            "type": "Toàn thời gian",
            "isLightningBadge": true,
            "lightningStats": {
                  "applied30d": 17,
                  "evaluated14d": 16,
                  "responseRate": 94,
                  "lastReviewed": "12:00"
            },
            "updated": "25 phút trước",
            "verified": true,
            "skills": [
                  "HR Operations",
                  "Quản lý hợp đồng lao động",
                  "Chấm công ca kíp",
                  "Thực thi quy chế"
            ],
            "jdSummary": [
                  "Quản lý hồ sơ nhân sự và ký kết hợp đồng lao động cho hơn 2.000 nhân viên kho vận logistics.",
                  "Giám sát dữ liệu chấm công vân tay, giải quyết phép năm và chế độ thai sản, ốm đau kịp thời.",
                  "Tổ chức tiếp nhận nhân sự mới (Onboarding) và đào tạo nội quy an toàn lao động."
            ],
            "perks": [
                  "Môi trường E-commerce năng động",
                  "Phụ cấp ăn ca và xe đưa đón"
            ],
            "aiMatch": 89
      },
      {
            "id": 508,
            "title": "Giám Đốc Nhân Sự Khối Vận Hành Bán Lẻ (HR Director WinMart)",
            "company": "Masan Group (WinCommerce)",
            "logo": "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=120&h=120&q=80",
            "category": "hr",
            "salaryBadge": "45 - 75 triệu",
            "salaryIsOrange": true,
            "location": "Hà Nội & TP.HCM",
            "city": "Hà Nội",
            "exp": "Trên 5 năm",
            "level": "Giám đốc khối",
            "type": "Toàn thời gian",
            "isLightningBadge": true,
            "lightningStats": {
                  "applied30d": 11,
                  "evaluated14d": 10,
                  "responseRate": 91,
                  "lastReviewed": "12:00"
            },
            "updated": "40 phút trước",
            "verified": true,
            "skills": [
                  "HR Strategy",
                  "Quản trị nhân lực bán lẻ quy mô lớn",
                  "Quan hệ lao động",
                  "Tối ưu định biên"
            ],
            "jdSummary": [
                  "Hoạch định chiến lược nhân sự toàn diện cho hơn 30.000 nhân sự chuỗi siêu thị WinMart và WinMart+.",
                  "Thiết kế cơ chế lương thưởng kích thích năng suất lao động tại điểm bán (Productivity-based Pay).",
                  "Xây dựng đội ngũ kế thừa và chuẩn hóa tiêu chuẩn dịch vụ khách hàng 5 sao."
            ],
            "perks": [
                  "Gói lương thưởng cạnh tranh top tập đoàn bán lẻ",
                  "Xe ô tô đưa đón lãnh đạo"
            ],
            "aiMatch": 96
      },
      {
            "id": 509,
            "title": "Trưởng Nhóm Thu Hút Nhân Tài Cấp Cao (Executive Search Lead)",
            "company": "Tập đoàn Vingroup",
            "logo": "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=120&h=120&q=80",
            "category": "hr",
            "salaryBadge": "35 - 55 triệu",
            "salaryIsOrange": true,
            "location": "Hà Nội",
            "city": "Hà Nội",
            "exp": "3-5 năm",
            "level": "Trưởng nhóm",
            "type": "Toàn thời gian",
            "isLightningBadge": true,
            "lightningStats": {
                  "applied30d": 13,
                  "evaluated14d": 12,
                  "responseRate": 92,
                  "lastReviewed": "12:00"
            },
            "updated": "1 giờ trước",
            "verified": true,
            "skills": [
                  "Executive Search",
                  "Headhunting C-Level",
                  "Tuyển dụng nhân sự quốc tế",
                  "Đàm phán đãi ngộ"
            ],
            "jdSummary": [
                  "Tìm kiếm và thu hút các chuyên gia hàng đầu thế giới về trí tuệ nhân tạo, ô tô điện và y tế.",
                  "Phỏng vấn đánh giá năng lực lãnh đạo và tư vấn mức đãi ngộ cho Hội đồng Quản trị.",
                  "Đảm bảo trải nghiệm ứng viên cao cấp đạt chuẩn quốc tế từ lúc tiếp cận đến khi hòa nhập."
            ],
            "perks": [
                  "Phúc lợi đặc quyền hệ sinh thái Vingroup (Vinhomes, Vinmec, Vinpearl)",
                  "Thưởng thành tích cao"
            ],
            "aiMatch": 95
      },
      {
            "id": 510,
            "title": "Quản Lý Đào Tạo & Phát Triển Chuỗi Siêu Thị Toàn Quốc",
            "company": "Công ty Cổ phần Đầu tư Thế Giới Di Động (MWG)",
            "logo": "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=120&h=120&q=80",
            "category": "hr",
            "salaryBadge": "25 - 40 triệu",
            "salaryIsOrange": false,
            "location": "TP.HCM",
            "city": "TP.HCM",
            "exp": "3-5 năm",
            "level": "Quản lý đào tạo",
            "type": "Toàn thời gian",
            "isLightningBadge": true,
            "lightningStats": {
                  "applied30d": 15,
                  "evaluated14d": 14,
                  "responseRate": 93,
                  "lastReviewed": "12:00"
            },
            "updated": "1 giờ trước",
            "verified": true,
            "skills": [
                  "Retail Training",
                  "Văn hóa Tận Tâm Phục Vụ",
                  "Đào tạo kỹ năng bán hàng",
                  "Mobile Learning App"
            ],
            "jdSummary": [
                  "Quản lý hệ thống đào tạo hội nhập văn hóa phục vụ khách hàng cho hàng nghìn nhân viên mới mỗi tháng.",
                  "Sản xuất các video micro-learning đào tạo tính năng sản phẩm công nghệ mới trên app nội bộ.",
                  "Đánh giá hiệu quả ứng dụng kiến thức vào thực tế và cải thiện chỉ số hài lòng khách hàng NPS."
            ],
            "perks": [
                  "Gói cổ phiếu thưởng ESOP thường niên",
                  "Môi trường làm việc thân thiện đoàn kết"
            ],
            "aiMatch": 92
      },
      {
            "id": 511,
            "title": "Chuyên Viên Quan Hệ Lao Động & Tuân Thủ (ER Specialist)",
            "company": "Samsung Display Vietnam (SDV)",
            "logo": "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&w=120&h=120&q=80",
            "category": "hr",
            "salaryBadge": "22 - 36 triệu",
            "salaryIsOrange": false,
            "location": "Bắc Ninh & Hà Nội",
            "city": "Hà Nội",
            "exp": "2-4 năm",
            "level": "Chuyên viên cao cấp",
            "type": "Toàn thời gian",
            "isLightningBadge": true,
            "lightningStats": {
                  "applied30d": 16,
                  "evaluated14d": 15,
                  "responseRate": 94,
                  "lastReviewed": "12:00"
            },
            "updated": "2 giờ trước",
            "verified": true,
            "skills": [
                  "Employee Relations",
                  "Giải quyết tranh chấp lao động",
                  "Đối thoại công đoàn",
                  "Pháp lý lao động"
            ],
            "jdSummary": [
                  "Xử lý các vấn đề quan hệ lao động, kỷ luật lao động và khiếu nại của người lao động đúng luật.",
                  "Tổ chức hội nghị người lao động định kỳ và phối hợp với Ban Chấp hành Công đoàn cơ sở.",
                  "Đảm bảo nhà máy luôn đạt điểm đánh giá cao trong các cuộc đánh giá trách nhiệm xã hội RBA."
            ],
            "perks": [
                  "Xe đưa đón CBNV khắp các tuyến Hà Nội - Bắc Ninh",
                  "Bữa ăn miễn phí và chế độ thưởng lớn"
            ],
            "aiMatch": 90
      },
      {
            "id": 512,
            "title": "HRBP Leader (Khối Viễn Thông & Hạ Tầng Số Doanh Nghiệp)",
            "company": "Tập đoàn Công nghệ CMC (CMC Corporation)",
            "logo": "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=120&h=120&q=80",
            "category": "hr",
            "salaryBadge": "28 - 45 triệu",
            "salaryIsOrange": false,
            "location": "Hà Nội",
            "city": "Hà Nội",
            "exp": "3-5 năm",
            "level": "Trưởng nhóm HRBP",
            "type": "Toàn thời gian",
            "isLightningBadge": true,
            "lightningStats": {
                  "applied30d": 14,
                  "evaluated14d": 13,
                  "responseRate": 93,
                  "lastReviewed": "12:00"
            },
            "updated": "2 giờ trước",
            "verified": true,
            "skills": [
                  "HRBP IT",
                  "Quy hoạch tổ chức",
                  "Đánh giá năng lực nhân sự",
                  "Giữ chân nhân tài"
            ],
            "jdSummary": [
                  "Đối tác nhân sự chiến lược cho các đơn vị thành viên khối hạ tầng số và an ninh mạng CMC.",
                  "Xây dựng ma trận kỹ năng chuyên môn và lộ trình thăng tiến nghề nghiệp cho kỹ sư công nghệ.",
                  "Tham mưu cơ chế lương thưởng khích lệ tinh thần đổi mới sáng tạo và chuyển đổi số."
            ],
            "perks": [
                  "Môi trường làm việc tôn trọng cá nhân",
                  "Chế độ phúc lợi tập đoàn công nghệ toàn diện"
            ],
            "aiMatch": 91
      },
      {
            "id": 513,
            "title": "People Operations Partner (Chính Sách & Trải Nghiệm Nhân Viên)",
            "company": "Grab Vietnam",
            "logo": "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=120&h=120&q=80",
            "category": "hr",
            "salaryBadge": "25 - 40 triệu",
            "salaryIsOrange": false,
            "location": "TP.HCM",
            "city": "TP.HCM",
            "exp": "2-4 năm",
            "level": "People Partner",
            "type": "Toàn thời gian",
            "isLightningBadge": true,
            "lightningStats": {
                  "applied30d": 12,
                  "evaluated14d": 11,
                  "responseRate": 92,
                  "lastReviewed": "12:00"
            },
            "updated": "3 giờ trước",
            "verified": true,
            "skills": [
                  "People Operations",
                  "Employee Experience",
                  "Onboarding tự động hóa",
                  "Workday HRIS"
            ],
            "jdSummary": [
                  "Tối ưu hóa các điểm chạm trong hành trình trải nghiệm nhân viên từ gia nhập đến rời tổ chức.",
                  "Vận hành hệ thống quản lý thông tin nhân sự toàn cầu Workday mượt mà và chính xác.",
                  "Tổ chức các diễn đàn đối thoại mở Grabbers All-Hands và khảo sát mức độ gắn kết Pulse Survey."
            ],
            "perks": [
                  "Môi trường làm việc linh hoạt chuẩn quốc tế",
                  "Gói phụ cấp GrabCredits hàng tháng"
            ],
            "aiMatch": 93
      },
      {
            "id": 514,
            "title": "Chuyên Viên Khảo Sát & Xây Dựng Khung Năng Lực (Talent Management)",
            "company": "Ngân hàng TMCP Việt Nam Thịnh Vượng (VPBank)",
            "logo": "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=120&h=120&q=80",
            "category": "hr",
            "salaryBadge": "22 - 35 triệu",
            "salaryIsOrange": false,
            "location": "Hà Nội",
            "city": "Hà Nội",
            "exp": "2-4 năm",
            "level": "Chuyên viên cao cấp",
            "type": "Toàn thời gian",
            "isLightningBadge": true,
            "lightningStats": {
                  "applied30d": 15,
                  "evaluated14d": 14,
                  "responseRate": 93,
                  "lastReviewed": "12:00"
            },
            "updated": "3 giờ trước",
            "verified": true,
            "skills": [
                  "Talent Management",
                  "Khung năng lực từ điển chức danh",
                  "Assessment Center",
                  "Quy hoạch kế thừa"
            ],
            "jdSummary": [
                  "Xây dựng và chuẩn hóa bộ từ điển năng lực chuyên môn cho từng khối phòng ban trong ngân hàng.",
                  "Thiết kế bài kiểm tra đánh giá năng lực định kỳ tại trung tâm khảo thí Assessment Center.",
                  "Nhận diện các nhân sự có tiềm năng cao (HiPo) để đưa vào chương trình đào tạo quản trị viên tập sự."
            ],
            "perks": [
                  "Môi trường ngân hàng chuyển đổi số năng động nhất",
                  "Chế độ đãi ngộ xứng đáng"
            ],
            "aiMatch": 89
      },
      {
            "id": 515,
            "title": "Trưởng Bộ Phận Tuyển Dụng Quốc Tế (Global Talent Acquisition)",
            "company": "Tập đoàn VinFast Toàn Cầu",
            "logo": "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=120&h=120&q=80",
            "category": "hr",
            "salaryBadge": "35 - 60 triệu",
            "salaryIsOrange": true,
            "location": "Hà Nội",
            "city": "Hà Nội",
            "exp": "3-5 năm",
            "level": "Trưởng bộ phận",
            "type": "Toàn thời gian",
            "isLightningBadge": true,
            "lightningStats": {
                  "applied30d": 11,
                  "evaluated14d": 10,
                  "responseRate": 91,
                  "lastReviewed": "12:00"
            },
            "updated": "4 giờ trước",
            "verified": true,
            "skills": [
                  "Global Recruitment",
                  "Kỹ sư ô tô điện",
                  "Thị trường Mỹ/Canada/Châu Âu",
                  "Relocation Package"
            ],
            "jdSummary": [
                  "Chịu trách nhiệm tuyển dụng nhân sự cấp quản lý và chuyên gia tại các văn phòng VinFast Bắc Mỹ và châu Âu.",
                  "Xây dựng chính sách luân chuyển cán bộ quốc tế (Relocation & Expat Policies).",
                  "Đại diện tập đoàn tham gia các ngày hội việc làm và triển lãm công nghệ ô tô quốc tế."
            ],
            "perks": [
                  "Ưu đãi mua ô tô điện VinFast đặc quyền",
                  "Cơ hội công tác nước ngoài thường xuyên"
            ],
            "aiMatch": 95
      },
      {
            "id": 516,
            "title": "Quản Trị Hành Chính & Cung Ứng Vật Tư Văn Phòng Toàn Quốc",
            "company": "Tập đoàn Golden Gate (Golden Gate Group)",
            "logo": "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=120&h=120&q=80",
            "category": "hr",
            "salaryBadge": "20 - 32 triệu",
            "salaryIsOrange": false,
            "location": "Hà Nội & TP.HCM",
            "city": "Hà Nội",
            "exp": "2-4 năm",
            "level": "Chuyên viên cao cấp",
            "type": "Toàn thời gian",
            "isLightningBadge": true,
            "lightningStats": {
                  "applied30d": 13,
                  "evaluated14d": 12,
                  "responseRate": 92,
                  "lastReviewed": "12:00"
            },
            "updated": "4 giờ trước",
            "verified": true,
            "skills": [
                  "Hành chính văn phòng",
                  "Đấu thầu mua sắm",
                  "Quản lý tài sản cố định",
                  "Facility Services"
            ],
            "jdSummary": [
                  "Quản lý hợp đồng thuê trụ sở văn phòng, dịch vụ an ninh và vệ sinh tòa nhà.",
                  "Thương thảo giá và ký kết hợp đồng cung cấp đồ dùng văn phòng, máy in và dịch vụ IT support.",
                  "Kiểm kê tài sản định kỳ và thanh lý thiết bị cũ hỏng theo đúng quy trình kiểm toán."
            ],
            "perks": [
                  "Ưu đãi 30% tại toàn bộ hệ thống nhà hàng Golden Gate",
                  "Môi trường làm việc thân thiện"
            ],
            "aiMatch": 87
      },
      {
            "id": 517,
            "title": "Compensation & Benefits Lead (Xây Dựng Cơ Chế Thưởng ESOP)",
            "company": "One Mount Group",
            "logo": "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=120&h=120&q=80",
            "category": "hr",
            "salaryBadge": "30 - 50 triệu",
            "salaryIsOrange": false,
            "location": "Hà Nội",
            "city": "Hà Nội",
            "exp": "3-5 năm",
            "level": "Trưởng nhóm C&B",
            "type": "Toàn thời gian",
            "isLightningBadge": true,
            "lightningStats": {
                  "applied30d": 14,
                  "evaluated14d": 13,
                  "responseRate": 93,
                  "lastReviewed": "12:00"
            },
            "updated": "5 giờ trước",
            "verified": true,
            "skills": [
                  "Total Rewards",
                  "ESOP Structure",
                  "Thang bảng lương công nghệ",
                  "Khảo sát Mercer/WTW"
            ],
            "jdSummary": [
                  "Thiết kế gói đãi ngộ tổng thể (Total Rewards) cạnh tranh nhất ngành công nghệ cho One Mount.",
                  "Xây dựng quy chế và quản lý kế hoạch phân phối cổ phiếu thưởng ESOP cho nhân sự chủ chốt.",
                  "Phân tích chi phí ngân sách nhân sự (HR Cost) và đề xuất phương án tối ưu hóa hiệu suất chi trả."
            ],
            "perks": [
                  "Gói khám sức khỏe Vinmec VIP",
                  "Chế độ làm việc linh hoạt Hybrid"
            ],
            "aiMatch": 94
      },
      {
            "id": 518,
            "title": "Internal Communications & Culture Specialist",
            "company": "Công ty Cổ phần Be Group",
            "logo": "https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=120&h=120&q=80",
            "category": "hr",
            "salaryBadge": "18 - 28 triệu",
            "salaryIsOrange": false,
            "location": "Hà Nội & TP.HCM",
            "city": "TP.HCM",
            "exp": "1-3 năm",
            "level": "Chuyên viên",
            "type": "Toàn thời gian",
            "isLightningBadge": true,
            "lightningStats": {
                  "applied30d": 16,
                  "evaluated14d": 15,
                  "responseRate": 94,
                  "lastReviewed": "12:00"
            },
            "updated": "5 giờ trước",
            "verified": true,
            "skills": [
                  "Truyền thông nội bộ",
                  "Văn hóa startup công nghệ",
                  "Sản xuất bản tin video",
                  "Townhall Event"
            ],
            "jdSummary": [
                  "Chủ trì sản xuất bản tin nội bộ hàng tuần, podcast và video truyền cảm hứng văn hóa Be.",
                  "Tổ chức các buổi gặp gỡ toàn thể CBNV (Monthly Townhall) kết nối lãnh đạo và nhân viên.",
                  "Lên kế hoạch tổ chức các sự kiện mừng sinh nhật công ty, Ngày hội gia đình và tiệc Year End Party."
            ],
            "perks": [
                  "Gói di chuyển Be miễn phí",
                  "Môi trường làm việc trẻ trung sáng tạo"
            ],
            "aiMatch": 88
      },
      {
            "id": 519,
            "title": "Trưởng Nhóm Quản Trị Trải Nghiệm Nhân Viên (EX Specialist)",
            "company": "Ngân hàng TMCP Quân Đội (MB Bank)",
            "logo": "https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=120&h=120&q=80",
            "category": "hr",
            "salaryBadge": "25 - 40 triệu",
            "salaryIsOrange": false,
            "location": "Hà Nội",
            "city": "Hà Nội",
            "exp": "2-4 năm",
            "level": "Trưởng nhóm",
            "type": "Toàn thời gian",
            "isLightningBadge": true,
            "lightningStats": {
                  "applied30d": 15,
                  "evaluated14d": 14,
                  "responseRate": 93,
                  "lastReviewed": "12:00"
            },
            "updated": "6 giờ trước",
            "verified": true,
            "skills": [
                  "Employee Experience",
                  "HR Digital Transformation",
                  "MB WOW Culture",
                  "Lắng nghe phản hồi"
            ],
            "jdSummary": [
                  "Xây dựng và số hóa toàn bộ trải nghiệm nhân viên trên ứng dụng MB Nhân Sự Thông Minh.",
                  "Khảo sát chỉ số hài lòng nhân viên eNPS và đề xuất các cải tiến về môi trường làm việc số.",
                  "Triển khai các chương trình ghi nhận và khen thưởng tức thì (Spot Bonus, Kudos)."
            ],
            "perks": [
                  "Phúc lợi ngân hàng thuộc top tốt nhất Việt Nam",
                  "Thưởng các dịp lễ tết chu đáo"
            ],
            "aiMatch": 92
      },
      {
            "id": 520,
            "title": "HR Business Partner (Khối Logistics & Supply Chain)",
            "company": "Tiki Corporation (TikiNOW Smart Logistics)",
            "logo": "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=120&h=120&q=80",
            "category": "hr",
            "salaryBadge": "24 - 38 triệu",
            "salaryIsOrange": false,
            "location": "TP.HCM & Bình Dương",
            "city": "TP.HCM",
            "exp": "3-5 năm",
            "level": "HRBP Senior",
            "type": "Toàn thời gian",
            "isLightningBadge": true,
            "lightningStats": {
                  "applied30d": 13,
                  "evaluated14d": 12,
                  "responseRate": 92,
                  "lastReviewed": "12:00"
            },
            "updated": "6 giờ trước",
            "verified": true,
            "skills": [
                  "HRBP Logistics",
                  "Định biên nhân sự kho vận",
                  "Năng suất lao động ca kíp",
                  "An toàn lao động"
            ],
            "jdSummary": [
                  "Làm việc trực tiếp cùng Giám đốc khối kho vận TikiNOW để giải quyết các bài toán nguồn lực mùa cao điểm.",
                  "Tối ưu hóa chi phí nhân sự trên mỗi đơn hàng đóng gói và giao nhận hoàn tất.",
                  "Giải quyết tranh chấp phát sinh tại các trung tâm xử lý đơn hàng Fulfillment Center."
            ],
            "perks": [
                  "Môi trường thương mại điện tử chuyên nghiệp",
                  "Mua sắm Tiki ưu đãi nội bộ"
            ],
            "aiMatch": 90
      },
      {
            "id": 521,
            "title": "Chuyên Viên Tuyển Dụng & Đào Tạo Tiếp Viên Hàng Không",
            "company": "Công ty Cổ phần Hàng không Vietjet (Vietjet Air)",
            "logo": "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=120&h=120&q=80",
            "category": "hr",
            "salaryBadge": "22 - 35 triệu",
            "salaryIsOrange": false,
            "location": "TP.HCM & Hà Nội",
            "city": "TP.HCM",
            "exp": "2-4 năm",
            "level": "Chuyên viên cao cấp",
            "type": "Toàn thời gian",
            "isLightningBadge": true,
            "lightningStats": {
                  "applied30d": 18,
                  "evaluated14d": 17,
                  "responseRate": 94,
                  "lastReviewed": "12:00"
            },
            "updated": "7 giờ trước",
            "verified": true,
            "skills": [
                  "Tuyển dụng hàng không",
                  "Đánh giá ngoại hình/ngoại ngữ",
                  "Phỏng vấn cabin crew",
                  "Tổ chức casting"
            ],
            "jdSummary": [
                  "Tổ chức các đợt thi tuyển tiếp viên hàng không tại các thành phố lớn trên cả nước và khu vực.",
                  "Đánh giá các tiêu chuẩn khắt khe về ngoại ngữ, kỹ năng giao tiếp và khả năng phản ứng tình huống.",
                  "Điều phối khóa đào tạo nghiệp vụ an toàn bay tại Học viện Hàng không Vietjet."
            ],
            "perks": [
                  "Vé máy bay miễn phí không giới hạn tuyến bay nội địa và quốc tế",
                  "Môi trường đa văn hóa"
            ],
            "aiMatch": 91
      },
      {
            "id": 522,
            "title": "Quản Lý Nhân Sự Vùng (Regional HR Manager FMCG)",
            "company": "Công ty Cổ phần Viễn thông FPT (FPT Telecom)",
            "logo": "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=120&h=120&q=80",
            "category": "hr",
            "salaryBadge": "26 - 42 triệu",
            "salaryIsOrange": false,
            "location": "Đà Nẵng & Miền Trung",
            "city": "Đà Nẵng",
            "exp": "3-5 năm",
            "level": "Trưởng phòng vùng",
            "type": "Toàn thời gian",
            "isLightningBadge": true,
            "lightningStats": {
                  "applied30d": 14,
                  "evaluated14d": 13,
                  "responseRate": 93,
                  "lastReviewed": "12:00"
            },
            "updated": "7 giờ trước",
            "verified": true,
            "skills": [
                  "Regional HR",
                  "Quản lý nhân sự chi nhánh tỉnh",
                  "Tuyển dụng diện rộng",
                  "Chính sách địa phương"
            ],
            "jdSummary": [
                  "Quản lý công tác nhân sự cho hơn 12 chi nhánh FPT Telecom tại các tỉnh miền Trung.",
                  "Chỉ đạo hoàn thành chỉ tiêu tuyển dụng nhân viên kinh doanh và kỹ thuật viên bảo trì mạng lưới.",
                  "Kiểm tra định kỳ việc thực thi chính sách chế độ của CBNV theo đúng chuẩn tập đoàn."
            ],
            "perks": [
                  "Chế độ phúc lợi FPT Care",
                  "Thưởng hoàn thành mục tiêu kinh doanh vùng"
            ],
            "aiMatch": 89
      },
      {
            "id": 523,
            "title": "Employer Branding & Future Leaders Program Specialist",
            "company": "Unilever Vietnam",
            "logo": "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=120&h=120&q=80",
            "category": "hr",
            "salaryBadge": "25 - 40 triệu",
            "salaryIsOrange": false,
            "location": "TP.HCM",
            "city": "TP.HCM",
            "exp": "2-4 năm",
            "level": "Chuyên viên cao cấp",
            "type": "Toàn thời gian",
            "isLightningBadge": true,
            "lightningStats": {
                  "applied30d": 16,
                  "evaluated14d": 15,
                  "responseRate": 94,
                  "lastReviewed": "12:00"
            },
            "updated": "8 giờ trước",
            "verified": true,
            "skills": [
                  "Employer Branding",
                  "UFLP Management",
                  "University Relations",
                  "Hackathon/Case Competition"
            ],
            "jdSummary": [
                  "Chủ trì chương trình Nhà Lãnh Đạo Tương Lai Unilever Future Leaders Program (UFLP) danh giá.",
                  "Tổ chức cuộc thi giải quyết tình huống kinh doanh Unilever Future Leaders League cho sinh viên xuất sắc.",
                  "Quản lý các kênh truyền thông tuyển dụng và duy trì vị thế Nơi làm việc tốt nhất Việt Nam."
            ],
            "perks": [
                  "Môi trường phát triển nhân tài chuẩn tập đoàn FMCG số 1",
                  "Phúc lợi và bảo hiểm toàn diện"
            ],
            "aiMatch": 95
      },
      {
            "id": 524,
            "title": "Trưởng Phòng Hành Chính Bệnh Viện & Quản Trị Cơ Sở Vật Chất",
            "company": "Hệ thống Y tế Vinmec (Vinmec Healthcare System)",
            "logo": "https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=120&h=120&q=80",
            "category": "hr",
            "salaryBadge": "28 - 45 triệu",
            "salaryIsOrange": false,
            "location": "Hà Nội & TP.HCM",
            "city": "Hà Nội",
            "exp": "3-5 năm",
            "level": "Trưởng phòng hành chính",
            "type": "Toàn thời gian",
            "isLightningBadge": true,
            "lightningStats": {
                  "applied30d": 12,
                  "evaluated14d": 11,
                  "responseRate": 92,
                  "lastReviewed": "12:00"
            },
            "updated": "8 giờ trước",
            "verified": true,
            "skills": [
                  "Quản trị hành chính y tế",
                  "Tiêu chuẩn quốc tế JCI",
                  "Facility Management",
                  "Quản lý an ninh/vệ sinh"
            ],
            "jdSummary": [
                  "Quản lý toàn bộ công tác hành chính, hậu cần và cơ sở vật chất tại bệnh viện đa khoa quốc tế Vinmec.",
                  "Đảm bảo các quy trình vệ sinh kiểm soát nhiễm khuẩn đạt chuẩn chất lượng quốc tế JCI nghiêm ngặt.",
                  "Điều phối công tác khánh tiết, đón tiếp các đoàn chuyên gia y tế và bệnh nhân VIP."
            ],
            "perks": [
                  "Gói chăm sóc y tế Vinmec đặc quyền cho bản thân và gia đình",
                  "Chế độ đãi ngộ vượt trội"
            ],
            "aiMatch": 91
      }
];