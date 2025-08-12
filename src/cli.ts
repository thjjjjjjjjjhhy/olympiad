import fs from 'fs';
import { estimateTheta } from './irt';
import { thetaToMastery, smoothMastery } from './mastery';
import { generateBlocks } from './blocks';
import { schedule } from './schedule';
import { planToJSON, planToMarkdown, planToICS } from './exporters';
import { validateAopsMap } from './utils/validate';

function getArg(flag: string): string | undefined {
  const idx = process.argv.indexOf(flag);
  return idx >= 0 ? process.argv[idx + 1] : undefined;
}

function readJSON(path: string) {
  return JSON.parse(fs.readFileSync(path, 'utf-8'));
}

async function main() {
  const diagPath = getArg('--diagnostic')!;
  const skillsPath = getArg('--skills')!;
  const aopsPath = getArg('--aops')!;
  const practicePath = getArg('--practice')!;
  const policyPath = getArg('--policy')!;
  const outDir = getArg('--out') || 'out';

  const diagnostic = readJSON(diagPath);
  const skills = readJSON(skillsPath);
  const aops = readJSON(aopsPath);
  const practice = readJSON(practicePath);
  const policy = readJSON(policyPath);

  const val = validateAopsMap(aops);
  if (!val.ok) {
    console.error('AoPS map validation errors:\n' + val.errors.join('\n'));
    process.exit(1);
  }

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
  const startDate = new Date().toISOString().slice(0, 10);
  const plan = schedule(blocks, startDate, diagnostic.user.target_date, diagnostic.user.daily_minutes, policy);

  fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(outDir + '/plan.json', planToJSON(plan));
  fs.writeFileSync(outDir + '/plan.md', planToMarkdown(plan));
  fs.writeFileSync(outDir + '/study.ics', planToICS(plan));

  console.log('Plan written to', outDir);
}

main();
