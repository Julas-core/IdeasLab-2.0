import React from 'react';
import type { Problem } from '../types';
import { Sentiment } from '../types';
import { ArrowUpIcon, FireIcon, BookmarkIcon } from './icons/AllIcons';

interface ProblemCardProps {
    problem: Problem;
    isSelected: boolean;
    onSelect: () => void;
    isInWatchlist: boolean;
    onToggleWatchlist: () => void;
    viewMode?: 'grid' | 'list';
    isDarkMode?: boolean;
}

const SentimentIndicator: React.FC<{ sentiment: Sentiment; isDarkMode?: boolean }> = ({ sentiment, isDarkMode }) => {
    const sentimentStyles = {
        [Sentiment.Positive]: {
            color: 'text-green-500',
            bg: isDarkMode ? 'bg-green-500/10' : 'bg-green-50',
            text: 'Positive'
        },
        [Sentiment.Neutral]: {
            color: 'text-yellow-500',
            bg: isDarkMode ? 'bg-yellow-500/10' : 'bg-yellow-50',
            text: 'Neutral'
        },
        [Sentiment.Negative]: {
            color: 'text-red-500',
            bg: isDarkMode ? 'bg-red-500/10' : 'bg-red-50',
            text: 'Negative'
        },
    };

    const style = sentimentStyles[sentiment];
    return (
        <div className={`px-2 py-1 rounded-full text-xs font-medium ${style.color} ${style.bg}`}>
            {style.text}
        </div>
    );
};

const ProblemCard: React.FC<ProblemCardProps> = ({ 
    problem, 
    isSelected, 
    onSelect, 
    isInWatchlist, 
    onToggleWatchlist,
    viewMode = 'grid',
    isDarkMode = true
}) => {
    const { title, category, upvotes, sentiment, trendScore } = problem;
    
    const baseClasses = isDarkMode 
        ? 'bg-white/5 border-white/10 hover:bg-white/10' 
        : 'bg-white border-gray-200 hover:bg-gray-50';
    
    const selectedClasses = isSelected 
        ? (isDarkMode ? 'ring-2 ring-blue-500/50 bg-blue-500/10' : 'ring-2 ring-blue-500 bg-blue-50')
        : '';

    const handleWatchlistClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        onToggleWatchlist();
    };

    if (viewMode === 'list') {
        return (
            <div
                onClick={onSelect}
                className={`cursor-pointer p-4 rounded-lg border transition-all duration-200 ${baseClasses} ${selectedClasses}`}
            >
                <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                            <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                                isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'
                            }`}>
                                {category}
                            </span>
                            <SentimentIndicator sentiment={sentiment} isDarkMode={isDarkMode} />
                        </div>
                        <h3 className="font-medium text-sm truncate mb-1">{title}</h3>
                        <div className="flex items-center gap-4 text-xs text-gray-500">
                            <div className="flex items-center gap-1">
                                <ArrowUpIcon className="w-3 h-3" />
                                <span>{upvotes.toLocaleString()}</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <FireIcon className="w-3 h-3" />
                                <span>{trendScore.toFixed(1)}</span>
                            </div>
                        </div>
                    </div>
                    <button 
                        onClick={handleWatchlistClick} 
                        className="ml-3 p-1 rounded-md hover:bg-gray-100/10 transition-colors"
                    >
                        <BookmarkIcon 
                            className={`w-4 h-4 ${isInWatchlist ? 'text-yellow-500' : 'text-gray-400'}`} 
                            solid={isInWatchlist} 
                        />
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div
            onClick={onSelect}
            className={`cursor-pointer p-4 rounded-lg border transition-all duration-200 ${baseClasses} ${selectedClasses}`}
        >
            <div className="flex justify-between items-start mb-3">
                <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                    isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'
                }`}>
                    {category}
                </span>
                <SentimentIndicator sentiment={sentiment} isDarkMode={isDarkMode} />
            </div>
            
            <h3 className="font-medium text-sm mb-3 line-clamp-2 leading-relaxed">{title}</h3>
            
            <div className="flex justify-between items-center">
                <div className="flex items-center gap-3 text-xs text-gray-500">
                    <div className="flex items-center gap-1">
                        <ArrowUpIcon className="w-3 h-3" />
                        <span>{upvotes.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <FireIcon className="w-3 h-3" />
                        <span>{trendScore.toFixed(1)}</span>
                    </div>
                </div>
                <button 
                    onClick={handleWatchlistClick} 
                    className="p-1 rounded-md hover:bg-gray-100/10 transition-colors"
                >
                    <BookmarkIcon 
                        className={`w-4 h-4 ${isInWatchlist ? 'text-yellow-500' : 'text-gray-400'}`} 
                        solid={isInWatchlist} 
                    />
                </button>
            </div>
        </div>
    );
};

export default ProblemCard;