/**
 * Firebase Cloud Messaging helpers for SafeMix.
 * Handles browser notification permission, FCM token management,
 * and foreground message listening.
 *
 * NOTE: Scheduled push at reminder time requires Cloud Functions (separate infra).
 * This module handles: permission capture, FCM token storage, foreground toasts.
 */
import { getMessaging, getToken, onMessage, type MessagePayload } from "firebase/messaging";
import { saveFcmTokenFirestore } from "@/lib/firebase/firestore";
import { auth } from "@/lib/firebase/config";

/**
 * Request browser notification permission and obtain the FCM registration token.
 * Saves the token to Firestore under users/{uid}/fcm_tokens/.
 * Returns the token string, or null if permission was denied.
 */
export async function requestNotificationPermission(): Promise<string | null> {
  if (typeof window === "undefined") return null;
  if (!("Notification" in window)) return null;

  try {
    const permission = await Notification.requestPermission();
    if (permission !== "granted") return null;

    const vapidKey = process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY;
    if (!vapidKey) {
      console.warn("[SafeMix FCM] NEXT_PUBLIC_FIREBASE_VAPID_KEY not set — push notifications disabled.");
      return null;
    }

    // Dynamic import so messaging is only loaded in the browser
    const { initializeApp, getApps, getApp } = await import("firebase/app");
    const firebaseConfig = {
      apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
      authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
      messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
      appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    };
    const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
    const messaging = getMessaging(app);

    const token = await getToken(messaging, {
      vapidKey,
      serviceWorkerRegistration: await navigator.serviceWorker.register(
        "/firebase-messaging-sw.js"
      ),
    });

    if (token) {
      const uid = auth.currentUser?.uid;
      if (uid) {
        await saveFcmTokenFirestore(uid, token);
      }
      return token;
    }

    return null;
  } catch (err) {
    console.error("[SafeMix FCM] Failed to get notification permission:", err);
    return null;
  }
}

/**
 * Listen for foreground FCM messages (when the app tab is active).
 * Call this once in the dashboard layout.
 */
export function listenForForegroundMessages(
  callback: (payload: MessagePayload) => void
): (() => void) | null {
  if (typeof window === "undefined") return null;

  try {
    const { initializeApp, getApps, getApp } = require("firebase/app");
    const app = !getApps().length ? initializeApp({}) : getApp();
    const messaging = getMessaging(app);
    const unsub = onMessage(messaging, callback);
    return unsub;
  } catch {
    return null;
  }
}
