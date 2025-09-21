import React, { useState, useEffect, useRef } from 'react';
import type { Problem, Priority } from '../types';
import { Priority as PriorityEnum } from '../types';
import { ArrowUpIcon, FireIcon, BookmarkIcon, TagIcon, SearchIcon } from './icons/AllIcons';

interface ProblemCardProps {
    problem: Problem;
    isSelected: boolean;
    onSelect: () => void;
    watchlistPriority: Priority | null;
    onToggleWatchlist: () => void;
    onUpdateWatchlistPriority: (priority: Priority) => void;
}

const PriorityTag: React.FC<{ priority: Priority }> = ({ priority }) => {
    const priorityStyles: Record<Priority, string> = {
        [PriorityEnum.High]: 'bg-red-500/20 text-red-300 border-red-500/30',
        [PriorityEnum.Medium]: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
        [PriorityEnum.Low]: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
    };
    return (
        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border flex items-center gap-1 ${priorityStyles[priority]}`}>
            <TagIcon className="w-3 h-3"/>
            {priority}
        </span>
    );
};


// New component for Trend Score visualization
const TrendIndicator: React.FC<{ score: number }> = ({ score }) => {
    const percentage = (score / 10) * 100;

    return (
        <div className="flex items-center gap-2" title={`Trend Score: ${score.toFixed(1)}`}>
            <FireIcon className="w-4 h-4 text-orange-400 flex-shrink-0" />
            <div className="w-12 h-2 bg-gray-600 rounded-full">
                <div 
                    className="h-full rounded-full"
                    style={{ 
                        width: `${percentage}%`,
                        background: `linear-gradient(to right, #facc15, #f97316)`
                    }} 
                />
            </div>
        </div>
    );
};

// New component for Sentiment Score visualization
const SentimentBar: React.FC<{ score: number }> = ({ score }) => {
    const getSentimentColor = () => {
        if (score > 0.3) return 'bg-green-500';
        if (score < -0.3) return 'bg-red-500';
        return 'bg-yellow-500';
    };

    // Calculate width as a percentage of 50% (since the bar is centered)
    const widthPercentage = Math.min(Math.abs(score) * 50, 50);

    return (
        <div className="w-12 h-2 bg-gray-600 rounded-full flex items-center relative" title={`Sentiment Score: ${score.toFixed(2)}`}>
            <div className="absolute left-1/2 -translate-x-1/2 w-px h-full bg-gray-500/50" />
            <div
                className={`h-full rounded-full ${getSentimentColor()}`}
                style={{
                    width: `${widthPercentage}%`,
                    marginLeft: score >= 0 ? '50%' : `${50 - widthPercentage}%`,
                }}
            />
        </div>
    );
};


const ProblemCard: React.FC<ProblemCardProps> = ({ problem, isSelected, onSelect, watchlistPriority, onToggleWatchlist, onUpdateWatchlistPriority }) => {
    const { title, category, upvotes, trendScore, sentimentScore } = problem;
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);
    const [isShowingAllSources, setIsShowingAllSources] = useState(false);

    const selectedClasses = isSelected 
        ? 'bg-cyan-500/20 border-cyan-400/80 ring-2 ring-cyan-500/50' 
        : 'bg-gray-700/30 border-gray-700/60 hover:bg-gray-700/50 hover:border-gray-600';

    const handleWatchlistClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (watchlistPriority) {
            setIsMenuOpen(!isMenuOpen);
        } else {
            onToggleWatchlist();
        }
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
          if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
            setIsMenuOpen(false);
          }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        if (!isSelected) {
            setIsShowingAllSources(false);
        }
    }, [isSelected]);

    const handlePriorityChange = (priority: Priority) => {
        onUpdateWatchlistPriority(priority);
        setIsMenuOpen(false);
    };

    const handleRemove = () => {
        onToggleWatchlist();
        setIsMenuOpen(false);
    }

    return (
        <div
            onClick={onSelect}
            className={`cursor-pointer p-4 rounded-lg border transition-all duration-200 flex flex-col justify-between ${selectedClasses}`}
        >
            <div>
                <div className="flex justify-between items-start">
                    <span className="text-xs font-semibold bg-gray-600/50 text-gray-300 py-1 px-2 rounded-full">{category}</span>
                    {watchlistPriority && <PriorityTag priority={watchlistPriority} />}
                </div>
                
                <h3 className="font-bold text-md mt-2 text-gray-100 line-clamp-2" title={title}>{title}</h3>

                {isSelected && problem.searchQueries && problem.searchQueries.length > 0 && (
                    <div className="mt-3 text-xs text-gray-400">
                        <h4 className="font-semibold mb-1 flex items-center gap-1.5 text-gray-300">
                            <SearchIcon className="w-3.5 h-3.5" />
                            Related Searches
                        </h4>
                        <ul className="space-y-1 pl-2">
                            {problem.searchQueries.slice(0, isShowingAllSources ? problem.searchQueries.length : 3).map((query, index) => (
                                <li key={index} className="truncate">
                                    <a 
                                        href={`https://www.google.com/search?q=${encodeURIComponent(query)}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        onClick={(e) => e.stopPropagation()}
                                        className="text-cyan-400 hover:text-cyan-300 hover:underline transition-colors"
                                        title={`Search for: "${query}"`}
                                    >
                                        "{query}"
                                    </a>
                                </li>
                            ))}
                        </ul>
                        {problem.searchQueries.length > 3 && (
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setIsShowingAllSources(!isShowingAllSources);
                                }}
                                className="text-xs text-gray-400 hover:text-white pl-2 mt-1 font-semibold focus:outline-none"
                            >
                                {isShowingAllSources ? 'Show less' : `Show ${problem.searchQueries.length - 3} more...`}
                            </button>
                        )}
                    </div>
                )}
            </div>
            
            <div className="flex justify-between items-center mt-3 text-sm text-gray-400">
                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1 text-green-400" title={`Upvotes: ${upvotes.toLocaleString()}`}>
                        <ArrowUpIcon className="w-4 h-4" />
                        <span>{upvotes.toLocaleString()}</span>
                    </div>
                    <div className="relative" ref={menuRef}>
                        <button 
                            onClick={handleWatchlistClick} 
                            title={watchlistPriority ? "Manage watchlist priority" : "Add to watchlist"}
                            className="text-yellow-400 hover:text-yellow-300 transition-colors"
                        >
                            <BookmarkIcon className="w-5 h-5" solid={!!watchlistPriority} />
                        </button>
                        {isMenuOpen && (
                            <div className="absolute z-20 bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 bg-gray-800 border border-gray-700 rounded-md shadow-lg text-left">
                                <div className="p-2">
                                    <p className="text-xs text-gray-400 px-2 pb-1">Set Priority</p>
                                    <button onClick={() => handlePriorityChange(PriorityEnum.High)} className="w-full text-left px-2 py-1.5 text-sm text-red-300 hover:bg-gray-700/50 rounded">High</button>
                                    <button onClick={() => handlePriorityChange(PriorityEnum.Medium)} className="w-full text-left px-2 py-1.5 text-sm text-yellow-300 hover:bg-gray-700/50 rounded">Medium</button>
                                    <button onClick={() => handlePriorityChange(PriorityEnum.Low)} className="w-full text-left px-2 py-1.5 text-sm text-blue-300 hover:bg-gray-700/50 rounded">Low</button>
                                </div>
                                <div className="border-t border-gray-700 p-2">
                                    <button onClick={handleRemove} className="w-full text-left px-2 py-1.5 text-sm text-gray-300 hover:bg-gray-700/50 rounded">Remove from Watchlist</button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
                 <div className="flex items-center gap-3">
                    <TrendIndicator score={trendScore} />
                    <SentimentBar score={sentimentScore} />
                </div>
            </div>
        </div>
    );
};

export default ProblemCard;