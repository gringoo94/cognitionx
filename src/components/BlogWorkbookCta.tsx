import { Link } from "react-router-dom";
import { BookOpen, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const BlogWorkbookCta = () => (
  <aside className="my-10 rounded-2xl border border-accent/25 bg-accent/5 p-6 md:p-7">
    <div className="flex items-center gap-2 text-xs font-medium text-accent">
      <BookOpen className="w-4 h-4" /> Рабочая тетрадь КПТ
    </div>
    <p className="mt-2 text-lg font-semibold tracking-tight">
      Хотите не только понимать, но и практиковать?
    </p>
    <p className="mt-1 text-sm text-muted-foreground leading-relaxed">
      Онлайн-тетрадь с упражнениями КПТ при депрессии, тревоге и панических атаках: дневник мыслей,
      планирование активности и проверка убеждений шаг за шагом — прямо на телефоне или компьютере.
    </p>
    <Button asChild variant="outline" className="mt-4">
      <Link to="/cbtworkbook">
        Посмотреть тетрадь <ArrowRight className="w-4 h-4" />
      </Link>
    </Button>
  </aside>
);

export default BlogWorkbookCta;
