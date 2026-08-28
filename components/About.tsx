import FadeIn from "./FadeIn";

export default function About() {
  return (
    <section id="about" className="py-32 md:py-40">
      <div className="mx-auto max-w-5xl px-6 md:px-8">
        <FadeIn>
          <h2 className="mb-16 text-sm uppercase tracking-[0.2em] text-black/40">
            About
          </h2>
        </FadeIn>

        <div className="max-w-2xl space-y-6">
          <FadeIn delay={0.1}>
            <p className="text-2xl font-light leading-relaxed tracking-wide text-black/90 md:text-3xl">
              I am a Sophomore Engineering student at the University of
              Michigan.
            </p>
          </FadeIn>

          <FadeIn delay={0.2}>
            <p className="text-2xl font-light leading-relaxed tracking-wide text-black/50 md:text-3xl">
              I am obsessed with building products that people want.
            </p>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
