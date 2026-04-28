"use client";

import { createContext, useContext, useEffect, useState, useRef } from "react";
import { onAuthStateChanged, signOut, type User } from "firebase/auth";
import { auth } from "@/lib/firebase/config";
import { useRouter, usePathname } from "next/navigation";
import { migrateLocalStorageToFirestore } from "@/lib/firebase/firestore";
import { requestNotificationPermission } from "@/lib/firebase/messaging";

// ─── Public routes that don't require auth ────────────────────────────────────
const PUBLIC_PATHS = ["/", "/login", "/signup", "/onboarding", "/features", "/pricing", "/faq", "/contact", "/security", "/doctors", "/doctor-portal"];

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
  const migratedRef = useRef<string | null>(null); // track which uid we've already migrated
  const initializedRef = useRef(false);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);
      initializedRef.current = true;

      const isPublic = PUBLIC_PATHS.some(
        (p) => pathname === p || pathname.startsWith(p + "/")
      );

      // Avoid premature guard redirects before auth state is fully initialized.
      if (!firebaseUser && !isPublic && initializedRef.current) {
        router.replace("/login");
        return;
      }

      if (firebaseUser && (pathname === "/login" || pathname === "/signup")) {
        router.replace("/dashboard");
      }

      // ── On login: run one-time migration + FCM setup ──────────────────────
      if (firebaseUser && migratedRef.current !== firebaseUser.uid) {
        migratedRef.current = firebaseUser.uid;

        // 1. Migrate localStorage → Firestore (non-blocking)
        migrateLocalStorageToFirestore(firebaseUser.uid).catch(console.error);

        // 2. Request notification permission + save FCM token
        requestNotificationPermission().catch(console.error);
      }
    });

    return () => unsub();
  }, [pathname, router]);

  const logout = async () => {
    migratedRef.current = null;
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
