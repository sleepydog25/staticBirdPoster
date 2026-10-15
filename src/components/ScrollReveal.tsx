import { useEffect, useRef, type CSSProperties, type ReactNode } from 'react';
import { animation } from '../config/animation';

export function ScrollReveal({ children, className = '', direction = 'up', delay = 0 }: {
  children: ReactNode; className?: string; direction?: 'up' | 'left' | 'right'; delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    let observer: IntersectionObserver | undefined;
    const reveal = () => {
      element.classList.remove('reveal-pending');
      element.classList.add('is-visible');
      observer?.disconnect();
    };
    if (preference.matches || !('IntersectionObserver' in window)) return;
    element.classList.add('reveal-pending');
    observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) reveal();
    }, { threshold: animation.threshold });
    observer.observe(element);
    const onPreferenceChange = () => { if (preference.matches) reveal(); };
    preference.addEventListener('change', onPreferenceChange);
    return () => { observer?.disconnect(); preference.removeEventListener('change', onPreferenceChange); };
  }, []);
  return <div ref={ref} className={`reveal reveal-${direction} ${className}`} style={{ '--reveal-delay': `${delay}ms` } as CSSProperties}>{children}</div>;
}
