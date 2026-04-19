import re

with open('project.html', 'r', encoding='utf-16') as f:
    content = f.read()

# Fix the image paths - the actual files use spaces directly
fixes = [
    ('src="images/project/EON%20WEST%20LP%20II,%20WAKAD%20,PUNE.webp"', 'src="images/project/EON WEST LP II, WAKAD ,PUNE.webp"'),
    ('src="images/project/EON%20WEST%20LP%20II,%20WAKAD%20,PUNE%20%282%29.webp"', 'src="images/project/EON WEST LP II, WAKAD ,PUNE (2).webp"'),
    ('src="images/project/GOLDEN%20BELL.webp"', 'src="images/project/GOLDEN BELL.webp"'),
    ('src="images/project/panchashil%20tech%20park%20viman%20nagar%20pune.webp"', 'src="images/project/kalpatu.webp"'),  # Temporary placeholder
]

for old, new in fixes:
    if old in content:
        content = content.replace(old, new)
        print(f"Fixed: {old[:50]}...")

# Write back
with open('project.html', 'w', encoding='utf-16') as f:
    f.write(content)

print("Done!")