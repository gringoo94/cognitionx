import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";

const links = [
  { to: "/", label: "Главная" },
  { to: "/about", label: "Обо мне" },
  { to: "/blog", label: "Блог" },
  { to: "/tools", label: "Инструменты" },
  { to: "/contact", label: "Контакты" },
];

const NotFound = () => (
  <>
    <SEOHead
      title="Страница не найдена | 404"
      description="Запрашиваемая страница не найдена. Вернитесь на главную или выберите нужный раздел."
      path="/404"
      noindex
    />
    <Navbar />
    <main className="flex min-h-[60vh] items-center justify-center section-padding">
      <div className="text-center max-w-md mx-auto px-4">
        <h1 className="text-7xl font-bold text-primary mb-4">404</h1>
        <p className="text-xl text-muted-foreground mb-8">
          Страница не найдена. Возможно, она была удалена или перемещена.
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

export default NotFound;
