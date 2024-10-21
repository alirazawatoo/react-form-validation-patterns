import exampleFormData from '../fixtures/formData';
import { formatAmount, lineTotal, summarize } from './totals';

describe('lineTotal', () => {
  it('multiplies quantity by rate and rounds to cents', () => {
    expect(lineTotal(2, 50)).toBe(100);
    expect(lineTotal(3, 0.1)).toBe(0.3);
    expect(lineTotal('1.5', '2.345')).toBe(3.52);
  });

  it('treats empty or non-numeric input as zero', () => {
    expect(lineTotal('', 10)).toBe(0);
    expect(lineTotal(undefined, 10)).toBe(0);
    expect(lineTotal('abc', 10)).toBe(0);
  });

  it('leaves an overflowing product non-finite for the schema to reject', () => {
    expect(Number.isFinite(lineTotal(1e308, 1e308))).toBe(false);
  });
});

describe('summarize', () => {
  it('adds task and material totals across every group and applies the discount', () => {
    expect(summarize(exampleFormData)).toEqual({ tasks: 680, materials: 600, net: 1280, grand: 1024 });
  });
});

describe('formatAmount', () => {
  it('shows at most two decimals with thousands separators', () => {
    expect(formatAmount(0.1 + 0.2)).toBe('0.3');
    expect(formatAmount(1024)).toBe('1,024');
    expect(formatAmount(12.5)).toBe('12.5');
  });
});
