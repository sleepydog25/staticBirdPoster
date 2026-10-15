import { content } from '../data/content';
import { FlyingBirds } from './FlyingBirds';
import { asset } from './Illustration';
export function HeroSection() {
  return <header className="hero">
    <img className="hero-leaves hero-leaves-left" src={asset('leftUpGreen.svg')} width="901" height="512" alt="" />
    <img className="hero-leaves hero-leaves-right" src={asset('rightUpGreen.svg')} width="705" height="492" alt="" />
    <img className="hero-hand" src={asset('hand.svg')} width="1670" height="747" alt="" />
    <FlyingBirds />
    <div className="hero-copy">
      <h1 className="poster-title" aria-label={content.hero.title.join('')}>
        {content.hero.title.map((line, i) => <span key={line} className={`title-line title-line-${i + 1}`} aria-hidden="true">{line}</span>)}
      </h1>
      <p className="hero-subtitle">{content.hero.subtitle}</p>
      <p className="hero-introduction">{content.hero.introduction}</p>
    </div>
  </header>;
}
