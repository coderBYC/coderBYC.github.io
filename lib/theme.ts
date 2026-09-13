export const STYLE_KEY = "bryan-website-style";

export type SiteStyle = "brutalist" | "retro" | "aero";

export const siteStyles: {
  id: SiteStyle;
  label: string;
  hint: string;
}[] = [
  {
    id: "brutalist",
    label: "neo-brutalist",
    hint: "hard borders, offset shadow",
  },
  {
    id: "retro",
    label: "80s retro",
    hint: "crt, neon, scanlines",
  },
  {
    id: "aero",
    label: "frutiger aero",
    hint: "glass, sky, gloss",
  },
];

export function isSiteStyle(value: string | null): value is SiteStyle {
  return value === "brutalist" || value === "retro" || value === "aero";
}

export function loadStyle(): SiteStyle | null {
  if (typeof window === "undefined") return null;
  const stored = localStorage.getItem(STYLE_KEY);
  return isSiteStyle(stored) ? stored : null;
}

export function applyStyle(style: SiteStyle) {
  document.documentElement.dataset.theme = style;
  localStorage.setItem(STYLE_KEY, style);
}
