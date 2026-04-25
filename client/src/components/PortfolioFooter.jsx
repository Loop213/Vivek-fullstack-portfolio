import { Github, Linkedin, Trophy } from "lucide-react";

const footerLinks = [
  { id: "about", label: "About" },
  { id: "skills", label: "Skills" },
  { id: "projects", label: "Projects" },
  { id: "experience", label: "Experience" },
  { id: "contact", label: "Contact" }
];

function PortfolioFooter({ resume }) {
  const year = new Date().getFullYear();

  return (
    <footer className="relative z-10 border-t border-[var(--border)] bg-[var(--card)]/55 backdrop-blur-xl">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 md:grid-cols-[1.2fr_0.8fr_0.8fr]">
        <div>
          <p className="font-display text-2xl font-bold text-[var(--text)]">{resume?.name || "Vivek Kumar"}</p>
          <p className="mt-2 text-sm font-medium text-[var(--primary)]">{resume?.role || "Full Stack Developer"}</p>
          <p className="mt-4 max-w-md text-sm leading-7 text-[var(--muted)]">
            Building polished full-stack products with clean interfaces, reliable APIs, and thoughtful interaction design.
          </p>
        </div>

        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--text)]">Navigate</p>
          <div className="mt-4 grid gap-2">
            {footerLinks.map((link) => (
              <a key={link.id} href={`#${link.id}`} className="text-sm text-[var(--muted)] hover:text-[var(--primary)]">
                {link.label}
              </a>
            ))}
          </div>
        </div>

        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--text)]">Connect</p>
          <div className="mt-4 flex gap-2">
            <a href={resume?.contact?.github} target="_blank" rel="noreferrer" className="icon-button" aria-label="GitHub">
              <Github size={17} />
            </a>
            <a href={resume?.contact?.linkedin} target="_blank" rel="noreferrer" className="icon-button" aria-label="LinkedIn">
              <Linkedin size={17} />
            </a>
            <a href={resume?.contact?.leetcode} target="_blank" rel="noreferrer" className="icon-button" aria-label="LeetCode">
              <Trophy size={17} />
            </a>
          </div>
          <p className="mt-4 break-all text-sm text-[var(--muted)]">{resume?.contact?.email}</p>
        </div>
      </div>
      <div className="border-t border-[var(--border)] px-4 py-4 text-center text-xs text-[var(--muted)]">
        Copyright {year} Vivek Kumar. All rights reserved.
      </div>
    </footer>
  );
}

export default PortfolioFooter;
