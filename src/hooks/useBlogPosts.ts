import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { BlogPost, ContentBlock } from "@/data/blogPosts";

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

// Lazy-load the heavy static blog data only when DB returns nothing
async function getStaticPosts(): Promise<BlogPost[]> {
  const mod = await import("@/data/blogPosts");
  return mod.blogPosts;
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
        return await getStaticPosts();
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

      const { data } = await supabase
        .from("blog_posts")
        .select("*")
        .eq("slug", slug)
        .eq("published", true)
        .maybeSingle();

      if (data) {
        return parseDbPost(data);
      }

      // Fallback to static
      const staticPosts = await getStaticPosts();
      return staticPosts.find((p) => p.slug === slug) || null;
    },
    enabled: !!slug,
    staleTime: 1000 * 60 * 5,
  });
}
