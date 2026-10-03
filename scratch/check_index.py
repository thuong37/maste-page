import sys, re
sys.stdout.reconfigure(encoding='utf-8')

with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

job_cards = re.findall(r'<article[^>]*class=["\'][^"\']*job-card[^"\']*["\'][^>]*>([\s\S]*?)</article>', html)
print(f"Total job cards in index.html: {len(job_cards)}")

for i, card in enumerate(job_cards[:5]):
    title_match = re.search(r'<(?:h3|h4|a)[^>]*class=["\'][^"\']*job-title[^"\']*["\'][^>]*>(.*?)</(?:h3|h4|a)>', card)
    link_match = re.search(r'href=["\']([^"\']+)["\']', card)
    print(f"Card {i+1}: title = {title_match.group(1).strip() if title_match else 'None'}, href = {link_match.group(1) if link_match else 'None'}")
