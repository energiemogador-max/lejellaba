import { firebaseConfig } from './firebase-config.js';

const DB_URL = firebaseConfig.databaseURL;
const CACHE_KEY = 'ns_card_reviews_cache';
const CACHE_TTL = 24 * 60 * 60 * 1000; // 24 hours cache

class CardReviewsInjector {
  constructor() {
    this.cache = this._loadCache();
    this.shallowKeys = null;
    
    // Automatically observe the document for new product cards
    this.observer = new MutationObserver(() => this.processPlaceholders());
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.init());
    } else {
      this.init();
    }
  }

  init() {
    this.processPlaceholders();
    this.observer.observe(document.body, { childList: true, subtree: true });
  }

  _loadCache() {
    try {
      const c = JSON.parse(localStorage.getItem(CACHE_KEY) || '{"ts":0, "data":{}}');
      if (Date.now() - c.ts > CACHE_TTL) return { ts: Date.now(), data: {} };
      return c;
    } catch {
      return { ts: Date.now(), data: {} };
    }
  }

  _saveCache() {
    try { localStorage.setItem(CACHE_KEY, JSON.stringify(this.cache)); } catch {}
  }

  async _ensureShallowKeys() {
    if (this.shallowKeys !== null) return;
    try {
      const res = await fetch(`${DB_URL}/reviews.json?shallow=true`);
      if (res.ok) this.shallowKeys = await res.json() || {};
      else this.shallowKeys = {};
    } catch {
      this.shallowKeys = {};
    }
  }

  async fetchProductStats(safeId) {
    if (this.cache.data[safeId]) return this.cache.data[safeId];
    
    await this._ensureShallowKeys();
    
    // If the product doesn't exist in the reviews database, save an empty stat
    if (!this.shallowKeys[safeId]) {
      const stats = { count: 0, rating: 0 };
      this.cache.data[safeId] = stats;
      this._saveCache();
      return stats;
    }

    try {
      const res = await fetch(`${DB_URL}/reviews/${safeId}.json`);
      if (!res.ok) throw new Error();
      const reviews = await res.json();
      
      let totalRating = 0;
      let count = 0;
      if (reviews && typeof reviews === 'object') {
        for (const rv of Object.values(reviews)) {
          if (rv && typeof rv === 'object' && rv.approved !== false && Number(rv.rating)) {
            totalRating += Number(rv.rating);
            count++;
          }
        }
      }
      
      const stats = { count, rating: count > 0 ? (totalRating / count).toFixed(1) : 0 };
      this.cache.data[safeId] = stats;
      this._saveCache();
      return stats;
    } catch {
      return { count: 0, rating: 0 };
    }
  }

  renderStars(rating) {
    const num = Math.round(Number(rating));
    return Array.from({ length: 5 }, (_, i) =>
      `<span style="color:${i < num ? '#ffb400' : '#e0e0e0'}; font-size:12px; line-height:1; user-select:none;">★</span>`
    ).join('');
  }

  processPlaceholders() {
    const placeholders = document.querySelectorAll('.card-reviews-placeholder:not(.processing)');
    if (!placeholders.length) return;

    for (const el of placeholders) {
      el.classList.add('processing');
      const safeId = el.dataset.productId;
      if (!safeId) continue;
      
      this.fetchProductStats(safeId).then(stats => {
        if (stats.count > 0) {
          el.innerHTML = `
            <div class="card-reviews">
              <div class="stars-visual">${this.renderStars(stats.rating)}</div>
              <span class="review-count">(${stats.count})</span>
            </div>
          `;
        }
        el.classList.add('loaded');
      });
    }
  }
}

// Global initialization
new CardReviewsInjector();
