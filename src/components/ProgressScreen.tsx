import React, { useState } from "react";
import { UserProfile, UserProgressData } from "../types";
import { Award, Zap, Trophy, Download, CheckSquare, Save, BellRing, Settings, ShieldCheck, Mail } from "lucide-react";

interface ProgressScreenProps {
  profile: UserProfile;
  progressData: UserProgressData;
  careerReadinessScore: number;
  onUpdatePreferences: (updatedProfile: UserProfile) => void;
}

export default function ProgressScreen({
  profile,
  progressData,
  careerReadinessScore,
  onUpdatePreferences
}: ProgressScreenProps) {
  const [userName, setUserName] = useState<string>(profile.name);
  const [weeklyCommitment, setWeeklyCommitment] = useState<number>(profile.weeklyCommitment);
  const [notifications, setNotifications] = useState<boolean>(true);
  const [savedFeedback, setSavedFeedback] = useState<boolean>(false);
  const [showCertModal, setShowCertModal] = useState<boolean>(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdatePreferences({
      ...profile,
      name: userName,
      weeklyCommitment
    });
    setSavedFeedback(true);
    setTimeout(() => setSavedFeedback(false), 2000);
  };

  const isEligibleForCert = careerReadinessScore >= 50;

  return (
    <div className="space-y-6">
      {/* Metrics Row */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Day Streak */}
        <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-5 shadow-none flex items-center justify-between">
          <div>
            <span className="text-[9px] uppercase font-bold text-white/40 block mb-1">Active Learning</span>
            <h4 className="text-xl font-bold font-mono text-white">{progressData.streakDays} Day Streak</h4>
            <p className="text-[10px] text-white/40 mt-1">Consistency secures alignment</p>
          </div>
          <div className="p-3 bg-rose-500/10 text-rose-400 border border-rose-500/20 rounded-xl shrink-0">
            <Zap className="w-6 h-6 fill-rose-400 animate-pulse" />
          </div>
        </div>

        {/* Weekly XP */}
        <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-5 shadow-none flex items-center justify-between">
          <div>
            <span className="text-[9px] uppercase font-bold text-white/40 block mb-1">XP Points Collected</span>
            <h4 className="text-xl font-bold font-mono text-white">
              {progressData.weeklyXp} / {progressData.weeklyXpGoal} XP
            </h4>
            <div className="w-24 h-1 bg-white/10 rounded-full overflow-hidden mt-2">
              <div
                className="h-full bg-[#D4AF37] rounded-full"
                style={{ width: `${(progressData.weeklyXp / progressData.weeklyXpGoal) * 100}%` }}
              />
            </div>
          </div>
          <div className="p-3 bg-[#D4AF37]/10 text-[#D4AF37] border border-[#D4AF37]/20 rounded-xl shrink-0">
            <Trophy className="w-6 h-6" />
          </div>
        </div>

        {/* Projects Completed */}
        <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-5 shadow-none flex items-center justify-between">
          <div>
            <span className="text-[9px] uppercase font-bold text-white/40 block mb-1">Portfolio Builders</span>
            <h4 className="text-xl font-bold font-mono text-white">{progressData.completedProjectsCount} / 3 Complete</h4>
            <p className="text-[10px] text-white/40 mt-1">Practical challenges validated</p>
          </div>
          <div className="p-3 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-xl shrink-0">
            <CheckSquare className="w-6 h-6" />
          </div>
        </div>

        {/* Cert Banner */}
        <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-5 shadow-none flex items-center justify-between">
          <div>
            <span className="text-[9px] uppercase font-bold text-white/40 block mb-1">Skill Verification</span>
            <h4 className="text-sm font-serif italic text-white">Certificate Status</h4>
            {isEligibleForCert ? (
              <button
                type="button"
                onClick={() => setShowCertModal(true)}
                className="mt-1.5 inline-flex items-center gap-1 text-[10px] font-bold text-[#D4AF37] hover:text-[#C59B27] transition-colors cursor-pointer"
              >
                🪄 View Certificate <Download className="w-3 h-3 text-[#D4AF37]" />
              </button>
            ) : (
              <p className="text-[10px] text-white/40 mt-1">Requires 50% Readiness score</p>
            )}
          </div>
          <div className={`p-3 rounded-xl shrink-0 border border-white/10 ${isEligibleForCert ? "bg-[#D4AF37]/10 text-[#D4AF37] border-[#D4AF37]/20" : "bg-white/5 text-white/20"}`}>
            <Award className="w-6 h-6" />
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-6">
        {/* Achievements Gallery */}
        <div className="lg:col-span-7 bg-white/[0.03] border border-white/10 rounded-2xl p-5 shadow-none space-y-4">
          <div>
            <h3 className="font-serif italic text-base text-white">Your Achievement Gallery</h3>
            <p className="text-[10px] text-white/40">Pinnacles unlocked as you sprint through roadmap objectives</p>
          </div>

          <div className="grid sm:grid-cols-2 gap-3 font-sans">
            {progressData.achievements.map((ach) => {
              const isUnlocked = !!ach.unlockedAt;
              return (
                <div
                  key={ach.id}
                  className={`p-3.5 border rounded-2xl flex gap-3 transition-all ${
                    isUnlocked
                      ? "bg-white/[0.01] border-white/10"
                      : "bg-white/[0.005] border-white/5 opacity-40"
                  }`}
                >
                  <div className={`p-2.5 rounded-xl text-xs shrink-0 h-fit border ${isUnlocked ? "bg-[#D4AF37]/10 text-[#D4AF37] border-[#D4AF37]/20" : "bg-white/5 text-white/20 border-white/5"}`}>
                    <Trophy className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white">{ach.title}</h4>
                    <p className="text-[10px] text-white/60 leading-normal mt-0.5">{ach.description}</p>
                    {isUnlocked && (
                      <span className="text-[8px] font-mono font-bold text-[#D4AF37] uppercase tracking-wide block mt-1.5">
                        Unlocked: {ach.unlockedAt}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Preference Settings panel */}
        <div className="lg:col-span-5 bg-white/[0.03] border border-white/10 rounded-2xl p-5 shadow-none space-y-4">
          <div>
            <h3 className="font-serif italic text-base text-white">Preferences & Schedule</h3>
            <p className="text-[10px] text-white/40">Re-route your timeline parameters dynamically</p>
          </div>

          <form onSubmit={handleSave} className="space-y-4 font-sans">
            {/* Name */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Your Profile Name</label>
              <input
                type="text"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                className="w-full text-xs px-3 py-2 border border-white/10 focus:outline-none focus:border-[#D4AF37] bg-white/[0.01] text-white rounded-xl"
              />
            </div>

            {/* Weekly slider */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-[10px] font-bold text-white/40 uppercase tracking-widest">
                <label>Weekly Commitment</label>
                <span className="text-[#D4AF37] font-mono font-bold">{weeklyCommitment} Hrs/Week</span>
              </div>
              <input
                type="range"
                min="3"
                max="40"
                value={weeklyCommitment}
                onChange={(e) => setWeeklyCommitment(parseInt(e.target.value))}
                className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-[#D4AF37]"
              />
            </div>

            {/* Simulated Notification Toggles */}
            <div className="space-y-2 pt-2 border-t border-white/5">
              <span className="text-[10px] uppercase font-bold text-white/40 block tracking-widest">System Alerts</span>
              
              <div className="flex items-center gap-2.5">
                <input
                  id="notif-chk"
                  type="checkbox"
                  checked={notifications}
                  onChange={(e) => setNotifications(e.target.checked)}
                  className="rounded border-white/15 text-[#D4AF37] focus:ring-[#D4AF37] bg-white/5 w-3.5 h-3.5 cursor-pointer"
                />
                <label htmlFor="notif-chk" className="text-xs text-white/70 flex items-center gap-1 cursor-pointer">
                  <BellRing className="w-3.5 h-3.5 text-white/40" /> Daily learning nudge summaries
                </label>
              </div>

              <div className="flex items-center gap-2.5">
                <input
                  id="email-chk"
                  type="checkbox"
                  defaultChecked
                  className="rounded border-white/15 text-[#D4AF37] focus:ring-[#D4AF37] bg-white/5 w-3.5 h-3.5 cursor-pointer"
                />
                <label htmlFor="email-chk" className="text-xs text-white/70 flex items-center gap-1 cursor-pointer">
                  <Mail className="w-3.5 h-3.5 text-white/40" /> Weekly recruiter demand trends
                </label>
              </div>
            </div>

            {/* Submit button */}
            <button
              type="submit"
              className="w-full inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-[#D4AF37] hover:bg-[#C59B27] text-[#0A0A0A] rounded-xl text-xs font-bold transition-all shadow-lg shadow-[#D4AF37]/5 cursor-pointer"
            >
              <Save className="w-3.5 h-3.5" /> Save Preferences
            </button>

            {savedFeedback && (
              <div className="p-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] text-center rounded-lg animate-fade-in font-bold">
                ✓ Preferences updated and re-benchmarked successfully!
              </div>
            )}
          </form>
        </div>
      </div>

      {/* GORGEOUS VIRTUAL CERTIFICATE MODAL */}
      {showCertModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0A0A0A]/80 backdrop-blur-sm p-4 animate-fade-in">
          <div className="w-full max-w-2xl bg-[#0F0F0F] border border-white/15 rounded-3xl shadow-2xl relative overflow-hidden p-8 md:p-12 text-center flex flex-col justify-between space-y-6">
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-[#D4AF37] via-yellow-200 to-[#C59B27]" />
            
            {/* Certificate border frame */}
            <div className="border-4 border-double border-[#D4AF37]/30 p-6 md:p-10 space-y-6 rounded-2xl bg-[#D4AF37]/5 relative">
              <div className="absolute top-2 right-2 opacity-5 text-white">
                <Settings className="w-40 h-40 animate-spin" style={{ animationDuration: "20s" }} />
              </div>

              <div className="flex justify-center mb-2">
                <div className="w-16 h-16 bg-[#D4AF37]/10 text-[#D4AF37] rounded-full flex items-center justify-center border border-[#D4AF37]/30 shadow-md">
                  <Award className="w-8 h-8" />
                </div>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] font-mono tracking-wider font-bold text-[#D4AF37] uppercase">
                  Ascend AI Career Labs
                </span>
                <h3 className="font-serif text-3xl font-bold tracking-tight text-white">
                  Certificate of Career Readiness
                </h3>
                <p className="text-xs text-white/50 italic font-serif">
                  This validates professional readiness in target technical engineering paradigms
                </p>
              </div>

              <div className="py-4 border-y border-white/5 max-w-sm mx-auto font-sans">
                <p className="text-xs text-white/40 uppercase tracking-widest">Granted to</p>
                <h4 className="font-serif text-2xl font-bold text-[#D4AF37] my-1">{userName}</h4>
                <p className="text-xs text-white/60">
                  On compiling custom learning modules, mapping skill gaps, and demonstrating intermediate/expert knowledge for the role of:
                </p>
                <span className="inline-block mt-2 text-xs font-bold px-3 py-1 bg-white/5 text-white/80 rounded-full border border-white/10">
                  {profile.targetRole}
                </span>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 text-left max-w-md mx-auto font-sans">
                <div>
                  <span className="text-[8px] uppercase text-white/40 block font-bold tracking-widest">Readiness Scorecard</span>
                  <span className="text-xs font-bold font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-md mt-0.5 inline-block">
                    {careerReadinessScore}% Career Match
                  </span>
                </div>
                <div className="sm:text-right">
                  <span className="text-[8px] uppercase text-white/40 block font-bold tracking-widest">Authority Sign-off</span>
                  <div className="flex items-center gap-1 text-white font-bold text-xs font-serif mt-0.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" /> Ascend AI Mentor Engine
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/5 font-sans">
              <button
                type="button"
                onClick={() => setShowCertModal(false)}
                className="text-xs font-bold px-4 py-2 border border-white/10 text-white/60 hover:bg-white/5 rounded-xl cursor-pointer"
              >
                Close Certificate
              </button>
              <button
                type="button"
                onClick={() => alert("Certificate downloaded simulated successfully! (PDF formatted 300DPI)")}
                className="inline-flex items-center gap-1 text-xs font-bold px-5 py-2 bg-[#D4AF37] hover:bg-[#C59B27] text-[#0A0A0A] rounded-xl shadow-lg shadow-[#D4AF37]/5 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5 text-[#0A0A0A]" /> Download PDF Certificate
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
