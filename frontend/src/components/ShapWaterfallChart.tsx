import React from 'react';
import { ComposedChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, Cell } from 'recharts';

interface ShapFeature {
  feature: string;
  impact: number;
  direction: string;
  abs_impact: number;
}

interface Props {
  shapData: ShapFeature[];
  baseValue?: number;
  title?: string;
}

const ShapWaterfallChart: React.FC<Props> = ({ 
  shapData, 
  baseValue = 0.0, 
  title = "SHAP Waterfall Chart" 
}) => {
  // Prepare data for waterfall chart
  const waterfallData = shapData.slice(0, 10).map((item, index) => {
    const cumulativeSum = baseValue + shapData.slice(0, index + 1).reduce((sum, curr) => sum + curr.impact, 0);
    return {
      ...item,
      cumulative: cumulativeSum,
      start: index === 0 ? baseValue : baseValue + shapData.slice(0, index).reduce((sum, curr) => sum + curr.impact, 0)
    };
  });

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 border border-gray-300 rounded shadow-lg">
          <p className="font-semibold text-gray-800">{data.feature}</p>
          <p className={`text-sm ${data.impact > 0 ? 'text-red-600' : 'text-blue-600'}`}>
            SHAP Value: {data.impact > 0 ? '+' : ''}{data.impact.toFixed(4)}
          </p>
          <p className="text-xs text-gray-600">Cumulative: {data.cumulative.toFixed(4)}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">{title}</h3>
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <ResponsiveContainer width="100%" height={400}>
          <ComposedChart
            data={waterfallData}
            margin={{ top: 20, right: 30, left: 20, bottom: 80 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="feature" 
              angle={-45} 
              textAnchor="end" 
              height={100}
              fontSize={11}
            />
            <YAxis tickFormatter={(value) => value.toFixed(3)} />
            <Tooltip content={<CustomTooltip />} />
            <ReferenceLine y={baseValue} stroke="#666" strokeDasharray="5 5" />
            {/* ✅ Corrected Bar component with Cell mapping */}
            <Bar dataKey="impact" radius={[2, 2, 0, 0]}>
              {waterfallData.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={entry.impact > 0 ? '#dc2626' : '#2563eb'} 
                />
              ))}
            </Bar>
          </ComposedChart>
        </ResponsiveContainer>
        
        <div className="mt-4 text-center text-sm text-gray-600">
          <p>Waterfall showing cumulative SHAP contributions to final prediction</p>
        </div>
      </div>
    </div>
  );
};

export default ShapWaterfallChart;
