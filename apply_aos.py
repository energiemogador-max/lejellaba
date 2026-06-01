import os
import re

count = 0
for root, dirs, files in os.walk('.'):
    if '.git' in root or 'node_modules' in root:
        continue
    for file in files:
        if file.endswith('.html'):
            filepath = os.path.join(root, file)
            with open(filepath, 'r', encoding='utf-8') as f:
                content = f.read()

            original = content
            
            # Add data-aos to blog cards
            content = re.sub(r'(<a[^>]*class="[^"]*blog-card[^"]*"[^>]*)(>)', lambda m: m.group(1) + ' data-aos="fade-up">' if 'data-aos' not in m.group(1) else m.group(0), content)
            
            # Add data-aos to blog featured
            content = re.sub(r'(<a[^>]*class="[^"]*blog-featured[^"]*"[^>]*)(>)', lambda m: m.group(1) + ' data-aos="fade-up">' if 'data-aos' not in m.group(1) else m.group(0), content)
            
            # Add data-aos to product cards
            content = re.sub(r'(<a[^>]*class="[^"]*product-card[^"]*"[^>]*)(>)', lambda m: m.group(1) + ' data-aos="fade-up">' if 'data-aos' not in m.group(1) else m.group(0), content)
            
            # Add data-aos to <section> tags
            content = re.sub(r'(<section[^>]*)(>)', lambda m: m.group(1) + ' data-aos="fade-up">' if 'data-aos' not in m.group(1) else m.group(0), content)
            
            # Add data-aos to .hub-hero, .seo-content, .blog-page-hero
            content = re.sub(r'(<div[^>]*class="[^"]*(?:hub-hero|seo-content|blog-page-hero)[^"]*"[^>]*)(>)', lambda m: m.group(1) + ' data-aos="fade-up">' if 'data-aos' not in m.group(1) else m.group(0), content)

            if content != original:
                with open(filepath, 'w', encoding='utf-8') as f:
                    f.write(content)
                count += 1

print(f'Updated {count} HTML files.')
