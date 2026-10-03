import sys, re, urllib.parse
sys.stdout.reconfigure(encoding='utf-8')

# 1. Update viec-lam.html
with open('viec-lam.html', 'r', encoding='utf-8') as f:
    vl_content = f.read()

# Pattern for job title links:
# <h3 class="job-title"><a href="chi-tiet-viec-lam.html?id=1" target="_blank" class="job-title-link" title="Click để mở tab chi tiết riêng">Senior Fullstack Developer (ReactJS / Node.js)</a></h3>
def replace_vl_link(match):
    full_tag = match.group(0)
    job_id = match.group(1)
    title = match.group(2).strip()
    encoded_title = urllib.parse.quote(title)
    return f'<h3 class="job-title"><a href="chi-tiet-viec-lam.html?id={job_id}&title={encoded_title}" class="job-title-link" title="Xem chi tiết {title}">{title}</a></h3>'

pattern = r'<h3 class="job-title"><a href="chi-tiet-viec-lam\.html\?id=(\d+)"[^>]*>(.*?)</a></h3>'
vl_new, count = re.subn(pattern, replace_vl_link, vl_content)
print(f"Replaced {count} job title links in viec-lam.html")

with open('viec-lam.html', 'w', encoding='utf-8') as f:
    f.write(vl_new)

# 2. Update js/viec-lam.js
with open('js/viec-lam.js', 'r', encoding='utf-8') as f:
    js_vl_content = f.read()

# Replace the template inside cardsHtml
old_tmpl = '<h3 class="job-title"><a href="chi-tiet-viec-lam.html?id=${job.id}" target="_blank" class="job-title-link" title="Click để mở tab chi tiết riêng">${job.title}</a></h3>'
new_tmpl = '<h3 class="job-title"><a href="chi-tiet-viec-lam.html?id=${job.id}&title=${encodeURIComponent(job.title)}" class="job-title-link" title="Xem chi tiết ${job.title}">${job.title}</a></h3>'

if old_tmpl in js_vl_content:
    js_vl_content = js_vl_content.replace(old_tmpl, new_tmpl)
    print("Replaced template in js/viec-lam.js")
else:
    print("WARNING: old_tmpl not found in js/viec-lam.js")

with open('js/viec-lam.js', 'w', encoding='utf-8') as f:
    f.write(js_vl_content)

print("viec-lam updates done.")
