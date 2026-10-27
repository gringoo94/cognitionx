// Must match the database rule for contact_submissions / blog_subscribers.
export const DB_EMAIL_RE = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;

/** Value for contact_submissions.email: a real email, or "Telegram: <contact>". */
export const toContactEmailField = (contact: string, channel: "Telegram" | "WhatsApp" = "Telegram") => {
  const c = contact.trim();
  return DB_EMAIL_RE.test(c) ? c.toLowerCase() : `${channel}: ${c}`.slice(0, 320);
};

export const clipText = (v: string | null | undefined, max: number) =>
  v ? v.slice(0, max) : null;
