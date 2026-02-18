import { Navigate } from "react-router";

import { useAuth } from "../hooks/useAuth.ts";

export function RestrictedRoute({ children }: { children: React.ReactNode }) {
  // On récupère le token de l'utilisateur courant
  const { token } = useAuth();

  // S'il existe, c'est que l'utilisateur est authentifié : on affiche la page demandée
  // Sinon, on redirige l'utilisateur vers la page de connexion
  return token ? <>{children}</> : <Navigate to="/login" />;
}
