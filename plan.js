function formatTask(task) {
  if (typeof task === 'string') return task;
  const parts = [];
  if (task.type) parts.push(task.type);
  if (task.resource) parts.push(task.resource);
  if (task.topic) parts.push(`(${task.topic})`);
  if (task.pages) parts.push(`pp. ${task.pages}`);
  if (Array.isArray(task.problems)) parts.push(`problems ${task.problems.join(', ')}`);
  if (typeof task.timed === 'boolean') parts.push(task.timed ? '[timed]' : '[untimed]');
  return parts.join(' ');
}

function loadStudyPlan(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  fetch('plan.json')
    .then(response => {
      if (!response.ok) throw new Error('No plan found.');
      return response.json();
    })
    .then(data => {
      const plan = data.study_plan || data.schedule;
      if (!plan) throw new Error('Invalid plan data.');
      window.loadedPlan = plan;

      const table = document.createElement('table');
      table.className = 'plan-table';

      const header = table.insertRow();
      header.innerHTML = '<th>Date</th><th>Tasks</th>';

      for (const day of plan) {
        const row = table.insertRow();
        const dateCell = row.insertCell();
        dateCell.textContent = day.date;
        const taskCell = row.insertCell();
        const tasks = (day.tasks || []).map(formatTask);
        taskCell.innerHTML = tasks.join('<br>');
      }

      container.innerHTML = '';
      container.appendChild(table);
    })
    .catch(error => {
      container.textContent = 'No study plan found. Please generate one.';
      console.error(error);
    });
}
