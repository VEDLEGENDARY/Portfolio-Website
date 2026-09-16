import { experience, skillGroups } from "@/content/background";

export function Background() {
  return (
    <section id="background" className="section shell background-section" aria-labelledby="background-title">
      <div className="section-heading"><div><p className="eyebrow">Background</p><h2 id="background-title">Always building.<br /><em>Always learning.</em></h2></div><p className="section-note">Experience across production APIs, autonomous robotics, technical mentorship, and applied AI.</p></div>
      <div className="background-grid">
        <div>{experience.map(entry => <article className="experience-entry" key={entry.org}><p className="eyebrow">{entry.period}</p><h3>{entry.role}</h3><p>{entry.org}</p><ul>{entry.bullets.map(bullet => <li key={bullet}>{bullet}</li>)}</ul></article>)}</div>
        <div>
          <article className="experience-entry"><p className="eyebrow">Education / Expected May 2028</p><h3>The University of Texas at Dallas</h3><p>B.S. Computer Science · Minor in Innovation & Entrepreneurship</p><ul><li>Computer Science II and Computer Architecture</li><li>Probability and Statistics in Computer Science and Software Engineering</li><li>Professional and Technical Communication</li></ul></article>
          <div className="experience-entry"><p className="eyebrow">Technical skills</p>{skillGroups.map(([label, skills]) => <div key={label}><h3>{label}</h3><p>{skills}</p></div>)}</div>
        </div>
      </div>
    </section>
  );
}
