import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { PLATFORM_STATS, PROBLEMS } from "@/lib/data";
import { ProblemCard } from "@/components/problem-card";
import { SearchField } from "@/components/site";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "SolveSphere — Start With a Problem. Build the Right Solution." },
      {
        name: "description",
        content:
          "Discover real-world problems, see what solutions already exist, find the gaps, and turn them into startup opportunities.",
      },
      { property: "og:title", content: "SolveSphere — Start With a Problem. Build the Right Solution." },
      {
        property: "og:description",
        content: "Explore problems, existing solutions, limitations, gaps and startup opportunities in one place.",
      },
    ],
  }),
  component: Home,
});

const STEPS = [
  "Problem",
  "Does it exist?",
  "Existing solutions",
  "Alternatives",
  "Limitations",
  "Gaps",
  "Improvements",
  "New solution",
  "Startup opportunity",
];

function Home() {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();
  const trending = PROBLEMS.filter((p) => p.trending).slice(0, 3);

  return (
    <main className="relative">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[520px] sun-wash" />

      <section className="rise relative mx-auto max-w-6xl px-6 pb-12 pt-16">
        <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-medium text-primary">
          <span className="size-1.5 rounded-full bg-primary" /> Problem-to-innovation platform
        </div>
        <h1 className="mt-6 max-w-3xl font-display text-5xl font-semibold leading-[1.02] md:text-6xl">
          Start With a <span className="text-primary">Problem.</span> Build the Right Solution.
        </h1>
        <p className="mt-5 max-w-xl text-lg text-muted-foreground">
          Check whether your idea already exists, explore what works, find the gaps — and turn real problems into
          startups.
        </p>

        <div className="mt-8 max-w-2xl">
          <SearchField
            value={query}
            onChange={setQuery}
            cta="Search"
            onSubmit={() => navigate({ to: "/problems", search: { q: query } })}
          />
          <div className="mt-4 flex flex-wrap gap-2">
            <Link
              to="/problems"
              search={{ q: "" }}
              className="rounded-full border border-input bg-card/60 px-4 py-2 text-sm font-medium transition-colors hover:border-foreground/30"
            >
              Explore Problems
            </Link>
            <Link
              to="/submit-problem"
              className="rounded-full border border-input bg-card/60 px-4 py-2 text-sm font-medium transition-colors hover:border-foreground/30"
            >
              Submit Problem
            </Link>
            <Link
              to="/check-idea"
              className="rounded-full bg-foreground px-4 py-2 text-sm font-medium text-background transition-colors hover:bg-primary"
            >
              Check My Idea
            </Link>
          </div>
        </div>

        <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {[
            { label: "Problems", value: PLATFORM_STATS.problems },
            { label: "Solutions", value: PLATFORM_STATS.solutions },
            { label: "Ideas", value: PLATFORM_STATS.ideas, brand: true },
            { label: "Startup Opps", value: PLATFORM_STATS.opportunities },
          ].map((s) => (
            <div key={s.label} className="rounded-2xl bg-card/70 p-5 ring-1 ring-border">
              <div className={`font-display text-3xl font-semibold ${s.brand ? "text-primary" : ""}`}>
                {s.value.toLocaleString()}
              </div>
              <div className="mt-1 text-xs uppercase tracking-wider text-muted-foreground">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-8">
        <div className="flex items-end justify-between">
          <h2 className="font-display text-3xl font-semibold">Trending problems</h2>
          <Link to="/problems" search={{ q: "" }} className="text-sm font-medium text-primary hover:underline">
            View all →
          </Link>
        </div>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {trending.map((p) => (
            <ProblemCard key={p.id} problem={p} />
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-12">
        <p className="text-center text-xs font-semibold uppercase tracking-[0.2em] text-primary">
          How SolveSphere works
        </p>
        <h2 className="mx-auto mt-3 max-w-2xl text-center font-display text-3xl font-semibold">
          One continuous path, from problem to startup opportunity.
        </h2>
        <div className="mt-10 flex flex-wrap items-stretch justify-center gap-3">
          {STEPS.map((step, i) => (
            <div key={step} className="flex items-stretch gap-3">
              <div className="flex flex-col items-center">
                <div
                  className={`grid size-12 place-items-center rounded-full font-display text-xl ${
                    i === STEPS.length - 1
                      ? "bg-gradient-to-br from-primary to-accent text-primary-foreground"
                      : "bg-foreground text-background"
                  }`}
                >
                  {i + 1}
                </div>
                <span
                  className={`mt-2 max-w-[7rem] text-center text-xs ${
                    i === STEPS.length - 1 ? "font-semibold text-primary" : "font-medium text-muted-foreground"
                  }`}
                >
                  {step}
                </span>
              </div>
              {i < STEPS.length - 1 && <div className="self-center text-lg text-muted-foreground/50">→</div>}
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-12">
        <div className="grid items-center gap-6 md:grid-cols-5">
          <div className="md:col-span-2">
            <h2 className="font-display text-3xl font-semibold">Check My Idea</h2>
            <p className="mt-3 text-muted-foreground">
              Describe what you want to build. We run an{" "}
              <span className="font-semibold text-foreground">initial similarity analysis</span> — not a guarantee of
              novelty — so you build better, not blindly.
            </p>
          </div>
          <div className="card-surface p-5 shadow-soft md:col-span-3">
            <div className="flex items-center gap-2 rounded-xl bg-background px-4 py-3 text-sm text-muted-foreground">
              <span>⌕</span>
              <span className="truncate">I want to build an app that connects farmers with agricultural experts.</span>
            </div>
            <div className="mt-4 flex flex-wrap gap-2 text-sm">
              {[
                { name: "AgriConnect Voice", level: "HIGH", note: "Voice-based advisory, 5 languages." },
                { name: "CropAdvisor App", level: "MEDIUM", note: "Image diagnosis, subscription model." },
                { name: "Extension Centres", level: "LOW", note: "In-person, no routing or reminders." },
              ].map((s, i) => (
                <div key={s.name} className="min-w-[150px] flex-1 rounded-xl border border-border p-3">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-semibold">{s.name}</span>
                    <span
                      className={`text-xs font-bold ${
                        i === 0 ? "text-primary" : i === 1 ? "text-accent" : "text-muted-foreground"
                      }`}
                    >
                      {s.level}
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">{s.note}</p>
                </div>
              ))}
            </div>
            <div className="mt-4 flex items-center justify-between text-sm">
              <span className="text-muted-foreground">3 similar solutions · 6 unsolved gaps found</span>
              <Link to="/check-idea" className="font-semibold text-primary hover:underline">
                See full analysis →
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
