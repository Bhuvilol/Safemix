"use client";
import { useState, useEffect } from "react";
import { Plus, Edit3, Trash2, Search, AlertTriangle, CheckCircle, AlertCircle, Save, X, Database } from "lucide-react";
import { db } from "@/lib/firebase/config";
import {
  collection, getDocs, addDoc, updateDoc, deleteDoc, doc, Timestamp
} from "firebase/firestore";

interface Medicine {
  id?: string;
  name: string;
  system: string;
  interactions: string[];
  contraindications: string;
  commonDose: string;
  createdAt?: number;
}

const SYSTEMS = ["Allopathic", "Ayurvedic", "OTC", "Herbal", "Supplement", "Home Remedy"];

const SEED_MEDICINES: Omit<Medicine, "id">[] = [
  { name: "Metformin", system: "Allopathic", interactions: ["Karela", "Alcohol", "Contrast dye"], contraindications: "Kidney failure, Liver disease", commonDose: "500-1000mg twice daily", createdAt: Date.now() },
  { name: "Ashwagandha", system: "Ayurvedic", interactions: ["Benzodiazepines", "CNS depressants", "Thyroid medications"], contraindications: "Pregnancy, Autoimmune diseases", commonDose: "300-500mg daily", createdAt: Date.now() },
  { name: "Karela Juice", system: "Ayurvedic", interactions: ["Metformin", "Insulin", "Glibenclamide"], contraindications: "Hypoglycemia risk, Pregnancy", commonDose: "30-50ml on empty stomach", createdAt: Date.now() },
  { name: "Aspirin", system: "Allopathic", interactions: ["Warfarin", "Ibuprofen", "Mulethi"], contraindications: "Bleeding disorders, Peptic ulcer", commonDose: "75-325mg daily", createdAt: Date.now() },
];

const verdictBg: Record<string, string> = {
  Allopathic: "bg-blue-100 text-blue-700",
  Ayurvedic: "bg-emerald-100 text-emerald-700",
  OTC: "bg-purple-100 text-purple-700",
  Herbal: "bg-green-100 text-green-700",
  Supplement: "bg-sky-100 text-sky-700",
  "Home Remedy": "bg-amber-100 text-amber-700",
};

export default function AdminPage() {
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showAdd, setShowAdd] = useState(false);
  const [saving, setSaving] = useState(false);
  const [newMed, setNewMed] = useState<Omit<Medicine, "id">>({
    name: "", system: "Allopathic", interactions: [], contraindications: "", commonDose: "", createdAt: Date.now(),
  });
  const [newInteraction, setNewInteraction] = useState("");

  useEffect(() => {
    loadMedicines();
  }, []);

  const loadMedicines = async () => {
    setLoading(true);
    try {
      const snap = await getDocs(collection(db, "medicines"));
      if (snap.empty) {
        // Seed with defaults
        const seeded: Medicine[] = [];
        for (const m of SEED_MEDICINES) {
          const ref = await addDoc(collection(db, "medicines"), { ...m, createdAt: Timestamp.now() });
          seeded.push({ ...m, id: ref.id });
        }
        setMedicines(seeded);
      } else {
        setMedicines(snap.docs.map((d) => ({ id: d.id, ...d.data() } as Medicine)));
      }
    } catch {
      // Firestore unavailable — use seed data locally
      setMedicines(SEED_MEDICINES.map((m, i) => ({ ...m, id: `local_${i}` })));
    }
    setLoading(false);
  };

  const addMedicine = async () => {
    if (!newMed.name.trim()) return;
    setSaving(true);
    try {
      const ref = await addDoc(collection(db, "medicines"), { ...newMed, createdAt: Timestamp.now() });
      setMedicines((prev) => [...prev, { ...newMed, id: ref.id }]);
    } catch {
      setMedicines((prev) => [...prev, { ...newMed, id: `local_${Date.now()}` }]);
    }
    setNewMed({ name: "", system: "Allopathic", interactions: [], contraindications: "", commonDose: "", createdAt: Date.now() });
    setShowAdd(false);
    setSaving(false);
  };

  const deleteMedicine = async (id: string) => {
    if (!confirm("Delete this medicine entry?")) return;
    try { await deleteDoc(doc(db, "medicines", id)); } catch { /* offline */ }
    setMedicines((prev) => prev.filter((m) => m.id !== id));
  };

  const filtered = medicines.filter((m) =>
    m.name.toLowerCase().includes(search.toLowerCase()) ||
    m.system.toLowerCase().includes(search.toLowerCase())
  );

  const inputCls = "w-full px-3 py-2 rounded-xl border border-[#e0e8e2] bg-[#F8F8F4] text-[#1a2820] text-sm focus:border-[#5E7464] outline-none";

  return (
    <div>
      <div className="max-w-6xl mx-auto space-y-6">

        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#5E7464] flex items-center justify-center">
              <Database className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="font-manrope font-bold text-2xl text-[#1a2820]">SafeMix Admin</h1>
              <p className="text-xs text-[#7a9080]">Medicine Database Editor · {medicines.length} entries</p>
            </div>
          </div>
          <button onClick={() => setShowAdd(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-[#42594A] text-white rounded-xl text-sm font-semibold shadow-md hover:shadow-lg transition-all">
            <Plus className="w-4 h-4" /> Add Medicine
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: "Total Entries", value: medicines.length, color: "#5E7464" },
            { label: "Allopathic", value: medicines.filter((m) => m.system === "Allopathic").length, color: "#3B82F6" },
            { label: "Traditional", value: medicines.filter((m) => ["Ayurvedic", "Herbal", "Home Remedy"].includes(m.system)).length, color: "#10B981" },
          ].map((s) => (
            <div key={s.label} className="bg-white rounded-2xl border border-[#e0e8e2] p-5">
              <p className="text-2xl font-manrope font-bold" style={{ color: s.color }}>{s.value}</p>
              <p className="text-xs text-[#7a9080] mt-1">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9ab0a0]" />
          <input type="text" placeholder="Search medicine name or system…"value={search} onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-11 pr-4 py-3 rounded-2xl border border-[#e0e8e2] bg-white text-sm focus:border-[#5E7464] outline-none" />
        </div>

        {/* Add Form */}
        {showAdd && (
          <div className="bg-white rounded-3xl border-2 border-[#5E7464]/30 p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-[#1a2820]">New Medicine Entry</h3>
              <button onClick={() => setShowAdd(false)} className="text-[#9ab0a0] hover:text-[#52615a]"><X className="w-4 h-4" /></button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#52615a] uppercase tracking-widest mb-1.5">Medicine Name *</label>
                <input type="text" placeholder="e.g. Metformin" value={newMed.name}
                  onChange={(e) => setNewMed({ ...newMed, name: e.target.value })} className={inputCls} />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#52615a] uppercase tracking-widest mb-1.5">System</label>
                <select value={newMed.system} onChange={(e) => setNewMed({ ...newMed, system: e.target.value })} className={inputCls}>
                  {SYSTEMS.map((s) => <option key={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#52615a] uppercase tracking-widest mb-1.5">Common Dose</label>
                <input type="text" placeholder="e.g. 500mg twice daily" value={newMed.commonDose}
                  onChange={(e) => setNewMed({ ...newMed, commonDose: e.target.value })} className={inputCls} />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#52615a] uppercase tracking-widest mb-1.5">Contraindications</label>
                <input type="text" placeholder="e.g. Kidney failure" value={newMed.contraindications}
                  onChange={(e) => setNewMed({ ...newMed, contraindications: e.target.value })} className={inputCls} />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#52615a] uppercase tracking-widest mb-1.5">Known Interactions</label>
              <div className="flex gap-2 mb-2">
                <input type="text" placeholder="Add interacting medicine…" value={newInteraction}
                  onChange={(e) => setNewInteraction(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter" && newInteraction.trim()) { setNewMed({ ...newMed, interactions: [...newMed.interactions, newInteraction.trim()] }); setNewInteraction(""); } }}
                  className={`flex-1 ${inputCls}`} />
                <button onClick={() => { if (newInteraction.trim()) { setNewMed({ ...newMed, interactions: [...newMed.interactions, newInteraction.trim()] }); setNewInteraction(""); } }}
                  className="px-4 py-2 bg-[#42594A] text-white rounded-xl text-sm font-semibold">Add</button>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {newMed.interactions.map((it, i) => (
                  <span key={i} className="flex items-center gap-1 px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-bold">
                    {it}
                    <button onClick={() => setNewMed({ ...newMed, interactions: newMed.interactions.filter((_, j) => j !== i) })}><X className="w-3 h-3" /></button>
                  </span>
                ))}
              </div>
            </div>
            <button onClick={addMedicine} disabled={saving}
              className="w-full py-3 bg-[#42594A] text-white text-sm font-semibold rounded-xl flex items-center justify-center gap-2 hover:shadow-lg transition-all disabled:opacity-70">
              <Save className="w-4 h-4" /> {saving ? "Saving…" : "Save to Database"}
            </button>
          </div>
        )}

        {/* Table */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 rounded-full border-4 border-[#5E7464] border-t-transparent animate-spin" />
          </div>
        ) : (
          <div className="bg-white rounded-3xl border border-[#e0e8e2] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[#f0f4f1] bg-[#f8faf8]">
                    <th className="text-left px-6 py-4 text-xs font-bold text-[#52615a] uppercase tracking-widest">Medicine</th>
                    <th className="text-left px-4 py-4 text-xs font-bold text-[#52615a] uppercase tracking-widest">System</th>
                    <th className="text-left px-4 py-4 text-xs font-bold text-[#52615a] uppercase tracking-widest hidden md:table-cell">Known Interactions</th>
                    <th className="text-left px-4 py-4 text-xs font-bold text-[#52615a] uppercase tracking-widest hidden lg:table-cell">Dose</th>
                    <th className="px-4 py-4" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#f0f4f1]">
                  {filtered.map((m) => (
                    <tr key={m.id} className="hover:bg-[#f8faf8] transition-colors group">
                      <td className="px-6 py-4">
                        <p className="font-semibold text-[#1a2820]">{m.name}</p>
                        {m.contraindications && <p className="text-[10px] text-red-500 mt-0.5 truncate max-w-[180px]">⚠ {m.contraindications}</p>}
                      </td>
                      <td className="px-4 py-4">
                        <span className={`text-[10px] font-black px-2 py-0.5 rounded-full uppercase ${verdictBg[m.system] || "bg-gray-100 text-gray-700"}`}>{m.system}</span>
                      </td>
                      <td className="px-4 py-4 hidden md:table-cell">
                        <div className="flex flex-wrap gap-1">
                          {(m.interactions || []).slice(0, 3).map((ix) => (
                            <span key={ix} className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-red-50 text-red-600 border border-red-100">{ix}</span>
                          ))}
                          {(m.interactions || []).length > 3 && <span className="text-[10px] text-[#9ab0a0]">+{m.interactions.length - 3}</span>}
                        </div>
                      </td>
                      <td className="px-4 py-4 hidden lg:table-cell">
                        <p className="text-xs text-[#7a9080]">{m.commonDose || "—"}</p>
                      </td>
                      <td className="px-4 py-4">
                        <button onClick={() => deleteMedicine(m.id!)}
                          className="w-8 h-8 rounded-xl hover:bg-red-50 flex items-center justify-center text-[#9ab0a0] hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {filtered.length === 0 && (
                <div className="py-16 text-center">
                  <Database className="w-10 h-10 text-[#c3d4c8] mx-auto mb-3" />
                  <p className="text-sm font-medium text-[#1a2820]">No medicines found</p>
                  <p className="text-xs text-[#9ab0a0] mt-1">Try a different search or add a new entry</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
