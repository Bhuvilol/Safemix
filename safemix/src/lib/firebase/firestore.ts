/**
 * Firestore typed helpers for SafeMix.
 * All health data is stored under users/{uid}/... collections.
 */
import {
  collection, doc, addDoc, setDoc, getDoc, getDocs,
  deleteDoc, updateDoc, query, orderBy, limit,
  Timestamp, serverTimestamp, onSnapshot, type Unsubscribe,
} from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import type { RegimenMedicine } from "@/lib/regimen";
import type { CachedVerdict } from "@/lib/interactionCache";

// ─── Medications ──────────────────────────────────────────────────────────────

export async function getMedications(uid: string): Promise<RegimenMedicine[]> {
  const snap = await getDocs(
    query(collection(db, "users", uid, "medications"), orderBy("addedAt", "desc"))
  );
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as RegimenMedicine));
}

export async function addMedication(uid: string, med: RegimenMedicine): Promise<void> {
  await setDoc(doc(db, "users", uid, "medications", med.id), {
    ...med,
    addedAt: med.addedAt,
    syncedAt: Date.now(),
  });
}

export async function removeMedication(uid: string, id: string): Promise<void> {
  await deleteDoc(doc(db, "users", uid, "medications", id));
}

// ─── Verdicts ─────────────────────────────────────────────────────────────────

export async function getVerdicts(uid: string): Promise<CachedVerdict[]> {
  const snap = await getDocs(
    query(collection(db, "users", uid, "verdicts"), orderBy("checkedAt", "desc"), limit(20))
  );
  return snap.docs.map((d) => ({ ...d.data() } as CachedVerdict));
}

export async function saveVerdictFirestore(uid: string, verdict: CachedVerdict): Promise<void> {
  await setDoc(doc(db, "users", uid, "verdicts", verdict.id), {
    ...verdict,
    syncedAt: Date.now(),
  });
}

// ─── Reminders ────────────────────────────────────────────────────────────────

export interface ReminderLog {
  status: "taken" | "missed";
  loggedAt: string;
}

export async function getReminderLogs(uid: string, date: string): Promise<Record<string, ReminderLog>> {
  const docSnap = await getDoc(doc(db, "users", uid, "reminder_logs", date));
  return docSnap.exists() ? (docSnap.data() as Record<string, ReminderLog>) : {};
}

export async function saveReminderLog(
  uid: string, date: string, key: string, log: ReminderLog
): Promise<void> {
  await setDoc(
    doc(db, "users", uid, "reminder_logs", date),
    { [key]: log },
    { merge: true }
  );
}

// ─── Doctor Share Log ─────────────────────────────────────────────────────────

export interface ShareLogEntry {
  token: string;
  issued: number;
  expiry: number;
  duration: string;
  revokedAt?: number;
}

export async function logShare(uid: string, entry: ShareLogEntry): Promise<void> {
  await addDoc(collection(db, "users", uid, "shares"), {
    ...entry,
    syncedAt: Date.now(),
  });
}

// ─── FCM Tokens ───────────────────────────────────────────────────────────────

export async function saveFcmTokenFirestore(uid: string, token: string): Promise<void> {
  await setDoc(
    doc(db, "users", uid, "fcm_tokens", token.slice(0, 40)),
    { token, updatedAt: Date.now() },
    { merge: true }
  );
}

// ─── ADR Reports ──────────────────────────────────────────────────────────────

export interface AdrReport {
  uid: string;
  medicine: string;
  symptom: string;
  severity: string;
  date: string;
  notes: string;
  doctorNotified: boolean;
  status: "pending_review" | "reviewed" | "forwarded";
  reportedAt: number;
}

export async function submitAdrReport(uid: string, report: Omit<AdrReport, "uid" | "status" | "reportedAt">): Promise<string> {
  const ref = await addDoc(collection(db, "users", uid, "adr_reports"), {
    uid,
    ...report,
    status: "pending_review",
    reportedAt: Date.now(),
  });
  // Also write to global collection for admin review
  await setDoc(doc(db, "adr_reports", ref.id), {
    uid,
    ...report,
    status: "pending_review",
    reportedAt: Date.now(),
    docId: ref.id,
  });
  return ref.id;
}

export async function getAllAdrReports(): Promise<(AdrReport & { docId: string })[]> {
  const snap = await getDocs(
    query(collection(db, "adr_reports"), orderBy("reportedAt", "desc"), limit(100))
  );
  return snap.docs.map((d) => ({ docId: d.id, ...d.data() } as AdrReport & { docId: string }));
}

// ─── Migration: localStorage → Firestore ─────────────────────────────────────

/**
 * Called once on login. Moves any localStorage regimen/verdicts to Firestore,
 * then pulls Firestore data back into localStorage so the app works offline.
 */
export async function migrateLocalStorageToFirestore(uid: string): Promise<void> {
  try {
    // 1. Migrate regimen
    const raw = localStorage.getItem("safemix_regimen");
    if (raw) {
      const meds: RegimenMedicine[] = JSON.parse(raw);
      // Get existing Firestore meds to avoid duplicates
      const existing = await getMedications(uid);
      const existingIds = new Set(existing.map((m) => m.id));
      for (const med of meds) {
        if (!existingIds.has(med.id)) {
          await addMedication(uid, med);
        }
      }
      // Pull merged list back to localStorage
      const merged = await getMedications(uid);
      localStorage.setItem("safemix_regimen", JSON.stringify(merged));
    }

    // 2. Migrate verdicts
    const verdictRaw = localStorage.getItem("safemix_interaction_cache");
    if (verdictRaw) {
      const verdicts: CachedVerdict[] = JSON.parse(verdictRaw);
      for (const v of verdicts) {
        await saveVerdictFirestore(uid, v);
      }
    }

    // 3. Pull Firestore verdicts back to localStorage if empty
    const localVerdicts = localStorage.getItem("safemix_interaction_cache");
    if (!localVerdicts || JSON.parse(localVerdicts).length === 0) {
      const fsVerdicts = await getVerdicts(uid);
      if (fsVerdicts.length > 0) {
        localStorage.setItem("safemix_interaction_cache", JSON.stringify(fsVerdicts));
      }
    }
  } catch (err) {
    console.error("[SafeMix] Firestore migration error:", err);
    // Non-fatal — app works via localStorage
  }
}
