export interface ProjectStep {
  title: string;
  description: string;
  input?: string;
  output?: string;
  note?: string;
}

export interface ProjectNarrativeBlock {
  type: "paragraph" | "highlight";
  content: string;
}

export interface ProjectPhase {
  title: string;
  subtitle: string;
  diagram?: string;
  diagramAlt?: string;
  diagramCaption?: string;
  narrative?: ProjectNarrativeBlock[];
  sections: {
    title: string;
    steps: ProjectStep[];
  }[];
}

export const projectPhases: Record<string, ProjectPhase[]> = {
  "cortex-memory": [
    {
      title: "Phase 1",
      subtitle: "Memory Retrieval Research",
      diagram: "/projects/cortex-phase1-diagram.png",
      diagramAlt:
        "Cortex Phase 1 system diagram showing ingestion and retrieval pipelines",
      diagramCaption: "Cortex Phase 1 — Ingestion & Retrieval",
      sections: [
        {
          title: "Ingestion Layer",
          steps: [
            {
              title: "1. Conversation Input",
              description:
                "Unstructured natural language enters the pipeline from user or agent conversations.",
            },
            {
              title: "2. Memory Extraction",
              description:
                "Convert unstructured language into structured memory objects. GBNF enforces JSON grammar so every extraction is schema-valid.",
              input: "I transferred from NTU to UMich.",
              output: `{
  "memory_type": "fact",
  "content": "Transferred from NTU to UMich"
}`,
            },
            {
              title: "3. Jaro-Winkler Deduplication",
              description:
                "Avoid duplication by computing similarity between entities before anything is stored.",
            },
            {
              title: "4. FastEmbed",
              description:
                "Convert meaning into a searchable vector representation.",
              input: "I transferred from NTU to UMich",
              output: "[0.12, -0.44, 0.91, ...]  // 384 dimensions",
            },
            {
              title: "5. SQLite Storage",
              description:
                "Persist each memory with its text, embedding, timestamp, and metadata in a local SQLite database.",
            },
            {
              title: "6. FTS5 + sqlite-vec Index",
              description:
                "Index memories for both lexical full-text search and vector similarity search inside SQLite.",
            },
          ],
        },
        {
          title: "Retrieval Layer",
          steps: [
            {
              title: "1. Hybrid Search",
              description:
                "When a user or agent queries memory, run FTS5 and vector search in parallel — think of it as AI search and Google search, both inside SQLite.",
            },
            {
              title: "2. RRF (Reciprocal Rank Fusion)",
              description:
                "Combine lexical and semantic retrieval scores. RRF is one of the strongest retrieval fusion techniques used today.",
            },
            {
              title: "3. Time Decay",
              description:
                "Prefer recent memories unless the memory type is a durable fact.",
            },
            {
              title: "4. Top K",
              description:
                "Keep only the top-ranked results to avoid context overflow in downstream LLM calls.",
            },
            {
              title: "5. Prompt Injection",
              description:
                "Inject the selected memories into the agent prompt as structured context for the final answer.",
            },
          ],
        },
      ],
    },
    {
      title: "Phase 2",
      subtitle: "Connecting To Users — A Product Vision",
      narrative: [
        {
          type: "paragraph",
          content:
            "Current products failed to connect to customers. Nobody gives a shit about RRF, vector retrieval, etc. The numbers mean nothing in front of users.",
        },
        {
          type: "highlight",
          content:
            "My proposal is to create a product that explores something most startups did not answer: memory ownership.",
        },
        {
          type: "paragraph",
          content:
            "I'm building Programmable Memory OS — we let users define what gets remembered, what gets forgotten.",
        },
      ],
      sections: [],
    },
  ],
};
