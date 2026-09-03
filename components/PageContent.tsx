"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import TerminalIntro from "./TerminalIntro";
import ChatConversation from "./ChatConversation";

const INTRO_SEEN_KEY = "bryan-website-terminal-intro-seen-at";
const RECENT_MS = 1000 * 60 * 60 * 24;

function hasSeenIntroRecently() {
  const seenAt = localStorage.getItem(INTRO_SEEN_KEY);
  if (!seenAt) return false;

  const timestamp = Number(seenAt);
  if (Number.isNaN(timestamp)) return true;

  return Date.now() - timestamp < RECENT_MS;
}

export default function PageContent() {
  const [showIntro, setShowIntro] = useState<boolean | null>(null);
  const [skipIntroAnimation, setSkipIntroAnimation] = useState(false);

  useEffect(() => {
    const seenRecently = hasSeenIntroRecently();
    setSkipIntroAnimation(seenRecently);
    setShowIntro(!seenRecently);
  }, []);

  useEffect(() => {
    if (showIntro === null) return;
    document.body.style.overflow = showIntro ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [showIntro]);

  const handleIntroComplete = () => {
    localStorage.setItem(INTRO_SEEN_KEY, String(Date.now()));
    setShowIntro(false);
  };

  if (showIntro === null) {
    return <div className="fixed inset-0 bg-white" aria-hidden />;
  }

  return (
    <>
      <AnimatePresence>
        {showIntro && <TerminalIntro onComplete={handleIntroComplete} />}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: skipIntroAnimation ? 1 : 0 }}
        animate={{ opacity: showIntro ? 0 : 1 }}
        transition={{
          duration: skipIntroAnimation ? 0 : 0.6,
          ease: [0.25, 0.1, 0.25, 1],
        }}
      >
        {!showIntro && <ChatConversation />}
      </motion.div>
    </>
  );
}
