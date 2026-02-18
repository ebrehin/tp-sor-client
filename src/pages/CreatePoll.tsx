import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { API_URL } from '../config/api.ts';
import { useAuth } from '../hooks/useAuth.ts';
import Navigation from '../components/Navigation.tsx';
import './CreatePoll.css';

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
        <>
            <Navigation />
            <main id="content" className="create-poll-container">
                <h1 className="create-poll-title">Créer un nouveau sondage</h1>

                <form onSubmit={handleSubmit} className="create-poll-form">
                    <div className="form-group">
                        <label htmlFor="title" className="form-label">
                            Titre du sondage *
                        </label>
                        <input
                            type="text"
                            id="title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Ex: Quel est votre langage préféré ?"
                            className="form-input"
                            disabled={isLoading}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="description" className="form-label">
                            Description (optionnelle)
                        </label>
                        <textarea
                            id="description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Ajoutez des détails supplémentaires..."
                            rows={3}
                            className="form-textarea"
                            disabled={isLoading}
                        />
                    </div>

                    <div className="options-group">
                        <label className="form-label">
                            Options * (minimum 2)
                        </label>
                        {options.map((option, index) => (
                            <div key={index} className="option-input-group">
                                <input
                                    type="text"
                                    value={option}
                                    onChange={(e) => updateOption(index, e.target.value)}
                                    placeholder={`Option ${index + 1}`}
                                    className="option-input"
                                    disabled={isLoading}
                                />
                                {options.length > 2 && (
                                    <button
                                        type="button"
                                        onClick={() => removeOption(index)}
                                        className="remove-option-btn"
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
                            className="add-option-btn"
                            disabled={isLoading}
                        >
                            + Ajouter une option
                        </button>
                    </div>

                    {error && (
                        <div className="form-error">
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        className="submit-btn"
                        disabled={isLoading}
                    >
                        {isLoading ? 'Création en cours...' : 'Créer le sondage'}
                    </button>
                </form>
            </main>
        </>
    );
}
