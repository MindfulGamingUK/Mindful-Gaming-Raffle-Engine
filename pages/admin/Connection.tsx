import React, { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../../components/Button';
import { getInstagramAuthUrl, authWithInstagram } from '../../services/api';
import { useSearchParams, useNavigate } from 'react-router-dom';

export const Connection: React.FC = () => {
    const { user, updateUser } = useAuth();
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    useEffect(() => {
        const code = searchParams.get('code');
        if (code) {
            handleAuth(code);
        }
    }, [searchParams]);

    const handleAuth = async (code: string) => {
        setLoading(true);
        setError(null);
        try {
            const result = await authWithInstagram(code);
            if (result.success) {
                setSuccess('Successfully connected to Instagram!');
                // Update local user context to reflect change immediately if needed
                // Assuming api.authWithInstagram updates the backend session/user
                if (user) {
                    updateUser({ instagramConnected: true });
                }
                // Clear query params
                navigate('/admin/connection', { replace: true });
            } else {
                setError('Failed to connect to Instagram. Please try again.');
            }
        } catch (err) {
            console.error(err);
            setError('An error occurred during connection.');
        } finally {
            setLoading(false);
        }
    };

    const handleConnect = async () => {
        setLoading(true);
        setError(null);
        try {
            const url = await getInstagramAuthUrl();
            window.location.href = url;
        } catch (err) {
            console.error(err);
            setError('Could not initiate Instagram connection.');
            setLoading(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto p-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Integrations</h1>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl ${user?.instagramConnected ? 'bg-gradient-to-tr from-yellow-400 to-purple-600 text-white' : 'bg-gray-100 text-gray-400'}`}>
                            <i className="fab fa-instagram"></i>
                        </div>
                        <div>
                            <h3 className="font-bold text-gray-900">Instagram</h3>
                            <p className="text-sm text-gray-500">Connect to fetch media for raffles.</p>
                            {user?.instagramUsername && (
                                <p className="text-xs text-brand-purple font-medium mt-1">@{user.instagramUsername}</p>
                            )}
                        </div>
                    </div>

                    <div>
                        {user?.instagramConnected ? (
                            <div className="flex items-center gap-2">
                                <span className="text-green-600 text-sm font-bold flex items-center gap-1">
                                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                                    Connected
                                </span>
                                <Button variant="secondary" size="sm" onClick={() => alert('Disconnect logic pending')}>Disconnect</Button>
                            </div>
                        ) : (
                            <Button onClick={handleConnect} disabled={loading}>
                                {loading ? 'Connecting...' : 'Connect Instagram'}
                            </Button>
                        )}
                    </div>
                </div>

                {error && (
                    <div className="mt-4 p-3 bg-red-50 text-red-700 text-sm rounded border border-red-100">
                        {error}
                    </div>
                )}

                {success && (
                    <div className="mt-4 p-3 bg-green-50 text-green-700 text-sm rounded border border-green-100">
                        {success}
                    </div>
                )}
            </div>
        </div>
    );
};
