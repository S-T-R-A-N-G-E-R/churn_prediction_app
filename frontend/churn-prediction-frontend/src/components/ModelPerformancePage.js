import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ModelPerformancePage = () => {
  const [metrics, setMetrics] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:8000/model-performance');
        setMetrics(response.data);
      } catch (err) {
        setError('Error fetching model performance data. Check if the backend is running.');
        console.error(err);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">Model Performance</h2>
      {error && <p className="mt-4 text-red-600">{error}</p>}
      {metrics && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-4 rounded-lg shadow-md">
            <h3 className="text-xl font-bold mb-2">Accuracy</h3>
            <p className="text-lg">{(metrics.accuracy * 100).toFixed(1)}%</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-md">
            <h3 className="text-xl font-bold mb-2">Precision</h3>
            <p className="text-lg">{(metrics.precision * 100).toFixed(1)}%</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-md">
            <h3 className="text-xl font-bold mb-2">Recall</h3>
            <p className="text-lg">{(metrics.recall * 100).toFixed(1)}%</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-md">
            <h3 className="text-xl font-bold mb-2">F1 Score</h3>
            <p className="text-lg">{(metrics.f1_score * 100).toFixed(1)}%</p>
          </div>
        </div>
      )}
      <div className="mt-6 bg-white p-4 rounded-lg shadow-md">
        <h3 className="text-xl font-bold mb-2">ROC Curve</h3>
        <img
          src="http://localhost:8000/static/roc_curve_xgboost_tuned.png"
          alt="ROC Curve"
          className="max-w-full h-auto"
        />
      </div>
      <div className="mt-6 bg-white p-4 rounded-lg shadow-md">
        <h3 className="text-xl font-bold mb-2">Confusion Matrix</h3>
        <img
          src="http://localhost:8000/static/confusion_matrix_xgboost_tuned.png"
          alt="Confusion Matrix"
          className="max-w-full h-auto"
        />
      </div>
    </div>
  );
};

export default ModelPerformancePage;