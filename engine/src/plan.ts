import { PlanTask } from './types';

export function buildPlan(): PlanTask[] {
  const today = new Date();
  const tasks: PlanTask[] = [];
  for (let i = 1; i <= 3; i++) {
    const d = new Date(today);
    d.setDate(d.getDate() + i);
    tasks.push({ title: `Task ${i}`, date: d.toISOString().slice(0, 10) });
  }
  return tasks;
}
