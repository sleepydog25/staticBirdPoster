import { content } from '../data/content';
import { links } from '../config/links';
import { ScrollReveal } from './ScrollReveal';
import { Illustration, asset } from './Illustration';
import { ConfigurableLink } from './ConfigurableLink';
export function RescueSection() {
  const { rescue } = content;
  return <section className="rescue-section" aria-labelledby="rescue-title">
    <ScrollReveal className="rescue-art illustration" direction="right"><img src={asset('rightMiddle.svg')} width="1100" height="1324" alt="" /></ScrollReveal>
    <Illustration name="flowerPinkSmall.png" width={96} height={82} className="flower flower-pink-small" />
    <Illustration name="flowerPinkLarge.png" width={149} height={118} className="flower flower-pink-large" delay={120} />
    <Illustration name="flowerBud.png" width={91} height={77} className="flower flower-bud" delay={240} />
    <div className="rescue-copy">
      <div className="rescue-heading">
        <ScrollReveal><h2 id="rescue-title" className="outlined-title">{rescue.title}</h2></ScrollReveal>
        <Illustration name="littleBird.svg" delay={180} />
        <ScrollReveal delay={120}><h3><small>{rescue.eyebrow}</small>{rescue.subject}</h3></ScrollReveal>
      </div>
      <ScrollReveal delay={240}><div className="rescue-paragraphs">{rescue.paragraphs.map(p => <p key={p}>{p}</p>)}</div></ScrollReveal>
      <ScrollReveal delay={360}><ConfigurableLink url={links.rescueMap} className="map-link"><span className="search-symbol" aria-hidden="true" />{rescue.mapLabel}</ConfigurableLink></ScrollReveal>
    </div>
  </section>;
}
