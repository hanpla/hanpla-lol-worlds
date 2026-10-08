const HomePage = () => {
  return (
    <main className="mx-auto max-w-5xl px-4 py-8">
      <div className="rounded-lg border border-border bg-card p-6 shadow-sm">
        <span className="inline-block rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
          2026 WORLDS
        </span>
        <h1 className="mt-3 text-2xl font-bold tracking-tight text-foreground">
          2026 롤드컵 경기 일정
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          대회 일정이 곧 업데이트됩니다.
        </p>
      </div>
    </main>
  );
};

export default HomePage;
