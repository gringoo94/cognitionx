import type { BlogPost } from "@/data/blogPosts";

export interface FaqItem {
  question: string;
  answer: string;
}

const clean = (s: string) =>
  s
    .replace(/<[^>]+>/g, " ")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/[*_`>]+/g, "")
    .replace(/\s+/g, " ")
    .trim();

/** FAQ schema is built only from questions visible on the page. */
export function extractBlogFaq(post: Pick<BlogPost, "content">): FaqItem[] {
  const items: FaqItem[] = [];
  for (const block of post.content) {
    if (block.type === "faq") {
      if (block.headers?.[0]) {
        items.push({ question: clean(block.headers[0]), answer: clean(block.text) });
        continue;
      }
      try {
        const arr = JSON.parse(block.text);
        if (Array.isArray(arr)) {
          for (const it of arr) if (it?.q && it?.a) items.push({ question: clean(it.q), answer: clean(it.a) });
        }
      } catch {
        /* not JSON */
      }
    }
    if (block.type === "markdown") {
      const m = block.text.match(/\n##\s*(Частые вопросы|FAQ|Вопросы и ответы)[^\n]*\n([\s\S]*?)(?=\n##\s|$)/i);
      if (!m) continue;
      const parts = m[2].split(/\n###\s+/).slice(1);
      for (const part of parts) {
        const [q, ...rest] = part.split("\n");
        const answer = clean(rest.join(" "));
        if (q.trim() && answer) items.push({ question: clean(q), answer });
      }
    }
  }
  return items.filter((i) => i.question && i.answer);
}

const WORKBOOK_RE =
  /(КПТ|депресс|тревог|тревож|паник|руминац|мысл|искажен|ярлык|поведенческ|апати|ничего не хочется|нет сил|самокрит|избегани|выгоран)/i;

/** Show the CBT Workbook block on articles about CBT, mood, anxiety and thinking patterns. */
export function shouldShowWorkbook(post: Pick<BlogPost, "title" | "tags">): boolean {
  return WORKBOOK_RE.test([post.title, ...(post.tags || [])].join(" "));
}

/** Overlapping topics link to each other so search engines see one main page per intent. */
export const RELATED_CLUSTERS: string[][] = [
  ["kak-izbavitsya-ot-trevogi", "povyshennaya-trevozhnost", "trevoga-bez-prichiny", "trevozhnost-simptomy-proverka", "kpt-pri-trevoge"],
  ["panicheskaya-ataka-chto-delat", "pristup-trevogi-chto-delat", "kak-uspokoitsya", "somaticheskie-simptomy-trevogi"],
  ["kak-ponyat-chto-u-menya-depressiya", "kpt-pri-depressii", "shkala-beka-bdi", "depressiya-ili-vygoranie", "kogda-nichego-ne-hochetsya"],
  ["vygoranie-simptomy-vosstanovlenie", "depressiya-ili-vygoranie", "utrom-net-sil-zhit"],
  ["kpt-polnyj-gajd", "5-principov-kpt", "dokazatelnaya-baza-kpt", "10-mifov-o-kpt", "skolko-dlitsya-kpt"],
  ["kpt-vs-psihoanaliz", "ontologiya-psihoterapii", "kpt-polnyj-gajd"],
  ["sotsialnaya-trevozhnost", "malenkie-pobedy-ekspozicii", "trevoga-pered-vstrechej"],
  ["kak-vybrat-psihologa", "pervaya-sessiya-u-psihologa", "granicy-samopomoshchi"],
  ["lovushka-yarlykov", "kognitivnyj-barjer-vera-v-istinnost", "kto-tebe-eto-skazal", "lovushka-dolzhen"],
];

export function relatedFromClusters(slug: string, limit = 3): string[] {
  const out: string[] = [];
  for (const c of RELATED_CLUSTERS) {
    if (!c.includes(slug)) continue;
    for (const s of c) if (s !== slug && !out.includes(s)) out.push(s);
  }
  return out.slice(0, limit);
}
