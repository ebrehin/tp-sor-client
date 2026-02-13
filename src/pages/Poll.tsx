import { useState, useEffect } from 'react'
import { useParams } from 'react-router'
import { isPollRow } from '../model/interfaces'
import type { PollRow } from '../model/interfaces'

export default function Poll() {
    const { selectedPoll } = useParams();
    const [poll, setPoll] = useState<PollRow | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        (async () => {
            try {
                if (!selectedPoll) {
                    setError('ID du sondage non fourni')
                    setLoading(false)
                    return
                }

                const response = await fetch(`http://localhost:8000/polls/${selectedPoll}`)
                const data = await response.json()

                if (!data.success) {
                    setError(data.error?.message || 'Erreur lors de la récupération du sondage')
                    setLoading(false)
                    return
                }

                if (isPollRow(data.data)) {
                    setPoll(data.data)
                } else {
                    setError('Format de données invalide')
                }
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Erreur inconnue')
            } finally {
                setLoading(false)
            }
        })();
    }, [selectedPoll]);

    if (loading) {
        return <div>Chargement...</div>
    }

    if (error) {
        return <div>Erreur: {error}</div>
    }

    if (!poll) {
        return <div>Sondage non trouvé</div>
    }

    return (
        <div>
            <h1>{poll.titre}</h1>
            {poll.description && <p>{poll.description}</p>}
            <div>
                <p><strong>Status:</strong> {poll.statut}</p>
                <p><strong>Créé le:</strong> {new Date(poll.created_at).toLocaleDateString('fr-FR')}</p>
                {poll.date_expiration && (
                    <p><strong>Expire le:</strong> {new Date(poll.date_expiration).toLocaleDateString('fr-FR')}</p>
                )}
            </div>
        </div>
    )
}
