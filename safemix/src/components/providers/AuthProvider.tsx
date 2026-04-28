"use client";

import { createContext, useContext, useEffect, useState } from "react";
// Removed firebase/auth dependencies to bypass console blockers completely

interface AuthContextType {
  user: any | null;
  loading: boolean;
  loginLocal: (uid: string, phone: string) => void;
  logoutLocal: () => void;
}

const AuthContext = createContext<AuthContextType>({ 
  user: null, 
  loading: true,
  loginLocal: () => {},
  logoutLocal: () => {}
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Hackathon Bypass: Read user directly from local storage
    const storedUid = localStorage.getItem("safemix_uid");
    const storedPhone = localStorage.getItem("safemix_phone");
    
    if (storedUid) {
      setUser({ uid: storedUid, phoneNumber: storedPhone || "Unknown" });
    } else {
      setUser(null);
    }
    
    setLoading(false);
  }, []);

  // Expose a helper to easily login/logout locally without Firebase API
  const loginLocal = (uid: string, phone: string) => {
    localStorage.setItem("safemix_uid", uid);
    localStorage.setItem("safemix_phone", phone);
    setUser({ uid, phoneNumber: phone });
  };

  const logoutLocal = () => {
    localStorage.removeItem("safemix_uid");
    localStorage.removeItem("safemix_phone");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, loginLocal, logoutLocal } as any}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
