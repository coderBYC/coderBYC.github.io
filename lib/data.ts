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
  introText?: string;
  navLabel: string;
}

export const chatSections: ChatSectionConfig[] = [
  { id: "about", question: "Who are you?", navLabel: "About" },
  {
    id: "education",
    question: "Where did you study?",
    navLabel: "Education",
  },
  {
    id: "projects",
    question: "What projects have you built?",
    introText: "These are my past projects, spanning from agents to design:",
    navLabel: "Projects",
  },
  {
    id: "contact",
    question: "How can I contact you?",
    introText: "Here is my contact information:",
    navLabel: "Contact",
  },
  {
    id: "weather",
    question: "What's the weather?",
    navLabel: "Weather",
  },
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
  youtubeId?: string;
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
    githubUrl: "https://github.com/prithsk/SnapCycle",
    date: "2026. June",
    description:
      "Zero waste app that recycles your waste for you. I built the entire backend and Gemini API, and connected a Browserbase research agent with a Redis vector database. Won Berkeley AI Hackathon 2026 Social Impact Track.",
    youtubeId: "Z8rMbCB_Mno",
    tech: ["Python", "Redis", "Browserbase", "Gemini Multimodal API"],
    icon: "/projects/snapcycle.png",
  },
  {
    id: "crumbo",
    title: "Let Him Cook",
    url: "https://apps.apple.com/us/app/let-him-cook-recipe-saver/id6760598097",
    date: "2026. March —",
    description:
      "iOS app that turns cooking reels into beautiful recipes. Currently generating XXX per month.",
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
    description:
      "I built a web app that turns PDF textbooks, slides, or worksheets into multiple-choice exercise questions. Though it's a GPT wrapper, it's my first software project.",
    tech: ["JavaScript", "Python", "OpenAI API"],
    icon: "/projects/ai-quiz-generator.png",
  },
];

export interface Artwork {
  id: string;
  title: string;
  src: string;
}

export const artworks: Artwork[] = [
  {
    id: "artwork-01",
    title: "Untitled 1",
    src: "/art/artwork-01.jpg",
  },
  {
    id: "artwork-02",
    title: "Untitled 2",
    src: "/art/artwork-02.jpg",
  },
  {
    id: "artwork-03",
    title: "Untitled 3",
    src: "/art/artwork-03.jpg",
  },
  {
    id: "artwork-04",
    title: "Untitled 4",
    src: "/art/artwork-04.jpg",
  },
  {
    id: "artwork-05",
    title: "Untitled 5",
    src: "/art/artwork-05.jpg",
  },
  {
    id: "artwork-06",
    title: "Untitled 6",
    src: "/art/artwork-06.jpg",
  },
  {
    id: "artwork-07",
    title: "Untitled 7",
    src: "/art/artwork-07.jpg",
  },
  {
    id: "artwork-08",
    title: "Untitled 8",
    src: "/art/artwork-08.jpg",
  },
  {
    id: "artwork-09",
    title: "Untitled 9",
    src: "/art/artwork-09.jpg",
  },
  {
    id: "artwork-10",
    title: "Untitled 10",
    src: "/art/artwork-10.jpg",
  },
  {
    id: "artwork-11",
    title: "Untitled 11",
    src: "/art/artwork-11.jpg",
  },
  {
    id: "artwork-12",
    title: "Untitled 12",
    src: "/art/artwork-12.jpg",
  },
];

export const contactLinks = [
  { label: "X", href: "https://x.com/byc9487" },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/bryan-chen-69b631302/",
  },
  { label: "GitHub", href: "https://github.com/coderBYC" },
  { label: "Gmail", href: "mailto:bryanchen@umich.edu" },
];

export const SITE_NAME = "Bryan Chen";
