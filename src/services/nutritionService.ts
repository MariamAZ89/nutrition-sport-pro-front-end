
import { Nutrition, NutritionFormData } from "../types/nutrition";
import { getAuthHeaders } from "./apiUtils";


const API_URL = import.meta.env.VITE_API_URL || 'https://localhost:7082/api';

export const nutritionApi = {
  // Get all nutrition records
  getAll: async (): Promise<Nutrition[]> => {
    const response = await fetch(`${API_URL}/nutrition`, {
      headers: getAuthHeaders()
    });
    
    if (!response.ok) {
      throw new Error(`Error fetching nutrition records: ${response.statusText}`);
    }
    
    return await response.json();
  },
  
  // Get a specific nutrition record by ID
  getById: async (id: string): Promise<Nutrition> => {
    const response = await fetch(`${API_URL}/nutrition/${id}`, {
      headers: getAuthHeaders()
    });
    
    if (!response.ok) {
      throw new Error(`Error fetching nutrition record: ${response.statusText}`);
    }
    
    return await response.json();
  },
  
  // Create a new nutrition record
  create: async (nutritionData: NutritionFormData): Promise<Nutrition> => {
    const response = await fetch(`${API_URL}/nutrition`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(nutritionData)
    });
    
    if (!response.ok) {
      throw new Error(`Error creating nutrition record: ${response.statusText}`);
    }
    
    return await response.json();
  },
  
  // Update an existing nutrition record
  update: async (id: string, nutritionData: NutritionFormData): Promise<Nutrition> => {
    const response = await fetch(`${API_URL}/nutrition/${id}`, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify(nutritionData)
    });
    
    if (!response.ok) {
      throw new Error(`Error updating nutrition record: ${response.statusText}`);
    }
    
    return await response.json();
  },
  
  // Delete a nutrition record
  delete: async (id: string): Promise<void> => {
    const response = await fetch(`${API_URL}/nutrition/${id}`, {
      method: "DELETE",
      headers: getAuthHeaders()
    });
    
    if (!response.ok) {
      throw new Error(`Error deleting nutrition record: ${response.statusText}`);
    }
  }
};
