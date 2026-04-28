"use server";
import { GoogleGenAI } from "@google/genai";
import { lookupInteraction } from "@/lib/interactionRules";

export interface InteractionResult {
  verdict: "red" | "yellow" | "green";
  medicines: string[];
  reason: string;
  suggestion: string;
  confidence: "high" | "medium" | "low";
  /** "rules" = deterministic DB hit (<50ms) | "ai" = Gemini fallback */
  source?: "rules" | "ai";
}

export async function checkInteraction(
  medicineName: string,
  medicineSystem: string,
  existingMedicines: string[]
): Promise<InteractionResult> {

  // ── Stage 1: Deterministic Rule Engine (<50ms) ────────────────────────────
  const ruleResult = lookupInteraction(medicineName, existingMedicines);
  if (ruleResult) {
    return ruleResult; // Instant — no API call needed
  }

  // ── Stage 2: Gemini AI Reasoning (fallback for unknown pairs) ─────────────
  const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
  if (!apiKey) throw new Error("Gemini API key is not configured.");

  const ai = new GoogleGenAI({ apiKey });

  const context =
    existingMedicines.length > 0
      ? `The patient is already taking: ${existingMedicines.join(", ")}.`
      : "The patient is not currently taking any other medicines.";

  const prompt = `You are a clinical pharmacist AI for SafeMix, an Indian medication safety platform.

${context}

The patient now wants to add: "${medicineName}" (${medicineSystem} medicine).

Task: Analyse for dangerous drug-drug or drug-herb interactions between the new medicine and the existing ones, or assess safety if no existing medicines. Consider Indian polypharmacy context including allopathic, ayurvedic, herbal, and home remedies.

Respond ONLY with a valid JSON object — no markdown, no explanation outside JSON:
{
  "verdict": "red" | "yellow" | "green",
  "medicines": ["list of medicines involved in the primary interaction — include the new medicine"],
  "reason": "1-2 sentence clinical explanation of WHY this combination is risky or safe. Be specific and factual.",
  "suggestion": "1-2 sentence specific, actionable advice for the patient.",
  "confidence": "high" | "medium" | "low"
}

Verdict rules:
- "red" = Severe risk, do not combine without doctor supervision (e.g. hypoglycemia risk, serotonin syndrome, etc.)
- "yellow" = Use with caution, monitor carefully, timing matters
- "green" = Generally safe or no known significant interaction
`;

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: [{ role: "user", parts: [{ text: prompt }] }],
  });

  if (!response.text) throw new Error("No response from Gemini.");

  let cleanJson = response.text.trim();
  if (cleanJson.startsWith("```json")) {
    cleanJson = cleanJson.replace(/^```json/, "").replace(/```$/, "").trim();
  } else if (cleanJson.startsWith("```")) {
    cleanJson = cleanJson.replace(/^```/, "").replace(/```$/, "").trim();
  }

  const parsed = JSON.parse(cleanJson) as InteractionResult;

  // Ensure the new medicine is in the list
  if (!parsed.medicines.some(m => m.toLowerCase().includes(medicineName.toLowerCase().split(" ")[0]))) {
    parsed.medicines = [medicineName, ...parsed.medicines];
  }

  return { ...parsed, source: "ai" };
}
