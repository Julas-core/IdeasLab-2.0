import { GoogleGenAI } from "@google/genai";
import type { Problem, Solution, Sentiment } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

const ALLOWED_CATEGORIES = ['Technology', 'Healthcare', 'Productivity', 'Environment', 'Urban Living', 'Finance', 'Education', 'Social', 'Entertainment'];

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
        For each problem, provide a concise title, a one-paragraph description, a relevant category, and at least two source URLs where this problem is being discussed.
        The "category" for each problem MUST be one of the following strings: ${ALLOWED_CATEGORIES.map(c => `'${c}'`).join(', ')}.
        Return your findings STRICTLY as a JSON array of objects. Each object must have keys: "title", "description", "category", and "sources" (an array of URL strings). Do not output any text before or after the JSON array.
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

        return problemsData.map((p, index) => {
            const sentimentScore = Math.random() * 2 - 1; // Random score between -1.0 and 1.0
            return {
                id: `problem-${Date.now()}-${index}`,
                title: p.title,
                description: p.description,
                category: p.category,
                sentimentScore: sentimentScore,
                sentiment: getSentiment(sentimentScore),
                trendScore: Math.random() * 9 + 1, // Random score between 1 and 10
                upvotes: Math.floor(Math.random() * 2500),
                sources: p.sources || []
            };
        });
    } catch (error) {
        console.error("Error fetching problems from Gemini API:", error);
        // Fallback to empty array in case of API error
        return [];
    }
};


export const generateSolutions = async (problem: Problem): Promise<Solution[]> => {
    try {
        const prompt = `
        Given the problem: "${problem.title} - ${problem.description}". 
        Generate 3 innovative solutions using AI.
        Return your findings STRICTLY as a JSON array of objects. Each object must have the following keys:
        - "title": A concise title for the proposed solution.
        - "description": A detailed description of how generative AI, machine learning, or automation could solve the problem.
        - "effectivenessScore": A predicted effectiveness score from 1 to 100 for this solution.
        - "noCodePrompt": A detailed, actionable prompt for an AI no-code builder to create an MVP, formatted in markdown. Use headings (e.g., ## Core Features), bold text (e.g., **User Profile**), and bulleted lists (e.g., - item) to outline core features, data requirements, and AI model interactions.
        - "noCodePromptJson": A JSON object representation of the no-code builder prompt. This JSON object must have keys like "appName", "coreFeatures" (an array of feature description strings), "dataRequirements" (an array of data point strings), and "aiModelInteractions" (an array of interaction description strings).
        
        Do not output any text before or after the JSON array.
        `;

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
        });

        const jsonText = response.text.trim();
        const cleanedJson = jsonText.replace(/^```json\n?/, '').replace(/```$/, '');
        return JSON.parse(cleanedJson) as Solution[];
    } catch (error) {
        console.error("Error generating solutions from Gemini API:", error);
        return [];
    }
};