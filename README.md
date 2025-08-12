# Olympiad Study Planner

Deterministic TypeScript engine that converts diagnostic results into a day-by-day study plan with AoPS book references, practice sets and spaced reviews.

## Usage

```bash
npm install
npm run build
node dist/cli.js \
  --diagnostic data/diagnostic_results.json \
  --skills data/skills_graph.json \
  --aops data/aops_map.json \
  --practice data/practice_bank.json \
  --policy data/policy.json \
  --out out/
```

Outputs:

- `plan.json` – structured daily plan
- `plan.md` – markdown summary
- `study.ics` – calendar file

## JSON Schemas

### diagnostic_results.json
```
{
  "user": {
    "target_exam": string,
    "target_date": YYYY-MM-DD,
    "daily_minutes": number
  },
  "responses": [
    {
      "id": string,
      "section": string,
      "skill": string,
      "correct": boolean,
      "time_sec": number,
      "difficulty": number
    }
  ]
}
```

### skills_graph.json
Mapping of skill -> prerequisites and exam weights.

### aops_map.json
Skill to AoPS resources:
```
skill: [
  {
    "book_id": string,
    "chapter": string,
    "pages": [start, end],
    "problems": [string, ...]
  }
]
```

### practice_bank.json
Array of past contest problems:
```
{
  "skill": string,
  "exam": string,
  "year": number,
  "number": number,
  "est_minutes": number,
  "difficulty": number
}
```

### policy.json
Configures timing and gains.
```
{
  "speed": {"slow_sec": number, "fast_sec": number},
  "gains": {"reading": number, "problems": number, "practice": number, "review": number},
  "durations": {"reading_per_page": number, "problem_per_item": number},
  "review_percentages": [number, number, number],
  "spacing": [1,7,21],
  "slack": number
}
```

## Tests

```bash
npm test
```
