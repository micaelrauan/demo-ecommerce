"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { supabase } from "@/lib/supabase";
import type { User as SupabaseUser } from "@supabase/supabase-js";

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

  const checkIsAdmin = async (userId: string): Promise<boolean> => {
    const role = await fetchUserRole(userId);
    return role === "admin";
  };

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (session?.user) {
        const userId = session.user.id;
        const role = await fetchUserRole(userId);
        const isAdmin = role === "admin";

        setUser({
          id: userId,
          name:
            session.user.user_metadata.name ||
            session.user.email?.split("@")[0] ||
            "Usuário",
          email: session.user.email || "",
          isAdmin: isAdmin,
          role: role,
        });
      }
      setIsLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        const userId = session.user.id;
        const role = await fetchUserRole(userId);
        const isAdmin = role === "admin";

        setUser({
          id: userId,
          name:
            session.user.user_metadata.name ||
            session.user.email?.split("@")[0] ||
            "Usuário",
          email: session.user.email || "",
          isAdmin: isAdmin,
          role: role,
        });
      } else {
        setUser(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      throw new Error(error.message);
    }

    if (data.user) {
      const userId = data.user.id;
      const role = await fetchUserRole(userId);
      const isAdmin = role === "admin";

      setUser({
        id: userId,
        name:
          data.user.user_metadata.name ||
          data.user.email?.split("@")[0] ||
          "Usuário",
        email: data.user.email || "",
        isAdmin: isAdmin,
        role: role,
      });
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

    if (data.user) {
      const userId = data.user.id;

      // Aguardar um pouco para o trigger criar o perfil
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const role = await fetchUserRole(userId);
      const isAdmin = role === "admin";

      setUser({
        id: userId,
        name: name,
        email: data.user.email || "",
        isAdmin: isAdmin,
        role: role,
      });
    }
  };

  const logout = async () => {
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
