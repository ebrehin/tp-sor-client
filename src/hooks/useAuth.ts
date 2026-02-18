import { useContext } from "react";

import { AuthContext } from "../contexts/AuthContext.ts";

import { type AuthResponse } from "../model/interfaces.ts";

export const useAuth = () => {
  const { authResponse, setAuthResponse } = useContext(AuthContext);

  const login = (response: AuthResponse) => {
    setAuthResponse(response);
    localStorage.setItem("authResponse", JSON.stringify(response));
  };

  const logout = () => {
    setAuthResponse(null);
    localStorage.removeItem("authResponse");
  };

  const authFetch = async (input: RequestInfo, init: RequestInit = {}) => {
    const token = authResponse?.token;

    const res = await fetch(input, {
      ...init,
      headers: {
        ...(init.headers ?? {}),
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (res.status === 401) {
      logout();
    }

    return res;
  };

  return {
    user: authResponse?.user ?? null,
    token: authResponse?.token ?? null,
    login,
    logout,
    authFetch,
  };
};
