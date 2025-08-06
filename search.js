function buildAoPSUrl(query) {
  const tokens = (query || '').toUpperCase().match(/[A-Z0-9]+/g);
  if (!tokens) return null;
  let year, exam, level, variant, problem;

  // first pass: identify year and exam with possible attached info
  for (const t of tokens) {
    if (!year && /^(19|20)\d{2}$/.test(t)) {
      year = t;
      continue;
    }
    if (!exam) {
      if (t.startsWith('AMC')) {
        exam = 'AMC';
        const rest = t.slice(3);
        const match = rest.match(/(10|12)([AB])?/);
        if (match) {
          level = match[1];
          if (match[2]) variant = match[2];
        }
        continue;
      }
      if (t.startsWith('AIME')) {
        exam = 'AIME';
        const rest = t.slice(4);
        const match = rest.match(/(II|I|2|1)/);
        if (match) {
          variant = match[1].replace('1', 'I').replace('2', 'II');
        }
        continue;
      }
    }
  }

  // second pass: pick up missing attributes and problem number
  let afterProblem = false;
  for (const t of tokens) {
    if (t === 'PROBLEM') { afterProblem = true; continue; }
    if (!exam && t === 'AIME') { exam = 'AIME'; continue; }
    if (!exam && t === 'AMC') { exam = 'AMC'; continue; }
    if (exam === 'AMC') {
      const combined = t.match(/^(10|12)(A|B)$/);
      if (!level && !variant && combined) { level = combined[1]; variant = combined[2]; continue; }
      if (!level && (t === '10' || t === '12')) { level = t; continue; }
      if (!variant && (t === 'A' || t === 'B')) { variant = t; continue; }
    }
    if (exam === 'AIME') {
      if (!variant && (t === 'I' || t === 'II' || t === '1' || t === '2')) {
        variant = t.replace('1', 'I').replace('2', 'II');
        continue;
      }
    }
    if (/^\d{1,2}$/.test(t)) {
      if (t === year) continue;
      if (exam === 'AMC' && t === level && !afterProblem) continue;
      if (!problem) { problem = t; afterProblem = false; }
    }
  }

  if (!year || !exam || !problem) return null;
  if (exam === 'AMC') {
    if (!level || !variant) return null;
    return `https://artofproblemsolving.com/wiki/index.php/${year}_AMC_${level}${variant}_Problems/Problem_${problem}`;
  }
  if (!variant) return null;
  return `https://artofproblemsolving.com/wiki/index.php/${year}_AIME_${variant}_Problems/Problem_${problem}`;
}

if (typeof module !== 'undefined') {
  module.exports = { buildAoPSUrl };
} else {
  window.buildAoPSUrl = buildAoPSUrl;
}
