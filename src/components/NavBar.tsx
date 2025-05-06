
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { 
  Home, 
  LayoutDashboard, 
  BarChart2, 
  UserCircle,
  LogOut,
  Apple,
  Dumbbell
} from "lucide-react";

const NavBar = () => {
  const { isAuthenticated, logout } = useAuth();

  return (
    <nav className="bg-primary text-white shadow-md">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <Link to="/" className="text-xl font-bold">
            NutriSportPro
          </Link>
          
          <div className="md:hidden">
            <button
              className="text-white focus:outline-none"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#navbarNav"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
              </svg>
            </button>
          </div>
          
          <div className="hidden md:flex md:items-center md:space-x-4" id="navbarNav">
            <Link to="/" className="flex items-center px-3 py-2 rounded hover:bg-primary-700 transition-colors">
              <Home className="mr-1 h-4 w-4" />
              <span>Home</span>
            </Link>
            
            {isAuthenticated ? (
              <>
                <Link to="/dashboard" className="flex items-center px-3 py-2 rounded hover:bg-primary-700 transition-colors">
                  <LayoutDashboard className="mr-1 h-4 w-4" />
                  <span>Dashboard</span>
                </Link>
                <Link to="/statistics" className="flex items-center px-3 py-2 rounded hover:bg-primary-700 transition-colors">
                  <BarChart2 className="mr-1 h-4 w-4" />
                  <span>Statistics</span>
                </Link>
                <Link to="/sports-profile" className="flex items-center px-3 py-2 rounded hover:bg-primary-700 transition-colors">
                  <UserCircle className="mr-1 h-4 w-4" />
                  <span>Sports Profile</span>
                </Link>
                <Link to="/food-program" className="flex items-center px-3 py-2 rounded hover:bg-primary-700 transition-colors">
                  <Apple className="mr-1 h-4 w-4" />
                  <span>Food Program</span>
                </Link>
                <Link to="/exercise" className="flex items-center px-3 py-2 rounded hover:bg-primary-700 transition-colors">
                  <Dumbbell className="mr-1 h-4 w-4" />
                  <span>Exercise</span>
                </Link>
                <button 
                  onClick={logout} 
                  className="flex items-center px-3 py-2 rounded hover:bg-primary-700 transition-colors"
                >
                  <LogOut className="mr-1 h-4 w-4" />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <Link to="/login" className="flex items-center px-3 py-2 rounded hover:bg-primary-700 transition-colors">
                <span>Login</span>
              </Link>
            )}
          </div>
        </div>
        
        {/* Mobile menu */}
        <div className="md:hidden collapse" id="navbarNav">
          <div className="pt-2 pb-3 space-y-1">
            <Link to="/" className="block px-3 py-2 rounded hover:bg-primary-700 transition-colors">
              Home
            </Link>
            
            {isAuthenticated ? (
              <>
                <Link to="/dashboard" className="block px-3 py-2 rounded hover:bg-primary-700 transition-colors">
                  Dashboard
                </Link>
                <Link to="/statistics" className="block px-3 py-2 rounded hover:bg-primary-700 transition-colors">
                  Statistics
                </Link>
                <Link to="/sports-profile" className="block px-3 py-2 rounded hover:bg-primary-700 transition-colors">
                  Sports Profile
                </Link>
                <Link to="/food-program" className="block px-3 py-2 rounded hover:bg-primary-700 transition-colors">
                  Food Program
                </Link>
                <Link to="/exercise" className="block px-3 py-2 rounded hover:bg-primary-700 transition-colors">
                  Exercise
                </Link>
                <button 
                  onClick={logout} 
                  className="block w-full text-left px-3 py-2 rounded hover:bg-primary-700 transition-colors"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link to="/login" className="block px-3 py-2 rounded hover:bg-primary-700 transition-colors">
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
