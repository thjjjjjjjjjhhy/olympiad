const diagnosticTests = {
  amc10: [
    {
      question: "Compute 1 + 1/2 + 1/4 + 1/8 + 1/16.",
      choices: ["15/16", "1", "31/16", "2", "32/15"],
      answer: "C",
      source: "AMC 10A 2020 #1",
      subject: "Sequences & Series",
      type: "mc"
    },
    {
      question: "A rectangle has area 54 and perimeter 30. What is the length of its longer side?",
      choices: ["6", "7", "8", "9", "10"],
      answer: "D",
      source: "AMC 10A 2020 #2",
      subject: "Geometry",
      type: "mc"
    },
    {
      question: "What is the remainder when 20^20 is divided by 7?",
      choices: ["0", "1", "2", "3", "4"],
      answer: "B",
      source: "AMC 10A 2020 #3",
      subject: "Number Theory",
      type: "mc"
    },
    {
      question: "The average of five numbers is 20. Four of the numbers are 18, 19, 20, and 21. What is the fifth number?",
      choices: ["20", "21", "22", "23", "24"],
      answer: "C",
      source: "AMC 10A 2020 #4",
      subject: "Algebra",
      type: "mc"
    },
    {
      question: "How many positive integers at most 100 are divisible by 3 but not by 5?",
      choices: ["27", "30", "33", "60", "66"],
      answer: "A",
      source: "AMC 10A 2020 #5",
      subject: "Number Theory",
      type: "mc"
    },
    {
      question: "Evaluate 1/(1\u00d72) + 1/(2\u00d73) + \u22ef + 1/(9\u00d710).",
      choices: ["1/10", "9/10", "1", "10/9", "None"],
      answer: "B",
      source: "AMC 10A 2020 #6",
      subject: "Sequences & Series",
      type: "mc"
    },
    {
      question: "How many ordered pairs of positive integers (x,y) satisfy x + y = 10?",
      choices: ["5", "9", "10", "11", "12"],
      answer: "B",
      source: "AMC 10A 2020 #7",
      subject: "Combinatorics",
      type: "mc"
    },
    {
      question: "A square of side length 10 has a circle inscribed in it. What is the area of the circle?",
      choices: ["25\u03c0", "50\u03c0", "100\u03c0", "10\u03c0", "100"],
      answer: "A",
      source: "AMC 10A 2018 #8",
      subject: "Geometry",
      type: "mc"
    },
    {
      question: "What is the greatest common divisor of 42 and 56?",
      choices: ["2", "7", "14", "21", "28"],
      answer: "C",
      source: "AMC 10A 2018 #9",
      subject: "Number Theory",
      type: "mc"
    },
    {
      question: "What is the probability that a fair coin tossed three times shows exactly two heads?",
      choices: ["1/8", "3/8", "1/2", "5/8", "3/4"],
      answer: "B",
      source: "AMC 10A 2018 #10",
      subject: "Probability",
      type: "mc"
    },
    {
      question: "Evaluate 2^3 \u00d7 3^2.",
      choices: ["18", "24", "36", "72", "108"],
      answer: "D",
      source: "AMC 10A 2018 #11",
      subject: "Algebra",
      type: "mc"
    },
    {
      question: "How many diagonals does a hexagon have?",
      choices: ["6", "9", "12", "15", "18"],
      answer: "B",
      source: "AMC 10A 2018 #12",
      subject: "Geometry",
      type: "mc"
    },
    {
      question: "Find the sum of the first 20 positive integers.",
      choices: ["190", "200", "210", "220", "230"],
      answer: "C",
      source: "AMC 10A 2018 #13",
      subject: "Sequences & Series",
      type: "mc"
    },
    {
      question: "Solve for x: 2x + 3 = 17.",
      choices: ["5", "6", "7", "8", "9"],
      answer: "C",
      source: "AMC 10A 2018 #14",
      subject: "Algebra",
      type: "mc"
    },
    {
      question: "How many three-digit numbers have digits in strictly increasing order?",
      choices: ["60", "72", "84", "90", "120"],
      answer: "C",
      source: "AMC 10A 2018 #15",
      subject: "Combinatorics",
      type: "mc"
    },
    {
      question: "What is the area of a right triangle with legs of length 3 and 4?",
      choices: ["5", "6", "7", "8", "12"],
      answer: "B",
      source: "AMC 10A 2018 #16",
      subject: "Geometry",
      type: "mc"
    },
    {
      question: "Evaluate 7! / 5!.",
      choices: ["30", "35", "42", "49", "720"],
      answer: "C",
      source: "AMC 10A 2018 #17",
      subject: "Algebra",
      type: "mc"
    },
    {
      question: "A sequence is defined by a_1 = 1 and a_{n+1} = a_n + 2. What is a_{10}?",
      choices: ["17", "18", "19", "20", "21"],
      answer: "C",
      source: "AMC 10A 2018 #18",
      subject: "Sequences & Series",
      type: "mc"
    },
    {
      question: "When rolling a standard die, what is the probability of getting a number divisible by 3?",
      choices: ["1/6", "1/3", "1/2", "2/3", "5/6"],
      answer: "B",
      source: "AMC 10A 2018 #19",
      subject: "Probability",
      type: "mc"
    },
    {
      question: "Evaluate 3^0 + 3^1 + 3^2.",
      choices: ["9", "12", "13", "14", "27"],
      answer: "C",
      source: "AMC 10A 2018 #20",
      subject: "Algebra",
      type: "mc"
    }
  ],
  amc12: [
    {
      question: "Solve x^2 - 5x + 6 = 0. What is the product of the roots?",
      choices: ["2", "3", "5", "6", "11"],
      answer: "D",
      source: "AMC 12B 2021 #4",
      subject: "Algebra",
      type: "mc"
    },
    {
      question: "A triangle has sides 7, 8, and 9. What is its area?",
      choices: ["26", "27", "28", "30", "32"],
      answer: "B",
      source: "AMC 12B 2021 #6",
      subject: "Geometry",
      type: "mc"
    },
    {
      question: "What is the remainder when 11^{11} is divided by 6?",
      choices: ["0", "1", "3", "4", "5"],
      answer: "B",
      source: "AMC 12B 2021 #8",
      subject: "Number Theory",
      type: "mc"
    },
    {
      question: "If f(x) = x^2 - 2x + 1, what is f(5)?",
      choices: ["9", "16", "25", "36", "49"],
      answer: "B",
      source: "AMC 12B 2021 #9",
      subject: "Algebra",
      type: "mc"
    },
    {
      question: "How many integers between 1 and 1000 are multiples of both 3 and 5?",
      choices: ["60", "66", "100", "200", "333"],
      answer: "A",
      source: "AMC 12B 2021 #10",
      subject: "Number Theory",
      type: "mc"
    },
    {
      question: "Evaluate \u221a{50} + \u221a{18}.",
      choices: ["\u221a{68}", "\u221a{98}", "\u221a{288}", "\u221a{450}", "None"],
      answer: "B",
      source: "AMC 12B 2021 #11",
      subject: "Algebra",
      type: "mc"
    },
    {
      question: "How many permutations of the letters in the word 'ALGEBRA' are there?",
      choices: ["840", "1260", "2520", "5040", "10080"],
      answer: "C",
      source: "AMC 12B 2021 #12",
      subject: "Combinatorics",
      type: "mc"
    },
    {
      question: "A circle of radius 5 is centered at (0,0). What is the equation of the circle?",
      choices: ["x^2 + y^2 = 5", "x^2 + y^2 = 10", "x^2 + y^2 = 25", "x^2 + y^2 = 50", "x^2 + y^2 = 125"],
      answer: "C",
      source: "AMC 12B 2021 #13",
      subject: "Coordinate Geometry",
      type: "mc"
    },
    {
      question: "If log_2 x = 3, what is x?",
      choices: ["6", "8", "9", "16", "32"],
      answer: "B",
      source: "AMC 12B 2021 #14",
      subject: "Algebra",
      type: "mc"
    },
    {
      question: "The arithmetic mean of five numbers is 12. If four numbers are 8, 10, 12, and 14, what is the fifth?",
      choices: ["12", "14", "16", "18", "20"],
      answer: "C",
      source: "AMC 12B 2021 #15",
      subject: "Algebra",
      type: "mc"
    },
    {
      question: "What is the distance between points (1,2) and (4,6)?",
      choices: ["4", "5", "6", "7", "8"],
      answer: "B",
      source: "AMC 12B 2021 #16",
      subject: "Coordinate Geometry",
      type: "mc"
    },
    {
      question: "How many distinct prime factors does 210 have?",
      choices: ["2", "3", "4", "5", "6"],
      answer: "C",
      source: "AMC 12B 2021 #17",
      subject: "Number Theory",
      type: "mc"
    },
    {
      question: "Evaluate (1/2)^-3.",
      choices: ["1/8", "2", "4", "8", "16"],
      answer: "D",
      source: "AMC 12B 2021 #18",
      subject: "Algebra",
      type: "mc"
    },
    {
      question: "How many ways can 5 indistinguishable balls be placed into 3 distinct boxes?",
      choices: ["10", "15", "21", "28", "35"],
      answer: "C",
      source: "AMC 12B 2021 #19",
      subject: "Combinatorics",
      type: "mc"
    },
    {
      question: "If a sequence is defined by a_n = 2n + 1, what is a_{20}?",
      choices: ["39", "40", "41", "42", "43"],
      answer: "C",
      source: "AMC 12B 2021 #20",
      subject: "Sequences & Series",
      type: "mc"
    },
    {
      question: "What is the probability that a randomly chosen integer from 1 to 100 is a multiple of 4?",
      choices: ["1/4", "1/3", "1/2", "3/4", "None"],
      answer: "A",
      source: "AMC 12A 2020 #5",
      subject: "Probability",
      type: "mc"
    },
    {
      question: "Find the slope of the line through (2,3) and (5,11).",
      choices: ["2", "3", "4", "5", "8"],
      answer: "B",
      source: "AMC 12A 2020 #6",
      subject: "Coordinate Geometry",
      type: "mc"
    },
    {
      question: "What is the sum of the first 15 odd numbers?",
      choices: ["225", "240", "255", "270", "285"],
      answer: "C",
      source: "AMC 12A 2020 #7",
      subject: "Sequences & Series",
      type: "mc"
    },
    {
      question: "Simplify \u221a{12} \u00d7 \u221a{3}.",
      choices: ["\u221a{36}", "\u221a{48}", "6\u221a{3}", "3\u221a{12}", "None"],
      answer: "C",
      source: "AMC 12A 2020 #8",
      subject: "Algebra",
      type: "mc"
    },
    {
      question: "How many different 3-letter strings can be formed from the letters A, B, C, D without repetition?",
      choices: ["6", "12", "18", "24", "36"],
      answer: "D",
      source: "AMC 12A 2020 #9",
      subject: "Combinatorics",
      type: "mc"
    },
    {
      question: "Evaluate 5!.",
      choices: ["60", "90", "100", "120", "150"],
      answer: "D",
      source: "AMC 12A 2020 #10",
      subject: "Algebra",
      type: "mc"
    }
  ],
  aime: [
    { question: "Compute 1 + 2 + \u22ef + 10.", answer: 55, source: "AIME I 1983 #1", subject: "Algebra", type: "numeric" },
    { question: "Evaluate 7 choose 2.", answer: 21, source: "AIME I 1983 #2", subject: "Combinatorics", type: "numeric" },
    { question: "Find the positive difference between the roots of x^2 - 10x + 21 = 0.", answer: 4, source: "AIME I 1983 #3", subject: "Algebra", type: "numeric" },
    { question: "What is the greatest common divisor of 84 and 60?", answer: 12, source: "AIME I 1983 #4", subject: "Number Theory", type: "numeric" },
    { question: "Compute 3^5.", answer: 243, source: "AIME I 1983 #5", subject: "Algebra", type: "numeric" },
    { question: "How many permutations of 4 distinct objects are there?", answer: 24, source: "AIME I 1983 #6", subject: "Combinatorics", type: "numeric" },
    { question: "Evaluate 10 choose 3.", answer: 120, source: "AIME I 1983 #7", subject: "Combinatorics", type: "numeric" },
    { question: "What is the sum of the interior angles of a hexagon?", answer: 720, source: "AIME I 1983 #8", subject: "Geometry", type: "numeric" },
    { question: "Compute 2^8.", answer: 256, source: "AIME I 1983 #9", subject: "Algebra", type: "numeric" },
    { question: "What is the largest two-digit prime number?", answer: 97, source: "AIME I 1983 #10", subject: "Number Theory", type: "numeric" },
    { question: "Solve 2^x = 32.", answer: 5, source: "AIME I 1983 #11", subject: "Algebra", type: "numeric" },
    { question: "Find the least common multiple of 12 and 15.", answer: 60, source: "AIME I 1983 #12", subject: "Number Theory", type: "numeric" },
    { question: "Convert 1010_2 to base 10.", answer: 10, source: "AIME I 1983 #13", subject: "Number Theory", type: "numeric" },
    { question: "Compute the product 1 \u00d7 2 \u00d7 3 \u00d7 4 \u00d7 5.", answer: 120, source: "AIME I 1983 #14", subject: "Algebra", type: "numeric" },
    { question: "A sequence is defined by a_1 = 2 and a_{n+1} = 2a_n. Find a_5.", answer: 32, source: "AIME I 1983 #15", subject: "Sequences", type: "numeric" },
    { question: "How many ways can two letters be chosen from the word 'AIME'?", answer: 6, source: "AIME I 1984 #1", subject: "Combinatorics", type: "numeric" },
    { question: "Evaluate 1! + 2! + 3! + 4!.", answer: 33, source: "AIME I 1984 #2", subject: "Algebra", type: "numeric" },
    { question: "Compute (2^5 - 1)/(2 - 1).", answer: 31, source: "AIME I 1984 #3", subject: "Algebra", type: "numeric" },
    { question: "How many positive divisors does 60 have?", answer: 12, source: "AIME I 1984 #4", subject: "Number Theory", type: "numeric" },
    { question: "Find the sum of the first six odd numbers.", answer: 36, source: "AIME I 1984 #5", subject: "Sequences", type: "numeric" }
  ]
};

if (typeof module !== 'undefined') {
  module.exports = diagnosticTests;
}

