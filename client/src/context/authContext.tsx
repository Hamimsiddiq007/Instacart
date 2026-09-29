import { createContext, useContext, useEffect, useState } from "react";
import type { User } from "../types";
import { useNavigate } from "react-router-dom";

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
}

const navigate = useNavigate();
const [user, setUser] = useState<User | null>(null);
const [token, setToken] = useState<string | null>(null);
const [loading, setLoading] = useState(true);

useEffect(() => {
   const savedToken = localStorage.getItem("auth_token"); 
   const savedUser = localStorage.getItem("auth_user");
   if(savedToken && savedUser){
       setToken(savedToken);
       setUser(JSON.parse(savedUser));
   }
   setLoading(false);
},[])

const authContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  return <authContext.Provider value={}>{children}</authContext.Provider>;
}

export function useAuth(){
    const context = useContext(authContext)
    if(!context) throw new Error("useAuth must be used within a AuthProvider");
    return context
}
