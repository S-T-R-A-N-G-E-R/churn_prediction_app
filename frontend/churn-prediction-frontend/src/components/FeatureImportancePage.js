import React, { useState, useEffect } from 'react';
import axios from 'axios';

const FeatureImportancePage = () => {
  const [features, setFeatures] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFeatures = async () => {
      try {
        const response = await axios.get('http://localhost:8000/feature-importance');
        setFeatures(response.data);
      } catch (err) {
        setError('Error fetching feature importance. Check if the backend is running.');
        console.error(err);
      }
    };
    fetchFeatures();
  }, []);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">Feature Importance</h2>
      {error && <p className="mt-4 text-red-600">{error}</p>}
      {features && (
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h3 className="text-xl font-bold mb-4">Top Features Influencing Churn</h3>
          <ul className="space-y-2">
            {Object.entries(features).map(([name, importance], index) => (
              <li key={index} className="flex justify-between">
                <span className="font-medium">{name}</span>
                <span className="text-gray-600">{(importance * 100).toFixed(1)}%</span>
              </li>
            ))}
          </ul>
        </div>
      )}
      <div className="mt-6 bg-white p-4 rounded-lg shadow-md">
        <h3 className="text-xl font-bold mb-2">Feature Importance Chart</h3>
        <p>[Placeholder - Chart will go here]</p>
      </div>
    </div>
  );
};

export default FeatureImportancePage;