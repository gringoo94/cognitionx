
CREATE TABLE public.page_views (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  path TEXT NOT NULL,
  referrer TEXT,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.page_views ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can log a page view"
  ON public.page_views
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "No public read access"
  ON public.page_views
  FOR SELECT
  USING (false);

CREATE INDEX idx_page_views_path ON public.page_views (path);
CREATE INDEX idx_page_views_created_at ON public.page_views (created_at);
