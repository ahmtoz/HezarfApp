import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

function SignUpModal({ isOpen, onClose }) {
    const { signUp } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccessMessage(null);

        try {
            const { error: authError } = await signUp(email, password);

            if (authError) throw authError;

            setSuccessMessage("Success!");
            setEmail('');
            setPassword('');
            setTimeout(() => {
                onClose();
            }, 2000);
        } catch (err) {
            setError(err.message || "Error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white p-8 rounded-lg shadow-xl w-96 max-w-[90%] relative">
                <h2 className="text-2xl font-bold mb-6 text-center">Sign Up</h2>

                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 text-sm">
                        {error}
                    </div>
                )}

                {successMessage && (
                    <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4 text-sm">
                        {successMessage}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Email</label>
                        <input
                            type="email"
                            className="w-full border border-gray-300 rounded-lg p-2"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Password</label>
                        <input
                            type="password"
                            className="w-full border border-gray-300 rounded-lg p-2"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="bg-black text-white py-2 rounded-lg mt-2 font-bold hover:bg-gray-800 transition-colors disabled:opacity-50"
                    >
                        {loading ? 'Processing...' : 'Sign Up'}
                    </button>
                </form>

                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-500 hover:text-black font-bold text-xl cursor-pointer"
                >
                    ✕
                </button>
            </div>
        </div>
    );
}

export default SignUpModal;
