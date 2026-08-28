"use client";

import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface ChatTurnProps {
  question: string;
  showQuestion: boolean;
  showContent: boolean;
  onSectionComplete?: () => void;
  isLast?: boolean;
  children: React.ReactNode;
}

export default function ChatTurn({
  question,
  showQuestion,
  showContent,
  onSectionComplete,
  isLast = false,
  children,
}: ChatTurnProps) {
  const sentinelRef = useRef<HTMLDivElement>(null);
  const triggeredRef = useRef(false);

  useEffect(() => {
    if (!showContent || isLast || !onSectionComplete) return;

    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !triggeredRef.current) {
          triggeredRef.current = true;
          onSectionComplete();
        }
      },
      { threshold: 0.9, rootMargin: "0px 0px -10% 0px" }
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [showContent, isLast, onSectionComplete]);

  return (
    <div className="relative min-h-screen">
      <div className="mx-auto max-w-5xl px-6 py-20 md:px-8 md:py-28">
        <AnimatePresence>
          {showQuestion && (
            <motion.div
              initial={{ opacity: 0, x: 20, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
              className="mb-8 flex justify-end md:hidden"
            >
              <div className="w-fit max-w-[85%] rounded-2xl rounded-br-md bg-black px-4 py-2.5 text-sm tracking-wide text-white">
                {question}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex gap-6 md:gap-12">
          <div className="min-w-0 flex-1">
            <AnimatePresence>
              {showContent && (
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
                >
                  {children}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="relative hidden w-44 shrink-0 md:block lg:w-52">
            <AnimatePresence>
              {showQuestion && (
                <motion.div
                  initial={{ opacity: 0, x: 20, scale: 0.95 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
                  className="sticky top-28 lg:top-32"
                >
                  <div className="ml-auto w-fit max-w-full rounded-2xl rounded-br-md bg-black px-4 py-2.5 text-sm tracking-wide text-white">
                    {question}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {!isLast && <div ref={sentinelRef} className="h-px w-full" aria-hidden />}
    </div>
  );
}
