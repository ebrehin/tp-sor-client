import { Link } from 'react-router';
import { useAuth } from '../hooks/useAuth.ts';
import './Navigation.css';

export default function Navigation() {
    const { user, logout } = useAuth();

    const handleLogout = () => {
        logout();
        globalThis.location.reload();
    };

    return (
        <nav className="navigation">
            <div className="navigation-container">
                <div className="navigation-left">
                    <Link to="/" className="navigation-home-link">
                        Home
                    </Link>
                    {user && (
                        <Link to="/polls/create" className="navigation-create-link">
                            + New Poll
                        </Link>
                    )}
                </div>
                <div className="navigation-right">
                    {user ? (
                        <>
                            <span className="navigation-welcome">
                                Welcome, <strong>{user.username}</strong>!
                            </span>
                            <Link to="/me" className="navigation-link">
                                My Profile
                            </Link>
                            <button 
                                type="button" 
                                onClick={handleLogout} 
                                className="navigation-logout-btn"
                            >
                                Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="navigation-link">
                                Login
                            </Link>
                            <Link to="/register" className="navigation-register-btn">
                                Register
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
}
