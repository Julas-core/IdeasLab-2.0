
import { GoogleGenAI, Type } from "@google/genai";
import type { Problem, Solution, Sentiment } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

const ALLOWED_CATEGORIES = ['Technology', 'Healthcare', 'Productivity', 'Environment', 'Urban Living', 'Finance', 'Education', 'Social', 'Entertainment'];

const getSentiment = (score: number): Sentiment => {
    if (score > 0.3) return 'Positive' as Sentiment.Positive;
    if (score < -0.3) return 'Negative' as Sentiment.Negative;
    return 'Neutral' as Sentiment.Neutral;
};

const parseAndCleanJson = (jsonText: string): any[] => {
    const cleanedJson = jsonText.replace(/^```json\n?/, '').replace(/```$/, '');
    return JSON.parse(cleanedJson) as any[];
};

const transformProblemData = (problemsData: any[]): Problem[] => {
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
            sources: p.sources || [],
            locationName: p.locationName,
            latitude: p.latitude,
            longitude: p.longitude,
        };
    });
};

export const fetchProblems = async (locationQuery?: string): Promise<Problem[]> => {
    try {
        const locationPrompt = locationQuery 
            ? `in or related to ${locationQuery}`
            : 'across different regions globally';

        const prompt = `
        Act as a market research analyst. Use Google Search to find real-world problems people are discussing online ${locationPrompt}.
        Scour forums (like Reddit, Hacker News), social media, and YouTube comments. Identify 15 pressing problems or inefficiencies that are ideal for an AI-powered solution.
        For each problem, provide:
        - A concise title.
        - A short description (1-2 sentences, ensure any double quotes within the description are properly escaped for JSON).
        - A relevant category from the allowed list.
        - At least two source URLs where this problem is being discussed.
        - An approximate real-world city/country where this problem is prominent ('locationName').
        - The latitude and longitude for that location.

        The "category" for each problem MUST be one of the following strings: ${ALLOWED_CATEGORIES.map(c => `'${c}'`).join(', ')}.
        Return your findings STRICTLY as a JSON array of objects. Each object must have keys: "title", "description", "category", "sources", "locationName", "latitude", and "longitude".
        Do not output any text, markdown, or code fences before or after the JSON array. The response must be raw, valid JSON.
        `;

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                tools: [{googleSearch: {}}],
            },
        });
        
        const problemsData = parseAndCleanJson(response.text.trim());
        return transformProblemData(problemsData);
    } catch (error) {
        console.error("Error fetching problems from Gemini API:", error);
        return [];
    }
};


export const generateSolutions = async (problem: Problem): Promise<Solution[]> => {
    try {
        const prompt = `
        Given the problem: "${problem.title} - ${problem.description}". 
        Generate 3 innovative solutions using AI.
        For each solution, provide a title, a detailed description of how AI can solve the problem, a predicted effectiveness score from 1 to 100, a detailed markdown-formatted prompt for an AI no-code builder, and a JSON object representation of that no-code prompt.
        The JSON object for the no-code prompt must have keys: "appName", "coreFeatures" (array of strings), "dataRequirements" (array of strings), and "aiModelInteractions" (array of strings).
        `;

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            title: {
                                type: Type.STRING,
                                description: "A concise title for the proposed solution.",
                            },
                            description: {
                                type: Type.STRING,
                                description: "A detailed description of how generative AI, machine learning, or automation could solve the problem.",
                            },
                            effectivenessScore: {
                                type: Type.INTEGER,
                                description: "A predicted effectiveness score from 1 to 100 for this solution.",
                            },
                            noCodePrompt: {
                                type: Type.STRING,
                                description: "A detailed, actionable prompt for an AI no-code builder to create an MVP, formatted in markdown.",
                            },
                            noCodePromptJson: {
                                type: Type.OBJECT,
                                description: "A JSON object representation of the no-code builder prompt.",
                                properties: {
                                    appName: { type: Type.STRING },
                                    coreFeatures: { type: Type.ARRAY, items: { type: Type.STRING } },
                                    dataRequirements: { type: Type.ARRAY, items: { type: Type.STRING } },
                                    aiModelInteractions: { type: Type.ARRAY, items: { type: Type.STRING } },
                                },
                                required: ["appName", "coreFeatures", "dataRequirements", "aiModelInteractions"]
                            }
                        },
                        required: ["title", "description", "effectivenessScore", "noCodePrompt", "noCodePromptJson"]
                    },
                },
            },
        });

        const jsonText = response.text.trim();
        return JSON.parse(jsonText) as Solution[];
    } catch (error) {
        console.error("Error generating solutions from Gemini API:", error);
        return [];
    }
};