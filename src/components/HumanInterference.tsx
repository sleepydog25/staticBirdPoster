import { content } from '../data/content';
import { ScrollReveal } from './ScrollReveal';
import { Illustration, asset } from './Illustration';
export function HumanInterference() {
  const { human, roaming } = content;
  return <>
    <section className="human-section" aria-labelledby="human-title">
      <ScrollReveal className="human-backdrop illustration" direction="left"><picture><source media="(max-width: 1023px)" srcSet={asset('leftMiddle-background.svg')} /><img src={asset('leftMiddle.svg')} width="1008" height="1196" alt="" /></picture></ScrollReveal>
      <Illustration name="flowerWhiteSmall.png" width={115} height={102} className="flower flower-white-small" />
      <Illustration name="flowerWhiteLarge.png" width={147} height={119} className="flower flower-white-large" delay={120} />
      <div className="human-copy">
        <ScrollReveal><h2 id="human-title" className="outlined-title">{human.title}</h2></ScrollReveal>
        <article className="photography">
          <ScrollReveal delay={120}><h3>{human.photography.title}<small>{human.photography.subtitle}</small></h3></ScrollReveal>
          <Illustration name="birdSong.svg" direction="left" delay={180} />
          <ScrollReveal delay={240}>{human.photography.paragraphs.map(p => <p key={p}>{p}</p>)}</ScrollReveal>
        </article>
        <article className="feeding">
          <div className="feeding-heading">
            <Illustration name="feedBird.svg" direction="left" />
            <ScrollReveal delay={120}><h3>{human.feeding.title}<small>{human.feeding.subtitle}</small></h3></ScrollReveal>
          </div>
          <ScrollReveal delay={240}>{human.feeding.paragraphs.map(p => <p key={p}>{p}</p>)}</ScrollReveal>
        </article>
        <Illustration name="owl.svg" width={420} height={500} className="mobile-owl" direction="right" />
      </div>
    </section>
    <section className="roaming-section" aria-labelledby="roaming-title">
      <ScrollReveal><h2 id="roaming-title" className="outlined-title">{roaming.title}</h2></ScrollReveal>
      <div className="roaming-heading">
        <ScrollReveal delay={120}><h3>{roaming.action}<small>{roaming.subtitle}</small></h3></ScrollReveal>
        <Illustration name="dogEatFood.svg" direction="right" delay={180} />
      </div>
      <ScrollReveal delay={240}>{roaming.paragraphs.map(p => <p key={p}>{p}</p>)}</ScrollReveal>
    </section>
  </>;
}
