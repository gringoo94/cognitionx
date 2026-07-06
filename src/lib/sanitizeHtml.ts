import DOMPurify from "dompurify";

const ALLOWED_TAGS = ["a", "b", "br", "em", "i", "li", "ol", "p", "strong", "u", "ul", "table", "thead", "tbody", "tr", "th", "td"];
const ALLOWED_ATTR = ["href", "target", "rel", "colspan", "rowspan", "scope"];
// Allow only http, https, mailto, tel protocols (and relative URLs).
const ALLOWED_URI_REGEXP = /^(?:(?:https?|mailto|tel):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i;

let hookInstalled = false;

const installHook = () => {
  if (hookInstalled || typeof window === "undefined") return;
  DOMPurify.addHook("afterSanitizeAttributes", (node) => {
    if (!(node instanceof Element)) return;
    if (node.tagName === "A") {
      const href = node.getAttribute("href") || "";
      const isExternal = /^https?:\/\//i.test(href) && !href.includes(window.location.host);
      if (isExternal) {
        node.setAttribute("target", "_blank");
        node.setAttribute("rel", "noopener noreferrer");
      }
    }
  });
  hookInstalled = true;
};

export const sanitizeHtml = (html: string): string => {
  if (!html) return "";
  installHook();
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS,
    ALLOWED_ATTR,
    ALLOWED_URI_REGEXP,
    ALLOW_DATA_ATTR: false,
  }) as unknown as string;
};

export default sanitizeHtml;
