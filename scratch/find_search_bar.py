import sys, re
sys.stdout.reconfigure(encoding='utf-8')

with open('viec-lam.html', 'r', encoding='utf-8') as f:
    vl_html = f.read()

lines = vl_html.split('\n')
for i, l in enumerate(lines):
    if 'job-search-hero' in l or 'hero-search-wrapper' in l:
        print(f"Start at line {i+1}: {l}")
        for j in range(i, min(i+120, len(lines))):
            print(lines[j])
            if '</section>' in lines[j] and j > i + 10:
                print(f"End at line {j+1}")
                break
        break
