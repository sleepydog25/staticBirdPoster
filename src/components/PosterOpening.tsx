import { useLayoutEffect, useRef, useState, type ReactNode } from 'react';
import { asset } from './Illustration';
import { opening, rememberOpening, shouldShowOpening } from '../config/opening';
import { createOpening } from '../opening/createOpening';

export const travelers = [
  { id: 'leftGreen', file: 'leftUpGreen.svg', target: '.hero-leaves-left' },
  { id: 'rightGreen', file: 'rightUpGreen.svg', target: '.hero-leaves-right' },
  { id: 'leftFlower', file: 'leftFlower.svg', target: '.flower-white-large img' },
  { id: 'rightFlower', file: 'rightFlower.svg', target: '.flower-pink-large img' },
  { id: 'bird1', file: 'bird1.svg', target: '.swallow-one' },
  { id: 'bird2', file: 'bird2.svg', target: '.swallow-two' },
  { id: 'window', file: 'windowBird.svg', target: '.trap-window .illustration img' },
  { id: 'poison', file: 'poison.svg', target: '.trap-poison .illustration img' },
  // These two have no matching image in the existing poster. They dissolve
  // into its roaming topic and accessible HTML title, respectively.
  { id: 'cat', file: 'cat.svg', target: '.roaming-heading .illustration img' },
  { id: 'title', file: 'title.svg', target: '.poster-title' },
] as const;

export function PosterOpening({ children }: { children: ReactNode }) {
  const shell = useRef<HTMLDivElement>(null);
  const controller = useRef<ReturnType<typeof createOpening>>();
  const replayButton = useRef<HTMLButtonElement>(null);
  const [enabled, setEnabled] = useState(shouldShowOpening);
  const [reduced, setReduced] = useState(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches);

  useLayoutEffect(() => {
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    const onChange = () => {
      setReduced(preference.matches);
      if (preference.matches) {
        controller.current?.finish();
        setEnabled(false);
      }
    };
    preference.addEventListener('change', onChange);
    return () => preference.removeEventListener('change', onChange);
  }, []);

  useLayoutEffect(() => {
    if (!enabled || !shell.current) return;
    const instance = createOpening(shell.current, travelers, () => replayButton.current?.focus({ preventScroll: true }));
    controller.current = instance;
    return () => { instance.destroy(); controller.current = undefined; };
  }, [enabled]);

  function skip() {
    controller.current?.finish();
    rememberOpening();
    setEnabled(false);
    shell.current?.querySelector<HTMLElement>('.poster')?.focus({ preventScroll: true });
  }

  function replay() {
    if (reduced) return;
    if (enabled) controller.current?.replay();
    else {
      window.scrollTo({ top: 0, behavior: 'instant' });
      setEnabled(true);
    }
    requestAnimationFrame(() => shell.current?.querySelector<HTMLButtonElement>('.opening-skip')?.focus({ preventScroll: true }));
  }

  return <div ref={shell} className={`opening-shell${enabled ? ' opening-enabled' : ''}`}>
    <div className="opening-stage">
      {children}
      {enabled && <>
        <div className="opening-viewport" aria-hidden="true">
          {travelers.map(item => <img key={item.id} data-traveler={item.id} className="opening-traveler" src={asset(item.file)} alt="" />)}
          <div className="opening-welcome"><p className="opening-eyebrow">跟著一隻鳥</p><p className="opening-heading">發現城市裡的危險</p><p className="opening-instruction">向下滑動，開始探索 ↓</p></div>
          <p className="opening-caption" data-caption="window">看不見的玻璃，也可能是致命的障礙。</p>
          <p className="opening-caption" data-caption="cat">城市裡的遊蕩貓，也可能威脅野鳥的生存。</p>
          <p className="opening-caption" data-caption="poison">生活中使用的毒餌，也可能傷害其他野生動物。</p>
        </div>
        <div className="opening-controls">
          <span className="opening-step" aria-hidden="true">跟著一隻鳥，探索城市</span>
          <button type="button" className="opening-skip" onClick={skip}>跳過介紹</button>
          <span className="opening-progress" aria-hidden="true" />
        </div>
        <p className="opening-sr-only">跟著一隻鳥，發現城市裡的危險。向下捲動探索玻璃窗、遊蕩貓與毒餌對野鳥的威脅，或按「跳過介紹」直接閱讀互動海報。</p>
      </>}
    </div>
    {opening.enabled && !reduced && <button ref={replayButton} type="button" className="opening-replay" onClick={replay}>重播介紹</button>}
  </div>;
}
