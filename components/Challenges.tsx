import React from 'react';
import type { Challenge } from '../types';
import { TrophyIcon } from './icons/AllIcons';

interface ChallengesProps {
    challenges: Challenge[];
}

const getDifficultyClass = (difficulty: 'Easy' | 'Medium' | 'Hard') => {
    switch (difficulty) {
        case 'Easy': return 'bg-green-500/20 text-green-300';
        case 'Medium': return 'bg-yellow-500/20 text-yellow-300';
        case 'Hard': return 'bg-red-500/20 text-red-300';
        default: return 'bg-gray-500/20 text-gray-300';
    }
};


const ChallengeCard: React.FC<{ challenge: Challenge, isFeatured?: boolean }> = ({ challenge, isFeatured = false }) => {
    return (
        <div className={`bg-gray-800/50 p-6 rounded-xl border border-gray-700/50 flex flex-col transition-all duration-300 hover:border-purple-500/50 ${isFeatured ? 'lg:col-span-2' : ''}`}>
             <div className="flex justify-between items-start mb-3">
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${getDifficultyClass(challenge.difficulty)}`}>
                    {challenge.difficulty}
                </span>
                <div className="text-right">
                    <div className="font-bold text-lg text-purple-300">{challenge.prize}</div>
                    <div className="text-xs text-gray-400">Prize</div>
                </div>
            </div>
            <h3 className={`font-bold text-gray-100 ${isFeatured ? 'text-2xl' : 'text-xl'}`}>{challenge.title}</h3>
            <p className="text-sm text-gray-500 mt-1">Based on: <span className="font-medium">{challenge.problemTitle}</span></p>
            <p className={`text-gray-300 mt-4 flex-grow ${isFeatured ? 'text-base' : 'text-sm'}`}>{challenge.description}</p>
            <div className="mt-6 pt-4 border-t border-gray-700/60 flex justify-between items-center text-sm">
                <span className="text-gray-400">Deadline: <span className="font-semibold text-gray-200">{challenge.deadline}</span></span>
                <button className="bg-purple-500/80 hover:bg-purple-500 text-white font-bold py-2 px-4 rounded-lg transition-colors">
                    View Challenge
                </button>
            </div>
        </div>
    )
}

const Challenges: React.FC<ChallengesProps> = ({ challenges }) => {
    const featuredChallenge = challenges.length > 0 ? challenges[0] : null;
    const otherChallenges = challenges.slice(1);

    if (challenges.length === 0) {
        return (
             <div className="h-full flex flex-col items-center justify-center bg-gray-800/50 rounded-xl border border-gray-700/50 p-8 text-center">
                <TrophyIcon className="w-16 h-16 text-gray-600 mb-4" />
                <h1 className="text-2xl font-bold text-white">No Active Challenges</h1>
                <p className="text-gray-400 mt-2 max-w-md">
                    Innovation starts here. Go to the dashboard, select a problem, and click "Create Innovation Challenge" to launch your first event.
                </p>
            </div>
        )
    }

    return (
        <div className="h-full">
            <div className="mb-8">
                <h1 className="text-3xl md:text-4xl font-bold text-white flex items-center mb-2">
                    <TrophyIcon className="w-10 h-10 mr-4 text-purple-300" />
                    Innovation Challenges
                </h1>
                <p className="text-gray-400">Turn problems into opportunities. Participate in challenges to build and showcase your solutions.</p>
            </div>

            {featuredChallenge && (
                <div className="mb-10">
                    <h2 className="text-xl font-bold text-purple-300 mb-4">Featured Challenge</h2>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                         <ChallengeCard challenge={featuredChallenge} isFeatured={true} />
                         <div className="bg-gray-800/50 p-6 rounded-xl border border-gray-700/50 flex flex-col justify-center items-center text-center">
                            <h3 className="text-xl font-bold text-white">Ready to Innovate?</h3>
                            <p className="text-gray-400 mt-2">New challenges are generated based on real-time trending problems. Have an idea? Find a problem and start a challenge!</p>
                             <div className="mt-4 text-5xl font-extrabold text-purple-400/80 tracking-tighter">
                                {String(challenges.length).padStart(2, '0')}
                            </div>
                            <p className="text-gray-500 text-sm">Active Challenges</p>
                         </div>
                    </div>
                </div>
            )}

            {otherChallenges.length > 0 && (
                <div>
                     <h2 className="text-xl font-bold text-purple-300 mb-4">All Challenges</h2>
                     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {otherChallenges.map(challenge => (
                            <ChallengeCard key={challenge.id} challenge={challenge} />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Challenges;
