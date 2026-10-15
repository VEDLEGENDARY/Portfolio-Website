import Image from "next/image";
import { Arrow } from "./icons.js";

export default function FeaturedProjects({ items }) {
  return (
    <div className="featured-projects">
      {items.map((project) => (
        <details className={`project-feature feature-${project.slug}`} key={project.slug} data-reveal>
          <summary aria-label={`Explore ${project.name}`}>
            <div className="feature-media">
              <div className="feature-image-wrap">
                <Image src={project.cover.src} alt={project.cover.alt} width={1200} height={800} sizes="(max-width: 720px) 90vw, 44vw" />
              </div>
            </div>
            <div className="feature-heading">
              <div><h3>{project.name}</h3><p>{project.line}</p></div>
              <span className="feature-toggle" aria-hidden="true">+</span>
            </div>
            {project.badge && <p className="feature-award"><span aria-hidden="true" />{project.badge}</p>}
          </summary>
          <div className="feature-body">
            <ul className="points">{project.points.map((point) => <li key={point}>{point}</li>)}</ul>
            <ul className="chips">{project.stack.map((skill) => <li key={skill}>{skill}</li>)}</ul>
            {project.href && <a className="link-arrow" href={project.href} target="_blank" rel="noopener noreferrer">Visit project <Arrow /></a>}
          </div>
        </details>
      ))}
    </div>
  );
}
