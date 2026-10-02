import os

# 1. Update css/navbar.css and public/css/navbar.css
scrollbar_hide_css = """
/* =========================================================================
   HIDE VERTICAL & HORIZONTAL SCROLLBARS IN MOBILE SIMULATOR / MOBILE VIEW
   (Mang lại trải nghiệm vuốt chạm mượt mà chuẩn iOS / Android)
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
body.in-simulator *::-webkit-scrollbar {
  display: none !important;
  width: 0 !important;
  height: 0 !important;
  background: transparent !important;
}

@media (max-width: 768px) {
  html,
  body,
  * {
    scrollbar-width: none !important;
    -ms-overflow-style: none !important;
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

for path in ['css/navbar.css', 'public/css/navbar.css', 'css/viec-lam.css', 'public/css/viec-lam.css']:
    if os.path.exists(path):
        with open(path, 'r', encoding='utf-8') as f:
            content = f.read()
        if "HIDE VERTICAL & HORIZONTAL SCROLLBARS" not in content:
            content = content.rstrip() + "\n\n" + scrollbar_hide_css.strip() + "\n"
            with open(path, 'w', encoding='utf-8') as f:
                f.write(content)
            print(f"Added scrollbar hide CSS to {path}")
        else:
            print(f"Scrollbar hide CSS already in {path}")

# 2. Update js/navbar.js and public/js/navbar.js
for js_path in ['js/navbar.js', 'public/js/navbar.js']:
    if os.path.exists(js_path):
        with open(js_path, 'r', encoding='utf-8') as f:
            js_content = f.read()

        # Update isInsideIframe handling
        old_iframe_block = """  if (isInsideIframe) {
    document.body.classList.add('in-simulator');
    return; // Do not render floating widget or simulator overlay inside iframe
  }"""

        new_iframe_block = """  if (isInsideIframe) {
    document.documentElement.classList.add('in-simulator');
    document.body.classList.add('in-simulator');
    // Inject instant scrollbar killer into simulator frame
    const scrollKiller = document.createElement('style');
    scrollKiller.id = 'easycv-scrollbar-killer';
    scrollKiller.textContent = 'html, body, * { scrollbar-width: none !important; -ms-overflow-style: none !important; } html::-webkit-scrollbar, body::-webkit-scrollbar, *::-webkit-scrollbar { display: none !important; width: 0 !important; height: 0 !important; }';
    document.head.appendChild(scrollKiller);
    return; // Do not render floating widget or simulator overlay inside iframe
  }"""

        if old_iframe_block in js_content:
            js_content = js_content.replace(old_iframe_block, new_iframe_block)
            print(f"Updated isInsideIframe block in {js_path}")

        # Update iframe load listener to inject scrollbar killer into child iframe
        old_iframe_init = """            <iframe id="mobileSimulatorIframe" class="smartphone-iframe" title="Giao diện Mobile Web EasyCV"></iframe>"""
        if old_iframe_init in js_content:
            # Check if load listener already added
            if "doc.head.appendChild(style)" not in js_content:
                # Add iframe onload injector in ensureSimulatorOverlay
                old_load_pos = "return overlay;\n  }"
                new_load_pos = """    // Auto inject scrollbar killer when iframe loads
    const iframeEl = overlay.querySelector('#mobileSimulatorIframe');
    iframeEl?.addEventListener('load', () => {
      try {
        const doc = iframeEl.contentDocument || iframeEl.contentWindow.document;
        if (doc && !doc.getElementById('easycv-injected-scroll-killer')) {
          doc.documentElement.classList.add('in-simulator');
          doc.body.classList.add('in-simulator');
          const style = doc.createElement('style');
          style.id = 'easycv-injected-scroll-killer';
          style.textContent = `
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
          `;
          doc.head.appendChild(style);
        }
      } catch (e) {}
    });

    return overlay;
  }"""
                js_content = js_content.replace(old_load_pos, new_load_pos, 1)
                print(f"Added iframe load injector in {js_path}")

        with open(js_path, 'w', encoding='utf-8') as f:
            f.write(js_content)
        print(f"Successfully saved {js_path}")
