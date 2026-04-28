"use client";
import { useEffect, useState } from "react";
import { Plus, MoreHorizontal, Heart, Shield, Activity, UserPlus, X, KeyRound, AlertTriangle, Trash2 } from "lucide-react";
import { useAuth } from "@/components/providers/AuthProvider";
import {
  type FamilyProfile,
  MAX_DEPENDENTS,
  getProfiles,
  loadFromFirestore,
  addProfile,
  removeProfile,
  verifyPin,
  consentExpired,
  setActiveProfileId,
  getActiveProfileId,
} from "@/lib/family/profiles";

const RELATIONSHIPS = ["Self", "Mother", "Father", "Spouse", "Child", "Sibling", "Other"];

const COLORS = ["#5E7464", "#3B82F6", "#8B5CF6", "#EC4899", "#F59E0B", "#06B6D4"];
function colorFor(seed: string) {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  return COLORS[h % COLORS.length];
}

export default function FamilyProfilesPage() {
  const { user } = useAuth();
  const [profiles, setProfiles] = useState<FamilyProfile[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [showAdd, setShowAdd] = useState(false);
  const [pinPrompt, setPinPrompt] = useState<{ profile: FamilyProfile } | null>(null);
  const [pinInput, setPinInput] = useState("");
  const [pinError, setPinError] = useState<string | null>(null);

  useEffect(() => {
    setProfiles(getProfiles());
    setActiveId(getActiveProfileId());
    if (user?.uid) {
      loadFromFirestore(user.uid).then(setProfiles).catch(console.error);
    }
  }, [user?.uid]);

  const handleSwitch = async (p: FamilyProfile) => {
    if (p.pinHash) {
      setPinPrompt({ profile: p });
      setPinInput("");
      setPinError(null);
      return;
    }
    setActiveProfileId(p.id);
    setActiveId(p.id);
  };

  const handleVerifyPin = async () => {
    if (!pinPrompt) return;
    const ok = await verifyPin(pinPrompt.profile, pinInput);
    if (ok) {
      setActiveProfileId(pinPrompt.profile.id);
      setActiveId(pinPrompt.profile.id);
      setPinPrompt(null);
    } else {
      setPinError("Incorrect PIN. Try again.");
    }
  };

  const handleDelete = async (p: FamilyProfile) => {
    if (!confirm(`Remove ${p.name}'s profile? Their regimen will be deleted.`)) return;
    await removeProfile(user?.uid ?? null, p.id);
    setProfiles(getProfiles());
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="font-manrope font-bold text-2xl text-[#1a2820]">Family Profiles</h1>
          <p className="text-sm text-[#7a9080] mt-1">
            Manage up to {MAX_DEPENDENTS} dependents under your caregiver account. Each dependent has its own consent PIN, refreshed every 90 days.
          </p>
        </div>
        {profiles.length < MAX_DEPENDENTS && (
          <button
            onClick={() => setShowAdd(true)}
            className="flex items-center gap-2 px-6 py-3 bg-[#42594A] text-white rounded-2xl text-sm font-semibold shadow-md hover:shadow-xl transition-all w-full md:w-auto justify-center"
          >
            <UserPlus className="w-4 h-4" />
            Add Family Profile
          </button>
        )}
      </div>

      {profiles.length === 0 && (
        <div className="rounded-3xl border-2 border-dashed border-[#c3d4c8] p-12 text-center text-[#7a9080]">
          <UserPlus className="w-12 h-12 mx-auto mb-3 text-[#9ab0a0]" />
          <p className="font-semibold text-[#52615a]">No profiles yet</p>
          <p className="text-xs mt-1">Add your first family member to get started.</p>
        </div>
      )}

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {profiles.map((member) => {
          const initial = member.name.charAt(0).toUpperCase();
          const expired = consentExpired(member);
          const isActive = activeId === member.id;
          return (
            <div
              key={member.id}
              className={`bg-white rounded-3xl border p-6 flex flex-col items-center text-center group transition-all relative overflow-hidden ${
                isActive ? "border-[#5E7464] shadow-[0_12px_40px_rgba(0,0,0,0.08)]" : "border-[#e0e8e2] hover:border-[#5E7464]/30 hover:shadow-[0_12px_40px_rgba(0,0,0,0.06)]"
              }`}
            >
              {isActive && (
                <span className="absolute top-3 left-3 text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#5E7464] text-white">ACTIVE</span>
              )}
              <button
                onClick={() => handleDelete(member)}
                title="Remove profile"
                className="absolute top-3 right-3 w-8 h-8 rounded-full bg-[#F8F8F4] flex items-center justify-center text-[#9ab0a0] hover:text-red-500 hover:bg-red-50 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>

              <div
                className="w-20 h-20 rounded-[30px] flex items-center justify-center text-2xl font-bold font-manrope text-white mb-4 shadow-lg group-hover:scale-105 transition-transform mt-4"
                style={{ background: colorFor(member.id) }}
              >
                {initial}
              </div>

              <h3 className="font-manrope font-bold text-lg text-[#1a2820]">{member.name}</h3>
              <p className="text-xs font-semibold text-[#9ab0a0] uppercase tracking-widest mt-1">
                {member.relationship}
                {member.yob ? ` • ${new Date().getFullYear() - member.yob}y` : ""}
              </p>

              {expired && (
                <div className="mt-3 px-3 py-1.5 rounded-full bg-amber-50 border border-amber-200 text-[10px] font-bold text-amber-700 flex items-center gap-1.5">
                  <AlertTriangle className="w-3 h-3" /> Consent expired — re-confirm
                </div>
              )}

              <div className="w-full h-px bg-[#f0f4f1] my-6" />

              <div className="grid grid-cols-2 gap-4 w-full">
                <div>
                  <p className="text-[10px] font-bold text-[#9ab0a0] uppercase tracking-tighter">Consent</p>
                  <p className="text-sm font-bold text-[#1a2820] mt-1">
                    {member.pinHash ? "PIN locked" : "Self-managed"}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-[#9ab0a0] uppercase tracking-tighter">Sex</p>
                  <p className="text-sm font-bold text-[#1a2820] mt-1">{member.sex ?? "—"}</p>
                </div>
              </div>

              <button
                onClick={() => handleSwitch(member)}
                className="w-full mt-6 py-3 rounded-2xl bg-[#F8F8F4] border border-[#e0e8e2] text-xs font-bold text-[#52615a] hover:bg-[#42594A] hover:text-white hover:border-[#42594A] transition-all"
              >
                {isActive ? "Currently active" : member.pinHash ? "Switch (PIN required)" : "Switch to Profile"}
              </button>
            </div>
          );
        })}

        {profiles.length < MAX_DEPENDENTS && (
          <button
            onClick={() => setShowAdd(true)}
            className="border-2 border-dashed border-[#c3d4c8] rounded-3xl p-6 flex flex-col items-center justify-center gap-4 text-[#9ab0a0] hover:border-[#5E7464] hover:text-[#5E7464] hover:bg-[#F8F8F4] transition-all min-h-[260px]"
          >
            <div className="w-16 h-16 rounded-full bg-[#f0f5f1] flex items-center justify-center">
              <Plus className="w-8 h-8" />
            </div>
            <p className="font-bold text-sm">Add New Profile</p>
            <p className="text-xs">{profiles.length}/{MAX_DEPENDENTS} used</p>
          </button>
        )}
      </div>

      {/* Feature cards (PRD §15 caregiver role responsibilities) */}
      <div className="grid md:grid-cols-3 gap-6 pt-6">
        {[
          { icon: Shield, title: "Caregiver Privacy", desc: "Each dependent has its own 4-digit PIN. We re-prompt every 90 days." },
          { icon: Heart, title: "Shared Reminders", desc: "Get notified when a dependent skips a dose or misses a refill." },
          { icon: Activity, title: "Combined Reports", desc: "View one regimen review per dependent — never co-mingled." },
        ].map((f) => (
          <div key={f.title} className="p-6 rounded-3xl bg-white border border-[#e0e8e2] flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-[#5E7464]/10 flex items-center justify-center flex-shrink-0">
              <f.icon className="w-5 h-5 text-[#5E7464]" />
            </div>
            <div>
              <h4 className="font-manrope font-bold text-[#1a2820] text-sm mb-1">{f.title}</h4>
              <p className="text-xs text-[#7a9080] leading-relaxed">{f.desc}</p>
            </div>
          </div>
        ))}
      </div>

      {showAdd && (
        <AddProfileModal
          onClose={() => setShowAdd(false)}
          onCreated={(p) => {
            setProfiles((prev) => [p, ...prev]);
            setShowAdd(false);
          }}
          uid={user?.uid ?? null}
        />
      )}

      {pinPrompt && (
        <PinPromptModal
          profile={pinPrompt.profile}
          pinInput={pinInput}
          setPinInput={setPinInput}
          error={pinError}
          onVerify={handleVerifyPin}
          onClose={() => setPinPrompt(null)}
        />
      )}
    </div>
  );
}

function AddProfileModal(props: {
  onClose: () => void;
  onCreated: (p: FamilyProfile) => void;
  uid: string | null;
}) {
  const [name, setName] = useState("");
  const [relationship, setRelationship] = useState("Mother");
  const [yob, setYob] = useState<string>("");
  const [sex, setSex] = useState<"F" | "M" | "X" | "">("");
  const [allergies, setAllergies] = useState("");
  const [conditions, setConditions] = useState("");
  const [pin, setPin] = useState("");
  const [pinConfirm, setPinConfirm] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const requiresPin = relationship !== "Self";

  const submit = async () => {
    setErr(null);
    if (!name.trim()) return setErr("Name is required.");
    if (requiresPin) {
      if (!/^\d{4}$/.test(pin)) return setErr("PIN must be exactly 4 digits.");
      if (pin !== pinConfirm) return setErr("PINs do not match.");
    }
    setSubmitting(true);
    try {
      const created = await addProfile(props.uid, {
        name: name.trim(),
        relationship,
        yob: yob ? Number(yob) : undefined,
        sex: sex || undefined,
        allergies: allergies.trim() || undefined,
        conditions: conditions.trim() || undefined,
        pin: requiresPin ? pin : undefined,
      });
      props.onCreated(created);
    } catch (e) {
      setErr((e as Error).message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-3xl w-full max-w-md p-6 md:p-8 shadow-xl max-h-[92vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-manrope font-bold text-lg text-[#1a2820]">Add Family Profile</h2>
          <button onClick={props.onClose} className="text-[#9ab0a0] hover:text-[#52615a]"><X className="w-5 h-5" /></button>
        </div>
        <div className="space-y-4">
          <Field label="Full Name *">
            <input value={name} onChange={(e) => setName(e.target.value)} className="w-full px-4 py-3 rounded-2xl bg-[#F8F8F4] border border-[#e0e8e2] text-sm focus:border-[#5E7464] outline-none" />
          </Field>
          <Field label="Relationship *">
            <select value={relationship} onChange={(e) => setRelationship(e.target.value)} className="w-full px-4 py-3 rounded-2xl bg-[#F8F8F4] border border-[#e0e8e2] text-sm focus:border-[#5E7464] outline-none">
              {RELATIONSHIPS.map((r) => <option key={r}>{r}</option>)}
            </select>
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Year of Birth">
              <input value={yob} onChange={(e) => setYob(e.target.value.replace(/\D/g, "").slice(0, 4))} placeholder="1958" className="w-full px-4 py-3 rounded-2xl bg-[#F8F8F4] border border-[#e0e8e2] text-sm focus:border-[#5E7464] outline-none" />
            </Field>
            <Field label="Sex">
              <select value={sex} onChange={(e) => setSex(e.target.value as "F" | "M" | "X" | "")} className="w-full px-4 py-3 rounded-2xl bg-[#F8F8F4] border border-[#e0e8e2] text-sm focus:border-[#5E7464] outline-none">
                <option value="">—</option>
                <option value="F">Female</option>
                <option value="M">Male</option>
                <option value="X">Other / Prefer not to say</option>
              </select>
            </Field>
          </div>
          <Field label="Allergies (optional)">
            <input value={allergies} onChange={(e) => setAllergies(e.target.value)} placeholder="penicillin, sulfa, peanut…" className="w-full px-4 py-3 rounded-2xl bg-[#F8F8F4] border border-[#e0e8e2] text-sm focus:border-[#5E7464] outline-none" />
          </Field>
          <Field label="Chronic Conditions (optional)">
            <input value={conditions} onChange={(e) => setConditions(e.target.value)} placeholder="T2DM, HTN, hypothyroid…" className="w-full px-4 py-3 rounded-2xl bg-[#F8F8F4] border border-[#e0e8e2] text-sm focus:border-[#5E7464] outline-none" />
          </Field>

          {requiresPin && (
            <div className="rounded-2xl bg-[#f0f8f2] border border-[#cfe9d5] p-4 space-y-3">
              <div className="flex items-center gap-2 text-[#42594A] font-semibold text-xs">
                <KeyRound className="w-4 h-4" /> 4-digit consent PIN
              </div>
              <p className="text-[11px] text-[#52615a]">Required for any non-self profile so caregivers can&apos;t silently switch context.</p>
              <input value={pin} onChange={(e) => setPin(e.target.value.replace(/\D/g, "").slice(0, 4))} placeholder="••••" className="w-full px-4 py-3 rounded-xl bg-white border border-[#cfe9d5] text-center tracking-widest font-mono outline-none" />
              <input value={pinConfirm} onChange={(e) => setPinConfirm(e.target.value.replace(/\D/g, "").slice(0, 4))} placeholder="Confirm PIN" className="w-full px-4 py-3 rounded-xl bg-white border border-[#cfe9d5] text-center tracking-widest font-mono outline-none" />
            </div>
          )}

          {err && <p className="text-sm text-red-600">{err}</p>}

          <button
            onClick={submit}
            disabled={submitting}
            className="w-full py-3 rounded-2xl bg-[#42594A] text-white text-sm font-semibold disabled:opacity-60"
          >
            {submitting ? "Adding…" : "Add Profile"}
          </button>
        </div>
      </div>
    </div>
  );
}

function PinPromptModal(props: {
  profile: FamilyProfile;
  pinInput: string;
  setPinInput: (v: string) => void;
  error: string | null;
  onVerify: () => void;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-3xl w-full max-w-sm p-6 shadow-xl text-center">
        <div className="w-14 h-14 rounded-2xl bg-[#f0f8f2] flex items-center justify-center mx-auto mb-3">
          <KeyRound className="w-6 h-6 text-[#42594A]" />
        </div>
        <h3 className="font-manrope font-bold text-base text-[#1a2820]">Enter PIN for {props.profile.name}</h3>
        <p className="text-xs text-[#7a9080] mt-1">4-digit consent code set when this profile was created.</p>
        <input
          autoFocus
          value={props.pinInput}
          onChange={(e) => props.setPinInput(e.target.value.replace(/\D/g, "").slice(0, 4))}
          onKeyDown={(e) => e.key === "Enter" && props.onVerify()}
          placeholder="••••"
          className="w-full px-4 py-4 rounded-2xl bg-[#F8F8F4] border border-[#e0e8e2] text-center tracking-widest font-mono text-2xl mt-5 outline-none"
        />
        {props.error && <p className="text-xs text-red-600 mt-3">{props.error}</p>}
        <div className="flex gap-3 mt-5">
          <button onClick={props.onClose} className="flex-1 py-3 rounded-2xl border border-[#e0e8e2] text-sm font-semibold text-[#52615a]">Cancel</button>
          <button onClick={props.onVerify} className="flex-1 py-3 rounded-2xl bg-[#42594A] text-white text-sm font-semibold">Unlock</button>
        </div>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="text-xs font-semibold text-[#52615a] mb-1.5 inline-block">{label}</span>
      {children}
    </label>
  );
}
