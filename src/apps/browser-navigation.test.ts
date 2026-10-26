import { describe, expect, it } from 'vitest';
import { browserAddress, SEARCH_URL, visit } from './browser-navigation';
describe('browser address navigation', () => {
  it.each(['Nova', 'Nova银行', '银行', 'nova bank'])('searches %s', input => {
    const url = new URL(browserAddress(input));
    expect(url.origin).toBe(new URL(SEARCH_URL).origin);
    expect(url.searchParams.get('q')).toBe(input);
  });
  it.each(['novabank.nl', 'www.novabank.nl', 'https://www.novabank.nl'])('opens an entered address %s', input => {
    expect(new URL(browserAddress(input)).hostname).toMatch(/^(www\.)?novabank\.nl$/);
  });
  it('does not treat executable schemes as a page', () => {
    expect(browserAddress('javascript:alert(1)')).toContain(SEARCH_URL);
  });
  it('replaces forward history after navigating back', () => {
    const history = ['about:blank', browserAddress('Nova'), browserAddress('novabank.nl')];
    const next = visit(history, 1, browserAddress('moneyguide.nl'));
    expect(next).toEqual([history[0], history[1], 'https://moneyguide.nl/']);
    expect(history[2]).toBe('https://novabank.nl/');
  });
  it('handles empty and malformed address input', () => {
    expect(browserAddress('  ')).toBe('about:blank');
    expect(browserAddress('https://')).toContain(SEARCH_URL);
  });
});
