import type { Metadata } from "next";
import { Cardo } from "next/font/google";
import "./globals.css";

const cardo = Cardo({
  subsets: ["latin"],
  weight: ["400", "700"],
  style: ["normal", "italic"],
  variable: "--font-cardo",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Bryan Chen",
  description:
    "Mechanical Engineering student at the University of Michigan. Building products that people want.",
  openGraph: {
    title: "Bryan Chen",
    description:
      "Mechanical Engineering student at the University of Michigan. Building products that people want.",
    type: "website",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${cardo.variable} h-full scroll-smooth`}>
      <body className="min-h-full bg-white font-serif font-bold text-black antialiased">
        {children}
      </body>
    </html>
  );
}
