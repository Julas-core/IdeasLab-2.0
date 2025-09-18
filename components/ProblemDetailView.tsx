import React from 'react';
import type { Problem, Solution } from '../types';
import { Sentiment } from '../types';
import SolutionCard from './SolutionCard';
import { LightBulbIcon, LinkIcon } from './icons/AllIcons';

interface ProblemDetailViewProps {
    problem: Problem | null;
    solutions: Solution[];
    isLoading: boolean;
}

const ProblemDetailView: React.FC<ProblemDetailViewProps> = ({ problem, solutions, isLoading }) => {
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
            
            {problem.sources && problem.sources.length > 0 && (
                 <div className="mb-8">
                    <h3 className="text-md font-bold text-gray-300 mb-3 flex items-center gap-2">
                        <LinkIcon className="w-5 h-5" />
                        Sources
                    </h3>
                    <div className="flex flex-col gap-2">
                       {problem.sources.map((source, index) => (
                           <a 
                                key={index} 
                                href={source} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-sm text-cyan-400 hover:text-cyan-300 hover:underline truncate transition-colors"
                           >
                               {source}
                           </a>
                       ))}
                    </div>
                </div>
            )}

            <div className="border-t border-gray-700/50 pt-8">
                <h2 className="text-xl font-bold text-cyan-300 mb-6 flex items-center gap-2">
                    <LightBulbIcon className="w-6 h-6"/>
                    AI-Generated Solutions
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
                        {solutions.map((solution, index) => (
                            <SolutionCard key={index} solution={solution} />
                        ))}
                         {solutions.length === 0 && <p className="text-gray-500">No solutions generated yet.</p>}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProblemDetailView;