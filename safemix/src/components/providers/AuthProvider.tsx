"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged, signOut, type User } from "firebase/auth";
import { auth } from "@/lib/firebase/config";
import { useRouter, usePathname } from "next/navigation";

// ─── Public routes that don't require auth ────────────────────────────────────
const PUBLIC_PATHS = ["/", "/login", "/signup", "/onboarding", "/features", "/pricing", "/faq", "/contact", "/security", "/doctors"];

interface AuthContextType {
  user: User | null;
  loading: boolean;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  logout: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);

      const isPublic = PUBLIC_PATHS.some(
        (p) => pathname === p || pathname.startsWith(p + "/")
      );

      if (!firebaseUser && !isPublic) {
        // Not logged in and on a protected page → redirect to login
        router.replace("/login");
      }

      if (firebaseUser && (pathname === "/login" || pathname === "/signup")) {
        // Already logged in → skip auth pages
        router.replace("/dashboard");
      }
    });

    return () => unsub();
  }, [pathname, router]);

  const logout = async () => {
    await signOut(auth);
    router.replace("/login");
  };

  return (
    <AuthContext.Provider value={{ user, loading, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
