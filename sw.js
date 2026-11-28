const CACHE_NAME = "bading-tambayan-shell-v4";
const APP_SHELL = ["./", "./index.html", "./manifest.webmanifest", "./app-icon.svg"];

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(APP_SHELL))
      .catch(() => {})
  );
  self.skipWaiting();
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys.filter(key => key.startsWith("bading-tambayan-shell-") && key !== CACHE_NAME)
        .map(key => caches.delete(key))
    )).then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", event => {
  const request = event.request;
  if (request.method !== "GET") return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  // Keep the latest page online-first; use its cached shell only when offline.
  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request).then(response => {
        if (response && response.ok) {
          const copy = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put("./index.html", copy));
        }
        return response;
      }).catch(() => caches.match("./index.html"))
    );
    return;
  }

  // Cache same-origin static assets only. Supabase and external services are untouched.
  if (/\.(?:css|js|svg|png|jpg|jpeg|webp|woff2?)$/i.test(url.pathname) ||
      url.pathname.endsWith("manifest.webmanifest")) {
    event.respondWith(
      caches.match(request).then(cached => {
        const network = fetch(request).then(response => {
          if (response && response.ok && response.type === "basic") {
            caches.open(CACHE_NAME).then(cache => cache.put(request, response.clone()));
          }
          return response;
        });
        return cached || network;
      })
    );
  }
});

self.addEventListener("push", event => {
  let payload = {};
  try {
    payload = event.data ? event.data.json() : {};
  } catch (_) {
    payload = { body: event.data?.text() || "You have a new chat message." };
  }

  const title = payload.title || "Bading Tambayan";
  const options = {
    body: payload.body || "You have a new message.",
    icon: "./app-icon.svg",
    badge: "./app-icon.svg",
    tag: payload.messageId ? "tambayan-message-" + payload.messageId : (payload.roomId ? "tambayan-room-" + payload.roomId : "tambayan-chat"),
    renotify: false,
    data: { roomId: payload.roomId || null, url: payload.url || "./" }
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener("notificationclick", event => {
  event.notification.close();

  const data = event.notification.data || {};
  const target = new URL(data.url || "./", self.location.origin);

  // Some in-app background notifications only carry roomId.
  // Convert that into the same deep-link parameter used by push notifications.
  if (data.roomId) {
    target.searchParams.set("openRoom", String(data.roomId));
  }

  const targetUrl = target.href;
  event.waitUntil(
    self.clients.matchAll({ type: "window", includeUncontrolled: true }).then(async clients => {
      for (const client of clients) {
        if (client.url.startsWith(self.location.origin) && "focus" in client) {
          if ("navigate" in client) await client.navigate(targetUrl);
          return client.focus();
        }
      }
      return self.clients.openWindow(targetUrl);
    })
  );
});