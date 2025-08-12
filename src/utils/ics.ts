export interface ICSEvent {
  uid: string;
  title: string;
  start: Date;
  end: Date;
}

function pad(n: number): string {
  return String(n).padStart(2, '0');
}

function formatICSDate(d: Date): string {
  return (
    d.getUTCFullYear().toString() +
    pad(d.getUTCMonth() + 1) +
    pad(d.getUTCDate()) +
    'T' +
    pad(d.getUTCHours()) +
    pad(d.getUTCMinutes()) +
    pad(d.getUTCSeconds()) +
    'Z'
  );
}

export function buildICS(events: ICSEvent[]): string {
  const lines = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//studyplan//EN'];
  events.forEach(ev => {
    lines.push('BEGIN:VEVENT');
    lines.push(`UID:${ev.uid}`);
    lines.push(`DTSTAMP:${formatICSDate(new Date())}`);
    lines.push(`DTSTART:${formatICSDate(ev.start)}`);
    lines.push(`DTEND:${formatICSDate(ev.end)}`);
    lines.push(`SUMMARY:${ev.title.replace(/,/g, '\\,')}`);
    lines.push('END:VEVENT');
  });
  lines.push('END:VCALENDAR');
  return lines.join('\n');
}
