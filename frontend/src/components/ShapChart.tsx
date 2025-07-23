import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface ShapFeature {
  feature: string;
  impact: number;
  direction: string;
  abs_impact: number;
}

interface Props {
  shapData: ShapFeature[];
  title?: string;
}

const ShapChart: React.FC<Props> = ({ shapData, title = "SHAP Feature Importance" }) => {
  // Take top 12 features and ensure minimum bar size
  const topFeatures = shapData.slice(0, 12).map(item => ({
    ...item,
    // Ensure minimum visible impact for very small values
    displayImpact: Math.abs(item.impact) < 0.001 ? (item.impact >= 0 ? 0.001 : -0.001) : item.impact
  }));

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-gray-900 text-white p-4 rounded-lg shadow-2xl border-0 max-w-xs">
          <p className="font-bold text-white mb-2">{data.feature}</p>
          <p className={`text-sm font-semibold mb-1 ${data.impact > 0 ? 'text-red-300' : 'text-blue-300'}`}>
            SHAP Value: {data.impact > 0 ? '+' : ''}{data.impact.toFixed(4)}
          </p>
          <p className="text-xs text-gray-300">{data.direction}</p>
        </div>
      );
    }
    return null;
  };

  const getBarColor = (impact: number) => {
    return impact > 0 ? '#ef4444' : '#3b82f6'; // Bright red/blue
  };

  // Calculate chart height based on number of features
  const chartHeight = Math.max(400, topFeatures.length * 35);

  return (
    <div className="w-full bg-white rounded-2xl shadow-lg border border-gray-200 p-6 mb-6">
      <div className="mb-6">
        <h3 className="text-2xl font-bold text-gray-900 mb-3">{title}</h3>
        <div className="flex items-center space-x-8 text-sm mb-4">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-red-500 rounded-sm"></div>
            <span className="text-gray-700 font-medium">Increases Churn Risk</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-blue-500 rounded-sm"></div>
            <span className="text-gray-700 font-medium">Decreases Churn Risk</span>
          </div>
        </div>
      </div>

      <div style={{ height: `${chartHeight}px` }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={topFeatures}
            layout="horizontal"
            margin={{ top: 20, right: 50, left: 200, bottom: 20 }}
          >
            <CartesianGrid 
              strokeDasharray="2 2" 
              stroke="#e5e7eb" 
              horizontal={true} 
              vertical={true}
            />
            <XAxis 
              type="number" 
              axisLine={true}
              tickLine={true}
              tick={{ fontSize: 12, fill: '#6b7280', fontWeight: 500 }}
              tickFormatter={(value) => value.toFixed(3)}
              stroke="#9ca3af"
            />
            <YAxis 
              dataKey="feature" 
              type="category" 
              axisLine={true}
              tickLine={true}
              tick={{ fontSize: 12, fill: '#374151', fontWeight: 600 }}
              width={190}
              stroke="#9ca3af"
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: '#f3f4f6', opacity: 0.3 }} />
            <Bar 
              dataKey="displayImpact"
              radius={[3, 3, 3, 3]}
              stroke="#ffffff"
              strokeWidth={1}
              minPointSize={3}  // Ensures minimum bar size
            >
              {topFeatures.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={getBarColor(entry.impact)}
                  opacity={0.9}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Enhanced data table below chart */}
      <div className="mt-6 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="text-left py-3 px-4 font-semibold text-gray-700">Feature</th>
              <th className="text-center py-3 px-4 font-semibold text-gray-700">SHAP Value</th>
              <th className="text-center py-3 px-4 font-semibold text-gray-700">Impact</th>
            </tr>
          </thead>
          <tbody>
            {topFeatures.slice(0, 8).map((feature, index) => (
              <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="py-3 px-4 font-medium text-gray-800">{feature.feature}</td>
                <td className="py-3 px-4 text-center">
                  <span className={`font-bold ${feature.impact > 0 ? 'text-red-600' : 'text-blue-600'}`}>
                    {feature.impact > 0 ? '+' : ''}{feature.impact.toFixed(4)}
                  </span>
                </td>
                <td className="py-3 px-4 text-center">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    feature.impact > 0 
                      ? 'bg-red-100 text-red-800 border border-red-200' 
                      : 'bg-blue-100 text-blue-800 border border-blue-200'
                  }`}>
                    {feature.impact > 0 ? 'Risk +' : 'Retention +'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ShapChart;
