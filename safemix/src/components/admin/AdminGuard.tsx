"use client";

import { useEffect, useState } from "react";
import { ShieldAlert, Loader2 } from "lucide-react";
import { useAuth } from "@/components/providers/AuthProvider";
import { useRouter } from "next/navigation";

export default function AdminGuard({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [roleLoading, setRoleLoading] = useState(true);
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    (async () => {
      if (loading) return;
      if (!user) {
        router.replace("/login");
        return;
      }
      try {
        const token = await user.getIdTokenResult();
        const role = (token.claims.role as string | undefined) ?? "";
        const ok = role === "admin" || role === "reviewer" || role === "doctor";
        setAllowed(ok);
      } catch {
        setAllowed(false);
      } finally {
        setRoleLoading(false);
      }
    })();
  }, [user, loading, router]);

  if (loading || roleLoading) {
    return <div className="flex items-center justify-center py-20"><Loader2 className="w-6 h-6 animate-spin text-[#5E7464]" /></div>;
  }

  if (!allowed) {
    return (
      <div className="max-w-xl mx-auto bg-white border border-[#e0e8e2] rounded-3xl p-8 text-center">
        <ShieldAlert className="w-10 h-10 text-red-500 mx-auto mb-3" />
        <h2 className="font-manrope font-bold text-xl text-[#1a2820]">Admin access required</h2>
        <p className="text-sm text-[#7a9080] mt-2">
          Your account does not have admin/reviewer/doctor claims for this dashboard.
        </p>
      </div>
    );
  }

  return <>{children}</>;
}
