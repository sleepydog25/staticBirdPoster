# Scroll-driven poster opening

## Integration

The existing React/Vite poster remains mounted once, with its original sections,
responsive CSS, content, `ConfigurableLink`, and bird keyframes. `PosterOpening`
wraps that DOM in a pinned stage. There is no replacement page, screenshot,
router transition, or separately positioned replica of the poster.

The original is a long responsive document rather than a single viewport poster.
Assembly therefore briefly shows an overview of its actual current layout, then
zooms the same DOM back to normal reading size. The mobile overview is necessarily
narrower because its existing sections stack vertically; it is a transition,
not a reading view. Mobile flight paths and illustration sizes are separately
adjusted. The original breakpoints (767/768/1023px) remain unchanged.

## Timeline

`createOpening.ts` creates one GSAP timeline and one ScrollTrigger with `pin`,
`scrub: true`, and `invalidateOnRefresh`. Timeline units run from 0 to 3;
the default scroll distance is three stable viewport heights (`100svh`, with
`100vh` fallback). `scrub: true` has no timed catch-up: stop to pause, scroll up
to reverse, including after reaching the poster.

| Scroll distance | Behavior |
| --- | --- |
| 0–100svh | Two curved bird-flight segments; distant second bird; independent plant and foreground-flower movement; instruction fades. |
| 100–200svh | Window, cat, poison in sequence. Each illustration and caption fades in, holds, then fades away. Both birds remain visible. |
| 200–260svh | Live poster fades into an overview; middle backgrounds enter; plants, flowers, birds, window and poison land on their measured original positions. `title.svg` approaches the HTML title and crossfades into it. |
| 260–268svh | Completed overview holds briefly. Temporary illustration layers are hidden. |
| 268–300svh | The actual poster scales to 1 and translates to 0. |
| 300svh onward | Pin releases at the exact reading position. Pointer and keyboard interactions resume; original CSS bird animations restart. |

Only ten small temporary image layers are used for free movement outside the
poster's nested clipping, masks, grids, and reveal wrappers. Their target boxes
come from `getBoundingClientRect()` on actual responsive elements. Original
images are hidden during travel and revealed at the same coordinates at 260svh.
Temporary layers have no pointer events and are hidden after assembly. They
remain mounted only to support reverse scrolling and replay. The cat has no
original poster image slot and fades out after its threat segment; the existing
dog illustration remains unchanged. The HTML title is retained for accessibility.

The original one-shot `ScrollReveal` animations are held visible during assembly,
which already presents their content. They are not replayed during the handoff.
When the opening is bypassed, normal Intersection Observer reveals are unchanged.

## Lifecycle and accessibility

- The poster is `inert` and `aria-hidden` while illustrations move. Skip remains
  keyboard accessible; an accessible static introduction describes the story.
- Skip works at any progress, reverts pin/styles, removes the scroll spacer,
  lands at the original poster, and focuses it. No page reload occurs.
- Replay clears scroll position and focuses Skip. Focus is preserved across
  ScrollTrigger refreshes, which temporarily detach and reattach the pinned DOM.
- `prefers-reduced-motion: reduce` bypasses the opening. Changing the preference
  mid-story also unpins and reveals the poster. Replay respects this preference.
- Completion and skip set a sessionStorage flag. Storage failures are tolerated.
  Direct fragment links bypass the introduction.
- ResizeObserver, image loads, and font readiness refresh layout measurements.
  Width/orientation changes rebuild the timeline while retaining story progress.
  `svh` avoids tracking every mobile address-bar movement.
- GSAP context, ResizeObserver, listeners, and pending animation frames are
  cleaned up on unmount, skip, preference change, and React StrictMode remount.

## Configuration and testing

Set `enabled`, `oncePerSession`, `scrollScreens`, and `sessionKey` in
`src/config/opening.ts`. `scrollScreens` changes total length while retaining
scene proportions; edit the timeline to change scene timings.

1. Run `npm install` and `npm run dev`; open the printed local URL.
2. Append `?intro=replay` to force the opening in the current session.
3. Scroll slowly through all three threats; stop and reverse at several points.
4. Inspect assembly and the final title at desktop and mobile widths. Continue
   into the poster and back up into the opening.
5. Test Skip from each scene, Replay, and refresh after completing or skipping.
6. Resize/orient the viewport during the threats and after the handoff.
7. Emulate reduced motion before loading and while the opening is running.
8. Use `?intro=off` to compare the original layout and ordinary reveal behavior.
9. Run `npm run build` and `npm run test:e2e`.

Playwright uses installed Edge on Windows. Other platforms use Chromium
(`npx playwright install chromium`). Tests use a dedicated Vite server on port
5175; a compatible existing development server on that port is reused locally.
Tests cover desktop (1440px), tablet (768px), mobile/touch emulation (390px),
and resize checks at 320, 430, and 1024px. Screenshots and failure traces are
written to ignored `test-results/`. No lint command existed in this project.

The existing link configuration contains empty URLs, so those controls render
as text by design. Tests temporarily substitute a local URL through browser
request interception to verify the actual rescue-map link's hover/click/new-tab
behavior after handoff; production URLs are not changed. There were no existing
topic click handlers or additional navigation components to migrate.

Testing is Chromium/Edge based, including emulated native touch input. Physical
iOS/Android devices and Safari/Firefox have not been verified.

## File inventory

New files:

- `src/components/PosterOpening.tsx` — wrapper, assets, controls, preferences.
- `src/opening/createOpening.ts` — measurements, scenes, pin, handoff, cleanup.
- `src/config/opening.ts` — feature/session/development configuration.
- `src/styles/opening.css` — scoped opening UI and motion-state styles.
- `public/assets/poison.svg`, `leftFlower.svg`, `rightFlower.svg` — unchanged
  copies of the user's newly supplied originals in `assest/`.
- `playwright.config.ts`, `tests/opening.spec.ts` — browser regression suite.
- `OPENING.md` — integration and testing documentation.

Modified files:

- `src/App.tsx` — wraps the existing poster and adds a focus target.
- `src/main.tsx` — loads opening styles after existing responsive styles.
- `src/components/HumanInterference.tsx`, `RescueSection.tsx` — new flower SVGs
  in the existing main flower slots.
- `src/data/content.ts` — poison SVG in the existing poison topic.
- `package.json`, `package-lock.json` — GSAP runtime, Playwright development
  dependency, and browser-test command.
- `.gitignore` — ignores generated test artifacts.
- `README.md`, `ASSETS.md` — updated setup, behavior, and asset inventory.

The three original files already present in `assest/` are not modified.
