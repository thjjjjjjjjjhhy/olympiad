import { describe, it, expect } from 'vitest';
import { validateAopsMap } from '../src/utils/validate';
import { readFileSync } from 'fs';

describe('validateAopsMap', () => {
  it('accepts correct map', () => {
    const map = JSON.parse(readFileSync('data/aops_map.json', 'utf-8'));
    const res = validateAopsMap(map);
    expect(res.ok).toBe(true);
  });

  it('flags malformed map', () => {
    const bad = {
      'bad.skill': [
        { book_id: 'X', chapter: 'Y', pages: [50, 40], problems: ['abc'] }
      ]
    } as any;
    const res = validateAopsMap(bad);
    expect(res.ok).toBe(false);
    expect(res.errors.length).toBeGreaterThan(0);
  });
});
