export type ToolFaqItem = { question: string; answer: string };

/** Plain visible FAQ (no collapsed content) so prerendered HTML matches FAQPage schema. */
const ToolFaq = ({ items, title = "Частые вопросы" }: { items: ToolFaqItem[]; title?: string }) => (
  <section className="mt-12">
    <h2 className="text-xl font-semibold text-foreground">{title}</h2>
    <div className="mt-4 space-y-5">
      {items.map((f) => (
        <div key={f.question}>
          <h3 className="text-base font-semibold text-foreground">{f.question}</h3>
          <p className="mt-1 text-muted-foreground leading-relaxed">{f.answer}</p>
        </div>
      ))}
    </div>
  </section>
);

export default ToolFaq;
