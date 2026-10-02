import sys
sys.stdout.reconfigure(encoding='utf-8')

with open('index.html', 'r', encoding='utf-8') as f:
    c = f.read()

import re
matches_index = re.findall(r'class="[^"]*match[^"]*"', c, re.I)
print('Match classes in index.html:', set(matches_index))

match_pill_snippets = re.findall(r'<span[^>]*class="[^"]*match[^"]*"[^>]*>.*?</span>', c, re.I | re.S)
for s in match_pill_snippets[:5]:
    print('Match pill in index.html:', s)

apply_btn_index = re.findall(r'<button[^>]*>.*?ứng tuyển.*?</button>', c, re.I | re.S)
print('Apply buttons in index.html:', len(apply_btn_index))

