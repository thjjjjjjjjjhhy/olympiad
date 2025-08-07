function displaySummary() {
  const raw = localStorage.getItem('lastTestResults');
  if (!raw) return;
  try {
    const { correct, total, strengths = [], weaknesses = [] } = JSON.parse(raw);
    const div = document.getElementById('summary');
    let html = `<p>You scored ${correct} out of ${total}.</p>`;
    if (strengths.length) {
      html += `<p>Strengths: ${strengths.join(', ')}</p>`;
    }
    if (weaknesses.length) {
      html += `<p>Topics to review: ${weaknesses.join(', ')}</p>`;
    }
    div.innerHTML = html;
    localStorage.removeItem('lastTestResults');
  } catch (e) {
    console.error('Unable to load summary', e);
  }
}

function generateICS(plan) {
  if (!Array.isArray(plan)) return '';
  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//OlympiadPrep//StudyPlan//EN'
  ];
  plan.forEach((day, idx) => {
    const date = day.date.replace(/-/g, '');
    const tasks = (day.tasks || []).map(formatTask).join(' \n');
    lines.push('BEGIN:VEVENT');
    lines.push(`UID:${date}-${idx}@olympiadprep`);
    lines.push(`DTSTAMP:${date}T000000Z`);
    lines.push(`DTSTART;VALUE=DATE:${date}`);
    lines.push(`DTEND;VALUE=DATE:${date}`);
    lines.push('SUMMARY:Study Plan');
    lines.push(`DESCRIPTION:${tasks}`);
    lines.push('END:VEVENT');
  });
  lines.push('END:VCALENDAR');
  return lines.join('\r\n');
}

function setupExport() {
  const dl = document.getElementById('download-ics');
  const gcal = document.getElementById('google-calendar');
  function downloadICSFile() {
    const ics = generateICS(window.loadedPlan);
    const blob = new Blob([ics], { type: 'text/calendar' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'study_plan.ics';
    a.click();
    URL.revokeObjectURL(url);
  }
  dl.addEventListener('click', downloadICSFile);
  gcal.addEventListener('click', () => {
    downloadICSFile();
    window.open('https://calendar.google.com/calendar/u/0/r/settings/import', '_blank');
  });
}

document.addEventListener('DOMContentLoaded', () => {
  displaySummary();
  setupExport();
});
