import { defineMcp } from "@lovable.dev/mcp-js";
import listBlogPosts from "./tools/list-blog-posts";
import getBlogPost from "./tools/get-blog-post";
import listTests from "./tools/list-tests";
import searchBlog from "./tools/search-blog";

export default defineMcp({
  name: "cognitionx-mcp",
  title: "CognitionX MCP",
  version: "0.1.0",
  instructions:
    "Read-only tools for CognitionX (Russian CBT and schema-therapy resource by psychologist Dmitry Yatsko). Use `list_blog_posts` and `search_blog` to discover articles, `get_blog_post` to read the full body, and `list_psychological_tests` to enumerate validated self-report tests (PHQ-9, GAD-7, BAT, etc.). All content is public.",
  tools: [listBlogPosts, getBlogPost, listTests, searchBlog],
});
