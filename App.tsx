
import React, { useState } from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';

const App: React.FC = () => {
  const categories = ['All Categories', 'Technology', 'Healthcare', 'Productivity', 'Environment', 'Urban Living', 'Finance', 'Education', 'Social', 'Entertainment'];
  const [selectedCategory, setSelectedCategory] = useState<string>('All Categories');

  return (
    <div className="min-h-screen flex flex-col bg-gray-900 text-gray-200 font-sans">
      <Header />
      <div className="flex flex-1">
        <Sidebar 
          categories={categories}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
        />
        <main className="flex-1 p-4 md:p-8 overflow-y-auto">
          <Dashboard selectedCategory={selectedCategory} />
        </main>
      </div>
    </div>
  );
};

export default App;
