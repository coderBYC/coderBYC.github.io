"use client";

import { useEffect, useState } from "react";
import { fetchAnnArborWeather, type AnnArborWeather } from "@/lib/weather";
import type { ChatSectionConfig } from "@/lib/data";

export default function AeroGlassNav({
  sections,
  activeId,
  onSelect,
  onStyle,
}: {
  sections: ChatSectionConfig[];
  activeId: string;
  onSelect: (index: number) => void;
  onStyle?: () => void;
}) {
  const [weather, setWeather] = useState<AnnArborWeather | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetchAnnArborWeather()
      .then((next) => {
        if (!cancelled) setWeather(next);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  const weatherIndex = sections.findIndex((section) => section.id === "weather");

  return (
    <aside className="aero-glass-nav" aria-label="Sections">
      <button
        type="button"
        className={`aero-glass-weather${activeId === "weather" ? " is-active" : ""}`}
        onClick={() => weatherIndex >= 0 && onSelect(weatherIndex)}
      >
        <span>Ann Arbor</span>
        <strong>{weather ? `${weather.temp}°` : "—"}</strong>
        <span>{weather?.label ?? "Weather"}</span>
      </button>
      <div className="aero-glass-divider" />
      {sections.map((section, index) => (
        <button
          key={section.id}
          type="button"
          className={activeId === section.id ? "is-active" : ""}
          onClick={() => onSelect(index)}
        >
          {section.navLabel}
        </button>
      ))}
      <button type="button" onClick={onStyle}>
        Style
      </button>
    </aside>
  );
}
