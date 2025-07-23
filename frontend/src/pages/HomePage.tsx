import React from 'react';
import { Link } from 'react-router-dom';

const HomePage: React.FC = () => {
  return (
    <div className="max-w-6xl mx-auto">
      <div className="text-center py-16">
        <h1 className="text-5xl font-bold text-gray-900 mb-6">
          Telecom Customer Churn Prediction
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
          Leverage advanced machine learning to predict customer churn, understand the key factors, 
          and receive actionable recommendations to improve customer retention.
        </p>
        
        <div className="flex justify-center space-x-4">
          <Link
            to="/predict"
            className="btn-primary text-lg px-8 py-3"
          >
            Start Prediction
          </Link>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-8 mt-16">
        <div className="card text-center">
          <div className="text-primary-600 text-4xl mb-4">🎯</div>
          <h3 className="text-xl font-semibold mb-3">Accurate Predictions</h3>
          <p className="text-gray-600">
            Our stacking ensemble model achieves 96.9% accuracy in predicting customer churn.
          </p>
        </div>

        <div className="card text-center">
          <div className="text-primary-600 text-4xl mb-4">🔍</div>
          <h3 className="text-xl font-semibold mb-3">SHAP Explanations</h3>
          <p className="text-gray-600">
            Understand which factors contribute most to churn risk with detailed SHAP analysis.
          </p>
        </div>

        <div className="card text-center">
          <div className="text-primary-600 text-4xl mb-4">💡</div>
          <h3 className="text-xl font-semibold mb-3">Actionable Insights</h3>
          <p className="text-gray-600">
            Get specific recommendations on how to retain at-risk customers effectively.
          </p>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
