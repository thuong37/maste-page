import urllib.request

res = urllib.request.urlopen('http://localhost:3000/index.html')
content = res.read().decode('utf-8', errors='ignore')

checks = {
    '<div class="hero-brand-strip">': '<div class="hero-brand-strip">' in content,
    'class="hero-brand-strip"': 'class="hero-brand-strip"' in content,
    'marquee-track': 'marquee-track' in content,
    'marquee-partner-card': 'marquee-partner-card' in content,
    'partner-cards.js': 'partner-cards.js' in content,
    'hero-ad-showcase': 'hero-ad-showcase' in content,
    'spotlight-rotation.js': 'spotlight-rotation.js' in content,
    'viec-lam-noi-bat': 'viec-lam-noi-bat' in content,
}

for name, found in checks.items():
    print(f"{name:35}: {found}")
