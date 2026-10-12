/**
 * EasyCV - Màn Chi tiết việc làm (chi-tiet-viec-lam.js)
 * Đọc dữ liệu dùng chung từ js/jobs-data.js (window.EASYCV_JOBS), tra theo ?id= (hoặc ?title=,
 * kèm ?company= với job mẫu của công ty) và render layout 2 cột: nội dung chính + sidebar công ty /
 * việc làm khác của công ty.
 */

document.addEventListener('DOMContentLoaded', () => {
  const JOBS = Array.isArray(window.EASYCV_JOBS) ? window.EASYCV_JOBS : [];
  const SAVED_KEY = 'easycv_saved_job_ids';
  const RATING_KEY = 'easycv_job_transparency_ratings_v2';

  const $ = id => document.getElementById(id);
  const esc = value => String(value ?? '').replace(/[&<>"']/g, ch => (
    { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch]
  ));
  const normalize = text => String(text || '')
    .normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[đĐ]/g, 'd').toLowerCase().trim();

  function readJson(key, fallback) {
    try { return JSON.parse(localStorage.getItem(key)) ?? fallback; } catch { return fallback; }
  }
  function writeJson(key, value) {
    try { localStorage.setItem(key, JSON.stringify(value)); } catch { /* bỏ qua khi storage bị chặn */ }
  }

  let toastTimer = null;
  function showToast(message, icon = '✓') {
    const toast = $('toastMsg');
    if (!toast) return;
    toast.innerHTML = `<span>${icon}</span> <span>${esc(message)}</span>`;
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('show'), 2800);
  }

  // -----------------------------------------------------------------------
  // 1. Xác định job từ query string
  // -----------------------------------------------------------------------
  const params = new URLSearchParams(window.location.search);
  const targetId = parseInt(params.get('id') || params.get('jobId') || '0', 10);
  const targetTitle = (params.get('title') || params.get('jobTitle') || '').trim();
  const targetCompany = (params.get('company') || '').trim();

  // Job mẫu cho "Việc làm khác của công ty": dữ liệu chung mỗi công ty chỉ có 1 job, nên sinh thêm
  // 3 vị trí theo ngành (ổn định theo id job gốc). Chỉ dùng trên trang này, không thêm vào jobs-data.js;
  // trang chi tiết của job mẫu là bản rút gọn (chưa có mô tả công việc).
  const COMPANY_ROLE_POOL = {
    it: [
      { title: 'Java Backend Developer (Spring Boot)', level: 'senior', exp: '3-5', salary: '25 - 40 triệu', skills: ['Java', 'Spring Boot', 'MySQL'] },
      { title: 'Frontend Developer (ReactJS)', level: 'junior', exp: '1-3', salary: '18 - 30 triệu', skills: ['ReactJS', 'TypeScript', 'HTML/CSS'] },
      { title: 'QA/QC Automation Engineer', level: 'junior', exp: '1-3', salary: '15 - 25 triệu', skills: ['Selenium', 'Cypress', 'API Testing'] },
      { title: 'DevOps Engineer (AWS / Kubernetes)', level: 'senior', exp: '3-5', salary: '30 - 50 triệu', skills: ['AWS', 'Kubernetes', 'CI/CD'] },
      { title: 'Business Analyst (IT)', level: 'junior', exp: '1-3', salary: '18 - 28 triệu', skills: ['Phân tích nghiệp vụ', 'SQL', 'Jira'] },
      { title: 'Thực tập sinh Lập trình Web', level: 'intern', exp: '0', salary: '4 - 6 triệu', skills: ['JavaScript', 'Git'] }
    ],
    sales: [
      { title: 'Chuyên viên Kinh doanh B2B', level: 'junior', exp: '1-3', salary: '12 - 20 triệu', skills: ['Bán hàng B2B', 'Đàm phán', 'CRM'] },
      { title: 'Trưởng nhóm Kinh doanh Khu vực', level: 'manager', exp: '3-5', salary: '25 - 35 triệu', skills: ['Quản lý đội nhóm', 'Lập kế hoạch kinh doanh'] },
      { title: 'Nhân viên Chăm sóc Khách hàng', level: 'junior', exp: 'under1', salary: '9 - 12 triệu', skills: ['Giao tiếp', 'Xử lý khiếu nại'] },
      { title: 'Chuyên viên Phát triển Thị trường', level: 'junior', exp: '1-3', salary: '12 - 18 triệu', skills: ['Nghiên cứu thị trường', 'Phát triển đại lý'] },
      { title: 'Thực tập sinh Kinh doanh', level: 'intern', exp: '0', salary: '3 - 5 triệu', skills: ['Giao tiếp', 'Tin học văn phòng'] }
    ],
    marketing: [
      { title: 'Digital Marketing Executive', level: 'junior', exp: '1-3', salary: '12 - 18 triệu', skills: ['Facebook Ads', 'Google Ads', 'SEO'] },
      { title: 'Content Marketing Specialist', level: 'junior', exp: '1-3', salary: '10 - 16 triệu', skills: ['Copywriting', 'Social Media'] },
      { title: 'Performance Marketing Lead', level: 'senior', exp: '3-5', salary: '25 - 35 triệu', skills: ['Performance Ads', 'Google Analytics'] },
      { title: 'Chuyên viên Thương hiệu (Brand Executive)', level: 'junior', exp: '1-3', salary: '15 - 22 triệu', skills: ['Brand Management', 'Truyền thông'] },
      { title: 'Thực tập sinh Marketing', level: 'intern', exp: '0', salary: '3 - 5 triệu', skills: ['Canva', 'Social Media'] }
    ],
    finance: [
      { title: 'Chuyên viên Phân tích Tài chính (FP&A)', level: 'junior', exp: '1-3', salary: '18 - 28 triệu', skills: ['Phân tích tài chính', 'Excel', 'Power BI'] },
      { title: 'Kế toán Tổng hợp', level: 'junior', exp: '3-5', salary: '14 - 20 triệu', skills: ['Kế toán thuế', 'MISA', 'Báo cáo tài chính'] },
      { title: 'Chuyên viên Kiểm soát Nội bộ', level: 'senior', exp: '3-5', salary: '22 - 32 triệu', skills: ['Kiểm soát nội bộ', 'Quy trình tài chính'] },
      { title: 'Kế toán Công nợ', level: 'junior', exp: '1-3', salary: '10 - 15 triệu', skills: ['Đối chiếu công nợ', 'Excel'] },
      { title: 'Thực tập sinh Tài chính - Kế toán', level: 'intern', exp: '0', salary: '4 - 6 triệu', skills: ['Excel', 'Nguyên lý kế toán'] }
    ],
    hr: [
      { title: 'Chuyên viên Tuyển dụng (Talent Acquisition)', level: 'junior', exp: '1-3', salary: '14 - 20 triệu', skills: ['Tuyển dụng', 'Phỏng vấn', 'Employer Branding'] },
      { title: 'Chuyên viên C&B (Lương - Phúc lợi)', level: 'junior', exp: '1-3', salary: '15 - 22 triệu', skills: ['Tính lương', 'Bảo hiểm xã hội', 'Excel'] },
      { title: 'HR Business Partner', level: 'senior', exp: '3-5', salary: '25 - 35 triệu', skills: ['HRBP', 'Quan hệ lao động'] },
      { title: 'Chuyên viên Đào tạo & Phát triển', level: 'junior', exp: '1-3', salary: '14 - 20 triệu', skills: ['Đào tạo nội bộ', 'L&D'] },
      { title: 'Thực tập sinh Nhân sự', level: 'intern', exp: '0', salary: '3 - 5 triệu', skills: ['Tin học văn phòng', 'Giao tiếp'] }
    ],
    logistics: [
      { title: 'Chuyên viên Điều phối Vận tải', level: 'junior', exp: '1-3', salary: '12 - 18 triệu', skills: ['Điều phối', 'TMS'] },
      { title: 'Trưởng ca Vận hành Kho', level: 'senior', exp: '3-5', salary: '15 - 22 triệu', skills: ['Quản lý kho', 'WMS', '5S'] },
      { title: 'Chuyên viên Xuất nhập khẩu', level: 'junior', exp: '1-3', salary: '12 - 20 triệu', skills: ['Thủ tục hải quan', 'Incoterms'] },
      { title: 'Chuyên viên Kế hoạch Chuỗi cung ứng', level: 'junior', exp: '1-3', salary: '15 - 22 triệu', skills: ['Supply Chain', 'Dự báo nhu cầu'] },
      { title: 'Thực tập sinh Logistics', level: 'intern', exp: '0', salary: '3 - 5 triệu', skills: ['Tin học văn phòng', 'Tiếng Anh'] }
    ]
  };

  const firstJobOfCompany = name => JOBS.find(j => normalize(j.company) === normalize(name));

  // Vị trí mẫu gần trùng job gốc (>= 75% số từ trong tên, tính cả khi bỏ phần trong ngoặc) thì bỏ qua,
  // vd. "QA/QC Automation Engineer" với "QA / QC Automation Test Engineer (Selenium & CI/CD)"
  const titleWords = text => normalize(text).split(/[^a-z0-9]+/).filter(Boolean);
  function overlapsTitle(roleTitle, baseTitle) {
    const baseWords = new Set(titleWords(baseTitle));
    return [roleTitle, roleTitle.replace(/\(.*?\)/g, '')].some(text => {
      const words = titleWords(text);
      return words.length > 0 && words.filter(w => baseWords.has(w)).length >= words.length * 0.75;
    });
  }

  function companyOpenings(base) {
    const pool = COMPANY_ROLE_POOL[base.category] || COMPANY_ROLE_POOL.it;
    const start = (base.id || 0) % pool.length;
    return [...pool.slice(start), ...pool.slice(0, start)]
      .filter(role => !overlapsTitle(role.title, base.title))
      .slice(0, 3)
      .map(role => ({
        id: 0,
        title: role.title,
        company: base.company,
        logo: base.logo,
        salaryBadge: role.salary,
        location: base.location,
        city: base.city,
        category: base.category,
        level: role.level,
        exp: role.exp,
        type: base.type,
        saturday: base.saturday,
        skills: role.skills,
        jd: {}
      }));
  }

  function buildFallbackJob(title) {
    return {
      id: 0,
      title,
      company: 'Doanh nghiệp tuyển dụng',
      logo: 'assets/logos/easycv-icon.png',
      salaryBadge: 'Thỏa thuận',
      location: 'Toàn quốc',
      city: 'Toàn quốc',
      category: 'it',
      level: 'junior',
      exp: '1-3',
      type: 'fulltime',
      skills: [],
      jd: {}
    };
  }

  let job = targetId ? JOBS.find(j => j.id === targetId) : null;
  if (!job && targetTitle) {
    const wanted = normalize(targetTitle);
    const sourceJob = targetCompany ? firstJobOfCompany(targetCompany) : null;
    job = JOBS.find(j => normalize(j.title) === wanted && (!sourceJob || j.company === sourceJob.company))
      || (sourceJob && companyOpenings(sourceJob).find(j => normalize(j.title) === wanted))
      || buildFallbackJob(targetTitle);
  }

  if (!job) {
    renderNotFound();
    return;
  }

  // -----------------------------------------------------------------------
  // 2. Chuẩn hóa dữ liệu hiển thị (trường nào job chưa có thì suy ra ổn định theo id)
  // -----------------------------------------------------------------------
  const EXP_LABEL = {
    '0': 'Không yêu cầu', under1: 'Dưới 1 năm', '1-3': '1 - 3 năm', '3-5': '3 - 5 năm', over5: 'Trên 5 năm'
  };
  const EDU_BY_LEVEL = {
    intern: 'Đang học Cao đẳng / Đại học', junior: 'Cao đẳng trở lên', senior: 'Đại học trở lên', manager: 'Đại học trở lên'
  };
  const INDUSTRY_BY_CATEGORY = {
    it: 'Công nghệ thông tin', sales: 'Kinh doanh / Bán hàng', marketing: 'Marketing / Truyền thông',
    finance: 'Tài chính / Ngân hàng / Kế toán', hr: 'Nhân sự / Tuyển dụng', logistics: 'Vận tải / Logistics',
    hospitality: 'Nhà hàng / Khách sạn / Du lịch', eng: 'Kỹ thuật / Sản xuất'
  };
  const COMPANY_SIZES = ['25 - 99 nhân viên', '100 - 499 nhân viên', '500 - 999 nhân viên', '1.000 - 4.999 nhân viên', '5.000+ nhân viên'];

  function companyIntroduction(j, industry) {
    const city = j.city || 'Việt Nam';
    return `${j.company} hoạt động trong lĩnh vực ${industry.toLowerCase()}, với đội ngũ chuyên môn giàu kinh nghiệm và môi trường làm việc chú trọng sự phát triển lâu dài. Doanh nghiệp đang mở rộng hoạt động tại ${city}, đồng thời tìm kiếm những ứng viên phù hợp để cùng xây dựng các sản phẩm và dịch vụ có giá trị.`;
  }

  function expLabel(j) {
    return EXP_LABEL[j.exp] || (j.exp ? `${j.exp} năm` : 'Không yêu cầu');
  }

  function deadlineOf(j) {
    // Hạn cố định theo id để không đổi giữa các lần tải trang
    const d = new Date(2026, 9, 31 + ((j.id || 0) * 3) % 45);
    const pad = n => String(n).padStart(2, '0');
    return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()}`;
  }

  function workingTime(j) {
    if (j.type === 'remote') return ['Linh hoạt thời gian, thỏa thuận cùng quản lý trực tiếp'];
    if (j.saturday === 'off_sat') return ['Thứ 2 - Thứ 6 (từ 08:30 đến 17:30)', 'Nghỉ Thứ 7, Chủ nhật'];
    if (j.saturday === 'work_sat') return ['Thứ 2 - Thứ 7 (từ 08:00 đến 17:00)', 'Được nghỉ 2 chiều thứ 7 trong tháng'];
    return ['Giờ hành chính, Thứ 2 - Thứ 6 (từ 08:30 đến 17:30)'];
  }

  function chip(text) { return `<span class="jd-chip">${esc(text)}</span>`; }
  function listItems(items, fallback) {
    const rows = Array.isArray(items) && items.length ? items : [fallback];
    return rows.map(item => `<li>${esc(item)}</li>`).join('');
  }
  function cleanSummary(value) {
    return String(value || '').trim().replace(/[.!?]+$/, '');
  }
  function firstSummary(items, fallback) {
    return cleanSummary(Array.isArray(items) && items.length ? items[0] : fallback);
  }

  // -----------------------------------------------------------------------
  // 3. Render
  // -----------------------------------------------------------------------
  const jd = job.jd || {};
  const jobKey = job.id || `t:${normalize(job.title)}`;
  const searchUrl = keyword => `viec-lam.html?keyword=${encodeURIComponent(keyword)}`;
  const companyUrl = searchUrl(job.company);
  const jobUrl = j => (j.id
    ? `chi-tiet-viec-lam.html?id=${j.id}&title=${encodeURIComponent(j.title)}`
    : `chi-tiet-viec-lam.html?title=${encodeURIComponent(j.title)}&company=${encodeURIComponent(j.company)}`);
  const deadline = deadlineOf(job);

  document.title = `${job.title} | ${job.company} - Tuyển dụng EasyCV`;
  const metaDesc = document.querySelector('meta[name="description"]');
  if (metaDesc) metaDesc.setAttribute('content', `${job.title} tại ${job.company}. Mức lương ${job.salaryBadge}, địa điểm ${job.city}. Xem mô tả công việc và ứng tuyển trên EasyCV.`);

  $('jdTitle').textContent = job.title;
  $('jdSalary').textContent = job.salaryBadge;
  $('jdSalaryLink').href = searchUrl(job.title);
  $('jdMetaLocation').textContent = job.city || job.location;
  $('jdMetaExp').textContent = expLabel(job);
  $('jdMetaDeadline').textContent = deadline;
  $('jdDeadlineText').textContent = deadline;

  // Tổng quan
  const reqChips = [`${expLabel(job) === 'Không yêu cầu' ? 'Không yêu cầu kinh nghiệm chuyên môn' : expLabel(job) + ' kinh nghiệm'}`, EDU_BY_LEVEL[job.level] || 'Không yêu cầu bằng cấp'];
  const perkChips = [`Thu nhập ${job.salaryBadge}`];
  if (job.type === 'hybrid') perkChips.push('Làm việc Hybrid');
  if (job.type === 'remote') perkChips.push('Làm việc từ xa');
  if (job.saturday === 'off_sat') perkChips.push('Nghỉ thứ 7');
  perkChips.push('Bảo hiểm đầy đủ');
  $('jdOvReqs').innerHTML = reqChips.map(chip).join('');
  $('jdOvPerks').innerHTML = perkChips.map(chip).join('');
  $('jdOvSkills').innerHTML = (job.skills && job.skills.length ? job.skills : [INDUSTRY_BY_CATEGORY[job.category] || 'Đa ngành']).map(chip).join('');

  // Nội dung mô tả
  $('jdDescSummary').textContent = firstSummary(jd.desc, `${job.title} tại ${job.company}`);
  $('jdReqsSummary').textContent = [
    expLabel(job) === 'Không yêu cầu' ? 'Không yêu cầu kinh nghiệm' : `${expLabel(job)} kinh nghiệm`,
    ...(job.skills || []).slice(0, 3)
  ].join(' · ');
  $('jdPerksSummary').textContent = firstSummary(jd.perks, `Thu nhập ${job.salaryBadge} và bảo hiểm đầy đủ`);
  $('jdDescList').innerHTML = listItems(jd.desc, 'Nhà tuyển dụng đang cập nhật mô tả công việc.');
  $('jdReqsList').innerHTML = listItems(jd.reqs, 'Nhà tuyển dụng đang cập nhật yêu cầu ứng viên.');
  $('jdPerksList').innerHTML = listItems(jd.perks, 'Nhà tuyển dụng đang cập nhật quyền lợi.');
  $('jdPlaceList').innerHTML = `<li><strong>${esc(job.city)}:</strong> ${esc(job.location)}</li>`;
  $('jdTimeList').innerHTML = listItems(workingTime(job));

  // Sidebar: công ty
  const logo = $('jdCompanyLogo');
  logo.src = job.logo;
  logo.alt = job.company;
  $('jdCompanyLogoLink').href = companyUrl;
  const nameLink = $('jdCompanyName');
  nameLink.href = companyUrl;
  nameLink.textContent = job.company;
  $('jdCompanyPageBtn').href = companyUrl;
  // Job mẫu dùng chung hồ sơ công ty với job gốc; job dựng từ ?title= không rõ công ty thì không có job gốc
  const companySource = firstJobOfCompany(job.company);
  const companySize = COMPANY_SIZES[((companySource || job).id || 0) % COMPANY_SIZES.length];
  const companyIndustry = INDUSTRY_BY_CATEGORY[job.category] || 'Đa ngành';
  $('jdCompanySize').textContent = companySize;
  $('jdCompanyAddress').textContent = job.location;
  $('jdCompanyIndustry').textContent = companyIndustry;

  // Khối hồ sơ công ty trong nội dung chính
  const profileNameEl = $('jdCompanyProfileName');
  if (profileNameEl) profileNameEl.textContent = job.company;

  const profileDescEl = $('jdCompanyProfileDesc');
  if (profileDescEl) profileDescEl.textContent = companyIntroduction(job, companyIndustry);

  const descMoreLink = $('jdCompanyDescMore');
  if (descMoreLink) {
    descMoreLink.href = companyUrl;
    descMoreLink.title = `Xem thêm thông tin ${job.company}`;
  }

  const profileMoreLink = $('jdCompanyProfileMore');
  if (profileMoreLink) {
    profileMoreLink.href = companyUrl;
    profileMoreLink.title = `Xem thêm hồ sơ ${job.company}`;
  }

  const legalNameEl = $('jdCompanyLegalName');
  if (legalNameEl) legalNameEl.textContent = job.company;

  const industryEl = $('jdCompanyProfileIndustry');
  if (industryEl) industryEl.textContent = companyIndustry;

  const sizeEl = $('jdCompanyProfileSize');
  if (sizeEl) sizeEl.textContent = companySize;

  const cityEl = $('jdCompanyProfileCity');
  if (cityEl) cityEl.textContent = job.city || 'Toàn quốc';

  const addressEl = $('jdCompanyProfileAddress');
  if (addressEl) addressEl.textContent = job.location;

  const mapLinkEl = $('jdCompanyMapLink');
  if (mapLinkEl) {
    mapLinkEl.href = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(job.location)}`;
  }

  // Sidebar: việc làm khác của công ty (job thật cùng công ty trước, rồi tới job mẫu)
  const companyJobsList = $('jdCompanyJobsList');
  if (companyJobsList) {
    const companyJobs = companySource
      ? [...JOBS.filter(j => j.company === job.company), ...companyOpenings(companySource)]
        .filter(j => normalize(j.title) !== normalize(job.title))
        .slice(0, 3)
      : [];
    companyJobsList.innerHTML = companyJobs.map(j => `
      <a class="jd-company-job" href="${jobUrl(j)}">
        <h3 class="jd-company-job-title">${esc(j.title)}</h3>
        <span class="jd-company-job-salary">${esc(j.salaryBadge)}</span>
        <span class="jd-related-tags"><span>${esc(j.city)}</span><span>${esc(expLabel(j))}</span></span>
      </a>`).join('');
    if (!companyJobs.length) companyJobsList.closest('.jd-company-jobs').hidden = true;
  }

  // -----------------------------------------------------------------------
  // 4. Việc làm liên quan
  // -----------------------------------------------------------------------
  // Bỏ job cùng công ty: đã có ở khối "Việc làm khác của công ty"
  const related = JOBS
    .filter(j => j.id !== job.id && j.company !== job.company)
    .sort((a, b) => (b.category === job.category) - (a.category === job.category))
    .slice(0, 5);
  $('jdRelatedList').innerHTML = related.map(j => {
    const tags = [
      (j.isUrgent || j.isFeatured) ? '<span class="jd-tag-hot">HOT</span>' : '',
      `<span>${esc(j.city)}</span>`,
      `<span>${esc(expLabel(j))}</span>`
    ].join('');
    return `
      <a class="jd-related-card" href="${jobUrl(j)}">
        <img class="jd-related-logo" src="${esc(j.logo)}" alt="${esc(j.company)}" loading="lazy" />
        <div class="jd-related-body">
          <div class="jd-related-top">
            <h3 class="jd-related-title">${esc(j.title)}</h3>
            <span class="jd-related-salary">${esc(j.salaryBadge)}</span>
          </div>
          <div class="jd-related-company">${esc(j.company)}</div>
          <div class="jd-related-tags">${tags}</div>
        </div>
      </a>`;
  }).join('');
  if (!related.length) $('jdRelatedList').closest('.jd-related').hidden = true;

  // -----------------------------------------------------------------------
  // 5. Tương tác: ứng tuyển, lưu tin, báo cáo, đánh giá
  // -----------------------------------------------------------------------
  document.querySelectorAll('[data-jd-apply]').forEach(btn => {
    btn.addEventListener('click', () => {
      showToast(`Ứng tuyển thành công vị trí "${job.title}"! Nhà tuyển dụng sẽ phản hồi sớm.`, '🚀');
    });
  });

  const saveButtons = document.querySelectorAll('[data-jd-save]');
  function isSaved() { return readJson(SAVED_KEY, []).includes(jobKey); }
  function paintSaved() {
    const saved = isSaved();
    saveButtons.forEach(btn => {
      btn.classList.toggle('is-saved', saved);
      btn.setAttribute('aria-pressed', String(saved));
      const label = btn.querySelector('[data-jd-save-label]');
      if (label) label.textContent = saved ? 'Đã lưu' : 'Lưu tin';
    });
  }
  saveButtons.forEach(btn => btn.addEventListener('click', () => {
    const ids = readJson(SAVED_KEY, []);
    const next = ids.includes(jobKey) ? ids.filter(id => id !== jobKey) : [...ids, jobKey];
    writeJson(SAVED_KEY, next);
    paintSaved();
    showToast(next.includes(jobKey) ? `Đã lưu "${job.title}" vào mục yêu thích!` : `Đã bỏ lưu "${job.title}"`, next.includes(jobKey) ? '❤️' : 'ℹ️');
  }));
  paintSaved();

  const alertBtn = $('jdSimilarAlert');
  alertBtn.addEventListener('click', () => {
    const on = alertBtn.classList.toggle('is-on');
    showToast(on ? 'Đã bật gửi việc làm tương tự qua thông báo.' : 'Đã tắt nhận việc làm tương tự.', on ? '🔔' : 'ℹ️');
  });

  $('jdReportLink').addEventListener('click', event => {
    event.preventDefault();
    showToast('Cảm ơn bạn! EasyCV đã ghi nhận phản ánh và sẽ kiểm tra tin tuyển dụng này.', '🛡️');
  });

  // --- Mức độ cạnh tranh hồ sơ + biểu đồ mạng nhện (dữ liệu minh họa, ổn định theo job) ---
  const COMPETE_AXES = ['Kinh nghiệm', 'Kỹ năng phù hợp', 'Học vấn', 'Chứng chỉ', 'Mức lương mong muốn', 'Độ hoàn thiện hồ sơ'];
  function seeded(seed) {
    let s = (Number(seed) || 0) + 7919;
    return () => { s = (s * 9301 + 49297) % 233280; return s / 233280; };
  }
  const rand = seeded(typeof jobKey === 'number' ? jobKey : [...String(jobKey)].reduce((a, c) => a + c.charCodeAt(0), 0));
  const avgScores = COMPETE_AXES.map(() => Math.round(50 + rand() * 25));
  const myScores = avgScores.map(v => Math.max(15, Math.min(98, Math.round(v + (rand() - 0.4) * 36))));
  const avgTotal = avgScores.reduce((a, b) => a + b, 0) / avgScores.length;
  const myTotal = myScores.reduce((a, b) => a + b, 0) / myScores.length;
  const gap = Math.round(myTotal - avgTotal);
  const applicants = 20 + Math.floor(rand() * 180);
  const level = gap >= 5 ? ['is-high', 'Cạnh tranh cao'] : gap <= -5 ? ['is-low', 'Cạnh tranh thấp'] : ['is-mid', 'Cạnh tranh trung bình'];
  const badge = $('jdCompeteBadge');
  badge.className = `jd-compete-badge ${level[0]}`;
  badge.textContent = level[1];
  $('jdCompeteFill').style.left = `${Math.max(6, Math.min(94, 50 + gap * 2.5))}%`;
  const weakest = COMPETE_AXES[myScores.reduce((m, v, i) => (v - avgScores[i] < myScores[m] - avgScores[m] ? i : m), 0)];
  $('jdCompeteDesc').textContent = gap >= 5
    ? `Hồ sơ của bạn cao hơn mặt bằng chung ${gap} điểm so với ${applicants} ứng viên đã ứng tuyển tin này.`
    : gap <= -5
      ? `Hồ sơ của bạn thấp hơn mặt bằng chung ${-gap} điểm so với ${applicants} ứng viên đã ứng tuyển. Hãy cải thiện "${weakest}" để tăng cơ hội.`
      : `Hồ sơ của bạn tương đương mặt bằng chung của ${applicants} ứng viên đã ứng tuyển tin này.`;

  function radarSvg() {
    const cx = 200, cy = 170, R = 115, n = COMPETE_AXES.length;
    const pt = (i, v) => {
      const a = -Math.PI / 2 + (2 * Math.PI * i) / n;
      return [cx + Math.cos(a) * R * v / 100, cy + Math.sin(a) * R * v / 100];
    };
    const poly = vals => vals.map((v, i) => pt(i, v).map(x => x.toFixed(1)).join(',')).join(' ');
    const rings = [20, 40, 60, 80, 100].map(l => `<polygon points="${poly(COMPETE_AXES.map(() => l))}" fill="none" stroke="#E6E6E6" stroke-width="1"/>`).join('');
    const spokes = COMPETE_AXES.map((_, i) => { const [x, y] = pt(i, 100); return `<line x1="${cx}" y1="${cy}" x2="${x.toFixed(1)}" y2="${y.toFixed(1)}" stroke="#E6E6E6"/>`; }).join('');
    const labels = COMPETE_AXES.map((name, i) => {
      const [x, y] = pt(i, 122);
      const anchor = Math.abs(x - cx) < 6 ? 'middle' : x > cx ? 'start' : 'end';
      return `<text x="${x.toFixed(1)}" y="${(y + 4).toFixed(1)}" text-anchor="${anchor}" font-size="11.5" font-weight="600" fill="#374151">${esc(name)}</text>`;
    }).join('');
    const dots = (vals, color) => vals.map((v, i) => { const [x, y] = pt(i, v); return `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="3.5" fill="${color}"/>`; }).join('');
    return `<svg viewBox="-70 0 540 340" role="img" aria-label="Biểu đồ mạng nhện so sánh hồ sơ của bạn với trung bình ứng viên">
      ${rings}${spokes}
      <polygon points="${poly(avgScores)}" fill="rgba(107,114,128,0.18)" stroke="#6B7280" stroke-width="2" stroke-dasharray="5 4"/>
      <polygon points="${poly(myScores)}" fill="rgba(255,101,0,0.22)" stroke="#FF6500" stroke-width="2.5"/>
      ${dots(avgScores, '#6B7280')}${dots(myScores, '#FF6500')}${labels}
    </svg>`;
  }

  const competeModal = $('jdCompeteModal');
  document.body.appendChild(competeModal); // đưa ra body để không bị ancestor cắt/lệch position:fixed
  let competeOpener = null;
  function closeCompete() {
    competeModal.hidden = true;
    document.body.style.overflow = '';
    competeOpener?.focus();
  }
  $('jdCompeteOpen').addEventListener('click', event => {
    event.preventDefault();
    competeOpener = event.currentTarget;
    $('jdCompeteModalSub').textContent = `${job.title} · ${job.company} · ${applicants} ứng viên đã ứng tuyển`;
    $('jdRadar').innerHTML = radarSvg();
    $('jdRadarRows').innerHTML = COMPETE_AXES.map((name, i) => {
      const d = myScores[i] - avgScores[i];
      return `<tr><td>${esc(name)}</td><td><strong>${myScores[i]}</strong></td><td>${avgScores[i]}</td><td class="${d >= 0 ? 'is-up' : 'is-down'}">${d >= 0 ? '+' : ''}${d}</td></tr>`;
    }).join('');
    competeModal.hidden = false;
    document.body.style.overflow = 'hidden';
    competeModal.querySelector('.jd-modal-close').focus();
  });
  competeModal.addEventListener('click', event => { if (event.target.closest('[data-jd-modal-close]')) closeCompete(); });
  document.addEventListener('keydown', event => { if (event.key === 'Escape' && !competeModal.hidden) closeCompete(); });

  const RATINGS = [
    { label: 'Rất mơ hồ', detail: 'Thông tin rất mơ hồ và khó kiểm chứng' },
    { label: 'Còn thiếu', detail: 'Thông tin còn thiếu nhiều nội dung cần thiết' },
    { label: 'Tạm ổn', detail: 'Thông tin có đủ nội dung cơ bản' },
    { label: 'Khá minh bạch', detail: 'Thông tin khá đầy đủ và dễ kiểm chứng' },
    { label: 'Rất minh bạch', detail: 'Thông tin đầy đủ, rõ ràng và dễ kiểm chứng' }
  ];
  const ratingBox = $('jdRating');
  const savedRating = (readJson(RATING_KEY, {}))[jobKey];
  const hasSavedRating = Number.isInteger(savedRating) && savedRating >= 0 && savedRating < RATINGS.length;
  ratingBox.innerHTML = RATINGS.map(({ label, detail }, i) => `
    <button type="button" class="jd-rating-btn${savedRating === i ? ' is-active' : ''}" role="radio" aria-checked="${savedRating === i}" aria-label="Mức ${i + 1} trên 5: ${esc(detail)}" tabindex="${savedRating === i || (!hasSavedRating && i === 0) ? '0' : '-1'}" data-rating="${i}">
      <span class="jd-rating-marker" aria-hidden="true">${i + 1}</span>
      <span class="jd-rating-label">${esc(label)}</span>
    </button>`).join('');
  function selectRating(btn, shouldFocus = false) {
    const value = parseInt(btn.dataset.rating, 10);
    const all = readJson(RATING_KEY, {});
    all[jobKey] = value;
    writeJson(RATING_KEY, all);
    ratingBox.querySelectorAll('.jd-rating-btn').forEach(b => {
      const active = b === btn;
      b.classList.toggle('is-active', active);
      b.setAttribute('aria-checked', String(active));
      b.tabIndex = active ? 0 : -1;
    });
    if (shouldFocus) btn.focus();
    showToast('Đã lưu đánh giá trên thiết bị này.', '✓');
  }
  ratingBox.addEventListener('click', event => {
    const btn = event.target.closest('.jd-rating-btn');
    if (btn) selectRating(btn);
  });
  ratingBox.addEventListener('keydown', event => {
    if (!['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Home', 'End'].includes(event.key)) return;
    event.preventDefault();
    const buttons = [...ratingBox.querySelectorAll('.jd-rating-btn')];
    const current = buttons.indexOf(document.activeElement);
    let next = current;
    if (event.key === 'Home') next = 0;
    else if (event.key === 'End') next = buttons.length - 1;
    else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') next = (current - 1 + buttons.length) % buttons.length;
    else next = (current + 1) % buttons.length;
    selectRating(buttons[next], true);
  });

  // -----------------------------------------------------------------------
  function renderNotFound() {
    document.title = 'Không tìm thấy việc làm | EasyCV';
    document.querySelector('.jd-layout').innerHTML = `
      <section class="jd-card jd-empty" style="grid-column: 1 / -1;">
        <h2>Không tìm thấy tin tuyển dụng</h2>
        <p>Tin tuyển dụng này có thể đã hết hạn hoặc đường dẫn không đúng.</p>
        <a class="jd-btn jd-btn-primary" href="viec-lam.html"><span>Quay lại danh sách việc làm</span></a>
      </section>`;
    document.querySelector('.jd-sticky-bar')?.remove();
  }
});

// Thanh tab nhảy nhanh (mobile/tablet): tô sáng tab theo phần đang xem
document.addEventListener('DOMContentLoaded', () => {
  const tabs = [...document.querySelectorAll('.jd-tabs .jd-tab')];
  if (!tabs.length || !('IntersectionObserver' in window)) return;
  const setActive = (id) =>
    tabs.forEach((t) => t.classList.toggle('is-active', t.getAttribute('href') === `#${id}`));
  tabs.forEach((t) => t.addEventListener('click', () => setActive(t.getAttribute('href').slice(1))));
  const observer = new IntersectionObserver(
    (entries) => {
      const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
      if (visible[0]) setActive(visible[0].target.id);
    },
    { rootMargin: '-70px 0px -60% 0px' },
  );
  tabs.forEach((t) => {
    const target = document.querySelector(t.getAttribute('href'));
    if (target) observer.observe(target);
  });
});
