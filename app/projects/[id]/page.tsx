import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { FiArrowLeft, FiExternalLink, FiGithub } from "react-icons/fi";
import TechPill from "@/components/TechPill";
import { getAllProjectIds, getProjectById } from "@/lib/projects";

export function generateStaticParams() {
  return getAllProjectIds().map((id) => ({ id }));
}

interface ProjectPageProps {
  params: Promise<{ id: string }>;
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { id } = await params;
  const project = getProjectById(id);

  if (!project) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-white px-6 py-12 md:px-8 md:py-16">
      <div className="mx-auto max-w-3xl">
        <Link
          href="/#projects"
          className="mb-10 inline-flex items-center gap-2 border-2 border-black bg-white px-4 py-2 text-sm text-black shadow-[4px_4px_0_0_#000] transition-all duration-200 hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0_0_#000]"
        >
          <FiArrowLeft className="h-4 w-4" />
          Back
        </Link>

        <article className="border-2 border-black bg-white p-6 shadow-[8px_8px_0_0_#000] md:p-8">
          <div className="mb-8 flex items-start gap-5">
            <div className="relative h-16 w-16 shrink-0 overflow-hidden border-2 border-black shadow-[3px_3px_0_0_#000] md:h-20 md:w-20">
              <Image
                src={project.icon}
                alt={project.title}
                fill
                className="object-cover"
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
      </div>
    </main>
  );
}
