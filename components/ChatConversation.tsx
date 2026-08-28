"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUp, Bot } from "lucide-react";
import ProjectsSection from "@/components/ProjectsSection";
import ContactSection from "@/components/ContactSection";
import { IntroResponse, SkillsResponse } from "@/components/chat/ChatResponses";
import {
  chatSections,
  SITE_NAME,
  type SectionPhase,
} from "@/lib/data";

const THINK_MS = 1000;
const SEND_MS = 300;
const MS_PER_CHAR = 42;

interface SectionState {
  id: string;
  question: string;
  phase: SectionPhase;
  typedText: string;
  isTyping: boolean;
  isVisible: boolean;
}

function createInitialSections(): SectionState[] {
  return chatSections.map((section) => ({
    id: section.id,
    question: section.question,
    phase: "idle",
    typedText: "",
    isTyping: false,
    isVisible: false,
  }));
}

function ThinkingDots() {
  return (
    <div className="flex items-center gap-1.5 py-2">
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="h-2 w-2 rounded-full bg-black/35"
          animate={{ opacity: [0.25, 1, 0.25], y: [0, -4, 0] }}
          transition={{
            duration: 0.85,
            repeat: Infinity,
            delay: i * 0.14,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}

function AiAvatar() {
  return (
    <div className="flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-full border border-black/10 bg-black/5">
      <Bot className="h-4 w-4 text-black/60" strokeWidth={1.75} />
    </div>
  );
}

function UserBubble({ text }: { text: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 6 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.28, ease: [0.25, 0.1, 0.25, 1] }}
      className="ml-auto w-fit max-w-[90%] rounded-3xl bg-zinc-800 px-4 py-2.5 text-sm text-white"
    >
      {text}
    </motion.div>
  );
}

function ChatInputBar({
  value,
  onSend,
}: {
  value: string;
  onSend?: () => void;
}) {
  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-50 border-t border-black/10 bg-white/90 px-4 py-4 backdrop-blur-xl md:px-6">
      <div className="mx-auto flex max-w-3xl items-end gap-3 rounded-3xl border border-black/15 bg-white px-4 py-3 shadow-lg">
        <div className="min-h-[24px] flex-1 text-sm text-black/85">
          {value}
          <motion.span
            className="ml-0.5 inline-block h-4 w-0.5 translate-y-0.5 bg-black/70"
            animate={{ opacity: [1, 0] }}
            transition={{ duration: 0.55, repeat: Infinity }}
          />
        </div>
        <button
          type="button"
          aria-label="Send"
          onClick={onSend}
          className="pointer-events-auto flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-zinc-800 text-white transition-opacity hover:opacity-90"
        >
          <ArrowUp className="h-4 w-4" strokeWidth={2} />
        </button>
      </div>
    </div>
  );
}

function ResponseContent({ sectionId }: { sectionId: string }) {
  const content: Record<string, ReactNode> = {
    intro: <IntroResponse />,
    projects: <ProjectsSection />,
    skills: <SkillsResponse />,
    contact: <ContactSection />,
  };

  return (
    <div className="prose prose-neutral max-w-none prose-p:text-black/70 prose-headings:font-bold prose-headings:tracking-wide prose-headings:text-black">
      {content[sectionId]}
    </div>
  );
}

export default function ChatConversation() {
  const [sections, setSections] = useState<SectionState[]>(createInitialSections);
  const [typingIndex, setTypingIndex] = useState<number | null>(null);
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  const sentinelRefs = useRef<(HTMLDivElement | null)[]>([]);
  const scrollTriggeredRef = useRef<Set<number>>(new Set());

  const clearTimers = useCallback(() => {
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];
  }, []);

  const patchSection = useCallback(
    (index: number, patch: Partial<SectionState>) => {
      setSections((prev) =>
        prev.map((section, i) =>
          i === index ? { ...section, ...patch } : section
        )
      );
    },
    []
  );

  const runSectionSequence = useCallback(
    (index: number) => {
      const question = chatSections[index]?.question;
      if (!question) return;

      clearTimers();
      setTypingIndex(index);
      patchSection(index, {
        phase: "typing",
        isTyping: true,
        isVisible: false,
        typedText: "",
      });

      const charDelay = Math.min(
        55,
        Math.max(28, Math.floor(1800 / question.length))
      );

      let charIndex = 0;
      const typeInterval = setInterval(() => {
        charIndex += 1;
        const typedText = question.slice(0, charIndex);
        patchSection(index, { typedText });

        if (charIndex >= question.length) {
          clearInterval(typeInterval);
          const sendTimer = setTimeout(() => {
            patchSection(index, {
              phase: "sent",
              isTyping: false,
              typedText: question,
            });
            setTypingIndex(null);

            const thinkTimer = setTimeout(() => {
              patchSection(index, { phase: "thinking" });

              const visibleTimer = setTimeout(() => {
                patchSection(index, {
                  phase: "visible",
                  isVisible: true,
                });
              }, THINK_MS);

              timersRef.current.push(visibleTimer);
            }, SEND_MS);

            timersRef.current.push(thinkTimer);
          }, 120);

          timersRef.current.push(sendTimer);
        }
      }, charDelay);
    },
    [clearTimers, patchSection]
  );

  useEffect(() => {
    runSectionSequence(0);
    return clearTimers;
  }, [runSectionSequence, clearTimers]);

  useEffect(() => {
    const observers: IntersectionObserver[] = [];

    sections.forEach((section, index) => {
      if (section.phase !== "visible" || index >= sections.length - 1) return;

      const sentinel = sentinelRefs.current[index];
      if (!sentinel) return;

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (!entry.isIntersecting) return;
          if (scrollTriggeredRef.current.has(index)) return;

          scrollTriggeredRef.current.add(index);
          runSectionSequence(index + 1);
        },
        { threshold: 0.75, rootMargin: "0px 0px -5% 0px" }
      );

      observer.observe(sentinel);
      observers.push(observer);
    });

    return () => observers.forEach((observer) => observer.disconnect());
  }, [sections, runSectionSequence]);

  const typingSection =
    typingIndex !== null ? sections[typingIndex] : null;

  return (
    <div className="relative min-h-screen bg-white pb-32">
      <header className="sticky top-0 z-40 border-b border-black/10 bg-white/80 px-6 py-4 backdrop-blur-xl">
        <div className="mx-auto flex max-w-3xl items-center gap-3">
          <div className="relative h-8 w-8 overflow-hidden rounded-full border border-black/10">
            <Image
              src="/portrait.jpg"
              alt={SITE_NAME}
              fill
              className="object-cover object-top"
            />
          </div>
          <div>
            <p className="text-sm font-bold text-black">{SITE_NAME}</p>
            <p className="text-xs text-black/45">Portfolio Assistant</p>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-3xl space-y-16 px-6 py-10 md:py-14">
        {sections.map((section, index) => {
          if (section.phase === "idle") return null;

          const showThread =
            section.phase === "sent" ||
            section.phase === "thinking" ||
            section.phase === "visible";

          return (
            <article key={section.id} className="space-y-5">
              {showThread && (
                <div className="flex justify-end">
                  <UserBubble text={section.question} />
                </div>
              )}

              {showThread && (
                <div className="flex items-start gap-3 md:gap-4">
                  <AiAvatar />
                  <div className="min-w-0 flex-1">
                    <AnimatePresence mode="wait">
                      {section.phase === "thinking" && (
                        <motion.div
                          key="thinking"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                        >
                          <ThinkingDots />
                        </motion.div>
                      )}

                      {section.isVisible && (
                        <motion.div
                          key="response"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{
                            duration: 0.45,
                            ease: [0.25, 0.1, 0.25, 1],
                          }}
                        >
                          <ResponseContent sectionId={section.id} />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              )}

              {section.isVisible && index < sections.length - 1 && (
                <div
                  ref={(el) => {
                    sentinelRefs.current[index] = el;
                  }}
                  className="h-px w-full"
                  aria-hidden
                />
              )}
            </article>
          );
        })}
      </div>

      <AnimatePresence>
        {typingSection && (
          <motion.div
            key="composer"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 16 }}
            transition={{ duration: 0.25 }}
          >
            <ChatInputBar value={typingSection.typedText} />
          </motion.div>
        )}
      </AnimatePresence>

      <footer className="border-t border-black/10 py-8">
        <div className="mx-auto max-w-3xl px-6">
          <p className="text-sm text-black/30">
            © {new Date().getFullYear()} {SITE_NAME}
          </p>
        </div>
      </footer>
    </div>
  );
}
