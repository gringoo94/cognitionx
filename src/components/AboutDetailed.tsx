import { motion } from "framer-motion";
import { ShieldCheck, Globe2, Users } from "lucide-react";

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

const trust = [
  {
    icon: ShieldCheck,
    title: "Верифицирован на B17.ru",
    text: "Все дипломы и сертификаты проверены платформой B17.ru.",
    href: "https://www.b17.ru/dumitru_iatco/",
  },
  {
    icon: Globe2,
    title: "Стандарты EABCT",
    text: "Практика по международным стандартам Европейской ассоциации КПТ.",
  },
  {
    icon: Users,
    title: "Супервизии и сообщество",
    text: "Регулярные супервизии. Основатель Rolelit — тренажёра для психологов.",
  },
];

const AboutDetailed = () => (
  <section className="max-w-5xl mx-auto px-6 py-16 md:py-20">
    <motion.div {...fade()} className="text-center mb-10">
      <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold">
        Образование и профессиональное развитие
      </h2>
      <p className="text-muted-foreground mt-3 text-sm md:text-base max-w-xl mx-auto">
        Прозрачность — часть моей профессиональной этики
      </p>
      <div className="mt-6 h-1 w-20 rounded-full bg-primary/20 mx-auto" />
    </motion.div>

    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
      {/* Таймлайн */}
      <div className="lg:col-span-7 space-y-10">
        <div>
          <h3 className="text-xs font-semibold uppercase tracking-wider text-primary mb-6">
            Академический путь
          </h3>
          <div className="relative space-y-6 before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-px before:bg-border">
            {timeline.map((item, i) => (
              <motion.div key={item.title} {...fade(0.05 * i)} className="relative pl-10">
                <span
                  className="absolute left-0 top-1 h-[23px] w-[23px] rounded-full border-4 border-background bg-primary shadow-sm"
                  style={{ opacity: 1 - i * 0.2 }}
                />
                <span className="text-xs font-medium text-muted-foreground">{item.period}</span>
                <h4 className="text-base md:text-lg font-semibold mt-0.5">{item.title}</h4>
                <p className="text-sm text-muted-foreground leading-relaxed mt-1">{item.text}</p>
              </motion.div>
            ))}
          </div>
        </div>

        <motion.details {...fade(0.1)} className="group rounded-xl border border-border bg-muted/30 p-5">
          <summary className="cursor-pointer list-none text-xs font-semibold uppercase tracking-wider text-primary marker:content-none">
            ДИПЛОМЫ И СЕРТИФИКАТЫ — ПОКАЗАТЬ
          </summary>
          <ul className="mt-4 space-y-3">
            {certificates.map((c) => (
              <li key={c.title} className="text-xs leading-relaxed text-foreground/80">
                {c.title}
                <span className="text-muted-foreground"> — {c.org}</span>
              </li>
            ))}
          </ul>
        </motion.details>

        <motion.details {...fade(0.15)} className="group rounded-xl border border-border bg-muted/30 p-5">
          <summary className="cursor-pointer list-none text-xs font-semibold uppercase tracking-wider text-primary marker:content-none">
            МЕТОДЫ И ПОДХОДЫ — ПОКАЗАТЬ
          </summary>
          <ul className="mt-4 flex flex-wrap gap-2">
            {methods.map((m) => (
              <li
                key={m}
                className="rounded-lg border border-border bg-muted px-4 py-2 text-sm font-medium text-foreground/80"
              >
                {m}
              </li>
            ))}
          </ul>
        </motion.details>

      </div>

      {/* Доверие */}
      <div className="lg:col-span-5 space-y-8">
        <motion.div
          {...fade(0.1)}
          className="rounded-2xl border border-border bg-muted/40 p-7 shadow-sm"
        >
          <h3 className="text-xs font-semibold uppercase tracking-wider text-primary mb-6">
            Стандарты и верификация
          </h3>
          <ul className="space-y-6">
            {trust.map((t) => (
              <li key={t.title} className="flex items-start gap-4">
                <div className="mt-0.5 rounded-lg bg-background p-2 shadow-sm">
                  <t.icon className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold">
                    {t.href ? (
                      <a
                        href={t.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-primary transition-colors"
                      >
                        {t.title}
                      </a>
                    ) : (
                      t.title
                    )}
                  </h4>
                  <p className="text-xs text-muted-foreground leading-relaxed mt-1">
                    {t.text}
                    {t.href && (
                      <>
                        {" "}
                        <a
                          href={t.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-medium text-primary underline underline-offset-2 hover:no-underline"
                        >
                          Смотреть профиль
                        </a>
                      </>
                    )}
                  </p>

                </div>
              </li>
            ))}
          </ul>
        </motion.div>

        <motion.div {...fade(0.15)} className="rounded-r-xl border-l-4 border-primary bg-primary/5 p-6">
          <h4 className="text-sm font-semibold mb-2">Профессиональные интересы</h4>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Доказательная психотерапия и её популяризация, цифровые инструменты для психического
            здоровья, психообразование и self-help на основе КПТ.
          </p>
          <p className="text-xs italic text-muted-foreground/80 mt-3">
            «Обучение не заканчивается — оно продолжается с каждым новым человеком на сессии»
          </p>
        </motion.div>
      </div>
    </div>
  </section>
);

export default AboutDetailed;
