import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navbar: React.FC = () => {
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path ? 'bg-primary-700' : '';
  };

  return (
    <nav className="bg-primary-600 shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <Link to="/" className="text-white text-xl font-bold">
            🤖 Churn Predictor
          </Link>
          
          <div className="flex space-x-4">
            <Link
              to="/"
              className={`text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-primary-700 transition-colors ${isActive('/')}`}
            >
              🏠 Home
            </Link>
            <Link
              to="/predict"
              className={`text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-primary-700 transition-colors ${isActive('/predict')}`}
            >
              🔮 Predict
            </Link>
            <Link
              to="/performance"
              className={`text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-primary-700 transition-colors ${isActive('/performance')}`}
            >
              📊 Performance
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
