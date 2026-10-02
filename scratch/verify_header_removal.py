import urllib.request

res = urllib.request.urlopen('http://localhost:3000/index.html')
content = res.read().decode('utf-8', errors='ignore')

print("hero-header-box markup present:", '<div class="hero-header-box">' in content)
print("hero-title markup present:", 'class="hero-title"' in content)
print("sr-only present:", 'class="sr-only"' in content)
print("hero-search-wrapper present:", 'class="hero-search-wrapper"' in content)
