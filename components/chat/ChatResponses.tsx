"use client";

import Image from "next/image";
import { RevealLine } from "./RevealLine";

export function AboutResponse() {
  return (
    <div className="flex flex-col gap-10 md:flex-row md:items-start md:justify-between">
      <div className="min-w-0 flex-1 space-y-3 text-base leading-relaxed text-black/70">
        <RevealLine index={0}>
          <p className="text-lg text-black/90">
            Hi, I&apos;m Bryan. I&apos;m an international student from Taipei 🇹🇼.
          </p>
        </RevealLine>
        <RevealLine index={1}>
          <p>
            I have great passion in physics, tech startups, products, geopolitics,
            and art.
          </p>
        </RevealLine>
        <RevealLine index={2}>
          <p>I love building stuff, both hardware and software!</p>
        </RevealLine>
      </div>

      <RevealLine index={3} className="flex shrink-0 justify-center md:justify-end">
        <div className="relative h-40 w-40 overflow-hidden rounded-full border border-black/10 md:h-48 md:w-48">
          <Image
            src="/portrait.png"
            alt="Bryan Chen"
            fill
            className="object-cover object-top"
            priority
          />
        </div>
      </RevealLine>
    </div>
  );
}

export function EducationResponse() {
  return (
    <div className="space-y-6 text-base leading-relaxed text-black/70">
      <RevealLine index={0}>
        <div className="flex items-start gap-4">
          <img
            src="/education/umich.png"
            alt="University of Michigan seal"
            className="h-16 w-16 shrink-0 object-contain"
          />
          <div>
            <p className="text-lg font-bold text-black/90">
              University of Michigan, B.S.E. (2025-2029)
            </p>
            <p className="mt-1">Mechanical Engineering + Computer Science</p>
            <p>MProduct</p>
            <p>Michigan Data Science Team</p>
          </div>
        </div>
      </RevealLine>
      <RevealLine index={1}>
        <div className="flex items-start gap-4">
          <img
            src="/education/ntnu.png"
            alt="Affiliated High School of NTNU emblem"
            className="h-16 w-16 shrink-0 object-contain"
          />
          <div>
            <p className="text-lg font-bold text-black/90">
              Affiliated High School of NTNU
            </p>
            <p className="mt-1">#2 best high school in Taipei.</p>
            <p>Programming Club</p>
            <p>Model United Nations</p>
          </div>
        </div>
      </RevealLine>
    </div>
  );
}
