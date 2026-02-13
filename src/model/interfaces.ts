export const APIErrorCode = {
  NOT_FOUND: "NOT_FOUND",
  UNAUTHORIZED: "UNAUTHORIZED",
  BAD_REQUEST: "BAD_REQUEST",
  SERVER_ERROR: "SERVER_ERROR",
} as const;

export type APIErrorCodeType = typeof APIErrorCode[keyof typeof APIErrorCode];

export interface APIFailure {
  success: false;
  error: { code: APIErrorCodeType; message: string };
}

// Interfaces de données
export interface PollRow {
  id: string;
  titre: string;
  description: string | null;
  created_at: string;
  date_expiration: string | null;
  statut: string;
  [key: string]: any;
}

export interface PollOptionRow {
  id: string;
  intitule: string;
  poll_id: string;
  created_at: string;
  [key: string]: any;
}

export interface Poll {
  id: string;
  titre: string;
  options: Array<{ id: string; intitule: string; voteCount: number }>;
}

// Type Guards
export function isPollRow(obj: any): obj is PollRow {
  return (
    typeof obj?.id === "string" &&
    typeof obj?.titre === "string" &&
    (obj?.description === null || typeof obj?.description === "string") &&
    typeof obj?.created_at === "string" &&
    (obj?.date_expiration === null || typeof obj?.date_expiration === "string") &&
    typeof obj?.statut === "string"
  );
}

export function isPollOptionRow(obj: any): obj is PollOptionRow {
  return (
    typeof obj?.id === "string" &&
    typeof obj?.intitule === "string" &&
    typeof obj?.poll_id === "string" &&
    typeof obj?.created_at === "string"
  );
}

export function isPoll(obj: any): obj is Poll {
  return (
    typeof obj?.id === "string" &&
    typeof obj?.titre === "string" &&
    Array.isArray(obj?.options) &&
    obj.options.every(
      (opt: any) =>
        typeof opt?.id === "string" &&
        typeof opt?.intitule === "string" &&
        typeof opt?.voteCount === "number"
    )
  );
}
