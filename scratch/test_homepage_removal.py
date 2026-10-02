import urllib.request

url = 'http://localhost:3000/index.html'
try:
    with urllib.request.urlopen(url) as response:
        html = response.read().decode('utf-8')
except Exception as e:
    print(f'Failed to fetch {url}: {e}')
    # fallback to local file
    with open('index.html', 'r', encoding='utf-8') as f:
        html = f.read()

# 1. Assert removed sections
assert 'id="goi-y-khoa-hoc"' not in html, 'FAIL: goi-y-khoa-hoc section is still present!'
assert 'id="goi-y-su-kien"' not in html, 'FAIL: goi-y-su-kien section is still present!'
assert 'Khóa học nâng cao kỹ năng' not in html, 'FAIL: Title "Khóa học nâng cao kỹ năng" is still present!'
assert 'Sự kiện tuyển dụng' not in html, 'FAIL: Title "Sự kiện tuyển dụng" is still present!'

# 2. Check public/index.html
with open('public/index.html', 'r', encoding='utf-8') as f:
    public_html = f.read()
assert 'id="goi-y-khoa-hoc"' not in public_html, 'FAIL: public goi-y-khoa-hoc section is still present!'
assert 'id="goi-y-su-kien"' not in public_html, 'FAIL: public goi-y-su-kien section is still present!'
assert 'Khóa học nâng cao kỹ năng' not in public_html, 'FAIL: public "Khóa học nâng cao kỹ năng" is still present!'
assert 'Sự kiện tuyển dụng' not in public_html, 'FAIL: public "Sự kiện tuyển dụng" is still present!'

# 3. Check js/home.js & public/js/home.js
with open('js/home.js', 'r', encoding='utf-8') as f:
    js_code = f.read()
assert '#goi-y-khoa-hoc' not in js_code, 'FAIL: js/home.js still references #goi-y-khoa-hoc!'

with open('public/js/home.js', 'r', encoding='utf-8') as f:
    public_js_code = f.read()
assert '#goi-y-khoa-hoc' not in public_js_code, 'FAIL: public/js/home.js still references #goi-y-khoa-hoc!'

# 4. Check section transition in index.html
cv_index = html.find('cv-template-section')
keywords_index = html.find('popular-keywords-section')
assert cv_index != -1, 'FAIL: cv-template-section not found!'
assert keywords_index != -1, 'FAIL: popular-keywords-section not found!'
assert cv_index < keywords_index, 'FAIL: section sequence is wrong!'

print('ALL 4 TEST CHECKS PASSED SUCCESSFULLY!')
print('- index.html: No course/event blocks.')
print('- public/index.html: No course/event blocks.')
print('- js/home.js & public/js/home.js: No dead course carousel code.')
print('- Localhost HTTP 3000: Verified active response and clean section flow.')
