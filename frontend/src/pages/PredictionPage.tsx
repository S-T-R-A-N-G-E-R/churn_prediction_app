import React, { useState } from 'react';
import { CustomerData, churnAPI } from '../services/api';
import ShapChart from '../components/ShapChart';
import { ChevronDownIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

const PredictionPage: React.FC = () => {
  const [customerData, setCustomerData] = useState<CustomerData>({
    Age: 35,
    Gender: 1,
    Senior_Citizen: 0,
    Married: 1,
    Partner: 1,
    Dependents: 1,
    Number_of_Dependents: 1,
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
    Contract_One_Year: 1,
    Contract_Two_Year: 0,
    Paperless_Billing: 1,
    Payment_Method_Credit_Card: 1,
    Payment_Method_Mailed_Check: 0,
    Offer_Offer_A: 0,
    Offer_Offer_B: 1,
    Offer_Offer_C: 0,
    Offer_Offer_D: 0,
    Offer_Offer_E: 0,
    Monthly_Charge: 75.5,
    Total_Revenue: 2500,
    Total_Extra_Data_Charges: 0,
    Total_Long_Distance_Charges: 0,
    Total_Refunds: 0,
    Avg_Monthly_GB_Download: 25,
    Avg_Monthly_Long_Distance_Charges: 22.5,
    Tenure_in_Months: 24,
    Satisfaction_Score: 3,
    CLTV: 4200,
    Number_of_Referrals: 2,
    Referred_a_Friend: 1,
    Population: 50000,
    Monthly_to_Total_Ratio: 0.0302,
    Tenure_Quartile: 2,
    Early_Churner_Risk: 0,
    Low_Satisfaction: 0,
  });

  const [results, setResults] = useState<any>(null);
  const [explanation, setExplanation] = useState<any>(null);
  const [counterfactuals, setCounterfactuals] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'prediction' | 'explanation' | 'recommendations'>('prediction');

  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    demographics: true,
    services: false,
    security: false,
    entertainment: false,
    billing: false,
    offers: false,
    financial: false,
    usage: false,
    experience: false,
    risk: false
  });

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handleInputChange = (field: keyof CustomerData, value: number) => {
    setCustomerData(prev => ({ ...prev, [field]: value }));
  };

  const handlePredict = async () => {
    setLoading(true);
    try {
      const predictionResult = await churnAPI.predict(customerData);
      console.log('Prediction Result:', predictionResult);
      setResults(predictionResult);

      try {
        const explanationResult = await churnAPI.explain(customerData);
        console.log('Explanation Result:', explanationResult);
        setExplanation(explanationResult);
      } catch (error) {
        console.log('SHAP explanation not available:', error);
        setExplanation(null);
      }

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

  const FormSection: React.FC<{
    title: string;
    section: string;
    icon: string;
    fields: Array<{key: keyof CustomerData, label: string, type: 'number' | 'select', options?: Array<{value: number, label: string}>}>
  }> = ({ title, section, icon, fields }) => {
    const isExpanded = expandedSections[section];

    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-4">
        <button
          onClick={() => toggleSection(section)}
          className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors duration-200"
        >
          <div className="flex items-center space-x-3">
            <span className="text-2xl">{icon}</span>
            <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
            <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
              {fields.length} fields
            </span>
          </div>
          {isExpanded ? (
            <ChevronDownIcon className="w-5 h-5 text-gray-400 transition-transform duration-200" />
          ) : (
            <ChevronRightIcon className="w-5 h-5 text-gray-400 transition-transform duration-200" />
          )}
        </button>

        {isExpanded && (
          <div className="px-6 pb-6 border-t border-gray-100 bg-gradient-to-r from-gray-50 to-blue-50">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 pt-4">
              {fields.map(field => (
                <div key={field.key} className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    {field.label}
                  </label>
                  {field.type === 'select' ? (
                    <select
                      value={customerData[field.key]}
                      onChange={(e) => handleInputChange(field.key, Number(e.target.value))}
                      className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 shadow-sm"
                    >
                      {field.options?.map(option => (
                        <option key={option.value} value={option.value}>{option.label}</option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type="number"
                      step={field.key.includes('Charge') || field.key.includes('Revenue') || field.key.includes('CLTV') || field.key.includes('Ratio') ? '0.01' : '1'}
                      value={customerData[field.key]}
                      onChange={(e) => handleInputChange(field.key, Number(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 shadow-sm"
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-100">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">
            🤖 AI-Powered Customer Churn Analysis
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Predict customer churn with machine learning and get actionable insights with SHAP explanations
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            <FormSection
              title="Demographics"
              section="demographics"
              icon="👥"
              fields={[
                {key: 'Age', label: 'Age', type: 'number'},
                {key: 'Gender', label: 'Gender', type: 'select', options: [{value: 0, label: 'Female'}, {value: 1, label: 'Male'}]},
                {key: 'Senior_Citizen', label: 'Senior Citizen', type: 'select', options: [{value: 0, label: 'No'}, {value: 1, label: 'Yes'}]},
                {key: 'Married', label: 'Married', type: 'select', options: [{value: 0, label: 'No'}, {value: 1, label: 'Yes'}]},
                {key: 'Partner', label: 'Has Partner', type: 'select', options: [{value: 0, label: 'No'}, {value: 1, label: 'Yes'}]},
                {key: 'Dependents', label: 'Has Dependents', type: 'select', options: [{value: 0, label: 'No'}, {value: 1, label: 'Yes'}]},
                {key: 'Number_of_Dependents', label: 'Number of Dependents', type: 'number'},
              ]}
            />
            <FormSection
              title="Phone & Internet Services"
              section="services"
              icon="📱"
              fields={[
                {key: 'Phone_Service', label: 'Phone Service', type: 'select', options: [{value: 0, label: 'No'}, {value: 1, label: 'Yes'}]},
                {key: 'Multiple_Lines', label: 'Multiple Lines', type: 'select', options: [{value: 0, label: 'No'}, {value: 1, label: 'Yes'}]},
                {key: 'Internet_Service', label: 'Internet Service', type: 'select', options: [{value: 0, label: 'No'}, {value: 1, label: 'Yes'}]},
                {key: 'Internet_Type_DSL', label: 'DSL Internet', type: 'select', options: [{value: 0, label: 'No'}, {value: 1, label: 'Yes'}]},
                {key: 'Internet_Type_Fiber_Optic', label: 'Fiber Optic Internet', type: 'select', options: [{value: 0, label: 'No'}, {value: 1, label: 'Yes'}]},
                {key: 'Internet_Type_No_Internet', label: 'No Internet Service', type: 'select', options: [{value: 0, label: 'No'}, {value: 1, label: 'Yes'}]},
              ]}
            />
            <FormSection
              title="Security & Add-on Services"
              section="security"
              icon="🔒"
              fields={[
                {key: 'Online_Security', label: 'Online Security', type: 'select', options: [{value: 0, label: 'No'}, {value: 1, label: 'Yes'}]},
                {key: 'Online_Backup', label: 'Online Backup', type: 'select', options: [{value: 0, label: 'No'}, {value: 1, label: 'Yes'}]},
                {key: 'Device_Protection_Plan', label: 'Device Protection Plan', type: 'select', options: [{value: 0, label: 'No'}, {value: 1, label: 'Yes'}]},
                {key: 'Premium_Tech_Support', label: 'Premium Tech Support', type: 'select', options: [{value: 0, label: 'No'}, {value: 1, label: 'Yes'}]},
                {key: 'Unlimited_Data', label: 'Unlimited Data', type: 'select', options: [{value: 0, label: 'No'}, {value: 1, label: 'Yes'}]},
              ]}
            />
            <FormSection
              title="Entertainment Services"
              section="entertainment"
              icon="🎬"
              fields={[
                {key: 'Streaming_TV', label: 'Streaming TV', type: 'select', options: [{value: 0, label: 'No'}, {value: 1, label: 'Yes'}]},
                {key: 'Streaming_Movies', label: 'Streaming Movies', type: 'select', options: [{value: 0, label: 'No'}, {value: 1, label: 'Yes'}]},
                {key: 'Streaming_Music', label: 'Streaming Music', type: 'select', options: [{value: 0, label: 'No'}, {value: 1, label: 'Yes'}]},
              ]}
            />
            <FormSection
              title="Contract & Billing"
              section="billing"
              icon="💳"
              fields={[
                {key: 'Contract_One_Year', label: 'One Year Contract', type: 'select', options: [{value: 0, label: 'No'}, {value: 1, label: 'Yes'}]},
                {key: 'Contract_Two_Year', label: 'Two Year Contract', type: 'select', options: [{value: 0, label: 'No'}, {value: 1, label: 'Yes'}]},
                {key: 'Paperless_Billing', label: 'Paperless Billing', type: 'select', options: [{value: 0, label: 'No'}, {value: 1, label: 'Yes'}]},
                {key: 'Payment_Method_Credit_Card', label: 'Credit Card Payment', type: 'select', options: [{value: 0, label: 'No'}, {value: 1, label: 'Yes'}]},
                {key: 'Payment_Method_Mailed_Check', label: 'Mailed Check Payment', type: 'select', options: [{value: 0, label: 'No'}, {value: 1, label: 'Yes'}]},
              ]}
            />
            <FormSection
              title="Special Offers & Promotions"
              section="offers"
              icon="🎁"
              fields={[
                {key: 'Offer_Offer_A', label: 'Offer A', type: 'select', options: [{value: 0, label: 'No'}, {value: 1, label: 'Yes'}]},
                {key: 'Offer_Offer_B', label: 'Offer B', type: 'select', options: [{value: 0, label: 'No'}, {value: 1, label: 'Yes'}]},
                {key: 'Offer_Offer_C', label: 'Offer C', type: 'select', options: [{value: 0, label: 'No'}, {value: 1, label: 'Yes'}]},
                {key: 'Offer_Offer_D', label: 'Offer D', type: 'select', options: [{value: 0, label: 'No'}, {value: 1, label: 'Yes'}]},
                {key: 'Offer_Offer_E', label: 'Offer E', type: 'select', options: [{value: 0, label: 'No'}, {value: 1, label: 'Yes'}]},
              ]}
            />
            <FormSection
              title="Financial Information"
              section="financial"
              icon="💰"
              fields={[
                {key: 'Monthly_Charge', label: 'Monthly Charge ($)', type: 'number'},
                {key: 'Total_Revenue', label: 'Total Revenue ($)', type: 'number'},
                {key: 'Total_Extra_Data_Charges', label: 'Total Extra Data Charges ($)', type: 'number'},
                {key: 'Total_Long_Distance_Charges', label: 'Total Long Distance Charges ($)', type: 'number'},
                {key: 'Total_Refunds', label: 'Total Refunds ($)', type: 'number'},
                {key: 'CLTV', label: 'Customer Lifetime Value ($)', type: 'number'},
              ]}
            />
            <FormSection
              title="Usage Patterns"
              section="usage"
              icon="📊"
              fields={[
                {key: 'Avg_Monthly_GB_Download', label: 'Avg Monthly GB Download', type: 'number'},
                {key: 'Avg_Monthly_Long_Distance_Charges', label: 'Avg Monthly Long Distance Charges ($)', type: 'number'},
                {key: 'Monthly_to_Total_Ratio', label: 'Monthly to Total Ratio', type: 'number'},
              ]}
            />
            <FormSection
              title="Customer Experience & Engagement"
              section="experience"
              icon="⭐"
              fields={[
                {key: 'Tenure_in_Months', label: 'Tenure (Months)', type: 'number'},
                {key: 'Satisfaction_Score', label: 'Satisfaction Score', type: 'select', options: [
                  {value: 1, label: '1 - Very Dissatisfied'},
                  {value: 2, label: '2 - Dissatisfied'},
                  {value: 3, label: '3 - Neutral'},
                  {value: 4, label: '4 - Satisfied'},
                  {value: 5, label: '5 - Very Satisfied'}
                ]},
                {key: 'Number_of_Referrals', label: 'Number of Referrals', type: 'number'},
                {key: 'Referred_a_Friend', label: 'Referred a Friend', type: 'select', options: [{value: 0, label: 'No'}, {value: 1, label: 'Yes'}]},
                {key: 'Population', label: 'Area Population', type: 'number'},
              ]}
            />
            <FormSection
              title="Risk Indicators"
              section="risk"
              icon="⚠️"
              fields={[
                {key: 'Tenure_Quartile', label: 'Tenure Quartile', type: 'select', options: [
                  {value: 0, label: 'Q1 (0-25%)'},
                  {value: 1, label: 'Q2 (25-50%)'},
                  {value: 2, label: 'Q3 (50-75%)'},
                  {value: 3, label: 'Q4 (75-100%)'}
                ]},
                {key: 'Early_Churner_Risk', label: 'Early Churner Risk', type: 'select', options: [{value: 0, label: 'No'}, {value: 1, label: 'Yes'}]},
                {key: 'Low_Satisfaction', label: 'Low Satisfaction Flag', type: 'select', options: [{value: 0, label: 'No'}, {value: 1, label: 'Yes'}]},
              ]}
            />
            <div className="pt-6">
              <button
                onClick={handlePredict}
                disabled={loading}
                className={`w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-4 px-8 rounded-xl shadow-lg transition-all duration-300 transform hover:scale-105 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {loading ? (
                  <div className="flex items-center justify-center space-x-3">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span className="text-lg">Analyzing Customer...</span>
                  </div>
                ) : (
                  <span className="text-lg">🔮 Predict Churn Risk</span>
                )}
              </button>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden sticky top-8">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-4">
                <h2 className="text-xl font-bold text-white flex items-center">
                  <span className="mr-2">📈</span>
                  Analysis Results
                </h2>
              </div>

              {results ? (
                <div className="p-6 space-y-6">
                  <div className={`p-6 rounded-xl border-2 ${
                    results.prediction === 1 
                      ? 'bg-gradient-to-r from-red-50 to-red-100 border-red-300' 
                      : 'bg-gradient-to-r from-green-50 to-green-100 border-green-300'
                  }`}>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-3">
                        <span className="text-3xl">
                          {results.prediction === 1 ? '⚠️' : '✅'}
                        </span>
                        <h3 className={`font-bold text-lg ${
                          results.prediction === 1 ? 'text-red-800' : 'text-green-800'
                        }`}>
                          {results.prediction === 1 ? 'High Churn Risk' : 'Low Churn Risk'}
                        </h3>
                      </div>
                      <div className="space-y-1">
                        <p className={`text-sm font-medium ${
                          results.prediction === 1 ? 'text-red-600' : 'text-green-600'
                        }`}>
                          Confidence: {(results.churn_probability * 100).toFixed(1)}%
                        </p>
                        {/* Explicitly render inference time */}
                        <p className="text-sm text-gray-600 font-medium" style={{ display: 'block', visibility: 'visible' }}>
                          Inference Time: {results.inference_time != null 
                            ? `${(results.inference_time * 1000).toFixed(2)} ms`
                            : 'Not available'}
                        </p>
                        {/* Debug element to confirm rendering */}
                        <p className="text-sm text-blue-600 font-medium" style={{ border: '1px solid blue', padding: '2px' }}>
                          Debug: Inference Time Present
                        </p>
                      </div>
                    </div>

                    <div className="w-full bg-gray-200 rounded-full h-3 mt-4">
                      <div 
                        className={`h-3 rounded-full transition-all duration-1000 ${
                          results.prediction === 1 ? 'bg-red-500' : 'bg-green-500'
                        }`}
                        style={{ width: `${results.churn_probability * 100}%` }}
                      ></div>
                    </div>
                  </div>

                  {explanation && (
                    <div>
                      <div className="flex space-x-1 mb-4 bg-gray-100 rounded-lg p-1">
                        <button
                          onClick={() => setActiveTab('prediction')}
                          className={`flex-1 px-3 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
                            activeTab === 'prediction' 
                              ? 'bg-white text-blue-600 shadow-sm' 
                              : 'text-gray-600 hover:text-gray-900'
                          }`}
                        >
                          📊 Summary
                        </button>
                        <button
                          onClick={() => setActiveTab('explanation')}
                          className={`flex-1 px-3 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
                            activeTab === 'explanation' 
                              ? 'bg-white text-blue-600 shadow-sm' 
                              : 'text-gray-600 hover:text-gray-900'
                          }`}
                        >
                          🔍 Analysis
                        </button>
                        {counterfactuals && (
                          <button
                            onClick={() => setActiveTab('recommendations')}
                            className={`flex-1 px-3 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
                              activeTab === 'recommendations' 
                                ? 'bg-white text-blue-600 shadow-sm' 
                                : 'text-gray-600 hover:text-gray-900'
                            }`}
                          >
                            💡 Actions
                          </button>
                        )}
                      </div>

                      {activeTab === 'prediction' && (
                        <div className="space-y-3">
                          <h4 className="font-semibold text-gray-900 flex items-center">
                            <span className="mr-2">🎯</span>
                            {results.prediction === 1 ? 'Key Risk Factors:' : 'Key Retention Factors:'}
                          </h4>
                          <div className="space-y-2">
                            {explanation.top_features?.slice(0, 5).map((feature: any, index: number) => (
                              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border">
                                <span className="font-medium text-gray-800 text-sm">{feature.feature}</span>
                                <span className={`font-bold text-sm px-3 py-1 rounded-full ${
                                  feature.impact > 0 
                                    ? 'bg-red-100 text-red-700 border border-red-200' 
                                    : 'bg-blue-100 text-blue-700 border border-blue-200'
                                }`}>
                                  {feature.impact > 0 ? '+' : ''}{(feature.impact * 100).toFixed(1)}%
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {activeTab === 'explanation' && (
                        <div className="space-y-4">
                          <div className="text-center">
                            <p className="text-sm text-gray-600 mb-4">
                              📊 Detailed feature analysis shown below
                            </p>
                            <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                              <p className="text-xs text-blue-700">
                                Scroll down to see the full SHAP feature importance chart
                              </p>
                            </div>
                          </div>
                        </div>
                      )}

                      {activeTab === 'recommendations' && counterfactuals && (
                        <div className="space-y-3">
                          <h4 className="font-semibold text-gray-900 flex items-center">
                            <span className="mr-2">🛠️</span>
                            Retention Actions:
                          </h4>
                          <div className="space-y-3">
                            {counterfactuals.suggested_actions?.slice(0, 3).map((action: any, index: number) => (
                              <div key={index} className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border-l-4 border-blue-400">
                                <div className="flex items-start justify-between">
                                  <div className="flex-1">
                                    <div className="font-semibold text-blue-900 text-sm mb-1">
                                      {action.feature}
                                    </div>
                                    <div className="text-blue-800 text-xs leading-relaxed">
                                      {action.action}
                                    </div>
                                  </div>
                                  {action.priority && (
                                    <span className={`text-xs px-2 py-1 rounded-full font-medium ml-2 ${
                                      action.priority === 'CRITICAL' ? 'bg-red-100 text-red-800 border border-red-200' :
                                      action.priority === 'HIGH' ? 'bg-orange-100 text-orange-800 border border-orange-200' :
                                      'bg-yellow-100 text-yellow-800 border border-yellow-200'
                                    }`}>
                                      {action.priority}
                                    </span>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ) : (
                <div className="p-8 text-center">
                  <div className="text-6xl mb-4">🔮</div>
                  <h3 className="text-lg font-semibold text-gray-700 mb-2">Ready to Analyze</h3>
                  <p className="text-gray-500 text-sm">
                    Complete the customer information in the collapsible sections and click "Predict Churn Risk" to begin analysis
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {activeTab === 'explanation' && explanation?.shap_data && (
          <div className="mt-10">
            <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  🎯 Detailed Feature Impact Analysis
                </h2>
                <p className="text-gray-600">
                  Understanding what drives the {results.prediction === 1 ? 'churn risk' : 'retention factors'} for this customer
                </p>
              </div>

              <ShapChart 
                shapData={explanation.shap_data} 
                title={`SHAP Feature Importance ${results.prediction === 1 ? '(Churn Drivers)' : '(Retention Factors)'}`}
              />

              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600 text-center">
                  💡 <strong>How to read this chart:</strong> Red bars show features that increase churn risk, 
                  while blue bars show features that decrease churn risk. Longer bars indicate stronger influence.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PredictionPage;