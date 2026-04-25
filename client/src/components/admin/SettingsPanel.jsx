import { Save } from "lucide-react";

function SettingsPanel({ resume, setResume, logout, onSave, isSaving }) {
  const fields = ["email", "phone", "location", "github", "linkedin", "leetcode"];

  return (
    <div className="space-y-6">
      <div className="surface-panel p-6">
        <p className="text-sm font-medium text-[var(--primary)]">Settings</p>
        <h2 className="mt-1 font-display text-3xl font-semibold text-[var(--text)]">Contact links and session controls</h2>
      </div>

      <div className="surface-panel p-6">
        <p className="font-display text-2xl font-semibold text-[var(--text)]">Contact Details</p>
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          {fields.map((field) => (
            <label key={field} className="space-y-2">
              <span className="form-label capitalize">{field}</span>
              <input
                value={resume.contact?.[field] || ""}
                onChange={(event) =>
                  setResume((current) => ({
                    ...current,
                    contact: { ...current.contact, [field]: event.target.value }
                  }))
                }
                className="input-field"
                placeholder={field}
              />
            </label>
          ))}
        </div>
        {onSave && (
          <button type="button" onClick={onSave} disabled={isSaving} className="primary-button mt-6">
            <Save size={16} />
            {isSaving ? "Saving..." : "Save settings"}
          </button>
        )}
      </div>

      <div className="surface-panel p-6">
        <p className="font-display text-2xl font-semibold text-[var(--text)]">Session</p>
        <p className="mt-2 text-sm leading-7 text-[var(--muted)]">
          Your JWT is stored locally in the browser for this admin session. Logging out removes it immediately.
        </p>
        <button type="button" onClick={logout} className="secondary-button mt-5">
          Logout
        </button>
      </div>
    </div>
  );
}

export default SettingsPanel;
