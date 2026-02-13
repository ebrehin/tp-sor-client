import { useState, useEffect } from 'react'
import { Link } from 'react-router'

export default function Index() {
    const [polls, setPolls] = useState<any[]>([])

    useEffect(() => {
        (async () => {
            const response = await fetch('http://localhost:8000/polls')
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
                        <Link to={`/polls/${poll.id}`}>{poll.titre}</Link>
                    </li>
                ))}
            </ul>
        </main>
    )
}