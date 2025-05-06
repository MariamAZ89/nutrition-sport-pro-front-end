
import { FoodProgram, FoodProgramFormData } from "../types/foodProgram";
import { getAuthHeaders } from "./apiUtils";

const API_URL = import.meta.env.VITE_API_URL || 'https://localhost:7082/api';

export const foodProgramApi = {
  // Get all food programs
  getAll: async (): Promise<FoodProgram[]> => {
    const response = await fetch(`${API_URL}/foodprogram`, {
      headers: getAuthHeaders()
    });
    
    if (!response.ok) {
      throw new Error(`Error fetching food programs: ${response.statusText}`);
    }
    
    return await response.json();
  },
  
  // Get a specific food program by ID
  getById: async (id: number): Promise<FoodProgram> => {
    const response = await fetch(`${API_URL}/foodprogram/${id}`, {
      headers: getAuthHeaders()
    });
    
    if (!response.ok) {
      throw new Error(`Error fetching food program: ${response.statusText}`);
    }
    
    return await response.json();
  },
  
  // Create a new food program
  create: async (foodProgramData: FoodProgramFormData): Promise<FoodProgram> => {
    const response = await fetch(`${API_URL}/foodprogram`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(foodProgramData)
    });
    
    if (!response.ok) {
      throw new Error(`Error creating food program: ${response.statusText}`);
    }
    
    return await response.json();
  },
  
  // Update an existing food program
  update: async (id: number, foodProgramData: FoodProgramFormData): Promise<FoodProgram> => {
    const response = await fetch(`${API_URL}/foodprogram/${id}`, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify(foodProgramData)
    });
    
    if (!response.ok) {
      throw new Error(`Error updating food program: ${response.statusText}`);
    }
    
    return await response.json();
  },
  
  // Delete a food program
  delete: async (id: number): Promise<void> => {
    const response = await fetch(`${API_URL}/foodprogram/${id}`, {
      method: "DELETE",
      headers: getAuthHeaders()
    });
    
    if (!response.ok) {
      throw new Error(`Error deleting food program: ${response.statusText}`);
    }
  }
};
