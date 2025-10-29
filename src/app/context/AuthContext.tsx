"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useRouter } from "next/navigation";

interface User {
  userId: number;
  username: string;
  typeUser: string;
}

interface AuthContextType {
  user: User | null;
  login: (token: string) => void;
  logout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        setUser({ userId: payload.userId, username: payload.username, typeUser: payload.typeUser });
      } catch (error) {
        console.error("Falha ao processar token guardado:", error);
        localStorage.removeItem("authToken"); 
      }
    }
    setIsLoading(false);
  }, []);

  const login = (token: string) => {
    localStorage.setItem("authToken", token);
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      setUser({ userId: payload.userId, username: payload.username, typeUser: payload.typeUser });
      router.push("/"); 
    } catch (error) {
      console.error("Falha ao processar token no login:", error);
    }
  };

  const logout = () => {
    localStorage.removeItem("authToken");
    setUser(null);
    router.push("/pages/login");
  };

  const value = {
    user,
    login,
    logout,
    isAuthenticated: !!user,
    isLoading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth deve ser usado dentro de um AuthProvider");
  }
  return context;
};