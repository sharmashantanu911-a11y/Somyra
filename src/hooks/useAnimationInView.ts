import { useRef, useEffect } from 'react';

export function useAnimationInView<T extends HTMLElement = HTMLDivElement>(once = true) {
  const ref = useRef<T>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        el.dataset.inview = 'true';
        if (once) observer.unobserve(el);
      }
    }, { threshold: 0.1 });
    observer.observe(el);
    return () => observer.disconnect();
  }, [once]);
  return ref;
}
