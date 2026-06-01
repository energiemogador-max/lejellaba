/**
 * footer.js — Nova Style shared footer
 * PERF: DOM insertion only (no document.write) — safe to load with defer
 * TO UPDATE: edit ONLY this file. All pages update automatically.
 */
(function () {
  var YEAR = new Date().getFullYear();  var CATS = [
    { href: "/categorie/jellaba-femme/",   label: "Jellaba Femme" },
    { href: "/categorie/jellaba-homme/",   label: "Jellaba Homme" },
    { href: "/categorie/gandoura-femme/", label: "Gandoura Femme" },
    { href: "/categorie/gandoura-homme/", label: "Gandoura Homme" },
    { href: "/categorie/jellaba-enfant/",  label: "Jellaba Enfant" },
    { href: "/categorie/accessoires/",     label: "Accessoires" },
  ];

  var SEO_PAGES = [
    { href: "/categorie/jellaba-femme/",   label: "Jellaba Femme Chic" },
    { href: "/categorie/jellaba-homme/",   label: "Jellaba Homme Moderne" },
    { href: "/categorie/gandoura-femme/", label: "Gandoura Femme Élégante" },
    { href: "/categorie/gandoura-homme/", label: "Gandoura Homme Traditionnelle" },
    { href: "/categorie/jellaba-enfant/",  label: "Jellaba Enfant" },
    { href: "/categorie/accessoires/",     label: "Babouches & Accessoires" },
  ];

  var CITIES = [
    { href: "#",  label: "Casablanca" },
    { href: "#",  label: "Rabat" },
    { href: "#",  label: "Marrakech" },
    { href: "#",  label: "Tanger" },
    { href: "#",  label: "Fès" },
    { href: "#",  label: "Agadir" },
    { href: "#",  label: "Meknès" },
    { href: "#",  label: "Oujda" },
    { href: "#",  label: "Kénitra" },
    { href: "#",  label: "El Jadida" },
    { href: "#",  label: "Tétouan" },
    { href: "#",  label: "Mohammedia" },
  ];

  var catLinks  = CATS.map(function(l){ return '<a href="' + l.href + '">' + l.label + '</a>'; }).join("\n      ");
  var seoLinks  = SEO_PAGES.map(function(l){ return '<a href="' + l.href + '">' + l.label + '</a>'; }).join("\n      ");
  var cityLinks = CITIES.map(function(l){ return '<a href="' + l.href + '">' + l.label + '</a>'; }).join(" · \n      ");

  var html = '<footer class="site-footer" dir="ltr">\n' +
'  <div class="foot-grid">\n' +
'    <div>\n' +
'      <div class="foot-brand">Le Jellaba</div>\n' +
'      <div class="foot-tag">L\'élégance de l\'artisanat marocain</div>\n' +
'      <p>Boutique de référence pour Jellabas et Gandouras de haute qualité au Maroc. Tissus nobles, coutures raffinées réalisées par des maîtres artisans. Livraison express sécurisée partout au Maroc.</p>\n' +
'      <p style="margin-top:10px"><a href="tel:+212709344943">📞 <span class="dyn-phone">notre service client</span></a> · <a href="https://wa.me/212709344943" class="dyn-wa-link" target="_blank" rel="noopener">💬 WhatsApp</a></p>\n' +
'      <p style="margin-top:6px;font-size:12px;color:var(--muted,#888)">Showroom & Atelier : Bd Oued Sebou, Rue 13 N°24, 20000 Casablanca, Maroc<br>Lun–Sam · 09h00–18h00</p>\n' +
'    </div>\n' +
'    <div><strong>Catégories</strong>\n      ' + catLinks + '\n    </div>\n' +
'    <div><strong>Guides & SEO</strong>\n      ' + seoLinks + '\n    </div>\n' +
'    <div><strong>Villes desservies</strong>\n      <div class="cities-inline">' + cityLinks + '</div>\n    </div>\n' +
'  </div>\n' +
'  <div class="geo-seo-block" style="margin-top:40px;padding-top:20px;border-top:1px solid rgba(0,0,0,0.05);font-size:12px;color:#666;line-height:1.5;">\n' +
'    <strong>À propos de Le Jellaba :</strong> Boutique spécialisée dans la <strong>Jellaba marocaine</strong> haut de gamme pour femme, homme et enfant. Nous proposons un large choix de <strong>gandouras traditionnelles</strong> et d\'accessoires fabriqués de manière artisanale à Casablanca. Nos créations sur mesure allient design contemporain et savoir-faire traditionnel marocain.\n' +
'  </div>\n' +
'  <div class="foot-legal">© ' + YEAR + ' Le Jellaba · Fabrication à Casablanca, Maroc · Livraison nationale</div>\n' +
'</footer>\n' +
'<script type="application/ld+json">\n' +
'{\n' +
'  "@context": "https://schema.org",\n' +
'  "@type": ["LocalBusiness", "Organization", "Manufacturer"],\n' +
'  "@id": "https://lejellaba.ma/#organization",\n' +
'  "name": "Le Jellaba",\n' +
'  "description": "Boutique de vêtements traditionnels marocains spécialisée dans les jellabas et gandouras haut de gamme.",\n' +
'  "url": "https://lejellaba.ma",\n' +
'  "telephone": "+212709344943",\n' +
'  "image": "https://lejellaba.ma/logo.png",\n' +
'  "logo": "https://lejellaba.ma/logo.png",\n' +
'  "sameAs": ["https://wa.me/212709344943"],\n' +
'  "address": {"@type":"PostalAddress","streetAddress":"Bd Oued Sebou, Rue 13 N°24","addressLocality":"Casablanca","addressRegion":"Grand Casablanca-Settat","postalCode":"20000","addressCountry":"MA"},\n' +
'  "geo": {"@type":"GeoCoordinates","latitude":"33.5731","longitude":"-7.5898"},\n' +
'  "openingHoursSpecification": [{"@type":"OpeningHoursSpecification","dayOfWeek":["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],"opens":"09:00","closes":"18:00"}],\n' +
'  "priceRange": "300 - 3000 MAD",\n' +
'  "currenciesAccepted": "MAD",\n' +
'  "paymentAccepted": "Cash, Virement bancaire",\n' +
'  "areaServed": {"@type":"Country","name":"Maroc"},\n' +
'  "knowsAbout": ["Jellaba femme","Jellaba homme","Gandoura femme","Gandoura homme","Vêtements traditionnels marocains","Artisanat Marocain"]\n' +
'}\n' +
'<\/script>\n' +
'<script type="module" src="/assets/card-reviews-injector.js"></script>\n' +
'<script src="/assets/contact.js"></script>';

  function inject() {
    var frag = document.createRange().createContextualFragment(html);
    document.body.appendChild(frag);
  }

  function fixCardImages() {
    document.querySelectorAll('.card-img img').forEach(function (img) {
      var src = img.getAttribute('src');
      if (src && src.startsWith('/images/') && src.indexOf('wsrv.nl') === -1) {
        // encodeURI is required for Arabic/special characters in URLs
        img.setAttribute('src', 'https://wsrv.nl/?url=lejellaba.ma' + encodeURI(src) + '&w=400&h=400&fit=cover&output=webp&q=80');
      }
      
      function markReady() {
        img.classList.add('img-ready');
        var wrap = img.closest('.card-img');
        if (wrap) wrap.classList.add('img-ready');
      }
      if (img.complete && img.naturalWidth > 0) { markReady(); }
      else {
        img.addEventListener('load', markReady);
        img.addEventListener('error', markReady);
      }
    });
  }

  function initAOS() {
    if (document.getElementById('aos-css')) return;
    var css = document.createElement('link');
    css.id = 'aos-css';
    css.rel = 'stylesheet';
    css.href = 'https://unpkg.com/aos@2.3.1/dist/aos.css';
    document.head.appendChild(css);

    var script = document.createElement('script');
    script.src = 'https://unpkg.com/aos@2.3.1/dist/aos.js';
    script.onload = function() {
      // Dynamically add data-aos to key structural elements across the entire site
      var selectors = [
        '.product-card:not([data-aos])',
        '.blog-card:not([data-aos])',
        '.blog-featured:not([data-aos])',
        'section:not([data-aos])',
        '.hub-hero:not([data-aos])',
        '.seo-content:not([data-aos])',
        '.blog-page-hero:not([data-aos])'
      ];
      document.querySelectorAll(selectors.join(',')).forEach(function(el) {
        el.setAttribute('data-aos', 'fade-up');
      });

      if (window.AOS) {
        window.AOS.init({
          once: true,       // whether animation should happen only once - while scrolling down
          offset: 0,        // trigger animation immediately when element hits bottom of viewport
          duration: 450,    // much snappier duration so the page doesn't feel empty
          easing: 'ease-out-cubic', // default easing for AOS animations
        });
      }
    };
    document.body.appendChild(script);
  }

  function initLenis() {
    var script = document.createElement('script');
    script.src = 'https://unpkg.com/lenis@1.1.9/dist/lenis.min.js';
    script.onload = function() {
      if (window.Lenis) {
        var lenis = new window.Lenis({
          duration: 1.2,
          easing: function(t) { return Math.min(1, 1.001 - Math.pow(2, -10 * t)); },
          smoothWheel: true
        });
        function raf(time) {
          lenis.raf(time);
          requestAnimationFrame(raf);
        }
        requestAnimationFrame(raf);
      }
    };
    document.head.appendChild(script);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", function () { inject(); fixCardImages(); initAOS(); initLenis(); });
  } else {
    inject();
    fixCardImages();
    initAOS();
    initLenis();
  }
})();
