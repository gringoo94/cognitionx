ALTER TABLE public.contact_submissions DROP CONSTRAINT IF EXISTS email_length;
ALTER TABLE public.contact_submissions ADD CONSTRAINT email_length CHECK (char_length(email) <= 320);
ALTER TABLE public.page_views DROP CONSTRAINT IF EXISTS ua_length;
ALTER TABLE public.page_views ADD CONSTRAINT ua_length CHECK (char_length(user_agent) <= 1000);
DROP POLICY IF EXISTS "Anyone can insert CTA clicks" ON public.cta_clicks;
CREATE POLICY "Anyone can insert CTA clicks" ON public.cta_clicks FOR INSERT TO anon, authenticated
WITH CHECK (
  char_length(name) BETWEEN 1 AND 100
  AND (path IS NULL OR (path ~ '^/' AND char_length(path) <= 500))
  AND (referrer IS NULL OR char_length(referrer) <= 2048)
  AND (user_agent IS NULL OR char_length(user_agent) <= 1000)
);