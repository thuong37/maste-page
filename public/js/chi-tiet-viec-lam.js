/**
 * EasyCV - Chi Tiết Việc Làm (chi-tiet-viec-lam.js)
 * BMAD-Engineered: 2-Block Master-Detail View
 * Bên Trái: Danh sách việc làm liên quan
 * Bên Phải: Mô tả chi tiết công việc (JD)
 */

document.addEventListener('DOMContentLoaded', () => {

  // Dataset đồng bộ 16 việc làm chuẩn EasyCV
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

  // Helper Toast
  const toast = document.getElementById('toastMsg');
  function showToast(message, icon = '✓') {
    if (!toast) return;
    toast.innerHTML = `<span>${icon}</span> <span>${message}</span>`;
    toast.classList.add('show');
    setTimeout(() => {
      toast.classList.remove('show');
    }, 2800);
  }

  // Saved Jobs storage
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

  // Helper chuẩn hóa tiếng Việt để so khớp tìm kiếm chính xác
  function normalizeText(text) {
    if (!text) return '';
    return text.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[đĐ]/g, 'd').toLowerCase().trim();
  }

  // Lấy ID và Tên công việc từ Query Param
  const urlParams = new URLSearchParams(window.location.search);
  const targetId = parseInt(urlParams.get('id') || urlParams.get('jobId') || '0', 10);
  const targetTitle = (urlParams.get('title') || urlParams.get('jobTitle') || urlParams.get('q') || '').trim();

  let activeJob = null;
  if (targetId && JOBS_DATA.some(j => j.id === targetId)) {
    activeJob = JOBS_DATA.find(j => j.id === targetId);
  } else if (targetTitle) {
    const normTarget = normalizeText(targetTitle);
    activeJob = JOBS_DATA.find(j => {
      const normJ = normalizeText(j.title);
      return normJ === normTarget || normJ.includes(normTarget) || normTarget.includes(normJ);
    });
  }

  // Nếu người dùng click vào một job có tên mới hoặc không có trong ID, tạo ngay mock data chuẩn xác lấy đúng tên job đó
  if (!activeJob && targetTitle) {
    activeJob = {
      id: 9999,
      title: targetTitle,
      company: 'Doanh Nghiệp Tuyển Dụng Hàng Đầu',
      logo: 'assets/logos/easycv-icon.png',
      verified: true,
      salaryBadge: '25 - 45 triệu',
      salaryIsOrange: true,
      salaryMin: 25,
      salaryMax: 45,
      location: 'Hà Nội & TP. Hồ Chí Minh',
      city: 'Toàn quốc',
      category: 'it',
      level: 'senior',
      exp: '3-5',
      type: 'hybrid',
      isFeatured: true,
      isUrgent: true,
      updated: 'Vừa xong',
      aiMatch: 96,
      skills: ['Chuyên môn cao', 'Làm việc nhóm', 'Giao tiếp tốt', 'Quản lý dự án'],
      jd: {
        desc: [
          `Đảm nhận vai trò then chốt tại vị trí ${targetTitle}, trực tiếp tham gia xây dựng và tối ưu các dự án trọng điểm của doanh nghiệp.`,
          'Phối hợp cùng các bộ phận liên quan để thiết kế giải pháp kỹ thuật và cải tiến quy trình nghiệp vụ.',
          'Quản lý tiến độ công việc, đảm bảo chất lượng đầu ra đạt tiêu chuẩn cao nhất và báo cáo trực tiếp ban giám đốc.'
        ],
        reqs: [
          `Tối thiểu 2 - 5 năm kinh nghiệm thực chiến trong các dự án tương đương vị trí ${targetTitle}.`,
          'Tư duy giải quyết vấn đề sắc bén, tinh thần trách nhiệm cao và khả năng chịu áp lực tốt.',
          'Kỹ năng giao tiếp và làm việc nhóm hiệu quả, sẵn sàng tiếp thu công nghệ và phương pháp mới.'
        ],
        perks: [
          'Thu nhập cạnh tranh từ 25 - 45 triệu/tháng + Thưởng hiệu suất dự án theo quý và thưởng tháng lương 13.',
          'Môi trường làm việc năng động, chuyên nghiệp, hỗ trợ tối đa lộ trình thăng tiến nghề nghiệp.',
          'Gói bảo hiểm chăm sóc sức khỏe cao cấp và đầy đủ các chế độ phúc lợi theo quy định nhà nước.'
        ]
      }
    };
    JOBS_DATA.unshift(activeJob);
  }

  if (!activeJob) {
    activeJob = JOBS_DATA[0];
  }
  let activeJobId = activeJob.id;

  // =========================================================================
  // ĐỒNG BỘ VỚI TRANG GỐC viec-lam.html: cùng trạng thái tìm kiếm, cùng engine lọc + sắp xếp, cùng card
  // =========================================================================
  const EXP_LABELS = { '0': 'Không yêu cầu', 'under1': 'Dưới 1 năm', '1-3': '1 - 3 năm', '3-5': '3 - 5 năm', 'over5': 'Trên 5 năm' };

  // Dữ liệu "Nghỉ thứ 7" (giống JOBS_DATA của viec-lam.js) để bộ lọc saturday cho kết quả giống trang gốc
  const SATURDAY_BY_ID = {
    1: 'off_sat', 2: 'work_sat', 3: 'off_sat', 4: 'off_sat', 5: 'work_sat', 6: 'off_sat', 7: 'off_sat',
    8: 'work_sat', 9: 'work_sat', 10: 'off_sat', 11: 'off_sat', 12: 'off_sat', 13: 'off_sat', 14: 'unmentioned',
    15: 'work_sat', 16: 'off_sat', 17: 'off_sat', 18: 'off_sat', 19: 'unmentioned', 20: 'off_sat', 21: 'off_sat',
    22: 'unmentioned', 23: 'work_sat', 24: 'off_sat', 25: 'off_sat', 26: 'off_sat', 27: 'work_sat', 28: 'work_sat'
  };
  JOBS_DATA.forEach(job => {
    if (!job.saturday) job.saturday = SATURDAY_BY_ID[job.id] || 'unmentioned';
  });

  // Các tham số tìm kiếm / bộ lọc được trang Việc làm truyền sang (và truyền ngược lại khi quay về)
  const SEARCH_STATE_KEYS = ['keyword', 'location', 'category', 'industry', 'exp', 'salary', 'level', 'type', 'saturday', 'sort'];
  const searchState = {};
  SEARCH_STATE_KEYS.forEach(key => {
    const value = (urlParams.get(key) || (key === 'keyword' ? urlParams.get('q') : '') || '').trim();
    if (value) searchState[key] = value;
  });
  const searchKeyword = searchState.keyword || '';

  function getSearchStateQuery() {
    const params = new URLSearchParams();
    SEARCH_STATE_KEYS.forEach(key => { if (searchState[key]) params.set(key, searchState[key]); });
    const query = params.toString();
    return query ? `&${query}` : '';
  }

  // Logo hiển thị 88–96px: lấy ảnh Unsplash 240px để không bị mờ trên màn hình retina
  function getHiResLogo(url) {
    return typeof url === 'string' && url.includes('images.unsplash.com')
      ? url.replace(/([?&])w=\d+/, '$1w=240').replace(/([?&])h=\d+/, '$1h=240')
      : url;
  }

  function buildDetailHref(job) {
    return `chi-tiet-viec-lam.html?id=${job.id}&title=${encodeURIComponent(job.title)}${getSearchStateQuery()}`;
  }

  // Port của matchSalaryTier() trong viec-lam.js
  function matchSalaryTier(job, tier) {
    if (tier === 'under10') return job.salaryMin < 10;
    if (tier === '10-15') return (job.salaryMin <= 15 && job.salaryMax >= 10);
    if (tier === '15-25') return (job.salaryMin <= 25 && job.salaryMax >= 15);
    if (tier === '25-50') return (job.salaryMin <= 50 && job.salaryMax >= 25);
    if (tier === 'over50') return job.salaryMax >= 50;
    if (tier === 'negotiable') return true;
    return false;
  }

  // Port của applyJobFilters() + sortJobs() trong viec-lam.js: danh sách bên trái có cùng thứ tự với trang gốc
  function isJobMatchingSearch(job) {
    const normQuery = normalizeText(searchState.keyword);
    const normIndustry = normalizeText(searchState.industry);
    const normLoc = normalizeText(searchState.location);
    const normAllText = normalizeText(`${job.title} ${job.company} ${job.location} ${job.city} ${job.skills.join(' ')}`);

    if (normQuery) {
      const tokens = normQuery.split(/\s+/).filter(Boolean);
      if (!tokens.every(token => normAllText.includes(token)) && !normAllText.includes(normQuery)) return false;
    }
    if (normIndustry) {
      const tokens = normIndustry.split(/\s+/).filter(Boolean);
      if (!tokens.every(token => normAllText.includes(token)) && !normAllText.includes(normIndustry)) return false;
    }
    if (normLoc && normLoc !== 'tat ca dia diem') {
      const normJobLoc = normalizeText(job.location);
      const normJobCity = normalizeText(job.city);
      const locMatch = normLoc.split(/[;|,]/).map(t => t.trim()).filter(Boolean).some(tok => {
        const cleanTok = tok.split(':')[0].trim();
        const districtTok = tok.includes(':') ? tok.split(':')[1].trim() : '';
        if (cleanTok === 'remote') return normJobLoc.includes('remote') || job.type === 'remote';
        const matchProvince = normJobLoc.includes(cleanTok) || normJobCity.includes(cleanTok) || cleanTok.includes(normJobCity);
        if (districtTok) return matchProvince && (normJobLoc.includes(districtTok) || districtTok.includes(normJobLoc));
        return matchProvince;
      });
      if (!locMatch) return false;
    }
    if (searchState.category && job.category !== searchState.category) return false;
    // Bộ lọc chọn nhiều ("intern,junior"): khớp bất kỳ giá trị nào trong cùng tiêu chí
    if (searchState.level && !parseMultiValue(searchState.level).includes(job.level)) return false;
    if (searchState.salary && !parseMultiValue(searchState.salary).some(tier => matchSalaryTier(job, tier))) return false;
    if (searchState.exp && !parseMultiValue(searchState.exp).includes(job.exp)) return false;
    if (searchState.type && !parseMultiValue(searchState.type).includes(job.type)) return false;
    if (searchState.saturday && !parseMultiValue(searchState.saturday).includes(job.saturday)) return false;
    return true;
  }

  function parseMultiValue(value) {
    return [...new Set(String(value || '').split(',').map(part => part.trim()).filter(Boolean))];
  }

  // Bộ lọc tiêu chí trên trang chi tiết (chi-tiet-filter.js) đổi → lọc lại danh sách bên trái ngay tại chỗ
  document.addEventListener('easycv:detail-filters-change', (e) => {
    const filters = e.detail || {};
    ['exp', 'salary', 'level', 'type', 'saturday'].forEach(key => {
      const value = parseMultiValue(filters[key]).join(',');
      if (value) searchState[key] = value;
      else delete searchState[key];
    });
    relatedJobsCache = null;
    renderList({ focusActive: true });

    // Cập nhật URL (giữ id/title của job đang xem) để tải lại / chia sẻ / quay về danh sách vẫn đúng bộ lọc
    if (window.history && window.history.replaceState) {
      const currentUrl = new URL(window.location.href);
      ['exp', 'salary', 'level', 'type', 'saturday'].forEach(key => {
        if (searchState[key]) currentUrl.searchParams.set(key, searchState[key]);
        else currentUrl.searchParams.delete(key);
      });
      window.history.replaceState(window.history.state, '', currentUrl.toString());
    }
  });

  function sortLikeJobList(jobs) {
    const sortVal = searchState.sort || 'relevant';
    return jobs.sort((a, b) => {
      if (a._isSearchMatch && !b._isSearchMatch) return -1;
      if (!a._isSearchMatch && b._isSearchMatch) return 1;
      if (sortVal === 'salary_high') return b.salaryMax - a.salaryMax;
      if (sortVal === 'newest' || sortVal === 'post_date') return b.id - a.id;
      if (sortVal === 'update_date') {
        const aToday = a.updated && (a.updated.includes('Hôm nay') || a.updated.includes('giờ'));
        const bToday = b.updated && (b.updated.includes('Hôm nay') || b.updated.includes('giờ'));
        if (aToday && !bToday) return -1;
        if (!aToday && bToday) return 1;
        return b.id - a.id;
      }
      if (sortVal === 'urgent') {
        if (a.isFeatured && !b.isFeatured) return -1;
        if (!a.isFeatured && b.isFeatured) return 1;
        return b.id - a.id;
      }
      if (sortVal === 'views') return b.aiMatch - a.aiMatch;
      if (a.isFeatured && !b.isFeatured) return -1;
      if (!a.isFeatured && b.isFeatured) return 1;
      return b.aiMatch - a.aiMatch;
    });
  }

  // Tính 1 lần (dữ liệu tĩnh) để danh sách không nhảy vị trí khi chọn job khác
  let relatedJobsCache = null;
  function getRelatedJobs() {
    if (!relatedJobsCache) {
      const hasFilter = Object.keys(searchState).some(key => key !== 'sort');
      const realJobs = JOBS_DATA.filter(job => job.id !== 9999);
      realJobs.forEach(job => { job._isSearchMatch = hasFilter && isJobMatchingSearch(job); });
      relatedJobsCache = sortLikeJobList([...realJobs]);
      // Job tạo tạm từ ?title= (không có trong dữ liệu) vẫn được hiển thị ở đầu danh sách
      const mockJob = JOBS_DATA.find(job => job.id === 9999);
      if (mockJob) relatedJobsCache.unshift(mockJob);
    }
    return relatedJobsCache;
  }

  // Ẩn tạm việc làm trong phiên xem (nút "Ẩn việc làm" trên card, giống trang gốc)
  const hiddenJobIds = new Set();

  const detailSearchInput = document.getElementById('jobSearchInput');
  if (detailSearchInput && searchKeyword && !detailSearchInput.value.trim()) {
    detailSearchInput.value = searchKeyword;
    const clearSearchInputBtn = document.getElementById('clearSearchInputBtn');
    if (clearSearchInputBtn) clearSearchInputBtn.style.display = 'flex';
  }

  // Địa điểm & danh mục nghề: khôi phục giống syncStateFromUrl() của viec-lam.js
  if (searchState.location) {
    if (window.EasyCVLocationPicker) window.EasyCVLocationPicker.setSelected(searchState.location);
    const detailLocationSelect = document.getElementById('jobLocationSelect');
    if (detailLocationSelect) detailLocationSelect.value = searchState.location;
  }
  if (window.EasyCVCategoryModal && (searchState.category || searchState.industry)) {
    window.EasyCVCategoryModal.setSelection(searchState.category
      ? { groups: [searchState.category], subgroups: [], roles: [] }
      : { groups: [], subgroups: [], roles: [searchState.industry] });
  }

  // Toggle Full Width mode
  const mainContainer = document.getElementById('mainContainer');
  const btnToggleFullWidth = document.getElementById('btnToggleFullWidth');
  const fullWidthToggleText = document.getElementById('fullWidthToggleText');
  let isFullWidth = urlParams.get('full') === 'true';

  function updateFullWidthUI() {
    if (isFullWidth) {
      mainContainer?.classList.add('full-width-mode');
      if (fullWidthToggleText) fullWidthToggleText.textContent = 'Xem dạng 2 cột';
    } else {
      mainContainer?.classList.remove('full-width-mode');
      if (fullWidthToggleText) fullWidthToggleText.textContent = 'Xem toàn trang';
    }
  }

  btnToggleFullWidth?.addEventListener('click', () => {
    isFullWidth = !isFullWidth;
    updateFullWidthUI();
  });

  updateFullWidthUI();

  // Render Khối Bên Trái: Mô Tả Chi Tiết Job
  function renderDetail(job) {
    if (!job) return;

    // Document Title
    document.title = `${job.title} | ${job.company} - Tuyển dụng EasyCV`;
    const pageHeaderTitle = document.getElementById('pageHeaderTitle');
    if (pageHeaderTitle) pageHeaderTitle.textContent = job.title;

    // Hero
    const logo = document.getElementById('detailCompanyLogo');
    const title = document.getElementById('detailJobTitle');
    const compName = document.getElementById('detailCompanyName');
    const salaryBadge = document.getElementById('detailSalaryBadge');
    const locText = document.getElementById('detailLocationText');
    const updatedText = document.getElementById('detailUpdatedText');

    if (logo) { logo.src = getHiResLogo(job.logo); logo.alt = job.company; }
    if (title) title.textContent = job.title;
    if (compName) compName.textContent = job.company;
    if (salaryBadge) {
      salaryBadge.textContent = job.salaryBadge;
      if (job.salaryIsOrange) salaryBadge.classList.add('orange');
      else salaryBadge.classList.remove('orange');
    }
    if (locText) locText.textContent = job.location;
    if (updatedText) updatedText.textContent = `Cập nhật ${job.updated}`;

    // Nhãn Kinh nghiệm / Cấp bậc / Hình thức ở phần đầu (lương đã hiển thị ở #detailSalaryBadge)
    const metricExp = document.getElementById('metricExp');
    const metricLevel = document.getElementById('metricLevel');
    const metricType = document.getElementById('metricType');

    if (metricExp) {
      const expMap = { '0': 'Không yêu cầu kinh nghiệm', 'under1': 'Dưới 1 năm kinh nghiệm', '1-3': '1 - 3 năm kinh nghiệm', '3-5': '3 - 5 năm kinh nghiệm', 'over5': 'Trên 5 năm kinh nghiệm' };
      metricExp.textContent = expMap[job.exp] || `${job.exp} năm kinh nghiệm`;
    }
    if (metricLevel) {
      const levelMap = { 'intern': 'Thực tập sinh', 'junior': 'Nhân viên', 'senior': 'Trưởng nhóm / Senior', 'manager': 'Trưởng phòng / Manager' };
      metricLevel.textContent = levelMap[job.level] || job.level;
    }
    if (metricType) {
      const typeMap = { 'fulltime': 'Toàn thời gian', 'hybrid': 'Kết hợp (Hybrid)', 'remote': 'Từ xa (Remote 100%)', 'parttime': 'Bán thời gian' };
      metricType.textContent = typeMap[job.type] || job.type;
    }

    // Sections
    const descList = document.getElementById('detailDescList');
    const reqsList = document.getElementById('detailReqsList');
    const perksList = document.getElementById('detailPerksList');
    const skillsWrap = document.getElementById('detailSkillsWrap');

    if (descList && job.jd?.desc) descList.innerHTML = job.jd.desc.map(d => `<li>${d}</li>`).join('');
    if (reqsList && job.jd?.reqs) reqsList.innerHTML = job.jd.reqs.map(r => `<li>${r}</li>`).join('');
    if (perksList && job.jd?.perks) perksList.innerHTML = job.jd.perks.map(p => `<li>${p}</li>`).join('');
    if (skillsWrap && job.skills) skillsWrap.innerHTML = job.skills.map(s => `<span class="detail-skill-tag">${s}</span>`).join('');

    // Company Spotlight
    const compLogo = document.getElementById('detailCompanyCardLogo');
    const compTitle = document.getElementById('detailCompanyCardTitle');
    if (compLogo) compLogo.src = job.logo;
    if (compTitle) compTitle.textContent = job.company;

    // Sticky bar
    const stickyTitle = document.getElementById('stickyJobTitle');
    const stickySalary = document.getElementById('stickySalary');
    if (stickyTitle) stickyTitle.textContent = job.title;
    if (stickySalary) stickySalary.textContent = job.salaryBadge;

    // Bookmark state
    updateBookmarks(job.id);
  }

  // Render Khối Bên Phải: Danh Sách Job
  // Phân trang danh sách bên trái (markup giống renderPagination() của viec-lam.js)
  const LIST_PAGE_SIZE = 10;
  let currentListPage = 1;

  function renderListPagination(totalPages) {
    const wrap = document.getElementById('splitListPagination');
    if (!wrap) return;
    if (totalPages <= 1) {
      wrap.style.display = 'none';
      wrap.innerHTML = '';
      return;
    }
    wrap.style.display = 'flex';
    const prevDisabled = currentListPage === 1 ? 'disabled' : '';
    const nextDisabled = currentListPage === totalPages ? 'disabled' : '';
    let html = `<button type="button" class="page-btn ${prevDisabled}" data-page="prev" ${prevDisabled ? 'disabled' : ''} aria-label="Trang trước">« Trước</button>`;
    for (let p = 1; p <= totalPages; p++) {
      html += `<button type="button" class="page-btn ${p === currentListPage ? 'active' : ''}" data-page="${p}" ${p === currentListPage ? 'aria-current="page"' : ''}>${p}</button>`;
    }
    html += `<button type="button" class="page-btn ${nextDisabled}" data-page="next" ${nextDisabled ? 'disabled' : ''} aria-label="Trang sau">Sau »</button>`;
    wrap.innerHTML = html;

    wrap.querySelectorAll('.page-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const action = btn.getAttribute('data-page');
        let target = currentListPage;
        if (action === 'prev') target = currentListPage - 1;
        else if (action === 'next') target = currentListPage + 1;
        else target = parseInt(action, 10);
        if (!target || target < 1 || target > totalPages || target === currentListPage) return;
        currentListPage = target;
        renderList();
        scrollListIntoView();
      });
    });
  }

  // Cuộn trang về đầu danh sách, chừa chỗ cho thanh tìm kiếm sticky
  function scrollListIntoView() {
    const pane = document.getElementById('splitListPane');
    if (!pane) return;
    const offset = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--detail-sticky-top'), 10) || 148;
    const top = pane.getBoundingClientRect().top + window.scrollY - offset;
    if (pane.getBoundingClientRect().top < offset) window.scrollTo({ top: Math.max(0, top), behavior: 'smooth' });
  }

  function renderList({ focusActive = false } = {}) {
    const listFeed = document.getElementById('splitListFeed');
    const jobCount = document.getElementById('splitJobCount');
    if (!listFeed) return;

    const relatedJobs = getRelatedJobs().filter(job => !hiddenJobIds.has(job.id) || job.id === activeJobId);
    if (jobCount) jobCount.textContent = relatedJobs.length;

    const totalPages = Math.max(1, Math.ceil(relatedJobs.length / LIST_PAGE_SIZE));
    if (focusActive) {
      const activeIndex = relatedJobs.findIndex(job => job.id === activeJobId);
      if (activeIndex >= 0) currentListPage = Math.floor(activeIndex / LIST_PAGE_SIZE) + 1;
    }
    currentListPage = Math.min(Math.max(1, currentListPage), totalPages);
    const pageJobs = relatedJobs.slice((currentListPage - 1) * LIST_PAGE_SIZE, currentListPage * LIST_PAGE_SIZE);

    // Markup giống hệt card trong renderCurrentPage() của viec-lam.js (+ trạng thái "đang xem")
    const savedIds = getSavedJobs();
    const itemsHtml = pageJobs.map(job => {
      const isSelected = job.id === activeJobId;
      const isSaved = savedIds.includes(job.id);
      const featuredClass = job.isFeatured ? 'is-featured' : '';
      const expText = EXP_LABELS[job.exp] || '2 năm';
      const cityPill = job.city || job.location.split('(')[0].trim();
      const firstSkill = job.skills && job.skills.length > 0 ? job.skills[0] : '';
      const remainingCount = job.skills && job.skills.length > 1 ? ` | +${job.skills.length - 1}` : '';
      const skillsSummary = `${expText} kinh nghiệm chuyên môn${firstSkill ? ' | ' + firstSkill : ''}${remainingCount}`;
      const isViewed = job.id <= 3;

      return `
        <article class="job-card ${featuredClass} ${isSelected ? 'is-selected' : ''}" data-id="${job.id}" ${isSelected ? 'aria-current="true"' : ''}>
          <div class="job-card-top">
            <img src="${getHiResLogo(job.logo)}" alt="${job.company}" class="job-company-logo" loading="lazy" />
            <div class="job-info-main">
              <div class="job-header-row">
                <div class="job-title-wrap">
                  <h3 class="job-title">
                    <a href="${buildDetailHref(job)}" class="job-title-link" title="${job.title}">${job.title}</a>
                  </h3>
                  <div class="job-company-row">
                    <span class="job-company-name" title="${job.company}">${job.company.toUpperCase()}</span>
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
                ${isSelected
                  ? '<span class="split-viewing-badge">Đang xem</span>'
                  : `<span class="job-post-time">Đăng ${job.updated}</span>${isViewed ? '<span class="badge-viewed">Đã xem</span>' : ''}`}
              </div>
              <div class="job-actions-hovered">
                <button type="button" class="btn-card-apply" data-id="${job.id}">Ứng tuyển</button>
                ${isSelected ? '' : `
                <button type="button" class="btn-card-hide" data-id="${job.id}" aria-label="Ẩn việc làm này" title="Ẩn việc làm">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"/><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"/><path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"/><line x1="2" x2="22" y1="2" y2="22"/></svg>
                </button>`}
              </div>
              <button type="button" class="btn-card-bookmark ${isSaved ? 'saved' : ''}" data-id="${job.id}" aria-label="Lưu công việc" title="${isSaved ? 'Đã Lưu' : 'Lưu công việc'}">
                <svg width="17" height="17" viewBox="0 0 24 24" fill="${isSaved ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>
              </button>
            </div>
          </div>
        </article>
      `;
    }).join('');

    listFeed.innerHTML = itemsHtml;
    renderListPagination(totalPages);

    // Heart bookmark trên từng thẻ (dùng chung localStorage với trang Việc làm)
    listFeed.querySelectorAll('.btn-card-bookmark').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleBookmark(parseInt(btn.getAttribute('data-id'), 10));
      });
    });

    // Nút "Ứng tuyển" khi hover (giống trang gốc)
    listFeed.querySelectorAll('.btn-card-apply').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const job = JOBS_DATA.find(j => j.id === parseInt(btn.getAttribute('data-id'), 10));
        showToast(`Ứng tuyển thành công vị trí "${job?.title || 'công việc'}"! Nhà tuyển dụng sẽ phản hồi sớm.`, '🚀');
      });
    });

    // Nút "Ẩn việc làm" khi hover (giống trang gốc)
    listFeed.querySelectorAll('.btn-card-hide').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const card = btn.closest('.job-card');
        hiddenJobIds.add(parseInt(btn.getAttribute('data-id'), 10));
        if (card) {
          card.style.transition = 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)';
          card.style.opacity = '0';
          card.style.transform = 'scale(0.95)';
        }
        setTimeout(() => {
          renderList();
          showToast('Đã ẩn việc làm này khỏi danh sách gợi ý', '✓');
        }, 300);
      });
    });

    // Attach Click Handler on Left List Items
    listFeed.querySelectorAll('.job-card').forEach(card => {
      card.addEventListener('click', (e) => {
        // Click thẳng vào tên job: cho phép mở tab mới (Ctrl/Cmd + click) như trang Việc làm
        if (e.target.closest('.job-title-link') && (e.ctrlKey || e.metaKey || e.shiftKey || e.button === 1)) return;
        e.preventDefault();
        const id = parseInt(card.getAttribute('data-id'), 10);
        if (id && id !== activeJobId) {
          activeJobId = id;
          const currentJob = JOBS_DATA.find(j => j.id === id);
          if (currentJob) {
            renderDetail(currentJob);
            renderList();

            // Update URL
            if (window.history && window.history.pushState) {
              const currentUrl = new URL(window.location.href);
              currentUrl.searchParams.set('id', id);
              currentUrl.searchParams.set('title', currentJob.title);
              window.history.pushState({ page: 'job_detail', id, title: currentJob.title }, '', currentUrl.toString());
            }

            const scrollArea = document.getElementById('detailScrollArea');
            if (scrollArea) scrollArea.scrollTo({ top: 0, behavior: 'smooth' });

            // Mobile/tablet: khung chi tiết nằm phía trên danh sách → đưa người dùng lên xem job vừa chọn
            const detailPane = document.getElementById('splitDetailPane');
            if (detailPane && getComputedStyle(detailPane).position === 'static') {
              const offset = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--detail-sticky-top'), 10) || 148;
              window.scrollTo({ top: Math.max(0, detailPane.getBoundingClientRect().top + window.scrollY - offset), behavior: 'smooth' });
            }
          }
        }
      });
    });
  }

  // Bookmark functions
  function updateBookmarks(jobId) {
    const savedIds = getSavedJobs();
    const isSaved = savedIds.includes(jobId);

    const btnNavBookmark = document.getElementById('btnDetailBookmark');
    const navText = document.getElementById('detailBookmarkText');
    const btnHeroBookmark = document.getElementById('btnDetailSaveCard');
    const heroText = document.getElementById('detailSaveBtnText');

    if (btnNavBookmark) {
      btnNavBookmark.classList.toggle('saved', isSaved);
      btnNavBookmark.querySelector('svg')?.setAttribute('fill', isSaved ? 'currentColor' : 'none');
      if (navText) navText.textContent = isSaved ? 'Đã lưu' : 'Lưu tin';
    }
    if (btnHeroBookmark) {
      btnHeroBookmark.classList.toggle('saved', isSaved);
      btnHeroBookmark.querySelector('svg')?.setAttribute('fill', isSaved ? 'currentColor' : 'none');
      if (heroText) heroText.textContent = isSaved ? 'Đã Lưu' : 'Lưu';
    }
  }

  function toggleBookmark(jobId) {
    let savedIds = getSavedJobs();
    const job = JOBS_DATA.find(j => j.id === jobId);
    const title = job ? job.title : 'công việc';

    if (savedIds.includes(jobId)) {
      savedIds = savedIds.filter(id => id !== jobId);
      setSavedJobs(savedIds);
      showToast(`Đã bỏ lưu "${title}"`, 'ℹ️');
    } else {
      savedIds.push(jobId);
      setSavedJobs(savedIds);
      showToast(`Đã lưu "${title}" vào mục yêu thích!`, '❤️');
    }
    updateBookmarks(activeJobId);
    renderList(); // đồng bộ nút tim trên danh sách việc làm liên quan
  }

  document.getElementById('btnDetailBookmark')?.addEventListener('click', () => toggleBookmark(activeJobId));
  document.getElementById('btnDetailSaveCard')?.addEventListener('click', () => toggleBookmark(activeJobId));

  // Apply Actions
  const applyAction = () => {
    const job = JOBS_DATA.find(j => j.id === activeJobId) || JOBS_DATA[0];
    showToast(`Ứng tuyển thành công vị trí "${job.title}"! Nhà tuyển dụng sẽ phản hồi sớm qua email.`, '🚀');
  };
  document.getElementById('btnDetailApply')?.addEventListener('click', applyAction);
  document.getElementById('btnStickyApply')?.addEventListener('click', applyAction);

  // Copy Link
  document.getElementById('btnCopyJobLink')?.addEventListener('click', () => {
    navigator.clipboard?.writeText(window.location.href).then(() => {
      showToast('Đã sao chép liên kết việc làm vào bộ nhớ tạm!', '🔗');
    }).catch(() => {
      showToast('Đã sao chép liên kết việc làm!', '🔗');
    });
  });

  // --- Kế thừa Search Bar Functionality từ Trang Chủ ---
  if (!window.EasyCVDetailSearchV2) {
  const searchInput = document.getElementById('jobSearchInput') || document.getElementById('heroSearchInput');
  const clearSearchBtn = document.getElementById('clearSearchInputBtn');
  const searchSuggestDropdown = document.getElementById('searchSuggestDropdown');
  const btnCloseSuggest = document.getElementById('btnCloseSuggest');
  const btnClearSearchHistory = document.getElementById('btnClearSearchHistory');
  const recentSearchList = document.getElementById('recentSearchList');
  const categoryFilterLabel = document.getElementById('categoryFilterLabel');
  const jobCategoryHidden = document.getElementById('jobCategoryHidden');
  const jobIndustryHidden = document.getElementById('jobIndustryHidden');

  // Input & Clear Button
  if (searchInput) {
    searchInput.addEventListener('input', () => {
      if (clearSearchBtn) {
        clearSearchBtn.style.display = searchInput.value.trim() ? 'flex' : 'none';
      }
    });

    searchInput.addEventListener('focus', () => {
      if (searchSuggestDropdown) {
        renderRecentSearches();
        searchSuggestDropdown.classList.add('is-open');
      }
    });

    searchInput.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        searchSuggestDropdown?.classList.remove('is-open');
        searchInput.blur();
      }
    });
  }

  if (clearSearchBtn) {
    clearSearchBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      if (searchInput) {
        searchInput.value = '';
        searchInput.focus();
      }
      clearSearchBtn.style.display = 'none';
    });
  }

  if (btnCloseSuggest) {
    btnCloseSuggest.addEventListener('click', (e) => {
      e.stopPropagation();
      searchSuggestDropdown?.classList.remove('is-open');
    });
  }

  // Recent Searches
  const RECENT_KEY = 'easycv_recent_searches';
  const defaultRecent = ['Senior ReactJS Developer', 'Product Designer (Figma)', 'Digital Marketing Viettel', 'Nhân viên Kinh doanh B2B'];

  function getRecentSearches() {
    try {
      const data = localStorage.getItem(RECENT_KEY);
      return data ? JSON.parse(data) : defaultRecent;
    } catch {
      return defaultRecent;
    }
  }

  function renderRecentSearches() {
    if (!recentSearchList) return;
    const items = getRecentSearches();
    if (!items.length) {
      recentSearchList.innerHTML = '<span style="font-size: 13px; color: #8A8A8A;">Chưa có lịch sử tìm kiếm</span>';
      return;
    }
    recentSearchList.innerHTML = items.map(text => `
      <button type="button" class="recent-chip" data-search="${text.replace(/"/g, '&quot;')}">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
        <span>${text}</span>
      </button>
    `).join('');

    recentSearchList.querySelectorAll('.recent-chip').forEach(btn => {
      btn.addEventListener('click', () => {
        const val = btn.getAttribute('data-search');
        if (searchInput && val) {
          searchInput.value = val;
          if (clearSearchBtn) clearSearchBtn.style.display = 'flex';
          searchSuggestDropdown?.classList.remove('is-open');
          document.getElementById('jobSearchForm')?.submit();
        }
      });
    });
  }

  if (btnClearSearchHistory) {
    btnClearSearchHistory.addEventListener('click', (e) => {
      e.stopPropagation();
      localStorage.removeItem(RECENT_KEY);
      renderRecentSearches();
    });
  }

  // Close dropdown when clicking outside
  document.addEventListener('click', (e) => {
    if (searchSuggestDropdown?.classList.contains('is-open')) {
      if (!searchSuggestDropdown.contains(e.target) && !searchInput?.contains(e.target)) {
        searchSuggestDropdown.classList.remove('is-open');
      }
    }
  });

  // Category Modal Event Sync
  document.addEventListener('easycv:category-applied', (e) => {
    const detail = e.detail || {};
    const { groups = [], subgroups = [], roles = [], primaryQuery = '' } = detail;
    const chosenName = primaryQuery || roles[0] || subgroups[0] || (groups.length ? 'Đã chọn nhóm' : '');

    if (categoryFilterLabel) {
      categoryFilterLabel.textContent = chosenName || 'Danh mục Nghề';
      categoryFilterLabel.title = chosenName || 'Danh mục Nghề';
    }
    if (jobCategoryHidden) {
      jobCategoryHidden.value = groups[0] || '';
    }
    if (jobIndustryHidden) {
      jobIndustryHidden.value = chosenName || '';
    }

    // Yêu cầu 5: Nếu người dùng nhấn vào nút chọn thì áp dụng luôn danh sách lọc đó vào màn tra cứu việc làm
    if (chosenName || groups.length > 0) {
      const searchParams = new URLSearchParams();
      if (groups.length > 0) searchParams.set('category', groups[0]);
      if (chosenName) searchParams.set('industry', chosenName);
      window.location.assign(`viec-lam.html?${searchParams.toString()}`);
    }
  });
  }

  // Sticky Search Bar on Scroll
  function initStickySearch() {
    const wrapper = document.getElementById('heroSearchWrapper') || document.getElementById('jobSearchWrapper');
    const stickyBar = document.getElementById('heroSearchStickyBar') || document.getElementById('jobSearchStickyBar');
    if (!wrapper || !stickyBar) return;

    const header = document.querySelector('.site-header') || document.querySelector('.navbar');
    let ticking = false;

    function updateStickyState() {
      // Thanh menu (.site-header) không còn neo cố định trên màn chi tiết việc làm (position: relative),
      // nên khi cuộn màn hình xuống, thanh tìm kiếm và bộ lọc neo trực tiếp sát mép trên cùng (top: 0).
      stickyBar.style.setProperty('--sticky-search-top', '0px');

      // Mobile: thanh tìm kiếm + bộ lọc cao ~480px, nếu dính sẽ che gần hết màn hình → không neo
      const isCompactScreen = window.matchMedia('(max-width: 768px)').matches;

      const wrapperRect = wrapper.getBoundingClientRect();
      if (!isCompactScreen && wrapperRect.top <= 0) {
        if (!stickyBar.classList.contains('is-sticky')) {
          // Dùng chiều cao thực của stickyBar (gồm cả filter bar bên trong)
          wrapper.style.minHeight = stickyBar.offsetHeight + 'px';
          stickyBar.classList.add('is-sticky');
          syncDetailStickyTop();
        }
      } else {
        if (stickyBar.classList.contains('is-sticky')) {
          stickyBar.classList.remove('is-sticky');
          wrapper.style.minHeight = '';
        }
      }
      syncDetailStickyTop();
      ticking = false;
    }

    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(updateStickyState);
        ticking = true;
      }
    }, { passive: true });

    // Khung chi tiết (sticky) neo ngay dưới thanh tìm kiếm: đo chiều cao thực của thanh (gồm cả bộ lọc)
    // ở trạng thái đã dính — đó là lúc khung chi tiết cần né thanh này
    let measuredStickyHeight = 0;
    function syncDetailStickyTop() {
      if (window.matchMedia('(max-width: 768px)').matches) {
        document.documentElement.style.setProperty('--detail-sticky-top', '16px');
        return;
      }
      if (stickyBar.classList.contains('is-sticky')) measuredStickyHeight = stickyBar.offsetHeight;
      const barHeight = measuredStickyHeight || Math.max(stickyBar.offsetHeight, 132);
      document.documentElement.style.setProperty('--detail-sticky-top', `${barHeight + 16}px`);
    }

    window.addEventListener('resize', () => { updateStickyState(); syncDetailStickyTop(); }, { passive: true });
    // Thanh đổi chiều cao có hiệu ứng khi chuyển sang trạng thái dính → đo lại khi kích thước thực sự thay đổi
    if ('ResizeObserver' in window) new ResizeObserver(syncDetailStickyTop).observe(stickyBar);
    updateStickyState();
    syncDetailStickyTop();
  }

  initStickySearch();

  // Mục lục trong khung chi tiết: bấm để cuộn tới mục, tự đánh dấu mục đang đọc
  function initSectionNav() {
    const nav = document.getElementById('detailSectionNav');
    const scrollArea = document.getElementById('detailScrollArea');
    if (!nav || !scrollArea) return;
    const links = [...nav.querySelectorAll('a[href^="#"]')];
    const sections = links.map(link => document.querySelector(link.getAttribute('href'))).filter(Boolean);

    // Desktop: vùng cuộn là khung chi tiết; mobile/tablet (khung tĩnh): cuộn cả trang
    const usesInnerScroll = () => getComputedStyle(scrollArea).overflowY !== 'visible' && scrollArea.scrollHeight > scrollArea.clientHeight;

    function setActive(id) {
      links.forEach(link => link.classList.toggle('is-active', link.getAttribute('href') === `#${id}`));
    }

    // Sau khi bấm mục lục: giữ mục vừa chọn trong lúc cuộn mượt (mục ở cuối có thể không cuộn lên tới đỉnh)
    let lockUntil = 0;

    function updateActive() {
      if (Date.now() < lockUntil) return;
      const inner = usesInnerScroll();
      const baseTop = inner
        ? scrollArea.getBoundingClientRect().top + nav.offsetHeight + 24
        : (parseInt(getComputedStyle(document.documentElement).getPropertyValue('--detail-sticky-top'), 10) || 148) + 24;
      let current = sections[0];
      sections.forEach(section => {
        if (section.getBoundingClientRect().top - baseTop <= 0) current = section;
      });
      // Cuộn tới đáy vùng chi tiết thì đánh dấu mục cuối
      if (inner && scrollArea.scrollTop + scrollArea.clientHeight >= scrollArea.scrollHeight - 4) current = sections[sections.length - 1];
      if (current) setActive(current.id);
    }

    links.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const target = document.querySelector(link.getAttribute('href'));
        if (!target) return;
        if (usesInnerScroll()) {
          const top = target.getBoundingClientRect().top - scrollArea.getBoundingClientRect().top + scrollArea.scrollTop - nav.offsetHeight - 8;
          scrollArea.scrollTo({ top: Math.max(0, top), behavior: 'smooth' });
        } else {
          const offset = (parseInt(getComputedStyle(document.documentElement).getPropertyValue('--detail-sticky-top'), 10) || 148);
          window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - offset, behavior: 'smooth' });
        }
        setActive(target.id);
        lockUntil = Date.now() + 900;
      });
    });

    scrollArea.addEventListener('scroll', updateActive, { passive: true });
    window.addEventListener('scroll', updateActive, { passive: true });
    updateActive();
  }

  // Initial Load
  const initialJob = JOBS_DATA.find(j => j.id === activeJobId) || JOBS_DATA[0];
  renderDetail(initialJob);
  // Mở đúng trang danh sách chứa job đang xem (danh sách giữ nguyên thứ tự như trang Việc làm)
  renderList({ focusActive: true });
  initSectionNav();

  // =========================================================================
  // XỬ LÝ LỊCH SỬ DUYỆT TRÌNH DUYỆT (BROWSER BACK / FORWARD NAVIGATION)
  // Đảm bảo nút Back trên trình duyệt luôn quay về lại trang list job (viec-lam.html)
  // =========================================================================
  if (window.history && window.history.pushState && window.history.replaceState) {
    const referrer = document.referrer || '';
    const cameFromViecLam = referrer.includes('viec-lam.html') || referrer.includes('viec-lam');

    // Nếu người dùng mở tab mới độc lập hoặc vào link trực tiếp mà không có trang trước trong lịch sử tab
    if (!cameFromViecLam && window.history.length <= 1) {
      const currentUrl = window.location.href;
      const listQuery = getSearchStateQuery().slice(1);
      window.history.replaceState({ page: 'job_list_root' }, '', `viec-lam.html${listQuery ? `?${listQuery}` : ''}`);
      window.history.pushState({ page: 'job_detail', id: activeJobId, title: initialJob.title }, '', currentUrl);
    } else if (!window.history.state) {
      window.history.replaceState({ page: 'job_detail', id: activeJobId, title: initialJob.title }, '', window.location.href);
    }
  }

  // Lắng nghe sự kiện Popstate khi người dùng nhấn nút Back / Forward trên trình duyệt
  window.addEventListener('popstate', (e) => {
    // 1. Nếu quay về mốc lịch sử gốc hoặc URL chuyển sang viec-lam.html
    const listQuery = getSearchStateQuery().slice(1);
    const listUrl = `viec-lam.html${listQuery ? `?${listQuery}` : ''}`;
    if (e.state?.page === 'job_list_root' || window.location.pathname.endsWith('viec-lam.html') || window.location.pathname === '/viec-lam') {
      // URL lịch sử đã là trang danh sách (kèm trạng thái tìm kiếm) thì tải lại đúng URL đó
      window.location.href = window.location.pathname.includes('viec-lam') ? window.location.href : listUrl;
      return;
    }

    // 2. Nếu quay về một job trong lịch sử xem chi tiết
    const currentParams = new URLSearchParams(window.location.search);
    const targetPopId = parseInt(currentParams.get('id') || currentParams.get('jobId') || (e.state?.id) || '0', 10);
    if (targetPopId && targetPopId !== activeJobId) {
      const matchedJob = JOBS_DATA.find(j => j.id === targetPopId);
      if (matchedJob) {
        activeJobId = targetPopId;
        renderDetail(matchedJob);
        renderList({ focusActive: true });
        const scrollArea = document.getElementById('detailScrollArea');
        if (scrollArea) scrollArea.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }
    }

    // 3. Fallback: Nếu không còn id hợp lệ trên chi tiết việc làm, quay về trang danh sách
    if (!currentParams.get('id') && !currentParams.get('jobId') && !currentParams.get('title')) {
      window.location.href = listUrl;
    }
  });
});
