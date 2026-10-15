import { HeroSection } from './components/HeroSection';
import { HumanInterference } from './components/HumanInterference';
import { RescueSection } from './components/RescueSection';
import { EnvironmentTraps } from './components/EnvironmentTraps';
import { Footer } from './components/Footer';
export default function App() {
  return <main className="poster"><HeroSection /><div className="story-scene"><HumanInterference /><RescueSection /></div><EnvironmentTraps /><Footer /></main>;
}
