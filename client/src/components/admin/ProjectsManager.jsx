import { ExternalLink, Github, PencilLine, Trash2, X } from "lucide-react";
import { Link } from "react-router-dom";
import { getProjectGithubUrl, getProjectHighlights, getProjectId, getProjectLiveUrl, getProjectTechStack } from "../../lib/projects";

function ProjectsManager({
  projects,
  newProject,
  setNewProject,
  editingProject,
  setEditingProject,
  onAddProject,
  onStartEditProject,
  onUpdateProject,
  onDeleteProject,
  isSaving
}) {
  const renderProjectForm = (project, update) => (
    <div className="grid gap-4">
      <div className="grid gap-4 md:grid-cols-2">
        <input value={project.title} onChange={(event) => update("title", event.target.value)} className="input-field" placeholder="Project title" />
        <input value={project.githubUrl} onChange={(event) => update("githubUrl", event.target.value)} className="input-field" placeholder="GitHub URL" />
      </div>
      <textarea rows="4" value={project.description} onChange={(event) => update("description", event.target.value)} className="input-field min-h-28 resize-y" placeholder="Description" />
      <div className="grid gap-4 md:grid-cols-2">
        <input value={project.liveUrl} onChange={(event) => update("liveUrl", event.target.value)} className="input-field" placeholder="Live URL" />
        <input value={project.url || ""} onChange={(event) => update("url", event.target.value)} className="input-field" placeholder="Primary project URL" />
      </div>
      <div className="grid gap-4 md:grid-cols-[1fr_140px]">
        <input value={project.techStackInput} onChange={(event) => update("techStackInput", event.target.value)} className="input-field" placeholder="Tech stack, comma separated" />
        <input type="number" value={project.stars} onChange={(event) => update("stars", Number(event.target.value))} className="input-field" placeholder="Stars" />
      </div>
      <textarea
        rows="4"
        value={project.highlightsInput}
        onChange={(event) => update("highlightsInput", event.target.value)}
        className="input-field min-h-28 resize-y"
        placeholder="Highlights, one point per line"
      />
      {"hidden" in project ? (
        <label className="flex items-center gap-3 text-sm text-[var(--muted)]">
          <input type="checkbox" checked={project.hidden} onChange={(event) => update("hidden", event.target.checked)} />
          Hide this GitHub project from the public portfolio
        </label>
      ) : null}
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="surface-panel p-6">
        <p className="text-sm font-medium text-[var(--primary)]">Project Management</p>
        <h2 className="mt-1 font-display text-3xl font-semibold text-[var(--text)]">Add, edit, and hide projects</h2>
        <p className="mt-2 max-w-2xl text-sm leading-7 text-[var(--muted)]">
          Manual and GitHub-synced projects are both manageable here. GitHub projects use MongoDB overrides so edits and hidden states persist safely.
        </p>
      </div>

      <div className="surface-panel p-6">
        {renderProjectForm(newProject, (field, value) => setNewProject((current) => ({ ...current, [field]: value })))}
        <button type="button" onClick={onAddProject} disabled={isSaving} className="primary-button mt-5">
          {isSaving ? "Saving..." : "Add project"}
        </button>
      </div>

      {editingProject ? (
        <div className="surface-panel p-6">
          <div className="mb-5 flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-[var(--primary)]">Editing Project</p>
              <h3 className="mt-1 font-display text-2xl font-semibold text-[var(--text)]">{editingProject.title || "Untitled project"}</h3>
            </div>
            <button type="button" onClick={() => setEditingProject(null)} className="icon-button">
              <X size={16} />
            </button>
          </div>

          {renderProjectForm(editingProject, (field, value) => setEditingProject((current) => ({ ...current, [field]: value })))}

          <div className="mt-5 flex flex-wrap gap-3">
            <button type="button" onClick={onUpdateProject} disabled={isSaving} className="primary-button">
              {isSaving ? "Saving..." : "Save changes"}
            </button>
            <button type="button" onClick={() => setEditingProject(null)} className="secondary-button">
              Cancel
            </button>
          </div>
        </div>
      ) : null}

      <div className="grid gap-4">
        {projects.length > 0 ? (
          projects.map((project) => (
            <div key={getProjectId(project)} className="surface-panel p-6">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="max-w-3xl">
                  <div className="flex flex-wrap items-center gap-3">
                    <p className="font-display text-2xl font-semibold text-[var(--text)]">{project.title}</p>
                    <span className="rounded-full border border-[var(--border)] bg-[var(--card-soft)] px-3 py-1 text-xs font-medium text-[var(--muted)]">
                      {project.source === "github" ? "GitHub project" : "Manual project"}
                    </span>
                    {project.hidden ? (
                      <span className="rounded-full border border-amber-400/30 bg-amber-500/10 px-3 py-1 text-xs font-medium text-amber-700">Hidden publicly</span>
                    ) : null}
                    <span className="rounded-full border border-[var(--border)] bg-[var(--card-soft)] px-3 py-1 text-xs font-medium text-[var(--muted)]">
                      Stars: {project.stars || 0}
                    </span>
                  </div>
                  <p className="mt-3 text-sm leading-7 text-[var(--muted)]">{project.description || "No description available."}</p>
                </div>

                <div className="flex flex-wrap gap-2">
                  <button type="button" onClick={() => onStartEditProject(project)} className="secondary-button py-2 text-sm">
                    <PencilLine size={14} />
                    Edit
                  </button>
                  {project.source === "manual" ? (
                    <button type="button" onClick={() => onDeleteProject(project._id || project.id)} className="icon-button">
                      <Trash2 size={16} />
                    </button>
                  ) : (
                    <button type="button" onClick={() => onDeleteProject(project.id)} className="secondary-button py-2 text-sm">
                      <Trash2 size={14} />
                      {project.hidden ? "Keep hidden" : "Hide"}
                    </button>
                  )}
                </div>
              </div>

              <div className="mt-5 grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--primary)]">Highlights</p>
                  <div className="mt-3 space-y-3">
                    {getProjectHighlights(project).map((highlight) => (
                      <p key={highlight} className="rounded-2xl border border-[var(--border)] bg-[var(--card-soft)] px-4 py-3 text-sm leading-7 text-[var(--muted)]">
                        {highlight}
                      </p>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--primary)]">Links</p>
                    <div className="mt-3 grid gap-3">
                      <a
                        href={getProjectGithubUrl(project) || "#"}
                        target="_blank"
                        rel="noreferrer"
                        className="rounded-2xl border border-[var(--border)] bg-[var(--card-soft)] px-4 py-3 text-sm text-[var(--muted)] hover:text-[var(--text)]"
                      >
                        <span className="inline-flex items-center gap-2">
                          <Github size={14} />
                          GitHub URL
                        </span>
                        <p className="mt-2 break-all">{getProjectGithubUrl(project) || "Not available"}</p>
                      </a>
                      <div className="rounded-2xl border border-[var(--border)] bg-[var(--card-soft)] px-4 py-3 text-sm text-[var(--muted)]">
                        <span className="inline-flex items-center gap-2">
                          <ExternalLink size={14} />
                          Live URL
                        </span>
                        <p className="mt-2 break-all">{getProjectLiveUrl(project) || "Not available"}</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--primary)]">Tech Stack</p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {getProjectTechStack(project).length > 0 ? (
                        getProjectTechStack(project).map((item) => (
                          <span key={item} className="rounded-full border border-[var(--border)] bg-[var(--card-soft)] px-3 py-1 text-xs font-medium text-[var(--muted)]">
                            {item}
                          </span>
                        ))
                      ) : (
                        <span className="text-sm text-[var(--muted)]">No tech stack listed</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-5 flex flex-wrap gap-3">
                <Link to={`/projects/${encodeURIComponent(getProjectId(project))}`} className="secondary-button py-2 text-sm">
                  Details
                </Link>
                {getProjectLiveUrl(project) && (
                  <a href={getProjectLiveUrl(project)} target="_blank" rel="noreferrer" className="secondary-button py-2 text-sm">
                    <ExternalLink size={14} />
                    Live
                  </a>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="surface-panel p-8 text-sm text-[var(--muted)]">No projects available yet. Add one or enable GitHub sync.</div>
        )}
      </div>
    </div>
  );
}

export default ProjectsManager;
