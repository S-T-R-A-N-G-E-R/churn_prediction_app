import React from 'react';

const FeatureImportancePage = () => {
  const features = [
    { name: 'Credit Score', importance: 0.35 },
    { name: 'Age', importance: 0.25 },
    { name: 'Balance', importance: 0.20 },
    { name: 'Num Of Products', importance: 0.15 },
    { name: 'Is Active Member', importance: 0.05 },
  ];

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">Feature Importance</h2>
      <div className="bg-white p-4 rounded-lg shadow-md">
        <h3 className="text-xl font-bold mb-4">Top Features Influencing Churn</h3>
        <ul className="space-y-2">
          {features.map((feature, index) => (
            <li key={index} className="flex justify-between">
              <span className="font-medium">{feature.name}</span>
              <span className="text-gray-600">{(feature.importance * 100).toFixed(1)}%</span>
            </li>
          ))}
        </ul>
      </div>
      <div className="mt-6 bg-white p-4 rounded-lg shadow-md">
        <h3 className="text-xl font-bold mb-2">Feature Importance Chart</h3>
        <p>[Placeholder - Chart will go here]</p>
      </div>
    </div>
  );
};

export default FeatureImportancePage;