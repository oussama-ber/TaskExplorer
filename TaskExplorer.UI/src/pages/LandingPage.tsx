import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Zap, Mail, Calendar, Layout, Target } from 'lucide-react';
import { ParticleBackground } from '../components/common/ParticleBackground';

export const LandingPage: React.FC = () => {
    return (
        <div className="min-h-screen bg-[#0d1117] text-gray-100 font-sans relative overflow-x-hidden">
            {/* Background Canvas */}
            <ParticleBackground />

            {/* Content Wrapper */}
            <div className="relative z-10 w-full">

                {/* Navbar */}
                <header className="flex justify-between items-center max-w-7xl mx-auto px-6 py-6">
                    <div className="flex items-center gap-2 font-bold text-2xl tracking-tight text-white">
                        <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                            <Zap size={20} className="text-white" fill="currentColor" />
                        </div>
                        TaskExplorer
                    </div>
                    <Link to="/login" className="hidden md:block text-sm font-semibold text-gray-300 hover:text-white transition-colors">
                        Sign In
                    </Link>
                </header>

                {/* Hero Section */}
                <main className="max-w-7xl mx-auto px-6 pt-20 pb-32">
                    <div className="flex flex-col items-center text-center space-y-8 max-w-3xl mx-auto">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-medium uppercase tracking-wider animate-in fade-in slide-in-from-bottom-4 duration-700">
                            <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
                            Now with Availability Tracking
                        </div>

                        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-white leading-tight animate-in fade-in slide-in-from-bottom-8 duration-1000">
                            Master Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">Day</span>.<br />
                            Achieve Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">Dreams</span>.
                        </h1>

                        <p className="text-lg md:text-xl text-gray-400 max-w-2xl leading-relaxed animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200">
                            The all-in-one workspace for your tasks, goals, and daily routines.
                            Experience a fluid workflow designed to keep you in the zone.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 pt-4 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300">
                            <Link
                                to="/signup"
                                className="inline-flex items-center justify-center gap-2 px-8 py-4 text-base font-bold text-white bg-primary hover:bg-blue-600 rounded-xl transition-all hover:scale-105 shadow-[0_0_20px_rgba(37,99,235,0.3)]"
                            >
                                Get Started Free
                                <ArrowRight size={20} />
                            </Link>
                            <a
                                href="#features"
                                className="inline-flex items-center justify-center gap-2 px-8 py-4 text-base font-medium text-gray-300 bg-gray-800/50 hover:bg-gray-800/80 border border-gray-700 rounded-xl transition-all hover:scale-105 backdrop-blur-sm"
                            >
                                Learn More
                            </a>
                        </div>
                    </div>
                </main>

                {/* Features Section */}
                <section id="features" className="py-24 relative">
                    <div className="absolute inset-0 bg-gradient-to-b from-[#0d1117] via-[#161b22] to-[#0d1117] opacity-80 z-[-1]"></div>
                    <div className="max-w-7xl mx-auto px-6">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl font-bold text-white mb-4">Why TaskExplorer?</h2>
                            <p className="text-gray-400">Everything you need to stay organized and productive.</p>
                        </div>

                        <div className="grid md:grid-cols-3 gap-8">
                            {/* Feature 1 */}
                            <div className="bg-gray-800/40 border border-gray-700/50 p-8 rounded-2xl hover:border-blue-500/30 transition-all hover:bg-gray-800/60 group">
                                <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                                    <Target className="text-blue-400" size={24} />
                                </div>
                                <h3 className="text-xl font-bold text-white mb-3">Goal-Oriented</h3>
                                <p className="text-gray-400 leading-relaxed">
                                    Break down ambitious goals into manageable tasks. visualize your progress and stay motivated with clear milestones.
                                </p>
                            </div>

                            {/* Feature 2 */}
                            <div className="bg-gray-800/40 border border-gray-700/50 p-8 rounded-2xl hover:border-purple-500/30 transition-all hover:bg-gray-800/60 group">
                                <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                                    <Calendar className="text-purple-400" size={24} />
                                </div>
                                <h3 className="text-xl font-bold text-white mb-3">Smart Scheduling</h3>
                                <p className="text-gray-400 leading-relaxed">
                                    Integrated calendar and routine management. Define your availability and find the perfect time for deep work.
                                </p>
                            </div>

                            {/* Feature 3 */}
                            <div className="bg-gray-800/40 border border-gray-700/50 p-8 rounded-2xl hover:border-pink-500/30 transition-all hover:bg-gray-800/60 group">
                                <div className="w-12 h-12 bg-pink-500/20 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                                    <Layout className="text-pink-400" size={24} />
                                </div>
                                <h3 className="text-xl font-bold text-white mb-3">Fluid Dashboard</h3>
                                <p className="text-gray-400 leading-relaxed">
                                    A stunning, responsive dashboard that gives you a bird's-eye view of your productivity. Dark mode included.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Contact Section */}
                <section className="py-24 border-t border-gray-800/50">
                    <div className="max-w-4xl mx-auto px-6 text-center">
                        <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-8 shadow-lg shadow-purple-500/20">
                            <Mail className="text-white" size={32} />
                        </div>
                        <h2 className="text-3xl font-bold text-white mb-4">Get in touch</h2>
                        <p className="text-gray-400 mb-8 max-w-xl mx-auto">
                            Have questions or feedback? We'd love to hear from you. taskexplorer is constantly evolving based on user needs.
                        </p>
                        <a href="mailto:oussema.benrejab@gmail.com" className="inline-flex items-center gap-2 text-white font-medium hover:text-blue-400 transition-colors">
                            oussema.benrejab@gmail.com
                            <ArrowRight size={16} />
                        </a>
                    </div>
                </section>

                {/* Footer */}
                <footer className="py-8 border-t border-gray-800/50 text-center text-gray-500 text-sm">
                    <p>&copy; {new Date().getFullYear()} TaskExplorer. All rights reserved.</p>
                </footer>
            </div>
        </div>
    );
};
