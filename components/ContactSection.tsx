"use client";

import { FiGithub, FiLinkedin, FiMail } from "react-icons/fi";
import { SiX } from "react-icons/si";
import { contactLinks } from "@/lib/data";

const iconMap = {
  X: SiX,
  LinkedIn: FiLinkedin,
  GitHub: FiGithub,
  Gmail: FiMail,
} as const;

export default function ContactSection() {
  return (
    <section id="contact" className="w-full">
      <ul className="flex flex-col gap-4">
        {contactLinks.map((link) => {
          const Icon = iconMap[link.label as keyof typeof iconMap];

          return (
            <li key={link.label}>
              <a
                href={link.href}
                target={link.href.startsWith("mailto") ? undefined : "_blank"}
                rel={
                  link.href.startsWith("mailto")
                    ? undefined
                    : "noopener noreferrer"
                }
                className="group inline-flex items-center gap-3 text-black/70 transition-colors hover:text-black"
              >
                {Icon && <Icon className="h-4 w-4 shrink-0" />}
                <span className="text-sm tracking-wide">{link.label}</span>
              </a>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
