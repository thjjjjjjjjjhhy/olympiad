const params = new URLSearchParams(window.location.search);
const goal = params.get('goal') || 'amc10';

// Map the selected goal to one of the three test levels.
const levelMap = {
  amc10: 'amc',
  amc12: 'amc',
  aime: 'aime',
  usamo: 'usamo',
  usajmo: 'usamo',
};

const level = levelMap[goal] || 'amc';

function renderTest(test) {
  const container = document.getElementById('quiz');
  if (!test) {
    container.innerHTML = '<p>Test not found.</p>';
    return;
  }
  const form = document.createElement('form');
  test.forEach((q, i) => {
    const div = document.createElement('div');
    div.className = 'question';
    if (q.html) {
      const num = document.createElement('p');
      num.textContent = `${i + 1}.`;
      div.appendChild(num);
      const content = document.createElement('div');
      content.innerHTML = q.html;
      div.appendChild(content);
      ['A', 'B', 'C', 'D', 'E'].forEach((letter) => {
        const label = document.createElement('label');
        const input = document.createElement('input');
        input.type = 'radio';
        input.name = `q${i}`;
        input.value = letter;
        label.appendChild(input);
        label.append(` ${letter}`);
        div.appendChild(label);
      });
    } else {
      const p = document.createElement('p');
      p.textContent = `${i + 1}. ${q.question}`;
      div.appendChild(p);
      if (q.type === 'mc') {
        q.choices.forEach((choice, idx) => {
          const label = document.createElement('label');
          const input = document.createElement('input');
          input.type = 'radio';
          input.name = `q${i}`;
          input.value = String.fromCharCode(65 + idx);
          label.appendChild(input);
          label.append(` ${String.fromCharCode(65 + idx)}. ${choice}`);
          div.appendChild(label);
        });
      } else {
        const input = document.createElement('input');
        input.type = 'text';
        input.name = `q${i}`;
        div.appendChild(input);
      }
    }
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
  const subjectStats = {};
  test.forEach((q, i) => {
    const userAns = data.get(`q${i}`);
    const isCorrect = q.type === 'mc' ? userAns === q.answer : parseInt(userAns, 10) === q.answer;
    if (!subjectStats[q.subject]) {
      subjectStats[q.subject] = { total: 0, correct: 0 };
    }
    subjectStats[q.subject].total += 1;
    if (isCorrect) {
      correct += 1;
      subjectStats[q.subject].correct += 1;
    }
  });
  const container = document.getElementById('quiz');
  container.innerHTML = `<p>You scored ${correct} out of ${test.length}.</p>`;
  const strengths = [], weaknesses = [];
  Object.entries(subjectStats).forEach(([sub, stats]) => {
    const ratio = stats.correct / stats.total;
    if (ratio >= 0.7) {
      strengths.push(sub);
    } else if (ratio <= 0.4) {
      weaknesses.push(sub);
    }
  });
  if (strengths.length) {
    container.innerHTML += `<p>Strengths: ${strengths.join(', ')}</p>`;
  }
  if (weaknesses.length) {
    container.innerHTML += `<p>Topics to review: ${weaknesses.join(', ')}</p>`;
  }
  if (goal === 'amc10') {
    if (correct >= 15) {
      container.innerHTML += '<p>Great job! Consider trying an AMC 12 diagnostic.</p>';
    } else if (correct < 10) {
      container.innerHTML += '<p>Review foundational topics or try an easier level.</p>';
    }
  } else if (goal === 'amc12') {
    if (correct >= 15) {
      container.innerHTML += '<p>You may be ready for AIME practice.</p>';
    } else if (correct < 10) {
      container.innerHTML += '<p>Consider reviewing AMC 10 material.</p>';
    }
  } else if (goal === 'aime') {
    if (correct >= 10) {
      container.innerHTML += '<p>Strong performance! You may start USAMO preparation.</p>';
    } else if (correct < 5) {
      container.innerHTML += '<p>Consider practicing AMC 12 level problems first.</p>';
    }
  } else if (goal === 'usamo' || goal === 'usajmo') {
    if (correct >= 8) {
      container.innerHTML += '<p>Outstanding work! Keep challenging yourself with proof-based problems.</p>';
    } else if (correct < 5) {
      container.innerHTML += '<p>Review AIME-level topics to strengthen your foundation.</p>';
    }
  }
  const reviewList = document.createElement('ul');
  test.forEach((q, i) => {
    const li = document.createElement('li');
    li.textContent = `${i + 1}. ${q.source} — Answer: ${q.type === 'mc' ? q.answer : q.answer}`;
    reviewList.appendChild(li);
  });
  container.appendChild(reviewList);
  const summary = { correct, total: test.length, strengths, weaknesses };
  try {
    localStorage.setItem('lastTestResults', JSON.stringify(summary));
  } catch (e) {
    console.error('Failed to save summary', e);
  }
  window.location.href = 'timeline.html';
}

const files = {
  amc: 'tests/math/amc_mixed_medium.json',
  aime: 'tests/math/aime_mixed_medium.json',
  usamo: 'tests/math/usamo_mixed_medium.json',
};

const file = files[level];
if (file) {
  fetch(file)
    .then((res) => res.json())
    .then((data) => renderTest(data.problems))
    .catch(() => {
      const container = document.getElementById('quiz');
      container.innerHTML = '<p>Failed to load test.</p>';
    });
} else {
  renderTest(null);
}

