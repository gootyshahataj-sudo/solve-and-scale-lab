import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowUp } from "lucide-react";
import { PROBLEMS } from "@/lib/data";
import { PageShell, Pill } from "@/components/site";
import { useVoting } from "@/components/problem-card";

export const Route = createFileRoute("/community")({
  head: () => ({
    meta: [
      { title: "Community Ideas — SolveSphere" },
      {
        name: "description",
        content: "See what students, developers and researchers are proposing for the world's unsolved problems.",
      },
      { property: "og:title", content: "Community Ideas — SolveSphere" },
      { property: "og:description", content: "Discuss, upvote and build on ideas from the SolveSphere community." },
    ],
  }),
  component: Community,
});

function Community() {
  const { score, hasVoted, toggleVote, state } = useVoting();

  const seeded = PROBLEMS.flatMap((p) => p.ideas.map((i) => ({ ...i, problem: p })));
  const mine = state.ideas.map((i) => ({
    ...i,
    problem: PROBLEMS.find((p) => p.id === i.problemId) ?? PROBLEMS[0],
  }));
  const all = [...mine, ...seeded].sort((a, b) => score(b.id, b.upvotes) - score(a.id, a.upvotes));

  return (
    <PageShell
      eyebrow="Community"
      title="Ideas from people closest to the problem"
      intro="Every idea is tied to a real problem, so discussion stays grounded in what already exists."
    >
      <div className="grid gap-4 md:grid-cols-2">
        {all.map((idea) => (
          <article key={idea.id} className="card-surface p-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <Pill tone="brand">{idea.problem.category}</Pill>
                <h2 className="mt-2 font-display text-lg font-semibold">{idea.title}</h2>
                <p className="text-xs text-muted-foreground">
                  {idea.author} · {idea.role} · {idea.createdAt}
                </p>
              </div>
              <button
                onClick={() => toggleVote(idea.id)}
                className={`inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-xs font-semibold ${
                  hasVoted(idea.id) ? "bg-primary/10 text-primary" : "border border-input"
                }`}
              >
                <ArrowUp className="size-3.5" /> {score(idea.id, idea.upvotes)}
              </button>
            </div>
            <p className="mt-2 text-sm text-muted-foreground">{idea.body}</p>
            <Link
              to="/problems/$problemId"
              params={{ problemId: idea.problem.id }}
              className="mt-3 inline-block text-sm font-semibold text-primary hover:underline"
            >
              {idea.problem.title} →
            </Link>
          </article>
        ))}
      </div>
    </PageShell>
  );
}
