const { buildAoPSUrl } = require('../../search.js');

const tests = [
  {
    q: '2024 AMC 12B Problem 4',
    url: 'https://artofproblemsolving.com/wiki/index.php/2024_AMC_12B_Problems/Problem_4'
  },
  {
    q: 'Problem 3 AIME I 2024',
    url: 'https://artofproblemsolving.com/wiki/index.php/2024_AIME_I_Problems/Problem_3'
  },
  {
    q: 'AIME 2 2019 #6',
    url: 'https://artofproblemsolving.com/wiki/index.php/2019_AIME_II_Problems/Problem_6'
  },
  {
    q: 'AMC10A 2022 problem 10',
    url: 'https://artofproblemsolving.com/wiki/index.php/2022_AMC_10A_Problems/Problem_10'
  }
];

let passed = 0;
for (const t of tests) {
  const got = buildAoPSUrl(t.q);
  if (got === t.url) {
    console.log('PASS', t.q);
    passed++;
  } else {
    console.error('FAIL', t.q, '\n expected:', t.url, '\n got:', got);
  }
}
console.log(`${passed}/${tests.length} tests passed`);
