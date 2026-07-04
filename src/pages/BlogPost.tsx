import { useParams, Link } from "react-router-dom";
import { useBlogPost, useBlogPosts } from "@/hooks/useBlogPosts";
import { ArrowLeft, ArrowRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BehavioralActivationDiary from "@/components/BehavioralActivationDiary";
import EmotionWheel from "@/components/EmotionWheel";
import SEOHead from "@/components/SEOHead";
import BlogSubscribeForm from "@/components/BlogSubscribeForm";
import BlogCover from "@/components/BlogCover";
import BlogCtaBridge from "@/components/BlogCtaBridge";
import RfcbtModesDiagram from "@/components/RfcbtModesDiagram";
import DecisionMatrixCta from "@/components/DecisionMatrixCta";
import { sanitizeHtml as sanitize } from "@/lib/sanitizeHtml";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();
  const { data: post, isLoading } = useBlogPost(slug);
  const { data: allPosts = [] } = useBlogPosts();

  const relatedPosts = allPosts
    .filter((p) => p.slug !== slug)
    .filter((p) => post?.tags?.some((t) => p.tags.includes(t)))
    .slice(0, 3);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Статья не найдена</h1>
          <Link to="/" className="text-primary hover:underline">
            На главную
          </Link>
        </div>
      </div>
    );
  }

  const wordCount = post.content
    .filter((b: any) => typeof b.text === "string")
    .reduce((sum: number, b: any) => sum + b.text.replace(/<[^>]+>/g, " ").trim().split(/\s+/).length, 0);

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `https://cognitionx.cloud/blog/${post.slug}`,
    },
    headline: post.title,
    description: post.description,
    image: [post.image],
    datePublished: post.date,
    dateModified: (post as any).updatedAt || post.date,
    inLanguage: "ru-RU",
    wordCount,
    keywords: post.tags?.join(", "),
    author: { "@id": "https://cognitionx.cloud/#person" },
    publisher: { "@id": "https://cognitionx.cloud/#organization" },
    // Speakable: which parts AI voice agents / Google Assistant should read aloud.
    // h1 + first paragraph of the article body are the most informative.
    speakable: {
      "@type": "SpeakableSpecification",
      cssSelector: ["h1", "[data-speakable]"],
    },
    about: post.tags?.map((t) => ({ "@type": "Thing", name: t })),
  };

  // FAQPage schema for high-impression posts (boosts CTR via rich snippet)
  const faqBySlug: Record<string, { question: string; answer: string }[]> = {
    "postoyannaya-trevoga-bez-prichiny": [
      {
        question: "Почему возникает постоянная тревога без причины?",
        answer:
          "Причина есть, но она не в конкретном событии — нервная система застряла в режиме «ожидание угрозы». Это называется генерализованное тревожное расстройство (ГТР): мозг сканирует мир в поисках опасности и находит её везде.",
      },
      {
        question: "Как отличить тревогу от обычного беспокойства?",
        answer:
          "Беспокойство связано с конкретной ситуацией и проходит, когда она разрешается. Тревога без причины фоновая, длится неделями и месяцами, сопровождается мышечным напряжением, бессонницей и не зависит от внешних обстоятельств.",
      },
      {
        question: "Что делать прямо сейчас, если внутри постоянная тревога?",
        answer:
          "Заметьте тревогу и назовите её, расслабьте челюсть и плечи, сделайте 3 цикла дыхания (вдох 4, выдох 6). Затем спросите: «Могу ли я что-то сделать с этим прямо сейчас?» Если да — сделайте, если нет — отложите.",
      },
      {
        question: "Когда нужна помощь специалиста?",
        answer:
          "Если тревога мешает жить больше 6 месяцев — это ГТР, и самопомощи может быть недостаточно. Когнитивно-поведенческая терапия (КПТ) — метод первой линии: обычно за 8–12 сессий можно добиться значительного снижения симптомов.",
      },
    ],
    "kognitivnyj-barjer-vera-v-istinnost": [
      {
        question: "Что такое когнитивный барьер в схема-терапии?",
        answer:
          "Это ситуация, когда вы рационально верите в свою ловушку (схему): убеждены, что мир действительно опасен, что вы действительно некомпетентны, что вы хуже других. Пока вы согласны с ловушкой на уровне логики — изменить её невозможно.",
      },
      {
        question: "Как преодолеть веру в истинность ловушки?",
        answer:
          "Вернитесь к упражнениям опровержения, попросите доверенного человека дать объективный взгляд, найдите в жизни свидетельства против ловушки. Напишите карточку с контраргументами и читайте её несколько раз в день.",
      },
      {
        question: "Можно ли справиться с когнитивным барьером самостоятельно?",
        answer:
          "Частично — да, через дневник мыслей и анализ доказательств. Но при глубоких ловушках (Уязвимость, Несостоятельность, Неполноценность) нужна работа с терапевтом: схема-терапия даёт результат за 20–40 сессий.",
      },
    ],
    "povyshennaya-trevozhnost": [
      { question: "Что такое повышенная тревожность?", answer: "Это фоновое состояние, когда нервная система постоянно работает в режиме «ожидание угрозы», даже если объективно ничего не происходит. Симптомы держатся неделями и месяцами; при длительности больше 6 месяцев речь идёт о генерализованном тревожном расстройстве (ГТР)." },
      { question: "Как отличить повышенную тревожность от нормальной тревоги?", answer: "Нормальная тревога связана с конкретным событием и проходит после него. Повышенная — фоновая, не зависит от ситуации, сопровождается мышечным напряжением, плохим сном, раздражительностью и катастрофическими мыслями «а вдруг»." },
      { question: "Какие методы лечения работают при повышенной тревожности?", answer: "Метод первой линии — когнитивно-поведенческая терапия (КПТ): эффективность 60–80% за 8–16 сессий. При корнях в детстве подключают схема-терапию. При выраженных симптомах психиатр может назначить СИОЗС — это безопасно и совместимо с терапией." },
      { question: "Что сделать самостоятельно прямо сейчас?", answer: "Пройти GAD-7, начать дневник мыслей, наладить сон (подъём в одно время, экран за час до сна — нет), сократить кофеин до 1 чашки утром, добавить 30 минут ходьбы в день. Эти шаги дают заметный эффект за 2–3 недели." },
    ],
    "somaticheskie-simptomy-trevogi": [
      { question: "Что такое соматические симптомы тревоги?", answer: "Это реальные телесные проявления тревоги: сердцебиение, ком в горле, нехватка воздуха, головокружение, тремор, проблемы с ЖКТ, мышечное напряжение. Возникают из-за активации симпатической нервной системы — режима «бей или беги». Опасности для жизни нет, но переживаются крайне неприятно." },
      { question: "Как отличить тревогу от реальной болезни?", answer: "Сначала исключите соматику у врача (ЭКГ, общий анализ крови, ТТГ — минимум). Признаки тревожной природы: анализы в норме, симптомы «гуляют» (то сердце, то ЖКТ, то голова), усиливаются при концентрации на них, ослабляются при отвлечении, сопровождаются фоновой тревогой." },
      { question: "Что делать при приступе соматических симптомов?", answer: "Замедлить дыхание (вдох 4, выдох 6–8) — это останавливает гипервентиляцию за 2–3 минуты и снимает головокружение, онемение, ком в горле. Сделать заземление 5-4-3-2-1. Намеренно переключить внимание с тела на внешнее. Не уходить из «опасной» ситуации — это закрепляет страх." },
      { question: "Какая терапия эффективна при соматических симптомах?", answer: "Золотой стандарт — интероцептивная экспозиция в рамках КПТ: вы намеренно вызываете симптом (быстрое дыхание → головокружение) и убеждаетесь, что это безопасно. Мозг перестаёт реагировать паникой. Курс обычно 8–12 сессий." },
    ],
    "kpt-pri-trevoge": [
      { question: "Помогает ли КПТ при тревоге?", answer: "Да, КПТ — метод первой линии при тревожных расстройствах по рекомендациям NICE, APA и ВОЗ. Эффективность 60–80% при ГТР, паническом расстройстве и социальной тревожности. Результат обычно за 8–16 сессий, эффект сохраняется годами." },
      { question: "Сколько длится курс КПТ при тревоге?", answer: "Базовый протокол — 12–16 сессий раз в неделю. Лёгкие формы укладываются в 6–8 встреч. При коморбидной депрессии или ПТСР — 20–30 сессий. После курса возможны поддерживающие сессии раз в месяц." },
      { question: "Можно ли заниматься КПТ онлайн?", answer: "Да. Метаанализы (Carlbring et al., 2018; Andrews et al., 2018) показывают: онлайн-КПТ при тревоге эффективна так же, как очная. Главное — структура, домашние задания и регулярность." },
    ],
    "serdce-otkryto": [
      { question: "Что значит «сердце открыто» в эмоциональной грамотности?", answer: "Это состояние, в котором мы позволяем себе быть видимыми и уязвимыми. Именно там возникает спектр глубоких эмоций — от любви и доверия до предательства и разбитого сердца. По Брене Браун, это и есть зона настоящих связей." },
      { question: "Почему открытость болезненна?", answer: "Открытое сердце чувствительно к отказу, обиде и потере. Чем глубже связь — тем больнее, когда что-то идёт не так. Это нормальная цена за способность к настоящим отношениям, а не «слабость»." },
      { question: "Как восстановиться после предательства?", answer: "Признать боль и не торопить себя, восстановить безопасные границы, говорить о случившемся с доверенными людьми или психологом. Через 6–12 недель острая фаза обычно ослабевает; с терапией процесс ускоряется и снижает риск закрыться от близости навсегда." },
    ],
    "vsyo-idyot-ne-po-planu": [
      { question: "Какие эмоции возникают, когда всё идёт не по плану?", answer: "Чаще всего — фрустрация, разочарование, сожаление, уныние, иногда скука и покорность судьбе. Это разные сигналы: фрустрация говорит «нужен другой подход», разочарование — «пересмотри ожидания», сожаление — «извлеки урок»." },
      { question: "В чём разница между фрустрацией и разочарованием?", answer: "Фрустрация — острое чувство в момент столкновения с препятствием, тело напряжено, хочется действовать. Разочарование — более тихое чувство потери, когда стало ясно, что ожидаемое не сбудется. Фрустрация толкает к действию, разочарование требует горевания." },
      { question: "Что делать с сожалением?", answer: "Не подавлять и не застревать. Здоровый цикл: признать → отделить от вины («жаль, что так получилось» вместо «я плохой») → извлечь конкретный урок на будущее. Если сожаление повторяется по кругу и парализует — это уже руминация, с которой работают в КПТ." },
    ],
    "nam-bolno": [
      { question: "Чем отличаются грусть, печаль и горе?", answer: "Грусть — короткая эмоциональная реакция на потерю или утрату значимого. Печаль — более длительное и тихое переживание. Горе — глубинный процесс адаптации к серьёзной потере, который занимает месяцы и годы и проходит несколько фаз." },
      { question: "Сколько длится горе и когда обращаться за помощью?", answer: "Острая фаза горя обычно 6–12 месяцев, полная адаптация — до 2 лет. Обратиться к специалисту стоит, если через 6 месяцев интенсивность не снижается, появляются мысли о бессмысленности жизни, нарушены сон и работоспособность — это могут быть признаки осложнённого горя или депрессии." },
      { question: "Как поддержать себя в боли?", answer: "Назвать чувство («сейчас мне очень больно»), не сравнивать свою боль с чужой, не торопить себя «уже пора отпустить», находить безопасное пространство для слёз, говорить с тем, кто может выдержать вашу боль без советов. Самосострадание работает лучше критики." },
    ],
    "my-sravnivaem": [
      { question: "Почему мы постоянно сравниваем себя с другими?", answer: "Социальное сравнение — встроенный механизм оценки себя в группе. Он помогал выживать предкам и помогает калибровать ожидания сегодня. Проблемой он становится, когда становится хроническим, особенно в соцсетях — где мы сравниваем свою «закулиску» с чужой витриной." },
      { question: "Чем сравнение отличается от зависти?", answer: "Сравнение — нейтральная оценка («у него быстрее, у меня медленнее»). Зависть — болезненное переживание, что у другого есть то, чего хочется, и это «несправедливо». Зависть может быть конструктивной (мотивировать) или разрушительной (грызть и обесценивать)." },
      { question: "Как перестать сравнивать себя с другими?", answer: "Полностью — не получится и не нужно. Цель — не «выключить сравнение», а сравнивать с собой вчерашним вместо чужой витрины. Помогает: ограничение соцсетей, ведение дневника собственного прогресса, работа с лежащими в основе схемами «дефективности» или «неуспеха» в терапии." },
    ],
    "vygoranie-ot-domashek-v-terapii": [
      { question: "Что делать, если устал от домашних заданий в терапии?", answer: "Это нормальный этап — особенно в КПТ, где задания обязательны. Сначала проверьте: не слишком ли объёмные задания, не выпало ли из них «зачем». Затем обсудите усталость с терапевтом — это рабочая тема, не повод бросать терапию." },
      { question: "Можно ли не делать домашние задания?", answer: "Можно, но эффективность терапии резко падает: в КПТ домашка — это место, где меняется поведение и мышление. Альтернатива — пересобрать задания так, чтобы их реально хотелось делать: короче, проще, ближе к жизни." },
    ],
    "strah-byt-neljubimym": [
      { question: "Откуда берётся страх быть нелюбимым?", answer: "Чаще всего — из ранних отношений, где любовь была условной («хороший — любим, плохой — отвергнут») или непредсказуемой. В схема-терапии это связано с ловушками покинутости, эмоциональной депривации и дефективности. Закрепляется в подростковом возрасте через сравнение и опыт отвержения." },
      { question: "Как работать со страхом быть нелюбимым?", answer: "Распознать ловушку и её триггеры, перестать «проверять» близких через провокации, постепенно учиться выдерживать дискомфорт от уязвимости (через imagery rescripting и поведенческие эксперименты в схема-терапии). Это работа на 6–18 месяцев, но даёт глубокий и устойчивый результат." },
    ],
    "malenkie-pobedy-ekspozicii": [
      { question: "Что такое экспозиция в КПТ?", answer: "Экспозиция — это постепенное столкновение с тем, чего вы боитесь, без выполнения избегания или защитного ритуала. Это золотой стандарт лечения тревожных расстройств, фобий, ПТСР и ОКР: тревога угасает сама, если не подкреплять её бегством." },
      { question: "Почему важно радоваться маленьким победам в экспозиции?", answer: "Большие шаги при экспозиции часто срываются. Маленькие, систематические победы работают лучше: мозг учится «я могу», запоминает успех, тревога снижается. Каждый шаг важно фиксировать — иначе он обесценивается, и кажется, что «ничего не меняется»." },
      { question: "Как составить лестницу экспозиции?", answer: "Выпишите 10–15 ситуаций от наименее до наиболее пугающих по шкале 0–100. Начните с того, где тревога 30–40 — это «зона роста». Повторяйте, пока тревога не упадёт до 10–20, затем переходите к следующей ступеньке. Лучше делать с психологом, особенно при ОКР и панике." },
    ],
  };

  const postFaq = faqBySlug[post.slug];
  const faqSchema = postFaq
    ? {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: postFaq.map((q) => ({
          "@type": "Question",
          name: q.question,
          acceptedAnswer: { "@type": "Answer", text: q.answer },
        })),
      }
    : null;

  const allSchema = faqSchema ? [articleSchema, faqSchema] : articleSchema;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SEOHead
        title={`${post.title} | Психолог Дмитрий Яцко`}
        description={post.description}
        path={`/blog/${post.slug}`}
        ogImage={post.image}
        ogType="article"
        schema={allSchema}
        breadcrumbs={[
          { name: "Главная", url: "https://cognitionx.cloud/" },
          { name: "Блог", url: "https://cognitionx.cloud/blog" },
          { name: post.title, url: `https://cognitionx.cloud/blog/${post.slug}` },
        ]}
      />
      <Navbar />
      <main className="max-w-3xl mx-auto px-6 pt-24 pb-20">
        <Link
          to="/#blog"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" /> Назад к статьям
        </Link>

        <article>
          <time className="text-xs text-muted-foreground">
            {new Date(post.date).toLocaleDateString("ru", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </time>
          <h1 className="mt-3 text-3xl md:text-4xl font-bold tracking-tight leading-tight">
            {post.title}
          </h1>

          {/* TL;DR block — surfaces a concise summary for LLMs/AI Overviews/voice agents */}
          <aside
            data-speakable
            aria-label="Кратко"
            className="mt-6 rounded-2xl border border-primary/20 bg-primary/5 p-5"
          >
            <div className="text-[11px] font-semibold uppercase tracking-wider text-primary mb-1.5">
              Кратко
            </div>
            <p className="text-sm md:text-base text-foreground/90 leading-relaxed m-0">
              {post.description}
            </p>
          </aside>

          <div className="mt-8 rounded-2xl overflow-hidden aspect-[16/9]">
            <BlogCover
              slug={post.slug}
              title={post.title}
              tag={post.tags?.[0]}
              large
            />
          </div>

          <div className="mt-8">
            <BlogSubscribeForm variant="inline" source="blog-post-top" />
          </div>

          <div className="mt-10 space-y-6">
            {post.content.map((block, i) => {
              if (block.type === "component" && block.componentId === "behavioral-activation-diary") {
                return <BehavioralActivationDiary key={i} />;
              }
              if (block.type === "component" && block.componentId === "emotion-wheel") {
                return <EmotionWheel key={i} />;
              }
              if (block.type === "component" && block.componentId === "rfcbt-modes") {
                return <RfcbtModesDiagram key={i} />;
              }
              if (block.type === "component" && block.componentId === "decision-matrix-cta") {
                return <DecisionMatrixCta key={i} topic={post.title} />;
              }
              if (block.type === "preface") {
                return (
                  <p
                    key={i}
                    data-speakable
                    className="text-lg text-muted-foreground leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: sanitize(block.text) }}
                  />
                );
              }
              if (block.type === "heading") {
                const Tag = block.level === 2 ? "h2" : "h3";
                return (
                  <Tag
                    key={i}
                    className={`font-bold tracking-tight ${
                      block.level === 2 ? "text-2xl mt-10" : "text-xl mt-8"
                    }`}
                    dangerouslySetInnerHTML={{ __html: sanitize(block.text) }}
                  />
                );
              }
              if (block.type === "quote") {
                return (
                  <blockquote
                    key={i}
                    className="border-l-4 border-primary pl-5 py-2 text-muted-foreground italic"
                    dangerouslySetInnerHTML={{ __html: sanitize(block.text) }}
                  />
                );
              }
              if (block.type === "example") {
                return (
                  <div
                    key={i}
                    className="rounded-2xl border border-primary/20 bg-primary/5 p-5 md:p-6 text-base leading-relaxed text-foreground/90 [&_strong]:text-foreground [&_p]:mb-2 last:[&_p]:mb-0"
                    dangerouslySetInnerHTML={{ __html: sanitize(block.text) }}
                  />
                );
              }
              if (block.type === "faq") {
                let items: Array<{ q: string; a: string }> = [];
                try {
                  items = JSON.parse(block.text);
                } catch {
                  items = [];
                }
                if (!items.length) return null;
                return (
                  <Accordion
                    key={i}
                    type="single"
                    collapsible
                    className="rounded-2xl border border-border divide-y divide-border overflow-hidden"
                  >
                    {items.map((it, j) => (
                      <AccordionItem key={j} value={`item-${j}`} className="border-none">
                        <AccordionTrigger className="px-5 py-4 text-left font-medium hover:no-underline">
                          {it.q}
                        </AccordionTrigger>
                        <AccordionContent className="px-5 pb-4 text-foreground/85 leading-relaxed [&_a]:text-primary [&_a]:underline">
                          <div dangerouslySetInnerHTML={{ __html: sanitize(it.a) }} />
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                );
              }
              return (
                <div
                  key={i}
                  className="text-base leading-relaxed text-foreground/90 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-1 [&_li]:text-foreground/80 [&_strong]:text-foreground [&_a]:text-primary [&_a]:underline"
                  dangerouslySetInnerHTML={{ __html: sanitize(block.text) }}
                />
              );
            })}
          </div>

          <div className="mt-16">
            <BlogSubscribeForm source="blog-post-bottom" />
          </div>

          <BlogCtaBridge topic={post.title} />

          {relatedPosts.length > 0 && (
            <div className="mt-16">
              <h2 className="text-2xl font-bold mb-6">Читайте также</h2>
              <div className="grid sm:grid-cols-3 gap-4">
                {relatedPosts.map((rp) => (
                  <Link
                    key={rp.slug}
                    to={`/blog/${rp.slug}`}
                    className="group rounded-xl overflow-hidden border border-border hover:border-primary/30 transition-all"
                  >
                    <div className="aspect-[16/10] overflow-hidden">
                      <BlogCover
                        slug={rp.slug}
                        title={rp.title}
                        tag={rp.tags?.[0]}
                        className="group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="text-sm font-semibold line-clamp-2 group-hover:text-primary transition-colors">
                        {rp.title}
                      </h3>
                      <span className="mt-2 inline-flex items-center gap-1 text-xs text-primary">
                        Читать <ArrowRight className="w-3 h-3" />
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
              <div className="mt-6 text-center">
                <Link
                  to="/blog"
                  className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
                >
                  Все статьи <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          )}
        </article>
      </main>
      <Footer />
    </div>
  );
};

export default BlogPost;
