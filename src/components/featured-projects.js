import { Arrow } from "./icons.js";

export default function FeaturedProjects({ items }) {
  return (
    <div className="featured-projects">
      {items.map((project, index) => (
        <details className={`project-feature feature-${project.slug}`} key={project.slug} data-reveal>
          <summary aria-label={`Explore ${project.name}`}>
            <div className="feature-media">
              <div className="feature-image-wrap">
                <img src={project.cover.src} alt={project.cover.alt} width={1200} height={800} loading="lazy" decoding="async" />
              </div>
              <div className="feature-caption mono">
                <span>{String(index + 1).padStart(2, "0")} / {index === 0 ? "Web application" : "Computer vision"}</span>
                <span className="feature-open">Project details <Arrow direction="down" /></span>
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
          </div>
        </details>
      ))}
    </div>
  );
}
