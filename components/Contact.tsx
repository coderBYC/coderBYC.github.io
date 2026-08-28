"use client";

import { motion } from "framer-motion";
import FadeIn from "./FadeIn";
import { contactLinks } from "@/lib/data";

export default function Contact() {
  return (
    <section id="contact" className="py-32 md:py-40">
      <div className="mx-auto max-w-5xl px-6 md:px-8">
        <FadeIn>
          <h2 className="mb-16 text-sm uppercase tracking-[0.2em] text-black/40">
            Contact
          </h2>
        </FadeIn>

        <div className="flex flex-wrap gap-4">
          {contactLinks.map((link, index) => (
            <FadeIn key={link.label} delay={index * 0.1}>
              <motion.a
                href={link.href}
                target={link.href.startsWith("mailto") ? undefined : "_blank"}
                rel={
                  link.href.startsWith("mailto")
                    ? undefined
                    : "noopener noreferrer"
                }
                className="inline-flex items-center justify-center rounded-full border border-black/30 px-8 py-3 text-sm text-black transition-all duration-300 hover:border-black hover:bg-black/5"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {link.label}
              </motion.a>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
