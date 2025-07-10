import React from 'react';
import { Link } from 'react-router-dom';

const Sidebar = () => {
  return (
    <div className="w-64 h-screen bg-gray-800 text-white p-4">
      <h2 className="text-2xl font-bold mb-6">Menu</h2>
      <ul>
        <li className="mb-4">
          <Link to="/predict" className="hover:text-blue-400">
            Prediction
          </Link>
        </li>
        <li className="mb-4">
          <Link to="/model-performance" className="hover:text-blue-400">
            Model Performance
          </Link>
        </li>
        <li className="mb-4">
          <Link to="/feature-importance" className="hover:text-blue-400">
            Feature Importance
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;