CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT auth.uid() = _user_id AND EXISTS (
    SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role
  );
$$;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO authenticated;

CREATE POLICY "Admins can view all profiles" ON public.profiles FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can view all assigned roles" ON public.user_roles FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));

CREATE TABLE public.categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  slug text NOT NULL UNIQUE,
  description text NOT NULL DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.categories TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.categories TO authenticated;
GRANT ALL ON public.categories TO service_role;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Categories are public" ON public.categories FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Admins manage categories" ON public.categories FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE TABLE public.problems (
  id text PRIMARY KEY,
  owner_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text NOT NULL,
  category text NOT NULL DEFAULT 'Daily Life',
  industry text NOT NULL DEFAULT '',
  location text NOT NULL DEFAULT '',
  who_experiences text NOT NULL DEFAULT '',
  frequency text NOT NULL DEFAULT '',
  severity text NOT NULL DEFAULT 'Medium',
  affected text NOT NULL DEFAULT '',
  current_method text NOT NULL DEFAULT '',
  why_insufficient text NOT NULL DEFAULT '',
  source text NOT NULL DEFAULT '',
  anonymous boolean NOT NULL DEFAULT false,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.problems TO authenticated;
GRANT SELECT ON public.problems TO anon;
GRANT ALL ON public.problems TO service_role;
ALTER TABLE public.problems ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Approved problems are public, owners and admins see others" ON public.problems FOR SELECT TO anon, authenticated USING (status = 'approved' OR owner_id = auth.uid() OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Users submit problems for review" ON public.problems FOR INSERT TO authenticated WITH CHECK (owner_id = auth.uid() AND status = 'pending');
CREATE POLICY "Owners edit pending problems, admins moderate" ON public.problems FOR UPDATE TO authenticated USING ((owner_id = auth.uid() AND status = 'pending') OR public.has_role(auth.uid(), 'admin')) WITH CHECK ((owner_id = auth.uid() AND status = 'pending') OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Owners delete pending problems, admins manage" ON public.problems FOR DELETE TO authenticated USING ((owner_id = auth.uid() AND status = 'pending') OR public.has_role(auth.uid(), 'admin'));
CREATE INDEX problems_approved_created_at_idx ON public.problems (created_at DESC) WHERE status = 'approved';

CREATE TABLE public.ideas (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  problem_id text NOT NULL DEFAULT '',
  title text NOT NULL,
  body text NOT NULL,
  category text NOT NULL DEFAULT 'Daily Life',
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.ideas TO authenticated;
GRANT SELECT ON public.ideas TO anon;
GRANT ALL ON public.ideas TO service_role;
ALTER TABLE public.ideas ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Approved ideas are public, owners and admins can see others" ON public.ideas FOR SELECT TO anon, authenticated USING (status = 'approved' OR owner_id = auth.uid() OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Users submit ideas for review" ON public.ideas FOR INSERT TO authenticated WITH CHECK (owner_id = auth.uid() AND status = 'pending');
CREATE POLICY "Owners edit pending ideas, admins moderate" ON public.ideas FOR UPDATE TO authenticated USING ((owner_id = auth.uid() AND status = 'pending') OR public.has_role(auth.uid(), 'admin')) WITH CHECK ((owner_id = auth.uid() AND status = 'pending') OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Owners delete pending ideas, admins manage" ON public.ideas FOR DELETE TO authenticated USING ((owner_id = auth.uid() AND status = 'pending') OR public.has_role(auth.uid(), 'admin'));
CREATE INDEX ideas_approved_created_at_idx ON public.ideas (created_at DESC) WHERE status = 'approved';

CREATE TABLE public.solutions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  problem_id text NOT NULL DEFAULT '',
  name text NOT NULL,
  description text NOT NULL,
  how_it_works text NOT NULL DEFAULT '',
  target_users text NOT NULL DEFAULT '',
  advantages text NOT NULL DEFAULT '',
  technology text NOT NULL DEFAULT '',
  cost text NOT NULL DEFAULT '',
  impact text NOT NULL DEFAULT '',
  kind text NOT NULL DEFAULT 'New' CHECK (kind IN ('Existing', 'New')),
  reference text NOT NULL DEFAULT '',
  category text NOT NULL DEFAULT 'Daily Life',
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.solutions TO authenticated;
GRANT SELECT ON public.solutions TO anon;
GRANT ALL ON public.solutions TO service_role;
ALTER TABLE public.solutions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Approved solutions are public, owners and admins see others" ON public.solutions FOR SELECT TO anon, authenticated USING (status = 'approved' OR owner_id = auth.uid() OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Users submit solutions for review" ON public.solutions FOR INSERT TO authenticated WITH CHECK (owner_id = auth.uid() AND status = 'pending');
CREATE POLICY "Owners edit pending solutions, admins moderate" ON public.solutions FOR UPDATE TO authenticated USING ((owner_id = auth.uid() AND status = 'pending') OR public.has_role(auth.uid(), 'admin')) WITH CHECK ((owner_id = auth.uid() AND status = 'pending') OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Owners delete pending solutions, admins manage" ON public.solutions FOR DELETE TO authenticated USING ((owner_id = auth.uid() AND status = 'pending') OR public.has_role(auth.uid(), 'admin'));
CREATE INDEX solutions_approved_created_at_idx ON public.solutions (created_at DESC) WHERE status = 'approved';