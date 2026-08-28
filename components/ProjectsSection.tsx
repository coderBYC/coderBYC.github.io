"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { FiArrowRight } from "react-icons/fi";
import { projects } from "@/lib/data";

const cardVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.35,
      ease: [0.25, 0.1, 0.25, 1] as const,
    },
  },
};

export default function ProjectsSection() {
  return (
    <section id="projects" className="w-full">
      <div className="flex flex-col gap-2">
        {projects.map((project, index) => (
          <motion.div
            key={project.id}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-20px" }}
            variants={cardVariants}
            transition={{ delay: index * 0.05 }}
          >
            <Link
              href={`/projects/${project.id}`}
              className="group block border-2 border-black bg-white p-2.5 shadow-[3px_3px_0_0_#000] transition-all duration-200 hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[1px_1px_0_0_#000]"
            >
              <div className="flex items-center gap-3">
                <div className="relative h-9 w-9 shrink-0 overflow-hidden border-2 border-black shadow-[2px_2px_0_0_#000]">
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
                  <p className="truncate text-xs text-black/45">{project.date}</p>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
