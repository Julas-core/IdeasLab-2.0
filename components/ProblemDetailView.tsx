import React, { useState } from 'react';
import type { Problem, Solution, User } from '../types';
import { Sentiment } from '../types';
import SolutionCard from './SolutionCard';
import { LightBulbIcon, SearchIcon, TrophyIcon, PlusIcon } from './icons/AllIcons';

interface ProblemDetailViewProps {
    problem: Problem | null;
    solutions: Solution[];
    isLoading: boolean;
    onGenerateChallenge: (problem: Problem) => void;
    isGeneratingChallenge: boolean;
    onAddSolution: (problemId: string, title: string, description: string) => void;
    onUpvoteSolution: (problemId: string, solutionId: string) => void;
    onUpdateSolution: (problemId: string, solutionId: string, newTitle: string, newDescription: string) => void;
    currentUser: User;
    onViewSolutionFullscreen: (problem: Problem, solution: Solution) => void;
}

const SubmitSolutionForm: React.FC<{ onSubmit: (title: string, description: string) => void }> = ({ onSubmit }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [isExpanded, setIsExpanded] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (title.trim() && description.trim()) {
            onSubmit(title.trim(), description.trim());
            setTitle('');
            setDescription('');
            setIsExpanded(false);
        }
    };

    if (!isExpanded) {
        return (
             <button
                onClick={() => setIsExpanded(true)}
                className="w-full flex items-center justify-center gap-2 bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 font-semibold py-2.5 px-4 rounded-lg transition-colors duration-200">
                <PlusIcon className="w-5 h-5"/>
                Submit Your Solution
            </button>
        )
    }

    return (
        <form onSubmit={handleSubmit} className="bg-gray-700/30 p-4 rounded-lg border border-gray-700/50">
            <h3 className="text-lg font-semibold text-gray-200 mb-3">Submit Your Solution</h3>
            <div className="space-y-3">
                <input
                    type="text"
                    placeholder="Solution Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                    className="w-full bg-gray-800/70 border border-gray-600 rounded-md py-2 px-3 text-gray-200 focus:outline-none focus:ring-1 focus:ring-cyan-500"
                />
                <textarea
                    placeholder="Describe your solution..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                    rows={3}
                    className="w-full bg-gray-800/70 border border-gray-600 rounded-md py-2 px-3 text-gray-200 focus:outline-none focus:ring-1 focus:ring-cyan-500"
                />
            </div>
            <div className="flex justify-end gap-3 mt-4">
                 <button 
                    type="button"
                    onClick={() => setIsExpanded(false)}
                    className="bg-gray-600/50 hover:bg-gray-600 text-gray-300 font-semibold py-2 px-4 rounded-lg transition-colors">
                    Cancel
                </button>
                <button 
                    type="submit"
                    className="bg-purple-500 hover:bg-purple-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors disabled:opacity-50"
                    disabled={!title.trim() || !description.trim()}
                >
                    Submit
                </button>
            </div>
        </form>
    );
};


const ProblemDetailView: React.FC<ProblemDetailViewProps> = ({ problem, solutions, isLoading, onGenerateChallenge, isGeneratingChallenge, onAddSolution, onUpvoteSolution, onUpdateSolution, currentUser, onViewSolutionFullscreen }) => {
    if (!problem) {
        return (
            <div className="h-full flex items-center justify-center bg-gray-800/50 rounded-xl border border-gray-700/50">
                <p className="text-gray-400">Select a problem to see details</p>
            </div>
        );
    }
    
    const getSentimentColor = (sentiment: Sentiment) => {
        switch (sentiment) {
            case Sentiment.Positive: return 'text-green-400';
            case Sentiment.Negative: return 'text-red-400';
            default: return 'text-yellow-400';
        }
    }
    
    const sortedSolutions = [...solutions].sort((a, b) => b.upvotes - a.upvotes);
    
    return (
        <div className="bg-gray-800/50 rounded-xl p-6 md:p-8 border border-gray-700/50 h-full overflow-y-auto">
            <span className="text-sm font-semibold bg-gray-600/50 text-gray-300 py-1 px-3 rounded-full">{problem.category}</span>
            <h1 className="text-2xl md:text-3xl font-bold my-4 text-white">{problem.title}</h1>
            
            <div className="flex flex-wrap gap-x-6 gap-y-2 text-gray-400 mb-6">
                <div className="flex items-center gap-2">
                    <span className="font-semibold text-gray-300">Sentiment:</span>
                    <span className={getSentimentColor(problem.sentiment)}>{problem.sentiment} ({problem.sentimentScore.toFixed(2)})</span>
                </div>
                <div className="flex items-center gap-2">
                     <span className="font-semibold text-gray-300">Trend Score:</span>
                    <span className="text-orange-400">{problem.trendScore.toFixed(1)}/10</span>
                </div>
                 <div className="flex items-center gap-2">
                     <span className="font-semibold text-gray-300">Upvotes:</span>
                    <span className="text-green-400">{problem.upvotes.toLocaleString()}</span>
                </div>
            </div>

            <p className="text-gray-300 leading-relaxed mb-6">{problem.description}</p>
            
            {problem.searchQueries && problem.searchQueries.length > 0 && (
                 <div className="mb-8">
                    <h3 className="text-md font-bold text-gray-300 mb-3 flex items-center gap-2">
                        <SearchIcon className="w-5 h-5" />
                        Related Searches
                    </h3>
                    <div className="flex flex-col gap-2">
                       {problem.searchQueries.map((query, index) => (
                           <a 
                                key={index} 
                                href={`https://www.google.com/search?q=${encodeURIComponent(query)}`}
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-sm text-cyan-400 hover:text-cyan-300 hover:underline truncate transition-colors"
                                title={`Search for: "${query}"`}
                           >
                               "{query}"
                           </a>
                       ))}
                    </div>
                </div>
            )}
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                 <SubmitSolutionForm onSubmit={(title, description) => onAddSolution(problem.id, title, description)} />
                 <button 
                    onClick={() => onGenerateChallenge(problem)}
                    disabled={isGeneratingChallenge}
                    className="w-full flex items-center justify-center gap-2 bg-yellow-500/10 hover:bg-yellow-500/20 text-yellow-300 font-semibold py-2.5 px-4 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <TrophyIcon className="w-5 h-5"/>
                    {isGeneratingChallenge ? 'Generating...' : 'Create Challenge'}
                </button>
            </div>
           
            <div className="border-t border-gray-700/50 pt-8">
                <h2 className="text-xl font-bold text-cyan-300 mb-6 flex items-center gap-2">
                    <LightBulbIcon className="w-6 h-6"/>
                    Solution Marketplace ({solutions.length})
                </h2>
                {isLoading ? (
                    <div className="space-y-4">
                       {[...Array(3)].map((_, i) => (
                           <div key={i} className="bg-gray-700/50 p-4 rounded-lg animate-pulse">
                               <div className="h-6 w-3/4 bg-gray-600/50 rounded mb-3"></div>
                               <div className="h-4 w-full bg-gray-600/50 rounded mb-2"></div>
                               <div className="h-4 w-5/6 bg-gray-600/50 rounded"></div>
                           </div>
                       ))}
                    </div>
                ) : (
                    <div className="space-y-4">
                        {sortedSolutions.map((solution) => (
                            <SolutionCard 
                                key={solution.id} 
                                solution={solution} 
                                problem={problem} 
                                onUpvote={() => onUpvoteSolution(problem.id, solution.id)}
                                onUpdateSolution={(solutionId, title, description) => onUpdateSolution(problem.id, solutionId, title, description)}
                                currentUser={currentUser}
                                onViewFullscreen={() => onViewSolutionFullscreen(problem, solution)}
                             />
                        ))}
                         {solutions.length === 0 && <p className="text-gray-500">No solutions yet. Be the first to submit one!</p>}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProblemDetailView;