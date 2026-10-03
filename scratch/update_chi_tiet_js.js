const fs = require('fs');

let content = fs.readFileSync('js/chi-tiet-viec-lam.js', 'utf8');

// We want to replace the param parsing logic and renderList click handling
const oldParamSection = `  // Lấy ID công việc từ Query Param
  const urlParams = new URLSearchParams(window.location.search);
  const targetId = parseInt(urlParams.get('id') || urlParams.get('jobId') || '1', 10);
  let activeJobId = JOBS_DATA.some(j => j.id === targetId) ? targetId : JOBS_DATA[0].id;`;

const newParamSection = `  // Helper chuẩn hóa tiếng Việt để so khớp tìm kiếm chính xác
  function normalizeText(text) {
    if (!text) return '';
    return text.normalize('NFD').replace(/[\\u0300-\\u036f]/g, '').replace(/[đĐ]/g, 'd').toLowerCase().trim();
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
      logo: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=120&h=120&q=80',
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
          \`Đảm nhận vai trò then chốt tại vị trí \${targetTitle}, trực tiếp tham gia xây dựng và tối ưu các dự án trọng điểm của doanh nghiệp.\`,
          'Phối hợp cùng các bộ phận liên quan để thiết kế giải pháp kỹ thuật và cải tiến quy trình nghiệp vụ.',
          'Quản lý tiến độ công việc, đảm bảo chất lượng đầu ra đạt tiêu chuẩn cao nhất và báo cáo trực tiếp ban giám đốc.'
        ],
        reqs: [
          \`Tối thiểu 2 - 5 năm kinh nghiệm thực chiến trong các dự án tương đương vị trí \${targetTitle}.\`,
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
  let activeJobId = activeJob.id;`;

if (content.includes(oldParamSection)) {
  content = content.replace(oldParamSection, newParamSection);
  console.log('Replaced query param logic in js/chi-tiet-viec-lam.js');
} else {
  console.error('Cannot find oldParamSection');
}

// Update renderList function
const oldRenderList = `    // Attach Click Handler on Right List Items
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
    });`;

const newRenderList = `    // Attach Click Handler on Left List Items (Việc làm liên quan khác)
    listFeed.querySelectorAll('.split-job-card').forEach(card => {
      card.addEventListener('click', (e) => {
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
              window.history.pushState({ id }, '', currentUrl.toString());
            }

            const scrollArea = document.getElementById('detailScrollArea');
            if (scrollArea) scrollArea.scrollTo({ top: 0, behavior: 'smooth' });
          }
        }
      });
    });`;

if (content.includes(oldRenderList)) {
  content = content.replace(oldRenderList, newRenderList);
  console.log('Replaced list click handler in js/chi-tiet-viec-lam.js');
} else {
  console.error('Cannot find oldRenderList');
}

// Also update link href inside renderList item template to include &title=
const oldLinkTmpl = '<a href="chi-tiet-viec-lam.html?id=${job.id}" class="job-title-link">${job.title}</a>';
const newLinkTmpl = '<a href="chi-tiet-viec-lam.html?id=${job.id}&title=${encodeURIComponent(job.title)}" class="job-title-link">${job.title}</a>';

if (content.includes(oldLinkTmpl)) {
  content = content.replace(oldLinkTmpl, newLinkTmpl);
  console.log('Updated link template in renderList');
}

// Write to both js/chi-tiet-viec-lam.js and public/js/chi-tiet-viec-lam.js
fs.writeFileSync('js/chi-tiet-viec-lam.js', content, 'utf8');
fs.writeFileSync('public/js/chi-tiet-viec-lam.js', content, 'utf8');
console.log('Saved js/chi-tiet-viec-lam.js and public/js/chi-tiet-viec-lam.js successfully');
