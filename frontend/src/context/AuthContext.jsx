import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { apiRequest } from "../api";

const AuthContext = createContext(null);

const TOKEN_KEY = "codex_blog_token";
const USER_KEY = "codex_blog_user";

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem(TOKEN_KEY) || "");
  const [user, setUser] = useState(() => {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verifySession = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const profile = await apiRequest("/auth/me", {}, token);
        setUser(profile);
      } catch {
        logout();
      } finally {
        setLoading(false);
      }
    };

    verifySession();
  }, [token]);

  const login = ({ token: nextToken, user: nextUser }) => {
    setToken(nextToken);
    setUser(nextUser);
    localStorage.setItem(TOKEN_KEY, nextToken);
    localStorage.setItem(USER_KEY, JSON.stringify(nextUser));
  };

  const logout = () => {
    setToken("");
    setUser(null);
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  };

  const value = useMemo(
    () => ({
      token,
      user,
      loading,
      isAuthenticated: Boolean(token),
      login,
      logout
    }),
    [token, user, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return ctx;
};
