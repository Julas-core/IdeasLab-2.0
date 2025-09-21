# Nexus AI Problem Solver

An AI-powered platform designed to discover, analyze, and generate innovative solutions for real-world problems. Nexus AI leverages the Google Gemini API to scour the web for trending issues and then proposes actionable, AI-driven solutions.

## Objective

The goal of this project is to create an intuitive interface that helps entrepreneurs, developers, and innovators identify promising opportunities. By analyzing online discussions and trends, the application surfaces problems worth solving and provides a creative head-start with AI-generated solution concepts and no-code builder prompts.

## Key Features

- **Secure Authentication**: Sign in with Google via Firebase for a secure, personalized experience.
- **AI-Powered Problem Discovery**: Uses the Gemini API with Google Search grounding to find trending problems from forums, social media, and online communities.
- **Data-Driven Analysis**: Automatically assigns sentiment and trend scores to each problem, allowing for quick prioritization.
- **Interactive Dashboard**: A clean, responsive interface to browse and filter problems.
- **Generative AI Solutions**: For any selected problem, the AI generates multiple innovative solutions, complete with an effectiveness score.
- **No-Code Builder Prompts**: Each solution includes detailed prompts to kickstart MVP development.
- **Export Functionality**: Allows users to download a complete problem-and-solution brief as a single Markdown file.

## Technology Stack

- **Frontend**: React, TypeScript
- **Styling**: Tailwind CSS
- **AI Engine**: Google Gemini API (`gemini-2.5-flash`)
- **Authentication**: Firebase Authentication
- **Charts**: Recharts

## Setup and Configuration

The application requires configuration for both the Google Gemini API and Firebase Authentication.

### 1. Google Gemini API Key

1.  **Get an API Key**: Obtain your free API key from [Google AI Studio](https://aistudio.google.com/app/apikey).
2.  **Set Environment Variable**: The application requires your key to be available as an environment variable named `API_KEY`. You must configure this `API_KEY` in the environment where you are running the application. The code reads it directly via `process.env.API_KEY`.

> **Important**: Never hardcode your API key directly in the source code. Always use environment variables.

### 2. Firebase Setup (for Authentication)

To enable the "Sign in with Google" feature, you need to create a free Firebase project.

1.  **Create a Firebase Project**:
    *   Go to the [Firebase Console](https://console.firebase.google.com/).
    *   Click "Add project" and follow the on-screen instructions.

2.  **Register Your Web App**:
    *   In your new project's dashboard, click the web icon (`</>`) to add a new web app.
    *   Give your app a nickname and click "Register app".
    *   Firebase will provide you with a `firebaseConfig` object. **Copy this object.**

3.  **Enable Google Sign-In**:
    *   In the left-hand menu, go to **Authentication**.
    *   Click "Get started".
    *   Select the **Sign-in method** tab.
    *   Click on **Google** in the list of providers, enable it, provide a project support email, and click **Save**.

4.  **Configure Your App**:
    *   Inside the project, create a new file at `services/firebase.ts`.
    *   Paste the `firebaseConfig` object you copied earlier into this file, replacing the placeholder values.

    Your `services/firebase.ts` file should look like this:
    ```typescript
    import { initializeApp } from "firebase/app";
    import { getAuth, GoogleAuthProvider } from "firebase/auth";

    // ✅ PASTE YOUR FIREBASE CONFIGURATION OBJECT HERE
    const firebaseConfig = {
      apiKey: "AIzaSy...",
      authDomain: "your-project-id.firebaseapp.com",
      projectId: "your-project-id",
      storageBucket: "your-project-id.appspot.com",
      messagingSenderId: "1234567890",
      appId: "1:1234567890:web:abcdef123456"
    };

    // Initialize Firebase
    const app = initializeApp(firebaseConfig);

    // Initialize and export Firebase Authentication
    export const auth = getAuth(app);
    export const googleProvider = new GoogleAuthProvider();
    ```

## How to Use the App

1.  **Sign In**: Use the "Sign in with Google" button to securely log into the application.
2.  **Discover Problems**: On loading, the app automatically fetches and displays a list of trending problems.
3.  **Filter & Sort**: Use the sidebar to filter by category or the dropdown to sort problems by trend, upvotes, and more.
4.  **View Details**: Click a problem to see its full description, sentiment scores, and related Google searches.
5.  **Analyze Solutions**: The AI will generate several potential solutions for the selected problem. You can submit your own ideas as well.
6.  **Use Prompts & Export**: For AI-generated solutions, view the "Pro Builder Prompt" to kickstart development or download the entire brief as a Markdown file.