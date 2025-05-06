
import React, { createContext, useState, useContext, useEffect } from "react";

interface AuthUser {
  userId: string;
  email: string;
  roles: string[]; // This should be a string array
  token: string;
  expiresAt: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: AuthUser | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
  error: string | null;
}

const API_URL = import.meta.env.VITE_API_URL || 'https://localhost:7082/api';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check for existing auth data in localStorage on component mount
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        const expiresAt = new Date(userData.expiresAt).getTime();
        
        // Check if token is expired
        if (expiresAt > Date.now()) {
          // Ensure roles is always an array
          if (userData.roles && !Array.isArray(userData.roles)) {
            userData.roles = userData.roles.split(',');
          } else if (!userData.roles) {
            userData.roles = [];
          }
          
          setUser(userData);
        } else {
          // Token expired, clean up localStorage
          localStorage.removeItem("user");
        }
      } catch (e) {
        localStorage.removeItem("user");
      }
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          Email: email,
          Password: password,
        }),
      });

      const data = await response.json();
      
      if (data.isAuthenticated) {
        // Ensure roles is always an array
        if (data.roles && !Array.isArray(data.roles)) {
          data.roles = data.roles.split(',');
        } else if (!data.roles) {
          data.roles = [];
        }
        
        const userData: AuthUser = {
          userId: data.userId,
          email: data.email,
          roles: data.roles,
          token: data.token,
          expiresAt: data.expiresAt,
        };
        
        setUser(userData);
        localStorage.setItem("user", JSON.stringify(userData));
        setIsLoading(false);
        return true;
      } else {
        setError(data.message || "Login failed");
        setIsLoading(false);
        return false;
      }
    } catch (err) {
      setError("Failed to connect to authentication server");
      console.error("Login error:", err);
      setIsLoading(false);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  const value = {
    isAuthenticated: !!user,
    user,
    login,
    logout,
    isLoading,
    error,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
