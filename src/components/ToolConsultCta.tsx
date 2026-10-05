import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { trackLead } from "@/lib/metaPixel";

/** Shared "discuss your result at a consultation" block for tool pages. */
const ToolConsultCta = ({ tool }: { tool: string }) => (
  <section className="max-w-3xl mx-auto px-6 py-12">
    <div className="rounded-2xl border border-border bg-card p-6 md:p-8 text-center">
      <h2 className="text-xl md:text-2xl font-bold">Разобрать результат с психологом</h2>
      <p className="text-muted-foreground mt-3 text-sm md:text-base">
        Инструмент помогает увидеть картину. На консультации разберём ваши записи и наметим план работы.
        50 минут — 45 €.
      </p>
      <Button asChild size="lg" className="gap-2 mt-6">
        <Link to="/booking" onClick={() => trackLead(`tool_cta_${tool}`, { content_category: "tools" })}>
          Записаться на консультацию <ArrowRight className="h-4 w-4" />
        </Link>
      </Button>
    </div>
  </section>
);

export default ToolConsultCta;
