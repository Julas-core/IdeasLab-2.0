
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import type { Problem, Solution, TrendData } from '../types';
import { fetchProblems, generateSolutions } from '../services/geminiService';
import ProblemCard from './ProblemCard';
import ProblemDetailView from './ProblemDetailView';
import TrendChart from './TrendChart';
import { PlusIcon, FireIcon } from './icons/AllIcons';

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
    
    const memoizedFetchProblems = useCallback(async () => {
        setIsLoadingProblems(true);
        const fetchedProblems = await fetchProblems();
        setProblems(fetchedProblems);
        setIsLoadingProblems(false);
    }, []);

    useEffect(() => {
        memoizedFetchProblems();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

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
        // If the current selectedProblem is not in the filtered list,
        // or if no problem is selected, default to the first problem in the filtered list.
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
            setSolutions([]); // Clear solutions if no problem is selected
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

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-full">
            <div className="lg:col-span-1 flex flex-col gap-6 h-full">
                <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700/50 flex-shrink-0">
                    <h2 className="text-xl font-bold text-cyan-300 mb-4 flex items-center">
                        <FireIcon className="w-6 h-6 mr-2" />
                        {activeView === 'My Watchlist' ? 'My Watchlist' : 'Trending Problems'}
                    </h2>
                    {isLoadingProblems ? (
                        <div className="space-y-4">
                            {[...Array(5)].map((_, i) => (
                               <div key={i} className="h-16 bg-gray-700/50 rounded-lg animate-pulse"></div>
                            ))}
                        </div>
                    ) : (
                        <div className="space-y-3 max-h-[calc(100vh-350px)] overflow-y-auto pr-2">
                           {filteredProblems.length > 0 ? (
                                filteredProblems.map(problem => (
                                    <ProblemCard 
                                        key={problem.id}
                                        problem={problem}
                                        isSelected={selectedProblem?.id === problem.id}
                                        onSelect={() => handleSelectProblem(problem)}
                                        isInWatchlist={watchlist.includes(problem.id)}
                                        onToggleWatchlist={() => onToggleWatchlist(problem.id)}
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
                        onClick={memoizedFetchProblems}
                        disabled={isLoadingProblems}
                        className="w-full mt-4 flex items-center justify-center gap-2 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 font-semibold py-2 px-4 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed">
                        <PlusIcon className="w-5 h-5"/>
                        {isLoadingProblems ? 'Discovering...' : 'Discover More Problems'}
                    </button>
                </div>
                <TrendChart data={trendData} />
            </div>

            <div className="lg:col-span-2 h-full">
                <ProblemDetailView 
                    problem={selectedProblem} 
                    solutions={solutions}
                    isLoading={isLoadingSolutions}
                />
            </div>
        </div>
    );
};

export default Dashboard;
