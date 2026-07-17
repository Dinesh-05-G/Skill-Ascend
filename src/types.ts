export interface UserProfile {
  name: string;
  targetRole: string;
  experienceLevel: "beginner" | "intermediate" | "advanced";
  skillsText: string;
  resumeText: string;
  weeklyCommitment: number;
  confidenceLevel: number; // 1-10
  localizationLanguage: string; // "English" | "Spanish" | "French" | etc.
}

export interface SkillItem {
  name: string;
  category: "technical" | "soft" | "tool" | "other";
  isMatch: boolean;
  proficiency?: "Beginner" | "Intermediate" | "Expert";
}

export interface SkillGapItem {
  skill: string;
  importance: "High" | "Medium" | "Low";
  description: string;
  alternativeTerms?: string[];
}

export interface WeeklyModule {
  week: number;
  title: string;
  objective: string;
  topics: string[];
  durationHours: number;
  activities: {
    description: string;
    type: "reading" | "practice" | "project";
  }[];
  resources: {
    title: string;
    url: string;
    type: "course" | "documentation" | "video" | "article";
    isFree: boolean;
  }[];
}

export interface SuggestedProject {
  id: string;
  title: string;
  description: string;
  difficulty: "Easy" | "Medium" | "Hard";
  techStack: string[];
  deliverables: string[];
  instructions: string[];
  challengeBonus: string;
}

export interface InterviewPrepQuestion {
  id: string;
  question: string;
  category: string;
  difficulty: "Easy" | "Medium" | "Hard";
  tips: string;
  sampleAnswer: string;
}

export interface CareerComparison {
  primaryRole: string;
  comparisonRole: string;
  sharedFoundation: string[];
  primaryExclusive: string[];
  comparisonExclusive: string[];
  transitionEase: number; // 1-100
  transitionAdvice: string[];
}

export interface CareerProfileResponse {
  careerReadinessScore: number;
  skillsMatched: SkillItem[];
  missingSkills: SkillGapItem[];
  estLearningHours: number;
  roadmap: WeeklyModule[];
  suggestedProjects: SuggestedProject[];
  interviewQuestions: InterviewPrepQuestion[];
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

export interface MilestoneProgress {
  week: number;
  isCompleted: boolean;
}

export interface UserProgressData {
  streakDays: number;
  completedModulesCount: number;
  completedProjectsCount: number;
  weeklyXp: number;
  weeklyXpGoal: number;
  achievements: {
    id: string;
    title: string;
    description: string;
    icon: string;
    unlockedAt?: string;
  }[];
  milestones: MilestoneProgress[];
}
