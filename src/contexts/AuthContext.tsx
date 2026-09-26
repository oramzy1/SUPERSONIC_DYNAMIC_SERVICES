import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import {
  authApi,
  accountApi,
  getAccessToken,
  setTokens,
  clearTokens,
} from "@/lib/api";
import type {
  ProfileResponse,
  LoginRequest,
  RegisterRequest,
} from "@/lib/api-types";
import { useQueryClient } from "@tanstack/react-query";

interface AuthState {
  user: ProfileResponse | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (data: LoginRequest) => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient();
  const [user, setUser] = useState<ProfileResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refreshUser = useCallback(async () => {
    try {
      const profile = await accountApi.getProfile();
      setUser(profile);
    } catch {
      setUser(null);
      clearTokens();
    }
  }, []);

  // On mount: if token exists, fetch profile
  useEffect(() => {
    const token = getAccessToken();
    if (!token) {
      setIsLoading(false);
      return;
    }
    refreshUser().finally(() => setIsLoading(false));
  }, [refreshUser]);

  const login = useCallback(async (data: LoginRequest) => {
    const res = await authApi.login(data);
    setTokens(res.access_token, res.refresh_token);
    queryClient.clear();
    const profile = await accountApi.getProfile();
    setUser(profile);
  }, [queryClient]);

  const register = useCallback(async (data: RegisterRequest) => {
    const res = await authApi.register(data);
    setTokens(res.access_token, res.refresh_token);
    queryClient.clear();
    const profile = await accountApi.getProfile();
    setUser(profile);
  }, [queryClient]);

  const logout = useCallback(async () => {
    try {
      await authApi.logout();
    } finally {
      clearTokens();
      setUser(null);
      queryClient.clear();
    }
  }, [queryClient]);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}