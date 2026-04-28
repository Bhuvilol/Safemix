/**
 * Interaction Cache — persists AI verdict results in localStorage
 * so the Dashboard can display real alerts without re-calling the API.
 */

export interface CachedVerdict {
  id: string;            // unique: medicine name slug
  medicine: string;      // The new medicine added
  system: string;
  verdict: "red" | "yellow" | "green";
  medicines: string[];   // Pair involved
  reason: string;
  suggestion: string;
  checkedAt: number;     // epoch ms
}

const CACHE_KEY = "safemix_interaction_cache";
const MAX_ENTRIES = 20;

export function getCachedVerdicts(): CachedVerdict[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    return raw ? (JSON.parse(raw) as CachedVerdict[]) : [];
  } catch {
    return [];
  }
}

export function saveVerdict(verdict: Omit<CachedVerdict, "id" | "checkedAt">): void {
  if (typeof window === "undefined") return;
  const all = getCachedVerdicts();
  const id = verdict.medicine.toLowerCase().replace(/\s+/g, "_").replace(/[^a-z0-9_]/g, "");
  // Replace existing entry for same medicine
  const filtered = all.filter((v) => v.id !== id);
  const entry: CachedVerdict = { ...verdict, id, checkedAt: Date.now() };
  const updated = [entry, ...filtered].slice(0, MAX_ENTRIES);
  localStorage.setItem(CACHE_KEY, JSON.stringify(updated));
}

export function clearVerdictCache(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(CACHE_KEY);
}

/** Returns only red and yellow verdicts (alerts) for dashboard display */
export function getActiveAlerts(): CachedVerdict[] {
  return getCachedVerdicts().filter((v) => v.verdict === "red" || v.verdict === "yellow");
}
