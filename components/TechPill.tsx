import {
  SiPython,
  SiSwift,
  SiSupabase,
  SiRedis,
  SiJavascript,
  SiHtml5,
  SiCss,
  SiGoogle,
} from "react-icons/si";
import {
  TbDatabase,
  TbBrain,
  TbPlug,
  TbServer,
  TbWorld,
  TbSparkles,
} from "react-icons/tb";
import { type IconType } from "react-icons";

const techIconMap: Record<string, IconType> = {
  Python: SiPython,
  Swift: SiSwift,
  "Gemini API": SiGoogle,
  "Gemini Multimodal API": SiGoogle,
  Supabase: SiSupabase,
  Render: TbServer,
  SQLite: TbDatabase,
  FastEmbed: TbBrain,
  MCP: TbPlug,
  Redis: SiRedis,
  Browserbase: TbWorld,
  JavaScript: SiJavascript,
  HTML: SiHtml5,
  CSS: SiCss,
  "OpenAI API": TbSparkles,
};

interface TechPillProps {
  name: string;
}

export default function TechPill({ name }: TechPillProps) {
  const Icon = techIconMap[name];

  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-white/15 px-3 py-1 text-xs text-white/60 transition-colors duration-300 hover:border-white/30 hover:text-white/80">
      {Icon && <Icon className="h-3 w-3" />}
      {name}
    </span>
  );
}
