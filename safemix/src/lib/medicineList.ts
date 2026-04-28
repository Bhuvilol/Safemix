/**
 * Curated list of common Indian medicines across all systems.
 * Covers Allopathic, Ayurvedic, OTC, Herbal, Home Remedies, and Supplements.
 */

export interface MedicineSuggestion {
  name: string;
  system: "Allopathic" | "Ayurvedic" | "Herbal" | "OTC" | "Home Remedy" | "Supplement";
  commonUse: string;
}

export const MEDICINE_DATABASE: MedicineSuggestion[] = [
  // Allopathic - Diabetes
  { name: "Metformin 500mg", system: "Allopathic", commonUse: "Type 2 Diabetes" },
  { name: "Metformin 1000mg", system: "Allopathic", commonUse: "Type 2 Diabetes" },
  { name: "Glimepiride 1mg", system: "Allopathic", commonUse: "Type 2 Diabetes" },
  { name: "Sitagliptin 100mg", system: "Allopathic", commonUse: "Type 2 Diabetes" },
  { name: "Insulin Glargine", system: "Allopathic", commonUse: "Diabetes (Insulin)" },

  // Allopathic - Hypertension
  { name: "Lisinopril 10mg", system: "Allopathic", commonUse: "Blood Pressure" },
  { name: "Amlodipine 5mg", system: "Allopathic", commonUse: "Blood Pressure" },
  { name: "Telmisartan 40mg", system: "Allopathic", commonUse: "Blood Pressure" },
  { name: "Atenolol 50mg", system: "Allopathic", commonUse: "Blood Pressure / Heart" },
  { name: "Losartan 50mg", system: "Allopathic", commonUse: "Blood Pressure" },

  // Allopathic - Cholesterol
  { name: "Atorvastatin 10mg", system: "Allopathic", commonUse: "Cholesterol" },
  { name: "Rosuvastatin 10mg", system: "Allopathic", commonUse: "Cholesterol" },

  // Allopathic - Thyroid
  { name: "Levothyroxine 50mcg", system: "Allopathic", commonUse: "Hypothyroidism" },
  { name: "Levothyroxine 100mcg", system: "Allopathic", commonUse: "Hypothyroidism" },

  // Allopathic - Pain/Fever
  { name: "Paracetamol 500mg", system: "Allopathic", commonUse: "Pain / Fever" },
  { name: "Ibuprofen 400mg", system: "Allopathic", commonUse: "Pain / Anti-inflammatory" },
  { name: "Aspirin 75mg", system: "Allopathic", commonUse: "Blood Thinner / Cardiac" },
  { name: "Diclofenac 50mg", system: "Allopathic", commonUse: "Pain / Anti-inflammatory" },

  // Allopathic - Stomach
  { name: "Omeprazole 20mg", system: "Allopathic", commonUse: "Acidity / GERD" },
  { name: "Pantoprazole 40mg", system: "Allopathic", commonUse: "Acidity / GERD" },
  { name: "Ranitidine 150mg", system: "Allopathic", commonUse: "Acidity" },
  { name: "Domperidone 10mg", system: "Allopathic", commonUse: "Nausea / Vomiting" },

  // Allopathic - Antibiotics
  { name: "Amoxicillin 500mg", system: "Allopathic", commonUse: "Bacterial Infection" },
  { name: "Azithromycin 500mg", system: "Allopathic", commonUse: "Bacterial Infection" },
  { name: "Ciprofloxacin 500mg", system: "Allopathic", commonUse: "UTI / Infection" },

  // Allopathic - Mental Health
  { name: "Escitalopram 10mg", system: "Allopathic", commonUse: "Depression / Anxiety" },
  { name: "Sertraline 50mg", system: "Allopathic", commonUse: "Depression / Anxiety" },
  { name: "Alprazolam 0.25mg", system: "Allopathic", commonUse: "Anxiety" },
  { name: "Clonazepam 0.5mg", system: "Allopathic", commonUse: "Anxiety / Seizures" },

  // Allopathic - Respiratory
  { name: "Montelukast 10mg", system: "Allopathic", commonUse: "Asthma / Allergy" },
  { name: "Salbutamol Inhaler", system: "Allopathic", commonUse: "Asthma (Rescue)" },
  { name: "Cetirizine 10mg", system: "Allopathic", commonUse: "Allergy" },
  { name: "Fexofenadine 120mg", system: "Allopathic", commonUse: "Allergy" },

  // Ayurvedic
  { name: "Ashwagandha", system: "Ayurvedic", commonUse: "Stress / Immunity" },
  { name: "Triphala", system: "Ayurvedic", commonUse: "Digestion / Detox" },
  { name: "Karela (Bitter Gourd) Juice", system: "Ayurvedic", commonUse: "Blood Sugar" },
  { name: "Gurmar (Gymnema Sylvestre)", system: "Ayurvedic", commonUse: "Blood Sugar" },
  { name: "Arjuna Bark Extract", system: "Ayurvedic", commonUse: "Heart Health" },
  { name: "Shatavari", system: "Ayurvedic", commonUse: "Women's Health / Immunity" },
  { name: "Brahmi", system: "Ayurvedic", commonUse: "Memory / Cognitive" },
  { name: "Giloy (Guduchi)", system: "Ayurvedic", commonUse: "Immunity / Fever" },
  { name: "Haritaki", system: "Ayurvedic", commonUse: "Digestion / Detox" },
  { name: "Neem Capsules", system: "Ayurvedic", commonUse: "Skin / Blood Purifier" },
  { name: "Tulsi Extract", system: "Ayurvedic", commonUse: "Immunity / Respiratory" },
  { name: "Mulethi (Liquorice Root)", system: "Ayurvedic", commonUse: "Throat / Cough" },
  { name: "Punarnava", system: "Ayurvedic", commonUse: "Kidney / Diuretic" },
  { name: "Gokshura (Tribulus)", system: "Ayurvedic", commonUse: "Kidney / Urinary" },

  // Herbal / Supplements
  { name: "Vitamin D3 60000 IU", system: "Supplement", commonUse: "Vitamin D Deficiency" },
  { name: "Vitamin B12 1000mcg", system: "Supplement", commonUse: "B12 Deficiency" },
  { name: "Omega-3 Fish Oil 1000mg", system: "Supplement", commonUse: "Heart / Joints" },
  { name: "Calcium + Vitamin D3", system: "Supplement", commonUse: "Bone Health" },
  { name: "Iron + Folic Acid", system: "Supplement", commonUse: "Anaemia" },
  { name: "Zinc 50mg", system: "Supplement", commonUse: "Immunity" },
  { name: "Magnesium Glycinate", system: "Supplement", commonUse: "Muscle / Sleep" },
  { name: "Multivitamin", system: "Supplement", commonUse: "General Wellness" },

  // Home Remedies
  { name: "Haldi Doodh (Turmeric Milk)", system: "Home Remedy", commonUse: "Immunity / Inflammation" },
  { name: "Adrak Chai (Ginger Tea)", system: "Home Remedy", commonUse: "Cold / Digestion" },
  { name: "Honey + Lemon", system: "Home Remedy", commonUse: "Cold / Throat" },
  { name: "Jeera Water", system: "Home Remedy", commonUse: "Digestion / Bloating" },
  { name: "Methi Seeds (Fenugreek)", system: "Home Remedy", commonUse: "Blood Sugar / Digestion" },
  { name: "Ajwain Water", system: "Home Remedy", commonUse: "Gas / Indigestion" },
  { name: "Amla Juice", system: "Home Remedy", commonUse: "Immunity / Vitamin C" },
  { name: "Aloe Vera Juice", system: "Home Remedy", commonUse: "Skin / Digestion" },
];

export function searchMedicines(query: string, limit = 7): MedicineSuggestion[] {
  if (!query || query.length < 2) return [];
  const q = query.toLowerCase();
  return MEDICINE_DATABASE.filter(
    (m) =>
      m.name.toLowerCase().includes(q) ||
      m.commonUse.toLowerCase().includes(q) ||
      m.system.toLowerCase().includes(q)
  ).slice(0, limit);
}
