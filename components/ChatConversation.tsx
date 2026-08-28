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

function AiAvatar() {
  return (
    <div className="relative h-8 w-8 shrink-0 overflow-hidden rounded-full border border-black/10">
      <Image
        src="/portrait.png"
        alt="Bryan Chen"
        fill
        className="object-cover object-top"
      />
    </div>
  );
}

function ResponseContent({ sectionId }: { sectionId: string }) {
  const section = chatSections.find((s) => s.id === sectionId);
  const content: Record<string, ReactNode> = {
    intro: <IntroResponse />,
    projects: <ProjectsSection />,
    contact: <ContactSection />,
  };

  return (
    <div className="prose prose-neutral max-w-none prose-p:text-black/70 prose-headings:font-bold prose-headings:tracking-wide prose-headings:text-black">
      {section?.introText && (
        <p className="mb-4 text-base text-black/60">{section.introText}</p>
      )}
      {content[sectionId]}
    </div>
  );
}

export default function ChatConversation() {
  const [sections, setSections] = useState<SectionState[]>(createInitialSections);
  const [activeSlide, setActiveSlide] = useState(0);
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  const slideRefs = useRef<(HTMLElement | null)[]>([]);
  const triggeredRef = useRef<Set<number>>(new Set());

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

  const triggerSlide = useCallback(
    (index: number) => {
      if (triggeredRef.current.has(index)) return;
      triggeredRef.current.add(index);
      runSectionSequence(index);
    },
    [runSectionSequence]
  );

  useEffect(() => {
    triggerSlide(0);
    return clearTimers;
  }, [triggerSlide, clearTimers]);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  useEffect(() => {
    const observers: IntersectionObserver[] = [];

    chatSections.forEach((_, index) => {
      const slide = slideRefs.current[index];
      if (!slide) return;

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (!entry.isIntersecting || entry.intersectionRatio < 0.55) return;

          setActiveSlide(index);
          triggerSlide(index);
        },
        { threshold: [0.55, 0.75, 0.9] }
      );

      observer.observe(slide);
      observers.push(observer);
    });

    return () => observers.forEach((observer) => observer.disconnect());
  }, [triggerSlide]);

  return (
    <div className="fixed inset-0 overflow-y-auto snap-y snap-mandatory bg-white overscroll-none">
      {sections.map((section, index) => {
        const showQuestion =
          section.phase === "typing" ||
          section.phase === "sent" ||
          section.phase === "thinking" ||
          section.phase === "visible";

        const showResponse =
          section.phase === "sent" ||
          section.phase === "thinking" ||
          section.phase === "visible";

        const isActive = activeSlide === index;

        return (
          <section
            key={section.id}
            ref={(el) => {
              slideRefs.current[index] = el;
            }}
            className={`flex h-screen snap-start snap-always flex-col bg-white px-4 py-6 md:px-6 md:py-8 ${
              section.id === "projects" ? "overflow-hidden" : ""
            }`}
            aria-hidden={!isActive && section.phase === "idle"}
          >
            <div
              className={`mx-auto flex w-full max-w-3xl flex-1 flex-col ${
                section.id === "projects" ? "overflow-hidden" : "overflow-y-auto"
              }`}
            >
              {showQuestion && (
                <div className="mb-4 flex shrink-0 items-start justify-between gap-4">
                  {showResponse ? (
                    <AiAvatar />
                  ) : (
                    <div className="h-8 w-8 shrink-0" />
                  )}
                  {section.phase === "typing" ? (
                    <UserBubble text={section.typedText} typing />
                  ) : (
                    <UserBubble text={section.question} />
                  )}
                </div>
              )}

              {showResponse && (
                <div className="min-h-0 flex-1">
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
            </div>
          </section>
        );
      })}
    </div>
  );
}
