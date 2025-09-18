# IdeasLab2.0

An AI-powered platform designed to discover, analyze, and generate innovative solutions for real-world problems. Nexus AI leverages the Google Gemini API to scour the web for trending issues and then proposes actionable, AI-driven solutions.

## Objective

The goal of this project is to create an intuitive interface that helps entrepreneurs, developers, and innovators identify promising opportunities. By analyzing online discussions and trends, the application surfaces problems worth solving and provides a creative head-start with AI-generated solution concepts and no-code builder prompts.

## Key Features

- **AI-Powered Problem Discovery**: Uses the Gemini API with Google Search grounding to find trending problems from forums, social media, and online communities.
- **Data-Driven Analysis**: Automatically assigns sentiment and trend scores to each problem, allowing for quick prioritization.
- **Interactive Dashboard**: A clean, responsive interface to browse and filter problems.
- **Dynamic Trend Visualization**: Features a chart to display the top trending problems at a glance.
- **Generative AI Solutions**: For any selected problem, the AI generates multiple innovative solutions, complete with an effectiveness score.
- **No-Code Builder Prompts**: Each solution includes detailed prompts in both human-readable Markdown and machine-readable JSON formats to kickstart MVP development.
- **Export Functionality**: Allows users to download a complete problem-and-solution brief as a single Markdown file for offline use.

## Technology Stack

- **Frontend**: React, TypeScript
- **Styling**: Tailwind CSS
- **AI Engine**: Google Gemini API (`gemini-2.5-flash`)
- **Charts**: Recharts

## Setup and Configuration

The application is designed to run in an environment where the project files are served directly. The only configuration required is setting up your Google Gemini API key.

**API Key Configuration**

1.  **Get an API Key**: Obtain your free API key from [Google AI Studio](https://aistudio.google.com/app/apikey).
2.  **Set Environment Variable**: The application requires your key to be available as an environment variable named `API_KEY`. You must configure this `API_KEY` in the environment where you are running the application. The code reads it directly via `process.env.API_KEY`.

> **Important**: Never hardcode your API key directly in the source code. Always use environment variables.

## How to Use the App

1.  **Discover Problems**: On loading, the app automatically fetches and displays a list of trending problems on the left-hand panel.
2.  **Filter**: Use the "Filters" dropdown in the sidebar to narrow down problems by category.
3.  **Select a Problem**: Click on any problem card to view its details.
4.  **View Details**: The main view will update to show detailed information about the selected problem, including its description, sentiment, trend score, and source URLs.
5.  **Analyze Solutions**: Below the problem details, the AI will generate several potential solutions.
6.  **Use Prompts & Export**: For each solution, you can expand the "Pro Builder Prompt" section to:
    - Toggle between Formatted and JSON prompt views.
    - Copy the prompt to your clipboard.
    - Download the entire problem/solution brief as a Markdown file.
7.  **Find More**: Click the "Discover More Problems" button to refresh the list with new ideas from the AI.
