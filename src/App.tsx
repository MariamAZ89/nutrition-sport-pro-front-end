
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";

// Import Bootstrap CSS
import "bootstrap/dist/css/bootstrap.min.css";

// Import our components
import NavBar from "./components/NavBar";
import ProtectedRoute from "./components/ProtectedRoute";

// Import our pages
import Home from "./pages/Home";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Statistics from "./pages/Statistics";
import SportsProfile from "./pages/SportsProfile";
import FoodProgram from "./pages/FoodProgram";
import NotFound from "./pages/NotFound";
import Exercise from "./pages/Exercise";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <BrowserRouter>
          <NavBar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/statistics" 
              element={
                <ProtectedRoute>
                  <Statistics />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/sports-profile" 
              element={
                <ProtectedRoute>
                  <SportsProfile />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/food-program" 
              element={
                <ProtectedRoute>
                  <FoodProgram />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/exercise" 
              element={
                <ProtectedRoute>
                  <Exercise />
                </ProtectedRoute>
              } 
            />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
