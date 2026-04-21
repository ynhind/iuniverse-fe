import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState({
    id: "1",
    name: "John Student",
    email: "john@iu.edu",
    role: "Student",
    avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=john@iu.edu`,
  });
  const [loading, setLoading] = useState(false);
  const [accessToken, setAccessToken] = useState("mock-token-123");

  const switchRole = (role) => {
    setUser((prev) => ({ ...prev, role }));
  };

  const logout = async () => {
    setUser(null);
    setAccessToken(null);
  };

  const login = async (username, password) => {
    let email = username;
    let role = "Student";
    if (email === "teacher@gmail.com") {
      role = "Teacher";
    } else if (email === "admin@gmail.com") {
      role = "Admin";
    }

    const userData = {
      id: "1",
      name: email.split("@")[0],
      email,
      role,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`,
    };
    setUser(userData);
    setAccessToken("mock-token-123");

    return { accessToken: "mock-token-123" };
  };

  const isAuthenticated = !!user && !!accessToken && !loading;

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        switchRole,
        accessToken,
        loading,
        isAuthenticated,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
