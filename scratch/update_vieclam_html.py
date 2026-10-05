import re
import shutil

def update_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # 1. Update css and js versions
    content = content.replace('css/viec-lam.css?v=10.0_heart_icon_synced', 'css/viec-lam.css?v=11.0_heart_below_salary')
    content = content.replace('js/viec-lam.js?v=10.0_heart_icon_synced', 'js/viec-lam.js?v=11.0_heart_below_salary')

    # 2. Add layout rules in <style id="easycv-job-card-hover-style">
    old_css_target = """.btn-card-bookmark.saved svg {
      fill: #EF4444 !important;
      stroke: #EF4444 !important;
    }"""

    new_css_replacement = """.btn-card-bookmark.saved svg {
      fill: #EF4444 !important;
      stroke: #EF4444 !important;
    }
    .job-title-row {
      align-items: flex-start !important;
    }
    .job-badges-group {
      display: flex !important;
      flex-direction: column !important;
      align-items: flex-end !important;
      gap: 8px !important;
      flex-shrink: 0 !important;
    }
    .job-salary-wrap {
      display: flex !important;
      align-items: center !important;
      gap: 8px !important;
    }
    @media (max-width: 768px) {
      .job-badges-group {
        flex-direction: row !important;
        align-items: center !important;
        justify-content: space-between !important;
        width: 100% !important;
      }
      .job-salary-wrap {
        display: flex !important;
        align-items: center !important;
        gap: 6px !important;
      }
    }"""

    if old_css_target in content:
        content = content.replace(old_css_target, new_css_replacement, 1)
        print(f"Updated <style id=\"easycv-job-card-hover-style\"> in {filepath}")
    else:
        print(f"Warning: old_css_target not found in {filepath}")

    # 3. Wrap static job-salary-badge in job-salary-wrap
    def replacer(m):
        prefix = m.group(1)
        badge = m.group(2)
        # Check if already wrapped
        return f"{prefix}<div class=\"job-salary-wrap\">\n                      {badge}\n                    </div>"

    sub_pattern = re.compile(r'(<div class="job-badges-group">\s*)(<span class="job-salary-badge [^"]*">.*?</span>)', re.DOTALL)
    new_content, count = sub_pattern.subn(replacer, content)
    print(f"Wrapped {count} salary badges in {filepath}")

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(new_content)
    print(f"Successfully updated {filepath}")

update_file('viec-lam.html')
update_file('public/viec-lam.html')
