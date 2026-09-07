import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PROBLEMS } from "@/lib/data";
import { Field, PageShell, inputClass } from "@/components/site";
import { today, uid, useAppState } from "@/lib/store";

export const Route = createFileRoute("/submit-solution")({
  head: () => ({
    meta: [
      { title: "Submit a Solution — SolveSphere" },
      { name: "description", content: "Add an existing solution or propose a new one for a documented problem." },
      { property: "og:title", content: "Submit a Solution — SolveSphere" },
      { property: "og:description", content: "Tell us how it works, who it serves, and what it costs." },
    ],
  }),
  component: SubmitSolution,
});

const EMPTY = {
  name: "",
  problemId: PROBLEMS[0]!.id,
  description: "",
  howItWorks: "",
  targetUsers: "",
  advantages: "",
  technology: "",
  cost: "",
  impact: "",
  kind: "Existing" as "Existing" | "New",
  reference: "",
};

function SubmitSolution() {
  const { update } = useAppState();
  const [form, setForm] = useState(EMPTY);
  const [errors, setErrors] = useState<Record<string, string | undefined>>({});
  const [done, setDone] = useState(false);

  const set = (k: keyof typeof EMPTY, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const next: Record<string, string | undefined> = {};
    if (!form.name.trim()) next["name"] = "Name the solution.";
    if (form.description.trim().length < 20) next["description"] = "Add at least 20 characters.";
    setErrors(next);
    if (Object.keys(next).length > 0) return;
    update((prev) => ({
      ...prev,
      solutions: [...prev.solutions, { id: uid(), ...form, status: "Pending", createdAt: today() }],
    }));
    setForm(EMPTY);
    setDone(true);
  };

  return (
    <PageShell
      eyebrow="Contribute"
      title="Submit a solution"
      intro="Document something that already exists, or propose a new approach to a known problem."
    >
      {done && (
        <div className="card-surface mb-6 border-l-4 border-l-primary p-4 text-sm">
          Submitted — pending review. Thanks for adding to the map.
        </div>
      )}
      <form onSubmit={submit} className="card-surface grid max-w-3xl gap-4 p-6">
        <Field label="Solution name" error={errors["name"]}>
          <input value={form.name} onChange={(e) => set("name", e.target.value)} className={inputClass} />
        </Field>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Linked problem">
            <select value={form.problemId} onChange={(e) => set("problemId", e.target.value)} className={inputClass}>
              {PROBLEMS.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.title}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Type">
            <select value={form.kind} onChange={(e) => set("kind", e.target.value)} className={inputClass}>
              <option>Existing</option>
              <option>New</option>
            </select>
          </Field>
        </div>
        <Field label="Description" error={errors["description"]}>
          <textarea
            rows={3}
            value={form.description}
            onChange={(e) => set("description", e.target.value)}
            className={inputClass}
          />
        </Field>
        <Field label="How it works">
          <textarea
            rows={3}
            value={form.howItWorks}
            onChange={(e) => set("howItWorks", e.target.value)}
            className={inputClass}
          />
        </Field>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Target users">
            <input
              value={form.targetUsers}
              onChange={(e) => set("targetUsers", e.target.value)}
              className={inputClass}
            />
          </Field>
          <Field label="Advantages">
            <input value={form.advantages} onChange={(e) => set("advantages", e.target.value)} className={inputClass} />
          </Field>
          <Field label="Technology used">
            <input value={form.technology} onChange={(e) => set("technology", e.target.value)} className={inputClass} />
          </Field>
          <Field label="Cost">
            <input value={form.cost} onChange={(e) => set("cost", e.target.value)} className={inputClass} />
          </Field>
          <Field label="Impact">
            <input value={form.impact} onChange={(e) => set("impact", e.target.value)} className={inputClass} />
          </Field>
          <Field label="Reference link" hint="optional">
            <input value={form.reference} onChange={(e) => set("reference", e.target.value)} className={inputClass} />
          </Field>
        </div>
        <button
          type="submit"
          className="justify-self-start rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground"
        >
          Submit solution
        </button>
      </form>
    </PageShell>
  );
}
