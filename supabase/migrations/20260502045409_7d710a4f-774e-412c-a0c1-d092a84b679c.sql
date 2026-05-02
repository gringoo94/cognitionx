CREATE TABLE public.blog_subscribers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL UNIQUE,
  source text NOT NULL DEFAULT 'blog',
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.blog_subscribers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can subscribe"
ON public.blog_subscribers
FOR INSERT
TO public
WITH CHECK (
  email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'
  AND char_length(email) <= 255
  AND char_length(source) <= 50
);

CREATE POLICY "Admins can read subscribers"
ON public.blog_subscribers
FOR SELECT
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "No public read"
ON public.blog_subscribers
FOR SELECT
TO public
USING (false);

CREATE INDEX idx_blog_subscribers_created_at ON public.blog_subscribers(created_at DESC);