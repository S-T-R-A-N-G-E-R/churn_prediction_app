import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import Chart from 'chart.js/auto';

const FeatureImportance = () => {
  const [featureImportance, setFeatureImportance] = useState(null);
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:8000/feature-importance');
        setFeatureImportance(response.data); // Directly use the response data
        console.log('Fetched Feature Importance:', response.data);
      } catch (err) {
        console.error('Error fetching feature importance:', err);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (featureImportance && chartRef.current) {
      console.log('Rendering Feature Importance:', featureImportance);
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
      const ctx = chartRef.current.getContext('2d');
      chartInstance.current = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: Object.keys(featureImportance),
          datasets: [{
            label: 'Feature Importance',
            data: Object.values(featureImportance),
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
                text: 'Importance'
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
              text: 'Feature Importance'
            }
          }
        }
      });
    }
  }, [featureImportance]);

  return (
  <div className="p-6 max-w-4xl mx-auto">
    <h2 className="text-3xl font-bold mb-6 text-gray-800">Feature Importance</h2>
    <div className="mb-2">
      <canvas ref={chartRef} style={{ maxWidth: '100%', height: '400px' }} /> {/* Fixed height for testing */}
      {(!featureImportance || Object.keys(featureImportance).length === 0) && <p>Loading feature importance...</p>}
    </div>
  </div>
  );
};

export default FeatureImportance;