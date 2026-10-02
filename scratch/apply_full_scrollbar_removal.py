import os
import re

# 1. Scrollbar killer style to insert into <head> of HTML files
INLINE_STYLE = """  <!-- Khử triệt để thanh cuộn dọc/ngang xám trên Mobile Web và Simulator -->
  <style id="easycv-mobile-scrollbar-killer">
    @media (max-width: 1024px) {
      html, body, * {
        scrollbar-width: none !important;
        -ms-overflow-style: none !important;
      }
      ::-webkit-scrollbar {
        display: none !important;
        width: 0 !important;
        height: 0 !important;
        background: transparent !important;
      }
      *::-webkit-scrollbar {
        display: none !important;
        width: 0 !important;
        height: 0 !important;
      }
    }
    html.in-simulator,
    body.in-simulator,
    html.in-simulator *,
    body.in-simulator * {
      scrollbar-width: none !important;
      -ms-overflow-style: none !important;
    }
    html.in-simulator::-webkit-scrollbar,
    body.in-simulator::-webkit-scrollbar,
    .in-simulator ::-webkit-scrollbar {
      display: none !important;
      width: 0 !important;
      height: 0 !important;
      background: transparent !important;
    }
  </style>"""

html_files = [
    'viec-lam.html',
    'public/viec-lam.html',
    'index.html',
    'public/index.html',
    'chi-tiet-viec-lam.html',
    'public/chi-tiet-viec-lam.html'
]

for file_path in html_files:
    if not os.path.exists(file_path):
        continue
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # Remove existing inline style if present
    content = re.sub(r'<!-- Khử triệt để.*?-->\s*<style id="easycv-mobile-scrollbar-killer">.*?</style>\s*', '', content, flags=re.DOTALL)

    # Insert right before </head>
    content = content.replace('</head>', f"{INLINE_STYLE}\n</head>")

    # Bump cache buster for navbar.css, viec-lam.css, and navbar.js to v=6.0_no_scrollbar
    content = re.sub(r'href="css/navbar\.css(?:\?[^"]*)?"', 'href="css/navbar.css?v=6.0_no_scrollbar"', content)
    content = re.sub(r'href="css/viec-lam\.css(?:\?[^"]*)?"', 'href="css/viec-lam.css?v=6.0_no_scrollbar"', content)
    content = re.sub(r'src="js/navbar\.js(?:\?[^"]*)?"', 'src="js/navbar.js?v=6.0_no_scrollbar"', content)

    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(content)
    print(f"Updated HTML: {file_path}")

# 2. Update CSS files
css_hide_rule = """
/* =========================================================================
   HIDE VERTICAL & HORIZONTAL SCROLLBARS IN MOBILE SIMULATOR / MOBILE VIEW
   (Mang lại trải nghiệm vuốt chạm mượt mà chuẩn iOS / Android, loại bỏ hoàn toàn scrollbar xám)
   ========================================================================= */
html.in-simulator,
body.in-simulator,
html.in-simulator *,
body.in-simulator * {
  scrollbar-width: none !important; /* Firefox */
  -ms-overflow-style: none !important; /* IE and Edge */
}

html.in-simulator::-webkit-scrollbar,
body.in-simulator::-webkit-scrollbar,
html.in-simulator *::-webkit-scrollbar,
body.in-simulator *::-webkit-scrollbar,
.in-simulator ::-webkit-scrollbar {
  display: none !important;
  width: 0 !important;
  height: 0 !important;
  background: transparent !important;
}

@media (max-width: 1024px) {
  html,
  body,
  * {
    scrollbar-width: none !important;
    -ms-overflow-style: none !important;
  }

  ::-webkit-scrollbar {
    display: none !important;
    width: 0 !important;
    height: 0 !important;
    background: transparent !important;
  }

  html::-webkit-scrollbar,
  body::-webkit-scrollbar,
  *::-webkit-scrollbar {
    display: none !important;
    width: 0 !important;
    height: 0 !important;
    background: transparent !important;
  }
}
"""

for css_path in ['css/navbar.css', 'public/css/navbar.css', 'css/viec-lam.css', 'public/css/viec-lam.css']:
    if not os.path.exists(css_path):
        continue
    with open(css_path, 'r', encoding='utf-8') as f:
        c = f.read()

    # Clean existing block if found
    c = re.sub(r'/\* =+ HIDE VERTICAL & HORIZONTAL SCROLLBARS.*?\*/.*?(?=\Z)', '', c, flags=re.DOTALL)
    c = c.rstrip() + "\n\n" + css_hide_rule.strip() + "\n"

    with open(css_path, 'w', encoding='utf-8') as f:
        f.write(c)
    print(f"Updated CSS: {css_path}")

# 3. Update JS files (navbar.js and public/js/navbar.js)
for js_path in ['js/navbar.js', 'public/js/navbar.js']:
    if not os.path.exists(js_path):
        continue
    with open(js_path, 'r', encoding='utf-8') as f:
        jc = f.read()

    # Ensure scrollbar killer text inside isInsideIframe and iframe onload includes ::-webkit-scrollbar
    enhanced_killer_css = 'html, body, * { scrollbar-width: none !important; -ms-overflow-style: none !important; } ::-webkit-scrollbar { display: none !important; width: 0 !important; height: 0 !important; } html::-webkit-scrollbar, body::-webkit-scrollbar, *::-webkit-scrollbar { display: none !important; width: 0 !important; height: 0 !important; }'
    
    jc = re.sub(r"scrollKiller\.textContent = '.*?';", f"scrollKiller.textContent = '{enhanced_killer_css}';", jc)
    
    # In iframe load listener
    old_style_content = """          style.textContent = `
            html, body, * {
              scrollbar-width: none !important;
              -ms-overflow-style: none !important;
            }
            html::-webkit-scrollbar, body::-webkit-scrollbar, *::-webkit-scrollbar {
              display: none !important;
              width: 0 !important;
              height: 0 !important;
              background: transparent !important;
            }
          `;"""

    new_style_content = """          style.textContent = `
            html, body, * {
              scrollbar-width: none !important;
              -ms-overflow-style: none !important;
            }
            ::-webkit-scrollbar {
              display: none !important;
              width: 0 !important;
              height: 0 !important;
              background: transparent !important;
            }
            html::-webkit-scrollbar, body::-webkit-scrollbar, *::-webkit-scrollbar {
              display: none !important;
              width: 0 !important;
              height: 0 !important;
              background: transparent !important;
            }
          `;"""

    if old_style_content in jc:
        jc = jc.replace(old_style_content, new_style_content)

    with open(js_path, 'w', encoding='utf-8') as f:
        f.write(jc)
    print(f"Updated JS: {js_path}")

print("All files updated successfully.")
