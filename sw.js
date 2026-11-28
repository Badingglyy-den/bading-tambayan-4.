const CACHE_NAME = "bading-tambayan-shell-v13";
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
    // Network-first: always try to load the newest app assets, then fall back
    // to the cached copy only when offline. This prevents installed apps from
    // staying stuck on old JavaScript or CSS after a deployment.
    event.respondWith(
      fetch(request).then(response => {
        if (response && response.ok && response.type === "basic") {
          const copy = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(request, copy));
        }
        return response;
      }).catch(() => caches.match(request))
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
    // Re-alert Android when a new private message replaces/updates a notification.
    renotify: true,
    vibrate: [180, 100, 180],
    data: { roomId: payload.roomId || null, conversationId: payload.conversationId || null, messageId: payload.messageId || null, url: payload.url || "./" }
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener("notificationclick", event => {
  event.notification.close();

  const data = event.notification.data || {};
  const appScope = self.registration.scope;
  let target;

  try {
    // Resolve relative links against the installed app path, not the domain root.
    target = new URL(data.url || appScope, appScope);
  } catch (_) {
    target = new URL(appScope);
  }

  // Never let notification data send the app outside its own installed path.
  const scopeUrl = new URL(appScope);
  if (target.origin !== scopeUrl.origin || !target.pathname.startsWith(scopeUrl.pathname)) {
    target = new URL(appScope);
  }

  // Room ID is authoritative and works even when a notification has no URL.
  if (data.roomId) {
    target.searchParams.set("openRoom", String(data.roomId));
  }

  // Private-message notifications open the exact conversation after account restore.
  if (data.conversationId) target.searchParams.set("openDm", String(data.conversationId));

  const targetUrl = target.href;
  event.waitUntil((async () => {
    const clients = await self.clients.matchAll({ type: "window", includeUncontrolled: true });

    for (const client of clients) {
      if (client.url.startsWith(appScope) && "focus" in client) {
        try {
          if ("navigate" in client) {
            const navigated = await client.navigate(targetUrl);
            if (navigated) {
              await client.focus();
              return;
            }
          }
        } catch (_) {
          // If navigation of an existing app window fails, open the target below.
        }
      }
    }

    // Reliable fallback for Android/iOS when an existing window cannot be navigated.
    return self.clients.openWindow(targetUrl);
  })());
});