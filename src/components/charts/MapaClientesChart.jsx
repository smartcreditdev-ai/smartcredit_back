import React from 'react';
import { ComposedChart, Line, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const MapaClientesChart = () => {
  const data = [
    { region: 'Centro', clientes: 1250, cartera: 2500000, crecimiento: 8.5 },
    { region: 'Norte', clientes: 890, cartera: 1800000, crecimiento: 12.3 },
    { region: 'Sur', clientes: 650, cartera: 1200000, crecimiento: 5.7 },
    { region: 'Este', clientes: 420, cartera: 850000, crecimiento: 15.2 },
    { region: 'Oeste', clientes: 380, cartera: 750000, crecimiento: 9.8 }
  ];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-medium text-gray-900 mb-2">{label}</p>
          <p className="text-blue-600">
            <span className="font-medium">Clientes:</span> {(payload[0]?.value || 0).toLocaleString()}
          </p>
          <p className="text-green-600">
            <span className="font-medium">Cartera:</span> ${(payload[1]?.value || 0).toLocaleString()}
          </p>
          <p className="text-purple-600">
            <span className="font-medium">Crecimiento:</span> {payload[2]?.value || 0}%
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full h-80">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart
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
            dataKey="region" 
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
          <Area
            yAxisId="left"
            type="monotone"
            dataKey="clientes"
            fill="#3b82f6"
            fillOpacity={0.3}
            stroke="#3b82f6"
            strokeWidth={2}
          />
          <Line
            yAxisId="right"
            type="monotone"
            dataKey="cartera"
            stroke="#10b981"
            strokeWidth={3}
            dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
};

export default MapaClientesChart;
