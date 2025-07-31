import React from 'react';
import { motion } from 'framer-motion';

const LiquidModelPerformancePage: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center mb-8"
      >
        <h1 className="text-4xl font-bold text-glass mb-3">
          📊 Model Performance Dashboard
        </h1>
        <p className="text-lg text-glass-secondary">
          Comprehensive analytics and monitoring for your churn prediction model
        </p>
      </motion.div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {[
          { title: "Accuracy", value: "96.9%", description: "Overall prediction correctness", icon: "🎯" },
          { title: "Precision", value: "97.0%", description: "True positives accuracy", icon: "📏" },
          { title: "Recall", value: "92%", description: "True positives detection", icon: "🔍" },
          { title: "F1 Score", value: "98.0%", description: "Harmonic mean score", icon: "⚖️" },
          { title: "AUC-ROC", value: "99.1%", description: "Area under ROC curve", icon: "📈" },
          { title: "Predictions", value: "6,862", description: "Total this month", icon: "🔮" },
        ].map((metric, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
            className="glass-card p-6 text-center hover:scale-105 transition-transform duration-300"
          >
            <div className="text-4xl mb-4">{metric.icon}</div>
            <h3 className="text-2xl font-bold text-glass mb-2">{metric.value}</h3>
            <h4 className="text-lg font-semibold text-glass-secondary mb-2">{metric.title}</h4>
            <p className="text-sm text-glass-secondary">{metric.description}</p>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.5 }}
        className="mt-12 glass-card p-8 text-center"
      >
        <h2 className="text-2xl font-bold text-glass mb-4">🏥 Model Health Status</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="glass-surface bg-green-500/20 p-6 rounded-xl border border-green-500/30">
            <div className="text-4xl mb-2">✅</div>
            <h3 className="text-lg font-semibold text-green-300 mb-1">Excellent Performance</h3>
            <p className="text-sm text-green-400">All metrics above target thresholds</p>
          </div>
          <div className="glass-surface bg-blue-500/20 p-6 rounded-xl border border-blue-500/30">
            <div className="text-4xl mb-2">📈</div>
            <h3 className="text-lg font-semibold text-blue-300 mb-1">Stable Trends</h3>
            <p className="text-sm text-blue-400">Performance improving over time</p>
          </div>
          <div className="glass-surface bg-purple-500/20 p-6 rounded-xl border border-purple-500/30">
            <div className="text-4xl mb-2">🎯</div>
            <h3 className="text-lg font-semibold text-purple-300 mb-1">Data Quality</h3>
            <p className="text-sm text-purple-400">No drift detected in recent data</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default LiquidModelPerformancePage;
