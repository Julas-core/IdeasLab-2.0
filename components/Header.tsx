
import React from 'react';
import { SearchIcon, BellIcon } from './icons/AllIcons';

const Header: React.FC = () => {
    return (
        <header className="flex-shrink-0 bg-gray-900/80 backdrop-blur-sm border-b border-gray-700/50">
            <div className="container mx-auto px-4 md:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center">
                       <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-cyan-400 to-blue-500 mr-3"></div>
                        <h1 className="text-xl font-bold text-white">Nexus AI</h1>
                    </div>
                    <div className="flex-1 flex justify-center px-4 lg:px-8">
                        <div className="relative w-full max-w-lg">
                            <input
                                type="text"
                                placeholder="Search problems or solutions..."
                                className="w-full bg-gray-800/70 border border-gray-700 rounded-full py-2 pl-10 pr-4 text-gray-200 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all"
                            />
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <SearchIcon className="w-5 h-5 text-gray-400" />
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <button className="text-gray-400 hover:text-white transition-colors">
                            <BellIcon className="w-6 h-6" />
                        </button>
                        <img
                            src="https://picsum.photos/40"
                            alt="User Avatar"
                            className="w-9 h-9 rounded-full border-2 border-gray-600"
                        />
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
