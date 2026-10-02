import os
import re

floating_markup = """
  <!-- Floating View Mode Switcher Box (Rìa bên phải màn hình) -->
  <div class="floating-view-mode-box" id="floatingViewModeBox" role="region" aria-label="Bộ chuyển đổi chế độ xem Web và Mobile Web">
    <div class="floating-box-header">
      <div class="floating-box-title">
        <span class="floating-box-status-dot" id="floatingStatusDot"></span>
        <span>Chế độ xem</span>
      </div>
      <button type="button" class="floating-box-min-btn" id="floatingMinBtn" title="Thu gọn box">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="m6 9 6 6 6-6"/></svg>
      </button>
    </div>

    <div class="floating-minimized-pill" id="floatingMinimizedPill" title="Bấm để mở rộng bảng điều khiển">
      <span class="floating-box-status-dot" id="floatingMiniStatusDot"></span>
      <span id="floatingMiniLabel">Web</span>
    </div>

    <div class="floating-mode-switcher">
      <button type="button" class="floating-mode-btn active" data-mode="web" id="floatingBtnWeb" title="Xem phiên bản Web Desktop">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><rect width="20" height="14" x="2" y="3" rx="2"/><line x1="8" x2="16" y1="21" y2="21"/><line x1="12" x2="12" y1="17" y2="21"/></svg>
        <span>Web</span>
      </button>
      <button type="button" class="floating-mode-btn" data-mode="mobile" id="floatingBtnMobile" title="Xem phiên bản Mobile Web">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><rect width="14" height="20" x="5" y="2" rx="2" ry="2"/><line x1="12" x2="12.01" y1="18" y2="18"/></svg>
        <span>Mobile Web</span>
      </button>
    </div>

    <div class="floating-mobile-controls" id="floatingMobileControls">
      <div class="floating-preset-label">Thiết bị mô phỏng</div>
      <div class="floating-presets-grid">
        <button type="button" class="floating-preset-item active" data-width="390" data-height="844" title="iPhone 16 Pro (390 x 844)">
          <span>iPhone 16</span>
          <small>390×844</small>
        </button>
        <button type="button" class="floating-preset-item" data-width="412" data-height="915" title="Galaxy S24 (412 x 915)">
          <span>Galaxy S24</span>
          <small>412×915</small>
        </button>
        <button type="button" class="floating-preset-item" data-width="375" data-height="667" title="iPhone SE (375 x 667)">
          <span>iPhone SE</span>
          <small>375×667</small>
        </button>
      </div>

      <div class="floating-actions-row">
        <button type="button" class="floating-action-mini-btn" id="floatingRotateBtn" title="Xoay thiết bị ngang / dọc">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67"/></svg>
          <span>Xoay</span>
        </button>
        <button type="button" class="floating-action-mini-btn" id="floatingRefreshBtn" title="Tải lại trang mobile">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/><path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16"/><path d="M16 21h5v-5"/></svg>
          <span>Tải lại</span>
        </button>
      </div>
    </div>
  </div>
"""

files = [
    'viec-lam.html',
    'public/viec-lam.html',
    'index.html',
    'public/index.html',
    'chi-tiet-viec-lam.html',
    'public/chi-tiet-viec-lam.html'
]

for fp in files:
    if not os.path.exists(fp):
        continue
    with open(fp, 'r', encoding='utf-8') as f:
        c = f.read()

    # 1. Update css/navbar.css cache buster
    c = re.sub(r'href="css/navbar\.css(?:\?[^"]*)?"', 'href="css/navbar.css?v=5.0_floating"', c)

    # 2. Update js/navbar.js cache buster
    c = re.sub(r'src="js/navbar\.js(?:\?[^"]*)?"', 'src="js/navbar.js?v=5.0_floating"', c)

    # 3. Add markup before </body> if not already present
    if 'id="floatingViewModeBox"' not in c:
        c = c.replace('</body>', floating_markup + '\n</body>')

    with open(fp, 'w', encoding='utf-8') as f:
        f.write(c)
    print(f"Updated {fp}")
