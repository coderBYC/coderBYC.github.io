import type { Metadata } from "next";
import { Instrument_Sans } from "next/font/google";
import "./globals.css";

const instrumentSans = Instrument_Sans({
  subsets: ["latin"],
  variable: "--font-instrument-sans",
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
    <html lang="en" className={`${instrumentSans.variable} h-full scroll-smooth`}>
      <body className="min-h-full bg-white font-sans text-black antialiased">
        {children}
      </body>
    </html>
  );
}
