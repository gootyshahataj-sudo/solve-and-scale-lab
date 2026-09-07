import { Link } from "@tanstack/react-router";
import { Menu, X, Search } from "lucide-react";
import { useState, type ReactNode } from "react";

const NAV = [
  { to: "/problems", label: "Explore" },
  { to: "/check-idea", label: "Check My Idea" },
  { to: "/community", label: "Community" },
  { to: "/opportunities", label: "Opportunities" },
  { to: "/investors", label: "Investors" },
] as const;

export function Header() {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/85 backdrop-blur-sm">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <Link to="/" className="flex items-center gap-2.5">
          <span className="grid size-8 place-items-center rounded-lg bg-gradient-to-br from-primary to-accent font-display text-sm font-semibold text-primary-foreground shadow-sm">
            S
          </span>
          <span className="font-display text-xl font-semibold tracking-tight">
            Solve<span className="text-primary">Sphere</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-7 text-sm font-medium text-muted-foreground md:flex">
          {NAV.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              activeProps={{ className: "text-foreground" }}
              className="transition-colors hover:text-foreground"
            >
              {n.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Link
            to="/admin"
            className="hidden px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground sm:block"
          >
            Admin
          </Link>
          <Link
            to="/dashboard"
            className="rounded-full bg-foreground px-4 py-2 text-sm font-semibold text-background transition-colors hover:bg-primary"
          >
            Dashboard
          </Link>
          <button
            aria-label="Toggle menu"
            onClick={() => setOpen((v) => !v)}
            className="grid size-9 place-items-center rounded-full border border-border md:hidden"
          >
            {open ? <X className="size-4" /> : <Menu className="size-4" />}
          </button>
        </div>
      </div>

      {open && (
        <nav className="border-t border-border bg-background px-6 py-3 md:hidden">
          {[...NAV, { to: "/admin", label: "Admin" } as const].map((n) => (
            <Link
              key={n.to}
              to={n.to}
              onClick={() => setOpen(false)}
              className="block py-2 text-sm font-medium text-muted-foreground"
              activeProps={{ className: "block py-2 text-sm font-medium text-foreground" }}
            >
              {n.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}

export function Footer() {
  return (
    <footer className="relative mt-8 border-t border-border">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 py-8 text-sm text-muted-foreground sm:flex-row">
        <div className="flex items-center gap-2">
          <span className="font-display text-lg font-semibold text-foreground">
            Solve<span className="text-primary">Sphere</span>
          </span>
          <span>© 2026</span>
        </div>
        <div className="flex flex-wrap justify-center gap-6">
          <Link to="/problems" search={{ q: "" }}>Explore</Link>
          <Link to="/community">Community</Link>
          <Link to="/investors">Investors</Link>
          <Link to="/submit-problem">Submit a problem</Link>
        </div>
      </div>
    </footer>
  );
}

export function PageShell({
  eyebrow,
  title,
  intro,
  children,
  action,
}: {
  eyebrow: string;
  title: string;
  intro: string;
  children: ReactNode;
  action?: ReactNode;
}) {
  return (
    <main className="relative">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[420px] sun-wash" />
      <div className="relative mx-auto max-w-6xl px-6 py-12">
        <div className="rise flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">{eyebrow}</p>
            <h1 className="mt-3 max-w-3xl font-display text-4xl font-semibold">{title}</h1>
            <p className="mt-3 max-w-2xl text-muted-foreground">{intro}</p>
          </div>
          {action}
        </div>
        <div className="mt-10">{children}</div>
      </div>
    </main>
  );
}

export function Pill({
  children,
  tone = "neutral",
}: {
  children: ReactNode;
  tone?: "neutral" | "brand" | "accent" | "danger" | "success";
}) {
  const tones = {
    neutral: "bg-secondary text-muted-foreground",
    brand: "bg-primary/10 text-primary",
    accent: "bg-accent/10 text-accent",
    danger: "bg-destructive/10 text-destructive",
    success: "bg-success/10 text-success",
  } as const;
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ${tones[tone]}`}>
      {children}
    </span>
  );
}

export function SearchField({
  value,
  onChange,
  onSubmit,
  placeholder = "Search problems, solutions, or ideas...",
  cta,
}: {
  value: string;
  onChange: (v: string) => void;
  onSubmit?: () => void;
  placeholder?: string;
  cta?: string;
}) {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit?.();
      }}
      className="flex items-center gap-2 rounded-2xl bg-card p-2 shadow-soft ring-1 ring-border"
    >
      <Search className="ml-3 size-4 text-muted-foreground" />
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        aria-label={placeholder}
        className="flex-1 bg-transparent py-2.5 text-sm outline-none placeholder:text-muted-foreground/70"
      />
      {cta && (
        <button
          type="submit"
          className="rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
        >
          {cta}
        </button>
      )}
    </form>
  );
}

export function EmptyState({ title, hint, action }: { title: string; hint: string; action?: ReactNode }) {
  return (
    <div className="card-surface flex flex-col items-center gap-2 px-6 py-14 text-center">
      <p className="font-display text-xl font-semibold">{title}</p>
      <p className="max-w-md text-sm text-muted-foreground">{hint}</p>
      {action}
    </div>
  );
}

export function Skeletons({ count = 3 }: { count?: number }) {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="card-surface animate-pulse p-6">
          <div className="h-3 w-24 rounded bg-secondary" />
          <div className="mt-4 h-5 w-full rounded bg-secondary" />
          <div className="mt-2 h-5 w-3/4 rounded bg-secondary" />
          <div className="mt-5 h-3 w-1/2 rounded bg-secondary" />
        </div>
      ))}
    </div>
  );
}

export function Field({
  label,
  error,
  children,
  hint,
}: {
  label: string;
  error?: string | undefined;
  hint?: string | undefined;
  children: ReactNode;
}) {
  return (
    <label className="block">
      <span className="text-sm font-semibold">{label}</span>
      {hint && <span className="ml-2 text-xs text-muted-foreground">{hint}</span>}
      <div className="mt-1.5">{children}</div>
      {error && <span className="mt-1 block text-xs font-medium text-destructive">{error}</span>}
    </label>
  );
}

export const inputClass =
  "w-full rounded-xl border border-input bg-card px-3.5 py-2.5 text-sm outline-none transition-shadow focus:ring-2 focus:ring-ring";
