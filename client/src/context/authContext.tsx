import { createContext, useContext, useEffect, useState } from "react";
import type { User } from "../types";
import { useNavigate } from "react-router-dom";
import api from "../config/api";
import toast from "react-hot-toast";

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
}

const authContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();

  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedToken = localStorage.getItem("auth_token");
    const savedUser = localStorage.getItem("auth_user");

    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(JSON.parse(savedUser));
    }

    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const { data } = await api.post("/auth/login", {
        email,
        password,
      });

      setUser(data.user);
      setToken(data.token);

      localStorage.setItem("auth_token", data.token);
      localStorage.setItem("auth_user", JSON.stringify(data.user));

      toast.success("Logged in successfully!");
      navigate("/");
    } catch (error: any) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  const register = async (
    name: string,
    email: string,
    password: string
  ) => {
    try {
      const { data } = await api.post("/auth/register", {
        name,
        email,
        password,
      });

      setUser(data.user);
      setToken(data.token);

      localStorage.setItem("auth_token", data.token);
      localStorage.setItem("auth_user", JSON.stringify(data.user));

      toast.success("Registered successfully!");
      navigate("/");
    } catch (error: any) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);

    localStorage.removeItem("auth_token");
    localStorage.removeItem("auth_user");

    navigate("/login");
  };

  const updateUser = (userData: Partial<User>) => {
    if (user) {
      const updated = { ...user, ...userData };

      setUser(updated);
      localStorage.setItem("auth_user", JSON.stringify(updated));
    }
  };

  return (
    <authContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        register,
        logout,
        updateUser,
      }}
    >
      {children}
    </authContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(authContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
}