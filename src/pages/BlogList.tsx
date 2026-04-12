import { motion } from "framer-motion";
import { blogPosts } from "@/data/blogPosts";
import { ArrowRight, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";

const fade = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" },
  transition: { duration: 0.5, delay },
});

const BlogList = () => (
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
        className="text-3xl md:text-4xl font-bold tracking-tight mb-12"
      >
        Все <span className="text-primary">статьи</span>
      </motion.h1>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {blogPosts.map((post, i) => (
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
    </main>
    <Footer />
  </div>
);

export default BlogList;
