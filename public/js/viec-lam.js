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
      logo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=120&h=120&q=80',
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
      logo: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=120&h=120&q=80',
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
      logo: 'https://images.unsplash.com/photo-1572021335469-31706a17aaef?auto=format&fit=crop&w=120&h=120&q=80',
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
      logo: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=120&h=120&q=80',
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
      logo: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=120&h=120&q=80',
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
      logo: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=120&h=120&q=80',
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
      logo: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=120&h=120&q=80',
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
      logo: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=120&h=120&q=80',
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
      logo: 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=120&h=120&q=80',
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
      logo: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=120&h=120&q=80',
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
      logo: 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&w=120&h=120&q=80',
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
      logo: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=120&h=120&q=80',
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
      logo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=120&h=120&q=80',
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
      logo: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=120&h=120&q=80',
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
      logo: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=120&h=120&q=80',
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
      logo: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=120&h=120&q=80',
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
    }
  ];

  // =========================================================================
  // 2. CONFIGURATION & DOM ELEMENTS
  // =========================================================================
  const PAGE_SIZE = 6;
  let currentPage = 1;
  let currentFilteredJobs = [];

  const searchInput = document.getElementById('jobSearchInput') || document.getElementById('heroSearchInput');
  const clearSearchInputBtn = document.getElementById('clearSearchInputBtn');
  const locationSelect = document.getElementById('jobLocationSelect') || document.getElementById('heroLocationSelect');
  const heroLocationTrigger = document.getElementById('heroLocationTrigger') || document.getElementById('jobLocationTrigger');
  const categorySelect = document.getElementById('jobCategorySelect');
  const sortSelect = document.getElementById('sortSelect');
  const jobSearchForm = document.getElementById('jobSearchForm');
  const btnJobSearch = document.getElementById('btnJobSearch') || document.getElementById('btnHeroSearch');
  const sampleDataBanner = document.getElementById('sampleDataBanner');
  const jobCountText = document.getElementById('jobCountText');
  const activeSearchTag = document.getElementById('activeSearchTag');
  const activeKeywordText = document.getElementById('activeKeywordText');
  const btnClearKeyword = document.getElementById('btnClearKeyword');
  const noResultsBox = document.getElementById('noResultsBox');
  const btnResetSearch = document.getElementById('btnResetSearch');
  const jobListingGrid = document.getElementById('jobListingGrid');
  const paginationWrapper = document.getElementById('paginationWrapper');
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

  const FILTER_DEFAULT_LABELS = {
    exp: 'Kinh nghiệm',
    salary: 'Mức lương',
    level: 'Cấp bậc',
    type: 'Hình thức'
  };

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

    const hasFilter = Boolean(normQuery || normIndustry || (normLoc && normLoc !== 'tat ca dia diem') || catValue || activeTags.length > 0 || filterLevel || filterSalary || filterExp || filterType);

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

      // 5. Cấp bậc (Top Filter Bar)
      if (isMatch && filterLevel && job.level !== filterLevel) {
        isMatch = false;
      }

      // 6. Mức lương (Top Filter Bar)
      if (isMatch && filterSalary && !matchSalaryTier(job, filterSalary)) {
        isMatch = false;
      }

      // 7. Kinh nghiệm (Top Filter Bar)
      if (isMatch && filterExp && job.exp !== filterExp) {
        isMatch = false;
      }

      // 8. Hình thức (Top Filter Bar)
      if (isMatch && filterType && job.type !== filterType) {
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

    // Hiển thị Banner thông báo dữ liệu mẫu thông minh
    const sampleDataBanner = document.getElementById('sampleDataBanner');
    if (sampleDataBanner) {
      if (hasFilter) {
        sampleDataBanner.style.display = 'block';
        if (matchingJobs.length > 0) {
          sampleDataBanner.className = 'sample-data-banner match-success';
          sampleDataBanner.innerHTML = `
            <div class="banner-flex">
              <span class="banner-badge-icon">🎯</span>
              <div class="banner-content">
                <strong>Tìm thấy ${matchingJobs.length} việc làm phù hợp nhất</strong> được ưu tiên hiển thị đầu danh sách. Đồng thời hiển thị đầy đủ <strong>${JOBS_DATA.length} việc làm mẫu có sẵn</strong> để bạn trải nghiệm.
              </div>
            </div>
          `;
        } else {
          sampleDataBanner.className = 'sample-data-banner match-fallback';
          sampleDataBanner.innerHTML = `
            <div class="banner-flex">
              <span class="banner-badge-icon">💡</span>
              <div class="banner-content">
                <strong>Chế độ dữ liệu mẫu EasyCV:</strong> Không tìm thấy công việc nào khớp chính xác với yêu cầu lọc. Hệ thống đang hiển thị toàn bộ <strong>${JOBS_DATA.length} việc làm có sẵn</strong> để bạn tham khảo và trải nghiệm tính năng.
              </div>
            </div>
          `;
        }
      } else {
        sampleDataBanner.style.display = 'none';
        sampleDataBanner.innerHTML = '';
      }
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

    // Update active keyword badge
    if (activeSearchTag && activeKeywordText) {
      if (query || activeIndustryQuery) {
        const matchCount = currentFilteredJobs.filter(j => j._isSearchMatch).length;
        const criteria = [query && `Từ khóa: "${query}"`, activeIndustryQuery && `Ngành nghề: "${activeIndustryQuery}"`].filter(Boolean).join(' · ');
        if (matchCount > 0) {
          activeKeywordText.textContent = `${criteria} (${matchCount} khớp)`;
        } else {
          activeKeywordText.textContent = `${criteria} (Dữ liệu mẫu có sẵn)`;
        }
        activeSearchTag.style.display = 'inline-flex';
      } else {
        activeSearchTag.style.display = 'none';
      }
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
      const newUrl = `${window.location.pathname}${newParams.toString() ? '?' + newParams.toString() : ''}`;
      window.history.pushState(null, '', newUrl);
    }

    // Update dynamic filter counts based on current full dataset
    updateFilterCounts();
  }

  // =========================================================================
  // 4. SORTING ENGINE
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
      } else if (val === 'newest') {
        return b.id - a.id;
      } else if (val === 'views') {
        return b.aiMatch - a.aiMatch;
      } else {
        // Mặc định: Featured trước, sau đó AI match cao nhất
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

    // Update job count header
    if (jobCountText) {
      const matchCount = currentFilteredJobs.filter(j => j._isSearchMatch).length;
      if (matchCount > 0) {
        jobCountText.innerHTML = `${totalJobs} <span class="job-count-subtext">(${matchCount} việc làm khớp tiêu chí)</span>`;
      } else {
        jobCountText.textContent = totalJobs;
      }
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
    const cardsHtml = pageJobs.map(job => {
      const isSaved = savedIds.includes(job.id);
      const featuredClass = job.isFeatured ? 'is-featured' : '';
      const salaryOrangeClass = job.salaryIsOrange ? 'orange' : '';
      const urgentBadge = job.isUrgent
        ? `<span class="job-meta-item" style="color: #F97316; font-weight: 600;">⚡ Tuyển gấp</span>`
        : '';

      const skillChips = job.skills
        .map(s => `<span class="job-skill-chip">${s}</span>`)
        .join('');

      return `
        <article class="job-card ${featuredClass}" data-id="${job.id}">
          <div class="job-card-top">
            <img src="${job.logo}" alt="${job.company}" class="job-company-logo" loading="lazy" />
            <div class="job-info-main">
              <div class="job-title-row">
                <h3 class="job-title"><a href="chi-tiet-viec-lam.html?id=${job.id}" target="_blank" class="job-title-link" title="Click để mở tab chi tiết riêng">${job.title}</a></h3>
                <div class="job-badges-group">
                  ${job._isSearchMatch ? `<span class="badge-search-match" title="Việc làm khớp chính xác với tiêu chí tìm kiếm">✨ Khớp tìm kiếm</span>` : ''}
                  <span class="job-salary-badge ${salaryOrangeClass}">${job.salaryBadge}</span>
                </div>
              </div>
              <div class="job-company-row">
                <span class="job-company-name">${job.company}</span>
                ${job.verified ? `
                  <span class="badge-verified" title="Doanh nghiệp xác thực">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4" stroke="#FFF" stroke-width="2"/></svg>
                  </span>
                ` : ''}
              </div>
              <div class="job-meta-row">
                <span class="job-meta-item">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
                  <span class="job-location-text">${job.location}</span>
                </span>
                <span class="job-meta-item">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                  <span>Cập nhật ${job.updated}</span>
                </span>
                ${urgentBadge}
              </div>
            </div>
          </div>
          <div class="job-card-bottom">
            <div class="job-skills-tags">
              ${skillChips}
            </div>
            <div class="job-card-actions">
              <button type="button" class="btn-card-bookmark ${isSaved ? 'saved' : ''}" data-id="${job.id}" aria-label="Lưu công việc" title="${isSaved ? 'Đã lưu việc làm' : 'Lưu công việc'}">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="${isSaved ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2"><path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"/></svg>
              </button>
              <button type="button" class="btn-card-apply" data-id="${job.id}">Ứng tuyển</button>
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
        if (e.target.closest('.btn-card-bookmark') || e.target.closest('.btn-card-apply')) return;
        const id = parseInt(card.getAttribute('data-id'), 10);
        openSplitView(id);
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
        splitJobCount.innerHTML = `${currentFilteredJobs.length} <span style="font-size: 11.5px; font-weight: 600; color: #16A34A;">(${matchCount} khớp)</span>`;
      } else {
        splitJobCount.textContent = currentFilteredJobs.length;
      }
    }

    if (currentFilteredJobs.length === 0) {
      splitListFeed.innerHTML = `
        <div style="padding: 36px 16px; text-align: center; color: #64748B;">
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
                <a href="chi-tiet-viec-lam.html?id=${job.id}" target="_blank" class="job-title-link" title="Click để mở tab chi tiết riêng">${job.title}</a>
              </h4>
              <div class="split-card-company">${job.company}</div>
              <div class="split-card-badges">
                ${job._isSearchMatch ? `<span class="split-match-badge">🎯 Khớp</span>` : ''}
                <span class="job-salary-badge ${salaryOrangeClass}" style="font-size: 12px; padding: 2px 7px;">${job.salaryBadge}</span>
              </div>
            </div>
          </div>
          <div class="split-card-bottom">
            <span class="split-card-location">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
              <span>${job.city}</span>
            </span>
            <span style="font-size: 11.5px; color: #94A3B8;">${job.updated}</span>
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
        if (detailSaveBtnText) detailSaveBtnText.textContent = 'Lưu việc làm';
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
  // 8. DYNAMIC FILTER COUNTS & TOP FILTER BAR CONTROLLER
  // =========================================================================
  function updateFilterCounts() {
    document.querySelectorAll('[data-count-exp]').forEach(el => {
      const val = el.getAttribute('data-count-exp');
      el.textContent = JOBS_DATA.filter(j => j.exp === val).length;
    });
    document.querySelectorAll('[data-count-salary]').forEach(el => {
      const val = el.getAttribute('data-count-salary');
      el.textContent = JOBS_DATA.filter(j => matchSalaryTier(j, val)).length;
    });
    document.querySelectorAll('[data-count-level]').forEach(el => {
      const val = el.getAttribute('data-count-level');
      el.textContent = JOBS_DATA.filter(j => j.level === val).length;
    });
    document.querySelectorAll('[data-count-type]').forEach(el => {
      const val = el.getAttribute('data-count-type');
      el.textContent = JOBS_DATA.filter(j => j.type === val).length;
    });
  }

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
  }

  function updateFilterPillUI(type, value, label) {
    const btn = document.getElementById(`${type}FilterBtn`);
    const labelSpan = document.getElementById(`${type}FilterLabel`);
    if (!btn || !labelSpan) return;

    if (value) {
      btn.classList.add('is-active');
      labelSpan.textContent = label;
    } else {
      btn.classList.remove('is-active');
      labelSpan.textContent = FILTER_DEFAULT_LABELS[type] || 'Bộ lọc';
    }
  }

  function renderActiveFilterChips() {
    const chipsRow = document.getElementById('activeFilterChipsRow');
    const chipsList = document.getElementById('activeChipsList');
    const clearBtn = document.getElementById('btnClearTopFilters');
    if (!chipsList) return;

    chipsList.innerHTML = '';
    let activeCount = 0;

    const activeFilters = [
      { type: 'exp', value: selectedExp, labelPrefix: 'Kinh nghiệm' },
      { type: 'salary', value: selectedSalary, labelPrefix: 'Lương' },
      { type: 'level', value: selectedLevel, labelPrefix: 'Cấp bậc' },
      { type: 'type', value: selectedType, labelPrefix: 'Hình thức' }
    ];

    activeFilters.forEach(f => {
      if (f.value) {
        activeCount++;
        const selectedItem = document.querySelector(`.dropdown-item[data-type="${f.type}"][data-value="${f.value}"]`);
        const itemLabel = selectedItem ? (selectedItem.getAttribute('data-label') || selectedItem.querySelector('span')?.textContent.trim()) : f.value;
        
        const chip = document.createElement('span');
        chip.className = 'filter-chip';
        chip.innerHTML = `
          <span>${f.labelPrefix}: <strong>${itemLabel}</strong></span>
          <button type="button" class="filter-chip-remove" data-clear-type="${f.type}" title="Xóa bộ lọc ${f.labelPrefix}">✕</button>
        `;
        chipsList.appendChild(chip);
      }
    });

    if (activeCount > 0) {
      if (chipsRow) chipsRow.style.display = 'block';
      if (clearBtn) clearBtn.style.display = 'inline-flex';
    } else {
      if (chipsRow) chipsRow.style.display = 'none';
      if (clearBtn) clearBtn.style.display = 'none';
    }
  }

  function resetAllTopFilters(triggerFilter = true) {
    selectedExp = '';
    selectedSalary = '';
    selectedLevel = '';
    selectedType = '';

    ['exp', 'salary', 'level', 'type'].forEach(type => {
      updateFilterPillUI(type, '', '');
      document.querySelectorAll(`.dropdown-item[data-type="${type}"]`).forEach(item => {
        if (item.getAttribute('data-value') === '') {
          item.classList.add('is-selected');
          if (!item.querySelector('.check-icon')) {
            item.insertAdjacentHTML('beforeend', '<svg class="check-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg>');
          }
        } else {
          item.classList.remove('is-selected');
          item.querySelector('.check-icon')?.remove();
        }
      });
    });

    renderActiveFilterChips();
    closeAllFilterDropdowns();

    if (triggerFilter) {
      applyJobFilters(true, true);
    }
  }

  function initTopFilterBar() {
    // 1. Dropdown Pill Buttons click
    document.querySelectorAll('.filter-pill-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const wrap = btn.closest('.filter-dropdown-wrap');
        const menu = wrap?.querySelector('.filter-dropdown-menu');
        if (!menu) return;

        const isCurrentlyOpen = !menu.hidden;
        closeAllFilterDropdowns();

        if (!isCurrentlyOpen) {
          menu.hidden = false;
          btn.setAttribute('aria-expanded', 'true');
          wrap.classList.add('is-open');
        }
      });
    });

    // 2. Dropdown Items click
    document.querySelectorAll('.filter-dropdown-menu .dropdown-item').forEach(item => {
      item.addEventListener('click', (e) => {
        e.stopPropagation();
        const type = item.getAttribute('data-type');
        const value = item.getAttribute('data-value') || '';
        const label = item.getAttribute('data-label') || item.querySelector('span')?.textContent.trim() || '';

        if (type === 'exp') selectedExp = value;
        else if (type === 'salary') selectedSalary = value;
        else if (type === 'level') selectedLevel = value;
        else if (type === 'type') selectedType = value;

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

      updateFilterPillUI(clearType, '', '');
      const menu = document.getElementById(`${clearType}DropdownMenu`);
      menu?.querySelectorAll('.dropdown-item').forEach(i => {
        if (i.getAttribute('data-value') === '') {
          i.classList.add('is-selected');
          if (!i.querySelector('.check-icon')) {
            i.insertAdjacentHTML('beforeend', '<svg class="check-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg>');
          }
        } else {
          i.classList.remove('is-selected');
          i.querySelector('.check-icon')?.remove();
        }
      });

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

    // 7. Update counts
    updateFilterCounts();
  }

  // =========================================================================
  // 9. EVENT LISTENERS & POPSTATE (BACK / FORWARD SUPPORT)
  // =========================================================================

  // =========================================================================
  // RECENT SEARCHES & SUGGEST DROPDOWN (Kế thừa từ Trang chủ)
  // =========================================================================
  const RECENT_SEARCH_KEY = 'easycv_recent_searches_v2';

  function getRecentSearches() {
    try {
      const data = localStorage.getItem(RECENT_SEARCH_KEY);
      return data ? JSON.parse(data) : ['Marketing Leader', 'Senior ReactJS', 'Product Designer', 'Node.js Backend'];
    } catch (e) {
      return ['Marketing Leader', 'Senior ReactJS', 'Product Designer'];
    }
  }

  function saveRecentSearch(keyword) {
    if (!keyword || !keyword.trim()) return;
    const term = keyword.trim();
    try {
      let searches = getRecentSearches();
      searches = searches.filter(s => s.toLowerCase() !== term.toLowerCase());
      searches.unshift(term);
      if (searches.length > 8) searches = searches.slice(0, 8);
      localStorage.setItem(RECENT_SEARCH_KEY, JSON.stringify(searches));
      renderRecentSearches();
    } catch (e) {}
  }

  function removeRecentSearch(keyword) {
    try {
      let searches = getRecentSearches();
      searches = searches.filter(s => s.toLowerCase() !== keyword.toLowerCase());
      localStorage.setItem(RECENT_SEARCH_KEY, JSON.stringify(searches));
      renderRecentSearches();
    } catch (e) {}
  }

  function renderRecentSearches() {
    if (!recentSearchList) return;
    recentSearchList.innerHTML = '';
    const searches = getRecentSearches();
    if (!searches || searches.length === 0) {
      recentSearchList.innerHTML = '<span class="recent-empty-hint">Chưa có lịch sử tìm kiếm gần đây</span>';
      if (btnClearSearchHistory) btnClearSearchHistory.style.display = 'none';
      return;
    }
    if (btnClearSearchHistory) btnClearSearchHistory.style.display = 'inline-block';
    searches.forEach(keyword => {
      const chip = document.createElement('button');
      chip.type = 'button';
      chip.className = 'recent-chip';
      chip.innerHTML = `
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
        <span class="recent-chip-text">${keyword}</span>
        <span class="recent-chip-remove" title="Xóa từ khóa này">✕</span>
      `;
      chip.addEventListener('click', (e) => {
        if (e.target.classList.contains('recent-chip-remove')) {
          e.stopPropagation();
          removeRecentSearch(keyword);
          return;
        }
        if (searchInput) searchInput.value = keyword;
        if (clearSearchInputBtn) clearSearchInputBtn.style.display = 'flex';
        closeSuggest();
        applyJobFilters(true, true);
        showToast(`Tìm kiếm "${keyword}": Đang cập nhật kết quả`, '🎯');
      });
      recentSearchList.appendChild(chip);
    });
  }

  function openSuggest() {
    if (!searchSuggestDropdown) return;
    renderRecentSearches();
    searchSuggestDropdown.classList.add('is-open');
    if (searchInput) searchInput.setAttribute('aria-expanded', 'true');
  }

  function closeSuggest() {
    if (!searchSuggestDropdown) return;
    searchSuggestDropdown.classList.remove('is-open');
    if (searchInput) searchInput.setAttribute('aria-expanded', 'false');
  }

  searchInput?.addEventListener('focus', () => {
    openSuggest();
  });

  searchInput?.addEventListener('click', (e) => {
    e.stopPropagation();
    openSuggest();
  });

  btnClearSearchHistory?.addEventListener('click', (e) => {
    e.stopPropagation();
    try {
      localStorage.removeItem(RECENT_SEARCH_KEY);
      renderRecentSearches();
      showToast('Đã xóa toàn bộ lịch sử tìm kiếm', '🗑️');
    } catch (e) {}
  });

  btnCloseSuggest?.addEventListener('click', (e) => {
    e.stopPropagation();
    closeSuggest();
  });

  document.addEventListener('click', (e) => {
    if (searchSuggestDropdown && !searchSuggestDropdown.contains(e.target) && e.target !== searchInput) {
      closeSuggest();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeSuggest();
    }
  });

  // Search Form Submit
  jobSearchForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    closeSuggest();
    const query = searchInput?.value.trim() || '';
    if (query) saveRecentSearch(query);
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
  });

  // Explicit click handler for Search Button
  btnJobSearch?.addEventListener('click', (e) => {
    e.preventDefault();
    jobSearchForm?.dispatchEvent(new Event('submit', { cancelable: true }));
  });

  // Search Input live type & Clear button
  let searchDebounceTimer;
  searchInput?.addEventListener('input', () => {
    if (clearSearchInputBtn) {
      clearSearchInputBtn.style.display = searchInput.value.trim() ? 'flex' : 'none';
    }
    clearTimeout(searchDebounceTimer);
    searchDebounceTimer = setTimeout(() => {
      applyJobFilters(true, true);
    }, 250);
  });

  clearSearchInputBtn?.addEventListener('click', (e) => {
    e.preventDefault();
    if (searchInput) searchInput.value = '';
    clearSearchInputBtn.style.display = 'none';
    searchInput?.focus();
    applyJobFilters(true, true);
    showToast('Đã xóa từ khóa tìm kiếm', 'ℹ️');
  });

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
    const selectedTitle = (window.EasyCVCategoryModal && window.EasyCVCategoryModal.getPrimaryFilterQuery()) || 'Tất cả';
    showToast(`Đã lọc danh mục nghề: ${selectedTitle}`, '🎯');
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
      const headerHeight = header ? header.offsetHeight : 72;
      stickyBar.style.setProperty('--sticky-search-top', headerHeight + 'px');

      const wrapperRect = wrapper.getBoundingClientRect();
      if (wrapperRect.top < headerHeight) {
        if (!stickyBar.classList.contains('is-sticky')) {
          wrapper.style.minHeight = wrapperRect.height + 'px';
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
      } else if (heroLocationTrigger && heroLocationTrigger.firstChild) {
        heroLocationTrigger.firstChild.textContent = `${locationParam} `;
      }
      if (locationSelect) {
        locationSelect.value = locationParam;
      }
    } else {
      if (window.EasyCVLocationPicker) {
        window.EasyCVLocationPicker.reset();
      } else if (heroLocationTrigger && heroLocationTrigger.firstChild) {
        heroLocationTrigger.firstChild.textContent = 'Tất cả địa điểm ';
      }
      if (locationSelect) {
        locationSelect.value = '';
      }
    }

    if (categorySelect) {
      categorySelect.value = categoryParam || '';
    }

    if (window.EasyCVCategoryModal) {
      if (categoryParam) {
        window.EasyCVCategoryModal.setSelection({ groups: [categoryParam], subgroups: [], roles: [] });
      } else if (industryParam) {
        window.EasyCVCategoryModal.setSelection({ groups: [], subgroups: [], roles: [industryParam] });
      }
    }

    // Đồng bộ tham số Top Filter Bar từ URL
    const expParam = urlParams.get('exp') || '';
    const salaryParam = urlParams.get('salary') || '';
    const levelParam = urlParams.get('level') || '';
    const typeParam = urlParams.get('type') || '';

    selectedExp = expParam;
    selectedSalary = salaryParam;
    selectedLevel = levelParam;
    selectedType = typeParam;

    ['exp', 'salary', 'level', 'type'].forEach(t => {
      const val = t === 'exp' ? selectedExp : t === 'salary' ? selectedSalary : t === 'level' ? selectedLevel : selectedType;
      const item = document.querySelector(`.dropdown-item[data-type="${t}"][data-value="${val}"]`);
      const label = item ? (item.getAttribute('data-label') || item.querySelector('span')?.textContent.trim()) : val;
      updateFilterPillUI(t, val, label);

      const menu = document.getElementById(`${t}DropdownMenu`);
      menu?.querySelectorAll('.dropdown-item').forEach(i => {
        if (i.getAttribute('data-value') === val) {
          i.classList.add('is-selected');
          if (!i.querySelector('.check-icon')) {
            i.insertAdjacentHTML('beforeend', '<svg class="check-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg>');
          }
        } else {
          i.classList.remove('is-selected');
          i.querySelector('.check-icon')?.remove();
        }
      });
    });

    renderActiveFilterChips();

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

  // Browser Back / Forward navigation support
  window.addEventListener('popstate', () => {
    syncStateFromUrl();
  });

  // Initial Boot
  initTopFilterBar();
  syncStateFromUrl();
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
