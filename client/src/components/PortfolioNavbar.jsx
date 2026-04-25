import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import ThemeToggle from "./ThemeToggle";

const navLinks = [
  { id: "home", label: "Home" },
  { id: "about", label: "About" },
  { id: "skills", label: "Skills" },
  { id: "projects", label: "Projects" },
  { id: "experience", label: "Experience" },
  { id: "education", label: "Education" },
  { id: "contact", label: "Contact" }
];

function PortfolioNavbar({ theme, onThemeToggle }) {
  const [activeSection, setActiveSection] = useState("home");
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const syncFromEvent = (event) => {
      if (event.detail) {
        setActiveSection(event.detail);
      }
    };
    const syncFromHash = () => {
      const section = window.location.hash.replace("#", "");
      if (section) {
        setActiveSection(section);
      }
    };
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.find((entry) => entry.isIntersecting);
        if (visible) {
          setActiveSection(visible.target.id);
        }
      },
      { rootMargin: "-35% 0px -55% 0px", threshold: 0.01 }
    );

    syncFromHash();
    window.addEventListener("hashchange", syncFromHash);
    window.addEventListener("portfolio-section-change", syncFromEvent);

    navLinks.forEach((link) => {
      const element = document.getElementById(link.id);
      if (element) {
        observer.observe(element);
      }
    });

    return () => {
      observer.disconnect();
      window.removeEventListener("hashchange", syncFromHash);
      window.removeEventListener("portfolio-section-change", syncFromEvent);
    };
  }, []);

  const handleNavClick = (id) => {
    setActiveSection(id);
    window.dispatchEvent(new CustomEvent("portfolio-section-change", { detail: id }));
    setIsOpen(false);
  };

  const linkClass = (id) =>
    `rounded-full px-4 py-2 text-sm font-medium transition ${
      activeSection === id
        ? "bg-[color-mix(in_srgb,var(--primary)_78%,white_0%)] text-white shadow-[0_14px_36px_rgba(37,99,235,0.28)]"
        : "text-[var(--muted)] hover:bg-white/8 hover:text-[var(--text)]"
    }`;

  return (
    <header className="sticky top-0 z-50 border-b border-white/8 bg-[var(--bg)]/74 backdrop-blur-2xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
        <a href="#home" onClick={() => handleNavClick("home")} className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-sm font-bold text-[var(--text)] shadow-[0_18px_50px_rgba(15,23,42,0.16)]">
            VK
          </span>
          <span>
            <span className="block font-display text-lg font-bold text-[var(--text)]">Vivek Kumar</span>
            <span className="block text-xs uppercase tracking-[0.24em] text-[var(--muted)]">Full Stack Developer</span>
          </span>
        </a>

        <nav className="hidden items-center rounded-full border border-white/10 bg-white/5 p-1.5 shadow-[0_18px_55px_rgba(2,6,23,0.18)] lg:flex" aria-label="Primary navigation">
          {navLinks.map((link) => (
            <a key={link.id} href={`#${link.id}`} onClick={() => handleNavClick(link.id)} className={linkClass(link.id)}>
              {link.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle theme={theme} onToggle={onThemeToggle} />
          <button type="button" onClick={() => setIsOpen((value) => !value)} className="icon-button lg:hidden" aria-label="Toggle navigation">
            {isOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="border-t border-white/10 bg-[var(--bg)]/94 px-4 py-3 lg:hidden">
          <nav className="mx-auto grid max-w-7xl gap-2" aria-label="Mobile navigation">
            {navLinks.map((link) => (
              <a key={link.id} href={`#${link.id}`} onClick={() => handleNavClick(link.id)} className={linkClass(link.id)}>
                {link.label}
              </a>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}

export default PortfolioNavbar;
