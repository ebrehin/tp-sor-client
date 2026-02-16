import { useState, useEffect } from 'react'
import { Link } from 'react-router'
import { API_URL } from '../config/api.ts'

interface PollListItem {
    id: string;
    title: string;
    description?: string;
    is_active: number;
}

export default function Index() {
    const [polls, setPolls] = useState<PollListItem[]>([])

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