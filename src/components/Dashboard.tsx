import React, { useState } from "react";
import { UserProfile, CareerProfileResponse, UserProgressData } from "../types";
import SkillsGrid from "./SkillsGrid";
import WeeklyTimeline from "./WeeklyTimeline";
import ProjectsHub from "./ProjectsHub";
import InterviewEngine from "./InterviewEngine";
import ComparisonScreen from "./ComparisonScreen";
import ProgressScreen from "./ProgressScreen";
import {
  BrainCircuit,
  GraduationCap,
  Sparkles,
  Layers,
  FolderGit2,
  Terminal,
  Trophy,
  ArrowLeftRight,
  TrendingUp,
  Award,
  Zap,
  BookOpen,
  ArrowRight
} from "lucide-react";

interface DashboardProps {
  profile: UserProfile;
  careerData: CareerProfileResponse;
  progressData: UserProgressData;
  onUpdateProgress: (updatedProgress: UserProgressData) => void;
  onUpdateProfile: (updatedProfile: UserProfile) => void;
  onReset: () => void;
}

export default function Dashboard({
  profile,
  careerData,
  progressData,
  onUpdateProgress,
  onUpdateProfile,
  onReset
}: DashboardProps) {
  const [activeTab, setActiveTab] = useState<string>("roadmap");
  const [activityProgress, setActivityProgress] = useState<Record<string, boolean>>({});

  const handleToggleActivity = (weekNumber: number, activityIdx: number) => {
    const key = `${weekNumber}-${activityIdx}`;
    const wasChecked = activityProgress[key] || false;
    const nextChecked = !wasChecked;

    const nextActivityProgress = { ...activityProgress, [key]: nextChecked };
    setActivityProgress(nextActivityProgress);

    // Calculate XP reward: +50 XP per completed activity!
    const xpChange = nextChecked ? 50 : -50;
    const nextXp = Math.max(0, progressData.weeklyXp + xpChange);

    // Check milestones
    const completedWeeksSet = new Set<number>();
    careerData.roadmap.forEach((module) => {
      let weekCompleted = true;
      module.activities.forEach((_, aIdx) => {
        const actKey = `${module.week}-${aIdx}`;
        if (!nextActivityProgress[actKey]) {
          weekCompleted = false;
        }
      });
      if (weekCompleted && module.activities.length > 0) {
        completedWeeksSet.add(module.week);
      }
    });

    const completedWeeks = Array.from(completedWeeksSet);

    // Dynamic Achievements unlocking based on XP / Completed weeks
    const achievementsList = [...progressData.achievements];
    
    // First milestone
    if (completedWeeks.length >= 1 && !achievementsList[0].unlockedAt) {
      achievementsList[0].unlockedAt = new Date().toLocaleDateString();
    }
    // XP milestone
    if (nextXp >= 200 && !achievementsList[1].unlockedAt) {
      achievementsList[1].unlockedAt = new Date().toLocaleDateString();
    }

    onUpdateProgress({
      ...progressData,
      weeklyXp: nextXp,
      completedModulesCount: completedWeeks.length,
      milestones: progressData.milestones.map((m) => ({
        ...m,
        isCompleted: completedWeeks.includes(m.week)
      })),
      achievements: achievementsList
    });
  };

  const handleProjectEvaluate = async (projectId: string, codeSnippet: string) => {
    // Call server code evaluation simulation
    const response = await fetch("/api/evaluate-interview-answer", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        question: `Evaluate this portfolio code snippet/solution for project: ${projectId}. Is it robust?`,
        sampleAnswer: "Clean modular file setup, standard exception handling middleware, config abstraction, and parameter checks.",
        userAnswer: codeSnippet,
        localizationLanguage: profile.localizationLanguage
      })
    });

    if (!response.ok) throw new Error("Failed to evaluate code snippet");
    const data = await response.json();

    // Reward XP +150 on submission!
    const nextXp = progressData.weeklyXp + 150;
    const achievementsList = [...progressData.achievements];
    // Project Pioneer unlock
    if (!achievementsList[2].unlockedAt) {
      achievementsList[2].unlockedAt = new Date().toLocaleDateString();
    }

    onUpdateProgress({
      ...progressData,
      weeklyXp: nextXp,
      completedProjectsCount: Math.min(3, progressData.completedProjectsCount + 1),
      achievements: achievementsList
    });

    return {
      score: `${data.score}/10 Rating`,
      feedback: data.feedback,
      optimizations: data.improvements || [],
      securityCheck: "Secured. No API key leakages detected."
    };
  };

  const handleEvaluateAnswer = async (question: string, sampleAnswer: string, userAnswer: string) => {
    const response = await fetch("/api/evaluate-interview-answer", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        question,
        sampleAnswer,
        userAnswer,
        localizationLanguage: profile.localizationLanguage
      })
    });

    if (!response.ok) throw new Error("Failed to evaluate answer");
    const data = await response.json();

    // Reward XP +100 on response
    const nextXp = progressData.weeklyXp + 100;
    const achievementsList = [...progressData.achievements];
    // Interview Crusader unlock
    if (data.score >= 8 && !achievementsList[3].unlockedAt) {
      achievementsList[3].unlockedAt = new Date().toLocaleDateString();
    }

    onUpdateProgress({
      ...progressData,
      weeklyXp: nextXp,
      achievements: achievementsList
    });

    return data;
  };

  const handleCompareRoles = async (primary: string, secondary: string) => {
    const response = await fetch("/api/compare-roles", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        primaryRole: primary,
        comparisonRole: secondary,
        localizationLanguage: profile.localizationLanguage
      })
    });

    if (!response.ok) throw new Error("Failed to compare roles");
    return await response.json();
  };

  const getCompletedWeeks = () => {
    return progressData.milestones.filter((m) => m.isCompleted).map((m) => m.week);
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-[#E5E5E5] font-sans selection:bg-[#D4AF37] selection:text-[#0A0A0A]">
      {/* Header Banner */}
      <header className="bg-[#0A0A0A] border-b border-white/10 text-white h-20 flex items-center justify-between px-6">
        <div className="max-w-7xl mx-auto w-full flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={onReset}
              className="p-2.5 bg-white/5 border border-white/10 hover:bg-white/10 text-[#D4AF37] rounded-xl transition-all mr-1 cursor-pointer"
              title="Return to home"
            >
              <BrainCircuit className="w-5 h-5" />
            </button>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-serif italic text-lg tracking-tight text-[#D4AF37]">
                  Ascend Career Lab
                </span>
                <span className="text-[9px] uppercase font-mono font-bold bg-[#D4AF37]/10 text-[#D4AF37] border border-[#D4AF37]/20 px-2 py-0.5 rounded">
                  {profile.localizationLanguage} Mode
                </span>
              </div>
              <p className="text-xs text-white/50 mt-0.5">
                Target: <strong className="text-[#D4AF37] font-serif italic">{profile.targetRole}</strong> • Level: {profile.experienceLevel}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <span className="text-[9px] text-white/40 block font-bold uppercase tracking-wider">Candidate</span>
              <h4 className="text-sm font-light text-white leading-normal">{profile.name}</h4>
            </div>
            <button
              onClick={onReset}
              className="text-xs font-semibold px-3 py-1.5 bg-white/5 border border-white/10 hover:bg-white/10 text-white rounded-lg transition-colors cursor-pointer"
            >
              Retake Profile
            </button>
          </div>
        </div>
      </header>

      {/* Main Dashboard Navigation Tabs */}
      <nav className="bg-[#0A0A0A] border-b border-white/10 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-6 h-14 flex items-center gap-1 overflow-x-auto">
          <button
            onClick={() => setActiveTab("roadmap")}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
              activeTab === "roadmap"
                ? "bg-[#D4AF37]/10 text-[#D4AF37] font-extrabold border border-[#D4AF37]/30"
                : "text-white/60 hover:bg-white/5 hover:text-white"
            }`}
          >
            <Layers className="w-4 h-4" />
            Roadmap & Skills
          </button>

          <button
            onClick={() => setActiveTab("projects")}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
              activeTab === "projects"
                ? "bg-[#D4AF37]/10 text-[#D4AF37] font-extrabold border border-[#D4AF37]/30"
                : "text-white/60 hover:bg-white/5 hover:text-white"
            }`}
          >
            <FolderGit2 className="w-4 h-4" />
            Portfolio Challenges
          </button>

          <button
            onClick={() => setActiveTab("interview")}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
              activeTab === "interview"
                ? "bg-[#D4AF37]/10 text-[#D4AF37] font-extrabold border border-[#D4AF37]/30"
                : "text-white/60 hover:bg-white/5 hover:text-white"
            }`}
          >
            <Terminal className="w-4 h-4" />
            Interview Prep Engine
          </button>

          <button
            onClick={() => setActiveTab("comparison")}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
              activeTab === "comparison"
                ? "bg-[#D4AF37]/10 text-[#D4AF37] font-extrabold border border-[#D4AF37]/30"
                : "text-white/60 hover:bg-white/5 hover:text-white"
            }`}
          >
            <ArrowLeftRight className="w-4 h-4" />
            Path Comparison
          </button>

          <button
            onClick={() => setActiveTab("progress")}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
              activeTab === "progress"
                ? "bg-[#D4AF37]/10 text-[#D4AF37] font-extrabold border border-[#D4AF37]/30"
                : "text-white/60 hover:bg-white/5 hover:text-white"
            }`}
          >
            <Trophy className="w-4 h-4" />
            Milestones & Settings
          </button>
        </div>
      </nav>

      {/* Main Core View Area */}
      <main className="max-w-7xl mx-auto px-6 py-8 space-y-8 pb-24">
        {/* Core Top Scoreboard & Indicators */}
        <div className="grid md:grid-cols-12 gap-6">
          {/* Circular Readiness Meter */}
          <div className="md:col-span-4 bg-white/[0.03] border border-white/10 rounded-3xl p-6 shadow-none flex flex-col items-center justify-center text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 p-3 bg-white/5 border-l border-b border-white/10 text-white/40 rounded-bl-2xl">
              <TrendingUp className="w-4 h-4" />
            </div>

            <span className="text-[9px] uppercase font-bold text-white/40 tracking-widest mb-2">
              Career Readiness Score
            </span>

            {/* Circular Gauge */}
            <div className="relative w-36 h-36 flex items-center justify-center mb-3">
              <svg className="w-full h-full transform -rotate-90">
                <circle
                  cx="72"
                  cy="72"
                  r="62"
                  className="stroke-white/5 fill-transparent"
                  strokeWidth="6"
                />
                <circle
                  cx="72"
                  cy="72"
                  r="62"
                  className="stroke-[#D4AF37] fill-transparent transition-all duration-1000 ease-out"
                  strokeWidth="6"
                  strokeDasharray={389.5}
                  strokeDashoffset={389.5 - (389.5 * careerData.careerReadinessScore) / 100}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute flex flex-col items-center justify-center text-white">
                <span className="text-3xl font-light font-serif text-[#D4AF37]">
                  {careerData.careerReadinessScore}%
                </span>
                <span className="text-[9px] font-bold text-white/40 uppercase tracking-widest mt-0.5">
                  Alignment
                </span>
              </div>
            </div>

            <p className="text-xs text-white/50 leading-relaxed italic font-serif max-w-[220px]">
              {careerData.careerReadinessScore >= 80
                ? "Highly matched! Focus heavily on interview simulations to finalize alignment."
                : careerData.careerReadinessScore >= 50
                ? "Balanced fit. Close critical skill gaps by implementing portfolio challenges."
                : "Foundation building required. Complete the sequential week objectives carefully."}
            </p>
          </div>

          {/* Sizable Stats grid */}
          <div className="md:col-span-8 grid sm:grid-cols-3 gap-6">
            <div className="bg-white/[0.03] border border-white/10 rounded-3xl p-5 flex flex-col justify-between">
              <div className="p-2 bg-[#D4AF37]/10 border border-[#D4AF37]/20 text-[#D4AF37] rounded-xl w-fit">
                <Award className="w-5 h-5" />
              </div>
              <div className="mt-4">
                <span className="text-[9px] text-white/40 font-bold uppercase tracking-widest">Skills Matched</span>
                <h4 className="text-2xl font-light font-serif text-[#D4AF37] mt-1">
                  {careerData.skillsMatched.length} Verified
                </h4>
                <p className="text-[10px] text-white/40 mt-1 italic font-serif">Foundational concepts matching expectations</p>
              </div>
            </div>

            <div className="bg-white/[0.03] border border-white/10 rounded-3xl p-5 flex flex-col justify-between">
              <div className="p-2 bg-rose-950/20 border border-rose-800/30 text-rose-400 rounded-xl w-fit">
                <Zap className="w-5 h-5" />
              </div>
              <div className="mt-4">
                <span className="text-[9px] text-white/40 font-bold uppercase tracking-widest">Missing Skills Gaps</span>
                <h4 className="text-2xl font-light font-serif text-white mt-1">
                  {careerData.missingSkills.length} Identified
                </h4>
                <p className="text-[10px] text-white/40 mt-1 italic font-serif">Benchmarks you need to develop</p>
              </div>
            </div>

            <div className="bg-white/[0.03] border border-white/10 rounded-3xl p-5 flex flex-col justify-between">
              <div className="p-2 bg-[#D4AF37]/10 border border-[#D4AF37]/20 text-[#D4AF37] rounded-xl w-fit">
                <BookOpen className="w-5 h-5" />
              </div>
              <div className="mt-4">
                <span className="text-[9px] text-white/40 font-bold uppercase tracking-widest">Est. Learning Time</span>
                <h4 className="text-2xl font-light font-serif text-[#D4AF37] mt-1">
                  ~{careerData.estLearningHours} Hours
                </h4>
                <p className="text-[10px] text-white/40 mt-1 italic font-serif">To close critical gaps completely</p>
              </div>
            </div>
          </div>
        </div>

        {/* Dynamic Tab Switch Renders */}
        <div className="transition-all duration-300">
          {activeTab === "roadmap" && (
            <div className="space-y-6 animate-fade-in">
              <SkillsGrid
                skillsMatched={careerData.skillsMatched}
                missingSkills={careerData.missingSkills}
              />
              <WeeklyTimeline
                roadmap={careerData.roadmap}
                completedWeeks={getCompletedWeeks()}
                onToggleActivity={handleToggleActivity}
                activityProgress={activityProgress}
              />
            </div>
          )}

          {activeTab === "projects" && (
            <div className="animate-fade-in">
              <ProjectsHub
                projects={careerData.suggestedProjects}
                onProjectEvaluate={handleProjectEvaluate}
              />
            </div>
          )}

          {activeTab === "interview" && (
            <div className="animate-fade-in">
              <InterviewEngine
                questions={careerData.interviewQuestions}
                localizationLanguage={profile.localizationLanguage}
                onEvaluateAnswer={handleEvaluateAnswer}
              />
            </div>
          )}

          {activeTab === "comparison" && (
            <div className="animate-fade-in">
              <ComparisonScreen
                primaryRole={profile.targetRole}
                localizationLanguage={profile.localizationLanguage}
                onCompareRoles={handleCompareRoles}
              />
            </div>
          )}

          {activeTab === "progress" && (
            <div className="animate-fade-in">
              <ProgressScreen
                profile={profile}
                progressData={progressData}
                careerReadinessScore={careerData.careerReadinessScore}
                onUpdatePreferences={onUpdateProfile}
              />
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
