"use client";

import Image from "next/image";
import { skills } from "@/lib/data";

const introBullets = [
  "Sophomore at Umich",
  "Mechanical Engineering major and minor in CS",
  "Made in Taipei, Taiwan 🇹🇼",
];

export function IntroResponse() {
  return (
    <div className="flex flex-col gap-10 md:flex-row md:items-start md:justify-between">
      <div className="min-w-0 flex-1">
        <p className="mb-4 text-lg text-black/90">I am Bryan Chen:</p>
        <ul className="space-y-2 text-base text-black/65">
          {introBullets.map((item) => (
            <li key={item} className="flex gap-3">
              <span className="text-black/30">—</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="flex shrink-0 justify-center md:justify-end">
        <div className="relative h-40 w-40 overflow-hidden rounded-full border border-black/10 md:h-48 md:w-48">
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
