import { ArrowUpRight } from "lucide-react";

export function Contact() {
  return (
    <section id="contact" className="contact-section" aria-labelledby="contact-title">
      <div className="shell">
        <p className="eyebrow">03 / Get in touch</p>
        <div className="contact-heading"><h2 id="contact-title">Good things start<br /><em>with a conversation.</em></h2><a className="text-link" href="mailto:ved.sp@outlook.com">ved.sp@outlook.com <ArrowUpRight aria-hidden="true" /></a></div>
        <footer className="site-footer">
          <a className="wordmark" href="#top">Ved Patel.</a>
          <div className="footer-links"><a href="https://github.com/VEDLEGENDARY" target="_blank" rel="noreferrer">GitHub ↗</a><a href="https://linkedin.com/in/vedspatel" target="_blank" rel="noreferrer">LinkedIn ↗</a><a href="/Resume_VedPatel.pdf" target="_blank" rel="noreferrer">Résumé ↗</a></div>
          <span>© {new Date().getFullYear()} Ved Patel</span>
        </footer>
      </div>
    </section>
  );
}
