import { useState, type FormEvent } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, LoaderCircle, Mail, LockKeyhole, UserRound } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useAuth, safeRedirectTarget } from "@/components/auth-provider";
import { lovable } from "@/integrations/lovable";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/auth")({
  validateSearch: (search: Record<string, unknown>) => ({
    redirect: typeof search["redirect"] === "string" ? search["redirect"] : "/",
  }),
  head: () => ({
    meta: [
      { title: "Sign In or Create Account — SolveSphere" },
      { name: "description", content: "Sign in or create a SolveSphere account to save, share and track ideas." },
      { property: "og:title", content: "Sign In or Create Account — SolveSphere" },
      { property: "og:description", content: "Sign in or create a SolveSphere account to save, share and track ideas." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: AuthPage,
});

type Mode = "signin" | "signup" | "forgot";

function AuthPage() {
  const { redirect: requestedRedirect } = Route.useSearch();
  const navigate = useNavigate();
  const { user, loading: authLoading, refreshProfile } = useAuth();
  const [mode, setMode] = useState<Mode>("signin");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const redirectTo = typeof window === "undefined" ? "/" : safeRedirectTarget(requestedRedirect, window.location.origin);

  if (user && !authLoading && mode !== "forgot") {
    void navigate({ to: redirectTo as "/", replace: true });
  }

  const setView = (next: Mode) => {
    setError("");
    setNotice("");
    setMode(next);
  };

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setNotice("");
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError("Enter a valid email address.");
      return;
    }
    if (mode === "forgot") {
      setBusy(true);
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email.trim(), {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      setBusy(false);
      if (resetError) setError(resetError.message);
      else setNotice("If an account exists for that email, a password reset link is on its way.");
      return;
    }
    if (mode === "signup" && name.trim().length < 2) {
      setError("Enter your name (at least 2 characters). ");
      return;
    }
    if (password.length < 8) {
      setError("Use a password with at least 8 characters.");
      return;
    }

    setBusy(true);
    try {
      if (mode === "signup") {
        const { data, error: signUpError } = await supabase.auth.signUp({
          email: email.trim(),
          password,
          options: {
            data: { name: name.trim() },
            emailRedirectTo: `${window.location.origin}/auth?redirect=${encodeURIComponent(redirectTo)}`,
          },
        });
        if (signUpError) throw signUpError;
        if (!data.session) {
          setNotice("Check your email for a confirmation link. You can sign in after confirming your address.");
          setMode("signin");
          return;
        }
        await refreshProfile(data.user?.id);
      } else {
        const { error: signInError } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
        if (signInError) throw signInError;
      }
      await navigate({ to: redirectTo as "/", replace: true });
    } catch (authError) {
      setError(authError instanceof Error ? authError.message : "We couldn't complete that request. Try again.");
    } finally {
      setBusy(false);
    }
  };

  const signInWithGoogle = async () => {
    setBusy(true);
    setError("");
    const result = await lovable.auth.signInWithOAuth("google", { redirect_uri: window.location.origin });
    if (result.error) {
      setError(result.error.message);
      setBusy(false);
      return;
    }
    if (result.redirected) return;
    const { data, error: sessionError } = await supabase.auth.getUser();
    if (sessionError) {
      setError(sessionError.message);
      setBusy(false);
      return;
    }
    await refreshProfile(data.user?.id);
    await navigate({ to: redirectTo as "/", replace: true });
  };

  const title = mode === "signup" ? "Join the problem-solvers" : mode === "forgot" ? "Reset your password" : "Welcome back";

  return (
    <main className="relative min-h-[75vh] px-5 py-10 sm:px-8 sm:py-16">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[420px] sun-wash" />
      <div className="relative mx-auto grid max-w-5xl overflow-hidden rounded-lg bg-card shadow-soft ring-1 ring-border md:grid-cols-[0.88fr_1.12fr]">
        <aside className="hidden min-h-[610px] flex-col justify-between bg-foreground p-10 text-background md:flex">
          <Link to="/" className="flex items-center gap-2 font-display text-xl font-semibold text-background">
            <span className="grid size-8 place-items-center rounded bg-primary font-display text-sm text-primary-foreground">S</span>
            SolveSphere
          </Link>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">A clearer way forward</p>
            <h1 className="mt-4 font-display text-4xl font-semibold leading-tight">Start with what needs solving.</h1>
            <p className="mt-4 max-w-sm text-sm leading-6 text-background/70">
              Find what exists, understand the gaps, and build alongside the people closest to the problem.
            </p>
          </div>
          <p className="text-xs text-background/60">SolveSphere · Problem-to-innovation platform</p>
        </aside>

        <section className="px-6 py-8 sm:px-10 sm:py-12 md:px-14">
          <Link to="/" className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground">
            <ArrowLeft className="size-4" /> Back to SolveSphere
          </Link>
          <div className="mt-8 md:hidden">
            <p className="font-display text-xl font-semibold">Solve<span className="text-primary">Sphere</span></p>
          </div>
          <p className="mt-8 text-xs font-semibold uppercase tracking-[0.18em] text-primary">
            {mode === "signup" ? "Create your account" : mode === "forgot" ? "Account access" : "Your workspace"}
          </p>
          <h2 className="mt-2 font-display text-3xl font-semibold">{title}</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            {mode === "forgot" ? "We'll email you a secure link to choose a new password." : "Save your research, share ideas, and keep your projects moving."}
          </p>

          {mode !== "forgot" && (
            <Button
              type="button"
              variant="outline"
              disabled={busy}
              onClick={signInWithGoogle}
              className="mt-7 h-11 w-full justify-center gap-2 rounded-md border-[#747775] bg-white px-3 text-sm font-medium text-[#1F1F1F] shadow-none hover:bg-neutral-100 hover:text-[#1F1F1F]"
            >
              <svg aria-hidden="true" className="size-[18px]" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M23.49 12.27c0-.79-.07-1.54-.19-2.27H12v4.51h6.47c-.29 1.48-1.14 2.73-2.4 3.58v3h3.86c2.26-2.09 3.56-5.17 3.56-8.82z" />
                <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.86-3c-1.08.72-2.45 1.16-4.07 1.16-3.13 0-5.78-2.11-6.73-4.96H1.29v3.09C3.26 21.3 7.31 24 12 24z" />
                <path fill="#FBBC05" d="M5.27 14.29c-.25-.72-.38-1.49-.38-2.29s.14-1.57.38-2.29V6.62H1.29C.47 8.24 0 10.06 0 12s.47 3.76 1.29 5.38l3.98-3.09z" />
                <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.7 1.29 6.62l3.98 3.09c.95-2.85 3.6-4.96 6.73-4.96z" />
              </svg>
              Continue with Google
            </Button>
          )}

          {mode !== "forgot" && (
            <div className="my-6 flex items-center gap-3 text-xs text-muted-foreground">
              <span className="h-px flex-1 bg-border" /><span>OR WITH EMAIL</span><span className="h-px flex-1 bg-border" />
            </div>
          )}

          <form onSubmit={submit} className="space-y-4">
            {mode === "signup" && (
              <label className="block">
                <span className="text-sm font-medium">Full name</span>
                <span className="relative mt-1.5 block">
                  <UserRound className="absolute left-3 top-3 size-4 text-muted-foreground" />
                  <input required minLength={2} autoComplete="name" value={name} onChange={(e) => setName(e.target.value)} className="w-full rounded-md border border-input bg-background py-2.5 pl-10 pr-3 text-sm outline-none focus:ring-2 focus:ring-ring" placeholder="Your name" />
                </span>
              </label>
            )}
            <label className="block">
              <span className="text-sm font-medium">Email address</span>
              <span className="relative mt-1.5 block">
                <Mail className="absolute left-3 top-3 size-4 text-muted-foreground" />
                <input required type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full rounded-md border border-input bg-background py-2.5 pl-10 pr-3 text-sm outline-none focus:ring-2 focus:ring-ring" placeholder="you@example.com" />
              </span>
            </label>
            {mode !== "forgot" && (
              <label className="block">
                <span className="text-sm font-medium">Password</span>
                <span className="relative mt-1.5 block">
                  <LockKeyhole className="absolute left-3 top-3 size-4 text-muted-foreground" />
                  <input required minLength={8} type="password" autoComplete={mode === "signup" ? "new-password" : "current-password"} value={password} onChange={(e) => setPassword(e.target.value)} className="w-full rounded-md border border-input bg-background py-2.5 pl-10 pr-3 text-sm outline-none focus:ring-2 focus:ring-ring" placeholder="At least 8 characters" />
                </span>
              </label>
            )}
            {mode === "signin" && (
              <div className="-mt-2 flex justify-end">
                <button type="button" onClick={() => setView("forgot")} className="text-xs font-semibold text-primary hover:underline">Forgot password?</button>
              </div>
            )}
            {error && <p role="alert" className="rounded-md border border-destructive/30 bg-destructive/5 px-3 py-2 text-sm text-destructive">{error}</p>}
            {notice && <p role="status" className="rounded-md border border-success/30 bg-success/5 px-3 py-2 text-sm text-success">{notice}</p>}
            <Button type="submit" disabled={busy} className="h-11 w-full rounded-md">
              {busy && <LoaderCircle className="size-4 animate-spin" />}
              {mode === "signup" ? "Create account" : mode === "forgot" ? "Send reset link" : "Sign in"}
            </Button>
          </form>

          {mode === "forgot" ? (
            <button type="button" onClick={() => setView("signin")} className="mt-6 text-sm font-semibold text-primary hover:underline">Back to sign in</button>
          ) : (
            <p className="mt-6 text-center text-sm text-muted-foreground">
              {mode === "signup" ? "Already have an account? " : "New to SolveSphere? "}
              <button type="button" onClick={() => setView(mode === "signup" ? "signin" : "signup")} className="font-semibold text-primary hover:underline">
                {mode === "signup" ? "Sign in" : "Create account"}
              </button>
            </p>
          )}
          <p className="mt-5 text-center text-xs leading-5 text-muted-foreground">By continuing, you agree to use SolveSphere respectfully and keep your account secure.</p>
        </section>
      </div>
    </main>
  );
}