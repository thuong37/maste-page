/**
 * EasyCV - Job Search Logic (viec-lam.js)
 * BMAD-Engineered: Dynamic Data-Driven Architecture, Full Multi-Filter Matrix,
 * Accurate Dynamic Pagination, Realtime Sidebar Counts, AI Match Badge & Persistent Bookmarks.
 */

document.addEventListener('DOMContentLoaded', () => {

  // =========================================================================
  // 1. DATASET: 16 Việc Làm Chuẩn Hóa Theo Mô Hình PRD EasyCV
  // =========================================================================
  const JOBS_DATA = [
    {
      id: 1,
      title: 'Senior Fullstack Developer (ReactJS / Node.js)',
      company: 'FPT Software',
      logo: 'assets/logos/company-fpt.svg',
      verified: true,
      salaryBadge: '28 - 45 triệu',
      salaryIsOrange: false,
      salaryMin: 28,
      salaryMax: 45,
      location: 'Hà Nội (Cầu Giấy)',
      city: 'Hà Nội',
      category: 'it',
      level: 'senior',
      exp: '3-5',
      type: 'hybrid',
      saturday: 'off_sat',
      isFeatured: true,
      isUrgent: true,
      updated: '25 phút trước',
      aiMatch: 95,
      skills: ['ReactJS', 'Node.js', 'TypeScript', 'Hybrid'],
      jd: {
        desc: [
          'Tham gia thiết kế kiến trúc và phát triển hệ thống web ứng dụng quy mô lớn cho đối tác tài chính quốc tế.',
          'Xây dựng các RESTful API hiệu năng cao bằng Node.js và giao diện tương tác mượt mà bằng ReactJS & TypeScript.',
          'Tối ưu hóa tốc độ tải trang, bảo mật và khả năng mở rộng của hệ thống Microservices.'
        ],
        reqs: [
          'Tối thiểu 3 - 5 năm kinh nghiệm làm việc chuyên sâu với ReactJS và Node.js.',
          'Thành thạo TypeScript, cơ sở dữ liệu PostgreSQL / MongoDB và kiến trúc Cloud AWS.',
          'Có khả năng đọc hiểu tài liệu và giao tiếp kỹ thuật tốt bằng tiếng Anh.'
        ],
        perks: [
          'Thu nhập từ 28 - 45 triệu/tháng + Thưởng hiệu quả dự án hàng quý.',
          'Chế độ làm việc linh hoạt kết hợp Hybrid (2 ngày làm từ xa/tuần).',
          'Gói bảo hiểm sức khỏe FPT Care cho bản thân và người thân trong gia đình.'
        ]
      }
    },
    {
      id: 2,
      title: 'Chuyên Viên Khách Hàng Doanh Nghiệp (RM)',
      company: 'Ngân hàng Techcombank',
      logo: 'assets/logos/company-techcombank.svg',
      verified: true,
      salaryBadge: '20 - 35 triệu',
      salaryIsOrange: true,
      salaryMin: 20,
      salaryMax: 35,
      location: 'Hồ Chí Minh (Quận 1)',
      city: 'Hồ Chí Minh',
      category: 'sales',
      level: 'junior',
      exp: '1-3',
      type: 'fulltime',
      saturday: 'work_sat',
      isFeatured: false,
      isUrgent: false,
      updated: '1 giờ trước',
      aiMatch: 92,
      skills: ['Quan hệ khách hàng', 'B2B Sales', 'Tài chính', 'Thưởng KPI cao'],
      jd: {
        desc: [
          'Tìm kiếm, phát triển và quản lý danh mục khách hàng doanh nghiệp vừa và lớn (SME & Corporate).',
          'Tư vấn các gói giải pháp tài chính toàn diện: Tín dụng, thanh toán quốc tế, quản lý dòng tiền.',
          'Thẩm định hồ sơ năng lực tài chính và phối hợp cùng bộ phận rủi ro để phê duyệt khoản vay.'
        ],
        reqs: [
          'Tốt nghiệp Đại học khối ngành Kinh tế, Tài chính - Ngân hàng, Quản trị Kinh doanh.',
          'Từ 1 - 3 năm kinh nghiệm ở vị trí RM hoặc Sales B2B trong ngành ngân hàng, tài chính.',
          'Kỹ năng đàm phán, thuyết trình xuất sắc và tư duy phân tích báo cáo tài chính sắc bén.'
        ],
        perks: [
          'Lương cứng 20 - 35 triệu/tháng + Thưởng doanh số (Incentive) không giới hạn theo quý.',
          'Môi trường làm việc chuẩn quốc tế tại trụ sở Landmark trung tâm Quận 1.',
          'Chương trình đào tạo nâng chuẩn chuyên gia tài chính cấp cao của Techcombank.'
        ]
      }
    },
    {
      id: 3,
      title: 'Senior Product Designer (UI/UX App/Web)',
      company: 'VNG Corporation (Zalo Team)',
      logo: 'assets/logos/company-zalo.svg',
      verified: true,
      salaryBadge: '30 - 50 triệu',
      salaryIsOrange: false,
      salaryMin: 30,
      salaryMax: 50,
      location: 'Hồ Chí Minh (Quận 7)',
      city: 'Hồ Chí Minh',
      category: 'it',
      level: 'senior',
      exp: '3-5',
      type: 'fulltime',
      saturday: 'off_sat',
      isFeatured: true,
      isUrgent: false,
      updated: '2 giờ trước',
      aiMatch: 98,
      skills: ['Figma', 'Design System', 'Mobile App UX', 'MacBook Pro cấp mới'],
      jd: {
        desc: [
          'Dẫn dắt thiết kế trải nghiệm người dùng (UX) và giao diện (UI) cho hệ sinh thái Zalo với hàng chục triệu người dùng.',
          'Nghiên cứu hành vi người dùng, xây dựng wireframe, prototype tương tác cao và tiến hành A/B testing liên tục.',
          'Đồng bộ và phát triển Design System đa nền tảng, phối hợp chặt chẽ với team Engineering.'
        ],
        reqs: [
          'Từ 3 - 5 năm kinh nghiệm thiết kế Product UX/UI cho ứng dụng di động có lượng người dùng lớn.',
          'Sử dụng thành thạo Figma, Design Tokens, Auto-layout và quy trình Component-driven.',
          'Tư duy sản phẩm lấy người dùng làm trung tâm, khả năng giải quyết bài toán phức tạp bằng thiết kế đơn giản.'
        ],
        perks: [
          'Mức thu nhập 30 - 50 triệu/tháng + Thưởng tháng 13 & thưởng hiệu quả kinh doanh lên tới 3-5 tháng lương.',
          'Cấp mới MacBook Pro M3 Max và màn hình đồ họa chuyên dụng 4K.',
          'Khuôn viên VNG Campus hiện đại bậc nhất Việt Nam: Phòng gym, hồ bơi, cafeteria miễn phí.'
        ]
      }
    },
    {
      id: 4,
      title: 'Trưởng Nhóm Digital Marketing & Growth Lead',
      company: 'Tập đoàn Công nghiệp - Viễn thông Quân đội (Viettel)',
      logo: 'assets/logos/company-viettel.svg',
      verified: true,
      salaryBadge: '25 - 40 triệu',
      salaryIsOrange: false,
      salaryMin: 25,
      salaryMax: 40,
      location: 'Hà Nội (Cầu Giấy)',
      city: 'Hà Nội',
      category: 'marketing',
      level: 'senior',
      exp: '3-5',
      type: 'fulltime',
      saturday: 'off_sat',
      isFeatured: false,
      isUrgent: false,
      updated: '3 giờ trước',
      aiMatch: 91,
      skills: ['Google Ads', 'Meta Ads', 'SEO', 'Growth Analytics'],
      jd: {
        desc: [
          'Lập kế hoạch và trực tiếp điều hành chiến lược Digital Marketing đa kênh nhằm thúc đẩy tăng trưởng người dùng mới.',
          'Tối ưu ngân sách quảng cáo Performance (Google Ads, Meta Ads, TikTok Ads) với ROI cao.',
          'Phân tích chỉ số phễu chuyển đổi (AARRR) và phối hợp cùng team công nghệ tối ưu hóa tỷ lệ chuyển đổi (CRO).'
        ],
        reqs: [
          'Từ 3 năm kinh nghiệm trong lĩnh vực Digital Marketing, tối thiểu 1 năm giữ vai trò Lead/Manager.',
          'Quản lý thành công ngân sách quảng cáo từ 500 triệu - 2 tỷ đồng/tháng.',
          'Khả năng đọc hiểu dữ liệu phân tích qua Google Analytics 4, Mixpanel, Looker Studio.'
        ],
        perks: [
          'Mức thu nhập 25 - 40 triệu/tháng + Thưởng hoàn thành KPI theo quý và năm.',
          'Môi trường làm việc chuyên nghiệp, cơ hội thăng tiến lên Giám đốc Marketing khối sản phẩm số.',
          'Đầy đủ chế độ phúc lợi doanh nghiệp nhà nước uy tín hàng đầu Việt Nam.'
        ]
      }
    },
    {
      id: 5,
      title: 'Chuyên Viên Quản Lý Chuỗi Cung Ứng & Vận Hành (Logistics)',
      company: 'Shopee Vietnam (SPX Express)',
      logo: 'assets/logos/company-shopee.svg',
      verified: true,
      salaryBadge: '18 - 28 triệu',
      salaryIsOrange: false,
      salaryMin: 18,
      salaryMax: 28,
      location: 'Hồ Chí Minh & Bình Dương',
      city: 'Hồ Chí Minh',
      category: 'logistics',
      level: 'junior',
      exp: '1-3',
      type: 'fulltime',
      saturday: 'work_sat',
      isFeatured: false,
      isUrgent: false,
      updated: 'Hôm nay',
      aiMatch: 90,
      skills: ['Supply Chain', 'Warehouse', '3PL', 'Khai báo Hải quan'],
      jd: {
        desc: [
          'Điều phối quy trình luân chuyển hàng hóa từ trung tâm phân loại tổng đến các kho trung chuyển khu vực.',
          'Theo dõi và đánh giá hiệu quả SLA của các đơn vị vận chuyển đối tác thứ 3 (3PL).',
          'Đề xuất các sáng kiến cải tiến quy trình kho bãi nhằm giảm chi phí vận hành và tăng tốc độ giao hàng chặng cuối.'
        ],
        reqs: [
          'Tốt nghiệp chuyên ngành Logistics, Quản trị Chuỗi cung ứng, Ngoại thương hoặc ngành liên quan.',
          'Từ 1 - 3 năm kinh nghiệm trong ngành thương mại điện tử (E-Commerce) hoặc chuyển phát nhanh.',
          'Kỹ năng Excel nâng cao, kỹ năng giải quyết sự cố phát sinh tại kho bãi.'
        ],
        perks: [
          'Mức lương từ 18 - 28 triệu/tháng, đánh giá tăng lương định kỳ hàng năm.',
          'Xe đưa đón nhân viên từ TP. Hồ Chí Minh đến các trung tâm kho vận Bình Dương.',
          'Voucher mua sắm Shopee độc quyền và gói khám sức khỏe quốc tế.'
        ]
      }
    },
    {
      id: 6,
      title: 'DevOps / Cloud Infrastructure Engineer (AWS / K8s)',
      company: 'Ví điện tử MoMo (M-Service)',
      logo: 'assets/logos/company-momo.svg',
      verified: true,
      salaryBadge: '35 - 60 triệu',
      salaryIsOrange: false,
      salaryMin: 35,
      salaryMax: 60,
      location: 'Toàn quốc (Remote 100%)',
      city: 'Remote',
      category: 'it',
      level: 'senior',
      exp: '3-5',
      type: 'remote',
      saturday: 'off_sat',
      isFeatured: true,
      isUrgent: false,
      updated: 'Hôm nay',
      aiMatch: 97,
      skills: ['Kubernetes', 'AWS', 'Terraform', 'Remote 100%'],
      jd: {
        desc: [
          'Vận hành và mở rộng hạ tầng Cloud Kubernetes chịu tải hàng triệu giao dịch thanh toán mỗi ngày.',
          'Triển khai Infrastructure as Code (IaC) sử dụng Terraform và Ansible trên nền tảng AWS Cloud.',
          'Xây dựng các pipeline CI/CD tự động hóa kiểm thử và triển khai với thời gian downtime bằng 0.'
        ],
        reqs: [
          'Từ 3 - 5 năm kinh nghiệm thực chiến với hệ thống Kubernetes (EKS) và hạ tầng đám mây AWS.',
          'Thành thạo công cụ giám sát Prometheus, Grafana, ELK Stack và quản lý bảo mật mạng.',
          'Kinh nghiệm làm việc hiệu quả trong môi trường làm việc từ xa (Remote 100%).'
        ],
        perks: [
          'Mức lương 35 - 60 triệu/tháng + Gói cổ phiếu thưởng ESOP của MoMo.',
          'Làm việc Remote 100% từ bất kỳ đâu tại Việt Nam, trợ cấp thiết bị làm việc 20 triệu/năm.',
          '18 ngày phép năm + Gói bảo hiểm sức khỏe cao cấp VIP.'
        ]
      }
    },
    {
      id: 7,
      title: 'Senior Java Backend Engineer (Spring Boot / Microservices)',
      company: 'Công ty Cổ phần Giải pháp Thanh toán Việt Nam (VNPAY)',
      logo: 'assets/logos/company-vnpay.svg',
      verified: true,
      salaryBadge: '30 - 55 triệu',
      salaryIsOrange: false,
      salaryMin: 30,
      salaryMax: 55,
      location: 'Hà Nội & Remote',
      city: 'Hà Nội',
      category: 'it',
      level: 'senior',
      exp: '3-5',
      type: 'remote',
      saturday: 'off_sat',
      isFeatured: true,
      isUrgent: true,
      updated: '45 phút trước',
      aiMatch: 96,
      skills: ['Java', 'Spring Boot', 'Microservices', 'Kafka', 'SQL'],
      jd: {
        desc: [
          'Phát triển hệ thống cổng thanh toán điện tử cốt lõi (Core Payment Gateway) đạt chuẩn bảo mật quốc tế PCI-DSS.',
          'Thiết kế và tối ưu kiến trúc Microservices với khả năng xử lý hàng chục nghìn giao dịch mỗi giây (TPS cao).',
          'Tích hợp giải pháp thanh toán với các hệ thống ngân hàng lớn và đối tác thương mại hàng đầu.'
        ],
        reqs: [
          'Tối thiểu 3 - 5 năm kinh nghiệm phát triển phần mềm Backend với Java Core và Spring Boot framework.',
          'Nắm vững kiến trúc Microservices, Kafka, Redis Caching và tối ưu hóa truy vấn SQL trên cơ sở dữ liệu lớn.',
          'Có kinh nghiệm trong các hệ thống tài chính, Fintech, ngân hàng là lợi thế rất lớn.'
        ],
        perks: [
          'Mức thu nhập hấp dẫn từ 30 - 55 triệu/tháng + Thưởng dự án thanh toán dịp Tết cực cao.',
          'Hỗ trợ chế độ làm việc kết hợp linh hoạt tại văn phòng Hà Nội hoặc làm việc từ xa.',
          'Khám sức khỏe tổng quát định kỳ tại các bệnh viện quốc tế hàng đầu (Vinmec, Thu Cúc).'
        ]
      }
    },
    {
      id: 8,
      title: 'Chuyên Viên Kế Toán Tổng Hợp & Quản Trị Thuế',
      company: 'Tập đoàn Vingroup (Vinhomes)',
      logo: 'assets/logos/company-vingroup.svg',
      verified: true,
      salaryBadge: '18 - 28 triệu',
      salaryIsOrange: true,
      salaryMin: 18,
      salaryMax: 28,
      location: 'Hà Nội (Long Biên)',
      city: 'Hà Nội',
      category: 'finance',
      level: 'junior',
      exp: '1-3',
      type: 'fulltime',
      saturday: 'work_sat',
      isFeatured: false,
      isUrgent: false,
      updated: '2 giờ trước',
      aiMatch: 93,
      skills: ['Kế toán tổng hợp', 'Báo cáo tài chính', 'SAP ERP', 'Quyết toán thuế'],
      jd: {
        desc: [
          'Thực hiện hạch toán các nghiệp vụ kinh tế phát sinh, lập báo cáo tài chính hàng quý và báo cáo quản trị định kỳ.',
          'Trực tiếp rà soát số liệu, chuẩn bị hồ sơ quyết toán thuế TNDN, GTGT và TNCN với cơ quan Thuế.',
          'Tham gia chuẩn hóa quy trình thanh toán và vận hành hệ thống phần mềm kế toán SAP ERP.'
        ],
        reqs: [
          'Tốt nghiệp Đại học chuyên ngành Kế toán, Kiểm toán, Tài chính doanh nghiệp.',
          'Từ 2 năm kinh nghiệm ở vị trí Kế toán tổng hợp, ưu tiên ứng viên từng làm việc tại công ty bất động sản hoặc Big4.',
          'Nắm vững chuẩn mực kế toán Việt Nam (VAS) và các quy định pháp luật thuế hiện hành.'
        ],
        perks: [
          'Lương thỏa thuận 18 - 28 triệu/tháng + Thưởng thành tích xuất sắc cuối năm của Tập đoàn.',
          'Ưu đãi đặc quyền khi sử dụng dịch vụ trong hệ sinh thái Vinmec, Vinschool, VinFast.',
          'Cơ hội phát triển lên vị trí Kế toán trưởng chi nhánh công ty con.'
        ]
      }
    },
    {
      id: 9,
      title: 'Nhân Viên Kinh Doanh B2B / Sales IT Solutions (Cloud & Network)',
      company: 'CMC Telecom',
      logo: 'assets/logos/company-cmc.svg',
      verified: true,
      salaryBadge: '16 - 35 triệu',
      salaryIsOrange: true,
      salaryMin: 16,
      salaryMax: 35,
      location: 'Hà Nội & Hồ Chí Minh',
      city: 'Hà Nội',
      category: 'sales',
      level: 'junior',
      exp: '1-3',
      type: 'fulltime',
      saturday: 'work_sat',
      isFeatured: false,
      isUrgent: false,
      updated: 'Hôm nay',
      aiMatch: 89,
      skills: ['Sales B2B', 'Cloud Solutions', 'Đàm phán Hợp đồng', 'Thưởng Doanh số'],
      jd: {
        desc: [
          'Tiếp cận và tư vấn các gói dịch vụ điện toán đám mây (Cloud Server, CDN) và giải pháp truyền dẫn mạng B2B.',
          'Xây dựng mối quan hệ đối tác tin cậy với các doanh nghiệp vừa và lớn, mở rộng mạng lưới khách hàng mới.',
          'Thương thảo hợp đồng, phối hợp cùng đội ngũ kỹ thuật Pre-sales để triển khai giải pháp tối ưu cho khách hàng.'
        ],
        reqs: [
          'Đam mê kinh doanh, tốt nghiệp Đại học/Cao đẳng các ngành Kinh tế, Quản trị hoặc CNTT.',
          'Từ 1 năm kinh nghiệm bán hàng giải pháp B2B, phần mềm SaaS hoặc dịch vụ viễn thông.',
          'Kỹ năng giao tiếp lưu loát, kiên trì và định hướng hoàn thành mục tiêu doanh số cao.'
        ],
        perks: [
          'Lương cơ bản 16 - 20 triệu + Hoa hồng theo doanh số hợp đồng, tổng thu nhập đạt 25 - 40 triệu/tháng.',
          'Được đào tạo bài bản về các sản phẩm công nghệ Cloud hàng đầu từ AWS, Google Cloud và Microsoft.',
          'Môi trường năng động, trẻ trung, nhiều hoạt động teambuilding và du lịch hè hàng năm.'
        ]
      }
    },
    {
      id: 10,
      title: 'Content Marketing Specialist & Copywriter',
      company: 'Base.vn (Nền tảng Quản trị Doanh nghiệp)',
      logo: 'assets/logos/company-basevn.svg',
      verified: true,
      salaryBadge: '15 - 22 triệu',
      salaryIsOrange: false,
      salaryMin: 15,
      salaryMax: 22,
      location: 'Hồ Chí Minh (Quận 3)',
      city: 'Hồ Chí Minh',
      category: 'marketing',
      level: 'junior',
      exp: '1-3',
      type: 'fulltime',
      saturday: 'off_sat',
      isFeatured: false,
      isUrgent: false,
      updated: 'Hôm qua',
      aiMatch: 94,
      skills: ['Content Marketing', 'Copywriting', 'Social Media', 'SEO Content'],
      jd: {
        desc: [
          'Sáng tạo nội dung chất lượng cao cho blog chuyên ngành quản trị doanh nghiệp, ebook, case study khách hàng thành công.',
          'Lên kịch bản nội dung cho các chiến dịch truyền thông đa kênh: Facebook, LinkedIn, Email Marketing.',
          'Phối hợp cùng team SEO để nghiên cứu từ khóa và tối ưu thứ hạng bài viết trên công cụ tìm kiếm.'
        ],
        reqs: [
          'Từ 1 - 3 năm kinh nghiệm làm Content Marketing trong lĩnh vực B2B SaaS hoặc công nghệ.',
          'Văn phong mạch lạc, có tư duy logic sắc sảo và khả năng biến các khái niệm công nghệ thành nội dung dễ hiểu.',
          'Hiểu biết cơ bản về SEO và các công cụ quản lý nội dung số.'
        ],
        perks: [
          'Mức thu nhập 15 - 22 triệu/tháng + Thưởng theo hiệu quả lượt tương tác và chuyển đổi khách hàng.',
          'Làm việc cùng đội ngũ sáng tạo nội dung hàng đầu trong ngành công nghệ B2B tại Việt Nam.',
          'Chế độ ăn trưa miễn phí tại văn phòng, trà cafe và bánh ngọt thoải mái hàng ngày.'
        ]
      }
    },
    {
      id: 11,
      title: 'Mobile Developer (Flutter / React Native)',
      company: 'One Mount Group (Hệ sinh thái VinID & VinShop)',
      logo: 'assets/logos/company-onemount.svg',
      verified: true,
      salaryBadge: '25 - 42 triệu',
      salaryIsOrange: false,
      salaryMin: 25,
      salaryMax: 42,
      location: 'Hà Nội (Hai Bà Trưng)',
      city: 'Hà Nội',
      category: 'it',
      level: 'senior',
      exp: '3-5',
      type: 'fulltime',
      saturday: 'off_sat',
      isFeatured: true,
      isUrgent: true,
      updated: 'Hôm nay',
      aiMatch: 93,
      skills: ['Flutter', 'React Native', 'Dart', 'iOS / Android'],
      jd: {
        desc: [
          'Xây dựng các module tính năng mới cho ứng dụng VinShop phục vụ hàng trăm nghìn cửa hàng tạp hóa trên toàn quốc.',
          'Tối ưu hóa hiệu năng ứng dụng di động, tốc độ render giao diện và mức độ tiêu thụ pin.',
          'Phối hợp với Product Owner và Backend Engineer để thiết kế API chuẩn mực và dễ mở rộng.'
        ],
        reqs: [
          'Từ 3 năm kinh nghiệm phát triển ứng dụng di động với Flutter hoặc React Native.',
          'Nắm vững State Management (BLoC / Redux), kiến trúc Clean Architecture và native bridge (Java/Swift).',
          'Đã từng phát hành ứng dụng lên Google Play Store và Apple App Store.'
        ],
        perks: [
          'Mức lương cạnh tranh 25 - 42 triệu/tháng, chế độ đãi ngộ hàng đầu trong các tập đoàn công nghệ lớn.',
          'Văn phòng hạng A Times City hiện đại với khu giải trí và thư viện sách phong phú.',
          'Cấp máy tính MacBook Pro và điện thoại thử nghiệm sản phẩm đời mới.'
        ]
      }
    },
    {
      id: 12,
      title: 'QA / QC Automation Test Engineer (Selenium & CI/CD)',
      company: 'KMS Technology Vietnam',
      logo: 'assets/logos/company-kms.svg',
      verified: true,
      salaryBadge: '20 - 36 triệu',
      salaryIsOrange: false,
      salaryMin: 20,
      salaryMax: 36,
      location: 'Đà Nẵng & Remote',
      city: 'Đà Nẵng',
      category: 'it',
      level: 'junior',
      exp: '1-3',
      type: 'remote',
      saturday: 'off_sat',
      isFeatured: false,
      isUrgent: false,
      updated: '3 giờ trước',
      aiMatch: 95,
      skills: ['Automation Test', 'Selenium', 'Postman', 'CI/CD', 'QA QC'],
      jd: {
        desc: [
          'Thiết kế và xây dựng kịch bản kiểm thử tự động hóa (Automation Testing) cho các hệ thống phần mềm quốc tế.',
          'Tích hợp bộ test automation vào hệ thống CI/CD pipeline (GitLab CI, Jenkins).',
          'Thực hiện kiểm thử tải (Performance Testing) và bảo mật ứng dụng cơ bản.'
        ],
        reqs: [
          'Từ 2 năm kinh nghiệm làm việc ở vị trí Automation Tester, thành thạo Selenium WebDriver, Playwright hoặc Cypress.',
          'Kỹ năng lập trình tốt với một trong các ngôn ngữ: Java, JavaScript hoặc Python.',
          'Tiếng Anh giao tiếp và viết email kỹ thuật thành thạo.'
        ],
        perks: [
          'Thu nhập 20 - 36 triệu/tháng + Thưởng dự án và chứng chỉ quốc tế (ISTQB).',
          'Lựa chọn làm việc Remote hoặc tại văn phòng Đà Nẵng view biển thoáng đãng.',
          'Cơ hội đi công tác và làm việc trực tiếp tại trụ sở khách hàng tại Mỹ.'
        ]
      }
    },
    {
      id: 13,
      title: 'Thực Tập Sinh Lập Trình Frontend (Intern / Fresher Web Developer)',
      company: 'FPT Software Academy',
      logo: 'assets/logos/company-fpt.svg',
      verified: true,
      salaryBadge: '6 - 10 triệu',
      salaryIsOrange: false,
      salaryMin: 6,
      salaryMax: 10,
      location: 'Đà Nẵng & Remote',
      city: 'Đà Nẵng',
      category: 'it',
      level: 'intern',
      exp: '0',
      type: 'hybrid',
      saturday: 'off_sat',
      isFeatured: false,
      isUrgent: false,
      updated: 'Hôm nay',
      aiMatch: 88,
      skills: ['HTML/CSS', 'JavaScript', 'React cơ bản', 'Git'],
      jd: {
        desc: [
          'Tham gia chương trình đào tạo chuyên sâu Frontend có trợ cấp hàng tháng từ FPT Software.',
          'Được các Senior Mentor hướng dẫn trực tiếp xây dựng ứng dụng web theo chuẩn doanh nghiệp quốc tế.',
          'Được ký hợp đồng nhân viên chính thức ngay sau khi kết thúc 3 tháng thực tập.'
        ],
        reqs: [
          'Sinh viên năm cuối hoặc mới tốt nghiệp chuyên ngành CNTT, Khoa học máy tính hoặc tương đương.',
          'Nắm chắc nền tảng HTML5, CSS3, JavaScript ES6 và có hiểu biết cơ bản về ReactJS.',
          'Tinh thần ham học hỏi, cầu tiến và có thái độ trách nhiệm cao với công việc.'
        ],
        perks: [
          'Trợ cấp thực tập hàng tháng từ 6 - 10 triệu/tháng.',
          'Đào tạo bài bản theo lộ trình chuẩn quốc tế, cấp chứng chỉ hoàn thành.',
          'Cơ hội chuyển lên vị trí Junior Software Engineer với mức lương từ 15 triệu/tháng.'
        ]
      }
    },
    {
      id: 14,
      title: 'Chuyên Viên Tuyển Dụng & Đào Tạo Nhân Sự (HR Executive)',
      company: 'Tiki Corporation',
      logo: 'assets/logos/company-tiki.svg',
      verified: true,
      salaryBadge: '14 - 20 triệu',
      salaryIsOrange: false,
      salaryMin: 14,
      salaryMax: 20,
      location: 'Hồ Chí Minh (Tân Bình)',
      city: 'Hồ Chí Minh',
      category: 'hr',
      level: 'junior',
      exp: '1-3',
      type: 'fulltime',
      saturday: 'unmentioned',
      isFeatured: false,
      isUrgent: false,
      updated: '2 ngày trước',
      aiMatch: 91,
      skills: ['Talent Acquisition', 'Phỏng vấn', 'Đào tạo nội bộ', 'Luật lao động'],
      jd: {
        desc: [
          'Chịu trách nhiệm toàn bộ quy trình tuyển dụng các vị trí khối công nghệ và khối vận hành thương mại điện tử.',
          'Tìm kiếm, sàng lọc hồ sơ ứng viên và trực tiếp tiến hành phỏng vấn vòng 1.',
          'Phối hợp tổ chức các chương trình Onboarding và đào tạo hội nhập cho nhân viên mới.'
        ],
        reqs: [
          'Tốt nghiệp Đại học ngành Quản trị Nhân sự, Luật, Ngoại ngữ hoặc ngành liên quan.',
          'Từ 1 - 3 năm kinh nghiệm tuyển dụng (Headhunt hoặc Internal HR), hiểu biết thị trường tuyển dụng công nghệ.',
          'Kỹ năng lắng nghe, đánh giá con người và giao tiếp tích cực.'
        ],
        perks: [
          'Mức lương từ 14 - 20 triệu/tháng + Thưởng tuyển dụng theo quý.',
          'Môi trường làm việc thương mại điện tử năng động, khuyến khích sáng tạo và đổi mới.',
          'Bảo hiểm sức khỏe toàn diện và phụ cấp ăn trưa hàng tháng.'
        ]
      }
    },
    {
      id: 15,
      title: 'Trưởng Phòng Kinh Doanh Toàn Quốc (Sales Director)',
      company: 'Tập đoàn Masan (Masan Consumer)',
      logo: 'assets/logos/company-masan.svg',
      verified: true,
      salaryBadge: '55 - 80 triệu',
      salaryIsOrange: false,
      salaryMin: 55,
      salaryMax: 80,
      location: 'Hồ Chí Minh & Hà Nội',
      city: 'Hồ Chí Minh',
      category: 'sales',
      level: 'manager',
      exp: 'over5',
      type: 'fulltime',
      saturday: 'work_sat',
      isFeatured: true,
      isUrgent: false,
      updated: 'Hôm nay',
      aiMatch: 95,
      skills: ['Chiến lược kinh doanh', 'Quản lý đội ngũ', 'Kênh phân phối FMCG', 'P&L Management'],
      jd: {
        desc: [
          'Chịu trách nhiệm toàn diện về mục tiêu doanh thu và phát triển kênh phân phối hàng tiêu dùng nhanh (FMCG) trên toàn quốc.',
          'Quản lý, đào tạo và phát triển đội ngũ Giám đốc bán hàng vùng (RSM) và Trưởng phòng kinh doanh khu vực.',
          'Tối ưu hóa chi phí thương mại, quản lý ngân sách khuyến mãi và xây dựng chiến lược mở rộng thị phần.'
        ],
        reqs: [
          'Tối thiểu 5 năm kinh nghiệm quản lý cấp cao trong ngành FMCG hoặc bán lẻ quy mô lớn.',
          'Khả năng quản trị P&L xuất sắc, tầm nhìn chiến lược kinh doanh và tài năng lãnh đạo đội ngũ quy mô hàng trăm nhân sự.',
          'Sẵn sàng đi công tác các thị trường trọng điểm trong và ngoài nước.'
        ],
        perks: [
          'Mức thu nhập từ 55 - 80 triệu/tháng + Thưởng doanh số năm cực lớn theo kết quả kinh doanh tập đoàn.',
          'Cấp xe đưa đón riêng và trợ cấp công tác phí cao cấp.',
          'Chương trình bảo hiểm sức khỏe VIP toàn cầu cho cả gia đình.'
        ]
      }
    },
    {
      id: 16,
      title: 'Fresher Java Web Developer (Spring Boot / MySQL)',
      company: 'NashTech Vietnam',
      logo: 'assets/logos/company-nashtech.svg',
      verified: true,
      salaryBadge: '10 - 15 triệu',
      salaryIsOrange: false,
      salaryMin: 10,
      salaryMax: 15,
      location: 'Hà Nội (Cầu Giấy)',
      city: 'Hà Nội',
      category: 'it',
      level: 'junior',
      exp: 'under1',
      type: 'fulltime',
      saturday: 'off_sat',
      isFeatured: false,
      isUrgent: false,
      updated: 'Hôm qua',
      aiMatch: 90,
      skills: ['Java Core', 'Spring Boot', 'MySQL', 'OOP'],
      jd: {
        desc: [
          'Tham gia dự án gia công phần mềm cho khách hàng quốc tế thị trường châu Âu và Úc.',
          'Phát triển các module xử lý nghiệp vụ với Java Spring Boot dưới sự hướng dẫn của Tech Lead.',
          'Viết Unit Test và tài liệu kỹ thuật cho các API được giao phụ trách.'
        ],
        reqs: [
          'Dưới 1 năm kinh nghiệm hoặc sinh viên mới tốt nghiệp đã từng có project Java Spring Boot trên GitHub.',
          'Nắm vững lập trình hướng đối tượng (OOP), cấu trúc dữ liệu và giải thuật, cơ sở dữ liệu quan hệ MySQL.',
          'Tiếng Anh đọc viết tài liệu tốt, có tinh thần cầu thị và ham học hỏi.'
        ],
        perks: [
          'Lương khởi điểm hấp dẫn từ 10 - 15 triệu/tháng, xét tăng lương 2 lần/năm.',
          'Được tham gia các khóa học tiếng Anh kỹ thuật và chứng chỉ Java quốc tế miễn phí.',
          'Thời gian làm việc từ Thứ 2 đến Thứ 6, nghỉ trọn vẹn Thứ 7 và Chủ Nhật.'
        ]
      }
    },
    {
      id: 17,
      title: 'Kỹ Sư Trí Tuệ Nhân Tạo & Học Máy (AI / Machine Learning Engineer)',
      company: 'VinAI Research (Tập đoàn Vingroup)',
      logo: 'assets/logos/company-vinai.svg',
      verified: true,
      salaryBadge: '40 - 75 triệu',
      salaryIsOrange: false,
      salaryMin: 40,
      salaryMax: 75,
      location: 'Hà Nội (Nam Từ Liêm)',
      city: 'Hà Nội',
      category: 'it',
      level: 'senior',
      exp: '3-5',
      type: 'hybrid',
      saturday: 'off_sat',
      isFeatured: true,
      isUrgent: true,
      updated: '15 phút trước',
      aiMatch: 96,
      skills: ['PyTorch', 'LLMs & GenAI', 'Computer Vision', 'Deep Learning'],
      jd: {
        desc: [
          'Nghiên cứu, phát triển và tối ưu hóa các mô hình Generative AI và thị giác máy tính thế hệ mới phục vụ hệ sinh thái xe điện thông minh.',
          'Huấn luyện và fine-tune các mô hình mã nguồn mở (LLMs) trên cụm siêu máy tính NVIDIA DGX SuperPOD.',
          'Triển khai mô hình AI trên thiết bị nhúng Edge Computing với độ trễ thấp và độ chính xác cao.'
        ],
        reqs: [
          'Tốt nghiệp Đại học/Thạc sĩ chuyên ngành Khoa học Máy tính, Trí tuệ Nhân tạo hoặc Toán Tin.',
          'Tối thiểu 3 năm kinh nghiệm nghiên cứu và triển khai Deep Learning với PyTorch/TensorFlow.',
          'Có công bố khoa học tại các hội nghị AI hàng đầu (CVPR, NeurIPS, ICCV) là lợi thế lớn.'
        ],
        perks: [
          'Mức lương từ 40 - 75 triệu/tháng + Gói thưởng dự án và cổ phiếu VinFast.',
          'Làm việc trực tiếp cùng các nhà khoa học AI hàng đầu thế giới.',
          'Chế độ Hybrid linh hoạt 2 ngày WFH/tuần + Bảo hiểm sức khỏe VIP toàn diện.'
        ]
      }
    },
    {
      id: 18,
      title: 'Chuyên Viên Phân Tích Dữ Liệu Kinh Doanh (Senior Data Analyst)',
      company: 'Ngân hàng TMCP Quân Đội (MB Bank)',
      logo: 'assets/logos/company-mbbank.svg',
      verified: true,
      salaryBadge: '25 - 42 triệu',
      salaryIsOrange: false,
      salaryMin: 25,
      salaryMax: 42,
      location: 'Hà Nội (Cầu Giấy)',
      city: 'Hà Nội',
      category: 'it',
      level: 'senior',
      exp: '3-5',
      type: 'hybrid',
      saturday: 'off_sat',
      isFeatured: false,
      isUrgent: false,
      updated: '40 phút trước',
      aiMatch: 94,
      skills: ['SQL Nâng cao', 'Power BI', 'Python', 'Phân tích định lượng'],
      jd: {
        desc: [
          'Xây dựng các Dashboard quản trị thông minh theo thời gian thực phục vụ khối Khách hàng cá nhân và Ngân hàng số MBBank.',
          'Phân tích hành vi chi tiêu của khách hàng, phân khúc thị trường và dự báo xu hướng sản phẩm tín dụng tiêu dùng.',
          'Hợp tác chặt chẽ cùng Product Owner để đưa ra các đề xuất tối ưu hóa hành trình khách hàng dựa trên dữ liệu.'
        ],
        reqs: [
          'Từ 3 năm kinh nghiệm ở vị trí Data Analyst trong ngành Ngân hàng, Fintech hoặc Thương mại điện tử.',
          'Thành thạo SQL nâng cao, Python/R, các công cụ trực quan hóa dữ liệu như Power BI hoặc Tableau.',
          'Tư duy logic sắc bén, kỹ năng phản biện và khả năng kể chuyện bằng dữ liệu (Data Storytelling).'
        ],
        perks: [
          'Thu nhập từ 25 - 42 triệu/tháng + Thưởng hiệu quả kinh doanh ngân hàng định kỳ 4-6 tháng lương/năm.',
          'Chế độ ưu đãi lãi suất vay và hạn mức thẻ tín dụng nội bộ đặc quyền dành cho cán bộ MB.',
          'Cơ hội đào tạo chứng chỉ quốc tế CFA/FRM/Data Science do ngân hàng tài trợ 100% học phí.'
        ]
      }
    },
    {
      id: 19,
      title: 'Trưởng Phòng Nhân Sự Tổng Hợp (HR Manager / HRBP)',
      company: 'Công ty Cổ phần Sữa Việt Nam (Vinamilk)',
      logo: 'assets/logos/company-vinamilk.svg',
      verified: true,
      salaryBadge: '35 - 55 triệu',
      salaryIsOrange: true,
      salaryMin: 35,
      salaryMax: 55,
      location: 'Hồ Chí Minh (Quận 7)',
      city: 'Hồ Chí Minh',
      category: 'hr',
      level: 'manager',
      exp: 'over5',
      type: 'fulltime',
      saturday: 'unmentioned',
      isFeatured: true,
      isUrgent: false,
      updated: '1 giờ trước',
      aiMatch: 93,
      skills: ['HRBP', 'C&B', 'Phát triển Nhân tài', 'Văn hóa Doanh nghiệp'],
      jd: {
        desc: [
          'Đóng vai trò Đối tác Nhân sự Chiến lược (HRBP) đồng hành cùng các khối kinh doanh và vận hành nhà máy Vinamilk.',
          'Quy hoạch và phát triển đội ngũ kế thừa, xây dựng chính sách đãi ngộ tổng thể (Total Rewards) cạnh tranh trên thị trường.',
          'Dẫn dắt các chương trình gắn kết nhân viên, văn hóa đổi mới và nâng cao chỉ số hạnh phúc nơi làm việc.'
        ],
        reqs: [
          'Tối thiểu 5 năm kinh nghiệm quản lý nhân sự tại các tập đoàn FMCG hoặc doanh nghiệp sản xuất quy mô trên 1.000 người.',
          'Am hiểu sâu sắc Luật Lao động Việt Nam, hệ thống lương 3P và phương pháp đánh giá hiệu suất OKRs/KPIs.',
          'Kỹ năng lãnh đạo, thấu hiểu con người và giải quyết xung đột tổ chức xuất sắc.'
        ],
        perks: [
          'Lương từ 35 - 55 triệu/tháng + Thưởng doanh thu tập đoàn Vinamilk hàng năm.',
          'Cung cấp sữa tươi và các sản phẩm dinh dưỡng miễn phí mỗi ngày tại văn phòng.',
          'Môi trường làm việc Top 1 Nhà tuyển dụng được yêu thích nhất Việt Nam.'
        ]
      }
    },
    {
      id: 20,
      title: 'Kỹ Sư Lập Trình Nhúng & IoT (Embedded Software Engineer)',
      company: 'Bosch Global Software Technologies (Bosch Việt Nam)',
      logo: 'assets/logos/company-bosch.svg',
      verified: true,
      salaryBadge: '22 - 38 triệu',
      salaryIsOrange: false,
      salaryMin: 22,
      salaryMax: 38,
      location: 'Hồ Chí Minh & Đà Nẵng',
      city: 'Hồ Chí Minh',
      category: 'it',
      level: 'junior',
      exp: '1-3',
      type: 'fulltime',
      saturday: 'off_sat',
      isFeatured: false,
      isUrgent: true,
      updated: '2 giờ trước',
      aiMatch: 91,
      skills: ['C/C++', 'Microcontroller', 'RTOS', 'CAN/LIN Protocols'],
      jd: {
        desc: [
          'Phát triển phần mềm nhúng điều khiển hệ thống an toàn xe hơi (ESP, ABS, túi khí) cho các hãng xe danh tiếng toàn cầu.',
          'Lập trình firmware vi điều khiển 32-bit (ARM Cortex-M/R) trên hệ điều hành thời gian thực FreeRTOS/AUTOSAR.',
          'Viết kịch bản kiểm thử phần cứng HIL (Hardware-in-the-Loop) và phân tích tín hiệu giao tiếp CAN/LIN.'
        ],
        reqs: [
          'Tốt nghiệp Đại học ngành Điện tử Viễn thông, Cơ điện tử, Kỹ thuật Máy tính hoặc liên quan.',
          'Từ 1 - 3 năm kinh nghiệm lập trình C/C++ cho hệ thống nhúng và giao tiếp ngoại vi (SPI, I2C, UART, CAN).',
          'Tiếng Anh giao tiếp tốt trong môi trường dự án quốc tế đa quốc gia Đức - Nhật - Việt.'
        ],
        perks: [
          'Mức thu nhập từ 22 - 38 triệu/tháng + Thưởng hiệu suất dự án theo quý.',
          'Cơ hội onsite tu nghiệp và chuyển giao công nghệ tại Đức, Nhật Bản và Ấn Độ.',
          'Gói bảo hiểm chăm sóc sức khỏe quốc tế cao cấp và 16 ngày phép hưởng lương/năm.'
        ]
      }
    },
    {
      id: 21,
      title: 'Giám Đốc Thương Hiệu Sản Phẩm Cao Cấp (Brand Manager)',
      company: 'Unilever Việt Nam',
      logo: 'assets/logos/company-unilever.svg',
      verified: true,
      salaryBadge: '45 - 65 triệu',
      salaryIsOrange: true,
      salaryMin: 45,
      salaryMax: 65,
      location: 'Hồ Chí Minh (Quận 7)',
      city: 'Hồ Chí Minh',
      category: 'marketing',
      level: 'manager',
      exp: 'over5',
      type: 'fulltime',
      saturday: 'off_sat',
      isFeatured: true,
      isUrgent: false,
      updated: '2 giờ trước',
      aiMatch: 95,
      skills: ['Brand Strategy', 'FMCG Marketing', 'IMC Campaigns', 'P&L Management'],
      jd: {
        desc: [
          'Định hình chiến lược phát triển dài hạn, định vị thương hiệu và quản lý toàn diện P&L của ngành hàng chăm sóc sắc đẹp cao cấp.',
          'Dẫn dắt các chiến dịch truyền thông tích hợp đa kênh (IMC 360) kết hợp giữa truyền thông đại chúng và tiếp thị số hiện đại.',
          'Phân tích xu hướng tiêu dùng của thế hệ Gen Z & Alpha để liên tục đổi mới danh mục sản phẩm (NPD).'
        ],
        reqs: [
          'Tối thiểu 5 năm kinh nghiệm Brand Marketing trong ngành FMCG hoặc Mỹ phẩm cao cấp quốc tế.',
          'Thành tích dẫn dắt thành công các chiến dịch marketing đạt giải thưởng lớn trong nước và khu vực.',
          'Tư duy chiến lược kinh doanh nhạy bén, khả năng quản trị ngân sách tiếp thị quy mô hàng chục tỷ đồng.'
        ],
        perks: [
          'Thu nhập từ 45 - 65 triệu/tháng + Thưởng hiệu quả kinh doanh năm theo tiêu chuẩn tập đoàn đa quốc gia.',
          'Chính sách làm việc kết hợp linh hoạt Hybrid tại Unilever Homebase hiện đại bậc nhất Phú Mỹ Hưng.',
          'Chương trình đào tạo lãnh đạo toàn cầu và cơ hội luân chuyển công tác tại các trụ sở Unilever Châu Á.'
        ]
      }
    },
    {
      id: 22,
      title: 'Chuyên Viên Quản Trị Rủi Ro Tài Chính & Đầu Tư (Risk Management)',
      company: 'Ngân Hàng TMCP Việt Nam Thịnh Vượng (VPBank)',
      logo: 'assets/logos/company-vpbank.svg',
      verified: true,
      salaryBadge: '22 - 38 triệu',
      salaryIsOrange: false,
      salaryMin: 22,
      salaryMax: 38,
      location: 'Hà Nội (Ba Đình)',
      city: 'Hà Nội',
      category: 'finance',
      level: 'junior',
      exp: '1-3',
      type: 'fulltime',
      saturday: 'unmentioned',
      isFeatured: false,
      isUrgent: false,
      updated: '3 giờ trước',
      aiMatch: 92,
      skills: ['Quản trị rủi ro', 'Phân tích tín dụng', 'Mô hình hóa tài chính', 'Basel II/III'],
      jd: {
        desc: [
          'Xây dựng và kiểm chuẩn các mô hình định lượng đo lường rủi ro tín dụng, rủi ro thị trường và rủi ro thanh khoản theo chuẩn Basel.',
          'Thẩm định độc lập các dự án đầu tư lớn và danh mục cấp tín dụng của khối khách hàng doanh nghiệp quy mô vừa và lớn.',
          'Theo dõi các chỉ số cảnh báo sớm (EWS), đề xuất các biện pháp phòng ngừa tổn thất tài chính cho ngân hàng.'
        ],
        reqs: [
          'Tốt nghiệp Đại học chuyên ngành Tài chính - Ngân hàng, Toán Kinh tế, Kiểm toán hoặc Kinh tế Đối ngoại.',
          'Từ 1 - 3 năm kinh nghiệm trong lĩnh vực quản trị rủi ro tín dụng/thị trường tại các tổ chức tín dụng hoặc Big 4.',
          'Hiểu biết sâu sắc về các quy định của Ngân hàng Nhà nước và các chuẩn mực quản trị rủi ro quốc tế.'
        ],
        perks: [
          'Lương từ 22 - 38 triệu/tháng + Thưởng thành tích cá nhân và thưởng kết quả kinh doanh ngân hàng.',
          'Làm việc tại trụ sở VPBank Tower biểu tượng đường Láng Hạ với tiện ích nội bộ cao cấp.',
          'Chế độ bảo hiểm sức khỏe VIP VPBank Care bảo lãnh viện phí tại tất cả các bệnh viện quốc tế.'
        ]
      }
    },
    {
      id: 23,
      title: 'Chuyên Viên Điều Phối Vận Tải Quốc Tế & Forwarding (Freight Forwarding)',
      company: 'Công ty Cổ phần Gemadept (Gemadept Logistics)',
      logo: 'assets/logos/company-gemadept.svg',
      verified: true,
      salaryBadge: '16 - 26 triệu',
      salaryIsOrange: false,
      salaryMin: 16,
      salaryMax: 26,
      location: 'Hải Phòng & Hồ Chí Minh',
      city: 'Hồ Chí Minh',
      category: 'logistics',
      level: 'junior',
      exp: '1-3',
      type: 'fulltime',
      saturday: 'work_sat',
      isFeatured: false,
      isUrgent: true,
      updated: '4 giờ trước',
      aiMatch: 90,
      skills: ['Freight Forwarding', 'Vận tải đường biển', 'Incoterms 2020', 'Tiếng Anh thương mại'],
      jd: {
        desc: [
          'Lên kế hoạch và điều phối các lô hàng xuất nhập khẩu đường biển (FCL/LCL) và đường hàng không quốc tế.',
          'Làm việc với các hãng tàu quốc tế, đối tác đại lý nước ngoài để đàm phán cước tàu (Ocean Freight) cạnh tranh nhất.',
          'Phát hành chứng từ vận tải (B/L, AWB, C/O), theo dõi sát sao tiến độ giao hàng và xử lý phát sinh tại cảng biển.'
        ],
        reqs: [
          'Từ 1 - 3 năm kinh nghiệm vị trí Ops hoặc Docs tại các công ty Forwarder hoặc Logistics quốc tế.',
          'Nắm vững quy tắc thương mại quốc tế Incoterms 2020, quy trình hải quan và chứng từ vận tải đường biển.',
          'Tiếng Anh thương mại lưu loát trong giao tiếp email và đàm phán với đại lý quốc tế.'
        ],
        perks: [
          'Lương từ 16 - 26 triệu/tháng + Thưởng hoa hồng theo sản lượng volume hàng tháng.',
          'Được làm việc tại một trong những tập đoàn khai thác cảng và logistics hàng đầu Việt Nam.',
          'Phụ cấp ăn trưa, công tác phí cảng và du lịch nghỉ dưỡng định kỳ hàng năm.'
        ]
      }
    },
    {
      id: 24,
      title: 'Kỹ Sư An Toàn Thông Tin & An Ninh Mạng (SOC / Cyber Security Analyst)',
      company: 'Tập đoàn Bưu chính Viễn thông Việt Nam (VNPT Cyber Immune)',
      logo: 'assets/logos/company-vnpt.svg',
      verified: true,
      salaryBadge: '25 - 45 triệu',
      salaryIsOrange: false,
      salaryMin: 25,
      salaryMax: 45,
      location: 'Hà Nội (Cầu Giấy)',
      city: 'Hà Nội',
      category: 'it',
      level: 'senior',
      exp: '3-5',
      type: 'hybrid',
      saturday: 'off_sat',
      isFeatured: true,
      isUrgent: true,
      updated: '30 phút trước',
      aiMatch: 94,
      skills: ['SIEM / SOC', 'Penetration Testing', 'Threat Intelligence', 'Bảo mật mạng'],
      jd: {
        desc: [
          'Giám sát, phân tích và phản ứng nhanh với các cuộc tấn công mạng nhằm vào hạ tầng trọng yếu quốc gia và khách hàng doanh nghiệp.',
          'Vận hành các nền tảng SIEM, SOAR, EDR hiện đại và thực hiện điều tra số (Digital Forensics) đối với các sự cố an ninh.',
          'Thực hiện đánh giá lỗ hổng bảo mật định kỳ (Vulnerability Assessment & Pentest) cho các ứng dụng web và mobile banking.'
        ],
        reqs: [
          'Từ 3 - 5 năm kinh nghiệm thực chiến trong lĩnh vực An toàn thông tin hoặc kỹ sư SOC Tier 2/3.',
          'Sở hữu các chứng chỉ bảo mật quốc tế uy tín như CEH, CISSP, OSCP, CompTIA Security+ là điểm cộng lớn.',
          'Nắm vững kiến trúc mạng, giao thức TCP/IP và kỹ thuật phân tích mã độc cơ bản.'
        ],
        perks: [
          'Mức thu nhập từ 25 - 45 triệu/tháng + Thưởng thành tích phòng chống sự cố an ninh mạng.',
          'Cơ hội tiếp cận các dự án an ninh mạng cấp quốc gia với công nghệ bảo mật tối tân nhất.',
          'Tài trợ 100% chi phí thi các chứng chỉ bảo mật quốc tế chuyên sâu hàng năm.'
        ]
      }
    },
    {
      id: 25,
      title: 'Giám Đốc Sản Phẩm Công Nghệ (Head of Product / Lead PM)',
      company: 'Công ty Cổ phần Tiki (Tiki Tech Hub)',
      logo: 'assets/logos/company-tiki.svg',
      verified: true,
      salaryBadge: '50 - 75 triệu',
      salaryIsOrange: true,
      salaryMin: 50,
      salaryMax: 75,
      location: 'Hồ Chí Minh & Remote',
      city: 'Hồ Chí Minh',
      category: 'it',
      level: 'manager',
      exp: 'over5',
      type: 'hybrid',
      saturday: 'off_sat',
      isFeatured: true,
      isUrgent: false,
      updated: '1 giờ trước',
      aiMatch: 97,
      skills: ['Product Roadmapping', 'User Centric Design', 'Agile/Scrum', 'Data-driven Growth'],
      jd: {
        desc: [
          'Chịu trách nhiệm kiến tạo tầm nhìn sản phẩm, chiến lược công nghệ và roadmap phát triển cho sàn thương mại điện tử Tiki.',
          'Lãnh đạo đội ngũ Product Managers, Product Designers và phối hợp cùng Tech Leads để hiện thực hóa các tính năng bứt phá.',
          'Tối ưu hóa các chỉ số trải nghiệm mua sắm cốt lõi: Conversion Rate, Retargeting, NPS và thời gian xử lý đơn hàng.'
        ],
        reqs: [
          'Tối thiểu 5 năm kinh nghiệm làm Product Management, trong đó có ít nhất 2 năm dẫn dắt đội ngũ tại các công ty E-Commerce/Fintech.',
          'Tư duy chiến lược sản phẩm xuất sắc, khả năng cân bằng giữa nhu cầu người dùng và mục tiêu lợi nhuận của doanh nghiệp.',
          'Khả năng giao tiếp, truyền cảm hứng và dẫn dắt thay đổi trong môi trường công nghệ tốc độ cao.'
        ],
        perks: [
          'Thu nhập từ 50 - 75 triệu/tháng + Gói quyền mua cổ phiếu ESOP giá trị cao.',
          'Chế độ làm việc linh hoạt kết hợp Hybrid, hỗ trợ công cụ thiết bị công nghệ hiện đại.',
          'Gói bảo hiểm sức khỏe VIP toàn cầu cho bản thân và người thân trong gia đình.'
        ]
      }
    },
    {
      id: 26,
      title: 'Chuyên Viên Tư Vấn Giải Pháp ERP & Chuyển Đổi Số (ERP Consultant)',
      company: 'FPT Digital (Tập đoàn FPT)',
      logo: 'assets/logos/company-fpt.svg',
      verified: true,
      salaryBadge: '20 - 35 triệu',
      salaryIsOrange: false,
      salaryMin: 20,
      salaryMax: 35,
      location: 'Hà Nội & Đà Nẵng',
      city: 'Hà Nội',
      category: 'it',
      level: 'junior',
      exp: '1-3',
      type: 'fulltime',
      saturday: 'off_sat',
      isFeatured: false,
      isUrgent: false,
      updated: '5 giờ trước',
      aiMatch: 91,
      skills: ['SAP S/4HANA', 'Oracle Cloud', 'Quy trình Doanh nghiệp', 'Tư vấn Chuyển đổi số'],
      jd: {
        desc: [
          'Khảo sát hiện trạng quy trình nghiệp vụ và tư vấn giải pháp triển khai hệ thống ERP (SAP S/4HANA, Oracle) cho các tập đoàn lớn.',
          'Xây dựng tài liệu thiết kế giải pháp tổng thể (Blueprint) và cấu hình các phân hệ nghiệp vụ chuyên sâu.',
          'Đào tạo người dùng cuối (Key Users) và hỗ trợ vận hành trong giai đoạn Go-Live của dự án.'
        ],
        reqs: [
          'Từ 1 - 3 năm kinh nghiệm tham gia triển khai các dự án ERP (SAP, Oracle, Microsoft Dynamics).',
          'Hiểu biết sâu sắc về quy trình tài chính kế toán, quản lý chuỗi cung ứng hoặc sản xuất trong doanh nghiệp.',
          'Kỹ năng thuyết trình, giao tiếp tự tin và khả năng giải quyết vấn đề hiệu quả.'
        ],
        perks: [
          'Mức lương từ 20 - 35 triệu/tháng + Thưởng dự án theo từng giai đoạn nghiệm thu.',
          'Được đào tạo và tài trợ thi các chứng chỉ quốc tế SAP/Oracle Certified Consultant.',
          'Môi trường làm việc năng động tại FPT Tower với cơ hội học hỏi từ các chuyên gia đầu ngành.'
        ]
      }
    },
    {
      id: 27,
      title: 'Trưởng Nhóm Thiết Kế Truyền Thông Đa Phương Tiện (Creative Lead)',
      company: 'Dentsu Creative Vietnam',
      logo: 'assets/logos/company-dentsu.svg',
      verified: true,
      salaryBadge: '28 - 45 triệu',
      salaryIsOrange: false,
      salaryMin: 28,
      salaryMax: 45,
      location: 'Hồ Chí Minh (Quận 1)',
      city: 'Hồ Chí Minh',
      category: 'marketing',
      level: 'senior',
      exp: '3-5',
      type: 'fulltime',
      saturday: 'work_sat',
      isFeatured: false,
      isUrgent: true,
      updated: 'Hôm nay',
      aiMatch: 93,
      skills: ['Creative Direction', 'Motion Graphic', 'Branding', 'Adobe Creative Suite'],
      jd: {
        desc: [
          'Định hướng thẩm mỹ thị giác và trực tiếp chỉ đạo sáng tạo các chiến dịch quảng cáo cho các nhãn hàng quốc tế hàng đầu.',
          'Dẫn dắt đội ngũ Art Directors, Graphic Designers và Motion Artists để tạo ra các sản phẩm hình ảnh ấn tượng và giàu cảm xúc.',
          'Phối hợp cùng bộ phận Chiến lược (Planning) để phát triển Concept sáng tạo cho các buổi Pitching dự án lớn.'
        ],
        reqs: [
          'Từ 3 - 5 năm kinh nghiệm trong ngành Quảng cáo sáng tạo (Creative Agency) tại vị trí Senior Art Director hoặc Creative Lead.',
          'Portfolio thể hiện đa dạng các dự án xuất sắc về Key Visual, TVC Storyboard, Digital & Motion Graphics.',
          'Khả năng thuyết trình ý tưởng truyền cảm hứng và tinh thần làm việc nhóm nhiệt huyết.'
        ],
        perks: [
          'Thu nhập từ 28 - 45 triệu/tháng + Thưởng hiệu quả chiến dịch và thưởng dự án thắng Pitch.',
          'Văn phòng hiện đại view sông Sài Gòn trung tâm Quận 1, trang bị đầy đủ máy Mac Studio chuyên dụng.',
          'Chính sách bảo hiểm sức khỏe VIP và các hoạt động teambuilding sáng tạo định kỳ.'
        ]
      }
    },
    {
      id: 28,
      title: 'Kế Toán Trưởng Doanh Nghiệp Sản Xuất & Xây Dựng (Chief Accountant)',
      company: 'Tập đoàn Tân Á Đại Thành',
      logo: 'assets/logos/company-tanadaithanh.svg',
      verified: true,
      salaryBadge: '35 - 50 triệu',
      salaryIsOrange: true,
      salaryMin: 35,
      salaryMax: 50,
      location: 'Hà Nội & Hưng Yên',
      city: 'Hà Nội',
      category: 'finance',
      level: 'manager',
      exp: 'over5',
      type: 'fulltime',
      saturday: 'work_sat',
      isFeatured: true,
      isUrgent: false,
      updated: 'Hôm nay',
      aiMatch: 94,
      skills: ['Kế toán trưởng', 'Giá thành sản xuất', 'Quyết toán thuế', 'Quản trị dòng tiền'],
      jd: {
        desc: [
          'Tổ chức, điều hành toàn bộ công tác kế toán, thống kê và quản trị tài chính tại các nhà máy sản xuất của tập đoàn.',
          'Kiểm soát chặt chẽ giá thành sản phẩm, chi phí định mức nguyên vật liệu và quản trị dòng tiền sản xuất kinh doanh.',
          'Chịu trách nhiệm lập báo cáo tài chính hợp nhất, làm việc với cơ quan Thuế, Kiểm toán độc lập và các tổ chức tín dụng.'
        ],
        reqs: [
          'Có Chứng chỉ Kế toán trưởng, tốt nghiệp Đại học chuyên ngành Kế toán - Kiểm toán hoặc Tài chính.',
          'Tối thiểu 5 năm kinh nghiệm ở vị trí Kế toán trưởng trong các doanh nghiệp sản xuất hoặc tập đoàn công nghiệp.',
          'Am hiểu sâu sắc chính sách thuế hiện hành, chuẩn mực kế toán Việt Nam (VAS) và phần mềm ERP.'
        ],
        perks: [
          'Mức thu nhập từ 35 - 50 triệu/tháng + Thưởng kết quả kinh doanh năm hấp dẫn.',
          'Xe đưa đón hàng ngày từ nội thành Hà Nội về khu tổ hợp nhà máy.',
          'Gói phúc lợi sức khỏe cao cấp và chính sách ưu đãi mua nhà, mua sản phẩm tập đoàn.'
        ]
      }
    }
  ];

  // =========================================================================
  // 2. CONFIGURATION & DOM ELEMENTS
  // =========================================================================
  const PAGE_SIZE = 25;
  let currentPage = 1;
  let currentFilteredJobs = [];

  const searchInput = document.getElementById('jobSearchInput') || document.getElementById('heroSearchInput');
  const clearSearchInputBtn = document.getElementById('clearSearchInputBtn');
  const locationSelect = document.getElementById('jobLocationSelect') || document.getElementById('heroLocationSelect');
  const heroLocationTrigger = document.getElementById('heroLocationTrigger') || document.getElementById('jobLocationTrigger');
  if (heroLocationTrigger) {
    Array.from(heroLocationTrigger.childNodes).forEach(n => {
      if (n.nodeType === Node.TEXT_NODE) n.remove();
    });
  }
  const categorySelect = document.getElementById('jobCategorySelect');
  const sortSelect = document.getElementById('sortSelect');
  const jobSearchForm = document.getElementById('jobSearchForm');
  const btnJobSearch = document.getElementById('btnJobSearch') || document.getElementById('btnHeroSearch');
  const jobCountText = document.getElementById('jobCountText');
  const activeSearchTag = document.getElementById('activeSearchTag');
  const activeKeywordText = document.getElementById('activeKeywordText');
  const btnClearKeyword = document.getElementById('btnClearKeyword');
  const noResultsBox = document.getElementById('noResultsBox');
  const btnResetSearch = document.getElementById('btnResetSearch');
  const jobListingGrid = document.getElementById('jobListingGrid');
  const paginationWrapper = document.getElementById('paginationWrapper') || document.querySelector('.pagination-wrapper');
  const toast = document.getElementById('toastMsg');
  const btnResetFilters = document.getElementById('btnResetFilters');
  const searchSuggestDropdown = document.getElementById('searchSuggestDropdown');
  const recentSearchList = document.getElementById('recentSearchList');
  const btnClearSearchHistory = document.getElementById('btnClearSearchHistory');
  const btnCloseSuggest = document.getElementById('btnCloseSuggest');
  const heroSearchWrapper = document.getElementById('heroSearchWrapper') || document.getElementById('jobSearchWrapper');
  const heroSearchStickyBar = document.getElementById('heroSearchStickyBar') || document.getElementById('jobSearchStickyBar');
  let activeIndustryQuery = '';

  // Top Filter Bar State
  let selectedExp = '';
  let selectedSalary = '';
  let selectedLevel = '';
  let selectedType = '';
  let selectedSaturday = '';

  const FILTER_DEFAULT_LABELS = {
    exp: 'Kinh nghiệm',
    salary: 'Mức lương',
    level: 'Cấp bậc',
    type: 'Hình thức',
    saturday: 'Nghỉ thứ 7'
  };

  // -------------------------------------------------------------------------
  // CHỌN NHIỀU cho 5 bộ lọc tiêu chí: giá trị lưu dạng chuỗi nối dấu phẩy ("intern,junior")
  // → URL, bộ lọc đã lưu và link sang trang chi tiết dùng lại nguyên cơ chế cũ.
  // Trong cùng 1 tiêu chí: khớp BẤT KỲ giá trị nào (OR); giữa các tiêu chí: AND.
  // -------------------------------------------------------------------------
  const MULTI_FILTER_TYPES = ['exp', 'salary', 'level', 'type', 'saturday'];
  const CHECK_ICON_SVG = '<svg class="check-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg>';

  function parseMultiValue(value) {
    return [...new Set(String(value || '').split(',').map(part => part.trim()).filter(Boolean))];
  }

  function getFilterValue(type) {
    if (type === 'exp') return selectedExp;
    if (type === 'salary') return selectedSalary;
    if (type === 'level') return selectedLevel;
    if (type === 'type') return selectedType;
    if (type === 'saturday') return selectedSaturday;
    return '';
  }

  function setFilterValue(type, value) {
    const joined = parseMultiValue(value).join(',');
    if (type === 'exp') selectedExp = joined;
    else if (type === 'salary') selectedSalary = joined;
    else if (type === 'level') selectedLevel = joined;
    else if (type === 'type') selectedType = joined;
    else if (type === 'saturday') selectedSaturday = joined;
  }

  function getFilterOptionLabel(type, value) {
    const option = document.querySelector(`.dropdown-item[data-type="${type}"][data-value="${CSS.escape(value)}"]`);
    return option?.getAttribute('data-label') || option?.querySelector('span')?.textContent.trim() || value;
  }

  // Đánh dấu các lựa chọn trong menu: không chọn gì → "Tất cả …"; có chọn → tích từng mục
  function syncFilterDropdownSelection(type) {
    const values = parseMultiValue(getFilterValue(type));
    document.querySelectorAll(`.dropdown-item[data-type="${type}"]`).forEach(item => {
      const itemValue = item.getAttribute('data-value') || '';
      const isSelected = itemValue ? values.includes(itemValue) : values.length === 0;
      item.classList.toggle('is-selected', isSelected);
      item.setAttribute('aria-checked', isSelected ? 'true' : 'false');
      const icon = item.querySelector('.check-icon');
      if (isSelected && !icon) item.insertAdjacentHTML('beforeend', CHECK_ICON_SVG);
      else if (!isSelected && icon) icon.remove();
    });
  }

  // Saved filter dialog elements
  const savedFiltersTrigger = document.getElementById('savedFiltersTrigger');
  const savedFiltersDialog = document.getElementById('savedFiltersDialog');
  const savedFiltersPanel = savedFiltersDialog?.querySelector('.saved-filters-panel');
  const savedFiltersClose = document.getElementById('savedFiltersClose');
  const savedFilterForm = document.getElementById('savedFilterForm');
  const savedFilterName = document.getElementById('savedFilterName');
  const savedFilterNameError = document.getElementById('savedFilterNameError');
  const savedFilterSubmit = document.getElementById('savedFilterSubmit');
  const savedFilterCurrentSummary = document.getElementById('savedFilterCurrentSummary');
  const savedFilterList = document.getElementById('savedFilterList');
  const savedFilterEmpty = document.getElementById('savedFilterEmpty');
  const savedFilterCount = document.getElementById('savedFilterCount');
  const savedFilterLibraryCount = document.getElementById('savedFilterLibraryCount');

  // Split View & View Mode elements
  let activeViewMode = 'grid'; // 'grid' | 'split'
  let selectedJobId = null;
  const jobDefaultLayout = document.getElementById('jobDefaultLayout');
  const jobSplitContainer = document.getElementById('jobSplitContainer');
  const btnViewGrid = document.getElementById('btnViewGrid');
  const btnViewSplit = document.getElementById('btnViewSplit');
  const splitSortSelect = document.getElementById('splitSortSelect');
  const btnBackToGrid = document.getElementById('btnBackToGrid');
  const btnCopyJobLink = document.getElementById('btnCopyJobLink');
  const btnDetailBookmark = document.getElementById('btnDetailBookmark');
  const btnDetailSaveCard = document.getElementById('btnDetailSaveCard');
  const btnDetailApply = document.getElementById('btnDetailApply');
  const btnStickyApply = document.getElementById('btnStickyApply');
  const btnOpenSinglePage = document.getElementById('btnOpenSinglePage');

  // Modal elements
  const jobModalBackdrop = document.getElementById('jobModalBackdrop');
  const jobModalClose = document.getElementById('jobModalClose');
  const modalJobTitle = document.getElementById('modalJobTitle');
  const modalCompanyName = document.getElementById('modalCompanyName');
  const modalSalary = document.getElementById('modalSalary');
  const modalLocation = document.getElementById('modalLocation');
  const modalAiBadge = document.getElementById('modalAiBadge');
  const modalBadgesRow = document.getElementById('modalBadgesRow');
  const modalJobDescList = document.getElementById('modalJobDescList');
  const modalJobReqsList = document.getElementById('modalJobReqsList');
  const modalJobPerksList = document.getElementById('modalJobPerksList');
  const btnModalApply = document.getElementById('btnModalApply');

  // Bookmark storage
  function getSavedJobs() {
    try {
      return JSON.parse(localStorage.getItem('easycv_saved_job_ids') || '[]');
    } catch {
      return [];
    }
  }

  function setSavedJobs(ids) {
    localStorage.setItem('easycv_saved_job_ids', JSON.stringify(ids));
  }

  // =========================================================================
  // SAVED JOB FILTERS
  // =========================================================================
  const SAVED_FILTER_STORAGE_KEY = 'easycv_saved_job_filters_v1';
  const SAVED_FILTER_STORAGE_VERSION = 1;
  const SAVED_FILTER_PARAM_KEYS = [
    'keyword', 'location', 'category', 'industry',
    'exp', 'salary', 'level', 'type', 'saturday'
  ];
  const SAVED_FILTER_VALUE_SETS = {
    exp: new Set(['0', 'under1', '1-3', '3-5', 'over5']),
    salary: new Set(['under10', '10-15', '15-25', '25-50', 'over50', 'negotiable']),
    level: new Set(['intern', 'junior', 'senior', 'manager']),
    type: new Set(['fulltime', 'hybrid', 'remote', 'parttime']),
    saturday: new Set(['work_sat', 'off_sat', 'unmentioned'])
  };
  let savedFilters = [];
  let savedFilterReturnFocus = null;
  let pendingDeleteFilterId = null;

  function sanitizeSavedFilterParams(candidate) {
    if (!candidate || typeof candidate !== 'object' || Array.isArray(candidate)) return {};
    const sanitized = {};
    SAVED_FILTER_PARAM_KEYS.forEach(key => {
      const rawValue = candidate[key];
      if (typeof rawValue !== 'string') return;
      let value = rawValue.trim().slice(0, 200);
      if (!value) return;
      if (SAVED_FILTER_VALUE_SETS[key]) {
        // Bộ lọc chọn nhiều: mọi giá trị con phải hợp lệ
        const parts = parseMultiValue(value);
        if (parts.length === 0 || !parts.every(part => SAVED_FILTER_VALUE_SETS[key].has(part))) return;
        value = parts.join(',');
      }
      sanitized[key] = value;
    });
    return sanitized;
  }

  function normalizeSavedFilterStore(rawValue) {
    if (!rawValue) return [];
    try {
      const parsed = JSON.parse(rawValue);
      if (!parsed || parsed.version !== SAVED_FILTER_STORAGE_VERSION || !Array.isArray(parsed.filters)) return [];
      const seenIds = new Set();
      return parsed.filters.reduce((records, record) => {
        if (!record || typeof record !== 'object') return records;
        const id = typeof record.id === 'string' ? record.id.trim() : '';
        const name = typeof record.name === 'string' ? record.name.trim() : '';
        const params = sanitizeSavedFilterParams(record.params);
        if (!id || seenIds.has(id) || !name || name.length > 60 || Object.keys(params).length === 0) return records;
        seenIds.add(id);
        records.push({
          id,
          name,
          params,
          createdAt: typeof record.createdAt === 'string' ? record.createdAt : ''
        });
        return records;
      }, []);
    } catch {
      return [];
    }
  }

  function readSavedFilters() {
    try {
      return normalizeSavedFilterStore(localStorage.getItem(SAVED_FILTER_STORAGE_KEY));
    } catch {
      return [];
    }
  }

  function persistSavedFilters() {
    try {
      localStorage.setItem(SAVED_FILTER_STORAGE_KEY, JSON.stringify({
        version: SAVED_FILTER_STORAGE_VERSION,
        filters: savedFilters
      }));
      return true;
    } catch {
      setSavedFilterError('Không thể lưu trên trình duyệt này. Vui lòng kiểm tra quyền lưu trữ.');
      return false;
    }
  }

  function createSavedFilterId() {
    if (window.crypto && typeof window.crypto.randomUUID === 'function') {
      return window.crypto.randomUUID();
    }
    return `filter-${Date.now()}-${Math.random().toString(16).slice(2)}`;
  }

  function getCanonicalFilterSnapshot() {
    const currentParams = new URLSearchParams(window.location.search);
    const candidate = {};
    SAVED_FILTER_PARAM_KEYS.forEach(key => {
      let value = currentParams.get(key);
      if (!value && key === 'keyword') value = currentParams.get('q');
      if (!value && key === 'location') value = currentParams.get('locations');
      if (value) candidate[key] = value;
    });
    return sanitizeSavedFilterParams(candidate);
  }

  function getSavedFilterCriterionLabel(key, value) {
    const prefixes = {
      keyword: 'Từ khóa',
      location: 'Địa điểm',
      category: 'Danh mục',
      industry: 'Ngành nghề',
      exp: 'Kinh nghiệm',
      salary: 'Mức lương',
      level: 'Cấp bậc',
      type: 'Hình thức',
      saturday: 'Thứ 7'
    };
    let displayValue = value;
    if (SAVED_FILTER_VALUE_SETS[key]) {
      displayValue = parseMultiValue(value).map(part => getFilterOptionLabel(key, part)).join(', ');
    } else if (key === 'category' && categorySelect) {
      displayValue = categorySelect.querySelector(`option[value="${CSS.escape(value)}"]`)?.textContent.trim() || value;
    }
    return `${prefixes[key]}: ${displayValue}`;
  }

  function describeSavedFilter(params) {
    return SAVED_FILTER_PARAM_KEYS
      .filter(key => params[key])
      .map(key => getSavedFilterCriterionLabel(key, params[key]));
  }

  function setSavedFilterError(message = '') {
    if (!savedFilterName || !savedFilterNameError) return;
    savedFilterNameError.textContent = message;
    savedFilterNameError.hidden = !message;
    savedFilterName.setAttribute('aria-invalid', message ? 'true' : 'false');
  }

  function updateSavedFilterCurrentState() {
    if (!savedFilterSubmit || !savedFilterCurrentSummary) return;
    const snapshot = getCanonicalFilterSnapshot();
    const descriptions = describeSavedFilter(snapshot);
    const hasCriteria = descriptions.length > 0;
    savedFilterSubmit.disabled = !hasCriteria;
    savedFilterSubmit.title = hasCriteria ? '' : 'Hãy chọn ít nhất một tiêu chí trước khi lưu';
    savedFilterCurrentSummary.textContent = hasCriteria
      ? descriptions.join(' · ')
      : 'Chưa có tiêu chí nào. Hãy chọn ít nhất một bộ lọc trước khi lưu.';
  }

  function renderSavedFilters() {
    if (!savedFilterList || !savedFilterEmpty) return;
    savedFilterList.replaceChildren();
    savedFilterEmpty.hidden = savedFilters.length > 0;
    if (savedFilterCount) {
      savedFilterCount.textContent = String(savedFilters.length);
      savedFilterCount.setAttribute('aria-label', `${savedFilters.length} bộ lọc đã lưu`);
    }
    if (savedFilterLibraryCount) {
      savedFilterLibraryCount.textContent = `${savedFilters.length} bộ lọc`;
    }

    savedFilters.forEach(record => {
      const item = document.createElement('li');
      item.className = 'saved-filter-item';
      item.dataset.filterId = record.id;

      const content = document.createElement('div');
      content.className = 'saved-filter-item-content';
      const name = document.createElement('strong');
      name.textContent = record.name;
      const summary = document.createElement('p');
      summary.textContent = describeSavedFilter(record.params).join(' · ');
      content.append(name, summary);

      const actions = document.createElement('div');
      actions.className = 'saved-filter-item-actions';
      const applyButton = document.createElement('button');
      applyButton.type = 'button';
      applyButton.className = 'saved-filter-apply';
      applyButton.dataset.action = 'apply';
      applyButton.textContent = 'Áp dụng';
      applyButton.setAttribute('aria-label', `Áp dụng bộ lọc ${record.name}`);
      const deleteButton = document.createElement('button');
      deleteButton.type = 'button';
      deleteButton.className = 'saved-filter-delete';
      deleteButton.dataset.action = 'request-delete';
      deleteButton.setAttribute('aria-label', `Xóa bộ lọc ${record.name}`);
      deleteButton.innerHTML = '<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M3 6h18M8 6V4h8v2m-9 0 1 14h8l1-14M10 11v5m4-5v5"></path></svg>';
      actions.append(applyButton, deleteButton);
      item.append(content, actions);

      if (pendingDeleteFilterId === record.id) {
        item.classList.add('is-confirming-delete');
        const confirmation = document.createElement('div');
        confirmation.className = 'saved-filter-delete-confirmation';
        const prompt = document.createElement('span');
        prompt.textContent = `Xóa “${record.name}”?`;
        const cancelButton = document.createElement('button');
        cancelButton.type = 'button';
        cancelButton.dataset.action = 'cancel-delete';
        cancelButton.textContent = 'Hủy';
        const confirmButton = document.createElement('button');
        confirmButton.type = 'button';
        confirmButton.className = 'saved-filter-confirm-delete';
        confirmButton.dataset.action = 'confirm-delete';
        confirmButton.textContent = 'Xóa';
        confirmation.append(prompt, cancelButton, confirmButton);
        item.append(confirmation);
      }

      savedFilterList.append(item);
    });
  }

  function openSavedFiltersDialog() {
    if (!savedFiltersDialog) return;
    savedFilterReturnFocus = document.activeElement;
    pendingDeleteFilterId = null;
    savedFilters = readSavedFilters();
    renderSavedFilters();
    updateSavedFilterCurrentState();
    setSavedFilterError('');
    savedFiltersDialog.hidden = false;
    savedFiltersTrigger?.setAttribute('aria-expanded', 'true');
    document.body.classList.add('saved-filter-dialog-open');
    requestAnimationFrame(() => {
      if (!savedFilterSubmit?.disabled) savedFilterName?.focus();
      else savedFiltersPanel?.focus();
    });
  }

  function closeSavedFiltersDialog(restoreFocus = true) {
    if (!savedFiltersDialog || savedFiltersDialog.hidden) return;
    savedFiltersDialog.hidden = true;
    savedFiltersTrigger?.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('saved-filter-dialog-open');
    pendingDeleteFilterId = null;
    if (restoreFocus && savedFilterReturnFocus instanceof HTMLElement) {
      savedFilterReturnFocus.focus();
    }
  }

  function applySavedFilter(record) {
    const params = sanitizeSavedFilterParams(record.params);
    if (Object.keys(params).length === 0) return;
    document.querySelectorAll('.quick-filter-tags .tag-btn.active').forEach(button => button.classList.remove('active'));
    document.querySelectorAll('.filter-sidebar input[type="checkbox"]').forEach(input => { input.checked = false; });
    const nextParams = new URLSearchParams();
    SAVED_FILTER_PARAM_KEYS.forEach(key => {
      if (params[key]) nextParams.set(key, params[key]);
    });
    const nextUrl = `${window.location.pathname}?${nextParams.toString()}`;
    window.history.pushState(null, '', nextUrl);
    syncStateFromUrl();
    closeSavedFiltersDialog(true);
    showToast(`Đã áp dụng bộ lọc “${record.name}”`, '✓');
  }

  function initSavedFilters() {
    if (!savedFiltersDialog || !savedFilterForm || !savedFilterList) return;
    savedFilters = readSavedFilters();
    renderSavedFilters();
    updateSavedFilterCurrentState();

    savedFiltersTrigger?.addEventListener('click', openSavedFiltersDialog);
    savedFiltersClose?.addEventListener('click', () => closeSavedFiltersDialog(true));
    savedFiltersDialog.querySelector('[data-saved-filter-close]')?.addEventListener('click', () => closeSavedFiltersDialog(true));

    savedFilterName?.addEventListener('input', () => setSavedFilterError(''));
    savedFilterName?.addEventListener('blur', () => {
      const name = savedFilterName.value.trim();
      if (!name) setSavedFilterError('Vui lòng nhập tên bộ lọc.');
      else if (name.length > 60) setSavedFilterError('Tên bộ lọc không được vượt quá 60 ký tự.');
    });

    savedFilterForm.addEventListener('submit', event => {
      event.preventDefault();
      const name = savedFilterName.value.trim();
      const params = getCanonicalFilterSnapshot();
      if (!name) {
        setSavedFilterError('Vui lòng nhập tên bộ lọc.');
        savedFilterName.focus();
        return;
      }
      if (name.length > 60) {
        setSavedFilterError('Tên bộ lọc không được vượt quá 60 ký tự.');
        savedFilterName.focus();
        return;
      }
      if (Object.keys(params).length === 0) {
        setSavedFilterError('Hãy chọn ít nhất một tiêu chí trước khi lưu.');
        savedFilterName.focus();
        return;
      }
      const record = {
        id: createSavedFilterId(),
        name,
        params,
        createdAt: new Date().toISOString()
      };
      savedFilters.unshift(record);
      if (!persistSavedFilters()) {
        savedFilters.shift();
        savedFilterName.focus();
        return;
      }
      savedFilterName.value = '';
      setSavedFilterError('');
      renderSavedFilters();
      showToast(`Đã lưu bộ lọc “${record.name}”`, '✓');
      savedFilterName.focus();
    });

    savedFilterList.addEventListener('click', event => {
      const button = event.target.closest('button[data-action]');
      const item = event.target.closest('.saved-filter-item');
      if (!button || !item) return;
      const record = savedFilters.find(filter => filter.id === item.dataset.filterId);
      if (!record) return;
      const action = button.dataset.action;
      if (action === 'apply') {
        applySavedFilter(record);
      } else if (action === 'request-delete') {
        pendingDeleteFilterId = record.id;
        renderSavedFilters();
        savedFilterList.querySelector(`[data-filter-id="${CSS.escape(record.id)}"] [data-action="cancel-delete"]`)?.focus();
      } else if (action === 'cancel-delete') {
        pendingDeleteFilterId = null;
        renderSavedFilters();
        savedFilterList.querySelector(`[data-filter-id="${CSS.escape(record.id)}"] [data-action="request-delete"]`)?.focus();
      } else if (action === 'confirm-delete') {
        savedFilters = savedFilters.filter(filter => filter.id !== record.id);
        if (!persistSavedFilters()) return;
        pendingDeleteFilterId = null;
        renderSavedFilters();
        (savedFilterList.querySelector('button') || savedFilterName)?.focus();
        showToast(`Đã xóa bộ lọc “${record.name}”`, '✓');
      }
    });

    savedFiltersDialog.addEventListener('keydown', event => {
      if (event.key === 'Escape') {
        event.preventDefault();
        closeSavedFiltersDialog(true);
        return;
      }
      if (event.key !== 'Tab') return;
      const focusable = Array.from(savedFiltersDialog.querySelectorAll(
        'button:not([disabled]), input:not([disabled]), [href], [tabindex]:not([tabindex="-1"])'
      )).filter(element => !element.hidden && element.getClientRects().length > 0);
      if (focusable.length === 0) {
        event.preventDefault();
        savedFiltersPanel?.focus();
        return;
      }
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    });

    window.addEventListener('storage', event => {
      if (event.key !== SAVED_FILTER_STORAGE_KEY) return;
      savedFilters = normalizeSavedFilterStore(event.newValue);
      pendingDeleteFilterId = null;
      renderSavedFilters();
    });
  }

  // Vietnamese diacritics normalizer
  function normalizeText(text) {
    if (!text) return '';
    return text
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[đĐ]/g, 'd')
      .toLowerCase()
      .trim();
  }

  // Toast feedback
  function showToast(message, icon = '✓') {
    if (!toast) return;
    toast.innerHTML = `<span>${icon}</span> <span>${message}</span>`;
    toast.classList.add('show');
    setTimeout(() => {
      toast.classList.remove('show');
    }, 2800);
  }

  // =========================================================================
  // 3. CORE FILTERING ENGINE
  // =========================================================================
  function matchSalaryTier(job, tier) {
    if (tier === 'under10') return job.salaryMin < 10;
    if (tier === '10-15') return (job.salaryMin <= 15 && job.salaryMax >= 10);
    if (tier === '15-25') return (job.salaryMin <= 25 && job.salaryMax >= 15);
    if (tier === '25-50') return (job.salaryMin <= 50 && job.salaryMax >= 25);
    if (tier === 'over50') return job.salaryMax >= 50;
    if (tier === 'negotiable') return true;
    return false;
  }

  function applyJobFilters(resetPage = true, updateUrl = true) {
    const query = searchInput ? searchInput.value.trim() : '';
    const normQuery = normalizeText(query);
    const locValue = locationSelect ? locationSelect.value.trim() : '';
    const normLoc = normalizeText(locValue);
    const catValue = categorySelect ? categorySelect.value.trim() : '';
    const normIndustry = normalizeText(activeIndustryQuery);

    // Quick tag buttons
    const activeTags = Array.from(document.querySelectorAll('.quick-filter-tags .tag-btn.active'))
      .map(btn => btn.getAttribute('data-tag'));

    // Top Filter Bar Criteria
    const filterExp = selectedExp;
    const filterSalary = selectedSalary;
    const filterLevel = selectedLevel;
    const filterType = selectedType;
    const filterSaturday = selectedSaturday;

    const hasFilter = Boolean(normQuery || normIndustry || (normLoc && normLoc !== 'tat ca dia diem') || catValue || activeTags.length > 0 || filterLevel || filterSalary || filterExp || filterType || filterSaturday);

    const matchingJobs = [];
    const nonMatchingJobs = [];

    // Phân loại Job: khớp tiêu chí vs không khớp tiêu chí
    JOBS_DATA.forEach(job => {
      const allText = `${job.title} ${job.company} ${job.location} ${job.city} ${job.skills.join(' ')}`;
      const normAllText = normalizeText(allText);

      let isMatch = true;

      // 1. Keyword search
      if (normQuery) {
        const tokens = normQuery.split(/\s+/).filter(Boolean);
        const tokenMatch = tokens.every(token => normAllText.includes(token));
        if (!tokenMatch && !normAllText.includes(normQuery)) {
          isMatch = false;
        }
      }

      // 1b. Independent industry / specialty filter from the homepage picker
      if (isMatch && normIndustry) {
        const industryTokens = normIndustry.split(/\s+/).filter(Boolean);
        const industryMatch = industryTokens.every(token => normAllText.includes(token)) || normAllText.includes(normIndustry);
        if (!industryMatch) isMatch = false;
      }

      // 2. Location filter
      if (isMatch && normLoc && normLoc !== 'tat ca dia diem') {
        const normJobLoc = normalizeText(job.location);
        const normJobCity = normalizeText(job.city);
        const locTokens = normLoc.split(/[;|,]/).map(t => t.trim()).filter(Boolean);
        const locMatch = locTokens.some(tok => {
          const cleanTok = tok.split(':')[0].trim();
          const districtTok = tok.includes(':') ? tok.split(':')[1].trim() : '';
          if (cleanTok === 'remote' || tok === 'remote') {
            return normJobLoc.includes('remote') || job.type === 'remote';
          }
          const matchProvince = normJobLoc.includes(cleanTok) || normJobCity.includes(cleanTok) || cleanTok.includes(normJobCity);
          if (districtTok) {
            return matchProvince && (normJobLoc.includes(districtTok) || districtTok.includes(normJobLoc));
          }
          return matchProvince;
        });
        if (!locMatch) isMatch = false;
      }

      // 3. Category filter
      if (isMatch && catValue && job.category !== catValue) {
        isMatch = false;
      }

      // 4. Quick filter tags
      if (isMatch && activeTags.length > 0) {
        for (let tag of activeTags) {
          if (tag === 'remote') {
            if (job.type !== 'remote' && !job.location.toLowerCase().includes('remote')) { isMatch = false; break; }
          } else if (tag === 'high-salary') {
            if (job.salaryMax < 30 && job.salaryMin < 25) { isMatch = false; break; }
          } else if (tag === 'fresher') {
            if (job.level === 'senior' || job.level === 'manager') { isMatch = false; break; }
            if (job.exp !== '0' && job.exp !== 'under1' && !job.title.toLowerCase().includes('fresher') && !job.title.toLowerCase().includes('intern')) { isMatch = false; break; }
          } else if (tag === 'urgent') {
            if (!job.isUrgent) { isMatch = false; break; }
          } else if (tag === 'english') {
            const hasEnglish = job.skills.some(s => s.toLowerCase().includes('english') || s.toLowerCase().includes('tiếng anh')) ||
              ['FPT Software', 'KMS Technology', 'NashTech'].some(c => job.company.includes(c));
            if (!hasEnglish) { isMatch = false; break; }
          }
        }
      }

      // 5–9. Bộ lọc tiêu chí chọn nhiều (Top Filter Bar): khớp bất kỳ giá trị đã chọn trong cùng tiêu chí
      // 5. Cấp bậc
      if (isMatch && filterLevel && !parseMultiValue(filterLevel).includes(job.level)) {
        isMatch = false;
      }

      // 6. Mức lương
      if (isMatch && filterSalary && !parseMultiValue(filterSalary).some(tier => matchSalaryTier(job, tier))) {
        isMatch = false;
      }

      // 7. Kinh nghiệm
      if (isMatch && filterExp && !parseMultiValue(filterExp).includes(job.exp)) {
        isMatch = false;
      }

      // 8. Hình thức
      if (isMatch && filterType && !parseMultiValue(filterType).includes(job.type)) {
        isMatch = false;
      }

      // 9. Chế độ làm việc thứ 7
      if (isMatch && filterSaturday && !parseMultiValue(filterSaturday).includes(job.saturday)) {
        isMatch = false;
      }

      job._isSearchMatch = isMatch && hasFilter;
      if (isMatch) {
        matchingJobs.push(job);
      } else {
        nonMatchingJobs.push(job);
      }
    });

    // 2. Quyết định hiển thị theo quy tắc dữ liệu mẫu EasyCV:
    // "khi nhấn nút tìm kiếm việc làm, vì là dữ liệu mẫu thôi, nên cứ hiển thị dữ liệu có sẵn, không đáp ứng dữ liệu yêu cầu lọc cũng được"
    if (hasFilter) {
      if (matchingJobs.length > 0) {
        // Có việc làm khớp: ưu tiên đưa các việc làm khớp lên đầu, tiếp theo là toàn bộ danh sách mẫu có sẵn
        currentFilteredJobs = [...matchingJobs, ...nonMatchingJobs];
      } else {
        // Không có việc làm nào khớp (ví dụ từ khóa lạ, hoặc bộ lọc không giao thoa):
        // Vẫn hiển thị đầy đủ toàn bộ 16 việc làm có sẵn
        currentFilteredJobs = [...JOBS_DATA];
      }
    } else {
      currentFilteredJobs = [...JOBS_DATA];
    }

    // Apply Sorting (Luôn ưu tiên việc làm khớp tìm kiếm lên trên)
    sortJobs();

    // Reset pagination to page 1 upon new search
    if (resetPage) {
      currentPage = 1;
    }

    // Render results
    renderCurrentPage();

    // If split view active, synchronize right list and left detail
    if (activeViewMode === 'split') {
      if (!currentFilteredJobs.some(j => j.id === selectedJobId) && currentFilteredJobs.length > 0) {
        selectedJobId = currentFilteredJobs[0].id;
      }
      renderSplitList();
      const currentJob = JOBS_DATA.find(j => j.id === selectedJobId) || currentFilteredJobs[0];
      if (currentJob) renderSplitDetail(currentJob);
    }



    // Update URL query string
    if (updateUrl && window.history && window.history.pushState) {
      const newParams = new URLSearchParams();
      if (query) newParams.set('keyword', query);
      if (locValue) newParams.set('location', locValue);
      if (catValue) newParams.set('category', catValue);
      if (activeIndustryQuery) newParams.set('industry', activeIndustryQuery);
      if (selectedExp) newParams.set('exp', selectedExp);
      if (selectedSalary) newParams.set('salary', selectedSalary);
      if (selectedLevel) newParams.set('level', selectedLevel);
      if (selectedType) newParams.set('type', selectedType);
      if (selectedSaturday) newParams.set('saturday', selectedSaturday);
      const newUrl = `${window.location.pathname}${newParams.toString() ? '?' + newParams.toString() : ''}`;
      window.history.pushState(null, '', newUrl);
    }

    updateSavedFilterCurrentState();
  }

  // =========================================================================
  // 4. SORTING ENGINE (TopCV Standard)
  // =========================================================================
  function sortJobs() {
    const val = sortSelect ? sortSelect.value : 'relevant';

    currentFilteredJobs.sort((a, b) => {
      // 1. Ưu tiên tuyệt đối các việc làm khớp tìm kiếm lên trên cùng
      if (a._isSearchMatch && !b._isSearchMatch) return -1;
      if (!a._isSearchMatch && b._isSearchMatch) return 1;

      // 2. Tiêu chuẩn sắp xếp người dùng chọn
      if (val === 'salary_high') {
        return b.salaryMax - a.salaryMax;
      } else if (val === 'newest' || val === 'post_date') {
        return b.id - a.id;
      } else if (val === 'update_date') {
        const aToday = a.updated && (a.updated.includes('Hôm nay') || a.updated.includes('giờ'));
        const bToday = b.updated && (b.updated.includes('Hôm nay') || b.updated.includes('giờ'));
        if (aToday && !bToday) return -1;
        if (!aToday && bToday) return 1;
        return b.id - a.id;
      } else if (val === 'urgent') {
        if (a.isFeatured && !b.isFeatured) return -1;
        if (!a.isFeatured && b.isFeatured) return 1;
        return b.id - a.id;
      } else if (val === 'views') {
        return b.aiMatch - a.aiMatch;
      } else {
        // Mặc định: 'relevant' (Search by AI)
        if (a.isFeatured && !b.isFeatured) return -1;
        if (!a.isFeatured && b.isFeatured) return 1;
        return b.aiMatch - a.aiMatch;
      }
    });
  }

  // =========================================================================
  // 5. RENDERING ENGINE: JOB CARDS & DYNAMIC PAGINATION (Fix BUG-01)
  // =========================================================================
  function renderCurrentPage() {
    const totalJobs = currentFilteredJobs.length;

    // Update job count header: Luôn hiển thị số lượng việc làm tìm thấy phù hợp
    if (jobCountText) {
      jobCountText.textContent = totalJobs;
    }

    // Empty state handling
    if (totalJobs === 0) {
      if (noResultsBox) noResultsBox.style.display = 'block';
      if (paginationWrapper) paginationWrapper.style.display = 'none';

      // Remove existing job cards but preserve noResultsBox
      const existingCards = jobListingGrid.querySelectorAll('.job-card');
      existingCards.forEach(card => card.remove());
      return;
    }

    if (noResultsBox) {
      noResultsBox.style.display = 'none';
    }

    // Calculate pagination slices
    const totalPages = Math.ceil(totalJobs / PAGE_SIZE);
    if (currentPage > totalPages) currentPage = totalPages;
    if (currentPage < 1) currentPage = 1;

    const startIndex = (currentPage - 1) * PAGE_SIZE;
    const endIndex = Math.min(startIndex + PAGE_SIZE, totalJobs);
    const pageJobs = currentFilteredJobs.slice(startIndex, endIndex);

    // Build Cards HTML
    const savedIds = getSavedJobs();
    const detailKeywordParam = getDetailKeywordParam();
    const cardsHtml = pageJobs.map(job => {
      const isSaved = savedIds.includes(job.id);
      const featuredClass = job.isFeatured ? 'is-featured' : '';
      
      // Determine exp display
      let expText = '2 năm';
      if (job.exp === '0') expText = 'Không yêu cầu';
      else if (job.exp === 'under1') expText = 'Dưới 1 năm';
      else if (job.exp === '1-3') expText = '1 - 3 năm';
      else if (job.exp === '3-5') expText = '3 - 5 năm';
      else if (job.exp === 'over5') expText = 'Trên 5 năm';

      // City short pill
      const cityPill = job.city || job.location.split('(')[0].trim();

      // Skills summary line: e.g. "2 năm kinh nghiệm chuyên môn | Backend Deve... | +4"
      const firstSkill = job.skills && job.skills.length > 0 ? job.skills[0] : '';
      const remainingCount = job.skills && job.skills.length > 1 ? ` | +${job.skills.length - 1}` : '';
      const skillsSummary = `${expText} kinh nghiệm chuyên môn${firstSkill ? ' | ' + firstSkill : ''}${remainingCount}`;

      // Viewed status: sample viewed jobs on page 1
      const isViewed = job.id <= 3;

      return `
        <article class="job-card ${featuredClass}" data-id="${job.id}">
          <div class="job-card-top">
            <img src="${job.logo}" alt="${job.company}" class="job-company-logo" loading="lazy" />
            <div class="job-info-main">
              <div class="job-header-row">
                <div class="job-title-wrap">
                  <h3 class="job-title">
                    <a href="chi-tiet-viec-lam.html?id=${job.id}&title=${encodeURIComponent(job.title)}${detailKeywordParam}" class="job-title-link" title="${job.title}">${job.title}</a>
                  </h3>
                  <div class="job-company-row">
                    <span class="job-company-name">${job.company.toUpperCase()}</span>
                    ${job.verified ? `
                      <span class="badge-verified" title="Doanh nghiệp xác thực">
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4" stroke="#FFF" stroke-width="2"/></svg>
                      </span>
                    ` : ''}
                  </div>
                  <div class="job-quick-pills">
                    <span class="job-quick-pill">${cityPill}</span>
                    <span class="job-quick-pill">${expText}</span>
                  </div>
                </div>
                <div class="job-top-right">
                  <div class="job-salary-wrap">
                    <span class="job-salary-text">${job.salaryBadge}</span>
                  </div>
                  <button type="button" class="btn-quick-view" data-id="${job.id}" title="Xem nhanh việc làm">
                    <span>Xem nhanh</span>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="m13 17 5-5-5-5M6 17l5-5-5-5"/></svg>
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div class="job-card-divider"></div>

          <div class="job-card-bottom">
            <div class="job-bottom-left">
              ${skillsSummary}
            </div>
            <div class="job-bottom-right">
              <div class="job-meta-unhovered">
                <span class="job-post-time">Đăng ${job.updated}</span>
                ${isViewed ? '<span class="badge-viewed">Đã xem</span>' : ''}
              </div>
              <div class="job-actions-hovered">
                <button type="button" class="btn-card-apply" data-id="${job.id}">Ứng tuyển</button>
                <button type="button" class="btn-card-hide" data-id="${job.id}" aria-label="Ẩn việc làm này" title="Ẩn việc làm">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"/><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"/><path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"/><line x1="2" x2="22" y1="2" y2="22"/></svg>
                </button>
              </div>
              <button type="button" class="btn-card-bookmark ${isSaved ? 'saved' : ''}" data-id="${job.id}" aria-label="Lưu công việc" title="${isSaved ? 'Đã Lưu' : 'Lưu công việc'}">
                <svg width="17" height="17" viewBox="0 0 24 24" fill="${isSaved ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>
              </button>
            </div>
          </div>
        </article>
      `;
    }).join('');

    // Remove existing cards and insert newly built ones before noResultsBox
    const existingCards = jobListingGrid.querySelectorAll('.job-card');
    existingCards.forEach(c => c.remove());
    jobListingGrid.insertAdjacentHTML('afterbegin', cardsHtml);

    // Attach card interactions
    attachCardListeners();

    // Render Dynamic Pagination (FIX BUG-01)
    renderPagination(totalPages);
  }

  // Dynamic Pagination Rendering
  function renderPagination(totalPages) {
    if (!paginationWrapper) return;

    // CRITICAL FIX: If total results <= PAGE_SIZE (e.g. 1 job found),
    // HIDE pagination completely to eliminate confusing page 3 active bug!
    if (totalPages <= 1) {
      paginationWrapper.style.display = 'none';
      paginationWrapper.innerHTML = '';
      return;
    }

    paginationWrapper.style.display = 'flex';
    let buttonsHtml = '';

    // "« Trước" button
    const prevDisabled = currentPage === 1 ? 'disabled' : '';
    buttonsHtml += `<button type="button" class="page-btn ${prevDisabled}" data-page="prev" ${prevDisabled ? 'disabled' : ''}>« Trước</button>`;

    // Page number buttons
    for (let p = 1; p <= totalPages; p++) {
      const activeClass = p === currentPage ? 'active' : '';
      buttonsHtml += `<button type="button" class="page-btn ${activeClass}" data-page="${p}">${p}</button>`;
    }

    // "Sau »" button
    const nextDisabled = currentPage === totalPages ? 'disabled' : '';
    buttonsHtml += `<button type="button" class="page-btn ${nextDisabled}" data-page="next" ${nextDisabled ? 'disabled' : ''}>Sau »</button>`;

    paginationWrapper.innerHTML = buttonsHtml;

    // Attach pagination click handlers
    paginationWrapper.querySelectorAll('.page-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const action = btn.getAttribute('data-page');
        if (action === 'prev') {
          if (currentPage > 1) {
            currentPage--;
            renderCurrentPage();
            scrollToListingTop();
          }
        } else if (action === 'next') {
          if (currentPage < totalPages) {
            currentPage++;
            renderCurrentPage();
            scrollToListingTop();
          }
        } else {
          const targetPage = parseInt(action, 10);
          if (targetPage && targetPage !== currentPage) {
            currentPage = targetPage;
            renderCurrentPage();
            scrollToListingTop();
          }
        }
      });
    });
  }

  // Giữ toàn bộ trạng thái tìm kiếm (từ khóa, địa điểm, bộ lọc, sắp xếp) khi mở trang chi tiết
  // để thanh tìm kiếm, bộ lọc và danh sách bên trái trang chi tiết hiển thị giống hệt trang này
  function getDetailKeywordParam() {
    const params = new URLSearchParams();
    const keyword = searchInput ? searchInput.value.trim() : '';
    const locValue = locationSelect ? locationSelect.value.trim() : '';
    const catValue = categorySelect ? categorySelect.value.trim() : '';
    const sortValue = sortSelect ? sortSelect.value : '';
    if (keyword) params.set('keyword', keyword);
    if (locValue) params.set('location', locValue);
    if (catValue) params.set('category', catValue);
    if (activeIndustryQuery) params.set('industry', activeIndustryQuery);
    if (selectedExp) params.set('exp', selectedExp);
    if (selectedSalary) params.set('salary', selectedSalary);
    if (selectedLevel) params.set('level', selectedLevel);
    if (selectedType) params.set('type', selectedType);
    if (selectedSaturday) params.set('saturday', selectedSaturday);
    if (sortValue && sortValue !== 'relevant') params.set('sort', sortValue);
    const query = params.toString();
    return query ? `&${query}` : '';
  }

  function scrollToListingTop() {
    const target = document.querySelector('.listings-topbar');
    if (target) {
      const topOffset = target.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top: topOffset, behavior: 'smooth' });
    }
  }

  // =========================================================================
  // 6. CARD INTERACTIONS & SPLIT VIEW TRIGGER
  // =========================================================================
  function attachCardListeners() {
    // Card Click -> Open 2-Block Split View (Bên Phải: Danh Sách Job, Bên Trái: Mô Tả Job)
    jobListingGrid.querySelectorAll('.job-card').forEach(card => {
      card.addEventListener('click', (e) => {
        // Nếu click thẳng vào tên job, cho phép trình duyệt mở tab chi tiết độc lập
        if (e.target.closest('.job-title-link')) return;
        if (e.target.closest('.btn-card-bookmark') || e.target.closest('.btn-card-apply') || e.target.closest('.btn-quick-view') || e.target.closest('.btn-card-hide')) return;
        const id = parseInt(card.getAttribute('data-id'), 10);
        openSplitView(id);
      });
    });

    // Quick View Button -> Open Split View or Detail Page
    jobListingGrid.querySelectorAll('.btn-quick-view').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const id = parseInt(btn.getAttribute('data-id'), 10);
        const job = JOBS_DATA.find(j => j.id === id);
        if (jobSplitContainer && getComputedStyle(jobSplitContainer).display !== 'none') {
          openSplitView(id);
        } else {
          window.location.href = `chi-tiet-viec-lam.html?id=${id}&title=${encodeURIComponent(job?.title || '')}${getDetailKeywordParam()}`;
        }
      });
    });

    // Hide Button -> Fade out card with feedback
    jobListingGrid.querySelectorAll('.btn-card-hide').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const card = btn.closest('.job-card');
        if (card) {
          card.style.transition = 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)';
          card.style.opacity = '0';
          card.style.transform = 'scale(0.95)';
          setTimeout(() => {
            card.style.display = 'none';
            showToast('Đã ẩn việc làm này khỏi danh sách gợi ý', '✓');
          }, 300);
        }
      });
    });

    // Apply Button -> Fast Action feedback
    jobListingGrid.querySelectorAll('.btn-card-apply').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const id = parseInt(btn.getAttribute('data-id'), 10);
        const job = JOBS_DATA.find(j => j.id === id);
        showToast(`Ứng tuyển thành công vị trí "${job?.title || 'công việc'}"! Nhà tuyển dụng sẽ phản hồi sớm.`, '🚀');
      });
    });

    // Bookmark Toggle with LocalStorage persistence
    jobListingGrid.querySelectorAll('.btn-card-bookmark').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const id = parseInt(btn.getAttribute('data-id'), 10);
        let savedIds = getSavedJobs();
        const card = btn.closest('.job-card');
        const title = card?.querySelector('.job-title')?.textContent.trim() || 'công việc';

        if (savedIds.includes(id)) {
          savedIds = savedIds.filter(item => item !== id);
          btn.classList.remove('saved');
          const svg = btn.querySelector('svg');
          if (svg) svg.setAttribute('fill', 'none');
          showToast(`Đã bỏ lưu "${title}"`, 'ℹ️');
        } else {
          savedIds.push(id);
          btn.classList.add('saved');
          const svg = btn.querySelector('svg');
          if (svg) svg.setAttribute('fill', 'currentColor');
          showToast(`Đã lưu "${title}" vào mục yêu thích!`, '❤️');
        }
        setSavedJobs(savedIds);
        if (activeViewMode === 'split' && selectedJobId === id) {
          updateDetailBookmarkButtons(id);
        }
      });
    });
  }

  // =========================================================================
  // 7. 2-BLOCK SPLIT VIEW ENGINE (BÊN TRÁI: DANH SÁCH JOB - BÊN PHẢI: MÔ TẢ JOB)
  // =========================================================================
  function openSplitView(jobId) {
    const job = JOBS_DATA.find(j => j.id === jobId) || currentFilteredJobs[0] || JOBS_DATA[0];
    if (!job) return;

    selectedJobId = job.id;
    activeViewMode = 'split';

    // Ẩn layout lưới mặc định, hiện layout 2 khối
    if (jobDefaultLayout) jobDefaultLayout.style.display = 'none';
    if (jobSplitContainer) jobSplitContainer.style.display = 'grid';

    // Cập nhật trạng thái nút toggle chế độ xem
    if (btnViewGrid) btnViewGrid.classList.remove('active');
    if (btnViewSplit) btnViewSplit.classList.add('active');

    // 1. Render khối bên phải: Mô tả chi tiết job đó
    renderSplitDetail(job);

    // 2. Render khối bên trái: Danh sách job
    renderSplitList();

    // 3. Cập nhật query param trên URL
    if (window.history && window.history.pushState) {
      const currentUrl = new URL(window.location.href);
      currentUrl.searchParams.set('jobId', job.id);
      window.history.pushState({ jobId: job.id, view: 'split' }, '', currentUrl.toString());
    }

    // Cuộn mượt lên vị trí split container
    const heroBox = document.querySelector('.job-search-hero');
    const scrollTarget = heroBox ? heroBox.offsetHeight - 20 : 200;
    window.scrollTo({ top: scrollTarget, behavior: 'smooth' });
  }

  function closeSplitView(updateUrl = true) {
    activeViewMode = 'grid';
    selectedJobId = null;

    if (jobDefaultLayout) jobDefaultLayout.style.display = 'grid';
    if (jobSplitContainer) jobSplitContainer.style.display = 'none';

    if (btnViewGrid) btnViewGrid.classList.add('active');
    if (btnViewSplit) btnViewSplit.classList.remove('active');

    if (updateUrl && window.history && window.history.pushState) {
      const currentUrl = new URL(window.location.href);
      currentUrl.searchParams.delete('jobId');
      window.history.pushState({ view: 'grid' }, '', currentUrl.toString());
    }
    scrollToListingTop();
  }

  function renderSplitDetail(job) {
    if (!job) return;

    const detailCompanyLogo = document.getElementById('detailCompanyLogo');
    const detailJobTitle = document.getElementById('detailJobTitle');
    const detailCompanyName = document.getElementById('detailCompanyName');
    const detailAiMatchBadge = document.getElementById('detailAiMatchBadge');
    const detailSalaryBadge = document.getElementById('detailSalaryBadge');
    const detailLocationText = document.getElementById('detailLocationText');
    const detailUpdatedText = document.getElementById('detailUpdatedText');

    const metricSalary = document.getElementById('metricSalary');
    const metricExp = document.getElementById('metricExp');
    const metricLevel = document.getElementById('metricLevel');
    const metricType = document.getElementById('metricType');

    const detailDescList = document.getElementById('detailDescList');
    const detailReqsList = document.getElementById('detailReqsList');
    const detailPerksList = document.getElementById('detailPerksList');
    const detailSkillsWrap = document.getElementById('detailSkillsWrap');

    const detailCompanyCardLogo = document.getElementById('detailCompanyCardLogo');
    const detailCompanyCardTitle = document.getElementById('detailCompanyCardTitle');

    const stickyJobTitle = document.getElementById('stickyJobTitle');
    const stickySalary = document.getElementById('stickySalary');
    const btnOpenSinglePage = document.getElementById('btnOpenSinglePage');

    if (detailCompanyLogo) {
      detailCompanyLogo.src = job.logo;
      detailCompanyLogo.alt = job.company;
    }
    if (detailJobTitle) detailJobTitle.textContent = job.title;
    if (detailCompanyName) detailCompanyName.textContent = job.company;
    if (detailAiMatchBadge) detailAiMatchBadge.style.display = 'none';
    if (detailSalaryBadge) {
      detailSalaryBadge.textContent = job.salaryBadge;
      if (job.salaryIsOrange) detailSalaryBadge.classList.add('orange');
      else detailSalaryBadge.classList.remove('orange');
    }
    if (detailLocationText) detailLocationText.textContent = job.location;
    if (detailUpdatedText) detailUpdatedText.textContent = `Cập nhật ${job.updated}`;

    // Metrics
    if (metricSalary) metricSalary.textContent = job.salaryBadge;
    if (metricExp) {
      const expMap = { '0': 'Không yêu cầu', 'under1': 'Dưới 1 năm', '1-3': '1 - 3 năm', '3-5': '3 - 5 năm', 'over5': 'Trên 5 năm' };
      metricExp.textContent = expMap[job.exp] || `${job.exp} năm`;
    }
    if (metricLevel) {
      const levelMap = { 'intern': 'Thực tập sinh', 'junior': 'Nhân viên', 'senior': 'Trưởng nhóm / Senior', 'manager': 'Trưởng phòng / Manager' };
      metricLevel.textContent = levelMap[job.level] || job.level;
    }
    if (metricType) {
      const typeMap = { 'fulltime': 'Toàn thời gian', 'hybrid': 'Kết hợp (Hybrid)', 'remote': 'Từ xa (Remote 100%)', 'parttime': 'Bán thời gian' };
      metricType.textContent = typeMap[job.type] || job.type;
    }

    // JD sections
    if (detailDescList && job.jd && job.jd.desc) {
      detailDescList.innerHTML = job.jd.desc.map(d => `<li>${d}</li>`).join('');
    }
    if (detailReqsList && job.jd && job.jd.reqs) {
      detailReqsList.innerHTML = job.jd.reqs.map(r => `<li>${r}</li>`).join('');
    }
    if (detailPerksList && job.jd && job.jd.perks) {
      detailPerksList.innerHTML = job.jd.perks.map(p => `<li>${p}</li>`).join('');
    }
    if (detailSkillsWrap && job.skills) {
      detailSkillsWrap.innerHTML = job.skills.map(s => `<span class="detail-skill-tag">${s}</span>`).join('');
    }

    // Company Card
    if (detailCompanyCardLogo) detailCompanyCardLogo.src = job.logo;
    if (detailCompanyCardTitle) detailCompanyCardTitle.textContent = job.company;

    // Sticky bar
    if (stickyJobTitle) stickyJobTitle.textContent = job.title;
    if (stickySalary) stickySalary.textContent = job.salaryBadge;

    // Link to single page
    if (btnOpenSinglePage) {
      btnOpenSinglePage.href = `chi-tiet-viec-lam.html?id=${job.id}`;
    }

    // Bookmark state for detail panel
    updateDetailBookmarkButtons(job.id);
  }

  function renderSplitList() {
    const splitJobCount = document.getElementById('splitJobCount');
    const splitListFeed = document.getElementById('splitListFeed');
    if (!splitListFeed) return;

    if (splitJobCount) {
      const matchCount = currentFilteredJobs.filter(j => j._isSearchMatch).length;
      if (matchCount > 0) {
        splitJobCount.innerHTML = `${currentFilteredJobs.length} <span style="font-size: 11.5px; font-weight: 600; color: #2C9661;">(${matchCount} khớp)</span>`;
      } else {
        splitJobCount.textContent = currentFilteredJobs.length;
      }
    }

    if (currentFilteredJobs.length === 0) {
      splitListFeed.innerHTML = `
        <div style="padding: 36px 16px; text-align: center; color: #545454;">
          <p style="margin: 0 0 10px 0; font-weight: 600;">Không có việc làm phù hợp</p>
          <button type="button" class="btn-reset-filters" id="btnResetSplitSearch" style="font-size: 13px;">Xem lại tất cả việc làm</button>
        </div>
      `;
      document.getElementById('btnResetSplitSearch')?.addEventListener('click', () => {
        if (searchInput) searchInput.value = '';
        applyJobFilters(true, true);
      });
      return;
    }

    const savedIds = getSavedJobs();
    const itemsHtml = currentFilteredJobs.map(job => {
      const isSelected = job.id === selectedJobId;
      const salaryOrangeClass = job.salaryIsOrange ? 'orange' : '';

      return `
        <div class="split-job-card ${isSelected ? 'is-selected' : ''}" data-id="${job.id}">
          ${isSelected ? `<span class="split-active-badge">👁 Đang xem</span>` : ''}
          <div class="split-card-top">
            <img src="${job.logo}" alt="${job.company}" class="split-company-logo" loading="lazy" />
            <div class="split-card-info">
              <h4 class="split-card-title">
                <a href="chi-tiet-viec-lam.html?id=${job.id}&title=${encodeURIComponent(job.title)}" class="job-title-link" title="Xem chi tiết ${job.title}">${job.title}</a>
              </h4>
              <div class="split-card-company">${job.company}</div>
              <div class="split-card-badges">
                <span class="job-salary-badge ${salaryOrangeClass}" style="font-size: 12px; padding: 2px 7px;">${job.salaryBadge}</span>
              </div>
            </div>
          </div>
          <div class="split-card-bottom">
            <span class="split-card-location">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
              <span>${job.city}</span>
            </span>
            <span style="font-size: 11.5px; color: #8A8A8A;">${job.updated}</span>
          </div>
        </div>
      `;
    }).join('');

    splitListFeed.innerHTML = itemsHtml;

    // Attach card click handlers in the left list feed
    splitListFeed.querySelectorAll('.split-job-card').forEach(card => {
      card.addEventListener('click', (e) => {
        // If clicking directly on title link, allow default tab opening
        if (e.target.closest('.job-title-link')) return;
        const id = parseInt(card.getAttribute('data-id'), 10);
        if (id && id !== selectedJobId) {
          openSplitView(id);
          const scrollArea = document.getElementById('detailScrollArea');
          if (scrollArea) scrollArea.scrollTo({ top: 0, behavior: 'smooth' });
        }
      });
    });
  }

  function updateDetailBookmarkButtons(jobId) {
    const savedIds = getSavedJobs();
    const isSaved = savedIds.includes(jobId);

    const btnDetailBookmark = document.getElementById('btnDetailBookmark');
    const detailBookmarkText = document.getElementById('detailBookmarkText');
    const btnDetailSaveCard = document.getElementById('btnDetailSaveCard');
    const detailSaveBtnText = document.getElementById('detailSaveBtnText');

    if (btnDetailBookmark) {
      if (isSaved) {
        btnDetailBookmark.classList.add('saved');
        btnDetailBookmark.querySelector('svg')?.setAttribute('fill', 'currentColor');
        if (detailBookmarkText) detailBookmarkText.textContent = 'Đã lưu';
      } else {
        btnDetailBookmark.classList.remove('saved');
        btnDetailBookmark.querySelector('svg')?.setAttribute('fill', 'none');
        if (detailBookmarkText) detailBookmarkText.textContent = 'Lưu tin';
      }
    }

    if (btnDetailSaveCard) {
      if (isSaved) {
        btnDetailSaveCard.classList.add('saved');
        btnDetailSaveCard.querySelector('svg')?.setAttribute('fill', 'currentColor');
        if (detailSaveBtnText) detailSaveBtnText.textContent = 'Đã lưu công việc';
      } else {
        btnDetailSaveCard.classList.remove('saved');
        btnDetailSaveCard.querySelector('svg')?.setAttribute('fill', 'none');
        if (detailSaveBtnText) detailSaveBtnText.textContent = 'Lưu';
      }
    }
  }

  function toggleDetailBookmark(jobId) {
    let savedIds = getSavedJobs();
    const job = JOBS_DATA.find(j => j.id === jobId);
    const title = job ? job.title : 'công việc';

    if (savedIds.includes(jobId)) {
      savedIds = savedIds.filter(id => id !== jobId);
      setSavedJobs(savedIds);
      updateDetailBookmarkButtons(jobId);
      renderCurrentPage(); // sync with grid
      showToast(`Đã bỏ lưu "${title}"`, 'ℹ️');
    } else {
      savedIds.push(jobId);
      setSavedJobs(savedIds);
      updateDetailBookmarkButtons(jobId);
      renderCurrentPage(); // sync with grid
      showToast(`Đã lưu "${title}" vào mục yêu thích!`, '❤️');
    }
  }

  // =========================================================================
  // 7. DETAIL MODAL (DYNAMIC CONTENT INJECTION)
  // =========================================================================
  function openJobModalById(id) {
    const job = JOBS_DATA.find(j => j.id === id);
    if (!job || !jobModalBackdrop) return;

    if (modalJobTitle) modalJobTitle.textContent = job.title;
    if (modalCompanyName) modalCompanyName.textContent = job.company;
    if (modalSalary) modalSalary.textContent = job.salaryBadge;
    if (modalLocation) modalLocation.textContent = job.location;
    if (modalAiBadge) modalAiBadge.style.display = 'none';

    if (modalBadgesRow) {
      modalBadgesRow.innerHTML = job.skills
        .map(s => `<span class="job-skill-chip" style="font-size: 12.5px; padding: 4px 10px;">${s}</span>`)
        .join('');
    }

    if (modalJobDescList) {
      modalJobDescList.innerHTML = job.jd.desc.map(d => `<li>${d}</li>`).join('');
    }
    if (modalJobReqsList) {
      modalJobReqsList.innerHTML = job.jd.reqs.map(r => `<li>${r}</li>`).join('');
    }
    if (modalJobPerksList) {
      modalJobPerksList.innerHTML = job.jd.perks.map(p => `<li>${p}</li>`).join('');
    }

    jobModalBackdrop.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeJobModal() {
    if (!jobModalBackdrop) return;
    jobModalBackdrop.classList.remove('open');
    document.body.style.overflow = '';
  }

  jobModalClose?.addEventListener('click', closeJobModal);
  jobModalBackdrop?.addEventListener('click', (e) => {
    if (e.target === jobModalBackdrop) closeJobModal();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && jobModalBackdrop?.classList.contains('open')) {
      closeJobModal();
    }
  });

  btnModalApply?.addEventListener('click', () => {
    const title = modalJobTitle ? modalJobTitle.textContent : 'vị trí';
    showToast(`Ứng tuyển thành công vị trí "${title}"! Nhà tuyển dụng sẽ phản hồi sớm.`, '🚀');
    closeJobModal();
  });

  // =========================================================================
  // 8. TOP FILTER BAR CONTROLLER
  // =========================================================================
  function closeAllFilterDropdowns() {
    document.querySelectorAll('.filter-dropdown-menu').forEach(menu => {
      menu.hidden = true;
    });
    document.querySelectorAll('.filter-pill-btn').forEach(btn => {
      btn.setAttribute('aria-expanded', 'false');
    });
    document.querySelectorAll('.filter-dropdown-wrap').forEach(wrap => {
      wrap.classList.remove('is-open');
    });
    // Reset industry search khi đóng
    const industryInput = document.getElementById('industrySearchInput');
    if (industryInput && industryInput.value) {
      industryInput.value = '';
      // Hiện lại tất cả items
      const list = document.getElementById('industryDropdownList');
      list?.querySelectorAll('.dropdown-item').forEach(i => { i.hidden = false; });
      const noRes = document.getElementById('industryNoResults');
      if (noRes) noRes.hidden = true;
      const clearBtn = document.getElementById('industrySearchClear');
      if (clearBtn) clearBtn.hidden = true;
    }
  }

  // Nhãn pill: 0 lựa chọn → tên tiêu chí; 1 lựa chọn → tên lựa chọn; ≥2 → "Cấp bậc (2)"
  function updateFilterPillUI(type, value, label) {
    const btn = document.getElementById(`${type}FilterBtn`);
    const labelSpan = document.getElementById(`${type}FilterLabel`);
    if (!btn || !labelSpan) return;

    const values = MULTI_FILTER_TYPES.includes(type) ? parseMultiValue(value) : (value ? [value] : []);
    const defaultLabel = FILTER_DEFAULT_LABELS[type] || 'Bộ lọc';
    if (values.length === 0) {
      btn.classList.remove('is-active');
      labelSpan.textContent = defaultLabel;
      btn.removeAttribute('title');
    } else if (values.length === 1) {
      btn.classList.add('is-active');
      labelSpan.textContent = MULTI_FILTER_TYPES.includes(type) ? getFilterOptionLabel(type, values[0]) : label;
      btn.title = `${defaultLabel}: ${labelSpan.textContent}`;
    } else {
      btn.classList.add('is-active');
      labelSpan.textContent = `${defaultLabel} (${values.length})`;
      btn.title = `${defaultLabel}: ${values.map(v => getFilterOptionLabel(type, v)).join(', ')}`;
    }
  }

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

  function resetAllTopFilters(triggerFilter = true) {
    selectedExp = '';
    selectedSalary = '';
    selectedLevel = '';
    selectedType = '';
    selectedSaturday = '';

    MULTI_FILTER_TYPES.forEach(type => {
      updateFilterPillUI(type, '', '');
      syncFilterDropdownSelection(type);
    });

    renderActiveFilterChips();
    closeAllFilterDropdowns();

    if (triggerFilter) {
      applyJobFilters(true, true);
    }
  }

  function initTopFilterBar() {
    // 1a. Desktop: rê chuột vào nút lọc là mở menu để chọn luôn; rời khỏi (nút + menu) 200ms thì đóng
    const canHoverOpen = () => window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    document.querySelectorAll('.top-filter-bar .filter-dropdown-wrap').forEach(wrap => {
      const btn = wrap.querySelector('.filter-pill-btn');
      const menu = wrap.querySelector('.filter-dropdown-menu');
      if (!btn || !menu) return;
      let closeTimer = null;
      wrap.addEventListener('mouseenter', () => {
        if (!canHoverOpen()) return;
        clearTimeout(closeTimer);
        if (!menu.hidden) return;
        closeAllFilterDropdowns();
        menu.hidden = false;
        btn.setAttribute('aria-expanded', 'true');
        wrap.classList.add('is-open');
        wrap.dataset.hoverOpenedAt = String(Date.now());
      });
      wrap.addEventListener('mouseleave', () => {
        if (!canHoverOpen() || menu.hidden) return;
        // Đang gõ tìm lĩnh vực thì không tự đóng
        if (wrap.contains(document.activeElement) && document.activeElement.tagName === 'INPUT') return;
        closeTimer = setTimeout(() => {
          if (!menu.hidden) closeAllFilterDropdowns();
        }, 200);
      });
    });

    // 1. Dropdown Pill Buttons click
    document.querySelectorAll('.filter-pill-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const wrap = btn.closest('.filter-dropdown-wrap');
        const menu = wrap?.querySelector('.filter-dropdown-menu');
        if (!menu) return;

        // Vừa mở bằng hover thì cú click ngay sau đó không đóng menu lại
        if (!menu.hidden && Date.now() - Number(wrap.dataset.hoverOpenedAt || 0) < 600) {
          if (menu.id === 'industryDropdownMenu') document.getElementById('industrySearchInput')?.focus();
          return;
        }

        const isCurrentlyOpen = !menu.hidden;
        closeAllFilterDropdowns();

        if (!isCurrentlyOpen) {
          menu.hidden = false;
          btn.setAttribute('aria-expanded', 'true');
          wrap.classList.add('is-open');

          // Nếu là industry dropdown → focus vào ô tìm kiếm
          if (menu.id === 'industryDropdownMenu') {
            const searchInput = document.getElementById('industrySearchInput');
            if (searchInput) {
              requestAnimationFrame(() => searchInput.focus());
            }
          }
        }
      });
    });

    // 1b. Industry search input logic
    (function setupIndustrySearch() {
      const searchInput  = document.getElementById('industrySearchInput');
      const clearBtn     = document.getElementById('industrySearchClear');
      const list         = document.getElementById('industryDropdownList');
      const noResults    = document.getElementById('industryNoResults');
      if (!searchInput || !list) return;

      function filterIndustryItems(q) {
        const query = q.trim().toLowerCase();
        const items = list.querySelectorAll('.dropdown-item');
        let visibleCount = 0;
        items.forEach(item => {
          const label = (item.getAttribute('data-label') || item.querySelector('span')?.textContent || '').toLowerCase();
          const match = !query || label.includes(query);
          item.hidden = !match;
          if (match) visibleCount++;
        });
        if (noResults) noResults.hidden = visibleCount > 0;
        if (clearBtn)  clearBtn.hidden  = !query;
      }

      searchInput.addEventListener('input', () => filterIndustryItems(searchInput.value));
      searchInput.addEventListener('keydown', e => e.stopPropagation()); // chặn phím tắt

      if (clearBtn) {
        clearBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          searchInput.value = '';
          filterIndustryItems('');
          searchInput.focus();
        });
      }

      // Reset search khi dropdown đóng
      const origClose = window._closeAllFilterDropdowns;
      const origCloseRef = closeAllFilterDropdowns;
    })();

    // 2. Dropdown Items click
    document.querySelectorAll('.filter-dropdown-menu .dropdown-item').forEach(item => {
      item.addEventListener('click', (e) => {
        e.stopPropagation();
        const type = item.getAttribute('data-type');
        const value = item.getAttribute('data-value') || '';
        const label = item.getAttribute('data-label') || item.querySelector('span')?.textContent.trim() || '';

        // Bộ lọc tiêu chí: bấm để bật/tắt từng lựa chọn, menu giữ mở để chọn tiếp
        if (MULTI_FILTER_TYPES.includes(type)) {
          const current = parseMultiValue(getFilterValue(type));
          const next = !value ? [] : (current.includes(value) ? current.filter(v => v !== value) : [...current, value]);
          setFilterValue(type, next.join(','));
          syncFilterDropdownSelection(type);
          updateFilterPillUI(type, getFilterValue(type), label);
          renderActiveFilterChips();
          applyJobFilters(true, true);
          const summary = next.length ? next.map(v => getFilterOptionLabel(type, v)).join(', ') : 'Tất cả';
          showToast(`Đã lọc theo ${FILTER_DEFAULT_LABELS[type]}: ${summary}`, '✓');
          return;
        }

        if (type === 'exp') selectedExp = value;
        else if (type === 'salary') selectedSalary = value;
        else if (type === 'level') selectedLevel = value;
        else if (type === 'type') selectedType = value;
        else if (type === 'saturday') selectedSaturday = value;

        // Update selection UI inside menu
        const menu = item.closest('.filter-dropdown-menu');
        menu?.querySelectorAll('.dropdown-item').forEach(i => {
          i.classList.remove('is-selected');
          i.querySelector('.check-icon')?.remove();
        });
        item.classList.add('is-selected');
        item.insertAdjacentHTML('beforeend', '<svg class="check-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg>');

        updateFilterPillUI(type, value, label);
        closeAllFilterDropdowns();
        renderActiveFilterChips();
        applyJobFilters(true, true);

        showToast(`Đã lọc theo ${FILTER_DEFAULT_LABELS[type]}: ${value ? label : 'Tất cả'}`, '✓');
      });
    });

    // 3. Clear All button & Clear inline button
    document.getElementById('btnClearTopFilters')?.addEventListener('click', () => {
      resetAllTopFilters(true);
      showToast('Đã xóa tất cả bộ lọc tiêu chí', '✓');
    });

    document.getElementById('btnClearChipsInline')?.addEventListener('click', () => {
      resetAllTopFilters(true);
      showToast('Đã xóa tất cả bộ lọc tiêu chí', '✓');
    });

    // 4. Delegate click on chip remove
    document.getElementById('activeChipsList')?.addEventListener('click', (e) => {
      const removeBtn = e.target.closest('.filter-chip-remove');
      if (!removeBtn) return;
      const clearType = removeBtn.getAttribute('data-clear-type');
      if (!clearType) return;

      if (clearType === 'exp') selectedExp = '';
      else if (clearType === 'salary') selectedSalary = '';
      else if (clearType === 'level') selectedLevel = '';
      else if (clearType === 'type') selectedType = '';
      else if (clearType === 'saturday') selectedSaturday = '';

      updateFilterPillUI(clearType, '', '');
      syncFilterDropdownSelection(clearType);

      renderActiveFilterChips();
      applyJobFilters(true, true);
      showToast(`Đã bỏ lọc ${FILTER_DEFAULT_LABELS[clearType]}`, '✓');
    });

    // 5. Click outside to close
    document.addEventListener('click', (e) => {
      if (!e.target.closest('.filter-dropdown-wrap')) {
        closeAllFilterDropdowns();
      }
    });

    // 6. Escape key to close
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        closeAllFilterDropdowns();
      }
    });
  }

  // =========================================================================
  // 9. EVENT LISTENERS & POPSTATE (BACK / FORWARD SUPPORT)
  // =========================================================================

    // =========================================================================
  // RECENT SEARCHES & SUGGEST DROPDOWN (Đồng bộ hoàn chỉnh từ Trang chủ)
  // =========================================================================
  const RECENT_SEARCH_KEY = 'easycv_recent_searches_v2';
  const DEFAULT_HISTORY = [
    { keyword: 'ReactJS Developer', count: 156 },
    { keyword: 'Telesales', count: 280 },
    { keyword: 'Marketing Leader', count: 92 },
    { keyword: 'UI/UX Designer', count: 143 },
    { keyword: 'Java Spring Boot', count: 67 },
    { keyword: 'Kế toán tổng hợp', count: 184 }
  ];

  const POPULAR_KEYWORDS = ['Telesales', 'Kinh doanh', 'Java Spring', 'Marketing', 'Kế toán'];

  const POPULAR_COMPANIES = [
    { name: 'Tập đoàn Công nghiệp - Viễn thông Quân đội (Viettel)', shortName: 'Viettel' },
    { name: 'Tập đoàn Công nghiệp Viettel', shortName: 'Viettel' },
    { name: 'Tổng Công ty Viễn thông Viettel (Viettel Telecom)', shortName: 'Viettel Telecom' },
    { name: 'Tổng Công ty Cổ phần Bưu chính Viettel (Viettel Post)', shortName: 'Viettel Post' },
    { name: 'Tổng Công ty Giải pháp Doanh nghiệp Viettel (Viettel Solutions)', shortName: 'Viettel Solutions' },
    { name: 'FPT Software', shortName: 'FPT Software' },
    { name: 'TẬP ĐOÀN CÔNG NGHỆ FPT', shortName: 'FPT' },
    { name: 'Công ty Cổ phần Viễn thông FPT (FPT Telecom)', shortName: 'FPT Telecom' },
    { name: 'FPT Digital (Tập đoàn FPT)', shortName: 'FPT Digital' },
    { name: 'VNG Corporation (Zalo Team)', shortName: 'VNG' },
    { name: 'Zalo Group (VNG)', shortName: 'Zalo' },
    { name: 'Ngân hàng Techcombank', shortName: 'Techcombank' },
    { name: 'Ngân hàng TMCP Quân Đội (MB Bank)', shortName: 'MB Bank' },
    { name: 'Ngân Hàng TMCP Việt Nam Thịnh Vượng (VPBank)', shortName: 'VPBank' },
    { name: 'Shopee Vietnam (SPX Express)', shortName: 'Shopee' },
    { name: 'Ví điện tử MoMo (M-Service)', shortName: 'MoMo' },
    { name: 'Công ty Cổ phần Giải pháp Thanh toán Việt Nam (VNPAY)', shortName: 'VNPAY' },
    { name: 'Tập đoàn Vingroup (Vinhomes)', shortName: 'Vingroup' },
    { name: 'VinFast Auto', shortName: 'VinFast' },
    { name: 'VinAI Research (Tập đoàn Vingroup)', shortName: 'VinAI' },
    { name: 'Tiki Corporation (Tiki Tech Hub)', shortName: 'Tiki' },
    { name: 'Tập đoàn Masan (Masan Consumer)', shortName: 'Masan' },
    { name: 'Masan Consumer Holdings', shortName: 'Masan' },
    { name: 'CMC Telecom', shortName: 'CMC' },
    { name: 'Base.vn (Nền tảng Quản trị Doanh nghiệp)', shortName: 'Base.vn' },
    { name: 'One Mount Group (Hệ sinh thái VinID & VinShop)', shortName: 'One Mount' },
    { name: 'KMS Technology Vietnam', shortName: 'KMS Technology' },
    { name: 'NashTech Vietnam', shortName: 'NashTech' },
    { name: 'Bosch Global Software Technologies (Bosch Việt Nam)', shortName: 'Bosch' },
    { name: 'Unilever Việt Nam', shortName: 'Unilever' },
    { name: 'Công ty Cổ phần Sữa Việt Nam (Vinamilk)', shortName: 'Vinamilk' },
    { name: 'Công ty Cổ phần Chứng khoán SSI', shortName: 'SSI' },
    { name: 'CÔNG TY CỔ PHẦN TẬP ĐOÀN VIKIMCO', shortName: 'Vikimco' },
    { name: 'Tập đoàn Mai Linh', shortName: 'Mai Linh' },
    { name: 'Tập đoàn Đất Xanh', shortName: 'Đất Xanh' },
    { name: 'Tập đoàn Tân Á Đại Thành', shortName: 'Tân Á Đại Thành' },
    { name: 'Grab Việt Nam', shortName: 'Grab' },
    { name: 'Bee Logistics Corporation', shortName: 'Bee Logistics' },
    { name: 'Samsung Electronics HCMC', shortName: 'Samsung' },
    { name: 'VCCorp Corporation', shortName: 'VCCorp' },
    { name: 'Dentsu Creative Vietnam', shortName: 'Dentsu' },
    { name: 'Gemadept Logistics', shortName: 'Gemadept' }
  ];

  const ALL_SUGGESTIONS = [
    { keyword: 'Kiến trúc sư', count: 94 },
    { keyword: 'Kỹ sư kiến trúc', count: 45 },
    { keyword: 'Thiết kế nội thất', count: 86 },
    { keyword: 'Kỹ sư xây dựng', count: 115 },
    { keyword: 'Chỉ huy trưởng công trình', count: 52 },
    { keyword: 'Tư vấn thiết kế xây dựng', count: 48 },
    { keyword: 'Kinh doanh thiết bị/vật liệu xây dựng', count: 64 },
    { keyword: 'Kinh doanh nội thất', count: 72 },
    { keyword: 'ReactJS Developer', count: 156 },
    { keyword: 'Frontend Developer', count: 165 },
    { keyword: 'Backend Developer (Java/Node)', count: 142 },
    { keyword: 'Fullstack Developer', count: 128 },
    { keyword: 'Mobile Developer (Flutter / iOS)', count: 96 },
    { keyword: 'UI/UX Designer', count: 143 },
    { keyword: 'Product Designer', count: 88 },
    { keyword: 'Business Analyst (BA)', count: 143 },
    { keyword: 'Data Analyst', count: 118 },
    { keyword: 'Data Engineer', count: 79 },
    { keyword: 'AI / Machine Learning Engineer', count: 95 },
    { keyword: 'Tester / QA QC', count: 172 },
    { keyword: 'Marketing Leader', count: 92 },
    { keyword: 'Digital Marketing', count: 215 },
    { keyword: 'Content Marketing', count: 164 },
    { keyword: 'SEO Specialist', count: 98 },
    { keyword: 'Telesales', count: 280 },
    { keyword: 'Nhân viên kinh doanh', count: 420 },
    { keyword: 'Sales B2B', count: 165 },
    { keyword: 'Chăm sóc khách hàng', count: 310 },
    { keyword: 'Kế toán tổng hợp', count: 184 },
    { keyword: 'Kế toán thuế', count: 125 },
    { keyword: 'Chuyên viên tuyển dụng (HR)', count: 152 },
    { keyword: 'Hành chính nhân sự', count: 205 },
    { keyword: 'Quản lý nhà hàng', count: 78 },
    { keyword: 'Nhân viên xuất nhập khẩu', count: 132 },
    { keyword: 'Sales Logistics', count: 110 }
  ];

  const RECOMMENDED_JOBS_POOL = [
    // 1. Sales & Kinh doanh
    {
      id: 1,
      logo: 'assets/logos/company-vikimco-64.svg',
      title: 'Giám Đốc Kinh Doanh Vikimco Toàn Quốc',
      company: 'CÔNG TY CỔ PHẦN TẬP ĐOÀN VIKIMCO',
      salary: '$1,000–1,500 / tháng',
      location: 'Hà Nội & Toàn quốc',
      category: 'sales',
      skills: ['Sales', 'Kinh doanh', 'B2B', 'Quản lý'],
      isPartner: true,
      postedDaysAgo: 1,
      interactionScore: 96
    },
    {
      id: 2,
      logo: 'assets/logos/company-vikimco-64.svg',
      title: 'Chuyên Viên Khách Hàng Doanh Nghiệp (RM)',
      company: 'Ngân hàng Techcombank',
      salary: '20 - 35 triệu',
      location: 'Hà Nội',
      category: 'sales',
      skills: ['Sales B2B', 'Quan hệ khách hàng', 'Tài chính'],
      isPartner: true,
      postedDaysAgo: 2,
      interactionScore: 94
    },
    {
      id: 3,
      logo: 'assets/logos/company-techcombank.svg',
      title: 'Trưởng Phòng Kinh Doanh (B2B Sales Lead)',
      company: 'Tập đoàn Mai Linh',
      salary: '25 - 40 triệu',
      location: 'TP. Hồ Chí Minh',
      category: 'sales',
      skills: ['Sales B2B', 'Kinh doanh', 'Quản lý đội ngũ'],
      isPartner: true,
      postedDaysAgo: 3,
      interactionScore: 88
    },
    {
      id: 4,
      logo: 'assets/logos/company-mailinh.svg',
      title: 'Telesales Chuyên Nghiệp (Kinh Doanh & CSKH)',
      company: 'Công ty Cổ phần VNPAY',
      salary: '12 - 22 triệu',
      location: 'Hà Nội',
      category: 'sales',
      skills: ['Telesales', 'Bán hàng', 'Tư vấn', 'Sales'],
      isPartner: true,
      postedDaysAgo: 1,
      interactionScore: 92
    },
    {
      id: 5,
      logo: 'assets/logos/company-vnpay.svg',
      title: 'Sales Logistics & Cước Vận Tải Quốc Tế',
      company: 'Bee Logistics Corporation',
      salary: '15 - 30 triệu',
      location: 'Hải Phòng & TP. HCM',
      category: 'sales',
      skills: ['Sales Logistics', 'Xuất nhập khẩu', 'Cước tàu', 'Sales'],
      isPartner: false,
      postedDaysAgo: 2,
      interactionScore: 85
    },
    {
      id: 6,
      logo: 'assets/logos/company-beelogistics.svg',
      title: 'Chuyên Viên Kinh Doanh Bất Động Sản',
      company: 'Tập đoàn Đất Xanh',
      salary: '15 - 50 triệu',
      location: 'TP. Hồ Chí Minh',
      category: 'sales',
      skills: ['Sales BĐS', 'Bán hàng', 'Môi giới', 'Sales'],
      isPartner: true,
      postedDaysAgo: 4,
      interactionScore: 82
    },

    // 2. Kế toán & Tài chính
    {
      id: 7,
      logo: 'assets/logos/company-mua-he-64.png',
      title: 'Kế Toán Tổng Hợp (Mảng Giải Trí)',
      company: 'CÔNG TY TNHH TRUYỀN THÔNG MÙA HÈ',
      salary: '20 - 25 triệu',
      location: 'TP. Hồ Chí Minh',
      category: 'finance',
      skills: ['Kế toán', 'Báo cáo thuế', 'Tài chính'],
      isPartner: false,
      postedDaysAgo: 2,
      interactionScore: 86
    },
    {
      id: 8,
      logo: 'assets/logos/company-mua-he-64.png',
      title: 'Kế Toán Trưởng Doanh Nghiệp (Chief Accountant)',
      company: 'Samsung Electronics HCMC',
      salary: '35 - 50 triệu',
      location: 'TP. Hồ Chí Minh',
      category: 'finance',
      skills: ['Kế toán trưởng', 'Kiểm toán', 'Thuế'],
      isPartner: true,
      postedDaysAgo: 1,
      interactionScore: 97
    },
    {
      id: 9,
      logo: 'assets/logos/company-cmc.svg',
      title: 'Chuyên Viên Phân Tích Tài Chính & Đầu Tư',
      company: 'Công ty Chứng khoán SSI',
      salary: '25 - 40 triệu',
      location: 'Hà Nội',
      category: 'finance',
      skills: ['Phân tích tài chính', 'Đầu tư', 'Chứng khoán'],
      isPartner: true,
      postedDaysAgo: 3,
      interactionScore: 90
    },

    // 3. Công nghệ Thông tin (IT)
    {
      id: 10,
      logo: 'assets/logos/company-fpt-64.svg',
      title: 'Senior IT Infrastructure Officer',
      company: 'TẬP ĐOÀN CÔNG NGHỆ FPT',
      salary: 'Thương lượng',
      location: 'Hà Nội & Đà Nẵng',
      category: 'it',
      skills: ['IT', 'Infrastructure', 'Hạ tầng mạng', 'DevOps'],
      isPartner: true,
      postedDaysAgo: 1,
      interactionScore: 98
    },
    {
      id: 11,
      logo: 'assets/logos/company-fpt.svg',
      title: 'Senior Fullstack Developer (ReactJS / Node.js)',
      company: 'FPT Software',
      salary: '28 - 45 triệu',
      location: 'Đà Nẵng & Hà Nội',
      category: 'it',
      skills: ['ReactJS', 'Node.js', 'TypeScript', 'Frontend', 'Backend'],
      isPartner: true,
      postedDaysAgo: 1,
      interactionScore: 95
    },
    {
      id: 12,
      logo: 'assets/logos/company-fpt.svg',
      title: 'Senior Product Designer (UI/UX App/Web)',
      company: 'VNG Corporation (Zalo Team)',
      salary: '30 - 50 triệu',
      location: 'TP. Hồ Chí Minh',
      category: 'it',
      skills: ['UI/UX', 'Figma', 'Product Design', 'Web Design'],
      isPartner: true,
      postedDaysAgo: 2,
      interactionScore: 93
    },
    {
      id: 13,
      logo: 'assets/logos/company-zalo.svg',
      title: 'Data Analyst / Chuyên Viên Phân Tích Dữ Liệu',
      company: 'Shopee Vietnam',
      salary: '22 - 35 triệu',
      location: 'TP. Hồ Chí Minh',
      category: 'it',
      skills: ['Data Analyst', 'SQL', 'Python', 'PowerBI'],
      isPartner: true,
      postedDaysAgo: 2,
      interactionScore: 91
    },
    {
      id: 14,
      logo: 'assets/logos/company-shopee.svg',
      title: 'Backend Java Developer (Spring Boot / Microservices)',
      company: 'Tập đoàn Công nghiệp Viettel',
      salary: '25 - 42 triệu',
      location: 'Hà Nội',
      category: 'it',
      skills: ['Java', 'Spring Boot', 'Backend', 'Microservices'],
      isPartner: true,
      postedDaysAgo: 1,
      interactionScore: 96
    },

    // 4. Marketing & Truyền thông
    {
      id: 15,
      logo: 'assets/logos/company-viettel.svg',
      title: 'Trưởng Phòng Marketing & Truyền Thông',
      company: 'Masan Consumer Holdings',
      salary: '35 - 55 triệu',
      location: 'Bình Dương & TP. HCM',
      category: 'marketing',
      skills: ['Marketing', 'Brand', 'Chiến lược', 'Quản lý'],
      isPartner: true,
      postedDaysAgo: 1,
      interactionScore: 92
    },
    {
      id: 16,
      logo: 'assets/logos/company-masan.svg',
      title: 'Digital Marketing & Performance Ads Lead',
      company: 'VinFast Auto',
      salary: '25 - 40 triệu',
      location: 'Hải Phòng & Hà Nội',
      category: 'marketing',
      skills: ['Digital Marketing', 'Facebook Ads', 'Google Ads', 'SEO'],
      isPartner: true,
      postedDaysAgo: 2,
      interactionScore: 89
    },
    {
      id: 17,
      logo: 'assets/logos/company-vinfast.svg',
      title: 'Content Marketing Lead & Sáng Tạo Nội Dung',
      company: 'VCCorp Corporation',
      salary: '18 - 28 triệu',
      location: 'Hà Nội',
      category: 'marketing',
      skills: ['Content Marketing', 'Copywriting', 'Social Media'],
      isPartner: false,
      postedDaysAgo: 3,
      interactionScore: 84
    },

    // 5. Ngành nghề khác (F&B, Kỹ thuật, Vận hành)
    {
      id: 18,
      logo: 'assets/logos/company-kimmari-64.svg',
      title: 'Quản Lý Nhà Hàng Kimmari Chicken',
      company: 'CHUỖI NHÀ HÀNG KIMMARI CHICKEN',
      salary: '15–25tr ₫/tháng',
      location: 'TP. Hồ Chí Minh',
      category: 'hospitality',
      skills: ['Quản lý', 'Nhà hàng', 'F&B', 'Dịch vụ'],
      isPartner: false,
      postedDaysAgo: 2,
      interactionScore: 81
    },
    {
      id: 19,
      logo: 'assets/logos/company-tanviet-64.svg',
      title: 'Technical Service Engineer – Industrial Printer',
      company: 'CÔNG TY TNHH THIẾT BỊ CÔNG NGHIỆP TÂN VIỆT',
      salary: 'Thương lượng',
      location: 'Bình Dương',
      category: 'eng',
      skills: ['Kỹ thuật', 'Bảo trì', 'Cơ điện'],
      isPartner: false,
      postedDaysAgo: 4,
      interactionScore: 78
    },
    {
      id: 20,
      logo: 'assets/logos/company-tanviet-64.svg',
      title: 'Chuyên Viên Tuyển Dụng & Đào Tạo (HR Specialist)',
      company: 'Vinamilk Corporation',
      salary: '18 - 26 triệu',
      location: 'TP. Hồ Chí Minh',
      category: 'hr',
      skills: ['Tuyển dụng', 'HR', 'Nhân sự', 'Đào tạo'],
      isPartner: true,
      postedDaysAgo: 2,
      interactionScore: 87
    }
  ];

  function escapeHtml(str) {
    return (str || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  function highlightMatch(text, query) {
    if (!query) return escapeHtml(text);
    const qClean = query.trim();
    const escaped = qClean.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp('(' + escaped + ')', 'gi');
    return escapeHtml(text).replace(regex, '<strong>$1</strong>');
  }

  function getKeywordJobCount(keyword) {
    const found = ALL_SUGGESTIONS.find(s => s.keyword.toLowerCase() === keyword.toLowerCase());
    if (found) return found.count;
    const norm = normalizeText(keyword);
    const count = JOBS_DATA.filter(j => normalizeText(`${j.title} ${j.skills.join(' ')}`).includes(norm)).length;
    return count > 0 ? count * 12 + 15 : 68;
  }

  function getRecentSearches() {
    try {
      const raw = localStorage.getItem(RECENT_SEARCH_KEY);
      if (!raw) return DEFAULT_HISTORY;
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed.map(item => {
          if (typeof item === 'string') {
            return { keyword: item, count: getKeywordJobCount(item) };
          }
          return { keyword: item.keyword, count: item.count || getKeywordJobCount(item.keyword) };
        });
      }
      return DEFAULT_HISTORY;
    } catch (e) {
      return DEFAULT_HISTORY;
    }
  }

  function saveRecentSearch(keyword) {
    if (!keyword || !keyword.trim()) return;
    const term = keyword.trim();
    try {
      let history = getRecentSearches();
      history = history.filter(h => h.keyword.toLowerCase() !== term.toLowerCase());
      history.unshift({ keyword: term, count: getKeywordJobCount(term) });
      if (history.length > 6) history = history.slice(0, 6);
      localStorage.setItem(RECENT_SEARCH_KEY, JSON.stringify(history));
      renderRecentSearches();
    } catch (e) {}
  }

  function removeRecentSearch(keyword) {
    try {
      let history = getRecentSearches();
      history = history.filter(h => h.keyword.toLowerCase() !== keyword.toLowerCase());
      localStorage.setItem(RECENT_SEARCH_KEY, JSON.stringify(history));
      renderRecentSearches();
    } catch (e) {}
  }

  function clearAllRecentSearches() {
    try {
      localStorage.setItem(RECENT_SEARCH_KEY, JSON.stringify([]));
      renderRecentSearches();
      showToast('Đã xóa toàn bộ lịch sử tìm kiếm', '🗑️');
    } catch (e) {}
  }

  // Inject 2-column search panel into searchSuggestDropdown if not already structured
  let searchFormatLeftEl = null;
  let suggestRecentSectionEl = null;
  let keywordSuggestionsSectionEl = null;
  let keywordSuggestionsListEl = null;
  let popularKeywordsWrapEl = null;
  let recentListEl = null;
  let recommendedJobListEl = null;

  function extractIndustryKeywords(query) {
    const normQ = normalizeText(query || '');
    if (!normQ) return [];
    const keywordsSet = new Set();
    const taxData = window.EasyCVCategoryData || [];

    taxData.forEach(cat => {
      const catNameNorm = normalizeText(cat.name || '');
      const popMatches = (cat.popularKeywords || []).filter(pk => normalizeText(pk).includes(normQ));

      if (catNameNorm.includes(normQ) || popMatches.length > 0) {
        keywordsSet.add(cat.name);
        (cat.popularKeywords || []).forEach(pk => keywordsSet.add(pk));
        (cat.subgroups || []).forEach(sg => {
          (sg.roles || []).slice(0, 3).forEach(r => keywordsSet.add(r));
        });
      } else {
        (cat.subgroups || []).forEach(sg => {
          const titleMatch = normalizeText(sg.title || '').includes(normQ);
          const roleMatches = (sg.roles || []).filter(r => normalizeText(r).includes(normQ));
          if (titleMatch || roleMatches.length > 0) {
            keywordsSet.add(cat.name);
            keywordsSet.add(sg.title);
            roleMatches.forEach(r => keywordsSet.add(r));
          }
        });
      }
    });

    return Array.from(keywordsSet);
  }

  function renderRecommendedJobs(query = '', container = recommendedJobListEl) {
    if (!container) return;
    const clean = normalizeText(query || '');
    const isTyping = clean.length >= 2;

    let jobsToDisplay = [];

    if (!isTyping) {
      // 1. Khi người dùng chưa nhập gì trong box tìm kiếm:
      // Hiển thị 5 thẻ job được đề xuất dựa vào dữ liệu người dùng:
      // - Hành vi gần đây: search job (recent searches), xem job, lưu job [trọng số cao]
      // - Dữ liệu hồ sơ và CV ứng viên [trọng số cao: IT, Sales, Marketing, Tài chính]
      // - Dữ liệu tính năng gợi ý việc làm [trọng số cao]
      // - Dữ liệu tín hiệu job: mới đăng, uy tín NTD, độ tương tác [trung bình]
      let recentKws = [];
      try {
        recentKws = getRecentSearches().map(item => normalizeText(typeof item === 'string' ? item : item.keyword));
      } catch (e) {}

      let savedJobIds = [];
      try {
        const rawSaved = localStorage.getItem('easycv_saved_jobs') || '[]';
        savedJobIds = JSON.parse(rawSaved);
      } catch (e) {}

      const scoredJobs = RECOMMENDED_JOBS_POOL.map(job => {
        let score = 50; // base score
        const jobTextNorm = normalizeText(`${job.title} ${job.company} ${job.category || ''} ${(job.skills || []).join(' ')}`);

        // Khớp hành vi search gần đây (+35 điểm)
        const matchedRecent = recentKws.some(kw => kw && jobTextNorm.includes(kw));
        if (matchedRecent) score += 35;

        // Khớp việc làm đã lưu hoặc đã xem (+30 điểm)
        if (Array.isArray(savedJobIds) && (savedJobIds.includes(job.id) || savedJobIds.includes(String(job.id)))) {
          score += 30;
        }

        // Dữ liệu hồ sơ/CV ứng viên (+25 điểm cho ngành trọng điểm)
        if (['sales', 'it', 'marketing', 'finance'].includes(job.category)) {
          score += 25;
        }

        // Tín hiệu job: uy tín NTD (+20 điểm)
        if (job.isPartner) score += 20;

        // Tín hiệu job: mới đăng (+15 điểm)
        if (job.postedDaysAgo && job.postedDaysAgo <= 2) score += 15;

        // Độ tương tác (+ điểm theo interactionScore)
        if (job.interactionScore) score += Math.round(job.interactionScore / 10);

        return { ...job, totalScore: score };
      });

      scoredJobs.sort((a, b) => b.totalScore - a.totalScore);
      jobsToDisplay = scoredJobs.slice(0, 5);
    } else {
      // 2. Khi người dùng đã bắt đầu nhập vào box tìm kiếm (từ ký tự thứ 2):
      // Đề xuất dựa vào từ khóa nhập và truy xuất vào dữ liệu ngành nghề có sẵn trong hệ thống
      const industryKeywords = extractIndustryKeywords(clean).map(kw => normalizeText(kw));

      const scoredJobs = RECOMMENDED_JOBS_POOL.map(job => {
        let score = 0;
        const titleNorm = normalizeText(job.title);
        const companyNorm = normalizeText(job.company);
        const catNorm = normalizeText(job.category || '');
        const skillsNorm = normalizeText((job.skills || []).join(' '));
        const fullJobText = `${titleNorm} ${companyNorm} ${catNorm} ${skillsNorm}`;

        // 1. Khớp trực tiếp title (+60 điểm)
        if (titleNorm.includes(clean)) score += 60;

        // 2. Khớp kỹ năng trực tiếp (+45 điểm)
        if (skillsNorm.includes(clean)) score += 45;

        // 3. Khớp từ khóa ngành nghề từ taxonomy hệ thống (+35 điểm)
        const matchedTaxonomy = industryKeywords.some(ikw => ikw && fullJobText.includes(ikw));
        if (matchedTaxonomy) score += 35;

        // 4. Khớp Category (+25 điểm)
        if (catNorm.includes(clean)) score += 25;

        // 5. Khớp Company (+15 điểm)
        if (companyNorm.includes(clean)) score += 15;

        // 6. Partial match từng từ (+10 điểm)
        const words = clean.split(/\s+/).filter(w => w.length > 1);
        const wordMatchCount = words.filter(w => fullJobText.includes(w)).length;
        score += wordMatchCount * 10;

        // Tín hiệu đối tác uy tín
        if (score > 0 && job.isPartner) score += 10;

        return { ...job, totalScore: score };
      });

      const matched = scoredJobs.filter(j => j.totalScore > 0);
      if (matched.length > 0) {
        matched.sort((a, b) => b.totalScore - a.totalScore);
        jobsToDisplay = matched.slice(0, 5);
      } else {
        // Fallback sang top 5 job tốt nhất
        jobsToDisplay = RECOMMENDED_JOBS_POOL.slice(0, 5);
      }
    }

    container.innerHTML = jobsToDisplay.map(job => `
      <button type="button" class="recommended-job" data-keyword="${escapeHtml(job.title)}" aria-label="Tìm ${escapeHtml(job.title)}, công ty ${escapeHtml(job.company)}, mức lương ${escapeHtml(job.salary)}, địa điểm ${escapeHtml(job.location || 'Toàn quốc')}">
        <span class="recommended-job-logo" aria-hidden="true" title="Công ty ${escapeHtml(job.company)} tuyển dụng tại EasyCV">
          <img src="${escapeHtml(job.logo)}" alt="${escapeHtml(job.company)}" width="50" height="50" loading="lazy" title="Công ty ${escapeHtml(job.company)} tuyển dụng tại EasyCV">
        </span>
        <div class="recommended-job-info">
          <span class="recommended-job-title">${highlightMatch(job.title, query)}</span>
          <span class="recommended-job-company">${escapeHtml(job.company)}</span>
          <div class="recommended-job-meta">
            <span class="recommended-job-salary">${escapeHtml(job.salary)}</span>
            <span class="recommended-job-loc" title="${escapeHtml(job.location || 'Toàn quốc')}">📍 ${escapeHtml(job.location || 'Toàn quốc')}</span>
          </div>
        </div>
      </button>
    `).join('');

    container.querySelectorAll('.recommended-job').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const kw = btn.getAttribute('data-keyword') || '';
        executeSearch(kw);
      });
    });
  }

  if (searchSuggestDropdown) {
    searchSuggestDropdown.setAttribute('role', 'dialog');
    searchSuggestDropdown.setAttribute('aria-label', 'Gợi ý tìm kiếm việc làm');
    searchSuggestDropdown.innerHTML = '';

    const compactSearchPanel = document.createElement('div');
    compactSearchPanel.className = 'search-format-panel';
    compactSearchPanel.innerHTML = `
      <section class="search-format-left" aria-label="Lịch sử và từ khóa gợi ý">
        <div class="suggest-section suggest-recent-section" id="suggestRecentSection">
          <div class="suggest-section-header">
            <h3 class="suggest-title" id="searchSuggestHeaderTitle">Từ khóa tìm kiếm gần đây</h3>
            <button type="button" class="btn-clear-history" id="btnClearSearchHistory">Xóa tất cả</button>
          </div>
          <div class="recent-chips-list" id="recentSearchList"></div>
        </div>

        <div class="keyword-suggestions-section" id="keywordSuggestionsSection" style="display: none;">
          <div class="suggest-section-header">
            <h3 class="suggest-title">Từ khóa gợi ý</h3>
          </div>
          <div class="keyword-suggestions-list" id="keywordSuggestionsList"></div>
        </div>

        <div class="popular-keywords" id="popularKeywordsWrap">
          <h3>Từ khóa phổ biến</h3>
          <div class="popular-keyword-list">
            ${POPULAR_KEYWORDS.map(kw => `
              <button type="button" class="suggest-trend-chip" data-keyword="${kw}">${kw}</button>
            `).join('')}
          </div>
        </div>
      </section>

      <section class="recommended-jobs" aria-labelledby="recommendedJobsTitle">
        <h3 id="recommendedJobsTitle">Việc làm có thể bạn quan tâm</h3>
        <div class="recommended-job-list" id="recommendedJobList"></div>
      </section>
    `;

    searchSuggestDropdown.appendChild(compactSearchPanel);

    searchFormatLeftEl = compactSearchPanel.querySelector('.search-format-left');
    suggestRecentSectionEl = compactSearchPanel.querySelector('#suggestRecentSection');
    keywordSuggestionsSectionEl = compactSearchPanel.querySelector('#keywordSuggestionsSection');
    keywordSuggestionsListEl = compactSearchPanel.querySelector('#keywordSuggestionsList');
    popularKeywordsWrapEl = compactSearchPanel.querySelector('#popularKeywordsWrap');
    recentListEl = compactSearchPanel.querySelector('#recentSearchList');
    recommendedJobListEl = compactSearchPanel.querySelector('#recommendedJobList');

    renderRecommendedJobs('', recommendedJobListEl);

    const clearHistoryBtn = compactSearchPanel.querySelector('#btnClearSearchHistory');
    clearHistoryBtn?.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      clearAllRecentSearches();
    });

    compactSearchPanel.querySelectorAll('.suggest-trend-chip').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const kw = btn.getAttribute('data-keyword') || btn.textContent.trim();
        executeSearch(kw);
      });
    });
  }

  function renderRecentSearches() {
    if (!recentListEl) return;
    recentListEl.innerHTML = '';
    const searches = getRecentSearches();
    const clearHistoryBtn = searchSuggestDropdown?.querySelector('#btnClearSearchHistory');

    if (!searches || searches.length === 0) {
      recentListEl.innerHTML = '<span class="recent-empty-hint">Chưa có lịch sử tìm kiếm gần đây</span>';
      if (clearHistoryBtn) clearHistoryBtn.style.display = 'none';
      return;
    }

    if (clearHistoryBtn) clearHistoryBtn.style.display = 'inline-block';

    searches.slice(0, 6).forEach(item => {
      const kw = typeof item === 'string' ? item : item.keyword;
      const cnt = typeof item === 'object' && item.count ? item.count : getKeywordJobCount(kw);

      const row = document.createElement('div');
      row.className = 'recent-search-row';
      row.setAttribute('role', 'button');
      row.setAttribute('tabindex', '0');
      row.innerHTML = `
        <svg class="recent-search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
        </svg>
        <div class="recent-search-meta">
          <span class="recent-search-keyword">${escapeHtml(kw)}</span>
          <span class="recent-search-count">${cnt} việc làm</span>
        </div>
        <button type="button" class="recent-search-remove" aria-label="Xóa từ khóa ${escapeHtml(kw)}" title="Xóa từ khóa này">✕</button>
      `;

      row.addEventListener('click', (e) => {
        if (e.target.closest('.recent-search-remove')) {
          e.stopPropagation();
          removeRecentSearch(kw);
          return;
        }
        executeSearch(kw);
      });

      row.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          executeSearch(kw);
        }
      });

      recentListEl.appendChild(row);
    });
  }

  function renderKeywordSuggestions(query, container) {
    if (!container) return;
    container.innerHTML = '';
    const clean = normalizeText(query);
    if (!clean) return;

    // 1. Thu thập và tìm kiếm Công ty phù hợp
    const matchedCompanies = [];
    const seenCompanyKeys = new Set();

    const allCompaniesList = [...POPULAR_COMPANIES];
    JOBS_DATA.forEach(j => {
      if (j.company && !allCompaniesList.some(c => c.name.toLowerCase() === j.company.toLowerCase())) {
        allCompaniesList.push({ name: j.company, shortName: j.company });
      }
    });
    RECOMMENDED_JOBS_POOL.forEach(j => {
      if (j.company && !allCompaniesList.some(c => c.name.toLowerCase() === j.company.toLowerCase())) {
        allCompaniesList.push({ name: j.company, shortName: j.company });
      }
    });

    allCompaniesList.forEach(comp => {
      const normName = normalizeText(comp.name);
      const normShort = normalizeText(comp.shortName || '');
      if (normName.includes(clean) || normShort.includes(clean)) {
        const key = comp.name.toLowerCase();
        if (!seenCompanyKeys.has(key)) {
          seenCompanyKeys.add(key);
          matchedCompanies.push({
            type: 'company',
            keyword: comp.shortName || comp.name,
            label: comp.name,
            searchKey: comp.shortName || comp.name
          });
        }
      }
    });

    // 2. Thu thập và tìm kiếm Việc làm phù hợp (Job titles & Roles)
    const matchedJobs = [];
    const seenJobKeys = new Set();

    // 2a. Việc làm từ dataset (khớp theo title hoặc thuộc công ty được tìm)
    const allSystemJobs = [...JOBS_DATA, ...RECOMMENDED_JOBS_POOL];
    allSystemJobs.forEach(job => {
      const normTitle = normalizeText(job.title);
      const normCompany = normalizeText(job.company || '');
      const isTitleMatch = normTitle.includes(clean);
      const isCompanyMatch = normCompany.includes(clean);

      if (isTitleMatch || isCompanyMatch) {
        const uniqueKey = `${job.title}__${job.company}`.toLowerCase();
        if (!seenJobKeys.has(uniqueKey)) {
          seenJobKeys.add(uniqueKey);
          matchedJobs.push({
            type: 'job',
            keyword: job.title,
            label: isCompanyMatch && !isTitleMatch ? `${job.title} — ${job.company}` : job.title,
            searchKey: job.title
          });
        }
      }
    });

    // 2b. Vai trò/vị trí chuẩn từ ALL_SUGGESTIONS & Taxonomy
    ALL_SUGGESTIONS.forEach(item => {
      if (normalizeText(item.keyword).includes(clean)) {
        const key = item.keyword.toLowerCase();
        if (!seenJobKeys.has(key)) {
          seenJobKeys.add(key);
          matchedJobs.push({
            type: 'job',
            keyword: item.keyword,
            label: item.keyword,
            searchKey: item.keyword
          });
        }
      }
    });

    // 3. Phân bổ thông minh: hiển thị cả Công ty và Việc làm (tối đa 10 mục)
    let finalMatches = [];
    if (matchedCompanies.length > 0 && matchedJobs.length > 0) {
      const isCompanySearch = matchedCompanies.some(c => normalizeText(c.keyword) === clean || normalizeText(c.label).startsWith(clean));
      if (isCompanySearch) {
        finalMatches = [
          ...matchedCompanies.slice(0, 4),
          ...matchedJobs.slice(0, 6)
        ];
      } else {
        finalMatches = [
          ...matchedJobs.slice(0, 6),
          ...matchedCompanies.slice(0, 4)
        ];
      }
    } else {
      finalMatches = [...matchedCompanies, ...matchedJobs];
    }

    finalMatches = finalMatches.slice(0, 10);

    if (finalMatches.length === 0) {
      const emptyRow = document.createElement('div');
      emptyRow.className = 'keyword-suggestion-empty';
      emptyRow.setAttribute('role', 'button');
      emptyRow.setAttribute('tabindex', '0');
      emptyRow.innerHTML = `
        <svg class="kw-suggest-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>
        </svg>
        <span class="kw-suggest-text">Tìm kiếm việc làm cho <strong>"${escapeHtml(query)}"</strong></span>
      `;
      emptyRow.addEventListener('click', () => {
        executeSearch(query);
      });
      emptyRow.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') executeSearch(query);
      });
      container.appendChild(emptyRow);
      return;
    }

    finalMatches.forEach(item => {
      const row = document.createElement('div');
      row.className = `keyword-suggestion-row is-${item.type}`;
      row.setAttribute('role', 'button');
      row.setAttribute('tabindex', '0');
      row.innerHTML = `
        <div class="kw-suggest-left">
          ${item.type === 'company' ? `
            <svg class="kw-suggest-icon kw-icon-company" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
              <path d="M3 21h18M3 7v14M21 7v14M6 10h2M6 14h2M6 18h2M11 10h2M11 14h2M11 18h2M16 10h2M16 14h2M16 18h2M9 3h6v4H9z"/>
            </svg>
          ` : `
            <svg class="kw-suggest-icon kw-icon-job" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
              <rect width="20" height="14" x="2" y="7" rx="2" ry="2"/>
              <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
            </svg>
          `}
          <span class="kw-suggest-text" title="${escapeHtml(item.label)}">${highlightMatch(item.label, query)}</span>
        </div>
      `;
      row.addEventListener('click', () => {
        executeSearch(item.searchKey || item.keyword);
      });
      row.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') executeSearch(item.searchKey || item.keyword);
      });
      container.appendChild(row);
    });
  }

  function handleSearchInputMode(rawQuery) {
    const query = (rawQuery || '').trim();
    // Bắt đầu gợi ý khi người dùng nhập từ ký tự thứ 2 trở lên
    const isTyping = query.length >= 2;

    if (isTyping) {
      searchFormatLeftEl?.classList.add('is-typing');
      if (suggestRecentSectionEl) suggestRecentSectionEl.style.display = 'none';
      if (keywordSuggestionsSectionEl) keywordSuggestionsSectionEl.style.display = 'flex';
      if (popularKeywordsWrapEl) popularKeywordsWrapEl.style.display = 'none';
      renderKeywordSuggestions(query, keywordSuggestionsListEl);
      renderRecommendedJobs(query, recommendedJobListEl);
    } else {
      searchFormatLeftEl?.classList.remove('is-typing');
      if (suggestRecentSectionEl) suggestRecentSectionEl.style.display = 'flex';
      if (keywordSuggestionsSectionEl) keywordSuggestionsSectionEl.style.display = 'none';
      if (popularKeywordsWrapEl) popularKeywordsWrapEl.style.display = 'block';
      renderRecentSearches();
      renderRecommendedJobs('', recommendedJobListEl);
    }
  }

  function updateDropdownPosition() {
    if (!heroSearchWrapper || !searchSuggestDropdown) return;
    const heroBox = document.getElementById('jobSearchForm') || document.getElementById('heroSearchBox') || (searchInput ? searchInput.closest('.hero-search-box') : null);
    const parentBar = searchSuggestDropdown.parentElement;

    if (parentBar && heroBox) {
      const barRect = parentBar.getBoundingClientRect();
      const boxRect = heroBox.getBoundingClientRect();
      const topOffset = Math.max(0, Math.round(boxRect.bottom - barRect.top + 8));
      searchSuggestDropdown.style.setProperty('--search-suggest-top', `${topOffset}px`);
    }

    if (window.innerWidth <= 900) {
      searchSuggestDropdown.style.removeProperty('--search-suggest-left');
      searchSuggestDropdown.style.removeProperty('--search-suggest-right');
      searchSuggestDropdown.style.left = '0';
      searchSuggestDropdown.style.right = '0';
      searchSuggestDropdown.style.width = '100%';
      searchSuggestDropdown.style.maxWidth = '100%';
      return;
    }

    const inputGroup = searchInput ? searchInput.closest('.search-input-group') : null;
    if (inputGroup && parentBar && heroBox) {
      const barRect = parentBar.getBoundingClientRect();
      const groupRect = inputGroup.getBoundingClientRect();
      const boxRect = heroBox.getBoundingClientRect();

      // Mép trái: Thu gọn căn thẳng hàng với ô input tìm kiếm (để lộ nút "Danh mục Nghề" bên trái)
      const leftOffset = Math.max(0, Math.round(groupRect.left - barRect.left));

      // Mép phải: Kéo dài đến hết mép phải của thanh tìm kiếm
      const rightOffset = Math.max(0, Math.round(barRect.right - boxRect.right));

      searchSuggestDropdown.style.setProperty('--search-suggest-left', `${leftOffset}px`);
      searchSuggestDropdown.style.setProperty('--search-suggest-right', `${rightOffset}px`);
      searchSuggestDropdown.style.left = `${leftOffset}px`;
      searchSuggestDropdown.style.right = `${rightOffset}px`;
      searchSuggestDropdown.style.width = 'auto';
      searchSuggestDropdown.style.maxWidth = 'none';
    }
  }

  function openSuggest() {
    if (!searchSuggestDropdown) return;
    // Đóng Category Modal nếu đang mở
    if (window.EasyCVCategoryModal && window.EasyCVCategoryModal.isOpen) {
      window.EasyCVCategoryModal.close(false);
    }
    updateDropdownPosition();
    searchSuggestDropdown.classList.add('is-open');
    if (searchInput) searchInput.setAttribute('aria-expanded', 'true');
    handleSearchInputMode(searchInput?.value || '');
  }

  function closeSuggest() {
    if (!searchSuggestDropdown) return;
    searchSuggestDropdown.classList.remove('is-open');
    if (searchInput) searchInput.setAttribute('aria-expanded', 'false');
  }

  function executeSearch(keyword) {
    if (typeof keyword === 'string') {
      if (searchInput) searchInput.value = keyword;
      if (clearSearchInputBtn) clearSearchInputBtn.style.display = 'flex';
    }
    const query = searchInput ? searchInput.value.trim() : '';
    if (query) {
      saveRecentSearch(query);
    }
    closeSuggest();
    searchInput?.blur();

    applyJobFilters(true, true);
    const matchCount = currentFilteredJobs.filter(j => j._isSearchMatch).length;
    if (query && matchCount > 0) {
      showToast(`Tìm kiếm "${query}": Tìm thấy ${matchCount} việc làm phù hợp nhất!`, '🎯');
    } else if (query && matchCount === 0) {
      showToast(`Dữ liệu mẫu: Đang hiển thị toàn bộ việc làm có sẵn trên hệ thống`, '💡');
    } else {
      showToast(`Đang hiển thị toàn bộ ${JOBS_DATA.length} việc làm có sẵn`, '🔍');
    }
    scrollToListingTop();
  }

  // Input Events
  searchInput?.addEventListener('focus', () => {
    openSuggest();
  });

  searchInput?.addEventListener('click', (e) => {
    e.stopPropagation();
    openSuggest();
  });

  const searchInputGroup = searchInput?.closest('.search-input-group');
  if (searchInputGroup) {
    searchInputGroup.addEventListener('click', (e) => {
      if (e.target !== clearSearchInputBtn) {
        searchInput?.focus();
        openSuggest();
      }
    });
  }

  let searchDebounceTimer;
  searchInput?.addEventListener('input', () => {
    const query = searchInput.value.trim();
    if (clearSearchInputBtn) {
      clearSearchInputBtn.style.display = query ? 'flex' : 'none';
    }
    if (!searchSuggestDropdown.classList.contains('is-open')) {
      openSuggest();
    }
    handleSearchInputMode(query);

    clearTimeout(searchDebounceTimer);
    searchDebounceTimer = setTimeout(() => {
      applyJobFilters(true, true);
    }, 250);
  });

  searchInput?.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      executeSearch(searchInput.value);
    } else if (e.key === 'Escape') {
      closeSuggest();
      searchInput.blur();
    }
  });

  clearSearchInputBtn?.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (searchInput) searchInput.value = '';
    clearSearchInputBtn.style.display = 'none';
    searchInput?.focus();
    handleSearchInputMode('');
    applyJobFilters(true, true);
    showToast('Đã xóa từ khóa tìm kiếm', 'ℹ️');
  });

  // Search Form Submit
  jobSearchForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    executeSearch(searchInput?.value || '');
  });

  // Explicit click handler for Search Button
  btnJobSearch?.addEventListener('click', (e) => {
    e.preventDefault();
    executeSearch(searchInput?.value || '');
  });

  // Khi click vào nút Danh mục Nghề: đóng search suggest dropdown
  const categoryFilterTriggerBtn = document.getElementById('categoryFilterTrigger');
  categoryFilterTriggerBtn?.addEventListener('click', () => {
    closeSuggest();
  });

  document.addEventListener('click', (e) => {
    if (searchSuggestDropdown && !searchSuggestDropdown.contains(e.target) && e.target !== searchInput && !e.target.closest('.search-input-group')) {
      closeSuggest();
    }
  });

  window.addEventListener('resize', updateDropdownPosition, { passive: true });
  window.addEventListener('scroll', updateDropdownPosition, { passive: true });

  updateDropdownPosition();
  renderRecentSearches();



  // Clear Keyword button
  btnClearKeyword?.addEventListener('click', () => {
    if (searchInput) searchInput.value = '';
    if (clearSearchInputBtn) clearSearchInputBtn.style.display = 'none';
    activeIndustryQuery = '';
    if (categorySelect) categorySelect.value = '';
    if (window.EasyCVCategoryModal) window.EasyCVCategoryModal.clearAll();
    applyJobFilters(true, true);
    showToast('Đã xóa bộ lọc từ khóa và ngành nghề', 'ℹ️');
  });

  // Listen for category selection from EasyCVCategoryModal
  document.addEventListener('easycv:category-applied', (e) => {
    const { groups, subgroups, roles, primaryQuery } = e.detail;
    if (roles.length > 0) {
      activeIndustryQuery = roles.join(' ');
    } else if (subgroups.length > 0) {
      activeIndustryQuery = subgroups.join(' ');
    } else if (groups.length > 0) {
      activeIndustryQuery = groups.join(' ');
    } else {
      activeIndustryQuery = '';
    }

    const catHidden = document.getElementById('jobCategoryHidden');
    if (catHidden) catHidden.value = groups.length > 0 ? groups[0] : '';
    const indHidden = document.getElementById('jobIndustryHidden');
    if (indHidden) indHidden.value = activeIndustryQuery;

    applyJobFilters(true, true);
    if (primaryQuery) {
      showToast(`Đã lọc danh mục nghề: ${primaryQuery}`, '🎯');
      const targetSection = document.getElementById('splitListPane') || document.getElementById('jobListingContainer') || document.querySelector('.job-main-columns');
      if (targetSection) {
        targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    } else {
      showToast('Đã hủy lọc danh mục nghề', '✓');
    }
  });

  // Dropdown changes
  locationSelect?.addEventListener('change', () => applyJobFilters(true, true));
  categorySelect?.addEventListener('change', () => applyJobFilters(true, true));
  sortSelect?.addEventListener('change', () => {
    sortJobs();
    renderCurrentPage();
    showToast('Đã sắp xếp lại danh sách việc làm', '⇅');
  });

  // Quick Filter Tags Click
  document.querySelectorAll('.quick-filter-tags .tag-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      btn.classList.toggle('active');
      applyJobFilters(true, true);
      const tagText = btn.textContent.trim();
      showToast(btn.classList.contains('active') ? `Đang lọc: ${tagText}` : `Đã bỏ: ${tagText}`, '🔍');
    });
  });

  // Checkbox filters (Level, Salary, Exp, Type)
  document.querySelectorAll('.filter-sidebar input[type="checkbox"]').forEach(cb => {
    cb.addEventListener('change', () => applyJobFilters(true, true));
  });

  // Reset Filters button
  btnResetFilters?.addEventListener('click', () => {
    resetAllTopFilters(false);
    document.querySelectorAll('.filter-sidebar input[type="checkbox"]').forEach(cb => cb.checked = false);
    document.querySelectorAll('.quick-filter-tags .tag-btn').forEach(b => b.classList.remove('active'));
    if (searchInput) searchInput.value = '';
    if (clearSearchInputBtn) clearSearchInputBtn.style.display = 'none';
    if (window.EasyCVLocationPicker) window.EasyCVLocationPicker.reset();
    else if (locationSelect) locationSelect.value = '';
    if (categorySelect) categorySelect.value = '';
    if (window.EasyCVCategoryModal) window.EasyCVCategoryModal.clearAll();
    applyJobFilters(true, true);
    showToast('Đã thiết lập lại bộ lọc', '✓');
  });

  // Empty state Reset Search
  btnResetSearch?.addEventListener('click', () => {
    resetAllTopFilters(false);
    if (searchInput) searchInput.value = '';
    if (clearSearchInputBtn) clearSearchInputBtn.style.display = 'none';
    if (window.EasyCVLocationPicker) window.EasyCVLocationPicker.reset();
    else if (locationSelect) locationSelect.value = '';
    if (categorySelect) categorySelect.value = '';
    if (window.EasyCVCategoryModal) window.EasyCVCategoryModal.clearAll();
    document.querySelectorAll('.quick-filter-tags .tag-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.filter-sidebar input[type="checkbox"]').forEach(cb => cb.checked = false);
    applyJobFilters(true, true);
    showToast(`Đã hiển thị tất cả ${JOBS_DATA.length} việc làm`, '✓');
  });

  // Suggestion chips inside empty state
  document.querySelectorAll('.suggest-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      const keyword = chip.getAttribute('data-search') || chip.textContent.trim();
      if (searchInput) {
        searchInput.value = keyword;
        applyJobFilters(true, true);
        showToast(`Tìm kiếm: ${keyword}`, '🔍');
      }
    });
  });

  // Split View Controls & Action Listeners
  btnBackToGrid?.addEventListener('click', () => closeSplitView(true));
  btnViewGrid?.addEventListener('click', () => closeSplitView(true));
  btnViewSplit?.addEventListener('click', () => {
    const targetId = selectedJobId || (currentFilteredJobs[0] ? currentFilteredJobs[0].id : JOBS_DATA[0].id);
    openSplitView(targetId);
  });

  splitSortSelect?.addEventListener('change', () => {
    const val = splitSortSelect.value;
    if (sortSelect) sortSelect.value = val;
    sortJobs();
    renderSplitList();
    renderCurrentPage();
    showToast('Đã sắp xếp lại danh sách việc làm', '⇅');
  });

  btnCopyJobLink?.addEventListener('click', () => {
    const currentUrl = new URL(window.location.href);
    if (selectedJobId) currentUrl.searchParams.set('jobId', selectedJobId);
    if (navigator.clipboard) {
      navigator.clipboard.writeText(currentUrl.toString()).then(() => {
        showToast('Đã sao chép liên kết việc làm vào bộ nhớ tạm!', '🔗');
      }).catch(() => {
        showToast('Đã sao chép liên kết việc làm!', '🔗');
      });
    } else {
      showToast('Đã sao chép liên kết việc làm!', '🔗');
    }
  });

  btnDetailBookmark?.addEventListener('click', () => {
    if (selectedJobId) toggleDetailBookmark(selectedJobId);
  });
  btnDetailSaveCard?.addEventListener('click', () => {
    if (selectedJobId) toggleDetailBookmark(selectedJobId);
  });

  const onSplitApply = () => {
    const job = JOBS_DATA.find(j => j.id === selectedJobId) || JOBS_DATA[0];
    showToast(`Ứng tuyển thành công vị trí "${job.title}"! Nhà tuyển dụng sẽ phản hồi sớm.`, '🚀');
  };
  btnDetailApply?.addEventListener('click', onSplitApply);
  btnStickyApply?.addEventListener('click', onSplitApply);

  // --- Sticky Hero Search Bar on Scroll ---
  function initStickySearch() {
    const wrapper = document.getElementById('heroSearchWrapper') || document.getElementById('jobSearchWrapper');
    const stickyBar = document.getElementById('heroSearchStickyBar') || document.getElementById('jobSearchStickyBar');
    if (!wrapper || !stickyBar) return;

    const header = document.querySelector('.site-header') || document.querySelector('.navbar');
    let ticking = false;

    function updateStickyState() {
      // Thanh menu (.site-header) không còn neo cố định trên màn list job (position: relative),
      // nên khi cuộn màn hình xuống, thanh tìm kiếm neo trực tiếp sát mép trên cùng (top: 0).
      stickyBar.style.setProperty('--sticky-search-top', '0px');

      // Điện thoại: ô tìm kiếm + bộ lọc xếp dọc cao ~300px, nếu dính sẽ che phần lớn màn hình → không neo
      const isCompactScreen = window.matchMedia('(max-width: 768px)').matches;

      const wrapperRect = wrapper.getBoundingClientRect();
      if (!isCompactScreen && wrapperRect.top <= 0) {
        if (!stickyBar.classList.contains('is-sticky')) {
          // Dùng chiều cao thực của stickyBar (gồm cả filter bar bên trong)
          wrapper.style.minHeight = stickyBar.offsetHeight + 'px';
          stickyBar.classList.add('is-sticky');
        }
      } else {
        if (stickyBar.classList.contains('is-sticky')) {
          stickyBar.classList.remove('is-sticky');
          wrapper.style.minHeight = '';
        }
      }
      ticking = false;
    }

    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(updateStickyState);
        ticking = true;
      }
    }, { passive: true });

    window.addEventListener('resize', updateStickyState, { passive: true });
    updateStickyState();
  }

  // Parse Initial URL Query Parameters & Listen to popstate
  function syncStateFromUrl() {
    const urlParams = new URLSearchParams(window.location.search);
    const keywordParam = urlParams.get('keyword') || urlParams.get('q') || '';
    const locationParam = urlParams.get('location') || urlParams.get('locations') || '';
    const categoryParam = urlParams.get('category') || '';
    const industryParam = urlParams.get('industry') || '';
    const jobIdParam = urlParams.get('jobId') || urlParams.get('id');

    if (searchInput) {
      searchInput.value = keywordParam;
      if (clearSearchInputBtn) {
        clearSearchInputBtn.style.display = keywordParam ? 'flex' : 'none';
      }
    }
    activeIndustryQuery = industryParam;

    if (locationParam) {
      if (window.EasyCVLocationPicker) {
        window.EasyCVLocationPicker.setSelected(locationParam);
      } else if (heroLocationTrigger) {
        Array.from(heroLocationTrigger.childNodes).forEach(n => {
          if (n.nodeType === Node.TEXT_NODE) n.remove();
        });
        const labelEl = heroLocationTrigger.querySelector('.location-label');
        if (labelEl) {
          labelEl.textContent = locationParam;
        }
      }
      if (locationSelect) {
        locationSelect.value = locationParam;
      }
    } else {
      if (window.EasyCVLocationPicker) {
        window.EasyCVLocationPicker.reset();
      } else if (heroLocationTrigger) {
        Array.from(heroLocationTrigger.childNodes).forEach(n => {
          if (n.nodeType === Node.TEXT_NODE) n.remove();
        });
        const labelEl = heroLocationTrigger.querySelector('.location-label');
        if (labelEl) {
          labelEl.textContent = 'Tất cả địa điểm';
        }
      }
      if (locationSelect) {
        locationSelect.value = '';
      }
    }

    if (categorySelect) {
      categorySelect.value = categoryParam || '';
    }

    if (window.EasyCVCategoryModal) {
      try {
        const savedCat = localStorage.getItem('easycv_category_selection');
        if (savedCat) {
          const parsed = JSON.parse(savedCat);
          if (parsed && (parsed.roles?.length || parsed.subgroups?.length || parsed.groups?.length)) {
            window.EasyCVCategoryModal.setSelection({
              groups: parsed.groups || [],
              subgroups: parsed.subgroups || [],
              roles: parsed.roles || []
            });
          } else if (categoryParam) {
            window.EasyCVCategoryModal.setSelection({ groups: [categoryParam], subgroups: [], roles: [] });
          } else if (industryParam) {
            window.EasyCVCategoryModal.setSelection({ groups: [], subgroups: [], roles: [industryParam] });
          }
        } else if (categoryParam) {
          window.EasyCVCategoryModal.setSelection({ groups: [categoryParam], subgroups: [], roles: [] });
        } else if (industryParam) {
          window.EasyCVCategoryModal.setSelection({ groups: [], subgroups: [], roles: [industryParam] });
        }
      } catch (e) {
        if (categoryParam) {
          window.EasyCVCategoryModal.setSelection({ groups: [categoryParam], subgroups: [], roles: [] });
        } else if (industryParam) {
          window.EasyCVCategoryModal.setSelection({ groups: [], subgroups: [], roles: [industryParam] });
        }
      }
    }

    // Đồng bộ tham số Top Filter Bar từ URL
    const expParam = urlParams.get('exp') || '';
    const salaryParam = urlParams.get('salary') || '';
    const levelParam = urlParams.get('level') || '';
    const typeParam = urlParams.get('type') || '';
    const saturdayParam = urlParams.get('saturday') || '';

    // Hỗ trợ chọn nhiều: ?level=intern,junior (hoặc lặp tham số ?level=intern&level=junior)
    const readMultiParam = key => parseMultiValue(urlParams.getAll(key).join(',')).join(',');
    setFilterValue('exp', readMultiParam('exp') || expParam);
    setFilterValue('salary', readMultiParam('salary') || salaryParam);
    setFilterValue('level', readMultiParam('level') || levelParam);
    setFilterValue('type', readMultiParam('type') || typeParam);
    setFilterValue('saturday', readMultiParam('saturday') || saturdayParam);

    MULTI_FILTER_TYPES.forEach(t => {
      updateFilterPillUI(t, getFilterValue(t), '');
      syncFilterDropdownSelection(t);
    });

    renderActiveFilterChips();

    // Khôi phục kiểu sắp xếp được trang chi tiết truyền về (?sort=)
    const sortParam = urlParams.get('sort') || '';
    const sortItem = sortParam ? document.querySelector(`#sortMenuDropdown .sort-menu-item[data-val="${sortParam}"]`) : null;
    if (sortItem && sortSelect) {
      sortSelect.value = sortParam;
      document.querySelectorAll('#sortMenuDropdown .sort-menu-item').forEach(it => {
        it.classList.toggle('is-selected', it === sortItem);
        it.setAttribute('aria-selected', it === sortItem ? 'true' : 'false');
      });
      const sortLabel = document.getElementById('sortCurrentLabel');
      if (sortLabel) sortLabel.textContent = sortItem.querySelector('span')?.textContent.trim() || sortLabel.textContent;
    }

    applyJobFilters(true, false);

    // Xử lý mở trực tiếp Split View nếu URL có tham số jobId
    if (jobIdParam) {
      const targetId = parseInt(jobIdParam, 10);
      if (JOBS_DATA.some(j => j.id === targetId)) {
        openSplitView(targetId);
      }
    } else if (activeViewMode === 'split') {
      closeSplitView(false);
    }
  }

  // TopCV Standard Sort Dropdown Engine
  function initTopCvSortDropdown() {
    const trigger = document.getElementById('sortTriggerBtn');
    const menu = document.getElementById('sortMenuDropdown');
    const hiddenInput = document.getElementById('sortSelect');
    const labelSpan = document.getElementById('sortCurrentLabel');
    if (!trigger || !menu) return;

    // Toggle menu dropdown
    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const isOpen = menu.classList.contains('is-open');
      if (isOpen) {
        menu.classList.remove('is-open');
        trigger.setAttribute('aria-expanded', 'false');
      } else {
        menu.classList.add('is-open');
        trigger.setAttribute('aria-expanded', 'true');
      }
    });

    // Close on click outside
    document.addEventListener('click', (e) => {
      if (!trigger.contains(e.target) && !menu.contains(e.target)) {
        menu.classList.remove('is-open');
        trigger.setAttribute('aria-expanded', 'false');
      }
    });

    // Handle item selection
    menu.querySelectorAll('.sort-menu-item').forEach(item => {
      item.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        const val = item.getAttribute('data-val');
        const text = item.querySelector('span')?.textContent.trim() || 'Search by AI';

        menu.querySelectorAll('.sort-menu-item').forEach(it => {
          it.classList.remove('is-selected');
          it.setAttribute('aria-selected', 'false');
        });
        item.classList.add('is-selected');
        item.setAttribute('aria-selected', 'true');

        if (labelSpan) labelSpan.textContent = text;
        if (hiddenInput) {
          hiddenInput.value = val;
          hiddenInput.dispatchEvent(new Event('change'));
        }

        menu.classList.remove('is-open');
        trigger.setAttribute('aria-expanded', 'false');

        sortJobs();
        currentPage = 1;
        renderCurrentPage();
        showToast(`Đã sắp xếp theo: ${text}`, '⇅');
      });
    });
  }

  // Browser Back / Forward navigation support
  window.addEventListener('popstate', () => {
    syncStateFromUrl();
  });

  // Initial Boot
  initTopFilterBar();
  initTopCvSortDropdown();
  syncStateFromUrl();
  initSavedFilters();
  initStickySearch();

  // VIP Employer ad explore button
  document.getElementById('btnExploreVipEmployer')?.addEventListener('click', () => {
    if (searchInput) {
      searchInput.value = 'Samsung';
      applyJobFilters(true, true);
      showToast('Đang hiển thị vị trí tuyển dụng của Samsung R&D', '★');
      window.scrollTo({ top: 380, behavior: 'smooth' });
    }
  });

  console.log(`EasyCV Job Search loaded successfully. Total catalog: ${JOBS_DATA.length} jobs.`);
});
