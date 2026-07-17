import React, { useState, useEffect } from "react";
import { BrainCircuit, Loader2, Sparkles, CheckCircle2, Circle } from "lucide-react";

interface ProcessingLoaderProps {
  localizationLanguage: string;
}

const STEPS_BY_LANG: Record<string, string[]> = {
  English: [
    "Extracting skills & background attributes...",
    "Benchmarking profile against target industry specifications...",
    "Detecting knowledge gaps & role requirements differences...",
    "Structuring week-by-week localized roadmap sequence...",
    "Drafting practical suggested portfolio challenges...",
    "Compiling tailored mock interview preparation banks..."
  ],
  Spanish: [
    "Extrayendo habilidades y atributos del perfil...",
    "Comparando el perfil con especificaciones de la industria...",
    "Detectando brechas de conocimiento y requisitos del rol...",
    "Estructurando la secuencia de la hoja de ruta semanal...",
    "Redactando desafíos prácticos de portafolio sugeridos...",
    "Compilando bancos de preparación para entrevistas simuladas..."
  ],
  French: [
    "Extraction des compétences et attributs du profil...",
    "Analyse comparative du profil par rapport aux spécifications du secteur...",
    "Détection des lacunes de connaissances et exigences du rôle...",
    "Estructuration de la feuille de route hebdomadaire...",
    "Rédaction de défis pratiques de portfolio suggérés...",
    "Compilation de banques de préparation d'entretiens personnalisés..."
  ],
  German: [
    "Extrahieren von Fähigkeiten und Hintergrundattributen...",
    "Benchmarking des Profils mit Branchenspezifikationen...",
    "Erkennung von Wissenslücken und Rollenanforderungen...",
    "Strukturierung der wöchentlichen Roadmap-Sequenz...",
    "Entwurf praktischer Portfolio-Herausforderungen...",
    "Zusammenstellung maßgeschneiderter Interview-Vorbereitungen..."
  ]
};

export default function ProcessingLoader({ localizationLanguage }: ProcessingLoaderProps) {
  const [progress, setProgress] = useState<number>(0);
  const [activeStepIdx, setActiveStepIdx] = useState<number>(0);

  const steps = STEPS_BY_LANG[localizationLanguage] || STEPS_BY_LANG["English"];

  useEffect(() => {
    // Increment progress percentage smoothly
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 98) {
          clearInterval(progressInterval);
          return 98;
        }
        return prev + 1;
      });
    }, 90);

    // Increment active step periodically
    const stepInterval = setInterval(() => {
      setActiveStepIdx((prev) => {
        if (prev >= steps.length - 1) {
          clearInterval(stepInterval);
          return steps.length - 1;
        }
        return prev + 1;
      });
    }, 1500);

    return () => {
      clearInterval(progressInterval);
      clearInterval(stepInterval);
    };
  }, [steps]);

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-[#E5E5E5] flex flex-col justify-between font-sans relative overflow-hidden">
      {/* Decorative gradient glowing spheres */}
      <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-[#D4AF37]/5 rounded-full filter blur-3xl animate-pulse" />
      <div className="absolute bottom-1/4 right-1/3 w-96 h-96 bg-amber-500/5 rounded-full filter blur-3xl animate-pulse delay-500" />

      {/* Mini Top Space */}
      <div className="h-16" />

      {/* Core Center Loader Display */}
      <main className="max-w-xl mx-auto px-6 flex flex-col items-center justify-center relative z-10 text-center">
        {/* Glowing Logo ring */}
        <div className="relative mb-8">
          <div className="absolute inset-0 bg-[#D4AF37] rounded-full filter blur-xl opacity-20 animate-ping duration-1000" />
          <div className="relative w-20 h-20 bg-[#0A0A0A] border border-[#D4AF37]/40 rounded-2xl flex items-center justify-center text-[#D4AF37] shadow-2xl">
            <BrainCircuit className="w-10 h-10 animate-spin" style={{ animationDuration: "3s" }} />
          </div>
        </div>

        <div className="space-y-2 mb-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-[#D4AF37] rounded-full text-[10px] font-semibold uppercase tracking-widest">
            <Sparkles className="w-3.5 h-3.5" />
            AI Pipeline Sizing
          </div>
          <h2 className="text-2xl sm:text-3xl font-serif italic text-white leading-normal">
            Processing Your Future
          </h2>
          <p className="text-xs text-white/50 max-w-sm mx-auto italic font-serif">
            Our career agents are drafting your curriculum. Please wait while the model compiles.
          </p>
        </div>

        {/* Digital Counter */}
        <div className="text-5xl font-mono font-light text-[#D4AF37] my-4 tracking-tighter">
          {progress}%
        </div>

        {/* Horizontal load bar */}
        <div className="w-full h-[2px] bg-white/10 rounded-full overflow-hidden mb-8">
          <div
            className="h-full bg-[#D4AF37] transition-all duration-300 rounded-full"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Action checklist status lines */}
        <div className="w-full text-left space-y-3 bg-white/[0.02] border border-white/10 rounded-2xl p-5 backdrop-blur-sm">
          <span className="text-[10px] uppercase font-mono font-bold tracking-widest text-white/40 block mb-2">
            Active Construction Steps
          </span>
          {steps.map((stepDesc, idx) => {
            const isCompleted = idx < activeStepIdx;
            const isActive = idx === activeStepIdx;

            return (
              <div
                key={idx}
                className={`flex gap-3 items-start transition-all duration-300 ${
                  isActive ? "text-[#D4AF37]" : isCompleted ? "text-white/60" : "text-white/25"
                }`}
              >
                {isCompleted ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                ) : isActive ? (
                  <Loader2 className="w-4 h-4 text-[#D4AF37] animate-spin shrink-0 mt-0.5" />
                ) : (
                  <Circle className="w-4 h-4 text-white/10 shrink-0 mt-0.5" />
                )}
                <span className="text-xs font-medium leading-tight">{stepDesc}</span>
              </div>
            );
          })}
        </div>
      </main>

      {/* Mini Bottom Copyright */}
      <footer className="py-6 text-center text-[10px] font-mono text-white/30 uppercase tracking-widest">
        Google Gemini 3.5 Active Agent Execution Pipeline
      </footer>
    </div>
  );
}
