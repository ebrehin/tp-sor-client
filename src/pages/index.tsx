import { useState, useEffect } from 'react'
import { Link } from 'react-router'
import { API_URL } from '../config/api.ts'
import { useAuth } from '../hooks/useAuth.ts'

interface PollListItem {
    id: string;
    title: string;
    description?: string;
    is_active: number;
}

export default function Index() {
    const [polls, setPolls] = useState<PollListItem[]>([])
    const { user, logout } = useAuth()

    useEffect(() => {
        (async () => {
            const response = await fetch(`${API_URL}/polls`)
            const data = await response.json()
            if (data.success) {
                setPolls(data.data)
            }
        })();
    }, []);

    const handleLogout = () => {
        logout()
        globalThis.location.reload()
    }

    return (
        <main id="content">
            <nav style={{ marginBottom: '20px', padding: '10px', borderBottom: '1px solid #ccc' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <Link to="/" style={{ marginRight: '15px', fontWeight: 'bold' }}>Home</Link>
                    </div>
                    <div>
                        {user ? (
                            <>
                                <span style={{ marginRight: '15px' }}>Welcome, {user.username}!</span>
                                <Link to="/me" style={{ marginRight: '15px' }}>My Profile</Link>
                                <button type="button" onClick={handleLogout} style={{ padding: '5px 10px', cursor: 'pointer' }}>
                                    Logout
                                </button>
                            </>
                        ) : (
                            <>
                                <Link to="/login" style={{ marginRight: '15px' }}>Login</Link>
                                <Link to="/register">Register</Link>
                            </>
                        )}
                    </div>
                </div>
            </nav>

            <h1>Polls</h1>
            <p>Click on a poll below to participate.</p>
            <ul>
                {polls.map((poll) => (
                    <li key={poll.id}>
                        <Link to={`/polls/${poll.id}`}>{poll.title}</Link>
                    </li>
                ))}
            </ul>
        </main>
    )
}