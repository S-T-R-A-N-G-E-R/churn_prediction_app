import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ResultsPanelProps {
  results: any;
  explanation: any;
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const LiquidResultsPanel: React.FC<ResultsPanelProps> = ({ results, explanation, activeTab, onTabChange }) => {
  if (!results) {
    return (
      <div className="glass-card p-8 text-center">
        <div className="text-6xl mb-6 animate-liquid-float">🔮</div>
        <h3 className="text-xl font-semibold text-glass mb-3">Ready for Analysis</h3>
        <p className="text-glass-secondary">
          Complete the customer information to begin AI-powered churn prediction
        </p>
      </div>
    );
  }

  const tabs = [
    { key: 'summary', label: 'Summary', icon: '📊' },
    { key: 'analysis', label: 'Analysis', icon: '🔍' },
    ...(results.prediction === 1 ? [{ key: 'actions', label: 'Actions', icon: '💡' }] : [])
  ];

  return (
    <div className="glass-card overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 px-6 py-4 border-b border-white/10">
        <h2 className="text-xl font-bold text-glass flex items-center">
          <span className="mr-3">📈</span>
          Prediction Results
        </h2>
      </div>

      {/* Main Result */}
      <div className="p-6">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className={`p-6 rounded-2xl border-2 mb-6 ${
            results.prediction === 1 
              ? 'bg-gradient-to-r from-red-500/20 to-red-600/20 border-red-400/30' 
              : 'bg-gradient-to-r from-green-500/20 to-green-600/20 border-green-400/30'
          }`}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-4">
              <span className="text-4xl">
                {results.prediction === 1 ? '⚠️' : '✅'}
              </span>
              <div>
                <h3 className={`text-2xl font-bold ${
                  results.prediction === 1 ? 'text-red-300' : 'text-green-300'
                }`}>
                  {results.prediction === 1 ? 'High Churn Risk' : 'Low Churn Risk'}
                </h3>
                <p className={`text-sm font-medium ${
                  results.prediction === 1 ? 'text-red-400' : 'text-green-400'
                }`}>
                  Confidence: {(results.churn_probability * 100).toFixed(1)}%
                </p>
              </div>
            </div>
          </div>
          
          {/* Animated Progress Bar */}
          <div className="w-full bg-white/10 rounded-full h-3 overflow-hidden">
            <motion.div 
              className={`h-3 rounded-full ${
                results.prediction === 1 ? 'bg-gradient-to-r from-red-500 to-red-600' : 'bg-gradient-to-r from-green-500 to-green-600'
              }`}
              initial={{ width: 0 }}
              animate={{ width: `${results.churn_probability * 100}%` }}
              transition={{ duration: 1.5, ease: "easeOut" }}
            />
          </div>
        </motion.div>

        {/* Tabs */}
        {explanation && (
          <>
            <div className="flex space-x-1 mb-6 bg-white/5 rounded-xl p-1">
              {tabs.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => onTabChange(tab.key)}
                  className={`flex-1 px-4 py-3 text-sm font-medium rounded-lg transition-all duration-300 ${
                    activeTab === tab.key 
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg' 
                      : 'text-glass-secondary hover:text-white hover:bg-white/10'
                  }`}
                >
                  <span className="mr-2">{tab.icon}</span>
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                {activeTab === 'summary' && (
                  <div className="space-y-3">
                    <h4 className="font-semibold text-glass flex items-center mb-4">
                      <span className="mr-2">🎯</span>
                      Key Risk Factors
                    </h4>
                    {explanation.top_features?.slice(0, 5).map((feature: any, index: number) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-center justify-between p-4 glass-surface bg-white/5 rounded-xl"
                      >
                        <span className="font-medium text-glass">{feature.feature}</span>
                        <span className={`font-bold px-3 py-1 rounded-full text-sm ${
                          feature.impact > 0 
                            ? 'bg-red-500/20 text-red-300 border border-red-500/30' 
                            : 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                        }`}>
                          {feature.impact > 0 ? '+' : ''}{(feature.impact * 100).toFixed(1)}%
                        </span>
                      </motion.div>
                    ))}
                  </div>
                )}

                {activeTab === 'analysis' && (
                  <div className="text-center p-8">
                    <div className="glass-surface bg-blue-500/10 p-6 rounded-xl border border-blue-500/20">
                      <h4 className="text-lg font-semibold text-glass mb-3">
                        📊 Detailed Analysis Available
                      </h4>
                      <p className="text-glass-secondary text-sm">
                        SHAP feature importance chart will be displayed below the form
                      </p>
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </>
        )}
      </div>
    </div>
  );
};

export default LiquidResultsPanel;
