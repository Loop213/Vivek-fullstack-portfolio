import { Plus, Trash2 } from "lucide-react";

const emptyEducation = { degree: "", school: "", year: "", details: "" };
const emptyExperience = { title: "", company: "", period: "", highlights: [""] };

function ResumeEditor({ resume, newSkill, setNewSkill, setResume, onSave, isSaving }) {
  const updateResumeField = (field, value) => {
    setResume((current) => ({ ...current, [field]: value }));
  };

  const updateNestedList = (field, index, key, value) => {
    setResume((current) => {
      const nextItems = [...current[field]];
      nextItems[index] = { ...nextItems[index], [key]: value };
      return { ...current, [field]: nextItems };
    });
  };

  const updateHighlight = (experienceIndex, highlightIndex, value) => {
    setResume((current) => {
      const nextExperience = [...current.experience];
      const nextHighlights = [...nextExperience[experienceIndex].highlights];
      nextHighlights[highlightIndex] = value;
      nextExperience[experienceIndex] = { ...nextExperience[experienceIndex], highlights: nextHighlights };
      return { ...current, experience: nextExperience };
    });
  };

  const addSkill = () => {
    if (!newSkill.trim()) {
      return;
    }

    setResume((current) => ({ ...current, skills: [...current.skills, newSkill.trim()] }));
    setNewSkill("");
  };

  const removeEducation = (index) => {
    setResume((current) => ({
      ...current,
      education: current.education.filter((_, itemIndex) => itemIndex !== index)
    }));
  };

  const removeExperience = (index) => {
    setResume((current) => ({
      ...current,
      experience: current.experience.filter((_, itemIndex) => itemIndex !== index)
    }));
  };

  return (
    <div className="space-y-6">
      <div className="surface-panel p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-[var(--primary)]">Resume Content</p>
            <h2 className="mt-1 font-display text-3xl font-semibold text-[var(--text)]">Edit core profile details</h2>
          </div>
          <button type="button" onClick={onSave} disabled={isSaving} className="primary-button">
            {isSaving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>

      <div className="surface-panel p-6">
        <div className="grid gap-4 md:grid-cols-2">
          <label className="space-y-2">
            <span className="form-label">Full name</span>
            <input
              value={resume.name}
              onChange={(event) => updateResumeField("name", event.target.value)}
              className="input-field"
              placeholder="Name"
            />
          </label>
          <label className="space-y-2">
            <span className="form-label">Role</span>
            <input
              value={resume.role}
              onChange={(event) => updateResumeField("role", event.target.value)}
              className="input-field"
              placeholder="Role"
            />
          </label>
        </div>

        <label className="mt-4 block space-y-2">
          <span className="form-label">Bio</span>
          <textarea
            rows="5"
            value={resume.bio}
            onChange={(event) => updateResumeField("bio", event.target.value)}
            className="input-field min-h-36 resize-y"
            placeholder="Short bio"
          />
        </label>
      </div>

      <div className="surface-panel p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="font-display text-2xl font-semibold text-[var(--text)]">Skills</p>
            <p className="mt-1 text-sm text-[var(--muted)]">Keep the list concise and relevant.</p>
          </div>
          <label className="inline-flex items-center gap-3 rounded-full border border-[var(--border)] px-4 py-2 text-sm text-[var(--muted)]">
            <input
              type="checkbox"
              checked={resume.githubAutoFetch}
              onChange={(event) => updateResumeField("githubAutoFetch", event.target.checked)}
              className="accent-[var(--primary)]"
            />
            GitHub auto-fetch
          </label>
        </div>
        <div className="mt-4 flex flex-wrap gap-3">
          {resume.skills.map((skill, index) => (
            <button
              key={`${skill}-${index}`}
              type="button"
              onClick={() => updateResumeField("skills", resume.skills.filter((_, itemIndex) => itemIndex !== index))}
              className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--card-soft)] px-4 py-2 text-sm font-medium text-[var(--text)] transition hover:border-rose-300 hover:text-rose-500"
            >
              {skill}
              <Trash2 size={14} />
            </button>
          ))}
        </div>
        <div className="mt-5 flex flex-col gap-3 sm:flex-row">
          <input value={newSkill} onChange={(event) => setNewSkill(event.target.value)} className="input-field flex-1" placeholder="Add skill" />
          <button type="button" onClick={addSkill} className="secondary-button">
            Add skill
          </button>
        </div>
      </div>

      <div className="surface-panel p-6">
        <div className="mb-5 flex items-center justify-between">
          <div>
            <p className="font-display text-2xl font-semibold text-[var(--text)]">Education</p>
            <p className="text-sm text-[var(--muted)]">Highlight your formal background and certifications.</p>
          </div>
          <button type="button" onClick={() => updateResumeField("education", [...resume.education, emptyEducation])} className="secondary-button">
            <Plus size={16} />
            Add entry
          </button>
        </div>
        <div className="space-y-4">
          {resume.education.map((item, index) => (
            <div key={`education-${index}`} className="rounded-3xl border border-[var(--border)] bg-[var(--card-soft)] p-5">
              <div className="mb-4 flex justify-end">
                <button type="button" onClick={() => removeEducation(index)} className="icon-button">
                  <Trash2 size={16} />
                </button>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <input value={item.degree} onChange={(event) => updateNestedList("education", index, "degree", event.target.value)} className="input-field" placeholder="Degree" />
                <input value={item.school} onChange={(event) => updateNestedList("education", index, "school", event.target.value)} className="input-field" placeholder="School" />
                <input value={item.year} onChange={(event) => updateNestedList("education", index, "year", event.target.value)} className="input-field" placeholder="Year" />
                <input value={item.details} onChange={(event) => updateNestedList("education", index, "details", event.target.value)} className="input-field" placeholder="Details" />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="surface-panel p-6">
        <div className="mb-5 flex items-center justify-between">
          <div>
            <p className="font-display text-2xl font-semibold text-[var(--text)]">Experience</p>
            <p className="text-sm text-[var(--muted)]">Use short, results-oriented highlights.</p>
          </div>
          <button type="button" onClick={() => updateResumeField("experience", [...resume.experience, emptyExperience])} className="secondary-button">
            <Plus size={16} />
            Add entry
          </button>
        </div>
        <div className="space-y-4">
          {resume.experience.map((item, index) => (
            <div key={`experience-${index}`} className="rounded-3xl border border-[var(--border)] bg-[var(--card-soft)] p-5">
              <div className="mb-4 flex justify-end">
                <button type="button" onClick={() => removeExperience(index)} className="icon-button">
                  <Trash2 size={16} />
                </button>
              </div>
              <div className="grid gap-4 md:grid-cols-3">
                <input value={item.title} onChange={(event) => updateNestedList("experience", index, "title", event.target.value)} className="input-field" placeholder="Title" />
                <input value={item.company} onChange={(event) => updateNestedList("experience", index, "company", event.target.value)} className="input-field" placeholder="Company" />
                <input value={item.period} onChange={(event) => updateNestedList("experience", index, "period", event.target.value)} className="input-field" placeholder="Period" />
              </div>
              <div className="mt-4 space-y-3">
                {item.highlights.map((highlight, highlightIndex) => (
                  <input
                    key={`highlight-${highlightIndex}`}
                    value={highlight}
                    onChange={(event) => updateHighlight(index, highlightIndex, event.target.value)}
                    className="input-field"
                    placeholder="Highlight"
                  />
                ))}
              </div>
              <button
                type="button"
                onClick={() => updateNestedList("experience", index, "highlights", [...item.highlights, ""])}
                className="secondary-button mt-4"
              >
                <Plus size={16} />
                Add highlight
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ResumeEditor;
