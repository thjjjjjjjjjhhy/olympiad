export function parseISO(str: string): Date {
  return new Date(str + 'T00:00:00Z');
}

export function formatISO(date: Date): string {
  return date.toISOString().slice(0, 10);
}

export function addDays(date: Date, days: number): Date {
  const d = new Date(date);
  d.setUTCDate(d.getUTCDate() + days);
  return d;
}

export function diffInDays(a: Date, b: Date): number {
  const ms = Date.UTC(a.getUTCFullYear(), a.getUTCMonth(), a.getUTCDate()) -
    Date.UTC(b.getUTCFullYear(), b.getUTCMonth(), b.getUTCDate());
  return Math.floor(ms / 86400000);
}

export function startOfWeek(date: Date): Date {
  const d = new Date(date);
  const day = d.getUTCDay();
  const diff = (day + 6) % 7; // Monday start
  d.setUTCDate(d.getUTCDate() - diff);
  return d;
}
