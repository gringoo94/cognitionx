import { motion } from "framer-motion";
import { Link, Navigate, useParams } from "react-router-dom";
import { ArrowLeft, CheckCircle2, Clock, Globe, Video, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import SEOHead from "@/components/SEOHead";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { trackCta } from "@/lib/trackCta";
import { getSpecialist, specialists, PSYCHIATRIST_INTRO_LABEL } from "@/data/specialists";

const fade = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-40px" },
  transition: { duration: 0.45, delay },
});

const SpecialistPage = () => {
  const { id } = useParams<{ id: string }>();
  const s = getSpecialist(id ?? null);

  if (!s) return <Navigate to="/free-consultation" replace />;

  const url = `https://cognitionx.cloud/specialists/${s.id}`;
  const others = specialists.filter((o) => o.id !== s.id);

  const personSchema = {
    "@context": "https://schema.org",
    "@type": s.isPsychiatrist ? "Physician" : "Person",
    "@id": `${url}#person`,
    name: s.fullName,
    jobTitle: s.role,
    description: s.bio,
    url,
    knowsLanguage: s.languages,
    worksFor: { "@id": "https://cognitionx.cloud/#organization" },
    areaServed: { "@type": "Place", name: "Онлайн / по всему миру" },
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Главная", item: "https://cognitionx.cloud/" },
      {
        "@type": "ListItem",
        position: 2,
        name: "Специалисты",
        item: "https://cognitionx.cloud/free-consultation",
      },
      { "@type": "ListItem", position: 3, name: s.fullName, item: url },
    ],
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SEOHead
        title={`${s.fullName} — ${s.role} | CognitionX`}
        description={
          s.bio?.slice(0, 155) ??
          `${s.fullName}, ${s.role}. Онлайн-консультации, запись на бесплатную 20-минутную встречу.`
        }
        path={`/specialists/${s.id}`}
        schema={[personSchema, breadcrumbSchema]}
      />
      <Navbar />

      <main className="max-w-4xl mx-auto px-6 py-16 md:py-24">
        <motion.nav
          {...fade()}
          className="flex items-center gap-1.5 text-xs text-muted-foreground mb-8"
        >
          <Link to="/" className="hover:text-primary transition-colors">
            Главная
          </Link>
          <span>/</span>
          <Link to="/free-consultation" className="hover:text-primary transition-colors">
            Специалисты
          </Link>
          <span>/</span>
          <span className="text-foreground">{s.fullName}</span>
        </motion.nav>

        <motion.header {...fade(0.05)} className="flex flex-wrap items-center gap-5">
          <div className="w-20 h-20 rounded-2xl bg-primary/10 text-primary flex items-center justify-center text-2xl font-bold">
            {s.initials}
          </div>
          <div>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight">{s.fullName}</h1>
            <p className="mt-1 text-muted-foreground">{s.role}</p>
          </div>
        </motion.header>

        {s.bio && (
          <motion.p {...fade(0.1)} className="mt-7 text-base leading-relaxed max-w-2xl">
            {s.bio}
          </motion.p>
        )}

        {s.note && (
          <motion.p
            {...fade(0.12)}
            className="mt-5 text-sm text-muted-foreground leading-relaxed bg-muted/50 border border-border rounded-xl p-4 max-w-2xl"
          >
            {s.note}
          </motion.p>
        )}

        <motion.div {...fade(0.15)} className="mt-8 grid gap-3 sm:grid-cols-2 max-w-2xl">
          <p className="flex items-center gap-2 text-sm text-muted-foreground">
            <Globe className="w-4 h-4" /> {s.languages.join(", ")}
          </p>
          <p className="flex items-center gap-2 text-sm text-muted-foreground">
            <Video className="w-4 h-4" /> {s.sessionFormat ?? s.formats.join(" · ")}
          </p>
          <p className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="w-4 h-4" /> {s.availability}
          </p>
          <p className="text-sm">
            <span className="text-muted-foreground">Консультация: </span>
            <span className="font-medium">{s.price}</span>
          </p>
        </motion.div>

        {s.helpsWith?.length ? (
          <motion.section {...fade(0.2)} className="mt-12 max-w-2xl">
            <h2 className="text-xl md:text-2xl font-semibold">С чем помогает</h2>
            <ul className="mt-5 space-y-2">
              {s.helpsWith.map((t) => (
                <li key={t} className="flex items-start gap-2 text-sm">
                  <CheckCircle2 className="w-4 h-4 text-accent mt-0.5 flex-shrink-0" />
                  <span className="text-muted-foreground">{t}</span>
                </li>
              ))}
            </ul>
          </motion.section>
        ) : null}

        {s.approach?.length ? (
          <motion.section {...fade(0.25)} className="mt-12 max-w-2xl">
            <h2 className="text-xl md:text-2xl font-semibold">Как проходит работа</h2>
            <ol className="mt-5 space-y-4">
              {s.approach.map((step, i) => (
                <li key={step} className="flex gap-4">
                  <span className="w-7 h-7 rounded-full bg-primary/10 text-primary text-sm font-semibold flex items-center justify-center flex-shrink-0">
                    {i + 1}
                  </span>
                  <span className="text-sm text-muted-foreground leading-relaxed pt-1">{step}</span>
                </li>
              ))}
            </ol>
          </motion.section>
        ) : null}

        <motion.section
          {...fade(0.3)}
          className="mt-14 rounded-2xl border border-border bg-card p-6 md:p-8 max-w-2xl"
        >
          <h2 className="text-xl font-semibold">
            {s.freeIntro
              ? "Записаться на бесплатную 20-минутную консультацию"
              : "Записаться на платную консультацию"}
          </h2>
          <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
            {s.freeIntro
              ? s.isPsychiatrist
                ? `Бесплатные 20 минут — ${PSYCHIATRIST_INTRO_LABEL.toLowerCase()}, а не медицинская консультация.`
                : "Познакомьтесь, кратко расскажите о своей ситуации и уточните, подходит ли вам дальнейшая работа."
              : "Оставьте заявку — администратор свяжется с вами по мере освобождения слотов."}
          </p>
          <Button
            size="lg"
            className="mt-6 rounded-lg gap-2"
            asChild
            onClick={() => trackCta(`specialist_page_cta_${s.id}`)}
          >
            <Link to={`/free-consultation?specialist=${s.id}`}>
              Оставить заявку {s.toName} <ArrowRight className="w-4 h-4" />
            </Link>
          </Button>
        </motion.section>

        <motion.section {...fade(0.35)} className="mt-14">
          <h2 className="text-xl font-semibold">Другие специалисты</h2>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {others.map((o) => (
              <Link
                key={o.id}
                to={`/specialists/${o.id}`}
                className="flex items-center gap-4 rounded-xl border border-border bg-card p-4 hover:shadow-md transition-shadow"
              >
                <span className="w-11 h-11 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-semibold flex-shrink-0">
                  {o.initials}
                </span>
                <span>
                  <span className="block font-medium">{o.name}</span>
                  <span className="block text-xs text-muted-foreground">{o.role}</span>
                </span>
              </Link>
            ))}
          </div>
        </motion.section>

        <div className="mt-14">
          <Button variant="ghost" size="sm" asChild>
            <Link to="/free-consultation" className="gap-2">
              <ArrowLeft className="w-4 h-4" /> Ко всем специалистам
            </Link>
          </Button>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default SpecialistPage;
