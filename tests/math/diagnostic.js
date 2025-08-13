const params = new URLSearchParams(window.location.search);
const goal = params.get('goal') || '';
const testMap = {
  amc10: 'amc_readiness',
  amc12: 'amc_readiness',
  aime: 'aime_10plus',
  usamo: 'usamo_track',
  usajmo: 'usamo_track'
};

async function loadTests() {
  try {
    const res = await fetch('public/tests.bundled.json');
    return (await res.json()).tests || [];
  } catch (e) {
    console.error('Failed to load tests', e);
    return [];
  }
}

function renderTest(test) {
  const container = document.getElementById('quiz');
  if (!test) {
    container.innerHTML = '<p>Test not found.</p>';
    return;
  }
  const form = document.createElement('form');
  test.problems.forEach((p, i) => {
    const div = document.createElement('div');
    div.className = 'question';
    const title = `${p.contest} ${p.year} Problem ${p.number}`;
    const statement = p.statement || title;
    const pEl = document.createElement('p');
    pEl.textContent = `${i + 1}. ${statement}`;
    div.appendChild(pEl);
    if (test.format === 'multiple-choice') {
      const opts = Array.isArray(p.choices) && p.choices.length === 5
        ? p.choices
        : ['', '', '', '', ''];
      opts.forEach((choice, idx) => {
        const label = document.createElement('label');
        const input = document.createElement('input');
        input.type = 'radio';
        input.name = `q${i}`;
        input.value = String.fromCharCode(65 + idx);
        label.appendChild(input);
        label.append(` ${String.fromCharCode(65 + idx)}. ${choice}`);
        div.appendChild(label);
        div.appendChild(document.createElement('br'));
      });
    } else {
      const input = document.createElement('input');
      input.type = 'text';
      input.name = `q${i}`;
      input.maxLength = 3;
      div.appendChild(input);
    }
    const link = document.createElement('a');
    link.href = p.aops;
    link.target = '_blank';
    link.textContent = 'View on AoPS';
    div.appendChild(link);
    form.appendChild(div);
  });
  const submit = document.createElement('button');
  submit.type = 'submit';
  submit.textContent = 'Submit';
  form.appendChild(submit);
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    gradeTest(test, form);
  });
  container.appendChild(form);
}

function gradeTest(test, form) {
  const data = new FormData(form);
  let correct = 0;
  let total = 0;
  const topicStats = {};
  test.problems.forEach((p, i) => {
    const official = String(p.officialAnswer || '').toUpperCase();
    if (!official) return;
    total += 1;
    const userAns = (data.get(`q${i}`) || '').toString().trim().toUpperCase();
    const isCorrect = userAns === official;
    if (isCorrect) correct += 1;
    (p.topic || []).forEach(t => {
      if (!topicStats[t]) topicStats[t] = { total: 0, correct: 0 };
      topicStats[t].total += 1;
      if (isCorrect) topicStats[t].correct += 1;
    });
  });
  const container = document.getElementById('quiz');
  container.innerHTML = `<p>You scored ${correct} out of ${total}.</p>`;
  const strengths = [], weaknesses = [];
  Object.entries(topicStats).forEach(([topic, stats]) => {
    const ratio = stats.correct / stats.total;
    if (ratio >= 0.7) strengths.push(topic);
    else if (ratio <= 0.4) weaknesses.push(topic);
  });
  if (strengths.length) container.innerHTML += `<p>Strengths: ${strengths.join(', ')}</p>`;
  if (weaknesses.length) container.innerHTML += `<p>Topics to review: ${weaknesses.join(', ')}</p>`;
  const summary = { correct, total, strengths, weaknesses };
  try {
    localStorage.setItem('lastTestResults', JSON.stringify(summary));
  } catch (e) {
    console.error('Failed to save summary', e);
  }
  window.location.href = 'timeline.html';
}

loadTests().then(tests => {
  const test = tests.find(t => t.id === testMap[goal]);
  renderTest(test);
});
