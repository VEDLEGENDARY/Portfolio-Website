import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { projects } from "@/content/projects";

export function Projects() {
  return (
    <section id="projects" className="section shell" aria-labelledby="work-title">
      <div className="section-heading">
        <div><p className="eyebrow">01 / Selected work</p><h2 id="work-title">Ideas, put to work.</h2></div>
        <p className="section-note">From machine learning to everyday tools. A selection of things I’ve built and shipped.</p>
      </div>
      <div className="project-grid">
        {projects.map((project, index) => (
          <article key={project.name} aria-labelledby={`project-${index}`}>
            <div className="project-frame"><Image src={project.image} alt={project.alt} placeholder="blur" sizes="(max-width: 700px) 80vw, 40vw" /></div>
            <div className="project-meta"><h3 id={`project-${index}`}>{project.name}</h3><span className="project-number">0{index + 1}</span></div>
            <p className="eyebrow">{project.category}</p>
            <p className="project-description">{project.description}</p>
            <ul className="project-tags" aria-label="Technologies">{project.tags.map(tag => <li key={tag}>{tag}</li>)}</ul>
            <div className="project-links">{project.links.map(([label, href]) => <a key={href} className="text-link" href={href} target="_blank" rel="noreferrer" aria-label={`${project.name}: ${label} (opens in a new tab)`}>{label}<ArrowUpRight aria-hidden="true" /></a>)}</div>
          </article>
        ))}
      </div>
    </section>
  );
}
