/**
 * Deterministic Drug Interaction Rule Engine — Stage 1
 *
 * Top 60 clinically documented India-relevant drug-herb-food interactions.
 * Checked BEFORE falling back to Gemini AI (PRD: <50ms deterministic path).
 *
 * Sources: WHO, CDSCO, CCRAS, published pharmacology literature.
 */

export interface RuleInteractionResult {
  verdict: "red" | "yellow" | "green";
  medicines: string[];
  reason: string;
  suggestion: string;
  confidence: "high" | "medium" | "low";
  source: "rules";
}

interface Rule {
  /** Normalised drug/herb names (lowercase). Order-independent. */
  drugs: [string, string];
  verdict: "red" | "yellow" | "green";
  reason: string;
  suggestion: string;
  confidence: "high" | "medium" | "low";
}

const RULES: Rule[] = [
  // ── Severe (Red) ────────────────────────────────────────────────────────────
  {
    drugs: ["metformin", "karela"],
    verdict: "red",
    reason: "Both lower blood glucose through different mechanisms. Combined use can cause profound hypoglycemia, especially in type 2 diabetic patients.",
    suggestion: "Avoid concurrent use. If karela is desired, space at least 8 hours from Metformin and monitor blood glucose before each dose.",
    confidence: "high",
  },
  {
    drugs: ["metformin", "bitter gourd"],
    verdict: "red",
    reason: "Bitter gourd (karela) has antidiabetic properties that can potentiate Metformin's glucose-lowering effect, risking hypoglycemia.",
    suggestion: "Avoid concurrent use. Monitor fasting blood glucose closely if both must be taken.",
    confidence: "high",
  },
  {
    drugs: ["warfarin", "ashwagandha"],
    verdict: "red",
    reason: "Ashwagandha may inhibit platelet aggregation and potentiate anticoagulant effects of Warfarin, increasing bleeding risk.",
    suggestion: "Avoid combination. If Ashwagandha is needed, INR must be monitored every 3 days.",
    confidence: "high",
  },
  {
    drugs: ["warfarin", "garlic"],
    verdict: "red",
    reason: "Garlic inhibits platelet aggregation and has anticoagulant properties. Combined with Warfarin, bleeding risk increases significantly.",
    suggestion: "Avoid high-dose garlic supplements with Warfarin. Monitor INR closely.",
    confidence: "high",
  },
  {
    drugs: ["aspirin", "ibuprofen"],
    verdict: "red",
    reason: "Both are NSAIDs and antiplatelet agents. Concurrent use significantly increases risk of GI bleeding and reduces aspirin's cardioprotective effect.",
    suggestion: "Do not use together. If pain relief is needed, consult a doctor about an alternative.",
    confidence: "high",
  },
  {
    drugs: ["ssri", "st. john's wort"],
    verdict: "red",
    reason: "Both increase serotonin levels. Combination can cause serotonin syndrome — a potentially life-threatening condition.",
    suggestion: "Never combine. Discontinue St. John's Wort at least 2 weeks before starting an SSRI.",
    confidence: "high",
  },
  {
    drugs: ["fluoxetine", "st. john's wort"],
    verdict: "red",
    reason: "Fluoxetine + St. John's Wort = serotonin syndrome risk: agitation, rapid heartbeat, hyperthermia.",
    suggestion: "Do not use together. Seek medical supervision before any SSRI-herb combination.",
    confidence: "high",
  },
  {
    drugs: ["digoxin", "liquorice"],
    verdict: "red",
    reason: "Liquorice causes hypokalemia (low potassium), which increases Digoxin toxicity and can cause fatal arrhythmias.",
    suggestion: "Avoid all liquorice products while on Digoxin. Monitor serum potassium levels closely.",
    confidence: "high",
  },
  {
    drugs: ["metformin", "alcohol"],
    verdict: "red",
    reason: "Alcohol inhibits gluconeogenesis and enhances Metformin's lactic acidosis risk, which can be fatal.",
    suggestion: "Completely avoid alcohol while on Metformin therapy.",
    confidence: "high",
  },
  {
    drugs: ["sildenafil", "nitrates"],
    verdict: "red",
    reason: "Both cause vasodilation. Combination results in severe, potentially fatal hypotension.",
    suggestion: "Never combine. Nitrates are absolutely contraindicated with sildenafil.",
    confidence: "high",
  },
  {
    drugs: ["maois", "tyramine"],
    verdict: "red",
    reason: "MAO inhibitors + high-tyramine foods (aged cheese, pickles) can cause hypertensive crisis — BP can rise dangerously high.",
    suggestion: "Strict dietary restriction of tyramine-containing foods is mandatory during MAOI therapy.",
    confidence: "high",
  },
  {
    drugs: ["lithium", "ibuprofen"],
    verdict: "red",
    reason: "Ibuprofen reduces renal lithium clearance, causing lithium toxicity (tremors, confusion, kidney damage).",
    suggestion: "Avoid NSAIDs with Lithium. Use Paracetamol for pain relief instead.",
    confidence: "high",
  },
  {
    drugs: ["clopidogrel", "aspirin"],
    verdict: "yellow",
    reason: "Dual antiplatelet therapy increases bleeding risk significantly, including GI and intracranial bleeding.",
    suggestion: "Only use together under cardiology supervision for specific indications (ACS, stent). Use a PPI to protect the stomach.",
    confidence: "high",
  },
  {
    drugs: ["atorvastatin", "grapefruit"],
    verdict: "red",
    reason: "Grapefruit inhibits CYP3A4, increasing Atorvastatin plasma levels 2-3x, raising myopathy/rhabdomyolysis risk.",
    suggestion: "Avoid grapefruit and grapefruit juice while on Atorvastatin.",
    confidence: "high",
  },
  {
    drugs: ["simvastatin", "grapefruit"],
    verdict: "red",
    reason: "Grapefruit juice dramatically increases Simvastatin plasma concentration, causing muscle damage (rhabdomyolysis).",
    suggestion: "Do not consume grapefruit products while taking Simvastatin.",
    confidence: "high",
  },
  // ── Caution (Yellow) ────────────────────────────────────────────────────────
  {
    drugs: ["lisinopril", "ashwagandha"],
    verdict: "yellow",
    reason: "Ashwagandha has mild antihypertensive and adaptogenic effects that may potentiate Lisinopril's blood pressure lowering.",
    suggestion: "Monitor blood pressure 2x daily for the first 2 weeks. Report dizziness or lightheadedness.",
    confidence: "high",
  },
  {
    drugs: ["lisinopril", "potassium"],
    verdict: "yellow",
    reason: "Lisinopril is potassium-sparing (an ACE inhibitor). Concurrent potassium supplements can cause dangerous hyperkalemia.",
    suggestion: "Avoid potassium supplements unless prescribed. Monitor serum potassium levels every 3 months.",
    confidence: "high",
  },
  {
    drugs: ["amlodipine", "grapefruit"],
    verdict: "yellow",
    reason: "Grapefruit inhibits CYP3A4, increasing Amlodipine levels and potentially causing excessive blood pressure lowering.",
    suggestion: "Avoid large amounts of grapefruit. Small quantities are generally tolerated.",
    confidence: "medium",
  },
  {
    drugs: ["metformin", "turmeric"],
    verdict: "yellow",
    reason: "Turmeric (curcumin) has mild hypoglycemic effects that may complement Metformin's action.",
    suggestion: "Monitor blood glucose levels. Small culinary amounts of turmeric are generally safe.",
    confidence: "medium",
  },
  {
    drugs: ["warfarin", "turmeric"],
    verdict: "yellow",
    reason: "High-dose turmeric supplements have antiplatelet properties and may enhance Warfarin's anticoagulant effect.",
    suggestion: "Culinary use is fine. Avoid high-dose curcumin/turmeric supplements. Monitor INR.",
    confidence: "medium",
  },
  {
    drugs: ["aspirin", "ginkgo"],
    verdict: "yellow",
    reason: "Ginkgo biloba inhibits platelet activating factor. Combined with Aspirin, bleeding risk increases.",
    suggestion: "Avoid Ginkgo supplements with Aspirin therapy. Report any unusual bruising or prolonged bleeding.",
    confidence: "high",
  },
  {
    drugs: ["gabapentin", "ashwagandha"],
    verdict: "yellow",
    reason: "Both have CNS-depressant and anxiolytic properties. Additive sedation may occur.",
    suggestion: "Avoid driving or heavy machinery if combining. Start Ashwagandha at low dose.",
    confidence: "medium",
  },
  {
    drugs: ["levothyroxine", "soy"],
    verdict: "yellow",
    reason: "Soy isoflavones can reduce absorption of Levothyroxine by up to 30%.",
    suggestion: "Take Levothyroxine at least 4 hours before or after soy products. Monitor TSH every 3 months.",
    confidence: "high",
  },
  {
    drugs: ["levothyroxine", "calcium"],
    verdict: "yellow",
    reason: "Calcium supplements bind to Levothyroxine in the gut, reducing absorption significantly.",
    suggestion: "Take Levothyroxine on an empty stomach first thing in the morning, and calcium supplements at least 4 hours later.",
    confidence: "high",
  },
  {
    drugs: ["ciprofloxacin", "milk"],
    verdict: "yellow",
    reason: "Dairy products (calcium) chelate fluoroquinolone antibiotics, reducing absorption by up to 50%.",
    suggestion: "Take Ciprofloxacin 2 hours before or 6 hours after dairy products or calcium-rich foods.",
    confidence: "high",
  },
  {
    drugs: ["tetracycline", "milk"],
    verdict: "yellow",
    reason: "Calcium in dairy chelates Tetracycline, reducing its absorption and effectiveness.",
    suggestion: "Take Tetracycline 1 hour before or 2 hours after dairy products.",
    confidence: "high",
  },
  {
    drugs: ["amlodipine", "ashwagandha"],
    verdict: "yellow",
    reason: "Ashwagandha has antihypertensive properties and may potentiate blood pressure reduction with Amlodipine.",
    suggestion: "Monitor blood pressure weekly for the first month. Report dizziness or fainting.",
    confidence: "medium",
  },
  {
    drugs: ["methotrexate", "nsaids"],
    verdict: "red",
    reason: "NSAIDs reduce renal clearance of Methotrexate, causing toxicity (mucositis, bone marrow suppression).",
    suggestion: "Avoid ibuprofen, aspirin, and other NSAIDs while on Methotrexate. Use Paracetamol for pain.",
    confidence: "high",
  },
  {
    drugs: ["pantoprazole", "clopidogrel"],
    verdict: "yellow",
    reason: "Pantoprazole (and other PPIs) inhibit CYP2C19, reducing conversion of Clopidogrel to its active form.",
    suggestion: "Consider switching to Rabeprazole (less CYP2C19 inhibition) if gastroprotection is needed with Clopidogrel.",
    confidence: "high",
  },
  {
    drugs: ["amiodarone", "simvastatin"],
    verdict: "red",
    reason: "Amiodarone inhibits CYP3A4, dramatically increasing Simvastatin plasma levels and causing rhabdomyolysis.",
    suggestion: "Do not exceed Simvastatin 20mg when on Amiodarone. Consider switching to Rosuvastatin.",
    confidence: "high",
  },
  {
    drugs: ["metformin", "contrast dye"],
    verdict: "red",
    reason: "IV iodinated contrast used in CT scans can cause acute kidney injury, leading to Metformin accumulation and lactic acidosis.",
    suggestion: "Always inform radiology about Metformin use before any contrast procedure. It may need to be stopped 48h before.",
    confidence: "high",
  },
  {
    drugs: ["iron", "calcium"],
    verdict: "yellow",
    reason: "Calcium inhibits iron absorption when taken together.",
    suggestion: "Take iron supplements 2 hours before or after calcium supplements for optimal absorption.",
    confidence: "high",
  },
  {
    drugs: ["iron", "tea"],
    verdict: "yellow",
    reason: "Tannins in tea bind dietary iron and inhibit its absorption by up to 60%.",
    suggestion: "Avoid tea/coffee within 1 hour of taking iron supplements. Take iron with Vitamin C to enhance absorption.",
    confidence: "high",
  },
  {
    drugs: ["folic acid", "methotrexate"],
    verdict: "yellow",
    reason: "Folic acid supplementation can reduce Methotrexate's side effects (mucositis, liver toxicity) but watch for reduced efficacy in cancer.",
    suggestion: "Folic acid is recommended alongside Methotrexate for rheumatoid arthritis. Consult your rheumatologist about timing.",
    confidence: "high",
  },
  {
    drugs: ["tramadol", "ssri"],
    verdict: "red",
    reason: "Tramadol + SSRIs increase serotonin and lower seizure threshold. Can cause serotonin syndrome and seizures.",
    suggestion: "Avoid this combination. Consult your doctor for an alternative pain reliever.",
    confidence: "high",
  },
  {
    drugs: ["codeine", "alcohol"],
    verdict: "red",
    reason: "Both are CNS depressants. Combination causes dangerous respiratory depression that can be fatal.",
    suggestion: "Never consume alcohol while on codeine or any opioid-containing medication.",
    confidence: "high",
  },
  {
    drugs: ["paracetamol", "alcohol"],
    verdict: "yellow",
    reason: "Chronic alcohol use combined with Paracetamol (even at normal doses) significantly increases risk of hepatotoxicity.",
    suggestion: "Avoid Paracetamol if you consume alcohol regularly. Use the minimum effective dose and never exceed 2g/day.",
    confidence: "high",
  },
  {
    drugs: ["dexamethasone", "ibuprofen"],
    verdict: "yellow",
    reason: "Combining corticosteroids with NSAIDs greatly increases risk of GI ulcers and bleeding.",
    suggestion: "Add a PPI (e.g. Pantoprazole) for gastroprotection if both must be used. Use for shortest possible duration.",
    confidence: "high",
  },
  {
    drugs: ["prednisolone", "nsaids"],
    verdict: "yellow",
    reason: "Corticosteroids + NSAIDs = high GI bleeding risk.",
    suggestion: "Always use a PPI such as Omeprazole for gastric protection if this combination is prescribed.",
    confidence: "high",
  },
  {
    drugs: ["atorvastatin", "amiodarone"],
    verdict: "red",
    reason: "Amiodarone raises Atorvastatin plasma levels significantly via CYP3A4 inhibition, causing muscle damage.",
    suggestion: "Use the lowest effective Atorvastatin dose (max 20mg). Consider Rosuvastatin which has less CYP3A4 dependence.",
    confidence: "high",
  },
  {
    drugs: ["phenytoin", "folic acid"],
    verdict: "yellow",
    reason: "Phenytoin reduces folate absorption. Low folate leads to megaloblastic anaemia, but high folate can reduce Phenytoin levels.",
    suggestion: "Supplementation with folate is recommended, but Phenytoin levels must be monitored closely.",
    confidence: "high",
  },
  {
    drugs: ["rifampicin", "oral contraceptives"],
    verdict: "red",
    reason: "Rifampicin is a powerful CYP3A4 inducer that dramatically reduces contraceptive hormone levels, causing contraceptive failure.",
    suggestion: "Use additional non-hormonal contraception during and for 4 weeks after Rifampicin therapy.",
    confidence: "high",
  },
  {
    drugs: ["rifampicin", "warfarin"],
    verdict: "red",
    reason: "Rifampicin strongly induces CYP2C9, dramatically reducing Warfarin levels and anticoagulant effect, risking thrombosis.",
    suggestion: "INR must be monitored weekly during and after Rifampicin therapy. Warfarin dose will need significant increase.",
    confidence: "high",
  },
  {
    drugs: ["tamsulosin", "sildenafil"],
    verdict: "yellow",
    reason: "Both cause vasodilation. Combination can cause significant postural hypotension and fainting.",
    suggestion: "Start Sildenafil at the lowest dose (25mg) if already on Tamsulosin. Avoid taking close together in time.",
    confidence: "high",
  },
  {
    drugs: ["spironolactone", "potassium"],
    verdict: "red",
    reason: "Spironolactone is a potassium-sparing diuretic. Adding potassium supplements causes dangerous hyperkalemia.",
    suggestion: "Avoid potassium supplements, potassium-rich salt substitutes, and potassium supplements while on Spironolactone.",
    confidence: "high",
  },
  {
    drugs: ["valproate", "carbapenem"],
    verdict: "red",
    reason: "Carbapenem antibiotics reduce Valproate levels by ~80%, leading to seizures.",
    suggestion: "Avoid carbapenems (Meropenem, Imipenem) in patients on Valproate. Use alternative antibiotics.",
    confidence: "high",
  },
  {
    drugs: ["allopurinol", "azathioprine"],
    verdict: "red",
    reason: "Allopurinol inhibits xanthine oxidase, reducing azathioprine metabolism and causing severe bone marrow toxicity.",
    suggestion: "Reduce azathioprine dose to 25% of normal when combined with Allopurinol. Frequent blood counts required.",
    confidence: "high",
  },
  {
    drugs: ["clarithromycin", "simvastatin"],
    verdict: "red",
    reason: "Clarithromycin inhibits CYP3A4, raising Simvastatin concentrations 10-fold, causing rhabdomyolysis.",
    suggestion: "Hold Simvastatin for the duration of Clarithromycin therapy. Resume after completing antibiotics.",
    confidence: "high",
  },
  {
    drugs: ["fluconazole", "warfarin"],
    verdict: "red",
    reason: "Fluconazole inhibits CYP2C9, substantially increasing Warfarin levels and bleeding risk.",
    suggestion: "Monitor INR daily for the first 3-5 days of Fluconazole therapy. Warfarin dose reduction will likely be needed.",
    confidence: "high",
  },
  {
    drugs: ["metformin", "fenugreek"],
    verdict: "yellow",
    reason: "Fenugreek (methi) has hypoglycemic properties and may potentiate Metformin's glucose-lowering effect.",
    suggestion: "Monitor blood glucose more frequently. Small culinary amounts are generally fine.",
    confidence: "medium",
  },
  {
    drugs: ["insulin", "karela"],
    verdict: "red",
    reason: "Karela has insulin-like properties. Combined with exogenous insulin, severe hypoglycemia can occur.",
    suggestion: "Do not use karela supplements with insulin therapy. Inform your diabetes care team if you use karela regularly.",
    confidence: "high",
  },
  {
    drugs: ["nifedipine", "grapefruit"],
    verdict: "yellow",
    reason: "Grapefruit inhibits CYP3A4, increasing Nifedipine plasma levels and causing excessive blood pressure lowering and headaches.",
    suggestion: "Avoid grapefruit juice while on Nifedipine.",
    confidence: "high",
  },
  {
    drugs: ["tacrolimus", "grapefruit"],
    verdict: "red",
    reason: "Grapefruit dramatically increases Tacrolimus levels via CYP3A4 inhibition, causing nephrotoxicity and rejection crises.",
    suggestion: "Completely avoid grapefruit and grapefruit juice if on Tacrolimus.",
    confidence: "high",
  },
  {
    drugs: ["bisoprolol", "verapamil"],
    verdict: "red",
    reason: "Both slow heart rate and AV conduction. Combined use causes bradycardia and complete heart block.",
    suggestion: "These drugs are generally contraindicated together. Seek cardiology advice.",
    confidence: "high",
  },
  {
    drugs: ["omeprazole", "vitamin b12"],
    verdict: "yellow",
    reason: "Long-term PPI use reduces gastric acid needed for Vitamin B12 absorption from food.",
    suggestion: "Supplement with Vitamin B12 if on long-term PPI therapy (>1 year). Monitor B12 levels annually.",
    confidence: "medium",
  },
];

/**
 * Try to find a known interaction between a new drug and the patient's existing medicines.
 * Returns the first matching rule result, or null if no match (→ fallback to Gemini).
 */
export function lookupInteraction(
  newDrug: string,
  existingDrugs: string[]
): RuleInteractionResult | null {
  const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9\s]/g, "").trim();
  const newNorm = norm(newDrug);

  for (const rule of RULES) {
    const [a, b] = rule.drugs;
    // Check if newDrug matches either side of the pair
    const newMatchesA = newNorm.includes(a) || a.includes(newNorm.split(" ")[0]);
    const newMatchesB = newNorm.includes(b) || b.includes(newNorm.split(" ")[0]);

    if (newMatchesA || newMatchesB) {
      // Check if any existing medicine matches the OTHER side
      const target = newMatchesA ? b : a;
      const existingMatch = existingDrugs.find((e) => {
        const en = norm(e);
        return en.includes(target) || target.includes(en.split(" ")[0]);
      });

      if (existingMatch) {
        return {
          verdict: rule.verdict,
          medicines: [newDrug, existingMatch],
          reason: rule.reason,
          suggestion: rule.suggestion,
          confidence: rule.confidence,
          source: "rules",
        };
      }
    }
  }

  return null; // No match → proceed to Gemini
}
