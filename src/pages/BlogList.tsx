import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useBlogPosts } from "@/hooks/useBlogPosts";
import { ArrowRight, ArrowLeft, FileText, Loader2, Search, X } from "lucide-react";
import { Link } from "react-router-dom";
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

const POSTS_PER_PAGE = 9;

const fade = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" },
  transition: { duration: 0.5, delay },
});

type SortKey = "new" | "old" | "az";

const BlogList = () => {
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<SortKey>("new");
  const [currentPage, setCurrentPage] = useState(1);
  const { data: blogPosts = [], isLoading } = useBlogPosts();

  const tagCounts = useMemo(() => {
    const m = new Map<string, number>();
    blogPosts.forEach((p) => p.tags.forEach((t) => m.set(t, (m.get(t) ?? 0) + 1)));
    return m;
  }, [blogPosts]);

  const allTags = useMemo(
    () => Array.from(tagCounts.keys()).sort((a, b) => tagCounts.get(b)! - tagCounts.get(a)!),
    [tagCounts]
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    let list = blogPosts;
    if (activeTag) list = list.filter((p) => p.tags.includes(activeTag));
    if (q) {
      list = list.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.tags.some((t) => t.toLowerCase().includes(q))
      );
    }
    const sorted = [...list];
    if (sort === "new") sorted.sort((a, b) => (a.date < b.date ? 1 : -1));
    else if (sort === "old") sorted.sort((a, b) => (a.date > b.date ? 1 : -1));
    else sorted.sort((a, b) => a.title.localeCompare(b.title, "ru"));
    return sorted;
  }, [activeTag, query, sort, blogPosts]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / POSTS_PER_PAGE));
  const safePage = Math.min(currentPage, totalPages);
  const paginated = filtered.slice(
    (safePage - 1) * POSTS_PER_PAGE,
    safePage * POSTS_PER_PAGE
  );

  const handleTagClick = (tag: string | null) => {
    setActiveTag(tag);
    setCurrentPage(1);
  };

  const hasFilters = activeTag !== null || query.trim() !== "";
  const resetFilters = () => {
    setActiveTag(null);
    setQuery("");
    setCurrentPage(1);
  };

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
        itemListElement: paginated.map((post, i) => ({
          "@type": "ListItem",
          position: (safePage - 1) * POSTS_PER_PAGE + i + 1,
          name: post.title,
          url: `https://cognitionx.cloud/blog/${post.slug}`,
        })),
      },
    }),
    [paginated, safePage]
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
        <motion.div {...fade(0)} className="mb-10">
          <Badge variant="outline" className="mb-4 text-xs tracking-wider uppercase">
            Блог
          </Badge>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-3">
            Блог психолога: <span className="text-primary">КПТ, схема-терапия, тревога и депрессия</span>
          </h1>
          <p className="text-muted-foreground max-w-2xl leading-relaxed">
            Статьи о когнитивно-поведенческой терапии, схема-терапии, депрессии, тревожных расстройствах,
            выгорании и самооценке. Психообразование на доказательной базе, разборы техник и практические
            инструменты для самопомощи. Пишет Дмитрий Яцко — практикующий психолог, КПТ и схема-терапевт.
          </p>
        </motion.div>

        {isLoading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-6 h-6 animate-spin text-primary" />
          </div>
        ) : (
          <>
            {/* Search + Sort */}
            <motion.div {...fade(0.05)} className="flex flex-col sm:flex-row gap-3 mb-5">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                <Input
                  type="search"
                  value={query}
                  onChange={(e) => {
                    setQuery(e.target.value);
                    setCurrentPage(1);
                  }}
                  placeholder="Поиск по статьям, темам и тегам…"
                  className="pl-9 pr-9"
                  aria-label="Поиск по блогу"
                />
                {query && (
                  <button
                    type="button"
                    onClick={() => {
                      setQuery("");
                      setCurrentPage(1);
                    }}
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
                  <SelectItem value="new">Сначала новые</SelectItem>
                  <SelectItem value="old">Сначала старые</SelectItem>
                  <SelectItem value="az">По алфавиту</SelectItem>
                </SelectContent>
              </Select>
            </motion.div>

            {/* Tag filter */}
            <motion.div {...fade(0.08)} className="flex flex-wrap gap-2 mb-4">
              <Badge
                variant={activeTag === null ? "default" : "outline"}
                className="cursor-pointer select-none px-3 py-1 text-sm transition-all duration-200 hover:scale-105"
                onClick={() => handleTagClick(null)}
              >
                Все · {blogPosts.length}
              </Badge>
              {allTags.map((tag) => (
                <Badge
                  key={tag}
                  variant={activeTag === tag ? "default" : "outline"}
                  className="cursor-pointer select-none px-3 py-1 text-sm transition-all duration-200 hover:scale-105"
                  onClick={() => handleTagClick(tag)}
                >
                  {tag} · {tagCounts.get(tag)}
                </Badge>
              ))}
            </motion.div>

            {/* Result count */}
            <div className="flex items-center justify-between mb-6 text-xs text-muted-foreground">
              <span>
                Найдено: <span className="text-foreground font-medium">{filtered.length}</span>
                {filtered.length > 0 && ` · страница ${safePage} из ${totalPages}`}
              </span>
              {hasFilters && (
                <button
                  onClick={resetFilters}
                  className="inline-flex items-center gap-1 text-primary hover:underline"
                >
                  <X className="w-3 h-3" /> Сбросить фильтры
                </button>
              )}
            </div>

            {/* Posts grid */}
            <AnimatePresence mode="wait">
              <motion.div
                key={`${activeTag ?? "all"}-${query}-${sort}-${safePage}`}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.25 }}
                className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {paginated.map((post, i) => (
                  <motion.div key={post.id} {...fade(0.04 * (i + 1))}>
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
                            <button
                              key={tag}
                              type="button"
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                handleTagClick(tag);
                                window.scrollTo({ top: 0, behavior: "smooth" });
                              }}
                              className="text-[10px] px-2 py-0.5 rounded-full bg-muted text-muted-foreground transition-colors hover:bg-primary/10 hover:text-primary"
                            >
                              {tag}
                            </button>
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
                  </motion.div>
                ))}
              </motion.div>
            </AnimatePresence>

            {/* Empty state */}
            {filtered.length === 0 && (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <FileText className="w-12 h-12 text-muted-foreground/40 mb-4" />
                <p className="text-muted-foreground font-medium">
                  Ничего не нашлось по вашему запросу
                </p>
                <button
                  onClick={resetFilters}
                  className="mt-3 text-sm text-primary hover:underline"
                >
                  Сбросить фильтры
                </button>
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-12">
                <Pagination>
                  <PaginationContent>
                    {safePage > 1 && (
                      <PaginationItem>
                        <PaginationPrevious
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            setCurrentPage(safePage - 1);
                            window.scrollTo({ top: 0, behavior: "smooth" });
                          }}
                        >
                          <ArrowLeft className="h-4 w-4 mr-1" />
                          Назад
                        </PaginationPrevious>
                      </PaginationItem>
                    )}
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                      (page) => (
                        <PaginationItem key={page}>
                          <PaginationLink
                            href="#"
                            isActive={page === safePage}
                            onClick={(e) => {
                              e.preventDefault();
                              setCurrentPage(page);
                              window.scrollTo({ top: 0, behavior: "smooth" });
                            }}
                          >
                            {page}
                          </PaginationLink>
                        </PaginationItem>
                      )
                    )}
                    {safePage < totalPages && (
                      <PaginationItem>
                        <PaginationNext
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            setCurrentPage(safePage + 1);
                            window.scrollTo({ top: 0, behavior: "smooth" });
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

            {/* SEO long-form content */}
            <section className="mt-20 grid md:grid-cols-2 gap-8 text-sm text-muted-foreground leading-relaxed">
              <div>
                <h2 className="text-xl font-bold text-foreground mb-3">О чём этот блог</h2>
                <p>
                  Здесь я разбираю темы, с которыми чаще всего обращаются клиенты:{" "}
                  <Link to="/depression" className="text-primary underline">
                    депрессия
                  </Link>
                  ,{" "}
                  <Link to="/anxiety" className="text-primary underline">
                    тревожные расстройства
                  </Link>
                  ,{" "}
                  <Link to="/panic-attacks" className="text-primary underline">
                    панические атаки
                  </Link>
                  ,{" "}
                  <Link to="/burnout" className="text-primary underline">
                    выгорание
                  </Link>
                  ,{" "}
                  <Link to="/self-esteem" className="text-primary underline">
                    самооценка
                  </Link>
                  ,{" "}
                  <Link to="/co-dependency" className="text-primary underline">
                    созависимость
                  </Link>
                  . Все статьи опираются на доказательную базу — метаанализы, клинические руководства, проверенные
                  техники КПТ и схема-терапии.
                </p>
              </div>
              <div>
                <h2 className="text-xl font-bold text-foreground mb-3">Популярные темы</h2>
                <ul className="space-y-2">
                  <li>
                    →{" "}
                    <Link to="/blog/postoyannaya-trevoga-bez-prichiny" className="text-primary underline">
                      Постоянная тревога без причины
                    </Link>
                  </li>
                  <li>
                    →{" "}
                    <Link to="/blog/sindrom-samozvantsa" className="text-primary underline">
                      Синдром самозванца
                    </Link>
                  </li>
                  <li>
                    →{" "}
                    <Link to="/blog/planirovanie-dnya-pri-depressii" className="text-primary underline">
                      Поведенческая активация при депрессии
                    </Link>
                  </li>
                  <li>
                    →{" "}
                    <Link to="/blog/perekladyvanie-otvetstvennosti" className="text-primary underline">
                      Перекладывание ответственности
                    </Link>
                  </li>
                  <li>
                    →{" "}
                    <Link to="/tools/schema-quiz" className="text-primary underline">
                      Тест на схемы Янга
                    </Link>
                  </li>
                </ul>
              </div>
            </section>
          </>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default BlogList;
