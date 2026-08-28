"use client";

import { useRef } from "react";
import Image from "next/image";
import {
  motion,
  useScroll,
  useTransform,
} from "framer-motion";
import { FiExternalLink, FiGithub } from "react-icons/fi";
import TechPill from "./TechPill";
import { projects, type Project } from "@/lib/data";

interface ProjectTimelineItemProps {
  project: Project;
}

function ProjectTimelineItem({ project }: ProjectTimelineItemProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "center center", "end start"],
  });

  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.88, 1.04, 0.88]);
  const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [0.35, 1, 0.35]);

  return (
    <motion.div
      ref={ref}
      style={{ scale, opacity }}
      className="origin-left py-6 md:py-10"
    >
      <div className="flex items-start gap-5 md:gap-8">
        <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl border border-black/10 bg-white md:h-20 md:w-20">
          <Image
            src={project.icon}
            alt={project.title}
            fill
            className="object-cover"
          />
        </div>

        <div className="relative min-w-0 flex-1 border-l border-black/10 pl-6 md:pl-10">
          <div className="absolute -left-[5px] top-2 h-[9px] w-[9px] rounded-full border border-black/30 bg-white md:-left-[6px] md:h-[11px] md:w-[11px]" />

          <div className="flex flex-col gap-4">
            <p className="text-sm tracking-wide text-black/40">{project.date}</p>

            <div className="flex flex-wrap items-center gap-3">
              <h3 className="text-xl font-medium tracking-wide text-black md:text-2xl">
                {project.title}
              </h3>
              {project.url && (
                <a
                  href={project.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-black/30 transition-colors duration-300 hover:text-black/70"
                  aria-label={`Visit ${project.title}`}
                >
                  <FiExternalLink className="h-4 w-4" />
                </a>
              )}
            </div>

            <p className="max-w-xl text-base leading-relaxed tracking-wide text-black/55">
              {project.description}
            </p>

            <div className="flex flex-wrap gap-2">
              {project.tech.map((tech) => (
                <TechPill key={tech} name={tech} />
              ))}
            </div>

            {project.githubUrl && (
              <div className="pt-2">
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border border-black/20 px-4 py-2 text-sm tracking-wide text-black/60 transition-all duration-300 hover:border-black/50 hover:bg-black/5 hover:text-black"
                >
                  <FiGithub className="h-4 w-4" />
                  GitHub
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function Projects() {
  return (
    <section id="projects" className="py-32 md:py-40">
      <div className="mx-auto max-w-5xl px-6 md:px-8">
        <h2 className="mb-20 text-sm uppercase tracking-[0.2em] text-black/40">
          Projects
        </h2>

        <div className="relative">
          <div className="absolute top-0 bottom-0 left-[4.75rem] w-px bg-black/10 md:left-[7rem]" />

          <div className="flex flex-col">
            {projects.map((project) => (
              <ProjectTimelineItem key={project.id} project={project} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
