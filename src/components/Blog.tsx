import { motion } from "framer-motion";
import { useBlogPosts } from "@/hooks/useBlogPosts";
import { ArrowRight, Loader2 } from "lucide-react";
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
  const posts = blogPosts.slice(0, 6);

  return (
    <section id="blog" className="py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <motion.div {...fade(0)} className="text-center mb-12">
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

        {/* Featured pillar guides — самые большие материалы, прокладывают внутренние ссылки */}
        <motion.div {...fade(0.05)} className="mb-14 grid sm:grid-cols-3 gap-4">
          {PILLAR_GUIDES.map((g) => (
            <Link
              key={g.slug}
              to={`/blog/${g.slug}`}
              className="group relative rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/5 to-accent/5 p-5 hover:border-primary/40 hover:shadow-lg transition-all"
            >
              <span className="inline-block px-2 py-0.5 rounded-full bg-primary/10 text-[10px] font-semibold uppercase tracking-wider text-primary mb-3">
                {g.badge}
              </span>
              <h3 className="font-semibold text-base leading-snug group-hover:text-primary transition-colors">
                {g.title}
              </h3>
              <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
                {g.description}
              </p>
              <span className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-primary">
                Открыть гайд <ArrowRight className="w-3 h-3" />
              </span>
            </Link>
          ))}
        </motion.div>


        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="w-6 h-6 animate-spin text-primary" />
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post, i) => (
              <motion.div key={post.id} {...fade(0.05 * (i + 1))}>
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
                    <time className="text-xs text-muted-foreground">
                      {new Date(post.date).toLocaleDateString("ru", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </time>
                    <h3 className="mt-2 font-semibold text-sm leading-snug line-clamp-2 group-hover:text-primary transition-colors">
                      {post.title}
                    </h3>
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
        )}

        {blogPosts.length > 6 && (
          <motion.div {...fade(0.3)} className="mt-10 text-center">
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
