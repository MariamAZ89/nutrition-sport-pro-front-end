
/**
 * Utility functions for API communication with authentication
 */

/**
 * Get authentication headers for API requests
 * @returns Headers object with Authorization Bearer token
 */
export const getAuthHeaders = (): Record<string, string> => {
  const userJson = localStorage.getItem("user");
  
  if (!userJson) {
    throw new Error("User not authenticated");
  }
  
  try {
    const userData = JSON.parse(userJson);
    
    if (!userData.token) {
      throw new Error("No authentication token found");
    }
    
    return {
      "Authorization": `Bearer ${userData.token}`,
      "Content-Type": "application/json"
    };
  } catch (error) {
    console.error("Failed to parse authentication data:", error);
    throw new Error("Authentication data is invalid");
  }
};
