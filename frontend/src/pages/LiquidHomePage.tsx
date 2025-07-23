import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const LiquidHomePage: React.FC = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.8,
        ease: "easeOut" as const  // Fix: Use const assertion
      }
    }
  };

  const FloatingOrb: React.FC<{ delay: number; size: string; position: string }> = ({ delay, size, position }) => (
    <motion.div
      className={`absolute ${position} ${size} rounded-full opacity-20`}
      style={{
        background: 'linear-gradient(135deg, #007AFF, #5856D6)',
        filter: 'blur(40px)',
      }}
      animate={{
        y: [0, -30, 0],
        x: [0, 15, 0],
        scale: [1, 1.1, 1],
      }}
      transition={{
        duration: 8,
        repeat: Infinity,
        delay,
        ease: "easeInOut" as const  // Fix: Use const assertion
      }}
    />
  );

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Floating Background Orbs */}
      <FloatingOrb delay={0} size="w-96 h-96" position="top-20 -left-48" />
      <FloatingOrb delay={2} size="w-64 h-64" position="top-96 -right-32" />
      <FloatingOrb delay={4} size="w-80 h-80" position="bottom-20 left-1/3" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-20">
        <motion.div
          className="text-center mb-20"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={itemVariants} className="mb-8">
            <h1 className="text-7xl font-bold text-glass mb-6 leading-tight">
              AI-Powered Customer
              <br />
              <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Churn Prediction
              </span>
            </h1>
          </motion.div>

          <motion.p 
            variants={itemVariants}
            className="text-xl text-glass-secondary mb-12 max-w-3xl mx-auto leading-relaxed"
          >
            Harness the power of explainable AI to predict customer churn with 96.9% accuracy. 
            Get real-time insights, SHAP explanations, and actionable recommendations to retain your most valuable customers.
          </motion.p>

          <motion.div variants={itemVariants}>
            <Link to="/predict">
              <button className="liquid-button text-lg px-12 py-4 animate-glow-pulse">
                Start Prediction Analysis
              </button>
            </Link>
          </motion.div>
        </motion.div>

        {/* Feature Cards */}
        <motion.div 
          className="grid md:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {[
            {
              icon: "🎯",
              title: "96.9% Accuracy",
              description: "Stacking ensemble model with advanced feature engineering for precise predictions",
              gradient: "from-blue-500/20 to-cyan-500/20"
            },
            {
              icon: "🔍", 
              title: "SHAP Explanations",
              description: "Understand exactly which factors drive churn risk with interpretable AI insights",
              gradient: "from-purple-500/20 to-pink-500/20"
            },
            {
              icon: "💡",
              title: "Smart Recommendations", 
              description: "Get actionable retention strategies tailored to each customer's risk profile",
              gradient: "from-green-500/20 to-emerald-500/20"
            }
          ].map((feature, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="liquid-card-container"
            >
              <div className={`glass-card liquid-card-3d p-8 text-center bg-gradient-to-br ${feature.gradient} animate-liquid-float`}>
                <div className="text-5xl mb-6">{feature.icon}</div>
                <h3 className="text-2xl font-bold text-glass mb-4">{feature.title}</h3>
                <p className="text-glass-secondary leading-relaxed">{feature.description}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA Section */}
        <motion.div 
          className="mt-20 text-center"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5, duration: 0.8 }}
        >
          <div className="glass-card p-12 bg-gradient-to-r from-blue-500/10 to-purple-500/10">
            <h2 className="text-4xl font-bold text-glass mb-6">
              Ready to Transform Your Customer Retention?
            </h2>
            <p className="text-xl text-glass-secondary mb-8 max-w-2xl mx-auto">
              Join leading companies using AI-powered churn prediction to increase customer lifetime value and reduce acquisition costs.
            </p>
            <div className="flex justify-center space-x-6">
              <Link to="/predict">
                <button className="liquid-button">
                  Try Demo
                </button>
              </Link>
              <Link to="/performance">
                <button className="nav-item bg-white/10 hover:bg-white/20">
                  View Analytics
                </button>
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default LiquidHomePage;
