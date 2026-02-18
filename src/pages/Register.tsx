import { useState, FormEvent } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../hooks/useAuth.ts";
import { API_URL } from "../config/api.ts";
import type { RegisterRequest, AuthResponse } from "../model/interfaces.ts";
import Navigation from "../components/Navigation.tsx";
import './Auth.css';

export default function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const requestBody: RegisterRequest = {
        username,
        password,
      };

      const response = await fetch(`${API_URL}/users/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error?.message || "Registration failed");
      }

      if (data.success && data.data) {
        const authResponse: AuthResponse = data.data;
        login(authResponse);
        navigate("/");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navigation />
      <div className="auth-container">
        <h1 className="auth-title">Register</h1>
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="auth-form-group">
            <label htmlFor="username" className="auth-label">
              Username:
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="auth-input"
            />
          </div>
          <div className="auth-form-group">
            <label htmlFor="password" className="auth-label">
              Password:
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="auth-input"
            />
          </div>
          {error && (
            <div className="auth-error">
              {error}
            </div>
          )}
          <button
            type="submit"
            disabled={loading}
            className="auth-submit-btn"
          >
            {loading ? "Registering..." : "Register"}
          </button>
        </form>
        <p className="auth-footer">
          Already have an account?{" "}
          <a href="/login" className="auth-link">
            Login here
          </a>
        </p>
      </div>
    </>
  );
}
