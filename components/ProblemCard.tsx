
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
}

const SentimentIndicator: React.FC<{ sentiment: Sentiment }> = ({ sentiment }) => {
    const sentimentStyles = {
        [Sentiment.Positive]: {
            icon: '😊',
            color: 'text-green-400',
        },
        [Sentiment.Neutral]: {
            icon: '😐',
            color: 'text-yellow-400',
        },
        [Sentiment.Negative]: {
            icon: '😠',
            color: 'text-red-400',
        },
    };

    const style = sentimentStyles[sentiment];
    return <span className={`text-xl ${style.color}`}>{style.icon}</span>;
};

const ProblemCard: React.FC<ProblemCardProps> = ({ problem, isSelected, onSelect, isInWatchlist, onToggleWatchlist }) => {
    const { title, category, upvotes, sentiment, trendScore } = problem;
    const selectedClasses = isSelected 
        ? 'bg-cyan-500/20 border-cyan-400/80 ring-2 ring-cyan-500/50' 
        : 'bg-gray-700/30 border-gray-700/60 hover:bg-gray-700/50 hover:border-gray-600';

    const handleWatchlistClick = (e: React.MouseEvent) => {
        e.stopPropagation(); // Prevent card selection when clicking the bookmark
        onToggleWatchlist();
    };

    return (
        <div
            onClick={onSelect}
            className={`cursor-pointer p-4 rounded-lg border transition-all duration-200 ${selectedClasses}`}
        >
            <div className="flex justify-between items-start">
                <div>
                    <span className="text-xs font-semibold bg-gray-600/50 text-gray-300 py-1 px-2 rounded-full">{category}</span>
                    <h3 className="font-bold text-md mt-2 text-gray-100">{title}</h3>
                </div>
                <SentimentIndicator sentiment={sentiment} />
            </div>
            <div className="flex justify-between items-center mt-3 text-sm text-gray-400">
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1 text-green-400">
                        <ArrowUpIcon className="w-4 h-4" />
                        <span>{upvotes.toLocaleString()}</span>
                    </div>
                    <button 
                        onClick={handleWatchlistClick} 
                        title={isInWatchlist ? "Remove from watchlist" : "Add to watchlist"}
                        className="text-yellow-400 hover:text-yellow-300 transition-colors"
                    >
                        <BookmarkIcon className="w-5 h-5" solid={isInWatchlist} />
                    </button>
                </div>
                 <div className="flex items-center gap-1 text-orange-400" title="Trend Score">
                    <FireIcon className="w-4 h-4"/>
                    <span>{trendScore.toFixed(1)}</span>
                </div>
            </div>
        </div>
    );
};

export default ProblemCard;
