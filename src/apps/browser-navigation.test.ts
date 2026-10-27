import { describe, expect, it } from 'vitest';
import { browserAddress, SEARCH_URL, visit, matchesBankSearch } from './browser-navigation';
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

describe('bank search whole words', () => {
  it.each(['Nova', 'NOVA', 'Nova bank', 'Nova,bank', 'Nova，银行', '(Nova)', '银行', 'Nova银行', 'banking', '查证 Nova 官网'])('matches %s', query => {
    expect(matchesBankSearch(query)).toBe(true);
  });
  it.each(['Novaasdgisaf', 'asdgNova', 'novabank', 'bankxyz', 'xx银行xx', '银行诈骗', 'Nova123', '', 'nothing'])('rejects partial keyword %s', query => {
    expect(matchesBankSearch(query)).toBe(false);
  });
});
