/* =========================================================
   notifications.js — Browser notifications & sounds

   - Requests permission when first message arrives
   - Shows notifications for new messages from other person
   - No notification while chat is focused
   - Includes sound effects for messages
   ========================================================= */

(function (global) {
  "use strict";

  // Notification preferences stored in localStorage
  const DEFAULTS = { 
    messages: true, 
    mentions: true, 
    sounds: true 
  };
  
  let notificationPrefs = Object.assign({}, DEFAULTS);
  const openNotifications = new Map(); // tag -> Notification
  let askedForPermissionThisSession = false;
  let audioContext = null;

  // Load preferences from localStorage
  function loadPreferences() {
    const stored = localStorage.getItem("chatNotifPrefs");
    if (stored) {
      try {
        notificationPrefs = Object.assign({}, DEFAULTS, JSON.parse(stored));
      } catch (e) {
        notificationPrefs = Object.assign({}, DEFAULTS);
      }
    }
  }

  // Save preferences to localStorage
  function savePreferences() {
    localStorage.setItem("chatNotifPrefs", JSON.stringify(notificationPrefs));
  }

  // Check if we can send notifications
  function canNotify() {
    return ("Notification" in global) && Notification.permission === "granted";
  }

  // Check current permission status
  function getPermission() {
    if (!("Notification" in global)) return "unsupported";
    return Notification.permission;
  }

  // Request notification permission (only from user gesture)
  function requestPermission() {
    return new Promise((resolve) => {
      if (!("Notification" in global)) {
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

      if (askedForPermissionThisSession) {
        resolve("default");
        return;
      }

      askedForPermissionThisSession = true;
      localStorage.setItem("chatNotifAsked", "1");

      Notification.requestPermission()
        .then((permission) => {
          if (permission === "granted") {
            console.log("✅ Notifications enabled!");
          }
          resolve(permission);
        })
        .catch((err) => {
          console.warn("Notification permission error:", err);
          resolve("default");
        });
    });
  }

  // Check if chat is currently visible and focused
  function isChatVisible() {
    return document.visibilityState === "visible" && document.hasFocus();
  }

  // Fire a notification
  function fireNotification(type, { title, body, tag, data }) {
    // Check preferences
    if (type === "message" && !notificationPrefs.messages) return;
    if (type === "mention" && !notificationPrefs.mentions) return;

    // Don't notify if chat is visible and focused
    if (isChatVisible()) return;

    // Check if we can notify
    if (!canNotify()) return;

    try {
      const notifOptions = {
        body: body,
        tag: tag || type,
        renotify: true,
        icon: "images/icon.png",
        badge: "images/icon.png",
        data: data || {}
      };

      const notification = new Notification(title, notifOptions);
      openNotifications.set(notification.tag, notification);

      // Handle notification click
      notification.onclick = () => {
        window.focus();
        notification.close();
        openNotifications.delete(notification.tag);
        
        // Focus chat and scroll to message if key provided
        const chatBox = document.getElementById("chat-box");
        if (chatBox) {
          chatBox.classList.add("open");
        }
      };

      notification.onclose = () => {
        openNotifications.delete(notification.tag);
      };

      // Auto-close after 8 seconds
      setTimeout(() => {
        try {
          notification.close();
        } catch (e) {}
      }, 8000);

      return notification;
    } catch (e) {
      console.warn("Failed to create notification:", e);
    }
  }

  // Get audio context
  function getAudioContext() {
    if (!audioContext) {
      try {
        audioContext = new (global.AudioContext || global.webkitAudioContext)();
      } catch (e) {
        return null;
      }
    }
    if (audioContext.state === "suspended") {
      audioContext.resume().catch(() => {});
    }
    return audioContext;
  }

  // Play a notification sound
  function playNotificationSound() {
    if (!notificationPrefs.sounds) return;

    const ctx = getAudioContext();
    if (!ctx) return;

    try {
      // Create two-tone beep sound
      const notes = [
        { freq: 660, startTime: 0, duration: 0.1 },
        { freq: 880, startTime: 0.15, duration: 0.1 }
      ];

      notes.forEach(({ freq, startTime, duration }) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = "sine";
        osc.frequency.value = freq;

        const t = ctx.currentTime + startTime;
        gain.gain.setValueAtTime(0.15, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + duration);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(t);
        osc.stop(t + duration);
      });
    } catch (e) {
      console.warn("Sound play error:", e);
    }
  }

  // Check if text mentions the user
  function isMentioned(text, userName) {
    if (!text || !userName) return false;
    const lowerText = String(text).toLowerCase();
    const lowerName = String(userName).toLowerCase();
    return lowerText.includes("@" + lowerName) || lowerText.includes(lowerName);
  }

  // Notify about new message
  function notifyNewMessage(sender, text, isSenderMe) {
    if (isSenderMe) return; // Don't notify for own messages

    const mentioned = isMentioned(text, window.myName || "");
    const notifType = mentioned ? "mention" : "message";
    const title = (mentioned ? "💬 " : "") + sender + (mentioned ? " mentioned you!" : "");
    const preview = text ? (text.length > 50 ? text.substring(0, 47) + "..." : text) : "[No text]";

    fireNotification(notifType, {
      title: title,
      body: preview,
      tag: "new-message",
      data: { sender: sender, text: text }
    });

    playNotificationSound();
  }

  // Clear all open notifications
  function clearAllNotifications() {
    openNotifications.forEach((n) => {
      try {
        n.close();
      } catch (e) {}
    });
    openNotifications.clear();
  }

  // Initialize preferences on load
  loadPreferences();

  // Send notification to service worker (for PWA)
  function sendToServiceWorker(data) {
    if ("serviceWorker" in navigator && navigator.serviceWorker.controller) {
      try {
        navigator.serviceWorker.controller.postMessage({
          type: "SHOW_NOTIFICATION",
          payload: data
        });
      } catch (err) {
        console.warn("Error posting to service worker:", err);
      }
    }
  }

  // Export API to global scope
  global.ChatNotifications = {
    requestPermission,
    getPermission,
    canNotify,
    isChatVisible,
    notifyNewMessage,
    clearAllNotifications,
    playSound: playNotificationSound,
    setPref: (key, value) => {
      notificationPrefs[key] = !!value;
      savePreferences();
    },
    getPref: (key) => !!notificationPrefs[key],
    getPrefs: () => Object.assign({}, notificationPrefs),
    sendToServiceWorker: sendToServiceWorker
  };

  console.log("✅ ChatNotifications initialized");
})(window);
