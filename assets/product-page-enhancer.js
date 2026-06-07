/**
 * product-page-enhancer.js — Impeccable edition
 * Applied to all product pages. Uses only design system tokens (var(--*)).
 * 1. Upgrade add-to-cart button style
 * 2. Trust micro-strip (guaranteed, delivery, AGC)
 * 3. Sticky WA floating button on mobile
 * 4. Gallery fade-in handler
 */
(function () {
  if (!document.querySelector('.product-info, .product-page')) return;

  const css = `
  /* ── Add to cart button ── */
  #add-to-cart-btn {
    width: 100%;
    font-size: 1rem !important;
    font-weight: 700 !important;
    padding: 15px 24px !important;
    border-radius: var(--radius-pill) !important;
    letter-spacing: 0.01em;
    background: var(--brand) !important;
    color: var(--surface) !important;
    border: none !important;
    cursor: pointer;
    transition: opacity .15s, transform .1s !important;
    min-height: 52px !important;
  }
  #add-to-cart-btn:hover { opacity: .92; transform: translateY(-1px); }
  #add-to-cart-btn:active { transform: translateY(0); }

  /* ── Deposit hint ── */
  .ns-deposit-hint {
    font-size: 0.8125rem;
    color: var(--text-soft);
    margin: 8px 0 16px;
    background: var(--brand-dim);
    border: 1px solid oklch(38% 0.12 28 / 0.15);
    border-radius: var(--radius);
    padding: 9px 14px;
    line-height: 1.5;
  }
  .ns-deposit-hint strong { color: var(--brand); }

  /* ── Trust micro-strip ── */
  .ns-trust-micro {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin: 16px 0;
  }
  .ns-trust-pill {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    background: var(--surface-2);
    border: 1px solid var(--border);
    border-radius: var(--radius-pill);
    padding: 5px 10px;
    font-size: 0.6875rem;
    font-weight: 600;
    color: var(--text-soft);
    white-space: nowrap;
  }

  /* ── Gallery fade-in ── */
  .product-gallery img#main-img {
    opacity: 0;
    transition: opacity .25s ease-out;
    background: var(--surface-2);
    width: 100%;
    aspect-ratio: 1;
    object-fit: cover;
    border-radius: var(--radius-sm);
  }
  .product-gallery img#main-img.loaded { opacity: 1; }
  `;

  const style = document.createElement('style');
  style.textContent = css;
  document.head.appendChild(style);

  // ── Gallery ───────────────────────────────────────────────────────────────
  const mainImg = document.getElementById('main-img');
  if (mainImg) {
    function markLoaded() { mainImg.classList.add('loaded'); }
    if (mainImg.complete) markLoaded();
    else mainImg.addEventListener('load', markLoaded);

    // Thumb click
    document.querySelectorAll('.thumbs img').forEach(function(thumb) {
      thumb.style.display = '';
      thumb.addEventListener('click', function() {
        document.querySelectorAll('.thumbs img').forEach(t => t.classList.remove('active'));
        thumb.classList.add('active');
        mainImg.classList.remove('loaded');
        mainImg.src = thumb.src;
        mainImg.addEventListener('load', function onLoad() {
          mainImg.classList.add('loaded');
          mainImg.removeEventListener('load', onLoad);
        });
      });
      if (thumb.src === mainImg.src) thumb.classList.add('active');
    });

    // Show thumbs container
    const thumbsEl = document.querySelector('.thumbs');
    if (thumbsEl) thumbsEl.style.display = '';
  }

  // ── Trust micro-strip ─────────────────────────────────────────────────────
  const infoEl = document.querySelector('.product-info');
  if (infoEl) {
    const trust = document.createElement('div');
    trust.className = 'ns-trust-micro';
    trust.innerHTML = `
      <span class="ns-trust-pill">🇧🇪 Verre AGC Belgique</span>
      <span class="ns-trust-pill">💧 Anti-buée 3 ans</span>
      <span class="ns-trust-pill">🚚 Livraison gratuite</span>
      <span class="ns-trust-pill">🏭 Fabriqué à Casablanca</span>`;
    const priceEl = document.getElementById('current-price');
    if (priceEl) priceEl.after(trust);
    else infoEl.appendChild(trust);

    // Deposit hint
    const depositHint = document.createElement('div');
    depositHint.className = 'ns-deposit-hint';
    depositHint.innerHTML = '<strong>💡 Acompte 50%</strong> à la commande — solde à la livraison ou installation.';
    const ctaEl = document.querySelector('.p-cta');
    if (ctaEl) ctaEl.before(depositHint);
  }

  // Floating WA button removed



  // Hide when cart CTA is visible on screen
  if ('IntersectionObserver' in window) {
    const ctaEl = document.querySelector('.p-cta');
    if (ctaEl) {
      new IntersectionObserver(([entry]) => {
      }, { threshold: 0.5 }).observe(ctaEl);
    }
  }
})();

/* ── Product qty (merged from product-qty.js) ── */
/**
 * product-qty.js — Nova Style product page enhancements
 * ────────────────────────────────────────────────────────
 * Add ONE line to every product page, just before </body>:
 *   <script src="/lejellaba/assets/product-qty.js"></script>
 *
 * What it does (zero HTML changes needed in product pages):
 *   1. Injects a Quantité stepper (− / + input) above the add-to-cart button
 *   2. Price display shows: unit price × qty = TOTAL
 *   3. addProductToCart() uses the selected quantity
 *   4. Injects aggregateRating into the Product JSON-LD schema (Google SEO)
 */

(function () {
  "use strict";

  // ─── Wait for DOM + cart.js module to be ready ────────────────────────────
  document.addEventListener("DOMContentLoaded", function () {

    // ── 1. Inject quantity stepper ─────────────────────────────────────────
    const cta = document.querySelector(".p-cta");
    if (cta && !document.getElementById("qty-stepper")) {
      const stepperWrap = document.createElement("div");
      stepperWrap.className = "opt-group qty-group";
      stepperWrap.id = "qty-stepper";
      stepperWrap.innerHTML = `
        <div class="opt-label">
          <span>Quantité</span>
          <span id="qty-total-note" style="font-size:12px;color:var(--muted,#888);margin-left:8px;"></span>
        </div>
        <div style="display:flex;align-items:center;gap:0;border:1px solid var(--border,#ddd);border-radius:8px;overflow:hidden;width:fit-content;margin-top:6px;">
          <button type="button" id="qty-dec" aria-label="Diminuer"
            style="width:40px;height:40px;background:var(--bg-soft,#f5f5f5);border:none;font-size:20px;cursor:pointer;color:var(--text,#333);transition:background .15s;"
            onmouseenter="this.style.background='var(--accent,#e8194b)';this.style.color='#fff'"
            onmouseleave="this.style.background='var(--bg-soft,#f5f5f5)';this.style.color='var(--text,#333)'">−</button>
          <input type="number" id="qty-input" value="1" min="1" max="99"
            style="width:52px;height:40px;border:none;border-left:1px solid var(--border,#ddd);border-right:1px solid var(--border,#ddd);text-align:center;font-size:16px;font-weight:700;background:var(--bg,#fff);color:var(--text,#333);" readonly>
          <button type="button" id="qty-inc" aria-label="Augmenter"
            style="width:40px;height:40px;background:var(--bg-soft,#f5f5f5);border:none;font-size:20px;cursor:pointer;color:var(--text,#333);transition:background .15s;"
            onmouseenter="this.style.background='var(--accent,#e8194b)';this.style.color='#fff'"
            onmouseleave="this.style.background='var(--bg-soft,#f5f5f5)';this.style.color='var(--text,#333)'">+</button>
        </div>`;
      cta.parentNode.insertBefore(stepperWrap, cta);

      document.getElementById("qty-dec").addEventListener("click", () => changeQty(-1));
      document.getElementById("qty-inc").addEventListener("click", () => changeQty(+1));
      document.getElementById("qty-input").addEventListener("change", syncQtyNote);
    }

    // ── 2. Patch updateUI to show qty × unit = total ───────────────────────
    // Wait a tick so the product page's own script has run first
    setTimeout(patchUpdateUI, 0);

    // ── 3. Patch addProductToCart to use qty ──────────────────────────────
    setTimeout(patchAddToCart, 0);
  });

  // ─── Qty helpers ──────────────────────────────────────────────────────────
  function getQty() {
    const inp = document.getElementById("qty-input");
    return inp ? Math.max(1, Math.min(99, parseInt(inp.value) || 1)) : 1;
  }

  function changeQty(delta) {
    const inp = document.getElementById("qty-input");
    if (!inp) return;
    inp.value = Math.max(1, Math.min(99, getQty() + delta));
    syncQtyNote();
    // Re-run updateUI so price total refreshes
    if (typeof window.updateUI === "function") window.updateUI();
  }

  function syncQtyNote() {
    if (typeof window.updateUI === "function") window.updateUI();
  }

  // ─── Patch updateUI (defined in each product page) ───────────────────────
  function patchUpdateUI() {
    if (typeof window.updateUI !== "function") return;
    const originalUpdateUI = window.updateUI.bind(window);

    window.updateUI = function () {
      originalUpdateUI();

      // After original runs, update the price to show qty total
      const priceEl = document.getElementById("current-price");
      const noteEl  = document.getElementById("qty-total-note");
      if (!priceEl) return;

      const qty = getQty();
      if (qty <= 1) {
        if (noteEl) noteEl.textContent = "";
        return;
      }

      // Try to parse the current displayed unit price
      const unitText = priceEl.textContent.replace(/[^\d]/g, "");
      const unitPrice = parseInt(unitText);
      if (!unitPrice || isNaN(unitPrice)) return;

      const total = unitPrice * qty;
      const fmt = v => Math.round(v).toLocaleString("fr-FR") + " MAD";

      priceEl.innerHTML =
        `<span style="font-size:.85em;color:var(--muted,#888)">${fmt(unitPrice)} × ${qty}</span>` +
        `&nbsp;=&nbsp;${fmt(total)}`;

      if (noteEl) noteEl.textContent = `Total: ${fmt(total)}`;
    };
  }

  // ─── Patch addProductToCart ────────────────────────────────────────────────
  // Guard: if the product page's own addProductToCart already reads #qty-input
  // (indicated by the _qtyAware flag), we do NOT wrap it again — doing so would
  // multiply the quantity twice (once in the page script, once here).
  function patchAddToCart() {
    if (typeof window.addProductToCart !== "function") return;
    if (window.addProductToCart._qtyAware) return; // already qty-aware, skip

    const original = window.addProductToCart.bind(window);

    window.addProductToCart = function () {
      const qty = getQty();
      if (qty === 1) {
        original();
        return;
      }

      // Replicate the logic but with qty
      if (typeof window.findMatchingVariant !== "function") { original(); return; }
      const matching = window.findMatchingVariant();
      if (!matching) { alert("Veuillez sélectionner toutes les options"); return; }

      const PRODUCT   = window.PRODUCT;
      const SELECTION = window.SELECTION;
      if (!PRODUCT) { original(); return; }

      const product = { name: PRODUCT.title, price: matching.price };
      const productId = window.location.pathname.split("/").filter(p => p).pop() || "product";

      if (typeof window.addToCart === "function") {
        const cart     = window.getCart ? window.getCart() : [];
        const key      = productId + "_" + JSON.stringify(SELECTION || {});
        const existing = cart.find(i => i.key === key);

        if (existing) {
          existing.quantity = Math.min(99, (existing.quantity || 1) + qty);
          if (window.saveCart) window.saveCart(cart);
        } else {
          const item = {
            key, id: productId, name: product.name, price: product.price,
            options: SELECTION || null, quantity: qty, timestamp: Date.now()
          };
          cart.push(item);
          if (window.saveCart) window.saveCart(cart);
        }

        // Visual feedback
        const btn = document.getElementById("add-to-cart-btn");
        if (btn) {
          const orig = btn.textContent;
          btn.textContent = `✓ ${qty} article${qty > 1 ? "s" : ""} ajouté${qty > 1 ? "s" : ""}!`;
          btn.style.opacity = "0.7";
          setTimeout(() => { btn.textContent = orig; btn.style.opacity = "1"; }, 2200);
        }
        console.log(`✅ ${qty}× ${product.name} ajouté au panier`);
      } else {
        original();
      }
    };
    window.addProductToCart._qtyAware = true;
  }

  // aggregateRating injection removed — injecting fabricated ratings violates
  // Google's structured data guidelines and can cause manual penalties.
  // Real ratings should be populated server-side from actual review data.
})();
