export default function ResumeButton({ href }: { href: string }) {
  return (
    <span className="split">
      <a className="btn" href={href} target="_blank" rel="noopener noreferrer">View resume</a>
      <a className="btn icon" href={href} download aria-label="Download resume as PDF" title="Download PDF">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M12 3v12m0 0l-5-5m5 5l5-5M4 21h16" />
        </svg>
      </a>
    </span>
  );
}
