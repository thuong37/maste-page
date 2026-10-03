import sys, re
sys.stdout.reconfigure(encoding='utf-8')

with open('viec-lam.html', 'r', encoding='utf-8') as f:
    html = f.read()

matches = re.findall(r'<h3 class="job-title">([\s\S]*?)</h3>', html)
print('Job title tags count in viec-lam.html:', len(matches))
for m in matches[:5]:
    print('  ', m.strip())
