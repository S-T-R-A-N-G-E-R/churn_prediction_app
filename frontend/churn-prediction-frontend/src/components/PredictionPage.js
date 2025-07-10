import React, { useState } from 'react';

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

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    // Placeholder for API call (we’ll add this in Step 5)
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Customer Churn Prediction</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block">Credit Score</label>
          <input
            type="number"
            name="CreditScore"
            value={formData.CreditScore}
            onChange={handleChange}
            className="border p-2 w-full"
            required
          />
        </div>
        <div>
          <label className="block">Geography</label>
          <input
            type="text"
            name="Geography"
            value={formData.Geography}
            onChange={handleChange}
            className="border p-2 w-full"
            required
          />
        </div>
        <div>
          <label className="block">Gender</label>
          <input
            type="text"
            name="Gender"
            value={formData.Gender}
            onChange={handleChange}
            className="border p-2 w-full"
            required
          />
        </div>
        <div>
          <label className="block">Age</label>
          <input
            type="number"
            name="Age"
            value={formData.Age}
            onChange={handleChange}
            className="border p-2 w-full"
            required
          />
        </div>
        <div>
          <label className="block">Tenure</label>
          <input
            type="number"
            name="Tenure"
            value={formData.Tenure}
            onChange={handleChange}
            className="border p-2 w-full"
            required
          />
        </div>
        <div>
          <label className="block">Balance</label>
          <input
            type="number"
            name="Balance"
            value={formData.Balance}
            onChange={handleChange}
            className="border p-2 w-full"
            required
          />
        </div>
        <div>
          <label className="block">Num Of Products</label>
          <input
            type="number"
            name="NumOfProducts"
            value={formData.NumOfProducts}
            onChange={handleChange}
            className="border p-2 w-full"
            required
          />
        </div>
        <div>
          <label className="block">Has Credit Card</label>
          <input
            type="number"
            name="HasCrCard"
            value={formData.HasCrCard}
            onChange={handleChange}
            className="border p-2 w-full"
            required
          />
        </div>
        <div>
          <label className="block">Is Active Member</label>
          <input
            type="number"
            name="IsActiveMember"
            value={formData.IsActiveMember}
            onChange={handleChange}
            className="border p-2 w-full"
            required
          />
        </div>
        <div>
          <label className="block">Estimated Salary</label>
          <input
            type="number"
            name="EstimatedSalary"
            value={formData.EstimatedSalary}
            onChange={handleChange}
            className="border p-2 w-full"
            required
          />
        </div>
        <button
          type="submit"
          className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
        >
          Predict
        </button>
      </form>
      <div className="mt-6">
        <h3 className="text-xl font-bold">Results</h3>
        <p>Prediction: [Placeholder]</p>
        <p>Probability: [Placeholder]</p>
        <p>Risk Category: [Placeholder]</p>
        <p>CLV/Potential Loss: [Placeholder]</p>
        <p>SHAP Chart: [Placeholder - Chart will go here]</p>
        <p>Counterfactuals: [Placeholder]</p>
        <p>Business Recommendations: [Placeholder]</p>
      </div>
    </div>
  );
};

export default PredictionPage;