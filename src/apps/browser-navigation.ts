// shortcut: browser pages are local story content; extend destinations when later days need them.
export const SEARCH_URL = 'https://search.local/';
export function browserAddress(input: string): string {
  const value = input.trim();
  if (!value) return 'about:blank';
  if (value === 'about:blank') return value;
  if (/^https?:\/\//i.test(value) || /^[\w-]+(?:\.[\w-]+)+(?:[/?#].*)?$/.test(value)) {
    try { return new URL(/^https?:/i.test(value) ? value : `https://${value}`).href; } catch { /* Treat malformed addresses as a search. */ }
  }
  return `${SEARCH_URL}?q=${encodeURIComponent(value)}`;
}
export function visit(history: readonly string[], index: number, url: string): string[] {
  return [...history.slice(0, index + 1), url];
}
