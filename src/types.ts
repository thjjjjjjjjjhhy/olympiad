export interface UserInfo {
  target_exam: string;
  target_date: string;
  daily_minutes: number;
}

export interface DiagnosticResponse {
  id: string;
  section: string;
  skill: string;
  correct: boolean;
  time_sec: number;
  difficulty: number;
}

export interface DiagnosticInput {
  user: UserInfo;
  responses: DiagnosticResponse[];
}

export interface SkillNode {
  prereq: string[];
  weight: Record<string, number>;
}

export type SkillsGraph = Record<string, SkillNode>;

export interface AoPSResource {
  book_id: string;
  chapter: string;
  pages: [number, number];
  problems: string[];
}

export type AoPSMap = Record<string, AoPSResource[]>;

export interface PracticeItem {
  skill: string;
  exam: string;
  year: number;
  number: number;
  est_minutes: number;
  difficulty: number;
}

export type PracticeBank = PracticeItem[];

export interface Policy {
  speed: { slow_sec: number; fast_sec: number };
  gains: { reading: number; problems: number; practice: number; review: number };
  durations: { reading_per_page: number; problem_per_item: number };
  review_percentages: number[];
  spacing: number[];
  slack: number;
}

export interface Block {
  id: string;
  skill: string;
  domain: string;
  type: 'reading' | 'problems' | 'practice' | 'review' | 'todo';
  resource: any;
  minutes: number;
  expected_gain: number;
  title: string;
  review_of?: string;
}

export interface PlanDay {
  date: string;
  blocks: Block[];
}

export type Plan = PlanDay[];
