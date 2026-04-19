with open('project.html', 'r', encoding='utf-16') as f:
    content = f.read()

idx = content.find('Ongoing Projects')
print('Index:', idx)
snippet = content[idx:idx+500]
print(repr(snippet[:200]))