"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import ChatConversation from "./ChatConversation";
import StylePicker from "./StylePicker";
import TerminalIntro from "./TerminalIntro";
import { applyStyle, loadStyle } from "@/lib/theme";

const INTRO_SEEN_KEY = "bryan-website-terminal-intro-seen-at";
const RECENT_MS = 1000 * 60 * 60 * 24;

function hasSeenIntroRecently() {
  const seenAt = localStorage.getItem(INTRO_SEEN_KEY);
  if (!seenAt) return false;
  const timestamp = Number(seenAt);
  if (Number.isNaN(timestamp)) return true;
  return Date.now() - timestamp < RECENT_MS;
}

type Gate = "boot" | "pick" | "chat";

export default function PageContent() {
  const [gate, setGate] = useState<Gate | null>(null);
  const [styleOpen, setStyleOpen] = useState(false);

  useEffect(() => {
    const saved = loadStyle();
    if (saved) applyStyle(saved);

    const seen = hasSeenIntroRecently();
    if (!saved) {
      setGate(seen ? "pick" : "boot");
      return;
    }

    setGate(seen ? "chat" : "boot");
  }, []);

  useEffect(() => {
    if (gate === null) return;
    document.body.style.overflow = gate === "chat" && !styleOpen ? "" : "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [gate, styleOpen]);

  const finishIntro = () => {
    localStorage.setItem(INTRO_SEEN_KEY, String(Date.now()));
    setGate("chat");
    setStyleOpen(false);
  };

  if (gate === null) {
    return <div className="fixed inset-0 bg-white" aria-hidden />;
  }

  return (
    <>
      <AnimatePresence>
        {gate === "boot" && (
          <TerminalIntro
            onComplete={() => {
              if (!loadStyle()) {
                setGate("pick");
                return;
              }
              finishIntro();
            }}
          />
        )}
        {(gate === "pick" || styleOpen) && (
          <StylePicker
            canDismiss={styleOpen}
            onDismiss={() => setStyleOpen(false)}
            onComplete={() => {
              if (gate === "pick") finishIntro();
              else setStyleOpen(false);
            }}
          />
        )}
      </AnimatePresence>

      {gate === "chat" && (
        <ChatConversation onOpenStylePicker={() => setStyleOpen(true)} />
      )}
    </>
  );
}
