import re
import os

html_files = [
    'viec-lam.html',
    'public/viec-lam.html',
    'index.html',
    'public/index.html',
    'chi-tiet-viec-lam.html',
    'public/chi-tiet-viec-lam.html'
]

# Regex for inline style of view-mode-toggle-box
style_regex = re.compile(r'<style>\s*/\* CRITICAL VIEW MODE SWITCHER CSS.*?</style>\s*', re.DOTALL)

# Regex for view-mode-toggle-box markup
markup_regex = re.compile(r'<!-- Box chuyển đổi trạng thái Web / Mobile Web.*?</div>\s*', re.DOTALL)

for rel_path in html_files:
    if not os.path.exists(rel_path):
        print(f"Skipping {rel_path} (not found)")
        continue
    with open(rel_path, 'r', encoding='utf-8') as f:
        content = f.read()

    orig_len = len(content)
    # Remove inline style
    content = style_regex.sub('', content)
    # Remove markup
    content = markup_regex.sub('', content)

    if len(content) != orig_len:
        with open(rel_path, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"Cleaned up {rel_path} (removed {orig_len - len(content)} chars)")
    else:
        print(f"No changes needed in {rel_path}")
