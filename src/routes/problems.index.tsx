import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { CATEGORIES, INDUSTRIES, PROBLEMS, SEVERITIES, STATUSES } from "@/lib/data";
import { ProblemCard } from "@/components/problem-card";
import { EmptyState, PageShell, SearchField } from "@/components/site";

export const Route = createFileRoute("/problems/")({
  validateSearch: (search: Record<string, unknown>) => ({ q: String(search.q ?? "") }),
  head: () => ({
    meta: [
      { title: "Explore Problems — SolveSphere" },
      {
        name: "description",
        content: "Browse real-world problems by category, industry, severity and status, and see what already exists.",
      },
      { property: "og:title", content: "Explore Problems — SolveSphere" },
      { property: "og:description", content: "Filter thousands of real-world problems and find the unsolved gaps." },
    ],
  }),
  component: ProblemsPage,
});

type Sort = "Trending" | "Most upvoted" | "Newest" | "Most affected";

function ProblemsPage() {
  const { q } = Route.useSearch();
  const navigate = Route.useNavigate();
  const [query, setQuery] = useState(q);
  const [category, setCategory] = useState("All");
  const [industry, setIndustry] = useState("All");
  const [severity, setSeverity] = useState("All");
  const [status, setStatus] = useState("All");
  const [sort, setSort] = useState<Sort>("Trending");

  const results = useMemo(() => {
    const needle = query.trim().toLowerCase();
    const list = PROBLEMS.filter((p) => {
      const matches =
        !needle ||
        p.title.toLowerCase().includes(needle) ||
        p.description.toLowerCase().includes(needle) ||
        p.category.toLowerCase().includes(needle);
      return (
        matches &&
        (category === "All" || p.category === category) &&
        (industry === "All" || p.industry === industry) &&
        (severity === "All" || p.severity === severity) &&
        (status === "All" || p.status === status)
      );
    });
    return [...list].sort((a, b) => {
      if (sort === "Most upvoted") return b.upvotes - a.upvotes;
      if (sort === "Most affected") return b.peopleAffected - a.peopleAffected;
      if (sort === "Newest") return b.createdAt.localeCompare(a.createdAt);
      return Number(b.trending) - Number(a.trending) || b.upvotes - a.upvotes;
    });
  }, [query, category, industry, severity, status, sort]);

  const selectClass =
    "rounded-full border border-input bg-card px-3.5 py-2 text-sm outline-none focus:ring-2 focus:ring-ring";

  return (
    <PageShell
      eyebrow="Explore"
      title="Real problems, mapped to what already exists"
      intro="Filter by category, industry, severity and status to find where the gaps still are."
    >
      <SearchField
        value={query}
        onChange={setQuery}
        cta="Search"
        onSubmit={() => navigate({ to: ".", search: { q: query } })}
      />

      <div className="mt-5 flex flex-wrap gap-2">
        <select value={category} onChange={(e) => setCategory(e.target.value)} className={selectClass}>
          {["All", ...CATEGORIES].map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>
        <select value={industry} onChange={(e) => setIndustry(e.target.value)} className={selectClass}>
          {["All", ...INDUSTRIES].map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>
        <select value={severity} onChange={(e) => setSeverity(e.target.value)} className={selectClass}>
          {["All", ...SEVERITIES].map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>
        <select value={status} onChange={(e) => setStatus(e.target.value)} className={selectClass}>
          {["All", ...STATUSES].map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>
        <select value={sort} onChange={(e) => setSort(e.target.value as Sort)} className={selectClass}>
          {["Trending", "Most upvoted", "Newest", "Most affected"].map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>
      </div>

      <p className="mt-6 text-sm text-muted-foreground">{results.length} problems</p>

      {results.length === 0 ? (
        <div className="mt-4">
          <EmptyState title="No problems match those filters" hint="Try clearing a filter or searching a broader term." />
        </div>
      ) : (
        <div className="mt-4 grid gap-4 md:grid-cols-3">
          {results.map((p) => (
            <ProblemCard key={p.id} problem={p} />
          ))}
        </div>
      )}
    </PageShell>
  );
}
