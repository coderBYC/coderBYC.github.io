import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Projects from "@/components/Projects";
import Contact from "@/components/Contact";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <About />
        <Projects />
        <Contact />
      </main>
      <footer className="border-t border-white/10 py-8">
        <div className="mx-auto max-w-5xl px-6 md:px-8">
          <p className="text-sm text-white/30">
            © {new Date().getFullYear()} Bryan Chen
          </p>
        </div>
      </footer>
    </>
  );
}
