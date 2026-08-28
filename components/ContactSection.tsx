"use client";

import { motion } from "framer-motion";
import { contactLinks } from "@/lib/data";

export default function ContactSection() {
  return (
    <section id="contact" className="w-full">
      <div className="flex flex-wrap gap-4">
          {contactLinks.map((link) => (
            <motion.a
              key={link.label}
              href={link.href}
              target={link.href.startsWith("mailto") ? undefined : "_blank"}
              rel={
                link.href.startsWith("mailto") ? undefined : "noopener noreferrer"
              }
              className="inline-flex items-center justify-center rounded-full border border-black/30 px-8 py-3 text-sm text-black transition-all duration-300 hover:border-black hover:bg-black/5"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {link.label}
            </motion.a>
          ))}
        </div>
    </section>
  );
}
