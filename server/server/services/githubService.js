const axios = require("axios");

async function fetchGitHubProjects(username) {
  const response = await axios.get(`https://api.github.com/users/${username}/repos`, {
    headers: {
      Accept: "application/vnd.github+json",
      "User-Agent": "three-resume-portfolio"
    }
  });

  return response.data
    .sort((a, b) => b.stargazers_count - a.stargazers_count)
    .slice(0, 8)
    .map((repo) => ({
      id: `github-${repo.id}`,
      title: repo.name,
      description: repo.description,
      stars: repo.stargazers_count,
      url: repo.html_url,
      githubUrl: repo.html_url,
      liveUrl: repo.homepage || "",
      language: repo.language || "Repository",
      updatedAt: repo.updated_at,
      techStack: [repo.language, ...(repo.topics || [])].filter(Boolean).slice(0, 6),
      highlights: [
        repo.description || "GitHub repository from Vivek Kumar's public profile.",
        `${repo.stargazers_count} stars and ${repo.forks_count} forks on GitHub.`,
        repo.homepage ? "Includes a live deployment URL." : "Source code is available on GitHub."
      ],
      source: "github"
    }));
}

function getFallbackGitHubProjects() {
  return [
    {
      id: "fallback-buildmart",
      title: "BuildMart",
      description: "Full-stack marketplace project with product browsing, authentication, and deployment-ready client experience.",
      stars: 0,
      url: "https://github.com/Loop213/BuildMart",
      githubUrl: "https://github.com/Loop213/BuildMart",
      liveUrl: "https://build-mart-client-khaki.vercel.app",
      language: "JavaScript",
      techStack: ["React", "Node.js", "MongoDB", "Express"],
      highlights: [
        "Built as a MERN-style full-stack commerce experience.",
        "Includes a deployed frontend URL for live review.",
        "Designed to demonstrate authentication, product data, and API integration."
      ],
      source: "github"
    },
    {
      id: "fallback-college-mis",
      title: "College MIS",
      description: "Management information system interface for college workflows and structured student or academic data.",
      stars: 0,
      url: "https://github.com/Loop213/college_mis",
      githubUrl: "https://github.com/Loop213/college_mis",
      liveUrl: "https://college-mis-kappa.vercel.app",
      language: "JavaScript",
      techStack: ["JavaScript", "React", "Dashboard UI"],
      highlights: [
        "Focused on structured information display and dashboard UX.",
        "Includes a live Vercel deployment.",
        "Useful example of data-heavy interface design."
      ],
      source: "github"
    },
    {
      id: "fallback-birthday",
      title: "Birthday",
      description: "A lightweight celebratory web experience with a deployed client.",
      stars: 0,
      url: "https://github.com/Loop213/birthday",
      githubUrl: "https://github.com/Loop213/birthday",
      liveUrl: "https://birthday-client-five.vercel.app",
      language: "JavaScript",
      techStack: ["JavaScript", "Frontend"],
      highlights: [
        "Small interactive frontend project.",
        "Includes public source code and live deployment.",
        "Good example of fast visual delivery."
      ],
      source: "github"
    }
  ];
}

module.exports = { fetchGitHubProjects, getFallbackGitHubProjects };
