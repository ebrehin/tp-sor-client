import { useState, useEffect } from "react";
import { useAuth } from "../hooks/useAuth.ts";
import { API_URL } from "../config/api.ts";
import Navigation from "../components/Navigation.tsx";

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
        <div style={{ padding: "20px" }}>Loading...</div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Navigation />
        <div style={{ padding: "20px", color: "red" }}>Error: {error}</div>
      </>
    );
  }

  if (!userData) {
    return (
      <>
        <Navigation />
        <div style={{ padding: "20px" }}>No user data available</div>
      </>
    );
  }

  return (
    <>
      <Navigation />
      <div style={{ maxWidth: "800px", margin: "0 auto", padding: "20px" }}>
        <h1>My Profile</h1>

        <div style={{ marginBottom: "30px", padding: "20px", border: "1px solid #ccc", borderRadius: "5px" }}>
          <h2>User Information</h2>
          <p><strong>Username:</strong> {userData.user.username}</p>
          <p><strong>User ID:</strong> {userData.user.id}</p>
          <p><strong>Admin:</strong> {userData.user.isAdmin ? "Yes" : "No"}</p>
          <p><strong>Member since:</strong> {new Date(userData.user.createdAt).toLocaleDateString()}</p>
          <p><strong>Total votes cast:</strong> {userData.voteCount}</p>
        </div>

        <div>
          <h2>My Polls ({userData.polls.length})</h2>
          {userData.polls.length === 0 ? (
            <div>
              <p>You haven't created any polls yet.</p>
              <a 
                href="/polls/create" 
                style={{ 
                  display: 'inline-block',
                  padding: '10px 20px',
                  marginTop: '10px',
                  background: '#007bff',
                  color: 'white',
                  textDecoration: 'none',
                  borderRadius: '4px',
                  fontWeight: 'bold'
                }}
              >
                + Create your first poll
              </a>
            </div>
          ) : (
            <>
              <a 
                href="/polls/create" 
                style={{ 
                  display: 'inline-block',
                  padding: '8px 16px',
                  marginBottom: '15px',
                  background: '#007bff',
                  color: 'white',
                  textDecoration: 'none',
                  borderRadius: '4px',
                  fontWeight: 'bold'
                }}
              >
                + Create new poll
              </a>
              <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
                {userData.polls.map((poll) => (
                  <div
                    key={poll.id}
                    style={{
                      padding: "15px",
                      border: "1px solid #ccc",
                      borderRadius: "5px",
                      backgroundColor: poll.is_active ? "#f9f9f9" : "#e0e0e0",
                    }}
                  >
                    <h3>{poll.title}</h3>
                    {poll.description && <p>{poll.description}</p>}
                    <p style={{ fontSize: "0.9em", color: "#666" }}>
                      Created: {new Date(poll.created_at).toLocaleDateString()}
                    </p>
                    {poll.expires_at && (
                      <p style={{ fontSize: "0.9em", color: "#666" }}>
                        Expires: {new Date(poll.expires_at).toLocaleDateString()}
                      </p>
                    )}
                    <p style={{ fontSize: "0.9em", fontWeight: "bold" }}>
                      Status: {poll.is_active ? "Active" : "Inactive"}
                    </p>
                    <a href={`/polls/${poll.id}`} style={{ color: "#646cff" }}>
                      View Poll
                    </a>
                    <button
                      type="button"
                      onClick={() => handleDeletePoll(poll.id, poll.title)}
                      style={{
                        padding: "5px 10px",
                        marginTop: "10px",
                        background: "#dc3545",
                        color: "white",
                        border: "none",
                        borderRadius: "4px",
                        cursor: "pointer",
                      }}
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
