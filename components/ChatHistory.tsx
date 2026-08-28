"use client";

import { motion } from "framer-motion";
import { chatSections } from "@/lib/data";

interface ChatHistoryProps {
  visibleCount: number;
  activeIndex: number;
  onSelect: (index: number) => void;
}

export default function ChatHistory({
  visibleCount,
  activeIndex,
  onSelect,
}: ChatHistoryProps) {
  return (
    <aside className="fixed right-0 top-0 z-40 hidden h-screen w-72 flex-col border-l border-black/10 bg-white/80 backdrop-blur-xl lg:flex xl:w-80">
      <div className="border-b border-black/10 px-5 py-4">
        <p className="text-xs uppercase tracking-[0.2em] text-black/40">
          History
        </p>
      </div>

      <div className="flex flex-1 flex-col gap-3 overflow-y-auto px-4 py-6">
        {chatSections.map((section, index) => {
          if (index >= visibleCount) return null;

          const isActive = index === activeIndex;

          return (
            <motion.button
              key={section.id}
              type="button"
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
              onClick={() => onSelect(index)}
              className={`ml-auto max-w-[90%] rounded-2xl rounded-br-sm px-4 py-3 text-left text-sm tracking-wide transition-colors duration-300 ${
                isActive
                  ? "bg-black text-white"
                  : "bg-black/5 text-black/70 hover:bg-black/10"
              }`}
            >
              {section.question}
            </motion.button>
          );
        })}
      </div>
    </aside>
  );
}
