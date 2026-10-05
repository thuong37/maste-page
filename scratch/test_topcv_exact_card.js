const { spawn } = require('child_process');
const fs = require('fs');

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const browserPath = fs.existsSync(chromePath) ? chromePath : edgePath;

async function run() {
  const port = 9270;
  const proc = spawn(browserPath, [
    '--headless=new',
    `--remote-debugging-port=${port}`,
    '--disable-gpu',
    '--window-size=1440,1100',
    'http://localhost:3000/viec-lam.html'
  ]);

  await new Promise(r => setTimeout(r, 2000));

  try {
    const listRes = await fetch(`http://127.0.0.1:${port}/json`);
    const tabs = await listRes.json();
    const tab = tabs.find(t => t.url.includes('viec-lam.html')) || tabs[0];
    const ws = new WebSocket(tab.webSocketDebuggerUrl);
    await new Promise(r => ws.addEventListener('open', r));

    let msgId = 1;
    function send(method, params = {}) {
      return new Promise((resolve) => {
        const id = msgId++;
        const handler = (event) => {
          const res = JSON.parse(event.data);
          if (res.id === id) {
            ws.removeEventListener('message', handler);
            resolve(res.result);
          }
        };
        ws.addEventListener('message', handler);
        ws.send(JSON.stringify({ id, method, params }));
      });
    }

    await send('Runtime.enable');
    await send('Page.enable');

    // Inject prototype styling and DOM transformation for Card 15 & Card 2
    await send('Runtime.evaluate', {
      expression: `(() => {
        const style = document.createElement('style');
        style.innerHTML = \`
          :root {
            --tc-green: #00B14F;
            --tc-green-hover: #009643;
            --tc-green-light: #E6F7ED;
            --tc-green-border: #86EFAC;
          }

          /* Job Card Base */
          .job-card {
            background: #FFFFFF;
            border: 1px solid #E2E8F0;
            border-radius: 16px;
            padding: 16px 20px;
            transition: all 0.22s cubic-bezier(0.16, 1, 0.3, 1);
            position: relative;
            cursor: pointer;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.02);
          }

          .job-card:hover, .job-card.is-hovered-test {
            border-color: var(--tc-green) !important;
            box-shadow: 0 6px 20px rgba(0, 177, 79, 0.08) !important;
          }

          .job-card-top {
            display: flex;
            align-items: flex-start;
            gap: 16px;
          }

          .job-company-logo {
            width: 88px;
            height: 88px;
            min-width: 88px;
            min-height: 88px;
            border-radius: 12px;
            border: 1px solid #E5E7EB;
            background: #FFFFFF;
            object-fit: contain;
            padding: 6px;
            flex-shrink: 0;
          }

          .job-info-main {
            flex: 1;
            min-width: 0;
            display: flex;
            flex-direction: column;
            gap: 4px;
          }

          .job-header-row {
            display: flex;
            align-items: flex-start;
            justify-content: space-between;
            gap: 16px;
          }

          .job-title-wrap {
            flex: 1;
            min-width: 0;
          }

          .job-title {
            font-size: 16px;
            font-weight: 700;
            color: #0F172A;
            margin: 0 0 4px 0;
            line-height: 1.35;
            transition: color 0.15s ease;
          }

          .job-title-link {
            color: inherit;
            text-decoration: none;
          }

          .job-card:hover .job-title,
          .job-card.is-hovered-test .job-title {
            color: var(--tc-green) !important;
          }

          .job-company-row {
            display: flex;
            align-items: center;
            gap: 6px;
            font-size: 13px;
            font-weight: 600;
            color: #64748B;
            margin-bottom: 6px;
          }

          .job-company-name {
            color: #475569;
            font-weight: 600;
          }

          .job-quick-pills {
            display: flex;
            align-items: center;
            gap: 6px;
            flex-wrap: wrap;
          }

          .job-quick-pill {
            background: #F1F5F9;
            color: #475569;
            font-size: 12px;
            font-weight: 500;
            padding: 3px 8px;
            border-radius: 6px;
          }

          /* Top Right: Salary & Quick View */
          .job-top-right {
            display: flex;
            flex-direction: column;
            align-items: flex-end;
            gap: 6px;
            flex-shrink: 0;
          }

          .job-salary-text {
            font-size: 15.5px;
            font-weight: 700;
            color: var(--tc-green);
            white-space: nowrap;
          }

          .btn-quick-view {
            display: inline-flex;
            align-items: center;
            gap: 4px;
            background: var(--tc-green-light);
            color: var(--tc-green);
            border: none;
            border-radius: 9999px;
            padding: 4px 12px;
            font-size: 12px;
            font-weight: 600;
            cursor: pointer;
            text-decoration: none;
            transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
            opacity: 0;
            visibility: hidden;
            transform: translateY(-2px);
            pointer-events: none;
          }

          .btn-quick-view:hover {
            background: #D1FAE5;
            transform: translateY(0) scale(1.02);
          }

          .btn-quick-view svg {
            transition: transform 0.15s ease;
          }
          .btn-quick-view:hover svg {
            transform: translateX(2px);
          }

          .job-card:hover .btn-quick-view,
          .job-card.is-hovered-test .btn-quick-view {
            opacity: 1 !important;
            visibility: visible !important;
            transform: translateY(0) !important;
            pointer-events: auto !important;
          }

          /* Divider */
          .job-card-divider {
            height: 1px;
            background: #F1F5F9;
            margin: 10px 0 12px 0;
          }

          /* Bottom Row */
          .job-card-bottom {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 12px;
          }

          .job-bottom-left {
            flex: 1;
            min-width: 0;
            font-size: 12.5px;
            color: #64748B;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }

          .job-bottom-right {
            display: flex;
            align-items: center;
            gap: 8px;
            flex-shrink: 0;
            position: relative;
          }

          /* Unhovered Meta */
          .job-meta-unhovered {
            display: flex;
            align-items: center;
            gap: 8px;
            transition: opacity 0.18s ease, visibility 0.18s;
          }

          .job-post-time {
            font-size: 12px;
            color: #64748B;
          }

          .badge-viewed {
            background: #F1F5F9;
            color: #64748B;
            font-size: 11px;
            font-weight: 600;
            padding: 2px 7px;
            border-radius: 6px;
          }

          /* Hovered Actions */
          .job-actions-hovered {
            display: flex;
            align-items: center;
            gap: 8px;
            opacity: 0;
            visibility: hidden;
            pointer-events: none;
            transition: opacity 0.2s cubic-bezier(0.16, 1, 0.3, 1), visibility 0.2s, transform 0.2s;
            transform: translateX(4px);
          }

          .job-card:hover .job-meta-unhovered,
          .job-card.is-hovered-test .job-meta-unhovered {
            opacity: 0 !important;
            visibility: hidden !important;
            pointer-events: none !important;
            display: none !important;
          }

          .job-card:hover .job-actions-hovered,
          .job-card.is-hovered-test .job-actions-hovered {
            opacity: 1 !important;
            visibility: visible !important;
            pointer-events: auto !important;
            transform: translateX(0) !important;
          }

          /* Apply Button */
          .btn-card-apply {
            background: var(--tc-green) !important;
            color: #FFFFFF !important;
            border: none !important;
            border-radius: 9999px !important;
            padding: 6px 18px !important;
            font-size: 13px !important;
            font-weight: 700 !important;
            cursor: pointer !important;
            transition: all 0.18s ease !important;
            box-shadow: 0 2px 6px rgba(0, 177, 79, 0.2) !important;
            display: inline-flex !important;
            align-items: center !important;
            justify-content: center !important;
          }

          .btn-card-apply:hover {
            background: var(--tc-green-hover) !important;
            box-shadow: 0 4px 10px rgba(0, 177, 79, 0.32) !important;
            transform: translateY(-1px) !important;
          }

          /* Hide / Not Interested Button */
          .btn-card-hide {
            width: 32px !important;
            height: 32px !important;
            border-radius: 50% !important;
            border: 1px solid #CBD5E1 !important;
            background: #FFFFFF !important;
            color: #64748B !important;
            display: inline-flex !important;
            align-items: center !important;
            justify-content: center !important;
            cursor: pointer !important;
            transition: all 0.18s ease !important;
            padding: 0 !important;
            flex-shrink: 0 !important;
          }

          .btn-card-hide:hover {
            border-color: #94A3B8 !important;
            color: #0F172A !important;
            background: #F8FAFC !important;
            transform: scale(1.05) !important;
          }

          /* Bookmark / Heart Button */
          .btn-card-bookmark {
            width: 32px !important;
            height: 32px !important;
            border-radius: 50% !important;
            border: 1px solid var(--tc-green) !important;
            background: #FFFFFF !important;
            color: var(--tc-green) !important;
            display: inline-flex !important;
            align-items: center !important;
            justify-content: center !important;
            cursor: pointer !important;
            transition: all 0.18s ease !important;
            padding: 0 !important;
            flex-shrink: 0 !important;
          }

          .btn-card-bookmark:hover {
            background: var(--tc-green-light) !important;
            transform: scale(1.08) !important;
          }

          .btn-card-bookmark.saved {
            background: var(--tc-green-light) !important;
            border-color: var(--tc-green) !important;
            color: var(--tc-green) !important;
          }
          .btn-card-bookmark.saved svg {
            fill: var(--tc-green) !important;
          }
        \`;
        document.head.appendChild(style);

        // Transform Card 15 (Unhovered test) and Card 16 (Hovered test)
        function transformCard(card, isHovered) {
          if (!card) return;
          if (isHovered) card.classList.add('is-hovered-test');

          const titleEl = card.querySelector('.job-title-link') || card.querySelector('.job-title');
          const titleText = titleEl ? titleEl.textContent.trim() : 'Lập Trình Viên Java';
          const titleHref = titleEl ? (titleEl.getAttribute('href') || '#') : '#';

          const companyEl = card.querySelector('.job-company-name');
          const companyText = companyEl ? companyEl.textContent.trim() : 'CÔNG TY TNHH EASYCV';

          const salaryEl = card.querySelector('.job-salary-badge');
          const salaryText = salaryEl ? salaryEl.textContent.trim() : 'Từ 40 triệu';

          const logoImg = card.querySelector('.job-company-logo');
          const logoSrc = logoImg ? logoImg.getAttribute('src') : '';

          const id = card.getAttribute('data-id') || '1';

          card.innerHTML = \`
            <div class="job-card-top">
              <img src="\${logoSrc}" alt="\${companyText}" class="job-company-logo" loading="lazy" />
              <div class="job-info-main">
                <div class="job-header-row">
                  <div class="job-title-wrap">
                    <h3 class="job-title">
                      <a href="\${titleHref}" class="job-title-link" title="\${titleText}">\${titleText}</a>
                    </h3>
                    <div class="job-company-row">
                      <span class="job-company-name">\${companyText.toUpperCase()}</span>
                    </div>
                    <div class="job-quick-pills">
                      <span class="job-quick-pill">Hà Nội</span>
                      <span class="job-quick-pill">2 năm</span>
                    </div>
                  </div>
                  <div class="job-top-right">
                    <span class="job-salary-text">\${salaryText}</span>
                    <button type="button" class="btn-quick-view" data-id="\${id}" title="Xem nhanh việc làm">
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
                2 năm kinh nghiệm chuyên môn | Backend Deve... | +4
              </div>
              <div class="job-bottom-right">
                <div class="job-meta-unhovered">
                  <span class="job-post-time">Đăng 1 tuần trước</span>
                  <span class="badge-viewed">Đã xem</span>
                </div>
                <div class="job-actions-hovered">
                  <button type="button" class="btn-card-apply" data-id="\${id}">Ứng tuyển</button>
                  <button type="button" class="btn-card-hide" data-id="\${id}" aria-label="Ẩn việc làm này" title="Ẩn việc làm">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"/><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"/><path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"/><line x1="2" x2="22" y1="2" y2="22"/></svg>
                  </button>
                </div>
                <button type="button" class="btn-card-bookmark" data-id="\${id}" aria-label="Lưu công việc" title="Lưu công việc">
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>
                </button>
              </div>
            </div>
          \`;
        }

        const c15 = document.querySelector('.job-card[data-id="15"]');
        const c16 = document.querySelector('.job-card[data-id="16"]');
        transformCard(c15, false); // Chưa hover
        transformCard(c16, true);  // Đã hover

        const floatBox = document.getElementById('floatingViewModeBox');
        if (floatBox) floatBox.style.display = 'none';

        if (c15) c15.scrollIntoView({ block: 'center' });
      })()`
    });

    await new Promise(r => setTimeout(r, 600));

    const shot = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync('scratch/test_unhovered_and_hovered.png', Buffer.from(shot.data, 'base64'));
    console.log('Saved scratch/test_unhovered_and_hovered.png');

    ws.close();
  } catch (err) {
    console.error('Error:', err);
  } finally {
    proc.kill();
  }
}

run();
