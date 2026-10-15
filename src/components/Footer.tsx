import { content } from '../data/content';
import { links } from '../config/links';
import { ScrollReveal } from './ScrollReveal';
import { ConfigurableLink } from './ConfigurableLink';
export function Footer() {
  return <footer className="footer">
    <ScrollReveal><h2>{content.footer.title}</h2></ScrollReveal>
    <ul>{content.footer.organizations.map((item, i) => <li key={item.key}><ScrollReveal delay={i * 80}><ConfigurableLink url={links.references[item.key]}>{item.name}</ConfigurableLink></ScrollReveal></li>)}</ul>
  </footer>;
}
