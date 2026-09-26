import React, { createContext, useContext, useState, useEffect } from "react";
import { API_BASE_URL } from "../config/api";

interface User {
  id: string;
  name: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (user: User) => void;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const login = (userData: User) => {
    setUser(userData);
  };

  const logout = async () => {
    try {
      await fetch(`${API_BASE_URL}/auth/logout`, {
        method: "POST",
        credentials: "include",
      });
    } catch (e) {
      console.error("Logout API failed", e);
    } finally {
      setUser(null);
    }
  };

  useEffect(() => {
    const refreshSession = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/auth/refresh`, {
          method: "POST",
          credentials: "include",
        });
        const data = await res.json();
        if (res.ok && data.success) {
          setUser(data.data.user);
        }
      } catch (err) {
        console.warn("No active session found via refresh token.");
      } finally {
        setIsLoading(false);
      }
    };

    refreshSession();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
