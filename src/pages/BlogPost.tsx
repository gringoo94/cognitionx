import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { useBlogPost, useBlogPosts } from "@/hooks/useBlogPosts";
import { ArrowLeft, ArrowRight, Loader2, Clock, Sparkles, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BehavioralActivationDiary from "@/components/BehavioralActivationDiary";
import EmotionWheel from "@/components/EmotionWheel";
import SEOHead from "@/components/SEOHead";
import BlogSubscribeForm from "@/components/BlogSubscribeForm";
import BlogCover from "@/components/BlogCover";
import BlogCtaBridge from "@/components/BlogCtaBridge";
import RfcbtModesDiagram from "@/components/RfcbtModesDiagram";
import DecisionMatrixCta from "@/components/DecisionMatrixCta";
import { sanitizeHtml as sanitize } from "@/lib/sanitizeHtml";
import MarkdownBlock from "@/components/MarkdownBlock";
import BlogWorkbookCta from "@/components/BlogWorkbookCta";
import { extractBlogFaq, shouldShowWorkbook, relatedFromClusters } from "@/lib/blogSeo";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();
  const { data: post, isLoading } = useBlogPost(slug);
  const { data: allPosts = [] } = useBlogPosts();
  const [readProgress, setReadProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const h = document.documentElement;
      const scrolled = h.scrollTop;
      const height = h.scrollHeight - h.clientHeight;
      setReadProgress(height > 0 ? Math.min(100, (scrolled / height) * 100) : 0);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [slug]);


  // Per-slug related-post overrides. When present, replaces the tag-based auto pick.
  const RELATED_OVERRIDES: Record<string, string[]> = {
    "shema-terapiya-polnyj-gajd": [
      "8-prepyatstvij-na-puti-k-peremenam",
      "emocionalnaya-vera",
      "izbeganie-pobeg-ot-lovushki",
    ],
  };
  const clusterSlugs = slug ? relatedFromClusters(slug) : [];
  const overrideSlugs = slug ? RELATED_OVERRIDES[slug] ?? (clusterSlugs.length ? clusterSlugs : undefined) : undefined;
  const relatedPosts = overrideSlugs
    ? overrideSlugs
        .map((s) => allPosts.find((p) => p.slug === s))
        .filter((p): p is NonNullable<typeof p> => Boolean(p))
    : allPosts
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

  const canonicalUrl = `https://cognitionx.cloud/blog/${post.slug}`;
  const absImage = post.image?.startsWith("http")
    ? post.image
    : `https://cognitionx.cloud${post.image?.startsWith("/") ? "" : "/"}${post.image || "og-default.webp"}`;
  const primarySection = post.tags?.[0];

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "@id": `${canonicalUrl}#article`,
    url: canonicalUrl,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": canonicalUrl,
    },
    isPartOf: { "@id": "https://cognitionx.cloud/#website" },
    headline: post.title,
    description: post.description,
    image: {
      "@type": "ImageObject",
      url: absImage,
      width: 1200,
      height: 630,
    },
    datePublished: post.date,
    dateModified: (post as any).updatedAt || post.date,
    inLanguage: "ru-RU",
    wordCount,
    ...(primarySection ? { articleSection: primarySection } : {}),
    keywords: post.tags?.join(", "),
    author: { "@id": "https://cognitionx.cloud/#person" },
    publisher: { "@id": "https://cognitionx.cloud/#organization" },
    // Speakable: which parts AI voice agents / Google Assistant should read aloud.
    // h1 + first paragraph of the article body are the most informative.
    speakable: {
      "@type": "SpeakableSpecification",
      cssSelector: ["h1", "[data-speakable]"],
    },
    about: post.tags?.map((t) => ({ "@type": "Thing", name: t })),
  };

  const postFaq = extractBlogFaq(post);
  const faqSchema = postFaq.length >= 2
    ? {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: postFaq.map((q) => ({
          "@type": "Question",
          name: q.question,
          acceptedAnswer: { "@type": "Answer", text: q.answer },
        })),
      }
    : null;

  const allSchema = faqSchema ? [articleSchema, faqSchema] : articleSchema;

  const readingMin = Math.max(1, Math.round(wordCount / 180));
  const primaryTag = post.tags?.[0];
  const updatedAt = (post as any).updatedAt as string | undefined;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SEOHead
        title={`${post.title} | Психолог Дмитрий Яцко`}
        description={post.description}
        path={`/blog/${post.slug}`}
        ogImage={post.image}
        ogType="article"
        schema={allSchema}
        breadcrumbs={[
          { name: "Главная", url: "https://cognitionx.cloud/" },
          { name: "Блог", url: "https://cognitionx.cloud/blog" },
          ...(primarySection
            ? [{
                name: primarySection,
                url: `https://cognitionx.cloud/blog?tag=${encodeURIComponent(primarySection)}`,
              }]
            : []),
          { name: post.title, url: `https://cognitionx.cloud/blog/${post.slug}` },
        ]}
      />
      <Navbar />

      {/* Reading progress bar */}
      <div className="fixed top-0 left-0 right-0 h-0.5 z-40 bg-transparent pointer-events-none">
        <div
          className="h-full bg-gradient-to-r from-primary via-primary to-accent transition-[width] duration-150"
          style={{ width: `${readProgress}%` }}
        />
      </div>

      <main className="max-w-3xl mx-auto px-6 pt-24 pb-20">
        <Link
          to="/#blog"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" /> Назад к статьям
        </Link>

        <article>
          {/* Meta chips */}
          <div className="flex flex-wrap items-center gap-2 text-xs">
            {primaryTag && (
              <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-primary/10 text-primary font-medium">
                {primaryTag}
              </span>
            )}
            <span className="text-muted-foreground">
              {new Date(post.date).toLocaleDateString("ru", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </span>
            <span className="text-muted-foreground/50">·</span>
            <span className="inline-flex items-center gap-1 text-muted-foreground">
              <Clock className="w-3 h-3" /> {readingMin} мин чтения
            </span>
            {updatedAt && updatedAt !== post.date && (
              <>
                <span className="text-muted-foreground/50">·</span>
                <span className="text-muted-foreground">
                  обновлено{" "}
                  {new Date(updatedAt).toLocaleDateString("ru", {
                    day: "numeric",
                    month: "short",
                  })}
                </span>
              </>
            )}
            <span className="text-muted-foreground/50">·</span>
            <span className="text-muted-foreground">
              Автор:{" "}
              <Link to="/about" className="underline hover:text-primary">
                Дмитрий Яцко, психолог
              </Link>
            </span>
          </div>


          <h1 className="mt-4 text-3xl md:text-5xl font-bold tracking-tight leading-[1.1]">
            {post.title}
          </h1>

          {/* TL;DR block — surfaces a concise summary for LLMs/AI Overviews/voice agents */}
          <aside
            data-speakable
            aria-label="Кратко"
            className="mt-8 relative rounded-2xl border border-primary/25 bg-gradient-to-br from-primary/[0.07] via-primary/[0.04] to-transparent p-5 md:p-6 shadow-[0_1px_0_0_hsl(var(--primary)/0.08)]"
          >
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-3.5 h-3.5 text-primary" />
              <div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-primary">
                Кратко
              </div>
            </div>
            <p className="text-[15px] md:text-base text-foreground/90 leading-relaxed m-0">
              {post.description}
            </p>
          </aside>

          <div className="mt-8 rounded-2xl overflow-hidden aspect-[16/9] ring-1 ring-border/60 shadow-sm">
            <BlogCover
              slug={post.slug}
              title={post.title}
              tag={primaryTag}
              large
            />
          </div>

          <div className="mt-8">
            <BlogSubscribeForm variant="inline" source="blog-post-top" />
          </div>

          <div className="mt-12 space-y-6">
            {post.content.map((block, i) => {
              if (block.type === "markdown") {
                return <MarkdownBlock key={i} markdown={block.text} topic={post.title} />;
              }
              if (block.type === "component" && block.componentId === "behavioral-activation-diary") {
                return <BehavioralActivationDiary key={i} />;
              }
              if (block.type === "component" && block.componentId === "emotion-wheel") {
                return <EmotionWheel key={i} />;
              }
              if (block.type === "component" && block.componentId === "rfcbt-modes") {
                return <RfcbtModesDiagram key={i} />;
              }
              if (block.type === "component" && block.componentId === "decision-matrix-cta") {
                return <DecisionMatrixCta key={i} topic={post.title} />;
              }
              if (block.type === "preface") {
                return (
                  <p
                    key={i}
                    data-speakable
                    className="text-lg md:text-xl text-foreground/80 leading-relaxed font-light first-letter:text-5xl first-letter:font-serif first-letter:font-semibold first-letter:mr-2 first-letter:float-left first-letter:leading-[0.95] first-letter:text-primary"
                    dangerouslySetInnerHTML={{ __html: sanitize(block.text) }}
                  />
                );
              }
              if (block.type === "heading") {
                if (block.level === 2) {
                  return (
                    <h2
                      key={i}
                      className="relative font-bold tracking-tight text-2xl md:text-[28px] leading-tight mt-14 pt-2 pl-4 border-l-[3px] border-primary/70 scroll-mt-24"
                      dangerouslySetInnerHTML={{ __html: sanitize(block.text) }}
                    />
                  );
                }
                return (
                  <h3
                    key={i}
                    className="font-semibold tracking-tight text-xl md:text-[22px] mt-8 text-foreground/95 scroll-mt-24"
                    dangerouslySetInnerHTML={{ __html: sanitize(block.text) }}
                  />
                );
              }
              if (block.type === "quote") {
                return (
                  <blockquote
                    key={i}
                    className="relative rounded-2xl bg-muted/40 border-l-4 border-primary pl-6 pr-5 py-4 text-foreground/85 italic text-lg leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: sanitize(block.text) }}
                  />
                );
              }
              if (block.type === "example") {
                return (
                  <div
                    key={i}
                    className="rounded-2xl border border-accent/25 bg-accent/5 p-5 md:p-6 text-base leading-relaxed text-foreground/90 [&_strong]:text-foreground [&_p]:mb-2 last:[&_p]:mb-0"
                    dangerouslySetInnerHTML={{ __html: sanitize(block.text) }}
                  />
                );
              }
              if (block.type === "table") {
                const headers = block.headers ?? [];
                const rows = block.rows ?? [];
                if (!rows.length && !headers.length) return null;
                return (
                  <div key={i} className="my-2 overflow-x-auto rounded-xl border border-border bg-card/40">
                    <table className="w-full text-sm">
                      {headers.length > 0 && (
                        <thead className="bg-muted/70">
                          <tr className="border-b border-border">
                            {headers.map((h, k) => (
                              <th
                                key={k}
                                className="p-3.5 text-left font-semibold text-foreground align-bottom"
                                dangerouslySetInnerHTML={{ __html: sanitize(h) }}
                              />
                            ))}
                          </tr>
                        </thead>
                      )}
                      <tbody>
                        {rows.map((row, r) => (
                          <tr
                            key={r}
                            className="border-b border-border/50 last:border-b-0 hover:bg-muted/30 transition-colors"
                          >
                            {row.map((cell, c) => (
                              <td
                                key={c}
                                className="p-3.5 align-top text-foreground/85"
                                dangerouslySetInnerHTML={{ __html: sanitize(cell) }}
                              />
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                );
              }
              if (block.type === "faq" && block.headers?.[0]) {
                return (
                  <Accordion key={i} type="single" collapsible className="rounded-2xl border border-border bg-card/50 overflow-hidden">
                    <AccordionItem value="q" className="border-none">
                      <AccordionTrigger className="px-5 py-4 text-left font-medium hover:no-underline hover:bg-muted/40 transition-colors">
                        {block.headers[0]}
                      </AccordionTrigger>
                      <AccordionContent className="px-5 pb-4 text-foreground/85 leading-relaxed [&_a]:text-primary [&_a]:underline">
                        <div dangerouslySetInnerHTML={{ __html: sanitize(block.text) }} />
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                );
              }
              if (block.type === "faq") {
                let items: Array<{ q: string; a: string }> = [];
                try {
                  items = JSON.parse(block.text);
                } catch {
                  items = [];
                }
                if (!items.length) return null;
                return (
                  <div key={i} className="mt-4">
                    <div className="flex items-center gap-2 mb-3 text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                      <HelpCircle className="w-3.5 h-3.5" />
                      Частые вопросы
                    </div>
                    <Accordion
                      type="single"
                      collapsible
                      className="rounded-2xl border border-border bg-card/50 divide-y divide-border overflow-hidden"
                    >
                      {items.map((it, j) => (
                        <AccordionItem key={j} value={`item-${j}`} className="border-none">
                          <AccordionTrigger className="px-5 py-4 text-left font-medium hover:no-underline hover:bg-muted/40 transition-colors">
                            {it.q}
                          </AccordionTrigger>
                          <AccordionContent className="px-5 pb-4 text-foreground/85 leading-relaxed [&_a]:text-primary [&_a]:underline">
                            <div dangerouslySetInnerHTML={{ __html: sanitize(it.a) }} />
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  </div>
                );
              }
              return (
                <div
                  key={i}
                  className="text-[17px] leading-[1.75] text-foreground/85 [&_ul]:list-none [&_ul]:pl-0 [&_ul]:space-y-2 [&_ul>li]:relative [&_ul>li]:pl-6 [&_ul>li]:before:content-[''] [&_ul>li]:before:absolute [&_ul>li]:before:left-1 [&_ul>li]:before:top-[0.7em] [&_ul>li]:before:w-1.5 [&_ul>li]:before:h-1.5 [&_ul>li]:before:rounded-full [&_ul>li]:before:bg-primary/60 [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:space-y-2 [&_ol]:marker:text-primary/70 [&_ol]:marker:font-semibold [&_li]:text-foreground/85 [&_strong]:text-foreground [&_strong]:font-semibold [&_a]:text-primary [&_a]:underline [&_a]:underline-offset-2 [&_a]:decoration-primary/40 hover:[&_a]:decoration-primary [&_em]:text-foreground/90 [&_table]:block [&_table]:w-full [&_table]:my-5 [&_table]:overflow-x-auto [&_table]:rounded-xl [&_table]:border [&_table]:border-border [&_table]:text-sm [&_table]:bg-card/40 [&_thead]:bg-muted/70 [&_thead_tr]:border-b [&_thead_tr]:border-border [&_th]:p-3.5 [&_th]:text-left [&_th]:font-semibold [&_th]:text-foreground [&_th]:whitespace-nowrap [&_td]:p-3.5 [&_td]:align-top [&_td]:border-b [&_td]:border-border/50 [&_tbody_tr:last-child_td]:border-b-0 [&_tbody_tr:hover]:bg-muted/30 [&_tbody_tr]:transition-colors"
                  dangerouslySetInnerHTML={{ __html: sanitize(block.text) }}
                />
              );
            })}
          </div>

          <div className="mt-16">
            <BlogSubscribeForm source="blog-post-bottom" />
          </div>



          {shouldShowWorkbook(post) && <BlogWorkbookCta />}

          <BlogCtaBridge topic={post.title} />

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
                      <BlogCover
                        slug={rp.slug}
                        title={rp.title}
                        tag={rp.tags?.[0]}
                        className="group-hover:scale-105 transition-transform duration-500"
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
