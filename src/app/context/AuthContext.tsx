"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useRouter } from "next/navigation";

interface User {
  userId: number;
  name: string | null;
  username: string;
  typeUser: string;
}

interface JWTPayload {
  userId: number;
  username: string;
  typeUser: string;
  name?: string | null;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (token: string) => void;
  logout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const decodeToken = (token: string): JWTPayload | null => {
    try {
      const base64Url = token.split(".")[1];
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      const jsonPayload = decodeURIComponent(atob(base64).split("").map(function(c) {
        return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(""));

      return JSON.parse(jsonPayload) as JWTPayload; // 💡 Usando a tipagem aqui!
    } catch (error) {
      console.error("Erro na decodificação do token:", error);
      return null;
    }
  };

  useEffect(() => {
    const storedToken = localStorage.getItem("authToken");
    if (storedToken) {
      const payload = decodeToken(storedToken);

      if (payload) {
        setUser({
          userId: payload.userId,
          username: payload.username,
          typeUser: payload.typeUser,
          name: payload.name || null,
        });
        setToken(storedToken);
      } else {
        localStorage.removeItem("authToken");
      }
    }
    setIsLoading(false);
  }, []);

  const login = (token: string) => {
    localStorage.setItem("authToken", token);
    const payload = decodeToken(token);

    if (payload) {
      setUser({
        userId: payload.userId,
        username: payload.username,
        typeUser: payload.typeUser,
        name: payload.name || null,
      });
      setToken(token);
      router.push("/");
    } else {
      console.error("Login falhou devido a token inválido.");
      localStorage.removeItem("authToken");
    }
  };

  const logout = () => {
    localStorage.removeItem("authToken");
    setUser(null);
    setToken(null);
    router.push("/pages/login");
  };

  const value = {
    user,
    token,
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