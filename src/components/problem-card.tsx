import { Link } from "@tanstack/react-router";
import { ArrowUp, Bookmark } from "lucide-react";
import { formatAffected, type Problem } from "@/lib/data";
import { useAppState } from "@/lib/store";
import { Pill } from "@/components/site";

export function useVoting() {
  const { state, update, hydrated } = useAppState();

  const score = (id: string, base: number) => base + (state.votes[id] ?? 0);
  const hasVoted = (id: string) => state.voted.includes(id);

  const toggleVote = (id: string) =>
    update((prev) => {
      const voted = prev.voted.includes(id);
      return {
        ...prev,
        voted: voted ? prev.voted.filter((v) => v !== id) : [...prev.voted, id],
        votes: { ...prev.votes, [id]: (prev.votes[id] ?? 0) + (voted ? -1 : 1) },
      };
    });

  const isSaved = (id: string) => state.saved.includes(id);
  const toggleSave = (id: string) =>
    update((prev) => ({
      ...prev,
      saved: prev.saved.includes(id) ? prev.saved.filter((s) => s !== id) : [...prev.saved, id],
    }));

  const isFollowed = (id: string) => state.followed.includes(id);
  const toggleFollow = (id: string) =>
    update((prev) => ({
      ...prev,
      followed: prev.followed.includes(id) ? prev.followed.filter((s) => s !== id) : [...prev.followed, id],
    }));

  return { score, hasVoted, toggleVote, isSaved, toggleSave, isFollowed, toggleFollow, hydrated, state, update };
}

export function ProblemCard({ problem }: { problem: Problem }) {
  const { score, hasVoted, toggleVote, isSaved, toggleSave } = useVoting();

  return (
    <article className="card-surface group flex flex-col p-6 transition-all hover:-translate-y-0.5 hover:shadow-soft">
      <div className="flex items-center justify-between gap-3">
        <span className="text-xs font-semibold uppercase tracking-wider text-primary">{problem.category}</span>
        <span className="text-xs text-muted-foreground">{formatAffected(problem.peopleAffected)} affected</span>
      </div>

      <Link to="/problems/$problemId" params={{ problemId: problem.id }} className="mt-3 block">
        <h3 className="font-display text-xl font-semibold leading-snug group-hover:text-primary">{problem.title}</h3>
      </Link>
      <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{problem.description}</p>

      <div className="mt-4 flex flex-wrap gap-2">
        <Pill tone={problem.severity === "Critical" ? "danger" : problem.severity === "High" ? "accent" : "neutral"}>
          {problem.severity} severity
        </Pill>
        <Pill>{problem.status}</Pill>
      </div>

      <div className="mt-5 flex items-center justify-between border-t border-border pt-4 text-sm text-muted-foreground">
        <div className="flex items-center gap-4">
          <span>{problem.existingSolutions.length} solutions</span>
          <span>{problem.ideas.length} ideas</span>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => toggleVote(problem.id)}
            aria-pressed={hasVoted(problem.id)}
            className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold transition-colors ${
              hasVoted(problem.id) ? "bg-primary/10 text-primary" : "hover:bg-secondary"
            }`}
          >
            <ArrowUp className="size-3.5" /> {score(problem.id, problem.upvotes)}
          </button>
          <button
            onClick={() => toggleSave(problem.id)}
            aria-label={isSaved(problem.id) ? "Remove bookmark" : "Save problem"}
            className={`grid size-7 place-items-center rounded-full transition-colors ${
              isSaved(problem.id) ? "bg-primary/10 text-primary" : "hover:bg-secondary"
            }`}
          >
            <Bookmark className="size-3.5" />
          </button>
        </div>
      </div>
    </article>
  );
}
