import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowUp, Bell, Bookmark } from "lucide-react";
import { COMPARISON_METRICS, formatAffected, getProblem } from "@/lib/data";
import { Field, Pill, inputClass } from "@/components/site";
import { useVoting } from "@/components/problem-card";
import { today, uid } from "@/lib/store";

export const Route = createFileRoute("/problems/$problemId")({
  loader: ({ params }) => {
    const problem = getProblem(params.problemId);
    if (!problem) throw notFound();
    return { problem };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return { meta: [{ title: "Problem not found — SolveSphere" }, { name: "robots", content: "noindex" }] };
    }
    const { problem } = loaderData;
    return {
      meta: [
        { title: `${problem.title} — SolveSphere` },
        { name: "description", content: problem.description },
        { property: "og:title", content: problem.title },
        { property: "og:description", content: problem.description },
      ],
    };
  },
  component: ProblemDetail,
});

function Section({ id, title, children }: { id: string; title: string; children: React.ReactNode }) {
  return (
    <section id={id} className="scroll-mt-24 border-t border-border pt-8">
      <h2 className="font-display text-2xl font-semibold">{title}</h2>
      <div className="mt-4">{children}</div>
    </section>
  );
}

function ProblemDetail() {
  const { problem } = Route.useLoaderData();
  const { score, hasVoted, toggleVote, isSaved, toggleSave, isFollowed, toggleFollow, state, update } = useVoting();
  const [ideaTitle, setIdeaTitle] = useState("");
  const [ideaBody, setIdeaBody] = useState("");

  const extraIdeas = state.ideas.filter((i) => i.problemId === problem.id);
  const ideas = [...problem.ideas, ...extraIdeas];

  const submitIdea = () => {
    if (!ideaTitle.trim() || !ideaBody.trim()) return;
    update((prev) => ({
      ...prev,
      ideas: [
        ...prev.ideas,
        {
          id: uid(),
          problemId: problem.id,
          author: "You",
          role: "Builder",
          title: ideaTitle,
          body: ideaBody,
          upvotes: 0,
          createdAt: today(),
          comments: [],
        },
      ],
    }));
    setIdeaTitle("");
    setIdeaBody("");
  };

  return (
    <main className="relative">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[360px] sun-wash" />
      <div className="relative mx-auto max-w-4xl px-6 py-12">
        <Link to="/problems" search={{ q: "" }} className="text-sm font-medium text-primary hover:underline">
          ← Back to problems
        </Link>

        <div className="rise mt-4">
          <div className="flex flex-wrap gap-2">
            <Pill tone="brand">{problem.category}</Pill>
            <Pill tone={problem.severity === "Critical" ? "danger" : "accent"}>{problem.severity} severity</Pill>
            <Pill>{problem.status}</Pill>
            <Pill>{problem.industry}</Pill>
          </div>
          <h1 className="mt-4 font-display text-4xl font-semibold leading-tight">{problem.title}</h1>
          <p className="mt-3 text-lg text-muted-foreground">{problem.description}</p>

          <div className="mt-5 flex flex-wrap items-center gap-2">
            <button
              onClick={() => toggleVote(problem.id)}
              className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold ${
                hasVoted(problem.id) ? "bg-primary text-primary-foreground" : "border border-input bg-card"
              }`}
            >
              <ArrowUp className="size-4" /> {score(problem.id, problem.upvotes)} upvotes
            </button>
            <button
              onClick={() => toggleSave(problem.id)}
              className="inline-flex items-center gap-2 rounded-full border border-input bg-card px-4 py-2 text-sm font-semibold"
            >
              <Bookmark className="size-4" /> {isSaved(problem.id) ? "Saved" : "Save"}
            </button>
            <button
              onClick={() => toggleFollow(problem.id)}
              className="inline-flex items-center gap-2 rounded-full border border-input bg-card px-4 py-2 text-sm font-semibold"
            >
              <Bell className="size-4" /> {isFollowed(problem.id) ? "Following" : "Follow"}
            </button>
          </div>
        </div>

        <div className="mt-8 grid gap-3 sm:grid-cols-4">
          {[
            { label: "People affected", value: formatAffected(problem.peopleAffected) },
            { label: "Where", value: problem.location },
            { label: "Frequency", value: problem.frequency },
            { label: "Solutions found", value: String(problem.existingSolutions.length) },
          ].map((s) => (
            <div key={s.label} className="rounded-2xl bg-card/70 p-4 ring-1 ring-border">
              <div className="text-xs uppercase tracking-wider text-muted-foreground">{s.label}</div>
              <div className="mt-1 font-display text-lg font-semibold">{s.value}</div>
            </div>
          ))}
        </div>

        <div className="mt-10 space-y-10">
          <Section id="overview" title="Problem overview">
            <p className="text-muted-foreground">{problem.overview}</p>
            <dl className="mt-4 grid gap-3 sm:grid-cols-2">
              {[
                ["Who faces it", problem.whoFaces],
                ["Where it occurs", problem.whereOccurs],
              ].map(([k, v]) => (
                <div key={k} className="card-surface p-4">
                  <dt className="text-xs font-semibold uppercase tracking-wider text-primary">{k}</dt>
                  <dd className="mt-1 text-sm text-muted-foreground">{v}</dd>
                </div>
              ))}
            </dl>
            <div className="mt-4 flex flex-wrap gap-3 text-sm">
              {problem.sources.map((s) => (
                <a key={s.url} href={s.url} className="text-primary hover:underline" rel="noreferrer" target="_blank">
                  {s.label} ↗
                </a>
              ))}
            </div>
          </Section>

          <Section id="exists" title="Does a solution already exist?">
            <div className="card-surface p-5">
              <p className="font-semibold">
                Yes — {problem.existingSolutions.length} existing solutions and {problem.alternatives.length}{" "}
                alternatives were found. Status: {problem.status.toLowerCase()}.
              </p>
              <p className="mt-2 text-sm text-muted-foreground">
                This is an initial similarity review, not a guarantee of novelty. Read the limitations and gaps before
                you start building.
              </p>
            </div>
          </Section>

          <Section id="solutions" title="Existing solutions">
            <div className="grid gap-4">
              {problem.existingSolutions.map((s) => (
                <article key={s.id} className="card-surface p-5">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h3 className="font-display text-xl font-semibold">{s.name}</h3>
                    <span className="text-xs text-muted-foreground">{s.source}</span>
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground">{s.description}</p>
                  <p className="mt-3 text-sm">
                    <span className="font-semibold">How it works: </span>
                    <span className="text-muted-foreground">{s.howItWorks}</span>
                  </p>
                  <div className="mt-4 grid gap-4 sm:grid-cols-3">
                    {[
                      ["Features", s.features],
                      ["Advantages", s.advantages],
                      ["Limitations", s.limitations],
                    ].map(([label, items]) => (
                      <div key={label as string}>
                        <p className="text-xs font-semibold uppercase tracking-wider text-primary">{label as string}</p>
                        <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
                          {(items as string[]).map((f) => (
                            <li key={f}>• {f}</li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </article>
              ))}
            </div>

            <div className="card-surface mt-6 overflow-x-auto p-5">
              <h3 className="font-display text-lg font-semibold">Comparison</h3>
              <table className="mt-3 w-full min-w-[540px] text-left text-sm">
                <thead>
                  <tr className="text-xs uppercase tracking-wider text-muted-foreground">
                    <th className="py-2">Solution</th>
                    {COMPARISON_METRICS.map((m) => (
                      <th key={m.key} className="py-2">
                        {m.label}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {problem.existingSolutions.map((s) => (
                    <tr key={s.id} className="border-t border-border">
                      <td className="py-2.5 font-semibold">{s.name}</td>
                      {COMPARISON_METRICS.map((m) => (
                        <td key={m.key} className="py-2.5 text-muted-foreground">
                          {String(s[m.key])}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Section>

          <Section id="alternatives" title="Alternatives people use today">
            <div className="grid gap-3 sm:grid-cols-2">
              {problem.alternatives.map((a) => (
                <div key={a.name} className="card-surface p-4">
                  <p className="font-semibold">{a.name}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{a.detail}</p>
                </div>
              ))}
            </div>
          </Section>

          <Section id="limitations" title="Limitations & gaps">
            <ul className="grid gap-2">
              {problem.limitations.map((l) => (
                <li key={l} className="card-surface p-4 text-sm text-muted-foreground">
                  {l}
                </li>
              ))}
            </ul>
          </Section>

          <Section id="improvements" title="Suggested improvements">
            <div className="grid gap-3 sm:grid-cols-2">
              {problem.improvements.map((i) => (
                <div key={i.title} className="card-surface p-4">
                  <p className="font-semibold">{i.title}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{i.detail}</p>
                </div>
              ))}
            </div>
          </Section>

          <Section id="ideas" title={`Community ideas (${ideas.length})`}>
            <div className="grid gap-3">
              {ideas.map((idea) => (
                <article key={idea.id} className="card-surface p-5">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="font-semibold">{idea.title}</p>
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
                  {idea.comments.length > 0 && (
                    <div className="mt-3 space-y-2 border-t border-border pt-3">
                      {idea.comments.map((c) => (
                        <p key={c.id} className="text-sm text-muted-foreground">
                          <span className="font-semibold text-foreground">{c.author}: </span>
                          {c.body}
                        </p>
                      ))}
                    </div>
                  )}
                </article>
              ))}
            </div>

            <div className="card-surface mt-5 space-y-3 p-5">
              <Field label="Share your idea">
                <input
                  value={ideaTitle}
                  onChange={(e) => setIdeaTitle(e.target.value)}
                  placeholder="Idea title"
                  className={inputClass}
                />
              </Field>
              <textarea
                value={ideaBody}
                onChange={(e) => setIdeaBody(e.target.value)}
                rows={3}
                placeholder="How would you solve this differently?"
                className={inputClass}
              />
              <button
                onClick={submitIdea}
                className="rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground"
              >
                Post idea
              </button>
            </div>
          </Section>

          <Section id="startup" title="Startup opportunity">
            <div className="grid gap-3 sm:grid-cols-2">
              {[
                ["Target users", problem.startup.targetUsers],
                ["Competitors", problem.startup.competitors],
                ["Market gap", problem.startup.marketGap],
                ["Proposed solution", problem.startup.proposedSolution],
                ["Unique value", problem.startup.uniqueValue],
                ["Business model", problem.startup.businessModel],
                ["Difficulty", problem.startup.difficulty],
                ["Impact", problem.startup.impact],
              ].map(([k, v]) => (
                <div key={k} className="card-surface p-4">
                  <p className="text-xs font-semibold uppercase tracking-wider text-primary">{k}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{v}</p>
                </div>
              ))}
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {problem.startup.technology.map((t) => (
                <Pill key={t} tone="accent">
                  {t}
                </Pill>
              ))}
            </div>
            <Link
              to="/submit-solution"
              className="mt-5 inline-block rounded-full bg-foreground px-5 py-2.5 text-sm font-semibold text-background"
            >
              Propose a new solution
            </Link>
          </Section>
        </div>
      </div>
    </main>
  );
}
