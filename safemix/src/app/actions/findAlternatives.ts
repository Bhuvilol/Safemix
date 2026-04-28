"use server";

import { getGeminiClient } from "@/lib/ai/client";
import { TASK_MODEL, SAFETY_SETTINGS } from "@/lib/ai/routing";
import { MEDICINE_DATABASE } from "@/lib/medicineList";
import { lookupInteraction } from "@/lib/interactionRules";

export interface AlternativeOption {
  name: string;
  system: string;
  rationale: string;
  confidence: "high" | "medium" | "low";
  source: "rules" | "ai" | "fallback";
}

export interface AlternativesResult {
  alternatives: AlternativeOption[];
  summary: string;
  warning?: string;
}

function normalize(input: string) {
  return input.toLowerCase().replace(/[^a-z0-9\s]/g, " ").replace(/\s+/g, " ").trim();
}

function inferUseTarget(medicineName: string): string | null {
  const norm = normalize(medicineName);
  const direct = MEDICINE_DATABASE.find((m) => normalize(m.name).includes(norm) || norm.includes(normalize(m.name)));
  if (direct) return direct.commonUse;

  const tokens = norm.split(" ").filter(Boolean);
  const byToken = MEDICINE_DATABASE.find((m) => tokens.some((t) => t.length > 2 && normalize(m.name).includes(t)));
  return byToken?.commonUse ?? null;
}

const THERAPEUTIC_ALTERNATIVES: Array<{ match: RegExp; options: Array<{ name: string; system: string; rationale: string }> }> = [
  {
    match: /paracetamol|acetaminophen/i,
    options: [
      { name: "Ibuprofen 400mg", system: "Allopathic", rationale: "Alternative analgesic/anti-inflammatory when clinically suitable." },
      { name: "Haldi Doodh (Turmeric Milk)", system: "Home Remedy", rationale: "Mild symptom relief option for non-severe pain/cold contexts." },
    ],
  },
  {
    match: /metformin/i,
    options: [
      { name: "Sitagliptin 100mg", system: "Allopathic", rationale: "Common oral anti-diabetic alternative class." },
      { name: "Insulin Glargine", system: "Allopathic", rationale: "Escalation option for physician-supervised glycemic control." },
    ],
  },
  {
    match: /lisinopril|enalapril|losartan|telmisartan|amlodipine/i,
    options: [
      { name: "Amlodipine 5mg", system: "Allopathic", rationale: "Alternative antihypertensive class selection may reduce interaction risk." },
      { name: "Losartan 50mg", system: "Allopathic", rationale: "Alternative ARB option, physician to individualize therapy." },
    ],
  },
  {
    match: /levothyroxine/i,
    options: [
      { name: "Levothyroxine 50mcg", system: "Allopathic", rationale: "Dose titration under TSH monitoring can mitigate side effects." },
      { name: "Levothyroxine 100mcg", system: "Allopathic", rationale: "Alternative dose strength for supervised regimen optimization." },
    ],
  },
];

function deterministicAlternatives(medicineName: string, existingMedicines: string[]): AlternativeOption[] {
  const therapyMapped = THERAPEUTIC_ALTERNATIVES.find((t) => t.match.test(medicineName));
  if (therapyMapped) {
    const safeMapped = therapyMapped.options
      .filter((o) => !existingMedicines.some((e) => normalize(e) === normalize(o.name)))
      .filter((o) => !existingMedicines.some((e) => !!lookupInteraction(o.name, [e])))
      .slice(0, 4)
      .map((o) => ({ ...o, confidence: "high" as const, source: "rules" as const }));
    if (safeMapped.length > 0) return safeMapped;
  }

  const targetUse = inferUseTarget(medicineName);
  if (!targetUse) return [];

  const normNew = normalize(medicineName);
  const existingNorm = existingMedicines.map(normalize);

  const candidates = MEDICINE_DATABASE.filter((m) => {
    const nameNorm = normalize(m.name);
    if (nameNorm === normNew) return false;
    if (existingNorm.includes(nameNorm)) return false;
    return m.commonUse === targetUse;
  });

  const safe: AlternativeOption[] = [];
  for (const c of candidates) {
    const hasKnownConflict = existingMedicines.some((existing) => !!lookupInteraction(c.name, [existing]));
    if (hasKnownConflict) continue;
    safe.push({
      name: c.name,
      system: c.system,
      rationale: `Used for ${c.commonUse}. No high-confidence rule conflict was found against current regimen.`,
      confidence: "medium",
      source: "rules",
    });
    if (safe.length >= 4) break;
  }
  return safe;
}

export async function findAlternatives(
  medicineName: string,
  medicineSystem: string,
  existingMedicines: string[]
): Promise<AlternativesResult> {
  const base = deterministicAlternatives(medicineName, existingMedicines);
  if (base.length > 0) {
    return {
      alternatives: base,
      summary: "Safer alternatives found using SafeMix interaction rules.",
    };
  }

  try {
    const ai = getGeminiClient();
    const prompt = `You are a clinical pharmacology assistant for SafeMix.
Patient wants alternatives to: "${medicineName}" (${medicineSystem}).
Current regimen: ${existingMedicines.length ? existingMedicines.join(", ") : "none"}.

Return strict JSON:
{
  "summary": "max 30 words",
  "alternatives": [
    {
      "name": "medicine/herb/home remedy name",
      "system": "Allopathic|Ayurvedic|OTC|Supplement|Home Remedy|Herbal",
      "rationale": "1 short sentence",
      "confidence": "high|medium|low"
    }
  ]
}

Rules:
- Prefer India-available options.
- Do not suggest an alternative that duplicates current regimen medicine.
- If no safe option is clear, return empty alternatives.
- Max 4 alternatives.`;

    const response = await ai.models.generateContent({
      model: TASK_MODEL.severityNovelPair,
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      config: { safetySettings: SAFETY_SETTINGS, temperature: 0.2 },
    });

    const text = response.text?.trim();
    if (!text) throw new Error("No model text");
    const clean = text.replace(/^```json/, "").replace(/^```/, "").replace(/```$/, "").trim();
    const parsed = JSON.parse(clean) as {
      summary?: string;
      alternatives?: Array<{ name: string; system: string; rationale: string; confidence: "high" | "medium" | "low" }>;
    };

    const aiAlternatives: AlternativeOption[] = (parsed.alternatives ?? [])
      .filter((a) => a?.name && a?.rationale)
      .slice(0, 4)
      .map((a) => ({ ...a, source: "ai" as const }));

    if (aiAlternatives.length > 0) {
      return {
        alternatives: aiAlternatives,
        summary: parsed.summary?.slice(0, 180) || "Alternatives generated by SafeMix AI.",
      };
    }
  } catch (error) {
    console.error("[SafeMix] findAlternatives AI fallback failed:", error);
  }

  return {
    alternatives: [],
    summary: "No confident alternatives could be generated right now.",
    warning: "Please consult your doctor/pharmacist before changing your medicine routine.",
  };
}
