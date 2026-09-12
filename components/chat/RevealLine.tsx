"use client";

import { createContext, useContext, type ReactNode } from "react";
import { motion } from "framer-motion";

export const LINE_STAGGER = 0.18;
export const LINE_DURATION = 0.38;
const ease = [0.25, 0.1, 0.25, 1] as const;

const SkipAnimationContext = createContext(false);

export function SkipAnimationProvider({
  skip,
  children,
}: {
  skip: boolean;
  children: ReactNode;
}) {
  return (
    <SkipAnimationContext.Provider value={skip}>
      {children}
    </SkipAnimationContext.Provider>
  );
}

export function useSkipAnimation() {
  return useContext(SkipAnimationContext);
}

export function revealCompleteMs(lineCount: number, skip = false) {
  if (skip) return 0;
  return ((lineCount - 1) * LINE_STAGGER + LINE_DURATION) * 1000 + 80;
}

export function RevealLine({
  index,
  children,
  className,
}: {
  index: number;
  children: ReactNode;
  className?: string;
}) {
  const skip = useSkipAnimation();

  if (skip) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        delay: index * LINE_STAGGER,
        duration: LINE_DURATION,
        ease,
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
