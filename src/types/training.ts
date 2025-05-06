
export interface Training {
  id: number;
  date: string;
  duration: number;
  notes: string;
  createdAt: string;
  updatedAt: string | null;
}

export interface TrainingFormData {
  Date: string;
  Duration: number;
  Notes: string;
}

export interface Statistic {
  id: number;
  weight: number;
  muscleMass: number;
  fatMass: number;
  heartRate: number;
  date: string;
  notes: string;
  createdAt: string;
  updatedAt?: string | null;
}

export interface StatisticFormData {
  Weight: number;
  MuscleMass: number;
  FatMass: number;
  HeartRate: number;
  Date: string;
  Notes: string;
}

export enum SportsProfileLevel {
  Beginner = 1,
  Intermediate = 2,
  Advanced = 3,
  Professional = 4,
  Elite = 5,
  Expert = 6,
  Master = 7,
  Champion = 8,
  Legend = 9,
  God = 10
}

export interface SportsProfile {
  id: number;
  weight: number;
  height: number;
  goals: string;
  level: number;
  createdAt: string;
  updatedAt?: string | null;
  userId: string;
  user: null | any;
}

export interface SportsProfileFormData {
  Weight: number;
  Height: number;
  Goals: string;
  Level: number;
}
