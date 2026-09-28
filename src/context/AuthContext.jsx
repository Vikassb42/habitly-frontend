import { createContext, useContext, useCallback, useEffect, useState } from "react";
import { authApi } from "../services/api";
import { getItem, setItem, removeItem } from "../utils/storage";

const AuthContext = createContext(null);

const USER_KEY = "ht_user";

export const useAuth = () => useContext(AuthContext);

export const AppAuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => getItem(USER_KEY, null));
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const onStorage = (e) => {
      if (e.key === USER_KEY) {
        setUser(getItem(USER_KEY, null));
      }
    };

    window.addEventListener("storage", onStorage);

    return () => {
      window.removeEventListener("storage", onStorage);
    };
  }, []);

  const persist = useCallback((u) => {
    if (u) {
      setItem(USER_KEY, u);
    } else {
      removeItem(USER_KEY);
    }

    setUser(u);
  }, []);

  const login = useCallback(
    async (email, password) => {
      setLoading(true);

      try {
        const u = await authApi.login({ email, password });
        persist(u);
        return u;
      } finally {
        setLoading(false);
      }
    },
    [persist]
  );

  const register = useCallback(async (name, email, password) => {
    setLoading(true);

    try {
      const u = await authApi.register({
        name,
        email,
        password,
      });

      return u;
    } finally {
      setLoading(false);
    }
  }, []);

  const loginWithProvider = useCallback(
    (provider) => {
      if (provider === "apple") {
        throw new Error("Apple sign-in is not available yet.");
      }

      // Google demo flow is kept for now.
      const u = {
        id: `${provider}_${Date.now()}`,
        name: "Google User",
        email: "guest@google.com",
        provider,
        createdAt: new Date().toISOString(),
      };

      persist(u);
      return u;
    },
    [persist]
  );

  const logout = useCallback(() => {
    // Remove the current user's authentication data.
    localStorage.removeItem("ht_token");
    removeItem(USER_KEY);
    setUser(null);
  }, []);

  const updateProfile = useCallback(
    (data) => {
      const next = {
        ...(user || {}),
        ...data,
      };

      persist(next);
    },
    [user, persist]
  );

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        loading,
        login,
        register,
        loginWithProvider,
        logout,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};