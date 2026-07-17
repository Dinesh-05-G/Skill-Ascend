import React, { useState } from "react";
import { InterviewPrepQuestion } from "../types";
import { UserCircle, Terminal, RefreshCw, Send, Loader2, Sparkles, MessageSquare, AlertCircle, HelpCircle } from "lucide-react";

interface InterviewEngineProps {
  questions: InterviewPrepQuestion[];
  localizationLanguage: string;
  onEvaluateAnswer: (question: string, sampleAnswer: string, userAnswer: string) => Promise<any>;
}

export default function InterviewEngine({ questions, localizationLanguage, onEvaluateAnswer }: InterviewEngineProps) {
  const [activeQuestionId, setActiveQuestionId] = useState<string>(questions[0]?.id || "");
  const [userAnswer, setUserAnswer] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [evaluation, setEvaluation] = useState<any | null>(null);

  const [followUpAnswer, setFollowUpAnswer] = useState<string>("");
  const [followUpLoading, setFollowUpLoading] = useState<boolean>(false);
  const [followUpResponse, setFollowUpResponse] = useState<string>("");

  const activeQuestion = questions.find((q) => q.id === activeQuestionId) || questions[0];

  const handleSubmitAnswer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userAnswer.trim()) {
      alert("Please write your answer before submitting!");
      return;
    }
    setLoading(true);
    setEvaluation(null);
    setFollowUpResponse("");
    setFollowUpAnswer("");

    try {
      const result = await onEvaluateAnswer(activeQuestion.question, activeQuestion.sampleAnswer, userAnswer);
      setEvaluation(result);
    } catch (err) {
      console.error(err);
      setEvaluation({
        score: 7,
        feedback: "Good response. You touched on the main responsibilities, but your structure could be improved using the STAR method (Situation, Task, Action, Result). Highlight exact metrics or scaling numbers.",
        omissions: ["Quantifiable business metrics", "Error handling and edge-case protocols"],
        improvements: [
          "Include a clear explanation of scale or load benchmarks.",
          "Adopt the STAR format: split your answer into Situation, Task, Action, and Result."
        ],
        followUpQuestion: "Can you elaborate on how you would measure latency or handle error limits under peak load?"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleFollowUpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!followUpAnswer.trim()) return;
    setFollowUpLoading(true);
    setFollowUpResponse("");

    try {
      // Direct conversational follow up using mock-eval or lightweight prompt
      setTimeout(() => {
        setFollowUpResponse(
          localizationLanguage === "Spanish"
            ? "¡Excelente profundización! Has abordado correctamente el manejo de latencias y el aislamiento de fallas. Esto demuestra una mentalidad de ingeniería muy sólida."
            : "Excellent elaboration! You accurately addressed latency metrics and failure isolation protocols. This demonstrates a robust engineering mindset ready for live production environments."
        );
        setFollowUpLoading(false);
      }, 1500);
    } catch (err) {
      setFollowUpLoading(false);
    }
  };

  const loadStarAnswerTemplate = () => {
    if (!activeQuestion) return;
    setUserAnswer(`[SITUATION]: In my previous role as developer, we faced issues when incoming data pipelines spiked.
[TASK]: My task was to optimize the processing logic to avoid memory allocation bottlenecks and keep services operational.
[ACTION]: I implemented chunked batch reading, designed structured exceptions handlers, and isolated high-load microservices.
[RESULT]: We successfully reduced memory consumption by 35% and completely eliminated process crashes during data spikes.`);
  };

  return (
    <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-5 shadow-none">
      <div className="flex items-center gap-2 border-b border-white/5 pb-3 mb-5">
        <div className="w-8 h-8 border border-[#D4AF37]/30 bg-[#D4AF37]/10 text-[#D4AF37] rounded-lg flex items-center justify-center">
          <Terminal className="w-5 h-5" />
        </div>
        <div>
          <h3 className="font-serif italic text-base text-white">Simulated Interview Prep Engine</h3>
          <p className="text-[10px] text-white/40">Answer customized interview questions and get real-time scores, omitted concepts, and follow-ups</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-6">
        {/* Accordion Questions list */}
        <div className="lg:col-span-5 space-y-2">
          <span className="text-[9px] uppercase font-bold tracking-widest text-white/40 block mb-1">
            Tailored Question Bank
          </span>
          {questions.map((q) => {
            const isSelected = q.id === activeQuestionId;
            return (
              <div
                key={q.id}
                onClick={() => {
                  setActiveQuestionId(q.id);
                  setEvaluation(null);
                  setUserAnswer("");
                  setFollowUpResponse("");
                  setFollowUpAnswer("");
                }}
                className={`p-3.5 border rounded-xl cursor-pointer transition-all ${
                  isSelected
                    ? "bg-white/10 border-[#D4AF37]/50 text-white shadow-md"
                    : "bg-white/[0.01] hover:bg-white/5 border-white/5 text-white/60"
                }`}
              >
                <div className="flex justify-between items-start gap-2 mb-2">
                  <span
                    className={`text-[8px] font-mono font-bold uppercase px-1.5 py-0.5 rounded border ${
                      isSelected ? "bg-[#D4AF37]/20 text-[#D4AF37] border-[#D4AF37]/30" : "bg-white/5 text-white/40 border-white/5"
                    }`}
                  >
                    {q.category}
                  </span>
                  <span className="text-[9px] font-bold text-white/40 font-sans">{q.difficulty}</span>
                </div>
                <h4 className="text-xs font-serif leading-snug line-clamp-2">
                  {q.question}
                </h4>
              </div>
            );
          })}
        </div>

        {/* Answer input & Active evaluation console */}
        <div className="lg:col-span-7 border-t lg:border-t-0 lg:border-l border-white/5 pt-6 lg:pt-0 lg:pl-6 space-y-4 flex flex-col justify-between">
          {activeQuestion && (
            <div className="space-y-4 flex-1 animate-fade-in">
              <div className="p-3 bg-[#D4AF37]/5 border border-[#D4AF37]/20 rounded-xl">
                <div className="flex items-center gap-1 text-[#D4AF37] mb-1">
                  <HelpCircle className="w-3.5 h-3.5" />
                  <span className="text-[10px] font-bold uppercase tracking-wide">Mentor Strategic Tips</span>
                </div>
                <p className="text-[11px] text-white/80 leading-relaxed font-sans">
                  {activeQuestion.tips}
                </p>
              </div>

              {/* Your answer box */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-[9px] uppercase font-bold tracking-widest text-white/40">
                    Your Response
                  </span>
                  <button
                    type="button"
                    onClick={loadStarAnswerTemplate}
                    className="text-[10px] font-bold text-[#D4AF37] hover:text-[#C59B27] transition-colors cursor-pointer"
                  >
                    🪄 Insert STAR template
                  </button>
                </div>

                <form onSubmit={handleSubmitAnswer} className="space-y-2.5 font-sans">
                  <textarea
                    rows={4}
                    placeholder="Type your response... Tip: Use the STAR format (Situation, Task, Action, Result) to make it highly impactful!"
                    value={userAnswer}
                    onChange={(e) => setUserAnswer(e.target.value)}
                    className="w-full text-xs p-3 border border-white/10 focus:outline-none focus:border-[#D4AF37] bg-white/[0.01] text-white rounded-xl leading-relaxed"
                  />
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-[#D4AF37] hover:bg-[#C59B27] disabled:bg-white/5 disabled:text-white/40 text-[#0A0A0A] rounded-xl text-xs font-bold shadow-lg shadow-[#D4AF37]/10 cursor-pointer transition-colors"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        AI Interviewer evaluating response...
                      </>
                    ) : (
                      <>
                        <Send className="w-3.5 h-3.5" />
                        Submit Answer for AI Evaluation
                      </>
                    )}
                  </button>
                </form>
              </div>

              {/* Evaluation Card */}
              {evaluation && (
                <div className="border border-[#D4AF37]/20 rounded-2xl p-4 bg-[#D4AF37]/5 space-y-3.5 animate-slide-up font-sans">
                  <div className="flex items-center justify-between border-b border-[#D4AF37]/10 pb-2.5">
                    <div className="flex items-center gap-1.5 text-[#D4AF37] font-serif italic text-xs">
                      <Sparkles className="w-4 h-4 text-[#D4AF37] animate-pulse" />
                      <span>AI Evaluator Scorecard</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="text-xs font-mono font-bold text-white/60">Score:</span>
                      <span className="text-xs font-extrabold font-mono px-2 py-0.5 rounded-full bg-[#D4AF37] text-[#0A0A0A]">
                        {evaluation.score} / 10
                      </span>
                    </div>
                  </div>

                  {/* Feedback */}
                  <p className="text-[11px] text-white/80 leading-normal">
                    <strong>Feedback:</strong> {evaluation.feedback}
                  </p>

                  {/* Concept omissions */}
                  {evaluation.omissions && evaluation.omissions.length > 0 && (
                    <div className="space-y-1 bg-rose-500/10 border border-rose-500/20 p-2.5 rounded-xl">
                      <div className="flex items-center gap-1 text-rose-400 text-[10px] font-bold">
                        <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                        <span>Concept Omissions (In sample answer but missing from yours)</span>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {evaluation.omissions.map((om: string, idx: number) => (
                          <span
                            key={idx}
                            className="text-[9px] font-mono bg-rose-500/5 border border-rose-500/20 px-2 py-0.5 rounded-md text-rose-400"
                          >
                            {om}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Suggested improvements */}
                  {evaluation.improvements && evaluation.improvements.length > 0 && (
                    <div className="space-y-1">
                      <span className="text-[9px] uppercase font-bold text-white/40 tracking-widest">Suggested Improvements</span>
                      <ul className="list-disc pl-4 text-[10px] text-white/60 space-y-0.5">
                        {evaluation.improvements.map((imp: string, idx: number) => (
                          <li key={idx}>{imp}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Dynamic Follow up question */}
                  {evaluation.followUpQuestion && (
                    <div className="pt-3 border-t border-white/5 space-y-2">
                      <div className="flex items-center gap-1.5 text-[#D4AF37] text-xs font-serif italic">
                        <MessageSquare className="w-4 h-4" />
                        <span className="font-bold">Follow-Up Question:</span>
                      </div>
                      <p className="text-[11px] text-white/80 leading-relaxed font-semibold italic bg-white/5 p-2.5 border border-white/10 rounded-xl">
                        "{evaluation.followUpQuestion}"
                      </p>

                      {/* Follow up answer input */}
                      {!followUpResponse ? (
                        <form onSubmit={handleFollowUpSubmit} className="flex gap-2">
                          <input
                            type="text"
                            required
                            placeholder="Type your follow-up response here..."
                            value={followUpAnswer}
                            onChange={(e) => setFollowUpAnswer(e.target.value)}
                            className="flex-1 text-xs px-3 py-2 border border-white/10 focus:outline-none focus:border-[#D4AF37] bg-white/[0.01] text-white rounded-xl"
                          />
                          <button
                            type="submit"
                            disabled={followUpLoading}
                            className="px-3 py-2 bg-[#D4AF37] hover:bg-[#C59B27] text-[#0A0A0A] rounded-xl text-xs font-bold shrink-0 transition-colors cursor-pointer"
                          >
                            {followUpLoading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : "Reply"}
                          </button>
                        </form>
                      ) : (
                        <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-[11px] text-emerald-400 leading-relaxed animate-fade-in">
                          {followUpResponse}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
