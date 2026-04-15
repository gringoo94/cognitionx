import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { blogPosts as staticPosts, type BlogPost, type ContentBlock } from "@/data/blogPosts";

function parseDbPost(row: any): BlogPost {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    description: row.description,
    image: row.image,
    date: row.date,
    tags: row.tags || [],
    content: (Array.isArray(row.content) ? row.content : []) as ContentBlock[],
  };
}

export function useBlogPosts() {
  return useQuery({
    queryKey: ["blog-posts"],
    queryFn: async (): Promise<BlogPost[]> => {
      const { data, error } = await supabase
        .from("blog_posts")
        .select("*")
        .eq("published", true)
        .order("date", { ascending: false });

      if (error || !data || data.length === 0) {
        return staticPosts;
      }

      return data.map(parseDbPost);
    },
    staleTime: 1000 * 60 * 5,
  });
}

export function useBlogPost(slug: string | undefined) {
  return useQuery({
    queryKey: ["blog-post", slug],
    queryFn: async (): Promise<BlogPost | null> => {
      if (!slug) return null;

      const { data, error } = await supabase
        .from("blog_posts")
        .select("*")
        .eq("slug", slug)
        .eq("published", true)
        .maybeSingle();

      if (data) {
        return parseDbPost(data);
      }

      // Fallback to static
      return staticPosts.find((p) => p.slug === slug) || null;
    },
    enabled: !!slug,
    staleTime: 1000 * 60 * 5,
  });
}
