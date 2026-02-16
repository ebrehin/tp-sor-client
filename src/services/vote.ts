import type { VoteAckMessage, VotesUpdateMessage, VoteCastMessage } from "../model/interfaces.ts";

// WebSocket et sondage courants initialisés à `null`
let ws: WebSocket | null = null;
let pollId: string | null = null;

// Ensembles des fonctions à appeler à la réception d'un message du serveur
const updateCallbacks = new Set<(update: VotesUpdateMessage) => void>();
const ackCallbacks = new Set<(ack: VoteAckMessage) => void>();

// Fonction de connexion : initialisation du WebSocket et définition de l'action à effectuer à la réception d'un message
export function connect(newPollId: string): void {
  pollId = newPollId;

  // On ferme un éventuel WebSocket précédent
  if (ws) ws.close();

  // Le protocole n'est plus HTTP !
  ws = new WebSocket(`ws://localhost:8000/votes/${pollId}`);

  // Événement : réception d'un message
  ws.onmessage = (e) => {
    try {
      // Attention : valider les données entrantes
      const msg = JSON.parse(e.data);

      // En fonction du type de message, on exécute les fonctions appropriées en leur passant le message reçu
      if (msg.type === "votes_update") {
        updateCallbacks.forEach((cb) => cb(msg as VotesUpdateMessage));
      } else if (msg.type === "vote_ack") {
        ackCallbacks.forEach((cb) => cb(msg as VoteAckMessage));
      }
    } catch (err) {
      console.error("Failed to parse WebSocket message:", err);
    }
  };

  ws.onerror = (err) => {
    console.error("WebSocket error:", err);
  };

  ws.onclose = () => {
    console.log("WebSocket closed");
  };
}

// Fonction de déconnexion : fermeture du WebSocket
export function disconnect(): void {
  if (ws) ws.close();
  ws = null;
  pollId = null;
}

// Fonction de vote : envoi de messages de vote
export function vote(optionId: string): { success: boolean; error?: string } {
  // Le WebSocket n'est pas ouvert
  if (!ws || ws.readyState !== WebSocket.OPEN) {
    return { success: false, error: "Not connected" };
  }

  // Envoi du vote de l'utilisateur
  const message: VoteCastMessage = {
    type: "vote_cast",
    pollId: pollId!,
    optionId,
  };
  ws.send(JSON.stringify(message));

  return { success: true };
}

// Réception d'une mise à jour des compteurs de votes
export function onVoteUpdate(
  cb: (update: VotesUpdateMessage) => void,
): () => void {
  updateCallbacks.add(cb);
  return () => updateCallbacks.delete(cb);
}

// Réception d'un accusé de réception du serveur
export function onVoteAck(cb: (ack: VoteAckMessage) => void): () => void {
  ackCallbacks.add(cb);
  return () => ackCallbacks.delete(cb);
}
