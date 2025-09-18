import { GoogleGenAI, Type } from "@google/genai";
import type { Problem, Solution, Sentiment } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

const solutionSchema = {
    type: Type.ARRAY,
    items: {
        type: Type.OBJECT,
        properties: {
            title: {
                type: Type.STRING,
                description: "A concise title for the proposed solution."
            },
            description: {
                type: Type.STRING,
                description: "A detailed description of how generative AI, machine learning, or automation could solve the problem."
            },
            effectivenessScore: {
                type: Type.NUMBER,
                description: "A predicted effectiveness score from 1 to 100 for this solution."
            },
            noCodePrompt: {
                type: Type.STRING,
                description: "A detailed, actionable prompt for an AI no-code builder to create an MVP. Outline core features, data requirements, and AI model interactions."
            }
        },
        required: ["title", "description", "effectivenessScore", "noCodePrompt"]
    }
};

const getSentiment = (score: number): Sentiment => {
    if (score > 0.3) return 'Positive' as Sentiment.Positive;
    if (score < -0.3) return 'Negative' as Sentiment.Negative;
    return 'Neutral' as Sentiment.Neutral;
};


export const fetchProblems = async (): Promise<Problem[]> => {
    try {
        const prompt = `
        Act as a market research analyst. Use Google Search to find real-world problems people are discussing online. 
        Scour forums (like Reddit, Hacker News), social media, and YouTube comments. Identify 7 pressing problems or inefficiencies that are ideal for an AI-powered solution.
        For each problem, provide a concise title, a one-paragraph description, a relevant category, a public sentiment score (-1.0 to 1.0), a trend score (1-10), and at least two source URLs where this problem is being discussed.
        Return your findings STRICTLY as a JSON array of objects. Each object must have keys: "title", "description", "category", "sentimentScore", "trendScore", and "sources" (an array of URL strings). Do not output any text before or after the JSON array.
        `;

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                tools: [{googleSearch: {}}],
            },
        });
        
        const jsonText = response.text.trim();
        // The response might be wrapped in markdown JSON backticks, so we clean it.
        const cleanedJson = jsonText.replace(/^```json\n?/, '').replace(/```$/, '');
        const problemsData = JSON.parse(cleanedJson) as any[];

        return problemsData.map((p, index) => ({
            id: `problem-${Date.now()}-${index}`,
            title: p.title,
            description: p.description,
            category: p.category,
            sentimentScore: p.sentimentScore,
            sentiment: getSentiment(p.sentimentScore),
            trendScore: p.trendScore,
            upvotes: Math.floor(Math.random() * 2500),
            sources: p.sources || []
        }));
    } catch (error) {
        console.error("Error fetching problems from Gemini API:", error);
        // Fallback to empty array in case of API error
        return [];
    }
};


export const generateSolutions = async (problem: Problem): Promise<Solution[]> => {
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: `Given the problem: "${problem.title} - ${problem.description}". Generate 3 innovative solutions using AI. For each solution, provide a title, a description, a predicted effectiveness score, and a detailed, actionable prompt for an AI no-code builder to create an MVP of the solution. This prompt should outline the core features, data requirements, and AI model interactions.`,
            config: {
                responseMimeType: "application/json",
                responseSchema: solutionSchema,
            },
        });

        const jsonText = response.text.trim();
        return JSON.parse(jsonText) as Solution[];
    } catch (error) {
        console.error("Error generating solutions from Gemini API:", error);
        return [];
    }
};