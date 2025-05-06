
import { Training, TrainingFormData } from "../types/training";
import { getAuthHeaders } from "./apiUtils";

const API_URL = import.meta.env.VITE_API_URL || 'https://localhost:7082/api';

export const trainingApi = {
  // Get all training entries
  getAll: async (): Promise<Training[]> => {
    const response = await fetch(`${API_URL}/training`, {
      headers: getAuthHeaders()
    });
    
    if (!response.ok) {
      throw new Error(`Error fetching training entries: ${response.statusText}`);
    }
    
    return await response.json();
  },
  
  // Get a specific training entry by ID
  getById: async (id: number): Promise<Training> => {
    const response = await fetch(`${API_URL}/training/${id}`, {
      headers: getAuthHeaders()
    });
    
    if (!response.ok) {
      throw new Error(`Error fetching training entry: ${response.statusText}`);
    }
    
    return await response.json();
  },
  
  // Create a new training entry
  create: async (trainingData: TrainingFormData): Promise<Training> => {
    const response = await fetch(`${API_URL}/training`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(trainingData)
    });
    
    if (!response.ok) {
      throw new Error(`Error creating training entry: ${response.statusText}`);
    }
    
    return await response.json();
  },
  
  // Update an existing training entry
  update: async (id: number, trainingData: TrainingFormData): Promise<Training> => {
    const response = await fetch(`${API_URL}/training/${id}`, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify({...trainingData, Id: id})
    });
    
    if (!response.ok) {
      throw new Error(`Error updating training entry: ${response.statusText}`);
    }
    
    return await response.json();
  },
  
  // Delete a training entry
  delete: async (id: number): Promise<void> => {
    const response = await fetch(`${API_URL}/training/${id}`, {
      method: "DELETE",
      headers: getAuthHeaders()
    });
    
    if (!response.ok) {
      throw new Error(`Error deleting training entry: ${response.statusText}`);
    }
  }
};
