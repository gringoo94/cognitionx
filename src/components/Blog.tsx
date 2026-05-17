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

const Blog = () => {
  const { data: blogPosts = [], isLoading } = useBlogPosts();
  const posts = blogPosts.slice(0, 6);

  return (
    <section id="blog" className="py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <motion.div {...fade(0)} className="text-center mb-16">
          <span className="inline-block px-4 py-1.5 rounded-full border border-primary/20 bg-primary/5 text-xs font-medium text-primary mb-4">
            Блог
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
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post, i) => (
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
