import { asset } from './Illustration';
export function FlyingBirds() {
  return <div className="flying-birds" aria-hidden="true">
    <img className="swallow swallow-one" src={asset('bird1.svg')} width="214" height="154" alt="" />
    <img className="swallow swallow-two" src={asset('bird2.svg')} width="150" height="107" alt="" />
  </div>;
}
