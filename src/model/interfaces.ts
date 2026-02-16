import { SQLOutputValue } from "node:sqlite";

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

// Interfaces de données
export interface PollRow {
  id: string;
  titre: string;
  description: string | null;
  created_at: string;
  date_expiration: string | null;
  statut: string;
  [key: string]: SQLOutputValue;
}

export interface PollOptionRow {
  id: string;
  intitule: string;
  poll_id: string;
  created_at: string;
  [key: string]: SQLOutputValue;
}

export interface Poll {
  id: string;
  titre: string;
  options: Array<{ id: string; intitule: string; voteCount: number }>;
}