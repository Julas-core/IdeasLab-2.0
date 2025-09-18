
import React from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';

const App: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-900 text-gray-200 font-sans">
      <Header />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-4 md:p-8 overflow-y-auto">
          <Dashboard />
        </main>
      </div>
    </div>
  );
};

export default App;
