import { SkillsGraph } from './types';

export function thetaToMastery(theta: number): number {
  return 1 / (1 + Math.exp(-theta));
}

export function smoothMastery(mastery: Record<string, number>, graph: SkillsGraph): Record<string, number> {
  const memo: Record<string, number> = {};
  const visit = (skill: string): number => {
    if (memo[skill] !== undefined) return memo[skill];
    const node = graph[skill];
    if (!node || node.prereq.length === 0) {
      memo[skill] = mastery[skill] ?? 0.5;
      return memo[skill];
    }
    const prereqValues = node.prereq.map(p => visit(p));
    const avg = prereqValues.reduce((a, b) => a + b, 0) / prereqValues.length;
    memo[skill] = ((mastery[skill] ?? 0.5) + avg) / 2;
    return memo[skill];
  };

  for (const skill of Object.keys(mastery)) visit(skill);
  return memo;
}
