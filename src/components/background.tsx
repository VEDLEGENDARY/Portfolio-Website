import { experience, skillGroups } from "@/content/background";

export function Background() {
  return (
    <section id="background" className="section shell background-section" aria-labelledby="background-title">
      <div className="section-heading"><div><p className="eyebrow">02 / Background</p><h2 id="background-title">Always building.<br /><em>Always learning.</em></h2></div><p className="section-note">An engineering foundation, a practical mindset, and an appetite for the unfamiliar.</p></div>
      <div className="background-grid">
        <div>{experience.map(entry => <article className="experience-entry" key={entry.org}><p className="eyebrow">{entry.period}</p><h3>{entry.role}</h3><p>{entry.org}</p><ul>{entry.bullets.map(bullet => <li key={bullet}>{bullet}</li>)}</ul></article>)}</div>
        <div>
          <article className="experience-entry"><p className="eyebrow">Education / 2025 – 2029</p><h3>The University of Texas at Dallas</h3><p>B.S. Computer Science · Richardson, TX</p><ul><li>Comet Robotics — localization and autonomous algorithms</li><li>26th place — International VEXU Robotics</li><li>1st place nationally — TSA Web Development</li></ul></article>
          <div className="experience-entry"><p className="eyebrow">Tools of the trade</p>{skillGroups.map(([label, skills]) => <div key={label}><h3>{label}</h3><p>{skills}</p></div>)}</div>
        </div>
      </div>
    </section>
  );
}
