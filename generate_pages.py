import json
import os

with open('products-index.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

categories = data['categories']
products = data['products']

CAT_TEMPLATE = """<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>__CAT_NAME__ | Le Jellaba Maroc</title>
<meta name="description" content="Découvrez notre collection de __CAT_NAME__ au Maroc. Qualité supérieure, artisanat marocain.">
<meta name="robots" content="index, follow">
<link rel="canonical" href="https://lejellaba.ma/categorie/__CAT_ID__/">
<meta property="og:type" content="website">
<meta property="og:title" content="__CAT_NAME__ | Le Jellaba Maroc">
<meta property="og:url" content="https://lejellaba.ma/categorie/__CAT_ID__/">
<meta property="og:locale" content="fr_MA">
<link rel="icon" type="image/png" href="/assets/favicon.png">
<link rel="stylesheet" href="/assets/style.css">
</head>
<body>
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  "name": "__CAT_NAME__",
  "description": "Collection de __CAT_NAME__ au Maroc. Artisanat de qualité.",
  "url": "https://lejellaba.ma/categorie/__CAT_ID__/",
  "numberOfItems": __COUNT__
}
</script>

<div class="announce">Livraison gratuite partout au Maroc · Artisanat authentique · Paiement à la livraison</div>
<script src="/assets/header.js" defer></script>

<nav class="breadcrumb"><a href="/">Accueil</a> › <span>__CAT_NAME__</span></nav>

<section class="hub-hero">
  <h1>__CAT_NAME__ au Maroc</h1>
  <p class="lead">Découvrez notre gamme premium de <strong>__CAT_NAME__</strong>. Fabriqué avec soin au Maroc.</p>
</section>

<section class="products-list">
  <div id="products-grid" data-category-id="__CAT_ID__">
    __PRODUCT_CARDS__
  </div>
</section>

<section class="seo-content" style="max-width: 1200px; margin: 40px auto; padding: 20px; background: #fff; border-radius: 8px; box-shadow: 0 4px 15px rgba(0,0,0,0.03);">
  <h2 style="font-size: 24px; color: var(--brand); margin-bottom: 15px;">__CAT_NAME__ de Luxe — Artisanat Marocain</h2>
  <p>Le Jellaba est le spécialiste marocain des vêtements traditionnels de luxe. Chaque <strong>__CAT_NAME__</strong> est réalisée avec des tissus de haute qualité (mlifa, crêpe, soie) — la référence mondiale pour un style authentique et une durabilité exceptionnelle.</p>
  <p>Nos créations intègrent le savoir-faire de nos artisans, avec des broderies (sfifa, randa) réalisées à la main. Livraison rapide partout au Maroc.</p>
  <h3 style="font-size: 20px; color: #1a1a1a; margin-top: 20px; margin-bottom: 10px;">Pourquoi choisir nos vêtements ?</h3>
  <p>Nous sélectionnons rigoureusement nos tissus pour vous garantir un confort optimal. La coupe est étudiée pour s'adapter à toutes les morphologies, offrant élégance et aisance de mouvement. Un héritage culturel revisité pour la modernité.</p>
</section>

<script src="/assets/footer.js" defer></script>

<div class="bottom-bar">
  <a class="call" href="tel:+212700000000">📞 <span class="dyn-phone">notre service client</span></a>
  <a class="wa" href="https://wa.me/212700000000?text=" target="_blank">💬 WhatsApp</a>
</div>
<script src="/assets/category-loader.js" defer></script>
</body></html>"""

PROD_TEMPLATE = """<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>__NAME__ | Le Jellaba</title>
<meta name="description" content="Achetez __NAME__. Artisanat marocain de qualité. Prix : __PRICE__ MAD. Livraison au Maroc.">
<meta name="robots" content="index, follow">
<link rel="canonical" href="https://lejellaba.ma/produits/__SLUG__/">
<meta property="og:type" content="product">
<meta property="og:title" content="__NAME__">
<meta property="og:url" content="https://lejellaba.ma/produits/__SLUG__/">
<meta property="og:image" content="https://lejellaba.ma__IMAGE__">
<meta property="og:locale" content="fr_MA">
<meta property="product:price:amount" content="__PRICE__">
<meta property="product:price:currency" content="MAD">
<meta property="product:availability" content="in stock">
<link rel="icon" type="image/png" href="/assets/favicon.png">
<link rel="stylesheet" href="/assets/style.css">
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Product",
  "name": "__NAME__",
  "description": "__NAME__ - vêtement traditionnel marocain de haute qualité",
  "image": ["https://lejellaba.ma__IMAGE__"],
  "brand": {"@type": "Brand", "name": "Le Jellaba"},
  "sku": "__SLUG__",
  "offers": {
    "@type": "Offer",
    "priceCurrency": "MAD",
    "price": "__PRICE__",
    "url": "https://lejellaba.ma/produits/__SLUG__/",
    "availability": "https://schema.org/InStock",
    "seller": {"@type": "Organization", "name": "Le Jellaba"}
  }
}
</script>
</head>
<body>
<script src="/assets/header.js" defer></script>
<div class="announce">Livraison gratuite partout au Maroc · Artisanat authentique</div>

<nav class="breadcrumb" style="max-width:1100px;margin:12px auto;padding:0 20px;font-size:12px;color:#9ca3af">
  <a href="/" style="color:#6b7280;text-decoration:none">Accueil</a> ›
  <a href="/categorie/__CAT_ID__/" style="color:#6b7280;text-decoration:none">__CAT_NAME__</a> ›
  <span style="color:#1a1a1a">__NAME__</span>
</nav>

<div class="p-hero">
  <div class="p-gallery">
    <img src="__IMAGE__" alt="__NAME__" loading="eager" width="600" height="600">
  </div>
  <div class="p-info">
    <div class="p-badge">✅ En stock · Expédition 3–5 jours</div>
    <h1 class="p-title">__NAME__</h1>
    <p class="p-subtitle">Qualité supérieure · Fabrication Maroc</p>
    <div class="p-price">__PRICE__ MAD</div>
    
    <div class="p-options" style="margin-top: 20px;">
        <label>Taille :</label>
        <select id="size-select" style="padding: 8px; width: 100%; margin-bottom: 10px; border: 1px solid #ccc; border-radius: 4px;">
            <option value="S">S</option>
            <option value="M">M</option>
            <option value="L">L</option>
            <option value="XL">XL</option>
            <option value="XXL">XXL</option>
        </select>
        <label>Couleur :</label>
        <select id="color-select" style="padding: 8px; width: 100%; margin-bottom: 20px; border: 1px solid #ccc; border-radius: 4px;">
            <option value="Bleu Nuit">Bleu Nuit</option>
            <option value="Noir">Noir</option>
            <option value="Bordeaux">Bordeaux</option>
            <option value="Vert Bouteille">Vert Bouteille</option>
            <option value="Beige">Beige</option>
        </select>
    </div>

    <button class="btn-wa" onclick="addToCart('__SLUG__', '__NAME__', __PRICE__, '__IMAGE__')" style="width:100%; border:none; cursor:pointer;">
      🛒 Ajouter au panier
    </button>
  </div>
</div>

<script src="/assets/footer.js" defer></script>
<script>
function addToCart(id, name, price, image) {
    const size = document.getElementById('size-select').value;
    const color = document.getElementById('color-select').value;
    
    let cart = JSON.parse(localStorage.getItem('nova_style_cart')) || [];
    let options = { Taille: size, Couleur: color };
    let key = id + "_" + JSON.stringify(options);
    
    let existing = cart.find(i => i.key === key);
    if (existing) {
        existing.quantity += 1;
    } else {
        cart.push({
            key: key,
            id: id,
            name: name,
            price: price,
            image: image,
            options: options,
            quantity: 1,
            timestamp: Date.now()
        });
    }
    
    localStorage.setItem('nova_style_cart', JSON.stringify(cart));
    
    // Redirect to cart
    window.location.href = "/cart.html";
}
</script>
</body>
</html>"""

def generate_product_card(prod):
    return f'''<a class="product-card" href="/produits/{prod['slug']}/">
  <div class="card-img"><img src="{prod['image']}" alt="{prod['name']}" loading="lazy" width="400" height="400"></div>
  <div class="card-info">
    <div class="card-name">{prod['name']}</div>
    <div class="card-price">À partir de {prod['price']['min']} MAD</div>
  </div>
</a>'''

for cat in categories:
    cat_id = cat['id']
    cat_name = cat['name']
    
    cat_dir = f'categorie/{cat_id}'
    os.makedirs(cat_dir, exist_ok=True)
    
    cat_products = [p for p in products if p['categoryId'] == cat_id]
    product_cards = "\n".join([generate_product_card(p) for p in cat_products])
    
    cat_html = CAT_TEMPLATE.replace("__CAT_ID__", str(cat_id)).replace("__CAT_NAME__", str(cat_name)).replace("__COUNT__", str(len(cat_products))).replace("__PRODUCT_CARDS__", str(product_cards))
    
    with open(f'{cat_dir}/index.html', 'w', encoding='utf-8') as f:
        f.write(cat_html)

for prod in products:
    slug = prod['slug']
    
    prod_dir = f'produits/{slug}'
    os.makedirs(prod_dir, exist_ok=True)
    
    prod_html = PROD_TEMPLATE.replace("__SLUG__", str(slug)).replace("__NAME__", str(prod['name'])).replace("__PRICE__", str(prod['price']['min'])).replace("__IMAGE__", str(prod['image'])).replace("__CAT_ID__", str(prod['categoryId'])).replace("__CAT_NAME__", str(prod['category']))
    
    with open(f'{prod_dir}/index.html', 'w', encoding='utf-8') as f:
        f.write(prod_html)

print("Generation complete")
