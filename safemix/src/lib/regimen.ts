/**
 * Manages the user's medicine regimen.
 *
 * Strategy: Write-through cache
 * - Reads and writes hit localStorage immediately (instant, offline-safe)
 * - When a Firebase UID is provided, writes also propagate to Firestore async
 * - On first login, existing localStorage data is migrated to Firestore
 */
import { addMedication, removeMedication } from "@/lib/firebase/firestore";

export interface RegimenMedicine {
  id: string;
  name: string;
  system: string;
  dosage: string;
  frequency: string;
  timing: string;
  withFood: boolean;
  startDate: string;
  addedAt: number;
}

const KEY = "safemix_regimen";

export function getRegimen(): RegimenMedicine[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as RegimenMedicine[]) : [];
  } catch {
    return [];
  }
}

export function addToRegimen(
  med: Omit<RegimenMedicine, "id" | "addedAt">,
  uid?: string | null
): RegimenMedicine {
  const all = getRegimen();
  const entry: RegimenMedicine = { ...med, id: `m_${Date.now()}`, addedAt: Date.now() };
  const updated = [entry, ...all.filter((m) => m.name.toLowerCase() !== med.name.toLowerCase())];
  localStorage.setItem(KEY, JSON.stringify(updated));

  // Fire-and-forget Firestore sync
  if (uid) {
    addMedication(uid, entry).catch((err) =>
      console.error("[SafeMix] Firestore addMedication failed:", err)
    );
  }

  return entry;
}

export function removeFromRegimen(id: string, uid?: string | null): void {
  const updated = getRegimen().filter((m) => m.id !== id);
  localStorage.setItem(KEY, JSON.stringify(updated));

  // Fire-and-forget Firestore sync
  if (uid) {
    removeMedication(uid, id).catch((err) =>
      console.error("[SafeMix] Firestore removeMedication failed:", err)
    );
  }
}

export function getRegimenNames(): string[] {
  return getRegimen().map((m) => m.name);
}

/**
 * Overwrite the local cache — used after pulling data from Firestore on login.
 */
export function setRegimenCache(meds: RegimenMedicine[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEY, JSON.stringify(meds));
}
