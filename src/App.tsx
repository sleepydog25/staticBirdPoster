import { HeroSection } from './components/HeroSection';
import { HumanInterference } from './components/HumanInterference';
import { RescueSection } from './components/RescueSection';
import { EnvironmentTraps } from './components/EnvironmentTraps';
import { Footer } from './components/Footer';
import { PosterOpening } from './components/PosterOpening';
export default function App() {
  return <PosterOpening><main className="poster" id="interactive-poster" tabIndex={-1}><HeroSection /><div className="story-scene"><HumanInterference /><RescueSection /></div><EnvironmentTraps /><Footer /></main></PosterOpening>;
}
