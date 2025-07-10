import React, { useState } from 'react';
import axios from 'axios';

const PredictionPage = () => {
  const [formData, setFormData] = useState({
    CreditScore: '',
    Geography: '',
    Gender: '',
    Age: '',
    Tenure: '',
    Balance: '',
    NumOfProducts: '',
    HasCrCard: '',
    IsActiveMember: '',
    EstimatedSalary: '',
  });
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setResults(null);

    // Basic validation
    if (!formData.CreditScore || formData.CreditScore < 0 || formData.CreditScore > 1000) {
      setError('Credit Score must be between 0 and 1000');
      return;
    }
    if (formData.Age && (formData.Age < 18 || formData.Age > 120)) {
      setError('Age must be between 18 and 120');
      return;
    }

    // Encode categorical variables
    const processedData = {
      ...formData,
      Gender: formData.Gender === 'Female' ? 1 : 0, // Assuming 1 for Female, 0 for Male
      Geography_Germany: formData.Geography === 'Germany' ? 1 : 0,
      Geography_Spain: formData.Geography === 'Spain' ? 1 : 0,
    };

    try {
      const response = await axios.post('http://localhost:8000/predict', processedData);
      setResults(response.data);
    } catch (err) {
      setError('Error fetching prediction. Check if the backend is running at http://localhost:8000.');
      console.error(err);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">Customer Churn Prediction</h2>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-white p-6 rounded-lg shadow-md">
        {Object.keys(formData).map((field) => (
          <div key={field}>
            <label className="block text-sm font-medium text-gray-700 capitalize">{field.replace(/([A-Z])/g, ' $1').trim()}</label>
            <input
              type={['CreditScore', 'Age', 'Tenure', 'Balance', 'NumOfProducts', 'HasCrCard', 'IsActiveMember', 'EstimatedSalary'].includes(field) ? 'number' : 'text'}
              name={field}
              value={formData[field]}
              onChange={handleChange}
              className="mt-1 p-2 border border-gray-300 rounded-md w-full focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
              min={field === 'Age' ? 18 : field === 'CreditScore' ? 0 : undefined}
              max={field === 'Age' ? 120 : field === 'CreditScore' ? 1000 : undefined}
            />
          </div>
        ))}
        <div className="col-span-1 md:col-span-2">
          <button
            type="submit"
            className="w-full bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700 transition duration-200"
          >
            Predict
          </button>
        </div>
      </form>
      {error && <p className="mt-4 text-red-600">{error}</p>}
      {results && (
        <div className="mt-8 p-6 bg-white rounded-lg shadow-md">
          <h3 className="text-2xl font-bold mb-4 text-gray-800">Results</h3>
          <p className="mb-2"><strong>Prediction:</strong> {results.prediction === 1 ? 'Churn' : 'No Churn'}</p>
          <p className="mb-2"><strong>Probability:</strong> {(results.probability * 100).toFixed(2)}%</p>
          <p className="mb-2"><strong>Risk Category:</strong> [Placeholder]</p>
          <p className="mb-2"><strong>CLV/Potential Loss:</strong> [Placeholder]</p>
          <div className="mb-2"><strong>SHAP Chart:</strong> [Placeholder - Chart will go here]</div>
          <p className="mb-2"><strong>Counterfactuals:</strong> [Placeholder]</p>
          <p><strong>Business Recommendations:</strong> [Placeholder]</p>
        </div>
      )}
    </div>
  );
};

export default PredictionPage;