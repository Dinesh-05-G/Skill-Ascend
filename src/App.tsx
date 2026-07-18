import React, { useState, useEffect } from "react";
import { UserProfile, CareerProfileResponse, UserProgressData } from "./types";
import LandingPage from "./components/LandingPage";
import AssessmentForm from "./components/AssessmentForm";
import ProcessingLoader from "./components/ProcessingLoader";
import Dashboard from "./components/Dashboard";
import FloatingMentor from "./components/FloatingMentor";

const getLocalStorageItem = <T,>(key: string, defaultValue: T): T => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.warn(`Error reading localStorage key "${key}":`, error);
    return defaultValue;
  }
};

const INITIAL_PROGRESS: UserProgressData = {
  streakDays: 4,
  completedModulesCount: 0,
  completedProjectsCount: 0,
  weeklyXp: 150,
  weeklyXpGoal: 500,
  achievements: [
    { id: "roadmap-pioneer", title: "Roadmap Pioneer", description: "Complete all checklist activities in your Week 1 sprint", icon: "Milestone" },
    { id: "code-alchemist", title: "Code Alchemist", description: "Collect 200 XP or more from weekly study goals", icon: "Trophy" },
    { id: "project-artisan", title: "Project Artisan", description: "Submit your first portfolio challenge code solution", icon: "Code" },
    { id: "interview-crusader", title: "Interview Crusader", description: "Score 8/10 or higher on any mock question", icon: "Check" }
  ],
  milestones: [
    { week: 1, isCompleted: false },
    { week: 2, isCompleted: false },
    { week: 3, isCompleted: false },
    { week: 4, isCompleted: false }
  ]
};

export default function App() {
  const [screen, setScreen] = useState<"landing" | "assessment" | "processing" | "dashboard">(() =>
    getLocalStorageItem<"landing" | "assessment" | "processing" | "dashboard">("ascend_screen", "landing")
  );
  const [profile, setProfile] = useState<UserProfile | null>(() =>
    getLocalStorageItem<UserProfile | null>("ascend_profile", null)
  );
  const [careerData, setCareerData] = useState<CareerProfileResponse | null>(() =>
    getLocalStorageItem<CareerProfileResponse | null>("ascend_career_data", null)
  );
  const [progressData, setProgressData] = useState<UserProgressData>(() =>
    getLocalStorageItem<UserProgressData>("ascend_progress_data", INITIAL_PROGRESS)
  );
  const [activityProgress, setActivityProgress] = useState<Record<string, boolean>>(() =>
    getLocalStorageItem<Record<string, boolean>>("ascend_activity_progress", {})
  );

  useEffect(() => {
    try {
      localStorage.setItem("ascend_screen", JSON.stringify(screen));
      localStorage.setItem("ascend_profile", JSON.stringify(profile));
      localStorage.setItem("ascend_career_data", JSON.stringify(careerData));
      localStorage.setItem("ascend_progress_data", JSON.stringify(progressData));
      localStorage.setItem("ascend_activity_progress", JSON.stringify(activityProgress));
    } catch (error) {
      console.warn("Error saving to localStorage:", error);
    }
  }, [screen, profile, careerData, progressData, activityProgress]);

  const handleStartAssessment = () => {
    setScreen("assessment");
  };

  const handleCancelAssessment = () => {
    setScreen("landing");
  };

  const handleAssessmentSubmit = async (userProfile: UserProfile) => {
    setProfile(userProfile);
    setScreen("processing");

    try {
      // API call to the secure full-stack backend
      const response = await fetch("/api/generate-roadmap", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userProfile)
      });

      if (!response.ok) {
        throw new Error("Backend API response failed");
      }

      const data: CareerProfileResponse = await response.json();
      setCareerData(data);

      // Initialize milestone progress indicators based on actual weeks generated
      const generatedMilestones = data.roadmap.map((module) => ({
        week: module.week,
        isCompleted: false
      }));

      setProgressData({
        ...INITIAL_PROGRESS,
        milestones: generatedMilestones
      });
      setActivityProgress({});

      setScreen("dashboard");
    } catch (error) {
      console.warn("AI Generation failed, initiating offline fallback alignment profile:", error);
      
      // Highly comprehensive offline fallback data model
      const fallbackData: CareerProfileResponse = {
        careerReadinessScore: 42,
        skillsMatched: [
          { name: "Python programming", category: "technical", isMatch: true, proficiency: "Intermediate" },
          { name: "Git versioning", category: "tool", isMatch: true, proficiency: "Intermediate" },
          { name: "SQL basics", category: "technical", isMatch: true, proficiency: "Beginner" }
        ],
        missingSkills: [
          { skill: "Large Language Models API Integration", importance: "High", description: "Requires practical experience using standard SDKs (e.g. @google/genai) on the server side to stream and extract." },
          { skill: "Vector Database architectures", importance: "Medium", description: "Need to understand cosine distance index systems (Pinecone/Chroma) for document Retrieval-Augmented Generation." },
          { skill: "Exception handling pipelines", importance: "Low", description: "Acknowledge robust microservices recovery protocols and structured middleware bounds." }
        ],
        estLearningHours: 120,
        roadmap: [
          {
            week: 1,
            title: "Transformers & LLM API SDK Integration Sprints",
            objective: "Familiarize yourself with the Google GenAI SDK, system prompts, structural schemas, and API proxy routing.",
            topics: ["Gemini-flash", "google-genai SDK", "express servers", "API safety"],
            durationHours: 15,
            activities: [
              { description: "Initialize a NodeJS backend Express project and register the @google/genai client", type: "practice" },
              { description: "Write an API endpoint returning a structured JSON schema response from gemini-3.5-flash", type: "project" }
            ],
            resources: [
              { title: "Google GenAI TypeScript API Reference", url: "https://github.com/google/generative-ai-js", type: "documentation", isFree: true },
              { title: "Express Server Setup Guide with TypeScript", url: "https://expressjs.com/", type: "documentation", isFree: true }
            ]
          },
          {
            week: 2,
            title: "Retrieval-Augmented Generation (RAG) & Vector Indexes",
            objective: "Build local document ingestion, extract text chunks, vectorize, and search using distance metrics.",
            topics: ["embeddings", "vector database", "ChromaDB", "cosine similarity"],
            durationHours: 20,
            activities: [
              { description: "Write text splitting code and generate embeddings using gemini-embedding-2-preview", type: "practice" },
              { description: "Perform document queries filtered by metadata parameters on Pinecone local instances", type: "practice" }
            ],
            resources: [
              { title: "Introduction to Vector Space Calculations", url: "https://wikipedia.org/wiki/Cosine_similarity", type: "article", isFree: true },
              { title: "RAG Pipeline Architectures Overview", url: "https://scikit-learn.org", type: "documentation", isFree: true }
            ]
          },
          {
            week: 3,
            title: "Advanced System Prompting & Agentic Workflows",
            objective: "Familiarize yourself with multi-agent coordination, chain-of-thought, and function declarations.",
            topics: ["system-instructions", "function-calling", "tools", "chain-of-thought"],
            durationHours: 18,
            activities: [
              { description: "Declare a standard function template for tool configs and let Gemini resolve callbacks", type: "practice" },
              { description: "Deploy a mock customer support agent responding dynamically to order logs", type: "project" }
            ],
            resources: [
              { title: "Model Function Calling with Google GenAI", url: "https://github.com/google/generative-ai-js", type: "documentation", isFree: true }
            ]
          },
          {
            week: 4,
            title: "Microservices Deployments & Production Hardening",
            objective: "Prepare, compile, package, and deploy your robust portfolio applications onto hosting ingress runtimes.",
            topics: ["esbuild CJS bundle", "Docker", "environment variables", "ingress routers"],
            durationHours: 22,
            activities: [
              { description: "Build a single bundle of your Express API using esbuild --bundle and platform=node", type: "practice" },
              { description: "Write comprehensive unit tests ensuring secrets are never leaked", type: "project" }
            ],
            resources: [
              { title: "Standalone Node bundle compile configurations", url: "https://esbuild.github.io/", type: "documentation", isFree: true }
            ]
          }
        ],
        suggestedProjects: [
          {
            id: "proj-fallback-1",
            title: "Generative AI Interview Coach Co-pilot",
            description: "Build an Express API backend using the @google/genai SDK that evaluates answer quality against a rubric schema dynamically.",
            difficulty: "Medium",
            techStack: ["NodeJS", "Express", "Google GenAI SDK", "Tailwind CSS"],
            deliverables: ["Modular backend server.ts API route", "Interactive HTML responsive dashboard console"],
            instructions: [
              "Create a secure /api/evaluate endpoint on NodeJS",
              "Initialize the GoogleGenAI instance with process.env.GEMINI_API_KEY securely",
              "Utilize responseSchema parameters to obtain integer scores and feedback lists"
            ],
            challengeBonus: "Add a floating conversational voice prompt simulator utilizing Speech Synthesis APIs."
          },
          {
            id: "proj-fallback-2",
            title: "Vector Indexed PDF Academic Search Engine",
            description: "Ingest textbooks, split into logical chunks, index embeddings inside vector maps, and query semantically.",
            difficulty: "Hard",
            techStack: ["Python", "FastAPI", "Pinecone Database", "Gemini Embeddings"],
            deliverables: ["Ingestion script parsing document structures", "Interactive semantic text search interface"],
            instructions: [
              "Extract raw academic textbook texts from local storage",
              "Vectorize paragraphs in batches of 50 chunks securely",
              "Render matching sources with visual cosine distance indicators"
            ],
            challengeBonus: "Highlight matching phrases directly inside the document viewer."
          },
          {
            id: "proj-fallback-3",
            title: "Smart Task Orchestrator with Function Calling",
            description: "Build an AI agent that controls calendar bookings and task assignments by resolving tool execution parameters.",
            difficulty: "Medium",
            techStack: ["TypeScript", "Vite", "Node Express", "Google Calendar API"],
            deliverables: ["Task router mapping user intents into structured JSON parameters", "Interactive log tracker visualizer"],
            instructions: [
              "Expose mock functions booking calendars and compiling reports",
              "Supply declaration arrays as tools inside your generateContent config",
              "Inspect functionCalls outputs and coordinate downstream callbacks"
            ],
            challengeBonus: "Include persistent sqlite databases tracing historic agent decisions."
          }
        ],
        interviewQuestions: [
          {
            id: "q-fallback-1",
            question: "Explain the difference between Fine-Tuning and RAG (Retrieval-Augmented Generation). In what architectural scenarios would you choose one over the other?",
            category: "technical",
            difficulty: "Medium",
            tips: "Emphasize memory retention vs external fact retrieval. RAG is outstanding for factual precision and changing data; Fine-Tuning is for style, format, and behavior changes.",
            sampleAnswer: "Fine-tuning updates model weights to customize behavior, voice, and syntax structures. RAG provides temporary external background context during a single inference call. Choose RAG for fast data updates, verified citations, and low compute budgets. Choose Fine-Tuning to teach proprietary programming paradigms, follow rigorous schemas, or fit massive instruction weights within narrow token limits."
          },
          {
            id: "q-fallback-2",
            question: "How do you securely handle API keys in a full-stack NodeJS application? Why is it dangerous to run client-side Gemini calls?",
            category: "system-design",
            difficulty: "Easy",
            tips: "Discuss client exposure danger, environment variable files, and building server-side proxies (Express middleware).",
            sampleAnswer: "API keys must never be bundled in client bundles or exposed in the browser as they can be easily extracted. Instead, keys should be kept in production process variables on the server (using .env in local dev). Developers must establish server-side endpoint proxies (e.g. /api/*) that manage the actual client calls, applying security checks and rate limiting, returning only finalized clean results."
          },
          {
            id: "q-fallback-3",
            question: "How would you handle rate-limit exceptions (HTTP 429) when building massive AI-orchestrated applications? Explain exponential backoff.",
            category: "system-design",
            difficulty: "Hard",
            tips: "Discuss exponential backoff, retry queues, jitter additions, and fallback models.",
            sampleAnswer: "To resolve HTTP 429 rate bounds, implement exponential backoff: retry the operation after an increasing delay (e.g. 1s, 2s, 4s, 8s...). Add random 'jitter' (fractional offsets) to prevent all concurrent processes from retrying at the exact same millisecond. Additionally, establish queue systems (like Redis bull queues) to throttle execution velocity, and configure automatic fallback model routing when thresholds are fully reached."
          }
        ]
      };

      setCareerData(fallbackData);

      // Initialize milestone progress indicators based on actual weeks in fallback
      const generatedMilestones = fallbackData.roadmap.map((module) => ({
        week: module.week,
        isCompleted: false
      }));

      setProgressData({
        ...INITIAL_PROGRESS,
        milestones: generatedMilestones
      });
      setActivityProgress({});

      setScreen("dashboard");
    }
  };

  const handleUpdateProgress = (updatedProgress: UserProgressData) => {
    setProgressData(updatedProgress);
  };

  const handleUpdateProfile = (updatedProfile: UserProfile) => {
    setProfile(updatedProfile);
  };

  const handleReset = () => {
    setProfile(null);
    setCareerData(null);
    setProgressData(INITIAL_PROGRESS);
    setActivityProgress({});
    setScreen("landing");
    try {
      localStorage.removeItem("ascend_screen");
      localStorage.removeItem("ascend_profile");
      localStorage.removeItem("ascend_career_data");
      localStorage.removeItem("ascend_progress_data");
      localStorage.removeItem("ascend_activity_progress");
    } catch (e) {
      console.warn("Failed to clear localStorage on reset", e);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between">
      {/* Dynamic Screen Mounting */}
      {screen === "landing" && <LandingPage onStartAssessment={handleStartAssessment} />}
      {screen === "assessment" && (
        <AssessmentForm onSubmit={handleAssessmentSubmit} onCancel={handleCancelAssessment} />
      )}
      {screen === "processing" && (
        <ProcessingLoader localizationLanguage={profile?.localizationLanguage || "English"} />
      )}
      {screen === "dashboard" && careerData && profile && (
        <Dashboard
          profile={profile}
          careerData={careerData}
          progressData={progressData}
          activityProgress={activityProgress}
          onUpdateActivityProgress={setActivityProgress}
          onUpdateProgress={handleUpdateProgress}
          onUpdateProfile={handleUpdateProfile}
          onReset={handleReset}
        />
      )}

      {/* Persistent Floating AI Mentor chatbot (mounted once profile/roadmaps are active) */}
      {profile && screen === "dashboard" && (
        <FloatingMentor userProfile={profile} localizationLanguage={profile.localizationLanguage} />
      )}
    </div>
  );
}
