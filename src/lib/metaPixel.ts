/**
 * Disabled Meta compatibility API. Healthcare page and conversion context can
 * reveal sensitive information. These exports never load analytics, queue
 * events, write visitor state, or forward parameters to other providers.
 * Existing callers remain safe until they can be removed independently.
 */
export const META_PIXEL_ID = "1596710061557007";
type PixelParams = Record<string, unknown>;

export const makeEventId = (name: string): string => {
  const rand = typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : Math.random().toString(36).slice(2);
  return `${name.toLowerCase()}.${Date.now()}.${rand}`;
};

export const trackPixel = (
  name: string,
  _params: PixelParams = {},
  options?: { custom?: boolean; eventID?: string },
): string => options?.eventID ?? makeEventId(name);

export const trackLead = (_contentName: string, _params: PixelParams = {}): string => makeEventId("Lead");
export const leadRecentlyFired = (_windowMs = 60000): boolean => false;
export const trackContact = (_contentName: string, _params: PixelParams = {}): string => makeEventId("Contact");
export const trackSubscribe = (_contentName: string, _params: PixelParams = {}): string => makeEventId("Subscribe");
export const trackInitiateForm = (_contentName: string, _params: PixelParams = {}): string => makeEventId("InitiateCheckout");
export const trackCustomPixel = (name: string, _params: PixelParams = {}): string => makeEventId(name);
