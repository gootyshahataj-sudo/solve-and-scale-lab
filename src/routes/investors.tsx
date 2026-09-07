import { createFileRoute, Link } from "@tanstack/react-router";
import { formatAffected, PROBLEMS } from "@/lib/data";
import { PageShell, Pill } from "@/components/site";

export const Route = createFileRoute("/investors")({
  head: () => ({
    meta: [
      { title: "For Investors & Builders — SolveSphere" },
      {
        name: "description",
        content: "Track high-impact problems, market gaps and the teams building against them.",
      },
      { property: "og:title", content: "For Investors & Builders — SolveSphere" },
      { property: "og:description", content: "Impact, difficulty and market gap for every tracked problem." },
    ],
  }),
  component: Investors,
});

function Investors() {
  const ranked = [...PROBLEMS].sort((a, b) => b.peopleAffected - a.peopleAffected);

  return (
    <PageShell
      eyebrow="Investors & Builders"
      title="High-impact problems, ranked by who they hurt"
      intro="Scan the market gap, difficulty and stage before you take a meeting or start a build."
    >
      <div className="card-surface overflow-x-auto p-5">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead>
            <tr className="text-xs uppercase tracking-wider text-muted-foreground">
              <th className="py-2">Problem</th>
              <th className="py-2">Industry</th>
              <th className="py-2">Affected</th>
              <th className="py-2">Difficulty</th>
              <th className="py-2">Stage</th>
            </tr>
          </thead>
          <tbody>
            {ranked.map((p) => (
              <tr key={p.id} className="border-t border-border align-top">
                <td className="py-3 pr-4">
                  <Link
                    to="/problems/$problemId"
                    params={{ problemId: p.id }}
                    className="font-semibold hover:text-primary"
                  >
                    {p.title}
                  </Link>
                  <p className="mt-1 max-w-md text-xs text-muted-foreground">{p.startup.marketGap}</p>
                </td>
                <td className="py-3 pr-4 text-muted-foreground">{p.industry}</td>
                <td className="py-3 pr-4 text-muted-foreground">{formatAffected(p.peopleAffected)}</td>
                <td className="py-3 pr-4">
                  <Pill tone={p.startup.difficulty === "High" ? "danger" : "accent"}>{p.startup.difficulty}</Pill>
                </td>
                <td className="py-3 text-muted-foreground">{p.startup.stage}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </PageShell>
  );
}
