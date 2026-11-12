ALTER TABLE public.profiles ADD COLUMN username text;
ALTER TABLE public.profiles ADD COLUMN avatar_url text;
ALTER TABLE public.profiles ADD COLUMN bio text NOT NULL DEFAULT '';
CREATE UNIQUE INDEX profiles_username_lower_unique ON public.profiles (lower(username)) WHERE username IS NOT NULL;
CREATE TABLE public.user_workspaces (
  user_id uuid PRIMARY KEY,
  payload jsonb NOT NULL DEFAULT '{}'::jsonb,
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.user_workspaces TO authenticated;
GRANT ALL ON public.user_workspaces TO service_role;
ALTER TABLE public.user_workspaces ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can read their own workspace" ON public.user_workspaces FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own workspace" ON public.user_workspaces FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own workspace" ON public.user_workspaces FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete their own workspace" ON public.user_workspaces FOR DELETE TO authenticated USING (auth.uid() = user_id);