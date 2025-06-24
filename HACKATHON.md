# Cognivia

## Overview

This project, named Cognivia, is a web application built with Next.js, React, and TypeScript, incorporating features such as user authentication, AI assistance, assignment management, and quiz generation. It leverages several technologies including Tailwind CSS, Node.js, MongoDB, and potentially Firebase.

## Key Features & Benefits

*   **User Authentication:** Secure user management including login, signup, forgot password, reset password, email verification, and account unblocking.
*   **Dashboard & Admin Interface:** Separate dashboards for different user roles (admin, teacher).
*   **AI Assistance:** Features for AI-powered quiz and notes generation, potentially using the Gemini API.
*   **Assignment Management:** Functionality to create, assign, and submit assignments.
*   **Quiz Generation & Management:** Tools to generate quizzes, track results, and store quiz data.
*   **Session Logging:** Records user session activities for audit and analysis.
*   **Dark Mode Toggle:** User-friendly feature to switch between light and dark themes.
*   **Profile Management:** User profile editing and display.

## Prerequisites & Dependencies

Before you begin, ensure you have the following installed:

*   **Node.js:** Version 18 or higher is recommended.
*   **npm or yarn or pnpm or bun:** Package managers for installing dependencies.
*   **MongoDB:** A running MongoDB instance for data storage.
*   **Firebase:** Access to Firebase project for storage.
*   **Gemini API Key:** Required if you intend to use AI functionalities.

## Installation & Setup Instructions

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/AsimAliMurtaza/cognivia-aws-lambda.git
    cd cognivia-aws-lambda
    ```

2.  **Install dependencies:**

    Using npm:

    ```bash
    npm install
    ```

    Using yarn:

    ```bash
    yarn install
    ```

    Using pnpm:

    ```bash
    pnpm install
    ```

    Using bun:

    ```bash
    bun install
    ```

3.  **Environment Variables:**

    Create a `.env.local` file in the root directory and add the following environment variables:

    ```
    MONGODB_URI=<Your MongoDB Connection String>
    NEXTAUTH_SECRET=<Your NextAuth Secret>
    NEXTAUTH_URL=http://localhost:3000 # or your deployed URL
    FIREBASE_APIKEY=<Your Firebase API Key>
    FIREBASE_AUTHDOMAIN=<Your Firebase Auth Domain>
    FIREBASE_PROJECTID=<Your Firebase Project ID>
    NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=<Your Firebase Storage Bucket>
    FIREBASE_MESSAGINGSENDERID=<Your Firebase Messaging Sender ID>
    FIREBASE_APPID=<Your Firebase App ID>
    GEMINI_API_URL=<Your Gemini API URL>
    GEMINI_API_KEY=<Your Gemini API Key>
    AWS_S3_BUCKET_NAME=<Your AWS S3 Bucket Name>
    AWS_S3_REGION=<Your AWS S3 Region>
    AWS_ACCESS_KEY_ID=<Your AWS Access Key ID>
    AWS_SECRET_ACCESS_KEY=<Your AWS Secret Access Key>
    NODEMAILER_EMAIL=<Your Nodemailer Email>
    NODEMAILER_PW=<Your Nodemailer Password>
    ```

    **Note:** Replace `<...>` with your actual values.

4.  **Run the development server:**

    Using npm:

    ```bash
    npm run dev
    ```

    Using yarn:

    ```bash
    yarn dev
    ```

    Using pnpm:

    ```bash
    pnpm dev
    ```

    Using bun:

    ```bash
    bun dev
    ```

5.  **Access the application:**

    Open your browser and navigate to `http://localhost:3000`.

## Usage Examples & API Documentation

Due to the project's nature as a web application, direct API documentation is embedded within the codebase. Key components and their functionality include:

*   **src/app/\***: Routing logic for different pages and API endpoints.
*   **src/lib/\***: Utility functions for Firebase, Gemini AI, database interactions (MongoDB), and authentication.
*   **src/components/\***: Reusable React components.
*   **src/models/\***: Database models for various entities (User, Course, Quiz, etc.).

Refer to the comments within each file for specific usage instructions and API details where applicable.  For example, the `generateGeminiContent` function in `src/lib/gemini.ts` is used as:

```typescript
import { generateGeminiContent } from './lib/gemini';

async function generateQuiz(topic: string) {
  const prompt = `Generate a quiz about ${topic}`;
  const quizContent = await generateGeminiContent(prompt);
  return quizContent;
}
```

## Configuration Options

*   **Environment Variables:** Configuration is primarily managed through environment variables as outlined in the "Installation & Setup Instructions" section. These variables control database connections, API keys, and other sensitive settings.

*   **Firebase Configuration:** Firebase settings are defined in `src/lib/firebase.ts`. Ensure your Firebase project configuration is correctly set up.

*   **Tailwind CSS Theme:** Customize the application's appearance by modifying the `tailwind.config.ts` and `src/styles/theme.ts` files.

## Contributing Guidelines

Contributions are welcome! To contribute to this project:

1.  Fork the repository.
2.  Create a new branch for your feature or bug fix.
3.  Make your changes and commit them with clear, concise messages.
4.  Submit a pull request to the main branch.

Please adhere to the existing coding style and conventions. Ensure your code is well-documented and tested.

## License Information

License information is not specified for this project. All rights are reserved by the owner unless explicitly stated otherwise.

## Acknowledgments

*   Next.js
*   React
*   TypeScript
*   Tailwind CSS
*   MongoDB
*   Firebase
*   Gemini API
*   Zustand
*   NextAuth.js
*   Chakra UI
*   Radix UI
*   AWS S3
*   Nodemailer
