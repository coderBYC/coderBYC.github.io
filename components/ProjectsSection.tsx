"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { FiArrowRight } from "react-icons/fi";
import { projects } from "@/lib/data";

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.45,
      ease: [0.25, 0.1, 0.25, 1] as const,
    },
  },
};

export default function ProjectsSection() {
  return (
    <section id="projects" className="w-full">
      <div className="flex flex-col gap-5">
        {projects.map((project, index) => (
          <motion.div
            key={project.id}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-40px" }}
            variants={cardVariants}
            transition={{ delay: index * 0.1 }}
          >
            <Link
              href={`/projects/${project.id}`}
              className="group block border-2 border-black bg-white p-5 shadow-[5px_5px_0_0_#000] transition-all duration-200 hover:translate-x-[3px] hover:translate-y-[3px] hover:shadow-[2px_2px_0_0_#000] md:p-6"
            >
              <div className="flex items-start gap-4 md:gap-5">
                <div className="relative h-14 w-14 shrink-0 overflow-hidden border-2 border-black shadow-[3px_3px_0_0_#000] md:h-16 md:w-16">
                  <Image
                    src={project.icon}
                    alt={project.title}
                    fill
                    className="object-cover"
                  />
                </div>

                <div className="min-w-0 flex-1">
                  <p className="text-xs tracking-wide text-black/40 md:text-sm">
                    {project.date}
                  </p>
                  <div className="mt-1 flex items-center justify-between gap-3">
                    <h3 className="text-lg tracking-wide text-black md:text-xl">
                      {project.title}
                    </h3>
                    <FiArrowRight className="h-4 w-4 shrink-0 text-black/30 transition-transform duration-200 group-hover:translate-x-1 group-hover:text-black" />
                  </div>
                  <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-black/55">
                    {project.description}
                  </p>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
