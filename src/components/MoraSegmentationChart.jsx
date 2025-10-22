import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const MoraSegmentationChart = () => {
  const data = [
    { name: 'Al día', cantidad: 12, monto: 45000, color: '#10B981' },
    { name: '1-30 días', cantidad: 35, monto: 125000, color: '#22C55E' },
    { name: '31-60 días', cantidad: 28, monto: 98000, color: '#F59E0B' },
    { name: '61-90 días', cantidad: 18, monto: 67000, color: '#F97316' },
    { name: '91-180 días', cantidad: 12, monto: 45000, color: '#EF4444' },
    { name: '181-365 días', cantidad: 8, monto: 32000, color: '#DC2626' },
    { name: '365+ días', cantidad: 5, monto: 18000, color: '#991B1B' }
  ];

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-gray-900">Segmentación de Mora por Días</h3>
      
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="name" tick={{ fontSize: 12 }} stroke="#6b7280" />
            <YAxis tick={{ fontSize: 12 }} stroke="#6b7280" />
            <Tooltip />
            <Bar dataKey="cantidad" radius={[4, 4, 0, 0]}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {data.map((item, index) => (
          <div key={index} className="flex items-center space-x-2">
            <div className="w-4 h-4 rounded" style={{ backgroundColor: item.color }}></div>
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