import { content } from '../data/content';
import { ScrollReveal } from './ScrollReveal';
import { Illustration } from './Illustration';
export function EnvironmentTraps() {
  return <section className="traps-section" aria-labelledby="traps-title">
    <ScrollReveal className="traps-title"><h2 id="traps-title">{content.traps.title}</h2></ScrollReveal>
    <div className="traps-grid">{content.traps.items.map((item, i) => <article className={`trap trap-${item.id}`} key={item.id}>
      <Illustration name={item.asset} width={item.width} height={item.height} delay={i * 80} />
      <ScrollReveal delay={120}><h3>{item.title}</h3></ScrollReveal>
      <ScrollReveal delay={240}><p>{item.description}</p></ScrollReveal>
    </article>)}</div>
  </section>;
}
