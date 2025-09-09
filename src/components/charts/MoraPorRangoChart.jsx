import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const MoraPorRangoChart = () => {
  const data = [
    { rango: '0-30 días', cantidad: 45, monto: 125000 },
    { rango: '31-60 días', cantidad: 28, monto: 89000 },
    { rango: '61-90 días', cantidad: 15, monto: 67000 },
    { rango: '91-120 días', cantidad: 8, monto: 45000 },
    { rango: '120+ días', cantidad: 12, monto: 78000 }
  ];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-medium text-gray-900">{label}</p>
          <p className="text-blue-600">
            <span className="font-medium">Clientes:</span> {payload[0]?.value || 0}
          </p>
          <p className="text-green-600">
            <span className="font-medium">Monto:</span> ${(payload[1]?.value || 0).toLocaleString()}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full h-80">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
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
            dataKey="rango" 
            tick={{ fontSize: 12 }}
            stroke="#6b7280"
          />
          <YAxis 
            yAxisId="left"
            tick={{ fontSize: 12 }}
            stroke="#6b7280"
          />
          <YAxis 
            yAxisId="right"
            orientation="right"
            tick={{ fontSize: 12 }}
            stroke="#6b7280"
          />
          <Tooltip content={<CustomTooltip />} />
          <Bar 
            yAxisId="left"
            dataKey="cantidad" 
            fill="#3b82f6" 
            radius={[4, 4, 0, 0]}
            name="Clientes"
          />
          <Bar 
            yAxisId="right"
            dataKey="monto" 
            fill="#10b981" 
            radius={[4, 4, 0, 0]}
            name="Monto"
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default MoraPorRangoChart;
