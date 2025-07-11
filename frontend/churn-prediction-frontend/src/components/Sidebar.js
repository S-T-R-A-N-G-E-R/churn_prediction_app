import React from 'react';
import { NavLink } from 'react-router-dom';

const Sidebar = () => {
  return (
    <div className="w-64 bg-white shadow-md h-screen p-4">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Churn Dashboard</h2>
      <nav>
        <ul className="space-y-2">
          <li>
            <NavLink
              to="/predict"
              className={({ isActive }) =>
                `block p-2 rounded hover-effect ${isActive ? 'bg-blue-100 text-blue-800' : 'text-gray-700'}`
              }
            >
              Predict Churn
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/model-performance"
              className={({ isActive }) =>
                `block p-2 rounded hover-effect ${isActive ? 'bg-blue-100 text-blue-800' : 'text-gray-700'}`
              }
            >
              Model Performance
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/feature-importance"
              className={({ isActive }) =>
                `block p-2 rounded hover-effect ${isActive ? 'bg-blue-100 text-blue-800' : 'text-gray-700'}`
              }
            >
              Feature Importance
            </NavLink>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;