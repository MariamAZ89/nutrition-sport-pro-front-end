
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const Home = () => {
  const { isAuthenticated, user } = useAuth();

  return (
    <div className="container mt-5">
      <div className="row align-items-center">
        <div className="col-md-6">
          <h1 className="display-4 fw-bold">Welcome to NutriSportPro</h1>
          <p className="lead mt-3">
            Your professional platform for sports nutrition and personalized training plans.
          </p>
          {!isAuthenticated ? (
            <Link to="/login" className="btn btn-primary btn-lg mt-3">
              Login to Access Your Dashboard
            </Link>
          ) : (
            <div className="mt-3">
              <h5>Welcome back, {user?.email}</h5>
              <Link to="/dashboard" className="btn btn-success btn-lg mt-2">
                Go to Dashboard
              </Link>
            </div>
          )}
        </div>
        <div className="col-md-6 text-center">
          <img 
            src="https://placehold.co/600x400/2a7fd4/FFFFFF?text=NutriSportPro" 
            alt="NutriSportPro" 
            className="img-fluid rounded shadow"
          />
        </div>
      </div>

      <div className="row mt-5 mb-5">
        <div className="col-md-4">
          <div className="card h-100 shadow-sm">
            <div className="card-body">
              <h3 className="card-title">Personalized Nutrition</h3>
              <p className="card-text">
                Get customized nutrition plans based on your goals and preferences.
              </p>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card h-100 shadow-sm">
            <div className="card-body">
              <h3 className="card-title">Training Programs</h3>
              <p className="card-text">
                Access professional training programs designed for your fitness level.
              </p>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card h-100 shadow-sm">
            <div className="card-body">
              <h3 className="card-title">Progress Tracking</h3>
              <p className="card-text">
                Track your progress and see your improvements over time.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
