/** Timeline units are viewport scroll lengths: 0–1 / 1–2 / 2–3. */
export const opening = {
  enabled: true,
  oncePerSession: true,
  scrollScreens: 3,
  sessionKey: 'bird-poster:opening-seen:v1',
};

export function shouldShowOpening() {
  if (!opening.enabled || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return false;
  const override = new URLSearchParams(window.location.search).get('intro');
  if (override === 'off') return false;
  if (override === 'replay' || !opening.oncePerSession) return true;
  // Preserve direct links into the existing poster.
  if (window.location.hash) return false;
  try { return sessionStorage.getItem(opening.sessionKey) !== 'seen'; }
  catch { return true; }
}

export function rememberOpening() {
  try { sessionStorage.setItem(opening.sessionKey, 'seen'); }
  catch { /* Storage can be unavailable in private or embedded browsers. */ }
}
