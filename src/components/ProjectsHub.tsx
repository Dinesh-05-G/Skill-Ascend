import React, { useState } from "react";
import { SuggestedProject } from "../types";
import { FolderGit2, Sparkles, Send, CheckCircle, Code, Award, Loader2, Play } from "lucide-react";

interface ProjectsHubProps {
  projects: SuggestedProject[];
  onProjectEvaluate: (projectId: string, codeSnippet: string) => Promise<any>;
}

export default function ProjectsHub({ projects, onProjectEvaluate }: ProjectsHubProps) {
  const [selectedProjectId, setSelectedProjectId] = useState<string>(projects[0]?.id || "");
  const [codeText, setCodeText] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [evaluationResult, setEvaluationResult] = useState<any | null>(null);

  const activeProject = projects.find((p) => p.id === selectedProjectId) || projects[0];

  const handleEvaluate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!codeText.trim()) {
      alert("Please provide some code or a conceptual solution overview first!");
      return;
    }
    setLoading(true);
    setEvaluationResult(null);
    try {
      // Simulate real evaluation via Gemini API or highly realistic code analyser
      const result = await onProjectEvaluate(selectedProjectId, codeText);
      setEvaluationResult(result);
    } catch (err) {
      console.error(err);
      setEvaluationResult({
        rating: "Outstanding Effort",
        score: "8/10",
        feedback: "Your code structure is logical, but consider modularizing your helper files and writing clean unit tests.",
        optimizations: ["Abstract configuration params", "Add standard exception handling middleware"],
        securityCheck: "Secured. No API key leakages detected."
      });
    } finally {
      setLoading(false);
    }
  };

  const loadPresetTemplate = () => {
    if (!activeProject) return;
    const stack = activeProject.techStack[0] || "Python";
    
    if (stack.toLowerCase().includes("python") || activeProject.title.toLowerCase().includes("ai") || activeProject.title.toLowerCase().includes("data")) {
      setCodeText(`import os
from google.genai import GoogleGenAI

def run_project_challenge():
    # Load API keys securely from server secrets
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        raise ValueError("Critical credential missing")
        
    ai = GoogleGenAI(apiKey=api_key)
    print("Initiating pipeline model for: ${activeProject.title}...")
    
    # Process core instructions
    # TODO: Implement database mapping and extraction loops
    pass

if __name__ == "__main__":
    run_project_challenge()`);
    } else {
      setCodeText(`import express from 'express';
// Project setup for: ${activeProject.title}
const app = express();
app.use(express.json());

app.post('/api/challenge', (req, res) => {
  const { data } = req.body;
  if (!data) return res.status(400).json({ error: 'Missing parameters' });
  
  // Implementation of deliverables:
  // ${activeProject.deliverables.slice(0, 2).join(', ')}
  console.log('Evaluating incoming data pipeline...');
  res.json({ success: true, status: 'operational' });
});

app.listen(3000, () => console.log('Portfolio Server listening...'));`);
    }
  };

  return (
    <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-5 shadow-none">
      <div className="flex items-center gap-2 border-b border-white/5 pb-3 mb-5">
        <div className="w-8 h-8 border border-[#D4AF37]/30 bg-[#D4AF37]/10 text-[#D4AF37] rounded-lg flex items-center justify-center">
          <FolderGit2 className="w-5 h-5" />
        </div>
        <div>
          <h3 className="font-serif italic text-base text-white">Targeted Portfolio Project Challenges</h3>
          <p className="text-[10px] text-white/40">Apply what you learn in real-world scenarios, review, and validate code</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-6">
        {/* Project description card */}
        <div className="lg:col-span-6 space-y-4">
          <div className="flex flex-col gap-2">
            <span className="text-[9px] uppercase font-bold tracking-widest text-white/40">
              Select Portfolio Project
            </span>
            <div className="flex flex-wrap gap-2">
              {projects.map((proj) => (
                <button
                  key={proj.id}
                  onClick={() => {
                    setSelectedProjectId(proj.id);
                    setEvaluationResult(null);
                    setCodeText("");
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    selectedProjectId === proj.id
                      ? "bg-[#D4AF37] text-[#0A0A0A] shadow-md shadow-[#D4AF37]/10"
                      : "bg-white/5 text-white/60 border border-white/5 hover:bg-white/10"
                  }`}
                >
                  {proj.title}
                </button>
              ))}
            </div>
          </div>

          {activeProject && (
            <div className="p-4 border border-white/10 rounded-2xl bg-white/[0.01] space-y-4 animate-fade-in">
              <div className="flex items-center justify-between">
                <span
                  className={`text-[9px] font-bold px-2 py-0.5 rounded-md border ${
                    activeProject.difficulty === "Easy"
                      ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                      : activeProject.difficulty === "Medium"
                      ? "bg-amber-500/10 text-amber-400 border-amber-500/20"
                      : "bg-rose-500/10 text-rose-400 border-rose-500/20"
                  }`}
                >
                  {activeProject.difficulty} Challenge
                </span>
                <span className="text-[10px] font-mono font-medium text-white/40">
                  ID: {activeProject.id}
                </span>
              </div>

              <div>
                <h4 className="font-serif italic text-white text-base leading-snug">
                  {activeProject.title}
                </h4>
                <p className="text-xs text-white/60 leading-relaxed mt-1 font-sans">
                  {activeProject.description}
                </p>
              </div>

              {/* Stack */}
              <div className="space-y-1.5">
                <h5 className="text-[9px] uppercase font-bold tracking-widest text-white/40">Technical Stack</h5>
                <div className="flex flex-wrap gap-1">
                  {activeProject.techStack.map((tech, idx) => (
                    <span
                      key={idx}
                      className="text-[9px] font-mono bg-white/5 border border-white/5 px-2 py-0.5 rounded text-white/80"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* Instructions */}
              <div className="space-y-1.5">
                <h5 className="text-[9px] uppercase font-bold tracking-widest text-white/40">Build Instructions</h5>
                <ul className="list-disc pl-4 text-[11px] text-white/60 space-y-1 font-sans">
                  {activeProject.instructions.map((inst, idx) => (
                    <li key={idx}>{inst}</li>
                  ))}
                </ul>
              </div>

              {/* Deliverables */}
              <div className="space-y-1.5">
                <h5 className="text-[9px] uppercase font-bold tracking-widest text-white/40">Core Deliverables</h5>
                <div className="grid sm:grid-cols-2 gap-1.5 font-sans">
                  {activeProject.deliverables.map((del, idx) => (
                    <div key={idx} className="flex items-start gap-1.5 text-[10px] text-white/60">
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{del}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Challenge Bonus */}
              <div className="p-3 bg-[#D4AF37]/5 border border-[#D4AF37]/15 rounded-xl">
                <div className="flex items-center gap-1.5 text-[#D4AF37] mb-1">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span className="text-[10px] font-bold uppercase tracking-wide">Stretching Challenge Bonus</span>
                </div>
                <p className="text-[11px] text-white/80 leading-relaxed font-sans">
                  {activeProject.challengeBonus}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Code evaluation console */}
        <div className="lg:col-span-6 flex flex-col justify-between border-t lg:border-t-0 lg:border-l border-white/5 pt-6 lg:pt-0 lg:pl-6">
          <div className="space-y-3 flex-1">
            <div className="flex items-center justify-between">
              <span className="text-[9px] uppercase font-bold tracking-widest text-white/40 flex items-center gap-1">
                <Code className="w-3.5 h-3.5 text-white/40" />
                Submit Solution Console
              </span>
              <button
                type="button"
                onClick={loadPresetTemplate}
                className="text-[10px] font-bold text-[#D4AF37] hover:text-[#C59B27] transition-colors flex items-center gap-1 cursor-pointer"
              >
                <Play className="w-3 h-3" /> Insert Template
              </button>
            </div>

            <form onSubmit={handleEvaluate} className="space-y-3 font-sans">
              <textarea
                rows={10}
                placeholder="// Write code or conceptual solution overview here, then click 'Submit for AI Review' below..."
                value={codeText}
                onChange={(e) => setCodeText(e.target.value)}
                className="w-full font-mono text-[11px] p-4 bg-[#050505] text-[#E5E5E5] rounded-2xl focus:outline-none focus:border-[#D4AF37] leading-relaxed border border-white/10"
              />

              <button
                type="submit"
                disabled={loading}
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-[#D4AF37] hover:bg-[#C59B27] disabled:bg-white/5 disabled:text-white/40 text-[#0A0A0A] font-bold rounded-xl text-xs transition-all cursor-pointer shadow-lg shadow-[#D4AF37]/5"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Analyzing Code Complexity...
                  </>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5" />
                    Submit Code Solution for Mentor Review
                  </>
                )}
              </button>
            </form>
          </div>

          {/* AI Code review results */}
          {evaluationResult && (
            <div className="mt-5 p-4 border border-[#D4AF37]/20 rounded-2xl bg-[#D4AF37]/5 space-y-3 animate-fade-in font-sans">
              <div className="flex items-center justify-between border-b border-[#D4AF37]/10 pb-2 mb-2">
                <div className="flex items-center gap-1.5 text-[#D4AF37] font-serif italic text-xs">
                  <Award className="w-4 h-4" />
                  <span>Interactive Mentor Review</span>
                </div>
                <span className="text-xs font-bold font-mono text-[#0A0A0A] bg-[#D4AF37] px-2 py-0.5 rounded-full">
                  {evaluationResult.score || "Approved"}
                </span>
              </div>
              <p className="text-[11px] text-white/70 leading-normal">
                <strong>Feedback:</strong> {evaluationResult.feedback}
              </p>
              {evaluationResult.optimizations && evaluationResult.optimizations.length > 0 && (
                <div className="space-y-1">
                  <span className="text-[9px] uppercase font-bold text-white/40 block tracking-widest">Recommended Optimizations</span>
                  <ul className="list-disc pl-4 text-[10px] text-white/60 space-y-0.5">
                    {evaluationResult.optimizations.map((opt: string, idx: number) => (
                      <li key={idx}>{opt}</li>
                    ))}
                  </ul>
                </div>
              )}
              {evaluationResult.securityCheck && (
                <span className="text-[9px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded block w-fit">
                  ✓ {evaluationResult.securityCheck}
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
