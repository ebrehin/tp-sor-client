import { createContext } from "react";

import { type AuthResponse } from "../model/interfaces.ts";

export interface AuthContextValue {
  authResponse: AuthResponse | null;
  setAuthResponse: (authResponse: AuthResponse | null) => void;
}

export const AuthContext = createContext<AuthContextValue>({
  authResponse: null,
  setAuthResponse: () => {},
});
