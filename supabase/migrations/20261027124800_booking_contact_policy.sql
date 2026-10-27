-- Booking form stores "Telegram: <contact>" / "WhatsApp: <contact>" in email; allow it.
DROP POLICY IF EXISTS "Anyone can submit a contact form" ON public.contact_submissions;
CREATE POLICY "Anyone can submit a contact form" ON public.contact_submissions FOR INSERT TO public
WITH CHECK (
  char_length(name) BETWEEN 1 AND 200
  AND char_length(message) BETWEEN 1 AND 5000
  AND char_length(email) BETWEEN 3 AND 320
  AND (messenger IS NULL OR char_length(messenger) <= 200)
  AND (
    email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'
    OR email ~ '^(Telegram|WhatsApp): .+'
  )
);
