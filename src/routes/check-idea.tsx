import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { PROBLEMS } from "@/lib/data";
import { PageShell, Pill, SearchField } from "@/components/site";

export const Route = createFileRoute("/check-idea")({
  head: () => ({
    meta: [
      { title: "Check My Idea — SolveSphere" },
      {
        name: "description",
        content: "Describe your idea and see similar existing solutions, their limitations, and the gaps left open.",
      },
      { property: "og:title", content: "Check My Idea — SolveSphere" },
      { property: "og:description", content: "An initial similarity analysis so you build better, not blindly." },
    ],
  }),
  component: CheckIdea,
});

function scoreFor(text: string, haystack: string) {
  const words = text.toLowerCase().split(/\W+/).filter((w) => w.length > 3);
  if (words.length === 0) return 0;
  const hits = words.filter((w) => haystack.toLowerCase().includes(w)).length;
  return hits / words.length;
}

function CheckIdea() {
  const [idea, setIdea] = useState("");
  const [submitted, setSubmitted] = useState("");

  const matches = submitted
    ? PROBLEMS.map((p) => {
        const hay = `${p.title} ${p.description} ${p.category} ${p.industry} ${p.existingSolutions
          .map((s) => `${s.name} ${s.description}`)
          .join(" ")}`;
        return { problem: p, score: scoreFor(submitted, hay) };
      })
        .filter((m) => m.score > 0)
        .sort((a, b) => b.score - a.score)
        .slice(0, 3)
    : [];

  const level = (s: number) => (s > 0.4 ? "HIGH" : s > 0.2 ? "MEDIUM" : "LOW");

  return (
    <PageShell
      eyebrow="Check My Idea"
      title="Does your idea already exist?"
      intro="Describe what you want to build. We compare it against known problems and solutions and show you what's already out there."
    >
      <div className="max-w-3xl">
        <SearchField
          value={idea}
          onChange={setIdea}
          cta="Analyse"
          placeholder="I want to build an app that..."
          onSubmit={() => setSubmitted(idea)}
        />
        <p className="mt-3 text-xs text-muted-foreground">
          This is an initial similarity analysis, not a guarantee of novelty.
        </p>
      </div>

      {submitted && (
        <div className="mt-8">
          {matches.length === 0 ? (
            <div className="card-surface p-6">
              <p className="font-display text-xl font-semibold">No close match found</p>
              <p className="mt-2 text-sm text-muted-foreground">
                Nothing in our database looks similar. That's promising — validate it with real users next.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                {matches.length} similar areas found · {matches.reduce((n, m) => n + m.problem.limitations.length, 0)}{" "}
                unsolved gaps
              </p>
              {matches.map(({ problem, score }) => (
                <article key={problem.id} className="card-surface p-6">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h2 className="font-display text-xl font-semibold">{problem.title}</h2>
                    <Pill tone={score > 0.4 ? "danger" : score > 0.2 ? "accent" : "neutral"}>
                      {level(score)} similarity
                    </Pill>
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground">{problem.description}</p>
                  <div className="mt-4 grid gap-4 sm:grid-cols-2">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wider text-primary">Existing solutions</p>
                      <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
                        {problem.existingSolutions.map((s) => (
                          <li key={s.id}>• {s.name}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wider text-primary">Gaps left open</p>
                      <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
                        {problem.limitations.slice(0, 3).map((l) => (
                          <li key={l}>• {l}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  <Link
                    to="/problems/$problemId"
                    params={{ problemId: problem.id }}
                    className="mt-4 inline-block text-sm font-semibold text-primary hover:underline"
                  >
                    See the full breakdown →
                  </Link>
                </article>
              ))}
            </div>
          )}
        </div>
      )}
    </PageShell>
  );
}
