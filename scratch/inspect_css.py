import sys
sys.stdout.reconfigure(encoding='utf-8')

with open('css/viec-lam.css', 'r', encoding='utf-8') as f:
    lines = f.readlines()

for i, l in enumerate(lines):
    if any(k in l for k in ['.split-list-pane {', '.split-list-feed {', '.split-job-card {', '.split-list-header {']):
        print(f"--- Line {i+1} ---")
        for j in range(i, min(i+25, len(lines))):
            print(lines[j].rstrip())
            if '}' in lines[j]:
                break
