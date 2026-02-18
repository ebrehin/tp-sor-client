import { useState, useEffect } from 'react'
import { Link } from 'react-router'
import { API_URL } from '../config/api.ts'
import { useAuth } from '../hooks/useAuth.ts'
import Navigation from '../components/Navigation.tsx'

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

            <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>
                <h1>Polls</h1>
                <p>Click on a poll below to participate.</p>
                
                {user && (
                    <div style={{ marginBottom: '20px' }}>
                        <Link 
                            to="/polls/create" 
                            style={{ 
                                display: 'inline-block',
                                padding: '10px 20px', 
                                background: '#007bff', 
                                color: 'white', 
                                textDecoration: 'none',
                                borderRadius: '4px',
                                fontWeight: 'bold'
                            }}
                        >
                            + Créer un nouveau sondage
                        </Link>
                    </div>
                )}

                <ul>
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