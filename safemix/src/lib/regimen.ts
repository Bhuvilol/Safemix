/**
 * Manages the user's medicine regimen in localStorage.
 * In production this would sync to Firestore, but localStorage ensures
 * the data persists across page loads without an auth dependency.
 */

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

export function addToRegimen(med: Omit<RegimenMedicine, "id" | "addedAt">): RegimenMedicine {
  const all = getRegimen();
  const entry: RegimenMedicine = { ...med, id: `m_${Date.now()}`, addedAt: Date.now() };
  const updated = [entry, ...all.filter((m) => m.name.toLowerCase() !== med.name.toLowerCase())];
  localStorage.setItem(KEY, JSON.stringify(updated));
  return entry;
}

export function removeFromRegimen(id: string): void {
  const updated = getRegimen().filter((m) => m.id !== id);
  localStorage.setItem(KEY, JSON.stringify(updated));
}

export function getRegimenNames(): string[] {
  return getRegimen().map((m) => m.name);
}
