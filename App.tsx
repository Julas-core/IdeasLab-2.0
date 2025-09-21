import React, { useState, useEffect, useCallback } from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import Heatmap from './components/Heatmap';
import Challenges from './components/Challenges';
import Marketplace from './components/Marketplace';
import Login from './components/Login';
import FullscreenSolutionView from './components/FullscreenSolutionView';
import { Problem, Challenge, Solution, WatchlistItem, Priority, User } from './types';
import { fetchProblems, generateChallenge, generateSolutions } from './services/geminiService';
import { auth } from './services/firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';

function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);
  return debouncedValue;
}

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const categories = ['All Categories', 'Technology', 'Healthcare', 'Productivity', 'Environment', 'Urban Living', 'Finance', 'Education', 'Social', 'Entertainment'];
  const [selectedCategory, setSelectedCategory] = useState<string>('All Categories');
  const [activeView, setActiveView] = useState<string>('Dashboard');
  const [watchlist, setWatchlist] = useState<WatchlistItem[]>([]);
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [allSolutions, setAllSolutions] = useState<Record<string, Solution[]>>({});
  
  const [problems, setProblems] = useState<Problem[]>([]);
  const [selectedProblem, setSelectedProblem] = useState<Problem | null>(null);
  const [isLoadingProblems, setIsLoadingProblems] = useState<boolean>(true);
  const [isLoadingSolutions, setIsLoadingSolutions] = useState<boolean>(false);
  const [isGeneratingChallenge, setIsGeneratingChallenge] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [locationQuery, setLocationQuery] = useState('');
  const [fullscreenSolution, setFullscreenSolution] = useState<{ problem: Problem, solution: Solution } | null>(null);

  const debouncedLocationQuery = useDebounce(locationQuery, 750);
  
  // Listen for auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUser({
          uid: user.uid,
          displayName: user.displayName,
          photoURL: user.photoURL,
        });
      } else {
        setCurrentUser(null);
      }
      setIsAuthLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // Load user-specific data from localStorage when currentUser changes
  useEffect(() => {
    if (!currentUser) return;
    try {
      const savedWatchlist = localStorage.getItem(`${currentUser.uid}_problemWatchlist`);
      if (savedWatchlist) setWatchlist(JSON.parse(savedWatchlist));
      
      const savedChallenges = localStorage.getItem(`${currentUser.uid}_challenges`);
      if (savedChallenges) setChallenges(JSON.parse(savedChallenges));

      const savedSolutions = localStorage.getItem(`${currentUser.uid}_allSolutions`);
      if (savedSolutions) setAllSolutions(JSON.parse(savedSolutions));

    } catch (error) {
      console.error("Failed to parse data from localStorage", error);
    }
  }, [currentUser]);

  // Persist user-specific data to localStorage
  useEffect(() => {
    if (currentUser) localStorage.setItem(`${currentUser.uid}_problemWatchlist`, JSON.stringify(watchlist));
  }, [watchlist, currentUser]);
  
  useEffect(() => {
    if (currentUser) localStorage.setItem(`${currentUser.uid}_challenges`, JSON.stringify(challenges));
  }, [challenges, currentUser]);
  
  useEffect(() => {
    if (currentUser) localStorage.setItem(`${currentUser.uid}_allSolutions`, JSON.stringify(allSolutions));
  }, [allSolutions, currentUser]);

  const loadProblems = useCallback(async (location?: string) => {
    setIsLoadingProblems(true);
    setProblems([]);
    const fetchedProblems = await fetchProblems(location);
    setProblems(fetchedProblems);
    setIsLoadingProblems(false);
  }, []);

  useEffect(() => {
    loadProblems(debouncedLocationQuery).catch(console.error);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedLocationQuery]);

  useEffect(() => {
    if (selectedProblem && !allSolutions[selectedProblem.id]) {
      const fetchAndSetSolutions = async () => {
        setIsLoadingSolutions(true);
        const generatedSolutions = await generateSolutions(selectedProblem);
        setAllSolutions(prev => ({
          ...prev,
          [selectedProblem.id]: generatedSolutions
        }));
        setIsLoadingSolutions(false);
      };
      fetchAndSetSolutions();
    }
  }, [selectedProblem, allSolutions]);


  const handleToggleWatchlist = (problemId: string) => {
    setWatchlist(prev => {
      const existingIndex = prev.findIndex(item => item.problemId === problemId);
      if (existingIndex > -1) {
        return prev.filter(item => item.problemId !== problemId);
      } else {
        return [...prev, { problemId, priority: Priority.Medium }];
      }
    });
  };

  const handleUpdateWatchlistPriority = (problemId: string, priority: Priority) => {
    setWatchlist(prev =>
      prev.map(item =>
        item.problemId === problemId ? { ...item, priority } : item
      )
    );
  };
  
  const handleSelectProblem = (problem: Problem | null) => {
    setSelectedProblem(problem);
  };

  const handleSelectProblemAndSwitchView = (problem: Problem) => {
    setActiveView('Dashboard');
    setSelectedProblem(problem);
  };
  
  const handleCreateChallenge = async (problem: Problem) => {
    setIsGeneratingChallenge(true);
    const newChallenge = await generateChallenge(problem);
    if (newChallenge) {
        setChallenges(prev => [newChallenge, ...prev]);
        setActiveView('Challenges');
    }
    setIsGeneratingChallenge(false);
  };

  const handleAddSolution = (problemId: string, title: string, description: string) => {
      if (!currentUser) return;
      const newSolution: Solution = {
        id: `solution-user-${Date.now()}`,
        title,
        description,
        author: currentUser.displayName || 'Anonymous',
        authorId: currentUser.uid,
        upvotes: 1,
      };
      setAllSolutions(prev => ({
        ...prev,
        [problemId]: [...(prev[problemId] || []), newSolution]
      }));
  };

  const handleUpvoteSolution = (problemId: string, solutionId: string) => {
    setAllSolutions(prev => {
        const problemSolutions = prev[problemId] || [];
        const updatedSolutions = problemSolutions.map(sol => 
            sol.id === solutionId ? { ...sol, upvotes: sol.upvotes + 1 } : sol
        );
        return { ...prev, [problemId]: updatedSolutions };
    });
  };
  
  const handleUpdateSolution = (problemId: string, solutionId: string, newTitle: string, newDescription: string) => {
    setAllSolutions(prev => {
        const problemSolutions = prev[problemId] || [];
        const updatedSolutions = problemSolutions.map(sol => 
            sol.id === solutionId 
            ? { ...sol, title: newTitle, description: newDescription } 
            : sol
        );
        return { ...prev, [problemId]: updatedSolutions };
    });
  };

  const handleLogout = () => {
    signOut(auth).then(() => {
      // Reset user-specific state
      setWatchlist([]);
      setChallenges([]);
      setAllSolutions({});
      setActiveView('Dashboard');
      setSelectedCategory('All Categories');
    }).catch((error) => {
      console.error("Logout failed:", error);
    });
  };

  const handleViewSolutionFullscreen = (problem: Problem, solution: Solution) => {
    setFullscreenSolution({ problem, solution });
  };

  const handleCloseFullscreen = () => {
    setFullscreenSolution(null);
  };

  if (isAuthLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="w-16 h-16 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!currentUser) {
    return <Login />;
  }

  const renderActiveView = () => {
    const solutionsForSelectedProblem = selectedProblem ? allSolutions[selectedProblem.id] || [] : [];

    switch (activeView) {
        case 'Heatmap':
            return <Heatmap 
                selectedCategory={selectedCategory} 
                problems={problems}
                onProblemSelect={handleSelectProblemAndSwitchView}
            />;
        case 'Challenges':
            return <Challenges challenges={challenges} />;
        case 'Marketplace':
            return <Marketplace 
                problems={problems}
                solutions={allSolutions}
                onSelectProblem={handleSelectProblemAndSwitchView}
                onUpvoteSolution={handleUpvoteSolution}
            />;
        case 'Dashboard':
        case 'My Watchlist':
        default:
            return <Dashboard 
              selectedCategory={selectedCategory} 
              activeView={activeView}
              watchlist={watchlist}
              onToggleWatchlist={handleToggleWatchlist}
              onUpdateWatchlistPriority={handleUpdateWatchlistPriority}
              problems={problems}
              isLoadingProblems={isLoadingProblems}
              searchQuery={searchQuery}
              selectedProblem={selectedProblem}
              onSelectProblem={handleSelectProblem}
              onRefetchProblems={() => loadProblems(locationQuery)}
              onGenerateChallenge={handleCreateChallenge}
              isGeneratingChallenge={isGeneratingChallenge}
              solutions={solutionsForSelectedProblem}
              isLoadingSolutions={isLoadingSolutions && solutionsForSelectedProblem.length === 0}
              onAddSolution={handleAddSolution}
              onUpvoteSolution={handleUpvoteSolution}
              onUpdateSolution={handleUpdateSolution}
              currentUser={currentUser}
              onViewSolutionFullscreen={handleViewSolutionFullscreen}
            />;
    }
  };


  return (
    <div className="min-h-screen flex flex-col bg-gray-900 text-gray-200 font-sans">
      <Header 
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        locationQuery={locationQuery}
        onLocationChange={setLocationQuery}
        currentUser={currentUser}
        onLogout={handleLogout}
      />
      <div className="flex flex-1">
        <Sidebar 
          categories={categories}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          activeView={activeView}
          onViewChange={setActiveView}
        />
        <main className="flex-1 p-4 md:p-8 overflow-y-auto">
            {renderActiveView()}
        </main>
      </div>
      {fullscreenSolution && (
        <FullscreenSolutionView 
          problem={fullscreenSolution.problem}
          solution={fullscreenSolution.solution}
          onClose={handleCloseFullscreen}
        />
      )}
    </div>
  );
};

export default App;