import { Link } from "react-router-dom";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import SEOHead from "@/components/SEOHead";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { specialists } from "@/data/specialists";

const SpecialistsPage = () => (
  <div className="min-h-screen bg-background text-foreground">
    <SEOHead
      title="Специалисты CognitionX — психологи и психиатр"
      description="Команда CognitionX: КПТ-психологи и врач-психиатр. Узнайте о подходе, специализации и формате работы каждого специалиста."
      path="/specialists"
    />
    <Navbar />
    <main className="max-w-5xl mx-auto px-6 py-16 md:py-24">
      <nav className="flex items-center gap-1.5 text-xs text-muted-foreground mb-8">
        <Link to="/" className="hover:text-primary transition-colors">Главная</Link>
        <span>/</span>
        <span className="text-foreground">Специалисты</span>
      </nav>
      <h1 className="text-3xl md:text-4xl font-bold tracking-tight">Специалисты</h1>
      <p className="mt-4 text-muted-foreground max-w-2xl leading-relaxed">
        Психологи и врач-психиатр, с которыми я работаю и которым доверяю.
      </p>
      <div className="mt-10 grid gap-5 sm:grid-cols-2">
        {specialists.map((s) => (
          <Link
            key={s.id}
            to={`/specialists/${s.id}`}
            className="flex flex-col rounded-2xl border border-border bg-card p-6 hover:shadow-lg transition-shadow"
          >
            <div className="flex items-center gap-4">
              <span className="w-14 h-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center text-lg font-bold flex-shrink-0">
                {s.initials}
              </span>
              <span>
                <span className="block text-lg font-semibold">{s.fullName}</span>
                <span className="block text-sm text-muted-foreground">{s.role}</span>
              </span>
            </div>
            <ul className="mt-4 space-y-1.5 text-sm flex-1">
              {s.topics.slice(0, 4).map((t) => (
                <li key={t} className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-accent mt-0.5 flex-shrink-0" />
                  <span className="text-muted-foreground">{t}</span>
                </li>
              ))}
            </ul>
            <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-primary">
              Подробнее <ArrowRight className="w-4 h-4" />
            </span>
          </Link>
        ))}
      </div>
    </main>
    <Footer />
  </div>
);

export default SpecialistsPage;
