import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import Chart from 'chart.js/auto';

const FeatureImportancePage = () => {
  const [features, setFeatures] = useState(null);
  const [error, setError] = useState(null);
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    const fetchFeatures = async () => {
      try {
        const response = await axios.get('http://localhost:8000/feature-importance');
        setFeatures(response.data);
        console.log('Fetched Feature Importance:', response.data);
      } catch (err) {
        setError('Error fetching feature importance. Check if the backend is running.');
        console.error(err);
      }
    };
    fetchFeatures();
  }, []);

  useEffect(() => {
    if (features && chartRef.current) {
      console.log('Rendering Feature Importance:', features);
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
      const ctx = chartRef.current.getContext('2d');
      if (!ctx) {
        console.error('Canvas context is null');
        return;
      }
      chartInstance.current = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: Object.keys(features),
          datasets: [{
            label: 'Importance (%)',
            data: Object.values(features).map(val => val * 100),
            backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF"],
            borderWidth: 1
          }]
        },
        options: {
          scales: {
            y: {
              beginAtZero: true,
              title: {
                display: true,
                text: 'Importance (%)'
              }
            },
            x: {
              title: {
                display: true,
                text: 'Features'
              }
            }
          },
          plugins: {
            legend: {
              display: true,
              position: 'top'
            },
            title: {
              display: true,
              text: 'Top 5 Feature Importance'
            }
          },
          maintainAspectRatio: false // Allow custom sizing
        }
      });
    } else if (!features) {
      console.log('No feature importance data available');
    }
  }, [features]);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">Feature Importance</h2>
      {error && <p className="mt-4 text-red-600">{error}</p>}
      {features && (
        <>
          <div className="bg-white p-4 rounded-lg shadow-md mb-6">
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
          <div className="bg-white p-4 rounded-lg shadow-md">
            <h3 className="text-xl font-bold mb-4">Feature Importance Chart</h3>
            <div style={{ position: 'relative', height: '400px' }}>
              <canvas ref={chartRef} style={{ width: '100%', height: '100%' }} />
            </div>
          </div>
        </>
      )}
      {(!features || Object.keys(features).length === 0) && <p>Loading feature importance...</p>}
    </div>
  );
};

export default FeatureImportancePage;