"use server";
/**
 * DPDP rights actions (PRD §16, §18).
 *
 * - exportUserData: builds a structured JSON archive of every collection under
 *   users/{uid}/* plus the user's adverse-event reports. We stream the doc data
 *   with no transforms so the user gets exactly what we hold.
 * - deleteUserAccount: enumerates the same subcollections, deletes every doc,
 *   then deletes the parent user doc. PRD mandates fulfilment within 30 days;
 *   we execute synchronously since the dataset is small per user. Auth user
 *   record itself is deleted client-side after this resolves (Firebase Auth
 *   user-delete must be called with a fresh ID token, which is only available
 *   on the client).
 */
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
} from "firebase/firestore";
import { db } from "@/lib/firebase/config";

const SUBCOLLECTIONS = [
  "medications",
  "verdicts",
  "reminders",
  "reminder_logs",
  "shares",
  "adverseEvents",
  "adr_reports",
  "fcm_tokens",
  "profiles",
] as const;

export interface ExportArchive {
  exportedAt: number;
  uid: string;
  user: Record<string, unknown> | null;
  collections: Record<string, Array<Record<string, unknown>>>;
}

export async function exportUserData(uid: string): Promise<ExportArchive> {
  if (!uid) throw new Error("uid required");

  const userRef = doc(db, "users", uid);
  const userSnap = await getDoc(userRef);
  const archive: ExportArchive = {
    exportedAt: Date.now(),
    uid,
    user: userSnap.exists() ? (userSnap.data() as Record<string, unknown>) : null,
    collections: {},
  };

  for (const sub of SUBCOLLECTIONS) {
    const snap = await getDocs(collection(db, "users", uid, sub));
    archive.collections[sub] = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  }

  return archive;
}

export async function deleteUserAccount(uid: string): Promise<{ deletedDocs: number }> {
  if (!uid) throw new Error("uid required");

  let deletedDocs = 0;
  for (const sub of SUBCOLLECTIONS) {
    const snap = await getDocs(collection(db, "users", uid, sub));
    for (const d of snap.docs) {
      await deleteDoc(d.ref);
      deletedDocs++;
    }
  }
  await deleteDoc(doc(db, "users", uid));
  deletedDocs++;

  return { deletedDocs };
}
