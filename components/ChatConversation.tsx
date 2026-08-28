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
import ProjectsSection from "@/components/ProjectsSection";
import ContactSection from "@/components/ContactSection";
import { IntroResponse } from "@/components/chat/ChatResponses";
import {
  chatSections,
  SITE_NAME,
  type SectionPhase,
} from "@/lib/data";

const THINK_MS = 1000;
const SEND_MS = 300;

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

function UserBubble({ text, typing = false }: { text: string; typing?: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 6 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.28, ease: [0.25, 0.1, 0.25, 1] }}
      className="ml-auto w-fit max-w-[90%] rounded-3xl bg-zinc-800 px-4 py-2.5 text-sm text-white"
    >
      {text}
      {typing && (
        <motion.span
          className="ml-0.5 inline-block h-4 w-0.5 translate-y-0.5 bg-white/80"
          animate={{ opacity: [1, 0] }}
          transition={{ duration: 0.55, repeat: Infinity }}
        />
      )}
    </motion.div>
  );
}

function ResponseContent({ sectionId }: { sectionId: string }) {
  const content: Record<string, ReactNode> = {
    intro: <IntroResponse />,
    projects: <ProjectsSection />,
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
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  const sentinelRefs = useRef<(HTMLDivElement | null)[]>([]);
  const scrollTriggeredRef = useRef<Set<number>>(new Set());
  const startedRef = useRef(false);

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
    if (startedRef.current) return;
    startedRef.current = true;
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
        { threshold: 0.85, rootMargin: "0px 0px -5% 0px" }
      );

      observer.observe(sentinel);
      observers.push(observer);
    });

    return () => observers.forEach((observer) => observer.disconnect());
  }, [sections, runSectionSequence]);

  return (
    <div className="relative min-h-screen bg-white pb-16">
      <header className="sticky top-0 z-40 border-b border-black/10 bg-white/80 px-6 py-4 backdrop-blur-xl">
        <div className="mx-auto flex max-w-3xl items-center gap-3">
          <div className="relative h-8 w-8 overflow-hidden rounded-full border border-black/10">
            <Image
              src="/portrait.png"
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

          const showQuestion =
            section.phase === "typing" ||
            section.phase === "sent" ||
            section.phase === "thinking" ||
            section.phase === "visible";

          const showResponse =
            section.phase === "sent" ||
            section.phase === "thinking" ||
            section.phase === "visible";

          return (
            <article key={section.id} className="space-y-5">
              {showQuestion && (
                <div className="flex justify-end">
                  {section.phase === "typing" ? (
                    <UserBubble text={section.typedText} typing />
                  ) : (
                    <UserBubble text={section.question} />
                  )}
                </div>
              )}

              {showResponse && (
                <div className="min-w-0">
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
