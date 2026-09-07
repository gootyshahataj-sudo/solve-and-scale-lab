import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { CATEGORIES, INDUSTRIES, SEVERITIES } from "@/lib/data";
import { Field, PageShell, inputClass } from "@/components/site";
import { today, uid, useAppState } from "@/lib/store";

export const Route = createFileRoute("/submit-problem")({
  head: () => ({
    meta: [
      { title: "Submit a Problem — SolveSphere" },
      { name: "description", content: "Document a real-world problem so builders and investors can act on it." },
      { property: "og:title", content: "Submit a Problem — SolveSphere" },
      { property: "og:description", content: "Share who it affects, how often, and why current fixes fall short." },
    ],
  }),
  component: SubmitProblem,
});

const EMPTY = {
  title: "",
  description: "",
  category: CATEGORIES[0] as string,
  industry: INDUSTRIES[0],
  location: "",
  whoExperiences: "",
  frequency: "",
  severity: SEVERITIES[0] as string,
  affected: "",
  currentMethod: "",
  whyInsufficient: "",
  attachment: "",
  source: "",
  anonymous: false,
};

function SubmitProblem() {
  const { update } = useAppState();
  const [form, setForm] = useState(EMPTY);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [done, setDone] = useState(false);

  const set = (k: keyof typeof EMPTY, v: string | boolean) => setForm((f) => ({ ...f, [k]: v }));

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const next: Record<string, string> = {};
    if (form.title.trim().length < 8) next.title = "Give the problem a clear title (8+ characters).";
    if (form.description.trim().length < 30) next.description = "Describe it in at least 30 characters.";
    if (!form.whoExperiences.trim()) next.whoExperiences = "Tell us who experiences this.";
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    update((prev) => ({
      ...prev,
      problems: [...prev.problems, { id: uid(), ...form, status: "Pending", createdAt: today() }],
    }));
    setForm(EMPTY);
    setDone(true);
  };

  return (
    <PageShell
      eyebrow="Contribute"
      title="Submit a problem"
      intro="The more specific you are, the easier it is for someone to build the right solution."
    >
      {done && (
        <div className="card-surface mb-6 border-l-4 border-l-primary p-4 text-sm">
          Thanks — your problem was submitted and is pending review. You can see it on your dashboard.
        </div>
      )}
      <form onSubmit={submit} className="card-surface grid max-w-3xl gap-4 p-6">
        <Field label="Problem title" error={errors.title}>
          <input value={form.title} onChange={(e) => set("title", e.target.value)} className={inputClass} />
        </Field>
        <Field label="Description" error={errors.description}>
          <textarea
            rows={4}
            value={form.description}
            onChange={(e) => set("description", e.target.value)}
            className={inputClass}
          />
        </Field>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Category">
            <select value={form.category} onChange={(e) => set("category", e.target.value)} className={inputClass}>
              {CATEGORIES.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </Field>
          <Field label="Industry">
            <select value={form.industry} onChange={(e) => set("industry", e.target.value)} className={inputClass}>
              {INDUSTRIES.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </Field>
          <Field label="Location / region">
            <input value={form.location} onChange={(e) => set("location", e.target.value)} className={inputClass} />
          </Field>
          <Field label="Severity">
            <select value={form.severity} onChange={(e) => set("severity", e.target.value)} className={inputClass}>
              {SEVERITIES.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </Field>
          <Field label="Who experiences it" error={errors.whoExperiences}>
            <input
              value={form.whoExperiences}
              onChange={(e) => set("whoExperiences", e.target.value)}
              className={inputClass}
            />
          </Field>
          <Field label="How often">
            <input value={form.frequency} onChange={(e) => set("frequency", e.target.value)} className={inputClass} />
          </Field>
          <Field label="People affected (estimate)">
            <input value={form.affected} onChange={(e) => set("affected", e.target.value)} className={inputClass} />
          </Field>
          <Field label="Reference link" hint="optional">
            <input value={form.source} onChange={(e) => set("source", e.target.value)} className={inputClass} />
          </Field>
        </div>
        <Field label="How is it handled today?">
          <textarea
            rows={3}
            value={form.currentMethod}
            onChange={(e) => set("currentMethod", e.target.value)}
            className={inputClass}
          />
        </Field>
        <Field label="Why is that not enough?">
          <textarea
            rows={3}
            value={form.whyInsufficient}
            onChange={(e) => set("whyInsufficient", e.target.value)}
            className={inputClass}
          />
        </Field>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={form.anonymous}
            onChange={(e) => set("anonymous", e.target.checked)}
            className="size-4"
          />
          Submit anonymously
        </label>
        <button
          type="submit"
          className="justify-self-start rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground"
        >
          Submit problem
        </button>
      </form>
    </PageShell>
  );
}
