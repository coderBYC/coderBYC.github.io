"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { applyStyle, siteStyles, type SiteStyle } from "@/lib/theme";

interface StylePickerProps {
  initialIndex?: number;
  canDismiss?: boolean;
  onComplete: (style: SiteStyle) => void;
  onDismiss?: () => void;
}

export default function StylePicker({
  initialIndex = 0,
  canDismiss = false,
  onComplete,
  onDismiss,
}: StylePickerProps) {
  const [index, setIndex] = useState(initialIndex);
  const [phase, setPhase] = useState<"select" | "install">("select");
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    document.body.dataset.stylePicker = "open";
    return () => {
      delete document.body.dataset.stylePicker;
    };
  }, []);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (phase === "install") {
        event.preventDefault();
        return;
      }

      if (event.key === "ArrowDown" || event.key === "j") {
        event.preventDefault();
        setIndex((current) => (current + 1) % siteStyles.length);
      } else if (event.key === "ArrowUp" || event.key === "k") {
        event.preventDefault();
        setIndex((current) => (current - 1 + siteStyles.length) % siteStyles.length);
      } else if (event.key === "Enter") {
        event.preventDefault();
        setPhase("install");
      } else if (event.key === "Escape" && canDismiss) {
        event.preventDefault();
        onDismiss?.();
      }
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [phase, canDismiss, onDismiss]);

  useEffect(() => {
    if (phase !== "install") return;

    const started = performance.now();
    const duration = 900;
    let frame = 0;

    const tick = (now: number) => {
      const next = Math.min(100, ((now - started) / duration) * 100);
      setProgress(next);
      if (next < 100) {
        frame = requestAnimationFrame(tick);
      } else {
        const style = siteStyles[index].id;
        applyStyle(style);
        window.setTimeout(() => onComplete(style), 180);
      }
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [phase, index, onComplete]);

  const filled = Math.round(progress / 5);
  const bar = `${"█".repeat(filled)}${"░".repeat(20 - filled)}`;

  return (
    <motion.div
      className="style-picker fixed inset-0 z-[120] flex items-center justify-center bg-white px-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="w-full max-w-2xl overflow-hidden rounded-xl border border-black/10 bg-[#f5f5f5] shadow-2xl">
        <div className="flex items-center gap-2 border-b border-black/10 bg-[#ebebeb] px-4 py-3">
          <div className="h-3 w-3 rounded-full bg-[#ff5f57]" />
          <div className="h-3 w-3 rounded-full bg-[#febc2e]" />
          <div className="h-3 w-3 rounded-full bg-[#28c840]" />
          <span className="ml-3 font-mono text-xs text-black/40">
            Terminal — select_style
          </span>
        </div>

        <div className="space-y-4 p-6 font-mono text-sm leading-relaxed text-black md:p-8 md:text-base">
          <p className="text-black/45">
            <span className="text-[#1a7f37]">bryan@macbook</span>
            <span className="text-black/35"> ~ %</span> select_style
          </p>
          <p>Choose an interface. ↑↓ move, enter install.</p>

          <div className="space-y-1" role="listbox" aria-label="Site style">
            {siteStyles.map((style, styleIndex) => {
              const active = styleIndex === index;
              return (
                <button
                  key={style.id}
                  type="button"
                  role="option"
                  aria-selected={active}
                  onMouseEnter={() => phase === "select" && setIndex(styleIndex)}
                  onClick={() => {
                    setIndex(styleIndex);
                    setPhase("install");
                  }}
                  className={`flex w-full items-baseline gap-3 px-2 py-1 text-left ${
                    active ? "bg-black text-white" : "text-black/80"
                  }`}
                >
                  <span className="w-4 shrink-0">{active ? "❯" : " "}</span>
                  <span className="w-36 shrink-0">{style.label}</span>
                  <span className={active ? "text-white/70" : "text-black/40"}>
                    {style.hint}
                  </span>
                </button>
              );
            })}
          </div>

          {phase === "install" ? (
            <p>
              installing {siteStyles[index].label}
              <span className="mt-2 block tracking-wider">[{bar}] {Math.round(progress)}%</span>
            </p>
          ) : (
            <p className="text-black/40">
              {canDismiss ? "esc cancel" : "pick one to continue"}
            </p>
          )}
        </div>
      </div>
    </motion.div>
  );
}
