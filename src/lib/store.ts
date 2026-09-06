import { useCallback, useEffect, useState } from "react";

const KEY = "solvesphere.v1";
const EVENT = "solvesphere:change";

export interface UserIdea {
  id: string;
  problemId: string;
  author: string;
  role: string;
  title: string;
  body: string;
  upvotes: number;
  createdAt: string;
  comments: { id: string; author: string; body: string; createdAt: string }[];
}

export interface SubmittedProblem {
  id: string;
  title: string;
  description: string;
  category: string;
  industry: string;
  location: string;
  whoExperiences: string;
  frequency: string;
  severity: string;
  affected: string;
  currentMethod: string;
  whyInsufficient: string;
  attachment: string;
  source: string;
  anonymous: boolean;
  status: "Pending" | "Approved" | "Rejected";
  createdAt: string;
}

export interface SubmittedSolution {
  id: string;
  name: string;
  problemId: string;
  description: string;
  howItWorks: string;
  targetUsers: string;
  advantages: string;
  technology: string;
  cost: string;
  impact: string;
  kind: "Existing" | "New";
  reference: string;
  status: "Pending" | "Approved" | "Rejected";
  createdAt: string;
}

export interface AppState {
  votes: Record<string, number>;
  voted: string[];
  saved: string[];
  followed: string[];
  ideas: UserIdea[];
  comments: Record<string, { id: string; author: string; body: string; createdAt: string }[]>;
  improvements: Record<string, { title: string; detail: string }[]>;
  problems: SubmittedProblem[];
  solutions: SubmittedSolution[];
  interests: string[];
}

const EMPTY: AppState = {
  votes: {},
  voted: [],
  saved: [],
  followed: [],
  ideas: [],
  comments: {},
  improvements: {},
  problems: [],
  solutions: [],
  interests: [],
};

function read(): AppState {
  if (typeof window === "undefined") return EMPTY;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return EMPTY;
    return { ...EMPTY, ...(JSON.parse(raw) as Partial<AppState>) };
  } catch {
    return EMPTY;
  }
}

function write(state: AppState) {
  window.localStorage.setItem(KEY, JSON.stringify(state));
  window.dispatchEvent(new CustomEvent(EVENT));
}

/** Reads persisted prototype data. Returns empty state during SSR/first paint. */
export function useAppState() {
  const [state, setState] = useState<AppState>(EMPTY);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const sync = () => setState(read());
    sync();
    setHydrated(true);
    window.addEventListener(EVENT, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(EVENT, sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  const update = useCallback((fn: (prev: AppState) => AppState) => {
    write(fn(read()));
  }, []);

  return { state, hydrated, update };
}

export const uid = () => Math.random().toString(36).slice(2, 10);
export const today = () => new Date().toISOString().slice(0, 10);
