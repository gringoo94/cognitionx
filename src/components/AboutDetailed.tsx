import { motion } from "framer-motion";
import { ChevronDown, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";

const fade = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" },
  transition: { duration: 0.5, delay },
});

const timeline = [
  {
    period: "2013 — 2016",
    title: "МолдГУ, лиценциат по психологии",
    text: "Квалификация «психолог». Фундаментальная академическая база.",
  },
  {
    period: "Сейчас",
    title: "Магистратура по клинической психологии",
    text: "Углублённая клиническая подготовка.",
  },
  {
    period: "2021 — 2026",
    title: "КПТ, схема-терапия и клинические протоколы",
    text: "CBTLAB, APA PsycLearn, Белорусское общество КПТ, UNICEF\u00a0",
  },
  {
    period: "Практика",
    title: "Клиника MedHub (Кишинёв) и онлайн",
    text: "Зависимости и созависимость, беженцы войны, люди с ВИЧ, групповая терапия (Initiativa Pozitiva).",
  },
  {
    period: "Практика",
    title: "Without Prejudice",
    text: "Волонтёрство и работа с беженцами войны, кризисная помощь.",
  },
];

const certificates = [
  { year: "2023", title: "Когнитивно-поведенческая терапия, базовый курс", org: "CBTLAB", hours: "36 ч" },
  { year: "2024", title: "КПТ депрессии: 1 ступень", org: "CBTLAB", hours: "12 ч" },
  { year: "2024", title: "КПТ депрессии: 2 ступень (специалитет)", org: "CBTLAB", hours: "16 ч" },
  { year: "2024", title: "Anxiety and Related Disorders", org: "APA PsycLearn", hours: "20 ч" },
  { year: "2024", title: "Depressive and Bipolar Disorders", org: "APA PsycLearn", hours: "20 ч" },
  { year: "2024", title: "Psychology of Anxiety, Mood, Substance Use and Addictive Behaviors", org: "APA", hours: "50 ч" },
  { year: "2024", title: "Disorders Due to Substance Use and Addictive Behaviors", org: "APA PsycLearn", hours: "20 ч" },
  { year: "2025", title: "Научно обоснованная практика: КПТ и вызовы современности", org: "Белорусское общество КПТ", hours: "30 ч" },
  { year: "2025", title: "Предотвращение сексуальной эксплуатации и надругательств", org: "UNICEF", hours: "30 ч" },
  { year: "2026", title: "«В объятиях Тифона» — конференция по работе с опасным поведением", org: "В 4 Стенах", hours: "30 ч" },
];

const methods = [
  "КПТ",
  "Схема-терапия",
  "ACT",
  "Мотивационное интервьюирование (MI)",
  "Smart Recovery",
  "Травматерапия",
  "Сексология",
];

const AboutDetailed = () => {
  const [expanded, setExpanded] = useState<number | null>(null);
  const active = expanded === null ? undefined : timeline[expanded];

  return (
    <section aria-labelledby="education-heading" className="max-w-5xl mx-auto px-6 py-10 md:py-12">
      <motion.div {...fade()}>
        <Carousel opts={{ align: "start" }} aria-label="Образование и профессиональное развитие">
          <div className="mb-6 flex items-end justify-between gap-4">
            <h2 id="education-heading" className="text-2xl md:text-3xl font-bold max-w-xl">
              Образование и профессиональное развитие
            </h2>
            <div className="flex shrink-0 gap-2">
              <CarouselPrevious className="static translate-x-0 translate-y-0 rounded-md" aria-label="Предыдущий этап" title="Предыдущий этап" />
              <CarouselNext className="static translate-x-0 translate-y-0 rounded-md" aria-label="Следующий этап" title="Следующий этап" />
            </div>
          </div>
          <CarouselContent>
            {timeline.map((item, index) => (
              <CarouselItem key={item.title} className="basis-[86%] sm:basis-[44%]" aria-label={`${index + 1} из ${timeline.length}`}>
                <div className="relative pt-4 before:absolute before:top-4 before:left-0 before:right-0 before:h-px before:bg-border">
                  <span className="relative block h-3 w-3 rounded-full bg-primary ring-4 ring-background" />
                  <Button
                    variant="outline"
                    aria-expanded={expanded === index}
                    aria-controls="education-details"
                    onClick={() => setExpanded(expanded === index ? null : index)}
                    className={`mt-4 h-40 w-full flex flex-col items-start justify-between whitespace-normal rounded-lg p-5 text-left ${expanded === index ? "border-primary bg-accent text-accent-foreground" : "bg-background"}`}
                  >
                    <span className="flex w-full items-center justify-between gap-3 text-xs text-muted-foreground">
                      {item.period}<span className="tabular-nums">{index + 1} / {timeline.length}</span>
                    </span>
                    <span className="text-base font-semibold leading-snug">{item.title}</span>
                    <ChevronDown className={`h-4 w-4 self-end transition-transform motion-reduce:transition-none ${expanded === index ? "rotate-180" : ""}`} aria-hidden="true" />
                  </Button>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>

        <div id="education-details" hidden={!active} className="mt-6 border-l-2 border-primary pl-5">
          {active && (
            <>
              <h3 className="text-lg font-semibold">{active.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{active.text}</p>
              {expanded === 2 && (
                <>
                  <h4 className="mt-4 text-sm font-semibold">Курсы и сертификаты</h4>
                  <ul className="mt-3 grid gap-3 sm:grid-cols-2">
                    {certificates.map((c) => (
                      <li key={c.title} className="text-sm leading-relaxed">
                        {c.title}
                        <span className="block text-xs text-muted-foreground">{c.year} · {c.org} · {c.hours}</span>
                      </li>
                    ))}
                  </ul>
                  <h4 className="mt-4 text-sm font-semibold">Методы и подходы</h4>
                  <p className="mt-2 text-sm text-muted-foreground">{methods.join(" · ")}</p>
                </>
              )}
            </>
          )}
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3 border-t border-border pt-4 text-sm text-muted-foreground">
          <a href="https://www.b17.ru/dumitru_iatco/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-primary underline underline-offset-4">
            <ShieldCheck className="h-4 w-4" aria-hidden="true" /> Дипломы проверены B17.ru
          </a>
          <span>Регулярные супервизии</span>
        </div>
      </motion.div>
    </section>
  );
};

export default AboutDetailed;
