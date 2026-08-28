"use client";

import Image from "next/image";

export default function BackgroundSection() {
  return (
    <section
      id="background"
      className="flex min-h-screen items-center py-24"
    >
      <div className="mx-auto grid w-full max-w-3xl grid-cols-1 items-center gap-16 px-6 md:grid-cols-2 md:px-8">
        <div className="flex flex-col gap-8">
          <div className="flex items-center gap-4">
            <h1 className="text-5xl tracking-wide text-black md:text-6xl">
              Bryan Chen
            </h1>
            <Image
              src="/umich.png"
              alt="University of Michigan"
              width={48}
              height={48}
              className="h-10 w-10 rounded-md object-cover md:h-12 md:w-12"
            />
          </div>

          <p className="text-lg tracking-wide text-black/50 md:text-xl">
            Mechanical Engineering Student at the University of Michigan
          </p>

          <div className="flex flex-col gap-4 border-l border-black/15 pl-6">
            <p className="text-sm uppercase tracking-[0.2em] text-black/40">
              Who I Am
            </p>
            <p className="text-base tracking-wide text-black/80 md:text-lg">
              Product Person / First Principles Thinker
            </p>
          </div>

          <div className="flex flex-col gap-4 border-l border-black/15 pl-6">
            <p className="text-sm uppercase tracking-[0.2em] text-black/40">
              I Like
            </p>
            <p className="text-base tracking-wide text-black/60 md:text-lg">
              Politics, Aesthetics, Physics, Startups, and Engineering
            </p>
          </div>

          <div className="max-w-xl space-y-4 pt-4">
            <p className="text-xl leading-relaxed tracking-wide text-black/90 md:text-2xl">
              I am a Sophomore Engineering student at the University of
              Michigan.
            </p>
            <p className="text-xl leading-relaxed tracking-wide text-black/50 md:text-2xl">
              I am obsessed with building products that people want.
            </p>
          </div>
        </div>

        <div className="flex justify-center md:justify-end">
          <div className="relative h-64 w-64 overflow-hidden rounded-full border border-black/10 md:h-72 md:w-72">
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
    </section>
  );
}
