
import { Statistic, StatisticFormData } from "@/types/training";
import { getAuthHeaders } from "./apiUtils";

// API Base URL - Replace with your actual API URL
const API_URL = import.meta.env.VITE_API_URL || "https://localhost:7082/api'";

export const statisticsApi = {
  // Get all statistics
  getAll: async (): Promise<Statistic[]> => {
    const response = await fetch(`${API_URL}/statistic`, {
      method: "GET",
      headers: getAuthHeaders(),
    });


    if (!response.ok) {
      throw new Error(`Error fetching statistics: ${response.statusText}`);
    }

    return response.json();
  },

  // Get a statistic by ID
  getById: async (id: number): Promise<Statistic> => {
    const response = await fetch(`${API_URL}/statistic/${id}`, {
      method: "GET",
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error(`Error fetching statistic: ${response.statusText}`);
    }

    return response.json();
  },

  // Create a new statistic
  create: async (data: StatisticFormData): Promise<Statistic> => {
    const response = await fetch(`${API_URL}/statistic`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`Error creating statistic: ${response.statusText}`);
    }

    return response.json();
  },

  // Update a statistic
  update: async (id: number, data: StatisticFormData): Promise<Statistic> => {
    const response = await fetch(`${API_URL}/statistic/${id}`, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify({
        Id: id,
        ...data,
      }),
    });

    if (!response.ok) {
      throw new Error(`Error updating statistic: ${response.statusText}`);
    }

    return response.json();
  },

  // Delete a statistic
  delete: async (id: number): Promise<void> => {
    const response = await fetch(`${API_URL}/statistic/${id}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error(`Error deleting statistic: ${response.statusText}`);
    }
  },
};
