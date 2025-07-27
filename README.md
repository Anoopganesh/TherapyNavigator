# Therapy Navigator

## Overview

Therapy Navigator is a Next.js web application designed to provide users with accessible tools and resources for mental wellness. It empowers users to explore different therapeutic approaches, reflect on their experiences, and track their mood in a supportive, private environment.

## Core Features

*   **Therapy Selection**: Users can choose from a variety of evidence-based therapy modules, including:
    *   Cognitive Behavioral Therapy (CBT)
    *   Mindfulness-Based Cognitive Therapy (MBCT)
    *   Psychodynamic Therapy
    *   Interpersonal Therapy (IPT)
    *   Behavioral Activation
    *   Exposure Therapy
*   **Smart Recommendation**: An AI-powered feature that analyzes user-described symptoms or feelings to suggest a suitable therapy type and explains the reasoning.
*   **Interactive Therapy Modules**: Each therapy type has a dedicated module featuring:
    *   **Guided Prompts**: Specific questions and exercises to help users engage with the principles of that therapy.
    *   **Session Notes & Reflections**: A space for users to write down their thoughts, feelings, and insights. Notes are saved locally in the user's browser.
    *   **AI Chatbot "Navi"**: A supportive, non-clinical AI companion. Navi:
        *   Offers empathetic listening and gentle encouragement.
        *   Tailors its conversational style to the context of the selected therapy module.
        *   Responds contextually when a user saves a session note, initiating a conversation based on the reflection.
        *   Is programmed to stay focused on mental health-related topics and politely redirect if the conversation strays.
        *   Explicitly states its limitations as an AI and does *not* provide medical advice, diagnoses, or treatment plans.
*   **Daily Mood Check-in**: Allows users to:
    *   Log their mood daily using a simple slider (1-5 scale).
    *   Add optional notes about their feelings or events of the day.
    *   View a history of their mood entries to identify patterns. Mood data is stored locally.
*   **Session History Display**: Consolidates all saved session notes from different therapy modules into one view, allowing users to review their journey. Data is stored locally.
*   **Important Disclaimers**: Clearly communicates that the app is for informational and educational purposes and is not a substitute for professional medical advice or therapy.
*   **Resource Links**: Provides quick links to:
    *   Search for real therapists (e.g., Google search for "top therapists in Bangalore").
    *   Access crisis helplines (e.g., AASRA in India).
*   **Responsive Design**: Built with a mobile-first approach using Tailwind CSS and ShadCN UI components, ensuring a good user experience across desktops, laptops, tablets, and mobile phones.
*   **PWA Enabled**: Includes a web app manifest, allowing users to "install" the app to their device's home screen for easier access.

## Technology Stack

*   **Frontend**: Next.js (App Router), React, TypeScript
*   **UI Components**: ShadCN UI
*   **Styling**: Tailwind CSS
*   **Generative AI**: Genkit (for the Smart Recommendation and Navi chatbot features)
*   **Local Storage**: Used for persisting user notes and mood data directly in their browser, ensuring privacy as no data is sent to a server for these features.

## Getting Started

This project is developed within Firebase Studio. The primary entry point for the application is `src/app/page.tsx`.

To run the application locally (outside of Firebase Studio, assuming you have the codebase):
1.  Ensure you have Node.js and npm/yarn installed.
2.  Set up any necessary environment variables (e.g., for Genkit API keys in a `.env` file).
3.  Install dependencies: `npm install` or `yarn install`.
4.  Run the development server: `npm run dev` or `yarn dev`.
5.  The Genkit development server also needs to be running for AI features: `npm run genkit:dev`.

Explore the app to discover its features and how it can support your mental wellness journey.
