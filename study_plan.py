"""Study plan generator for Olympiad preparation.

This module defines a function ``build_study_plan`` which consumes a
metadata dictionary as described in the program specification and returns a
list of day-by-day tasks. The algorithm follows the high level rules from the
specification:

* Detect the three weakest subjects from the diagnostic scores.
* Allocate tasks based on a weekly template (Mon-Sun) with heavier study on
  weekends.
* Adjust book vs contest focus depending on how far the test date is.
* Override the final ten days with a special review/contest routine.

The output structure matches the example in the spec. The module does not
require any external dependencies beyond the Python standard library.
"""

from __future__ import annotations

from dataclasses import dataclass
from datetime import datetime, timedelta
from typing import Dict, List, Tuple

# ---------------------------------------------------------------------------
# Resource maps. Each topic points to a book section with page/problem ranges
# as well as a simple list of full past contests to draw from.
# ---------------------------------------------------------------------------

BOOK_SECTIONS: Dict[str, Dict[str, Tuple[int, int]]] = {
    "Intro Algebra": {"pages": (241, 260), "problems": (1, 30)},
    "Intro Number Theory": {"pages": (185, 208), "problems": (1, 25)},
    "Intro Counting & Prob": {"pages": (221, 244), "problems": (1, 30)},
    "Intro Geometry": {"pages": (305, 330), "problems": (1, 20)},
    "Int Algebra": {"pages": (171, 196), "problems": (1, 40)},
    "Int C&P": {"pages": (265, 290), "problems": (1, 30)},
    "AoPS Vol 2 Inequalities": {"pages": (413, 440), "problems": (1, 25)},
    "106 Geo A": {"pages": (1, 80), "problems": (1, 40)},
    "106 Geo B": {"pages": (81, 160), "problems": (41, 80)},
    "106 Geo C": {"pages": (161, 250), "problems": (81, 106)},
}

# Each subject maps to one or more AoPS resources in the order they should be
# consumed. As a resource is completed the schedule advances to the next.
SUBJECT_RESOURCES: Dict[str, List[str]] = {
    "Algebra": ["Intro Algebra", "Int Algebra"],
    "NumberTheory": ["Intro Number Theory"],
    "Combinatorics": ["Intro Counting & Prob", "Int C&P"],
    "Probability": ["Intro Counting & Prob", "Int C&P"],
    "Geometry": ["Intro Geometry", "106 Geo A", "106 Geo B", "106 Geo C"],
    "Sequences": ["Int Algebra"],
    "Inequalities": ["AoPS Vol 2 Inequalities"],
    "FunctionalEq": ["Int Algebra"],
    "CoordinateGeo": ["Intro Geometry", "106 Geo A", "106 Geo B", "106 Geo C"],
    "Logic": ["Intro Algebra"],
}

PAST_CONTESTS: Dict[str, List[str]] = {
    "AMC10": ["AMC10 2024A", "AMC10 2024B", "AMC10 2023A", "AMC10 2023B"],
    "AMC12": ["AMC12 2024A", "AMC12 2023B", "AMC12 2023A"],
    "AIME": ["AIME I 2024", "AIME II 2023", "AIME I 2023"],
    "USAMO": ["USAMO 2024", "USAMO 2023"],
}


@dataclass
class BookProgress:
    book: str
    page: int
    problem: int

    def next_assignment(self, pages: int = 10, problems: int = 10) -> Tuple[str, List[int]]:
        meta = BOOK_SECTIONS[self.book]
        p_start = self.page
        p_end = min(p_start + pages - 1, meta["pages"][1])
        pr_start = self.problem
        pr_end = min(pr_start + problems - 1, meta["problems"][1])
        self.page = p_end + 1
        self.problem = pr_end + 1
        return f"{p_start}-{p_end}", list(range(pr_start, pr_end + 1))


def _phase(days_remaining: int, total_days: int) -> str:
    ratio = days_remaining / total_days
    if ratio > 0.6:
        return "early"
    if ratio > 0.2:
        return "middle"
    return "final"


def _top_weak_subjects(diag: Dict[str, int], n: int = 3) -> List[str]:
    return [k for k, _ in sorted(diag.items(), key=lambda kv: kv[1])[:n]]


def build_study_plan(meta: Dict) -> List[Dict]:
    today = datetime.strptime(meta["today"], "%Y-%m-%d").date()
    test_date = datetime.strptime(meta["test_date"], "%Y-%m-%d").date()
    days_left = (test_date - today).days
    total_days = days_left

    weak_subjects = _top_weak_subjects(meta["diagnostic"])
    other_subjects = [s for s in meta["diagnostic"] if s not in weak_subjects]

    # Progress trackers for every subject so that the plan can draw from all
    # AoPS books sequentially.
    progress: Dict[str, BookProgress] = {}
    resource_index: Dict[str, int] = {}
    for subj in meta["diagnostic"]:
        resources = SUBJECT_RESOURCES.get(subj)
        if resources:
            book = resources[0]
            section = BOOK_SECTIONS[book]
            progress[subj] = BookProgress(book, section["pages"][0], section["problems"][0])
            resource_index[subj] = 0

    def next_assignment(subj: str, pages: int = 10, problems: int = 10) -> Tuple[str, str, List[int]]:
        """Return book, page range and problem numbers for the given subject."""
        prog = progress[subj]
        pages_range, probs = prog.next_assignment(pages, problems)
        meta_sec = BOOK_SECTIONS[prog.book]
        if prog.page > meta_sec["pages"][1] and prog.problem > meta_sec["problems"][1]:
            # Advance to next resource if available
            idx = resource_index[subj] + 1
            resources = SUBJECT_RESOURCES.get(subj, [])
            if idx < len(resources):
                resource_index[subj] = idx
                new_book = resources[idx]
                section = BOOK_SECTIONS[new_book]
                progress[subj] = BookProgress(new_book, section["pages"][0], section["problems"][0])
        return prog.book, pages_range, probs

    full_contests = iter(PAST_CONTESTS.get(meta["level"], []))
    current_full_contest = next(full_contests, None)
    contest_problem_pointer = 1
    other_rotation = 0

    plan: List[Dict] = []
    cur = today
    while cur <= test_date:
        remaining = (test_date - cur).days
        phase = _phase(remaining, total_days)
        weekday = cur.weekday()
        entry = {"date": cur.isoformat(), "tasks": [], "notes": ""}

        if remaining < 10:
            if remaining <= 2:
                entry["tasks"].append({
                    "type": "contest_set",
                    "resource": "Half-length practice set",
                    "timed": True,
                    "topic": "Mixed"
                })
                entry["notes"] = "Focus on rest and mindset; keep work light."
            else:
                if remaining % 2 == 0:
                    if not current_full_contest:
                        current_full_contest = next(full_contests, "Past Contest")
                    entry["tasks"].append({
                        "type": "contest_set",
                        "resource": f"{current_full_contest} Full Test",
                        "timed": True,
                        "topic": "Mixed"
                    })
                    entry["notes"] = "Simulate exam conditions."
                    current_full_contest = next(full_contests, current_full_contest)
                else:
                    entry["tasks"].append({
                        "type": "review",
                        "resource": "Review mistakes from previous contest",
                        "timed": False,
                        "topic": "Review"
                    })
                    entry["notes"] = "Analyze errors and redo tough problems."
            plan.append(entry)
            cur += timedelta(days=1)
            continue

        if weekday == 0:  # Monday
            subj = weak_subjects[0]
            if phase == "final":
                res = f"{current_full_contest or 'Past Contest'} #{contest_problem_pointer}-{contest_problem_pointer + 9}"
                entry["tasks"].append({
                    "type": "contest_set",
                    "resource": res,
                    "timed": False,
                    "topic": subj,
                })
                contest_problem_pointer += 10
            else:
                book, pages, probs = next_assignment(subj)
                entry["tasks"].append({
                    "type": "reading",
                    "resource": book,
                    "pages": pages,
                    "problems": probs,
                    "topic": subj,
                })
            entry["notes"] = f"Focus on {subj}."

        elif weekday == 1:  # Tuesday
            subj = weak_subjects[1] if len(weak_subjects) > 1 else weak_subjects[0]
            if phase == "final":
                res = f"{current_full_contest or 'Past Contest'} #{contest_problem_pointer}-{contest_problem_pointer + 9}"
                entry["tasks"].append({
                    "type": "contest_set",
                    "resource": res,
                    "timed": False,
                    "topic": subj,
                })
                contest_problem_pointer += 10
            else:
                book, pages, probs = next_assignment(subj)
                entry["tasks"].append({
                    "type": "reading",
                    "resource": book,
                    "pages": pages,
                    "problems": probs,
                    "topic": subj,
                })
            entry["notes"] = f"Continue strengthening {subj}."

        elif weekday == 2:  # Wednesday
            res = f"{current_full_contest or 'Past Contest'} #{contest_problem_pointer}-{contest_problem_pointer + 9}"
            entry["tasks"].append({
                "type": "contest_set",
                "resource": res,
                "timed": False,
                "topic": f"Mixed ({', '.join(weak_subjects)})"
            })
            contest_problem_pointer += 10
            entry["notes"] = "Mixed practice covering weak topics."

        elif weekday == 3:  # Thursday
            subj = weak_subjects[2] if len(weak_subjects) > 2 else weak_subjects[0]
            if phase == "final":
                res = f"{current_full_contest or 'Past Contest'} #{contest_problem_pointer}-{contest_problem_pointer + 9}"
                entry["tasks"].append({
                    "type": "contest_set",
                    "resource": res,
                    "timed": False,
                    "topic": subj,
                })
                contest_problem_pointer += 10
            else:
                book, pages, probs = next_assignment(subj)
                entry["tasks"].append({
                    "type": "reading",
                    "resource": book,
                    "pages": pages,
                    "problems": probs,
                    "topic": subj,
                })
            entry["notes"] = f"Deep dive into {subj}."

        elif weekday == 4:  # Friday
            if other_subjects:
                subj = other_subjects[other_rotation % len(other_subjects)]
                other_rotation += 1
                if phase == "final":
                    res = f"{current_full_contest or 'Past Contest'} #{contest_problem_pointer}-{contest_problem_pointer + 9}"
                    entry["tasks"].append({
                        "type": "contest_set",
                        "resource": res,
                        "timed": False,
                        "topic": subj,
                    })
                    contest_problem_pointer += 10
                else:
                    book, pages, probs = next_assignment(subj, pages=6, problems=6)
                    entry["tasks"].append({
                        "type": "reading",
                        "resource": book,
                        "pages": pages,
                        "problems": probs,
                        "topic": subj,
                    })
            entry["tasks"].append({
                "type": "review",
                "resource": "Review missed questions and flashcards",
                "timed": False,
                "topic": "Review",
            })
            entry["notes"] = "Consolidate the week's learning."

        elif weekday == 5:  # Saturday
            if not current_full_contest:
                current_full_contest = next(full_contests, "Past Contest")
            entry["tasks"].append({
                "type": "contest_set",
                "resource": f"{current_full_contest} Full Test",
                "timed": True,
                "topic": "Mixed"
            })
            entry["notes"] = "Full-length timed practice."
            current_full_contest = next(full_contests, current_full_contest)

        else:  # Sunday
            entry["tasks"].append({
                "type": "rest",
                "resource": "Rest or light review",
                "timed": False,
                "topic": "Rest"
            })
            entry["notes"] = "Recharge for next week."

        plan.append(entry)
        cur += timedelta(days=1)

    return plan


__all__ = ["build_study_plan"]
