import React from 'react';

const ModelPerformancePage = () => {
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">Model Performance</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="card">
          <h3 className="text-xl font-bold mb-4">ROC Curve</h3>
          <img src="http://localhost:8000/static/roc_curve_xgboost_tuned.png" alt="ROC Curve" className="w-full h-auto" />
        </div>
        <div className="card">
          <h3 className="text-xl font-bold mb-4">Confusion Matrix</h3>
          <img src="http://localhost:8000/static/confusion_matrix_xgboost_tuned.png" alt="Confusion Matrix" className="w-full h-auto" />
        </div>
      </div>
    </div>
  );
};

export default ModelPerformancePage;