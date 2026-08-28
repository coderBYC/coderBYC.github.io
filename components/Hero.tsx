"use client";

import Image from "next/image";
import FadeIn from "./FadeIn";

export default function Hero() {
  return (
    <section className="relative flex min-h-screen items-center">
      <div className="mx-auto grid w-full max-w-5xl grid-cols-1 items-center gap-16 px-6 py-32 md:grid-cols-2 md:px-8">
        <div className="flex flex-col gap-8">
          <FadeIn>
            <div className="flex items-center gap-4">
              <h1 className="text-5xl font-medium tracking-wide text-white md:text-7xl">
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
          </FadeIn>

          <FadeIn delay={0.1}>
            <p className="text-lg tracking-wide text-white/50 md:text-xl">
              Mechanical Engineering Student at the University of Michigan
            </p>
          </FadeIn>

          <FadeIn delay={0.2}>
            <div className="flex flex-col gap-4 border-l border-white/20 pl-6">
              <p className="text-sm uppercase tracking-[0.2em] text-white/40">
                Who I Am
              </p>
              <p className="text-base tracking-wide text-white/80 md:text-lg">
                Product Person / First Principles Thinker
              </p>
            </div>
          </FadeIn>

          <FadeIn delay={0.3}>
            <div className="flex flex-col gap-4 border-l border-white/20 pl-6">
              <p className="text-sm uppercase tracking-[0.2em] text-white/40">
                I Like
              </p>
              <p className="text-base tracking-wide text-white/60 md:text-lg">
                Politics, Aesthetics, Physics, Startups, and Engineering
              </p>
            </div>
          </FadeIn>
        </div>

        <FadeIn
          delay={0.2}
          direction="right"
          className="flex justify-center md:justify-end"
        >
          <div className="relative h-64 w-64 overflow-hidden rounded-full border border-white/10 md:h-80 md:w-80">
            <Image
              src="/portrait.jpg"
              alt="Bryan Chen"
              fill
              className="object-cover object-top"
              priority
            />
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
