import { createContext, useContext, useEffect, useMemo, useState } from "react";
import api, { setAuthToken } from "../lib/api";

const AuthContext = createContext(null);
const TOKEN_KEY = "admin-token";

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY) || "");
  const [isBootstrapping, setIsBootstrapping] = useState(true);

  useEffect(() => {
    setAuthToken(token);
    setIsBootstrapping(false);
  }, [token]);

  const login = async ({ email, password }) => {
    const response = await api.post(
      "/login",
      { email, password },
      {
        headers: {
          "Content-Type": "application/json"
        }
      }
    );

    const nextToken = response.data.token;
    setAuthToken(nextToken);
    localStorage.setItem(TOKEN_KEY, nextToken);
    setToken(nextToken);

    return nextToken;
  };

  const logout = () => {
    localStorage.removeItem(TOKEN_KEY);
    setAuthToken("");
    setToken("");
  };

  const resetAuth = () => {
    localStorage.removeItem(TOKEN_KEY);
    setAuthToken("");
    setToken("");
  };

  const value = useMemo(
    () => ({
      token,
      login,
      logout,
      resetAuth,
      isAuthenticated: Boolean(token),
      isBootstrapping
    }),
    [token, isBootstrapping]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }

  return context;
}
