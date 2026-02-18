// Configuration des URLs de l'API
// Détecter l'hôte courant pour éviter les problèmes CORS entre localhost et 127.0.0.1
const currentHost = typeof window !== 'undefined' ? window.location.hostname : 'localhost';

export const API_URL = `http://${currentHost}:8000`;
export const WS_URL = `ws://${currentHost}:8000`;
