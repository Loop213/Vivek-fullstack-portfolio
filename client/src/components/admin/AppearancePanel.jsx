import { Box, ImagePlus, Layers3, Save } from "lucide-react";
import { useEffect, useState } from "react";
import AvatarFrame from "../AvatarFrame";
import { useToast } from "../../context/ToastContext";

const maxAvatarSize = 2 * 1024 * 1024;
const allowedAvatarTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

function AppearancePanel({ resume, setResume, onSave, isSaving }) {
  const { pushToast } = useToast();
  const [previewUrl, setPreviewUrl] = useState(resume.avatarUrl || "");

  useEffect(() => {
    setPreviewUrl(resume.avatarUrl || "");
  }, [resume.avatarUrl]);

  const updateAvatar = (value) => {
    setPreviewUrl(value);
    setResume((current) => ({ ...current, avatarUrl: value }));
  };

  const handleAvatarUpload = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!allowedAvatarTypes.includes(file.type)) {
      pushToast({ title: "Invalid image", description: "Please upload JPG, PNG, or WEBP image.", tone: "error" });
      event.target.value = "";
      return;
    }

    if (file.size > maxAvatarSize) {
      pushToast({ title: "Image too large", description: "Avatar image must be smaller than 2MB.", tone: "error" });
      event.target.value = "";
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      updateAvatar(reader.result);
      pushToast({ title: "Avatar ready", description: "Preview updated. Save appearance to persist it.", tone: "success" });
    };
    reader.onerror = () => {
      pushToast({ title: "Upload failed", description: "Could not read the selected image.", tone: "error" });
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-6">
      <div className="surface-panel p-6">
        <p className="text-sm font-medium text-[var(--primary)]">Appearance</p>
        <h2 className="mt-1 font-display text-3xl font-semibold text-[var(--text)]">Avatar and interactive mode</h2>
        <p className="mt-2 max-w-2xl text-sm leading-7 text-[var(--muted)]">
          Control the first impression of the portfolio, including the profile avatar and whether the Three.js experience is visible.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
        <div className="surface-panel flex flex-col items-center p-6 text-center">
          <AvatarFrame name={resume.name} avatarUrl={previewUrl} />
          <p className="mt-5 font-display text-xl font-semibold text-[var(--text)]">{resume.name}</p>
          <p className="mt-1 text-sm text-[var(--muted)]">{resume.role}</p>
        </div>

        <div className="surface-panel p-6">
          <label className="block space-y-2">
            <span className="form-label inline-flex items-center gap-2">
              <ImagePlus size={16} />
              Avatar URL
            </span>
            <input
              value={resume.avatarUrl || ""}
              onChange={(event) => updateAvatar(event.target.value)}
              className="input-field"
              placeholder="https://example.com/avatar.jpg or uploaded image data"
            />
          </label>

          <label className="mt-4 block space-y-2">
            <span className="form-label">Upload avatar image</span>
            <input
              type="file"
              accept="image/png,image/jpeg,image/jpg,image/webp"
              onChange={handleAvatarUpload}
              className="block w-full rounded-lg border border-[var(--border)] bg-[var(--card-soft)] p-3 text-sm text-[var(--muted)] file:mr-4 file:rounded-md file:border-0 file:bg-[var(--primary)] file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white"
            />
            <p className="text-xs text-[var(--muted)]">JPG, PNG, or WEBP. Max size 2MB.</p>
          </label>

          <div className="mt-6 rounded-lg border border-[var(--border)] bg-[var(--card-soft)] p-5">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="inline-flex items-center gap-2 font-display text-xl font-semibold text-[var(--text)]">
                  <Box size={18} className="text-[var(--primary)]" />
                  {resume.threeDEnabled ?? true ? "3D Portfolio Mode ON" : "2D Portfolio Mode OFF"}
                </p>
                <p className="mt-2 text-sm leading-7 text-[var(--muted)]">
                  ON shows a full interactive Three.js portfolio. OFF shows the polished 2D portfolio layout.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setResume((current) => ({ ...current, threeDEnabled: !(current.threeDEnabled ?? true) }))}
                className={`relative h-8 w-14 rounded-full transition ${
                  resume.threeDEnabled ?? true ? "bg-[var(--primary)]" : "bg-slate-400/40"
                }`}
                aria-label="Toggle Three.js scene"
              >
                <span
                  className={`absolute top-1 h-6 w-6 rounded-full bg-white transition ${
                    resume.threeDEnabled ?? true ? "left-7" : "left-1"
                  }`}
                />
              </button>
            </div>
          </div>

          <div className="mt-4 rounded-lg border border-[var(--border)] bg-[var(--card-soft)] p-5">
            <label className="block space-y-2">
              <span className="form-label inline-flex items-center gap-2">
                <Layers3 size={16} />
                Three.js Design
              </span>
              <select
                value={resume.threeDDesign || "design1"}
                onChange={(event) => setResume((current) => ({ ...current, threeDDesign: event.target.value }))}
                className="input-field"
              >
                <option value="design1">Design 1 - Structured glass stage</option>
                <option value="design2">Design 2 - Cinematic orbital layout</option>
              </select>
            </label>
            <p className="mt-3 text-sm leading-7 text-[var(--muted)]">
              Design 1 keeps the current balanced panel stage. Design 2 uses a more cinematic curved layout with a different depth system.
            </p>
          </div>

          <button type="button" onClick={onSave} disabled={isSaving} className="primary-button mt-6">
            <Save size={16} />
            {isSaving ? "Saving..." : "Save appearance"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default AppearancePanel;
