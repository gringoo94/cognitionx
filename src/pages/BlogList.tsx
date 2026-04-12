import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { blogPosts } from "@/data/blogPosts";
import { ArrowRight, ArrowLeft } from "lucide-react";
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

  const allTags = useMemo(
    () => Array.from(new Set(blogPosts.flatMap((p) => p.tags))).sort(),
    []
  );

  const filtered = useMemo(
    () => (activeTag ? blogPosts.filter((p) => p.tags.includes(activeTag)) : blogPosts),
    [activeTag]
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
        title="Блог психолога | КПТ, тревога, депрессия — Дмитрий Яцко"
        description="Статьи о когнитивно-поведенческой терапии, депрессии, тревоге и выгорании. Практические техники и психообразование."
        path="/blog"
        breadcrumbs={[
          { name: "Главная", url: "https://yatsko-psy.ru/" },
          { name: "Блог", url: "https://yatsko-psy.ru/blog" },
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

        <motion.h1
          {...fade(0)}
          className="text-3xl md:text-4xl font-bold tracking-tight mb-8"
        >
          Все <span className="text-primary">статьи</span>
        </motion.h1>

        {/* Tag filter */}
        <motion.div {...fade(0.05)} className="flex flex-wrap gap-2 mb-10">
          <Badge
            variant={activeTag === null ? "default" : "outline"}
            className="cursor-pointer select-none"
            onClick={() => handleTagClick(null)}
          >
            Все
          </Badge>
          {allTags.map((tag) => (
            <Badge
              key={tag}
              variant={activeTag === tag ? "default" : "outline"}
              className="cursor-pointer select-none"
              onClick={() => handleTagClick(tag)}
            >
              {tag}
            </Badge>
          ))}
        </motion.div>

        {/* Posts grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {paginated.map((post, i) => (
            <motion.div key={post.id} {...fade(0.05 * (i + 1))}>
              <Link
                to={`/blog/${post.slug}`}
                className="group glass rounded-2xl overflow-hidden border border-border hover:border-primary/30 transition-all hover:shadow-lg block"
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
            </motion.div>
          ))}
        </div>

        {filtered.length === 0 && (
          <p className="text-center text-muted-foreground py-12">
            Статей с таким тегом пока нет.
          </p>
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
                    />
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
                    />
                  </PaginationItem>
                )}
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default BlogList;
