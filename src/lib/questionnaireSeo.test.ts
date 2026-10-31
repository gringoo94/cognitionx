import { describe, expect, it } from "vitest";
import { seoRoutes } from "../../seo-routes";
import { tests } from "@/data/tests";

describe("questionnaire crawler metadata source", () => {
  it.each(tests)("uses the current $slug config in static search metadata", (test) => {
    const routes = seoRoutes.filter((route) => route.path === `/tools/tests/${test.slug}`);
    expect(routes).toHaveLength(1);
    expect(routes[0]?.title).toBe(test.seoTitle);
    expect(routes[0]?.description).toBe(test.seoDescription);
  });
});