#!/usr/bin/env python3
import json
import os

products_data = [
    {
        "slug": "jellaba-femme-traditionnelle-crepe",
        "name": "Jellaba Traditionnelle en Crêpe",
        "categoryId": "jellaba-femme",
        "category": "Jellaba Femme",
        "base_price": 750,
        "description": "Sublime Jellaba traditionnelle pour femme confectionnée en crêpe de soie de haute qualité. Finitions à la main avec une sfifa raffinée et des boutons aakads assortis. Parfaite pour le quotidien comme pour les occasions spéciales.",
        "sizes": ["S", "M", "L", "XL", "2XL"],
        "colors": ["Bleu nuit", "Bordeaux", "Vert bouteille", "Rose poudré"]
    },
    {
        "slug": "jellaba-femme-moderne-soie",
        "name": "Jellaba Moderne en Soie de Targa",
        "categoryId": "jellaba-femme",
        "category": "Jellaba Femme",
        "base_price": 950,
        "description": "Jellaba moderne en soie fluide de Targa. Coupe contemporaine avec fentes latérales élégantes. Broderie fine sur la poitrine et la capuche. Un mélange parfait de modernité et d'authenticité.",
        "sizes": ["S", "M", "L", "XL", "2XL"],
        "colors": ["Vert bouteille", "Bleu nuit", "Bordeaux", "Rose poudré"]
    },
    {
        "slug": "jellaba-homme-mlifa-classic",
        "name": "Jellaba Homme Mlifa Classique",
        "categoryId": "jellaba-homme",
        "category": "Jellaba Homme",
        "base_price": 1100,
        "description": "Jellaba classique pour homme en tissu Mlifa de premier choix, chaud et structuré. Coupe marocaine traditionnelle avec couture artisanale sfifa et finition impeccable. Idéale pour les fêtes religieuses et cérémonies.",
        "sizes": ["S", "M", "L", "XL", "2XL"],
        "colors": ["Gris anthracite", "Bleu nuit", "Bordeaux", "Blanc cassé"]
    },
    {
        "slug": "jellaba-homme-sousdi-premium",
        "name": "Jellaba Homme Sousdi Premium",
        "categoryId": "jellaba-homme",
        "category": "Jellaba Homme",
        "base_price": 1500,
        "description": "L'excellence de la tradition : Jellaba homme en tissu Sousdi tissé hand, léger et aéré. Finitions de haute couture traditionnelle. Portée par les connaisseurs pour une élégance intemporelle.",
        "sizes": ["S", "M", "L", "XL", "2XL"],
        "colors": ["Blanc cassé", "Beige", "Bleu nuit"]
    },
    {
        "slug": "gandoura-femme-premium-randa",
        "name": "Gandoura Femme Randa Élégante",
        "categoryId": "gandoura-femme",
        "category": "Gandoura Femme",
        "base_price": 650,
        "description": "Gandoura d'été pour femme avec coutures en Randa raffinées. Tissu fluide, léger et extrêmement agréable à porter pour recevoir ou pour les soirées de Ramadan.",
        "sizes": ["S", "M", "L", "XL", "2XL"],
        "colors": ["Bordeaux", "Rose poudré", "Vert bouteille", "Bleu nuit"]
    },
    {
        "slug": "gandoura-femme-coton-caftan",
        "name": "Gandoura Femme en Coton Style Caftan",
        "categoryId": "gandoura-femme",
        "category": "Gandoura Femme",
        "base_price": 450,
        "description": "Gandoura décontractée style caftan en coton doux. Broderies florales colorées et finitions artisanales. Confort absolu pour la maison ou les sorties d'été.",
        "sizes": ["S", "M", "L", "XL", "2XL"],
        "colors": ["Bleu nuit", "Bordeaux", "Vert bouteille"]
    },
    {
        "slug": "gandoura-homme-mousseline",
        "name": "Gandoura Homme Mousseline Haute Qualité",
        "categoryId": "gandoura-homme",
        "category": "Gandoura Homme",
        "base_price": 550,
        "description": "Gandoura pour homme en mousseline légère haut de gamme. Coupe ample et confortable avec fine broderie marocaine au col. Idéale pour les prières de l'Aïd et du vendredi.",
        "sizes": ["S", "M", "L", "XL", "2XL"],
        "colors": ["Blanc", "Beige", "Bleu nuit"]
    },
    {
        "slug": "gandoura-homme-coton-dore",
        "name": "Gandoura Homme Coton Brodé Or",
        "categoryId": "gandoura-homme",
        "category": "Gandoura Homme",
        "base_price": 600,
        "description": "Gandoura moderne pour homme en coton naturel enrichi de somptueuses broderies dorées sur le col et les manches. L'alliance parfaite du chic et du confort.",
        "sizes": ["S", "M", "L", "XL", "2XL"],
        "colors": ["Vert bouteille", "Bleu nuit", "Blanc cassé"]
    },
    {
        "slug": "jellaba-enfant-fille-brodee",
        "name": "Jellaba Enfant Fille Brodée",
        "categoryId": "jellaba-enfant",
        "category": "Jellaba Enfant",
        "base_price": 350,
        "description": "Adorable Jellaba de fête pour petite fille. Tissu doux antiallergique avec de jolies broderies colorées. Capuche traditionnelle avec pompon.",
        "sizes": ["4-6 ans", "6-8 ans", "8-10 ans", "10-12 ans"],
        "colors": ["Rose poudré", "Bordeaux", "Vert bouteille"]
    },
    {
        "slug": "jellaba-enfant-garcon-mlifa",
        "name": "Jellaba Enfant Garçon Classique",
        "categoryId": "jellaba-enfant",
        "category": "Jellaba Enfant",
        "base_price": 400,
        "description": "Jellaba traditionnelle pour petit garçon en mlifa douce. Couture sfifa discrète. Idéale pour accompagner les parents lors des célébrations.",
        "sizes": ["4-6 ans", "6-8 ans", "8-10 ans", "10-12 ans"],
        "colors": ["Bleu nuit", "Gris anthracite", "Blanc cassé"]
    },
    {
        "slug": "babouches-cuir-artisanale",
        "name": "Babouches en Cuir Véritable",
        "categoryId": "accessoires",
        "category": "Accessoires",
        "base_price": 250,
        "description": "Babouches (Balgha) traditionnelles en cuir véritable de chèvre et mouton, entièrement cousues à la main par nos artisans à Fès. Robustes et ultra confortables.",
        "sizes": ["38", "39", "40", "41", "42", "43", "44"],
        "colors": ["Jaune traditionnel", "Blanc cassé", "Noir"]
    },
    {
        "slug": "ceinture-medina-brodee",
        "name": "Ceinture Brodée Mdamma",
        "categoryId": "accessoires",
        "category": "Accessoires",
        "base_price": 150,
        "description": "Ceinture brodée traditionnelle (Mdamma) pour sublimer vos caftans, gandouras et jellabas. Broderie au fil doré ou argenté de haute qualité avec fermeture ajustable.",
        "sizes": ["Taille Unique"],
        "colors": ["Doré", "Argenté"]
    }
]

# Write individual product JSON files inside products/
os.makedirs("products", exist_ok=True)

# Clean old JSON files from products/ directory to avoid mixing
for file in os.listdir("products"):
    if file.endswith(".json"):
        os.remove(os.path.join("products", file))

indexed_products = []
simple_products = []

for p in products_data:
    slug = p["slug"]
    
    # Construct variants
    variants = []
    for s in p["sizes"]:
        for c in p["colors"]:
            variants.append({
                "axes": {
                    "Taille": s,
                    "Couleur": c
                },
                "price": p["base_price"],
                "sku": f"{slug.upper()}-{s}-{c[:3].upper()}"
            })
            
    p_detail = {
        "slug": slug,
        "name": p["name"],
        "categoryId": p["categoryId"],
        "category": p["category"],
        "active": True,
        "images": [
            f"/images/{slug}/1.webp",
            f"/images/{slug}/2.webp"
        ],
        "description": p["description"],
        "seo": {
            "title": f"{p['name']} | Le Jellaba Maroc",
            "description": p["description"][:150]
        },
        "axes": {
            "order": ["Taille", "Couleur"],
            "options": {
                "Taille": p["sizes"],
                "Couleur": p["colors"]
            }
        },
        "variants": variants
    }
    
    # Save detail JSON
    with open(f"products/{slug}.json", "w", encoding="utf-8") as f:
        json.dump(p_detail, f, ensure_ascii=False, indent=2)
        
    # Append to products-index.json products list
    indexed_products.append({
        "id": slug,
        "slug": slug,
        "name": p["name"],
        "category": p["category"],
        "categoryId": p["categoryId"],
        "active": True,
        "image": f"/images/{slug}/1.webp",
        "price": {
            "min": p["base_price"],
            "max": p["base_price"]
        },
        "hasVariants": True,
        "variantCount": len(variants),
        "featured": True
    })
    
    # Append to products.json list
    simple_products.append({
        "id": slug,
        "name": p["name"],
        "price": p["base_price"],
        "category": p["category"],
        "image": f"/images/{slug}/1.webp"
    })

# Write simple products.json
with open("products.json", "w", encoding="utf-8") as f:
    json.dump({"products": simple_products}, f, ensure_ascii=False, indent=2)

# Categories configuration for products-index.json
categories_list = [
    { "id": "jellaba-femme", "name": "Jellaba Femme", "raw": "Jellaba Femme", "count": 2 },
    { "id": "jellaba-homme", "name": "Jellaba Homme", "raw": "Jellaba Homme", "count": 2 },
    { "id": "gandoura-femme", "name": "Gandoura Femme", "raw": "Gandoura Femme", "count": 2 },
    { "id": "gandoura-homme", "name": "Gandoura Homme", "raw": "Gandoura Homme", "count": 2 },
    { "id": "jellaba-enfant", "name": "Jellaba Enfant", "raw": "Jellaba Enfant", "count": 2 },
    { "id": "accessoires", "name": "Accessoires", "raw": "Accessoires", "count": 2 }
]

# Write products-index.json
index_data = {
    "version": 2,
    "generated": "2026-05-31",
    "categories": categories_list,
    "products": indexed_products
}

with open("products-index.json", "w", encoding="utf-8") as f:
    json.dump(index_data, f, ensure_ascii=False, indent=2)

print("✅ Re-indexing completed successfully!")
print("Updated products.json and products-index.json.")
print(f"Created {len(products_data)} detail product JSON files in products/")
