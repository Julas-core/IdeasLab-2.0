import React from 'react';
import type { Problem, Solution } from '../types';
import { Sentiment } from '../types';
import SolutionCard from './SolutionCard';
import { LightBulbIcon, LinkIcon, TrendingUpIcon } from './icons/AllIcons';

interface ProblemDetailViewProps {
    problem: Problem | null;
    solutions: Solution[];
    isLoading: boolean;
    isDarkMode?: boolean;
}

const ProblemDetailView: React.FC<ProblemDetailViewProps> = ({ 
    problem, 
    solutions, 
    isLoading, 
    isDarkMode = true 
}) => {
    if (!problem) {
        return (
            <div className="h-full flex items-center justify-center">
                <div className="text-center">
                    <div className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center ${
                        isDarkMode ? 'bg-gray-800' : 'bg-gray-100'
                    }`}>
                        <LightBulbIcon className="w-8 h-8 text-gray-400" />
                    </div>
                    <p className="text-gray-500 text-sm">Select a problem to view details</p>
                </div>
            </div>
        );
    }
    
    const getSentimentColor = (sentiment: Sentiment) => {
        switch (sentiment) {
            case Sentiment.Positive: return 'text-green-500';
            case Sentiment.Negative: return 'text-red-500';
            default: return 'text-yellow-500';
        }
    }

    const cardClasses = isDarkMode 
        ? 'bg-white/5 border-white/10' 
        : 'bg-white border-gray-200';
    
    return (
        <div className="h-full overflow-y-auto">
            {/* Problem Header */}
            <div className="p-8 border-b border-gray-200/10">
                <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                            <span className={`text-xs px-3 py-1 rounded-full font-medium ${
                                isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'
                            }`}>
                                {problem.category}
                            </span>
                            <div className={`flex items-center gap-1 text-xs px-2 py-1 rounded-full ${
                                getSentimentColor(problem.sentiment)
                            } ${isDarkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
                                <span>{problem.sentiment}</span>
                                <span className="opacity-60">({problem.sentimentScore.toFixed(2)})</span>
                            </div>
                        </div>
                        <h1 className="text-2xl font-light mb-4 leading-tight">{problem.title}</h1>
                    </div>
                    
                    {/* Metrics */}
                    <div className="flex items-center gap-6 text-sm">
                        <div className="text-center">
                            <div className="font-semibold text-lg">{problem.trendScore.toFixed(1)}</div>
                            <div className="text-gray-500 text-xs">Trend Score</div>
                        </div>
                        <div className="text-center">
                            <div className="font-semibold text-lg">{problem.upvotes.toLocaleString()}</div>
                            <div className="text-gray-500 text-xs">Upvotes</div>
                        </div>
                    </div>
                </div>

                <p className="text-gray-600 leading-relaxed mb-6">{problem.description}</p>
                
                {problem.sources && problem.sources.length > 0 && (
                    <div>
                        <h3 className="text-sm font-medium text-gray-500 mb-2 flex items-center gap-2">
                            <LinkIcon className="w-4 h-4" />
                            Sources ({problem.sources.length})
                        </h3>
                        <div className="flex flex-wrap gap-2">
                            {problem.sources.slice(0, 3).map((source, index) => (
                                <a 
                                    key={index} 
                                    href={source} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className={`text-xs px-3 py-1 rounded-full transition-colors ${
                                        isDarkMode 
                                            ? 'bg-blue-500/10 text-blue-400 hover:bg-blue-500/20' 
                                            : 'bg-blue-50 text-blue-600 hover:bg-blue-100'
                                    }`}
                                >
                                    Source {index + 1}
                                </a>
                            ))}
                            {problem.sources.length > 3 && (
                                <span className="text-xs px-3 py-1 rounded-full bg-gray-100/10 text-gray-500">
                                    +{problem.sources.length - 3} more
                                </span>
                            )}
                        </div>
                    </div>
                )}
            </div>

            {/* Solutions Section */}
            <div className="p-8">
                <div className="flex items-center gap-3 mb-6">
                    <LightBulbIcon className="w-5 h-5 text-blue-500" />
                    <h2 className="text-lg font-medium">AI Solutions</h2>
                    {solutions.length > 0 && (
                        <span className={`text-xs px-2 py-1 rounded-full ${
                            isDarkMode ? 'bg-green-500/10 text-green-400' : 'bg-green-50 text-green-600'
                        }`}>
                            {solutions.length} generated
                        </span>
                    )}
                </div>
                
                {isLoading ? (
                    <div className="space-y-4">
                        {[...Array(3)].map((_, i) => (
                            <div key={i} className={`p-6 rounded-xl animate-pulse ${cardClasses}`}>
                                <div className="h-4 bg-gray-300/20 rounded mb-3 w-3/4"></div>
                                <div className="h-3 bg-gray-300/20 rounded mb-2 w-full"></div>
                                <div className="h-3 bg-gray-300/20 rounded w-5/6"></div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="space-y-4">
                        {solutions.map((solution, index) => (
                            <SolutionCard 
                                key={index} 
                                solution={solution} 
                                problem={problem} 
                                isDarkMode={isDarkMode}
                            />
                        ))}
                        {solutions.length === 0 && (
                            <div className="text-center py-12">
                                <div className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center ${
                                    isDarkMode ? 'bg-gray-800' : 'bg-gray-100'
                                }`}>
                                    <TrendingUpIcon className="w-8 h-8 text-gray-400" />
                                </div>
                                <p className="text-gray-500 text-sm">No solutions generated yet</p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProblemDetailView;