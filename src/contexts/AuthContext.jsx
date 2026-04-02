import React, { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState({
    id: "1",
    name: "John Student",
    email: "john@iu.edu",
    role: "Student",
    avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=john@iu.edu`,
  });

  const switchRole = (role) => {
    setUser((prev) => ({ ...prev, role }));
  };

  const logout = () => {
    setUser(null);
  };

  const login = (email, password) => {
    setUser({
      id: "1",
      name: email.split("@")[0],
      email,
      role: "Student",
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`,
    });
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, switchRole }}>
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
