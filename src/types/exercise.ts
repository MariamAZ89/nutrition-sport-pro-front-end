
export interface Exercise {
  id: number;
  duration: number;
  repetitions: number;
  sets: number;
  weight: number;
  trainingId: number;
  training?: {
    duration: number;
    notes: string;
    date: string;
    id: number;
    createdAt: string;
    userId: string;
  };
  createdAt: string;
}

export interface ExerciseFormData {
  Duration: number;
  Repetitions: number;
  Sets: number;
  Weight: number;
  TrainingId: number;
}
