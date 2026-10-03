import sys, re
sys.stdout.reconfigure(encoding='utf-8')

with open('viec-lam.html', 'r', encoding='utf-8') as f:
    vl_html = f.read()

with open('js/viec-lam.js', 'r', encoding='utf-8') as f:
    vl_js = f.read()

with open('js/chi-tiet-viec-lam.js', 'r', encoding='utf-8') as f:
    ct_js = f.read()

with open('chi-tiet-viec-lam.html', 'r', encoding='utf-8') as f:
    ct_html = f.read()

html_links = re.findall(r'href=["\'](chi-tiet-viec-lam\.html\?[^"\']+)["\'][^>]*>(.*?)</a>', vl_html)
print(f"HTML links count in viec-lam.html: {len(html_links)}")
for l, t in html_links[:5]:
    print("  ", l, "->", t)

vl_jobs = re.findall(r'id:\s*(\d+),\s*title:\s*[\'"]([^\'"]+)[\'"]', vl_js)
print(f"vl_js JOBS_DATA count: {len(vl_jobs)}")

ct_jobs = re.findall(r'id:\s*(\d+),\s*title:\s*[\'"]([^\'"]+)[\'"]', ct_js)
print(f"ct_js JOBS_DATA count: {len(ct_jobs)}")

print("Differences in IDs:")
vl_ids = set(int(x[0]) for x in vl_jobs)
ct_ids = set(int(x[0]) for x in ct_jobs)
print("In vl but not in ct:", vl_ids - ct_ids)
print("In ct but not in vl:", ct_ids - vl_ids)
