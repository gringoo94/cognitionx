import { afterEach, describe, expect, it, vi } from "vitest";
import { leadRecentlyFired, trackContact, trackCustomPixel, trackInitiateForm, trackLead, trackPixel, trackSubscribe } from "./metaPixel";

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
  sessionStorage.clear();
});

describe("disabled Meta reporting", () => {
  it("does not send consultation or wellbeing information, including through other providers", () => {
    const fbq = vi.fn();
    const loadAnalytics = vi.fn();
    const push = vi.fn();
    const ym = vi.fn();
    vi.stubGlobal("fbq", fbq);
    vi.stubGlobal("loadAnalytics", loadAnalytics);
    vi.stubGlobal("dataLayer", { push });
    vi.stubGlobal("ym", ym);
    trackLead("booking_form", { wellbeing: 2, content_category: "paid_session" });
    trackContact("consultation");
    trackInitiateForm("booking_form");
    expect(fbq).not.toHaveBeenCalled();
    expect(loadAnalytics).not.toHaveBeenCalled();
    expect(push).not.toHaveBeenCalled();
    expect(ym).not.toHaveBeenCalled();
    expect(sessionStorage.getItem("cx_lead_fired_at")).toBeNull();
    expect(leadRecentlyFired()).toBe(false);
  });

  it("does not send test events or queue events for later delivery", async () => {
    const fbq = vi.fn();
    const push = vi.fn();
    const timer = vi.spyOn(globalThis, "setInterval");
    vi.stubGlobal("fbq", fbq);
    vi.stubGlobal("dataLayer", { push });
    trackCustomPixel("test_completed", { score: 21, test: "depression" });
    trackPixel("Lead", { score: 21 });
    trackSubscribe("test_results");
    await Promise.resolve();
    expect(fbq).not.toHaveBeenCalled();
    expect(push).not.toHaveBeenCalled();
    expect(timer).not.toHaveBeenCalled();
  });
});