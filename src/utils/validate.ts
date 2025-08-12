import { AoPSMap } from '../types';

const probRangeRegex = /^(\d+)-(\d+)\s*(odd|even|all)?$/i;
const namedRangeRegex = /^([A-Za-z ]+)(\d+)-(\d+)$/;

export function validateAopsMap(map: AoPSMap): { ok: boolean; errors: string[] } {
  const errors: string[] = [];
  for (const [skill, resources] of Object.entries(map)) {
    resources.forEach((res, idx) => {
      if (!res.pages || res.pages.length !== 2 || res.pages[0] >= res.pages[1]) {
        errors.push(`${skill}[${idx}] has invalid pages`);
      }
      res.problems.forEach(p => {
        const s = p.trim();
        let ok = false;
        const m1 = s.match(probRangeRegex);
        if (m1) {
          const a = parseInt(m1[1]);
          const b = parseInt(m1[2]);
          if (a >= b) errors.push(`${skill} problem range invalid: ${p}`);
          ok = true;
        }
        const m2 = s.match(namedRangeRegex);
        if (m2) {
          const a = parseInt(m2[2]);
          const b = parseInt(m2[3]);
          if (a >= b) errors.push(`${skill} problem range invalid: ${p}`);
          ok = true;
        }
        if (!ok) {
          errors.push(`${skill} problem format invalid: ${p}`);
        }
      });
    });
  }
  return { ok: errors.length === 0, errors };
}
