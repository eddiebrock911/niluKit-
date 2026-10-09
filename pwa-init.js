/* =========================================================
   pwa-init.js — PWA Initialization
   
   - Registers service worker for PWA features
   - Handles install prompts
   - Manages push notification subscription
   ========================================================= */

(function () {
  "use strict";

  // Register service worker
  function registerServiceWorker() {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("service-worker.js")
        .then((registration) => {
          console.log("✅ Service Worker registered:", registration);
          
          // Listen for updates
          registration.addEventListener("updatefound", () => {
            const newWorker = registration.installing;
            newWorker.addEventListener("statechange", () => {
              if (newWorker.state === "installed" && navigator.serviceWorker.controller) {
                console.log("✅ New Service Worker available, app updated!");
                // Could show update notification to user here
              }
            });
          });

          // Request notification permission if not already done
          subscribeToNotifications(registration);
        })
        .catch((err) => {
          console.warn("⚠️ Service Worker registration failed:", err);
        });
    } else {
      console.log("ℹ️ Service Worker not supported in this browser");
    }
  }

  // Subscribe to push notifications
  function subscribeToNotifications(registration) {
    if (!("Notification" in window)) {
      console.log("ℹ️ Notifications not supported");
      return;
    }

    if (Notification.permission === "granted") {
      registration.pushManager
        .subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(
            "BHfsEAjfNPjmV9NrMz8N0xKCl-RkDx9l5BgaJfjg9MqJBDZqQIxB6x7"
          )
        })
        .then((subscription) => {
          console.log("✅ Push notification subscription successful");
        })
        .catch((err) => {
          console.warn("⚠️ Push subscription error:", err);
        });
    }
  }

  // Utility function for push subscriptions
  function urlBase64ToUint8Array(base64String) {
    try {
      const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
      const base64 = (base64String + padding)
        .replace(/\-/g, "+")
        .replace(/_/g, "/");
      const rawData = window.atob(base64);
      const outputArray = new Uint8Array(rawData.length);
      for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
      }
      return outputArray;
    } catch (err) {
      console.warn("Error converting base64:", err);
      return null;
    }
  }

  // Handle install prompt
  let deferredPrompt;
  let installButton = null;

  window.addEventListener("beforeinstallprompt", (e) => {
    console.log("✅ Install prompt available!");
    e.preventDefault();
    deferredPrompt = e;

    // Show install button if desired
    if (installButton) {
      installButton.style.display = "block";
      installButton.addEventListener("click", () => {
        if (deferredPrompt) {
          deferredPrompt.prompt();
          deferredPrompt.userChoice.then((choiceResult) => {
            if (choiceResult.outcome === "accepted") {
              console.log("✅ User accepted install");
            }
            deferredPrompt = null;
            if (installButton) {
              installButton.style.display = "none";
            }
          });
        }
      });
    }
  });

  window.addEventListener("appinstalled", () => {
    console.log("✅ App installed successfully!");
    deferredPrompt = null;
    if (installButton) {
      installButton.style.display = "none";
    }
  });

  // Enhanced notification permission request for PWA
  window.requestChatNotificationPermission = function () {
    return new Promise((resolve) => {
      if (!("Notification" in window)) {
        console.warn("Notifications not supported");
        resolve("unsupported");
        return;
      }

      if (Notification.permission === "granted") {
        resolve("granted");
        return;
      }

      if (Notification.permission === "denied") {
        resolve("denied");
        return;
      }

      // Request permission
      Notification.requestPermission()
        .then((permission) => {
          console.log("Notification permission:", permission);
          
          // If granted, also subscribe to push notifications
          if (permission === "granted" && "serviceWorker" in navigator) {
            navigator.serviceWorker.ready.then((registration) => {
              subscribeToNotifications(registration);
            });
          }
          
          resolve(permission);
        })
        .catch((err) => {
          console.error("Permission request error:", err);
          resolve("default");
        });
    });
  };

  // Initialize on page load
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", registerServiceWorker);
  } else {
    registerServiceWorker();
  }

  // Global function to get install button for custom UI
  window.getInstallPrompt = function () {
    return deferredPrompt;
  };

  console.log("✅ PWA initialization ready");
})();
