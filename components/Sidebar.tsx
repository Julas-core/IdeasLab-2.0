
import React, { useState, useEffect, useRef } from 'react';
import { ChevronDownIcon } from './icons/AllIcons';

interface SidebarProps {
  categories: string[];
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  activeView: string;
  onViewChange: (view: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ categories, selectedCategory, onCategoryChange, activeView, onViewChange }) => {
  const navItems = ['Home', 'Dashboard', 'My Watchlist', 'Challenges', 'Reports', 'API Access'];
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleCategorySelect = (category: string) => {
    onCategoryChange(category);
    setIsDropdownOpen(false);
  };
  
  return (
    <aside className="hidden md:block w-64 bg-gray-900/60 border-r border-gray-700/50 p-6">
      <nav className="space-y-4">
        <div>
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Menu</h3>
          <ul className="space-y-1">
            {navItems.map((item) => {
              const isActive = activeView === item;
              const isClickable = item === 'Home' || item === 'Dashboard' || item === 'My Watchlist';
              return (
              <li key={item}>
                <button
                  onClick={() => isClickable && onViewChange(item)}
                  disabled={!isClickable}
                  className={`w-full flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors text-left ${
                    isActive 
                      ? 'bg-gray-700/50 text-white' 
                      : isClickable 
                        ? 'text-gray-400 hover:bg-gray-800/50 hover:text-white' 
                        : 'text-gray-600 cursor-not-allowed'
                  }`}
                >
                  {item}
                </button>
              </li>
            )})}
          </ul>
        </div>
        <div className="pt-4">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Filters</h3>
           <div className="relative" ref={dropdownRef}>
              <button 
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="w-full flex justify-between items-center text-left bg-gray-800/70 border border-gray-700 rounded-md py-2 px-3 text-sm text-gray-200 focus:outline-none focus:ring-2 focus:ring-cyan-500"
              >
                <span className="truncate">{selectedCategory}</span>
                <ChevronDownIcon className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
              </button>
              {isDropdownOpen && (
                <div className="absolute z-10 mt-1 w-full bg-gray-800 border border-gray-700 rounded-md shadow-lg max-h-60 overflow-y-auto">
                    <ul className="py-1">
                        {categories.map(category => (
                            <li key={category}>
                                <button 
                                    onClick={() => handleCategorySelect(category)}
                                    className="w-full text-left px-3 py-2 text-sm text-gray-300 hover:bg-gray-700/50 transition-colors"
                                >
                                    {category}
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
              )}
           </div>
        </div>
      </nav>
    </aside>
  );
};

export default Sidebar;
