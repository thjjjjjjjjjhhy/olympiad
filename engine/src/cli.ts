import * as fs from 'fs';
import * as path from 'path';
import { buildPlan } from './plan';
import { exportJson, exportMarkdown, exportICS } from './exporters';

function parseOutDir(): string {
  const flag = '--out';
  const idx = process.argv.indexOf(flag);
  if (idx >= 0 && process.argv[idx + 1]) {
    return process.argv[idx + 1];
  }
  return 'out';
}

function main() {
  const outDir = parseOutDir();
  fs.mkdirSync(outDir, { recursive: true });
  const tasks = buildPlan();
  exportJson(tasks, path.join(outDir, 'plan.json'));
  exportMarkdown(tasks, path.join(outDir, 'plan.md'));
  exportICS(tasks, path.join(outDir, 'study.ics'));
}

main();
