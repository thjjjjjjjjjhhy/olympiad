import fs from 'fs';
import { planFromDiagnostic, PlanInputs } from './plan.js';
import { validateAopsMap } from './utils/validate.js';

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

  const inputs: PlanInputs = {
    diagnosticResults: diagnostic,
    skillsGraph: skills,
    aopsMap: aops,
    practiceBank: practice,
    policy,
  };

  const { planJson, planMd, icsText } = await planFromDiagnostic(inputs);

  fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(outDir + '/plan.json', planJson);
  fs.writeFileSync(outDir + '/plan.md', planMd);
  fs.writeFileSync(outDir + '/study.ics', icsText);

  console.log('Plan written to', outDir);
}

main();
