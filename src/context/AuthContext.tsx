import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import type { ApiUser } from '../types/api';
import { loginUser, registerUser } from '../services/api';

interface AuthContextType {
  user: ApiUser | null;
  token: string | null;
  loading: boolean;
  login: (mobile: string, password: string) => Promise<void>;
  register: (input: {
    name: string;
    mobile: string;
    email: string;
    address: string;
    password: string;
  }) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);
const USER_KEY = 'dailydry-user';
const TOKEN_KEY = 'dailydry-token';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<ApiUser | null>(() => {
    try {
      const raw = localStorage.getItem(USER_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });
  const [token, setToken] = useState<string | null>(() => localStorage.getItem(TOKEN_KEY));
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) localStorage.setItem(USER_KEY, JSON.stringify(user));
    else localStorage.removeItem(USER_KEY);
  }, [user]);

  useEffect(() => {
    if (token) localStorage.setItem(TOKEN_KEY, token);
    else localStorage.removeItem(TOKEN_KEY);
  }, [token]);

  const login = async (mobile: string, password: string) => {
    setLoading(true);
    try {
      const { user: u, token: t } = await loginUser(mobile, password);
      setUser(u);
      setToken(t);
    } finally {
      setLoading(false);
    }
  };

  const register = async (input: {
    name: string;
    mobile: string;
    email: string;
    address: string;
    password: string;
  }) => {
    setLoading(true);
    try {
      const { user: u, token: t } = await registerUser(input);
      setUser(u);
      setToken(t);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        register,
        logout,
        isAuthenticated: Boolean(user && token),
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
