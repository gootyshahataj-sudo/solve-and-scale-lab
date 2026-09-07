import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { INDUSTRIES, PROBLEMS } from "@/lib/data";
import { EmptyState, PageShell, Pill } from "@/components/site";

export const Route = createFileRoute("/opportunities")({
  head: () => ({
    meta: [
      { title: "Startup Opportunities — SolveSphere" },
      {
        name: "description",
        content: "Validated startup opportunities derived from real problems, existing solutions and their gaps.",
      },
      { property: "og:title", content: "Startup Opportunities — SolveSphere" },
      { property: "og:description", content: "Market gaps, target users, business models and difficulty at a glance." },
    ],
  }),
  component: Opportunities,
});

function Opportunities() {
  const [industry, setIndustry] = useState("All");
  const [difficulty, setDifficulty] = useState("All");

  const list = PROBLEMS.filter(
    (p) =>
      (industry === "All" || p.industry === industry) &&
      (difficulty === "All" || p.startup.difficulty === difficulty),
  );

  const selectClass =
    "rounded-full border border-input bg-card px-3.5 py-2 text-sm outline-none focus:ring-2 focus:ring-ring";

  return (
    <PageShell
      eyebrow="Opportunities"
      title="Where a new startup could actually win"
      intro="Each opportunity comes from a documented problem and the specific gaps existing solutions leave behind."
    >
      <div className="flex flex-wrap gap-2">
        <select value={industry} onChange={(e) => setIndustry(e.target.value)} className={selectClass}>
          {["All", ...INDUSTRIES].map((i) => (
            <option key={i}>{i}</option>
          ))}
        </select>
        <select value={difficulty} onChange={(e) => setDifficulty(e.target.value)} className={selectClass}>
          {["All", "Low", "Medium", "High"].map((i) => (
            <option key={i}>{i}</option>
          ))}
        </select>
      </div>

      {list.length === 0 ? (
        <div className="mt-6">
          <EmptyState title="No opportunities match" hint="Try a different industry or difficulty." />
        </div>
      ) : (
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {list.map((p) => (
            <article key={p.id} className="card-surface p-6">
              <div className="flex flex-wrap items-center gap-2">
                <Pill tone="brand">{p.industry}</Pill>
                <Pill tone={p.startup.difficulty === "High" ? "danger" : "accent"}>
                  {p.startup.difficulty} difficulty
                </Pill>
                <Pill>{p.startup.stage}</Pill>
              </div>
              <h2 className="mt-3 font-display text-xl font-semibold">{p.startup.proposedSolution}</h2>
              <p className="mt-2 text-sm text-muted-foreground">{p.startup.marketGap}</p>
              <dl className="mt-4 space-y-2 text-sm">
                {[
                  ["Target users", p.startup.targetUsers],
                  ["Unique value", p.startup.uniqueValue],
                  ["Business model", p.startup.businessModel],
                  ["Impact", p.startup.impact],
                ].map(([k, v]) => (
                  <div key={k}>
                    <dt className="text-xs font-semibold uppercase tracking-wider text-primary">{k}</dt>
                    <dd className="text-muted-foreground">{v}</dd>
                  </div>
                ))}
              </dl>
              <Link
                to="/problems/$problemId"
                params={{ problemId: p.id }}
                className="mt-4 inline-block text-sm font-semibold text-primary hover:underline"
              >
                From: {p.title} →
              </Link>
            </article>
          ))}
        </div>
      )}
    </PageShell>
  );
}
