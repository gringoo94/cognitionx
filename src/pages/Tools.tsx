import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import {
  Brain, BookOpen, Target, Leaf, Zap, Shield,
  AlertTriangle, Lightbulb, Compass, Heart, ArrowLeft, ExternalLink
} from "lucide-react";
import { Button } from "@/components/ui/button";

const tools = [
  {
    id: 1,
    title: "Диагностика депрессии и тревоги",
    description: "Оцените выраженность симптомов по 4 векторам: когнитивному, эмоциональному, физиологическому и поведенческому. Модель «горячий крест» для понимания связей.",
    icon: Brain,
    color: "from-blue-500/20 to-indigo-500/20",
    iconColor: "text-blue-500",
    tags: ["Депрессия", "Тревога", "Диагностика"],
  },
  {
    id: 2,
    title: "ABC-модель (ABCDE)",
    description: "Разберите ситуацию по модели Эллиса: активирующее событие → убеждение → последствия → диспутирование → новое убеждение.",
    icon: BookOpen,
    color: "from-violet-500/20 to-purple-500/20",
    iconColor: "text-violet-500",
    tags: ["Когнитивная терапия", "Убеждения"],
  },
  {
    id: 3,
    title: "SMART-цели",
    description: "Поставьте конкретные, измеримые, достижимые, релевантные и ограниченные по времени цели для терапии и жизни.",
    icon: Target,
    color: "from-emerald-500/20 to-teal-500/20",
    iconColor: "text-emerald-500",
    tags: ["Цели", "Планирование"],
  },
  {
    id: 4,
    title: "Изменение образа жизни",
    description: "Проанализируйте и спланируйте изменения в ключевых сферах: сон, питание, физическая активность, социальные связи.",
    icon: Leaf,
    color: "from-green-500/20 to-lime-500/20",
    iconColor: "text-green-500",
    tags: ["Образ жизни", "Привычки"],
  },
  {
    id: 5,
    title: "Поведенческая активация",
    description: "Тренинг поведенческой активации — отслеживание настроения, планирование активностей и построение позитивного цикла действий.",
    icon: Zap,
    color: "from-amber-500/20 to-orange-500/20",
    iconColor: "text-amber-500",
    tags: ["Активация", "Настроение"],
  },
  {
    id: 6,
    title: "Работа со страхами",
    description: "Постепенная экспозиция: составьте иерархию страхов и систематически работайте с каждым уровнем.",
    icon: Shield,
    color: "from-red-500/20 to-rose-500/20",
    iconColor: "text-red-500",
    tags: ["Фобии", "Экспозиция"],
  },
  {
    id: 7,
    title: "Контейнирование тревоги",
    description: "Техники для управления беспокойством: «время для тревоги», дерево решений, разделение продуктивного и непродуктивного беспокойства.",
    icon: AlertTriangle,
    color: "from-yellow-500/20 to-amber-500/20",
    iconColor: "text-yellow-500",
    tags: ["Тревога", "Управление"],
  },
  {
    id: 8,
    title: "Решение проблем",
    description: "Структурированный подход к решению жизненных проблем: определение, генерация решений, оценка и план действий.",
    icon: Lightbulb,
    color: "from-cyan-500/20 to-blue-500/20",
    iconColor: "text-cyan-500",
    tags: ["Проблемы", "Решения"],
  },
  {
    id: 9,
    title: "Оспаривание мыслей",
    description: "Выявление и оспаривание негативных автоматических мыслей. Когнитивные искажения и альтернативные интерпретации.",
    icon: Compass,
    color: "from-indigo-500/20 to-blue-500/20",
    iconColor: "text-indigo-500",
    tags: ["Мысли", "Когнитивные искажения"],
  },
  {
    id: 10,
    title: "План благополучия",
    description: "Создайте персональный план благополучия: ресурсы, сигналы ухудшения, стратегии поддержания и кризисный план.",
    icon: Heart,
    color: "from-pink-500/20 to-rose-500/20",
    iconColor: "text-pink-500",
    tags: ["Благополучие", "Профилактика"],
  },
];

const KNOWLEDGE_FORGE_URL = "https://knowledge-forge.lovable.app";

const Tools = () => {
  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="КПТ инструменты | Психолог Дмитрий Яцко"
        description="Бесплатные инструменты когнитивно-поведенческой терапии: дневник мыслей, трекер настроения, ABC-модель и другие техники КПТ."
        path="/tools"
        breadcrumbs={[
          { name: "Главная", url: "https://yatsko-psy.ru/" },
          { name: "Инструменты КПТ", url: "https://yatsko-psy.ru/tools" },
        ]}
      />
      <Navbar />

      <div className="max-w-6xl mx-auto px-6 py-12">
        <Link to="/">
          <Button variant="ghost" size="sm" className="gap-2 mb-8 text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-4 w-4" /> На главную
          </Button>
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-12"
        >
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">
            Инструменты <span className="text-primary">КПТ</span>
          </h1>
          <p className="mt-3 text-muted-foreground max-w-2xl">
            Интерактивные рабочие инструменты когнитивно-поведенческой терапии. 
            Каждый инструмент включает теорию, пошаговые инструкции, примеры и упражнение для самостоятельной работы.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {tools.map((tool, i) => (
            <motion.a
              key={tool.id}
              href={`${KNOWLEDGE_FORGE_URL}/dashboard/tool/${tool.id}`}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              className="group relative rounded-2xl border border-border/60 bg-card p-6 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300"
            >
              <div className={`inline-flex p-2.5 rounded-xl bg-gradient-to-br ${tool.color} mb-4`}>
                <tool.icon className={`h-5 w-5 ${tool.iconColor}`} />
              </div>

              <h3 className="font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                {tool.title}
              </h3>

              <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                {tool.description}
              </p>

              <div className="flex flex-wrap gap-1.5 mb-4">
                {tool.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-[11px] px-2 py-0.5 rounded-full bg-muted text-muted-foreground"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <span className="inline-flex items-center gap-1.5 text-sm text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                Открыть <ExternalLink className="h-3.5 w-3.5" />
              </span>
            </motion.a>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-16 text-center"
        >
          <div className="inline-flex flex-col items-center gap-4 rounded-2xl border border-border/60 bg-card p-8 max-w-lg">
            <Brain className="h-8 w-8 text-primary" />
            <h2 className="text-xl font-semibold text-foreground">Хотите работать с инструментами?</h2>
            <p className="text-sm text-muted-foreground">
              Зарегистрируйтесь в приложении, чтобы сохранять прогресс, получать обратную связь и работать с терапевтом.
            </p>
            <Button asChild>
              <a href={KNOWLEDGE_FORGE_URL} target="_blank" rel="noopener noreferrer" className="gap-2">
                Перейти в приложение <ExternalLink className="h-4 w-4" />
              </a>
            </Button>
          </div>
        </motion.div>
      </div>

      <Footer />
    </div>
  );
};

export default Tools;
