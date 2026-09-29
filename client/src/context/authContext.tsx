import { createContext, useContext } from "react";
import type { User } from "../types";

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
  return <authContext.Provider value={}>{children}</authContext.Provider>;
}

export function useAuth(){
    const context = useContext(authContext)
    if(!context) throw new Error("useAuth must be used within a AuthProvider");
    return context
}
