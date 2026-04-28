"use client";
/**
 * Admin module 4 — Content & Notifications (PRD §8.3 m4).
 *
 * Compose multilingual help articles + push campaigns. Articles are stored in
 * `content/{id}` with a `bodyByLang` map; campaigns in `campaigns/{id}` with
 * an FCM topic, schedule, and per-language body.
 */
import { useEffect, useState } from "react";
import { collection, addDoc, getDocs, deleteDoc, doc, Timestamp, orderBy, query } from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import { Megaphone, Plus, Send, Trash2, Loader2, Globe } from "lucide-react";
import { LANGUAGES } from "@/lib/i18n";

type Tab = "articles" | "campaigns";

interface Article {
  id?: string;
  slug: string;
  titleByLang: Record<string, string>;
  bodyByLang: Record<string, string>;
  publishedAt?: number;
}

interface Campaign {
  id?: string;
  topic: string;
  scheduleAt: number;
  bodyByLang: Record<string, string>;
  status: "draft" | "scheduled" | "sent";
  createdAt: number;
}

export default function ContentAdminPage() {
  const [tab, setTab] = useState<Tab>("articles");

  return (
    <div className="space-y-5">
      <div>
        <h1 className="font-manrope font-bold text-2xl text-[#1a2820] flex items-center gap-2">
          <Megaphone className="w-5 h-5 text-[#5E7464]" /> Content &amp; Notifications
        </h1>
        <p className="text-sm text-[#7a9080] mt-0.5">
          Multilingual help articles and FCM push campaigns. Editors keep one row per language; the app picks the right one via the i18n picker.
        </p>
      </div>

      <div className="flex gap-2">
        {(["articles", "campaigns"] as Tab[]).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2 rounded-xl text-sm font-semibold ${tab === t ? "bg-[#42594A] text-white" : "bg-white border border-[#e0e8e2] text-[#52615a]"}`}
          >
            {t === "articles" ? "Help articles" : "Push campaigns"}
          </button>
        ))}
      </div>

      {tab === "articles" ? <ArticlesPanel /> : <CampaignsPanel />}
    </div>
  );
}

function ArticlesPanel() {
  const [items, setItems] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [draft, setDraft] = useState<Article | null>(null);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const snap = await getDocs(query(collection(db, "content"), orderBy("publishedAt", "desc")));
      setItems(snap.docs.map((d) => ({ id: d.id, ...d.data() } as Article)));
    } finally { setLoading(false); }
  };
  useEffect(() => { load(); }, []);

  const save = async () => {
    if (!draft || !draft.slug.trim()) return;
    setSaving(true);
    try {
      await addDoc(collection(db, "content"), { ...draft, publishedAt: Date.now(), createdAt: Timestamp.now() });
      setDraft(null);
      await load();
    } finally { setSaving(false); }
  };

  return (
    <div className="space-y-4">
      <button onClick={() => setDraft({ slug: "", titleByLang: { en: "" }, bodyByLang: { en: "" } })} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#42594A] text-white text-sm font-semibold">
        <Plus className="w-4 h-4" /> New article
      </button>

      {loading ? (
        <Loader2 className="w-6 h-6 animate-spin text-[#5E7464]" />
      ) : items.length === 0 ? (
        <div className="bg-white border border-[#e0e8e2] rounded-2xl p-10 text-center text-[#9ab0a0] text-sm">No articles yet.</div>
      ) : items.map((a) => (
        <div key={a.id} className="bg-white border border-[#e0e8e2] rounded-2xl p-4 flex items-center justify-between">
          <div>
            <p className="font-bold text-[#1a2820]">{a.titleByLang.en || a.slug}</p>
            <p className="text-xs text-[#7a9080]">
              <Globe className="inline w-3 h-3 mr-1" />
              {Object.keys(a.titleByLang).join(" · ")}
            </p>
          </div>
          <button onClick={async () => { if (a.id) { await deleteDoc(doc(db, "content", a.id)); await load(); } }} className="w-9 h-9 rounded-xl border border-[#e0e8e2] flex items-center justify-center text-red-500 hover:bg-red-50">
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ))}

      {draft && <ArticleEditor draft={draft} setDraft={setDraft} saving={saving} onSave={save} />}
    </div>
  );
}

function ArticleEditor({ draft, setDraft, saving, onSave }: { draft: Article; setDraft: (a: Article | null) => void; saving: boolean; onSave: () => void }) {
  const set = (k: keyof Article, v: Article[keyof Article]) => setDraft({ ...draft, [k]: v } as Article);
  const setLang = (kind: "titleByLang" | "bodyByLang", code: string, val: string) =>
    setDraft({ ...draft, [kind]: { ...draft[kind], [code]: val } });

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl w-full max-w-2xl p-6 max-h-[92vh] overflow-y-auto">
        <h2 className="font-manrope font-bold text-lg text-[#1a2820] mb-4">New article</h2>
        <input value={draft.slug} onChange={(e) => set("slug", e.target.value.toLowerCase().replace(/\s+/g, "-"))} placeholder="article-slug" className="w-full px-3 py-2 rounded-xl border border-[#e0e8e2] mb-4 text-sm" />
        <div className="space-y-4">
          {LANGUAGES.slice(0, 6).map((l) => (
            <div key={l.code} className="border border-[#e0e8e2] rounded-2xl p-3">
              <p className="text-xs font-bold text-[#52615a] mb-2">{l.native} · {l.label}</p>
              <input
                value={draft.titleByLang[l.code] ?? ""}
                onChange={(e) => setLang("titleByLang", l.code, e.target.value)}
                placeholder="Title"
                className="w-full px-3 py-2 rounded-xl border border-[#e0e8e2] text-sm mb-2"
              />
              <textarea
                rows={3}
                value={draft.bodyByLang[l.code] ?? ""}
                onChange={(e) => setLang("bodyByLang", l.code, e.target.value)}
                placeholder="Body (markdown)"
                className="w-full px-3 py-2 rounded-xl border border-[#e0e8e2] text-sm resize-none"
              />
            </div>
          ))}
        </div>
        <div className="flex gap-3 mt-4">
          <button onClick={() => setDraft(null)} className="flex-1 py-3 rounded-2xl border border-[#e0e8e2] text-sm font-semibold">Cancel</button>
          <button onClick={onSave} disabled={saving || !draft.slug.trim()} className="flex-1 py-3 rounded-2xl bg-[#42594A] text-white text-sm font-semibold disabled:opacity-50">
            {saving ? "Publishing…" : "Publish"}
          </button>
        </div>
      </div>
    </div>
  );
}

function CampaignsPanel() {
  const [items, setItems] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [topic, setTopic] = useState("all-users");
  const [body, setBody] = useState("");
  const [scheduleAt, setScheduleAt] = useState(() => new Date(Date.now() + 60 * 60 * 1000).toISOString().slice(0, 16));
  const [sending, setSending] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const snap = await getDocs(query(collection(db, "campaigns"), orderBy("createdAt", "desc")));
      setItems(snap.docs.map((d) => ({ id: d.id, ...d.data() } as Campaign)));
    } finally { setLoading(false); }
  };
  useEffect(() => { load(); }, []);

  const submit = async () => {
    if (!body.trim()) return;
    setSending(true);
    try {
      await addDoc(collection(db, "campaigns"), {
        topic,
        scheduleAt: new Date(scheduleAt).getTime(),
        bodyByLang: { en: body },
        status: "scheduled",
        createdAt: Date.now(),
      } satisfies Campaign);
      setBody("");
      await load();
    } finally { setSending(false); }
  };

  return (
    <div className="space-y-4">
      <div className="bg-white border border-[#e0e8e2] rounded-2xl p-5 space-y-3">
        <h3 className="font-bold text-[#1a2820]">New push campaign</h3>
        <div className="grid grid-cols-2 gap-3">
          <input value={topic} onChange={(e) => setTopic(e.target.value)} placeholder="FCM topic" className="px-3 py-2 rounded-xl border border-[#e0e8e2] text-sm" />
          <input type="datetime-local" value={scheduleAt} onChange={(e) => setScheduleAt(e.target.value)} className="px-3 py-2 rounded-xl border border-[#e0e8e2] text-sm" />
        </div>
        <textarea rows={2} value={body} onChange={(e) => setBody(e.target.value)} placeholder="Push body (English)…" className="w-full px-3 py-2 rounded-xl border border-[#e0e8e2] text-sm resize-none" />
        <button onClick={submit} disabled={sending || !body.trim()} className="px-4 py-2 rounded-xl bg-[#42594A] text-white text-sm font-semibold flex items-center gap-2 disabled:opacity-50">
          <Send className="w-4 h-4" /> {sending ? "Scheduling…" : "Schedule"}
        </button>
      </div>

      {loading ? (
        <Loader2 className="w-6 h-6 animate-spin text-[#5E7464]" />
      ) : items.length === 0 ? (
        <div className="bg-white border border-[#e0e8e2] rounded-2xl p-10 text-center text-[#9ab0a0] text-sm">No campaigns yet.</div>
      ) : items.map((c) => (
        <div key={c.id} className="bg-white border border-[#e0e8e2] rounded-2xl p-4">
          <div className="flex items-center justify-between mb-1">
            <p className="font-bold text-[#1a2820]">{c.topic}</p>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#f0f5f1] text-[#42594A] uppercase">{c.status}</span>
          </div>
          <p className="text-xs text-[#7a9080]">Send at {new Date(c.scheduleAt).toLocaleString("en-IN")}</p>
          <p className="text-sm text-[#52615a] mt-2">{c.bodyByLang.en}</p>
        </div>
      ))}
    </div>
  );
}
