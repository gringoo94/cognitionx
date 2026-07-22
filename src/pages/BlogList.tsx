import { useMemo, useEffect } from "react";
import { useBlogPosts } from "@/hooks/useBlogPosts";
import {
  ArrowRight,
  ArrowLeft,
  FileText,
  Search,
  X,
  Sparkles,
} from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import BlogCover from "@/components/BlogCover";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  TOPICS,
  postMatchesTopic,
  topicForPost,
  FEATURED_SLUGS,
  type TopicId,
} from "@/lib/blogTopics";
import type { BlogPost } from "@/data/blogPosts";

const POSTS_PER_PAGE = 9;

type SortKey = "recommended" | "newest" | "oldest";

const isValidSort = (v: string | null): v is SortKey =>
  v === "recommended" || v === "newest" || v === "oldest";

const isValidTopic = (v: string | null): v is TopicId =>
  TOPICS.some((t) => t.id === v);

/**
 * Build editorial recommended ordering: round-robin across topics so first
 * page mixes categories. After the diverse header, appends everything else
 * by date (newest first).
 */
function buildRecommendedOrder(posts: BlogPost[]): BlogPost[] {
  const byDate = [...posts].sort((a, b) => (a.date < b.date ? 1 : -1));
  const buckets = new Map<TopicId | "_", BlogPost[]>();
  for (const p of byDate) {
    const t = topicForPost(p.tags) ?? "_";
    if (!buckets.has(t)) buckets.set(t, []);
    buckets.get(t)!.push(p);
  }
  const order: TopicId[] = [
    "trevoga",
    "depressiya",
    "otnosheniya",
    "emocii",
    "resheniya",
    "kpt",
    "shema",
    "instrumenty",
  ];
  const seen = new Set<string>();
  const result: BlogPost[] = [];
  // 1) Take one fresh post per topic (round 1)
  for (const t of order) {
    const b = buckets.get(t);
    if (b && b.length) {
      const p = b.shift()!;
      result.push(p);
      seen.add(p.id);
    }
  }
  // 2) One extra recent post
  const extras = byDate.filter((p) => !seen.has(p.id));
  if (extras.length) {
    result.push(extras[0]);
    seen.add(extras[0].id);
  }
  // 3) Rest by date
  for (const p of byDate) {
    if (!seen.has(p.id)) {
      result.push(p);
      seen.add(p.id);
    }
  }
  return result;
}

const PostCard = ({ post }: { post: BlogPost }) => (
  <Link
    to={`/blog/${post.slug}`}
    className="group glass rounded-2xl overflow-hidden border border-border hover:border-primary/30 transition-all hover:shadow-lg block h-full"
  >
    <div className="aspect-[16/10] overflow-hidden">
      <BlogCover
        slug={post.slug}
        title={post.title}
        tag={post.tags?.[0]}
        className="group-hover:scale-105 transition-transform duration-500"
      />
    </div>
    <div className="p-5">
      <div className="flex flex-wrap gap-1 mb-2">
        {post.tags.map((tag) => (
          <span
            key={tag}
            className="text-[10px] px-2 py-0.5 rounded-full bg-muted text-muted-foreground"
          >
            {tag}
          </span>
        ))}
      </div>
      <time className="text-xs text-muted-foreground">
        {new Date(post.date).toLocaleDateString("ru", {
          day: "numeric",
          month: "long",
          year: "numeric",
        })}
      </time>
      <h2 className="mt-2 font-semibold text-sm leading-snug line-clamp-2 group-hover:text-primary transition-colors">
        {post.title}
      </h2>
      <p className="mt-2 text-xs text-muted-foreground line-clamp-2">
        {post.description}
      </p>
      <span className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-primary">
        Читать <ArrowRight className="w-3 h-3" />
      </span>
    </div>
  </Link>
);

const CardSkeleton = () => (
  <div className="glass rounded-2xl overflow-hidden border border-border h-full animate-pulse">
    <div className="aspect-[16/10] bg-muted" />
    <div className="p-5 space-y-3">
      <div className="flex gap-1">
        <div className="h-3 w-12 rounded-full bg-muted" />
        <div className="h-3 w-16 rounded-full bg-muted" />
      </div>
      <div className="h-3 w-24 bg-muted rounded" />
      <div className="h-4 w-full bg-muted rounded" />
      <div className="h-4 w-3/4 bg-muted rounded" />
      <div className="h-3 w-full bg-muted rounded" />
      <div className="h-3 w-1/2 bg-muted rounded" />
    </div>
  </div>
);

const BlogList = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { data: blogPosts = [], isLoading } = useBlogPosts();

  const query = searchParams.get("q") ?? "";
  const topicParam = searchParams.get("topic");
  const activeTopic: TopicId | null = isValidTopic(topicParam) ? topicParam : null;
  const activeTag = searchParams.get("tag");
  const sortParam = searchParams.get("sort");
  const sort: SortKey = isValidSort(sortParam) ? sortParam : "recommended";
  const pageParam = parseInt(searchParams.get("page") ?? "1", 10);
  const currentPage = Number.isFinite(pageParam) && pageParam > 0 ? pageParam : 1;

  // URL mutation helpers — reset to page 1 on filter change.
  const updateParams = (
    updater: (p: URLSearchParams) => void,
    { resetPage = true }: { resetPage?: boolean } = {}
  ) => {
    const next = new URLSearchParams(searchParams);
    updater(next);
    if (resetPage) next.delete("page");
    // Strip default values so canonical /blog stays clean.
    if (next.get("sort") === "recommended") next.delete("sort");
    if (next.get("q") === "") next.delete("q");
    if (next.get("tag") === "") next.delete("tag");
    setSearchParams(next, { replace: false });
  };

  const setQuery = (v: string) =>
    updateParams((p) => {
      if (v) p.set("q", v);
      else p.delete("q");
      // Free-text search overrides topic filter to keep results predictable.
      if (v) p.delete("topic");
    });

  const setTopic = (t: TopicId | null) =>
    updateParams((p) => {
      if (t) p.set("topic", t);
      else p.delete("topic");
      p.delete("tag");
    });

  const setTag = (tag: string | null) =>
    updateParams((p) => {
      if (tag) p.set("tag", tag);
      else p.delete("tag");
      p.delete("topic");
    });

  const setSort = (v: SortKey) =>
    updateParams((p) => {
      if (v === "recommended") p.delete("sort");
      else p.set("sort", v);
    });

  const goToPage = (n: number) => {
    const next = new URLSearchParams(searchParams);
    if (n <= 1) next.delete("page");
    else next.set("page", String(n));
    setSearchParams(next, { replace: false });
  };

  // Scroll to catalog top on page changes (but not on first mount).
  useEffect(() => {
    if (currentPage > 1) {
      const el = document.getElementById("blog-catalog-top");
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage]);

  const allTags = useMemo(() => {
    const m = new Map<string, number>();
    blogPosts.forEach((p) =>
      p.tags.forEach((t) => m.set(t, (m.get(t) ?? 0) + 1))
    );
    return Array.from(m.entries()).sort((a, b) => b[1] - a[1]);
  }, [blogPosts]);

  const hasFilters =
    activeTopic !== null || activeTag !== null || query.trim() !== "";
  // Featured block is part of the "recommended, unfiltered" view.
  // We must exclude featured slugs from the grid on ALL pages of this view
  // (not just page 1) so they never appear twice, and so totalPages is stable.
  const isDefaultView = !hasFilters && sort === "recommended";
  // The editorial block itself only renders on page 1.
  const isFeaturedVisible = isDefaultView && currentPage === 1;

  // Editorial recommended block (only on default view).
  const featuredPosts = useMemo(() => {
    if (!isDefaultView) return { hero: null as BlogPost | null, secondary: [] as BlogPost[] };
    const hero = blogPosts.find((p) => p.slug === FEATURED_SLUGS.hero) ?? null;
    const secondary = FEATURED_SLUGS.secondary
      .map((s) => blogPosts.find((p) => p.slug === s))
      .filter((p): p is BlogPost => Boolean(p));
    return { hero, secondary };
  }, [blogPosts, isDefaultView]);

  const featuredSlugSet = useMemo(() => {
    if (!isDefaultView) return new Set<string>();
    const s = new Set<string>();
    if (featuredPosts.hero) s.add(featuredPosts.hero.slug);
    featuredPosts.secondary.forEach((p) => s.add(p.slug));
    return s;
  }, [featuredPosts, isDefaultView]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    let list = blogPosts;
    if (activeTopic) list = list.filter((p) => postMatchesTopic(p.tags, activeTopic));
    if (activeTag) list = list.filter((p) => p.tags.includes(activeTag));
    if (q) {
      list = list.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.tags.some((t) => t.toLowerCase().includes(q))
      );
    }
    // Sort
    if (sort === "newest") {
      list = [...list].sort((a, b) => (a.date < b.date ? 1 : -1));
    } else if (sort === "oldest") {
      list = [...list].sort((a, b) => (a.date > b.date ? 1 : -1));
    } else {
      list = buildRecommendedOrder(list);
    }
    return list;
  }, [activeTopic, activeTag, query, sort, blogPosts]);

  // Exclude featured slugs from main grid only on the default view's first page,
  // so recommended cards don't duplicate. Total post count still reflects all posts.
  const gridSource = useMemo(() => {
    if (!isDefaultView) return filtered;
    return filtered.filter((p) => !featuredSlugSet.has(p.slug));
  }, [filtered, isDefaultView, featuredSlugSet]);

  const totalPages = Math.max(1, Math.ceil(gridSource.length / POSTS_PER_PAGE));
  const safePage = Math.min(currentPage, totalPages);
  const paginated = gridSource.slice(
    (safePage - 1) * POSTS_PER_PAGE,
    safePage * POSTS_PER_PAGE
  );

  const resetAll = () => {
    setSearchParams(new URLSearchParams(), { replace: false });
  };

  // Build page URLs so pagination is real anchors.
  const pageUrl = (n: number) => {
    const next = new URLSearchParams(searchParams);
    if (n <= 1) next.delete("page");
    else next.set("page", String(n));
    const s = next.toString();
    return s ? `/blog?${s}` : "/blog";
  };

  // ItemList отражает статьи, реально отображаемые на текущем экране:
  // на дефолтной первой странице — рекомендуемые (hero + secondary) плюс грид,
  // на остальных — только карточки грида.
  const displayedPosts = useMemo(() => {
    const list: BlogPost[] = [];
    if (isFeaturedVisible) {
      if (featuredPosts.hero) list.push(featuredPosts.hero);
      list.push(...featuredPosts.secondary);
    }
    list.push(...paginated);
    return list;
  }, [isFeaturedVisible, featuredPosts, paginated]);

  const collectionSchema = useMemo(
    () => ({
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      name: "Блог психолога Дмитрия Яцко",
      url: "https://cognitionx.cloud/blog",
      description:
        "Статьи о КПТ, схема-терапии, тревоге, депрессии и выгорании — психообразование на доказательной базе.",
      mainEntity: {
        "@type": "ItemList",
        numberOfItems: displayedPosts.length,
        itemListOrder: "https://schema.org/ItemListOrderAscending",
        itemListElement: displayedPosts.map((post, i) => ({
          "@type": "ListItem",
          position: i + 1,
          url: `https://cognitionx.cloud/blog/${post.slug}`,
          name: post.title,
        })),
      },
    }),
    [displayedPosts]
  );

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SEOHead
        title="Блог психолога — КПТ и схема-терапия"
        description="Статьи о когнитивно-поведенческой терапии, депрессии, тревоге и выгорании. Практические техники и психообразование."
        path="/blog"
        schema={collectionSchema}
        breadcrumbs={[
          { name: "Главная", url: "https://cognitionx.cloud/" },
          { name: "Блог", url: "https://cognitionx.cloud/blog" },
        ]}
      />
      <Navbar />
      <main className="max-w-6xl mx-auto px-6 pt-24 pb-20">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" /> На главную
        </Link>

        {/* Header */}
        <div className="mb-8">
          <Badge variant="outline" className="mb-4 text-xs tracking-wider uppercase">
            Блог
          </Badge>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-3">
            Блог психолога:{" "}
            <span className="text-primary">
              КПТ, схема-терапия, тревога и депрессия
            </span>
          </h1>
          <p className="text-muted-foreground max-w-2xl leading-relaxed">
            Статьи о когнитивно-поведенческой терапии, схема-терапии, депрессии,
            тревожных расстройствах, выгорании и самооценке. Психообразование на
            доказательной базе, разборы техник и практические инструменты для
            самопомощи. Пишет Дмитрий Яцко — практикующий психолог, КПТ и
            схема-терапевт.
          </p>
        </div>

        {/* Search + Sort */}
        <div className="flex flex-col sm:flex-row gap-3 mb-5">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
            <Input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Поиск по статьям, темам и тегам…"
              className="pl-9 pr-9"
              aria-label="Поиск по блогу"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery("")}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-muted-foreground hover:text-foreground"
                aria-label="Очистить поиск"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
          <Select value={sort} onValueChange={(v) => setSort(v as SortKey)}>
            <SelectTrigger className="sm:w-[200px]" aria-label="Сортировка">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="recommended">Рекомендуемые</SelectItem>
              <SelectItem value="newest">Сначала новые</SelectItem>
              <SelectItem value="oldest">Сначала старые</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Topic filters */}
        <div
          role="tablist"
          aria-label="Темы блога"
          className="flex gap-2 mb-4 overflow-x-auto pb-1 scrollbar-none sm:flex-wrap sm:overflow-visible"
        >
          <button
            type="button"
            role="tab"
            aria-pressed={activeTopic === null && !activeTag}
            onClick={() => {
              setTopic(null);
              setTag(null);
            }}
            className={`shrink-0 whitespace-nowrap rounded-full border px-3 py-1.5 text-xs sm:text-sm transition-colors ${
              activeTopic === null && !activeTag
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-background text-foreground border-border hover:border-primary/40"
            }`}
          >
            Все · {blogPosts.length}
          </button>
          {TOPICS.map((t) => {
            const active = activeTopic === t.id;
            return (
              <button
                key={t.id}
                type="button"
                role="tab"
                aria-pressed={active}
                onClick={() => setTopic(active ? null : t.id)}
                className={`shrink-0 whitespace-nowrap rounded-full border px-3 py-1.5 text-xs sm:text-sm transition-colors ${
                  active
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-background text-foreground border-border hover:border-primary/40"
                }`}
              >
                {t.label}
              </button>
            );
          })}

          <Dialog>
            <DialogTrigger asChild>
              <button
                type="button"
                className="shrink-0 whitespace-nowrap rounded-full border border-dashed border-border px-3 py-1.5 text-xs sm:text-sm text-muted-foreground hover:text-foreground hover:border-primary/40 transition-colors"
              >
                Все темы
              </button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Все теги</DialogTitle>
              </DialogHeader>
              <div className="flex flex-wrap gap-2 pt-2">
                {allTags.map(([tag, count]) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => setTag(tag)}
                    className={`rounded-full border px-3 py-1 text-xs transition-colors ${
                      activeTag === tag
                        ? "bg-primary text-primary-foreground border-primary"
                        : "bg-background text-foreground border-border hover:border-primary/40"
                    }`}
                  >
                    {tag} · {count}
                  </button>
                ))}
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Active tag chip (from "Все темы") */}
        {activeTag && (
          <div className="mb-4 flex items-center gap-2 text-xs">
            <span className="text-muted-foreground">Тег:</span>
            <button
              type="button"
              onClick={() => setTag(null)}
              className="inline-flex items-center gap-1 rounded-full bg-primary/10 text-primary px-3 py-1"
            >
              {activeTag} <X className="w-3 h-3" />
            </button>
          </div>
        )}

        {/* Editorial recommended block */}
        {isFeaturedVisible && featuredPosts.hero && (
          <section aria-labelledby="featured-heading" className="mb-10">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="w-4 h-4 text-primary" />
              <h2 id="featured-heading" className="text-lg font-semibold">
                Рекомендуем начать
              </h2>
            </div>
            <div className="grid lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 lg:row-span-2">
                <PostCard post={featuredPosts.hero} />
              </div>
              {featuredPosts.secondary.map((p) => (
                <div key={p.id}>
                  <PostCard post={p} />
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Result count */}
        <div
          id="blog-catalog-top"
          className="flex items-center justify-between mb-6 text-xs text-muted-foreground scroll-mt-24"
        >
          <span>
            Найдено:{" "}
            <span className="text-foreground font-medium">{filtered.length}</span>
            {filtered.length > 0 && ` · страница ${safePage} из ${totalPages}`}
          </span>
          {hasFilters && (
            <button
              onClick={resetAll}
              className="inline-flex items-center gap-1 text-primary hover:underline"
            >
              <X className="w-3 h-3" /> Сбросить фильтры
            </button>
          )}
        </div>

        {/* Posts grid — show skeletons while loading to avoid layout gap */}
        {isLoading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <CardSkeleton key={i} />
            ))}
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {paginated.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        )}

        {/* Empty state */}
        {!isLoading && filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <FileText className="w-12 h-12 text-muted-foreground/40 mb-4" />
            <p className="text-muted-foreground font-medium">
              Ничего не нашлось по вашему запросу
            </p>
            <button
              onClick={resetAll}
              className="mt-3 text-sm text-primary hover:underline"
            >
              Сбросить фильтры
            </button>
          </div>
        )}

        {/* Pagination — real URLs */}
        {totalPages > 1 && (
          <div className="mt-12">
            <Pagination>
              <PaginationContent>
                {safePage > 1 && (
                  <PaginationItem>
                    <PaginationPrevious
                      href={pageUrl(safePage - 1)}
                      onClick={(e) => {
                        e.preventDefault();
                        goToPage(safePage - 1);
                      }}
                    >
                      <ArrowLeft className="h-4 w-4 mr-1" />
                      Назад
                    </PaginationPrevious>
                  </PaginationItem>
                )}
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <PaginationItem key={page}>
                    <PaginationLink
                      href={pageUrl(page)}
                      isActive={page === safePage}
                      onClick={(e) => {
                        e.preventDefault();
                        goToPage(page);
                      }}
                    >
                      {page}
                    </PaginationLink>
                  </PaginationItem>
                ))}
                {safePage < totalPages && (
                  <PaginationItem>
                    <PaginationNext
                      href={pageUrl(safePage + 1)}
                      onClick={(e) => {
                        e.preventDefault();
                        goToPage(safePage + 1);
                      }}
                    >
                      Вперёд
                      <ArrowRight className="h-4 w-4 ml-1" />
                    </PaginationNext>
                  </PaginationItem>
                )}
              </PaginationContent>
            </Pagination>
          </div>
        )}

        {/* Bottom sections */}
        <section className="mt-20 grid md:grid-cols-2 gap-8 text-sm text-muted-foreground leading-relaxed">
          <div>
            <h2 className="text-xl font-bold text-foreground mb-3">О чём этот блог</h2>
            <p>
              Разборы тем тревоги, депрессии, выгорания, самооценки и отношений —
              на доказательной базе КПТ и схема-терапии. Статьи пишет{" "}
              <Link to="/about" className="text-primary underline">
                Дмитрий Яцко
              </Link>{" "}
              — психолог, практикующий КПТ и схема-терапию.
            </p>
            <ul className="mt-4 space-y-2">
              <li>
                →{" "}
                <Link to="/about" className="text-primary underline">
                  Об авторе
                </Link>
              </li>
              <li>
                →{" "}
                <Link to="/cbt-therapy" className="text-primary underline">
                  Как проходит терапия
                </Link>
              </li>
              <li>
                →{" "}
                <Link to="/free-consultation" className="text-primary underline">
                  Записаться
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h2 className="text-xl font-bold text-foreground mb-3">Популярные инструменты</h2>
            <ul className="space-y-2">
              <li>
                →{" "}
                <Link to="/tools/tests" className="text-primary underline">
                  Все психологические тесты
                </Link>
              </li>
              <li>
                →{" "}
                <Link to="/tools/schema-quiz" className="text-primary underline">
                  Тест на схемы Янга
                </Link>
              </li>
              <li>
                →{" "}
                <Link to="/tools/thought-diary" className="text-primary underline">
                  Дневник мыслей (КПТ)
                </Link>
              </li>
              <li>
                →{" "}
                <Link to="/tools/abc-analysis" className="text-primary underline">
                  ABC-анализ
                </Link>
              </li>
              <li>
                →{" "}
                <Link to="/tools/breathing" className="text-primary underline">
                  Дыхательная практика
                </Link>
              </li>
            </ul>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default BlogList;
