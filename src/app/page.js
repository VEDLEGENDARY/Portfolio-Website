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

const navigation = [
  { href: "#work", label: "Work", index: "01" },
  { href: "#about", label: "About", index: "02" },
  { href: "#experience", label: "Experience", index: "04" },
  { href: "#contact", label: "Contact", index: "05" },
];
const technologyCount = new Set([...skillGroups.flatMap((group) => group.items), ...projects.flatMap((project) => project.stack)]).size;

function Words({ text }) {
  return text.split(" ").map((word, index) => <span className="w" key={index}>{word}{" "}</span>);
}

function Head({ id, index, label, title, aside, children }) {
  return (
    <header className="sec-head" data-reveal>
      <p className="section-label mono"><span>{index}</span><span className="label-rule" aria-hidden="true" />{label}</p>
      <h2 id={id}>{title}</h2>
      {aside && <p className="sec-aside">{aside}</p>}
      {children}
    </header>
  );
}

export default function Home() {
  return (
    <>
      <a className="skip" href="#work">Skip to work</a>
      <header className="nav">
        <div className="nav-glass" aria-hidden="true">{Array.from({ length: 3 }, (_, index) => <i key={index} />)}</div>
        <a className="nav-mark" href="#top" aria-label="Ved Patel, back to top">
          <BrandMark /><span className="nav-wordmark">Ved Patel<span>Developer & engineer</span></span>
        </a>
        <nav data-nav aria-label="Sections">
          {navigation.map((item) => <a href={item.href} key={item.href} aria-label={item.label}><span className="nav-index" aria-hidden="true">{item.index}</span>{item.label}</a>)}
        </nav>
        <p className="nav-clock mono"><span className="clock-dot" aria-hidden="true" /><span>{profile.location}<span data-clock /></span></p>
      </header>

      <main>
        <Hero name={profile.name} lead={profile.lead} main={profile.main} />

        <section className="statement" data-section="statement" aria-labelledby="statement-title">
          <div className="statement-intro">
            <h2 id="statement-title" className="section-label mono"><span className="small-cross" aria-hidden="true">+</span>A little context</h2>
            <p className="statement-note">Web products.<br />Applied AI.<br />Robotics software.</p>
          </div>
          <p className="statement-text" data-scrub><Words text={statement} /></p>
          <div className="stats-caption mono"><span>A few things along the way</span><span>Results / Recognition</span></div>
          <dl className="stats">
            {stats.map((stat, index) => (
              <div data-reveal style={{ "--d": `${index * 70}ms` }} key={stat.label}>
                <dt>{stat.label}</dt>
                <dd className="stat-value"><span data-count={stat.value} data-decimals={stat.decimals ?? 0} data-suffix={stat.suffix ?? ""}>{stat.value.toFixed(stat.decimals ?? 0)}{stat.suffix ?? ""}</span></dd>
                <dd className="stat-detail">{stat.detail}</dd>
              </div>
            ))}
          </dl>
        </section>

        <section id="work" className="work dark sheet" data-section="work" aria-labelledby="work-title">
          <Head id="work-title" index="01" label="Selected work" title={<>Ideas, made <em>real.</em></>} aside="Seven projects across web, AI, and mobile. Built for a purpose, refined through the details." />
          <FeaturedProjects items={projects.slice(0, 2)} />
          <div className="work-index-head mono"><span>More from the workbench</span><span>03 — 07 / Project index</span></div>
          <WorkList items={projects.slice(2)} offset={2} />
          <div className="work-end mono"><span>Always something in progress.</span><a href={profile.github} target="_blank" rel="noopener noreferrer">More on GitHub <Arrow /></a></div>
        </section>

        <section id="about" className="about" data-section="about" aria-labelledby="about-title">
          <Head id="about-title" index="02" label="Behind the work" title={<>Student.<br /><em>Engineer.</em></>} aside="Studying computer science at UT Dallas. Building across disciplines, one project at a time." />
          <div className="about-grid">
            <figure className="about-media" data-reveal>
              <div className="portrait-frame"><Portrait src="/about/portrait.jpg" alt="Portrait of Ved Patel in a navy suit" /><span className="portrait-corner" aria-hidden="true">+</span></div>
              <figcaption className="portrait-caption mono"><span>Ved Patel</span><span>{profile.location} / USA</span></figcaption>
            </figure>
            <div className="about-body">
              <p className="about-intro" data-reveal>Web products, AI tooling, and robot software.<br /><span>Different problems. The same curiosity.</span></p>
              <dl className="facts" data-reveal>
                <div><dt>Education</dt><dd>{education.school}<span className="fact-secondary">{education.degree}</span></dd></div>
                <div><dt>Minors</dt><dd>{education.minors.join(" · ")}</dd></div>
                <div><dt>Coursework</dt><dd>{education.coursework.join(" · ")}</dd></div>
                <div><dt>Certificates</dt><dd>{education.certs.map((certificate) => <span className="certificate" key={certificate}>{certificate}<span className="certificate-mark" aria-hidden="true">✓</span></span>)}</dd></div>
                <div><dt>Based in</dt><dd>{profile.location}<span className="fact-secondary">Central Time / Working across disciplines</span></dd></div>
              </dl>
            </div>
          </div>
          <div className="recognition">
            <p className="section-label mono" data-reveal><span className="small-cross" aria-hidden="true">+</span>Recognition along the way</p>
            <ul className="awards">{highlights.map((highlight, index) => <li key={highlight.title} data-reveal style={{ "--d": `${index * 60}ms` }}><span className="award-index mono">0{index + 1}</span><strong>{highlight.title}</strong><span>{highlight.detail}</span></li>)}</ul>
          </div>
        </section>

        <div className="marquee-intro mono"><span>Tools of the trade</span><span>Learning by building <span aria-hidden="true">↘</span></span></div>
        <Marquee items={skillGroups.flatMap((group) => group.items)} />

        <section id="stack" className="stack dark sheet" data-section="stack" aria-labelledby="stack-title">
          <Head id="stack-title" index="03" label="The toolkit" title={<>What I build <em>with.</em></>} aside="Every tool connects to something I've built. Hover a node to follow those connections." />
          <StackNetwork projects={projects.map((project) => ({ name: project.name, stack: project.stack }))} groups={skillGroups.map((group) => ({ name: group.name, items: group.items }))} />
          <div className="network-key mono"><div><span><i className="key-project" />Project</span><span><i className="key-group" />Skill area</span><span><i className="key-tech" />Technology</span></div><p>{projects.length} projects / {technologyCount} technologies</p></div>
          <ul className="sr-only">{skillGroups.map((group) => <li key={group.name}>{group.name}: {group.items.join(", ")}. Used in {group.used}.</li>)}</ul>
        </section>

        <section id="experience" className="experience" data-section="experience" aria-labelledby="experience-title">
          <Head id="experience-title" index="04" label="Experience" title={<>Where the work<br /><em>happened.</em></>} aside="Robotics teams, internships, classrooms, and projects of my own." />
          <ol className="timeline" data-progress>{experience.map((entry, index) => <li key={entry.org} data-reveal><div className="when-block"><p className="when mono">{entry.when}</p><span className="experience-index mono">Experience / 0{index + 1}</span></div><div><h3>{entry.org}</h3><p className="role">{entry.role}</p><ul className="points">{entry.points.map((point) => <li key={point}>{point}</li>)}</ul></div></li>)}</ol>
        </section>

        <section id="contact" className="contact dark sheet" data-section="contact" aria-labelledby="contact-title">
          <ContactField />
          <p className="section-label mono" data-reveal><span>05</span><span className="label-rule" aria-hidden="true" />The next conversation</p>
          <div className="contact-heading"><h2 id="contact-title" data-reveal>Let's build<br /><em>something.</em></h2><Arrow className="contact-arrow" /></div>
          <div className="contact-bottom">
            <div data-reveal><p className="contact-eyebrow mono">Have something in mind?</p><a className="contact-email" href={`mailto:${profile.email}`}>{profile.email}<Arrow /></a></div>
            <div className="contact-links" data-reveal><p className="contact-lead">A project, a question,<br />or just a hello.</p><div className="actions"><a className="btn" href={profile.github} target="_blank" rel="noopener noreferrer">GitHub <Arrow /></a><ResumeButton href={profile.resume} /></div></div>
          </div>
          <footer className="foot"><a className="footer-brand" href="#top" aria-label="Ved Patel, back to top"><BrandMark /><span>Ved Patel<span className="mono">Made with intent. / 2026</span></span></a><p className="mono">{profile.location}<span data-clock /></p><a className="back-top mono" href="#top">Back to top <Arrow /></a></footer>
        </section>
      </main>
      <Enhance timezone={profile.timezone} />
    </>
  );
}
