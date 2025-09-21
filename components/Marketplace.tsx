import React from 'react';
import type { Problem, Solution } from '../types';
import { StoreIcon, ArrowUpIcon } from './icons/AllIcons';

interface MarketplaceProps {
    problems: Problem[];
    solutions: Record<string, Solution[]>;
    onSelectProblem: (problem: Problem) => void;
    onUpvoteSolution: (problemId: string, solutionId: string) => void;
}

const SolutionListItem: React.FC<{ problemId: string, solution: Solution, onUpvoteSolution: (problemId: string, solutionId: string) => void }> = ({ problemId, solution, onUpvoteSolution }) => (
    <div className="flex justify-between items-center py-2 border-b border-gray-700/50 last:border-b-0">
        <div>
            <p className="text-sm font-semibold text-gray-200 truncate" title={solution.title}>{solution.title}</p>
            <p className="text-xs text-gray-400">
                By: <span className={solution.author === 'AI' ? 'text-cyan-400' : 'text-purple-400'}>{solution.author === 'AI' ? 'Nexus AI' : solution.author}</span>
            </p>
        </div>
        <button 
            onClick={(e) => { e.stopPropagation(); onUpvoteSolution(problemId, solution.id); }}
            className="flex items-center gap-2 bg-gray-700/50 hover:bg-gray-700 text-gray-300 font-semibold py-1.5 px-3 rounded-full transition-colors text-sm flex-shrink-0"
        >
            <ArrowUpIcon className="w-4 h-4" />
            <span>{solution.upvotes}</span>
        </button>
    </div>
);


const Marketplace: React.FC<MarketplaceProps> = ({ problems, solutions, onSelectProblem, onUpvoteSolution }) => {
    
    if (problems.length === 0) {
         return (
             <div className="h-full flex flex-col items-center justify-center bg-gray-800/50 rounded-xl border border-gray-700/50 p-8 text-center">
                <StoreIcon className="w-16 h-16 text-gray-600 mb-4" />
                <h1 className="text-2xl font-bold text-white">Marketplace is Empty</h1>
                <p className="text-gray-400 mt-2 max-w-md">
                    Discover problems in the dashboard to populate the marketplace with AI-generated solutions, or submit your own!
                </p>
            </div>
        )
    }

    return (
        <div className="h-full">
            <div className="mb-8">
                <h1 className="text-3xl md:text-4xl font-bold text-white flex items-center mb-2">
                    <StoreIcon className="w-10 h-10 mr-4 text-purple-300" />
                    Solution Marketplace
                </h1>
                <p className="text-gray-400">Browse, submit, and vote on the best solutions for trending problems.</p>
            </div>
             <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {problems.map(problem => {
                    const problemSolutions = solutions[problem.id] || [];
                    const sortedSolutions = [...problemSolutions].sort((a, b) => b.upvotes - a.upvotes);
                    
                    return (
                        <div key={problem.id} className="bg-gray-800/50 p-6 rounded-xl border border-gray-700/50 flex flex-col">
                            <span className="text-xs font-semibold bg-gray-600/50 text-gray-300 py-1 px-2 rounded-full self-start">{problem.category}</span>
                            <h3 className="font-bold text-lg text-gray-100 mt-3">{problem.title}</h3>
                            <p className="text-sm text-gray-400 mt-2 flex-grow line-clamp-3">{problem.description}</p>
                            
                            <div className="mt-4 pt-4 border-t border-gray-700/60">
                                <h4 className="text-sm font-semibold text-gray-300 mb-2">Top Solutions ({problemSolutions.length})</h4>
                                <div className="space-y-1">
                                    {sortedSolutions.slice(0, 3).map(sol => (
                                        <SolutionListItem key={sol.id} problemId={problem.id} solution={sol} onUpvoteSolution={onUpvoteSolution} />
                                    ))}
                                    {sortedSolutions.length === 0 && <p className="text-xs text-gray-500 text-center py-2">No solutions yet. Be the first!</p>}
                                </div>
                            </div>

                            <button 
                                onClick={() => onSelectProblem(problem)}
                                className="w-full mt-4 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 font-semibold py-2 px-4 rounded-lg transition-colors duration-200"
                            >
                                View Details & Submit
                            </button>
                        </div>
                    )
                })}
            </div>
        </div>
    );
};

export default Marketplace;