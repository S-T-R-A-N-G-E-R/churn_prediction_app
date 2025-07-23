import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDownIcon } from '@heroicons/react/24/outline';
import { CustomerData } from '../services/api';

interface FormSectionProps {
  title: string;
  icon: string;
  isExpanded: boolean;
  onToggle: () => void;
  children: React.ReactNode;
  fieldCount: number;
}

const LiquidFormSection: React.FC<FormSectionProps> = ({ title, icon, isExpanded, onToggle, children, fieldCount }) => (
  <motion.div 
    className="glass-card mb-6 overflow-hidden"
    layout
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
  >
    <motion.button
      onClick={onToggle}
      className="w-full px-8 py-6 flex items-center justify-between hover:bg-white/5 transition-colors duration-300"
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
    >
      <div className="flex items-center space-x-4">
        <span className="text-3xl">{icon}</span>
        <div className="text-left">
          <h3 className="text-xl font-semibold text-glass">{title}</h3>
          <p className="text-sm text-glass-secondary">{fieldCount} fields</p>
        </div>
      </div>
      <motion.div
        animate={{ rotate: isExpanded ? 180 : 0 }}
        transition={{ duration: 0.3 }}
      >
        <ChevronDownIcon className="w-6 h-6 text-glass-secondary" />
      </motion.div>
    </motion.button>
    
    <AnimatePresence>
      {isExpanded && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="overflow-hidden"
        >
          <div className="px-8 pb-8 pt-4 border-t border-white/10 bg-gradient-to-r from-white/5 to-blue-500/5">
            {children}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  </motion.div>
);

const LiquidInput: React.FC<{
  label: string;
  value: number;
  onChange: (value: number) => void;
  type?: 'number' | 'select';
  options?: Array<{value: number, label: string}>;
  step?: string;
}> = ({ label, value, onChange, type = 'number', options, step = '1' }) => (
  <div className="space-y-2">
    <label className="block text-sm font-medium text-glass-secondary">
      {label}
    </label>
    {type === 'select' ? (
      <select
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="glass-input w-full"
      >
        {options?.map(option => (
          <option key={option.value} value={option.value} className="bg-slate-800">
            {option.label}
          </option>
        ))}
      </select>
    ) : (
      <input
        type="number"
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="glass-input w-full"
      />
    )}
  </div>
);

const LiquidPredictionForm: React.FC<{
  customerData: CustomerData;
  onDataChange: (field: keyof CustomerData, value: number) => void;
  onPredict: () => void;
  loading: boolean;
}> = ({ customerData, onDataChange, onPredict, loading }) => {
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

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <h2 className="text-3xl font-bold text-glass mb-4">Customer Analysis</h2>
        <p className="text-glass-secondary">Configure customer parameters for AI-powered churn prediction</p>
      </motion.div>

      {/* Demographics Section */}
      <LiquidFormSection
        title="Demographics"
        icon="👥"
        isExpanded={expandedSections.demographics}
        onToggle={() => toggleSection('demographics')}
        fieldCount={7}
      >
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <LiquidInput
            label="Age"
            value={customerData.Age}
            onChange={(value) => onDataChange('Age', value)}
          />
          <LiquidInput
            label="Gender"
            value={customerData.Gender}
            onChange={(value) => onDataChange('Gender', value)}
            type="select"
            options={[{value: 0, label: 'Female'}, {value: 1, label: 'Male'}]}
          />
          <LiquidInput
            label="Senior Citizen"
            value={customerData.Senior_Citizen}
            onChange={(value) => onDataChange('Senior_Citizen', value)}
            type="select"
            options={[{value: 0, label: 'No'}, {value: 1, label: 'Yes'}]}
          />
          <LiquidInput
            label="Married"
            value={customerData.Married}
            onChange={(value) => onDataChange('Married', value)}
            type="select"
            options={[{value: 0, label: 'No'}, {value: 1, label: 'Yes'}]}
          />
          <LiquidInput
            label="Has Partner"
            value={customerData.Partner}
            onChange={(value) => onDataChange('Partner', value)}
            type="select"
            options={[{value: 0, label: 'No'}, {value: 1, label: 'Yes'}]}
          />
          <LiquidInput
            label="Has Dependents"
            value={customerData.Dependents}
            onChange={(value) => onDataChange('Dependents', value)}
            type="select"
            options={[{value: 0, label: 'No'}, {value: 1, label: 'Yes'}]}
          />
          <LiquidInput
            label="Number of Dependents"
            value={customerData.Number_of_Dependents}
            onChange={(value) => onDataChange('Number_of_Dependents', value)}
          />
        </div>
      </LiquidFormSection>

      {/* Phone & Internet Services */}
      <LiquidFormSection
        title="Phone & Internet Services"
        icon="📱"
        isExpanded={expandedSections.services}
        onToggle={() => toggleSection('services')}
        fieldCount={6}
      >
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <LiquidInput
            label="Phone Service"
            value={customerData.Phone_Service}
            onChange={(value) => onDataChange('Phone_Service', value)}
            type="select"
            options={[{value: 0, label: 'No'}, {value: 1, label: 'Yes'}]}
          />
          <LiquidInput
            label="Multiple Lines"
            value={customerData.Multiple_Lines}
            onChange={(value) => onDataChange('Multiple_Lines', value)}
            type="select"
            options={[{value: 0, label: 'No'}, {value: 1, label: 'Yes'}]}
          />
          <LiquidInput
            label="Internet Service"
            value={customerData.Internet_Service}
            onChange={(value) => onDataChange('Internet_Service', value)}
            type="select"
            options={[{value: 0, label: 'No'}, {value: 1, label: 'Yes'}]}
          />
          <LiquidInput
            label="DSL Internet"
            value={customerData.Internet_Type_DSL}
            onChange={(value) => onDataChange('Internet_Type_DSL', value)}
            type="select"
            options={[{value: 0, label: 'No'}, {value: 1, label: 'Yes'}]}
          />
          <LiquidInput
            label="Fiber Optic Internet"
            value={customerData.Internet_Type_Fiber_Optic}
            onChange={(value) => onDataChange('Internet_Type_Fiber_Optic', value)}
            type="select"
            options={[{value: 0, label: 'No'}, {value: 1, label: 'Yes'}]}
          />
          <LiquidInput
            label="No Internet Service"
            value={customerData.Internet_Type_No_Internet}
            onChange={(value) => onDataChange('Internet_Type_No_Internet', value)}
            type="select"
            options={[{value: 0, label: 'No'}, {value: 1, label: 'Yes'}]}
          />
        </div>
      </LiquidFormSection>

      {/* Security & Add-on Services */}
      <LiquidFormSection
        title="Security & Add-on Services"
        icon="🔒"
        isExpanded={expandedSections.security}
        onToggle={() => toggleSection('security')}
        fieldCount={5}
      >
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <LiquidInput
            label="Online Security"
            value={customerData.Online_Security}
            onChange={(value) => onDataChange('Online_Security', value)}
            type="select"
            options={[{value: 0, label: 'No'}, {value: 1, label: 'Yes'}]}
          />
          <LiquidInput
            label="Online Backup"
            value={customerData.Online_Backup}
            onChange={(value) => onDataChange('Online_Backup', value)}
            type="select"
            options={[{value: 0, label: 'No'}, {value: 1, label: 'Yes'}]}
          />
          <LiquidInput
            label="Device Protection Plan"
            value={customerData.Device_Protection_Plan}
            onChange={(value) => onDataChange('Device_Protection_Plan', value)}
            type="select"
            options={[{value: 0, label: 'No'}, {value: 1, label: 'Yes'}]}
          />
          <LiquidInput
            label="Premium Tech Support"
            value={customerData.Premium_Tech_Support}
            onChange={(value) => onDataChange('Premium_Tech_Support', value)}
            type="select"
            options={[{value: 0, label: 'No'}, {value: 1, label: 'Yes'}]}
          />
          <LiquidInput
            label="Unlimited Data"
            value={customerData.Unlimited_Data}
            onChange={(value) => onDataChange('Unlimited_Data', value)}
            type="select"
            options={[{value: 0, label: 'No'}, {value: 1, label: 'Yes'}]}
          />
        </div>
      </LiquidFormSection>

      {/* Entertainment Services */}
      <LiquidFormSection
        title="Entertainment Services"
        icon="🎬"
        isExpanded={expandedSections.entertainment}
        onToggle={() => toggleSection('entertainment')}
        fieldCount={3}
      >
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <LiquidInput
            label="Streaming TV"
            value={customerData.Streaming_TV}
            onChange={(value) => onDataChange('Streaming_TV', value)}
            type="select"
            options={[{value: 0, label: 'No'}, {value: 1, label: 'Yes'}]}
          />
          <LiquidInput
            label="Streaming Movies"
            value={customerData.Streaming_Movies}
            onChange={(value) => onDataChange('Streaming_Movies', value)}
            type="select"
            options={[{value: 0, label: 'No'}, {value: 1, label: 'Yes'}]}
          />
          <LiquidInput
            label="Streaming Music"
            value={customerData.Streaming_Music}
            onChange={(value) => onDataChange('Streaming_Music', value)}
            type="select"
            options={[{value: 0, label: 'No'}, {value: 1, label: 'Yes'}]}
          />
        </div>
      </LiquidFormSection>

      {/* Contract & Billing */}
      <LiquidFormSection
        title="Contract & Billing"
        icon="💳"
        isExpanded={expandedSections.billing}
        onToggle={() => toggleSection('billing')}
        fieldCount={5}
      >
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <LiquidInput
            label="One Year Contract"
            value={customerData.Contract_One_Year}
            onChange={(value) => onDataChange('Contract_One_Year', value)}
            type="select"
            options={[{value: 0, label: 'No'}, {value: 1, label: 'Yes'}]}
          />
          <LiquidInput
            label="Two Year Contract"
            value={customerData.Contract_Two_Year}
            onChange={(value) => onDataChange('Contract_Two_Year', value)}
            type="select"
            options={[{value: 0, label: 'No'}, {value: 1, label: 'Yes'}]}
          />
          <LiquidInput
            label="Paperless Billing"
            value={customerData.Paperless_Billing}
            onChange={(value) => onDataChange('Paperless_Billing', value)}
            type="select"
            options={[{value: 0, label: 'No'}, {value: 1, label: 'Yes'}]}
          />
          <LiquidInput
            label="Credit Card Payment"
            value={customerData.Payment_Method_Credit_Card}
            onChange={(value) => onDataChange('Payment_Method_Credit_Card', value)}
            type="select"
            options={[{value: 0, label: 'No'}, {value: 1, label: 'Yes'}]}
          />
          <LiquidInput
            label="Mailed Check Payment"
            value={customerData.Payment_Method_Mailed_Check}
            onChange={(value) => onDataChange('Payment_Method_Mailed_Check', value)}
            type="select"
            options={[{value: 0, label: 'No'}, {value: 1, label: 'Yes'}]}
          />
        </div>
      </LiquidFormSection>

      {/* Special Offers */}
      <LiquidFormSection
        title="Special Offers & Promotions"
        icon="🎁"
        isExpanded={expandedSections.offers}
        onToggle={() => toggleSection('offers')}
        fieldCount={5}
      >
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <LiquidInput
            label="Offer A"
            value={customerData.Offer_Offer_A}
            onChange={(value) => onDataChange('Offer_Offer_A', value)}
            type="select"
            options={[{value: 0, label: 'No'}, {value: 1, label: 'Yes'}]}
          />
          <LiquidInput
            label="Offer B"
            value={customerData.Offer_Offer_B}
            onChange={(value) => onDataChange('Offer_Offer_B', value)}
            type="select"
            options={[{value: 0, label: 'No'}, {value: 1, label: 'Yes'}]}
          />
          <LiquidInput
            label="Offer C"
            value={customerData.Offer_Offer_C}
            onChange={(value) => onDataChange('Offer_Offer_C', value)}
            type="select"
            options={[{value: 0, label: 'No'}, {value: 1, label: 'Yes'}]}
          />
          <LiquidInput
            label="Offer D"
            value={customerData.Offer_Offer_D}
            onChange={(value) => onDataChange('Offer_Offer_D', value)}
            type="select"
            options={[{value: 0, label: 'No'}, {value: 1, label: 'Yes'}]}
          />
          <LiquidInput
            label="Offer E"
            value={customerData.Offer_Offer_E}
            onChange={(value) => onDataChange('Offer_Offer_E', value)}
            type="select"
            options={[{value: 0, label: 'No'}, {value: 1, label: 'Yes'}]}
          />
        </div>
      </LiquidFormSection>

      {/* Financial Information */}
      <LiquidFormSection
        title="Financial Information"
        icon="💰"
        isExpanded={expandedSections.financial}
        onToggle={() => toggleSection('financial')}
        fieldCount={6}
      >
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <LiquidInput
            label="Monthly Charge ($)"
            value={customerData.Monthly_Charge}
            onChange={(value) => onDataChange('Monthly_Charge', value)}
            step="0.01"
          />
          <LiquidInput
            label="Total Revenue ($)"
            value={customerData.Total_Revenue}
            onChange={(value) => onDataChange('Total_Revenue', value)}
            step="0.01"
          />
          <LiquidInput
            label="Total Extra Data Charges ($)"
            value={customerData.Total_Extra_Data_Charges}
            onChange={(value) => onDataChange('Total_Extra_Data_Charges', value)}
            step="0.01"
          />
          <LiquidInput
            label="Total Long Distance Charges ($)"
            value={customerData.Total_Long_Distance_Charges}
            onChange={(value) => onDataChange('Total_Long_Distance_Charges', value)}
            step="0.01"
          />
          <LiquidInput
            label="Total Refunds ($)"
            value={customerData.Total_Refunds}
            onChange={(value) => onDataChange('Total_Refunds', value)}
            step="0.01"
          />
          <LiquidInput
            label="Customer Lifetime Value ($)"
            value={customerData.CLTV}
            onChange={(value) => onDataChange('CLTV', value)}
            step="0.01"
          />
        </div>
      </LiquidFormSection>

      {/* Usage Patterns */}
      <LiquidFormSection
        title="Usage Patterns"
        icon="📊"
        isExpanded={expandedSections.usage}
        onToggle={() => toggleSection('usage')}
        fieldCount={3}
      >
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <LiquidInput
            label="Avg Monthly GB Download"
            value={customerData.Avg_Monthly_GB_Download}
            onChange={(value) => onDataChange('Avg_Monthly_GB_Download', value)}
            step="0.1"
          />
          <LiquidInput
            label="Avg Monthly Long Distance Charges ($)"
            value={customerData.Avg_Monthly_Long_Distance_Charges}
            onChange={(value) => onDataChange('Avg_Monthly_Long_Distance_Charges', value)}
            step="0.01"
          />
          <LiquidInput
            label="Monthly to Total Ratio"
            value={customerData.Monthly_to_Total_Ratio}
            onChange={(value) => onDataChange('Monthly_to_Total_Ratio', value)}
            step="0.0001"
          />
        </div>
      </LiquidFormSection>

      {/* Customer Experience */}
      <LiquidFormSection
        title="Customer Experience & Engagement"
        icon="⭐"
        isExpanded={expandedSections.experience}
        onToggle={() => toggleSection('experience')}
        fieldCount={5}
      >
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <LiquidInput
            label="Tenure (Months)"
            value={customerData.Tenure_in_Months}
            onChange={(value) => onDataChange('Tenure_in_Months', value)}
          />
          <LiquidInput
            label="Satisfaction Score"
            value={customerData.Satisfaction_Score}
            onChange={(value) => onDataChange('Satisfaction_Score', value)}
            type="select"
            options={[
              {value: 1, label: '1 - Very Dissatisfied'},
              {value: 2, label: '2 - Dissatisfied'},
              {value: 3, label: '3 - Neutral'},
              {value: 4, label: '4 - Satisfied'},
              {value: 5, label: '5 - Very Satisfied'}
            ]}
          />
          <LiquidInput
            label="Number of Referrals"
            value={customerData.Number_of_Referrals}
            onChange={(value) => onDataChange('Number_of_Referrals', value)}
          />
          <LiquidInput
            label="Referred a Friend"
            value={customerData.Referred_a_Friend}
            onChange={(value) => onDataChange('Referred_a_Friend', value)}
            type="select"
            options={[{value: 0, label: 'No'}, {value: 1, label: 'Yes'}]}
          />
          <LiquidInput
            label="Area Population"
            value={customerData.Population}
            onChange={(value) => onDataChange('Population', value)}
          />
        </div>
      </LiquidFormSection>

      {/* Risk Indicators */}
      <LiquidFormSection
        title="Risk Indicators"
        icon="⚠️"
        isExpanded={expandedSections.risk}
        onToggle={() => toggleSection('risk')}
        fieldCount={3}
      >
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <LiquidInput
            label="Tenure Quartile"
            value={customerData.Tenure_Quartile}
            onChange={(value) => onDataChange('Tenure_Quartile', value)}
            type="select"
            options={[
              {value: 0, label: 'Q1 (0-25%)'},
              {value: 1, label: 'Q2 (25-50%)'},
              {value: 2, label: 'Q3 (50-75%)'},
              {value: 3, label: 'Q4 (75-100%)'}
            ]}
          />
          <LiquidInput
            label="Early Churner Risk"
            value={customerData.Early_Churner_Risk}
            onChange={(value) => onDataChange('Early_Churner_Risk', value)}
            type="select"
            options={[{value: 0, label: 'No'}, {value: 1, label: 'Yes'}]}
          />
          <LiquidInput
            label="Low Satisfaction Flag"
            value={customerData.Low_Satisfaction}
            onChange={(value) => onDataChange('Low_Satisfaction', value)}
            type="select"
            options={[{value: 0, label: 'No'}, {value: 1, label: 'Yes'}]}
          />
        </div>
      </LiquidFormSection>

      {/* Predict Button */}
      <motion.div 
        className="pt-8"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <button
          onClick={onPredict}
          disabled={loading}
          className={`w-full liquid-button text-xl py-4 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {loading ? (
            <div className="flex items-center justify-center space-x-3">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
              <span>Analyzing Customer Profile...</span>
            </div>
          ) : (
            <span>🔮 Predict Churn Risk</span>
          )}
        </button>
      </motion.div>
    </div>
  );
};

export default LiquidPredictionForm;
