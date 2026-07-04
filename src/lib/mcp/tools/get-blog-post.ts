import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { blogPosts } from "@/data/blogPosts";

function stripHtml(html: string): string {
  return html
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/p>/gi, "\n\n")
    .replace(/<\/li>/gi, "\n")
    .replace(/<li[^>]*>/gi, "- ")
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

export default defineTool({
  name: "get_blog_post",
  title: "Get blog post",
  description:
    "Fetch the full plain-text body of a CognitionX blog post by its slug. Returns title, description, tags, dates, and markdown-like body.",
  inputSchema: {
    slug: z.string().min(1).describe("Blog post slug, e.g. 'kpt-pri-depressii'."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: ({ slug }) => {
    const post = blogPosts.find((p) => p.slug === slug);
    if (!post) {
      return {
        content: [{ type: "text", text: `No blog post with slug "${slug}".` }],
        isError: true,
      };
    }

    const body = post.content
      .map((b) => {
        if (b.type === "heading") {
          const hashes = "#".repeat((b.level || 2) + 1);
          return `${hashes} ${stripHtml(b.text)}`;
        }
        if (b.type === "quote") return `> ${stripHtml(b.text)}`;
        if (b.type === "component") return `_[interactive component: ${b.componentId}]_`;
        return stripHtml(b.text);
      })
      .filter(Boolean)
      .join("\n\n");

    const result = {
      slug: post.slug,
      title: post.title,
      description: post.description,
      date: post.date,
      updatedAt: post.updatedAt,
      tags: post.tags,
      url: `https://cognitionx.cloud/blog/${post.slug}`,
      body,
    };

    return {
      content: [{ type: "text", text: `# ${post.title}\n\n${post.description}\n\n${body}` }],
      structuredContent: result,
    };
  },
});
