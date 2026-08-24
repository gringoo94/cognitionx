import { Suspense, useEffect, useRef, useState, type ReactNode } from "react";

/**
 * Renders (and therefore downloads) a below-the-fold section only when it is
 * about to enter the viewport. Cuts initial JS execution → lower TBT / faster INP.
 *
 * A min-height placeholder reserves space so deferred mounting doesn't cause CLS.
 */
const LazySection = ({
  children,
  minHeight = 480,
  rootMargin = "600px",
  id,
}: {
  children: ReactNode;
  minHeight?: number;
  rootMargin?: string;
  id?: string;
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  // Когда секцию открыли по якорю (#booking), нужно доскроллить после монтирования.
  const pendingScroll = useRef(false);

  useEffect(() => {
    if (visible) return;
    const el = ref.current;
    if (!el) return;

    // No IntersectionObserver (old browsers / prerender) → render immediately.
    if (typeof IntersectionObserver === "undefined") {
      setVisible(true);
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setVisible(true);
          io.disconnect();
        }
      },
      { rootMargin },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [visible, rootMargin]);

  // Якорные ссылки (#booking, #approach…) должны работать даже до монтирования:
  // wrapper несёт id, поэтому браузер находит цель, а мы монтируем контент
  // и корректируем позицию, когда реальная высота секции станет известна.
  useEffect(() => {
    if (!id) return;
    const matches = () =>
      typeof window !== "undefined" && window.location.hash === `#${id}`;

    const activate = () => {
      if (!matches()) return;
      pendingScroll.current = true;
      setVisible(true);
      ref.current?.scrollIntoView({ block: "start", behavior: "smooth" });
    };

    activate();
    window.addEventListener("hashchange", activate);
    return () => window.removeEventListener("hashchange", activate);
  }, [id]);

  useEffect(() => {
    if (!visible || !pendingScroll.current) return;
    pendingScroll.current = false;
    // Пара кадров, чтобы секция успела отрисоваться в реальную высоту.
    const t = window.setTimeout(() => {
      ref.current?.scrollIntoView({ block: "start", behavior: "smooth" });
    }, 250);
    return () => window.clearTimeout(t);
  }, [visible]);

  return (
    <div ref={ref} id={visible ? undefined : id} style={visible ? undefined : { minHeight }}>
      {visible ? <Suspense fallback={null}>{children}</Suspense> : null}
    </div>
  );
};

export default LazySection;
