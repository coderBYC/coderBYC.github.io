import Link from "next/link";
import { notFound } from "next/navigation";
import { FiArrowLeft } from "react-icons/fi";
import ProjectDetail from "@/components/ProjectDetail";
import { getAllProjectIds, getProjectById } from "@/lib/projects";
import { projectPhases } from "@/lib/project-content";

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

  const phases = projectPhases[id];

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

        <ProjectDetail project={project} phases={phases} />
      </div>
    </main>
  );
}
