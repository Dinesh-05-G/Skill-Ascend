import React from "react";
import { Sparkles, ArrowRight, BrainCircuit, ShieldCheck, GraduationCap, Compass, Briefcase } from "lucide-react";

interface LandingPageProps {
  onStartAssessment: () => void;
}

export default function LandingPage({ onStartAssessment }: LandingPageProps) {
  const popularRoles = [
    { title: "AI Engineer", demand: "Critical", salary: "$140k - $190k", skills: "Python, LLMs, PyTorch" },
    { title: "Full-Stack Developer", demand: "High", salary: "$110k - $160k", skills: "React, Node.js, Postgres" },
    { title: "Data Analyst", demand: "Moderate", salary: "$85k - $125k", skills: "SQL, Tableau, Python" },
    { title: "Cloud Architect", demand: "High", salary: "$135k - $185k", skills: "AWS, Kubernetes, Terraform" },
  ];

  return (
    <div className="relative min-h-screen bg-[#0A0A0A] text-[#E5E5E5] font-sans selection:bg-[#D4AF37] selection:text-[#0A0A0A] overflow-hidden">
      {/* Decorative Blur Orbs */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#D4AF37]/10 rounded-full filter blur-3xl opacity-30 animate-pulse" />
      <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-amber-500/5 rounded-full filter blur-3xl opacity-20 animate-pulse delay-75" />

      {/* Navigation */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-[#0A0A0A]/75 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 border border-[#D4AF37]/30 bg-[#D4AF37]/10 rounded-xl text-[#D4AF37]">
              <BrainCircuit className="w-6 h-6" />
            </div>
            <span className="font-serif italic text-2xl tracking-tighter text-[#D4AF37]">
              Ascend AI
            </span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-xs font-mono text-white/40 bg-white/5 border border-white/10 px-2.5 py-1 rounded-full">v1.2 Live</span>
            <button
              onClick={onStartAssessment}
              id="nav-cta-btn"
              className="px-4 py-2 bg-[#D4AF37] hover:bg-[#C59B27] text-[#0A0A0A] rounded-lg text-sm font-medium transition-all shadow-[0_0_10px_rgba(212,175,55,0.2)]"
            >
              Start Free
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="relative max-w-7xl mx-auto px-6 py-12 md:py-24">
        <div className="grid md:grid-cols-12 gap-12 items-center">
          <div className="md:col-span-7 flex flex-col gap-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#D4AF37]/10 border border-[#D4AF37]/30 rounded-full w-fit">
              <Sparkles className="w-4 h-4 text-[#D4AF37]" />
              <span className="text-[10px] font-semibold text-[#D4AF37] uppercase tracking-widest">
                Next-Gen Career Assessment
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-light tracking-tight text-white leading-tight">
              Unlock Your Path. <br />
              <span className="font-serif italic text-[#D4AF37]">
                Bridge the Skill Gap.
              </span>
            </h1>

            <p className="text-lg text-white/60 max-w-xl leading-relaxed">
              Ascend AI is your personalized career co-pilot. We analyze your background, extract hidden proficiencies, map precise technical skill gaps, and generate a step-by-step roadmap to make you job-ready.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mt-2">
              <button
                onClick={onStartAssessment}
                id="hero-cta-btn"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-[#D4AF37] hover:bg-[#C59B27] text-[#0A0A0A] font-semibold rounded-xl shadow-lg shadow-[#D4AF37]/10 hover:shadow-[#D4AF37]/20 transition-all group cursor-pointer"
              >
                Assess Your Career Fit
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <a
                href="#how-it-works"
                className="inline-flex items-center justify-center px-6 py-3.5 bg-white/[0.03] border border-white/10 hover:bg-white/[0.08] text-white font-semibold rounded-xl transition-all"
              >
                How It Works
              </a>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-3 gap-6 pt-8 border-t border-white/10 mt-4">
              <div>
                <p className="text-2xl font-light font-serif text-[#D4AF37]">94%</p>
                <p className="text-[10px] uppercase tracking-wider text-white/40 mt-1">Roadmap Accuracy</p>
              </div>
              <div>
                <p className="text-2xl font-light font-serif text-[#D4AF37]">12k+</p>
                <p className="text-[10px] uppercase tracking-wider text-white/40 mt-1">Careers Guided</p>
              </div>
              <div>
                <p className="text-2xl font-light font-serif text-[#D4AF37]">&lt; 3 Min</p>
                <p className="text-[10px] uppercase tracking-wider text-white/40 mt-1">Assessment Time</p>
              </div>
            </div>
          </div>

          {/* Hero Visual Block */}
          <div className="md:col-span-5 relative">
            <div className="p-6 bg-white/[0.03] border border-white/10 rounded-3xl shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 p-3 bg-[#D4AF37]/10 border-l border-b border-white/10 rounded-bl-3xl text-[#D4AF37]">
                <BrainCircuit className="w-6 h-6 animate-pulse" />
              </div>
              
              <h3 className="font-serif italic text-lg text-white mb-1">Live Pipeline Preview</h3>
              <p className="text-xs text-white/40 mb-6 uppercase tracking-wider">Interactive AI-Agent Career Modeling</p>

              <div className="space-y-4">
                {/* Pipeline Steps */}
                <div className="flex gap-4 items-start p-3 bg-white/[0.05] border border-white/10 rounded-xl">
                  <div className="p-2 bg-[#D4AF37] text-[#0A0A0A] rounded-lg text-xs font-bold shrink-0">01</div>
                  <div>
                    <h4 className="text-xs font-bold text-white">Student Profile Assessment</h4>
                    <p className="text-[11px] text-white/50 mt-0.5">Skills, goals, and commitment analysis</p>
                  </div>
                </div>

                <div className="flex gap-4 items-start p-3 bg-white/[0.02] border border-white/5 rounded-xl">
                  <div className="p-2 bg-white/10 text-white/75 rounded-lg text-xs font-bold shrink-0">02</div>
                  <div>
                    <h4 className="text-xs font-bold text-white/70">Skill-Gap Detection</h4>
                    <p className="text-[11px] text-white/40 mt-0.5">Automated mapping against current tech benchmarks</p>
                  </div>
                </div>

                <div className="flex gap-4 items-start p-3 bg-white/[0.02] border border-white/5 rounded-xl">
                  <div className="p-2 bg-white/10 text-white/75 rounded-lg text-xs font-bold shrink-0">03</div>
                  <div>
                    <h4 className="text-xs font-bold text-white/70">Sequence Roadmap Planning</h4>
                    <p className="text-[11px] text-white/40 mt-0.5">Construct logical, localized week-by-week sprints</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Popular Targets Section */}
        <div className="mt-20 py-12 border-t border-white/10">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-2xl md:text-3xl font-serif italic text-white">Explore High-Demand Career Paths</h2>
            <p className="text-sm text-white/50 mt-2">
              Ascend AI leverages Google Gemini to benchmark your profile against premium industry specifications.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {popularRoles.map((role, idx) => (
              <div
                key={idx}
                className="p-5 bg-white/[0.02] border border-white/10 rounded-2xl hover:border-[#D4AF37]/50 transition-all shadow-sm hover:shadow-md group flex flex-col justify-between hover:bg-white/[0.04]"
              >
                <div>
                  <div className="flex justify-between items-start mb-3">
                    <span className="text-[9px] font-mono px-2 py-0.5 bg-white/5 border border-white/10 text-[#D4AF37] rounded-md uppercase tracking-wider font-semibold">
                      {role.demand} Demand
                    </span>
                    <span className="text-xs font-semibold text-[#D4AF37] font-serif italic">{role.salary}</span>
                  </div>
                  <h3 className="font-serif italic text-white text-base mb-1 group-hover:text-[#D4AF37] transition-colors">
                    {role.title}
                  </h3>
                  <p className="text-xs text-white/50 line-clamp-2 italic font-serif">
                    Benchmark Skills: {role.skills}
                  </p>
                </div>
                <button
                  onClick={onStartAssessment}
                  className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-[#D4AF37] hover:text-[#C59B27] transition-colors self-start uppercase tracking-widest"
                >
                  Analyze Fit <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Detailed How-It-Works section */}
        <section id="how-it-works" className="mt-24 bg-[#0D0D0D] border border-white/10 text-white rounded-3xl p-8 md:p-12 relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(212,175,55,0.05),transparent_50%)]" />
          <div className="relative max-w-3xl">
            <span className="text-[10px] uppercase tracking-widest font-mono text-[#D4AF37] font-semibold">Our Scientific Framework</span>
            <h2 className="text-2xl sm:text-3xl font-serif italic mt-2 mb-6 text-white">How Ascend AI Builds Your Roadmap</h2>
            
            <div className="grid gap-6 md:grid-cols-3">
              <div className="flex flex-col gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-[#D4AF37]/10 border border-[#D4AF37]/30 flex items-center justify-center text-[#D4AF37]">
                  <Compass className="w-5 h-5" />
                </div>
                <h3 className="font-serif text-white text-base">1. Profile Extraction</h3>
                <p className="text-xs text-white/50 leading-relaxed italic font-serif">
                  We parse your unique background, project history, confidence, and preferred language using Gemini's semantic understanding.
                </p>
              </div>

              <div className="flex flex-col gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-[#D4AF37]/10 border border-[#D4AF37]/30 flex items-center justify-center text-[#D4AF37]">
                  <Briefcase className="w-5 h-5" />
                </div>
                <h3 className="font-serif text-white text-base">2. Real-Time Gap Mapping</h3>
                <p className="text-xs text-white/50 leading-relaxed italic font-serif">
                  We map your skills against raw, live career benchmarks. We spotlight crucial missing soft & hard skills.
                </p>
              </div>

              <div className="flex flex-col gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-[#D4AF37]/10 border border-[#D4AF37]/30 flex items-center justify-center text-[#D4AF37]">
                  <GraduationCap className="w-5 h-5" />
                </div>
                <h3 className="font-serif text-white text-base">3. Dynamic Localization</h3>
                <p className="text-xs text-white/50 leading-relaxed italic font-serif">
                  Get custom weekly courses, activities, resource hyperlinks, dynamic project challenges, and interview simulations in your selected language.
                </p>
              </div>
            </div>

            <button
              onClick={onStartAssessment}
              className="mt-8 px-6 py-3 bg-[#D4AF37] hover:bg-[#C59B27] text-[#0A0A0A] font-bold rounded-xl text-sm transition-all shadow-md inline-flex items-center gap-2 cursor-pointer"
            >
              Analyze My Profile Now
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/10 bg-[#070707] py-12 mt-20">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <BrainCircuit className="w-5 h-5 text-[#D4AF37]" />
            <span className="font-serif italic text-lg text-white">Ascend AI Career Labs</span>
          </div>
          <p className="text-[10px] text-white/40 uppercase tracking-wider">
            © 2026 Ascend AI. Powered securely by Google Gemini 3.5. Strictly client-private.
          </p>
        </div>
      </footer>
    </div>
  );
}
