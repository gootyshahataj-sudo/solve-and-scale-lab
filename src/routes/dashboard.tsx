import { createFileRoute, Link } from "@tanstack/react-router";
import { CURRENT_USER, PROBLEMS } from "@/lib/data";
import { EmptyState, PageShell, Pill } from "@/components/site";
import { useAppState } from "@/lib/store";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Your Dashboard — SolveSphere" },
      { name: "description", content: "Your saved problems, followed topics, submissions and ideas in one place." },
      { property: "og:title", content: "Your Dashboard — SolveSphere" },
      { property: "og:description", content: "Track what you've saved, submitted and proposed on SolveSphere." },
    ],
  }),
  component: Dashboard;
});

function Dashboard() {
  const { state, hydrated } = useAppState();
  const byId = (id: string) => PROBLEMS.find((p) => p.id === id);
  const saved = state.saved.map(byId).filter(Boolean);
  const followed = state.followed.map(byId).filter(Boolean);

  return (
    <PageShell
      eyebrow="Dashboard"
      title={`Welcome back, ${CURRENT_USER.name.split(" ")[0]}`}
      intro={`${CURRENT_USER.role} · interests: ${CURRENT_USER.interests.join(", ")}`}
    >
      <div className="grid gap-4 sm:grid-cols-4">
        {[
          { label: "Saved", value: state.saved.length },
          { label: "Following", value: state.followed.length },
          { label: "Ideas posted", value: state.ideas.length },
          { label: "Submissions", value: state.problems.length + state.solutions.length },
        ].map((s) => (
          <div key={s.label} className="rounded-2xl bg-card/70 p-5 ring-1 ring-border">
            <div className="font-display text-3xl font-semibold">{hydrated ? s.value : 0}</div>
            <div className="mt-1 text-xs uppercase tracking-wider text-muted-foreground">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="mt-10 grid gap-8 md:grid-cols-2">
        <section>
          <h2 className="font-display text-2xl font-semibold">Saved problems</h2>
          <div className="mt-4 grid gap-3">
            {saved.length === 0 ? (
              <EmptyState title="Nothing saved yet" hint="Bookmark a problem to keep it here." />
            ) : (
              saved.map((p) => (
                <Link
                  key={p!.id}
                  to="/problems/$problemId"
                  params={{ problemId: p!.id }}
                  className="card-surface block p-4 hover:shadow-soft"
                >
                  <p className="font-semibold">{p!.title}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{p!.category}</p>
                </Link>
              ))
            )}
          </div>
        </section>

        <section>
          <h2 className="font-display text-2xl font-semibold">Following</h2>
          <div className="mt-4 grid gap-3">
            {followed.length === 0 ? (
              <EmptyState title="Not following anything" hint="Follow a problem to track new ideas on it." />
            ) : (
              followed.map((p) => (
                <Link
                  key={p!.id}
                  to="/problems/$problemId"
                  params={{ problemId: p!.id }}
                  className="card-surface block p-4 hover:shadow-soft"
                >
                  <p className="font-semibold">{p!.title}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{p!.status}</p>
                </Link>
              ))
            )}
          </div>
        </section>

        <section>
          <h2 className="font-display text-2xl font-semibold">Your submissions</h2>
          <div className="mt-4 grid gap-3">
            {state.problems.length + state.solutions.length === 0 ? (
              <EmptyState title="No submissions yet" hint="Submit a problem or a solution to see it tracked here." />
            ) : (
              <>
                {state.problems.map((p) => (
                  <div key={p.id} className="card-surface p-4">
                    <div className="flex items-center justify-between gap-2">
                      <p className="font-semibold">{p.title}</p>
                      <Pill tone="accent">{p.status}</Pill>
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">Problem · {p.createdAt}</p>
                  </div>
                ))}
                {state.solutions.map((s) => (
                  <div key={s.id} className="card-surface p-4">
                    <div className="flex items-center justify-between gap-2">
                      <p className="font-semibold">{s.name}</p>
                      <Pill tone="accent">{s.status}</Pill>
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">Solution · {s.createdAt}</p>
                  </div>
                ))}
              </>
            )}
          </div>
        </section>

        <section>
          <h2 className="font-display text-2xl font-semibold">Your ideas</h2>
          <div className="mt-4 grid gap-3">
            {state.ideas.length === 0 ? (
              <EmptyState title="No ideas yet" hint="Post an idea on any problem page." />
            ) : (
              state.ideas.map((i) => (
                <div key={i.id} className="card-surface p-4">
                  <p className="font-semibold">{i.title}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{i.body}</p>
                </div>
              ))
            )}
          </div>
        </section>
      </div>
    </PageShell>
  );
}
