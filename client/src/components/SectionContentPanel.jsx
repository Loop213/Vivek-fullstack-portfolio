import { ExternalLink, Github, Linkedin, Trophy } from "lucide-react";
import { Link } from "react-router-dom";
import { getProjectGithubUrl, getProjectId, getProjectLiveUrl, getProjectTechStack } from "../lib/projects";

function SectionContentPanel({ activeSection, resume, projects, projectMeta }) {
  if (!resume) {
    return null;
  }

  const cardClass = "rounded-3xl border border-[var(--border)] bg-[var(--card-soft)] p-5";

  const sectionMap = {
    about: (
      <div className="space-y-4">
        <p className="text-base leading-8 text-[var(--muted)]">{resume.bio}</p>
        <div className="grid gap-4 md:grid-cols-2">
          {resume.experience?.map((item) => (
            <div key={`${item.title}-${item.company}`} className={cardClass}>
              <p className="font-display text-lg font-semibold text-[var(--text)]">{item.title}</p>
              <p className="text-sm text-[var(--muted)]">
                {item.company} • {item.period}
              </p>
              <ul className="mt-3 space-y-2 text-sm text-[var(--muted)]">
                {item.highlights?.map((highlight) => (
                  <li key={highlight}>• {highlight}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    ),
    skills: (
      <div className="flex flex-wrap gap-3">
        {resume.skills?.map((skill) => (
          <span
            key={skill}
            className="rounded-full border border-[var(--border)] bg-[var(--card-soft)] px-4 py-2 text-sm font-medium text-[var(--text)]"
          >
            {skill}
          </span>
        ))}
      </div>
    ),
    projects: (
      <div className="space-y-3">
        <div className="flex items-center justify-between text-sm text-[var(--muted)]">
          <span>Live GitHub + MongoDB project feed</span>
          <span>{projectMeta?.fallbackUsed ? "DB fallback active" : "GitHub sync live"}</span>
        </div>
        <div className="grid gap-4 xl:grid-cols-2">
          {projects.length > 0 ? (
            projects.map((project) => (
              <Link
                key={project._id || project.id || project.url}
                to={`/projects/${encodeURIComponent(getProjectId(project))}`}
                className="rounded-3xl border border-[var(--border)] bg-[var(--card-soft)] p-5 transition hover:-translate-y-1 hover:border-[var(--primary)]/40"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-display text-lg font-semibold text-[var(--text)]">{project.title}</p>
                    <p className="mt-2 text-sm leading-7 text-[var(--muted)]">
                      {project.description || "No description available."}
                    </p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {getProjectTechStack(project).slice(0, 3).map((item) => (
                        <span key={item} className="rounded-full bg-[var(--card-strong)] px-3 py-1 text-xs text-[var(--muted)]">
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                  <ExternalLink size={16} className="shrink-0 text-[var(--primary)]" />
                </div>
                <div className="mt-4 flex items-center justify-between text-sm text-[var(--muted)]">
                  <span>{getProjectLiveUrl(project) ? "Live URL available" : project.source === "github" ? "GitHub" : "Manual"}</span>
                  <span>★ {project.stars || 0}</span>
                </div>
              </Link>
            ))
          ) : (
            <div className="rounded-3xl border border-dashed border-[var(--border)] bg-[var(--card-soft)] p-5 text-sm text-[var(--muted)]">
              No projects available yet. Add manual projects from the admin panel or enable GitHub sync.
            </div>
          )}
        </div>
      </div>
    ),
    education: (
      <div className="space-y-4">
        {resume.education?.map((item) => (
          <div key={`${item.degree}-${item.school}`} className={cardClass}>
            <p className="font-display text-lg font-semibold text-[var(--text)]">{item.degree}</p>
            <p className="text-sm text-[var(--muted)]">
              {item.school} • {item.year}
            </p>
            <p className="mt-2 text-sm leading-7 text-[var(--muted)]">{item.details}</p>
          </div>
        ))}
      </div>
    ),
    contact: (
      <div className="grid gap-4 md:grid-cols-2">
        <div className={cardClass}>
          <p className="font-display text-lg font-semibold text-[var(--text)]">Reach Out</p>
          <div className="mt-3 space-y-2 text-sm text-[var(--muted)]">
            <p>{resume.contact?.email}</p>
            <p>{resume.contact?.phone}</p>
            <p>{resume.contact?.location}</p>
          </div>
        </div>
        <div className={cardClass}>
          <p className="font-display text-lg font-semibold text-[var(--text)]">Profiles</p>
          <div className="mt-4 flex flex-wrap gap-3">
            <a href={resume.contact?.github} target="_blank" rel="noreferrer" className="rounded-full bg-[var(--card-strong)] p-3 text-[var(--muted)] hover:text-[var(--primary)]">
              <Github size={18} />
            </a>
            <a href={resume.contact?.linkedin} target="_blank" rel="noreferrer" className="rounded-full bg-[var(--card-strong)] p-3 text-[var(--muted)] hover:text-[var(--primary)]">
              <Linkedin size={18} />
            </a>
            <a href={resume.contact?.leetcode} target="_blank" rel="noreferrer" className="rounded-full bg-[var(--card-strong)] p-3 text-[var(--muted)] hover:text-[var(--primary)]">
              <Trophy size={18} />
            </a>
          </div>
        </div>
      </div>
    )
  };

  return (
    <div className="glass-panel section-scrollbar max-h-[48vh] overflow-y-auto rounded-[2rem] p-6 sm:p-7">
      <div className="mb-4">
        <p className="text-xs uppercase tracking-[0.35em] text-[var(--primary)]">Active Section</p>
        <h2 className="font-display text-3xl font-bold capitalize text-[var(--text)]">{activeSection}</h2>
      </div>
      {sectionMap[activeSection]}
    </div>
  );
}

export default SectionContentPanel;
