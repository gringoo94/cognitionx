import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useBlogPosts } from "@/hooks/useBlogPosts";
import { ArrowRight, ArrowLeft, FileText, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import { Badge } from "@/components/ui/badge";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

const POSTS_PER_PAGE = 6;

const fade = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" },
  transition: { duration: 0.5, delay },
});

const BlogList = () => {
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const { data: blogPosts = [], isLoading } = useBlogPosts();

  const allTags = useMemo(
    () => Array.from(new Set(blogPosts.flatMap((p) => p.tags))).sort(),
    [blogPosts]
  );

  const filtered = useMemo(
    () => (activeTag ? blogPosts.filter((p) => p.tags.includes(activeTag)) : blogPosts),
    [activeTag, blogPosts]
  );

  const totalPages = Math.ceil(filtered.length / POSTS_PER_PAGE);
  const paginated = filtered.slice(
    (currentPage - 1) * POSTS_PER_PAGE,
    currentPage * POSTS_PER_PAGE
  );

  const handleTagClick = (tag: string | null) => {
    setActiveTag(tag);
    setCurrentPage(1);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SEOHead
        title="Блог психолога | КПТ, схема-терапия, тревога, депрессия — Дмитрий Яцко"
        description="Статьи о когнитивно-поведенческой терапии, депрессии, тревоге и выгорании. Практические техники и психообразование."
        path="/blog"
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
            Все <span className="text-primary">статьи</span>
          </h1>
          <p className="text-muted-foreground max-w-xl">
            Психообразование, разборы техник КПТ и практические инструменты для работы с тревогой, депрессией и выгоранием.
          </p>
        </motion.div>

        {isLoading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-6 h-6 animate-spin text-primary" />
          </div>
        ) : (
          <>
            {/* Tag filter */}
            <motion.div {...fade(0.05)} className="flex flex-wrap gap-2 mb-10">
              <Badge
                variant={activeTag === null ? "default" : "outline"}
                className="cursor-pointer select-none px-3 py-1 text-sm transition-all duration-200 hover:scale-105"
                onClick={() => handleTagClick(null)}
              >
                Все
              </Badge>
              {allTags.map((tag) => (
                <Badge
                  key={tag}
                  variant={activeTag === tag ? "default" : "outline"}
                  className="cursor-pointer select-none px-3 py-1 text-sm transition-all duration-200 hover:scale-105"
                  onClick={() => handleTagClick(tag)}
                >
                  {tag}
                </Badge>
              ))}
            </motion.div>

            {/* Posts grid */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTag ?? "all"}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.25 }}
                className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {paginated.map((post, i) => (
                  <motion.div key={post.id} {...fade(0.05 * (i + 1))}>
                    <Link
                      to={`/blog/${post.slug}`}
                      className="group glass rounded-2xl overflow-hidden border border-border hover:border-primary/30 transition-all hover:shadow-lg block h-full"
                    >
                      <div className="aspect-[16/10] overflow-hidden">
                        <img
                          src={post.image}
                          alt={`Иллюстрация: ${post.title}`}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          loading="lazy"
                        />
                      </div>
                      <div className="p-5">
                        <div className="flex flex-wrap gap-1 mb-2">
                          {post.tags.map((tag) => (
                            <span
                              key={tag}
                              className="text-[10px] px-2 py-0.5 rounded-full bg-muted text-muted-foreground transition-colors group-hover:bg-primary/10 group-hover:text-primary"
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
                  </motion.div>
                ))}
              </motion.div>
            </AnimatePresence>

            {/* Empty state */}
            {filtered.length === 0 && (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <FileText className="w-12 h-12 text-muted-foreground/40 mb-4" />
                <p className="text-muted-foreground font-medium">Статей с таким тегом пока нет</p>
                <button
                  onClick={() => handleTagClick(null)}
                  className="mt-3 text-sm text-primary hover:underline"
                >
                  Показать все статьи
                </button>
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-12">
                <Pagination>
                  <PaginationContent>
                    {currentPage > 1 && (
                      <PaginationItem>
                        <PaginationPrevious
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            setCurrentPage((p) => p - 1);
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
                            isActive={page === currentPage}
                            onClick={(e) => {
                              e.preventDefault();
                              setCurrentPage(page);
                            }}
                          >
                            {page}
                          </PaginationLink>
                        </PaginationItem>
                      )
                    )}
                    {currentPage < totalPages && (
                      <PaginationItem>
                        <PaginationNext
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            setCurrentPage((p) => p + 1);
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
          </>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default BlogList;
