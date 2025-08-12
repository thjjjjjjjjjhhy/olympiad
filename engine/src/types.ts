export interface PlanTask {
  title: string;
  date: string; // ISO date
}

export interface PlanJson {
  tasks: PlanTask[];
}
