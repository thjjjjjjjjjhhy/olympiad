# olympiad

All in one olympiad prep resource.

## Study plan generator

The repository includes a script that produces a day-by-day study schedule
based on diagnostic results and the target contest date.

1. Create a JSON file with the required metadata. Example:

```json
{
  "today": "2025-01-01",
  "test_date": "2025-05-15",
  "level": "AMC10",
  "diagnostic": {
    "Algebra": 12,
    "Geometry": 40,
    "NumberTheory": 75,
    "Combinatorics": 30,
    "Probability": 20,
    "Sequences": 50,
    "Inequalities": 80,
    "FunctionalEq": 60,
    "CoordinateGeo": 35,
    "Logic": 90
  }
}
```

2. Run the generator and redirect the output to a file:

```bash
python study_plan.py meta.json > plan.json
```

The resulting `plan.json` will contain the `study_plan` array with one entry
per day until the contest.
