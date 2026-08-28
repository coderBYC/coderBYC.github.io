"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import TerminalIntro from "./TerminalIntro";
import ChatHistory from "./ChatHistory";
import BackgroundSection from "./BackgroundSection";
import ProjectsSection from "./ProjectsSection";
import ContactSection from "./ContactSection";
import { chatSections } from "@/lib/data";

const SECTION_REVEAL_DELAY_MS = 700;

export default function PageContent() {
  const [showIntro, setShowIntro] = useState(true);
  const [visibleCount, setVisibleCount] = useState(0);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    document.body.style.overflow = showIntro ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [showIntro]);

  useEffect(() => {
    if (showIntro) return;

    setVisibleCount(1);

    const timers = [
      setTimeout(() => setVisibleCount(2), SECTION_REVEAL_DELAY_MS),
      setTimeout(() => setVisibleCount(3), SECTION_REVEAL_DELAY_MS * 2),
    ];

    return () => timers.forEach(clearTimeout);
  }, [showIntro]);

  useEffect(() => {
    if (showIntro || visibleCount < 1) return;

    const sections = chatSections
      .slice(0, visibleCount)
      .map((section) => document.getElementById(section.id))
      .filter((el): el is HTMLElement => el !== null);

    const observers = sections.map((section, index) => {
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setActiveIndex(index);
          }
        },
        { threshold: 0.35, rootMargin: "-15% 0px -15% 0px" }
      );

      observer.observe(section);
      return observer;
    });

    return () => observers.forEach((observer) => observer.disconnect());
  }, [showIntro, visibleCount]);

  const handleSelect = useCallback((index: number) => {
    const section = document.getElementById(chatSections[index].id);
    if (section) {
      section.scrollIntoView({ behavior: "smooth", block: "start" });
      setActiveIndex(index);
    }
  }, []);

  return (
    <>
      <AnimatePresence>
        {showIntro && (
          <TerminalIntro onComplete={() => setShowIntro(false)} />
        )}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: showIntro ? 0 : 1 }}
        transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
        className="lg:pr-72 xl:pr-80"
      >
        {!showIntro && (
          <ChatHistory
            visibleCount={visibleCount}
            activeIndex={activeIndex}
            onSelect={handleSelect}
          />
        )}

        <main>
          <AnimatePresence>
            {visibleCount >= 1 && (
              <motion.div
                key="background"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
              >
                <BackgroundSection />
              </motion.div>
            )}
            {visibleCount >= 2 && (
              <motion.div
                key="projects"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
              >
                <ProjectsSection />
              </motion.div>
            )}
            {visibleCount >= 3 && (
              <motion.div
                key="contact"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
              >
                <ContactSection />
              </motion.div>
            )}
          </AnimatePresence>
        </main>

        <footer className="border-t border-black/10 py-8">
          <div className="mx-auto max-w-3xl px-6 md:px-8">
            <p className="text-sm text-black/30">
              © {new Date().getFullYear()} Bryan Chen
            </p>
          </div>
        </footer>
      </motion.div>

      {!showIntro && visibleCount > 0 && (
        <div className="fixed bottom-4 left-4 right-4 z-30 flex flex-col gap-2 lg:hidden">
          {chatSections.slice(0, visibleCount).map((section, index) => (
            <motion.button
              key={section.id}
              type="button"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              onClick={() => handleSelect(index)}
              className={`ml-auto max-w-[85%] rounded-2xl rounded-br-sm px-4 py-2.5 text-left text-xs tracking-wide ${
                activeIndex === index
                  ? "bg-black text-white"
                  : "bg-black/5 text-black/70"
              }`}
            >
              {section.question}
            </motion.button>
          ))}
        </div>
      )}
    </>
  );
}
