const { spawn } = require('child_process');
const fs = require('fs');

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const browserPath = fs.existsSync(chromePath) ? chromePath : edgePath;

async function run() {
  const port = 9275;
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
            background: #FFFFFF !important;
            border: 1px solid #E2E8F0 !important;
            border-radius: 16px !important;
            padding: 16px 20px !important;
            transition: all 0.22s cubic-bezier(0.16, 1, 0.3, 1) !important;
            position: relative !important;
            cursor: pointer !important;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.02) !important;
          }

          .job-card:hover, .job-card.is-hovered-test {
            border-color: var(--tc-green) !important;
            box-shadow: 0 6px 20px rgba(0, 177, 79, 0.08) !important;
          }

          .job-card-top {
            display: flex !important;
            align-items: flex-start !important;
            gap: 16px !important;
          }

          .job-company-logo {
            width: 88px !important;
            height: 88px !important;
            min-width: 88px !important;
            min-height: 88px !important;
            border-radius: 12px !important;
            border: 1px solid #E5E7EB !important;
            background: #FFFFFF !important;
            object-fit: contain !important;
            padding: 6px !important;
            flex-shrink: 0 !important;
          }

          .job-info-main {
            flex: 1 !important;
            min-width: 0 !important;
            display: flex !important;
            flex-direction: column !important;
            gap: 4px !important;
          }

          .job-header-row {
            display: flex !important;
            align-items: flex-start !important;
            justify-content: space-between !important;
            gap: 16px !important;
          }

          .job-title-wrap {
            flex: 1 !important;
            min-width: 0 !important;
          }

          .job-title {
            font-size: 16px !important;
            font-weight: 700 !important;
            color: #0F172A !important;
            margin: 0 0 4px 0 !important;
            line-height: 1.35 !important;
            transition: color 0.15s ease !important;
          }

          .job-title-link {
            color: inherit !important;
            text-decoration: none !important;
          }

          .job-card:hover .job-title,
          .job-card.is-hovered-test .job-title {
            color: var(--tc-green) !important;
          }

          .job-company-row {
            display: flex !important;
            align-items: center !important;
            gap: 6px !important;
            font-size: 13px !important;
            font-weight: 600 !important;
            color: #64748B !important;
            margin-bottom: 6px !important;
          }

          .job-company-name {
            color: #475569 !important;
            font-weight: 600 !important;
          }

          .job-quick-pills {
            display: flex !important;
            align-items: center !important;
            gap: 6px !important;
            flex-wrap: wrap !important;
          }

          .job-quick-pill {
            background: #F1F5F9 !important;
            color: #475569 !important;
            font-size: 12px !important;
            font-weight: 500 !important;
            padding: 3px 8px !important;
            border-radius: 6px !important;
          }

          /* Top Right: Salary & Quick View */
          .job-top-right {
            display: flex !important;
            flex-direction: column !important;
            align-items: flex-end !important;
            gap: 6px !important;
            flex-shrink: 0 !important;
          }

          .job-salary-text {
            font-size: 15.5px !important;
            font-weight: 700 !important;
            color: var(--tc-green) !important;
            white-space: nowrap !important;
          }

          .btn-quick-view {
            display: inline-flex !important;
            align-items: center !important;
            gap: 4px !important;
            background: var(--tc-green-light) !important;
            color: var(--tc-green) !important;
            border: none !important;
            border-radius: 9999px !important;
            padding: 4px 12px !important;
            font-size: 12px !important;
            font-weight: 600 !important;
            cursor: pointer !important;
            text-decoration: none !important;
            transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1) !important;
            opacity: 0 !important;
            visibility: hidden !important;
            transform: translateY(-2px) !important;
            pointer-events: none !important;
          }

          .btn-quick-view:hover {
            background: #D1FAE5 !important;
            transform: translateY(0) scale(1.02) !important;
          }

          .btn-quick-view svg {
            transition: transform 0.15s ease !important;
          }
          .btn-quick-view:hover svg {
            transform: translateX(2px) !important;
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
            height: 1px !important;
            background: #F1F5F9 !important;
            margin: 10px 0 12px 0 !important;
          }

          /* Bottom Row */
          .job-card-bottom {
            display: flex !important;
            align-items: center !important;
            justify-content: space-between !important;
            gap: 12px !important;
          }

          .job-bottom-left {
            flex: 1 !important;
            min-width: 0 !important;
            font-size: 12.5px !important;
            color: #64748B !important;
            white-space: nowrap !important;
            overflow: hidden !important;
            text-overflow: ellipsis !important;
          }

          .job-bottom-right {
            display: flex !important;
            align-items: center !important;
            gap: 8px !important;
            flex-shrink: 0 !important;
            position: relative !important;
          }

          /* Unhovered Meta */
          .job-meta-unhovered {
            display: flex !important;
            align-items: center !important;
            gap: 8px !important;
          }

          .job-post-time {
            font-size: 12px !important;
            color: #64748B !important;
          }

          .badge-viewed {
            background: #F1F5F9 !important;
            color: #64748B !important;
            font-size: 11px !important;
            font-weight: 600 !important;
            padding: 2px 7px !important;
            border-radius: 6px !important;
          }

          /* Hovered Actions */
          .job-actions-hovered {
            display: none !important;
            align-items: center !important;
            gap: 8px !important;
          }

          .job-card:hover .job-meta-unhovered,
          .job-card.is-hovered-test .job-meta-unhovered {
            display: none !important;
          }

          .job-card:hover .job-actions-hovered,
          .job-card.is-hovered-test .job-actions-hovered {
            display: flex !important;
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
            padding: 0 !important;
            flex-shrink: 0 !important;
            transition: all 0.18s ease !important;
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
            padding: 0 !important;
            flex-shrink: 0 !important;
            transition: all 0.18s ease !important;
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

        function createCardHTML(title, company, salary, logo, id, location, exp, skillsSummary, isViewed) {
          return \`
            <div class="job-card-top">
              <img src="\${logo}" alt="\${company}" class="job-company-logo" loading="lazy" />
              <div class="job-info-main">
                <div class="job-header-row">
                  <div class="job-title-wrap">
                    <h3 class="job-title">
                      <a href="chi-tiet-viec-lam.html?id=\${id}" class="job-title-link" title="\${title}">\${title}</a>
                    </h3>
                    <div class="job-company-row">
                      <span class="job-company-name">\${company.toUpperCase()}</span>
                    </div>
                    <div class="job-quick-pills">
                      <span class="job-quick-pill">\${location}</span>
                      <span class="job-quick-pill">\${exp}</span>
                    </div>
                  </div>
                  <div class="job-top-right">
                    <span class="job-salary-text">\${salary}</span>
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
                \${skillsSummary}
              </div>
              <div class="job-bottom-right">
                <div class="job-meta-unhovered">
                  <span class="job-post-time">Đăng 1 tuần trước</span>
                  \${isViewed ? '<span class="badge-viewed">Đã xem</span>' : ''}
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

        const c1 = document.querySelector('.job-card[data-id="1"]');
        const c2 = document.querySelector('.job-card[data-id="2"]');

        if (c1) {
          c1.innerHTML = createCardHTML(
            'Lập Trình Viên Java - Java Developer, 2 Năm Kinh Nghiệm, Lương Đến 40 Triệu',
            'Công Ty Cổ Phần Công Nghệ EVOTEK Việt Nam',
            'Từ 40 triệu',
            'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=120&h=120&q=80',
            '1',
            'Hà Nội',
            '2 năm',
            '2 năm kinh nghiệm chuyên môn | Backend Deve... | +4',
            true
          );
          // Card 1: CHƯA HOVER
        }

        if (c2) {
          c2.innerHTML = createCardHTML(
            'Lập Trình Viên Java - Java Developer, 2 Năm Kinh Nghiệm, Lương Đến 40 Triệu',
            'Công Ty Cổ Phần Công Nghệ EVOTEK Việt Nam',
            'Từ 40 triệu',
            'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=120&h=120&q=80',
            '2',
            'Hà Nội',
            '2 năm',
            '2 năm kinh nghiệm chuyên môn | Backend Deve... | +4',
            false
          );
          c2.classList.add('is-hovered-test'); // Card 2: ĐÃ HOVER
        }

        const floatBox = document.getElementById('floatingViewModeBox');
        if (floatBox) floatBox.style.display = 'none';

        if (c1) c1.scrollIntoView({ block: 'center' });
      })()`
    });

    await new Promise(r => setTimeout(r, 600));

    const shot = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync('scratch/test_side_by_side_modes_v2.png', Buffer.from(shot.data, 'base64'));
    console.log('Saved scratch/test_side_by_side_modes_v2.png');

    ws.close();
  } catch (err) {
    console.error('Error:', err);
  } finally {
    proc.kill();
  }
}

run();
