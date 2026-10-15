import Hero from "../components/hero.js";
import Enhance from "../components/enhance.js";
import WorkList from "../components/work-list.js";
import FeaturedProjects from "../components/featured-projects.js";
import Portrait from "../components/portrait.js";
import Marquee from "../components/marquee.js";
import ResumeButton from "../components/resume-button.js";
import StackNetwork from "../components/stack-network.js";
import ContactField from "../components/contact-field.js";
import { Arrow, BrandMark } from "../components/icons.js";
import { profile, statement, stats, highlights, projects, experience, skillGroups, education } from "../content/data.js";

function Words({ text }) {
  return text.split(" ").map((word, index) => <span className="w" key={index}>{word}{" "}</span>);
}

function Head({ id, index, title, aside }) {
  return (
    <header className="sec-head" data-reveal>
      <p className="mono">{index}</p>
      <h2 id={id}>{title}</h2>
      {aside && <p className="sec-aside">{aside}</p>}
    </header>
  );
}

export default function Home() {
  return (
    <>
      <a className="skip" href="#work">Skip to work</a>
      <header className="nav">
        <div className="nav-glass" aria-hidden="true">
          {Array.from({ length: 3 }, (_, index) => <i key={index} />)}
        </div>
        <a className="nav-mark" href="#top" aria-label="Ved Patel, back to top">
          <BrandMark /><span>Ved Patel</span>
        </a>
        <nav data-nav aria-label="Sections">
          <a href="#work">Work</a>
          <a href="#about">About</a>
          <a href="#experience">Experience</a>
          <a href="#contact">Contact</a>
        </nav>
        <p className="nav-clock mono"><span>{profile.location}</span>{" "}<span data-clock /></p>
      </header>

      <main>
        <Hero name={profile.name} lead={profile.lead} main={profile.main} />

        <section className="statement" data-section="statement" aria-labelledby="introduction-title">
          <h2 id="introduction-title" className="sr-only">Introduction</h2>
          <p className="statement-text" data-scrub><Words text={statement} /></p>
          <dl className="stats">
            {stats.map((stat, index) => (
              <div data-reveal style={{ "--d": `${index * 80}ms` }} key={stat.label}>
                <dt>{stat.label}</dt>
                <dd className="stat-value">
                  <span data-count={stat.value} data-decimals={stat.decimals ?? 0} data-suffix={stat.suffix ?? ""}>
                    {stat.value.toFixed(stat.decimals ?? 0)}{stat.suffix ?? ""}
                  </span>
                </dd>
                <dd className="stat-detail">{stat.detail}</dd>
              </div>
            ))}
          </dl>
        </section>

        <section id="work" className="work dark sheet" data-section="work" aria-labelledby="work-title">
          <Head id="work-title" index="01" title={<>Selected <em>work</em></>} aside={`${projects.length} projects. Hover to preview, select to open.`} />
          <FeaturedProjects items={projects.slice(0, 2)} />
          <WorkList items={projects.slice(2)} offset={2} />
        </section>

        <section id="about" className="about" data-section="about" aria-labelledby="about-title">
          <Head id="about-title" index="02" title={<>Student, <em>engineer</em></>} />
          <div className="about-grid">
            <div className="about-media" data-reveal>
              <div className="portrait-frame">
                <Portrait src="/about/portrait.jpg" alt="Portrait of Ved Patel in a navy suit" />
              </div>
            </div>
            <div className="about-body">
              <dl className="facts" data-reveal>
                <div><dt>Education</dt><dd>{education.school}<span className="fact-secondary">{education.degree}</span></dd></div>
                <div><dt>Minors</dt><dd>{education.minors.join(" · ")}</dd></div>
                <div><dt>Coursework</dt><dd>{education.coursework.join(" · ")}</dd></div>
                <div>
                  <dt>Certificates</dt>
                  <dd>{education.certs.map((certificate) => (
                    <span className="certificate" key={certificate}>{certificate}<span className="certificate-mark" aria-hidden="true">✓</span></span>
                  ))}</dd>
                </div>
                <div><dt>Based in</dt><dd>{profile.location}</dd></div>
              </dl>
            </div>
          </div>
          <div className="recognition">
            <h3 data-reveal>Recognition</h3>
            <ul className="awards">
              {highlights.map((highlight) => (
                <li key={highlight.title} data-reveal><strong>{highlight.title}</strong><span>{highlight.detail}</span></li>
              ))}
            </ul>
          </div>
        </section>

        <Marquee items={skillGroups.flatMap((group) => group.items)} />

        <section id="stack" className="stack dark sheet" data-section="stack" aria-labelledby="stack-title">
          <Head id="stack-title" index="03" title={<>What I build <em>with</em></>} aside="Every dot is a technology. Hover one to trace the projects and skill areas it connects to." />
          <StackNetwork projects={projects.map((project) => ({ name: project.name, stack: project.stack }))} groups={skillGroups.map((group) => ({ name: group.name, items: group.items }))} />
          <ul className="network-key mono" aria-label="Network legend">
            <li><i className="key-project" aria-hidden="true" />Project</li>
            <li><i className="key-group" aria-hidden="true" />Skill area</li>
            <li><i className="key-tech" aria-hidden="true" />Technology</li>
          </ul>
          <ul className="sr-only">
            {skillGroups.map((group) => <li key={group.name}>{group.name}: {group.items.join(", ")}. Used in {group.used}.</li>)}
          </ul>
        </section>

        <section id="experience" className="experience" data-section="experience" aria-labelledby="experience-title">
          <Head id="experience-title" index="04" title={<>Where the work <em>happened</em></>} />
          <ol className="timeline" data-progress>
            {experience.map((entry) => (
              <li key={entry.org} data-reveal>
                <p className="when mono">{entry.when}</p>
                <div>
                  <h3>{entry.org}</h3>
                  <p className="role">{entry.role}</p>
                  <ul className="points">{entry.points.map((point) => <li key={point}>{point}</li>)}</ul>
                </div>
              </li>
            ))}
          </ol>
        </section>

        <section id="contact" className="contact dark sheet" data-section="contact" aria-labelledby="contact-title">
          <ContactField />
          <p className="mono" data-reveal>05 / Contact</p>
          <div className="contact-heading">
            <h2 id="contact-title" data-reveal>Let&apos;s build<br /><em>something.</em></h2>
            <Arrow className="contact-arrow" />
          </div>
          <p className="contact-lead" data-reveal>Have a project in mind? I reply within a few days.</p>
          <div className="contact-bottom" data-reveal>
            <a className="contact-email" href={`mailto:${profile.email}`}>{profile.email}<Arrow /></a>
            <div className="actions">
              <a className="btn" href={profile.github} target="_blank" rel="noopener noreferrer">GitHub <Arrow /></a>
              <ResumeButton href={profile.resume} />
            </div>
          </div>
          <footer className="foot">
            <a className="footer-brand" href="#top" aria-label="Ved Patel, back to top"><BrandMark /><span>Ved Patel</span></a>
            <p className="mono">{profile.location}<span data-clock /></p>
            <a className="back-top mono" href="#top">Back to top <Arrow /></a>
          </footer>
        </section>
      </main>
      <Enhance timezone={profile.timezone} />
    </>
  );
}
