import { useParams, Link } from "react-router-dom";
import { blogPosts } from "@/data/blogPosts";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BehavioralActivationDiary from "@/components/BehavioralActivationDiary";
import SEOHead from "@/components/SEOHead";

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();
  const post = blogPosts.find((p) => p.slug === slug);

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

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.description,
    image: post.image,
    datePublished: post.date,
    author: {
      "@type": "Person",
      name: "Дмитрий Яцко",
      url: "https://cognitionx.cloud",
    },
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SEOHead
        title={`${post.title} | Психолог Дмитрий Яцко`}
        description={post.description}
        path={`/blog/${post.slug}`}
        ogImage={post.image}
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
              loading="lazy"
            />
          </div>

          <div className="mt-10 space-y-6">
            {post.content.map((block, i) => {
              if (block.type === "component" && block.componentId === "behavioral-activation-diary") {
                return <BehavioralActivationDiary key={i} />;
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
        </article>
      </main>
      <Footer />
    </div>
  );
};

export default BlogPost;
