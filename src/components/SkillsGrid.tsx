import React from "react";
import { SkillItem, SkillGapItem } from "../types";
import { CheckCircle2, AlertTriangle, Star, ShieldAlert } from "lucide-react";

interface SkillsGridProps {
  skillsMatched: SkillItem[];
  missingSkills: SkillGapItem[];
  onSkillClick?: (skillName: string) => void;
}

export default function SkillsGrid({ skillsMatched, missingSkills, onSkillClick }: SkillsGridProps) {
  return (
    <div className="grid md:grid-cols-2 gap-6">
      {/* Matched Skills Card */}
      <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-5">
        <div className="flex items-center justify-between border-b border-white/5 pb-3 mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg border border-[#D4AF37]/30 bg-[#D4AF37]/10 text-[#D4AF37] flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif italic text-sm text-white">Competencies Matched</h3>
              <p className="text-[10px] text-white/40">Validated from your experience and resume</p>
            </div>
          </div>
          <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 rounded-full">
            {skillsMatched.length} Verified
          </span>
        </div>

        {skillsMatched.length === 0 ? (
          <p className="text-xs text-white/40 italic py-4 text-center font-serif">No matching skills identified yet. Let's start learning!</p>
        ) : (
          <div className="grid sm:grid-cols-2 gap-2 max-h-72 overflow-y-auto pr-1">
            {skillsMatched.map((skill, idx) => (
              <div
                key={idx}
                onClick={() => onSkillClick?.(skill.name)}
                className="flex items-center justify-between p-2.5 bg-white/[0.01] hover:bg-[#D4AF37]/5 border border-white/5 hover:border-[#D4AF37]/20 rounded-xl transition-all cursor-pointer group"
              >
                <div className="flex items-center gap-2">
                  <Star className="w-3.5 h-3.5 text-[#D4AF37] fill-[#D4AF37]/20" />
                  <span className="text-xs font-semibold text-white truncate max-w-[120px] group-hover:text-[#D4AF37] transition-colors">
                    {skill.name}
                  </span>
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-[8px] uppercase font-bold text-white/40 tracking-wider">
                    {skill.category}
                  </span>
                  {skill.proficiency && (
                    <span className="text-[8px] font-mono font-medium text-[#D4AF37]">
                      {skill.proficiency}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Missing Skills Card */}
      <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-5">
        <div className="flex items-center justify-between border-b border-white/5 pb-3 mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-rose-500/10 text-rose-400 border border-rose-500/20 flex items-center justify-center">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif italic text-sm text-white">Identified Skill Gaps</h3>
              <p className="text-[10px] text-white/40">Target benchmarks you need to develop</p>
            </div>
          </div>
          <span className="text-xs font-mono font-bold text-rose-400 bg-rose-500/10 border border-rose-500/20 px-2.5 py-0.5 rounded-full">
            {missingSkills.length} Required
          </span>
        </div>

        {missingSkills.length === 0 ? (
          <p className="text-xs text-white/40 italic py-4 text-center font-serif">Outstanding! Your profile perfectly aligns with this role.</p>
        ) : (
          <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
            {missingSkills.map((gap, idx) => (
              <div
                key={idx}
                onClick={() => onSkillClick?.(gap.skill)}
                className="p-3 bg-white/[0.01] hover:bg-white/[0.03] border border-white/5 hover:border-white/15 rounded-xl transition-all cursor-pointer flex gap-3"
              >
                <div className="p-1 bg-rose-500/10 text-rose-400 border border-rose-500/20 rounded-lg h-fit">
                  <AlertTriangle className="w-4 h-4" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="text-xs font-bold text-white">{gap.skill}</h4>
                    <span
                      className={`text-[8px] uppercase font-bold px-1.5 py-0.5 rounded-full border ${
                        gap.importance === "High"
                          ? "bg-rose-500/10 text-rose-400 border-rose-500/20"
                          : gap.importance === "Medium"
                          ? "bg-amber-500/10 text-amber-400 border-amber-500/20"
                          : "bg-white/5 text-white/40 border-white/10"
                      }`}
                    >
                      {gap.importance} Priority
                    </span>
                  </div>
                  <p className="text-[10px] text-white/50 leading-relaxed font-sans">{gap.description}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
