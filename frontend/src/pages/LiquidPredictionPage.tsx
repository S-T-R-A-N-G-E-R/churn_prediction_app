import React, { useState } from 'react';
import { CustomerData, churnAPI } from '../services/api';
import LiquidPredictionForm from '../components/LiquidPredictionForm';
import LiquidResultsPanel from '../components/LiquidResultsPanel';
import ShapChart from '../components/ShapChart';

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
      console.log('Prediction Result:', predictionResult);
      setResults(predictionResult);
      
      // Always get SHAP explanations
      try {
        const explanationResult = await churnAPI.explain(customerData);
        console.log('Explanation Result:', explanationResult);
        setExplanation(explanationResult);
      } catch (error) {
        console.log('SHAP explanation not available:', error);
        setExplanation(null);
      }
      
      // Get counterfactuals only if customer is predicted to churn
      if (predictionResult.prediction === 1) {
        try {
          const counterfactualResult = await churnAPI.getCounterfactuals(customerData, 0, 1);
          console.log('Counterfactual Result:', counterfactualResult);
          setCounterfactuals(counterfactualResult);
        } catch (error) {
          console.log('Counterfactuals not available:', error);
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
    <div className="max-w-5xl mx-auto px-6 py-8">
      {/* Customer Analysis Form - Full Width */}
      <div className="mb-8">
        <LiquidPredictionForm 
          customerData={customerData}
          onDataChange={handleInputChange}
          onPredict={handlePredict}
          loading={loading}
        />
      </div>

      {/* Results Section - Full Width Below Form */}
      {results && (
        <div className="space-y-8">
          {/* Main Results Panel - Modified to exclude internal SHAP chart */}
          <div>
            <LiquidResultsPanel 
              results={results}
              explanation={explanation}
              counterfactuals={counterfactuals}
              activeTab={activeTab}
              onTabChange={handleTabChange}
            />
          </div>

          {activeTab === 'analysis' && explanation?.shap_data && (
            <div>
                <div className="glass-card p-8">
                <div> {/* Single wrapper for all children */}
                    <div className="text-center mb-6">
                    <h2 className="text-2xl font-bold text-glass mb-2">
                        🎯 Complete Feature Impact Analysis
                    </h2>
                    <p className="text-glass-secondary">
                        Understanding what drives the {results?.prediction === 1 ? 'churn risk' : 'retention factors'} for this customer
                    </p>
                    </div>

                    <ShapChart 
                    shapData={explanation.shap_data} 
                    title="SHAP Feature Importance Analysis"
                    />

                    <div className="mt-6 p-4 bg-white/5 rounded-lg">
                    <p className="text-sm text-glass-secondary text-center">
                        💡 <strong>How to read this chart:</strong> Red bars show features that increase churn risk, 
                        while blue bars show features that decrease churn risk. Longer bars indicate stronger influence.
                    </p>
                    </div>
                </div> {/* End of single wrapper */}
                </div>
            </div>
            )}

          {/* Summary Analysis Section - No duplicate chart here */}
          {explanation && (
            <div className="grid md:grid-cols-2 gap-8">
              {/* Summary Statistics */}
              <div className="glass-card p-6">
                <h3 className="text-xl font-semibold text-glass mb-4 flex items-center">
                  <span className="mr-2">📈</span>
                  Prediction Summary
                </h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 glass-surface rounded-lg">
                    <span className="text-glass-secondary">Risk Level</span>
                    <span className={`font-bold ${results.prediction === 1 ? 'text-red-300' : 'text-green-300'}`}>
                      {results.prediction === 1 ? 'High Risk' : 'Low Risk'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 glass-surface rounded-lg">
                    <span className="text-glass-secondary">Confidence</span>
                    <span className="font-bold text-glass">
                      {(results.churn_probability * 100).toFixed(1)}%
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 glass-surface rounded-lg">
                    <span className="text-glass-secondary">Top Risk Factor</span>
                    <span className="font-bold text-glass">
                      {explanation.top_features?.[0]?.feature || 'N/A'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 glass-surface rounded-lg">
                    <span className="text-glass-secondary">Features Analyzed</span>
                    <span className="font-bold text-glass">
                      {explanation.shap_data?.length || 0}
                    </span>
                  </div>
                </div>
              </div>

              {/* Business Recommendations */}
              <div className="glass-card p-6">
                <h3 className="text-xl font-semibold text-glass mb-4 flex items-center">
                  <span className="mr-2">💼</span>
                  Business Insights
                </h3>
                <div className="space-y-4">
                  <div className="p-4 glass-surface rounded-lg">
                    <h4 className="font-semibold text-glass mb-2">Recommendation</h4>
                    <p className="text-glass-secondary text-sm">
                      {results.prediction === 1 
                        ? 'Immediate intervention recommended. Focus on top risk factors and consider retention offers.'
                        : 'Customer shows strong retention indicators. Maintain current service quality and consider upselling opportunities.'
                      }
                    </p>
                  </div>
                  <div className="p-4 glass-surface rounded-lg">
                    <h4 className="font-semibold text-glass mb-2">Priority Level</h4>
                    <div className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                      results.prediction === 1 
                        ? 'bg-red-100/20 text-red-300 border border-red-300/30'
                        : 'bg-green-100/20 text-green-300 border border-green-300/30'
                    }`}>
                      {results.prediction === 1 ? 'HIGH PRIORITY' : 'STANDARD MONITORING'}
                    </div>
                  </div>
                  <div className="p-4 glass-surface rounded-lg">
                    <h4 className="font-semibold text-glass mb-2">Next Steps</h4>
                    <p className="text-glass-secondary text-sm">
                      {results.prediction === 1 
                        ? 'Review the feature analysis above to identify specific improvement areas.'
                        : 'Monitor customer satisfaction and explore cross-selling opportunities.'
                      }
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default LiquidPredictionPage;