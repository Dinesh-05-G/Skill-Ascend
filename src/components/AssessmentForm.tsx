import React, { useState } from "react";
import { UserProfile } from "../types";
import { ArrowLeft, ArrowRight, BrainCircuit, Sparkles, BookOpen, Clock, HeartHandshake } from "lucide-react";

interface AssessmentFormProps {
  onSubmit: (profile: UserProfile) => void;
  onCancel: () => void;
}

const COMMON_ROLES = [
  "AI Engineer",
  "Full-Stack Web Developer",
  "Frontend Engineer",
  "Data Scientist",
  "Data Analyst",
  "Cloud Solutions Architect",
  "Cybersecurity Analyst",
  "Product Manager (Tech)"
];

const LANGUAGES = [
  "English",
  "Spanish",
  "French",
  "German",
  "Portuguese",
  "Hindi",
  "Japanese",
  "Mandarin"
];

const DEFAULT_PROFILE: UserProfile = {
  name: "",
  targetRole: "AI Engineer",
  experienceLevel: "beginner",
  skillsText: "",
  resumeText: "",
  weeklyCommitment: 10,
  confidenceLevel: 5,
  localizationLanguage: "English"
};

export default function AssessmentForm({ onSubmit, onCancel }: AssessmentFormProps) {
  const [step, setStep] = useState<number>(1);
  const [profile, setProfile] = useState<UserProfile>(DEFAULT_PROFILE);

  const [customRole, setCustomRole] = useState<boolean>(false);
  const [typedRole, setTypedRole] = useState<string>("");

  const nextStep = () => {
    if (step < 3) setStep(step + 1);
  };

  const prevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleRoleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    if (value === "custom") {
      setCustomRole(true);
      setProfile((prev) => ({ ...prev, targetRole: "" }));
    } else {
      setCustomRole(false);
      setProfile((prev) => ({ ...prev, targetRole: value }));
    }
  };

  const handleTypedRoleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setTypedRole(value);
    setProfile((prev) => ({ ...prev, targetRole: value }));
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Validate
    if (!profile.name.trim()) {
      alert("Please provide your name.");
      setStep(1);
      return;
    }
    if (!profile.targetRole.trim()) {
      alert("Please specify or choose your target career role.");
      setStep(1);
      return;
    }
    onSubmit(profile);
  };

  // Pre-fill demo data to make user evaluation delightful
  const prefillDemoData = () => {
    setProfile({
      name: "Alex Rivera",
      targetRole: "AI Engineer",
      experienceLevel: "intermediate",
      skillsText: "Python, JavaScript, basic HTML/CSS, basic linear algebra, pandas, sklearn",
      resumeText: "Software Developer for 2 years building standard business logic. Familiar with Rest APIs. Want to build and deploy generative AI apps and scale them securely.",
      weeklyCommitment: 15,
      confidenceLevel: 6,
      localizationLanguage: "English"
    });
    setStep(1);
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-[#E5E5E5] flex flex-col justify-between font-sans">
      {/* Mini Header */}
      <header className="bg-[#0A0A0A] border-b border-white/10 py-4 px-6">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="p-1.5 border border-[#D4AF37]/30 bg-[#D4AF37]/10 rounded-lg text-[#D4AF37]">
              <BrainCircuit className="w-5 h-5" />
            </div>
            <span className="font-serif italic text-lg text-white">Ascend Career Lab</span>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={prefillDemoData}
              className="text-xs font-semibold px-3 py-1.5 bg-[#D4AF37]/10 text-[#D4AF37] border border-[#D4AF37]/30 hover:bg-[#D4AF37]/20 rounded-lg transition-colors"
            >
              🪄 Autofill Demo
            </button>
            <button
              type="button"
              onClick={onCancel}
              className="text-xs text-white/40 hover:text-white transition-colors font-medium"
            >
              Cancel
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Form Card */}
      <main className="flex-1 py-12 px-6 flex items-center justify-center">
        <div className="w-full max-w-2xl bg-white/[0.03] border border-white/10 rounded-3xl shadow-2xl p-6 md:p-10 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-[#D4AF37]/40 via-[#D4AF37] to-[#D4AF37]/40" />
          
          {/* Progress Indicator */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              {[1, 2, 3].map((s) => (
                <div key={s} className="flex items-center gap-2">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                      step === s
                        ? "bg-[#D4AF37] text-[#0A0A0A] shadow-md shadow-[#D4AF37]/20 scale-105"
                        : step > s
                        ? "bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-[#D4AF37]"
                        : "bg-white/5 border border-white/10 text-white/40"
                    }`}
                  >
                    {s}
                  </div>
                  {s < 3 && <div className={`w-8 h-[1px] ${step > s ? "bg-[#D4AF37]/30" : "bg-white/5"}`} />}
                </div>
              ))}
            </div>
            <span className="text-xs font-mono text-white/40 font-semibold uppercase">
              Step {step} of 3
            </span>
          </div>

          <form onSubmit={handleFormSubmit} className="space-y-6">
            {/* STEP 1: Personal Profile */}
            {step === 1 && (
              <div className="space-y-5 animate-fade-in">
                <div>
                  <div className="inline-flex items-center gap-2 text-[#D4AF37] mb-1.5">
                    <Sparkles className="w-4 h-4" />
                    <span className="text-[10px] font-semibold uppercase tracking-widest">Step 1: Identity & Ambitions</span>
                  </div>
                  <h2 className="text-2xl font-serif italic text-white">Tell us about yourself</h2>
                  <p className="text-xs text-white/50">We tailor your career roadmap and benchmarks around these settings.</p>
                </div>

                <div className="space-y-4">
                  {/* Name */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-white/60 uppercase" htmlFor="user-name">
                      Full Name
                    </label>
                    <input
                      id="user-name"
                      type="text"
                      required
                      placeholder="e.g., Alex Rivera"
                      value={profile.name}
                      onChange={(e) => setProfile((prev) => ({ ...prev, name: e.target.value }))}
                      className="w-full px-4 py-2.5 rounded-xl border border-white/10 focus:outline-none focus:border-[#D4AF37] bg-white/5 hover:bg-white/10 focus:bg-[#0f0f0f] text-sm text-white transition-all"
                    />
                  </div>

                  {/* Target Role Selector */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-white/60 uppercase">
                      Target Career Role
                    </label>
                    <div className="grid sm:grid-cols-2 gap-3">
                      <select
                        value={customRole ? "custom" : COMMON_ROLES.includes(profile.targetRole) ? profile.targetRole : "custom"}
                        onChange={handleRoleChange}
                        className="w-full px-4 py-2.5 rounded-xl border border-white/10 focus:outline-none focus:border-[#D4AF37] bg-white/5 hover:bg-white/10 focus:bg-[#0f0f0f] text-sm text-white transition-all"
                      >
                        {COMMON_ROLES.map((r) => (
                          <option key={r} value={r} className="bg-[#0A0A0A]">
                            {r}
                          </option>
                        ))}
                        <option value="custom" className="bg-[#0A0A0A]">Other / Custom role...</option>
                      </select>

                      {customRole && (
                        <input
                          type="text"
                          required
                          placeholder="Type custom role, e.g., VR Developer"
                          value={typedRole}
                          onChange={handleTypedRoleChange}
                          className="w-full px-4 py-2.5 rounded-xl border border-[#D4AF37] focus:outline-none bg-[#D4AF37]/5 text-[#D4AF37] text-sm transition-all"
                        />
                      )}
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    {/* Experience Level Selector */}
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold text-white/60 uppercase">
                        Current Career Level
                      </label>
                      <select
                        value={profile.experienceLevel}
                        onChange={(e) =>
                          setProfile((prev) => ({ ...prev, experienceLevel: e.target.value as any }))
                        }
                        className="w-full px-4 py-2.5 rounded-xl border border-white/10 focus:outline-none focus:border-[#D4AF37] bg-white/5 text-sm text-white transition-all"
                      >
                        <option value="beginner" className="bg-[#0A0A0A]">Beginner (No professional experience)</option>
                        <option value="intermediate" className="bg-[#0A0A0A]">Intermediate (1-3 years experience)</option>
                        <option value="advanced" className="bg-[#0A0A0A]">Advanced (4+ years or Senior level)</option>
                      </select>
                    </div>

                    {/* Preferred Localization Language */}
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold text-white/60 uppercase">
                        Language (Localization)
                      </label>
                      <select
                        value={profile.localizationLanguage}
                        onChange={(e) =>
                          setProfile((prev) => ({ ...prev, localizationLanguage: e.target.value }))
                        }
                        className="w-full px-4 py-2.5 rounded-xl border border-white/10 focus:outline-none focus:border-[#D4AF37] bg-white/5 text-sm text-white transition-all"
                      >
                        {LANGUAGES.map((lang) => (
                          <option key={lang} value={lang} className="bg-[#0A0A0A]">
                            {lang}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 2: Skills & Background */}
            {step === 2 && (
              <div className="space-y-5 animate-fade-in">
                <div>
                  <div className="inline-flex items-center gap-2 text-[#D4AF37] mb-1.5">
                    <BookOpen className="w-4 h-4" />
                    <span className="text-[10px] font-semibold uppercase tracking-widest">Step 2: Core Competencies</span>
                  </div>
                  <h2 className="text-2xl font-serif italic text-white">Your Skills & Experience</h2>
                  <p className="text-xs text-white/50">Provide details on what you know. Pasting resumes works perfectly.</p>
                </div>

                <div className="space-y-4">
                  {/* Current Skills list input */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-white/60 uppercase" htmlFor="skills-tags">
                      Current Skills (Comma separated)
                    </label>
                    <textarea
                      id="skills-tags"
                      rows={2}
                      placeholder="e.g., Python, SQL, REST APIs, Git, JavaScript"
                      value={profile.skillsText}
                      onChange={(e) => setProfile((prev) => ({ ...prev, skillsText: e.target.value }))}
                      className="w-full px-4 py-2.5 rounded-xl border border-white/10 focus:outline-none focus:border-[#D4AF37] bg-white/5 hover:bg-white/10 focus:bg-[#0f0f0f] text-sm text-white transition-all"
                    />
                  </div>

                  {/* Portfolio or Resume text block */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-white/60 uppercase" htmlFor="resume-pasted">
                      Resume Background or Current Projects Summary
                    </label>
                    <textarea
                      id="resume-pasted"
                      rows={5}
                      placeholder="Paste your resume, LinkedIn summary, or describe past projects, courses, or what coding languages you have practiced."
                      value={profile.resumeText}
                      onChange={(e) => setProfile((prev) => ({ ...prev, resumeText: e.target.value }))}
                      className="w-full px-4 py-2.5 rounded-xl border border-white/10 focus:outline-none focus:border-[#D4AF37] bg-white/5 hover:bg-white/10 focus:bg-[#0f0f0f] text-sm text-white transition-all leading-relaxed"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* STEP 3: Commitment & Confidence */}
            {step === 3 && (
              <div className="space-y-5 animate-fade-in">
                <div>
                  <div className="inline-flex items-center gap-2 text-[#D4AF37] mb-1.5">
                    <HeartHandshake className="w-4 h-4" />
                    <span className="text-[10px] font-semibold uppercase tracking-widest">Step 3: Execution Settings</span>
                  </div>
                  <h2 className="text-2xl font-serif italic text-white">Commitment & Comfort</h2>
                  <p className="text-xs text-white/50">How much time do you have, and how do you feel about the transition?</p>
                </div>

                <div className="space-y-6">
                  {/* Weekly Commitment */}
                  <div className="flex flex-col gap-2 p-4 bg-white/5 border border-white/10 rounded-2xl">
                    <div className="flex justify-between items-center">
                      <label className="text-xs font-bold text-white/60 uppercase flex items-center gap-1.5">
                        <Clock className="w-4 h-4 text-white/40" />
                        Weekly Time Commitment
                      </label>
                      <span className="text-xs font-mono font-bold text-[#D4AF37] bg-[#D4AF37]/10 border border-[#D4AF37]/30 px-2 py-1 rounded-md">
                        {profile.weeklyCommitment} hours / week
                      </span>
                    </div>
                    <input
                      type="range"
                      min="3"
                      max="40"
                      value={profile.weeklyCommitment}
                      onChange={(e) =>
                        setProfile((prev) => ({ ...prev, weeklyCommitment: parseInt(e.target.value) }))
                      }
                      className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-[#D4AF37]"
                    />
                    <div className="flex justify-between text-[10px] text-white/40 font-medium">
                      <span>3h (Light review)</span>
                      <span>15h (Part-time study)</span>
                      <span>40h (Bootcamp intensive)</span>
                    </div>
                  </div>

                  {/* Confidence level */}
                  <div className="flex flex-col gap-2 p-4 bg-white/5 border border-white/10 rounded-2xl">
                    <div className="flex justify-between items-center">
                      <label className="text-xs font-bold text-white/60 uppercase">
                        Current Subjective Confidence Level
                      </label>
                      <span className="text-xs font-mono font-bold text-[#D4AF37] bg-[#D4AF37]/10 border border-[#D4AF37]/30 px-2 py-1 rounded-md">
                        {profile.confidenceLevel} / 10
                      </span>
                    </div>
                    <input
                      type="range"
                      min="1"
                      max="10"
                      value={profile.confidenceLevel}
                      onChange={(e) =>
                        setProfile((prev) => ({ ...prev, confidenceLevel: parseInt(e.target.value) }))
                      }
                      className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-[#D4AF37]"
                    />
                    <div className="flex justify-between text-[10px] text-white/40 font-medium">
                      <span>1 (Anxious/Stuck)</span>
                      <span>5 (Neutral)</span>
                      <span>10 (Extremely Ready)</span>
                    </div>
                  </div>

                  {/* Terms / Disclaimer Acceptance */}
                  <div className="p-3 bg-white/5 border border-white/10 rounded-xl flex gap-3">
                    <input
                      id="disclaimer-chk"
                      type="checkbox"
                      required
                      defaultChecked
                      className="mt-0.5 rounded border-white/20 text-[#D4AF37] focus:ring-[#D4AF37] accent-[#D4AF37] shrink-0"
                    />
                    <label htmlFor="disclaimer-chk" className="text-[11px] text-white/60 leading-normal">
                      I agree to let Ascend AI safely analyze my profile using server-side Google Gemini. All data is securely private to my session.
                    </label>
                  </div>
                </div>
              </div>
            )}

            {/* Wizard Buttons */}
            <div className="flex items-center justify-between pt-6 border-t border-white/10">
              <div>
                {step > 1 && (
                  <button
                    type="button"
                    onClick={prevStep}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-white/60 hover:text-white transition-colors py-2 px-3 border border-white/10 rounded-xl"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    Back
                  </button>
                )}
              </div>

              <div className="flex items-center gap-3">
                {step < 3 ? (
                  <button
                    type="button"
                    onClick={nextStep}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-white bg-white/10 border border-white/15 hover:bg-white/20 transition-colors py-2.5 px-4.5 rounded-xl cursor-pointer"
                  >
                    Next Step
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                ) : (
                  <button
                    type="submit"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0A0A0A] bg-[#D4AF37] hover:bg-[#C59B27] transition-all py-2.5 px-6 rounded-xl shadow-lg shadow-[#D4AF37]/10 hover:shadow-[#D4AF37]/20 cursor-pointer"
                  >
                    Generate My Roadmap
                    <Sparkles className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          </form>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/10 bg-[#070707] py-4 text-center">
        <p className="text-[10px] text-white/40 font-mono">
          © 2026 Ascend AI Assessment Lab. Active server sessions are isolated.
        </p>
      </footer>
    </div>
  );
}
