
import { SportsProfile, SportsProfileFormData } from "@/types/training";
import { getAuthHeaders } from "./apiUtils";

// API Base URL - Replace with your actual API URL
const API_URL = import.meta.env.VITE_API_URL || "https://localhost:7082/api";

export const sportsProfileApi = {
  // Get all sports profiles
  getAll: async (): Promise<SportsProfile[]> => {
    const response = await fetch(`${API_URL}/sportsprofile`, {
      method: "GET",
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error(`Error fetching sports profiles: ${response.statusText}`);
    }

    return response.json();
  },

  // Get a sports profile by ID
  getById: async (id: number): Promise<SportsProfile> => {
    const response = await fetch(`${API_URL}/sportsprofile/${id}`, {
      method: "GET",
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error(`Error fetching sports profile: ${response.statusText}`);
    }

    return response.json();
  },

  // Create a new sports profile
  create: async (data: SportsProfileFormData): Promise<SportsProfile> => {
    const response = await fetch(`${API_URL}/sportsprofile`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`Error creating sports profile: ${response.statusText}`);
    }

    return response.json();
  },

  // Update a sports profile
  update: async (id: number, data: SportsProfileFormData): Promise<SportsProfile> => {
    const response = await fetch(`${API_URL}/sportsprofile/${id}`, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify({
        Id: id,
        ...data,
      }),
    });

    if (!response.ok) {
      throw new Error(`Error updating sports profile: ${response.statusText}`);
    }

    return response.json();
  },

  // Delete a sports profile
  delete: async (id: number): Promise<void> => {
    const response = await fetch(`${API_URL}/sportsprofile/${id}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error(`Error deleting sports profile: ${response.statusText}`);
    }
  },
};
