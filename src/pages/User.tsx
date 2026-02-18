import { useState, useEffect } from "react";
import { useAuth } from "../hooks/useAuth.ts";
import { API_URL } from "../config/api.ts";

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
  const { authFetch, logout, user } = useAuth();

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

  const handleLogout = () => {
    logout();
    window.location.href = "/";
  };

  if (loading) {
    return <div style={{ padding: "20px" }}>Loading...</div>;
  }

  if (error) {
    return <div style={{ padding: "20px", color: "red" }}>Error: {error}</div>;
  }

  if (!userData) {
    return <div style={{ padding: "20px" }}>No user data available</div>;
  }

  return (
    <div style={{ maxWidth: "800px", margin: "50px auto", padding: "20px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "30px" }}>
        <h1>My Profile</h1>
        <button onClick={handleLogout} style={{ padding: "10px 20px", cursor: "pointer" }}>
          Logout
        </button>
      </div>

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
          <p>You haven't created any polls yet.</p>
        ) : (
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
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
