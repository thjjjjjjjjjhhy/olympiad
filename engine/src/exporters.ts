import * as fs from 'fs';
import { PlanTask } from './types';

export function exportJson(tasks: PlanTask[], filePath: string): void {
  const data = { tasks };
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

export function exportMarkdown(tasks: PlanTask[], filePath: string): void {
  let lines = ['# Study Plan', ''];
  for (const task of tasks) {
    lines.push(`- ${task.date}: ${task.title}`);
  }
  fs.writeFileSync(filePath, lines.join('\n'));
}

export function exportICS(tasks: PlanTask[], filePath: string): void {
  const now = new Date().toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
  let lines = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//engine//EN'];
  tasks.forEach((task, idx) => {
    const date = task.date.replace(/-/g, '');
    lines.push('BEGIN:VEVENT');
    lines.push(`UID:${idx}@engine`);
    lines.push(`DTSTAMP:${now}`);
    lines.push(`DTSTART;VALUE=DATE:${date}`);
    lines.push(`SUMMARY:${task.title}`);
    lines.push('END:VEVENT');
  });
  lines.push('END:VCALENDAR');
  fs.writeFileSync(filePath, lines.join('\n'));
}
