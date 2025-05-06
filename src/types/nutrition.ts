
export interface Nutrition {
  id: string;
  calories: number;
  protein: number;
  carbohydrates: number;
  lipids: number;
  food: string;
  notes: string;
  date: string;
}

export interface NutritionFormData {
  Calories: number;
  Protein: number;
  Carbohydrates: number;
  Lipids: number;
  Food: string;
  Notes: string;
  Date: string;
}
