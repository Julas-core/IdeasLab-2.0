
import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';

const App: React.FC = () => {
  const categories = ['All Categories', 'Technology', 'Healthcare', 'Productivity', 'Environment', 'Urban Living', 'Finance', 'Education', 'Social', 'Entertainment'];
  const [selectedCategory, setSelectedCategory] = useState<string>('All Categories');
  const [activeView, setActiveView] = useState<string>('Dashboard');
  const [watchlist, setWatchlist] = useState<string[]>([]);

  // Load watchlist from localStorage on initial render
  useEffect(() => {
    try {
      const savedWatchlist = localStorage.getItem('problemWatchlist');
      if (savedWatchlist) {
        setWatchlist(JSON.parse(savedWatchlist));
      }
    } catch (error) {
      console.error("Failed to parse watchlist from localStorage", error);
    }
  }, []);

  // Persist watchlist to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem('problemWatchlist', JSON.stringify(watchlist));
    } catch (error)      {
      console.error("Failed to save watchlist to localStorage", error);
    }
  }, [watchlist]);

  const handleToggleWatchlist = (problemId: string) => {
    setWatchlist(prev => 
      prev.includes(problemId) 
        ? prev.filter(id => id !== problemId) 
        : [...prev, problemId]
    );
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-900 text-gray-200 font-sans">
      <Header />
      <div className="flex flex-1">
        <Sidebar 
          categories={categories}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          activeView={activeView}
          onViewChange={setActiveView}
        />
        <main className="flex-1 p-4 md:p-8 overflow-y-auto">
          <Dashboard 
            selectedCategory={selectedCategory} 
            activeView={activeView}
            watchlist={watchlist}
            onToggleWatchlist={handleToggleWatchlist}
          />
        </main>
      </div>
    </div>
  );
};

export default App;
