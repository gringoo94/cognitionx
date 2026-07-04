import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { blogPosts } from "@/data/blogPosts";

export default defineTool({
  name: "search_blog",
  title: "Search blog",
  description:
    "Full-text search across CognitionX blog posts (title, description, tags, body). Case-insensitive substring match. Returns matching posts with slug, title, and a short snippet.",
  inputSchema: {
    query: z.string().min(1).describe("Search query (Russian or English)."),
    limit: z.number().int().min(1).max(50).optional().describe("Max results (default 10)."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: ({ query, limit }) => {
    const q = query.toLowerCase();
    const results = blogPosts
      .map((p) => {
        const body = p.content.map((b) => b.text).join(" ").replace(/<[^>]+>/g, " ");
        const haystack = `${p.title}\n${p.description}\n${p.tags.join(" ")}\n${body}`.toLowerCase();
        const idx = haystack.indexOf(q);
        if (idx === -1) return null;
        const snippet = haystack.slice(Math.max(0, idx - 80), idx + 200).replace(/\s+/g, " ").trim();
        return {
          slug: p.slug,
          title: p.title,
          description: p.description,
          tags: p.tags,
          url: `https://cognitionx.cloud/blog/${p.slug}`,
          snippet: `…${snippet}…`,
        };
      })
      .filter((x): x is NonNullable<typeof x> => x !== null)
      .slice(0, limit ?? 10);

    return {
      content: [{ type: "text", text: JSON.stringify(results, null, 2) }],
      structuredContent: { results, total: results.length },
    };
  },
});
