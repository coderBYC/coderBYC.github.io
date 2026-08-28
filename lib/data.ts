export type SectionPhase =
  | "idle"
  | "typing"
  | "sent"
  | "thinking"
  | "visible";

export interface ConversationSection {
  id: string;
  question: string;
  phase: SectionPhase;
  isTyping: boolean;
  isVisible: boolean;
}

export interface ChatSectionConfig {
  id: string;
  question: string;
}

export const chatSections: ChatSectionConfig[] = [
  { id: "intro", question: "Who is Bryan Chen?" },
  { id: "projects", question: "What projects have they built?" },
  { id: "skills", question: "What are their technical skills?" },
  { id: "contact", question: "How can I contact them?" },
];

export interface Project {
  id: string;
  title: string;
  url?: string;
  githubUrl?: string;
  date: string;
  description: string;
  tech: string[];
  icon: string;
}

export const projects: Project[] = [
  {
    id: "cortex-memory",
    title: "Cortex Memory",
    url: "https://github.com/coderBYC/Cortex-AI",
    githubUrl: "https://github.com/coderBYC/Cortex-AI",
    date: "2026. July —",
    description:
      "Solving agentic memory efficiency now. Building a local memory MCP for all agents, and a desktop app for users in the future.",
    tech: ["Python", "SQLite", "FastEmbed", "MCP"],
    icon: "/projects/cortex-memory.png",
  },
  {
    id: "snapcycle",
    title: "SnapCycle",
    url: "https://devpost.com/software/rrr-s98zwc",
    date: "2026. June",
    description:
      "Zero waste app that recycles your waste for you. Won Berkeley AI Hackathon 2026 Social Impact Track.",
    tech: ["Python", "Redis", "Browserbase", "Gemini Multimodal API"],
    icon: "/projects/snapcycle.png",
  },
  {
    id: "crumbo",
    title: "Crumbo (Formally Let Him Cook)",
    url: "https://apps.apple.com/us/app/let-him-cook-recipe-saver/id6760598097",
    date: "2026. March —",
    description:
      "iOS app that turns cooking reels into beautiful recipes. Formally Let Him Cook. Currently generating XXX per month.",
    tech: ["Swift", "Python", "Gemini API", "Supabase", "Render"],
    icon: "/projects/crumbo.png",
  },
  {
    id: "floatnote",
    title: "FloatNote",
    url: "https://chromewebstore.google.com/detail/floatnote-take-notes-ever/jkgdmffoghgihacnahgmbhoonabcifgm",
    date: "2025. Dec — 2026. March",
    description:
      "Chrome extension for note taking. Highlight text and attach sticky notes directly on web pages.",
    tech: ["JavaScript", "HTML", "CSS"],
    icon: "/projects/floatnote.png",
  },
  {
    id: "ai-quiz-generator",
    title: "AI Quiz Generator",
    url: "https://www.producthunt.com/products/ai-quiz-generator-3?launch=ai-quiz-generator-3",
    date: "2025. June — 2025. Sep",
    description: "Turn textbook into quizzes. My first project.",
    tech: ["JavaScript", "Python", "OpenAI API"],
    icon: "/projects/ai-quiz-generator.png",
  },
];

export const skills = [
  "Python",
  "Swift",
  "JavaScript",
  "TypeScript",
  "SQLite",
  "Redis",
  "Supabase",
  "FastEmbed",
  "MCP",
  "Gemini API",
  "OpenAI API",
  "Browserbase",
  "HTML",
  "CSS",
  "Render",
];

export const contactLinks = [
  { label: "GitHub", href: "https://github.com/coderBYC" },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/bryan-chen-69b631302/",
  },
  { label: "Email", href: "mailto:bryanchen@umich.edu" },
];

export const SITE_NAME = "Bryan Chen";
