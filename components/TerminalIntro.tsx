"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const COMMAND = "bryan_chen_website";
const TYPING_DURATION_MS = 5000;

interface TerminalIntroProps {
  onComplete: () => void;
}

export default function TerminalIntro({ onComplete }: TerminalIntroProps) {
  const [displayed, setDisplayed] = useState("");
  const [done, setDone] = useState(false);

  useEffect(() => {
    const charDelay = TYPING_DURATION_MS / COMMAND.length;
    let index = 0;

    const interval = setInterval(() => {
      index += 1;
      setDisplayed(COMMAND.slice(0, index));

      if (index >= COMMAND.length) {
        clearInterval(interval);
        setTimeout(() => setDone(true), 600);
      }
    }, charDelay);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (done) {
      const timeout = setTimeout(onComplete, 500);
      return () => clearTimeout(timeout);
    }
  }, [done, onComplete]);

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black px-6"
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
        >
          <div className="w-full max-w-2xl overflow-hidden rounded-xl border border-white/10 bg-[#1e1e1e] shadow-2xl">
            <div className="flex items-center gap-2 border-b border-white/10 bg-[#2d2d2d] px-4 py-3">
              <div className="h-3 w-3 rounded-full bg-[#ff5f57]" />
              <div className="h-3 w-3 rounded-full bg-[#febc2e]" />
              <div className="h-3 w-3 rounded-full bg-[#28c840]" />
              <span className="ml-3 text-xs text-white/40">Terminal — zsh</span>
            </div>

            <div className="space-y-3 p-6 font-mono text-sm leading-relaxed md:p-8 md:text-base">
              <p className="text-white/40">
                Last login: {new Date().toLocaleDateString()} on ttys000
              </p>
              <div className="flex flex-wrap items-center gap-x-2 text-white/90">
                <span className="text-[#28c840]">bryan@macbook</span>
                <span className="text-white/40">~</span>
                <span className="text-white/40">%</span>
                <span>
                  {displayed}
                  <motion.span
                    className="inline-block w-[8px] bg-white/80"
                    animate={{ opacity: [1, 0] }}
                    transition={{ duration: 0.8, repeat: Infinity }}
                  >
                    &nbsp;
                  </motion.span>
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
