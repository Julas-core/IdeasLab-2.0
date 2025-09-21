import React, { useState } from 'react';
import type { Problem, Solution, User } from '../types';
import { KeyIcon, ClipboardIcon, DownloadIcon, ArrowUpIcon, PencilIcon, ExpandIcon } from './icons/AllIcons';
import MarkdownRenderer from './MarkdownRenderer';

interface SolutionCardProps {
    solution: Solution;
    problem: Problem;
    onUpvote: () => void;
    onUpdateSolution: (solutionId: string, title: string, description: string) => void;
    currentUser: User;
    onViewFullscreen: () => void;
}

const SolutionCard: React.FC<SolutionCardProps> = ({ solution, problem, onUpvote, onUpdateSolution, currentUser, onViewFullscreen }) => {
    const { id, title, description, effectivenessScore, noCodePrompt, noCodePromptJson, author, upvotes, authorId } = solution;
    const [isPromptVisible, setIsPromptVisible] = useState(false);
    const [activePrompt, setActivePrompt] = useState<'formatted' | 'json'>('formatted');
    const [copied, setCopied] = useState(false);
    
    const [isEditing, setIsEditing] = useState(false);
    const [editedTitle, setEditedTitle] = useState(title);
    const [editedDescription, setEditedDescription] = useState(description);

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
        const fileName = `${problem.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_solution_brief.md`;
        
        const markdownContent = `
# Problem: ${problem.title}

**Category:** ${problem.category} | **Sentiment:** ${problem.sentiment} (${problem.sentimentScore.toFixed(2)}) | **Trend:** ${problem.trendScore.toFixed(1)}/10 | **Upvotes:** ${problem.upvotes.toLocaleString()}
${problem.locationName ? `**Location:** ${problem.locationName}\n` : ''}
## Description
${problem.description}

${problem.searchQueries && problem.searchQueries.length > 0 ? `
## Related Searches
${problem.searchQueries.map(s => `- "${s}"`).join('\n')}
` : ''}

---

# Solution: ${solution.title}

**Author:** ${solution.author}
${solution.effectivenessScore ? `**Effectiveness Score:** ${solution.effectivenessScore}/100\n` : ''}
## Description
${solution.description}

${solution.noCodePrompt ? `## Pro Builder Prompt (Formatted)
${solution.noCodePrompt}
` : ''}
${solution.noCodePromptJson ? `## Pro Builder Prompt (JSON)
\`\`\`json
${JSON.stringify(solution.noCodePromptJson, null, 2)}
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

    const handleSaveEdit = () => {
        if (editedTitle.trim() && editedDescription.trim()) {
            onUpdateSolution(id, editedTitle.trim(), editedDescription.trim());
            setIsEditing(false);
        }
    };

    const isUserAuthor = authorId === currentUser.uid;

    return (
        <div className="bg-gray-700/30 p-4 md:p-6 rounded-lg border border-gray-700/50 transition-all duration-300 hover:border-cyan-500/50">
            <div className="flex justify-between items-start gap-4">
                <div className="flex-1">
                    {!isEditing ? (
                        <>
                            <h3 className="font-bold text-lg text-gray-100">{title}</h3>
                            <p className="text-xs text-gray-400 mt-1">
                                By <span className={author === 'AI' ? 'font-semibold text-cyan-400' : 'font-semibold text-purple-400'}>{author === 'AI' ? 'Nexus AI' : author}</span>
                                {effectivenessScore && (
                                    <span className="ml-3 inline-flex items-center gap-1.5">
                                        <span className="text-gray-500">|</span>
                                        Effectiveness:
                                        <span className="font-bold text-gray-200">{effectivenessScore}</span>
                                        <span className={`w-3 h-3 rounded-full ${getScoreColor(effectivenessScore)}`}></span>
                                    </span>
                                )}
                            </p>
                        </>
                    ) : (
                        <div className="flex flex-col gap-2">
                             <input
                                type="text"
                                value={editedTitle}
                                onChange={(e) => setEditedTitle(e.target.value)}
                                className="w-full bg-gray-800/70 border border-gray-600 rounded-md py-1 px-2 text-lg font-bold text-gray-100 focus:outline-none focus:ring-1 focus:ring-cyan-500"
                            />
                        </div>
                    )}
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                    {isUserAuthor && !isEditing && (
                         <button onClick={() => setIsEditing(true)} title="Edit Solution" className="text-gray-400 hover:text-white transition-colors p-1.5 rounded-md hover:bg-gray-600/50">
                            <PencilIcon className="w-5 h-5"/>
                        </button>
                    )}
                    <button onClick={onUpvote} className="flex items-center gap-2 bg-gray-700/50 hover:bg-gray-700 text-gray-300 font-semibold py-1.5 px-3 rounded-full transition-colors">
                        <ArrowUpIcon className="w-4 h-4" />
                        <span>{upvotes}</span>
                    </button>
                </div>
            </div>

            {!isEditing ? (
                 <p className="text-gray-300 mt-4 text-sm leading-relaxed">{description}</p>
            ) : (
                <div className="flex flex-col gap-2 mt-4">
                    <textarea
                        value={editedDescription}
                        onChange={(e) => setEditedDescription(e.target.value)}
                        rows={4}
                        className="w-full bg-gray-800/70 border border-gray-600 rounded-md py-2 px-3 text-sm text-gray-300 focus:outline-none focus:ring-1 focus:ring-cyan-500"
                    />
                     <div className="flex justify-end gap-2">
                        <button onClick={() => setIsEditing(false)} className="bg-gray-600/50 hover:bg-gray-600 text-gray-300 font-semibold py-1 px-3 rounded-lg text-sm transition-colors">Cancel</button>
                        <button onClick={handleSaveEdit} className="bg-cyan-600 hover:bg-cyan-700 text-white font-semibold py-1 px-3 rounded-lg text-sm transition-colors">Save</button>
                    </div>
                </div>
            )}
           
            {noCodePrompt && (
                <div className="mt-4 pt-4 border-t border-gray-600/50">
                    {!isPromptVisible ? (
                        <button 
                            onClick={() => setIsPromptVisible(true)}
                            className="w-full flex items-center justify-center gap-2 bg-yellow-500/10 hover:bg-yellow-500/20 text-yellow-300 font-semibold py-2 px-4 rounded-lg transition-colors duration-200">
                            <KeyIcon className="w-5 h-5" />
                            View Pro Builder Prompt
                        </button>
                    ) : (
                        <div>
                            <div className="flex justify-between items-center mb-3">
                                <div className="flex items-center gap-1 bg-gray-800/50 p-1 rounded-lg border border-gray-700/50">
                                    <button onClick={() => setActivePrompt('formatted')} className={`px-3 py-1 text-sm font-semibold rounded-md transition-colors ${activePrompt === 'formatted' ? 'bg-gray-600 text-white' : 'text-gray-400 hover:text-white'}`}>Formatted</button>
                                    <button onClick={() => setActivePrompt('json')} className={`px-3 py-1 text-sm font-semibold rounded-md transition-colors ${activePrompt === 'json' ? 'bg-gray-600 text-white' : 'text-gray-400 hover:text-white'}`}>JSON</button>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button onClick={handleCopy} className="flex items-center gap-1.5 text-sm bg-gray-700/50 hover:bg-gray-700 px-3 py-1.5 rounded-lg text-gray-300 hover:text-white transition-all duration-200">
                                        <ClipboardIcon className="w-4 h-4"/>
                                        {copied ? 'Copied!' : 'Copy'}
                                    </button>
                                    <button onClick={handleDownload} className="flex items-center gap-1.5 text-sm bg-gray-700/50 hover:bg-gray-700 px-3 py-1.5 rounded-lg text-gray-300 hover:text-white transition-all duration-200">
                                        <DownloadIcon className="w-4 h-4"/>
                                        Download
                                    </button>
                                     <button onClick={onViewFullscreen} title="View Fullscreen" className="flex items-center gap-1.5 text-sm bg-gray-700/50 hover:bg-gray-700 p-2 rounded-lg text-gray-300 hover:text-white transition-all duration-200">
                                        <ExpandIcon className="w-4 h-4"/>
                                    </button>
                                </div>
                            </div>

                            <div className="bg-gray-900/50 p-4 rounded-md border border-gray-600/70 max-h-96 overflow-y-auto">
                               {activePrompt === 'formatted' ? (
                                   <div className="prose prose-sm prose-invert max-w-none">
                                        <MarkdownRenderer content={noCodePrompt || ''} />
                                   </div>
                               ) : (
                                    <pre className="text-xs text-yellow-200 whitespace-pre-wrap break-words">
                                        <code>{JSON.stringify(noCodePromptJson, null, 2)}</code>
                                    </pre>
                               )}
                            </div>
                            <button onClick={() => setIsPromptVisible(false)} className="text-xs text-gray-400 hover:text-white mt-2">Hide Prompt</button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default SolutionCard;