"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import TerminalIntro from "./TerminalIntro";
import ChatConversation from "./ChatConversation";

export default function PageContent() {
  const [showIntro, setShowIntro] = useState(true);

  useEffect(() => {
    document.body.style.overflow = showIntro ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [showIntro]);

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
        {!showIntro && <ChatConversation />}
      </motion.div>
    </>
  );
}
