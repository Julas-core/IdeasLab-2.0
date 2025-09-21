import React from 'react';

// A component to render markdown text to styled JSX, with support for tables, blockquotes, headings, lists, and strikethrough text.
const MarkdownRenderer: React.FC<{ content: string }> = ({ content }) => {
    const parseInline = (line: string): (string | JSX.Element)[] => {
        // Regex to split by **bold**, `code`, and ~~strikethrough~~
        const parts = line.split(/(\*\*.*?\*\*|`.*?`|~~.*?~~)/g);
        return parts.map((part, index) => {
            if (part.startsWith('**') && part.endsWith('**')) {
                return <strong key={index} className="font-bold text-gray-100">{part.slice(2, -2)}</strong>;
            }
            if (part.startsWith('`') && part.endsWith('`')) {
                return <code key={index} className="bg-gray-900 text-yellow-300 px-1.5 py-1 rounded text-sm font-mono">{part.slice(1, -1)}</code>;
            }
            if (part.startsWith('~~') && part.endsWith('~~')) {
                return <s key={index} className="text-gray-500">{part.slice(2, -2)}</s>;
            }
            return part;
        });
    };

    const lines = content.split('\n');
    const elements: JSX.Element[] = [];
    let i = 0;

    while (i < lines.length) {
        const line = lines[i];

        // Headings
        if (line.startsWith('## ')) {
            elements.push(<h5 key={i} className="text-xl font-semibold mt-6 mb-2 text-gray-200">{parseInline(line.substring(3))}</h5>);
            i++;
            continue;
        }
        if (line.startsWith('# ')) {
            elements.push(<h4 key={i} className="text-2xl font-bold mt-8 mb-3 text-gray-100 border-b border-gray-700 pb-2">{parseInline(line.substring(2))}</h4>);
            i++;
            continue;
        }

        // Tables
        if (line.includes('|') && i + 1 < lines.length && lines[i + 1].includes('|') && lines[i + 1].includes('-')) {
            const separatorLine = lines[i + 1].trim();
            const isSeparator = separatorLine.split('|').slice(1, -1).every(cell => /^\s*:?-+:?\s*$/.test(cell.trim()));
            
            if (isSeparator) {
                const headerLine = lines[i];
                const headers = headerLine.split('|').slice(1, -1).map(h => h.trim());
                const rows = [];
                i += 2; // Move past header and separator

                while (i < lines.length && lines[i].trim().startsWith('|')) {
                    const rowCells = lines[i].split('|').slice(1, -1).map(c => c.trim());
                    if (rowCells.length === headers.length) {
                        rows.push(rowCells);
                    }
                    i++;
                }

                elements.push(
                    <div key={`table-wrapper-${i}`} className="my-4 overflow-x-auto">
                        <table className="w-full border-collapse border border-gray-600 text-left">
                            <thead className="bg-gray-700/50">
                                <tr>
                                    {headers.map((header, hIndex) => (
                                        <th key={hIndex} className="border border-gray-600 px-4 py-2 text-sm font-semibold text-gray-200">{parseInline(header)}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {rows.map((row, rIndex) => (
                                    <tr key={rIndex} className="bg-gray-800/40 even:bg-gray-700/30">
                                        {row.map((cell, cIndex) => (
                                            <td key={cIndex} className="border border-gray-600 px-4 py-2 text-sm text-gray-300">{parseInline(cell)}</td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                );
                continue;
            }
        }

        // Blockquotes (Improved to handle multi-paragraph quotes)
        if (line.startsWith('>')) {
            const blockquoteContent = [];
            while (i < lines.length && lines[i].startsWith('>')) {
                blockquoteContent.push(lines[i].substring(1).trim());
                i++;
            }
            const paragraphs = blockquoteContent.join('\n').split(/\n{2,}/);
            elements.push(
                <blockquote key={`bq-${i}`} className="border-l-4 border-gray-600 pl-4 italic my-4 text-gray-400">
                    {paragraphs.map((p, index) => <p key={index} className="my-2 first:mt-0 last:mb-0">{parseInline(p.replace(/\n/g, ' '))}</p>)}
                </blockquote>
            );
            continue;
        }

        // Unordered lists
        if (line.trim().startsWith('- ') || line.trim().startsWith('* ')) {
            const listItems: (string | JSX.Element)[][] = [];
            while (i < lines.length && (lines[i].trim().startsWith('- ') || lines[i].trim().startsWith('* '))) {
                listItems.push(parseInline(lines[i].trim().substring(2)));
                i++;
            }
            
            elements.push(
                <ul key={`ul-${i}`} className="list-disc list-inside space-y-2 my-4 pl-4">
                    {listItems.map((item, itemIndex) => <li key={itemIndex}>{item}</li>)}
                </ul>
            );
            continue;
        }

        // Paragraphs
        if (line.trim() !== '') {
            elements.push(<p key={i} className="my-3 leading-relaxed">{parseInline(line)}</p>);
        }

        i++;
    }
    
    return <>{elements}</>;
};

export default MarkdownRenderer;
