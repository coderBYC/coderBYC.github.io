"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { FiArrowRight } from "react-icons/fi";
import { projects } from "@/lib/data";

const ROW_STAGGER = 0.32;

function itemDelay(index: number, step: "dot" | "card" | "line") {
  const base = 0.1 + index * ROW_STAGGER;
  if (step === "dot") return base;
  if (step === "card") return base + 0.1;
  return base + 0.28;
}

const ease = [0.25, 0.1, 0.25, 1] as const;

export default function ProjectsSection() {
  return (
    <section id="projects" className="w-full">
      <div className="flex flex-col">
        {projects.map((project, index) => {
          const isLast = index === projects.length - 1;

          return (
            <div key={project.id} className="flex gap-3">
              <div className="flex w-4 shrink-0 flex-col items-center">
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  whileInView={{ scale: 1, opacity: 1 }}
                  viewport={{ once: true, margin: "-20px" }}
                  transition={{ delay: itemDelay(index, "dot"), duration: 0.28, ease }}
                  className="z-10 h-2.5 w-2.5 shrink-0 rounded-full border-2 border-black bg-white"
                />
                {!isLast && (
                  <motion.div
                    initial={{ scaleY: 0, opacity: 0 }}
                    whileInView={{ scaleY: 1, opacity: 1 }}
                    viewport={{ once: true, margin: "-20px" }}
                    transition={{ delay: itemDelay(index, "line"), duration: 0.42, ease }}
                    className="w-px flex-1 origin-top bg-black/25"
                    style={{ minHeight: "1.25rem" }}
                  />
                )}
              </div>

              <motion.div
                initial={{ opacity: 0, x: -12 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-20px" }}
                transition={{ delay: itemDelay(index, "card"), duration: 0.32, ease }}
                className={`min-w-0 flex-1 ${isLast ? "" : "pb-2"}`}
              >
                <Link
                  href={`/projects/${project.id}`}
                  className="group block border-2 border-black bg-white p-2.5 shadow-[3px_3px_0_0_#000] transition-all duration-200 hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[1px_1px_0_0_#000]"
                >
                  <div className="flex items-center gap-3">
                    <div className="relative h-9 w-9 shrink-0 overflow-hidden">
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
              </motion.div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
