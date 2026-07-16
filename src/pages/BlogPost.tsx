import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { useBlogPost, useBlogPosts } from "@/hooks/useBlogPosts";
import { ArrowLeft, ArrowRight, Loader2, Clock, Sparkles, HelpCircle } from "lucide-react";
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
import MarkdownBlock from "@/components/MarkdownBlock";
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
  const [readProgress, setReadProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const h = document.documentElement;
      const scrolled = h.scrollTop;
      const height = h.scrollHeight - h.clientHeight;
      setReadProgress(height > 0 ? Math.min(100, (scrolled / height) * 100) : 0);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [slug]);


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

  const canonicalUrl = `https://cognitionx.cloud/blog/${post.slug}`;
  const absImage = post.image?.startsWith("http")
    ? post.image
    : `https://cognitionx.cloud${post.image?.startsWith("/") ? "" : "/"}${post.image || "og-default.webp"}`;
  const primarySection = post.tags?.[0];

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "@id": `${canonicalUrl}#article`,
    url: canonicalUrl,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": canonicalUrl,
    },
    isPartOf: { "@id": "https://cognitionx.cloud/#website" },
    headline: post.title,
    description: post.description,
    image: {
      "@type": "ImageObject",
      url: absImage,
      width: 1200,
      height: 630,
    },
    datePublished: post.date,
    dateModified: (post as any).updatedAt || post.date,
    inLanguage: "ru-RU",
    wordCount,
    ...(primarySection ? { articleSection: primarySection } : {}),
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
    "trevoga-bez-prichiny": [
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
    "bipolyarnoe-rasstroistvo-skrining": [
      { question: "Как отличить биполярное расстройство от обычных перепадов настроения?", answer: "При БАР эпизоды длятся дни и недели, а не часы, и заметно меняют поведение: сон резко сокращается без усталости, появляется идея величия или рискованные траты, речь ускоряется. Обычные перепады настроения короче, связаны с событиями и не ломают повседневное функционирование." },
      { question: "Что показывает тест MDQ?", answer: "MDQ (Mood Disorder Questionnaire) — скрининговый опросник на биполярный спектр. Положительный результат означает «стоит обсудить с психиатром», а не диагноз. Чувствительность около 66–70%, специфичность около 85%: тест может пропустить БАР II и даёт ложноположительные результаты при пограничном расстройстве личности и СДВГ." },
      { question: "Почему БАР часто путают с депрессией?", answer: "Люди приходят к врачу в депрессивной фазе — она переживается тяжелее и длится дольше. Гипоманию при БАР II воспринимают как «наконец-то нормальное состояние» и не жалуются. В итоге ставят униполярную депрессию и назначают только антидепрессанты, что может спровоцировать манию." },
      { question: "Что делать при положительном результате MDQ?", answer: "Записаться на консультацию к психиатру, а не к психологу: диагноз БАР ставит только врач, и медикаменты (стабилизаторы настроения) — основа лечения. Психотерапия (КПТ, IPSRT) подключается вторым слоем для профилактики рецидивов и работы с образом жизни." },
    ],
    "rpp-rannie-priznaki": [
      { question: "Можно ли определить РПП по весу?", answer: "Нет. Расстройство пищевого поведения — это про отношения с едой и телом, а не про цифру на весах. Булимия, приступообразное переедание и атипичная нервная анорексия часто протекают при нормальном или повышенном весе. Ориентироваться нужно на поведение и мысли, а не на ИМТ." },
      { question: "Какие ранние признаки РПП стоит заметить?", answer: "Жёсткие правила вокруг еды («нельзя после 18», деление на «чистое/грязное»), ритуалы (взвешивание, подсчёт калорий, проверки в зеркале), эпизоды переедания с чувством потери контроля, компенсации (рвота, слабительные, изнуряющий спорт), избегание еды с людьми, постоянные мысли о теле и весе." },
      { question: "Что показывает тест EAT-26?", answer: "EAT-26 — скрининг риска РПП, не диагноз. Балл 20 и выше или наличие компенсаторного поведения за последние 6 месяцев означает «нужна очная оценка у специалиста». Тест не различает конкретные расстройства (анорексия, булимия, BED) — это делает врач или клинический психолог." },
      { question: "Когда РПП становится медицинским неотложным состоянием?", answer: "Немедленно к врачу: ИМТ ниже 15, обмороки, судороги, рвота с кровью, пульс ниже 40 в покое, невозможность есть и пить сутки, суицидальные мысли. При тяжёлой анорексии смертность до 5–10%, поэтому промедление опасно. Скорая помощь или приёмный покой — не «перебор»." },
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

  const readingMin = Math.max(1, Math.round(wordCount / 180));
  const primaryTag = post.tags?.[0];
  const updatedAt = (post as any).updatedAt as string | undefined;

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
          ...(primarySection
            ? [{
                name: primarySection,
                url: `https://cognitionx.cloud/blog?tag=${encodeURIComponent(primarySection)}`,
              }]
            : []),
          { name: post.title, url: `https://cognitionx.cloud/blog/${post.slug}` },
        ]}
      />
      <Navbar />

      {/* Reading progress bar */}
      <div className="fixed top-0 left-0 right-0 h-0.5 z-40 bg-transparent pointer-events-none">
        <div
          className="h-full bg-gradient-to-r from-primary via-primary to-accent transition-[width] duration-150"
          style={{ width: `${readProgress}%` }}
        />
      </div>

      <main className="max-w-3xl mx-auto px-6 pt-24 pb-20">
        <Link
          to="/#blog"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" /> Назад к статьям
        </Link>

        <article>
          {/* Meta chips */}
          <div className="flex flex-wrap items-center gap-2 text-xs">
            {primaryTag && (
              <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-primary/10 text-primary font-medium">
                {primaryTag}
              </span>
            )}
            <span className="text-muted-foreground">
              {new Date(post.date).toLocaleDateString("ru", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </span>
            <span className="text-muted-foreground/50">·</span>
            <span className="inline-flex items-center gap-1 text-muted-foreground">
              <Clock className="w-3 h-3" /> {readingMin} мин чтения
            </span>
            {updatedAt && updatedAt !== post.date && (
              <>
                <span className="text-muted-foreground/50">·</span>
                <span className="text-muted-foreground">
                  обновлено{" "}
                  {new Date(updatedAt).toLocaleDateString("ru", {
                    day: "numeric",
                    month: "short",
                  })}
                </span>
              </>
            )}
            <span className="text-muted-foreground/50">·</span>
            <span className="text-muted-foreground">
              Автор:{" "}
              <Link to="/about" className="underline hover:text-primary">
                Дмитрий Яцко, психолог
              </Link>
            </span>
          </div>


          <h1 className="mt-4 text-3xl md:text-5xl font-bold tracking-tight leading-[1.1]">
            {post.title}
          </h1>

          {/* TL;DR block — surfaces a concise summary for LLMs/AI Overviews/voice agents */}
          <aside
            data-speakable
            aria-label="Кратко"
            className="mt-8 relative rounded-2xl border border-primary/25 bg-gradient-to-br from-primary/[0.07] via-primary/[0.04] to-transparent p-5 md:p-6 shadow-[0_1px_0_0_hsl(var(--primary)/0.08)]"
          >
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-3.5 h-3.5 text-primary" />
              <div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-primary">
                Кратко
              </div>
            </div>
            <p className="text-[15px] md:text-base text-foreground/90 leading-relaxed m-0">
              {post.description}
            </p>
          </aside>

          <div className="mt-8 rounded-2xl overflow-hidden aspect-[16/9] ring-1 ring-border/60 shadow-sm">
            <BlogCover
              slug={post.slug}
              title={post.title}
              tag={primaryTag}
              large
            />
          </div>

          <div className="mt-8">
            <BlogSubscribeForm variant="inline" source="blog-post-top" />
          </div>

          <div className="mt-12 space-y-6">
            {post.content.map((block, i) => {
              if (block.type === "markdown") {
                return <MarkdownBlock key={i} markdown={block.text} topic={post.title} />;
              }
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
                    className="text-lg md:text-xl text-foreground/80 leading-relaxed font-light first-letter:text-5xl first-letter:font-serif first-letter:font-semibold first-letter:mr-2 first-letter:float-left first-letter:leading-[0.95] first-letter:text-primary"
                    dangerouslySetInnerHTML={{ __html: sanitize(block.text) }}
                  />
                );
              }
              if (block.type === "heading") {
                if (block.level === 2) {
                  return (
                    <h2
                      key={i}
                      className="relative font-bold tracking-tight text-2xl md:text-[28px] leading-tight mt-14 pt-2 pl-4 border-l-[3px] border-primary/70 scroll-mt-24"
                      dangerouslySetInnerHTML={{ __html: sanitize(block.text) }}
                    />
                  );
                }
                return (
                  <h3
                    key={i}
                    className="font-semibold tracking-tight text-xl md:text-[22px] mt-8 text-foreground/95 scroll-mt-24"
                    dangerouslySetInnerHTML={{ __html: sanitize(block.text) }}
                  />
                );
              }
              if (block.type === "quote") {
                return (
                  <blockquote
                    key={i}
                    className="relative rounded-2xl bg-muted/40 border-l-4 border-primary pl-6 pr-5 py-4 text-foreground/85 italic text-lg leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: sanitize(block.text) }}
                  />
                );
              }
              if (block.type === "example") {
                return (
                  <div
                    key={i}
                    className="rounded-2xl border border-accent/25 bg-accent/5 p-5 md:p-6 text-base leading-relaxed text-foreground/90 [&_strong]:text-foreground [&_p]:mb-2 last:[&_p]:mb-0"
                    dangerouslySetInnerHTML={{ __html: sanitize(block.text) }}
                  />
                );
              }
              if (block.type === "table") {
                const headers = block.headers ?? [];
                const rows = block.rows ?? [];
                if (!rows.length && !headers.length) return null;
                return (
                  <div key={i} className="my-2 overflow-x-auto rounded-xl border border-border bg-card/40">
                    <table className="w-full text-sm">
                      {headers.length > 0 && (
                        <thead className="bg-muted/70">
                          <tr className="border-b border-border">
                            {headers.map((h, k) => (
                              <th
                                key={k}
                                className="p-3.5 text-left font-semibold text-foreground align-bottom"
                                dangerouslySetInnerHTML={{ __html: sanitize(h) }}
                              />
                            ))}
                          </tr>
                        </thead>
                      )}
                      <tbody>
                        {rows.map((row, r) => (
                          <tr
                            key={r}
                            className="border-b border-border/50 last:border-b-0 hover:bg-muted/30 transition-colors"
                          >
                            {row.map((cell, c) => (
                              <td
                                key={c}
                                className="p-3.5 align-top text-foreground/85"
                                dangerouslySetInnerHTML={{ __html: sanitize(cell) }}
                              />
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
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
                  <div key={i} className="mt-4">
                    <div className="flex items-center gap-2 mb-3 text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                      <HelpCircle className="w-3.5 h-3.5" />
                      Частые вопросы
                    </div>
                    <Accordion
                      type="single"
                      collapsible
                      className="rounded-2xl border border-border bg-card/50 divide-y divide-border overflow-hidden"
                    >
                      {items.map((it, j) => (
                        <AccordionItem key={j} value={`item-${j}`} className="border-none">
                          <AccordionTrigger className="px-5 py-4 text-left font-medium hover:no-underline hover:bg-muted/40 transition-colors">
                            {it.q}
                          </AccordionTrigger>
                          <AccordionContent className="px-5 pb-4 text-foreground/85 leading-relaxed [&_a]:text-primary [&_a]:underline">
                            <div dangerouslySetInnerHTML={{ __html: sanitize(it.a) }} />
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  </div>
                );
              }
              return (
                <div
                  key={i}
                  className="text-[17px] leading-[1.75] text-foreground/85 [&_ul]:list-none [&_ul]:pl-0 [&_ul]:space-y-2 [&_ul>li]:relative [&_ul>li]:pl-6 [&_ul>li]:before:content-[''] [&_ul>li]:before:absolute [&_ul>li]:before:left-1 [&_ul>li]:before:top-[0.7em] [&_ul>li]:before:w-1.5 [&_ul>li]:before:h-1.5 [&_ul>li]:before:rounded-full [&_ul>li]:before:bg-primary/60 [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:space-y-2 [&_ol]:marker:text-primary/70 [&_ol]:marker:font-semibold [&_li]:text-foreground/85 [&_strong]:text-foreground [&_strong]:font-semibold [&_a]:text-primary [&_a]:underline [&_a]:underline-offset-2 [&_a]:decoration-primary/40 hover:[&_a]:decoration-primary [&_em]:text-foreground/90 [&_table]:block [&_table]:w-full [&_table]:my-5 [&_table]:overflow-x-auto [&_table]:rounded-xl [&_table]:border [&_table]:border-border [&_table]:text-sm [&_table]:bg-card/40 [&_thead]:bg-muted/70 [&_thead_tr]:border-b [&_thead_tr]:border-border [&_th]:p-3.5 [&_th]:text-left [&_th]:font-semibold [&_th]:text-foreground [&_th]:whitespace-nowrap [&_td]:p-3.5 [&_td]:align-top [&_td]:border-b [&_td]:border-border/50 [&_tbody_tr:last-child_td]:border-b-0 [&_tbody_tr:hover]:bg-muted/30 [&_tbody_tr]:transition-colors"
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
