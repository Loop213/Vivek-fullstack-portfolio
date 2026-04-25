import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, RefreshCw } from "lucide-react";
import api from "../lib/api";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { useTheme } from "../context/ThemeContext";
import ThemeToggle from "../components/ThemeToggle";
import RouteLoader from "../components/RouteLoader";
import AdminSidebar from "../components/admin/AdminSidebar";
import AppearancePanel from "../components/admin/AppearancePanel";
import ResumeEditor from "../components/admin/ResumeEditor";
import ProjectsManager from "../components/admin/ProjectsManager";
import SettingsPanel from "../components/admin/SettingsPanel";

const emptyProject = {
  id: "",
  title: "",
  description: "",
  url: "",
  githubUrl: "",
  liveUrl: "",
  techStackInput: "",
  highlightsInput: "",
  stars: 0
};

function AdminDashboardPage() {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { pushToast } = useToast();
  const { theme, toggleTheme } = useTheme();
  const [activeTab, setActiveTab] = useState("resume");
  const [resume, setResume] = useState(null);
  const [projects, setProjects] = useState([]);
  const [newSkill, setNewSkill] = useState("");
  const [newProject, setNewProject] = useState(emptyProject);
  const [editingProject, setEditingProject] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSavingResume, setIsSavingResume] = useState(false);
  const [isSavingProject, setIsSavingProject] = useState(false);

  const loadAdminData = async () => {
    const [resumeResponse, projectsResponse] = await Promise.all([api.get("/resume"), api.get("/projects/admin/all")]);
    setResume(resumeResponse.data.resume);
    setProjects(projectsResponse.data.projects);
  };

  useEffect(() => {
    const run = async () => {
      try {
        await loadAdminData();
      } catch (error) {
        if (error.response?.status === 401) {
          logout();
          navigate("/admin", { replace: true });
        } else {
          pushToast({
            title: "Could not load dashboard",
            description: "Please refresh and confirm the API is running.",
            tone: "error"
          });
        }
      } finally {
        setIsLoading(false);
      }
    };

    run();
  }, [logout, navigate, pushToast]);

  const validationErrors = useMemo(() => {
    if (!resume) {
      return [];
    }

    const errors = [];
    if (!resume.name.trim()) {
      errors.push("Name is required.");
    }
    if (!resume.role.trim()) {
      errors.push("Role is required.");
    }
    if (!resume.bio.trim()) {
      errors.push("Bio is required.");
    }

    return errors;
  }, [resume]);

  const handleSaveResume = async () => {
    if (validationErrors.length > 0) {
      pushToast({ title: "Cannot save yet", description: validationErrors[0], tone: "error" });
      return;
    }

    try {
      setIsSavingResume(true);
      await api.put("/resume", resume);
      pushToast({ title: "Resume updated", description: "Your changes have been saved.", tone: "success" });
    } catch (error) {
      pushToast({
        title: "Save failed",
        description: error.response?.data?.message || "Could not update the resume.",
        tone: "error"
      });
    } finally {
      setIsSavingResume(false);
    }
  };

  const handleAddProject = async () => {
    if (!newProject.title.trim() || !newProject.url.trim()) {
      pushToast({ title: "Project incomplete", description: "Project title and GitHub URL are required.", tone: "error" });
      return;
    }

    try {
      setIsSavingProject(true);
      const projectPayload = {
        title: newProject.title.trim(),
        description: newProject.description.trim(),
        url: newProject.url.trim(),
        githubUrl: (newProject.githubUrl || newProject.url).trim(),
        liveUrl: newProject.liveUrl.trim(),
        stars: Number(newProject.stars) || 0,
        techStack: newProject.techStackInput
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean),
        highlights: newProject.highlightsInput
          .split("\n")
          .map((item) => item.trim())
          .filter(Boolean)
      };
      const response = await api.post("/projects", projectPayload);
      setProjects((current) => [...current, response.data.project]);
      setNewProject(emptyProject);
      pushToast({ title: "Project added", description: "Manual project saved successfully.", tone: "success" });
    } catch (error) {
      pushToast({
        title: "Project save failed",
        description: error.response?.data?.message || "Could not add the project.",
        tone: "error"
      });
    } finally {
      setIsSavingProject(false);
    }
  };

  const handleDeleteProject = async (id) => {
    try {
      await api.delete(`/projects/${id}`);
      await loadAdminData();
      pushToast({ title: "Project removed", description: "The manual project was deleted.", tone: "success" });
    } catch (error) {
      pushToast({
        title: "Delete failed",
        description: error.response?.data?.message || "Could not remove the project.",
        tone: "error"
      });
    }
  };

  const handleStartEditProject = (project) => {
    setEditingProject({
      id: project.id || project._id,
      title: project.title || "",
      description: project.description || "",
      url: project.url || project.githubUrl || "",
      githubUrl: project.githubUrl || project.url || "",
      liveUrl: project.liveUrl || "",
      techStackInput: (project.techStack || []).join(", "),
      highlightsInput: (project.highlights || []).join("\n"),
      stars: Number(project.stars) || 0,
      hidden: Boolean(project.hidden),
      source: project.source
    });
  };

  const handleUpdateProject = async () => {
    if (!editingProject?.id || !editingProject.title.trim()) {
      pushToast({ title: "Project incomplete", description: "Project title is required.", tone: "error" });
      return;
    }

    try {
      setIsSavingProject(true);
      await api.put(`/projects/${editingProject.id}`, {
        title: editingProject.title.trim(),
        description: editingProject.description.trim(),
        url: editingProject.url.trim(),
        githubUrl: editingProject.githubUrl.trim(),
        liveUrl: editingProject.liveUrl.trim(),
        stars: Number(editingProject.stars) || 0,
        hidden: Boolean(editingProject.hidden),
        techStack: editingProject.techStackInput
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean),
        highlights: editingProject.highlightsInput
          .split("\n")
          .map((item) => item.trim())
          .filter(Boolean)
      });
      setEditingProject(null);
      await loadAdminData();
      pushToast({ title: "Project updated", description: "Project overrides have been saved.", tone: "success" });
    } catch (error) {
      pushToast({
        title: "Project update failed",
        description: error.response?.data?.message || "Could not update the project.",
        tone: "error"
      });
    } finally {
      setIsSavingProject(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/admin", { replace: true });
  };

  const handleRefresh = async () => {
    try {
      setIsLoading(true);
      await loadAdminData();
      pushToast({ title: "Dashboard refreshed", description: "Latest resume and project data loaded.", tone: "success" });
    } catch (error) {
      pushToast({
        title: "Refresh failed",
        description: error.response?.data?.message || "Could not refresh dashboard data.",
        tone: "error"
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading || !resume) {
    return <RouteLoader />;
  }

  const panels = {
    resume: (
      <ResumeEditor
        resume={resume}
        newSkill={newSkill}
        setNewSkill={setNewSkill}
        setResume={setResume}
        onSave={handleSaveResume}
        isSaving={isSavingResume}
      />
    ),
    projects: (
        <ProjectsManager
          projects={projects}
          newProject={newProject}
          setNewProject={setNewProject}
          editingProject={editingProject}
          setEditingProject={setEditingProject}
          onAddProject={handleAddProject}
          onStartEditProject={handleStartEditProject}
          onUpdateProject={handleUpdateProject}
          onDeleteProject={handleDeleteProject}
          isSaving={isSavingProject}
        />
    ),
    appearance: (
      <AppearancePanel
        resume={resume}
        setResume={setResume}
        onSave={handleSaveResume}
        isSaving={isSavingResume}
      />
    ),
    settings: (
      <SettingsPanel
        resume={resume}
        setResume={setResume}
        logout={handleLogout}
        onSave={handleSaveResume}
        isSaving={isSavingResume}
      />
    )
  };

  return (
    <div className="min-h-screen px-4 py-6 sm:px-6">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div>
            <Link to="/" className="inline-flex items-center gap-2 text-sm font-medium text-[var(--muted)] transition hover:text-[var(--text)]">
              <ArrowLeft size={16} />
              Back to portfolio
            </Link>
            <h1 className="mt-3 font-display text-4xl font-bold tracking-tight text-[var(--text)]">Admin Dashboard</h1>
            <p className="mt-2 max-w-2xl text-sm leading-7 text-[var(--muted)]">
              Manage resume content, manual projects, and profile settings from one streamlined workspace.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button type="button" onClick={handleRefresh} className="secondary-button">
              <RefreshCw size={16} />
              Refresh
            </button>
            <ThemeToggle theme={theme} onToggle={toggleTheme} />
          </div>
        </div>

        {validationErrors.length > 0 && (
          <div className="mb-6 rounded-3xl border border-amber-400/25 bg-amber-500/10 px-5 py-4 text-sm text-amber-700">
            {validationErrors[0]}
          </div>
        )}

        <div className="grid gap-6 lg:grid-cols-[280px_minmax(0,1fr)]">
          <AdminSidebar activeTab={activeTab} onTabChange={setActiveTab} />
          <section>{panels[activeTab]}</section>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboardPage;
