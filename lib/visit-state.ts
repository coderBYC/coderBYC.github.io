const CHAT_VISIT_KEY = "bryan-website-chat-visit";

export interface ChatVisitState {
  visitedIds: string[];
  maxUnlocked: number;
  activeSlide: number;
}

export function loadChatVisit(): ChatVisitState | null {
  if (typeof window === "undefined") return null;

  try {
    const raw = sessionStorage.getItem(CHAT_VISIT_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as ChatVisitState;
    if (!Array.isArray(parsed.visitedIds)) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function saveChatVisit(state: ChatVisitState) {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(CHAT_VISIT_KEY, JSON.stringify(state));
}

export function hasVisitedChat() {
  return loadChatVisit() !== null;
}
