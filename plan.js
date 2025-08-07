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

function loadStudyPlan(containerId, perPage = 7) {
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

      let currentPage = 0;
      const totalPages = Math.ceil(plan.length / perPage);

      function render() {
        container.innerHTML = '';
        const table = document.createElement('table');
        table.className = 'plan-table';
        const header = table.insertRow();
        header.innerHTML = '<th>Date</th><th>Tasks</th>';
        const start = currentPage * perPage;
        const end = Math.min(start + perPage, plan.length);
        for (let i = start; i < end; i++) {
          const day = plan[i];
          const row = table.insertRow();
          const dateCell = row.insertCell();
          dateCell.textContent = day.date;
          const taskCell = row.insertCell();
          const tasks = (day.tasks || []).map(formatTask);
          taskCell.innerHTML = tasks.join('<br>');
        }
        container.appendChild(table);

        if (totalPages > 1) {
          const nav = document.createElement('div');
          nav.className = 'pagination';
          const prev = document.createElement('button');
          prev.textContent = 'Prev';
          prev.disabled = currentPage === 0;
          prev.addEventListener('click', () => { currentPage--; render(); });
          const info = document.createElement('span');
          info.textContent = `Page ${currentPage + 1} of ${totalPages}`;
          const next = document.createElement('button');
          next.textContent = 'Next';
          next.disabled = currentPage >= totalPages - 1;
          next.addEventListener('click', () => { currentPage++; render(); });
          nav.append(prev, info, next);
          container.appendChild(nav);
        }
      }

      render();
    })
    .catch(error => {
      container.textContent = 'No study plan found. Please generate one.';
      console.error(error);
    });
}
