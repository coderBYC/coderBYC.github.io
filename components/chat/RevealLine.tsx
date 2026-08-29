"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

export const LINE_STAGGER = 0.18;
export const LINE_DURATION = 0.38;
const ease = [0.25, 0.1, 0.25, 1] as const;

export function revealCompleteMs(lineCount: number) {
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
