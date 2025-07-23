import React from 'react';

const ModelPerformancePage = () => {
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">Model Performance</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h3 className="text-xl font-bold mb-2">Accuracy</h3>
          <p className="text-lg">85.2% [Placeholder]</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h3 className="text-xl font-bold mb-2">Precision</h3>
          <p className="text-lg">87.4% [Placeholder]</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h3 className="text-xl font-bold mb-2">Recall</h3>
          <p className="text-lg">83.9% [Placeholder]</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h3 className="text-xl font-bold mb-2">F1 Score</h3>
          <p className="text-lg">85.6% [Placeholder]</p>
        </div>
      </div>
      <div className="mt-6 bg-white p-4 rounded-lg shadow-md">
        <h3 className="text-xl font-bold mb-2">ROC Curve</h3>
        <p>[Placeholder - Image or chart will go here]</p>
      </div>
      <div className="mt-6 bg-white p-4 rounded-lg shadow-md">
        <h3 className="text-xl font-bold mb-2">Confusion Matrix</h3>
        <p>[Placeholder - Image or chart will go here]</p>
      </div>
    </div>
  );
};

export default ModelPerformancePage;