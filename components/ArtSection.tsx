"use client";

import Image from "next/image";
import { artworks } from "@/lib/data";
import { RevealLine } from "@/components/chat/RevealLine";

export default function ArtSection({ lineOffset = 0 }: { lineOffset?: number }) {
  return (
    <section id="art" className="w-full">
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4 md:gap-3">
        {artworks.map((artwork, index) => (
          <RevealLine key={artwork.id} index={lineOffset + index}>
            <figure className="overflow-hidden border-2 border-black bg-white shadow-[2px_2px_0_0_#000]">
              <div className="relative aspect-square w-full bg-white">
                <Image
                  src={artwork.src}
                  alt={artwork.title}
                  fill
                  sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 25vw"
                  className="object-cover"
                />
              </div>
              <figcaption className="truncate border-t-2 border-black px-1.5 py-1 text-[10px] tracking-wide text-black/60 sm:text-xs">
                {artwork.title}
              </figcaption>
            </figure>
          </RevealLine>
        ))}
      </div>
    </section>
  );
}
