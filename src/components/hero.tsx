import Image from "next/image";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import portrait from "../../public/profilepic.jpeg";

export function Hero() {
  return (
    <section className="hero shell" aria-labelledby="hero-title">
      <div className="hero-topline"><p className="eyebrow">Computer science / Dallas, TX</p></div>
      <div className="hero-grid">
        <div>
          <h1 id="hero-title"><span className="title-line"><span>Thoughtful code.</span></span><span className="title-line"><em>Real-world</em></span><span className="title-line"><span>possibilities.</span></span></h1>
          <p className="hero-copy">I’m Ved, a computer science student at UT Dallas building production APIs, applied AI systems, and autonomous robotics software.</p>
          <div className="actions"><a className="text-link" href="#projects">Explore my work <ArrowDown /></a><a className="text-link" href="/Resume_VedPatel.pdf" target="_blank" rel="noreferrer">View résumé <ArrowUpRight /></a></div>
        </div>
        <figure className="portrait">
          <div className="portrait-frame"><Image src={portrait} alt="Ved Patel" priority placeholder="blur" sizes="(max-width: 700px) 85vw, 36vw" /></div>
        </figure>
      </div>
      <div className="hero-bottom"><span>Applied AI & retrieval</span><span>Software architecture</span><span>Autonomous systems</span></div>
    </section>
  );
}
