import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

const DistribucionCarteraChart = () => {
  const data = [
    { name: 'Personal', value: 45, amount: 1250000, color: '#3b82f6' },
    { name: 'Automotriz', value: 25, amount: 890000, color: '#10b981' },
    { name: 'Hipotecario', value: 20, amount: 2100000, color: '#f59e0b' },
    { name: 'Comercial', value: 10, amount: 450000, color: '#ef4444' }
  ];

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-medium text-gray-900">{data.name}</p>
          <p className="text-gray-600">
            <span className="font-medium">Porcentaje:</span> {data.value}%
          </p>
          <p className="text-gray-600">
            <span className="font-medium">Monto:</span> ${data.amount.toLocaleString()}
          </p>
        </div>
      );
    }
    return null;
  };

  const CustomLegend = ({ payload }) => {
    return (
      <div className="flex flex-wrap justify-center gap-4 mt-4">
        {payload.map((entry, index) => (
          <div key={index} className="flex items-center space-x-2">
            <div 
              className="w-3 h-3 rounded-full" 
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-sm text-gray-600">{entry.value}</span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="w-full h-80">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, value }) => `${name}: ${value}%`}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend content={<CustomLegend />} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default DistribucionCarteraChart;
