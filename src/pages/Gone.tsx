import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";

const links = [
  { to: "/blog", label: "Все статьи блога" },
  { to: "/", label: "Главная" },
  { to: "/about", label: "Обо мне" },
];

const Gone = () => (
  <>
    <SEOHead
      title="Материал удалён | 410"
      description="Этот материал был удалён и больше не доступен."
      path="/410"
      noindex
    />
    {/* Prerender/hosting can read this marker to serve HTTP 410 */}
    <meta name="prerender-status-code" content="410" />
    <Navbar />
    <main className="flex min-h-[60vh] items-center justify-center section-padding">
      <div className="text-center max-w-md mx-auto px-4">
        <h1 className="text-7xl font-bold text-primary mb-4">410</h1>
        <p className="text-xl text-muted-foreground mb-8">
          Материал был удалён и больше не публикуется.
        </p>
        <nav className="flex flex-wrap justify-center gap-3">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className="px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors text-sm font-medium"
            >
              {l.label}
            </Link>
          ))}
        </nav>
      </div>
    </main>
    <Footer />
  </>
);

export default Gone;
