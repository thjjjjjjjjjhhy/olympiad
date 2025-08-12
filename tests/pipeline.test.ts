import { readFileSync } from 'fs';
import { estimateTheta } from '../src/irt';
import { thetaToMastery, smoothMastery } from '../src/mastery';
import { generateBlocks } from '../src/blocks';
import { schedule } from '../src/schedule';
import { planToICS } from '../src/exporters';
import { validateAopsMap } from '../src/utils/validate';
import { parseISO, addDays, formatISO } from '../src/utils/date';
import { describe, it, expect } from 'vitest';

const diagnostic = JSON.parse(readFileSync('data/diagnostic_results.json', 'utf-8'));
const skills = JSON.parse(readFileSync('data/skills_graph.json', 'utf-8'));
const aops = JSON.parse(readFileSync('data/aops_map.json', 'utf-8'));
const practice = JSON.parse(readFileSync('data/practice_bank.json', 'utf-8'));
const policy = JSON.parse(readFileSync('data/policy.json', 'utf-8'));

// ensure map valid
const val = validateAopsMap(aops);
if (!val.ok) throw new Error(val.errors.join(','));

const bySkill: Record<string, any[]> = {};
diagnostic.responses.forEach((r: any) => {
  (bySkill[r.skill] = bySkill[r.skill] || []).push(r);
});
const mastery: Record<string, number> = {};
const allSkills = new Set<string>([...Object.keys(skills), ...Object.keys(bySkill)]);
for (const skill of allSkills) {
  const theta = estimateTheta(bySkill[skill] || []);
  mastery[skill] = thetaToMastery(theta);
}
const smoothed = smoothMastery(mastery, skills);
const blocks = generateBlocks(smoothed, skills, aops, practice, policy, diagnostic.user.target_exam);
const startDate = '2025-09-01';
const plan = schedule(blocks, startDate, diagnostic.user.target_date, diagnostic.user.daily_minutes, policy);

describe('planning pipeline', () => {
  it('first two weeks focus on diagnostic skills and prereqs', () => {
    const first14 = plan.filter(d => parseISO(d.date) < addDays(parseISO(startDate), 14));
    const skillsSet = new Set<string>();
    first14.forEach(day => day.blocks.forEach(b => skillsSet.add(b.skill)));
    const expected = ['algebra.lines', 'algebra.quadratics', 'nt.divisibility', 'nt.congruences'];
    expect([...skillsSet].every(s => expected.includes(s))).toBe(true);
  });

  it('creates reviews at +1/+7/+21', () => {
    const firstDay = plan.find(d => d.blocks.some(b => b.type !== 'review'))!;
    const mainBlock = firstDay.blocks.find(b => b.type !== 'review')!;
    const baseDate = parseISO(firstDay.date);
    const offsets = [1, 7, 21];
    const ok = offsets.every(off => {
      const date = formatISO(addDays(baseDate, off));
      const day = plan.find(d => d.date === date);
      return day?.blocks.some(b => b.type === 'review' && b.review_of === mainBlock.id);
    });
    expect(ok).toBe(true);
  });

  it('prevents three consecutive blocks from same domain', () => {
    const domains: string[] = [];
    plan.forEach(d => d.blocks.forEach(b => domains.push(b.domain)));
    let valid = true;
    for (let i = 2; i < domains.length; i++) {
      if (domains[i] === domains[i - 1] && domains[i] === domains[i - 2]) valid = false;
    }
    expect(valid).toBe(true);
  });

  it('ICS events equal number of blocks', () => {
    const ics = planToICS(plan);
    const events = ics.split('BEGIN:VEVENT').length - 1;
    const total = plan.reduce((sum, d) => sum + d.blocks.length, 0);
    expect(events).toBe(total);
  });
});
