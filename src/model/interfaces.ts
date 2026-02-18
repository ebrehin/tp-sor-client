export enum APIErrorCode {
  NOT_FOUND = "NOT_FOUND",
  UNAUTHORIZED = "UNAUTHORIZED",
  BAD_REQUEST = "BAD_REQUEST",
  VALIDATION_ERROR = "VALIDATION_ERROR",
  SERVER_ERROR = "SERVER_ERROR",
}

export class APIException extends Error {
  readonly code: APIErrorCode;
  readonly status: number;

  constructor(code: APIErrorCode, status: number, message: string) {
    super(message);
    this.code = code;
    this.status = status;
  }
}

export interface APIFailure {
  success: false;
  error: { code: APIErrorCode; message: string };
}

// Interfaces de messages 
// Requête : vote de l'utilisateur
export interface VoteCastMessage {
  type: "vote_cast";
  pollId: string;
  optionId: string;
  userId?: string;
}

// Réponse : accusé de réception
export interface VoteAckMessage {
  type: "vote_ack";
  pollId: string;
  optionId: string;
  success: boolean;
  error?: APIFailure;
}

// Diffusion : compteurs de votes
export interface VotesUpdateMessage {
  type: "votes_update";
  pollId: string;
  optionId: string;
  voteCount: number;
}

// Interfaces de données (version client - sans SQLOutputValue)
export interface Poll {
  id: string;
  titre: string;
  options: Array<{ id: string; intitule: string; voteCount: number }>;
}

// Interfaces d'authentification
export interface User {
  id: string;
  username: string;
  isAdmin: boolean;
  createdAt: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  password: string;
  isAdmin?: boolean;
}