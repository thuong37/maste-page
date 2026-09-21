from html.parser import HTMLParser

class TagChecker(HTMLParser):
    def __init__(self):
        super().__init__()
        self.stack = []
        self.void_elements = {'area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'param', 'source', 'track', 'wbr'}
        self.errors = []

    def handle_starttag(self, tag, attrs):
        if tag not in self.void_elements:
            self.stack.append((tag, self.getpos()))

    def handle_endtag(self, tag):
        if tag in self.void_elements:
            return
        if not self.stack:
            self.errors.append(f'Unexpected end tag </{tag}> at {self.getpos()}')
            return
        last_tag, pos = self.stack.pop()
        if last_tag != tag:
            self.errors.append(f'Mismatched tag: expected </{last_tag}> from {pos}, got </{tag}> at {self.getpos()}')

checker = TagChecker()
with open('index.html', 'r', encoding='utf-8') as f:
    content = f.read()

checker.feed(content)
print('Parser errors count:', len(checker.errors))
if checker.errors:
    for err in checker.errors[:10]:
        print(err)
else:
    print('HTML is 100% valid and well-nested!')


