import React, { useState } from 'react';
import { CustomerData, churnAPI } from '../services/api';
import LiquidPredictionForm from '../components/LiquidPredictionForm';
import LiquidResultsPanel from '../components/LiquidResultsPanel';

const LiquidPredictionPage: React.FC = () => {
  const [customerData, setCustomerData] = useState<CustomerData>({
    // Demographics
    Age: 35,
    Gender: 1,
    Senior_Citizen: 0,
    Married: 1,
    Partner: 1,
    Dependents: 1,
    Number_of_Dependents: 1,
    
    // Service Information
    Phone_Service: 1,
    Multiple_Lines: 1,
    Internet_Service: 1,
    Internet_Type_DSL: 0,
    Internet_Type_Fiber_Optic: 1,
    Internet_Type_No_Internet: 0,
    Online_Security: 1,
    Online_Backup: 1,
    Device_Protection_Plan: 1,
    Premium_Tech_Support: 0,
    Streaming_TV: 1,
    Streaming_Movies: 1,
    Streaming_Music: 1,
    Unlimited_Data: 1,
    
    // Contract & Billing
    Contract_One_Year: 1,
    Contract_Two_Year: 0,
    Paperless_Billing: 1,
    Payment_Method_Credit_Card: 1,
    Payment_Method_Mailed_Check: 0,
    
    // Offers & Marketing
    Offer_Offer_A: 0,
    Offer_Offer_B: 1,
    Offer_Offer_C: 0,
    Offer_Offer_D: 0,
    Offer_Offer_E: 0,
    
    // Usage & Charges
    Monthly_Charge: 75.5,
    Total_Revenue: 2500,
    Total_Extra_Data_Charges: 0,
    Total_Long_Distance_Charges: 300,
    Total_Refunds: 0,
    Avg_Monthly_GB_Download: 25,
    Avg_Monthly_Long_Distance_Charges: 22.5,
    
    // Customer Metrics
    Tenure_in_Months: 24,
    Satisfaction_Score: 3,
    CLTV: 4200,
    Number_of_Referrals: 2,
    Referred_a_Friend: 1,
    Population: 50000,
    
    // Engineered Features
    Monthly_to_Total_Ratio: 0.0302,
    Tenure_Quartile: 2,
    Early_Churner_Risk: 0,
    Low_Satisfaction: 0,
  });

  const [results, setResults] = useState<any>(null);
  const [explanation, setExplanation] = useState<any>(null);
  const [counterfactuals, setCounterfactuals] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'summary' | 'analysis' | 'actions'>('summary');

  const handleInputChange = (field: keyof CustomerData, value: number) => {
    setCustomerData(prev => ({ ...prev, [field]: value }));
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab as 'summary' | 'analysis' | 'actions');
  };

  const handlePredict = async () => {
    setLoading(true);
    try {
      // Get prediction
      const predictionResult = await churnAPI.predict(customerData);
      setResults(predictionResult);
      
      // Always get SHAP explanations
      try {
        const explanationResult = await churnAPI.explain(customerData);
        setExplanation(explanationResult);
      } catch (error) {
        console.log('SHAP explanation not available');
        setExplanation(null);
      }
      
      // Get counterfactuals only if customer is predicted to churn
      if (predictionResult.prediction === 1) {
        try {
          const counterfactualResult = await churnAPI.getCounterfactuals(customerData, 0, 1);
          setCounterfactuals(counterfactualResult);
        } catch (error) {
          console.log('Counterfactuals not available');
          setCounterfactuals(null);
        }
      } else {
        setCounterfactuals(null);
      }
    } catch (error) {
      console.error('Prediction error:', error);
      alert('Error connecting to the prediction service. Make sure your backend is running on http://127.0.0.1:8000');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Form Section */}
        <div className="lg:col-span-2">
          <LiquidPredictionForm 
            customerData={customerData}
            onDataChange={handleInputChange}
            onPredict={handlePredict}
            loading={loading}
          />
        </div>
        
        {/* Results Section */}
        <div className="lg:col-span-1">
          <LiquidResultsPanel 
            results={results}
            explanation={explanation}
            activeTab={activeTab}
            onTabChange={handleTabChange}
          />
        </div>
      </div>

      {/* Full-width SHAP Chart */}
      {activeTab === 'analysis' && explanation?.shap_data && (
        <div className="mt-10">
          <div className="glass-card p-8">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-glass mb-2">
                🎯 Detailed Feature Impact Analysis
              </h2>
              <p className="text-glass-secondary">
                Understanding what drives the {results?.prediction === 1 ? 'churn risk' : 'retention factors'} for this customer
              </p>
            </div>
            
            <div className="glass-surface bg-blue-500/10 p-6 rounded-xl border border-blue-500/20 text-center">
              <p className="text-glass">SHAP Chart will be displayed here</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LiquidPredictionPage;
