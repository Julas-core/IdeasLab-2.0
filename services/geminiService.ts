import { GoogleGenAI, Type } from "@google/genai";
import type { Problem, Solution, Sentiment, Challenge } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

const ALLOWED_CATEGORIES = ['Technology', 'Healthcare', 'Productivity', 'Environment', 'Urban Living', 'Finance', 'Education', 'Social', 'Entertainment'];

const getSentiment = (score: number): Sentiment => {
    if (score > 0.3) return 'Positive' as Sentiment.Positive;
    if (score < -0.3) return 'Negative' as Sentiment.Negative;
    return 'Neutral' as Sentiment.Neutral;
};

const parseAndCleanJson = (jsonText: string): any[] => {
    const cleanedJson = jsonText.replace(/^```json\n?/, '').replace(/```$/, '');
    try {
        return JSON.parse(cleanedJson) as any[];
    } catch (error) {
        console.error("Failed to parse JSON from Gemini response:", cleanedJson);
        throw error;
    }
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
            createdAt: Date.now() - (index * 1000 * 60), // Stagger times for sorting demo
            searchQueries: p.searchQueries || [],
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
        - Two distinct and specific Google search query strings that a user could enter to find discussions, articles, or evidence about this problem. These should be insightful queries, not just the problem title.
        - An approximate real-world city/country where this problem is prominent ('locationName').
        - The latitude and longitude for that location.

        The "category" for each problem MUST be one of the following strings: ${ALLOWED_CATEGORIES.map(c => `'${c}'`).join(', ')}.
        Return your findings STRICTLY as a JSON array of objects. Each object must have keys: "title", "description", "category", "searchQueries", "locationName", "latitude", and "longitude".
        The "searchQueries" key must be an array of strings.
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
        As an expert product manager specializing in AI-driven solutions, analyze the following problem:
        Problem Title: "${problem.title}"
        Problem Description: "${problem.description}"

        Your task is to generate 3 distinct and innovative AI-powered solutions.

        For each of the 3 solutions, you must provide:
        1.  **title**: A concise and compelling title for the solution.
        2.  **description**: A detailed explanation of how AI can effectively address the problem.
        3.  **effectivenessScore**: A predicted effectiveness score from 1 to 100.
        4.  **noCodePrompt**: An expert-level, detailed, single-shot prompt for an AI no-code builder. This prompt must be comprehensive enough for the builder to create a functional MVP. Structure this prompt as a professional-grade product spec using advanced Markdown. Adhere to these best practices for maximum clarity and utility:
            - **Persona**: Start with "You are an expert full-stack developer and UI/UX designer...".
            - **Core Task**: Clearly define the app to be built.
            - **Features Table**: Use a Markdown table with columns for "Feature", "Description", and "User Story".
            - **Data Schema**: Use another Markdown table for the "Data Model" with columns for "Model", "Fields", and "Data Type".
            - **Tech Stack Suggestion**: Use a blockquote (>) to suggest a modern tech stack (e.g., React, Node.js, Vercel).
            - **User Flow**: Use a bulleted list to outline the primary user flow.
            - **Final Instruction**: End with a clear call to action, like "Generate the complete codebase for this application."
        5.  **noCodePromptJson**: A JSON object representation of the no-code builder prompt, with keys: "appName", "coreFeatures" (array of strings), "dataRequirements" (array of strings), and "aiModelInteractions" (array of strings).
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
                                description: "A detailed, actionable prompt for an AI no-code builder to create an MVP, formatted in advanced markdown (including tables and blockquotes).",
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
        const solutionsData = JSON.parse(jsonText);
        
        return solutionsData.map((s: any, index: number) => ({
            ...s,
            id: `solution-${Date.now()}-${index}`,
            upvotes: Math.floor(Math.random() * 150),
            author: 'AI',
        })) as Solution[];

    } catch (error) {
        console.error("Error generating solutions from Gemini API:", error);
        return [];
    }
};

export const generateChallenge = async (problem: Problem): Promise<Challenge | null> => {
    try {
        const prompt = `
        Based on the problem: "${problem.title} - ${problem.description}", create a compelling innovation challenge.
        The goal is to inspire developers and entrepreneurs to build a solution.
        Provide a catchy title for the challenge, a short and exciting description (2-3 sentences), a realistic prize (e.g., "$5,000 Grant", "Featured on TechCrunch"), a deadline (e.g., "30 Days from Start"), and a difficulty rating.
        `;

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        title: { type: Type.STRING, description: "A catchy, exciting title for the challenge." },
                        description: { type: Type.STRING, description: "A short, compelling description of the challenge's goal." },
                        prize: { type: Type.STRING, description: "A realistic and motivating prize for the winner." },
                        deadline: { type: Type.STRING, description: "The time frame for the challenge, like '30 Days'." },
                        difficulty: { type: Type.STRING, description: "The estimated difficulty: 'Easy', 'Medium', or 'Hard'." },
                    },
                    required: ["title", "description", "prize", "deadline", "difficulty"],
                },
            },
        });
        
        const challengeData = JSON.parse(response.text.trim());

        return {
            ...challengeData,
            id: `challenge-${Date.now()}`,
            problemId: problem.id,
            problemTitle: problem.title,
        } as Challenge;

    } catch (error) {
        console.error("Error generating challenge from Gemini API:", error);
        return null;
    }
};