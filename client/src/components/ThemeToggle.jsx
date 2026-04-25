import { Moon, SunMedium } from "lucide-react";

function ThemeToggle({ theme, onToggle }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className="surface-panel inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium text-[var(--text)] hover:-translate-y-0.5"
    >
      {theme === "dark" ? <SunMedium size={16} className="text-[var(--primary)]" /> : <Moon size={16} className="text-[var(--primary)]" />}
      {theme === "dark" ? "Light Mode" : "Dark Mode"}
    </button>
  );
}

export default ThemeToggle;
