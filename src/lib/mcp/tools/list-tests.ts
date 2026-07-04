import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { tests } from "../../../data/tests";

export default defineTool({
  name: "list_psychological_tests",
  title: "List psychological tests",
  description:
    "List validated self-report psychological tests available on CognitionX (PHQ-9, GAD-7, BAT, PSS-10, etc.). Returns slug, code, title, cluster, and duration. Filter by cluster (e.g. 'depression', 'anxiety', 'burnout').",
  inputSchema: {
    cluster: z
      .string()
      .optional()
      .describe(
        "Optional cluster filter: depression, anxiety, burnout, stress, self-esteem, it, cbt-tools, trauma, sleep, addiction, relationships, personality, eating.",
      ),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: ({ cluster }) => {
    const items = tests
      .filter((t) => !cluster || t.cluster === cluster)
      .map((t) => ({
        slug: t.slug,
        code: t.code,
        title: t.title,
        cluster: t.cluster,
        clusterLabel: t.clusterLabel,
        durationMin: t.durationMin,
        audience: t.audience,
        url: `https://cognitionx.cloud/tools/tests/${t.slug}`,
      }));

    return {
      content: [{ type: "text", text: JSON.stringify(items, null, 2) }],
      structuredContent: { tests: items, total: items.length },
    };
  },
});
