import { useEffect, useRef, useState } from 'react';

/**
 * Lazy-renders content when the placeholder enters the viewport
 * (plus a generous margin). Once rendered, stays rendered permanently.
 */
export function useLazySection(margin = 800) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (visible) return;
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: `0px 0px ${margin}px 0px` }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [visible, margin]);

  return { ref, visible };
}
