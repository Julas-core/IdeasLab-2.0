import React, { useState } from 'react';
import type { Solution } from '../types';
import { KeyIcon, ClipboardIcon } from './icons/AllIcons';

interface SolutionCardProps {
    solution: Solution;
}

const SolutionCard: React.FC<SolutionCardProps> = ({ solution }) => {
    const { title, description, effectivenessScore, noCodePrompt } = solution;
    const [isPromptVisible, setIsPromptVisible] = useState(false);
    const [copied, setCopied] = useState(false);

    const getScoreColor = (score: number) => {
        if (score > 75) return 'bg-green-500';
        if (score > 40) return 'bg-yellow-500';
        return 'bg-red-500';
    };

    const handleCopy = () => {
        if (noCodePrompt) {
            navigator.clipboard.writeText(noCodePrompt);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    return (
        <div className="bg-gray-700/40 p-5 rounded-lg border border-gray-700/60 hover:border-gray-600 transition-all duration-200">
            <div className="flex justify-between items-start gap-4">
                <div className="flex-1">
                    <h4 className="text-lg font-bold text-gray-100">{title}</h4>
                    <p className="text-gray-300 mt-2">{description}</p>
                </div>
                <div className="flex-shrink-0 flex flex-col items-center">
                    <span className="text-xs text-gray-400 mb-1">Effectiveness</span>
                    <div className="relative w-16 h-16">
                        <svg className="w-full h-full" viewBox="0 0 36 36">
                            <path
                                d="M18 2.0845
                                a 15.9155 15.9155 0 0 1 0 31.831
                                a 15.9155 15.9155 0 0 1 0 -31.831"
                                className="text-gray-600/50"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="3"
                            />
                            <path
                                d="M18 2.0845
                                a 15.9155 15.9155 0 0 1 0 31.831
                                a 15.9155 15.9155 0 0 1 0 -31.831"
                                className={getScoreColor(effectivenessScore).replace('bg-', 'text-')}
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="3"
                                strokeDasharray={`${effectivenessScore}, 100`}
                                strokeLinecap="round"
                                transform="rotate(-90 18 18)"
                            />
                        </svg>
                        <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-lg font-bold text-white">
                            {effectivenessScore}
                        </span>
                    </div>
                </div>
            </div>
            
            <div className="mt-4 pt-4 border-t border-gray-600/50">
                {!isPromptVisible ? (
                    <button 
                        onClick={() => setIsPromptVisible(true)}
                        className="w-full flex items-center justify-center gap-2 bg-yellow-500/10 hover:bg-yellow-500/20 text-yellow-300 font-semibold py-2 px-4 rounded-lg transition-colors duration-200">
                        <KeyIcon className="w-5 h-5"/>
                        <span>View Pro Builder Prompt</span>
                    </button>
                ) : (
                    <div>
                        <div className="flex justify-between items-center mb-2">
                            <h5 className="text-sm font-bold text-yellow-300 flex items-center gap-2">
                               <KeyIcon className="w-5 h-5"/>
                               AI No-Code Builder Prompt
                            </h5>
                             <button onClick={handleCopy} className="flex items-center gap-1.5 text-xs bg-gray-600/50 hover:bg-gray-600 px-2 py-1 rounded text-gray-300 hover:text-white transition-all duration-200">
                                <ClipboardIcon className="w-4 h-4"/>
                                {copied ? 'Copied!' : 'Copy'}
                            </button>
                        </div>
                        <pre className="bg-gray-900/70 p-4 rounded-md text-sm text-gray-200 whitespace-pre-wrap font-mono max-h-48 overflow-y-auto">
                            <code>{noCodePrompt}</code>
                        </pre>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SolutionCard;