import { useState, useEffect } from 'react'
import { Link } from 'react-router'
import { API_URL } from '../config/api.ts'
import { useAuth } from '../hooks/useAuth.ts'
import Navigation from '../components/Navigation.tsx'
import './Index.css'

interface PollListItem {
    id: string;
    title: string;
    description?: string;
    is_active: number;
}

export default function Index() {
    const [polls, setPolls] = useState<PollListItem[]>([])
    const { user } = useAuth()

    useEffect(() => {
        (async () => {
            const response = await fetch(`${API_URL}/polls`)
            const data = await response.json()
            if (data.success) {
                setPolls(data.data)
            }
        })();
    }, []);

    return (
        <main id="content">
            <Navigation />

            <div className="polls-container">
                <h1 className="polls-header">Polls</h1>
                <p className="polls-description">Click on a poll below to participate.</p>
                
                {user && (
                    <div className="create-poll-section">
                        <Link to="/polls/create" className="create-poll-button">
                            + Créer un nouveau sondage
                        </Link>
                    </div>
                )}

                <ul className="polls-list">
                    {polls.map((poll) => (
                        <li key={poll.id}>
                            <Link to={`/polls/${poll.id}`}>{poll.title}</Link>
                        </li>
                    ))}
                </ul>
            </div>
        </main>
    )
}