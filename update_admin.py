import re
import sys

def replace_in_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # Replace Nova Style with Le Jellaba
    content = re.sub(r'Nova Style', 'Le Jellaba', content)
    content = re.sub(r'nova-style', 'le-jellaba', content)
    content = re.sub(r'nova_style', 'le_jellaba', content)
    content = re.sub(r'novastyle', 'lejellaba', content)

    # Some specific replacements
    content = re.sub(r'Miroir', 'Jellaba', content, flags=re.IGNORECASE)

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

replace_in_file(r'c:\Users\asus\Documents\GitHub\lejellaba\admin.html')
print("admin.html updated")
