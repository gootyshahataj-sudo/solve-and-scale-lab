import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { User } from "@supabase/supabase-js";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

type AuthContextValue = {
  user: User | null;
  profileName: string;
  loading: boolean;
  refreshProfile: (userId?: string) => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient();
  const [user, setUser] = useState<User | null>(null);
  const [profileName, setProfileName] = useState("");
  const [loading, setLoading] = useState(true);

  const refreshProfile = useCallback(async (userId = user?.id) => {
    if (!userId) {
      setProfileName("");
      return;
    }
    const { data, error } = await supabase.from("profiles").select("full_name").eq("id", userId).maybeSingle();
    if (!error && data) setProfileName(data.full_name);
  }, [user?.id]);

  useEffect(() => {
    let active = true;
    const { data: listener } = supabase.auth.onAuthStateChange((event, session) => {
      if (!active) return;
      const nextUser = session?.user ?? null;
      setUser(nextUser);
      if (!nextUser) {
        setProfileName("");
      } else if (event === "SIGNED_IN" || event === "USER_UPDATED" || event === "INITIAL_SESSION") {
        void Promise.resolve().then(() => refreshProfile(nextUser.id));
      }
      setLoading(false);
    });

    void supabase.auth.getUser().then(({ data, error }) => {
      if (!active) return;
      const nextUser = error ? null : data.user;
      setUser(nextUser);
      setLoading(false);
      if (nextUser) void refreshProfile(nextUser.id);
    });

    return () => {
      active = false;
      listener.subscription.unsubscribe();
    };
  }, [refreshProfile]);

  const signOut = useCallback(async () => {
    await queryClient.cancelQueries();
    queryClient.clear();
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    window.location.assign("/auth?redirect=%2F");
  }, [queryClient]);

  const value = useMemo(
    () => ({ user, profileName, loading, refreshProfile, signOut }),
    [user, profileName, loading, refreshProfile, signOut],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const value = useContext(AuthContext);
  if (!value) throw new Error("useAuth must be used inside AuthProvider");
  return value;
}

export function safeRedirectTarget(value: string | null | undefined, origin: string) {
  if (!value) return "/";
  try {
    const url = new URL(value, origin);
    if (url.origin !== origin || !value.startsWith("/") || value.startsWith("//") || value.includes("\\")) return "/";
    return `${url.pathname}${url.search}${url.hash}`;
  } catch {
    return "/";
  }
}