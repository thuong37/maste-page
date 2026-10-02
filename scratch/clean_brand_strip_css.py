import re

def clean_file(path):
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()

    # 1. Remove /* Featured employer cards */ block
    pattern_block = r'\s*/\* Featured employer cards \*/[\s\S]*?@media \(prefers-reduced-motion: reduce\) \{\s*\.marquee-slider-container \{\s*overflow-x: auto;\s*\}\s*\}'
    content = re.sub(pattern_block, '', content)

    # 2. Remove mobile media query part for hero-brand-strip
    pattern_mq = r'\s*\.hero-brand-strip \{\s*margin-top: 22px;\s*\}\s*\.marquee-slider-container \{\s*width: 100%;\s*\}\s*\.marquee-partner-card \{\s*width: min\(356px, calc\(100vw - 32px\)\);\s*min-height: 140px;\s*padding: 14px;\s*\}\s*\.partner-card-logo \{\s*width: 92px;\s*height: 92px;\s*\}'
    content = re.sub(pattern_mq, '', content)

    with open(path, 'w', encoding='utf-8') as f:
        f.write(content)
    print(f'Cleaned CSS from {path}')

clean_file('index.html')
clean_file('public/index.html')
