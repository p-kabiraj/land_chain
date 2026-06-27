import { createContext, useContext, useEffect, useMemo, useState } from "react";

export interface UserProfile {
  fullName: string;
  email: string;
  wallet: string;
  phone: string;
}

interface AuthContextValue {
  user: UserProfile | null;
  setUser: (user: UserProfile | null) => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);
const USER_STORAGE_KEY = "landchain_current_user";

function loadStoredUser(): UserProfile | null {
  if (typeof window === "undefined") return null;
  try {
    const stored = window.localStorage.getItem(USER_STORAGE_KEY);
    return stored ? (JSON.parse(stored) as UserProfile) : null;
  } catch {
    return null;
  }
}

function saveUser(user: UserProfile | null) {
  if (typeof window === "undefined") return;
  if (user) {
    window.localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
  } else {
    window.localStorage.removeItem(USER_STORAGE_KEY);
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUserState] = useState<UserProfile | null>(null);

  useEffect(() => {
    const stored = loadStoredUser();
    if (stored) {
      setUserState(stored);
    }
  }, []);

  const value = useMemo(
    () => ({
      user,
      setUser(userProfile: UserProfile | null) {
        setUserState(userProfile);
        saveUser(userProfile);
      },
    }),
    [user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
