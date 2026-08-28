"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

type TurnPhase = "idle" | "typing" | "sent" | "thinking" | "content";

interface ChatTurnProps {
  question: string;
  isTriggered: boolean;
  onSectionComplete?: () => void;
  isLast?: boolean;
  children: React.ReactNode;
}

const THINK_DURATION_MS = 1000;
const SEND_DURATION_MS = 350;
const MS_PER_CHAR = 45;

function ThinkingIndicator() {
  return (
    <div className="flex items-center gap-1.5 py-4">
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="h-2 w-2 rounded-full bg-black/30"
          animate={{ opacity: [0.3, 1, 0.3], y: [0, -3, 0] }}
          transition={{
            duration: 0.9,
            repeat: Infinity,
            delay: i * 0.15,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}

export default function ChatTurn({
  question,
  isTriggered,
  onSectionComplete,
  isLast = false,
  children,
}: ChatTurnProps) {
  const [phase, setPhase] = useState<TurnPhase>("idle");
  const [typedText, setTypedText] = useState("");
  const sentinelRef = useRef<HTMLDivElement>(null);
  const triggeredRef = useRef(false);
  const sequenceRef = useRef(false);

  useEffect(() => {
    if (!isTriggered || sequenceRef.current) return;
    sequenceRef.current = true;

    const typingDuration = Math.min(
      2200,
      Math.max(900, question.length * MS_PER_CHAR)
    );

    setPhase("typing");
    setTypedText("");

    let charIndex = 0;
    const charInterval = setInterval(() => {
      charIndex += 1;
      setTypedText(question.slice(0, charIndex));

      if (charIndex >= question.length) {
        clearInterval(charInterval);
        setTimeout(() => setPhase("sent"), 120);
        setTimeout(() => setPhase("thinking"), SEND_DURATION_MS);
        setTimeout(() => setPhase("content"), SEND_DURATION_MS + THINK_DURATION_MS);
      }
    }, typingDuration / question.length);

    return () => clearInterval(charInterval);
  }, [isTriggered, question]);

  useEffect(() => {
    if (phase !== "content" || isLast || !onSectionComplete) return;

    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !triggeredRef.current) {
          triggeredRef.current = true;
          onSectionComplete();
        }
      },
      { threshold: 0.85, rootMargin: "0px 0px -8% 0px" }
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [phase, isLast, onSectionComplete]);

  const showBubble =
    phase === "sent" || phase === "thinking" || phase === "content";

  return (
    <div className="relative min-h-screen">
      <div className="mx-auto max-w-5xl px-6 pb-20 pt-16 md:px-8 md:pb-28 md:pt-20">
        <div className="flex justify-end">
          <div className="w-full max-w-sm md:max-w-md">
            <AnimatePresence mode="wait">
              {phase === "typing" && (
                <motion.div
                  key="typing"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.96, y: -4 }}
                  transition={{ duration: 0.25 }}
                  className="ml-auto flex w-fit max-w-full items-center gap-2 rounded-2xl border border-black/15 bg-black/[0.03] px-4 py-2.5"
                >
                  <span className="text-sm tracking-wide text-black/80">
                    {typedText}
                  </span>
                  <motion.span
                    className="inline-block h-4 w-0.5 bg-black/60"
                    animate={{ opacity: [1, 0] }}
                    transition={{ duration: 0.6, repeat: Infinity }}
                  />
                </motion.div>
              )}

              {showBubble && (
                <motion.div
                  key="bubble"
                  initial={{ opacity: 0, scale: 0.92, y: 6 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
                  className="ml-auto w-fit max-w-full rounded-2xl rounded-br-md bg-black px-4 py-2.5 text-sm tracking-wide text-white"
                >
                  {question}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <div className="mt-20 max-w-3xl md:mt-28">
          <AnimatePresence mode="wait">
            {phase === "thinking" && (
              <motion.div
                key="thinking"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <ThinkingIndicator />
              </motion.div>
            )}

            {phase === "content" && (
              <motion.div
                key="content"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
              >
                {children}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {!isLast && phase === "content" && (
        <div ref={sentinelRef} className="h-px w-full" aria-hidden />
      )}
    </div>
  );
}
