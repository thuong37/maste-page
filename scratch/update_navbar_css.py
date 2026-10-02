import os
import re

css_addition = """
  .brand-logo-img {
    height: 38px;
  }
  .navbar {
    padding: 0 var(--container-padding-mobile, 16px);
  }
  .navbar-actions {
    gap: 6px;
  }
  .nav-action-btn {
    width: 36px;
    height: 36px;
    padding: 0;
  }
  .user-profile-btn {
    padding: 2px;
  }
  .user-avatar-wrap {
    width: 34px;
    height: 34px;
  }
  .user-avatar {
    width: 34px;
    height: 34px;
  }
  .mobile-toggle-btn {
    width: 38px;
    height: 38px;
    margin-left: 2px;
  }"""

floating_box_css = """/* ==========================================================================
   FLOATING VIEW MODE SWITCHER BOX (Box lơ lửng ở rìa bên phải màn hình)
   ========================================================================== */
.floating-view-mode-box {
  position: fixed;
  right: 18px;
  top: 50%;
  transform: translateY(-50%);
  z-index: 999999;
  background: rgba(255, 255, 255, 0.94);
  backdrop-filter: blur(18px);
  -webkit-backdrop-filter: blur(18px);
  border: 1px solid rgba(226, 232, 240, 0.9);
  border-radius: 18px;
  padding: 14px;
  box-shadow: 0 12px 36px rgba(15, 23, 42, 0.14), 0 2px 8px rgba(249, 115, 22, 0.08);
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  width: 200px;
  user-select: none;
}

[data-theme="dark"] .floating-view-mode-box {
  background: rgba(17, 24, 39, 0.92);
  border-color: rgba(255, 255, 255, 0.12);
  box-shadow: 0 16px 40px rgba(0, 0, 0, 0.4);
}

.floating-box-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
  padding-bottom: 8px;
  border-bottom: 1px solid rgba(226, 232, 240, 0.7);
}

[data-theme="dark"] .floating-box-header {
  border-bottom-color: rgba(255, 255, 255, 0.08);
}

.floating-box-title {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  font-size: 11.5px;
  font-weight: 700;
  color: #0F172A;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

[data-theme="dark"] .floating-box-title {
  color: #F8FAFC;
}

.floating-box-status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #22C55E;
  box-shadow: 0 0 6px rgba(34, 197, 94, 0.6);
  animation: pulseDot 2s infinite;
}

.floating-box-status-dot.mobile {
  background: #F97316;
  box-shadow: 0 0 8px rgba(249, 115, 22, 0.8);
}

.floating-box-min-btn {
  background: transparent;
  border: none;
  color: #94A3B8;
  cursor: pointer;
  padding: 2px 4px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.15s;
}

.floating-box-min-btn:hover {
  color: #0F172A;
  background: rgba(0, 0, 0, 0.05);
}

.floating-mode-switcher {
  display: flex;
  background: #F1F5F9;
  border: 1px solid #E2E8F0;
  border-radius: 12px;
  padding: 3px;
  gap: 3px;
  margin-bottom: 8px;
}

[data-theme="dark"] .floating-mode-switcher {
  background: #1E293B;
  border-color: #334155;
}

.floating-mode-btn {
  flex: 1;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 8px 6px;
  border: none;
  background: transparent;
  border-radius: 9px;
  font-family: inherit;
  font-size: 12px;
  font-weight: 600;
  color: #64748B;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
  white-space: nowrap;
}

[data-theme="dark"] .floating-mode-btn {
  color: #94A3B8;
}

.floating-mode-btn:hover:not(.active) {
  color: #0F172A;
  background: rgba(0, 0, 0, 0.04);
}

.floating-mode-btn.active[data-mode="web"] {
  background: #FFFFFF;
  color: #0F172A;
  font-weight: 700;
  box-shadow: 0 2px 6px rgba(15, 23, 42, 0.08);
}

[data-theme="dark"] .floating-mode-btn.active[data-mode="web"] {
  background: #334155;
  color: #FFFFFF;
}

.floating-mode-btn.active[data-mode="mobile"] {
  background: linear-gradient(135deg, #FF8A34 0%, #F97316 100%);
  color: #FFFFFF;
  font-weight: 700;
  box-shadow: 0 2px 8px rgba(249, 115, 22, 0.35);
}

.floating-mobile-controls {
  display: none;
  flex-direction: column;
  gap: 8px;
  padding-top: 4px;
}

.floating-view-mode-box.mode-mobile .floating-mobile-controls {
  display: flex;
}

.floating-preset-label {
  font-size: 11px;
  font-weight: 600;
  color: #94A3B8;
  text-transform: uppercase;
  letter-spacing: 0.03em;
}

.floating-presets-grid {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.floating-preset-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 6px 10px;
  background: #F8FAFC;
  border: 1px solid #E2E8F0;
  border-radius: 8px;
  font-size: 11.5px;
  font-weight: 600;
  color: #334155;
  cursor: pointer;
  transition: all 0.15s;
}

[data-theme="dark"] .floating-preset-item {
  background: rgba(255, 255, 255, 0.04);
  border-color: rgba(255, 255, 255, 0.08);
  color: #CBD5E1;
}

.floating-preset-item small {
  color: #94A3B8;
  font-size: 10px;
}

.floating-preset-item:hover {
  border-color: #F97316;
  color: #F97316;
  background: #FFF7ED;
}

.floating-preset-item.active {
  background: rgba(249, 115, 22, 0.12);
  border-color: #F97316;
  color: #EA580C;
  font-weight: 700;
}

.floating-preset-item.active small {
  color: #EA580C;
  font-weight: 600;
}

.floating-actions-row {
  display: flex;
  gap: 6px;
  margin-top: 4px;
}

.floating-action-mini-btn {
  flex: 1;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  padding: 6px;
  border-radius: 8px;
  font-size: 11px;
  font-weight: 600;
  border: 1px solid #E2E8F0;
  background: #FFFFFF;
  color: #475569;
  cursor: pointer;
  transition: all 0.15s;
}

[data-theme="dark"] .floating-action-mini-btn {
  background: #1E293B;
  border-color: #334155;
  color: #E2E8F0;
}

.floating-action-mini-btn:hover {
  background: #F1F5F9;
  color: #0F172A;
  border-color: #CBD5E1;
}

/* Minimized Floating Box State */
.floating-view-mode-box.is-minimized {
  width: auto;
  padding: 8px 12px;
  border-radius: 9999px;
  right: 12px;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
}

.floating-view-mode-box.is-minimized .floating-box-header,
.floating-view-mode-box.is-minimized .floating-mobile-controls,
.floating-view-mode-box.is-minimized .floating-mode-switcher {
  display: none !important;
}

.floating-minimized-pill {
  display: none !important;
}

.floating-view-mode-box.is-minimized .floating-minimized-pill {
  display: flex !important;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  font-size: 12px;
  font-weight: 700;
  color: #0F172A;
}

[data-theme="dark"] .floating-view-mode-box.is-minimized .floating-minimized-pill {
  color: #F8FAFC;
}

/* Hide floating box inside simulator iframe */
body.in-simulator .floating-view-mode-box {
  display: none !important;
}
"""

def update_file(filepath):
    if not os.path.exists(filepath):
        print(f"File {filepath} not found.")
        return
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # 1. Update @media (max-width: 768px) navbar items
    pattern = re.compile(r'(@media\s*\(\s*max-width:\s*768px\s*\)\s*\{)(?:\s*\.brand-logo-img\s*\{[^}]*\}\s*\.navbar\s*\{[^}]*\})', re.DOTALL)
    if pattern.search(content):
        content = pattern.sub(r'\1' + css_addition, content, count=1)
        print(f"Updated media query in {filepath}")
    else:
        print(f"Could not find exact media pattern in {filepath}, trying fallback")
        old_part = ".brand-logo-img {\n    height: 48px;\n  }\n  .navbar {\n    padding: 0 var(--container-padding-mobile, 16px);\n  }"
        if old_part in content:
            content = content.replace(old_part, css_addition.strip())
            print(f"Fallback replaced in {filepath}")

    # 2. Replace .view-mode-toggle-box section with floating_box_css
    box_pattern = re.compile(r'/\* =+\s*Web / Mobile Web View Mode Switcher Box\s*=+ \*/.*?(?=/\* =+\s*Mobile Web Device Simulator Overlay)', re.DOTALL)
    if box_pattern.search(content):
        content = box_pattern.sub(floating_box_css + "\n", content, count=1)
        print(f"Replaced view-mode-toggle-box with floating_box_css in {filepath}")
    else:
        print(f"Could not find view-mode-toggle-box block in {filepath}")

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)
    print(f"Successfully saved {filepath}")

update_file('css/navbar.css')
update_file('public/css/navbar.css')
