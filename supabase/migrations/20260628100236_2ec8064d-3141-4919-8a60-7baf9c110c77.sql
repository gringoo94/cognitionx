
CREATE TABLE public.indexation_status (
  url TEXT PRIMARY KEY,
  coverage_state TEXT,
  verdict TEXT,
  indexing_state TEXT,
  robots_state TEXT,
  fetch_state TEXT,
  google_canonical TEXT,
  user_canonical TEXT,
  last_crawl_time TIMESTAMPTZ,
  checked_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  raw JSONB
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.indexation_status TO authenticated;
GRANT ALL ON public.indexation_status TO service_role;

ALTER TABLE public.indexation_status ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can read indexation"
  ON public.indexation_status FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can modify indexation"
  ON public.indexation_status FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));
