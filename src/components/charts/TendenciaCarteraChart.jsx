import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';

const TendenciaCarteraChart = () => {
  const data = [
    { mes: 'Ene', cartera: 2400000, mora: 85000 },
    { mes: 'Feb', cartera: 2450000, mora: 92000 },
    { mes: 'Mar', cartera: 2520000, mora: 78000 },
    { mes: 'Abr', cartera: 2580000, mora: 105000 },
    { mes: 'May', cartera: 2650000, mora: 88000 },
    { mes: 'Jun', cartera: 2700000, mora: 95000 }
  ];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const carteraTotal = payload[0]?.value || 0;
      const carteraMora = payload[1]?.value || 0;
      const porcentajeMora = carteraTotal > 0 ? ((carteraMora / carteraTotal) * 100).toFixed(2) : 0;
      
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-medium text-gray-900 mb-2">{label}</p>
          <p className="text-blue-600">
            <span className="font-medium">Cartera Total:</span> ${carteraTotal.toLocaleString()}
          </p>
          <p className="text-red-600">
            <span className="font-medium">Cartera en Mora:</span> ${carteraMora.toLocaleString()}
          </p>
          <p className="text-gray-600">
            <span className="font-medium">% Mora:</span> {porcentajeMora}%
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full h-80">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis 
            dataKey="mes" 
            tick={{ fontSize: 12 }}
            stroke="#6b7280"
          />
          <YAxis 
            tick={{ fontSize: 12 }}
            stroke="#6b7280"
          />
          <Tooltip content={<CustomTooltip />} />
          <Area
            type="monotone"
            dataKey="cartera"
            stackId="1"
            stroke="#3b82f6"
            fill="#3b82f6"
            fillOpacity={0.6}
          />
          <Area
            type="monotone"
            dataKey="mora"
            stackId="2"
            stroke="#ef4444"
            fill="#ef4444"
            fillOpacity={0.8}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TendenciaCarteraChart;
