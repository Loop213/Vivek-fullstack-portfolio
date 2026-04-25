function RouteLoader() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--bg)] px-6">
      <div className="surface-panel flex w-full max-w-md flex-col items-center gap-4 p-8 text-center">
        <div className="h-12 w-12 animate-spin rounded-full border-2 border-[var(--border)] border-t-[var(--primary)]" />
        <div>
          <p className="font-display text-2xl font-semibold text-[var(--text)]">Loading experience</p>
          <p className="mt-2 text-sm text-[var(--muted)]">Preparing the portfolio interface and admin workspace.</p>
        </div>
      </div>
    </div>
  );
}

export default RouteLoader;
