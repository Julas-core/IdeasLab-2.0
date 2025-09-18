import React, { useState, useEffect, useMemo } from 'react';
import type { Problem } from '../types';
import { fetchProblems } from '../services/geminiService';
import { MapIcon, MapPinIcon } from './icons/AllIcons';

interface HeatmapProps {
    selectedCategory: string;
}

const Heatmap: React.FC<HeatmapProps> = ({ selectedCategory }) => {
    const [problems, setProblems] = useState<Problem[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadProblems = async () => {
            setIsLoading(true);
            const fetchedProblems = await fetchProblems();
            // Filter for problems that have location data to display on the map
            setProblems(fetchedProblems.filter(p => p.latitude != null && p.longitude != null));
            setIsLoading(false);
        };
        loadProblems();
    }, []);

    const filteredProblems = useMemo(() => {
        if (selectedCategory === 'All Categories') {
            return problems;
        }
        return problems.filter(p => p.category === selectedCategory);
    }, [problems, selectedCategory]);

    const renderMapPlaceholder = () => {
        if (filteredProblems.length === 0) {
            return (
                <div className="h-full flex items-center justify-center">
                    <p className="text-gray-500 text-center">
                        No problems with location data found for "{selectedCategory}".
                    </p>
                </div>
            );
        }
        return (
            <div className="flex-grow bg-gray-900/50 rounded-lg border border-gray-700/50 p-4 relative overflow-hidden">
                {/* Placeholder map background */}
                <div className="absolute inset-0 bg-gray-800 opacity-50"></div>
                 <h2 className="text-center text-gray-500 font-bold text-2xl absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 select-none">
                    [ Interactive Map Placeholder ]
                </h2>

                {/* Render problem pins */}
                {filteredProblems.slice(0, 50).map(problem => ( // Limit pins to avoid clutter
                    <div 
                        key={problem.id}
                        className="absolute transform -translate-x-1/2 -translate-y-full text-cyan-400 hover:text-cyan-300 transition-colors cursor-pointer group"
                        style={{
                            // Simple equirectangular projection
                            left: `${(problem.longitude! + 180) / 360 * 100}%`,
                            top: `${(-problem.latitude! + 90) / 180 * 100}%`,
                        }}
                    >
                       <MapPinIcon className="w-6 h-6 drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]"/>
                       <div className="hidden group-hover:block absolute bottom-full mb-2 left-1/2 -translate-x-1/2 w-max max-w-xs bg-gray-900 text-white text-xs rounded py-1 px-2 border border-gray-700 shadow-lg z-10">
                           <p className="font-bold">{problem.title}</p>
                           <p className="text-gray-400">{problem.locationName}</p>
                       </div>
                    </div>
                ))}
            </div>
        )
    }

    if (isLoading) {
        return (
            <div className="h-full flex items-center justify-center bg-gray-800/50 rounded-xl border border-gray-700/50">
                <div className="text-center">
                    <svg className="animate-spin h-8 w-8 text-cyan-400 mx-auto mb-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <p className="text-gray-400">Loading problem locations...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-gray-800/50 rounded-xl p-6 md:p-8 border border-gray-700/50 h-full flex flex-col">
            <h1 className="text-2xl md:text-3xl font-bold mb-2 text-white flex items-center">
                <MapIcon className="w-8 h-8 mr-3 text-cyan-300" />
                Problem Heatmap
            </h1>
            <p className="text-gray-400 mb-6">Visualizing the global distribution of identified problems. Showing {filteredProblems.length} problems for <span className="font-semibold text-gray-300">'{selectedCategory}'</span>.</p>
            {renderMapPlaceholder()}
        </div>
    );
};

export default Heatmap;
