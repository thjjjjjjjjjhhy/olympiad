import { AoPSMap, Block, PracticeBank, Policy, SkillsGraph } from './types';

let blockCounter = 0;
function nextId() {
  blockCounter += 1;
  return `b${blockCounter}`;
}

function problemsCount(desc: string): number {
  const m = desc.match(/(\d+)-(\d+)/);
  if (m) {
    const start = parseInt(m[1]);
    const end = parseInt(m[2]);
    let count = end - start + 1;
    if (/odd/i.test(desc) || /even/i.test(desc)) count = Math.ceil(count / 2);
    return count;
  }
  return 5; // fallback
}

export function generateBlocks(
  mastery: Record<string, number>,
  graph: SkillsGraph,
  aops: AoPSMap,
  practice: PracticeBank,
  policy: Policy,
  targetExam: string
): Block[] {
  const blocks: Block[] = [];
  const allSkills = new Set<string>([
    ...Object.keys(aops),
    ...practice.map(p => p.skill),
  ]);

  for (const skill of allSkills) {
    const domain = skill.split('.')[0];
    const deficit = 1 - (mastery[skill] ?? 0.5);
    const resources = aops[skill] || [];
    for (const res of resources) {
      const pages = res.pages[1] - res.pages[0] + 1;
      const rMinutes = pages * policy.durations.reading_per_page;
      blocks.push({
        id: nextId(),
        skill,
        domain,
        type: 'reading',
        resource: res,
        minutes: rMinutes,
        expected_gain: policy.gains.reading * deficit,
        title: `${res.book_id} — ${res.chapter} pp. ${res.pages[0]}-${res.pages[1]}`,
      });
      const probCount = res.problems.map(problemsCount).reduce((a, b) => a + b, 0);
      const pMinutes = probCount * policy.durations.problem_per_item;
      blocks.push({
        id: nextId(),
        skill,
        domain,
        type: 'problems',
        resource: res,
        minutes: pMinutes,
        expected_gain: policy.gains.problems * deficit,
        title: `${res.book_id} — ${res.chapter} Problems ${res.problems.join(', ')}`,
      });
    }
    practice
      .filter(p => p.skill === skill && p.exam === targetExam)
      .forEach(item => {
        blocks.push({
          id: nextId(),
          skill,
          domain,
          type: 'practice',
          resource: item,
          minutes: item.est_minutes,
          expected_gain: policy.gains.practice * deficit,
          title: `Practice ${item.exam} ${item.year} #${item.number}`,
        });
      });
  }

  return blocks.sort((a, b) => b.expected_gain - a.expected_gain);
}
