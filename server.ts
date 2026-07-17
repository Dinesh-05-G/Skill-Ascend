import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(express.json());

const PORT = 3000;

// Initialize GoogleGenAI client on the server side securely
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

// API Routes
// Endpoint 1: Generate Career Profile, Roadmap, Skills Mapping, Projects, and Questions
app.post("/api/generate-roadmap", async (req, res) => {
  try {
    const { name, targetRole, experienceLevel, skillsText, resumeText, weeklyCommitment, confidenceLevel, localizationLanguage } = req.body;

    const systemPrompt = `You are an elite career mentor and technical skill assessor. 
Analyze the user profile for the target role "${targetRole}" with experience level "${experienceLevel}".
Determine their skills profile: extract matched skills (comparing what they provided to industry expectations for the role), identify crucial missing skills/skill gaps, estimate realistic learning hours, and design a customized week-by-week learning roadmap (minimum 4 weeks) fitting their weekly commitment of ${weeklyCommitment} hours.
Also, design 3 customized, highly practical project challenges mapped to their skill gaps, and 3 interview preparation questions complete with sample answers and tips.

CRITICAL: Translate all text outputs, descriptions, titles, tips, objectives, and questions into the requested language: "${localizationLanguage || "English"}".
Format all outputs in structured JSON matching the requested response schema exactly.`;

    const userPrompt = `User Name: ${name}
Target Career Role: ${targetRole}
Experience Level: ${experienceLevel}
Current Skills stated: ${skillsText}
Resume/Background Details: ${resumeText}
Weekly Commitment: ${weeklyCommitment} hours/week
Confidence Level: ${confidenceLevel}/10`;

    const response = await ai.models.generateContent({
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

    const response = await ai.models.generateContent({
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

    const response = await ai.models.generateContent({
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

    const response = await ai.models.generateContent({
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
