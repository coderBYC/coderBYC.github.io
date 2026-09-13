import Image from "next/image";
import { FiExternalLink, FiGithub } from "react-icons/fi";
import TechPill from "@/components/TechPill";
import ProjectPhaseContent from "@/components/ProjectPhaseContent";
import type { Project } from "@/lib/data";
import type { ProjectPhase } from "@/lib/project-content";

export default function ProjectDetail({
  project,
  phases,
}: {
  project: Project;
  phases?: ProjectPhase[];
}) {
  return (
    <>
      <article className="border-2 border-black bg-white p-6 shadow-[8px_8px_0_0_#000] md:p-8">
        <div className="mb-8 flex items-start gap-5">
          <div
            className={`relative h-16 w-16 shrink-0 overflow-hidden md:h-20 md:w-20 ${
              project.id === "cortex-memory"
                ? ""
                : "border-2 border-black shadow-[3px_3px_0_0_#000]"
            }`}
          >
            <Image
              src={project.icon}
              alt={project.title}
              fill
              className={
                project.id === "cortex-memory" ? "object-contain" : "object-cover"
              }
            />
          </div>
          <div>
            <p className="text-sm text-black/45">{project.date}</p>
            <h1 className="mt-1 text-3xl tracking-wide text-black md:text-4xl">
              {project.title}
            </h1>
          </div>
        </div>

        <p className="mb-8 text-lg leading-relaxed text-black/65">
          {project.description}
        </p>

        {project.youtubeId && (
          <div className="mb-8 overflow-hidden border-2 border-black shadow-[4px_4px_0_0_#000]">
            <iframe
              className="aspect-video w-full"
              src={`https://www.youtube.com/embed/${project.youtubeId}`}
              title={`${project.title} video`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
            />
          </div>
        )}

        <div className="mb-8 flex flex-wrap gap-2">
          {project.tech.map((tech) => (
            <TechPill key={tech} name={tech} />
          ))}
        </div>

        <div className="flex flex-wrap gap-3">
          {project.url && (
            <a
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 border-2 border-black bg-white px-5 py-2.5 text-sm text-black shadow-[4px_4px_0_0_#000] transition-all duration-200 hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0_0_#000]"
            >
              <FiExternalLink className="h-4 w-4" />
              Visit Project
            </a>
          )}
          {project.githubUrl && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 border-2 border-black bg-white px-5 py-2.5 text-sm text-black shadow-[4px_4px_0_0_#000] transition-all duration-200 hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0_0_#000]"
            >
              <FiGithub className="h-4 w-4" />
              GitHub
            </a>
          )}
        </div>
      </article>

      {phases?.map((phase) => (
        <div
          key={phase.title}
          className="mt-8 border-2 border-black bg-white p-6 shadow-[8px_8px_0_0_#000] md:p-8"
        >
          <ProjectPhaseContent phase={phase} />
        </div>
      ))}
    </>
  );
}
