// CV templates for EasyCV. One JSON Resume-shaped data object feeds every template.
(function () {
  const SAMPLE = {
    basics: {
      name: 'Nguyễn Minh Anh', label: 'Frontend Developer',
      email: 'minhanh@example.com', phone: '0901 234 567', url: 'minhanh.dev',
      location: { city: 'Hà Nội' },
      summary: '3 năm kinh nghiệm xây dựng giao diện web, tập trung vào hiệu năng và trải nghiệm người dùng. Mong muốn phát triển sản phẩm có tác động tới hàng triệu người dùng.',
    },
    work: [
      { name: 'Công ty ABC', position: 'Frontend Developer', startDate: '03/2022', endDate: 'Hiện tại',
        highlights: ['Xây dựng dashboard bán hàng bằng React, giảm 40% thời gian tải trang.', 'Dẫn dắt nhóm 3 người, thiết lập quy trình code review.'] },
      { name: 'Công ty XYZ', position: 'Thực tập Frontend', startDate: '06/2021', endDate: '02/2022',
        highlights: ['Phát triển landing page responsive cho 5 chiến dịch marketing.'] },
    ],
    education: [
      { institution: 'ĐH Bách Khoa Hà Nội', studyType: 'Cử nhân', area: 'Khoa học Máy tính', startDate: '2018', endDate: '2022' },
    ],
    skills: [
      { name: 'Frontend', keywords: ['HTML', 'CSS', 'JavaScript', 'React'] },
      { name: 'Công cụ', keywords: ['Git', 'Figma', 'Vite'] },
    ],
    languages: [{ language: 'Tiếng Anh', fluency: 'IELTS 7.0' }],
  };

  const esc = (s) => String(s == null ? '' : s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const period = (i) => esc([i.startDate, i.endDate].filter(Boolean).join(' – '));
  const list = (items) => (items && items.length ? `<ul>${items.map((h) => `<li>${esc(h)}</li>`).join('')}</ul>` : '');
  const contacts = (b) => [b.email, b.phone, b.url, b.location && b.location.city].filter(Boolean);
  const tags = (s) => `<div class="cv-skill"><b>${esc(s.name)}</b><p>${s.keywords.map((k) => `<span class="cv-tag">${esc(k)}</span>`).join('')}</p></div>`;
  const section = (title, body) => (body ? `<section class="cv-sec"><h2>${title}</h2>${body}</section>` : '');

  const work = (d) => section('Kinh nghiệm làm việc', (d.work || []).map((w) =>
    `<article class="cv-item"><div class="cv-row"><h3>${esc(w.position)} <span>· ${esc(w.name)}</span></h3><time>${period(w)}</time></div>${list(w.highlights)}</article>`).join(''));
  const edu = (d) => section('Học vấn', (d.education || []).map((e) =>
    `<article class="cv-item"><div class="cv-row"><h3>${esc(e.studyType)} ${esc(e.area)} <span>· ${esc(e.institution)}</span></h3><time>${period(e)}</time></div></article>`).join(''));
  const skills = (d) => section('Kỹ năng', (d.skills || []).map(tags).join(''));
  const langs = (d) => section('Ngoại ngữ', (d.languages || []).map((l) => `<p class="cv-lang"><b>${esc(l.language)}</b> ${esc(l.fluency)}</p>`).join(''));
  const about = (d) => section('Giới thiệu', d.basics.summary ? `<p>${esc(d.basics.summary)}</p>` : '');
  const contactList = (b) => `<ul class="cv-contact">${contacts(b).map((c) => `<li>${esc(c)}</li>`).join('')}</ul>`;

  const TEMPLATES = {
    ats: {
      name: 'Cổ điển (chuẩn ATS)', note: 'Một cột, dễ đọc với hệ thống lọc CV.',
      render: (d) => `<div class="cv cv--ats"><header><h1>${esc(d.basics.name)}</h1><p class="cv-label">${esc(d.basics.label)}</p><p class="cv-meta">${contacts(d.basics).map(esc).join(' · ')}</p></header>${about(d)}${work(d)}${edu(d)}${skills(d)}${langs(d)}</div>`,
    },
    sidebar: {
      name: 'Hai cột (sidebar)', note: 'Thông tin liên hệ và kỹ năng ở cột trái.',
      render: (d) => `<div class="cv cv--sidebar"><aside><div class="cv-avatar">${esc(d.basics.name.split(' ').slice(-1)[0][0])}</div>${section('Liên hệ', contactList(d.basics))}${skills(d)}${langs(d)}</aside><main><header><h1>${esc(d.basics.name)}</h1><p class="cv-label">${esc(d.basics.label)}</p></header>${about(d)}${work(d)}${edu(d)}</main></div>`,
    },
    banner: {
      name: 'Banner nhấn màu', note: 'Header nền cam thương hiệu, nội dung hai cột.',
      render: (d) => `<div class="cv cv--banner"><header><h1>${esc(d.basics.name)}</h1><p class="cv-label">${esc(d.basics.label)}</p><p class="cv-meta">${contacts(d.basics).map(esc).join(' · ')}</p></header><div class="cv-cols"><main>${about(d)}${work(d)}</main><aside>${edu(d)}${skills(d)}${langs(d)}</aside></div></div>`,
    },
  };

  window.EasyCVTemplates = { SAMPLE, TEMPLATES, render: (id, data) => TEMPLATES[id].render(data || SAMPLE) };

  const grid = document.querySelector('[data-cv-gallery]');
  if (!grid) return;
  grid.innerHTML = Object.keys(TEMPLATES).map((id) => {
    const t = TEMPLATES[id];
    return `<figure class="cv-card"><div class="cv-sheet">${t.render(SAMPLE)}</div><figcaption><b>${esc(t.name)}</b><span>${esc(t.note)}</span></figcaption></figure>`;
  }).join('');
})();
