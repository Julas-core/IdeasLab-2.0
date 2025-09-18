import React, { useState } from 'react';
import type { Problem, Solution } from '../types';
import { KeyIcon, ClipboardIcon, DownloadIcon } from './icons/AllIcons';

interface SolutionCardProps {
    solution: Solution;
    problem: Problem;
}

const SolutionCard: React.FC<SolutionCardProps> = ({ solution, problem }) => {
    const { title, description, effectivenessScore, noCodePrompt, noCodePromptJson } = solution;
    const [isPromptVisible, setIsPromptVisible] = useState(false);
    const [activePrompt, setActivePrompt] = useState<'formatted' | 'json'>('formatted');
    const [copied, setCopied] = useState(false);

    const getScoreColor = (score: number) => {
        if (score > 75) return 'bg-green-500';
        if (score > 40) return 'bg-yellow-500';
        return 'bg-red-500';
    };

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
                <button 
                    onClick={() => setIsPromptVisible(!isPromptVisible)}
                    className="w-full flex items-center justify-center gap-2 bg-yellow-500/10 hover:bg-yellow-500/20 text-yellow-300 font-semibold py-2 px-4 rounded-lg transition-colors duration-200">
                    <KeyIcon className="w-5 h-5"/>
                    <span>{isPromptVisible ? 'Hide Pro Builder Prompt' : 'View Pro Builder Prompt'}</span>
                </button>

                {isPromptVisible && (
                    <div className="mt-4">
                        <div className="flex justify-between items-center mb-2">
                            <div className="flex border border-gray-600 rounded-md p-0.5 bg-gray-900/50">
                                <button 
                                    onClick={() => setActivePrompt('formatted')}
                                    className={`px-3 py-1 text-sm rounded transition-colors duration-200 ${activePrompt === 'formatted' ? 'bg-gray-700 text-white' : 'text-gray-400 hover:bg-gray-800'}`}>
                                    Formatted
                                </button>
                                <button 
                                    onClick={() => setActivePrompt('json')}
                                    className={`px-3 py-1 text-sm rounded transition-colors duration-200 ${activePrompt === 'json' ? 'bg-gray-700 text-white' : 'text-gray-400 hover:bg-gray-800'}`}>
                                    JSON
                                </button>
                            </div>
                             <div className="flex items-center gap-2">
                                <button onClick={handleCopy} className="flex items-center gap-1.5 text-xs bg-gray-600/50 hover:bg-gray-600 px-2 py-1 rounded text-gray-300 hover:text-white transition-all duration-200">
                                    <ClipboardIcon className="w-4 h-4"/>
                                    {copied ? 'Copied!' : 'Copy'}
                                </button>
                                <button onClick={handleDownload} className="flex items-center gap-1.5 text-xs bg-gray-600/50 hover:bg-gray-600 px-2 py-1 rounded text-gray-300 hover:text-white transition-all duration-200">
                                    <DownloadIcon className="w-4 h-4"/>
                                    Download
                                </button>
                            </div>
                        </div>
                        <pre className="bg-gray-900/70 p-4 rounded-md text-sm text-gray-200 whitespace-pre-wrap font-mono max-h-48 overflow-y-auto">
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