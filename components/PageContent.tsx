"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import TerminalIntro from "./TerminalIntro";
import ChatTurn from "./ChatTurn";
import BackgroundSection from "./BackgroundSection";
import ProjectsSection from "./ProjectsSection";
import ContactSection from "./ContactSection";
import { chatSections } from "@/lib/data";

export default function PageContent() {
  const [showIntro, setShowIntro] = useState(true);
  const [triggeredCount, setTriggeredCount] = useState(0);

  useEffect(() => {
    document.body.style.overflow = showIntro ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [showIntro]);

  useEffect(() => {
    if (showIntro) return;
    setTriggeredCount(1);
  }, [showIntro]);

  const handleSectionComplete = useCallback((index: number) => {
    const next = index + 1;
    if (next < chatSections.length) {
      setTriggeredCount((prev) => Math.max(prev, next + 1));
    }
  }, []);

  const sections = [
    <BackgroundSection key="background" />,
    <ProjectsSection key="projects" />,
    <ContactSection key="contact" />,
  ];

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
      >
        <main>
          {chatSections.map((section, index) => (
            <ChatTurn
              key={section.id}
              question={section.question}
              isTriggered={triggeredCount > index}
              onSectionComplete={() => handleSectionComplete(index)}
              isLast={index === chatSections.length - 1}
            >
              {sections[index]}
            </ChatTurn>
          ))}
        </main>

        <footer className="border-t border-black/10 py-8">
          <div className="mx-auto max-w-5xl px-6 md:px-8">
            <p className="text-sm text-black/30">
              © {new Date().getFullYear()} Bryan Chen
            </p>
          </div>
        </footer>
      </motion.div>
    </>
  );
}
