import os
import shutil
import json

root_dir = r"c:\Users\asus\Documents\GitHub\lejellaba"

# Load products-index.json to know what to keep
with open(os.path.join(root_dir, 'products-index.json'), 'r', encoding='utf-8') as f:
    data = json.load(f)

valid_cats = [c['id'] for c in data['categories']]
valid_prods = [p['slug'] for p in data['products']]

print(f"Valid Cats: {valid_cats}")
print(f"Valid Prods: {valid_prods}")

# 1. Clean root directory
keywords_to_remove = ['miroir', 'table', 'chaise', 'douche', 'grand-', '#U06']

for item in os.listdir(root_dir):
    item_path = os.path.join(root_dir, item)
    if os.path.isdir(item_path):
        if any(kw in item.lower() for kw in keywords_to_remove):
            print(f"Removing root dir: {item}")
            shutil.rmtree(item_path)

# 2. Clean categorie directory
cat_dir = os.path.join(root_dir, 'categorie')
if os.path.exists(cat_dir):
    for item in os.listdir(cat_dir):
        if item not in valid_cats:
            print(f"Removing categorie dir: {item}")
            shutil.rmtree(os.path.join(cat_dir, item))

# 3. Clean produits directory
prod_dir = os.path.join(root_dir, 'produits')
if os.path.exists(prod_dir):
    for item in os.listdir(prod_dir):
        if os.path.isdir(os.path.join(prod_dir, item)):
            if item not in valid_prods:
                try:
                    print(f"Removing produits dir: {item}")
                except:
                    print("Removing a produits dir with special chars")
                shutil.rmtree(os.path.join(prod_dir, item))

# 4. Clean images directory
img_dir = os.path.join(root_dir, 'images')
if os.path.exists(img_dir):
    for item in os.listdir(img_dir):
        if os.path.isdir(os.path.join(img_dir, item)):
            if item not in valid_prods and item not in ['hero', 'logo', 'banners']:
                try:
                    print(f"Removing images dir: {item}")
                except:
                    pass
                try:
                    shutil.rmtree(os.path.join(img_dir, item))
                except Exception as e:
                    print(f"Error removing {item}: {e}")

print("Cleanup complete.")
