import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { trackCta } from "@/lib/trackCta";

const TelegramCTA = () => (
  <section className="border-y border-border bg-muted/40" aria-labelledby="first-consultation-heading">
    <div className="max-w-7xl mx-auto px-6 py-10 md:py-12">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="grid gap-7 lg:grid-cols-[1fr_2fr] lg:gap-12"
      >
        <div>
          <h2 id="first-consultation-heading" className="text-2xl font-semibold">Первая консультация</h2>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">Не обязательно заранее знать, как описать свой запрос. Начнём с того, что беспокоит сейчас.</p>
        </div>
        <ol className="grid gap-6 sm:grid-cols-3">
          {[
            { title: "Расскажете о себе", text: "Обсудим вашу ситуацию и то, что хотелось бы изменить." },
            { title: "Разберём трудности", text: "Посмотрим, как связаны ваши мысли, чувства и действия." },
            { title: "Наметим следующий шаг", text: "Обсудим, чем может помочь терапия и подходит ли вам мой подход." },
          ].map((step, index) => (
            <li key={step.title}>
              <span className="text-sm font-semibold text-primary">0{index + 1}</span>
              <h3 className="mt-2 text-base font-semibold">{step.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{step.text}</p>
            </li>
          ))}
        </ol>
      </motion.div>
      <div className="mt-8 flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between border-t border-border pt-6">
        <p className="text-sm text-muted-foreground">После встречи вы сами решите, хотите ли продолжать работу.</p>
        <Button variant="outline" className="h-auto min-h-11 gap-2 whitespace-normal rounded-lg py-2.5" asChild>
          <a href="/booking" onClick={() => trackCta("home_first_consultation_booking")}>
            Записаться на консультацию <ArrowRight className="h-4 w-4 shrink-0" />
          </a>
        </Button>
      </div>
    </div>
  </section>
);

export default TelegramCTA;
