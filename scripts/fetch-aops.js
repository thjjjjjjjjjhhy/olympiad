#!/usr/bin/env node
import fs from 'fs';
import path from 'path';

  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const html = await res.text();
    const $ = load(html);
    // Statement
    let statement = $('#Problem').next().text().trim();
    if (!statement) {
      statement = $('div.problem-statement').text().trim();
    }
    // Choices for AMC
    let choices;
    if (format === 'multiple-choice') {
      choices = [];
      $('#Problem').nextAll('ol').first().children('li').each((i, el) => {
        choices.push($(el).text().trim());
      });
      if (choices.length === 0) {
        $('ol li').each((i, el) => {
          if (i < 5) choices.push($(el).text().trim());
        });
      }
    }
    // Official Answer
    let officialAnswer = $('span.answer').text().trim();
    if (!officialAnswer) {
      const ansBox = $('.answer');
      if (ansBox.length) officialAnswer = ansBox.first().text().trim();
    }
    officialAnswer = officialAnswer.replace(/Answer:?\s*/i, '').replace(/[^A-Za-z0-9]/g, '').toUpperCase();
    if (!statement && !choices && !officialAnswer) {
      throw new Error('No data parsed');
    }
    const result = {};
    if (statement) result.statement = statement;
    if (choices && choices.length === 5) result.choices = choices;
    if (officialAnswer) result.officialAnswer = officialAnswer;
    return result;
  } catch (e) {
    console.warn(`Failed to scrape ${url}: ${e.message}`);
    return {};
  }
}

async function main() {
  const [,, inputPath, outputPath] = process.argv;
  if (!inputPath || !outputPath) {
    console.error('Usage: node scripts/fetch-aops.js <input-json> <output-json>');
    process.exit(1);
  }
  const raw = await fs.promises.readFile(inputPath, 'utf8');
  const data = JSON.parse(raw);
  for (const test of data.tests) {
    for (const prob of test.problems) {
      const extra = await scrapeProblem(prob.aops, test.format);
      Object.assign(prob, extra);
    }
  }
  await fs.promises.mkdir(path.dirname(outputPath), { recursive: true });
  await fs.promises.writeFile(outputPath, JSON.stringify(data, null, 2));
  console.log(`Wrote ${outputPath}`);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
