import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const MoraSegmentationChart = ({ data = [] }) => {
  // Datos por defecto si no se proporcionan
  const defaultData = [
    {
      name: '0-30 días',
      cantidad: 45,
      monto: 125000,
      color: '#10B981'
    },
    {
      name: '31-60 días',
      cantidad: 28,
      monto: 89000,
      color: '#F59E0B'
    },
    {
      name: '61-90 días',
      cantidad: 15,
      monto: 45000,
      color: '#EF4444'
    },
    {
      name: '91+ días',
      cantidad: 8,
      monto: 32000,
      color: '#DC2626'
    }
  ];

  const chartData = data.length > 0 ? data : defaultData;

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-medium text-gray-900">{label}</p>
          <p className="text-sm text-gray-600">
            <span className="font-medium">Clientes:</span> {payload[0]?.value || 0}
          </p>
          <p className="text-sm text-gray-600">
            <span className="font-medium">Monto:</span> ${(payload[1]?.value || 0).toLocaleString()}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium text-gray-900">Segmentación de Mora por Días</h3>
        <div className="text-sm text-gray-500">
          Total: {chartData.reduce((sum, item) => sum + item.cantidad, 0)} clientes
        </div>
      </div>
      
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{
              top: 20,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis 
              dataKey="name" 
              tick={{ fontSize: 12 }}
              stroke="#6b7280"
            />
            <YAxis 
              tick={{ fontSize: 12 }}
              stroke="#6b7280"
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="cantidad" radius={[4, 4, 0, 0]}>
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Leyenda */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {chartData.map((item, index) => (
          <div key={index} className="flex items-center space-x-2">
            <div 
              className="w-4 h-4 rounded"
              style={{ backgroundColor: item.color }}
            ></div>
            <div className="text-sm">
              <div className="font-medium text-gray-900">{item.name}</div>
              <div className="text-gray-600">{item.cantidad} clientes</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MoraSegmentationChart;
