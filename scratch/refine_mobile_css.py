import os

# 1. Update z-index in navbar.css and public/css/navbar.css
for nb_path in ['css/navbar.css', 'public/css/navbar.css']:
    with open(nb_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # Ensure floating box has z-index 2000000
    content = content.replace('z-index: 999999;\n  background: rgba(255, 255, 255, 0.94);', 'z-index: 2000000;\n  background: rgba(255, 255, 255, 0.96);')
    # Ensure simulator overlay has z-index 1000000
    content = content.replace('z-index: 99999;\n  background: radial-gradient', 'z-index: 1000000;\n  background: radial-gradient')

    with open(nb_path, 'w', encoding='utf-8') as f:
        f.write(content)
    print(f"Updated z-index in {nb_path}")

# 2. Update mobile rules in css/viec-lam.css and public/css/viec-lam.css
mobile_vieclam_refined = """
/* =========================================================================
   COMPREHENSIVE MOBILE VIEWPORT STYLES (Chế độ Mobile Web)
   ========================================================================= */
@media (max-width: 768px) {
  html, body {
    overflow-x: hidden !important;
    max-width: 100vw !important;
  }
  .page-wrapper {
    overflow-x: hidden !important;
    max-width: 100vw !important;
  }
  .job-search-hero {
    padding: 20px 14px 18px;
  }
  .breadcrumb-nav {
    margin-bottom: 10px;
    font-size: 12.5px;
  }
  .job-search-title {
    font-size: 21px;
    line-height: 1.35;
    margin-bottom: 6px;
  }
  .job-search-subtitle {
    font-size: 13px;
    margin-bottom: 14px;
  }
  .job-search-box {
    flex-direction: column;
    align-items: stretch;
    padding: 12px;
    gap: 10px;
    border-radius: 16px;
    width: 100%;
    box-sizing: border-box;
  }
  .search-field {
    max-width: 100% !important;
    width: 100%;
  }
  .search-field input,
  .search-field select {
    width: 100%;
    font-size: 14px;
  }
  .search-divider {
    display: none;
  }
  .btn-search-submit {
    width: 100%;
    justify-content: center;
    height: 44px;
    font-size: 15px;
    border-radius: 12px;
  }
  .quick-filter-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
    margin-top: 10px;
  }
  .quick-filter-label {
    width: 100%;
    font-size: 12px;
    margin-bottom: 2px;
  }
  .tag-btn {
    font-size: 11.5px;
    padding: 4px 10px;
  }
  .job-layout-container {
    padding: 0 12px !important;
    margin-top: 14px !important;
    grid-template-columns: 1fr !important;
    width: 100% !important;
    box-sizing: border-box !important;
    overflow-x: hidden !important;
  }
  .listings-content {
    width: 100% !important;
    max-width: 100% !important;
    box-sizing: border-box !important;
    overflow-x: hidden !important;
  }
  .listings-topbar {
    flex-direction: column !important;
    align-items: stretch !important;
    gap: 10px !important;
    padding: 12px 14px !important;
    width: 100% !important;
    box-sizing: border-box !important;
  }
  .sort-wrapper {
    width: 100% !important;
    justify-content: space-between !important;
  }
  .sort-select {
    flex: 1;
    max-width: 180px;
  }
  .job-listing-grid {
    width: 100% !important;
    box-sizing: border-box !important;
  }
  .job-card {
    padding: 14px !important;
    width: 100% !important;
    box-sizing: border-box !important;
    overflow-x: hidden !important;
  }
  .job-card-top {
    gap: 12px !important;
  }
  .job-company-logo {
    width: 44px !important;
    height: 44px !important;
    border-radius: 10px !important;
  }
  .job-title-row {
    flex-direction: column !important;
    align-items: flex-start !important;
    gap: 6px !important;
    width: 100% !important;
  }
  .job-title {
    font-size: 15px !important;
    line-height: 1.35 !important;
  }
  .job-badges-group {
    flex-wrap: wrap !important;
    gap: 6px !important;
  }
  .job-card-bottom {
    flex-direction: column !important;
    align-items: stretch !important;
    gap: 12px !important;
  }
  .job-skills-tags {
    flex-wrap: wrap !important;
    gap: 5px !important;
  }
  .job-card-actions {
    display: flex !important;
    align-items: center !important;
    justify-content: space-between !important;
    width: 100% !important;
  }
  .job-card-actions .btn-card-apply {
    flex: 1 !important;
    text-align: center !important;
    justify-content: center !important;
  }
  .split-list-feed {
    max-height: 380px;
  }
  .split-detail-pane {
    border-radius: 14px;
    padding: 14px;
  }
}
"""

for vl_path in ['css/viec-lam.css', 'public/css/viec-lam.css']:
    with open(vl_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # Replace older mobile block if present
    if "COMPREHENSIVE MOBILE VIEWPORT STYLES" in content:
        idx = content.find("/* =========================================================================\n   COMPREHENSIVE MOBILE VIEWPORT STYLES")
        content = content[:idx] + mobile_vieclam_refined.strip() + "\n"
    else:
        content = content.rstrip() + "\n" + mobile_vieclam_refined.strip() + "\n"

    with open(vl_path, 'w', encoding='utf-8') as f:
        f.write(content)
    print(f"Updated mobile styles in {vl_path}")
