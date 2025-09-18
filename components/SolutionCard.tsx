import React, { useState } from 'react';
import type { Problem, Solution } from '../types';
import { KeyIcon, ClipboardIcon, DownloadIcon, ChevronDownIcon } from './icons/AllIcons';

interface SolutionCardProps {
    solution: Solution;
    problem: Problem;
    isDarkMode?: boolean;
}

const SolutionCard: React.FC<SolutionCardProps> = ({ solution, problem, isDarkMode = true }) => {
    const { title, description, effectivenessScore, noCodePrompt, noCodePromptJson } = solution;
    const [isPromptVisible, setIsPromptVisible] = useState(false);
    const [activePrompt, setActivePrompt] = useState<'formatted' | 'json'>('formatted');
    const [copied, setCopied] = useState(false);

    const getScoreColor = (score: number) => {
        if (score > 75) return isDarkMode ? 'text-green-400 bg-green-500/10' : 'text-green-600 bg-green-50';
        if (score > 40) return isDarkMode ? 'text-yellow-400 bg-yellow-500/10' : 'text-yellow-600 bg-yellow-50';
        return isDarkMode ? 'text-red-400 bg-red-500/10' : 'text-red-600 bg-red-50';
    };

    const cardClasses = isDarkMode 
        ? 'bg-white/5 border-white/10 hover:bg-white/8' 
        : 'bg-white border-gray-200 hover:bg-gray-50';

    const handleCopy = () => {
        const textToCopy = activePrompt === 'formatted' 
            ? noCodePrompt 
            : JSON.stringify(noCodePromptJson, null, 2);

        if (textToCopy) {
            navigator.clipboard.writeText(textToCopy);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    const handleDownload = () => {
        const fileName = `${problem.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_solution.md`;
        
        const markdownContent = `
# Problem: ${problem.title}

**Category:** ${problem.category} | **Sentiment:** ${problem.sentiment} (${problem.sentimentScore.toFixed(2)}) | **Trend:** ${problem.trendScore.toFixed(1)}/10 | **Upvotes:** ${problem.upvotes.toLocaleString()}

## Description
${problem.description}

${problem.sources && problem.sources.length > 0 ? `
## Sources
${problem.sources.map(s => `- [${s}](${s})`).join('\n')}
` : ''}

---

# Solution: ${title}

**Effectiveness Score:** ${effectivenessScore}/100

## Description
${description}

## Pro Builder Prompt (Formatted)
${noCodePrompt}

## Pro Builder Prompt (JSON)
\`\`\`json
${JSON.stringify(noCodePromptJson, null, 2)}
\`\`\`
        `.trim();

        const blob = new Blob([markdownContent], { type: 'text/markdown' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    return (
        <div className={`p-6 rounded-xl border transition-all duration-200 ${cardClasses}`}>
            <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                    <h4 className="text-lg font-medium mb-2">{title}</h4>
                    <p className="text-gray-600 text-sm leading-relaxed">{description}</p>
                </div>
                
                {/* Effectiveness Score */}
                <div className="ml-6 flex-shrink-0">
                    <div className={`px-3 py-1 rounded-full text-sm font-medium ${getScoreColor(effectivenessScore)}`}>
                        {effectivenessScore}% effective
                    </div>
                </div>
            </div>
            
            {/* Prompt Toggle */}
            <div className="border-t border-gray-200/10 pt-4">
                <button 
                    onClick={() => setIsPromptVisible(!isPromptVisible)}
                    className={`w-full flex items-center justify-between p-3 rounded-lg transition-colors ${
                        isDarkMode 
                            ? 'bg-blue-500/10 hover:bg-blue-500/20 text-blue-400' 
                            : 'bg-blue-50 hover:bg-blue-100 text-blue-600'
                    }`}
                >
                    <div className="flex items-center gap-2">
                        <KeyIcon className="w-4 h-4" />
                        <span className="font-medium text-sm">Builder Prompt</span>
                    </div>
                    <ChevronDownIcon 
                        className={`w-4 h-4 transition-transform ${isPromptVisible ? 'rotate-180' : ''}`} 
                    />
                </button>

                {isPromptVisible && (
                    <div className="mt-4 space-y-3">
                        {/* Format Toggle */}
                        <div className="flex items-center justify-between">
                            <div className={`flex rounded-lg p-1 ${
                                isDarkMode ? 'bg-gray-800' : 'bg-gray-100'
                            }`}>
                                <button 
                                    onClick={() => setActivePrompt('formatted')}
                                    className={`px-3 py-1 text-xs rounded-md transition-colors ${
                                        activePrompt === 'formatted' 
                                            ? (isDarkMode ? 'bg-gray-700 text-white' : 'bg-white text-gray-900 shadow-sm')
                                            : 'text-gray-500 hover:text-gray-700'
                                    }`}
                                >
                                    Formatted
                                </button>
                                <button 
                                    onClick={() => setActivePrompt('json')}
                                    className={`px-3 py-1 text-xs rounded-md transition-colors ${
                                        activePrompt === 'json' 
                                            ? (isDarkMode ? 'bg-gray-700 text-white' : 'bg-white text-gray-900 shadow-sm')
                                            : 'text-gray-500 hover:text-gray-700'
                                    }`}
                                >
                                    JSON
                                </button>
                            </div>
                            
                            <div className="flex items-center gap-2">
                                <button 
                                    onClick={handleCopy} 
                                    className={`flex items-center gap-1 px-3 py-1 text-xs rounded-md transition-colors ${
                                        isDarkMode 
                                            ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' 
                                            : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
                                    }`}
                                >
                                    <ClipboardIcon className="w-3 h-3" />
                                    {copied ? 'Copied!' : 'Copy'}
                                </button>
                                <button 
                                    onClick={handleDownload} 
                                    className={`flex items-center gap-1 px-3 py-1 text-xs rounded-md transition-colors ${
                                        isDarkMode 
                                            ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' 
                                            : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
                                    }`}
                                >
                                    <DownloadIcon className="w-3 h-3" />
                                    Export
                                </button>
                            </div>
                        </div>
                        
                        {/* Code Block */}
                        <pre className={`p-4 rounded-lg text-xs font-mono max-h-64 overflow-y-auto ${
                            isDarkMode 
                                ? 'bg-gray-900/70 text-gray-300' 
                                : 'bg-gray-50 text-gray-700'
                        }`}>
                            <code>
                                {activePrompt === 'formatted' 
                                    ? noCodePrompt 
                                    : JSON.stringify(noCodePromptJson, null, 2)
                                }
                            </code>
                        </pre>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SolutionCard;