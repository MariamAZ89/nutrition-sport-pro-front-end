
import { TrainingPlan, TrainingPlanFormData } from "../types/trainingPlan";
import { getAuthHeaders } from "./apiUtils";

const API_URL = import.meta.env.VITE_API_URL || 'https://localhost:7082/api';

export const trainingPlanApi = {
  // Get all training plans
  getAll: async (): Promise<TrainingPlan[]> => {
    const response = await fetch(`${API_URL}/trainingplan/getAll`, {
      headers: getAuthHeaders()
    });
    
    if (!response.ok) {
      throw new Error(`Error fetching training plans: ${response.statusText}`);
    }
    
    return await response.json();
  },
  
  // Get a specific training plan by ID
  getById: async (id: number): Promise<TrainingPlan> => {
    const response = await fetch(`${API_URL}/trainingplan/${id}`, {
      headers: getAuthHeaders()
    });
    
    if (!response.ok) {
      throw new Error(`Error fetching training plan: ${response.statusText}`);
    }
    
    return await response.json();
  },
  
  // Create a new training plan
  create: async (trainingPlanData: TrainingPlanFormData): Promise<TrainingPlan> => {
    const response = await fetch(`${API_URL}/trainingplan/Add`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(trainingPlanData)
    });
    
    if (!response.ok) {
      throw new Error(`Error creating training plan: ${response.statusText}`);
    }
    
    return await response.json();
  },
  
  // Update an existing training plan
  update: async (id: number, trainingPlanData: TrainingPlanFormData): Promise<TrainingPlan> => {
    const response = await fetch(`${API_URL}/trainingplan/${id}`, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify({...trainingPlanData, Id: id})
    });
    
    if (!response.ok) {
      throw new Error(`Error updating training plan: ${response.statusText}`);
    }
    
    return await response.json();
  },
  
  // Delete a training plan
  delete: async (id: number): Promise<void> => {
    const response = await fetch(`${API_URL}/trainingplan/${id}`, {
      method: "DELETE",
      headers: getAuthHeaders()
    });
    
    if (!response.ok) {
      throw new Error(`Error deleting training plan: ${response.statusText}`);
    }
  }
};
