const fs = require('fs');

function transformCardHTML(title, company, salaryBadge, logo, id, location, isFeatured, verified) {
  const featuredClass = isFeatured ? 'is-featured' : '';
  const city = location.split('(')[0].trim();
  const isViewed = id <= 3;
  const expText = '2 năm';
  const skillsSummary = `${expText} kinh nghiệm chuyên môn | IT & Kỹ thuật | +3`;

  return `          <article class="job-card ${featuredClass}" data-id="${id}">
            <div class="job-card-top">
              <img src="${logo}" alt="${company}" class="job-company-logo" loading="lazy" />
              <div class="job-info-main">
                <div class="job-header-row">
                  <div class="job-title-wrap">
                    <h3 class="job-title">
                      <a href="chi-tiet-viec-lam.html?id=${id}&title=${encodeURIComponent(title)}" class="job-title-link" title="${title}">${title}</a>
                    </h3>
                    <div class="job-company-row">
                      <span class="job-company-name">${company.toUpperCase()}</span>
                      ${verified ? `<span class="badge-verified" title="Doanh nghiệp xác thực"><svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4" stroke="#FFF" stroke-width="2"/></svg></span>` : ''}
                    </div>
                    <div class="job-quick-pills">
                      <span class="job-quick-pill">${city}</span>
                      <span class="job-quick-pill">${expText}</span>
                    </div>
                  </div>
                  <div class="job-top-right">
                    <div class="job-salary-wrap">
                      <span class="job-salary-text">${salaryBadge}</span>
                    </div>
                    <button type="button" class="btn-quick-view" data-id="${id}" title="Xem nhanh việc làm">
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
                  <span class="job-post-time">Đăng hôm nay</span>
                  ${isViewed ? '<span class="badge-viewed">Đã xem</span>' : ''}
                </div>
                <div class="job-actions-hovered">
                  <button type="button" class="btn-card-apply" data-id="${id}">Ứng tuyển</button>
                  <button type="button" class="btn-card-hide" data-id="${id}" aria-label="Ẩn việc làm này" title="Ẩn việc làm">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"/><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"/><path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"/><line x1="2" x2="22" y1="2" y2="22"/></svg>
                  </button>
                </div>
                <button type="button" class="btn-card-bookmark" data-id="${id}" aria-label="Lưu công việc" title="Lưu công việc">
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>
                </button>
              </div>
            </div>
          </article>`;
}

function processHTMLFile(filepath) {
  let content = fs.readFileSync(filepath, 'utf8');

  // Replace each job-card
  const cardRegex = /<article class="job-card([^"]*)" data-id="(\d+)">([\s\S]*?)<\/article>/g;
  let match;
  let newContent = content;

  const cards = [];
  while ((match = cardRegex.exec(content)) !== null) {
    const fullCard = match[0];
    const classes = match[1];
    const id = parseInt(match[2], 10);
    const inner = match[3];

    const isFeatured = classes.includes('is-featured');
    const titleMatch = inner.match(/class="job-title"[^>]*>[\s\S]*?<a[^>]*>([^<]+)<\/a>/);
    const title = titleMatch ? titleMatch[1].trim() : `Công việc #${id}`;

    const compMatch = inner.match(/class="job-company-name">([^<]+)<\/span>/);
    const company = compMatch ? compMatch[1].trim() : 'Doanh nghiệp';

    const salaryMatch = inner.match(/class="job-salary-badge[^"]*">([^<]+)<\/span>/) || inner.match(/class="job-salary-text">([^<]+)<\/span>/);
    const salary = salaryMatch ? salaryMatch[1].trim() : 'Thỏa thuận';

    const logoMatch = inner.match(/<img src="([^"]+)"[^>]*class="job-company-logo"/);
    const logo = logoMatch ? logoMatch[1] : 'assets/logos/default-company.png';

    const locMatch = inner.match(/class="job-location-text">([^<]+)<\/span>/);
    const location = locMatch ? locMatch[1].trim() : 'Hà Nội';

    const verified = inner.includes('badge-verified');

    cards.push({ fullCard, title, company, salary, logo, id, location, isFeatured, verified });
  }

  for (const c of cards) {
    const replacement = transformCardHTML(c.title, c.company, c.salary, c.logo, c.id, c.location, c.isFeatured, c.verified);
    newContent = newContent.replace(c.fullCard, replacement);
  }

  fs.writeFileSync(filepath, newContent, 'utf8');
  console.log(`Updated ${cards.length} static cards in ${filepath}`);
}

processHTMLFile('d:\\master page\\viec-lam.html');
processHTMLFile('d:\\master page\\public\\viec-lam.html');
