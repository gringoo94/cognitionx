import { describe, it, expect } from "vitest";
import { extractBlogFaq, shouldShowWorkbook, relatedFromClusters } from "./blogSeo";

describe("blog SEO rules", () => {
  it("builds FAQ only from visible markdown questions", () => {
    const faq = extractBlogFaq({
      content: [{ type: "markdown", text: "Intro\n## Частые вопросы\n\n### Вопрос один?\n\nОтвет один.\n\n### Вопрос два?\n\nОтвет два.\n\n## Источники\n- x" }],
    });
    expect(faq).toEqual([
      { question: "Вопрос один?", answer: "Ответ один." },
      { question: "Вопрос два?", answer: "Ответ два." },
    ]);
  });
  it("reads single-question FAQ blocks", () => {
    expect(extractBlogFaq({ content: [{ type: "faq", text: "Да.", headers: ["Можно?"] }] })).toEqual([{ question: "Можно?", answer: "Да." }]);
  });
  it("shows the workbook on anxiety articles but not on decision articles", () => {
    expect(shouldShowWorkbook({ title: "Тревога без причины", tags: [] })).toBe(true);
    expect(shouldShowWorkbook({ title: "Переезжать или остаться", tags: ["Выбор"] })).toBe(false);
  });
  it("links overlapping anxiety articles together", () => {
    expect(relatedFromClusters("trevoga-bez-prichiny")).toContain("kak-izbavitsya-ot-trevogi");
  });
});
