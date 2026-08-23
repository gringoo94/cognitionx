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

  return (
    <div ref={ref} id={id} style={visible ? undefined : { minHeight }}>
      {visible ? <Suspense fallback={null}>{children}</Suspense> : null}
    </div>
  );
};

export default LazySection;
