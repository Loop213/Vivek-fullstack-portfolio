import { Github, Linkedin, Trophy } from "lucide-react";

function SocialDock({ contact }) {
  const links = [
    { href: contact?.github, icon: Github, label: "GitHub" },
    { href: contact?.linkedin, icon: Linkedin, label: "LinkedIn" },
    { href: contact?.leetcode, icon: Trophy, label: "LeetCode" }
  ].filter((item) => item.href);

  return (
    <div className="surface-panel flex w-fit items-center gap-2 rounded-full p-2">
      {links.map(({ href, icon: Icon, label }) => (
        <a
          key={label}
          href={href}
          target="_blank"
          rel="noreferrer"
          aria-label={label}
          className="rounded-full p-3 text-[var(--muted)] transition hover:-translate-y-0.5 hover:bg-[var(--card-soft)] hover:text-[var(--primary)]"
        >
          <Icon size={18} />
        </a>
      ))}
    </div>
  );
}

export default SocialDock;
