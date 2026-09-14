import { EditorialMotion } from "@/components/editorial-motion";
import { Hero } from "@/components/hero";
import { Projects } from "@/components/projects";
import { Background } from "@/components/background";
import { Contact } from "@/components/contact";
import { Navbar } from "@/components/navbar";

export default function Home() {
  return (
    <div id="top">
      <a className="skip-link" href="#main">Skip to content</a>
      <Navbar /><EditorialMotion />
      <main id="main" tabIndex={-1}><Hero /><Projects /><Background /><Contact /></main>
    </div>
  );
}
