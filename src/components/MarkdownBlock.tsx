import React from "react";
import ReactMarkdown, { type Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import BehavioralActivationDiary from "@/components/BehavioralActivationDiary";
import EmotionWheel from "@/components/EmotionWheel";
import RfcbtModesDiagram from "@/components/RfcbtModesDiagram";
import DecisionMatrixCta from "@/components/DecisionMatrixCta";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { HelpCircle } from "lucide-react";

/**
 * Renders a Markdown blog post body.
 *
 * Supports lightweight directive syntax authored inside .md files:
 *   ::component{#emotion-wheel}          — leaf, injects a registered component
 *   :::preface / :::quote / :::example / :::faq (JSON body) — container blocks
 *
 * Preprocessed to HTML wrapper divs, then rendered via react-markdown with
 * rehype-raw so inline HTML (<ul>, <strong>, <a>) inside the .md remains valid.
 */

const COMPONENTS: Record<string, React.FC<{ topic?: string }>> = {
  "behavioral-activation-diary": () => <BehavioralActivationDiary />,
  "emotion-wheel": () => <EmotionWheel />,
  "rfcbt-modes": () => <RfcbtModesDiagram />,
  "decision-matrix-cta": ({ topic }) => <DecisionMatrixCta topic={topic || ""} />,
};

function preprocess(md: string): string {
  let out = md;

  // Container directives: :::name\n...body...\n:::
  out = out.replace(
    /^:::(preface|quote|example|faq)\s*\n([\s\S]*?)\n:::\s*$/gm,
    (_m, name, body) => {
      // Encode body so it survives markdown parsing intact; we'll decode in the div renderer.
      const encoded = encodeURIComponent(body);
      return `<div data-block="${name}" data-body="${encoded}"></div>`;
    }
  );

  // Leaf directive: ::component{#id}
  out = out.replace(
    /^::component\{#([a-z0-9-]+)\}\s*$/gm,
    (_m, id) => `<div data-component="${id}"></div>`
  );

  return out;
}

interface Props {
  markdown: string;
  topic: string;
}

const MarkdownBlock = ({ markdown, topic }: Props) => {
  const processed = React.useMemo(() => preprocess(markdown), [markdown]);

  const components: Components = {
    // Directive dispatcher — react-markdown passes HTML attrs via props
    div: ({ node, ...props }: any) => {
      const compId = props["data-component"];
      if (compId && COMPONENTS[compId]) {
        const Comp = COMPONENTS[compId];
        return <Comp topic={topic} />;
      }
      const blockName = props["data-block"];
      const encoded = props["data-body"];
      if (blockName && typeof encoded === "string") {
        const body = decodeURIComponent(encoded);
        if (blockName === "preface") {
          return (
            <p
              data-speakable
              className="text-lg md:text-xl text-foreground/80 leading-relaxed font-light first-letter:text-5xl first-letter:font-serif first-letter:font-semibold first-letter:mr-2 first-letter:float-left first-letter:leading-[0.95] first-letter:text-primary"
              dangerouslySetInnerHTML={{ __html: body }}
            />
          );
        }
        if (blockName === "quote") {
          return (
            <blockquote
              className="relative rounded-2xl bg-muted/40 border-l-4 border-primary pl-6 pr-5 py-4 text-foreground/85 italic text-lg leading-relaxed"
              dangerouslySetInnerHTML={{ __html: body }}
            />
          );
        }
        if (blockName === "example") {
          return (
            <div
              className="rounded-2xl border border-accent/25 bg-accent/5 p-5 md:p-6 text-base leading-relaxed text-foreground/90 [&_strong]:text-foreground [&_p]:mb-2 last:[&_p]:mb-0"
              dangerouslySetInnerHTML={{ __html: body }}
            />
          );
        }
        if (blockName === "faq") {
          let items: Array<{ q: string; a: string }> = [];
          try {
            items = JSON.parse(body);
          } catch {
            items = [];
          }
          if (!items.length) return null;
          return (
            <div className="mt-4">
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
                      <div dangerouslySetInnerHTML={{ __html: it.a }} />
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          );
        }
      }
      return <div {...props} />;
    },
    h2: ({ node, ...props }) => (
      <h2
        className="relative font-bold tracking-tight text-2xl md:text-[28px] leading-tight mt-14 pt-2 pl-4 border-l-[3px] border-primary/70 scroll-mt-24"
        {...props}
      />
    ),
    h3: ({ node, ...props }) => (
      <h3
        className="font-semibold tracking-tight text-xl md:text-[22px] mt-8 text-foreground/95 scroll-mt-24"
        {...props}
      />
    ),
    table: ({ node, ...props }) => (
      <div className="my-2 overflow-x-auto rounded-xl border border-border bg-card/40">
        <table className="w-full text-sm" {...props} />
      </div>
    ),
    thead: (props) => <thead className="bg-muted/70" {...props} />,
    th: ({ node, ...props }) => (
      <th className="p-3.5 text-left font-semibold text-foreground align-bottom" {...props} />
    ),
    td: ({ node, ...props }) => (
      <td className="p-3.5 align-top text-foreground/85" {...props} />
    ),
    tr: ({ node, ...props }) => (
      <tr className="border-b border-border/50 last:border-b-0 hover:bg-muted/30 transition-colors" {...props} />
    ),
  };

  return (
    <div className="text-[17px] leading-[1.75] text-foreground/85 [&_p]:mb-4 [&_ul]:list-none [&_ul]:pl-0 [&_ul]:space-y-2 [&_ul>li]:relative [&_ul>li]:pl-6 [&_ul>li]:before:content-[''] [&_ul>li]:before:absolute [&_ul>li]:before:left-1 [&_ul>li]:before:top-[0.7em] [&_ul>li]:before:w-1.5 [&_ul>li]:before:h-1.5 [&_ul>li]:before:rounded-full [&_ul>li]:before:bg-primary/60 [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:space-y-2 [&_ol]:marker:text-primary/70 [&_ol]:marker:font-semibold [&_li]:text-foreground/85 [&_strong]:text-foreground [&_strong]:font-semibold [&_a]:text-primary [&_a]:underline [&_a]:underline-offset-2 [&_a]:decoration-primary/40 hover:[&_a]:decoration-primary [&_em]:text-foreground/90">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw]}
        components={components}
      >
        {processed}
      </ReactMarkdown>
    </div>
  );
};

export default MarkdownBlock;
