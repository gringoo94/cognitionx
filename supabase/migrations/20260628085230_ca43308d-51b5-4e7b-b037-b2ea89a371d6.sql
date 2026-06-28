DROP POLICY IF EXISTS "Anyone can insert CTA clicks" ON public.cta_clicks;

CREATE POLICY "Anyone can insert CTA clicks"
ON public.cta_clicks
FOR INSERT
TO anon, authenticated
WITH CHECK (
  char_length(name) BETWEEN 1 AND 100
  AND (path IS NULL OR (path ~ '^/' AND char_length(path) <= 500))
  AND (referrer IS NULL OR char_length(referrer) <= 1000)
  AND (user_agent IS NULL OR char_length(user_agent) <= 1000)
);