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
import { FiArrowRight } from "react-icons/fi";
import ProjectsSection from "@/components/ProjectsSection";
import ContactSection from "@/components/ContactSection";
import { IntroResponse } from "@/components/chat/ChatResponses";
import { RevealLine, revealCompleteMs } from "@/components/chat/RevealLine";
import {
  chatSections,
  contactLinks,
  projects,
  type SectionPhase,
} from "@/lib/data";

const THINK_MS = 1000;
const SEND_MS = 300;
const PROMPT_TYPE_MS = 1800;

interface SectionState {
  id: string;
  question: string;
  phase: SectionPhase;
  typedText: string;
  isTyping: boolean;
  isVisible: boolean;
}

interface PromptBarState {
  hostSlideIndex: number;
  text: string;
  isTyping: boolean;
  canSend: boolean;
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
      className="w-fit max-w-[90%] rounded-3xl bg-zinc-800 px-4 py-2.5 text-sm text-white"
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
    <div className="flex items-center gap-2.5">
      <div className="relative h-8 w-8 shrink-0 overflow-hidden rounded-full border border-black/10">
        <Image
          src="/portrait.png"
          alt="Bryan Chen"
          fill
          className="object-cover object-top"
        />
      </div>
      <span className="text-sm tracking-wide text-black">coderBYC</span>
    </div>
  );
}

function PromptBar({
  text,
  isTyping,
  canSend,
  onSend,
}: {
  text: string;
  isTyping: boolean;
  canSend: boolean;
  onSend: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
      className="shrink-0 px-4 pb-6 pt-3 md:px-6 md:pb-8"
    >
      <div className="mx-auto flex max-w-3xl items-center gap-2 rounded-3xl border-2 border-black bg-white px-4 py-2.5">
        <span className="min-h-5 flex-1 text-sm text-black">
          {text}
          {isTyping && (
            <motion.span
              className="ml-0.5 inline-block h-4 w-0.5 translate-y-0.5 bg-black/50"
              animate={{ opacity: [1, 0] }}
              transition={{ duration: 0.55, repeat: Infinity }}
            />
          )}
        </span>
        <button
          type="button"
          onClick={onSend}
          disabled={!canSend}
          aria-label="Send prompt"
          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 transition-all duration-200 ${
            canSend
              ? "border-black bg-black text-white hover:bg-black/90"
              : "cursor-not-allowed border-black/20 text-black/25"
          }`}
        >
          <FiArrowRight className="h-4 w-4" />
        </button>
      </div>
    </motion.div>
  );
}

function getLineCount(sectionId: string): number {
  switch (sectionId) {
    case "intro":
      return 5;
    case "projects":
      return 1 + projects.length;
    case "contact":
      return 1 + contactLinks.length;
    default:
      return 1;
  }
}

function ResponseContent({
  sectionId,
  slideIndex,
  onContentComplete,
}: {
  sectionId: string;
  slideIndex: number;
  onContentComplete: (index: number) => void;
}) {
  const section = chatSections.find((s) => s.id === sectionId);
  const hasIntroText = Boolean(section?.introText);
  const contentLineOffset = hasIntroText ? 1 : 0;
  const onCompleteRef = useRef(onContentComplete);
  onCompleteRef.current = onContentComplete;

  useEffect(() => {
    const timer = setTimeout(() => {
      onCompleteRef.current(slideIndex);
    }, revealCompleteMs(getLineCount(sectionId)));
    return () => clearTimeout(timer);
  }, [sectionId, slideIndex]);

  const content: Record<string, ReactNode> = {
    intro: <IntroResponse />,
    projects: <ProjectsSection lineOffset={contentLineOffset} />,
    contact: <ContactSection lineOffset={contentLineOffset} />,
  };

  return (
    <div className="prose prose-neutral max-w-none prose-p:text-black/70 prose-headings:font-bold prose-headings:tracking-wide prose-headings:text-black">
      {section?.introText && (
        <RevealLine index={0}>
          <p className="mb-4 text-base text-black/60">{section.introText}</p>
        </RevealLine>
      )}
      {content[sectionId]}
    </div>
  );
}

export default function ChatConversation() {
  const [sections, setSections] = useState<SectionState[]>(createInitialSections);
  const [activeSlide, setActiveSlide] = useState(0);
  const [maxUnlockedSlide, setMaxUnlockedSlide] = useState(0);
  const [promptBar, setPromptBar] = useState<PromptBarState | null>(null);
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  const promptIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const slideRefs = useRef<(HTMLElement | null)[]>([]);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const promptStartedRef = useRef<Set<number>>(new Set());

  const clearTimers = useCallback(() => {
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];
    if (promptIntervalRef.current) {
      clearInterval(promptIntervalRef.current);
      promptIntervalRef.current = null;
    }
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

  const runAutoSequence = useCallback(
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

  const runFromSend = useCallback(
    (index: number) => {
      const question = chatSections[index]?.question;
      if (!question) return;

      clearTimers();
      patchSection(index, {
        phase: "sent",
        isTyping: false,
        isVisible: false,
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
    },
    [clearTimers, patchSection]
  );

  const startPromptBarTyping = useCallback((hostSlideIndex: number) => {
    const question = chatSections[hostSlideIndex + 1]?.question;
    if (!question) return;

    if (promptIntervalRef.current) {
      clearInterval(promptIntervalRef.current);
    }

    setPromptBar({
      hostSlideIndex,
      text: "",
      isTyping: true,
      canSend: false,
    });

    const charDelay = Math.min(
      55,
      Math.max(28, Math.floor(PROMPT_TYPE_MS / question.length))
    );

    let charIndex = 0;
    promptIntervalRef.current = setInterval(() => {
      charIndex += 1;
      const text = question.slice(0, charIndex);

      setPromptBar({
        hostSlideIndex,
        text,
        isTyping: charIndex < question.length,
        canSend: charIndex >= question.length,
      });

      if (charIndex >= question.length && promptIntervalRef.current) {
        clearInterval(promptIntervalRef.current);
        promptIntervalRef.current = null;
      }
    }, charDelay);
  }, []);

  const handlePromptSend = useCallback(() => {
    if (!promptBar?.canSend) return;

    const nextIndex = promptBar.hostSlideIndex + 1;
    setPromptBar(null);

    if (promptIntervalRef.current) {
      clearInterval(promptIntervalRef.current);
      promptIntervalRef.current = null;
    }

    setMaxUnlockedSlide(nextIndex);
    setActiveSlide(nextIndex);
    slideRefs.current[nextIndex]?.scrollIntoView({ behavior: "smooth" });
    runFromSend(nextIndex);
  }, [promptBar, runFromSend]);

  const handleContentComplete = useCallback(
    (index: number) => {
      if (index >= chatSections.length - 1) return;
      if (promptStartedRef.current.has(index)) return;
      promptStartedRef.current.add(index);
      startPromptBarTyping(index);
    },
    [startPromptBarTyping]
  );

  useEffect(() => {
    runAutoSequence(0);
    return clearTimers;
  }, [runAutoSequence, clearTimers]);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const index = Math.round(container.scrollTop / container.clientHeight);
      const clamped = Math.min(index, maxUnlockedSlide);
      setActiveSlide(clamped);

      if (index > maxUnlockedSlide) {
        slideRefs.current[maxUnlockedSlide]?.scrollIntoView({
          behavior: "smooth",
        });
      }
    };

    container.addEventListener("scroll", handleScroll, { passive: true });
    return () => container.removeEventListener("scroll", handleScroll);
  }, [maxUnlockedSlide]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Enter" || !promptBar?.canSend) return;
      event.preventDefault();
      handlePromptSend();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [promptBar, handlePromptSend]);

  return (
    <div
      ref={scrollContainerRef}
      className="fixed inset-0 overflow-y-auto snap-y snap-mandatory bg-white overscroll-none"
    >
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
        const showPromptBar =
          promptBar?.hostSlideIndex === index && section.phase === "visible";

        return (
          <section
            key={section.id}
            ref={(el) => {
              slideRefs.current[index] = el;
            }}
            className="flex h-screen snap-start snap-always flex-col bg-white"
            aria-hidden={!isActive && section.phase === "idle"}
          >
            <div
              className={`mx-auto flex w-full max-w-3xl flex-1 flex-col justify-center px-4 py-6 md:px-6 md:py-8 ${
                section.id === "projects"
                  ? "min-h-0 overflow-visible py-2"
                  : "overflow-hidden"
              }`}
            >
              <div
                className={`flex w-full flex-col ${
                  section.id === "projects" ? "overflow-visible" : ""
                }`}
              >
                {showQuestion && (
                  <div className="mb-4 flex shrink-0 justify-end">
                    {section.phase === "typing" ? (
                      <UserBubble text={section.typedText} typing />
                    ) : (
                      <UserBubble text={section.question} />
                    )}
                  </div>
                )}

                {showResponse && (
                  <div className="flex min-h-0 flex-col gap-3">
                    <AiAvatar />
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
                          <div>
                            <ResponseContent
                              sectionId={section.id}
                              slideIndex={index}
                              onContentComplete={handleContentComplete}
                            />
                          </div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {showPromptBar && (
              <PromptBar
                text={promptBar.text}
                isTyping={promptBar.isTyping}
                canSend={promptBar.canSend}
                onSend={handlePromptSend}
              />
            )}
          </section>
        );
      })}
    </div>
  );
}
