import { useParams, Link } from "react-router-dom";
import { useBlogPost, useBlogPosts } from "@/hooks/useBlogPosts";
import { ArrowLeft, ArrowRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BehavioralActivationDiary from "@/components/BehavioralActivationDiary";
import EmotionWheel from "@/components/EmotionWheel";
import SEOHead from "@/components/SEOHead";
import BlogSubscribeForm from "@/components/BlogSubscribeForm";

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();
  const { data: post, isLoading } = useBlogPost(slug);
  const { data: allPosts = [] } = useBlogPosts();

  const relatedPosts = allPosts
    .filter((p) => p.slug !== slug)
    .filter((p) => post?.tags?.some((t) => p.tags.includes(t)))
    .slice(0, 3);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Статья не найдена</h1>
          <Link to="/" className="text-primary hover:underline">
            На главную
          </Link>
        </div>
      </div>
    );
  }

  const wordCount = post.content
    .filter((b: any) => typeof b.text === "string")
    .reduce((sum: number, b: any) => sum + b.text.replace(/<[^>]+>/g, " ").trim().split(/\s+/).length, 0);

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `https://cognitionx.cloud/blog/${post.slug}`,
    },
    headline: post.title,
    description: post.description,
    image: [post.image],
    datePublished: post.date,
    dateModified: post.date,
    inLanguage: "ru-RU",
    wordCount,
    keywords: post.tags?.join(", "),
    author: { "@id": "https://cognitionx.cloud/#person" },
    publisher: { "@id": "https://cognitionx.cloud/#organization" },
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SEOHead
        title={`${post.title} | Психолог Дмитрий Яцко`}
        description={post.description}
        path={`/blog/${post.slug}`}
        ogImage={post.image}
        ogType="article"
        schema={articleSchema}
        breadcrumbs={[
          { name: "Главная", url: "https://cognitionx.cloud/" },
          { name: "Блог", url: "https://cognitionx.cloud/blog" },
          { name: post.title, url: `https://cognitionx.cloud/blog/${post.slug}` },
        ]}
      />
      <Navbar />
      <main className="max-w-3xl mx-auto px-6 pt-24 pb-20">
        <Link
          to="/#blog"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" /> Назад к статьям
        </Link>

        <article>
          <time className="text-xs text-muted-foreground">
            {new Date(post.date).toLocaleDateString("ru", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </time>
          <h1 className="mt-3 text-3xl md:text-4xl font-bold tracking-tight leading-tight">
            {post.title}
          </h1>

          <div className="mt-8 rounded-2xl overflow-hidden">
            <img
              src={post.image}
              alt={`Иллюстрация к статье: ${post.title}`}
              className="w-full h-auto object-cover"
              loading="eager"
              fetchPriority="high"
            />
          </div>

          <div className="mt-8">
            <BlogSubscribeForm variant="inline" source="blog-post-top" />
          </div>

          <div className="mt-10 space-y-6">
            {post.content.map((block, i) => {
              if (block.type === "component" && block.componentId === "behavioral-activation-diary") {
                return <BehavioralActivationDiary key={i} />;
              }
              if (block.type === "component" && block.componentId === "emotion-wheel") {
                return <EmotionWheel key={i} />;
              }
              if (block.type === "preface") {
                return (
                  <p
                    key={i}
                    className="text-lg text-muted-foreground leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: block.text }}
                  />
                );
              }
              if (block.type === "heading") {
                const Tag = block.level === 2 ? "h2" : "h3";
                return (
                  <Tag
                    key={i}
                    className={`font-bold tracking-tight ${
                      block.level === 2 ? "text-2xl mt-10" : "text-xl mt-8"
                    }`}
                    dangerouslySetInnerHTML={{ __html: block.text }}
                  />
                );
              }
              if (block.type === "quote") {
                return (
                  <blockquote
                    key={i}
                    className="border-l-4 border-primary pl-5 py-2 text-muted-foreground italic"
                    dangerouslySetInnerHTML={{ __html: block.text }}
                  />
                );
              }
              return (
                <div
                  key={i}
                  className="text-base leading-relaxed text-foreground/90 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-1 [&_li]:text-foreground/80 [&_strong]:text-foreground [&_a]:text-primary [&_a]:underline"
                  dangerouslySetInnerHTML={{ __html: block.text }}
                />
              );
            })}
          </div>

          <div className="mt-16 p-8 rounded-2xl bg-primary/5 border border-primary/10 text-center">
            <h3 className="text-xl font-bold mb-2">Готовы начать?</h3>
            <p className="text-sm text-muted-foreground mb-5">
              Первая консультация — 25 €
            </p>
            <Button size="lg" asChild>
              <a href="/#booking">Записаться на консультацию</a>
            </Button>
          </div>

          {relatedPosts.length > 0 && (
            <div className="mt-16">
              <h2 className="text-2xl font-bold mb-6">Читайте также</h2>
              <div className="grid sm:grid-cols-3 gap-4">
                {relatedPosts.map((rp) => (
                  <Link
                    key={rp.slug}
                    to={`/blog/${rp.slug}`}
                    className="group rounded-xl overflow-hidden border border-border hover:border-primary/30 transition-all"
                  >
                    <div className="aspect-[16/10] overflow-hidden">
                      <img
                        src={rp.image}
                        alt={`Иллюстрация: ${rp.title}`}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="text-sm font-semibold line-clamp-2 group-hover:text-primary transition-colors">
                        {rp.title}
                      </h3>
                      <span className="mt-2 inline-flex items-center gap-1 text-xs text-primary">
                        Читать <ArrowRight className="w-3 h-3" />
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
              <div className="mt-6 text-center">
                <Link
                  to="/blog"
                  className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
                >
                  Все статьи <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          )}
        </article>
      </main>
      <Footer />
    </div>
  );
};

export default BlogPost;
