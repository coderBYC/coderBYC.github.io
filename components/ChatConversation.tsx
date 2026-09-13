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
import AeroProjectWindow from "@/components/AeroProjectWindow";
import ProjectsSection from "@/components/ProjectsSection";
import ContactSection from "@/components/ContactSection";
import { IntroResponse } from "@/components/chat/ChatResponses";
import { RevealLine, revealCompleteMs, SkipAnimationProvider, useSkipAnimation } from "@/components/chat/RevealLine";
import {
  chatSections,
  contactLinks,
  projects,
  type SectionPhase,
} from "@/lib/data";
import { loadChatVisit, saveChatVisit } from "@/lib/visit-state";
import type { SiteStyle } from "@/lib/theme";

const THINK_MS = 1000;
const SEND_MS = 300;
const PROMPT_TYPE_MS = 1800;

function isScenicTheme(theme: string) {
  return theme === "retro" || theme === "aero";
}

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

function createInitialSections(visitedIds: string[] = []): SectionState[] {
  return chatSections.map((section) => {
    const visited = visitedIds.includes(section.id);
    return {
      id: section.id,
      question: section.question,
      phase: visited ? "visible" : "idle",
      typedText: visited ? section.question : "",
      isTyping: false,
      isVisible: visited,
    };
  });
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
  onOpenProject,
}: {
  sectionId: string;
  slideIndex: number;
  onContentComplete: (index: number) => void;
  onOpenProject?: (id: string) => void;
}) {
  const section = chatSections.find((s) => s.id === sectionId);
  const hasIntroText = Boolean(section?.introText);
  const contentLineOffset = hasIntroText ? 1 : 0;
  const skipAnimation = useSkipAnimation();
  const onCompleteRef = useRef(onContentComplete);
  onCompleteRef.current = onContentComplete;

  useEffect(() => {
    const timer = setTimeout(() => {
      onCompleteRef.current(slideIndex);
    }, revealCompleteMs(getLineCount(sectionId), skipAnimation));
    return () => clearTimeout(timer);
  }, [sectionId, slideIndex, skipAnimation]);

  const content: Record<string, ReactNode> = {
    intro: <IntroResponse />,
    projects: (
      <ProjectsSection
        lineOffset={contentLineOffset}
        onOpenProject={onOpenProject}
      />
    ),
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

export default function ChatConversation({
  onOpenStylePicker,
}: {
  onOpenStylePicker?: () => void;
}) {
  const [sections, setSections] = useState<SectionState[]>(() =>
    createInitialSections()
  );
  const [activeSlide, setActiveSlide] = useState(0);
  const [maxUnlockedSlide, setMaxUnlockedSlide] = useState(0);
  const [promptBar, setPromptBar] = useState<PromptBarState | null>(null);
  const [theme, setTheme] = useState<SiteStyle>("brutalist");
  const [hydrated, setHydrated] = useState(false);
  const themeRef = useRef<SiteStyle>("brutalist");
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  const promptIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const slideRefs = useRef<(HTMLElement | null)[]>([]);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const launchIconRef = useRef<HTMLDivElement>(null);
  const [opening, setOpening] = useState(false);
  const [openProjectId, setOpenProjectId] = useState<string | null>(null);
  const promptStartedRef = useRef<Set<number>>(new Set());
  const knownVisitedRef = useRef<Set<string>>(new Set());
  const restoredVisitedRef = useRef<Set<string>>(new Set());
  const sectionsRef = useRef(sections);
  sectionsRef.current = sections;

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
                const sectionId = chatSections[index]?.id;
                if (sectionId) knownVisitedRef.current.add(sectionId);
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
      const sectionId = chatSections[index]?.id;
      if (!question || !sectionId) return;

      const instant = restoredVisitedRef.current.has(sectionId);

      if (instant) {
        clearTimers();
        patchSection(index, {
          phase: "visible",
          isTyping: false,
          isVisible: true,
          typedText: question,
        });
        return;
      }

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
          knownVisitedRef.current.add(sectionId);
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
    if (!isScenicTheme(document.documentElement.dataset.theme ?? "")) {
      slideRefs.current[nextIndex]?.scrollIntoView({ behavior: "smooth" });
    }
    runFromSend(nextIndex);
  }, [promptBar, runFromSend]);

  const goToSlide = useCallback(
    (index: number) => {
      if (index < 0 || index >= chatSections.length) return;

      setPromptBar(null);
      if (promptIntervalRef.current) {
        clearInterval(promptIntervalRef.current);
        promptIntervalRef.current = null;
      }

      setMaxUnlockedSlide((prev) => Math.max(prev, index));
      setActiveSlide(index);
      if (!isScenicTheme(document.documentElement.dataset.theme ?? "")) {
        slideRefs.current[index]?.scrollIntoView({ behavior: "smooth" });
      }

      const section = sectionsRef.current[index];
      if (!section || section.phase === "idle") {
        runFromSend(index);
      }
    },
    [runFromSend]
  );

  const handleContentComplete = useCallback(
    (index: number) => {
      if (index >= chatSections.length - 1) return;
      if (promptStartedRef.current.has(index)) return;
      promptStartedRef.current.add(index);

      const sectionId = chatSections[index]?.id;
      const alreadySeen = sectionId
        ? restoredVisitedRef.current.has(sectionId)
        : false;

      if (alreadySeen) {
        const question = chatSections[index + 1]?.question;
        if (!question) return;
        setPromptBar({
          hostSlideIndex: index,
          text: question,
          isTyping: false,
          canSend: true,
        });
        return;
      }

      startPromptBarTyping(index);
    },
    [startPromptBarTyping]
  );

  useEffect(() => {
    const visited = sections
      .filter((section) => section.isVisible)
      .map((section) => section.id);

    if (visited.length === 0 || !hydrated) return;

    saveChatVisit({
      visitedIds: visited,
      maxUnlocked: maxUnlockedSlide,
      activeSlide,
    });
  }, [sections, maxUnlockedSlide, activeSlide, hydrated]);

  useEffect(() => {
    const visit = loadChatVisit();
    const returning = Boolean(visit?.visitedIds.length);
    const currentTheme = (document.documentElement.dataset.theme ??
      "brutalist") as SiteStyle;
    themeRef.current = currentTheme;
    setTheme(currentTheme);

    if (isScenicTheme(currentTheme)) {
      setMaxUnlockedSlide(chatSections.length - 1);
      setSections(createInitialSections(chatSections.map((section) => section.id)));
      setHydrated(true);
      return clearTimers;
    }

    if (returning && visit) {
      knownVisitedRef.current = new Set(visit.visitedIds);
      restoredVisitedRef.current = new Set(visit.visitedIds);
      const lastIndex = chatSections.length - 1;
      setSections(createInitialSections(visit.visitedIds));
      setActiveSlide(Math.min(visit.activeSlide, lastIndex));
      setMaxUnlockedSlide(Math.min(visit.maxUnlocked, lastIndex));

      const visitedIndexes = visit.visitedIds
        .map((id) => chatSections.findIndex((section) => section.id === id))
        .filter((index) => index >= 0);

      visitedIndexes.forEach((index) => {
        if (index < chatSections.length - 1) {
          promptStartedRef.current.add(index);
        }
      });

      const lastVisitedIndex = visitedIndexes.length
        ? Math.max(...visitedIndexes)
        : 0;

      if (lastVisitedIndex < chatSections.length - 1) {
        const question = chatSections[lastVisitedIndex + 1]?.question;
        if (question) {
          setPromptBar({
            hostSlideIndex: lastVisitedIndex,
            text: question,
            isTyping: false,
            canSend: true,
          });
        }
      }

      setHydrated(true);
      requestAnimationFrame(() => {
        if (isScenicTheme(document.documentElement.dataset.theme ?? "")) return;
        slideRefs.current[visit.activeSlide]?.scrollIntoView({
          behavior: "auto",
        });
      });
      return clearTimers;
    }

    setHydrated(true);
    runAutoSequence(0);
    return clearTimers;
  }, [runAutoSequence, clearTimers]);

  useEffect(() => {
    if (theme !== "aero" || !hydrated) return;
    const frame = frameRef.current;
    const icon = launchIconRef.current;
    if (!frame || !icon) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let frameId = 0;
    const start = (tries = 0) => {
      const frameRect = frame.getBoundingClientRect();
      const iconRect = icon.getBoundingClientRect();
      if ((iconRect.width === 0 || frameRect.width === 0) && tries < 8) {
        frameId = window.requestAnimationFrame(() => start(tries + 1));
        return;
      }
      const x = iconRect.left + iconRect.width / 2 - frameRect.left;
      const y = iconRect.top + iconRect.height / 2 - frameRect.top;
      frame.style.setProperty("--aero-origin-x", `${x}px`);
      frame.style.setProperty("--aero-origin-y", `${y}px`);
      setOpening(true);
    };

    frameId = window.requestAnimationFrame(() => start());
    const timer = window.setTimeout(() => setOpening(false), 720);
    return () => {
      window.cancelAnimationFrame(frameId);
      window.clearTimeout(timer);
    };
  }, [theme, hydrated]);

  useEffect(() => {
    const syncTheme = () => {
      const next = (document.documentElement.dataset.theme ??
        "brutalist") as SiteStyle;
      themeRef.current = next;
      setTheme(next);
      if (next !== "aero") setOpenProjectId(null);
      if (!isScenicTheme(next)) return;

      setMaxUnlockedSlide(chatSections.length - 1);
      setPromptBar(null);
      setSections((prev) =>
        prev.map((section) => ({
          ...section,
          phase: "visible",
          isVisible: true,
          isTyping: false,
          typedText: section.question,
        }))
      );
    };

    syncTheme();
    const observer = new MutationObserver(syncTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });
    return () => observer.disconnect();
  }, []);

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
      if (isScenicTheme(document.documentElement.dataset.theme ?? "")) return;
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
      if (document.body.dataset.stylePicker === "open") return;
      event.preventDefault();
      handlePromptSend();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [promptBar, handlePromptSend]);

  if (!hydrated) {
    return <div className="fixed inset-0 bg-white" aria-hidden />;
  }

  const scenic = isScenicTheme(theme);

  return (
    <div
      ref={scrollContainerRef}
      className="chat-root fixed inset-0 overflow-y-auto snap-y snap-mandatory bg-white overscroll-none"
    >
      <div className="theme-wallpaper" aria-hidden />
      <div className="aero-desktop" aria-hidden>
        <div
          ref={launchIconRef}
          className={`aero-icon${opening || openProjectId ? " is-source" : ""}`}
        >
          <img src="/themes/icon-ie.png" alt="" />
          <span>Internet Explorer</span>
        </div>
        <div className="aero-icon">
          <img src="/themes/icon-explorer.png" alt="" />
          <span>Explorer</span>
        </div>
        <div className="aero-icon">
          <img src="/themes/icon-cmd.png" alt="" />
          <span>Command Prompt</span>
        </div>
      </div>
      <div className="aero-stage">
      <div
        ref={frameRef}
        className={`aero-frame${opening ? " is-opening" : ""}`}
      >
      <div className="aero-titlebar">
        <div className="aero-title">Bryan Chen</div>
        <div className="aero-controls">
          <button type="button" className="aero-btn min" aria-label="Minimize" />
          <button
            type="button"
            className="aero-btn close"
            onClick={onOpenStylePicker}
            aria-label="Change style"
          />
        </div>
      </div>
      <div className="aero-menubar" role="menubar">
        {chatSections.map((section, index) => (
          <button
            key={section.id}
            type="button"
            role="menuitem"
            onClick={() => goToSlide(index)}
            className={activeSlide === index ? "is-active" : ""}
          >
            {section.navLabel}
          </button>
        ))}
        <button
          type="button"
          className="ml-auto"
          onClick={onOpenStylePicker}
        >
          Style
        </button>
      </div>
      <nav className="site-nav pointer-events-none fixed inset-x-0 top-0 z-50 flex justify-center px-4 pt-4 md:px-6">
        <div className="pointer-events-auto flex max-w-3xl flex-wrap items-center justify-center gap-1 rounded-full border-2 border-black bg-white/95 px-2 py-1.5 shadow-[3px_3px_0_0_#000] backdrop-blur-sm">
          {chatSections.map((section, index) => {
            const isActive = activeSlide === index;
            return (
              <button
                key={section.id}
                type="button"
                onClick={() => goToSlide(index)}
                className={`rounded-full px-3 py-1.5 text-xs tracking-wide transition-colors md:text-sm ${
                  isActive
                    ? "bg-black text-white"
                    : "text-black/60 hover:text-black"
                }`}
              >
                {section.navLabel}
              </button>
            );
          })}
          <button
            type="button"
            onClick={onOpenStylePicker}
            className="rounded-full px-3 py-1.5 text-xs tracking-wide text-black/60 transition-colors hover:text-black md:text-sm"
          >
            Style
          </button>
        </div>
      </nav>
      <div className="aero-client">

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
          !scenic &&
          promptBar?.hostSlideIndex === index &&
          section.phase === "visible";
        const isDense = section.id === "projects";
        const showContent = scenic || section.isVisible;

        return (
          <section
            key={section.id}
            ref={(el) => {
              slideRefs.current[index] = el;
            }}
            data-section={section.id}
            data-active={isActive ? "true" : "false"}
            className="flex h-screen snap-start snap-always flex-col bg-white"
            aria-hidden={!isActive && section.phase === "idle"}
          >
            <div
              className={`mx-auto flex w-full max-w-3xl flex-1 flex-col justify-center px-4 pb-6 pt-20 md:px-6 md:pb-8 md:pt-24 ${
                isDense
                  ? "min-h-0 overflow-y-auto overscroll-contain py-2 pt-20 md:pt-24"
                  : "overflow-hidden"
              }`}
            >
              <div
                className={`flex w-full flex-col ${
                  isDense ? "" : ""
                }`}
              >
                {!scenic && showQuestion && (
                  <div className="mb-4 flex shrink-0 justify-end">
                    {section.phase === "typing" ? (
                      <UserBubble text={section.typedText} typing />
                    ) : (
                      <UserBubble text={section.question} />
                    )}
                  </div>
                )}

                {(scenic || showResponse) && (
                  <div className="flex min-h-0 flex-col gap-3">
                    {!scenic && <AiAvatar />}
                    <div className="min-w-0">
                      <AnimatePresence mode="wait">
                        {!scenic && section.phase === "thinking" && (
                          <motion.div
                            key="thinking"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                          >
                            <ThinkingDots />
                          </motion.div>
                        )}

                        {showContent && (
                          <SkipAnimationProvider
                            skip={restoredVisitedRef.current.has(section.id)}
                          >
                            <ResponseContent
                              sectionId={section.id}
                              slideIndex={index}
                              onContentComplete={handleContentComplete}
                              onOpenProject={setOpenProjectId}
                            />
                          </SkipAnimationProvider>
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
      <div className="aero-statusbar">
        <span>Ready</span>
        <span>{chatSections[activeSlide]?.navLabel}</span>
      </div>
      </div>
      <img
        className="aero-orb"
        src="/themes/aero-orb.png"
        alt=""
      />
      </div>
      {theme === "aero" && openProjectId && (
        <AeroProjectWindow
          projectId={openProjectId}
          originRef={launchIconRef}
          onClose={() => setOpenProjectId(null)}
        />
      )}
    </div>
  );
}
