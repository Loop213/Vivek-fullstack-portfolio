export function getProjectId(project) {
  return project.id || project._id || encodeURIComponent(project.title);
}

export function getProjectGithubUrl(project) {
  return project.githubUrl || project.url || "";
}

export function getProjectLiveUrl(project) {
  return project.liveUrl || project.demoUrl || "";
}

export function getProjectTechStack(project) {
  return (project.techStack || [project.language]).filter(Boolean).slice(0, 8);
}

export function getProjectHighlights(project) {
  if (project.highlights?.length) {
    return project.highlights.filter(Boolean);
  }

  return [
    project.description || "A selected project from the portfolio.",
    project.source === "github" ? "Fetched dynamically from GitHub." : "Added manually from the admin dashboard.",
    getProjectLiveUrl(project) ? "Includes a live deployment link." : "Source code is available for review."
  ];
}
