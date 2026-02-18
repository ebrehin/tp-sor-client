import { useEffect, useRef, useCallback } from "react";

import type { VoteAckMessage, VotesUpdateMessage } from "../model/interfaces.ts";
import { WS_URL } from "../config/api.ts";

// Définition du hook, qui prend en paramètre l'identifiant du sondage courant, et les deux fonctions à exécuter à la réception de messages du serveur (respectivement `votes_update` et `vote_ack`)
export function useVoteSocket(
  pollId: string | undefined,
  {
    onUpdate,
    onAck,
  }: {
    onUpdate?: (msg: VotesUpdateMessage) => void;
    onAck?: (msg: VoteAckMessage) => void;
  },
) {
  // Le hook maintient une référence au WebSocket courant
  const socketRef = useRef<WebSocket | null>(null);
  
  // Utiliser des refs pour les callbacks afin d'éviter de recréer la connexion WebSocket à chaque rendu
  const onUpdateRef = useRef(onUpdate);
  const onAckRef = useRef(onAck);
  
  // Mettre à jour les refs quand les callbacks changent
  useEffect(() => {
    onUpdateRef.current = onUpdate;
  }, [onUpdate]);
  
  useEffect(() => {
    onAckRef.current = onAck;
  }, [onAck]);

  // L'effet sera déclenché en fonction de ses dépendances :
  // - à tout changement de sondage courant (`pollId`) : le client se connecte à/se déconnecte d'un WebSocket par sondage
  useEffect(() => {
    if (!pollId) return;

    // On ouvre un WebSocket sur le canal du sondage courant
    const ws = new WebSocket(`${WS_URL}/votes/${pollId}`);
    socketRef.current = ws;

    ws.onopen = () => {
      // Connexion établie
    };

    // Événement : lors de la réception d'un message, on exécute la fonction appropriée en fonction de son type
    ws.onmessage = (e) => {
      const msg = JSON.parse(e.data);

      if (msg.type === "votes_update" && onUpdateRef.current) {
        onUpdateRef.current(msg);
      }

      if (msg.type === "vote_ack" && onAckRef.current) {
        onAckRef.current(msg);
      }
    };
    
    ws.onerror = (error) => {
      console.error("WebSocket error:", error);
    };
    
    ws.onclose = () => {
      // WebSocket fermé
    };

    // Fonction de nettoyage exécutée au démontage du composant :
    // On déconnecte le client du WebSocket
    return () => {
      ws.close();
      socketRef.current = null;
    };
  }, [pollId]); // Dépendances de l'effet - seulement pollId maintenant

  // Fonction retournée par le hook : envoi d'un vote
  // Envoi par le client d'un message `vote_cast` au serveur
  const vote = useCallback((optionId: string) => {
    // On récupère le WebSocket courant
    const ws = socketRef.current;

    if (!ws || ws.readyState !== WebSocket.OPEN) {
      return { success: false, error: "Not connected" };
    }

    // On envoie le message sur le WebSocket
    ws.send(
      JSON.stringify({
        type: "vote_cast",
        pollId,
        optionId,
      }),
    );

    return { success: true };
  }, [pollId]);

  // Le hook retourne une fonction `vote` que l'on appelle dans le composant pour envoyer un message `vote_cast`
  return { vote };
}
