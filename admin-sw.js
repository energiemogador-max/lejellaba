/**
 * Nova Style Admin — Service Worker v2
 * Background Firebase polling → push notifications for new orders
 */
const CACHE    = 'nova-admin-v2';
const DB_REST  = 'https://nova-9ac76-default-rtdb.europe-west1.firebasedatabase.app';
const POLL_MS  = 55000; // poll every 55s (safe for mobile battery)

const OFFLINE_ASSETS = ['/admin.html', '/admin-manifest.json', '/assets/favicon.png'];

// ── Install ──────────────────────────────────────────────
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE)
      .then(c => c.addAll(OFFLINE_ASSETS))
      .then(() => self.skipWaiting())
  );
});

// ── Activate ─────────────────────────────────────────────
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
  // Start background polling
  startPolling();
});

// ── Fetch (cache-first for static) ───────────────────────
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  const url = new URL(e.request.url);

  // ONLY intercept requests for the admin page itself and its critical assets
  // This keeps the service worker completely safe and prevents it from intercepting or breaking other pages.
  if (!url.pathname.includes('admin') && !url.pathname.includes('assets/favicon')) return;

  if (url.hostname.includes('firebase') || url.hostname.includes('github') || url.hostname.includes('googleapis')) return;

  e.respondWith(
    caches.match(e.request).then(cached => {
      // Try network first, fall back to cache if offline
      return fetch(e.request).then(res => {
        if (res.ok && res.type === 'basic') {
          const resClone = res.clone();
          caches.open(CACHE).then(c => c.put(e.request, resClone));
        }
        return res;
      }).catch(() => {
        // If offline and we have a cached version, return it.
        // Otherwise, let the fetch fail naturally rather than forcing a crash.
        return cached || fetch(e.request);
      });
    })
  );
});

// ── Message from app (sync last seen timestamp) ──────────
let lastKnownTs = 0;
self.addEventListener('message', e => {
  if (e.data?.type === 'ORDER_TS') {
    lastKnownTs = e.data.ts || 0;
  }
  if (e.data?.type === 'PING') {
    e.source?.postMessage({ type: 'PONG' });
  }
});

// ── Background polling ────────────────────────────────────
let pollTimer = null;

function startPolling() {
  if (pollTimer) return;
  pollTimer = setInterval(checkNewOrders, POLL_MS);
  // First check after 10s
  setTimeout(checkNewOrders, 10000);
}

async function checkNewOrders() {
  // Only notify if no focused admin tab
  const clients = await self.clients.matchAll({ type: 'window', includeUncontrolled: true });
  const adminFocused = clients.some(c => c.url.includes('admin') && c.focused);
  if (adminFocused) return; // app is open and focused — it handles its own notifications

  try {
    // Fetch latest 5 orders, ordered by timestamp desc
    const res = await fetch(
      `${DB_REST}/orders.json?orderBy="timestamp"&limitToLast=1`,
      { cache: 'no-store' }
    );
    if (!res.ok) return;
    const data = await res.json();
    if (!data) return;

    const entries = Object.entries(data);
    if (!entries.length) return;

    const [id, order] = entries[0];
    const ts = order.timestamp || 0;

    // First run — just store the timestamp, don't notify
    if (lastKnownTs === 0) {
      lastKnownTs = ts;
      return;
    }

    // New order detected
    if (ts > lastKnownTs) {
      lastKnownTs = ts;
      const name  = order?.customer?.name  || 'Nouveau client';
      const phone = order?.customer?.phone || '';
      const total = order?.total ? order.total.toLocaleString('fr-MA') + ' MAD' : '';
      const items = (order?.items || []).slice(0, 2).map(i => i.name).join(', ');

      await self.registration.showNotification('🛒 Nouvelle commande — Nova Style', {
        body: [
          name + (phone ? ' · ' + phone : ''),
          total ? '💰 ' + total : '',
          items ? '📦 ' + items : ''
        ].filter(Boolean).join('\n'),
        icon:             '/assets/favicon.png',
        badge:            '/assets/favicon.png',
        tag:              'nova-order-' + id,
        requireInteraction: true,
        vibrate:          [300, 100, 300, 100, 300],
        renotify:         true,
        data:             { url: '/admin.html#orders', orderId: id }
      });

      // Wake up any admin tabs
      clients.forEach(c => {
        if (c.url.includes('admin')) {
          c.postMessage({ type: 'NEW_ORDER', order, id });
        }
      });
    }
  } catch (e) {
    // Silent fail — no network or Firebase error
  }
}

// ── Notification click → open/focus admin ────────────────
self.addEventListener('notificationclick', e => {
  e.notification.close();
  const targetUrl = e.notification.data?.url || '/admin.html';
  e.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then(clients => {
      // Focus existing admin tab if open
      const admin = clients.find(c => c.url.includes('admin'));
      if (admin) {
        admin.focus();
        admin.postMessage({ type: 'GOTO_ORDERS' });
        return;
      }
      // Open new tab
      return self.clients.openWindow(targetUrl);
    })
  );
});
