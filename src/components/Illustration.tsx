import { ScrollReveal } from './ScrollReveal';
export const asset = (name: string) => `${import.meta.env.BASE_URL}assets/${name}`;
export function Illustration({ name, width = 353, height = 263, className = '', direction = 'up', delay = 0 }: {
  name: string; width?: number; height?: number; className?: string; direction?: 'up' | 'left' | 'right'; delay?: number;
}) {
  return <ScrollReveal className={`illustration ${className}`} direction={direction} delay={delay}><img src={asset(name)} width={width} height={height} alt="" decoding="async" /></ScrollReveal>;
}
