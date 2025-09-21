import React, { useState, useEffect, useMemo } from 'react';
import type { Problem, Solution, WatchlistItem, Priority, User } from '../types';
import { Priority as PriorityEnum } from '../types';
import ProblemCard from './ProblemCard';
import ProblemDetailView from './ProblemDetailView';
import CategoryDistributionChart from './CategoryDistributionChart';
import { PlusIcon, FireIcon } from './icons/AllIcons';

interface DashboardProps {
    selectedCategory: string;
    activeView: string;
    watchlist: WatchlistItem[];
    onToggleWatchlist: (problemId: string) => void;
    onUpdateWatchlistPriority: (problemId: string, priority: Priority) => void;
    problems: Problem[];
    isLoadingProblems: boolean;
    searchQuery: string;
    selectedProblem: Problem | null;
    onSelectProblem: (problem: Problem | null) => void;
    onRefetchProblems: () => void;
    onGenerateChallenge: (problem: Problem) => void;
    isGeneratingChallenge: boolean;
    solutions: Solution[];
    isLoadingSolutions: boolean;
    onAddSolution: (problemId: string, title: string, description: string) => void;
    onUpvoteSolution: (problemId: string, solutionId: string) => void;
    onUpdateSolution: (problemId: string, solutionId: string, newTitle: string, newDescription: string) => void;
    currentUser: User;
    onViewSolutionFullscreen: (problem: Problem, solution: Solution) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ 
    selectedCategory, 
    activeView, 
    watchlist, 
    onToggleWatchlist,
    onUpdateWatchlistPriority,
    problems,
    isLoadingProblems,
    searchQuery,
    selectedProblem,
    onSelectProblem,
    onRefetchProblems,
    onGenerateChallenge,
    isGeneratingChallenge,
    solutions,
    isLoadingSolutions,
    onAddSolution,
    onUpvoteSolution,
    onUpdateSolution,
    currentUser,
    onViewSolutionFullscreen,
}) => {
    const [sortBy, setSortBy] = useState<string>('trendScore');
    
    const watchlistMap = useMemo(() => 
        new Map(watchlist.map(item => [item.problemId, item.priority])),
    [watchlist]);

    const filteredAndSortedProblems = useMemo(() => {
        // 1. Filter by view (watchlist)
        const baseProblems = activeView === 'My Watchlist' 
            ? problems.filter(p => watchlistMap.has(p.id))
            : problems;

        // 2. Filter by category
        const categoryFiltered = selectedCategory === 'All Categories'
            ? baseProblems
            : baseProblems.filter(p => p.category === selectedCategory);
        
        // 3. Filter by search query (title, description)
        const debouncedSearchQuery = searchQuery.toLowerCase();
        const searchFiltered = debouncedSearchQuery
            ? categoryFiltered.filter(p => 
                p.title.toLowerCase().includes(debouncedSearchQuery) ||
                p.description.toLowerCase().includes(debouncedSearchQuery)
              )
            : categoryFiltered;
        
        // 4. Sort
        const priorityOrder = { [PriorityEnum.High]: 3, [PriorityEnum.Medium]: 2, [PriorityEnum.Low]: 1 };
        return [...searchFiltered].sort((a, b) => {
            switch (sortBy) {
                case 'priority':
                    const priorityA = watchlistMap.get(a.id);
                    const priorityB = watchlistMap.get(b.id);
                    return (priorityOrder[priorityB!] || 0) - (priorityOrder[priorityA!] || 0);
                case 'trendScore':
                    return b.trendScore - a.trendScore;
                case 'upvotes':
                    return b.upvotes - a.upvotes;
                case 'sentimentScore':
                    return b.sentimentScore - a.sentimentScore;
                case 'createdAt':
                    return b.createdAt - a.createdAt;
                default:
                    return 0;
            }
        });

    }, [problems, selectedCategory, activeView, watchlistMap, searchQuery, sortBy]);

    useEffect(() => {
        // If the current selectedProblem is not in the filtered list,
        // or if no problem is selected, default to the first problem in the filtered list.
        const isSelectedProblemInFilteredList = selectedProblem && filteredAndSortedProblems.some(p => p.id === selectedProblem.id);
        
        if (!isSelectedProblemInFilteredList && !isLoadingProblems) {
            onSelectProblem(filteredAndSortedProblems.length > 0 ? filteredAndSortedProblems[0] : null);
        }
    }, [filteredAndSortedProblems, selectedProblem, onSelectProblem, isLoadingProblems]);

    const categoryDistributionData = useMemo(() => {
        const counts: { [key: string]: number } = {};
        problems.forEach(problem => {
            counts[problem.category] = (counts[problem.category] || 0) + 1;
        });
        return Object.entries(counts)
            .map(([name, value]) => ({ name, value }))
            .sort((a, b) => b.value - a.value);
    }, [problems]);

    const getEmptyStateMessage = () => {
        if (isLoadingProblems) return ''; // Don't show a message during the main load
        if (activeView === 'My Watchlist' && filteredAndSortedProblems.length === 0) {
            return "Your watchlist is empty. Add problems to see them here.";
        }
        if (searchQuery && filteredAndSortedProblems.length === 0) {
            return `No problems found for "${searchQuery}".`;
        }
        return `No problems found in "${selectedCategory}".`;
    }
    
    useEffect(() => {
        // Reset sort to trendScore if switching away from watchlist when sorted by priority
        if (activeView !== 'My Watchlist' && sortBy === 'priority') {
            setSortBy('trendScore');
        }
    }, [activeView, sortBy]);


    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-full">
            <div className="lg:col-span-1 flex flex-col gap-6 h-full">
                <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700/50 flex-shrink-0">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-bold text-cyan-300 flex items-center">
                            <FireIcon className="w-6 h-6 mr-2" />
                            {activeView === 'My Watchlist' ? 'My Watchlist' : 'Trending Problems'}
                        </h2>
                         <select 
                            value={sortBy} 
                            onChange={(e) => setSortBy(e.target.value)} 
                            className="bg-gray-700/50 border border-gray-600 rounded-md px-2 py-1 text-sm text-gray-200 focus:outline-none focus:ring-1 focus:ring-cyan-500"
                            aria-label="Sort problems by"
                        >
                            {activeView === 'My Watchlist' && <option value="priority">Sort by Priority</option>}
                            <option value="trendScore">Sort by Trend</option>
                            <option value="upvotes">Sort by Upvotes</option>
                            <option value="sentimentScore">Sort by Sentiment</option>
                            <option value="createdAt">Sort by Recent</option>
                        </select>
                    </div>
                    {isLoadingProblems && problems.length === 0 ? (
                        <div className="space-y-4">
                            {[...Array(5)].map((_, i) => (
                               <div key={i} className="h-16 bg-gray-700/50 rounded-lg animate-pulse"></div>
                            ))}
                        </div>
                    ) : (
                        <div className="space-y-3 max-h-[calc(100vh-380px)] overflow-y-auto pr-2">
                           {filteredAndSortedProblems.length > 0 ? (
                                filteredAndSortedProblems.map(problem => (
                                    <ProblemCard 
                                        key={problem.id}
                                        problem={problem}
                                        isSelected={selectedProblem?.id === problem.id}
                                        onSelect={() => onSelectProblem(problem)}
                                        watchlistPriority={watchlistMap.get(problem.id) || null}
                                        onToggleWatchlist={() => onToggleWatchlist(problem.id)}
                                        onUpdateWatchlistPriority={(priority) => onUpdateWatchlistPriority(problem.id, priority)}
                                    />
                                ))
                            ) : (
                                <div className="text-center text-gray-500 py-8">
                                    {getEmptyStateMessage()}
                                </div>
                            )}
                        </div>
                    )}
                     <button 
                        onClick={onRefetchProblems}
                        disabled={isLoadingProblems}
                        className="w-full mt-4 flex items-center justify-center gap-2 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 font-semibold py-2 px-4 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed">
                        <PlusIcon className="w-5 h-5"/>
                        {isLoadingProblems ? 'Discovering...' : 'Discover More Problems'}
                    </button>
                </div>
                <CategoryDistributionChart data={categoryDistributionData} />
            </div>

            <div className="lg:col-span-2 h-full">
                <ProblemDetailView 
                    problem={selectedProblem} 
                    solutions={solutions}
                    isLoading={isLoadingSolutions}
                    onGenerateChallenge={onGenerateChallenge}
                    isGeneratingChallenge={isGeneratingChallenge}
                    onAddSolution={onAddSolution}
                    onUpvoteSolution={onUpvoteSolution}
                    onUpdateSolution={onUpdateSolution}
                    currentUser={currentUser}
                    onViewSolutionFullscreen={onViewSolutionFullscreen}
                />
            </div>
        </div>
    );
};

export default Dashboard;