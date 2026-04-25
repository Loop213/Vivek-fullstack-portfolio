import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, CalendarDays, ExternalLink, Github, RadioTower, Star } from "lucide-react";
import api from "../lib/api";
import RouteLoader from "../components/RouteLoader";
import ThemeToggle from "../components/ThemeToggle";
import { useTheme } from "../context/ThemeContext";
import { getProjectGithubUrl, getProjectHighlights, getProjectLiveUrl, getProjectTechStack } from "../lib/projects";

function ProjectDetailPage() {
  const { projectId } = useParams();
  const { theme, toggleTheme } = useTheme();
  const [project, setProject] = useState(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadProject = async () => {
      try {
        const response = await api.get(`/projects/${encodeURIComponent(projectId)}`);
        setProject(response.data.project);
      } catch (_error) {
        setError("This project could not be found. It may have been removed or GitHub sync may be unavailable.");
      } finally {
        setIsLoading(false);
      }
    };

    loadProject();
  }, [projectId]);

  const techStack = useMemo(() => (project ? getProjectTechStack(project) : []), [project]);
  const highlights = useMemo(() => (project ? getProjectHighlights(project) : []), [project]);
  const githubUrl = project ? getProjectGithubUrl(project) : "";
  const liveUrl = project ? getProjectLiveUrl(project) : "";
  const updatedDate = project?.updatedAt
    ? new Intl.DateTimeFormat("en", { month: "short", day: "numeric", year: "numeric" }).format(new Date(project.updatedAt))
    : "";

  if (isLoading) {
    return <RouteLoader />;
  }

  if (error || !project) {
    return (
      <div className="min-h-screen px-4 py-6 sm:px-6">
        <div className="mx-auto max-w-4xl">
          <Link to="/" className="secondary-button">
            <ArrowLeft size={16} />
            Back
          </Link>
          <div className="mt-8 surface-panel p-8">
            <p className="font-display text-3xl font-semibold text-[var(--text)]">Project unavailable</p>
            <p className="mt-3 text-[var(--muted)]">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-hidden px-4 py-6 sm:px-6">
      <div className="absolute inset-0 bg-hero opacity-80" />
      <div className="absolute inset-0 bg-grid-mask opacity-35" />

      <main className="relative mx-auto max-w-6xl">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <Link to="/" className="secondary-button">
            <ArrowLeft size={16} />
            Portfolio
          </Link>
          <ThemeToggle theme={theme} onToggle={toggleTheme} />
        </div>

        <section className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--card)]/80 px-4 py-2 text-sm text-[var(--muted)] backdrop-blur-xl">
              <RadioTower size={16} className="text-[var(--primary)]" />
              {project.source === "github" ? "GitHub synced project" : "Featured manual project"}
            </div>

            <div>
              <h1 className="font-display text-4xl font-bold leading-tight text-[var(--text)] sm:text-6xl">
                {project.title}
              </h1>
              <p className="mt-5 max-w-3xl text-base leading-8 text-[var(--muted)] sm:text-lg">
                {project.description || "A selected portfolio project with source details and deployment information."}
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              {githubUrl && (
                <a href={githubUrl} target="_blank" rel="noreferrer" className="primary-button">
                  <Github size={16} />
                  GitHub
                </a>
              )}
              {liveUrl && (
                <a href={liveUrl} target="_blank" rel="noreferrer" className="secondary-button">
                  <ExternalLink size={16} />
                  Live URL
                </a>
              )}
            </div>
          </div>

          <div className="surface-panel p-6">
            <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-2">
              <div className="rounded-lg border border-[var(--border)] bg-[var(--card-soft)] p-4">
                <p className="text-sm text-[var(--muted)]">Stars</p>
                <p className="mt-2 inline-flex items-center gap-2 font-display text-3xl font-semibold text-[var(--text)]">
                  <Star size={20} className="text-[var(--primary)]" />
                  {project.stars || 0}
                </p>
              </div>
              <div className="rounded-lg border border-[var(--border)] bg-[var(--card-soft)] p-4">
                <p className="text-sm text-[var(--muted)]">Source</p>
                <p className="mt-2 font-display text-3xl font-semibold capitalize text-[var(--text)]">{project.source}</p>
              </div>
              <div className="rounded-lg border border-[var(--border)] bg-[var(--card-soft)] p-4 sm:col-span-3 lg:col-span-2">
                <p className="text-sm text-[var(--muted)]">Last updated</p>
                <p className="mt-2 inline-flex items-center gap-2 font-display text-2xl font-semibold text-[var(--text)]">
                  <CalendarDays size={18} className="text-[var(--primary)]" />
                  {updatedDate || "Not available"}
                </p>
              </div>
            </div>

            <div className="mt-6 space-y-3">
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[var(--primary)]">Project Links</p>
              <div className="space-y-3 text-sm">
                <p className="break-all text-[var(--muted)]">
                  <span className="font-semibold text-[var(--text)]">GitHub:</span> {githubUrl || "Not added"}
                </p>
                <p className="break-all text-[var(--muted)]">
                  <span className="font-semibold text-[var(--text)]">Live URL:</span> {liveUrl || "Not added yet"}
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-10 grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="surface-panel p-6">
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[var(--primary)]">Tech Stack</p>
            <div className="mt-5 flex flex-wrap gap-3">
              {techStack.length > 0 ? (
                techStack.map((item) => (
                  <span key={item} className="rounded-full border border-[var(--border)] bg-[var(--card-soft)] px-4 py-2 text-sm text-[var(--text)]">
                    {item}
                  </span>
                ))
              ) : (
                <p className="text-sm text-[var(--muted)]">Tech stack details are not available yet.</p>
              )}
            </div>
          </div>

          <div className="surface-panel p-6">
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[var(--primary)]">Details</p>
            <div className="mt-5 grid gap-4">
              {highlights.map((highlight) => (
                <div key={highlight} className="rounded-lg border border-[var(--border)] bg-[var(--card-soft)] p-4 text-sm leading-7 text-[var(--muted)]">
                  {highlight}
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default ProjectDetailPage;
