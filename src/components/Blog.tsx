import { motion } from "framer-motion";
import { useBlogPosts } from "@/hooks/useBlogPosts";
import { useRef } from "react";
import { ArrowRight, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import BlogCover from "@/components/BlogCover";

const fade = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" },
  transition: { duration: 0.5, delay },
});

const PILLAR_GUIDES: { slug: string; title: string; description: string; badge: string }[] = [
  {
    slug: "kpt-polnyj-gajd",
    title: "КПТ: полный гайд 2026",
    description: "Модель ABC, искажения, техники и доказательная база — всё в одном месте.",
    badge: "Pillar",
  },
  {
    slug: "kak-vybrat-psihologa",
    title: "Как выбрать психолога",
    description: "12 пунктов чек-листа: образование, цены, красные флаги и первая сессия.",
    badge: "Гайд",
  },
  {
    slug: "kognitivnyj-barjer-vera-v-istinnost",
    title: "Когда веришь в свою ловушку",
    description: "Что делать, если схема ощущается правдой — пошаговая работа с убеждениями.",
    badge: "Схема-терапия",
  },
];

const Blog = () => {
  const { data: blogPosts = [], isLoading } = useBlogPosts();
  const posts = blogPosts.slice(0, 8);
  const trackRef = useRef<HTMLDivElement>(null);
  const scroll = (dir: number) => {
    const el = trackRef.current;
    if (el) el.scrollBy({ left: dir * el.clientWidth * 0.8, behavior: "smooth" });
  };

  return (
    <section id="blog" className="py-14 md:py-20 px-6">
      <div className="max-w-6xl mx-auto">
        <motion.div {...fade(0)} className="text-center mb-8">
          <span className="inline-block px-4 py-1.5 rounded-full border border-primary/20 bg-primary/5 text-xs font-medium text-primary mb-4">
            Блог и гайды
          </span>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
            Полезные <span className="text-primary">статьи</span>
          </h2>
          <p className="mt-4 text-muted-foreground max-w-xl mx-auto">
            Разбираю темы тревоги, депрессии, выгорания и самопомощи — доступно и с опорой на науку.
          </p>
        </motion.div>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="w-6 h-6 animate-spin text-primary" />
          </div>
        ) : (
          <div className="relative">
            <div className="hidden md:flex absolute -top-14 right-0 gap-2">
              <button type="button" aria-label="Предыдущие статьи" onClick={() => scroll(-1)} className="w-9 h-9 rounded-full border border-border bg-card flex items-center justify-center hover:border-primary/40 hover:text-primary transition-colors">
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button type="button" aria-label="Следующие статьи" onClick={() => scroll(1)} className="w-9 h-9 rounded-full border border-border bg-card flex items-center justify-center hover:border-primary/40 hover:text-primary transition-colors">
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
            <div ref={trackRef} className="flex gap-4 overflow-x-auto snap-x snap-mandatory pb-3 -mx-6 px-6 md:mx-0 md:px-0 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {posts.map((post) => (
                <Link
                  key={post.id}
                  to={`/blog/${post.slug}`}
                  className="group snap-start shrink-0 w-[78%] sm:w-[45%] lg:w-[31%] glass rounded-2xl overflow-hidden border border-border hover:border-primary/30 transition-all hover:shadow-lg block"
                >
                  <div className="aspect-[16/10] overflow-hidden">
                    <BlogCover slug={post.slug} title={post.title} tag={post.tags?.[0]} className="group-hover:scale-105 transition-transform duration-500" />
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-sm leading-snug line-clamp-2 group-hover:text-primary transition-colors">{post.title}</h3>
                    <p className="mt-1.5 text-xs text-muted-foreground line-clamp-2">{post.description}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        <motion.div {...fade(0.05)} className="mt-6 flex flex-wrap items-center justify-center gap-2">
          <span className="text-sm text-muted-foreground mr-1">Гайды:</span>
          {PILLAR_GUIDES.map((g) => (
            <Link key={g.slug} to={`/blog/${g.slug}`} title={g.description} className="inline-flex items-center rounded-full border border-primary/20 bg-primary/5 px-3 py-1.5 text-sm font-medium hover:border-primary/40 hover:text-primary transition-colors">
              {g.title}
            </Link>
          ))}
        </motion.div>

        {blogPosts.length > 0 && (
          <motion.div {...fade(0.3)} className="mt-6 text-center">
            <Link
              to="/blog"
              className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
            >
              Все статьи <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default Blog;
