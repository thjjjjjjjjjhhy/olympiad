import { Block, Plan, PlanDay, Policy } from './types';
import { addDays, diffInDays, formatISO, parseISO } from './utils/date';

interface DayMinutes { [date: string]: number; }

export function schedule(
  blocks: Block[],
  startDate: string,
  endDate: string,
  dailyMinutes: number,
  policy: Policy
): Plan {
  const dayMinutes: DayMinutes = {};
  const weekMinutes: Record<number, number> = {};
  const planDays: Record<string, PlanDay> = {};

  const start = parseISO(startDate);
  const target = parseISO(endDate);
  const weeklyLimit = dailyMinutes * 7 * (1 - policy.slack);

  const place = (block: Block, fixedDate?: string): string => {
    let date = fixedDate ? parseISO(fixedDate) : start;
    while (date <= target) {
      const ds = formatISO(date);
      const week = Math.floor(diffInDays(date, start) / 7);
      const dMin = dayMinutes[ds] || 0;
      const wMin = weekMinutes[week] || 0;
      if (!fixedDate && wMin + block.minutes > weeklyLimit) {
        date = addDays(start, (week + 1) * 7);
        continue;
      }
      if (!fixedDate && dMin + block.minutes > dailyMinutes) {
        date = addDays(date, 1);
        continue;
      }
      const dayBlocks = planDays[ds]?.blocks || [];
      if (
        !fixedDate &&
        dayBlocks.length >= 2 &&
        dayBlocks[dayBlocks.length - 1].domain === block.domain &&
        dayBlocks[dayBlocks.length - 2].domain === block.domain
      ) {
        date = addDays(date, 1);
        continue;
      }
      dayMinutes[ds] = dMin + block.minutes;
      weekMinutes[week] = wMin + block.minutes;
      (planDays[ds] ??= { date: ds, blocks: [] }).blocks.push(block);
      return ds;
    }
    const ds = formatISO(target);
    (planDays[ds] ??= { date: ds, blocks: [] }).blocks.push(block);
    return ds;
  };

  const mainBlocks = blocks.filter(b => b.type !== 'review');
  mainBlocks.forEach(b => {
    const date = place(b);
    (b as any).scheduledDate = date;
  });

  mainBlocks.forEach(b => {
    const base = parseISO((b as any).scheduledDate);
    policy.spacing.forEach((offset, idx) => {
      const review: Block = {
        id: `${b.id}-r${offset}`,
        skill: b.skill,
        domain: b.domain,
        type: 'review',
        resource: b.resource,
        minutes: Math.max(1, Math.round(b.minutes * (policy.review_percentages[idx] || policy.review_percentages[0]))),
        expected_gain: policy.gains.review,
        title: `Review: ${b.title}`,
        review_of: b.id,
      };
      const d = formatISO(addDays(base, offset));
      place(review, d);
    });
  });

  const plan: Plan = Object.values(planDays).sort((a, b) => a.date.localeCompare(b.date));
  plan.forEach(day => day.blocks.sort((a, b) => a.id.localeCompare(b.id)));
  return plan;
}
