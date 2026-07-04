import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { blogPosts } from "../../../data/blogPosts";

export default defineTool({
  name: "list_blog_posts",
  title: "List blog posts",
  description:
    "List published blog posts on CognitionX (Russian-language CBT/schema-therapy blog by psychologist Dmitry Yatsko). Returns slug, title, description, date, and tags for each post. Filter by tag optionally.",
  inputSchema: {
    tag: z
      .string()
      .optional()
      .describe("Optional tag filter (case-insensitive substring match)."),
    limit: z
      .number()
      .int()
      .min(1)
      .max(200)
      .optional()
      .describe("Max number of posts to return (default 50)."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: ({ tag, limit }) => {
    const t = tag?.toLowerCase();
    const filtered = blogPosts
      .filter((p) => !t || p.tags.some((x) => x.toLowerCase().includes(t)))
      .sort((a, b) => (b.date || "").localeCompare(a.date || ""))
      .slice(0, limit ?? 50)
      .map((p) => ({
        slug: p.slug,
        title: p.title,
        description: p.description,
        date: p.date,
        updatedAt: p.updatedAt,
        tags: p.tags,
        url: `https://cognitionx.cloud/blog/${p.slug}`,
      }));

    return {
      content: [{ type: "text", text: JSON.stringify(filtered, null, 2) }],
      structuredContent: { posts: filtered, total: filtered.length },
    };
  },
});
