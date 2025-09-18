
import React from 'react';
import { SearchIcon, BellIcon, MenuIcon } from './icons/AllIcons';

const Header: React.FC = () => {
    return (
        <header className="flex-shrink-0 bg-slate-950/80 backdrop-blur-xl border-b border-white/10 sticky top-0 z-50">
            <div className="container mx-auto px-4 md:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center">
                       <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-cyan-400 via-purple-500 to-pink-500 mr-3 flex items-center justify-center shadow-lg shadow-purple-500/25">
                           <div className="w-6 h-6 rounded-xl bg-white/20 backdrop-blur-sm"></div>
                       </div>
                        <h1 className="text-xl font-black text-white">
                            <span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">Nexus</span>
                            <span className="text-white/90"> AI</span>
                        </h1>
                    </div>
                    
                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center gap-8">
                        <a href="#" className="text-white/70 hover:text-white font-medium transition-colors">Dashboard</a>
                        <a href="#" className="text-white/70 hover:text-white font-medium transition-colors">Solutions</a>
                        <a href="#" className="text-white/70 hover:text-white font-medium transition-colors">Analytics</a>
                        <a href="#" className="text-white/70 hover:text-white font-medium transition-colors">API</a>
                    </nav>
                    
                    <div className="flex-1 flex justify-center px-4 lg:px-8">
                        <div className="relative w-full max-w-lg">
                            <input
                                type="text"
                                placeholder="Search problems or solutions..."
                                className="w-full bg-white/5 backdrop-blur-xl border border-white/20 rounded-2xl py-3 pl-12 pr-4 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
                            />
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <SearchIcon className="w-5 h-5 text-white/40" />
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <button className="relative p-2 text-white/60 hover:text-white transition-colors">
                            <BellIcon className="w-6 h-6" />
                            <div className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></div>
                        </button>
                        <img
                            src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face"
                            alt="User Avatar"
                            className="w-10 h-10 rounded-2xl border-2 border-white/20 hover:border-purple-500 transition-colors cursor-pointer"
                        />
                        <button className="md:hidden text-white/60 hover:text-white transition-colors">
                            <MenuIcon className="w-6 h-6" />
                        </button>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
