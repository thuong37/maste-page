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
      logo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=120&h=120&q=80',
      verified: true,
      salaryBadge: '28 - 45 triệu',
      salaryIsOrange: false,
      location: 'Hà Nội (Cầu Giấy)',
      city: 'Hà Nội',
      category: 'it',
      level: 'senior',
      exp: '3-5',
      type: 'hybrid',
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
      location: 'Hồ Chí Minh (Quận 1)',
      city: 'Hồ Chí Minh',
      category: 'sales',
      level: 'junior',
      exp: '1-3',
      type: 'fulltime',
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
      location: 'Hồ Chí Minh (Quận 7)',
      city: 'Hồ Chí Minh',
      category: 'it',
      level: 'senior',
      exp: '3-5',
      type: 'fulltime',
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
      company: 'Tập đoàn Viettel',
      logo: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=120&h=120&q=80',
      verified: true,
      salaryBadge: '25 - 40 triệu',
      salaryIsOrange: false,
      location: 'Hà Nội (Cầu Giấy)',
      city: 'Hà Nội',
      category: 'marketing',
      level: 'senior',
      exp: '3-5',
      type: 'fulltime',
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
      location: 'Hồ Chí Minh & Bình Dương',
      city: 'Hồ Chí Minh',
      category: 'logistics',
      level: 'junior',
      exp: '1-3',
      type: 'fulltime',
      updated: '4 giờ trước',
      aiMatch: 89,
      skills: ['Supply Chain', 'Logistics', 'Warehouse Operations', 'Data Tracking'],
      jd: {
        desc: [
          'Điều phối quy trình phân loại, lưu kho và vận chuyển hàng hóa giữa các trung tâm khai thác (Sort Hubs).',
          'Theo dõi SLA thời gian giao hàng chặng cuối và xử lý các sự cố tắc nghẽn chuỗi cung ứng.',
          'Đề xuất các sáng kiến tối ưu hóa lộ trình vận chuyển nhằm giảm thiểu chi phí phát sinh.'
        ],
        reqs: [
          'Tốt nghiệp ngành Logistics, Quản trị chuỗi cung ứng, Ngoại thương hoặc ngành liên quan.',
          'Từ 1 - 3 năm kinh nghiệm làm việc trong các công ty chuyển phát nhanh (Express) hoặc E-commerce.',
          'Chịu được áp lực công việc cao, khả năng giải quyết sự cố linh hoạt.'
        ],
        perks: [
          'Mức lương 18 - 28 triệu/tháng + Phụ cấp ca và thưởng hiệu suất vận hành kho bãi.',
          'Môi trường E-commerce hàng đầu Đông Nam Á, văn hóa làm việc tốc độ và năng động.',
          'Bảo hiểm sức khỏe cao cấp mở rộng cho nhân viên chính thức.'
        ]
      }
    },
    {
      id: 6,
      title: 'Senior Java Backend Engineer (Spring Boot & Microservices)',
      company: 'Tập đoàn VNPAY',
      logo: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=120&h=120&q=80',
      verified: true,
      salaryBadge: '30 - 55 triệu',
      salaryIsOrange: false,
      location: 'Hà Nội & Remote',
      city: 'Hà Nội',
      category: 'it',
      level: 'senior',
      exp: '3-5',
      type: 'hybrid',
      updated: '5 giờ trước',
      aiMatch: 96,
      skills: ['Java', 'Spring Boot', 'Microservices', 'Kafka', 'High Traffic'],
      jd: {
        desc: [
          'Xây dựng và phát triển lõi cổng thanh toán VNPAY xử lý hàng chục triệu giao dịch tài chính mỗi ngày.',
          'Thiết kế kiến trúc hệ thống phân tán, đảm bảo tính khả dụng cao (High Availability 99.99%) và độ trễ thấp.',
          'Triển khai giải pháp bảo mật dữ liệu giao dịch ngân hàng theo tiêu chuẩn PCI-DSS.'
        ],
        reqs: [
          'Từ 3 - 5 năm kinh nghiệm lập trình Java chuyên sâu với Spring Boot, Spring Cloud, Hibernate.',
          'Hiểu biết vững chắc về Kafka / RabbitMQ, Redis, Oracle DB / PostgreSQL và tối ưu truy vấn.',
          'Kinh nghiệm thực tế về tối ưu hóa bộ nhớ JVM, xử lý concurrency và distributed locks.'
        ],
        perks: [
          'Mức lương hấp dẫn 30 - 55 triệu/tháng + Thưởng cuối năm 3 - 6 tháng lương.',
          'Gói bảo hiểm sức khỏe Bảo Việt VNPAY Care hạn mức 500 triệu/năm.',
          'Hỗ trợ thiết bị máy tính cấu hình cao và phụ cấp ăn trưa tại tòa nhà.'
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

  // Lấy ID công việc từ Query Param
  const urlParams = new URLSearchParams(window.location.search);
  const targetId = parseInt(urlParams.get('id') || urlParams.get('jobId') || '1', 10);
  let activeJobId = JOBS_DATA.some(j => j.id === targetId) ? targetId : JOBS_DATA[0].id;

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
    const breadcrumbTitle = document.getElementById('breadcrumbJobTitle');
    const pageHeaderTitle = document.getElementById('pageHeaderTitle');
    if (breadcrumbTitle) breadcrumbTitle.textContent = job.title;
    if (pageHeaderTitle) pageHeaderTitle.textContent = job.title;

    // Hero
    const logo = document.getElementById('detailCompanyLogo');
    const title = document.getElementById('detailJobTitle');
    const compName = document.getElementById('detailCompanyName');
    const aiBadge = document.getElementById('detailAiMatchBadge');
    const salaryBadge = document.getElementById('detailSalaryBadge');
    const locText = document.getElementById('detailLocationText');
    const updatedText = document.getElementById('detailUpdatedText');

    if (logo) { logo.src = job.logo; logo.alt = job.company; }
    if (title) title.textContent = job.title;
    if (compName) compName.textContent = job.company;
    if (aiBadge) aiBadge.textContent = `🎯 ${job.aiMatch}% Match`;
    if (salaryBadge) {
      salaryBadge.textContent = job.salaryBadge;
      if (job.salaryIsOrange) salaryBadge.classList.add('orange');
      else salaryBadge.classList.remove('orange');
    }
    if (locText) locText.textContent = job.location;
    if (updatedText) updatedText.textContent = `Cập nhật ${job.updated}`;

    // Metrics
    const metricSalary = document.getElementById('metricSalary');
    const metricExp = document.getElementById('metricExp');
    const metricLevel = document.getElementById('metricLevel');
    const metricType = document.getElementById('metricType');

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
  function renderList() {
    const listFeed = document.getElementById('splitListFeed');
    const jobCount = document.getElementById('splitJobCount');
    if (!listFeed) return;

    if (jobCount) jobCount.textContent = JOBS_DATA.length;

    const itemsHtml = JOBS_DATA.map(job => {
      const isSelected = job.id === activeJobId;
      const salaryOrangeClass = job.salaryIsOrange ? 'orange' : '';

      return `
        <div class="split-job-card ${isSelected ? 'is-selected' : ''}" data-id="${job.id}">
          ${isSelected ? `<span class="split-active-badge">👁 Đang xem</span>` : ''}
          <div class="split-card-top">
            <img src="${job.logo}" alt="${job.company}" class="split-company-logo" loading="lazy" />
            <div class="split-card-info">
              <h4 class="split-card-title">
                <a href="chi-tiet-viec-lam.html?id=${job.id}" class="job-title-link">${job.title}</a>
              </h4>
              <div class="split-card-company">${job.company}</div>
              <div class="split-card-badges">
                <span class="job-salary-badge ${salaryOrangeClass}" style="font-size: 12px; padding: 2px 7px;">${job.salaryBadge}</span>
                <span class="badge-ai-match" style="font-size: 11px; padding: 2px 6px;">🎯 ${job.aiMatch}%</span>
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

    listFeed.innerHTML = itemsHtml;

    // Attach Click Handler on Right List Items
    listFeed.querySelectorAll('.split-job-card').forEach(card => {
      card.addEventListener('click', (e) => {
        const id = parseInt(card.getAttribute('data-id'), 10);
        if (id && id !== activeJobId) {
          activeJobId = id;
          const currentJob = JOBS_DATA.find(j => j.id === id);
          renderDetail(currentJob);
          renderList();

          // Update URL
          if (window.history && window.history.pushState) {
            const currentUrl = new URL(window.location.href);
            currentUrl.searchParams.set('id', id);
            window.history.pushState({ id }, '', currentUrl.toString());
          }

          const scrollArea = document.getElementById('detailScrollArea');
          if (scrollArea) scrollArea.scrollTo({ top: 0, behavior: 'smooth' });
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
      if (heroText) heroText.textContent = isSaved ? 'Đã lưu việc làm' : 'Lưu việc làm';
    }
  }

  function toggleBookmark(jobId) {
    let savedIds = getSavedJobs();
    const job = JOBS_DATA.find(j => j.id === jobId);
    const title = job ? job.title : 'công việc';

    if (savedIds.includes(jobId)) {
      savedIds = savedIds.filter(id => id !== jobId);
      setSavedJobs(savedIds);
      updateBookmarks(jobId);
      showToast(`Đã bỏ lưu "${title}"`, 'ℹ️');
    } else {
      savedIds.push(jobId);
      setSavedJobs(savedIds);
      updateBookmarks(jobId);
      showToast(`Đã lưu "${title}" vào mục yêu thích!`, '❤️');
    }
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

  // Full Width Toggle
  const btnToggleFullWidth = document.getElementById('btnToggleFullWidth');
  const fullWidthText = document.getElementById('fullWidthToggleText');
  const splitContainer = document.querySelector('.job-split-container');
  btnToggleFullWidth?.addEventListener('click', () => {
    if (!splitContainer) return;
    const isFull = splitContainer.classList.toggle('full-width');
    if (fullWidthText) {
      fullWidthText.textContent = isFull ? 'Hiện 2 cột' : 'Xem toàn trang';
    }
  });

  // Copy Link
  document.getElementById('btnCopyJobLink')?.addEventListener('click', () => {
    navigator.clipboard?.writeText(window.location.href).then(() => {
      showToast('Đã sao chép liên kết việc làm vào bộ nhớ tạm!', '🔗');
    }).catch(() => {
      showToast('Đã sao chép liên kết việc làm!', '🔗');
    });
  });

  // Initial Load
  const initialJob = JOBS_DATA.find(j => j.id === activeJobId) || JOBS_DATA[0];
  renderDetail(initialJob);
  renderList();
});
