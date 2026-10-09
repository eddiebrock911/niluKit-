/* =========================================================
   service-worker.js — Service Worker for PWA
   
   - Handles notifications when app is background
   - Manages push notifications
   - Enables offline functionality (partial)
   - Caches assets for faster loading
   ========================================================= */

const CACHE_NAME = "nilu-chat-v3";
const ASSETS_TO_CACHE = [
  "/",
  "/index.html",
  "/style.css",
  "/script.js",
  "/live-chat.js",
  "/notifications.js",
  "/pwa-init.js",
  "/service-worker.js"
];

// Install event - cache assets
self.addEventListener("install", (event) => {
  console.log("✅ Service Worker installing...");
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("📦 Caching assets");
      return cache.addAll(ASSETS_TO_CACHE).catch((err) => {
        console.warn("⚠️ Cache addAll error (non-critical):", err);
      });
    })
  );
  self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener("activate", (event) => {
  console.log("✅ Service Worker activating...");
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log("🗑️ Deleting old cache:", cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Handle messages from main app
self.addEventListener("message", (event) => {
  console.log("📨 Service Worker received message:", event.data);
  
  if (event.data.type === "SHOW_NOTIFICATION") {
    const { title, body, icon, badge, tag, data } = event.data.payload;
    
    self.registration.showNotification(title || "Ankit & Naincy 💕", {
      body: body || "New message! 💕",
      icon: icon || "/images/icon.png",
      badge: badge || "/images/icon.png",
      tag: tag || "chat-notification",
      requireInteraction: false,
      actions: [
        {
          action: "open",
          title: "Open Chat",
          icon: "/images/icon.png"
        },
        {
          action: "close",
          title: "Close",
          icon: "/images/icon.png"
        }
      ],
      data: data || {}
    });
  }
  
  // Acknowledge receipt
  if (event.ports[0]) {
    event.ports[0].postMessage({
      status: "notification_shown"
    });
  }
});

// Fetch event - serve from cache, fallback to network
self.addEventListener("fetch", (event) => {
  // Skip Firebase and external API calls
  if (
    event.request.url.includes("firebase") ||
    event.request.url.includes("googleapis") ||
    event.request.url.includes("gstatic") ||
    event.request.url.includes("google-analytics")
  ) {
    event.respondWith(fetch(event.request));
    return;
  }

  if (event.request.mode === "navigate" || event.request.destination === "document") {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          const copy = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
          return response;
        })
        .catch(() => caches.match(event.request))
    );
    return;
  }

  event.respondWith(
    caches.match(event.request).then((response) => {
      if (response) {
        return response;
      }
      return fetch(event.request).catch(() => {
        // Return offline page or default response if needed
        console.warn("❌ Fetch failed for:", event.request.url);
      });
    })
  );
});

// Handle push notifications
self.addEventListener("push", (event) => {
  console.log("🔔 Push notification received:", event);
  
  if (event.data) {
    try {
      const data = event.data.json();
      const notificationOptions = {
        body: data.body || "New message from Naincy! 💕",
        icon: "/images/icon.png",
        badge: "/images/icon.png",
        tag: "naincy-notification",
        requireInteraction: false,
        actions: [
          {
            action: "open",
            title: "Open Chat",
            icon: "/images/icon.png"
          },
          {
            action: "close",
            title: "Close",
            icon: "/images/icon.png"
          }
        ],
        data: data
      };

      event.waitUntil(
        self.registration.showNotification(data.title || "Ankit & Naincy 💕", notificationOptions)
      );
    } catch (err) {
      console.error("❌ Push notification error:", err);
    }
  } else {
    // Fallback notification
    event.waitUntil(
      self.registration.showNotification("Ankit & Naincy 💕", {
        body: "New message! 💕",
        icon: "/images/icon.png",
        tag: "naincy-notification"
      })
    );
  }
});

// Handle notification clicks
self.addEventListener("notificationclick", (event) => {
  console.log("👆 Notification clicked:", event.notification.tag);
  event.notification.close();

  if (event.action === "close") {
    return;
  }

  // Open the chat window
  event.waitUntil(
    clients.matchAll({ type: "window", includeUncontrolled: true }).then((clientList) => {
      console.log("📱 Found clients:", clientList.length);
      
      // If window already open, focus it
      for (let i = 0; i < clientList.length; i++) {
        const client = clientList[i];
        if ("focus" in client) {
          return client.focus();
        }
      }
      
      // If no window open, open new one
      if (clients.openWindow) {
        return clients.openWindow("/");
      }
    })
  );
});

// Handle notification close
self.addEventListener("notificationclose", (event) => {
  console.log("❌ Notification closed:", event.notification.tag);
});

// Periodic background sync (for sending pending messages)
self.addEventListener("sync", (event) => {
  if (event.tag === "sync-chat") {
    console.log("🔄 Background sync triggered");
    // Could be used to sync pending messages later
  }
});

console.log("✅ Service Worker loaded and ready");
