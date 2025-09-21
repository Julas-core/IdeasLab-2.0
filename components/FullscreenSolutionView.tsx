import React, { useEffect } from 'react';
import type { Problem, Solution } from '../types';
import MarkdownRenderer from './MarkdownRenderer';
import { XMarkIcon, KeyIcon, DownloadIcon } from './icons/AllIcons';

interface FullscreenSolutionViewProps {
    problem: Problem;
    solution: Solution;
    onClose: () => void;
}

const FullscreenSolutionView: React.FC<FullscreenSolutionViewProps> = ({ problem, solution, onClose }) => {
    
    // Close modal on escape key press
    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                onClose();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [onClose]);
    
    const handleDownload = () => {
        // Fix: Destructure `searchQueries` instead of `sources`. The `sources` property does not exist on the `Problem` type.
        const { title, description, category, sentiment, sentimentScore, trendScore, upvotes, locationName, searchQueries } = problem;
        const { title: solTitle, author, effectivenessScore, description: solDescription, noCodePrompt, noCodePromptJson } = solution;
        const fileName = `${title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_solution_brief.md`;
        
        const markdownContent = `
# Problem: ${title}

**Category:** ${category} | **Sentiment:** ${sentiment} (${sentimentScore.toFixed(2)}) | **Trend:** ${trendScore.toFixed(1)}/10 | **Upvotes:** ${upvotes.toLocaleString()}
${locationName ? `**Location:** ${locationName}\n` : ''}
## Description
${description}

${searchQueries && searchQueries.length > 0 ? `
## Related Searches
${searchQueries.map(s => `- "${s}"`).join('\n')}
` : ''}

---

# Solution: ${solTitle}

**Author:** ${author}
${effectivenessScore ? `**Effectiveness Score:** ${effectivenessScore}/100\n` : ''}
## Description
${solDescription}

${noCodePrompt ? `## Pro Builder Prompt (Formatted)
${noCodePrompt}
` : ''}
${noCodePromptJson ? `## Pro Builder Prompt (JSON)
\`\`\`json
${JSON.stringify(noCodePromptJson, null, 2)}
\`\`\`
`: ''}
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

    if (!solution) return null;

    return (
        <div 
            className="fixed inset-0 bg-gray-900/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in" 
            onClick={onClose}
        >
            <style>{`
                @keyframes fade-in {
                    from { opacity: 0; transform: scale(0.95); }
                    to { opacity: 1; transform: scale(1); }
                }
                .animate-fade-in {
                    animation: fade-in 0.2s ease-out forwards;
                }
            `}</style>
            <div 
                className="bg-gray-800 rounded-xl border border-gray-700 w-full max-w-4xl h-[90vh] flex flex-col relative shadow-2xl"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex-shrink-0 p-6 border-b border-gray-700 flex justify-between items-center">
                    <div>
                        <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                            <KeyIcon className="w-6 h-6 text-yellow-300"/>
                            Pro Builder Prompt
                        </h2>
                        <p className="text-sm text-gray-400 mt-1">For solution: <span className="font-semibold text-gray-200">{solution.title}</span></p>
                    </div>
                    <div className="flex items-center gap-4">
                        <button onClick={handleDownload} className="hidden sm:flex items-center gap-1.5 text-sm bg-gray-700/50 hover:bg-gray-700 px-3 py-2 rounded-lg text-gray-300 hover:text-white transition-all duration-200">
                            <DownloadIcon className="w-4 h-4"/>
                            Download Brief
                        </button>
                         <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors p-1 rounded-full hover:bg-gray-700">
                            <XMarkIcon className="w-7 h-7"/>
                        </button>
                    </div>
                </div>

                <div className="flex-grow p-6 md:p-8 overflow-y-auto text-gray-300">
                    {solution.noCodePrompt ? (
                        <MarkdownRenderer content={solution.noCodePrompt} />
                    ) : (
                        <p>No prompt available for this solution.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default FullscreenSolutionView;
