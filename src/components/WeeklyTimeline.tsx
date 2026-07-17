import React, { useState } from "react";
import { WeeklyModule } from "../types";
import { BookOpen, CheckCircle, Circle, PlayCircle, FileText, Compass, ExternalLink, Calendar, Milestone } from "lucide-react";

interface WeeklyTimelineProps {
  roadmap: WeeklyModule[];
  completedWeeks: number[];
  onToggleActivity: (weekNumber: number, activityIdx: number) => void;
  activityProgress: Record<string, boolean>; // key: "week-activityIdx", value: boolean
}

export default function WeeklyTimeline({
  roadmap,
  completedWeeks,
  onToggleActivity,
  activityProgress
}: WeeklyTimelineProps) {
  const [activeWeek, setActiveWeek] = useState<number>(1);

  const selectedModule = roadmap.find((m) => m.week === activeWeek) || roadmap[0];

  const getResourceIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case "video":
        return <PlayCircle className="w-4 h-4 text-rose-500" />;
      case "documentation":
        return <FileText className="w-4 h-4 text-blue-500" />;
      case "course":
        return <BookOpen className="w-4 h-4 text-indigo-500" />;
      default:
        return <FileText className="w-4 h-4 text-slate-500" />;
    }
  };

  return (
    <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-5 shadow-none">
      <div className="flex items-center gap-2 border-b border-white/5 pb-3 mb-5">
        <div className="w-8 h-8 border border-[#D4AF37]/30 bg-[#D4AF37]/10 text-[#D4AF37] rounded-lg flex items-center justify-center">
          <Calendar className="w-5 h-5" />
        </div>
        <div>
          <h3 className="font-serif italic text-base text-white">Your Personalized Study Roadmap</h3>
          <p className="text-[10px] text-white/40">Week-by-week sequence customized to close your skill gaps</p>
        </div>
      </div>

      <div className="grid md:grid-cols-12 gap-6">
        {/* Left Sidebar Week Selector Sprints */}
        <div className="md:col-span-4 flex md:flex-col gap-2 overflow-x-auto md:overflow-x-visible pb-2 md:pb-0 border-b md:border-b-0 md:border-r border-white/5 pr-0 md:pr-4">
          <span className="hidden md:block text-[9px] uppercase font-bold tracking-widest text-white/40 mb-2">
            Weekly Sprints
          </span>
          {roadmap.map((module) => {
            const isActive = activeWeek === module.week;
            const isCompleted = completedWeeks.includes(module.week);

            // Calculate active week progress
            const weekActivities = module.activities || [];
            const completedCount = weekActivities.reduce((acc, _, idx) => {
              const key = `${module.week}-${idx}`;
              return acc + (activityProgress[key] ? 1 : 0);
            }, 0);
            const isFullyCompleted = weekActivities.length > 0 && completedCount === weekActivities.length;

            return (
              <button
                key={module.week}
                type="button"
                onClick={() => setActiveWeek(module.week)}
                className={`flex items-center justify-between gap-3 text-left p-3 rounded-xl transition-all w-full shrink-0 md:shrink border cursor-pointer ${
                  isActive
                    ? "bg-[#D4AF37] border-[#D4AF37] text-[#0A0A0A] font-bold shadow-lg shadow-[#D4AF37]/10"
                    : isFullyCompleted || isCompleted
                    ? "bg-white/5 border-white/10 hover:bg-white/10 text-[#D4AF37]"
                    : "bg-white/[0.01] border-white/5 hover:bg-white/5 text-white/60"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  {isFullyCompleted || isCompleted ? (
                    <CheckCircle className={`w-4 h-4 ${isActive ? "text-[#0A0A0A]" : "text-[#D4AF37]"}`} />
                  ) : (
                    <div
                      className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 ${
                        isActive ? "border-[#0A0A0A]" : "border-white/20"
                      }`}
                    >
                      <div className={`w-1.5 h-1.5 rounded-full ${isActive ? "bg-[#0A0A0A] animate-pulse" : "bg-transparent"}`} />
                    </div>
                  )}
                  <div>
                    <h4 className="text-xs font-bold font-mono">Week {module.week}</h4>
                    <p className={`text-[10px] truncate max-w-[120px] ${isActive ? "text-[#0A0A0A]/80 font-medium" : "text-white/40"}`}>
                      {module.title}
                    </p>
                  </div>
                </div>
                {weekActivities.length > 0 && (
                  <span className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded-md ${
                    isActive ? "bg-[#0A0A0A]/10 text-[#0A0A0A]" : "bg-white/5 text-white/40"
                  }`}>
                    {completedCount}/{weekActivities.length}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Right Detail Pane */}
        {selectedModule && (
          <div className="md:col-span-8 flex flex-col justify-between space-y-5 animate-fade-in">
            {/* Header / Objective */}
            <div className="space-y-2">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-1">
                <span className="text-xs font-mono font-bold text-[#D4AF37] bg-[#D4AF37]/10 border border-[#D4AF37]/20 px-2.5 py-1 rounded-md w-fit">
                  Sprint Objective
                </span>
                <span className="text-xs text-white/40 font-mono flex items-center gap-1">
                  <Milestone className="w-3.5 h-3.5 text-[#D4AF37]" />
                  Estimated Time: {selectedModule.durationHours} Hours
                </span>
              </div>
              <h3 className="font-serif italic text-white text-lg leading-snug">
                {selectedModule.title}
              </h3>
              <p className="text-xs text-white/60 leading-relaxed bg-white/[0.01] p-3 border border-white/5 rounded-xl font-sans">
                {selectedModule.objective}
              </p>
            </div>

            {/* Core Topics Checklist */}
            <div className="space-y-2">
              <h4 className="text-[9px] uppercase font-bold tracking-widest text-white/40">
                Core Topics Cover
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {selectedModule.topics.map((topic, idx) => (
                  <span
                    key={idx}
                    className="text-[10px] font-mono text-white/60 bg-white/5 border border-white/5 px-2.5 py-1 rounded-lg"
                  >
                    #{topic}
                  </span>
                ))}
              </div>
            </div>

            {/* Action Checklist Sprints */}
            <div className="space-y-3">
              <h4 className="text-[9px] uppercase font-bold tracking-widest text-white/40">
                Action Checklist & Sprints
              </h4>
              <div className="space-y-2">
                {selectedModule.activities.map((act, idx) => {
                  const key = `${selectedModule.week}-${idx}`;
                  const isChecked = activityProgress[key] || false;

                  return (
                    <div
                      key={idx}
                      onClick={() => onToggleActivity(selectedModule.week, idx)}
                      className={`flex gap-3 items-start p-2.5 border rounded-xl cursor-pointer transition-all select-none ${
                        isChecked
                          ? "bg-white/[0.01] border-white/5 text-white/40"
                          : "bg-white/[0.02] hover:bg-white/[0.04] border border-white/10 text-white/80"
                      }`}
                    >
                      <button type="button" className="shrink-0 mt-0.5 cursor-pointer">
                        {isChecked ? (
                          <CheckCircle className="w-4 h-4 text-[#D4AF37] fill-[#D4AF37]/10" />
                        ) : (
                          <Circle className="w-4 h-4 text-white/20" />
                        )}
                      </button>
                      <div>
                        <p className={`text-xs font-semibold leading-relaxed ${isChecked ? "line-through text-white/30" : ""}`}>
                          {act.description}
                        </p>
                        <span className="text-[8px] font-mono font-bold uppercase tracking-wider text-white/30 mt-1 block">
                          Type: {act.type}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Curated Resources */}
            <div className="space-y-3 pt-3 border-t border-white/5">
              <h4 className="text-[9px] uppercase font-bold tracking-widest text-white/40 flex items-center gap-1.5">
                <Compass className="w-3.5 h-3.5 text-[#D4AF37]" />
                Curated Study Resources
              </h4>
              <div className="grid sm:grid-cols-2 gap-2">
                {selectedModule.resources.map((res, idx) => (
                  <a
                    key={idx}
                    href={res.url.startsWith("http") ? res.url : `https://${res.url}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-2.5 bg-white/[0.01] border border-white/10 hover:border-[#D4AF37]/30 rounded-xl transition-all group"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="p-1.5 bg-white/5 rounded-lg shrink-0 group-hover:bg-[#D4AF37]/10 transition-colors">
                        {getResourceIcon(res.type)}
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-white truncate group-hover:text-[#D4AF37] transition-colors">
                          {res.title}
                        </p>
                        <span className="text-[9px] font-mono text-white/40 uppercase tracking-wide block">
                          {res.type} • {res.isFree ? "Free" : "Premium"}
                        </span>
                      </div>
                    </div>
                    <ExternalLink className="w-3 h-3 text-white/20 group-hover:text-[#D4AF37] shrink-0 transition-colors" />
                  </a>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
