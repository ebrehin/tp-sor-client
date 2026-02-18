import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router';
import { API_URL } from '../config/api.ts';
import { useAuth } from '../hooks/useAuth.ts';

export default function CreatePoll() {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [options, setOptions] = useState<string[]>(['', '']);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const { user, authFetch } = useAuth();

    // Rediriger vers login si non connecté
    useEffect(() => {
        if (!user) {
            navigate('/login');
        }
    }, [user, navigate]);

    const addOption = () => {
        setOptions([...options, '']);
    };

    const removeOption = (index: number) => {
        if (options.length > 2) {
            setOptions(options.filter((_, i) => i !== index));
        }
    };

    const updateOption = (index: number, value: string) => {
        const newOptions = [...options];
        newOptions[index] = value;
        setOptions(newOptions);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        // Validation
        if (!title.trim()) {
            setError('Le titre est requis');
            return;
        }

        const validOptions = options.filter(opt => opt.trim() !== '');
        if (validOptions.length < 2) {
            setError('Au moins 2 options sont requises');
            return;
        }

        setIsLoading(true);

        try {
            const response = await authFetch(`${API_URL}/polls`, {
                method: 'POST',
                body: JSON.stringify({
                    title: title.trim(),
                    description: description.trim() || null,
                    options: validOptions,
                }),
            });

            const data = await response.json();

            if (data.success) {
                // Rediriger vers le sondage créé
                navigate(`/polls/${data.data.id}`);
            } else {
                setError(data.error?.message || 'Erreur lors de la création du sondage');
            }
        } catch (err) {
            setError('Erreur de connexion au serveur');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    // Ne pas afficher le formulaire si non connecté (en attendant la redirection)
    if (!user) {
        return null;
    }

    return (
        <main id="content" style={{ maxWidth: '600px', margin: '0 auto', padding: '20px' }}>
            <nav style={{ marginBottom: '20px' }}>
                <Link to="/">← Retour à l'accueil</Link>
            </nav>

            <h1>Créer un nouveau sondage</h1>

            <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: '15px' }}>
                    <label htmlFor="title" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                        Titre du sondage *
                    </label>
                    <input
                        type="text"
                        id="title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Ex: Quel est votre langage préféré ?"
                        style={{ width: '100%', padding: '8px', fontSize: '16px' }}
                        disabled={isLoading}
                    />
                </div>

                <div style={{ marginBottom: '15px' }}>
                    <label htmlFor="description" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                        Description (optionnelle)
                    </label>
                    <textarea
                        id="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Ajoutez des détails supplémentaires..."
                        rows={3}
                        style={{ width: '100%', padding: '8px', fontSize: '16px' }}
                        disabled={isLoading}
                    />
                </div>

                <div style={{ marginBottom: '15px' }}>
                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                        Options * (minimum 2)
                    </label>
                    {options.map((option, index) => (
                        <div key={index} style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                            <input
                                type="text"
                                value={option}
                                onChange={(e) => updateOption(index, e.target.value)}
                                placeholder={`Option ${index + 1}`}
                                style={{ flex: 1, padding: '8px', fontSize: '16px' }}
                                disabled={isLoading}
                            />
                            {options.length > 2 && (
                                <button
                                    type="button"
                                    onClick={() => removeOption(index)}
                                    style={{ padding: '8px 12px', background: '#dc3545', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                                    disabled={isLoading}
                                >
                                    ✕
                                </button>
                            )}
                        </div>
                    ))}
                    <button
                        type="button"
                        onClick={addOption}
                        style={{ padding: '8px 16px', background: '#6c757d', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                        disabled={isLoading}
                    >
                        + Ajouter une option
                    </button>
                </div>

                {error && (
                    <div style={{ padding: '10px', background: '#f8d7da', border: '1px solid #f5c2c7', borderRadius: '4px', marginBottom: '15px', color: '#842029' }}>
                        {error}
                    </div>
                )}

                <button
                    type="submit"
                    style={{ padding: '10px 20px', background: '#007bff', color: 'white', border: 'none', borderRadius: '4px', fontSize: '16px', cursor: 'pointer', width: '100%' }}
                    disabled={isLoading}
                >
                    {isLoading ? 'Création en cours...' : 'Créer le sondage'}
                </button>
            </form>
        </main>
    );
}
