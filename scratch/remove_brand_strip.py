with open('public/index.html', 'r', encoding='utf-8') as f:
    content = f.read()

start_marker = '      <!-- Partner cards advance one card at a time -->'
end_marker = '<script src="js/partner-cards.js?v=2"></script>'

if start_marker in content and end_marker in content:
    start_pos = content.find(start_marker)
    end_pos = content.find(end_marker) + len(end_marker)
    # also consume newline after end_marker if present
    if end_pos < len(content) and content[end_pos] == '\n':
        end_pos += 1
    new_content = content[:start_pos] + content[end_pos:]
    with open('public/index.html', 'w', encoding='utf-8') as f:
        f.write(new_content)
    print('SUCCESS: Removed hero-brand-strip from public/index.html')
else:
    print('MARKERS NOT FOUND:', start_marker in content, end_marker in content)
