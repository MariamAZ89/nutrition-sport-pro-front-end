
export interface TrainingPlan {
  id: number;
  objective: string;
  name: string;
  level: TrainingLevel;
  durationWeeks: number;
  createdAt: string;
  updatedAt: string | null;
}

export enum TrainingLevel {
  None = 0,
  Beginner = 1,
  Intermediate = 2,
  Advanced = 3
}

export interface TrainingPlanFormData {
  Objective: string;
  Name: string;
  Level: TrainingLevel;
  DurationWeeks: number;
}
