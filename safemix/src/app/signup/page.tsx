"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import SafeMixLogo from "@/components/ui/Logo";
import { Check, ArrowRight, ShieldCheck, AlertCircle } from "lucide-react";
import { doc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import { useAuth } from "@/components/providers/AuthProvider";

const roles = [
  { id: "patient", label: "Patient", desc: "Managing my own medicines", icon: "person" },
  { id: "caregiver", label: "Caregiver", desc: "Managing medicines for family", icon: "family_restroom" },
];

const conditionsList = ["Diabetes", "Hypertension", "Thyroid", "Asthma", "Heart Disease"];

export default function SignupPage() {
  const router = useRouter();
  const { loginLocal } = useAuth();
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  const [role, setRole] = useState("patient");
  const [form, setForm] = useState({
    name: "",
    phone: "",
    age: "",
    sex: "prefer_not_to_say",
    conditions: [] as string[]
  });
  const [consentGiven, setConsentGiven] = useState(false);

  const toggleCondition = (cond: string) => {
    setForm(prev => ({
      ...prev,
      conditions: prev.conditions.includes(cond) 
        ? prev.conditions.filter(c => c !== cond)
        : [...prev.conditions, cond]
    }));
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    if (form.phone.length < 10) {
      setError("Please enter a valid 10-digit phone number.");
      return;
    }
    
    if (!consentGiven) {
      setError("You must accept the DPDP consent notice to continue.");
      return;
    }

    setLoading(true);
    
    try {
      // 1. Generate unique local ID
      const localUid = "user_" + Math.random().toString(36).substr(2, 9) + Date.now();
      const formattedPhone = form.phone.startsWith("+") ? form.phone : `+91${form.phone}`;

      // 2. Save directly to Firestore completely bypassing Firebase Auth
      // We run this asynchronously without 'await' so that if Firebase Firestore fails to connect on localhost,
      // it doesn't freeze the user interface indefinitely. It will just queue in the background.
      setDoc(doc(db, "users", localUid), {
        role,
        displayName: form.name,
        phoneNumber: formattedPhone,
        ageBand: form.age,
        sex: form.sex,
        conditions: form.conditions,
        abhaLinkageStatus: "pending",
        consentVersion: "v1.0",
        createdAt: new Date().toISOString()
      }).catch(err => console.error("Firestore Sync Deferred:", err));

      // 3. Authenticate locally via Context & LocalStorage
      loginLocal(localUid, formattedPhone);

      // 4. Launch immediately
      router.push("/dashboard");
      
    } catch (err: any) {
      console.error("Signup failed:", err);
      setError("An unexpected error occurred. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-[#FBF9F6] dark:bg-[#1A1F1B]">
      
      <div className="hidden lg:flex flex-col justify-between w-[42%] relative overflow-hidden p-12 bg-[#D0E9D5] dark:bg-[#2A3B30]">
        <Link href="/"><SafeMixLogo size={36} textSize="text-xl" /></Link>
        <div className="relative z-10">
          <h2 className="font-manrope font-bold text-4xl text-[#0B1F14] dark:text-[#E1F9E5] mb-5 leading-tight">
            SafeMix <br /> Dual-Medicine Intelligence
          </h2>
          <p className="text-[#374B3D] dark:text-[#B5CCBA] text-lg mb-10">
            India's first safety layer for Allopathic + AYUSH medications.
          </p>
          <div className="space-y-3">
            {["Red/Yellow/Green safety verdicts","Understand deep interactions in plain language","Works for 8 Indian medicine systems"].map((f) => (
              <div key={f} className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-[#465B4C]/20 flex items-center justify-center flex-shrink-0">
                  <Check className="w-3.5 h-3.5 text-[#465B4C] dark:text-[#E1F9E5]" />
                </div>
                <span className="text-[#374B3D] dark:text-[#B5CCBA] text-sm">{f}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center px-6 py-10 overflow-y-auto">
        <div className="w-full max-w-md">
          <div className="lg:hidden mb-8">
            <Link href="/"><SafeMixLogo size={30} textSize="text-lg" /></Link>
          </div>

          <div className="mb-7">
            <h1 className="font-manrope font-bold text-3xl text-[#1B1C1A] dark:text-[#E3E2E0] mb-2">
              Create Profile
            </h1>
            <p className="text-[#434843] dark:text-[#C3C8C1]">
              Help the AI understand your baseline for accurate safety verdicts.
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 rounded-xl bg-[#FFDAD6] border border-[#93000A]/20 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-[#BA1A1A] flex-shrink-0" />
              <p className="text-sm text-[#93000A]">{error}</p>
            </div>
          )}

          <form onSubmit={handleSignup} className="space-y-5">
            
            <div className="grid grid-cols-2 gap-3">
              {roles.map((r) => (
                <button key={r.id} type="button" onClick={() => setRole(r.id)}
                  className={`flex flex-col items-center p-3 rounded-xl border-2 transition-all ${
                    role === r.id
                      ? "border-[#465B4C] bg-[#D0E9D5]/30 text-[#0B1F14] dark:border-[#B5CCBA] dark:bg-[#465b4c]/20 dark:text-[#E1F9E5]"
                      : "border-[#E3E2E0] bg-white text-[#434843] dark:border-[#434843] dark:bg-[#2A312B] dark:text-[#C3C8C1]"
                  }`}
                >
                  <span className="material-symbols-outlined mb-1">{r.icon}</span>
                  <span className="text-xs font-semibold">{r.label}</span>
                </button>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="block text-xs font-semibold text-[#434843] dark:text-[#C3C8C1] uppercase tracking-widest mb-1.5">Full Name</label>
                <input required type="text" placeholder="e.g. Ramesh Kumar" value={form.name} onChange={e => setForm({...form, name: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl border-2 border-[#E3E2E0] dark:border-[#434843] bg-white dark:bg-[#1A1F1B] focus:border-[#465B4C] outline-none transition-colors" />
              </div>
              
              <div>
                <label className="block text-xs font-semibold text-[#434843] dark:text-[#C3C8C1] uppercase tracking-widest mb-1.5">Age</label>
                <input required type="number" placeholder="e.g. 58" value={form.age} onChange={e => setForm({...form, age: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl border-2 border-[#E3E2E0] dark:border-[#434843] bg-white dark:bg-[#1A1F1B] focus:border-[#465B4C] outline-none transition-colors" />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#434843] dark:text-[#C3C8C1] uppercase tracking-widest mb-1.5">Sex</label>
                <select value={form.sex} onChange={e => setForm({...form, sex: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl border-2 border-[#E3E2E0] dark:border-[#434843] bg-white dark:bg-[#1A1F1B] focus:border-[#465B4C] outline-none transition-colors appearance-none">
                  <option value="prefer_not_to_say">Select...</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#434843] dark:text-[#C3C8C1] uppercase tracking-widest mb-2">Known Conditions</label>
              <div className="flex flex-wrap gap-2">
                {conditionsList.map(cond => (
                  <button key={cond} type="button" onClick={() => toggleCondition(cond)}
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors ${
                      form.conditions.includes(cond)
                        ? "bg-[#465B4C] text-white border-[#465B4C]"
                        : "bg-white text-[#434843] border-[#C3C8C1] dark:bg-[#2A312B] dark:text-[#C3C8C1] dark:border-[#737873]"
                    }`}>
                    {cond}
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-2">
              <label className="block text-xs font-semibold text-[#434843] dark:text-[#C3C8C1] uppercase tracking-widest mb-1.5">Phone Number (For Login)</label>
              <div className="flex gap-2">
                <div className="px-4 py-3 rounded-xl border-2 border-[#E3E2E0] dark:border-[#434843] bg-[#F5F3F1] dark:bg-[#222823] text-[#434843] font-semibold">
                  +91
                </div>
                <input required type="tel" placeholder="98765 43210" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})}
                  className="flex-1 px-4 py-3 rounded-xl border-2 border-[#E3E2E0] dark:border-[#434843] bg-white dark:bg-[#1A1F1B] focus:border-[#465B4C] outline-none transition-colors" />
              </div>
            </div>

            <div className="bg-[#D0E9D5]/30 dark:bg-[#222823] p-4 rounded-xl flex gap-3 items-start border border-[#B5CCBA]/30">
              <ShieldCheck className="w-5 h-5 text-[#465B4C] dark:text-[#B5CCBA] flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-xs text-[#374B3D] dark:text-[#C3C8C1] leading-relaxed mb-2">
                  <strong className="text-[#0B1F14] dark:text-[#E1F9E5]">DPDP Act 2023 Consent:</strong> We collect your age, sex, and health info strictly to calculate accurate medicine safety interactions. Your data is encrypted and never sold.
                </p>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={consentGiven} onChange={e => setConsentGiven(e.target.checked)} className="w-4 h-4 rounded text-[#465B4C] focus:ring-[#465B4C] bg-white" />
                  <span className="text-xs font-semibold text-[#0B1F14] dark:text-[#E3E2E0]">I agree to the secure processing of my health data.</span>
                </label>
              </div>
            </div>

            <button type="submit" disabled={loading} className="w-full py-4 rounded-full font-semibold text-white bg-[#465B4C] hover:bg-[#4E6354] transition-all flex justify-center items-center gap-2 shadow-primary disabled:opacity-70">
              {loading ? <div className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin"/> : <>Enter SafeMix <ArrowRight className="w-4 h-4"/></>}
            </button>

          </form>
        </div>
      </div>
    </div>
  );
}
