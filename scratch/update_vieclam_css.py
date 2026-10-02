import os

mobile_vieclam_css = """
/* =========================================================================
   COMPREHENSIVE MOBILE VIEWPORT STYLES (Chế độ Mobile Web)
   ========================================================================= */
@media (max-width: 768px) {
  .job-search-hero {
    padding: 24px 16px 20px;
  }
  .breadcrumb-nav {
    margin-bottom: 12px;
    font-size: 13px;
  }
  .job-search-title {
    font-size: 22px;
    line-height: 1.35;
    margin-bottom: 8px;
  }
  .job-search-subtitle {
    font-size: 13.5px;
    margin-bottom: 16px;
  }
  .job-search-box {
    flex-direction: column;
    align-items: stretch;
    padding: 12px;
    gap: 10px;
    border-radius: 16px;
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
    margin-top: 12px;
  }
  .quick-filter-label {
    width: 100%;
    font-size: 12px;
    margin-bottom: 2px;
  }
  .tag-btn {
    font-size: 12px;
    padding: 5px 10px;
  }
  .job-layout-container {
    padding: 0 16px;
    margin-top: 16px;
  }
  .job-cards-grid {
    grid-template-columns: 1fr;
    gap: 14px;
  }
  .job-card {
    padding: 16px;
    border-radius: 14px;
  }
  .job-card-header {
    gap: 12px;
  }
  .company-logo {
    width: 48px;
    height: 48px;
  }
  .job-card-title {
    font-size: 15px;
  }
  .split-list-feed {
    max-height: 380px;
  }
  .split-detail-pane {
    border-radius: 14px;
    padding: 16px;
  }
}
"""

def append_to_file(filepath):
    if not os.path.exists(filepath):
        print(f"File {filepath} not found.")
        return
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    if "COMPREHENSIVE MOBILE VIEWPORT STYLES" not in content:
        content = content.rstrip() + "\n" + mobile_vieclam_css + "\n"
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"Appended mobile CSS to {filepath}")
    else:
        print(f"Already contains mobile CSS in {filepath}")

append_to_file('css/viec-lam.css')
append_to_file('public/css/viec-lam.css')
