import Image from "next/image";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import portrait from "../../public/profilepic.jpeg";

export function Hero() {
  return (
    <section className="hero shell" aria-labelledby="hero-title">
      <div className="hero-topline"><p className="eyebrow">Software engineer / Dallas, TX</p><span className="eyebrow">Portfolio — 2026</span></div>
      <div className="hero-grid">
        <div>
          <h1 id="hero-title">Thoughtful code.<br /><em>Real-world</em><br />possibilities.</h1>
          <p className="hero-copy">I’m Ved. I bring curiosity and care to software — turning complex systems into useful, dependable products.</p>
          <div className="actions"><a className="text-link" href="#projects">Explore my work <ArrowDown /></a><a className="text-link" href="/Resume_VedPatel.pdf" target="_blank" rel="noreferrer">View résumé <ArrowUpRight /></a></div>
        </div>
        <figure className="portrait">
          <div className="portrait-frame"><Image src={portrait} alt="Ved Patel" priority placeholder="blur" sizes="(max-width: 700px) 85vw, 36vw" /></div>
          <figcaption><span>A little curiosity. A lot of building.</span><span>01 / VP</span></figcaption>
        </figure>
      </div>
      <div className="hero-bottom"><span>AI & computer vision</span><span>Full-stack development</span><span>Automation & systems</span></div>
    </section>
  );
}
