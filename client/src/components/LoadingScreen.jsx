function LoadingScreen() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[var(--bg)]/92 backdrop-blur-lg">
      <div className="surface-panel flex flex-col items-center gap-4 px-8 py-10">
        <div className="h-16 w-16 animate-spin rounded-full border-4 border-[var(--border)] border-t-[var(--primary)]" />
        <div className="text-center">
          <p className="font-display text-xl font-semibold text-[var(--text)]">Loading Portfolio Universe</p>
          <p className="text-sm text-[var(--muted)]">Preparing 3D sections and live project data...</p>
        </div>
      </div>
    </div>
  );
}

export default LoadingScreen;
