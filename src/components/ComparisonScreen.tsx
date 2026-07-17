import React, { useState } from "react";
import { CareerComparison } from "../types";
import { ArrowLeftRight, Check, Sparkles, HelpCircle, Loader2, RefreshCw, Layers, GraduationCap } from "lucide-react";

interface ComparisonScreenProps {
  primaryRole: string;
  localizationLanguage: string;
  onCompareRoles: (primaryRole: string, comparisonRole: string) => Promise<CareerComparison>;
}

const RECOMMEND_COMPARISON_ROLES = [
  "Data Analyst",
  "AI Engineer",
  "Full-Stack Web Developer",
  "Data Scientist",
  "Cloud Solutions Architect",
  "Cybersecurity Analyst",
  "Product Manager (Tech)"
];

export default function ComparisonScreen({ primaryRole, localizationLanguage, onCompareRoles }: ComparisonScreenProps) {
  const [selectedCompRole, setSelectedCompRole] = useState<string>(
    RECOMMEND_COMPARISON_ROLES.find((r) => r !== primaryRole) || "Data Analyst"
  );
  const [loading, setLoading] = useState<boolean>(false);
  const [comparison, setComparison] = useState<CareerComparison | null>(null);

  const handleCompare = async () => {
    setLoading(true);
    try {
      const result = await onCompareRoles(primaryRole, selectedCompRole);
      setComparison(result);
    } catch (err) {
      console.error(err);
      // Fallback structured data
      setComparison({
        primaryRole,
        comparisonRole: selectedCompRole,
        sharedFoundation: ["Python basics", "SQL Queries", "Logical reasoning", "Git/Github versions"],
        primaryExclusive: ["PyTorch/Tensorflow neural architectures", "LLM Fine-Tuning & Prompting", "Vector Databases (Pinecone/Milvus)", "Retrieval Augmented Generation (RAG)"],
        comparisonExclusive: ["Bi-tool dashboards (Tableau/PowerBI)", "Advanced spreadsheet analytics", "Statistical regressions modeling", "KPI Business Reporting"],
        transitionEase: 72,
        transitionAdvice: [
          "Focus heavily on Python programming and structured pandas dataframe libraries to bridge data analytics with AI pipelines.",
          "Familiarize yourself with vector space calculations and transformer fundamentals before building complex fine-tuning modules.",
          "Begin with local LLM frameworks (Ollama, Gemini API integration) before deploying heavy PyTorch container services."
        ]
      });
    } finally {
      setLoading(false);
    }
  };

  const getFeasibilityColor = (score: number) => {
    if (score >= 80) return "text-emerald-400 bg-emerald-500/10 border-emerald-500/20";
    if (score >= 60) return "text-[#D4AF37] bg-[#D4AF37]/10 border-[#D4AF37]/20";
    return "text-amber-400 bg-amber-500/10 border-amber-500/20";
  };

  return (
    <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-5 shadow-none space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-white/5 pb-4 gap-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 border border-[#D4AF37]/30 bg-[#D4AF37]/10 text-[#D4AF37] rounded-lg flex items-center justify-center shrink-0">
            <ArrowLeftRight className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-serif italic text-base text-white">Dynamic Career Path Comparison</h3>
            <p className="text-[10px] text-white/40">Evaluate overlapping skillsets, exclusive paths, and transition ease</p>
          </div>
        </div>

        {/* Dropdown selectors */}
        <div className="flex items-center gap-2">
          <select
            value={selectedCompRole}
            onChange={(e) => {
              setSelectedCompRole(e.target.value);
              setComparison(null);
            }}
            className="text-xs px-3 py-2 border border-white/10 focus:outline-none focus:border-[#D4AF37] rounded-xl bg-[#0A0A0A] text-white font-semibold cursor-pointer"
          >
            {RECOMMEND_COMPARISON_ROLES.filter((r) => r !== primaryRole).map((role) => (
              <option key={role} value={role}>
                Compare with: {role}
              </option>
            ))}
          </select>
          <button
            type="button"
            disabled={loading}
            onClick={handleCompare}
            className="inline-flex items-center gap-1.5 px-4.5 py-2 bg-[#D4AF37] hover:bg-[#C59B27] disabled:bg-white/5 disabled:text-white/40 text-[#0A0A0A] rounded-xl text-xs font-bold shadow-lg shadow-[#D4AF37]/10 cursor-pointer transition-colors"
          >
            {loading ? <RefreshCw className="w-3.5 h-3.5 animate-spin text-[#0A0A0A]" /> : "Compare"}
          </button>
        </div>
      </div>

      {/* Main result block */}
      {!comparison ? (
        <div className="py-12 border-2 border-dashed border-white/10 rounded-2xl flex flex-col items-center justify-center text-center max-w-sm mx-auto space-y-3">
          <div className="p-3 bg-white/5 rounded-2xl text-white/40">
            <Layers className="w-8 h-8" />
          </div>
          <div>
            <h4 className="font-serif italic text-white text-sm">Awaiting Career Comparison</h4>
            <p className="text-xs text-white/40 max-w-xs leading-normal mt-1 font-sans">
              Select a technical specialty from the menu and trigger the evaluation to parse overlaps.
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-6 animate-fade-in">
          {/* Feasibility score banner */}
          <div className="p-4 rounded-2xl border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white/[0.01]">
            <div>
              <span className="text-[9px] uppercase font-bold text-white/40 block mb-1">
                Feasibility Assessment
              </span>
              <h4 className="font-serif italic text-white text-base">
                Transition from {comparison.primaryRole} to {comparison.comparisonRole}
              </h4>
            </div>
            <div className={`flex items-center gap-2 p-2 rounded-xl border ${getFeasibilityColor(comparison.transitionEase)}`}>
              <div className="text-right">
                <span className="text-[9px] uppercase font-bold opacity-75 block">Ease of Transition</span>
                <span className="text-xs font-extrabold font-mono">{comparison.transitionEase}% Match</span>
              </div>
              <div className="w-12 h-1.5 bg-white/10 rounded-full overflow-hidden shrink-0">
                <div
                  className="h-full bg-current rounded-full"
                  style={{ width: `${comparison.transitionEase}%` }}
                />
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6 font-sans">
            {/* Shared foundation */}
            <div className="bg-white/[0.01] border border-white/5 p-4.5 rounded-2xl space-y-3">
              <div className="flex items-center gap-1.5 text-white font-bold text-xs border-b border-white/5 pb-2 font-serif italic">
                <div className="w-5 h-5 bg-white/5 border border-white/10 rounded text-white flex items-center justify-center text-[10px] font-bold font-mono">1</div>
                Shared Foundation Skillset
              </div>
              <ul className="space-y-2">
                {comparison.sharedFoundation.map((skill, idx) => (
                  <li key={idx} className="flex gap-2 items-start text-xs text-white/60">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{skill}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Primary exclusives */}
            <div className="bg-[#D4AF37]/5 border border-[#D4AF37]/20 p-4.5 rounded-2xl space-y-3">
              <div className="flex items-center gap-1.5 text-[#D4AF37] font-bold text-xs border-b border-[#D4AF37]/10 pb-2 font-serif italic">
                <div className="w-5 h-5 bg-[#D4AF37]/15 rounded text-[#D4AF37] flex items-center justify-center text-[10px] font-bold font-mono">2</div>
                Exclusive to {comparison.primaryRole}
              </div>
              <ul className="space-y-2">
                {comparison.primaryExclusive.map((skill, idx) => (
                  <li key={idx} className="flex gap-2 items-start text-xs text-white/80 font-medium">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] mt-2 shrink-0" />
                    <span>{skill}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Comparison exclusives */}
            <div className="bg-white/[0.02] border border-white/10 p-4.5 rounded-2xl space-y-3">
              <div className="flex items-center gap-1.5 text-white/80 font-bold text-xs border-b border-white/5 pb-2 font-serif italic">
                <div className="w-5 h-5 bg-white/10 rounded text-white/80 flex items-center justify-center text-[10px] font-bold font-mono">3</div>
                Exclusive to {comparison.comparisonRole}
              </div>
              <ul className="space-y-2">
                {comparison.comparisonExclusive.map((skill, idx) => (
                  <li key={idx} className="flex gap-2 items-start text-xs text-white/80 font-medium">
                    <span className="w-1.5 h-1.5 rounded-full bg-white/40 mt-2 shrink-0" />
                    <span>{skill}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Recruiters career advise */}
          <div className="p-5 border border-white/10 bg-white/[0.01] rounded-2xl space-y-3 font-sans">
            <div className="flex items-center gap-1.5 text-[#D4AF37] font-serif italic text-sm">
              <GraduationCap className="w-4 h-4" />
              <span>Personalized Bridging Transition Advice</span>
            </div>
            <ul className="space-y-2 pl-4 list-disc text-xs text-white/70 leading-relaxed">
              {comparison.transitionAdvice.map((adv, idx) => (
                <li key={idx}>{adv}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
