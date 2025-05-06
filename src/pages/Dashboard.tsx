
import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import NutritionPage from "./Nutrition";
import TrainingPlanPage from "./TrainingPlan";
import TrainingPage from "./Training";
import StatisticsPage from "./Statistics";
import SportsProfilePage from "./SportsProfile";
import { Utensils, Dumbbell, BarChart, LineChart, User } from "lucide-react";

const Dashboard = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");

  // Ensure roles is an array before using join()
  const userRoles = user?.roles && Array.isArray(user.roles) 
    ? user.roles.join(", ") 
    : typeof user?.roles === 'string' 
      ? user.roles 
      : '';

  return (
    <div className="container mt-4">
      <div className="row">
        <div className="col-12">
          <div className="card shadow-sm">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 className="mb-0">Dashboard</h2>
                <button 
                  className="btn btn-outline-danger" 
                  onClick={logout}
                >
                  Logout
                </button>
              </div>
              
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="mb-4">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="nutrition" className="flex items-center gap-1">
                    <Utensils className="h-4 w-4" />
                    Nutrition
                  </TabsTrigger>
                  <TabsTrigger value="trainingPlan" className="flex items-center gap-1">
                    <Dumbbell className="h-4 w-4" />
                    Training Plans
                  </TabsTrigger>
                  <TabsTrigger value="training" className="flex items-center gap-1">
                    <BarChart className="h-4 w-4" />
                    Training Entries
                  </TabsTrigger>
                  <TabsTrigger value="statistics" className="flex items-center gap-1">
                    <LineChart className="h-4 w-4" />
                    Statistics
                  </TabsTrigger>
                  <TabsTrigger value="sportsProfile" className="flex items-center gap-1">
                    <User className="h-4 w-4" />
                    Sports Profile
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="overview">
                  <div className="alert alert-success">
                    <h4>Welcome, {user?.email}!</h4>
                    <p>You've successfully logged in to NutriSportPro.</p>
                  </div>
                  
                  <div className="card mb-4">
                    <div className="card-body">
                      <h5 className="card-title">User Information</h5>
                      <ul className="list-group list-group-flush">
                        <li className="list-group-item">
                          <strong>Email:</strong> {user?.email}
                        </li>
                        <li className="list-group-item">
                          <strong>User ID:</strong> {user?.userId}
                        </li>
                        <li className="list-group-item">
                          <strong>Roles:</strong> {userRoles}
                        </li>
                        <li className="list-group-item">
                          <strong>Session Expires:</strong> {new Date(user?.expiresAt || "").toLocaleString()}
                        </li>
                      </ul>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="nutrition">
                  <NutritionPage />
                </TabsContent>

                <TabsContent value="trainingPlan">
                  <TrainingPlanPage />
                </TabsContent>

                <TabsContent value="training">
                  <TrainingPage />
                </TabsContent>

                <TabsContent value="statistics">
                  <StatisticsPage />
                </TabsContent>

                <TabsContent value="sportsProfile">
                  <SportsProfilePage />
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
