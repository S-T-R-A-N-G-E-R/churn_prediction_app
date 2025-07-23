import React, { useState, useEffect } from 'react';
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Area, AreaChart, ScatterChart, Scatter
} from 'recharts';

interface ModelMetrics {
  accuracy: number;
  precision: number;
  recall: number;
  f1_score: number;
  auc_roc: number;
  confusion_matrix: {
    true_positive: number;
    true_negative: number;
    false_positive: number;
    false_negative: number;
  };
}

interface PerformanceHistory {
  date: string;
  accuracy: number;
  precision: number;
  recall: number;
  f1_score: number;
  auc_roc: number;
  predictions_made: number;
}

const ModelPerformancePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'metrics' | 'confusion' | 'trends' | 'distribution'>('overview');
  const [selectedTimeRange, setSelectedTimeRange] = useState<'7d' | '30d' | '90d' | '1y'>('30d');
  const [loading, setLoading] = useState(false);

  // Mock data - replace with actual API calls to your backend
  const [currentMetrics] = useState<ModelMetrics>({
    accuracy: 0.969,
    precision: 0.923,
    recall: 0.886,
    f1_score: 0.904,
    auc_roc: 0.985,
    confusion_matrix: {
      true_positive: 1847,
      true_negative: 4521,
      false_positive: 203,
      false_negative: 291
    }
  });

  const [performanceHistory] = useState<PerformanceHistory[]>([
    { date: '2025-06-23', accuracy: 0.965, precision: 0.918, recall: 0.881, f1_score: 0.899, auc_roc: 0.982, predictions_made: 1250 },
    { date: '2025-06-30', accuracy: 0.967, precision: 0.920, recall: 0.883, f1_score: 0.901, auc_roc: 0.983, predictions_made: 1340 },
    { date: '2025-07-07', accuracy: 0.969, precision: 0.923, recall: 0.886, f1_score: 0.904, auc_roc: 0.985, predictions_made: 1420 },
    { date: '2025-07-14', accuracy: 0.968, precision: 0.921, recall: 0.884, f1_score: 0.902, auc_roc: 0.984, predictions_made: 1380 },
    { date: '2025-07-21', accuracy: 0.969, precision: 0.923, recall: 0.886, f1_score: 0.904, auc_roc: 0.985, predictions_made: 1456 }
  ]);

  const [featureImportance] = useState([
    { feature: 'Satisfaction Score', importance: 0.187, change: 0.012 },
    { feature: 'Monthly Charge', importance: 0.143, change: -0.003 },
    { feature: 'Tenure in Months', importance: 0.132, change: 0.008 },
    { feature: 'Contract Type', importance: 0.098, change: -0.001 },
    { feature: 'Internet Type', importance: 0.089, change: 0.005 },
    { feature: 'Total Revenue', importance: 0.076, change: -0.002 },
    { feature: 'Payment Method', importance: 0.067, change: 0.001 },
    { feature: 'Online Security', importance: 0.054, change: 0.003 }
  ]);

  const [predictionDistribution] = useState([
    { risk_level: 'Very Low (0-20%)', count: 3241, percentage: 47.2 },
    { risk_level: 'Low (20-40%)', count: 1876, percentage: 27.3 },
    { risk_level: 'Medium (40-60%)', count: 892, percentage: 13.0 },
    { risk_level: 'High (60-80%)', count: 567, percentage: 8.3 },
    { risk_level: 'Very High (80-100%)', count: 286, percentage: 4.2 }
  ]);

  const getMetricColor = (value: number, threshold: number = 0.9) => {
    if (value >= threshold) return 'text-green-600';
    if (value >= threshold - 0.1) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getMetricBgColor = (value: number, threshold: number = 0.9) => {
    if (value >= threshold) return 'bg-green-100 border-green-200';
    if (value >= threshold - 0.1) return 'bg-yellow-100 border-yellow-200';
    return 'bg-red-100 border-red-200';
  };

  const confusionMatrixData = [
    { predicted: 'No Churn', actual: 'No Churn', value: currentMetrics.confusion_matrix.true_negative, type: 'TN' },
    { predicted: 'No Churn', actual: 'Churn', value: currentMetrics.confusion_matrix.false_negative, type: 'FN' },
    { predicted: 'Churn', actual: 'No Churn', value: currentMetrics.confusion_matrix.false_positive, type: 'FP' },
    { predicted: 'Churn', actual: 'Churn', value: currentMetrics.confusion_matrix.true_positive, type: 'TP' }
  ];

  const MetricCard: React.FC<{
    title: string;
    value: number;
    format?: 'percentage' | 'decimal';
    threshold?: number;
    trend?: number;
    description: string;
  }> = ({ title, value, format = 'percentage', threshold = 0.9, trend, description }) => {
    const displayValue = format === 'percentage' ? `${(value * 100).toFixed(1)}%` : value.toFixed(3);
    const trendDisplay = trend ? (trend > 0 ? `+${(trend * 100).toFixed(1)}%` : `${(trend * 100).toFixed(1)}%`) : null;

    return (
      <div className={`p-6 rounded-xl border-2 ${getMetricBgColor(value, threshold)} transition-all duration-200 hover:shadow-lg`}>
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
          {trend && (
            <span className={`text-sm font-medium px-2 py-1 rounded-full ${
              trend > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
            }`}>
              {trendDisplay}
            </span>
          )}
        </div>
        <div className={`text-3xl font-bold ${getMetricColor(value, threshold)} mb-1`}>
          {displayValue}
        </div>
        <p className="text-sm text-gray-600">{description}</p>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-100">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">
            📊 Model Performance Dashboard
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Comprehensive analytics and monitoring for your churn prediction model
          </p>
        </div>

        {/* Time Range Selector */}
        <div className="flex justify-center mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-1">
            {(['7d', '30d', '90d', '1y'] as const).map((range) => (
              <button
                key={range}
                onClick={() => setSelectedTimeRange(range)}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                  selectedTimeRange === range
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                {range === '7d' && 'Last 7 Days'}
                {range === '30d' && 'Last 30 Days'}
                {range === '90d' && 'Last 90 Days'}
                {range === '1y' && 'Last Year'}
              </button>
            ))}
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex justify-center mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-1">
            {[
              { key: 'overview', label: '📈 Overview', icon: '📈' },
              { key: 'metrics', label: '📊 Metrics', icon: '📊' },
              { key: 'confusion', label: '🎯 Confusion Matrix', icon: '🎯' },
              { key: 'trends', label: '📉 Trends', icon: '📉' },
              { key: 'distribution', label: '🔍 Distribution', icon: '🔍' }
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as any)}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                  activeTab === tab.key
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Key Metrics Overview */}
            <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-6">
              <MetricCard
                title="Accuracy"
                value={currentMetrics.accuracy}
                threshold={0.95}
                trend={0.002}
                description="Overall prediction correctness"
              />
              <MetricCard
                title="Precision"
                value={currentMetrics.precision}
                threshold={0.90}
                trend={0.005}
                description="True positives / (TP + FP)"
              />
              <MetricCard
                title="Recall"
                value={currentMetrics.recall}
                threshold={0.85}
                trend={0.003}
                description="True positives / (TP + FN)"
              />
              <MetricCard
                title="F1 Score"
                value={currentMetrics.f1_score}
                threshold={0.88}
                trend={0.003}
                description="Harmonic mean of precision and recall"
              />
              <MetricCard
                title="AUC-ROC"
                value={currentMetrics.auc_roc}
                threshold={0.95}
                trend={0.001}
                description="Area under ROC curve"
              />
            </div>

            {/* Model Health Status */}
            <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <span className="mr-3">🏥</span>
                Model Health Status
              </h2>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="bg-green-50 border-2 border-green-200 rounded-xl p-6 text-center">
                  <div className="text-4xl mb-2">✅</div>
                  <h3 className="text-lg font-semibold text-green-800 mb-1">Excellent Performance</h3>
                  <p className="text-sm text-green-600">All metrics above target thresholds</p>
                </div>
                <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-6 text-center">
                  <div className="text-4xl mb-2">📈</div>
                  <h3 className="text-lg font-semibold text-blue-800 mb-1">Stable Trends</h3>
                  <p className="text-sm text-blue-600">Performance improving over time</p>
                </div>
                <div className="bg-purple-50 border-2 border-purple-200 rounded-xl p-6 text-center">
                  <div className="text-4xl mb-2">🎯</div>
                  <h3 className="text-lg font-semibold text-purple-800 mb-1">Data Quality</h3>
                  <p className="text-sm text-purple-600">No drift detected in recent data</p>
                </div>
              </div>
            </div>

            {/* Quick Statistics */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-800">Total Predictions</h3>
                  <span className="text-2xl">🔮</span>
                </div>
                <div className="text-3xl font-bold text-blue-600 mb-1">6,862</div>
                <p className="text-sm text-gray-600">This month</p>
              </div>
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-800">High Risk Customers</h3>
                  <span className="text-2xl">⚠️</span>
                </div>
                <div className="text-3xl font-bold text-red-600 mb-1">853</div>
                <p className="text-sm text-gray-600">Requiring attention</p>
              </div>
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-800">Model Uptime</h3>
                  <span className="text-2xl">⏱️</span>
                </div>
                <div className="text-3xl font-bold text-green-600 mb-1">99.9%</div>
                <p className="text-sm text-gray-600">Last 30 days</p>
              </div>
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-800">Avg Response Time</h3>
                  <span className="text-2xl">⚡</span>
                </div>
                <div className="text-3xl font-bold text-blue-600 mb-1">124ms</div>
                <p className="text-sm text-gray-600">API response time</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'metrics' && (
          <div className="space-y-8">
            {/* Detailed Metrics */}
            <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Detailed Performance Metrics</h2>
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Core Metrics</h3>
                  <div className="space-y-4">
                    {[
                      { name: 'Accuracy', value: currentMetrics.accuracy, benchmark: 0.95 },
                      { name: 'Precision', value: currentMetrics.precision, benchmark: 0.90 },
                      { name: 'Recall', value: currentMetrics.recall, benchmark: 0.85 },
                      { name: 'F1 Score', value: currentMetrics.f1_score, benchmark: 0.88 },
                      { name: 'AUC-ROC', value: currentMetrics.auc_roc, benchmark: 0.95 }
                    ].map((metric) => (
                      <div key={metric.name} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <span className="font-medium text-gray-700">{metric.name}</span>
                        <div className="flex items-center space-x-4">
                          <div className="w-32 bg-gray-200 rounded-full h-2">
                            <div 
                              className={`h-2 rounded-full ${
                                metric.value >= metric.benchmark ? 'bg-green-500' : 'bg-yellow-500'
                              }`}
                              style={{ width: `${metric.value * 100}%` }}
                            ></div>
                          </div>
                          <span className={`font-bold ${getMetricColor(metric.value, metric.benchmark)}`}>
                            {(metric.value * 100).toFixed(1)}%
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Business Impact</h3>
                  <div className="space-y-4">
                    <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-blue-800">Customers Saved</span>
                        <span className="text-2xl font-bold text-blue-600">1,247</span>
                      </div>
                      <p className="text-sm text-blue-600">Through early intervention this month</p>
                    </div>
                    <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-green-800">Revenue Retained</span>
                        <span className="text-2xl font-bold text-green-600">$2.1M</span>
                      </div>
                      <p className="text-sm text-green-600">Estimated value of prevented churn</p>
                    </div>
                    <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-purple-800">Intervention Success</span>
                        <span className="text-2xl font-bold text-purple-600">73.2%</span>
                      </div>
                      <p className="text-sm text-purple-600">Rate of successful retention campaigns</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'confusion' && (
          <div className="space-y-8">
            <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Confusion Matrix Analysis</h2>
              
              <div className="grid lg:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Confusion Matrix</h3>
                  <div className="bg-gray-50 p-6 rounded-xl">
                    <div className="grid grid-cols-3 gap-2 text-center">
                      <div></div>
                      <div className="font-semibold text-gray-700 py-2">Predicted No Churn</div>
                      <div className="font-semibold text-gray-700 py-2">Predicted Churn</div>
                      
                      <div className="font-semibold text-gray-700 py-2 text-right">Actual No Churn</div>
                      <div className="bg-green-100 border-2 border-green-300 p-4 rounded-lg">
                        <div className="text-2xl font-bold text-green-700">{currentMetrics.confusion_matrix.true_negative}</div>
                        <div className="text-xs text-green-600">True Negative</div>
                      </div>
                      <div className="bg-red-100 border-2 border-red-300 p-4 rounded-lg">
                        <div className="text-2xl font-bold text-red-700">{currentMetrics.confusion_matrix.false_positive}</div>
                        <div className="text-xs text-red-600">False Positive</div>
                      </div>
                      
                      <div className="font-semibold text-gray-700 py-2 text-right">Actual Churn</div>
                      <div className="bg-red-100 border-2 border-red-300 p-4 rounded-lg">
                        <div className="text-2xl font-bold text-red-700">{currentMetrics.confusion_matrix.false_negative}</div>
                        <div className="text-xs text-red-600">False Negative</div>
                      </div>
                      <div className="bg-green-100 border-2 border-green-300 p-4 rounded-lg">
                        <div className="text-2xl font-bold text-green-700">{currentMetrics.confusion_matrix.true_positive}</div>
                        <div className="text-xs text-green-600">True Positive</div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Interpretation</h3>
                  <div className="space-y-4">
                    <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                      <h4 className="font-semibold text-green-800 mb-2">✅ Correct Predictions</h4>
                      <p className="text-sm text-green-700 mb-2">
                        <strong>{currentMetrics.confusion_matrix.true_negative + currentMetrics.confusion_matrix.true_positive}</strong> total correct predictions
                      </p>
                      <p className="text-xs text-green-600">
                        Model correctly identified both churning and non-churning customers
                      </p>
                    </div>
                    
                    <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                      <h4 className="font-semibold text-yellow-800 mb-2">⚠️ False Positives</h4>
                      <p className="text-sm text-yellow-700 mb-2">
                        <strong>{currentMetrics.confusion_matrix.false_positive}</strong> customers incorrectly flagged as churn risk
                      </p>
                      <p className="text-xs text-yellow-600">
                        May result in unnecessary retention spending
                      </p>
                    </div>
                    
                    <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                      <h4 className="font-semibold text-red-800 mb-2">❌ False Negatives</h4>
                      <p className="text-sm text-red-700 mb-2">
                        <strong>{currentMetrics.confusion_matrix.false_negative}</strong> churning customers missed
                      </p>
                      <p className="text-xs text-red-600">
                        Missed opportunities for retention intervention
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'trends' && (
          <div className="space-y-8">
            <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Performance Trends Over Time</h2>
              
              <div className="h-96 mb-8">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={performanceHistory}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis 
                      dataKey="date" 
                      tick={{ fontSize: 12, fill: '#6b7280' }}
                      tickFormatter={(value) => new Date(value).toLocaleDateString()}
                    />
                    <YAxis 
                      domain={[0.85, 1.0]}
                      tick={{ fontSize: 12, fill: '#6b7280' }}
                      tickFormatter={(value) => `${(value * 100).toFixed(0)}%`}
                    />
                    <Tooltip 
                      formatter={(value: any, name) => [`${(value * 100).toFixed(1)}%`, name]}
                      labelFormatter={(value) => `Date: ${new Date(value).toLocaleDateString()}`}
                    />
                    <Line type="monotone" dataKey="accuracy" stroke="#3b82f6" strokeWidth={3} name="Accuracy" />
                    <Line type="monotone" dataKey="precision" stroke="#ef4444" strokeWidth={3} name="Precision" />
                    <Line type="monotone" dataKey="recall" stroke="#10b981" strokeWidth={3} name="Recall" />
                    <Line type="monotone" dataKey="f1_score" stroke="#f59e0b" strokeWidth={3} name="F1 Score" />
                    <Line type="monotone" dataKey="auc_roc" stroke="#8b5cf6" strokeWidth={3} name="AUC-ROC" />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Feature Importance Changes</h3>
                  <div className="space-y-3">
                    {featureImportance.map((feature, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex-1">
                          <span className="font-medium text-gray-700">{feature.feature}</span>
                          <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                            <div 
                              className="bg-blue-500 h-2 rounded-full"
                              style={{ width: `${feature.importance * 100}%` }}
                            ></div>
                          </div>
                        </div>
                        <div className="ml-4 text-right">
                          <span className="font-bold text-gray-900">{(feature.importance * 100).toFixed(1)}%</span>
                          <div className={`text-xs font-medium ${feature.change > 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {feature.change > 0 ? '+' : ''}{(feature.change * 100).toFixed(1)}%
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Prediction Volume</h3>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={performanceHistory}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis 
                          dataKey="date"
                          tickFormatter={(value) => new Date(value).toLocaleDateString()}
                        />
                        <YAxis />
                        <Tooltip 
                          formatter={(value) => [value, 'Predictions Made']}
                          labelFormatter={(value) => `Date: ${new Date(value).toLocaleDateString()}`}
                        />
                        <Area 
                          type="monotone" 
                          dataKey="predictions_made" 
                          stroke="#3b82f6" 
                          fill="#3b82f6" 
                          fillOpacity={0.3}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'distribution' && (
          <div className="space-y-8">
            <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Prediction Distribution Analysis</h2>
              
              <div className="grid lg:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Risk Level Distribution</h3>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={predictionDistribution}
                          cx="50%"
                          cy="50%"
                          outerRadius={120}
                          dataKey="count"
                          label={({ risk_level, percentage }) => `${percentage}%`}
                        >
                          {predictionDistribution.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={[
                              '#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#7c2d12'
                            ][index]} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value, name) => [value, 'Customers']} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Distribution Details</h3>
                  <div className="space-y-4">
                    {predictionDistribution.map((item, index) => (
                      <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div 
                            className="w-4 h-4 rounded-full"
                            style={{ backgroundColor: ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#7c2d12'][index] }}
                          ></div>
                          <span className="font-medium text-gray-700">{item.risk_level}</span>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-gray-900">{item.count.toLocaleString()}</div>
                          <div className="text-sm text-gray-600">{item.percentage.toFixed(1)}%</div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <h4 className="font-semibold text-blue-800 mb-2">📊 Distribution Insights</h4>
                    <ul className="text-sm text-blue-700 space-y-1">
                      <li>• 74.5% of customers are in low-risk categories</li>
                      <li>• 12.5% require immediate attention (high/very high risk)</li>
                      <li>• Distribution is healthy with most customers retained</li>
                      <li>• Focus retention efforts on the 853 high-risk customers</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ModelPerformancePage;
