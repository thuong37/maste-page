import re

with open('viec-lam.html', 'r', encoding='utf-8') as f:
    text = f.read()

ids = re.findall(r'id=["\']([^"\']+)["\']', text)
print("Total IDs:", len(ids))
for i in range(0, len(ids), 10):
    print(ids[i:i+10])
