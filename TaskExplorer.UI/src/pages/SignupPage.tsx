import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ParticleBackground } from '../components/common/ParticleBackground';
import { Zap, Mail, Lock, User, ArrowRight } from 'lucide-react';

export const SignupPage: React.FC = () => {
    const navigate = useNavigate();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // In a real app, handle registration here
        navigate('/dashboard');
    };

    return (
        <div className="min-h-screen bg-[#0d1117] text-gray-100 font-sans relative flex items-center justify-center p-6">
            <ParticleBackground />

            <div className="relative z-10 w-full max-w-md animate-in fade-in slide-in-from-bottom-8 duration-700">
                <div className="bg-gray-800/40 backdrop-blur-xl border border-gray-700/50 p-8 rounded-2xl shadow-2xl">

                    {/* Header */}
                    <div className="text-center mb-8">
                        <Link to="/" className="inline-flex items-center gap-2 font-bold text-2xl tracking-tight text-white mb-2 hover:opacity-80 transition-opacity">
                            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                                <Zap size={20} className="text-white" fill="currentColor" />
                            </div>
                            TaskExplorer
                        </Link>
                        <h2 className="text-xl font-semibold text-gray-200">Create an account</h2>
                        <p className="text-sm text-gray-400">Start your productivity journey today.</p>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-1">
                            <label className="text-xs font-medium text-gray-400 uppercase tracking-wider">Full Name</label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                                <input
                                    type="text"
                                    placeholder="John Doe"
                                    className="w-full bg-[#0d1117]/50 border border-gray-600 rounded-xl py-3 pl-10 pr-4 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-1">
                            <label className="text-xs font-medium text-gray-400 uppercase tracking-wider">Email</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                                <input
                                    type="email"
                                    placeholder="name@company.com"
                                    className="w-full bg-[#0d1117]/50 border border-gray-600 rounded-xl py-3 pl-10 pr-4 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-1">
                            <label className="text-xs font-medium text-gray-400 uppercase tracking-wider">Password</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                                <input
                                    type="password"
                                    placeholder="Create a password"
                                    className="w-full bg-[#0d1117]/50 border border-gray-600 rounded-xl py-3 pl-10 pr-4 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                                    required
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="w-full flex items-center justify-center gap-2 bg-primary hover:bg-blue-600 text-white font-bold py-3 rounded-xl transition-all hover:scale-[1.02] shadow-[0_0_20px_rgba(37,99,235,0.3)] mt-2"
                        >
                            Create Account
                            <ArrowRight size={18} />
                        </button>
                    </form>

                    {/* Footer */}
                    <div className="mt-8 text-center text-sm text-gray-400">
                        Already have an account?{' '}
                        <Link to="/login" className="text-blue-400 font-medium hover:text-blue-300 transition-colors">
                            Sign in
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};
