import type { ReactNode } from 'react';
export function ConfigurableLink({ url, children, className = '' }: { url: string; children: ReactNode; className?: string }) {
  let valid = false;
  try { valid = ['https:', 'http:'].includes(new URL(url).protocol); } catch { /* 未設定時顯示純文字。 */ }
  return valid
    ? <a className={className} href={url} target="_blank" rel="noopener noreferrer">{children}</a>
    : <span className={className}>{children}</span>;
}
