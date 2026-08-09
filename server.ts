import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(express.json());

const PORT = Number(process.env.PORT) || 3000;

// Initialize GoogleGenAI client on the server side securely
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

// Helper function to handle transient Gemini API errors (e.g., 503 Service Unavailable, 429 Rate Limits)
// with exponential backoff retries and an automatic fallback to gemini-3.1-flash-lite if the primary model fails.
async function generateContentWithFallback(params: any) {
  const primaryModel = params.model || "gemini-3.5-flash";
  const fallbackModel = primaryModel === "gemini-3.5-flash" ? "gemini-3.1-flash-lite" : null;

  const tryModel = async (modelName: string, retries = 3, baseDelay = 1000) => {
    let attempt = 0;
    while (attempt < retries) {
      try {
        const modelParams = { ...params, model: modelName };
        return await ai.models.generateContent(modelParams);
      } catch (error: any) {
        attempt++;
        console.warn(`Gemini API attempt ${attempt}/${retries} failed for model ${modelName}:`, error);
        
        const errorText = error.message || "";
        const status = error.status || (error.error?.code) || 0;
        const isTransient = 
          status === 503 || 
          status === 429 || 
          errorText.includes("503") || 
          errorText.includes("429") || 
          errorText.includes("UNAVAILABLE") || 
          errorText.includes("high demand") || 
          errorText.includes("Rate limit");
          
        if (isTransient && attempt < retries) {
          const delay = baseDelay * Math.pow(2, attempt - 1);
          console.log(`Retrying model ${modelName} in ${delay}ms...`);
          await new Promise(resolve => setTimeout(resolve, delay));
        } else {
          throw error;
        }
      }
    }
    throw new Error(`Failed to generate content with ${modelName} after ${retries} retries`);
  };

  try {
    return await tryModel(primaryModel);
  } catch (primaryError) {
    console.error(`Primary model ${primaryModel} failed permanently.`, primaryError);
    if (fallbackModel) {
      console.log(`Attempting fallback to ${fallbackModel}...`);
      try {
        return await tryModel(fallbackModel);
      } catch (fallbackError) {
        console.error(`Fallback model ${fallbackModel} also failed.`, fallbackError);
        throw primaryError; // Throw original primary error to maintain descriptive context
      }
    }
    throw primaryError;
  }
}

// API Routes
// Endpoint 1: Generate Career Profile, Roadmap, Skills Mapping, Projects, and Questions
app.post("/api/generate-roadmap", async (req, res) => {
  try {
    const { name, targetRole, experienceLevel, skillsText, resumeText, weeklyCommitment, confidenceLevel, localizationLanguage } = req.body;

    const systemPrompt = `You are an elite technical career mentor and senior engineering architect.
Your mission is to generate an incredibly detailed, highly realistic, and actionable technical career roadmap, skills mapping, and project curriculum for the target role "${targetRole}" at experience level "${experienceLevel}".

CRITICAL REQUIREMENTS FOR THE ROADMAP & SKILLS:
1. **No Vague Boilerplate or Generic Topics**: Vague terms like "Learn JS" or "Understand basics" are strictly forbidden. Be extremely specific with technologies, libraries, concepts, and design patterns.
   - For example, if it's Frontend Development, use precise topics like: "Master React 19 Concurrent rendering, Server Actions, Server Components, Hydration bottlenecks, Tailwind CSS v4 custom theme directives, and Vite bundle optimization with rollup-plugin-visualizer."
   - If it's VR Developer, Augmented Reality, or graphics programming, specify: "Configure WebXR device controllers, design three.js PerspectiveCameras and WebGLRenderers, master rendering pipelines, handle quaternions and Euler angles for 3D rotations, and program custom GLSL shaders (vertex and fragment)."
2. **Difficulty-Aware and Role-Aware Timelines**:
   - The complexity, depth, and duration of the roadmap must match the true real-world difficulty of the role.
   - High-difficulty specialties (e.g., VR Developer, Systems Engineer, AI Core Researcher, Cloud Architect) are hard to learn and require deep mathematical, low-level, or graphics foundations, and specific toolsets (e.g., Unity Learn, C#, Unreal Engine C++, OpenXR, WebXR Device API, Three.js, Blender). Design an intensive, high-fidelity, comprehensive weeks list mapping these advanced paradigms.
   - Moderate/Easy specialties (e.g., junior Web Developer, modern Frontend Developer) should be structured as highly streamlined, modern, production-grade paths (typically 4 weeks) focusing on immediate, practical full-stack deployment patterns (React, Vite, Tailwind CSS v4, state engines, and cloud hostings).
3. **Genuine, Click-Ready, Referenceable Resources**:
   - Do NOT output placeholder or generic domain-only URLs. Every resource URL must be a real, authentic, click-ready learning link to documentation or tutorials.
   - Choose authentic, specific URL paths from domains like:
     - React Docs: "https://react.dev/reference/react" or specific guides.
     - MDN Web Docs: "https://developer.mozilla.org/en-US/docs/Web/API" (e.g. WebXR Device API)
     - Three.js Docs: "https://threejs.org/docs/"
     - Unity Learn: "https://learn.unity.com/"
     - Unreal Engine Docs: "https://docs.unrealengine.com/"
     - Web.dev: "https://web.dev/"
     - Vite Guide: "https://vite.dev/guide/"
     - Tailwind CSS Docs: "https://tailwindcss.com/docs/"
     - Google C++ Style Guide or standard learncpp.com links.
4. **Concrete Hands-on Activities**:
   - Every activity must be a concrete, real task. Instead of "Write a program", say "Write a custom GLSL fragment shader that simulates dynamic water ripples on a plane geometry in Three.js." or "Build a debounce hook in TypeScript to throttle rapid search query updates to a mock REST endpoint."

CRITICAL: Translate all text outputs, descriptions, titles, tips, objectives, and questions into the requested language: "${localizationLanguage || "English"}".
Format all outputs in structured JSON matching the requested response schema exactly.`;

    const userPrompt = `User Name: ${name}
Target Career Role: ${targetRole}
Experience Level: ${experienceLevel}
Current Skills stated: ${skillsText}
Resume/Background Details: ${resumeText}
Weekly Commitment: ${weeklyCommitment} hours/week
Confidence Level: ${confidenceLevel}/10`;

    const response = await generateContentWithFallback({
      model: "gemini-3.5-flash",
      contents: [
        { text: systemPrompt },
        { text: userPrompt }
      ],
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            careerReadinessScore: {
              type: Type.INTEGER,
              description: "A scored percentage (0 to 100) indicating current career alignment for this role."
            },
            skillsMatched: {
              type: Type.ARRAY,
              description: "List of matched skills identified from their current profile vs the role requirements.",
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  category: { type: Type.STRING, description: "Can be 'technical', 'soft', 'tool', or 'other'." },
                  isMatch: { type: Type.BOOLEAN },
                  proficiency: { type: Type.STRING, description: "Beginner, Intermediate, or Expert" }
                },
                required: ["name", "category", "isMatch"]
              }
            },
            missingSkills: {
              type: Type.ARRAY,
              description: "Skills they lack or need to improve to reach high alignment for the role.",
              items: {
                type: Type.OBJECT,
                properties: {
                  skill: { type: Type.STRING },
                  importance: { type: Type.STRING, description: "High, Medium, or Low" },
                  description: { type: Type.STRING, description: "A summary explaining why they need this skill and what gaps exist." }
                },
                required: ["skill", "importance", "description"]
              }
            },
            estLearningHours: {
              type: Type.INTEGER,
              description: "Estimated total learning hours required to close the primary skill gaps."
            },
            roadmap: {
              type: Type.ARRAY,
              description: "A week-by-week dynamic structured roadmap (minimum 4 weeks).",
              items: {
                type: Type.OBJECT,
                properties: {
                  week: { type: Type.INTEGER },
                  title: { type: Type.STRING },
                  objective: { type: Type.STRING },
                  topics: { type: Type.ARRAY, items: { type: Type.STRING } },
                  durationHours: { type: Type.INTEGER },
                  activities: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        description: { type: Type.STRING },
                        type: { type: Type.STRING, description: "reading, practice, or project" }
                      },
                      required: ["description", "type"]
                    }
                  },
                  resources: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        title: { type: Type.STRING },
                        url: { type: Type.STRING, description: "A realistic developer resource, documentation, or tutorial URL" },
                        type: { type: Type.STRING, description: "course, documentation, video, or article" },
                        isFree: { type: Type.BOOLEAN }
                      },
                      required: ["title", "url", "type", "isFree"]
                    }
                  }
                },
                required: ["week", "title", "objective", "topics", "durationHours", "activities", "resources"]
              }
            },
            suggestedProjects: {
              type: Type.ARRAY,
              description: "Three targeted portfolio project challenges addressing the missing skills.",
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  title: { type: Type.STRING },
                  description: { type: Type.STRING },
                  difficulty: { type: Type.STRING, description: "Easy, Medium, or Hard" },
                  techStack: { type: Type.ARRAY, items: { type: Type.STRING } },
                  deliverables: { type: Type.ARRAY, items: { type: Type.STRING } },
                  instructions: { type: Type.ARRAY, items: { type: Type.STRING } },
                  challengeBonus: { type: Type.STRING, description: "An extra feature or challenge to stretch their abilities." }
                },
                required: ["id", "title", "description", "difficulty", "techStack", "deliverables", "instructions", "challengeBonus"]
              }
            },
            interviewQuestions: {
              type: Type.ARRAY,
              description: "Three tailored behavioral or technical interview questions for the role.",
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  question: { type: Type.STRING },
                  category: { type: Type.STRING, description: "technical, system-design, or behavioral" },
                  difficulty: { type: Type.STRING, description: "Easy, Medium, or Hard" },
                  tips: { type: Type.STRING, description: "Strategic tips on how to frame the response." },
                  sampleAnswer: { type: Type.STRING, description: "A stellar model answer using the STAR format or best practices." }
                },
                required: ["id", "question", "category", "difficulty", "tips", "sampleAnswer"]
              }
            }
          },
          required: ["careerReadinessScore", "skillsMatched", "missingSkills", "estLearningHours", "roadmap", "suggestedProjects", "interviewQuestions"]
        }
      }
    });

    const parsedData = JSON.parse(response.text || "{}");
    res.json(parsedData);
  } catch (error: any) {
    console.error("Error generating roadmap:", error);
    res.status(500).json({ error: error.message || "Failed to generate roadmap content from Gemini" });
  }
});

// Endpoint 2: Compare target role with another secondary career option
app.post("/api/compare-roles", async (req, res) => {
  try {
    const { primaryRole, comparisonRole, localizationLanguage } = req.body;

    const systemPrompt = `You are an executive tech recruiter. 
Perform a comprehensive career skillset comparison between the Primary Role: "${primaryRole}" and the Comparison Role: "${comparisonRole}".
Identify:
1. Shared foundational skills that both roles build upon (overlapping skillset).
2. Skills exclusive to the Primary Role.
3. Skills exclusive to the Comparison Role.
4. An ease-of-transition score (1 to 100) indicating how straightforward it is for someone in the Primary role to cross-train or shift into the Comparison role.
5. Personalized career advice points for bridging the transition or choosing between them.

CRITICAL: Translate all outputs, titles, explanations, and advice into the requested language: "${localizationLanguage || "English"}".
Return the output strictly in the requested JSON structure.`;

    const response = await generateContentWithFallback({
      model: "gemini-3.5-flash",
      contents: [{ text: systemPrompt }],
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            primaryRole: { type: Type.STRING },
            comparisonRole: { type: Type.STRING },
            sharedFoundation: { type: Type.ARRAY, items: { type: Type.STRING } },
            primaryExclusive: { type: Type.ARRAY, items: { type: Type.STRING } },
            comparisonExclusive: { type: Type.ARRAY, items: { type: Type.STRING } },
            transitionEase: { type: Type.INTEGER },
            transitionAdvice: { type: Type.ARRAY, items: { type: Type.STRING } }
          },
          required: ["primaryRole", "comparisonRole", "sharedFoundation", "primaryExclusive", "comparisonExclusive", "transitionEase", "transitionAdvice"]
        }
      }
    });

    const parsedData = JSON.parse(response.text || "{}");
    res.json(parsedData);
  } catch (error: any) {
    console.error("Error comparing roles:", error);
    res.status(500).json({ error: error.message || "Failed to compare career paths" });
  }
});

// Endpoint 3: Evaluate user's mock interview answer
app.post("/api/evaluate-interview-answer", async (req, res) => {
  try {
    const { question, sampleAnswer, userAnswer, localizationLanguage } = req.body;

    const systemPrompt = `You are an empathetic yet rigorous technical interviewer.
Evaluate the candidate's response to this interview question: "${question}".
Compare it against this ideal sample answer: "${sampleAnswer}".
Provide constructive, direct, localized feedback in the requested language: "${localizationLanguage || "English"}".

Specifically, return a JSON object with:
- score: an integer out of 10 indicating the performance.
- feedback: a structured text paragraph with direct positive reinforcement.
- omissions: an array of key technical concepts, frameworks, or metrics they left out that were in the sample answer.
- improvements: bullet-point advice on how to improve.
- followUpQuestion: a dynamic, conversational follow-up question digging deeper into their stated answer.`;

    const response = await generateContentWithFallback({
      model: "gemini-3.5-flash",
      contents: [
        { text: systemPrompt },
        { text: `Candidate's answer: "${userAnswer}"` }
      ],
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            score: { type: Type.INTEGER },
            feedback: { type: Type.STRING },
            omissions: { type: Type.ARRAY, items: { type: Type.STRING } },
            improvements: { type: Type.ARRAY, items: { type: Type.STRING } },
            followUpQuestion: { type: Type.STRING }
          },
          required: ["score", "feedback", "omissions", "improvements", "followUpQuestion"]
        }
      }
    });

    const parsedData = JSON.parse(response.text || "{}");
    res.json(parsedData);
  } catch (error: any) {
    console.error("Error evaluating interview answer:", error);
    res.status(500).json({ error: error.message || "Failed to evaluate response" });
  }
});

// Endpoint 4: Interactive Floating AI Mentor Chat
app.post("/api/chat-mentor", async (req, res) => {
  try {
    const { chatHistory, userMessage, userProfile, localizationLanguage } = req.body;

    // Build chat context
    const profileSummary = userProfile
      ? `User Details: Name: ${userProfile.name}, Role: ${userProfile.targetRole}, Level: ${userProfile.experienceLevel}, Stated Skills: ${userProfile.skillsText}.`
      : `User is exploring tech career paths.`;

    const systemPrompt = `You are "Ascend Mentor", a warm, highly-knowledgeable AI Career Advisor.
The student has the following career background: ${profileSummary}.
Your objective is to guide them on skills acquisition, resume writing, portfolio building, or resolving confidence issues.
Keep your answers brief (under 120 words), direct, encouraging, and clear.
Adopt a warm, coaching persona. 
Address the student in their preferred language: "${localizationLanguage || "English"}".
Analyze the conversation logs and respond directly to their last query.`;

    const contents = [];
    contents.push({ text: systemPrompt });

    // Append historical chat context safely
    if (chatHistory && Array.isArray(chatHistory)) {
      chatHistory.forEach((msg: any) => {
        contents.push({
          text: `${msg.role === "user" ? "User" : "Mentor"}: ${msg.content}`
        });
      });
    }

    contents.push({ text: `User: ${userMessage}` });

    const response = await generateContentWithFallback({
      model: "gemini-3.5-flash",
      contents,
    });

    res.json({ reply: response.text || "I am processing your query. How else can I guide you on your journey?" });
  } catch (error: any) {
    console.error("Error in mentor chat:", error);
    res.status(500).json({ error: error.message || "Failed to process chat" });
  }
});

// Vite server setup (integrating client asset rendering)
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    console.log("DIST PATH:", distPath);
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
