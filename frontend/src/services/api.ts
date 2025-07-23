import axios from 'axios';

const API_BASE_URL = 'http://127.0.0.1:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export interface CustomerData {
  Age: number;
  Avg_Monthly_GB_Download: number;
  Avg_Monthly_Long_Distance_Charges: number;
  CLTV: number;
  Monthly_Charge: number;
  Population: number;
  Total_Extra_Data_Charges: number;
  Total_Long_Distance_Charges: number;
  Total_Refunds: number;
  Total_Revenue: number;
  Tenure_in_Months: number;
  Monthly_to_Total_Ratio: number;
  Number_of_Dependents: number;
  Number_of_Referrals: number;
  Dependents: number;
  Device_Protection_Plan: number;
  Gender: number;
  Internet_Service: number;
  Married: number;
  Multiple_Lines: number;
  Online_Backup: number;
  Online_Security: number;
  Paperless_Billing: number;
  Partner: number;
  Phone_Service: number;
  Premium_Tech_Support: number;
  Referred_a_Friend: number;
  Satisfaction_Score: number;
  Senior_Citizen: number;
  Streaming_Movies: number;
  Streaming_Music: number;
  Streaming_TV: number;
  Unlimited_Data: number;
  Tenure_Quartile: number;
  Early_Churner_Risk: number;
  Low_Satisfaction: number;
  Contract_One_Year: number;
  Contract_Two_Year: number;
  Internet_Type_DSL: number;
  Internet_Type_Fiber_Optic: number;
  Internet_Type_No_Internet: number;
  Offer_Offer_A: number;
  Offer_Offer_B: number;
  Offer_Offer_C: number;
  Offer_Offer_D: number;
  Offer_Offer_E: number;
  Payment_Method_Credit_Card: number;
  Payment_Method_Mailed_Check: number;
}

export const churnAPI = {
  predict: async (customerData: CustomerData) => {
    const response = await api.post('/predict', customerData);
    return response.data;
  },

  explain: async (customerData: CustomerData) => {
    const response = await api.post('/explain', customerData);
    return response.data;
  },

  getCounterfactuals: async (customerData: CustomerData, desiredClass = 0, totalCFs = 1) => {
    const response = await api.post(
      `/counterfactual?desired_class=${desiredClass}&total_CFs=${totalCFs}`, 
      customerData
    );
    return response.data;
  },
};

export default churnAPI;
