"use client";

import { useEffect, useRef, type RefObject } from "react";
import { createPortal } from "react-dom";
import ProjectDetail from "@/components/ProjectDetail";
import { projectPhases } from "@/lib/project-content";
import { getProjectById } from "@/lib/projects";

export default function AeroProjectWindow({
  projectId,
  onClose,
  originRef,
}: {
  projectId: string;
  onClose: () => void;
  originRef: RefObject<HTMLElement | null>;
}) {
  const frameRef = useRef<HTMLDivElement>(null);
  const project = getProjectById(projectId);

  useEffect(() => {
    const frame = frameRef.current;
    const icon = originRef.current;
    if (!frame) return;

    const place = (tries = 0) => {
      const frameRect = frame.getBoundingClientRect();
      const iconRect = icon?.getBoundingClientRect();
      if ((!iconRect || iconRect.width === 0 || frameRect.width === 0) && tries < 8) {
        window.requestAnimationFrame(() => place(tries + 1));
        return;
      }
      if (iconRect && iconRect.width > 0) {
        const x = iconRect.left + iconRect.width / 2 - frameRect.left;
        const y = iconRect.top + iconRect.height / 2 - frameRect.top;
        frame.style.setProperty("--aero-origin-x", `${x}px`);
        frame.style.setProperty("--aero-origin-y", `${y}px`);
      }
      frame.classList.add("is-opening");
    };

    const frameId = window.requestAnimationFrame(() => place());
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.cancelAnimationFrame(frameId);
      window.removeEventListener("keydown", onKey);
    };
  }, [projectId, onClose, originRef]);

  if (!project || typeof document === "undefined") return null;

  return createPortal(
    <div className="aero-project-layer">
      <div ref={frameRef} className="aero-frame aero-project-window" role="dialog" aria-modal="true">
        <div className="aero-titlebar">
          <div className="aero-title">{project.title}</div>
          <div className="aero-controls">
            <button type="button" className="aero-btn min" aria-label="Minimize" />
            <button
              type="button"
              className="aero-btn close"
              onClick={onClose}
              aria-label="Close"
            />
          </div>
        </div>
        <div className="aero-client">
          <div className="aero-project-body">
            <ProjectDetail project={project} phases={projectPhases[projectId]} />
          </div>
        </div>
        <div className="aero-statusbar">
          <span>Internet Explorer</span>
          <span>{project.title}</span>
        </div>
      </div>
    </div>,
    document.body
  );
}
