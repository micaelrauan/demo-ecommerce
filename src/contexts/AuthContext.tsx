"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { supabase } from "@/lib/supabase";
import type {
  AuthChangeEvent,
  Session,
  User as SupabaseUser,
} from "@supabase/supabase-js";

interface User {
  id: string;
  name: string;
  email: string;
  isAdmin: boolean;
  role: "admin" | "cliente";
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const USER_CACHE_KEY = "demo-ecommerce-user-cache";
const SESSION_HEALTHCHECK_INTERVAL_MS = 5 * 60 * 1000;
const SESSION_REFRESH_THRESHOLD_SECONDS = 5 * 60;

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchUserRole = async (
    userId: string,
  ): Promise<"admin" | "cliente"> => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", userId)
        .single();

      if (error || !data) {
        console.error("Erro ao buscar role do usuário:", error);
        return "cliente";
      }

      return data.role as "admin" | "cliente";
    } catch (error) {
      console.error("Erro ao buscar role:", error);
      return "cliente";
    }
  };

  const cacheUser = (nextUser: User | null) => {
    if (typeof window === "undefined") {
      return;
    }

    if (nextUser) {
      window.localStorage.setItem(USER_CACHE_KEY, JSON.stringify(nextUser));
      return;
    }

    window.localStorage.removeItem(USER_CACHE_KEY);
  };

  const getCachedUser = (): User | null => {
    if (typeof window === "undefined") {
      return null;
    }

    const raw = window.localStorage.getItem(USER_CACHE_KEY);
    if (!raw) {
      return null;
    }

    try {
      const parsed = JSON.parse(raw) as Partial<User>;
      if (
        typeof parsed.id !== "string" ||
        typeof parsed.name !== "string" ||
        typeof parsed.email !== "string" ||
        (parsed.role !== "admin" && parsed.role !== "cliente")
      ) {
        return null;
      }

      return {
        id: parsed.id,
        name: parsed.name,
        email: parsed.email,
        role: parsed.role,
        isAdmin: parsed.role === "admin",
      };
    } catch {
      return null;
    }
  };

  const mapSupabaseUser = async (supabaseUser: SupabaseUser): Promise<User> => {
    const role = await fetchUserRole(supabaseUser.id);
    return {
      id: supabaseUser.id,
      name:
        supabaseUser.user_metadata.name ||
        supabaseUser.email?.split("@")[0] ||
        "Usuário",
      email: supabaseUser.email || "",
      isAdmin: role === "admin",
      role,
    };
  };

  const syncUserFromSession = async (session: Session | null) => {
    if (!session?.user) {
      setUser(null);
      cacheUser(null);
      return;
    }

    const mappedUser = await mapSupabaseUser(session.user);
    setUser(mappedUser);
    cacheUser(mappedUser);
  };

  useEffect(() => {
    const cachedUser = getCachedUser();
    if (cachedUser) {
      setUser(cachedUser);
    }

    const initializeSession = async () => {
      try {
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession();

        if (error) {
          console.error("Erro ao recuperar sessão:", error);
          await syncUserFromSession(null);
        } else {
          await syncUserFromSession(session);
        }
      } finally {
        setIsLoading(false);
      }
    };

    void initializeSession();

    const handleAuthStateChange = async (
      event: AuthChangeEvent,
      session: Session | null,
    ) => {
      if (event === "SIGNED_OUT" || !session) {
        await syncUserFromSession(null);
        return;
      }

      await syncUserFromSession(session);
    };

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      void handleAuthStateChange(event, session);
    });

    const refreshInterval = window.setInterval(async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session?.expires_at) {
        return;
      }

      const currentTimestamp = Math.floor(Date.now() / 1000);
      const secondsToExpire = session.expires_at - currentTimestamp;

      if (secondsToExpire > SESSION_REFRESH_THRESHOLD_SECONDS) {
        return;
      }

      const { data, error } = await supabase.auth.refreshSession();
      if (error) {
        console.error("Erro ao renovar sessão:", error);
        return;
      }

      await syncUserFromSession(data.session);
    }, SESSION_HEALTHCHECK_INTERVAL_MS);

    return () => {
      subscription.unsubscribe();
      window.clearInterval(refreshInterval);
    };
  }, []);

  const login = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      throw new Error(error.message);
    }

    if (data.session) {
      await syncUserFromSession(data.session);
    }
  };

  const register = async (name: string, email: string, password: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name: name,
        },
      },
    });

    if (error) {
      throw new Error(error.message);
    }

    if (data.session) {
      // Aguardar um pouco para o trigger criar o perfil
      await new Promise((resolve) => setTimeout(resolve, 1000));
      await syncUserFromSession(data.session);
    }
  };

  const logout = async () => {
    cacheUser(null);
    await supabase.auth.signOut();
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        register,
        logout,
        isLoading,
        isAdmin: user?.isAdmin || false,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
