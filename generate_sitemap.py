import os
import json
import xml.etree.ElementTree as ET
from xml.dom import minidom

root_dir = r"c:\Users\asus\Documents\GitHub\lejellaba"
base_url = "https://lejellaba.ma"

# Load products index
with open(os.path.join(root_dir, 'products-index.json'), 'r', encoding='utf-8') as f:
    data = json.load(f)

urls = [
    "/",
    "/cart.html",
    "/shop.html",
    "/contact.html",
    "/about.html"
]

# Add categories
for cat in data['categories']:
    urls.append(f"/categorie/{cat['id']}/")

# Add products
for prod in data['products']:
    urls.append(f"/produits/{prod['slug']}/")

# Build XML
urlset = ET.Element("urlset")
urlset.set("xmlns", "http://www.sitemaps.org/schemas/sitemap/0.9")

for path in urls:
    url_el = ET.SubElement(urlset, "url")
    loc = ET.SubElement(url_el, "loc")
    loc.text = f"{base_url}{path}"
    
    # Optional changefreq/priority
    changefreq = ET.SubElement(url_el, "changefreq")
    priority = ET.SubElement(url_el, "priority")
    if path == "/":
        changefreq.text = "daily"
        priority.text = "1.0"
    elif path.startswith("/categorie/"):
        changefreq.text = "weekly"
        priority.text = "0.9"
    elif path.startswith("/produits/"):
        changefreq.text = "weekly"
        priority.text = "0.8"
    else:
        changefreq.text = "monthly"
        priority.text = "0.5"

xml_str = minidom.parseString(ET.tostring(urlset)).toprettyxml(indent="  ")

# Write to sitemap.xml
with open(os.path.join(root_dir, 'sitemap.xml'), 'w', encoding='utf-8') as f:
    f.write(xml_str)

print("sitemap.xml generated")
