import { createFileRoute } from "@tanstack/react-router";
import { ADMIN_REPORTS, ADMIN_USERS, PLATFORM_STATS } from "@/lib/data";
import { EmptyState, PageShell, Pill } from "@/components/site";
import { useAppState } from "@/lib/store";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Admin — SolveSphere" },
      { name: "description", content: "Review submitted problems and solutions, reports and community members." },
      { property: "og:title", content: "Admin — SolveSphere" },
      { property: "og:description", content: "Moderation view for SolveSphere submissions and reports." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: Admin,
});

function Admin() {
  const { state, update } = useAppState();

  const setProblemStatus = (id: string, status: "Approved" | "Rejected") =>
    update((prev) => ({
      ...prev,
      problems: prev.problems.map((p) => (p.id === id ? { ...p, status } : p)),
    }));

  const setSolutionStatus = (id: string, status: "Approved" | "Rejected") =>
    update((prev) => ({
      ...prev,
      solutions: prev.solutions.map((s) => (s.id === id ? { ...s, status } : s)),
    }));

  return (
    <PageShell eyebrow="Admin" title="Moderation" intro="Approve submissions, handle reports and keep quality high.">
      <div className="grid gap-4 sm:grid-cols-4">
        {[
          { label: "Problems", value: PLATFORM_STATS.problems },
          { label: "Solutions", value: PLATFORM_STATS.solutions },
          { label: "Pending", value: state.problems.length + state.solutions.length },
          { label: "Reports", value: ADMIN_REPORTS.length },
        ].map((s) => (
          <div key={s.label} className="rounded-2xl bg-card/70 p-5 ring-1 ring-border">
            <div className="font-display text-3xl font-semibold">{s.value.toLocaleString()}</div>
            <div className="mt-1 text-xs uppercase tracking-wider text-muted-foreground">{s.label}</div>
          </div>
        ))}
      </div>

      <section className="mt-10">
        <h2 className="font-display text-2xl font-semibold">Submission queue</h2>
        <div className="mt-4 grid gap-3">
          {state.problems.length + state.solutions.length === 0 ? (
            <EmptyState title="Queue is empty" hint="New problem and solution submissions land here." />
          ) : (
            <>
              {state.problems.map((p) => (
                <div key={p.id} className="card-surface flex flex-wrap items-center justify-between gap-3 p-4">
                  <div>
                    <p className="font-semibold">{p.title}</p>
                    <p className="text-xs text-muted-foreground">
                      Problem · {p.category} · {p.createdAt}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Pill tone={p.status === "Approved" ? "success" : p.status === "Rejected" ? "danger" : "neutral"}>
                      {p.status}
                    </Pill>
                    <button
                      onClick={() => setProblemStatus(p.id, "Approved")}
                      className="rounded-full bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => setProblemStatus(p.id, "Rejected")}
                      className="rounded-full border border-input px-3 py-1.5 text-xs font-semibold"
                    >
                      Reject
                    </button>
                  </div>
                </div>
              ))}
              {state.solutions.map((s) => (
                <div key={s.id} className="card-surface flex flex-wrap items-center justify-between gap-3 p-4">
                  <div>
                    <p className="font-semibold">{s.name}</p>
                    <p className="text-xs text-muted-foreground">
                      Solution · {s.kind} · {s.createdAt}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Pill tone={s.status === "Approved" ? "success" : s.status === "Rejected" ? "danger" : "neutral"}>
                      {s.status}
                    </Pill>
                    <button
                      onClick={() => setSolutionStatus(s.id, "Approved")}
                      className="rounded-full bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => setSolutionStatus(s.id, "Rejected")}
                      className="rounded-full border border-input px-3 py-1.5 text-xs font-semibold"
                    >
                      Reject
                    </button>
                  </div>
                </div>
              ))}
            </>
          )}
        </div>
      </section>

      <section className="mt-10 grid gap-8 md:grid-cols-2">
        <div>
          <h2 className="font-display text-2xl font-semibold">Reports</h2>
          <div className="mt-4 grid gap-3">
            {ADMIN_REPORTS.map((r) => (
              <div key={r.id} className="card-surface p-4">
                <p className="font-semibold">{r.target}</p>
                <p className="mt-1 text-sm text-muted-foreground">{r.reason}</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {r.reporter} · {r.date}
                </p>
              </div>
            ))}
          </div>
        </div>
        <div>
          <h2 className="font-display text-2xl font-semibold">Members</h2>
          <div className="card-surface mt-4 overflow-x-auto p-5">
            <table className="w-full min-w-[420px] text-left text-sm">
              <thead>
                <tr className="text-xs uppercase tracking-wider text-muted-foreground">
                  <th className="py-2">Name</th>
                  <th className="py-2">Role</th>
                  <th className="py-2">Contributions</th>
                  <th className="py-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {ADMIN_USERS.map((u) => (
                  <tr key={u.id} className="border-t border-border">
                    <td className="py-2.5 font-semibold">{u.name}</td>
                    <td className="py-2.5 text-muted-foreground">{u.role}</td>
                    <td className="py-2.5 text-muted-foreground">{u.contributions}</td>
                    <td className="py-2.5">
                      <Pill tone={u.status === "Active" ? "success" : "danger"}>{u.status}</Pill>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
