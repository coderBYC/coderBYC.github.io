import type { Metadata } from "next";
import { Instrument_Serif } from "next/font/google";
import "./globals.css";

const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-instrument-serif",
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
    <html lang="en" className={`${instrumentSerif.variable} h-full scroll-smooth`}>
      <body className="min-h-full bg-black font-serif text-white antialiased">
        {children}
      </body>
    </html>
  );
}
