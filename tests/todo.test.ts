import { readFileSync } from 'fs';
import { describe, it, expect } from 'vitest';
import { planFromDiagnostic, PlanInputs } from '../src/plan';

describe('planFromDiagnostic missing AoPS mapping', () => {
  it('adds TODO blocks for skills without mapping', async () => {
    const diagnostic = JSON.parse(readFileSync('data/diagnostic_results.json', 'utf-8'));
    const skills = JSON.parse(readFileSync('data/skills_graph.json', 'utf-8'));
    const policy = JSON.parse(readFileSync('data/policy.json', 'utf-8'));

    const inputs: PlanInputs = {
      diagnosticResults: diagnostic,
      skillsGraph: skills,
      aopsMap: {},
      practiceBank: [],
      policy,
    };

    const { planJson } = await planFromDiagnostic(inputs);
    const plan = JSON.parse(planJson);
    const todos = plan.flatMap((d: any) => d.blocks.filter((b: any) => b.type === 'todo'));
    expect(todos.length).toBeGreaterThan(0);
    expect(todos.some((t: any) => t.title.includes('algebra.quadratics'))).toBe(true);
  });
});
