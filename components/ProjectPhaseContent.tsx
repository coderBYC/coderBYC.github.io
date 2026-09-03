import Image from "next/image";
import type { ProjectPhase } from "@/lib/project-content";

function CodeBlock({ children }: { children: string }) {
  return (
    <pre className="overflow-x-auto border-2 border-black bg-[#f8f8f8] p-4 text-sm leading-relaxed text-black/80 shadow-[3px_3px_0_0_#000]">
      <code>{children}</code>
    </pre>
  );
}

export default function ProjectPhaseContent({ phase }: { phase: ProjectPhase }) {
  return (
    <div className="space-y-10">
      <div>
        <p className="text-sm tracking-wide text-black/45">{phase.title}</p>
        <h2 className="mt-1 text-2xl tracking-wide text-black md:text-3xl">
          {phase.subtitle}
        </h2>
      </div>

      {phase.diagram && (
        <figure>
          <div className="relative aspect-[4/3] w-full">
            <Image
              src={phase.diagram}
              alt={phase.diagramAlt ?? "System diagram"}
              fill
              className="object-contain"
            />
          </div>
          <figcaption className="mt-3 text-center text-xs tracking-wide text-black/45">
            {phase.diagramCaption ?? "System diagram"}
          </figcaption>
        </figure>
      )}

      {phase.narrative && phase.narrative.length > 0 && (
        <div className="space-y-5">
          {phase.narrative.map((block, index) =>
            block.type === "highlight" ? (
              <p
                key={index}
                className="border-2 border-black bg-black px-5 py-4 text-base leading-relaxed text-white shadow-[4px_4px_0_0_#000] md:text-lg"
              >
                {block.content}
              </p>
            ) : (
              <p
                key={index}
                className="text-base leading-relaxed text-black/70 md:text-lg"
              >
                {block.content}
              </p>
            )
          )}
        </div>
      )}

      {phase.sections.map((section) => (
        <section key={section.title} className="space-y-5">
          <h3 className="text-lg tracking-wide text-black md:text-xl">
            {section.title}
          </h3>

          <div className="space-y-6">
            {section.steps.map((step) => (
              <div
                key={step.title}
                className="border-2 border-black bg-white p-5 shadow-[4px_4px_0_0_#000]"
              >
                <h4 className="text-base tracking-wide text-black">{step.title}</h4>
                <p className="mt-2 text-sm leading-relaxed text-black/65">
                  {step.description}
                </p>

                {step.input && (
                  <div className="mt-4 space-y-2">
                    <p className="text-xs font-bold tracking-wide text-black/45">
                      Input
                    </p>
                    <CodeBlock>{step.input}</CodeBlock>
                  </div>
                )}

                {step.output && (
                  <div className="mt-4 space-y-2">
                    <p className="text-xs font-bold tracking-wide text-black/45">
                      Output
                    </p>
                    <CodeBlock>{step.output}</CodeBlock>
                  </div>
                )}

                {step.note && (
                  <p className="mt-3 text-sm text-black/50">{step.note}</p>
                )}
              </div>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
