import sys, re
sys.stdout.reconfigure(encoding='utf-8')

# 1. Update css/viec-lam.css for requirement 2 (split list edge-to-edge) and share button
with open('css/viec-lam.css', 'r', encoding='utf-8') as f:
    css = f.read()

# Replace .split-list-pane
old_list_pane = """.split-list-pane {
  background: #FFFFFF;
  border: 1px solid #E2E8F0;
  border-radius: 20px;
  padding: 18px;
  box-shadow: 0 4px 20px -4px rgba(15, 23, 42, 0.06);
  position: sticky;
  top: 86px;
  max-height: calc(100vh - 106px);
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
}"""

new_list_pane = """.split-list-pane {
  background: #FFFFFF;
  border: 1px solid #E2E8F0;
  border-radius: 20px;
  padding: 18px 0 0 0;
  box-shadow: 0 4px 20px -4px rgba(15, 23, 42, 0.06);
  position: sticky;
  top: 86px;
  max-height: calc(100vh - 106px);
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  overflow: hidden;
}"""

# Replace .split-list-header
old_list_header = """.split-list-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-bottom: 14px;
  border-bottom: 1px solid #F1F5F9;
  margin-bottom: 14px;
  flex-shrink: 0;
}"""

new_list_header = """.split-list-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px 14px 20px;
  border-bottom: 1px solid #F1F5F9;
  margin-bottom: 0;
  flex-shrink: 0;
}"""

# Replace .split-list-feed
old_list_feed = """.split-list-feed {
  overflow-y: auto;
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding-right: 4px;
  scrollbar-width: thin;
  scrollbar-color: #CBD5E1 transparent;
}"""

new_list_feed = """.split-list-feed {
  overflow-y: auto;
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0;
  padding: 0;
  scrollbar-width: thin;
  scrollbar-color: #CBD5E1 transparent;
}"""

# Replace .split-job-card
old_card = """.split-job-card {
  background: #FFFFFF;
  border: 1.5px solid #E2E8F0;
  border-radius: 14px;
  padding: 14px;
  cursor: pointer;
  transition: all 0.18s cubic-bezier(0.16, 1, 0.3, 1);
  display: flex;
  flex-direction: column;
  gap: 10px;
  position: relative;
}"""

new_card = """.split-job-card {
  background: #FFFFFF;
  border: none;
  border-bottom: 1px solid #F1F5F9;
  border-radius: 0;
  padding: 16px 20px;
  cursor: pointer;
  transition: all 0.18s cubic-bezier(0.16, 1, 0.3, 1);
  display: flex;
  flex-direction: column;
  gap: 10px;
  position: relative;
  width: 100%;
  box-sizing: border-box;
}

.split-job-card:hover {
  background: #F8FAFC;
}

.split-job-card.is-selected {
  background: #FFFDFB;
  border-left: 4px solid #F97316 !important;
  box-shadow: inset 0 0 0 1px rgba(249, 115, 22, 0.06);
}"""

# Replace is-selected border
old_selected = """.split-job-card.is-selected {
  border-color: #F97316;
  background: #FFFDFB;
  box-shadow: 0 4px 14px -2px rgba(249, 115, 22, 0.12);
}"""

new_selected = """.split-job-card.is-selected {
  background: #FFFDFB;
  border-left: 4px solid #F97316 !important;
  box-shadow: inset 0 0 0 1px rgba(249, 115, 22, 0.06);
}"""

# Add share button style
btn_share_css = """
.btn-detail-share-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 12px 18px;
  background: #FFFFFF;
  border: 1.5px solid #E2E8F0;
  border-radius: 12px;
  color: #475569;
  font-size: 14.5px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
  font-family: inherit;
}
.btn-detail-share-btn:hover {
  border-color: #F97316;
  color: #EA580C;
  background: #FFF7ED;
}
"""

for o, n, desc in [
    (old_list_pane, new_list_pane, "split-list-pane"),
    (old_list_header, new_list_header, "split-list-header"),
    (old_list_feed, new_list_feed, "split-list-feed"),
    (old_card, new_card, "split-job-card"),
    (old_selected, new_selected, "split-job-card.is-selected")
]:
    if o in css:
        css = css.replace(o, n)
        print(f"Replaced {desc} in css")
    else:
        print(f"WARNING: {desc} not found in css")

if ".btn-detail-share-btn" not in css:
    css += btn_share_css
    print("Added .btn-detail-share-btn to css")

with open('css/viec-lam.css', 'w', encoding='utf-8') as f:
    f.write(css)

with open('public/css/viec-lam.css', 'w', encoding='utf-8') as f:
    f.write(css)

print("CSS updated and synced to public.")
