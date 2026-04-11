
-- 1. Restrict has_role function to authenticated users only
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, app_role) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, app_role) TO authenticated;

-- 2. Add CHECK constraints for input validation on contact_submissions
ALTER TABLE public.contact_submissions ADD CONSTRAINT name_length CHECK (char_length(name) <= 200);
ALTER TABLE public.contact_submissions ADD CONSTRAINT email_length CHECK (char_length(email) <= 254);
ALTER TABLE public.contact_submissions ADD CONSTRAINT message_length CHECK (char_length(message) <= 5000);
ALTER TABLE public.contact_submissions ADD CONSTRAINT messenger_length CHECK (char_length(messenger) <= 200);

-- 3. Add CHECK constraints for input validation on page_views
ALTER TABLE public.page_views ADD CONSTRAINT path_length CHECK (char_length(path) <= 2048);
ALTER TABLE public.page_views ADD CONSTRAINT referrer_length CHECK (char_length(referrer) <= 2048);
ALTER TABLE public.page_views ADD CONSTRAINT ua_length CHECK (char_length(user_agent) <= 500);

-- 4. Replace overly permissive INSERT policies with rate-limit-friendly ones
-- contact_submissions: keep public insert but add basic email format check
DROP POLICY IF EXISTS "Anyone can submit a contact form" ON public.contact_submissions;
CREATE POLICY "Anyone can submit a contact form"
  ON public.contact_submissions
  FOR INSERT
  TO public
  WITH CHECK (
    email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'
    AND char_length(name) >= 1
    AND char_length(message) >= 1
  );

-- page_views: keep public insert but validate path format
DROP POLICY IF EXISTS "Anyone can log a page view" ON public.page_views;
CREATE POLICY "Anyone can log a page view"
  ON public.page_views
  FOR INSERT
  TO public
  WITH CHECK (
    char_length(path) >= 1
    AND path ~ '^/'
  );
