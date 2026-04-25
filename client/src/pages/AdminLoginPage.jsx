import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ArrowRight, LockKeyhole, ShieldCheck } from "lucide-react";
import ThemeToggle from "../components/ThemeToggle";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";

function AdminLoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();
  const { login, isAuthenticated } = useAuth();
  const [credentials, setCredentials] = useState({ email: "admin@example.com", password: "Admin@12345" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/admin/dashboard", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!credentials.email.trim() || !credentials.password.trim()) {
      setErrorMessage("Email and password are required.");
      return;
    }

    try {
      setIsSubmitting(true);
      setErrorMessage("");
      await login(credentials);
      navigate(location.state?.from || "/admin/dashboard", { replace: true });
    } catch (error) {
      const apiMessage = error.response?.data?.message;
      setErrorMessage(
        apiMessage?.toLowerCase().includes("invalid") ? "Invalid password or email." : apiMessage || "Login failed."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden px-4 py-6 sm:px-6">
      <div className="absolute inset-0 bg-hero opacity-90" />
      <div className="absolute inset-0 bg-grid-mask opacity-40" />

      <div className="relative mx-auto flex min-h-[calc(100vh-3rem)] max-w-7xl flex-col gap-6">
        <div className="flex items-center justify-between">
          <Link to="/" className="inline-flex items-center gap-2 text-sm font-medium text-[var(--muted)] transition hover:text-[var(--text)]">
            <ArrowRight className="rotate-180" size={16} />
            Back to portfolio
          </Link>
          <ThemeToggle theme={theme} onToggle={toggleTheme} />
        </div>

        <div className="grid flex-1 items-center gap-8 lg:grid-cols-[1.15fr_0.85fr]">
          <section className="space-y-8">
            <div className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--card)]/70 px-4 py-2 text-sm text-[var(--muted)] backdrop-blur-xl">
              <ShieldCheck size={16} className="text-[var(--primary)]" />
              Protected workspace for resume content management
            </div>
            <div className="max-w-2xl space-y-5">
              <p className="text-sm uppercase tracking-[0.32em] text-[var(--primary)]">Admin Access</p>
              <h1 className="font-display text-4xl font-bold tracking-tight text-[var(--text)] sm:text-6xl">
                Manage the portfolio with a cleaner, production-ready dashboard.
              </h1>
              <p className="max-w-xl text-base leading-8 text-[var(--muted)] sm:text-lg">
                Update resume content, fine-tune GitHub sync, and manage custom projects from a focused interface with
                secure token-based access.
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              {[
                { title: "JWT auth", body: "Token persisted in localStorage and applied to protected requests." },
                { title: "Dashboard UX", body: "Sidebar navigation, validation, feedback, and organized forms." },
                { title: "Theme aware", body: "Light and dark surfaces stay consistent across login and dashboard." }
              ].map((item) => (
                <div key={item.title} className="surface-panel p-5">
                  <p className="font-display text-lg font-semibold text-[var(--text)]">{item.title}</p>
                  <p className="mt-2 text-sm leading-7 text-[var(--muted)]">{item.body}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="surface-panel w-full max-w-xl justify-self-end p-6 sm:p-8">
            <div className="mb-8 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--primary)]/12 text-[var(--primary)]">
                <LockKeyhole size={22} />
              </div>
              <div>
                <p className="font-display text-2xl font-semibold text-[var(--text)]">Admin Login</p>
                <p className="text-sm text-[var(--muted)]">Sign in to access your editing dashboard.</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <label className="block space-y-2">
                <span className="text-sm font-medium text-[var(--text)]">Email</span>
                <input
                  type="email"
                  value={credentials.email}
                  onChange={(event) => setCredentials((current) => ({ ...current, email: event.target.value }))}
                  className="input-field"
                  placeholder="admin@example.com"
                />
              </label>

              <label className="block space-y-2">
                <span className="text-sm font-medium text-[var(--text)]">Password</span>
                <input
                  type="password"
                  value={credentials.password}
                  onChange={(event) => setCredentials((current) => ({ ...current, password: event.target.value }))}
                  className="input-field"
                  placeholder="Enter password"
                />
              </label>

              {errorMessage && (
                <div className="rounded-2xl border border-rose-400/25 bg-rose-500/10 px-4 py-3 text-sm text-rose-700">
                  {errorMessage}
                </div>
              )}

              <button type="submit" disabled={isSubmitting} className="primary-button w-full justify-center">
                {isSubmitting ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                    Signing in...
                  </>
                ) : (
                  <>
                    Continue to dashboard
                    <ArrowRight size={16} />
                  </>
                )}
              </button>
            </form>
          </section>
        </div>
      </div>
    </div>
  );
}

export default AdminLoginPage;
