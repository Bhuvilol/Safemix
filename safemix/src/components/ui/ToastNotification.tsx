"use client";
import { X, Bell } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export interface ToastMessage {
  id: string;
  title: string;
  body: string;
  href?: string;
}

let _addToast: ((msg: Omit<ToastMessage, "id">) => void) | null = null;

/** Call this from anywhere to trigger a toast */
export function showToast(msg: Omit<ToastMessage, "id">) {
  _addToast?.(msg);
}

export function ToastContainer() {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  useEffect(() => {
    _addToast = (msg) => {
      const id = `toast_${Date.now()}`;
      setToasts((prev) => [{ ...msg, id }, ...prev].slice(0, 4));
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, 8000);
    };
    return () => { _addToast = null; };
  }, []);

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-3 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="pointer-events-auto bg-white border border-[#e0e8e2] rounded-2xl shadow-2xl p-4 flex items-start gap-3 animate-slide-up"
        >
          <div className="w-9 h-9 rounded-xl bg-[#5E7464]/10 flex items-center justify-center flex-shrink-0">
            <Bell className="w-4 h-4 text-[#5E7464]" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-bold text-sm text-[#1a2820] leading-tight">{toast.title}</p>
            <p className="text-xs text-[#7a9080] mt-0.5 leading-relaxed">{toast.body}</p>
            {toast.href && (
              <Link href={toast.href} className="text-xs font-semibold text-[#5E7464] mt-1 inline-block hover:underline">
                View reminders →
              </Link>
            )}
          </div>
          <button
            onClick={() => setToasts((prev) => prev.filter((t) => t.id !== toast.id))}
            className="text-[#9ab0a0] hover:text-[#52615a] transition-colors flex-shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
}
