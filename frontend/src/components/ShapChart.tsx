import React, { useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, CartesianGrid, Tooltip } from 'recharts';

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
  // Log incoming data for debugging
  console.log('ShapData in Chart:', shapData);
  console.log('Impact types:', shapData.map(item => typeof item.impact));

  // Scale impact values for visibility and prepare display data
  const topFeatures = shapData.slice(0, 10).map(item => ({
    ...item,
    displayImpact: Number(item.impact) * 1000, // Scale by 1000 for visibility
    fill: item.impact > 0 ? '#ff4d4f' : '#1890ff', // Add color based on impact
  }));

  // Log transformed data
  console.log('Top Features:', topFeatures);

  // Check rendering
  useEffect(() => {
    console.log('Chart mounted, SVG:', document.querySelector('.recharts-wrapper svg'));
  }, []);

  if (!topFeatures.length) {
    return <div className="text-red-500">No data available for chart.</div>;
  }

  return (
    <div className="chart-container h-auto min-h-[400px] border-2 border-green-500 p-4">
      <h3 className="text-xl font-bold text-gray-900 mb-4">{title}</h3>
      <div className="w-full h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={topFeatures} layout="horizontal">
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              type="number"
              tick={{ fontSize: 12 }}
              tickFormatter={(value) => (value / 1000).toFixed(3)} // Show original scale
              domain={['auto', 'auto']}
            />
            <YAxis
              dataKey="feature"
              type="category"
              tick={{ fontSize: 12 }}
              width={150} // Space for feature names
            />
            <Tooltip
              formatter={(value: number, name: string, props) => [
                (value / 1000).toFixed(3), // Show original scale in tooltip
                props.payload.feature,      // Show feature name
              ]}
              labelFormatter={() => ''}     // Hide label for cleaner tooltip
            />
            <Bar
              dataKey="displayImpact"
              fill="#8884d8" // Default color (overridden by data)
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="text-sm text-gray-600 mt-2">
        Debug: Chart rendered with {topFeatures.length} features.
      </div>
    </div>
  );
};

export default ShapChart;
