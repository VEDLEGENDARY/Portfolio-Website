const experience = [
  { role: "Full-Stack Developer Intern", org: "VisorFin Tech Services", period: "Jun 2025 – Feb 2026 / Gurugram, IN", bullets: ["Built 10+ RESTful APIs in Node.js and Python for legal and transactional data across 500+ accounts.", "Automated a daily pipeline syncing 6,000+ fund entries, saving 20+ hours of manual work each week.", "Shipped 12 investment calculators into Kotlin and Swift mobile apps."] },
  { role: "STEM & CS Tutor", org: "Schoolhouse · Learn To Be", period: "2023 – 2024 / Remote", bullets: ["Taught SAT Math, VEX Robotics, and Computer Science; students averaged a 50-point SAT score gain.", "Led interactive Python workshops and maintained approximately 90% student retention with project-based lessons."] },
];
const skillGroups = [
  ["Languages", "Python, TypeScript, Java, C++, Go, SQL, Kotlin, Swift"],
  ["Product engineering", "React, Next.js, Node.js, Express, PostgreSQL, MongoDB, Redis, GraphQL, REST APIs, Supabase, Tailwind CSS"],
  ["AI & infrastructure", "TensorFlow, PyTorch, OpenCV, Scikit-learn, Docker, Kubernetes, AWS, CI/CD, Git, Linux"],
];

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
