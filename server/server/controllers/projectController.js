const Project = require("../models/Project");
const ProjectOverride = require("../models/ProjectOverride");
const Resume = require("../models/Resume");
const { fetchGitHubProjects, getFallbackGitHubProjects } = require("../services/githubService");

function normalizeManualProject(project) {
  return {
    ...project.toObject(),
    id: project._id.toString(),
    imageUrl: project.imageUrl || "",
    githubUrl: project.githubUrl || project.url,
    liveUrl: project.liveUrl || "",
    source: "manual"
  };
}

function mergeGitHubProjects(githubProjects, overrides, { includeHidden = false } = {}) {
  return githubProjects
    .map((project) => {
      const override = overrides.get(project.id);
      const hasText = (value) => typeof value === "string";
      const merged = {
        ...project,
        title: hasText(override?.title) ? override.title : project.title,
        description: hasText(override?.description) ? override.description : project.description,
        imageUrl: hasText(override?.imageUrl) ? override.imageUrl : project.imageUrl || "",
        url: hasText(override?.url) ? override.url : project.url,
        githubUrl: hasText(override?.githubUrl) ? override.githubUrl : project.githubUrl || project.url,
        liveUrl: hasText(override?.liveUrl) ? override.liveUrl : project.liveUrl || "",
        techStack: Array.isArray(override?.techStack) ? override.techStack : project.techStack,
        highlights: Array.isArray(override?.highlights) ? override.highlights : project.highlights,
        stars: typeof override?.stars === "number" ? override.stars : project.stars,
        hidden: override?.hidden ?? false,
        overrideId: override?._id?.toString() || null
      };

      return merged;
    })
    .filter((project) => includeHidden || !project.hidden);
}

async function loadProjectSources({ includeHidden = false } = {}) {
  const [manualProjects, overrides, resume] = await Promise.all([
    Project.find().sort({ createdAt: -1 }),
    ProjectOverride.find().sort({ updatedAt: -1 }),
    Resume.findOne()
  ]);

  const normalizedManualProjects = manualProjects.map(normalizeManualProject);
  const overrideMap = new Map(overrides.map((override) => [override.githubId, override]));

  let githubProjects = [];
  let fallbackUsed = false;

  if (resume?.githubAutoFetch) {
    try {
      githubProjects = await fetchGitHubProjects(process.env.GITHUB_USERNAME || "loop213");
    } catch (_error) {
      fallbackUsed = true;
      githubProjects = getFallbackGitHubProjects();
    }
  }

  const mergedGitHubProjects = mergeGitHubProjects(githubProjects, overrideMap, { includeHidden });

  return {
    projects: [...mergedGitHubProjects, ...normalizedManualProjects],
    meta: {
      fallbackUsed,
      githubAutoFetch: resume?.githubAutoFetch ?? false
    }
  };
}

async function getProjects(_req, res) {
  const data = await loadProjectSources({ includeHidden: false });
  return res.json(data);
}

async function getProjectsForAdmin(_req, res) {
  const data = await loadProjectSources({ includeHidden: true });
  return res.json(data);
}

async function getProject(req, res) {
  const { id } = req.params;
  const { projects } = await loadProjectSources({ includeHidden: false });

  const project = projects.find((item) => item.id === id || item._id?.toString() === id || encodeURIComponent(item.title) === id);

  if (!project) {
    return res.status(404).json({ message: "Project not found." });
  }

  return res.json({ project });
}

async function addProject(req, res) {
  const project = await Project.create({ ...req.body, source: "manual" });
  return res.status(201).json({ project: normalizeManualProject(project) });
}

async function updateProject(req, res) {
  const { id } = req.params;

  if (id.startsWith("github-") || id.startsWith("fallback-")) {
    const payload = {
      githubId: id,
      title: req.body.title || "",
      description: req.body.description || "",
      imageUrl: req.body.imageUrl || "",
      url: req.body.url || req.body.githubUrl || "",
      githubUrl: req.body.githubUrl || req.body.url || "",
      liveUrl: req.body.liveUrl || "",
      techStack: Array.isArray(req.body.techStack) ? req.body.techStack : [],
      highlights: Array.isArray(req.body.highlights) ? req.body.highlights : [],
      stars: Number(req.body.stars) || 0,
      hidden: Boolean(req.body.hidden)
    };

    const override = await ProjectOverride.findOneAndUpdate({ githubId: id }, payload, {
      new: true,
      upsert: true,
      setDefaultsOnInsert: true
    });

    return res.json({ project: override });
  }

  const project = await Project.findByIdAndUpdate(id, req.body, { new: true });

  if (!project) {
    return res.status(404).json({ message: "Project not found." });
  }

  return res.json({ project: normalizeManualProject(project) });
}

async function deleteProject(req, res) {
  const { id } = req.params;

  if (id.startsWith("github-") || id.startsWith("fallback-")) {
    await ProjectOverride.findOneAndUpdate(
      { githubId: id },
      { githubId: id, hidden: true },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
    return res.json({ success: true, hidden: true });
  }

  await Project.findByIdAndDelete(id);
  return res.json({ success: true });
}

module.exports = { getProjects, getProjectsForAdmin, getProject, addProject, updateProject, deleteProject };
