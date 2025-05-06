
export interface FoodProgram {
  id: number;
  name: string;
  description: string;
  generationAI: string;
  createdAt: string;
  updatedAt: string | null;
  userId: string;
  user: any | null;
}

export interface FoodProgramFormData {
  Name: string;
  Description: string;
  GenerationAI: string;
}
