# Nova Style — Documentation Technique

> **Site web :** [novastyle.ma](https://novastyle.ma)  
> **Dépôt GitHub :** [energiemogador-max/novastyle](https://github.com/energiemogador-max/novastyle)  
> **Hébergement :** GitHub Pages (déploiement automatique sur push `main`)

---

## Vue d'ensemble

Nova Style est un site e-commerce marocain spécialisé dans les **miroirs de salle de bain LED sur mesure**, les miroirs de salon, les douches italiennes et les tables de séjour. Fabriqué à Casablanca, livraison partout au Maroc.

Le site est une **application web statique** (HTML/CSS/JS pur) sans backend, sans framework front-end et sans serveur. Toute la persistance passe par **Firebase Realtime Database** et **localStorage**.

---

## Architecture

```
Static Frontend (GitHub Pages)
       │
       ├── Firebase Realtime Database   → Commandes, avis, visiteurs, paramètres
       ├── Firebase Auth                → Authentification admin
       ├── EmailJS                      → Emails de confirmation commande
       └── localStorage                 → Panier client (côté navigateur)
```

### Pourquoi statique ?

- Zéro coût serveur
- Déploiement instantané via GitHub Pages
- Performance maximale (pas de SSR, pas de Node.js)
- L'admin met à jour le contenu via GitHub API directement depuis le navigateur

---

## Structure des fichiers

```
novastyle-main/
│
├── index.html                    # Homepage
├── cart.html                     # Panier & formulaire de commande
├── admin.html                    # Panel d'administration (auth requise)
├── confirmation.html             # Page de confirmation commande
├── 404.html                      # Page 404 avec redirections JS
│
├── products-index.json           # Index de tous les produits (source unique)
│
├── assets/
│   ├── style.css                 # CSS global du site
│   ├── header.js                 # Navigation (injecté sur toutes les pages)
│   ├── footer.js                 # Footer + numéro de téléphone dynamique
│   ├── home-loader.js            # Chargement des collections sur la homepage
│   ├── product-loader.js         # Fiche produit (variants, prix, galerie)
│   ├── product-page-enhancer.js  # Améliorations UX fiche produit
│   ├── cart.js                   # Logique panier + soumission commande Firebase
│   ├── category-loader.js        # Chargement produits pages catégories
│   ├── visitor-tracker.js        # Analytics visiteurs (Firebase)
│   ├── reviews-widget.js         # Widget avis clients
│   ├── home-reviews-widget.js    # Avis sur la homepage
│   ├── firebase-config.js        # Configuration Firebase (partagée)
│   ├── product-utils.js          # Utilitaires produits
│   └── ads-loader.js             # Chargement publicités (configurables)
│
├── products/                     # Données JSON par produit
│   └── {slug}.json               # Variantes, prix, axes, description
│
├── images/                       # Images produits (.webp)
│   └── {slug}/1.webp, 2.webp…
│
├── produits/                     # Pages HTML des fiches produits
│   └── {slug}/index.html
│
├── categorie/                    # Pages catégories
│   ├── sdb-premium/index.html
│   ├── sdb-essentiel/index.html
│   ├── salon/index.html
│   ├── consoles/index.html
│   ├── tables/index.html
│   └── douches/index.html
│
├── collections/
│   └── miroir-de-salle-de-bain-retroeclaire-led/index.html
│
├── blog/                         # 27 articles de blog
│   ├── index.html
│   └── {slug}/index.html
│
├── miroir-salle-de-bain-{ville}/ # 14 pages villes (SEO local)
│   └── index.html
│
├── _redirects                    # Redirections Netlify/Cloudflare
└── _headers                      # Headers HTTP
```

---

## Catalogue produits

### Source unique de vérité : `products-index.json`

Tous les chargements de produits (homepage, catégories, panier) lisent depuis `products-index.json`. Ne jamais modifier les pages HTML pour changer les produits — tout passe par ce fichier et les JSONs dans `products/`.

### Catégories (77 produits total)

| Catégorie | ID | Produits |
|-----------|-----|----------|
| Miroirs Salle de Bain Premium | `sdb-premium` | 47 |
| Miroirs Salon & Dressing | `salon` | 18 |
| Tables de Séjour | `tables` | 4 |
| Consoles & Miroirs | `consoles` | 3 |
| Douches Italiennes | `douches` | 2 |
| Miroirs SDB Essentiels | `sdb-essentiel` | 3 |

### Structure d'un produit JSON (`products/{slug}.json`)

```json
{
  "name": "Nova Style : Miroir ÉMERAUDE",
  "description": "Description HTML...",
  "images": ["/images/nova-style-miroir-emeraude/1.webp"],
  "axes": {
    "order": ["Dimension", "LED", "Installation"],
    "options": {
      "Dimension": ["50 cm x 51 cm", "60 cm x 61 cm"],
      "LED": ["Sans LED", "6000K Blanc pur", "4000K", "3000K", "2000K"],
      "Installation": ["Sans Installation", "Avec Installation"]
    }
  },
  "variants": [
    { "axes": { "Dimension": "50 cm x 51 cm", "LED": "Sans LED", "Installation": "Sans Installation" }, "price": 450.0, "sku": "" }
  ],
  "seo": {
    "title": "...",
    "description": "..."
  }
}
```

### Ajouter un nouveau produit

1. Créer `products/{slug}.json` avec la structure ci-dessus
2. Ajouter l'entrée dans `products-index.json`
3. Créer `produits/{slug}/index.html` (copier un existant, changer le slug)
4. Uploader les images dans `images/{slug}/`
5. Pusher sur `main` → déploiement automatique

---

## Panier & Commandes

### Fonctionnement côté client

```
Client sélectionne variante → addToCart() → localStorage
Client va sur /cart.html    → renderCart() lit localStorage
Client remplit formulaire   → submitOrder() → Firebase "orders/"
                            → EmailJS envoie email confirmation
                            → Redirection /confirmation.html
```

### Structure d'une commande dans Firebase

```json
{
  "orders": {
    "-OrderId": {
      "timestamp": 1234567890,
      "status": "pending",
      "source": "web | admin",
      "customer": {
        "name": "...",
        "phone": "...",
        "city": "...",
        "address": "..."
      },
      "items": [
        {
          "name": "Miroir ÉMERAUDE",
          "variant": "80x80 · 6000K · Sans Installation",
          "price": 700,
          "quantity": 1,
          "remise": 0,
          "lineTotal": 700
        }
      ],
      "subtotal": 700,
      "globalRemise": 0,
      "total": 700
    }
  }
}
```

### Statuts des commandes

| Statut | Description |
|--------|-------------|
| `pending` | En attente de confirmation |
| `confirmed` | Confirmée par l'équipe |
| `delivered` | Livrée au client |
| `cancelled` | Annulée |

---

## Panel d'Administration (`/admin.html`)

### Accès
- URL : `https://novastyle.ma/admin.html`
- Authentification Firebase Auth (email/mot de passe)
- Session persistante (`browserLocalPersistence`) — pas besoin de se reconnecter

### Sections

| Onglet | Fonctionnalité |
|--------|---------------|
| **Accueil** | KPIs temps réel, visiteurs en ligne, commandes récentes, sparkline 30j |
| **Commandes** | Liste filtrée (Toutes / En attente / Confirmée / Livrée / Annulée), création, édition, statut |
| **Visiteurs** | Analytics en temps réel : pages, sources, appareils, villes, historique sessions |
| **Produits** | Catalogue (lecture seule — modification via JSON) |
| **Nouveau produit** | Draft produit avec upload images, variantes, description |
| **Avis** | Modération des avis clients (approuver / rejeter) |
| **Publicités** | Configuration des bannières et promotions |
| **Paramètres** | Informations boutique, numéro de téléphone, horaires, réseaux sociaux → push GitHub auto |

### Créer/modifier une commande depuis l'admin

1. Onglet **Commandes** → **➕ Créer commande**
2. Remplir client (nom, téléphone, ville)
3. Ajouter des articles :
   - **📦 Catalogue** — sélectionner un produit existant + variante
   - **✏️ Personnalisé** — entrer nom, variante et prix manuellement
4. Appliquer remises si besoin (par ligne ou globale)
5. **Confirmer la commande** → sauvegarde dans Firebase

### Mise à jour du numéro de téléphone

**Paramètres** → modifier les champs WhatsApp/Téléphone → **Appliquer au site** :
- Reconstruit `footer.js` et `header.js` avec le nouveau numéro
- Met à jour tous les fichiers HTML du repo via GitHub Tree API (commit unique)
- GitHub Pages redéploie en 1–2 minutes

---

## Analytics visiteurs

Chaque visiteur est tracké via `visitor-tracker.js` :

```
Visiteur arrive → session créée dans Firebase "visitors/{sessionId}"
                → géolocalisation IP (ipapi.co)
                → device/browser détecté
                → pages visitées enregistrées
                → durée calculée

Admin → onglet Visiteurs → données en temps réel (onValue listener)
```

**Données collectées :** page visitée, ville, pays, appareil, navigateur, source de trafic (referrer), durée de session, activité panier.

---

## SEO

### Structure
- **Titre H1** sur toutes les pages (y compris homepage)
- **Meta description** < 160 chars sur chaque page
- **Schema.org** : Product, BreadcrumbList, FAQPage, Organization, LocalBusiness, CollectionPage
- **Canonical tags** sur toutes les pages
- **Fonts** : Cormorant Garamond (titres) + DM Sans (UI)

### Pages locales SEO
14 pages villes : Casablanca, Rabat, Marrakech, Tanger, Fès, Agadir, Meknès, Kénitra, El Jadida, Tétouan, Mohammedia, Rabat, Oujda, Bouskoura

### Blog (27 articles)
Articles ciblant les mots-clés principaux :
- `miroir led maroc`, `miroir maroc`, `miroir salle de bain maroc`
- `prix miroir maroc`, `miroir anti-buée`, `miroir sur mesure casablanca`
- Liens internes entre articles et pages catégories

### Redirections
`_redirects` contient toutes les redirections 301 des anciennes URLs Shopify vers les nouvelles URLs statiques.

---

## Déploiement

```bash
# Tout changement pushé sur main déclenche GitHub Pages
git add .
git commit -m "description"
git push origin main
# → Site en ligne en 1–2 minutes
```

### Mise à jour depuis l'admin
L'admin utilise l'**API GitHub** pour pousser des modifications sans passer par git :
- Paramètres boutique → reconstruit `footer.js` + `header.js`
- Numéro de téléphone → met à jour tous les HTML via GitHub Tree API

---

## Variables & constantes importantes

| Fichier | Constante | Valeur |
|---------|-----------|--------|
| `admin.html` | `REPO` | `energiemogador-max/novastyle` |
| `admin.html` | `GH_BRANCH` | `main` |
| `cart.js` | Clé localStorage | `nova_style_cart` |
| `visitor-tracker.js` | Node Firebase | `visitors/` + `sessions/` |
| `footer.js` | Téléphone | Configurable depuis admin |

---

## Dépendances externes

| Service | Usage |
|---------|-------|
| Firebase Realtime Database | Commandes, avis, visiteurs, paramètres |
| Firebase Auth | Login admin |
| EmailJS | Emails confirmation commande |
| GitHub API | Mise à jour contenu depuis admin |
| Google Fonts | Cormorant Garamond + DM Sans |
| ipapi.co | Géolocalisation visiteurs |
| GitHub Pages | Hébergement statique gratuit |

---

## Contacts & Téléphone

Le numéro de téléphone est centralisé — **ne jamais le changer manuellement dans les fichiers HTML**. Utiliser **Admin → Paramètres → Appliquer au site** qui met à jour tout automatiquement.

- WhatsApp : `wa.me/212709344943`
- Tel : `+212 7 09 34 49 43`
- Atelier : Bd Oued Sebou, Casablanca

---

*Documentation générée le 10 mai 2026*
