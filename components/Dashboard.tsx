import React, { useState, useEffect, useMemo, useCallback } from 'react';
import type { Problem, Solution, TrendData } from '../types';
import { fetchProblems, generateSolutions } from '../services/geminiService';
import ProblemCard from './ProblemCard';
import ProblemDetailView from './ProblemDetailView';
import TrendChart from './TrendChart';
import { PlusIcon, FireIcon, GridIcon, ListIcon, MoonIcon, SunIcon } from './icons/AllIcons';

interface DashboardProps {
    selectedCategory: string;
    activeView: string;
    watchlist: string[];
    onToggleWatchlist: (problemId: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ selectedCategory, activeView, watchlist, onToggleWatchlist }) => {
    const [problems, setProblems] = useState<Problem[]>([]);
    const [selectedProblem, setSelectedProblem] = useState<Problem | null>(null);
    const [solutions, setSolutions] = useState<Solution[]>([]);
    const [isLoadingProblems, setIsLoadingProblems] = useState<boolean>(true);
    const [isLoadingSolutions, setIsLoadingSolutions] = useState<boolean>(false);
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [isDarkMode, setIsDarkMode] = useState<boolean>(true);
    
    const memoizedFetchProblems = useCallback(async () => {
        setIsLoadingProblems(true);
        const fetchedProblems = await fetchProblems();
        setProblems(fetchedProblems);
        setIsLoadingProblems(false);
    }, []);

    useEffect(() => {
        memoizedFetchProblems();
    }, [memoizedFetchProblems]);

    const filteredProblems = useMemo(() => {
        const baseProblems = activeView === 'My Watchlist' 
            ? problems.filter(p => watchlist.includes(p.id))
            : problems;

        if (selectedCategory === 'All Categories') {
            return baseProblems;
        }
        return baseProblems.filter(p => p.category === selectedCategory);
    }, [problems, selectedCategory, activeView, watchlist]);

    useEffect(() => {
        const isSelectedProblemInFilteredList = selectedProblem && filteredProblems.some(p => p.id === selectedProblem.id);
        
        if (!isSelectedProblemInFilteredList) {
            setSelectedProblem(filteredProblems.length > 0 ? filteredProblems[0] : null);
        }
    }, [filteredProblems, selectedProblem]);

    useEffect(() => {
        if (selectedProblem) {
            const fetchSolutions = async () => {
                setIsLoadingSolutions(true);
                setSolutions([]);
                const generatedSolutions = await generateSolutions(selectedProblem);
                setSolutions(generatedSolutions);
                setIsLoadingSolutions(false);
            };
            fetchSolutions();
        } else {
            setSolutions([]);
        }
    }, [selectedProblem]);

    const handleSelectProblem = (problem: Problem) => {
        setSelectedProblem(problem);
    };
    
    const trendData: TrendData[] = useMemo(() => 
        filteredProblems
            .slice(0, 5)
            .sort((a, b) => b.trendScore - a.trendScore)
            .map(p => ({ name: p.title.split(' ').slice(0, 2).join(' '), trend: p.trendScore })),
    [filteredProblems]);

    const getEmptyStateMessage = () => {
        if (activeView === 'My Watchlist') {
            return "Your watchlist is empty. Add problems to see them here.";
        }
        return `No problems found in "${selectedCategory}".`;
    }

    const themeClasses = isDarkMode 
        ? 'bg-slate-950 text-gray-100' 
        : 'bg-gray-50 text-gray-900';

    const cardClasses = isDarkMode 
        ? 'bg-white/5 border-white/10' 
        : 'bg-white border-gray-200';

    return (
        <div className={`min-h-screen transition-colors duration-300 ${themeClasses}`}>
            {/* Minimal Header Bar */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200/10">
                <div className="flex items-center gap-6">
                    <h1 className="text-2xl font-light tracking-tight">
                        {activeView === 'My Watchlist' ? 'Watchlist' : 'Problems'}
                    </h1>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                        <span>{filteredProblems.length} items</span>
                    </div>
                </div>
                
                <div className="flex items-center gap-4">
                    {/* View Toggle */}
                    <div className={`flex items-center rounded-lg p-1 ${cardClasses}`}>
                        <button
                            onClick={() => setViewMode('grid')}
                            className={`p-2 rounded-md transition-colors ${
                                viewMode === 'grid' 
                                    ? 'bg-blue-500 text-white' 
                                    : 'text-gray-500 hover:text-gray-700'
                            }`}
                        >
                            <GridIcon className="w-4 h-4" />
                        </button>
                        <button
                            onClick={() => setViewMode('list')}
                            className={`p-2 rounded-md transition-colors ${
                                viewMode === 'list' 
                                    ? 'bg-blue-500 text-white' 
                                    : 'text-gray-500 hover:text-gray-700'
                            }`}
                        >
                            <ListIcon className="w-4 h-4" />
                        </button>
                    </div>

                    {/* Theme Toggle */}
                    <button
                        onClick={() => setIsDarkMode(!isDarkMode)}
                        className={`p-2 rounded-lg transition-colors ${cardClasses} hover:bg-gray-100/10`}
                    >
                        {isDarkMode ? (
                            <SunIcon className="w-5 h-5 text-yellow-500" />
                        ) : (
                            <MoonIcon className="w-5 h-5 text-gray-600" />
                        )}
                    </button>

                    {/* Refresh Button */}
                    <button 
                        onClick={memoizedFetchProblems}
                        disabled={isLoadingProblems}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                            isLoadingProblems 
                                ? 'opacity-50 cursor-not-allowed' 
                                : 'hover:bg-blue-50 hover:text-blue-600'
                        } ${cardClasses}`}
                    >
                        <PlusIcon className="w-4 h-4" />
                        <span className="hidden sm:inline">
                            {isLoadingProblems ? 'Loading...' : 'Refresh'}
                        </span>
                    </button>
                </div>
            </div>

            <div className="flex flex-1 h-[calc(100vh-120px)]">
                {/* Problems Sidebar */}
                <div className="w-96 border-r border-gray-200/10 flex flex-col">
                    {/* Trend Chart - Minimized */}
                    <div className={`m-4 p-4 rounded-xl ${cardClasses} flex-shrink-0`}>
                        <div className="flex items-center gap-2 mb-3">
                            <FireIcon className="w-4 h-4 text-orange-500" />
                            <h3 className="font-medium text-sm">Trending</h3>
                        </div>
                        <TrendChart data={trendData} />
                    </div>

                    {/* Problems List */}
                    <div className="flex-1 overflow-y-auto px-4 pb-4">
                        {isLoadingProblems ? (
                            <div className="space-y-3">
                                {[...Array(5)].map((_, i) => (
                                    <div key={i} className={`h-20 rounded-lg animate-pulse ${cardClasses}`}></div>
                                ))}
                            </div>
                        ) : (
                            <div className={`space-y-2 ${viewMode === 'grid' ? 'grid grid-cols-1 gap-3' : 'space-y-2'}`}>
                                {filteredProblems.length > 0 ? (
                                    filteredProblems.map(problem => (
                                        <ProblemCard 
                                            key={problem.id}
                                            problem={problem}
                                            isSelected={selectedProblem?.id === problem.id}
                                            onSelect={() => handleSelectProblem(problem)}
                                            isInWatchlist={watchlist.includes(problem.id)}
                                            onToggleWatchlist={() => onToggleWatchlist(problem.id)}
                                            viewMode={viewMode}
                                            isDarkMode={isDarkMode}
                                        />
                                    ))
                                ) : (
                                    <div className="text-center text-gray-500 py-12">
                                        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100/10 flex items-center justify-center">
                                            <FireIcon className="w-8 h-8 text-gray-400" />
                                        </div>
                                        <p className="text-sm">{getEmptyStateMessage()}</p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {/* Main Content Area */}
                <div className="flex-1 overflow-y-auto">
                    <ProblemDetailView 
                        problem={selectedProblem} 
                        solutions={solutions}
                        isLoading={isLoadingSolutions}
                        isDarkMode={isDarkMode}
                    />
                </div>
            </div>
        </div>
    );
};

export default Dashboard;