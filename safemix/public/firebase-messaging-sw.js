// Firebase Cloud Messaging Service Worker
// Handles background push notifications when the app is not in focus.
// Place this file at /public/firebase-messaging-sw.js

importScripts("https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.12.0/firebase-messaging-compat.js");

// These values are safe to expose — they are client-side config, not secrets.
firebase.initializeApp({
  apiKey: self.__FIREBASE_API_KEY || "",
  authDomain: self.__FIREBASE_AUTH_DOMAIN || "",
  projectId: self.__FIREBASE_PROJECT_ID || "",
  storageBucket: self.__FIREBASE_STORAGE_BUCKET || "",
  messagingSenderId: self.__FIREBASE_MESSAGING_SENDER_ID || "",
  appId: self.__FIREBASE_APP_ID || "",
});

const messaging = firebase.messaging();

// Handle background messages
messaging.onBackgroundMessage((payload) => {
  const title = payload.notification?.title || "SafeMix Reminder";
  const body = payload.notification?.body || "Time to take your medicine";

  self.registration.showNotification(title, {
    body,
    icon: "/favicon.ico",
    badge: "/favicon.ico",
    tag: "safemix-reminder",
    data: { url: "/dashboard/reminders" },
  });
});

// On notification click → open reminders page
self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const url = event.notification.data?.url || "/dashboard/reminders";
  event.waitUntil(
    clients.matchAll({ type: "window", includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if (client.url.includes(url) && "focus" in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow(url);
      }
    })
  );
});
