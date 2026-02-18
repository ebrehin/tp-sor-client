import { useState, useEffect } from "react";
import { useAuth } from "../hooks/useAuth.ts";
import { API_URL } from "../config/api.ts";
import Navigation from "../components/Navigation.tsx";
import './User.css';

interface UserData {
  user: {
    id: string;
    username: string;
    isAdmin: boolean;
    createdAt: string;
  };
  polls: Array<{
    id: string;
    title: string;
    description: string | null;
    created_at: string;
    expires_at: string | null;
    is_active: number;
  }>;
  voteCount: number;
}

export default function User() {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingPollId, setDeletingPollId] = useState<string | null>(null);
  const { authFetch } = useAuth();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await authFetch(`${API_URL}/users/me`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error?.message || "Failed to fetch user data");
        }

        if (data.success && data.data) {
          setUserData(data.data);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleDeletePoll = async (pollId: string, pollTitle: string) => {
    if (!confirm(`Êtes-vous sûr de vouloir supprimer le sondage "${pollTitle}" ? Cette action est irréversible.`)) {
      return;
    }

    setDeletingPollId(pollId);

    try {
      const response = await authFetch(`${API_URL}/polls/${pollId}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error?.message || "Erreur lors de la suppression");
      }

      // Mettre à jour l'état local en retirant le sondage supprimé
      if (userData) {
        setUserData({
          ...userData,
          polls: userData.polls.filter(poll => poll.id !== pollId),
        });
      }
    } catch (err) {
      alert(`Erreur: ${err instanceof Error ? err.message : "Erreur inconnue"}`);
    } finally {
      setDeletingPollId(null);
    }
  };

  if (loading) {
    return (
      <>
        <Navigation />
        <div className="user-loading">Loading...</div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Navigation />
        <div className="user-error">Error: {error}</div>
      </>
    );
  }

  if (!userData) {
    return (
      <>
        <Navigation />
        <div className="user-no-data">No user data available</div>
      </>
    );
  }

  return (
    <>
      <Navigation />
      <div className="user-profile-container">
        <h1 className="user-profile-title">My Profile</h1>

        <div className="user-info-card">
          <h2 className="user-info-title">User Information</h2>
          <p><strong>Username:</strong> {userData.user.username}</p>
          <p><strong>User ID:</strong> {userData.user.id}</p>
          <p><strong>Admin:</strong> {userData.user.isAdmin ? "Yes" : "No"}</p>
          <p><strong>Member since:</strong> {new Date(userData.user.createdAt).toLocaleDateString()}</p>
          <p><strong>Total votes cast:</strong> {userData.voteCount}</p>
        </div>

        <div className="user-polls-section">
          <h2 className="user-polls-title">My Polls ({userData.polls.length})</h2>
          {userData.polls.length === 0 ? (
            <div className="user-polls-empty">
              <p>You haven't created any polls yet.</p>
              <a href="/polls/create" className="create-first-poll-btn">
                + Create your first poll
              </a>
            </div>
          ) : (
            <>
              <a href="/polls/create" className="create-new-poll-btn">
                + Create new poll
              </a>
              <div className="user-polls-list">
                {userData.polls.map((poll) => (
                  <div
                    key={poll.id}
                    className={`poll-card ${poll.is_active ? 'active' : 'inactive'}`}
                  >
                    <h3 className="poll-card-title">{poll.title}</h3>
                    {poll.description && <p className="poll-card-description">{poll.description}</p>}
                    <p className="poll-card-meta">
                      Created: {new Date(poll.created_at).toLocaleDateString()}
                    </p>
                    {poll.expires_at && (
                      <p className="poll-card-meta">
                        Expires: {new Date(poll.expires_at).toLocaleDateString()}
                      </p>
                    )}
                    <p className="poll-card-status">
                      Status: {poll.is_active ? "Active" : "Inactive"}
                    </p>
                    <a href={`/polls/${poll.id}`} className="poll-card-link">
                      View Poll
                    </a>
                    <button
                      type="button"
                      onClick={() => handleDeletePoll(poll.id, poll.title)}
                      className="delete-poll-btn"
                      disabled={deletingPollId === poll.id}
                    >
                      {deletingPollId === poll.id ? "Deleting..." : "Delete"}
                    </button>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
