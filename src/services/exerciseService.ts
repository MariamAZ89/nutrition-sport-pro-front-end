
import { Exercise, ExerciseFormData } from "../types/exercise";
import { getAuthHeaders } from "./apiUtils";

const API_URL = import.meta.env.VITE_API_URL || 'https://localhost:7082/api';

export const exerciseApi = {
  // Get all exercises
  getAll: async (): Promise<Exercise[]> => {
    const response = await fetch(`${API_URL}/exercise`, {
      headers: getAuthHeaders()
    });
    
    if (!response.ok) {
      throw new Error(`Error fetching exercises: ${response.statusText}`);
    }
    
    return await response.json();
  },
  
  // Get a specific exercise by ID
  getById: async (id: number): Promise<Exercise> => {
    const response = await fetch(`${API_URL}/exercise/${id}`, {
      headers: getAuthHeaders()
    });
    
    if (!response.ok) {
      throw new Error(`Error fetching exercise: ${response.statusText}`);
    }
    
    return await response.json();
  },
  
  // Create a new exercise
  create: async (exerciseData: ExerciseFormData): Promise<Exercise> => {
    const response = await fetch(`${API_URL}/exercise`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(exerciseData)
    });
    
    if (!response.ok) {
      throw new Error(`Error creating exercise: ${response.statusText}`);
    }
    
    return await response.json();
  },
  
  // Update an existing exercise
  update: async (id: number, exerciseData: ExerciseFormData): Promise<Exercise> => {
    const response = await fetch(`${API_URL}/exercise/${id}`, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify(exerciseData)
    });
    
    if (!response.ok) {
      throw new Error(`Error updating exercise: ${response.statusText}`);
    }
    
    return await response.json();
  },
  
  // Delete an exercise
  delete: async (id: number): Promise<void> => {
    const response = await fetch(`${API_URL}/exercise/${id}`, {
      method: "DELETE",
      headers: getAuthHeaders()
    });
    
    if (!response.ok) {
      throw new Error(`Error deleting exercise: ${response.statusText}`);
    }
  }
};
