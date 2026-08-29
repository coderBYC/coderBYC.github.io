"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { FiArrowRight } from "react-icons/fi";
import { projects } from "@/lib/data";
import { RevealLine } from "@/components/chat/RevealLine";

const ease = [0.25, 0.1, 0.25, 1] as const;

export default function ProjectsSection({ lineOffset = 0 }: { lineOffset?: number }) {
  return (
    <section id="projects" className="w-full pb-3">
      <div className="flex flex-col">
        {projects.map((project, index) => {
          const isLast = index === projects.length - 1;
          const lineIndex = lineOffset + index;

          return (
            <RevealLine key={project.id} index={lineIndex}>
              <div className="flex gap-3">
                <div className="flex w-4 shrink-0 flex-col items-center">
                  <div className="z-10 h-2.5 w-2.5 shrink-0 rounded-full border-2 border-black bg-white" />
                  {!isLast && (
                    <motion.div
                      initial={{ scaleY: 0 }}
                      animate={{ scaleY: 1 }}
                      transition={{
                        delay: lineIndex * 0.18 + 0.28,
                        duration: 0.42,
                        ease,
                      }}
                      className="w-px flex-1 origin-top bg-black/25"
                      style={{ minHeight: "1rem" }}
                    />
                  )}
                </div>

                <div className={`min-w-0 flex-1 ${isLast ? "pb-1" : "pb-1.5"}`}>
                  <Link
                    href={`/projects/${project.id}`}
                    className="group block border-2 border-black bg-white p-2 shadow-[3px_3px_0_0_#000] transition-all duration-200 hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[1px_1px_0_0_#000]"
                  >
                    <div className="flex items-center gap-3">
                      <div className="relative h-8 w-8 shrink-0 overflow-hidden">
                        <Image
                          src={project.icon}
                          alt={project.title}
                          fill
                          className="object-cover"
                        />
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-2">
                          <h3 className="truncate text-sm tracking-wide text-black">
                            {project.title}
                          </h3>
                          <FiArrowRight className="h-3.5 w-3.5 shrink-0 text-black/30 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:text-black" />
                        </div>
                        <p className="truncate text-xs text-black/45">
                          {project.date}
                        </p>
                      </div>
                    </div>
                  </Link>
                </div>
              </div>
            </RevealLine>
          );
        })}
      </div>
    </section>
  );
}
