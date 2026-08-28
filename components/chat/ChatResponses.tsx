"use client";

import Image from "next/image";
import { skills } from "@/lib/data";

export function IntroResponse() {
  return (
    <div className="grid grid-cols-1 items-center gap-12 md:grid-cols-2">
      <div className="flex flex-col gap-6">
        <div className="flex items-center gap-4">
          <h1 className="text-4xl tracking-wide text-black md:text-5xl">
            Bryan Chen
          </h1>
          <Image
            src="/umich.png"
            alt="University of Michigan"
            width={44}
            height={44}
            className="h-10 w-10 rounded-md object-cover"
          />
        </div>
        <p className="text-lg text-black/55">
          Mechanical Engineering Student at the University of Michigan
        </p>
        <div className="space-y-4 border-l border-black/15 pl-5">
          <p className="text-sm uppercase tracking-[0.2em] text-black/40">
            Who I Am
          </p>
          <p className="text-black/80">
            Product Person / First Principles Thinker
          </p>
        </div>
        <div className="space-y-4 border-l border-black/15 pl-5">
          <p className="text-sm uppercase tracking-[0.2em] text-black/40">
            I Like
          </p>
          <p className="text-black/60">
            Politics, Aesthetics, Physics, Startups, and Engineering
          </p>
        </div>
        <div className="space-y-3 pt-2">
          <p className="text-xl leading-relaxed text-black/90">
            I am a Sophomore Engineering student at the University of Michigan.
          </p>
          <p className="text-xl leading-relaxed text-black/50">
            I am obsessed with building products that people want.
          </p>
        </div>
      </div>
      <div className="flex justify-center md:justify-end">
        <div className="relative h-56 w-56 overflow-hidden rounded-full border border-black/10 md:h-64 md:w-64">
          <Image
            src="/portrait.jpg"
            alt="Bryan Chen"
            fill
            className="object-cover object-top"
            priority
          />
        </div>
      </div>
    </div>
  );
}

export function SkillsResponse() {
  return (
    <div className="flex flex-wrap gap-2">
      {skills.map((skill) => (
        <span
          key={skill}
          className="rounded-full border border-black/15 px-4 py-2 text-sm text-black/70 transition-colors hover:border-black/30 hover:text-black"
        >
          {skill}
        </span>
      ))}
    </div>
  );
}
