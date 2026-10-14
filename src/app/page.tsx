import type { ReactNode } from "react";
import ShaderBg from "@/components/shader-bg";
import Reveal from "@/components/reveal";
import Projects from "@/components/projects";
import KineticTitle from "@/components/kinetic-title";
import Cursor from "@/components/cursor";
import Marquee from "@/components/marquee";
import Scene3D from "@/components/scene3d";
import ResumeButton from "@/components/resume-button";
import { profile, highlights, projects, experience, skillGroups, education } from "@/content/data";

function Section({ id, title, note, tone = "light", children }: { id: string; title: string; note: string; tone?: "light" | "dark"; children: ReactNode }) {
  return (
    <section id={id} className="sec" data-tone={tone}>
      <div className="sec-head">
        <Reveal>
          <h2>{title}</h2>
          <p>{note}</p>
        </Reveal>
      </div>
      <div className="sec-body">{children}</div>
    </section>
  );
}

export default function Home() {
  return (
    <>
      <div className="intro" aria-hidden="true"><span>Ved Patel</span></div>
      <a className="skip" href="#work">Skip to projects</a>
      <header className="nav">
        <a className="mark" href="#top" aria-label="Back to top">VP</a>
        <nav aria-label="Sections">
          <a href="#about">About</a>
          <a href="#work">Projects</a>
          <a href="#experience">Experience</a>
          <a href="#skills">Skills</a>
          <a href="#contact">Contact</a>
        </nav>
      </header>

      <ShaderBg />
      <Cursor />
      <main id="top">
        <section id="hero" className="hero" data-tone="light">
          <Scene3D kind="particles" className="hero-scene" />
          <p className="caption">A live particle filter, the estimation technique I worked on at Comet Robotics. Move your cursor to give it a target.</p>
          <div className="hero-copy">
            <KineticTitle lines={["Ved Patel", "builds things that", "work and feel good."]} />
            <p className="sub">{profile.line}</p>
            <div className="actions">
              <a className="btn solid" href="#work">View projects</a>
              <ResumeButton href={profile.resume} />
            </div>
          </div>
        </section>

        <Marquee items={skillGroups.flatMap((g) => g.items).slice(0, 18)} />

        <Section id="about" title="Student engineer at UT Dallas" note="Education, certificates, and recognition.">
          <ul className="list">
            {highlights.map((h) => (
              <li key={h.title}>
                <strong>{h.title}</strong>
                <span>{h.detail}</span>
              </li>
            ))}
          </ul>
          <dl className="facts">
            <div><dt>School</dt><dd>{education.school}</dd></div>
            <div><dt>Degree</dt><dd>{education.degree}</dd></div>
            <div><dt>Minors</dt><dd>{education.minors.join(", ")}</dd></div>
            <div><dt>Coursework</dt><dd>{education.coursework.join(", ")}</dd></div>
            <div><dt>Certificates</dt><dd>{education.certs.join(", ")}</dd></div>
            <div><dt>Based in</dt><dd>{profile.location}</dd></div>
          </dl>
        </Section>

        <Section id="work" title="Things I have built" tone="dark" note="Select a project to see what it does and how it is built.">
          <Projects items={projects} />
        </Section>

        <Section id="experience" title="Where the work happened" note="Engineering, robotics, and teaching roles.">
          <ol className="timeline">
            {experience.map((e) => (
              <li key={e.org}>
                <div className="t-head">
                  <h3>{e.org}</h3>
                  <span className="when">{e.when}</span>
                </div>
                <p className="role">{e.role}</p>
                <ul className="points">{e.points.map((t) => <li key={t}>{t}</li>)}</ul>
              </li>
            ))}
          </ol>
        </Section>

        <Section id="skills" title="What I build with" note="Grouped by area, with where I have used each.">
          <div className="skill-grid">
            {skillGroups.map((g) => (
              <div className="skill" key={g.name}>
                <h3>{g.name}</h3>
                <ul className="chips">{g.items.map((s) => <li key={s}>{s}</li>)}</ul>
                <p>Used in {g.used}.</p>
              </div>
            ))}
          </div>
        </Section>

        <Section id="contact" title="Let us work together" tone="dark" note="Open to internships and freelance work.">
          <p className="lead">Have a project or role in mind? Send a note and I will reply within a few days.</p>
          <div className="actions">
            <a className="btn solid" href={profile.email}>Email Ved</a>
            <a className="btn" href={profile.github}>View GitHub</a>
            <ResumeButton href={profile.resume} />
          </div>
        </Section>
      </main>

      <footer className="foot">Ved Patel, {profile.location}</footer>
    </>
  );
}
