# Margdarshak - AI Job Assistant

Margdarshak is a seeker-focused job discovery and guidance portal designed specifically for blue- and grey-collar workers in India. It aims to bridge the gap for users who may face literacy challenges by providing a conversational, voice-first interface that guides them from profile building to job placement.

## 🚀 Core Features

- **Conversational Profile Building**: A low-literacy friendly assistant (Margdarshak) that uses Gemini AI to build user profiles through simple voice or text dialogue.
- **Visual Aid System**: Automatically displays icons (Bike, Tools, Maps) based on the conversation context.
- **AI Role Discovery**: Suggests suitable job roles based on the seeker's skills, interests, and location.
- **Personalized Roadmaps**: Provides a clear, step-by-step learning path.
- **Success Story Mentorship**: Communicate with successful individuals through the "Ask Advice" feature to get AI-powered career guidance in their persona.
- **Local Database & Auth**: A secure local student registration system using `localStorage`.

## 🛠️ Tech Stack

- **Frontend**: React 19, Tailwind CSS, Lucide React.
- **AI Engine**: Google Gemini API (`@google/genai`).
- **State Management**: React Hooks & LocalStorage.

## 💻 Running Locally on macOS (MacBook Air)

### 1. Prerequisites
- **Node.js** (v18+)
- **NPM**

### 2. Installation
Open your terminal in the project folder and run:
```bash
npm install
```

### 3. API Key Configuration
You **must** create a file named `.env` in the root folder. You can do this by running this exact command in your terminal:


### 4. Start Development
```bash
npm run dev
```
The app will open at [http://localhost:3000](http://localhost:3000).

## 📁 Project Structure

- `App.tsx`: Main application logic and routing.
- `services/geminiService.ts`: All AI-related logic (Role discovery, Roadmaps, Mentor Advice).
- `components/LiveAssistant.tsx`: Conversational UI with voice support.
- `components/Auth.tsx`: Login and Registration logic (Local Database).
- `components/SuccessStories.tsx`: Success stories with the "Ask Advice" communication feature.
- `constants.tsx`: System instructions and static mapping.

---

**Built for the next billion users in India.** 🇮🇳
