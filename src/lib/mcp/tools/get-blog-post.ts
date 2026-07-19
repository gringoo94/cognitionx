import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { mcpPosts } from "../posts.generated";

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
    const post = mcpPosts.find((p) => p.slug === slug);
    if (!post) {
      return {
        content: [{ type: "text", text: `No blog post with slug "${slug}".` }],
        isError: true,
      };
    }
    const result = {
      slug: post.slug,
      title: post.title,
      description: post.description,
      date: post.date,
      updatedAt: post.updatedAt,
      tags: post.tags,
      url: `https://cognitionx.cloud/blog/${post.slug}`,
      body: post.body,
    };
    return {
      content: [{ type: "text", text: `# ${post.title}\n\n${post.description}\n\n${post.body}` }],
      structuredContent: result,
    };
  },
});
