import React, { useState, useRef, useEffect } from 'react';
import { SearchIcon, BellIcon, MapPinIcon } from './icons/AllIcons';
import type { User } from '../types';

interface HeaderProps {
    searchQuery: string;
    onSearchChange: (query: string) => void;
    locationQuery: string;
    onLocationChange: (query: string) => void;
    currentUser: User | null;
    onLogout: () => void;
}

const UserAvatar: React.FC<{ user: User | null }> = ({ user }) => {
    if (user?.photoURL) {
        return (
            <img 
                src={user.photoURL} 
                alt={user.displayName || 'User Avatar'} 
                className="w-9 h-9 rounded-full border-2 border-gray-600"
                referrerPolicy="no-referrer"
            />
        );
    }
    
    const initials = user?.displayName
        ?.split(' ')
        .map(n => n[0])
        .slice(0, 2)
        .join('')
        .toUpperCase() || '';
    
    // Simple hash function to get a color
    const hashCode = (str: string) => {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            hash = str.charCodeAt(i) + ((hash << 5) - hash);
        }
        return hash;
    };
    
    const colors = [
        'bg-cyan-500', 'bg-blue-500', 'bg-purple-500', 
        'bg-pink-500', 'bg-red-500', 'bg-orange-500', 
        'bg-yellow-500', 'bg-green-500', 'bg-teal-500'
    ];
    
    const color = colors[Math.abs(hashCode(user?.displayName || '')) % colors.length];

    return (
        <div className={`w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-sm border-2 border-gray-600 ${color}`}>
            {initials}
        </div>
    );
};


const Header: React.FC<HeaderProps> = ({ searchQuery, onSearchChange, locationQuery, onLocationChange, currentUser, onLogout }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

     useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
          if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
            setIsMenuOpen(false);
          }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <header className="flex-shrink-0 bg-gray-900/80 backdrop-blur-sm border-b border-gray-700/50">
            <div className="container mx-auto px-4 md:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center">
                       <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-cyan-400 to-blue-500 mr-3"></div>
                        <h1 className="text-xl font-bold text-white">Nexus AI</h1>
                    </div>
                    <div className="flex-1 flex justify-center px-4 lg:px-8 gap-4">
                        <div className="relative w-full max-w-md">
                            <input
                                type="text"
                                placeholder="Search problems by keyword..."
                                value={searchQuery}
                                onChange={(e) => onSearchChange(e.target.value)}
                                className="w-full bg-gray-800/70 border border-gray-700 rounded-full py-2 pl-10 pr-4 text-gray-200 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all"
                            />
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <SearchIcon className="w-5 h-5 text-gray-400" />
                            </div>
                        </div>
                         <div className="relative w-full max-w-sm">
                            <input
                                type="text"
                                placeholder="Search by location (e.g., Tokyo)"
                                value={locationQuery}
                                onChange={(e) => onLocationChange(e.target.value)}
                                className="w-full bg-gray-800/70 border border-gray-700 rounded-full py-2 pl-10 pr-4 text-gray-200 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all"
                            />
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <MapPinIcon className="w-5 h-5 text-gray-400" />
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <button className="text-gray-400 hover:text-white transition-colors">
                            <BellIcon className="w-6 h-6" />
                        </button>
                        {currentUser && (
                            <div className="relative" ref={menuRef}>
                                <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="flex items-center gap-2">
                                    <span className="text-sm font-medium text-gray-200 hidden sm:block">{currentUser.displayName}</span>
                                    <UserAvatar user={currentUser} />
                                </button>
                                {isMenuOpen && (
                                     <div className="absolute z-30 top-full right-0 mt-2 w-48 bg-gray-800 border border-gray-700 rounded-md shadow-lg text-left">
                                         <div className="p-2">
                                            <button onClick={onLogout} className="w-full text-left px-2 py-1.5 text-sm text-red-300 hover:bg-gray-700/50 rounded">
                                                Logout
                                            </button>
                                        </div>
                                     </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;