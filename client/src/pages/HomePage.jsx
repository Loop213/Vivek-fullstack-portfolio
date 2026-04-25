import { lazy, Suspense, useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight, BriefcaseBusiness, Code2, Database, GraduationCap, Mail, RadioTower, ShieldCheck, Star } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import api from "../lib/api";
import AvatarFrame from "../components/AvatarFrame";
import LoadingScreen from "../components/LoadingScreen";
import PortfolioExperienceBoundary from "../components/PortfolioExperienceBoundary";
import SocialDock from "../components/SocialDock";
import PortfolioNavbar from "../components/PortfolioNavbar";
import PortfolioFooter from "../components/PortfolioFooter";
import { useTheme } from "../context/ThemeContext";
import { getProjectId, getProjectImageUrl, getProjectLiveUrl, getProjectTechStack } from "../lib/projects";

const FullThreePortfolio = lazy(() => import("../components/experience/FullThreePortfolio"));

const fallbackResume = {
  name: "Vivek Kumar",
  role: "Full Stack Developer",
  bio: "I build polished full-stack applications with React, Node.js, MongoDB, and thoughtful product UI.",
  avatarUrl: "",
  threeDEnabled: false,
  skills: ["JavaScript", "Node.js", "Express", "MongoDB", "React", "Three.js"],
  experience: [
    {
      title: "Full Stack Developer",
      company: "Freelance / Personal Projects",
      period: "2023 - Present",
      highlights: ["Built MERN applications with modern UI/UX.", "Created APIs, dashboards, and portfolio experiences."]
    }
  ],
  education: [{ degree: "B.Tech in Computer Science", school: "Parul University", year: "2023 - 2027", details: "Focused on full-stack development and interactive products." }],
  contact: { email: "vivek@example.com", phone: "+91 00000 00000", location: "India" }
};

function SectionHeader({ eyebrow, title, description }) {
  return (
    <div className="mb-10 max-w-3xl">
      <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[var(--primary)]">{eyebrow}</p>
      <h2 className="mt-3 font-display text-3xl font-bold text-[var(--text)] md:text-5xl">{title}</h2>
      {description && <p className="mt-4 max-w-2xl text-base leading-8 text-[var(--muted)]">{description}</p>}
    </div>
  );
}

function ProjectCard({ project }) {
  const liveUrl = getProjectLiveUrl(project);
  const techStack = getProjectTechStack(project);
  const imageUrl = getProjectImageUrl(project);

  return (
    <Link
      to={`/projects/${encodeURIComponent(getProjectId(project))}`}
      className="group rounded-[28px] border border-white/10 bg-[var(--card)]/80 p-6 shadow-[var(--shadow)] backdrop-blur-2xl transition duration-300 hover:-translate-y-1.5 hover:border-[var(--primary)]/35 hover:shadow-[0_28px_90px_rgba(15,23,42,0.16)]"
    >
      {imageUrl ? <img src={imageUrl} alt={project.title} className="mb-5 h-48 w-full rounded-[22px] object-cover" /> : null}
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="font-display text-2xl font-semibold text-[var(--text)]">{project.title}</p>
          <p className="mt-3 line-clamp-3 text-sm leading-7 text-[var(--muted)]">
            {project.description || "A selected project from Vivek Kumar's portfolio."}
          </p>
        </div>
        <ArrowUpRight className="shrink-0 text-[var(--primary)] transition group-hover:translate-x-1 group-hover:-translate-y-1" size={18} />
      </div>
      <div className="mt-6 flex flex-wrap gap-2">
        {techStack.slice(0, 4).map((item) => (
          <span key={item} className="rounded-full border border-[var(--border)] bg-white/5 px-3 py-1.5 text-xs font-medium text-[var(--muted)]">
            {item}
          </span>
        ))}
      </div>
      <div className="mt-6 flex items-center justify-between text-sm text-[var(--muted)]">
        <span className="inline-flex items-center gap-1">
          <Star size={14} className="text-[var(--primary)]" />
          {project.stars || 0}
        </span>
        <span>{liveUrl ? "Live demo" : project.source === "github" ? "GitHub repo" : "Manual project"}</span>
      </div>
    </Link>
  );
}

function HomePage() {
  const navigate = useNavigate();
  const [resume, setResume] = useState(null);
  const [projects, setProjects] = useState([]);
  const [projectMeta, setProjectMeta] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [forceTwoD, setForceTwoD] = useState(false);
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    const loadData = async () => {
      try {
        const [resumeResponse, projectsResponse] = await Promise.all([api.get("/resume"), api.get("/projects")]);
        setResume(resumeResponse.data.resume || fallbackResume);
        setProjects(projectsResponse.data.projects || []);
        setProjectMeta(projectsResponse.data.meta);
      } catch (_requestError) {
        setResume(fallbackResume);
        setProjects([]);
        setProjectMeta({ githubAutoFetch: false, fallbackUsed: true });
        setForceTwoD(true);
        setError("Live data could not be loaded, so a safe portfolio fallback is being shown.");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const featuredProjects = useMemo(() => projects.slice(0, 6), [projects]);
  const safeResume = resume || fallbackResume;
  const threeDEnabled = (safeResume?.threeDEnabled ?? true) && !forceTwoD;

  if (loading) {
    return <LoadingScreen />;
  }

  const standardPortfolio = (
    <>
      <section id="home" className="mx-auto max-w-7xl px-4 pb-16 pt-8 sm:px-6">
        <div className="overflow-hidden rounded-[36px] border border-white/10 bg-[var(--card)]/70 px-6 py-8 shadow-[0_30px_120px_rgba(15,23,42,0.12)] backdrop-blur-2xl md:px-8 md:py-10">
          <div className="grid items-center gap-10 lg:grid-cols-[1.15fr_0.85fr]">
            <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} className="max-w-4xl">
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[var(--primary)]">Full Stack Developer</p>
              <h1 className="mt-5 font-display text-5xl font-extrabold leading-tight text-[var(--text)] md:text-7xl">{safeResume?.name || "Vivek Kumar"}</h1>
              <p className="mt-6 max-w-2xl text-lg leading-9 text-[var(--muted)]">
                {safeResume?.bio || "I build clean full-stack products with React, Node.js, MongoDB, and thoughtful interactive experiences."}
              </p>
              {error && <p className="mt-4 text-sm text-amber-600">{error}</p>}
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <a href="#projects" className="primary-button">
                  View Projects
                  <ArrowUpRight size={16} />
                </a>
                <a href="#contact" className="secondary-button">
                  Contact Me
                </a>
                <SocialDock contact={safeResume?.contact} />
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} className="justify-self-start lg:justify-self-end">
              <div className="rounded-[30px] border border-white/10 bg-[var(--card-strong)]/90 p-6 shadow-[var(--shadow)] backdrop-blur-xl">
                <AvatarFrame name={safeResume?.name} avatarUrl={safeResume?.avatarUrl} />
                <div className="mt-5">
                  <p className="font-display text-2xl font-bold text-[var(--text)]">{safeResume?.role || "Full Stack Developer"}</p>
                  <p className="mt-2 text-sm leading-7 text-[var(--muted)]">{safeResume?.contact?.location || "India"}</p>
                </div>
              </div>
            </motion.div>
          </div>

          <div className="mt-10 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {[
              { label: "Projects", value: projects.length || 0, icon: BriefcaseBusiness },
              { label: "GitHub Sync", value: projectMeta?.githubAutoFetch ? "On" : "Off", icon: RadioTower },
              { label: "Auth", value: "JWT", icon: ShieldCheck },
              { label: "Database", value: "MongoDB", icon: Database }
            ].map(({ label, value, icon: Icon }) => (
              <div key={label} className="rounded-[24px] border border-white/10 bg-white/5 p-5">
                <Icon size={18} className="text-[var(--primary)]" />
                <p className="mt-3 text-sm text-[var(--muted)]">{label}</p>
                <p className="mt-1 font-display text-2xl font-bold text-[var(--text)]">{value}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="about" className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <SectionHeader eyebrow="About" title="Clean interfaces, reliable APIs, and practical product thinking." />
        <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="rounded-[28px] border border-white/10 bg-[var(--card)]/76 p-7 shadow-[var(--shadow)] backdrop-blur-xl">
            <p className="text-base leading-8 text-[var(--muted)]">{safeResume?.bio}</p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {safeResume?.skills?.map((skill) => (
              <div key={skill} className="rounded-[24px] border border-white/10 bg-[var(--card)]/72 p-5 text-sm font-semibold text-[var(--text)] shadow-[var(--shadow)] backdrop-blur-xl">
                <Code2 size={16} className="mb-3 text-[var(--primary)]" />
                {skill}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="skills" className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <SectionHeader eyebrow="Skills" title="Tools I use to ship full-stack products." />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {safeResume?.skills?.map((skill) => (
            <div key={skill} className="rounded-[24px] border border-white/10 bg-[var(--card)]/72 p-5 text-sm font-semibold text-[var(--text)] shadow-[var(--shadow)] backdrop-blur-xl transition hover:-translate-y-1 hover:border-[var(--primary)]/25">
              <Code2 size={16} className="mb-3 text-[var(--primary)]" />
              {skill}
            </div>
          ))}
        </div>
      </section>

      <section id="projects" className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <SectionHeader eyebrow="Projects" title="Selected work with source and live links." description="Each project opens inside the portfolio with full details, GitHub URL, live URL, tech stack, and highlights." />
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {featuredProjects.map((project) => (
            <ProjectCard key={getProjectId(project)} project={project} />
          ))}
          {featuredProjects.length === 0 ? <div className="rounded-[28px] border border-white/10 bg-[var(--card)]/76 p-6 text-sm text-[var(--muted)]">Projects are temporarily unavailable. Start the backend or re-enable GitHub sync to restore them.</div> : null}
        </div>
      </section>

      <section id="experience" className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <SectionHeader eyebrow="Experience" title="Recent work and development focus." />
        <div className="grid gap-5 lg:grid-cols-2">
          {safeResume?.experience?.map((item) => (
            <div key={`${item.title}-${item.company}`} className="rounded-[28px] border border-white/10 bg-[var(--card)]/76 p-6 shadow-[var(--shadow)] backdrop-blur-xl">
              <BriefcaseBusiness size={20} className="text-[var(--primary)]" />
              <p className="mt-4 font-display text-xl font-semibold text-[var(--text)]">{item.title}</p>
              <p className="mt-1 text-sm text-[var(--muted)]">
                {item.company} | {item.period}
              </p>
              <div className="mt-4 space-y-3">
                {item.highlights?.map((highlight) => (
                  <p key={highlight} className="text-sm leading-7 text-[var(--muted)]">
                    {highlight}
                  </p>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section id="education" className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <SectionHeader eyebrow="Education" title="Academic background." />
        <div className="grid gap-5 lg:grid-cols-2">
          {safeResume?.education?.map((item) => (
            <div key={`${item.degree}-${item.school}`} className="rounded-[28px] border border-white/10 bg-[var(--card)]/76 p-6 shadow-[var(--shadow)] backdrop-blur-xl">
              <GraduationCap size={20} className="text-[var(--primary)]" />
              <p className="mt-4 font-display text-xl font-semibold text-[var(--text)]">{item.degree}</p>
              <p className="mt-1 text-sm text-[var(--muted)]">
                {item.school} | {item.year}
              </p>
              <p className="mt-4 text-sm leading-7 text-[var(--muted)]">{item.details}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="contact" className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <div className="overflow-hidden rounded-[32px] border border-white/10 bg-[var(--card)]/78 p-6 shadow-[var(--shadow)] backdrop-blur-2xl md:p-8">
          <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
            <div>
              <Mail size={22} className="text-[var(--primary)]" />
              <h2 className="mt-4 font-display text-3xl font-bold text-[var(--text)]">Let’s build something useful.</h2>
              <p className="mt-4 max-w-xl text-sm leading-7 text-[var(--muted)]">Open to full-stack opportunities, product collaborations, and portfolio-grade web experiences.</p>
            </div>
            <div className="grid gap-3 text-sm text-[var(--muted)] md:grid-cols-3 lg:grid-cols-1">
              <p className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">{safeResume?.contact?.email}</p>
              <p className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">{safeResume?.contact?.phone}</p>
              <p className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">{safeResume?.contact?.location}</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );

  return (
    <div className="relative min-h-screen overflow-hidden">
      <div className="absolute inset-0 bg-hero opacity-80" />
      <div className="absolute inset-0 bg-grid-mask opacity-30" />

      <PortfolioNavbar theme={theme} onThemeToggle={toggleTheme} />

      <main className="relative z-10">
        {threeDEnabled ? (
          <PortfolioExperienceBoundary fallback={standardPortfolio} resetKey={`${safeResume?.threeDDesign || "design1"}-${projects.length}`} onError={() => setForceTwoD(true)}>
            <Suspense fallback={<LoadingScreen />}>
              <FullThreePortfolio
                resume={safeResume}
                projects={projects}
                onOpenProject={(project) => navigate(`/projects/${encodeURIComponent(getProjectId(project))}`)}
              />
            </Suspense>
          </PortfolioExperienceBoundary>
        ) : (
          standardPortfolio
        )}
      </main>
      <PortfolioFooter resume={safeResume} />
    </div>
  );
}

export default HomePage;
