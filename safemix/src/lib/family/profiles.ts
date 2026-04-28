/**
 * Family profiles (PRD §8.1 Tab 5, §15 caregiver role).
 *
 * A caregiver may manage up to 6 dependents. Each dependent has its own
 * 4-digit PIN (rolling consent, re-confirmed every 90 days), its own regimen,
 * and its own colour-coded verdicts. Storage mirrors the regimen pattern:
 * write-through to Firestore + localStorage so the caregiver can switch
 * profiles instantly without a network round-trip.
 */
import { collection, doc, getDocs, setDoc, deleteDoc } from "firebase/firestore";
import { db } from "@/lib/firebase/config";

export const MAX_DEPENDENTS = 6;
export const CONSENT_TTL_DAYS = 90;

export interface FamilyProfile {
  id: string;
  /** Display name */
  name: string;
  /** "Self" or relationship: Mother / Father / Spouse / Child / Other */
  relationship: string;
  /** Year of birth (for age calc and dosing flags) */
  yob?: number;
  /** Self-reported sex; optional */
  sex?: "F" | "M" | "X";
  /** Comma-separated allergies / conditions */
  allergies?: string;
  conditions?: string;
  /** Hashed 4-digit PIN — null for the "self" profile, required for dependents */
  pinHash?: string;
  /** When consent was last re-confirmed; epoch ms */
  consentRenewedAt: number;
  selfManaged: boolean;
  createdAt: number;
}

const KEY = "safemix_family_profiles";

async function hashPin(pin: string): Promise<string> {
  const data = new TextEncoder().encode(pin);
  const buf = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(buf)).map((b) => b.toString(16).padStart(2, "0")).join("");
}

export function getProfiles(): FamilyProfile[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as FamilyProfile[]) : [];
  } catch {
    return [];
  }
}

function persistLocal(profiles: FamilyProfile[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEY, JSON.stringify(profiles));
}

export async function loadFromFirestore(uid: string): Promise<FamilyProfile[]> {
  const snap = await getDocs(collection(db, "users", uid, "profiles"));
  const list = snap.docs.map((d) => ({ id: d.id, ...d.data() } as FamilyProfile));
  persistLocal(list);
  return list;
}

export async function addProfile(
  uid: string | null,
  partial: Omit<FamilyProfile, "id" | "consentRenewedAt" | "createdAt" | "selfManaged" | "pinHash"> & { pin?: string }
): Promise<FamilyProfile> {
  const all = getProfiles();
  if (all.length >= MAX_DEPENDENTS) {
    throw new Error(`Maximum ${MAX_DEPENDENTS} profiles reached.`);
  }
  const id = `p_${Date.now()}`;
  const pinHash = partial.pin ? await hashPin(partial.pin) : undefined;
  const profile: FamilyProfile = {
    id,
    name: partial.name,
    relationship: partial.relationship,
    yob: partial.yob,
    sex: partial.sex,
    allergies: partial.allergies,
    conditions: partial.conditions,
    pinHash,
    consentRenewedAt: Date.now(),
    selfManaged: partial.relationship === "Self",
    createdAt: Date.now(),
  };
  const next = [profile, ...all];
  persistLocal(next);
  if (uid) {
    await setDoc(doc(db, "users", uid, "profiles", id), profile);
  }
  return profile;
}

export async function removeProfile(uid: string | null, id: string) {
  persistLocal(getProfiles().filter((p) => p.id !== id));
  if (uid) {
    await deleteDoc(doc(db, "users", uid, "profiles", id));
  }
}

export async function verifyPin(profile: FamilyProfile, pin: string): Promise<boolean> {
  if (!profile.pinHash) return true; // self-managed profiles skip PIN
  const candidate = await hashPin(pin);
  return candidate === profile.pinHash;
}

export function consentExpired(profile: FamilyProfile): boolean {
  const age = Date.now() - profile.consentRenewedAt;
  return age > CONSENT_TTL_DAYS * 24 * 60 * 60 * 1000;
}

export function ACTIVE_PROFILE_ID_KEY() { return "safemix_active_profile"; }

export function getActiveProfileId(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(ACTIVE_PROFILE_ID_KEY());
}

export function setActiveProfileId(id: string) {
  if (typeof window === "undefined") return;
  localStorage.setItem(ACTIVE_PROFILE_ID_KEY(), id);
  window.dispatchEvent(new CustomEvent("safemix-active-profile", { detail: id }));
}
