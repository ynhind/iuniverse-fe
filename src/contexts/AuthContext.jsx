import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

const AuthContext = createContext(null);

const normalizeRole = (roleValue) => {
  if (!roleValue) return "STUDENT";

  // case 1: string => "ADMIN"
  if (typeof roleValue === "string") {
    const raw = roleValue.trim().toUpperCase();
    if (raw === "ADMIN") return "ADMIN";
    if (raw === "TEACHER") return "TEACHER";
    if (raw === "STUDENT") return "STUDENT";
    return "STUDENT";
  }

  // case 2: object => { authority: "ADMIN" }
  if (typeof roleValue === "object" && !Array.isArray(roleValue)) {
    const authority = String(roleValue.authority || roleValue.role || "")
      .trim()
      .toUpperCase();

    if (authority === "ADMIN") return "ADMIN";
    if (authority === "TEACHER") return "TEACHER";
    if (authority === "STUDENT") return "STUDENT";
    return "STUDENT";
  }

  // case 3: array => [{ authority: "ADMIN" }]
  if (Array.isArray(roleValue)) {
    for (const item of roleValue) {
      const parsed = normalizeRole(item);
      if (parsed !== "STUDENT") return parsed;
    }
    return "STUDENT";
  }

  return "STUDENT";
};

const decodeJwtPayload = (token) => {
  try {
    if (!token) return null;

    const parts = token.split(".");
    if (parts.length < 2) return null;

    const base64Url = parts[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), "=");

    const jsonPayload = atob(padded);
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error("Decode JWT failed:", error);
    return null;
  }
};

const buildUserFromToken = (token, fallbackUser = null) => {
  const decoded = decodeJwtPayload(token);
  if (!decoded) return fallbackUser;

  const role =
    normalizeRole(decoded?.role) ||
    normalizeRole(decoded?.authorities) ||
    normalizeRole(decoded?.authority);

  const userId = decoded?.userId || decoded?.id || fallbackUser?.id || null;
  const username = decoded?.sub || fallbackUser?.username || "";
  const name = fallbackUser?.name || username || "User";

  return {
    id: userId,
    name,
    username,
    role,
    avatar:
      fallbackUser?.avatar ||
      `https://api.dicebear.com/7.x/avataaars/svg?seed=${username || "user"}`,
  };
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState(localStorage.getItem("accessToken") || null);
  const [refreshToken, setRefreshToken] = useState(localStorage.getItem("refreshToken") || null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedAccessToken = localStorage.getItem("accessToken");

    let parsedUser = null;

    if (storedUser) {
      try {
        parsedUser = JSON.parse(storedUser);
      } catch (error) {
        console.error("Parse user failed:", error);
        localStorage.removeItem("user");
      }
    }

    // luôn rebuild user từ token để role chính xác
    if (storedAccessToken) {
      const tokenUser = buildUserFromToken(storedAccessToken, parsedUser);
      setUser(tokenUser);

      if (tokenUser) {
        localStorage.setItem("user", JSON.stringify(tokenUser));
      }
    } else if (parsedUser) {
      setUser(parsedUser);
    }
  }, []);

  const login = (userData, access, refresh) => {
    const normalizedUser = access ? buildUserFromToken(access, userData) : userData;

    setUser(normalizedUser);
    setAccessToken(access || null);
    setRefreshToken(refresh || null);

    localStorage.setItem("user", JSON.stringify(normalizedUser));

    if (access) localStorage.setItem("accessToken", access);
    if (refresh) localStorage.setItem("refreshToken", refresh);
  };

  const logout = () => {
    setUser(null);
    setAccessToken(null);
    setRefreshToken(null);

    localStorage.removeItem("user");
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
  };

  const value = useMemo(
    () => ({
      user,
      accessToken,
      refreshToken,
      isAuthenticated: !!user && !!accessToken,
      login,
      logout,
    }),
    [user, accessToken, refreshToken]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}