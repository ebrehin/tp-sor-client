import { ReactNode, useState } from "react";

import { AuthContext, type AuthContextValue } from "./AuthContext.ts";

import { type AuthResponse } from "../model/interfaces.ts";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [authResponse, setAuthResponse] = useState<AuthResponse | null>(() => {
    const stored = localStorage.getItem("authResponse");

    return stored ? JSON.parse(stored) : null;
  });

  const value: AuthContextValue = { authResponse, setAuthResponse };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
