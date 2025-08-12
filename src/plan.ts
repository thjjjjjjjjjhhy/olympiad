import { DiagnosticInput, SkillsGraph, AoPSMap, PracticeBank, Policy } from './types';
import { estimateTheta } from './irt';
import { thetaToMastery, smoothMastery } from './mastery';
import { generateBlocks } from './blocks';
import { schedule } from './schedule';
import { planToJSON, planToMarkdown, planToICS } from './exporters';

export type PlanInputs = {
  diagnosticResults: DiagnosticInput;
  skillsGraph: SkillsGraph;
  aopsMap: AoPSMap;
  practiceBank: PracticeBank;
  policy: Policy;
};

// Orchestrates the full pipeline from diagnostic results to exported plan
export async function planFromDiagnostic(
  inputs: PlanInputs
): Promise<{ planJson: string; planMd: string; icsText: string }> {
  const { diagnosticResults, skillsGraph, aopsMap, practiceBank, policy } = inputs;

  // group responses by skill
  const bySkill: Record<string, any[]> = {};
  diagnosticResults.responses.forEach(r => {
    (bySkill[r.skill] = bySkill[r.skill] || []).push(r);
  });

  // estimate mastery per skill using IRT
  const mastery: Record<string, number> = {};
  const allSkills = new Set<string>([
    ...Object.keys(skillsGraph),
    ...Object.keys(bySkill)
  ]);
  for (const skill of allSkills) {
    const theta = estimateTheta(bySkill[skill] || []);
    mastery[skill] = thetaToMastery(theta);
  }
  const smoothed = smoothMastery(mastery, skillsGraph);

  // generate candidate blocks
  const blocks = generateBlocks(
    smoothed,
    skillsGraph,
    aopsMap,
    practiceBank,
    policy,
    diagnosticResults.user.target_exam
  );

  // insert TODO blocks for skills lacking AoPS mapping
  const skillsNeedingMap = new Set<string>([
    ...diagnosticResults.responses.map(r => r.skill),
    ...practiceBank.map(p => p.skill)
  ]);
  skillsNeedingMap.forEach(skill => {
    if (!aopsMap[skill] || aopsMap[skill].length === 0) {
      blocks.push({
        id: `todo-${skill}`,
        skill,
        domain: skill.split('.')[0],
        type: 'todo',
        resource: null,
        minutes: 30,
        expected_gain: 0,
        title: `TODO: Add AoPS mapping for ${skill}`
      });
    }
  });

  const startDate = new Date().toISOString().slice(0, 10);
  const plan = schedule(
    blocks,
    startDate,
    diagnosticResults.user.target_date,
    diagnosticResults.user.daily_minutes,
    policy
  );

  return {
    planJson: planToJSON(plan),
    planMd: planToMarkdown(plan),
    icsText: planToICS(plan)
  };
}
