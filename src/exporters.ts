import { Plan } from './types';
import { buildICS } from './utils/ics';
import { parseISO, startOfWeek, formatISO } from './utils/date';

export function planToJSON(plan: Plan): string {
  return JSON.stringify(plan, null, 2);
}

export function planToMarkdown(plan: Plan): string {
  const weeks: Record<string, typeof plan> = {};
  plan.forEach(day => {
    const week = formatISO(startOfWeek(parseISO(day.date)));
    (weeks[week] ??= []).push(day);
  });
  const lines: string[] = [];
  Object.keys(weeks)
    .sort()
    .forEach(week => {
      lines.push(`## Week of ${week}`);
      weeks[week].forEach(d => {
        lines.push(`### ${d.date}`);
        d.blocks.forEach(b => lines.push(`- ${b.title} (${b.minutes} min)`));
      });
      lines.push('');
    });
  return lines.join('\n');
}

export function planToICS(plan: Plan): string {
  const events: { uid: string; title: string; start: Date; end: Date }[] = [];
  let uid = 1;
  plan.forEach(day => {
    day.blocks.forEach(b => {
      const start = new Date(day.date + 'T09:00:00Z');
      const end = new Date(start.getTime() + b.minutes * 60000);
      events.push({ uid: `u${uid++}@plan`, title: b.title, start, end });
    });
  });
  return buildICS(events);
}
