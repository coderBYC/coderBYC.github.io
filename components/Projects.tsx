"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { FiExternalLink, FiGithub } from "react-icons/fi";
import FadeIn from "./FadeIn";
import TechPill from "./TechPill";
import { projects } from "@/lib/data";

export default function Projects() {
  return (
    <section id="projects" className="py-32 md:py-40">
      <div className="mx-auto max-w-5xl px-6 md:px-8">
        <FadeIn>
          <h2 className="mb-20 text-sm uppercase tracking-[0.2em] text-white/40">
            Projects
          </h2>
        </FadeIn>

        <div className="relative">
          <div className="absolute left-[7px] top-2 bottom-2 w-px bg-white/15 md:left-[11px]" />

          <div className="flex flex-col gap-16 md:gap-24">
            {projects.map((project, index) => (
              <FadeIn key={project.id} delay={index * 0.05}>
                <div className="group relative pl-10 md:pl-14">
                  <motion.div
                    className="absolute left-0 top-2 h-[15px] w-[15px] overflow-hidden rounded-full border border-white/40 bg-black md:h-[23px] md:w-[23px]"
                    whileHover={{
                      scale: 1.2,
                      borderColor: "rgba(255,255,255,0.8)",
                    }}
                    transition={{ duration: 0.2 }}
                  >
                    <Image
                      src={project.icon}
                      alt=""
                      fill
                      className="object-cover"
                    />
                  </motion.div>

                  <div className="flex flex-col gap-4 transition-opacity duration-300 group-hover:opacity-100">
                    <p className="text-sm tracking-wide text-white/40">
                      {project.date}
                    </p>

                    <div className="flex flex-wrap items-center gap-4">
                      <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-lg border border-white/10 md:hidden">
                        <Image
                          src={project.icon}
                          alt={project.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex flex-wrap items-center gap-3">
                        <h3 className="text-xl font-medium tracking-wide text-white md:text-2xl">
                          {project.title}
                        </h3>
                        {project.url && (
                          <a
                            href={project.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-white/30 transition-colors duration-300 hover:text-white/70"
                            aria-label={`Visit ${project.title}`}
                          >
                            <FiExternalLink className="h-4 w-4" />
                          </a>
                        )}
                      </div>
                    </div>

                    <p className="max-w-xl text-base leading-relaxed tracking-wide text-white/50">
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
                          className="inline-flex items-center gap-2 rounded-full border border-white/20 px-4 py-2 text-sm tracking-wide text-white/60 transition-all duration-300 hover:border-white/50 hover:bg-white/5 hover:text-white"
                        >
                          <FiGithub className="h-4 w-4" />
                          GitHub
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
