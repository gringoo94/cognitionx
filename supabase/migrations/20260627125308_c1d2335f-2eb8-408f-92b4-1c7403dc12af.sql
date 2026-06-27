CREATE TABLE public.cta_clicks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  path text,
  referrer text,
  user_agent text,
  meta jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

GRANT INSERT ON public.cta_clicks TO anon, authenticated;
GRANT ALL ON public.cta_clicks TO service_role;

ALTER TABLE public.cta_clicks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert CTA clicks"
  ON public.cta_clicks FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE INDEX cta_clicks_name_created_at_idx ON public.cta_clicks (name, created_at DESC);
CREATE INDEX cta_clicks_path_created_at_idx ON public.cta_clicks (path, created_at DESC);