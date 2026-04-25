import { FileText, FolderKanban, Palette, Settings2 } from "lucide-react";

const tabs = [
  { key: "resume", label: "Edit Resume", icon: FileText },
  { key: "projects", label: "Manage Projects", icon: FolderKanban },
  { key: "appearance", label: "Appearance", icon: Palette },
  { key: "settings", label: "Settings", icon: Settings2 }
];

function AdminSidebar({ activeTab, onTabChange }) {
  return (
    <aside className="surface-panel h-fit p-4 lg:sticky lg:top-6">
      <p className="px-3 pb-3 text-xs uppercase tracking-[0.3em] text-[var(--primary)]">Workspace</p>
      <nav className="space-y-2">
        {tabs.map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            type="button"
            onClick={() => onTabChange(key)}
            className={`flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm font-medium transition ${
              activeTab === key
                ? "bg-[var(--primary)] text-white shadow-lg shadow-blue-500/20"
                : "text-[var(--muted)] hover:bg-[var(--card-soft)] hover:text-[var(--text)]"
            }`}
          >
            <Icon size={18} />
            {label}
          </button>
        ))}
      </nav>
    </aside>
  );
}

export default AdminSidebar;
