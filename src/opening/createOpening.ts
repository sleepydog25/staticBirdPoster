import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { opening, rememberOpening } from '../config/opening';

gsap.registerPlugin(ScrollTrigger);

type Traveler = { readonly id: string; readonly target: string };
type Box = { x: number; y: number; width: number; height: number };

/** Only this controller owns pinning and temporary styles. The poster is never cloned. */
export function createOpening(shell: HTMLElement, travelers: readonly Traveler[], onHandoffFocus: () => void) {
  const stage = shell.querySelector<HTMLElement>('.opening-stage')!;
  const poster = shell.querySelector<HTMLElement>('.poster')!;
  const viewport = shell.querySelector<HTMLElement>('.opening-viewport')!;
  const controls = shell.querySelector<HTMLElement>('.opening-controls')!;
  const skip = shell.querySelector<HTMLButtonElement>('.opening-skip')!;
  const originals = travelers.filter(item => !['cat', 'title'].includes(item.id))
    .map(item => poster.querySelector<HTMLElement>(item.target)!);
  let context: gsap.Context | undefined;
  let trigger: ScrollTrigger | undefined;
  let timeline: gsap.core.Timeline | undefined;
  let destroyed = false;
  let resizeFrame = 0;
  let building = false;
  let completed: boolean | undefined;
  let refreshFocus: HTMLElement | null = null;
  let lastWidth = 0;
  let lastHeight = 0;
  let lastPosterHeight = 0;
  let stableProgress = 0;
  let stableEnd = 0;

  function interaction(complete: boolean) {
    if (completed === complete) return;
    shell.classList.toggle('opening-active', !complete);
    shell.classList.toggle('opening-assembled', complete);
    poster.inert = !complete;
    if (complete) poster.removeAttribute('aria-hidden');
    else poster.setAttribute('aria-hidden', 'true');
    controls.hidden = complete;
    if (complete && !completed) {
      rememberOpening();
      // Every reveal has already been presented by the assembly sequence.
      poster.querySelectorAll('.reveal').forEach(element => element.classList.remove('reveal-pending'));
      if (controls.contains(document.activeElement)) onHandoffFocus();
    }
    completed = complete;
  }

  function build() {
    if (destroyed || building) return;
    building = true;
    const previousEnd = stableEnd;
    const previousProgress = stableProgress;
    const previousScroll = window.scrollY;
    const focused = shell.contains(document.activeElement) ? document.activeElement as HTMLElement : null;
    context?.revert();
    interaction(false);
    // Measure only at setup/resize/load. Never read layout on scroll frames.
    // Paused CSS motion and cleared GSAP styles give the actual responsive layout.
    const root = poster.getBoundingClientRect();
    const width = stage.clientWidth;
    const height = viewport.clientHeight;
    const posterHeight = poster.offsetHeight;
    lastWidth = width;
    lastHeight = height;
    lastPosterHeight = posterHeight;
    const mobile = width < 768;
    const fit = Math.min(1, (height - 40) / posterHeight);
    const insetX = (width - root.width * fit) / 2;
    const insetY = 20;
    const boxes: Record<string, Box> = {};
    for (const item of travelers) {
      const rect = poster.querySelector<HTMLElement>(item.target)!.getBoundingClientRect();
      boxes[item.id] = { x: rect.left - root.left, y: rect.top - root.top, width: rect.width, height: rect.height };
    }

    context = gsap.context(() => {
      const images: Record<string, HTMLImageElement> = {};
      const pose = (id: string, x: number, y: number, visualWidth: number, rotation = 0) => {
        const box = boxes[id];
        const scale = visualWidth / box.width;
        return { x: width * x - visualWidth / 2, y: height * y - box.height * scale / 2, scale, rotation };
      };
      const destination = (id: string) => ({ x: insetX + boxes[id].x * fit, y: insetY + boxes[id].y * fit, scale: fit, rotation: 0 });
      for (const item of travelers) {
        images[item.id] = shell.querySelector<HTMLImageElement>(`[data-traveler="${item.id}"]`)!;
        gsap.set(images[item.id], { width: boxes[item.id].width, height: boxes[item.id].height, transformOrigin: '0 0', autoAlpha: 0 });
      }
      gsap.set(originals, { visibility: 'hidden' });
      gsap.set(poster, { scale: fit, y: insetY, opacity: 0, transformOrigin: '50% 0' });
      gsap.set(shell.querySelectorAll('.opening-caption'), { autoAlpha: 0, y: 12 });
      const birdWidth = mobile ? 104 : Math.min(180, width * .14);
      const greenWidth = mobile ? width * .85 : width * .43;
      const flowerWidth = mobile ? 100 : 155;
      const threatWidth = mobile ? Math.min(240, width * .66) : Math.min(360, width * .3);
      gsap.set(images.leftGreen, { ...pose('leftGreen', .12, .12, greenWidth), autoAlpha: 1 });
      gsap.set(images.rightGreen, { ...pose('rightGreen', .9, .1, greenWidth * .85), autoAlpha: 1 });
      gsap.set(images.leftFlower, { ...pose('leftFlower', .1, .83, flowerWidth), autoAlpha: 1 });
      gsap.set(images.rightFlower, { ...pose('rightFlower', .9, .81, flowerWidth * 1.3), autoAlpha: 1 });
      gsap.set(images.bird1, { ...pose('bird1', .46, .4, birdWidth), autoAlpha: 1 });
      gsap.set(images.bird2, pose('bird2', .16, .32, birdWidth * .24));
      gsap.set(images.window, pose('window', mobile ? .26 : .18, .43, threatWidth * .85));
      gsap.set(images.cat, pose('cat', .86, .44, threatWidth * .6));
      gsap.set(images.poison, pose('poison', .5, .51, threatWidth * .62));
      gsap.set(images.title, pose('title', .5, .35, mobile ? width * .78 : Math.min(490, width * .4)));

      const tl = gsap.timeline({ paused: true, defaults: { ease: 'none' } });
      timeline = tl;
      // Scene 1: curved flight in two eased arcs, three parallax depths.
      tl.to(images.bird1, { ...pose('bird1', .6, .27, birdWidth * .92, -5), duration: .48, ease: 'sine.inOut' }, 0)
        .to(images.bird1, { ...pose('bird1', mobile ? .76 : .8, .25, birdWidth * .75, 4), duration: .52, ease: 'sine.inOut' }, .48)
        .to(images.bird2, { ...pose('bird2', .29, .22, birdWidth * .52, -3), autoAlpha: 1, duration: .7 }, .25)
        .to(images.leftGreen, { ...pose('leftGreen', mobile ? -.12 : -.04, .44, greenWidth), duration: 1.6 }, 0)
        .to(images.rightGreen, { ...pose('rightGreen', 1.08, -.12, greenWidth * .85), duration: 1.6 }, 0)
        .to(images.leftFlower, { ...pose('leftFlower', .03, .9, flowerWidth * 1.1, -4), duration: 1.7 }, 0)
        .to(images.rightFlower, { ...pose('rightFlower', .97, .87, flowerWidth * 1.4, 4), duration: 1.7 }, 0)
        .to('.opening-welcome', { autoAlpha: 0, y: -20, duration: .25 }, .08);

      // Scene 2: one readable threat at a time; the bird stays in view.
      const threat = (id: string, start: number, end: number, size: number) => {
        tl.to(images[id], { ...pose(id, .5, .43, size), autoAlpha: 1, duration: .08, ease: 'sine.out' }, start)
          .to(`[data-caption="${id}"]`, { autoAlpha: 1, y: 0, duration: .07 }, start + .025)
          .to(`[data-caption="${id}"]`, { autoAlpha: 0, y: -8, duration: .06 }, end - .06)
          .to(images[id], { autoAlpha: 0, duration: .06 }, end - .06);
      };
      threat('window', 1, 1.33, threatWidth);
      threat('cat', 1.34, 1.66, threatWidth * .64);
      threat('poison', 1.67, 2, threatWidth * .72);
      tl.to(images.bird1, { ...pose('bird1', mobile ? .79 : .76, .18, birdWidth * .62, -3), duration: 1 }, 1)
        .to(images.bird2, { ...pose('bird2', .19, .19, birdWidth * .4, 3), duration: 1 }, 1);

      // Scene 3: the live poster fades in at overview scale. Travelers land on
      // measured source rectangles, then their originals take over at 2.6.
      tl.to(poster, { opacity: 1, duration: .35 }, 2.1)
        .fromTo('.human-backdrop', { x: -root.width * .12, opacity: 0 }, { x: 0, opacity: 1, duration: .45 }, 2.08)
        .fromTo('.rescue-art', { x: root.width * .12, opacity: 0 }, { x: 0, opacity: 1, duration: .45 }, 2.08);
      for (const item of travelers.filter(item => !['cat', 'title'].includes(item.id))) {
        tl.to(images[item.id], { ...destination(item.id), autoAlpha: 1, duration: .6, ease: 'sine.inOut' }, 2);
      }
      tl.to(images.title, { autoAlpha: 1, duration: .12 }, 2)
        .to(images.title, { ...destination('title'), duration: .45, ease: 'sine.inOut' }, 2.15)
        .fromTo('.poster-title', { opacity: 0 }, { opacity: 1, duration: .12 }, 2.48)
        .to(images.title, { autoAlpha: 0, duration: .12 }, 2.48)
        .set(originals, { visibility: 'visible' }, 2.6)
        .set(Object.values(images), { autoAlpha: 0 }, 2.6)
        // Zoom the SAME DOM to its ordinary reading size before releasing pin.
        .to(poster, { scale: 1, y: 0, duration: .32, ease: 'sine.inOut' }, 2.68)
        .fromTo('.opening-progress', { scaleX: 0 }, { scaleX: 1, duration: 3 }, 0);

      trigger = ScrollTrigger.create({
        id: 'poster-opening', trigger: stage, pin: stage, start: 'top top',
        end: () => `+=${viewport.clientHeight * opening.scrollScreens}`,
        animation: tl, scrub: true, invalidateOnRefresh: true,
        onRefreshInit: () => {
          refreshFocus = stage.contains(document.activeElement) ? document.activeElement as HTMLElement : null;
        },
        onRefresh: () => {
          if (refreshFocus?.isConnected && !refreshFocus.closest('[inert]')) refreshFocus.focus({ preventScroll: true });
          refreshFocus = null;
        },
        onUpdate: self => {
          // A browser resize may refresh ScrollTrigger before ResizeObserver.
          // Keep the last progress measured against the old dimensions until
          // our responsive rebuild has installed all new positions.
          if (building || stage.clientWidth !== lastWidth || viewport.clientHeight !== lastHeight) return;
          stableProgress = self.progress;
          stableEnd = self.end;
          interaction(self.progress >= 1);
        },
      });
    }, shell);

    trigger!.refresh();
    // Keep progress on orientation/width changes; retain position in the article
    // if resizing after handoff. Context reversion removes the old pin spacer.
    if (previousEnd) {
      const nextScroll = previousProgress < 1
        ? trigger!.start + previousProgress * (trigger!.end - trigger!.start)
        : trigger!.end + Math.max(0, previousScroll - previousEnd);
      window.scrollTo({ top: nextScroll, behavior: 'instant' });
    }
    trigger!.update();
    timeline!.progress(previousEnd ? previousProgress : trigger!.progress);
    interaction(trigger!.progress >= 1);
    stableProgress = trigger!.progress;
    stableEnd = trigger!.end;
    building = false;
    // Unwrapping/re-wrapping a pin spacer can temporarily detach focused nodes.
    if (focused?.isConnected && !focused.closest('[inert]')) focused.focus({ preventScroll: true });
  }

  function requestMeasure() {
    cancelAnimationFrame(resizeFrame);
    resizeFrame = requestAnimationFrame(() => {
      if (destroyed) return;
      if (stage.clientWidth !== lastWidth || viewport.clientHeight !== lastHeight || poster.offsetHeight !== lastPosterHeight) build();
      else trigger?.refresh();
    });
  }

  build();
  const observer = new ResizeObserver(requestMeasure);
  observer.observe(poster);
  observer.observe(viewport);
  window.addEventListener('resize', requestMeasure);
  // SVGs with intrinsic dimensions and late font loading can change targets.
  const loadingImages = Array.from(poster.querySelectorAll('img')).filter(img => !img.complete);
  loadingImages.forEach(img => img.addEventListener('load', requestMeasure));
  document.fonts.ready.then(() => { if (!destroyed) requestMeasure(); });

  return {
    finish() {
      timeline?.progress(1);
      window.scrollTo({ top: trigger?.end ?? 0, behavior: 'instant' });
      trigger?.update();
      interaction(true);
      // Removing the introduction also removes its spacer. Compensate now so
      // skip and a live reduced-motion change both land at the poster's top.
      context?.revert();
      context = undefined;
      trigger = undefined;
      window.scrollTo({ top: 0, behavior: 'instant' });
    },
    replay() {
      window.scrollTo({ top: trigger?.start ?? 0, behavior: 'instant' });
      trigger?.update();
      interaction(false);
      skip.focus({ preventScroll: true });
    },
    destroy() {
      destroyed = true;
      cancelAnimationFrame(resizeFrame);
      observer.disconnect();
      window.removeEventListener('resize', requestMeasure);
      loadingImages.forEach(img => img.removeEventListener('load', requestMeasure));
      context?.revert();
      poster.inert = false;
      poster.removeAttribute('aria-hidden');
      shell.classList.remove('opening-active', 'opening-assembled');
    },
  };
}
