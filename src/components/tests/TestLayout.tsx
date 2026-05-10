import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Clock, Lock, Sparkles } from "lucide-react";
import { SITE_URL } from "@/lib/globalSchema";
import TestRunner from "./TestRunner";
import TestResult from "./TestResult";
import type { TestConfig } from "@/data/tests/types";

interface TestLayoutProps {
  config: TestConfig;
}

const TestLayout = ({ config }: TestLayoutProps) => {
  const [answers, setAnswers] = useState<number[] | null>(null);
  const resultRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (answers && resultRef.current) {
      resultRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [answers]);

  const path = `/tools/tests/${config.slug}`;

  // Schema: Quiz + FAQPage + BreadcrumbList
  const quizSchema = {
    "@context": "https://schema.org",
    "@type": "Quiz",
    name: config.title,
    description: config.tagline,
    educationalLevel: "professional",
    inLanguage: "ru",
    about: {
      "@type": "Thing",
      name: config.clusterLabel,
    },
    isAccessibleForFree: true,
    url: `${SITE_URL}${path}`,
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: config.faq.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SEOHead
        title={config.seoTitle}
        description={config.seoDescription}
        path={path}
        schema={[quizSchema, faqSchema]}
        breadcrumbs={[
          { name: "Главная", url: `${SITE_URL}/` },
          { name: "Инструменты", url: `${SITE_URL}/tools` },
          { name: "Тесты", url: `${SITE_URL}/tools/tests` },
          { name: config.code, url: `${SITE_URL}${path}` },
        ]}
      />
      <Navbar />

      <main className="max-w-3xl mx-auto px-6 pt-28 pb-20">
        {/* Back link */}
        <Link
          to="/tools/tests"
          className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary mb-6 transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Все тесты
        </Link>

        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-10"
        >
          <div className="flex flex-wrap items-center gap-2 mb-4 text-[11px]">
            <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary font-medium">
              {config.code}
            </span>
            <span className="px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
              {config.clusterLabel}
            </span>
            <span className="inline-flex items-center gap-1 text-muted-foreground">
              <Clock className="h-3 w-3" /> ~{config.durationMin} мин
            </span>
            <span className="inline-flex items-center gap-1 text-muted-foreground">
              <Lock className="h-3 w-3" /> Анонимно
            </span>
            <span className="inline-flex items-center gap-1 text-muted-foreground">
              <Sparkles className="h-3 w-3" /> Бесплатно
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground mb-4">
            {config.title}
          </h1>
          <p className="text-base text-muted-foreground leading-relaxed mb-2">{config.tagline}</p>
          <p className="text-xs text-muted-foreground">{config.authorNote}</p>
        </motion.div>

        {/* Intro */}
        <div className="prose prose-sm dark:prose-invert max-w-none mb-10 text-muted-foreground">
          {config.intro.map((p, i) => (
            <p key={i} className="leading-relaxed">
              {p}
            </p>
          ))}
          <p className="text-xs italic mt-4">
            <strong>Для кого:</strong> {config.audience}
          </p>
        </div>

        {/* Test or Result */}
        <div ref={resultRef} className="mb-12">
          {answers === null ? (
            <TestRunner config={config} onComplete={setAnswers} />
          ) : (
            <TestResult config={config} answers={answers} onRestart={() => setAnswers(null)} />
          )}
        </div>

        {/* About the method */}
        <section className="mb-12">
          <h2 className="text-xl font-semibold text-foreground mb-4">О методике</h2>
          <div className="space-y-3 text-sm text-muted-foreground leading-relaxed">
            {config.about.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>

          {config.sources.length > 0 && (
            <div className="mt-6 rounded-xl border border-border bg-muted/30 p-4">
              <p className="text-xs font-semibold text-foreground mb-2">Источники</p>
              <ul className="space-y-1.5 text-xs text-muted-foreground">
                {config.sources.map((src, i) => (
                  <li key={i}>
                    {src.url ? (
                      <a
                        href={src.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-primary underline-offset-2 hover:underline"
                      >
                        {src.label}
                      </a>
                    ) : (
                      src.label
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </section>

        {/* FAQ */}
        <section className="mb-12">
          <h2 className="text-xl font-semibold text-foreground mb-4">Частые вопросы</h2>
          <Accordion type="single" collapsible className="space-y-3">
            {config.faq.map((f, i) => (
              <AccordionItem
                key={i}
                value={`faq-${i}`}
                className="border border-border rounded-xl px-5 data-[state=open]:border-primary/20 transition-colors"
              >
                <AccordionTrigger className="text-sm font-medium text-left py-4 hover:no-underline">
                  {f.q}
                </AccordionTrigger>
                <AccordionContent className="text-sm text-muted-foreground leading-relaxed pb-4">
                  {f.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </section>

        {/* Final CTA */}
        <section className="rounded-2xl border border-border bg-card p-6 md:p-8 text-center">
          <h2 className="text-lg font-semibold text-foreground mb-2">
            Тесты — это начало, не конец
          </h2>
          <p className="text-sm text-muted-foreground max-w-lg mx-auto mb-5">
            Если результат вас встревожил или подтвердил то, что вы уже подозревали — поговорим.
            Первая встреча — знакомство и оценка запроса.
          </p>
          <Button asChild>
            <Link to="/contact">Записаться на консультацию</Link>
          </Button>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default TestLayout;
