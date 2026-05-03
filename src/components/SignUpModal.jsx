import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

function SignUpModal({ isOpen, onClose, switchToLogin }) {
    const { signUp, signInWithGoogle } = useAuth();
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Basic Client-side Validation
        if (!firstName || !lastName || !email || !password) {
            toast.error("All fields are required.");
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            toast.error("Please enter a valid email address.");
            return;
        }

        setLoading(true);

        try {
            const { error: authError } = await signUp(email, password, firstName, lastName);

            if (authError) {
                // Supabase typically returns "User already registered" for existing emails
                if (authError.message.includes("already registered") || authError.message.includes("already exists")) {
                    toast("Email already exists, redirecting to login...", { icon: 'ℹ️' });
                    switchToLogin();
                    return;
                }
                throw authError;
            }

            toast.success("Account created. Please check your email for the verification link.");
            setFirstName('');
            setLastName('');
            setEmail('');
            setPassword('');
            setTimeout(() => {
                onClose();
            }, 2000);
        } catch (err) {
            toast.error(err.message || "Failed to sign up.");
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleSignUp = async () => {
        try {
            const { error } = await signInWithGoogle();
            if (error) throw error;
        } catch (err) {
            toast.error("Google sign up denied or failed.");
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white p-8 rounded-lg shadow-xl w-96 max-w-[90%] relative">
                <h2 className="text-2xl font-bold mb-6 text-center">Sign Up</h2>

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <div className="flex gap-2">
                        <div className="w-1/2">
                            <label className="block text-sm font-medium mb-1">Name</label>
                            <input
                                type="text"
                                className="w-full border border-gray-300 rounded-lg p-2"
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                                required
                            />
                        </div>
                        <div className="w-1/2">
                            <label className="block text-sm font-medium mb-1">Surname</label>
                            <input
                                type="text"
                                className="w-full border border-gray-300 rounded-lg p-2"
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                                required
                            />
                        </div>
                    </div>
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
                        className="bg-primary    text-white py-2 rounded-lg mt-2 font-bold hover:bg-primary-hover transition-colors disabled:opacity-50 cursor-pointer"
                    >
                        {loading ? 'Processing...' : 'Sign Up'}
                    </button>
                </form>

                <div className="mt-4 relative">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-300"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                        <span className="px-2 bg-white text-gray-500">Or continue with</span>
                    </div>
                </div>

                <button
                    onClick={handleGoogleSignUp}
                    type="button"
                    className="w-full mt-4 bg-white text-black border border-gray-300 py-2 rounded-lg font-bold hover:bg-gray-50 transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                    </svg>
                    Google
                </button>

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
