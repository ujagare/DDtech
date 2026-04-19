import re
import os

with open('project.html', 'r', encoding='utf-16') as f:
    content = f.read()

img_matches = re.findall(r'src="images/project/([^"]+)"', content)
print('Images referenced in HTML:')
for img in sorted(set(img_matches)):
    print(f'  {img}')

print()
print('Checking which files exist:')
images_dir = 'images/project'
existing = [f for f in os.listdir(images_dir)]

for img in sorted(set(img_matches)):
    found = False
    for exist in existing:
        if img.replace('%20', ' ') in exist.lower():
            found = True
            break
    if not found:
        print(f'  MISSING: {img}')