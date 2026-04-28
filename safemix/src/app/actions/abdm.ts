"use server";

import {
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  addDoc,
} from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import {
  type AbhaLinkRecord,
  type AbdmConsentArtifact,
  maskAbhaId,
  defaultConsentWindowDays,
} from "@/lib/abdm";

/**
 * Start ABHA link flow. Sandbox stub:
 * - validates format
 * - records pending state + pseudo txn id
 */
export async function startAbhaLink(uid: string, abhaId: string): Promise<AbhaLinkRecord> {
  if (!uid) throw new Error("uid required");
  if (!abhaId || abhaId.length < 8) throw new Error("invalid ABHA ID");

  const rec: AbhaLinkRecord = {
    uid,
    abhaIdMasked: maskAbhaId(abhaId),
    state: "pending_otp",
    txnId: `abdm_txn_${Date.now()}`,
  };

  await setDoc(doc(db, "users", uid, "abha_links", "primary"), rec, { merge: true });
  return rec;
}

/**
 * Confirm ABHA link with OTP. Sandbox stub accepts any 6-digit OTP.
 */
export async function confirmAbhaLink(uid: string, otp: string): Promise<AbhaLinkRecord> {
  if (!uid) throw new Error("uid required");
  if (!/^\d{6}$/.test(otp)) throw new Error("otp must be 6 digits");

  const snap = await getDoc(doc(db, "users", uid, "abha_links", "primary"));
  if (!snap.exists()) throw new Error("link not initiated");
  const prev = snap.data() as AbhaLinkRecord;

  const rec: AbhaLinkRecord = {
    ...prev,
    state: "linked",
    linkedAt: Date.now(),
    lastError: undefined,
  };

  await setDoc(doc(db, "users", uid, "abha_links", "primary"), rec, { merge: true });
  return rec;
}

export async function getAbhaLink(uid: string): Promise<AbhaLinkRecord | null> {
  if (!uid) throw new Error("uid required");
  const snap = await getDoc(doc(db, "users", uid, "abha_links", "primary"));
  return snap.exists() ? (snap.data() as AbhaLinkRecord) : null;
}

export async function revokeAbhaLink(uid: string): Promise<void> {
  if (!uid) throw new Error("uid required");
  await setDoc(
    doc(db, "users", uid, "abha_links", "primary"),
    { state: "revoked", revokedAt: Date.now() },
    { merge: true }
  );
}

export async function createAbdmConsent(uid: string, args: {
  purpose: AbdmConsentArtifact["purpose"];
  hiTypes: AbdmConsentArtifact["hiTypes"];
  days?: number;
}): Promise<AbdmConsentArtifact> {
  if (!uid) throw new Error("uid required");
  const range = defaultConsentWindowDays(args.days ?? 180);
  const grantedAt = Date.now();
  const expiresAt = new Date(range.to).getTime();

  const rec: AbdmConsentArtifact = {
    uid,
    consentId: `abdm_consent_${grantedAt}`,
    purpose: args.purpose,
    hiTypes: args.hiTypes,
    from: range.from,
    to: range.to,
    grantedAt,
    expiresAt,
    status: "active",
  };

  await setDoc(doc(db, "users", uid, "abdm_consents", rec.consentId), rec);
  return rec;
}

export async function listAbdmConsents(uid: string): Promise<AbdmConsentArtifact[]> {
  if (!uid) throw new Error("uid required");
  const snap = await getDocs(collection(db, "users", uid, "abdm_consents"));
  return snap.docs.map((d) => d.data() as AbdmConsentArtifact).sort((a, b) => b.grantedAt - a.grantedAt);
}

export async function revokeAbdmConsent(uid: string, consentId: string): Promise<void> {
  if (!uid) throw new Error("uid required");
  await setDoc(
    doc(db, "users", uid, "abdm_consents", consentId),
    { status: "revoked", revokedAt: Date.now() },
    { merge: true }
  );
}
