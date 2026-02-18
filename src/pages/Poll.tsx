import { useState, useEffect } from 'react'
import { useParams } from 'react-router'
import type { VoteAckMessage, VotesUpdateMessage } from '../model/interfaces.ts'
import { API_URL } from '../config/api.ts'
import { useVoteSocket } from '../hooks/useVoteSocket.ts'
import Navigation from '../components/Navigation.tsx'
import './Poll.css'

interface PollOption {
  id: string;
  text: string;
  voteCount: number;
}

interface PollData {
  id: string;
  title: string;
  description?: string;
  createdAt: string;
  expiresAt?: string;
  isActive: boolean;
  options: PollOption[];
}

type PollState =
  | { status: "loading" }
  | { status: "error"; error: string }
  | { status: "loaded"; poll: PollData };

export default function Poll() {
    const { selectedPoll } = useParams();
    const [pollState, setPollState] = useState<PollState>({ status: "loading" });
    const [voteError, setVoteError] = useState<string | null>(null);

    // Utilisation du hook useVoteSocket
    const { vote: sendVote } = useVoteSocket(selectedPoll, {
        onAck: (ack: VoteAckMessage) => {
            if (!ack.success) {
                setVoteError(ack.error?.error.message || "Vote failed");
            } else {
                setVoteError(null);
            }
        },
        onUpdate: (update: VotesUpdateMessage) => {
            setPollState((prev) => {
                if (prev.status !== "loaded") return prev;

                return {
                    ...prev,
                    poll: {
                        ...prev.poll,
                        options: prev.poll.options.map((opt) =>
                            opt.id === update.optionId
                                ? { ...opt, voteCount: update.voteCount }
                                : opt
                        ),
                    },
                };
            });
        },
    });

    // Chargement initial du sondage
    useEffect(() => {
        if (!selectedPoll) {
            setPollState({ status: "error", error: "ID du sondage non fourni" });
            return;
        }

        setPollState({ status: "loading" });

        (async () => {
            try {
                const response = await fetch(`${API_URL}/polls/${selectedPoll}`);
                
                if (!response.ok) {
                    const json = await response.json();
                    throw new Error(json.error?.message || `HTTP ${response.status}`);
                }

                const json = await response.json();
                
                if (!json.success) {
                    throw new Error(json.error?.message || 'Erreur lors de la récupération du sondage');
                }

                if (json.data && typeof json.data === 'object') {
                    setPollState({ status: "loaded", poll: json.data as PollData });
                } else {
                    throw new Error('Format de données invalide');
                }
            } catch (err) {
                setPollState({
                    status: "error",
                    error: err instanceof Error ? err.message : "Erreur inconnue",
                });
            }
        })();
    }, [selectedPoll]);

    if (pollState.status === "loading") {
        return (
            <>
                <Navigation />
                <div className="poll-loading">Chargement...</div>
            </>
        );
    }

    if (pollState.status === "error") {
        return (
            <>
                <Navigation />
                <div className="poll-error">Erreur: {pollState.error}</div>
            </>
        );
    }

    const poll = pollState.poll;

    const handleVote = (optionId: string) => {
        const result = sendVote(optionId);
        if (!result.success) {
            setVoteError(result.error || "Vote failed");
        }
    };

    return (
        <>
            <Navigation />
            <div className="poll-container">
                <h1 className="poll-title">{poll.title}</h1>
                {poll.description && <p className="poll-description">{poll.description}</p>}
                <div className="poll-meta">
                    <p><strong>Status:</strong> {poll.isActive ? 'Active' : 'Inactive'}</p>
                    <p><strong>Created:</strong> {new Date(poll.createdAt).toLocaleDateString('en-US')}</p>
                    {poll.expiresAt && (
                        <p><strong>Expires:</strong> {new Date(poll.expiresAt).toLocaleDateString('en-US')}</p>
                    )}
                </div>

                {voteError && <div className="poll-error">Error: {voteError}</div>}

                <div className="poll-options">
                    <h2>Options</h2>
                    {poll.options && poll.options.length > 0 ? (
                        <ul>
                            {poll.options.map((option) => (
                                <li key={option.id}>
                                    <button type="button" onClick={() => handleVote(option.id)} className="poll-option-button">
                                        {option.text} ({option.voteCount} votes)
                                    </button>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p>No options available</p>
                    )}
                </div>
            </div>
        </>
    );
}