
import React from 'react';
import { ChevronDownIcon } from './icons/AllIcons';

const Sidebar: React.FC = () => {
  const navItems = ['Dashboard', 'My Watchlist', 'Challenges', 'Reports', 'API Access'];
  const categories = ['All Categories', 'Productivity', 'Healthcare', 'Environment', 'Urban Living', 'Finance', 'Education'];
  
  return (
    <aside className="hidden md:block w-64 bg-gray-900/60 border-r border-gray-700/50 p-6">
      <nav className="space-y-4">
        <div>
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Menu</h3>
          <ul className="space-y-1">
            {navItems.map((item, index) => (
              <li key={item}>
                <a href="#" className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${index === 0 ? 'bg-gray-700/50 text-white' : 'text-gray-400 hover:bg-gray-800/50 hover:text-white'}`}>
                  {item}
                </a>
              </li>
            ))}
          </ul>
        </div>
        <div className="pt-4">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Filters</h3>
           <div className="relative">
              <button className="w-full flex justify-between items-center text-left bg-gray-800/70 border border-gray-700 rounded-md py-2 px-3 text-sm text-gray-200 focus:outline-none focus:ring-2 focus:ring-cyan-500">
                <span>All Categories</span>
                <ChevronDownIcon className="w-4 h-4 text-gray-400" />
              </button>
              {/* Dropdown would be implemented here */}
           </div>
        </div>
      </nav>
    </aside>
  );
};

export default Sidebar;
