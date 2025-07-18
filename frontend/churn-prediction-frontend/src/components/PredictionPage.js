import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import Chart from 'chart.js/auto';
import { Tooltip } from 'react-tooltip';

const PredictionPage = () => {
  const [formData, setFormData] = useState({
    CreditScore: '',
    Geography: 'France',
    Gender: 'Male',
    Age: '',
    Tenure: '',
    Balance: '',
    NumOfProducts: '',
    HasCrCard: 'No',
    IsActiveMember: 'No',
    EstimatedSalary: '',
  });
  const [results, setResults] = useState(null);
  const [errors, setErrors] = useState({});
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    validateField(name, value);
  };

  const validateField = (name, value) => {
    const newErrors = { ...errors };
    if (name === 'CreditScore' && (value === '' || value < 0 || value > 1000)) {
      newErrors[name] = 'Credit Score must be between 0 and 1000';
    } else if (name === 'Age' && (value === '' || value < 18 || value > 120)) {
      newErrors[name] = 'Age must be between 18 and 120';
    } else {
      delete newErrors[name];
    }
    setErrors(newErrors);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const allErrors = {};
    if (!formData.CreditScore || formData.CreditScore < 0 || formData.CreditScore > 1000) {
      allErrors.CreditScore = 'Credit Score must be between 0 and 1000';
    }
    if (formData.Age && (formData.Age < 18 || formData.Age > 120)) {
      allErrors.Age = 'Age must be between 18 and 120';
    }
    if (Object.keys(allErrors).length > 0) {
      setErrors(allErrors);
      return;
    }
    setErrors({});
    setResults(null);

    const processedData = {
      ...formData,
      Gender: formData.Gender === 'Female' ? 1 : 0,
      Geography_Germany: formData.Geography === 'Germany' ? 1 : 0,
      Geography_Spain: formData.Geography === 'Spain' ? 1 : 0,
      HasCrCard: formData.HasCrCard === 'Yes' ? 1 : 0,
      IsActiveMember: formData.IsActiveMember === 'Yes' ? 1 : 0,
    };

    try {
      const response = await axios.post('http://localhost:8000/predict', processedData);
      setResults(response.data);
    } catch (err) {
      setErrors({ submit: 'Error fetching prediction. Check if the backend is running at http://localhost:8000.' });
      console.error(err);
    }
  };

  useEffect(() => {
    if (results && results.shap_values && chartRef.current) {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
      const ctx = chartRef.current.getContext('2d');
      chartInstance.current = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: Object.keys(results.shap_values),
          datasets: [{
            label: 'SHAP Value',
            data: Object.values(results.shap_values),
            backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF"],
            borderWidth: 1
          }]
        },
        options: {
          scales: { y: { beginAtZero: true }, x: { title: { display: true, text: 'Features' } } },
          plugins: { legend: { display: true }, title: { display: true, text: 'Top 5 Feature Contributions' } },
          maintainAspectRatio: false
        }
      });
    }
  }, [results]);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">Customer Churn Prediction</h2>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-white card">
        {Object.keys(formData).map((field) => {
          const tooltipId = `tooltip-${field}`;
          if (field === 'Geography') {
            return (
              <div key={field} className="relative">
                <label className="block text-sm font-medium text-gray-700 capitalize">Geography
                  <span
                    data-tooltip-id={tooltipId}
                    className="ml-1 text-blue-500 cursor-help"
                  >
                    ?
                  </span>
                </label>
                <select
                  name={field}
                  value={formData[field]}
                  onChange={handleChange}
                  className="mt-1 p-2 border border-gray-300 rounded-md w-full focus:ring-2 focus:ring-blue-500 focus:border-transparent hover-effect"
                  required
                >
                  <option value="France">France</option>
                  <option value="Germany">Germany</option>
                  <option value="Spain">Spain</option>
                </select>
                <Tooltip id={tooltipId} place="top" effect="solid">
                  Select the customer’s country (France, Germany, or Spain).
                </Tooltip>
                {errors[field] && <p className="mt-1 text-sm text-red-600">{errors[field]}</p>}
              </div>
            );
          } else if (field === 'Gender') {
            return (
              <div key={field} className="relative">
                <label className="block text-sm font-medium text-gray-700 capitalize">Gender
                  <span
                    data-tooltip-id={tooltipId}
                    className="ml-1 text-blue-500 cursor-help"
                  >
                    ?
                  </span>
                </label>
                <select
                  name={field}
                  value={formData[field]}
                  onChange={handleChange}
                  className="mt-1 p-2 border border-gray-300 rounded-md w-full focus:ring-2 focus:ring-blue-500 focus:border-transparent hover-effect"
                  required
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
                <Tooltip id={tooltipId} place="top" effect="solid">
                  Select the customer’s gender (Male or Female).
                </Tooltip>
                {errors[field] && <p className="mt-1 text-sm text-red-600">{errors[field]}</p>}
              </div>
            );
          } else if (field === 'HasCrCard' || field === 'IsActiveMember') {
            return (
              <div key={field} className="relative">
                <label className="block text-sm font-medium text-gray-700 capitalize">{field.replace(/([A-Z])/g, ' $1').trim()}
                  <span
                    data-tooltip-id={tooltipId}
                    className="ml-1 text-blue-500 cursor-help"
                  >
                    ?
                  </span>
                </label>
                <div className="mt-1 flex space-x-4">
                  <label className="flex items-center hover-effect">
                    <input
                      type="radio"
                      name={field}
                      value="Yes"
                      checked={formData[field] === 'Yes'}
                      onChange={handleChange}
                      className="mr-2"
                    />
                    Yes
                  </label>
                  <label className="flex items-center hover-effect">
                    <input
                      type="radio"
                      name={field}
                      value="No"
                      checked={formData[field] === 'No'}
                      onChange={handleChange}
                      className="mr-2"
                    />
                    No
                  </label>
                </div>
                <Tooltip id={tooltipId} place="top" effect="solid">
                  {field === 'HasCrCard' ? 'Does the customer have a credit card?' : 'Is the customer an active member?'}
                </Tooltip>
                {errors[field] && <p className="mt-1 text-sm text-red-600">{errors[field]}</p>}
              </div>
            );
          } else {
            return (
              <div key={field} className="relative">
                <label className="block text-sm font-medium text-gray-700 capitalize">{field.replace(/([A-Z])/g, ' $1').trim()}
                  <span
                    data-tooltip-id={tooltipId}
                    className="ml-1 text-blue-500 cursor-help"
                  >
                    ?
                  </span>
                </label>
                <input
                  type={['CreditScore', 'Age', 'Tenure', 'Balance', 'NumOfProducts', 'EstimatedSalary'].includes(field) ? 'number' : 'text'}
                  name={field}
                  value={formData[field]}
                  onChange={handleChange}
                  className="mt-1 p-2 border border-gray-300 rounded-md w-full focus:ring-2 focus:ring-blue-500 focus:border-transparent hover-effect"
                  required
                  min={field === 'Age' ? 18 : field === 'CreditScore' ? 0 : undefined}
                  max={field === 'Age' ? 120 : field === 'CreditScore' ? 1000 : undefined}
                />
                <Tooltip id={tooltipId} place="top" effect="solid">
                  {field === 'CreditScore' && 'Credit score (0-1000).'}
                  {field === 'Age' && 'Customer age (18-120).'}
                  {field === 'Tenure' && 'Years as a customer.'}
                  {field === 'Balance' && 'Account balance in dollars.'}
                  {field === 'NumOfProducts' && 'Number of bank products (1-4).'}
                  {field === 'EstimatedSalary' && 'Estimated annual salary in dollars.'}
                </Tooltip>
                {errors[field] && <p className="mt-1 text-sm text-red-600">{errors[field]}</p>}
              </div>
            );
          }
        })}
        <div className="col-span-1 md:col-span-2">
          <button
            type="submit"
            className="w-full bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700 transition duration-200"
          >
            Predict
          </button>
          {errors.submit && <p className="mt-1 text-sm text-red-600">{errors.submit}</p>}
        </div>
      </form>
      {results && (
        <div className="mt-8 card">
          <h3 className="text-2xl font-bold mb-4 text-gray-800">Results</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="mb-2"><strong>Prediction:</strong> {results.prediction === 1 ? 'Churn' : 'No Churn'}</p>
              <p className="mb-2"><strong>Probability:</strong> {(results.probability * 100).toFixed(2)}%</p>
              <p className="mb-2"><strong>Risk Category:</strong> {results.risk_category}</p>
              <p className="mb-2"><strong>CLV/Potential Loss:</strong> ${results.clv_potential_loss.toFixed(2)}</p>
            </div>
            <div className="chart-container">
              <strong>SHAP Chart:</strong>
              <canvas ref={chartRef} />
            </div>
          </div>
          {results.counterfactuals && results.counterfactuals.length > 0 && (
            <div className="mt-4 card">
              <h4 className="text-xl font-bold mb-2">Counterfactual Suggestions</h4>
              {results.counterfactuals.map((cf, index) => (
                <div key={index} className="p-4 bg-gray-50 rounded-md mb-2 hover-effect">
                  <p><strong>New Prediction:</strong> {cf.new_prediction}</p>
                  <p><strong>New Probability:</strong> {(cf.new_probability * 100).toFixed(2)}%</p>
                  <p><strong>Changes:</strong></p>
                  <ul className="list-disc pl-5">
                    {cf.changes.map((change, i) => (
                      <li key={i}>{change}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}
          {results.recommendations && results.recommendations.length > 0 && (
            <div className="mt-4 card">
              <h4 className="text-xl font-bold mb-2">Business Recommendations</h4>
              <ul className="list-disc pl-5">
                {results.recommendations.map((rec, index) => (
                  <li key={index} className="mb-2 hover-effect">{rec}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PredictionPage;