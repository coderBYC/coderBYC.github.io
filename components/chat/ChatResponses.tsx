"use client";

import Image from "next/image";

const introBullets = [
  "Sophomore at University of Michigan",
  "Major in Mechanical Engineering, Minor in Computer Science",
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
            src="/portrait.png"
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
